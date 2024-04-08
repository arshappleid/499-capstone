const e = require('express');
const {
	Student,
	GroupMembersTable,
	CourseGroupEvaluation,
	Course,
	Instructor,
	InstructorCourse,
	StudentCourse,
} = require('../database/index');

async function addGroupsToCourseService(instructorId, courseId, groups) {
	try {
		if (instructorId === '') {
			return {
				status: 'error',
				message: 'instructor id not found',
				data: null,
			};
		}
		const validInstructorId = await verifyInstructorId(instructorId);
		if (!validInstructorId) {
			return {
				status: 'error',
				message: 'Invalid Instructor Id provided',
				data: null,
			};
		}

		const instructorTeachesThisCourse =
			await verifyInstructorTeachesThisCourse(instructorId, courseId);
		if (!instructorTeachesThisCourse) {
			return {
				status: 'error',
				message: 'Instructor Does not teach This course',
				data: null,
			};
		}

		if (courseId === '') {
			return {
				status: 'error',
				message: 'course id not found',
				data: null,
			};
		}

		const courseExists = await verifyCourseIdInCourseGroupEvaluation(
			courseId
		);
		if (courseExists === false) {
			return {
				status: 'error',
				message: 'course id not found',
				data: null,
			};
		}

		let allAdded = true;
		try {
			const queryResult = [];
			for (let i = 0; i < groups.length; i++) {
				const group = groups[i];

				if (!courseExists) {
					// Create a new group , with the name  , and course ID
					const added = await addToCourseGroupEvaluation(
						group.group_name,
						courseId
					);
					if (!added) {
						const result = {
							group_name: group.group_name,
							status: 'Unable to register Group in Course_Group_Evaluation',
						};
						queryResult.push(result);
						continue;
					}
				}

				var groupId = await getGroupId(group.group_name, courseId);

				if (groupId.exists === false) {
					// Add the group , then add all the students.
					await addToCourseGroupEvaluation(
						group.group_name,
						courseId
					);
					groupId = await getGroupId(group.group_name, courseId);
				}

				// Now loop through every student , and add him to the group
				const studentsNotAdded = new Map(); // Students that have not been added
				let allStudentsAdded = true;
				let atleastOneStudentAdded = false;
				for (let j = 0; j < group.student_ids.length; j++) {
					const studentId = group.student_ids[j];
					if (studentId.trim() == '' || studentId === null) continue;

					const studentExists = await verifyStudentIdExistsInStudent(
						studentId
					);

					if (!studentExists) {
						studentsNotAdded.set(
							studentId,
							'Student Id not found, in registered students'
						);
						allStudentsAdded = false;
						allAdded = false;
						continue;
					}

					const studentEnrolledinCourse =
						await verifyStudentEnrolledInCourse(
							studentId,
							courseId
						);

					if (!studentEnrolledinCourse) {
						studentsNotAdded.set(
							studentId,
							'Student Not Enrolled in course.'
						);
						allStudentsAdded = false;
						allAdded = false;
						continue;
					}

					const studentDoesNotExistinSomeOtherGroup =
						await verifyStudentDoesNotExistinSomeOtherGroupinThisCourse(
							studentId,
							courseId
						);

					if (!studentDoesNotExistinSomeOtherGroup) {
						studentsNotAdded.set(
							studentId,
							'Student Exists in Some Other group for this course'
						);
						allAdded = false;
						allStudentsAdded = false;
						continue;
					}
					const resp = await addStudentToGroup(
						studentId,
						groupId.groupId + ''
					);

					if (resp.status === false) {
						// Create New Group , and Add the Student
						studentsNotAdded.set(studentId, resp.message);
						allAdded = false;
						allStudentsAdded = false;
					} else {
						atleastOneStudentAdded = true;
					}
				}
				if (
					groupId.exists === false &&
					atleastOneStudentAdded === false
				) {
					// Delete the group
					await GroupMembersTable.destroy({
						where: { GROUP_ID: groupId },
					});
				}
				const result = {
					group_name: group.group_name,
					all_students_added: allStudentsAdded, // Definition of success
					students_not_added: Array.from(
						studentsNotAdded,
						([student_id, status]) => ({
							student_id,
							status,
						})
					),
				};
				queryResult.push(result);
			}
			const queryStatus = allAdded ? 'success' : 'error';
			return { status: queryStatus, result: queryResult };
		} catch (error) {
			allAdded = false;
			console.log(
				'Error in addGroupsToCourseService adding students to group LOOP at addGroupsToCourseService : ' +
					error
			);
			return error;
		}
	} catch (error) {
		console.log('Error in addGroupsToCourseService : ' + error);
		return error;
	}
}
async function verifyStudentDoesNotExistinSomeOtherGroupinThisCourse(
	studentId,
	courseID
) {
	try {
		const resp = await GroupMembersTable.findOne({
			where: { STUDENT_ID: studentId },
			include: [
				{
					model: CourseGroupEvaluation,
					where: { COURSE_ID: courseID },
					required: true, // this is INNER JOIN
				},
			],
		});

		if (resp instanceof GroupMembersTable) {
			// student does exist in some other group
			return false;
		}

		// student does not exist in some other group
		return true;
	} catch (error) {
		console.log(
			'Error in addGroupsToCourseService at verifyStudentDoesNotExistinSomeOtherGroupinThisCourse : ' +
				error
		);
	}
}
async function verifyInstructorTeachesThisCourse(instructorId, courseId) {
	try {
		if (instructorId === '' || courseId === '') return false;

		const resp = await InstructorCourse.findOne({
			where: {
				INSTRUCTOR_ID: instructorId,
				COURSE_ID: courseId,
			},
		});
		if (resp instanceof InstructorCourse) return true;

		return false;
	} catch (error) {
		console.log(
			'Error in addGroupsToCourseService at verifyInstructorTeachesThisCourse : ' +
				error
		);
	}
}

async function verifyStudentEnrolledInCourse(studentID, courseID) {
	try {
		const resp = await StudentCourse.findOne({
			where: { STUDENT_ID: studentID, COURSE_ID: courseID },
		});
		if (resp instanceof StudentCourse) return true;
		return false;
	} catch (error) {
		console.log(
			'Error in addGroupsToCourseService at verifyStudentEnrolledInCourse : ' +
				error
		);
	}
}

async function addToCourseGroupEvaluation(group_name, course_id) {
	try {
		const resp = await verifyCourseIdInCourse(course_id);
		if (resp === false) {
			// Course_id does not exist.
			return false;
		}
		const result = await CourseGroupEvaluation.create({
			GROUP_NAME: group_name,
			COURSE_ID: course_id,
		});

		if (result === undefined || result === null || result.length === 0) {
			return false;
		}
		return true;
	} catch (error) {
		console.log(
			'Error in addGroupsToCourseService at addToCourseGroupEvaluation : ' +
				error
		);
	}
}

async function verifyCourseIdInCourse(course_id) {
	try {
		const resp = await Course.findAndCountAll({
			where: {
				COURSE_ID: course_id,
			},
		});

		if (resp === undefined || resp.count === 0) {
			return false;
		}

		return true;
	} catch (error) {}
}
async function verifyInstructorId(instructorId) {
	try {
		if (instructorId === '') return false;

		const resp = await Instructor.findOne({
			where: { INSTRUCTOR_ID: instructorId },
		});

		if (resp instanceof Instructor) return true;
		return false;
	} catch (e) {
		console.log(
			'Error occured in verifyInstructorId function in addGroupsToCourseService : ' +
				e
		);
	}
}

async function getGroupId(groupName, course_ID) {
	// Return the Group id using, group name . Return False if group does not exist.
	try {
		if (groupName) {
			groupName = groupName.trim();
		} else {
			return { exists: false, groupId: null };
		}
		const resp = await CourseGroupEvaluation.findOne({
			where: { GROUP_NAME: groupName, COURSE_ID: course_ID },
		});
		if (resp === undefined) {
			return { exists: false, groupId: null };
		}
		return { exists: true, groupId: resp.GROUP_ID };
	} catch (error) {
		console.log(
			'Error in getGroupId at addGroupsToCourseService : ' + error
		);
		return { exists: false, groupId: null };
	}
}

async function verifyCourseIdInCourseGroupEvaluation(courseId) {
	// Return boolean if courseId exists in Instructor Table
	try {
		const resp = await Course.findOne({ where: { COURSE_ID: courseId } });
		if (resp === undefined || resp === null) {
			return false;
		}
		return true;
	} catch (error) {
		console.log(
			'Error in verifyCourseIdInCourseGroupEvaluation at addGroupsToCourseService : ' +
				error
		);
		throw error;
	}
}

async function verifyGroupIdExistsInCourseGroupEvaluation(groupId) {
	// Return boolean if groupId exists in Course Group Evaluation Table
	try {
		const resp = await CourseGroupEvaluation.findOne({
			where: { GROUP_ID: groupId },
		});
		if (resp === undefined || resp === null || resp.length === 0) {
			return false;
		}
		return true;
	} catch (error) {
		console.log(
			'Error in verifyGroupIdExistsInCourseGroupEvaluation at addGroupsToCourseService : ' +
				error
		);
		throw error;
	}
}

async function verifyStudentIdExistsInStudent(studentId) {
	// Return true if studentID exists in Student Table
	// Else return false
	try {
		if (studentId === undefined || studentId === null || studentId === '') {
			return false;
		}
		const resp = await Student.findOne({
			where: { STUDENT_ID: studentId },
		});
		if (resp === undefined || resp === null || resp.length === 0) {
			return false;
		}
		if (resp instanceof Student) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(
			'Error in verifyStudentIdExistsInStudent at addGroupsToCourseService  : ' +
				error
		);
		throw error;
	}
}

async function addStudentToGroup(studentId, groupId) {
	// Add student to group , return true if added or already exist, else return false
	try {
		// Check to see If group id already exists in the Group Members Table
		if (!(await verifyStudentIdExistsInStudent(studentId))) {
			// Student Does not exists
			return {
				status: false,
				message: 'Student Id Does not exist in student.',
			};
		}
		if (!(await verifyGroupIdExistsInCourseGroupEvaluation(groupId))) {
			// Group Id does not exists
			return {
				status: false,
				message: 'Group Id Does not Exist in Course Group Evaluation.',
			};
		}
		if (groupId === undefined || groupId === null || groupId === '') {
			return { status: false, message: 'Invalid group Id' };
		}
		// if (!(await verifyGroupIdExistsinGroupMembersTable(groupId))) {
		// 	// Group Id does not exists , cannot add students
		// 	return {
		// 		status: false,
		// 		message: 'Group Id Does not exist in Group Members Table',
		// 	};
		// }

		// verify student already does not exist under the same group in the Group Members Table
		const studentExistsinGroup =
			await verifyStudentExistinGroupMembersTable(studentId, groupId);
		if (studentExistsinGroup) {
			// Student already exists in the group , cannot add again , but return true
			return {
				status: false,
				message:
					'Student already exists in the group , cannot add again',
			};
		}

		const exists = await GroupMembersTable.findAndCountAll({
			where: { STUDENT_ID: studentId, GROUP_ID: groupId },
		});

		if (exists.count >= 1) {
			return {
				status: true,
				message: 'Student Already Exists in an another Group',
			};
		}
		// Only add if not exists
		const resp = await GroupMembersTable.create({
			STUDENT_ID: studentId,
			GROUP_ID: groupId,
		});
		if (resp instanceof GroupMembersTable) {
			return { status: true, message: 'Successfully Added' };
		}

		// If already exists, or has been return true.
		return { status: false, message: 'DB Constraint problem' };
	} catch (error) {
		console.log(
			'Error in addStudentToGroup at addGroupsToCourseService : ' + error
		);
		throw error;
	}
}

async function verifyGroupIdExistsinGroupMembersTable(groupId) {
	try {
		if (groupId == undefined || groupId == null || groupId == '') {
			return false;
		}

		const resp = await GroupMembersTable.findOne({
			where: { GROUP_ID: groupId },
		});

		if (resp instanceof GroupMembersTable) {
			return true;
		}
		return false;
	} catch (e) {
		console.log(
			'Error in verifyGroupIdExistsinGroupMembersTable in addGroupsToCourseService : ' +
				e
		);
	}
}

async function verifyStudentExistinGroupMembersTable(studentId, groupId) {
	try {
		if (studentId == undefined || studentId == null || studentId == '') {
			return false;
		}

		const resp = await GroupMembersTable.findOne({
			where: { STUDENT_ID: studentId, GROUP_ID: groupId },
		});

		if (resp instanceof GroupMembersTable) {
			return true;
		}
		return false;
	} catch (e) {
		console.log(
			'Error in verifyStudentExistinGroupMembersTable in addGroupsToCourseService : ' +
				e
		);
	}
}

module.exports = {
	addGroupsToCourseService,
	addToCourseGroupEvaluation,
	verifyCourseIdInCourse,
	getGroupId,
	verifyCourseIdInCourseGroupEvaluation,
	verifyGroupIdExistsInCourseGroupEvaluation,
	verifyStudentIdExistsInStudent,
	addStudentToGroup,
	// verifyGroupIdExistsinGroupMembersTable,
	verifyStudentExistinGroupMembersTable,
	verifyInstructorId,
	verifyStudentDoesNotExistinSomeOtherGroupinThisCourse,
	verifyInstructorTeachesThisCourse,
	verifyStudentEnrolledInCourse,
};

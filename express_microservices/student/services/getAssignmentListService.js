// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	Student,
	Course,
	StudentCourse,
	CourseAssignment,
	AssignmentSubmission,
} = require('../database/index');

async function getAssignmentListService(student_id, course_id) {
	if (student_id === undefined || course_id === undefined) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (student_id === '' || course_id === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if student exists
		const student = await Student.findAll({
			where: {
				STUDENT_ID: student_id,
			},
		});
		if (student.length === 0) {
			return {
				status: 'error',
				message: 'Student does not exist',
			};
		}
		//Check if course exists
		const course = await Course.findAll({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (course.length === 0) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		//Check if student is enrolled in course
		const studentInCourse = await StudentCourse.findAll({
			where: {
				STUDENT_ID: student_id,
				COURSE_ID: course_id,
			},
		});
		if (studentInCourse.length === 0) {
			return {
				status: 'error',
				message: 'Student not enrolled in course',
			};
		}
		//Get all assignments in course
		let assignments = await CourseAssignment.findAll({
			where: {
				COURSE_ID: course_id,
				VISIBILITY: 1,
			},
		});

		let assignmentStatusList = [];

		//Loop through assignments and check if student has submitted
		for (let i = 0; i < assignments.length; i++) {
			const assignment_completed = await AssignmentSubmission.findAll({
				where: {
					STUDENT_ID: student_id,
					ASSIGNMENT_ID: assignments[i].ASSIGNMENT_ID,
				},
			});
			if (assignment_completed.length === 0) {
				assignmentStatusList.push(false);
			} else {
				assignmentStatusList.push(true);
			}
		}

		assignments = await reformatingDate(assignments, assignmentStatusList);

		return {
			status: 'success',
			assignments: assignments,
		};
	} catch (error) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getAssignmentListService.js: ' +
				error,
		};
	}
}

async function reformatingDate(assignments, assignmentStatusList) {
	let assignmentList = [];

	for (let i = 0; i < assignments.length; i++) {
		let assignment = {
			assignment_id: assignments[i].ASSIGNMENT_ID,
			assignment_name: assignments[i].ASSIGNMENT_NAME,
			assignment_description: assignments[i].ASSIGNMENT_DESCRIPTION,
			deadline: assignments[i].DEADLINE,
			avaliableFrom: assignments[i].AVAILABLE_FROM,
			avaliableTo: assignments[i].AVAILABLE_TO,
			submissionType: assignments[i].SUBMISSION_TYPE,
			shareFeedback: assignments[i].SHARE_FEEDBACK,
			assignment_completed: assignmentStatusList[i],
		};
		assignmentList.push(assignment);
	}
	return assignmentList;
}

module.exports = getAssignmentListService;

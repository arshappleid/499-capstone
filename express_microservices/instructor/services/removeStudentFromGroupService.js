// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const { GroupMembersTable } = require('../database/index');

const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfStudentExistService = require('../services/checkIfStudentExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');
const checkIfGroupBelongsToCourseService = require('../services/checkIfGroupBelongsToCourseService');

async function removeStudentFromGroupService(
	student_id,
	group_id,
	course_id,
	instructor_id
) {
	try {
		if (
			student_id === undefined ||
			group_id === undefined ||
			course_id === undefined ||
			instructor_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			student_id === '' ||
			group_id === '' ||
			course_id === '' ||
			instructor_id === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		const studentExist = await checkIfStudentExistService(student_id);
		if (studentExist.status === 'not exist') {
			return {
				status: 'error',
				message: 'Student does not exist',
			};
		}
		const instructorExist = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorExist.status === false) {
			return {
				status: 'error',
				message: 'Instructor does not exist',
			};
		}
		const courseExist = await checkIfCourseExistService(course_id);
		if (courseExist.status === false) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		const instructorTeachesCourse =
			await checkIfInstructorTeachesCourseService(
				instructor_id,
				course_id
			);
		if (instructorTeachesCourse.status === false) {
			return {
				status: 'error',
				message: 'Instructor does not teach this course',
			};
		}
		const groupBelongsToCourse = await checkIfGroupBelongsToCourseService(
			group_id,
			course_id
		);
		if (groupBelongsToCourse.status === false) {
			return {
				status: 'error',
				message:
					'Group is either not exist or does not belong to this course',
			};
		}

		const studentInGroup = await GroupMembersTable.findAll({
			where: { STUDENT_ID: student_id, GROUP_ID: group_id },
		});

		if (studentInGroup.length === 0) {
			return {
				status: 'error',
				message: 'Student is not in the group',
			};
		}

		const rowsDeleted = await GroupMembersTable.destroy({
			where: { STUDENT_ID: student_id, GROUP_ID: group_id },
		});

		if (rowsDeleted === 0) {
			return {
				status: 'error',
				message: 'Failed to delete student from group',
			};
		}
		if (rowsDeleted === 1) {
			return {
				status: 'success',
				message: 'Student deleted from group',
			};
		} else {
			return {
				status: 'error',
				message: 'Multiple rows deleted',
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = removeStudentFromGroupService;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	GroupMembersTable,
	CourseGroupEvaluation,
} = require('../database/index');

const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfGroupBelongsToCourseService = require('../services/checkIfGroupBelongsToCourseService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');

async function removeStudentsAndGroupsFromCourseService(
	course_id,
	group_id,
	instructor_id
) {
	try {
		if (
			course_id === undefined ||
			group_id === undefined ||
			instructor_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (course_id === '' || group_id === '' || instructor_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
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
		const groupBelongsToCourse = await checkIfGroupBelongsToCourseService(
			group_id,
			course_id
		);
		if (groupBelongsToCourse.status === false) {
			return {
				status: 'error',
				message:
					'Group does not exist or does not belong to this course',
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
		const groupMembers = await GroupMembersTable.findAll({
			where: { group_id: group_id },
		});

		let groupMemberStatus = [];
		let allStudentRemoved = true;

		for (let i = 0; i < groupMembers.length; i++) {
			try {
				await groupMembers[i].destroy();
				groupMemberStatus.push({
					student_id: groupMembers[i].STUDENT_ID,
					student_status: 'Student remove from group success',
				});
			} catch (e) {
				groupMemberStatus.push({
					student_id: groupMembers[i].STUDENT_ID,
					student_status: 'Student remove from group failed',
				});
				allStudentRemoved = false;
			}
		}
		if (allStudentRemoved === false) {
			return {
				status: 'error',
				message: 'Group Remove failed',
				groupMemberStatus: groupMemberStatus,
			};
		} else {
			try {
				await CourseGroupEvaluation.destroy({
					where: { group_id: group_id },
				});
			} catch (e) {
				return {
					status: 'error',
					message: 'Group Remove failed',
					groupMemberStatus: groupMemberStatus,
				};
			}
			return {
				status: 'success',
				message: 'Group Remove success',
				groupMemberStatus: groupMemberStatus,
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in removeStudentsAndGroupsFromCourseService.js: ' +
				e.message,
		};
	}
}

module.exports = removeStudentsAndGroupsFromCourseService;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	CourseGroupEvaluation,
	GroupMembersTable,
} = require('../database/index');

const checkIfInstructorIdExistService = require('./checkIfInstructorIdExistService');
const checkIfCourseExistService = require('./checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('./checkIfInstructorTeachesCourseService');

async function removeEmptyGroupService(instructor_id, course_id, group_id) {
	try {
		if (
			instructor_id === undefined ||
			course_id === undefined ||
			group_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '' || course_id === '' || group_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		const instructorIdExists = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorIdExists.status === false) {
			return {
				status: 'error',
				message: 'Instructor id does not exist',
			};
		}
		const courseIdExists = await checkIfCourseExistService(course_id);
		if (courseIdExists.status === false) {
			return {
				status: 'error',
				message: 'Course id does not exist',
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
		const groupExists = await CourseGroupEvaluation.findAll({
			where: { COURSE_ID: course_id, GROUP_ID: group_id },
		});
		if (groupExists.length === 0) {
			return {
				status: 'error',
				message: 'Group does not exist',
			};
		}
		const groupMembers = await GroupMembersTable.findAll({
			where: { GROUP_ID: group_id },
		});
		if (groupMembers.length !== 0) {
			return {
				status: 'error',
				message: 'Group is not empty',
			};
		}
		await CourseGroupEvaluation.destroy({
			where: { COURSE_ID: course_id, GROUP_ID: group_id },
		});
		return {
			status: 'success',
			message: 'Group removed successfully',
		};
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results in removeEmptyGroupService.js: ' + e.message,
		};
	}
}

module.exports = removeEmptyGroupService;

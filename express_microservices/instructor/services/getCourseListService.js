// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const { Course } = require('../database/index')
const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');

async function getCourseListService(instructor_id) {
	try {
		if (instructor_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const instructorIDstatus = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorIDstatus.status === false) {
			return {
				status: 'error',
				message: 'Instructor id does not exist',
			};
		}
		
		const response = await Course.findAll({
			where: { INSTRUCTOR_ID: instructor_id },
		})
		return { status: 'success', data: response };
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results in getCourseListService.js: ' + e.message,
		}
	}
}

module.exports = getCourseListService
// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const { EvaluationForm } = require('../database/index');

const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');

async function getFormListService(instructor_id, course_id) {
	try {
		if (course_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (course_id === '') {
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
		const courseStatus = await checkIfCourseExistService(course_id);
		if (courseStatus.status === false) {
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
				message: 'Instructor is not teaching this course',
			};
		}
		const response = await EvaluationForm.findAll({
			where: { COURSE_ID: course_id },
		});
		return { status: 'success', data: response };
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results in getFormListService.js: ' + e.message,
		};
	}
}

module.exports = getFormListService;

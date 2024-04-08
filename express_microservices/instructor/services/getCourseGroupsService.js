// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');

const { Course, CourseGroupEvaluation } = require('../database/index');

async function getCourseGroupsService(instructor_id, course_id) {
	try {
		if (instructor_id === undefined || course_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '' || course_id === '') {
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
		const courseIDstatus = await checkIfCourseExistService(course_id);
		if (courseIDstatus.status === false) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}

		const response = await Course.findAll({
			where: { INSTRUCTOR_ID: instructor_id, COURSE_ID: course_id },
		});
		if (response.length === 0) {
			return {
				status: 'error',
				message: 'Instructor is not teaching this course',
			};
		}
		const existedGroups = await CourseGroupEvaluation.findAll({
			where: { COURSE_ID: course_id },
		});
		return { status: 'success', data: existedGroups };
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getCourseGroupsService.js: ' +
				e.message,
		};
	}
}

module.exports = getCourseGroupsService;

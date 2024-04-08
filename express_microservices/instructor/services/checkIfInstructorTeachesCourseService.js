// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { Course } = require('../database/index');

async function checkIfInstructorTeachesCourseService(instructor_id, course_id) {
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

		const response = await Course.findAll({
			where: { INSTRUCTOR_ID: instructor_id, COURSE_ID: course_id },
		});
		if (response.length === 0) {
			return {
				status: false,
				message: 'instrcutor does not teaching this course',
			};
		} else {
			return {
				status: true,
				message: 'instrcutor teaching this course',
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = checkIfInstructorTeachesCourseService;

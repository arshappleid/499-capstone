// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { Course } = require('../database/index');

async function checkIfCourseExist(course_id) {
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

		const existCourse = await Course.findAll({
			where: { COURSE_ID: course_id },
		});

		if (existCourse.length === 0) {
			return {
				status: false,
				message: 'course does not exist',
			};
		} else {
			return {
				status: true,
				data: existCourse,
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = checkIfCourseExist;

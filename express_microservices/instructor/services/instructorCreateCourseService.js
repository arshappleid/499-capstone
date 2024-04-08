// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by: Lance Haoxiang Xu
const { Course, InstructorCourse } = require('../database/index');

const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');

async function instructorCreateCourseService(
	instructor_id,
	course_name,
	course_code,
	course_semester,
	course_year,
	course_term,
	course_visibility,
	external_course_link
) {
	try {
		if (
			instructor_id === undefined ||
			course_name === undefined ||
			course_code === undefined ||
			course_semester === undefined ||
			course_year === undefined ||
			course_term === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			instructor_id === '' ||
			course_name === '' ||
			course_code === '' ||
			course_semester === '' ||
			course_year === '' ||
			course_term === '' ||
			course_visibility === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const courseExist = await Course.findAll({
			where: {
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: course_name,
				COURSE_CODE: course_code,
				COURSE_SEMESTER: course_semester,
				COURSE_YEAR: course_year,
				COURSE_TERM: course_term,
			},
		});
		if (courseExist.length > 0) {
			return {
				status: 'duplicate',
				message: 'Course already exists',
			};
		}
		const instructorExist = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorExist.status === false) {
			return {
				status: 'error',
				message: 'Instructor id does not exist',
			};
		}
		const newCourse = await Course.create({
			INSTRUCTOR_ID: instructor_id,
			COURSE_NAME: course_name,
			COURSE_CODE: course_code,
			COURSE_SEMESTER: course_semester,
			COURSE_YEAR: course_year,
			COURSE_TERM: course_term,
			COURSE_VISIBILITY: course_visibility,
			EXTERNAL_COURSE_LINK: external_course_link,
		});

		const instructorCourse = await InstructorCourse.create({
			INSTRUCTOR_ID: instructor_id,
			COURSE_ID: newCourse.COURSE_ID,
		});
		return {
			status: 'success',
			data: { course_id: newCourse.COURSE_ID },
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorCreateCourseService.js: ' +
				e.message,
		};
	}
}

module.exports = instructorCreateCourseService;

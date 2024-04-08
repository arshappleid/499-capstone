// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');

const { Course } = require('../database/index');

async function instructorSetCourseVisibiliyService(
	instructor_id,
	course_id,
	course_visibility
) {
	try {
		if (
			instructor_id === undefined ||
			course_id === undefined ||
			course_visibility === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}

		if (
			instructor_id === '' ||
			course_id === '' ||
			course_visibility === ''
		) {
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
				message: 'Instructor id does not exist',
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
		} else {
			await Course.update(
				{
					COURSE_VISIBILITY: course_visibility,
				},
				{
					where: {
						COURSE_ID: course_id,
					},
				}
			);
		}

		return {
			status: 'success',
			data: { course_visibility: course_visibility },
		};
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results: ' + e.toString(),
		};
	}
}

module.exports = instructorSetCourseVisibiliyService;

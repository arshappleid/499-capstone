// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const { CourseAssignment } = require('../database/index');
const checkIfInstructorIdExistService = require('./checkIfInstructorIdExistService');
const checkIfCourseExistService = require('./checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('./checkIfInstructorTeachesCourseService');

async function getAssignmentListService(instructor_id, course_id) {
	try {
		if (course_id === undefined || instructor_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (course_id === '' || instructor_id === '') {
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
		const instructorTeachesCourseStatus =
			await checkIfInstructorTeachesCourseService(
				instructor_id,
				course_id
			);
		if (instructorTeachesCourseStatus.status === false) {
			return {
				status: 'error',
				message: 'Instructor does not teach this course',
			};
		}
		const response = await CourseAssignment.findAll({
			where: { COURSE_ID: course_id },
		});
		return { status: 'success', data: response.length };
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = getAssignmentListService;

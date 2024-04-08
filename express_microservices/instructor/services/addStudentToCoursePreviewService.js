// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const { StudentCourse } = require('../database/index');

async function addStudentToCoursePreviewService(course_id, student_id) {
	try {
		if (course_id === undefined || student_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (course_id === '' || student_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const relationExist = await StudentCourse.findAll({
			where: { STUDENT_ID: student_id, COURSE_ID: course_id },
		});
		if (relationExist.length > 0) {
			return {
				status: 'duplicate',
				message: 'Student already enrolled in course',
			};
		}
		return {
			status: 'success',
			data: { student_id: student_id },
		};
	} catch (e) {
		console.log('Error in addStudentToCourseService: ', e);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in addStudentToCourseService.js: ' +
				e.message,
		};
	}
}

module.exports = addStudentToCoursePreviewService;

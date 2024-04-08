// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	Student,
	Course,
	StudentCourse,
	EvaluationForm,
} = require('../database/index');

async function getCourseFormListService(student_id, course_id) {
	if (student_id === undefined || course_id === undefined) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (student_id === '' || course_id === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if student exists
		const student = await Student.findAll({
			where: {
				STUDENT_ID: student_id,
			},
		});
		if (student.length === 0) {
			return {
				status: 'error',
				message: 'Student does not exist',
			};
		}
		//Check if course exists
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
		}
		//Check if student is enrolled in course
		const studentInCourse = await StudentCourse.findAll({
			where: {
				STUDENT_ID: student_id,
				COURSE_ID: course_id,
			},
		});
		if (studentInCourse.length === 0) {
			return {
				status: 'error',
				message: 'Student not enrolled in course',
			};
		}
		const evaluationForms = await EvaluationForm.findAll({
			where: {
				COURSE_ID: course_id,
				VISIBILITY: true,
			},
			attributes: ['FORM_ID', 'FORM_NAME', 'DEADLINE', 'SHARE_FEEDBACK'],
		});
		if (evaluationForms.length === 0) {
			return {
				status: 'error',
				message: 'No evaluation forms found',
			};
		}
		return {
			status: 'success',
			form: evaluationForms,
		};
	} catch (e) {
		console.log(e);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getCourseFormListService.js: ' +
				e.message,
		};
	}
}

module.exports = getCourseFormListService;

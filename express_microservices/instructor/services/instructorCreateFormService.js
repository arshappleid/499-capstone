// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const { EvaluationForm } = require('../database/index');

const checkIfInstructorIdExistService = require('./checkIfInstructorIdExistService');
const checkIfCourseExistService = require('./checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('./checkIfInstructorTeachesCourseService');

async function instructorCreateFormService(
	instructor_id,
	course_id,
	form_deadline,
	form_visibility,
	form_name
) {
	try {
		if (
			instructor_id === undefined ||
			course_id === undefined ||
			form_deadline === undefined ||
			form_visibility === undefined ||
			form_name === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			instructor_id === '' ||
			course_id === '' ||
			form_deadline === '' ||
			form_visibility === '' ||
			form_name === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const formExist = await EvaluationForm.findAll({
			where: {
				FORM_NAME: form_name,
				COURSE_ID: course_id,
			},
		});
		if (formExist.length > 0) {
			return {
				status: 'duplicate',
				message: 'Form name already exists for this course',
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
				message: 'Course id does not exist',
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
		const newForm = await EvaluationForm.create({
			DEADLINE: form_deadline,
			SHARE_FEEDBACK: form_visibility,
			FORM_NAME: form_name,
			COURSE_ID: course_id,
		});

		return {
			status: 'success',
			data: { form_id: newForm.FORM_ID },
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorCreateFormService.js: ' +
				e.message,
		};
	}
}

module.exports = instructorCreateFormService;

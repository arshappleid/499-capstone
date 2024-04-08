// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const {
	EvaluationForm,
	EvaluationAnswer,
	EvaluationSection,
	EvaluationQuestion,
	EvaluationQuestionOption,
} = require('../database/index');

const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');

async function instructorRemoveFormService(instructor_id, course_id, form_id) {
	try {
		//Checking for undefined and empty values
		if (
			instructor_id === undefined ||
			course_id === undefined ||
			form_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '' || course_id === '' || form_id === '') {
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
				message: 'Instructor does not teach course',
			};
		}

		const formExist = await EvaluationForm.findAll({
			where: {
				FORM_ID: form_id,
			},
		});
		if (formExist.length === 0) {
			return {
				status: 'error',
				message: 'Form id does not exist',
			};
		}

		if (formExist[0].COURSE_ID !== course_id) {
			return {
				status: 'error',
				message: 'Form does not belong to course',
			};
		}

		const evaluation_answers = await EvaluationAnswer.findAll({
			where: {
				FORM_ID: form_id,
			},
		});

		if (evaluation_answers.length > 0) {
			return {
				status: 'error',
				message: 'Form has been answered by students',
			};
		}

		question_ids = await EvaluationQuestion.findAll({
			where: {
				FORM_ID: form_id,
			},
			attributes: ['QUESTION_ID'],
		});
		for (let i = 0; i < question_ids.length; i++) {
			await EvaluationQuestionOption.destroy({
				where: {
					QUESTION_ID: question_ids[i].QUESTION_ID,
				},
			});
		}
		await EvaluationSection.destroy({
			where: {
				FORM_ID: form_id,
			},
		});
		await EvaluationQuestion.destroy({
			where: {
				FORM_ID: form_id,
			},
		});
		await EvaluationForm.destroy({
			where: {
				FORM_ID: form_id,
			},
		});

		return {
			status: 'success',
			message: 'Form deleted successfully',
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorRemoveFormService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorRemoveFormService;

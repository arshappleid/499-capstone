// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	EvaluationQuestion,
	EvaluationSection,
	EvaluationForm,
} = require('../database/index');

async function instructorCreateQuestionAndSectionService(
	form_id,
	question_type,
	question_text,
	section_weightage,
	section_name
) {
	if (
		form_id === undefined ||
		question_type === undefined ||
		question_text === undefined ||
		section_weightage === undefined ||
		section_name === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		form_id === '' ||
		question_type === '' ||
		question_text === '' ||
		section_weightage === '' ||
		section_name === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}
	try {
		const existForm = await EvaluationForm.findAll({
			where: {
				FORM_ID: form_id,
			},
		});
		if (existForm.length === 0) {
			return {
				status: 'error',
				message: 'Form does not exist',
			};
		}

		const newQuestion = await EvaluationQuestion.create({
			FORM_ID: form_id,
			QUESTION_TYPE: question_type,
			QUESTION_TEXT: question_text,
		});

		const newSection = await EvaluationSection.create({
			SECTION_WEIGHT: section_weightage,
			SECTION_NAME: section_name,
			FORM_ID: form_id,
			QUESTION_ID: newQuestion.QUESTION_ID,
		});

		return {
			status: 'success',
			data: { question_id: newQuestion.QUESTION_ID },
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorCreateQuestionAndSectionService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorCreateQuestionAndSectionService;

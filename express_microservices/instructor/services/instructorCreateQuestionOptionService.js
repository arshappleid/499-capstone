// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const { EvaluationQuestionOption } = require('../database/index');

async function instructorCreateQuestionOptionService(
	question_id,
	option_text,
	option_point
) {
	if (
		question_id === undefined ||
		option_text === undefined ||
		option_point === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (question_id === '' || option_text === '' || option_point === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		const newOption = await EvaluationQuestionOption.create({
			QUESTION_ID: question_id,
			OPTION_TEXT: option_text,
			OPTION_POINT: option_point,
		});

		return {
			status: 'success',
			data: {
				option_id: newOption.OPTION_ID,
				option_point: newOption.OPTION_POINT,
			},
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorCreateQuestionOptionService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorCreateQuestionOptionService;

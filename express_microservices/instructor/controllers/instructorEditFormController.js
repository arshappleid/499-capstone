// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const instructorRemoveFormService = require('../services/instructorRemoveFormService');
const instructorCreateFormService = require('../services/instructorCreateFormService');
const instructorCreateQuestionAndSectionService = require('../services/instructorCreateQuestionAndSectionService');
const instructorCreateQuestionOptionService = require('../services/instructorCreateQuestionOptionService');

router.post('/', async (req, res) => {
	const instructor_id = req.body.instructor_id;
	const course_id = req.body.course_id;
	let form_id = req.body.form_id;
	const form_deadline = req.body.deadline;
	const form_name = req.body.formName;
	const sections = req.body.sections;

	//Check if the request body is not null or undefined or empty
	if (
		instructor_id === null ||
		instructor_id === '' ||
		instructor_id === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Instructor id can not be null',
		});
	}
	if (course_id === null || course_id === '' || course_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Course id can not be null',
		});
	}
	if (form_id === null || form_id === '' || form_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Form id can not be null',
		});
	}
	if (
		form_deadline === null ||
		form_deadline === '' ||
		form_deadline === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Form deadline can not be null',
		});
	}
	if (form_name === null || form_name === '' || form_name === undefined) {
		return res.json({
			status: 'error',
			message: 'Form name can not be null',
		});
	}
	if (
		sections === null ||
		sections === '' ||
		sections === undefined ||
		sections.length === 0
	) {
		return res.json({
			status: 'error',
			message: 'Sections can not be null',
		});
	}

	try {
		const removeStatus = await instructorRemoveFormService(
			instructor_id,
			course_id,
			form_id
		);
		if (removeStatus.status !== 'success') {
			return res.json({
				status: removeStatus.status,
				message: removeStatus.message,
			});
		}

		const created_form = await instructorCreateFormService(
			instructor_id,
			course_id,
			form_deadline,
			0,
			form_name
		);

		if (created_form.status !== 'success') {
			return res.json({
				status: created_form.status,
				message: created_form.message,
			});
		}

		form_id = created_form.data.form_id;

		let section_data = [];

		//LOOP through sections/////////////////////////////////////////////////////////////////////////////////////////
		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];

			const section_name = section.name;
			const section_weightage = section.weightage;
			const questions = section.questions;

			//If section name is null, continue to next section
			if (
				section_name === null ||
				section_name === '' ||
				section_name === undefined
			) {
				section_data.push({
					section_status: 'error',
					section_message: 'Section name can not be null',
					questions: [],
				});
				continue;
			}

			//If section weightage is null, continue to next section
			if (
				section_weightage === null ||
				section_weightage === '' ||
				section_weightage === undefined
			) {
				section_data.push({
					section_status: 'error',
					section_message: 'Section weightage can not be null',
					questions: [],
				});
				continue;
			}

			//If questions is null, continue to next section
			if (
				questions === null ||
				questions === '' ||
				questions === undefined ||
				questions.length === 0
			) {
				section_data.push({
					section_status: 'error',
					section_message: 'Section questions can not be null',
					questions: [],
				});
				continue;
			}

			let question_data = [];

			//LOOP through questions////////////////////////////////////////////////////////////////////////////////////////
			for (let j = 0; j < questions.length; j++) {
				const question = questions[j];

				const question_type = question.type;
				const question_text = question.question;

				//If question type is null, continue to next question
				if (
					question_type === null ||
					question_type === '' ||
					question_type === undefined
				) {
					question_data.push({
						question_status: 'error',
						question_message: 'Question type can not be null',
						options: [],
					});
					continue;
				}

				//If question text is null, continue to next question
				if (
					question_text === null ||
					question_text === '' ||
					question_text === undefined
				) {
					question_data.push({
						question_status: 'error',
						question_message: 'Question text can not be null',
						options: [],
					});
					continue;
				}

				const created_question =
					await instructorCreateQuestionAndSectionService(
						form_id,
						question_type,
						question_text,
						section_weightage,
						section_name
					);

				if (created_question.status !== 'success') {
					question_data.push({
						question_status: created_question.status,
						question_message: created_question.message,
						options: [],
					});
					continue;
				}

				let option_data = [];

				//LOOP THROUGH OPTIONS////////////////////////////////////////////////////////////////////////////////////////
				if (
					question.type === 'mcq' ||
					question.type === 'matrix' ||
					question.type === 'ma'
				) {
					for (let k = 0; k < question.options.length; k++) {
						const option_text = question.options[k];
						let option_point = 1;

						if (question.type !== 'ma') {
							if (k < question.optionPoints.length) {
								option_point = question.optionPoints[k];
							} else {
								option_point = 1;
							}
						} else {
							option_point = 0;
						}

						if (
							option_text === null ||
							option_text === '' ||
							option_text === undefined
						) {
							option_data.push({
								option_status: 'error',
								option_message: 'Option text can not be null',
							});
							continue;
						}

						if (
							option_point === null ||
							option_point === '' ||
							option_point === undefined
						) {
							if (question.type !== 'ma') {
								option_point = 0;
							} else {
								option_point = 1;
							}
						}

						const created_option =
							await instructorCreateQuestionOptionService(
								created_question.data.question_id,
								option_text,
								option_point
							);

						if (created_option.status !== 'success') {
							option_data.push({
								option_status: created_option.status,
								option_message: created_option.message,
							});
							continue;
						} else {
							option_data.push({
								option_status: created_option.status,
								option_message: 'Option created successfully',
								option_id: created_option.data.option_id,
								option_point: created_option.data.option_point,
							});
						}
					}
				}
				//END LOOP THROUGH OPTIONS
				question_data.push({
					question_status: created_question.status,
					question_message: created_question.message,
					question_id: created_question.data.question_id,
					options: option_data,
				});
			}
			//END LOOP THROUGH QUESTIONS
			section_data.push({
				section_status: 'success',
				section_message: 'Section created successfully',
				questions: question_data,
			});
		}
		//END LOOP THROUGH SECTIONS
		return res.json({
			status: 'success',
			message: 'Form edited successfully',
			form_id: form_id,
			sections: section_data,
		});
	} catch (err) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in instrcutorEditFormController.js: ' +
				err.message,
		});
	}
});

module.exports = router;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const e = require('express');
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
const instructorGetFormService = require('./instructorGetFormService');

async function instructorGetFormAnswersService(
	instructor_id,
	course_id,
	form_id,
	evaluatee_id,
	evaluator_id
) {
	try {
		//Checking for undefined and empty values
		if (
			instructor_id === undefined ||
			course_id === undefined ||
			form_id === undefined ||
			evaluatee_id === undefined ||
			evaluator_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			instructor_id === '' ||
			course_id === '' ||
			form_id === '' ||
			evaluatee_id === '' ||
			evaluator_id === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		//Checking if instructor id, course id and form id exist
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
		const formExist = await EvaluationForm.findOne({
			where: {
				FORM_ID: form_id,
				COURSE_ID: course_id,
			},
		});
		if (formExist === null) {
			return {
				status: 'error',
				message: 'Form id does not exist',
			};
		}

		const form = await instructorGetFormService(
			instructor_id,
			course_id,
			form_id
		);

		const answers = await EvaluationAnswer.findAll({
			where: {
				FORM_ID: form_id,
				EVALUATOR_ID: evaluator_id,
				EVALUATEE_ID: evaluatee_id,
			},
		});
		if (answers.length === 0) {
			return {
				status: 'error',
				message: 'No answers found',
			};
		}

		return data_reformation(form, answers);
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetFormService.js: ' +
				err.message,
		};
	}
}

async function data_reformation(form, answers) {
	//LOOP THROUGH SECTIONS
	for (let s = 0; s < form.sections.length; s++) {
		const section = form.sections[s];
		//LOOP THROUGH QUESTIONS
		for (let q = 0; q < section.questions.length; q++) {
			const question = section.questions[q];
			const question_id = question.id;

			//LOOP THROUGH ANSWERS
			for (let a = 0; a < answers.length; a++) {
				const answer = answers[a];
				const answer_question_id = answer.QUESTION_ID;

				if (answer_question_id === question_id) {

					let selectedOptionText = [];
					let comment = '';

					const raw_answer = answer.ANSWER;
					const split_answer = raw_answer.split(
						'   [THISISASPLITTER]   '
					);

					if (question.type === 'mcq') {
						selectedOptionText.push(split_answer[0]);
						if (split_answer.length > 1) {
							comment = split_answer[1];
						}
						question.selectedOptionText = selectedOptionText;
						question.comment = comment;
					} else if (question.type === 'ma') {
						for (let i = 0; i < split_answer.length; i++) {
							if (split_answer[i] !== '') {
								selectedOptionText.push(split_answer[i]);
							}
						}
						question.selectedOptionText = selectedOptionText;
						question.comment = comment;
					} else if (question.type === 'shortAnswer') {
						comment = split_answer[0];
						question.selectedOptionText = selectedOptionText;
						question.comment = comment;
					} else if (question.type === 'matrix') {
						selectedOptionText.push(split_answer[0]);
						if (split_answer.length > 1) {
							comment = split_answer[1];
						}
						question.selectedOptionText = selectedOptionText;
						question.comment = comment;
					} else {
						question.selectedOptionText = selectedOptionText;
						question.comment = comment;
					}

					let selectedOption = [];

					if (selectedOptionText.length !== 0) {
						//LOOP THROUGH OPTIONS
						if (question.options !== undefined) {
							for (
								let option = 0;
								option < selectedOptionText.length;
								option++
							) {
								for (
									let index = 0;
									index < question.options.length;
									index++
								) {
									if (
										selectedOptionText[option] ===
										question.options[index]
									) {
										selectedOption.push(index);
										break;
									}
								}
							}
						}
					}
					question.selectedOption = selectedOption;

					break;
				}
			}
		}
	}
	return form;
}

module.exports = instructorGetFormAnswersService;

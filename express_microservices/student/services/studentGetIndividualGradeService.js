// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const e = require('express');
const {
	Student,
	EvaluationForm,
	EvaluationAnswer,
} = require('../database/index');

const studentGetFormService = require('./studentGetFormService');

async function studentGetIndividualGradeService(
	student_id,
	form_id,
	evaluator_id
) {
	if (
		student_id === undefined ||
		form_id === undefined ||
		evaluator_id === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (student_id === '' || form_id === '' || evaluator_id === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}
	try {
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
		const course_id = formExist[0].COURSE_ID;
		const studentExist = await Student.findAll({
			where: {
				STUDENT_ID: student_id,
			},
		});
		if (studentExist.length === 0) {
			return {
				status: 'error',
				message: 'Student id does not exist',
			};
		}
		const evaluatorExist = await Student.findAll({
			where: {
				STUDENT_ID: evaluator_id,
			},
		});
		if (evaluatorExist.length === 0) {
			return {
				status: 'error',
				message: 'Evaluator id does not exist',
			};
		}
		const answers = await EvaluationAnswer.findAll({
			where: {
				FORM_ID: form_id,
				EVALUATOR_ID: evaluator_id,
				EVALUATEE_ID: student_id,
			},
		});
		if (answers.length === 0) {
			return {
				status: 'error',
				message: 'Answers does not exist',
			};
		}
		const form = await studentGetFormService(
			student_id,
			course_id,
			form_id
		);
		if (form.status === false) {
			return {
				status: 'error',
				message: 'Form does not exist',
			};
		}

		const form_answers = await data_reformation(form, answers);

		let form_grade = 0;
		let form_max_score = 0;
		let form_total_socre = 0;

		let response = [];

		// LOOPS THROUGH ALL THE SECTIONS
		if (form_answers.sections === undefined) {
			return {
				status: 'error',
				message: 'No sections found',
			};
		}
		for (let s = 0; s < form_answers.sections.length; s++) {
			const section = form_answers.sections[s];
			const section_name = section.name;
			const section_weightage = section.weightage;
			let section_total_score = 0;
			let section_max_score = 0;

			// LOOPS THROUGH ALL THE QUESTIONS
			if (section.questions !== undefined) {
				for (let q = 0; q < section.questions.length; q++) {
					const question = section.questions[q];

					if (question.type === 'mcq' || question.type === 'matrix') {
						const options = question.options;
						const optionPoints = question.optionPoints;
						const answer = question.selectedOptionText[0];

						let max_score = 0;
						let score = 0;

						// LOOPS THROUGH ALL THE OPTIONS
						if (options === undefined) {
							continue;
						}
						for (let o = 0; o < options.length; o++) {
							const option = options[o];
							const option_point = optionPoints[o];

							if (option === answer) {
								score = option_point;
							}

							if (option_point > max_score) {
								max_score = option_point;
							}
						}

						section_total_score += score;
						section_max_score += max_score;
					} else {
						continue;
					}
				}
			}

			let section_score_in_percentage = 0;
			let section_grade = 0;

			if (section_max_score === 0) {
				section_grade = 0;
			} else {
				section_score_in_percentage =
					section_total_score / section_max_score;
				section_grade = section_score_in_percentage * section_weightage;
			}
			form_grade += section_grade;
			form_max_score += section_max_score;
			form_total_socre += section_total_score;

			response.push({
				section_name: section_name,
				section_weightage: section_weightage,
				section_grade_after_weightage: section_grade, //Sum of all section grades = form grade
				section_grade_in_percentage: section_score_in_percentage,
				section_max_score: section_max_score,
				section_total_score: section_total_score,
			});
		}

		return {
			form_grade: form_grade,
			form_max_score: form_max_score,
			form_total_score: form_total_socre,
			section_grades: response,
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in studentGetIndividualGradeService.js: ' +
				err.message,
		};
	}
}

async function data_reformation(form, answers) {
	form.evaluator_id = answers[0].EVALUATOR_ID;
	//LOOP THROUGH SECTIONS
	for (let s = 0; s < form.sections.length; s++) {
		const section = form.sections[s];
		//LOOP THROUGH QUESTIONS
		for (let q = 0; q < section.questions.length; q++) {
			const question = section.questions[q];
			const question_id = question.question_id;

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

module.exports = studentGetIndividualGradeService;

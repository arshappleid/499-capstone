// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const e = require('express');
const { EvaluationForm, EvaluationAnswer } = require('../database/index');

const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');
const instructorGetFormAnswersService = require('./instructorGetFormAnswersService');

async function instructorGetIndividualGradeService(
	instructor_id,
	form_id,
	evaluatee_id,
	evaluator_id
) {
	try {
		if (
			instructor_id === undefined ||
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
			form_id === '' ||
			evaluatee_id === '' ||
			evaluator_id === ''
		) {
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
		const answerExist = await EvaluationAnswer.findAll({
			where: {
				form_id: form_id,
				evaluatee_id: evaluatee_id,
				evaluator_id: evaluator_id,
			},
		});
		if (answerExist.length === 0) {
			return {
				status: 'error',
				message: 'student has not submitted this form yet',
			};
		}
		const form_answers = await instructorGetFormAnswersService(
			instructor_id,
			course_id,
			form_id,
			evaluatee_id,
			evaluator_id
		);
		if (form_answers.status === 'error') {
			return {
				status: 'error',
				message:
					'Error in getting form answers:' + form_answers.message,
			};
		}

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
	} catch (error) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetIndividualGradeService.js: ' +
				error.message,
		};
	}
}

module.exports = instructorGetIndividualGradeService;

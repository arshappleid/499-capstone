// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	Course,
	Student,
	StudentCourse,
	EvaluationForm,
	EvaluationAnswer,
	GroupMembersTable,
	EvaluationSection,
	EvaluationQuestion,
	CourseGroupEvaluation,
	EvaluationQuestionOption,
} = require('../database/index');

const studentGetFormService = require('./studentGetFormService');

async function viewEvaluationFeedbackService(student_id, course_id, form_id) {
	if (
		student_id === undefined ||
		course_id === undefined ||
		form_id === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (student_id === '' || course_id === '' || form_id === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Checking if student id, course id and form id exist
		const studentExist = await Student.findOne({
			where: {
				STUDENT_ID: student_id,
			},
		});
		if (studentExist === null) {
			return {
				status: 'error',
				message: 'Student id does not exist',
			};
		}
		const courseExist = await Course.findOne({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (courseExist === null) {
			return {
				status: 'error',
				message: 'Course id does not exist',
			};
		}
		const formExist = await EvaluationForm.findOne({
			where: {
				FORM_ID: form_id,
			},
		});
		if (formExist === null) {
			return {
				status: 'error',
				message: 'Form id does not exist',
			};
		}
		//Checking if student is enrolled in course
		const studentEnrolled = await StudentCourse.findOne({
			where: {
				student_id: student_id,
				course_id: course_id,
			},
		});
		if (studentEnrolled === null) {
			return {
				status: 'error',
				message: 'Student is not enrolled in course',
			};
		}
		//Find group id
		const groupExist = await GroupMembersTable.findOne({
			where: {
				STUDENT_ID: student_id,
			},
			include: [
				{
					model: CourseGroupEvaluation,
					where: {
						COURSE_ID: course_id,
					},
				},
			],
		});
		if (groupExist === null) {
			return {
				status: 'error',
				message: 'Student is not in a group',
			};
		}
		const group_id = groupExist.GROUP_ID;
		//Find all students in group
		const groupMembers = await GroupMembersTable.findAll({
			where: {
				GROUP_ID: group_id,
			},
		});
		//Looping through all students in group to find all evaluation answers
		let evaluationAnswers = [];
		for (var i = 0; i < groupMembers.length; i++) {
			const student = groupMembers[i];
			const evaluator_id = student.STUDENT_ID;
			//Skip if student is evaluating himself
			if (student_id === evaluator_id) {
				continue;
			}
			//Find all evaluation answers
			const answer = await EvaluationAnswer.findAll({
				where: {
					FORM_ID: form_id,
					EVALUATOR_ID: evaluator_id,
					EVALUATEE_ID: student_id,
				},
			});
			if (answer === null || answer.length === 0) {
				evaluationAnswers.push({
					status: false,
					message: 'No evaluation answers found',
				});
				continue;
			}
			evaluationAnswers.push({
				status: true,
				answers: answer,
			});
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

		let evaluationFeedback = [];
		for (let ea = 0; ea < evaluationAnswers.length; ea++) {
			if (evaluationAnswers[ea].status === false) {
				continue;
			}

			// Clone the form object for each evaluation feedback entry
			const clonedForm = JSON.parse(JSON.stringify(form));

			evaluationFeedback.push(
				await data_reformation(
					clonedForm,
					evaluationAnswers[ea].answers
				)
			);
		}

		return {
			status: 'success',
			evaluationFeedback: evaluationFeedback,
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in viewEvaluationFeedbackService.js: ' +
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

module.exports = viewEvaluationFeedbackService;

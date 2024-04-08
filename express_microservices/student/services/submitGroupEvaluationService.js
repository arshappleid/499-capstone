// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const {
	GroupMembersTable,
	EvaluationAnswer,
	EvaluationQuestion,
	EvaluationQuestionOption,
	EvaluationForm,
	Student,
	CourseGroupEvaluation,
} = require('../database/index');

async function submitGroupEvaluationService(
	evaluatee_id,
	evaluator_id,
	form_id,
	course_id,
	evaluation_answers
) {
	if (
		evaluatee_id === undefined ||
		evaluator_id === undefined ||
		form_id === undefined ||
		course_id === undefined ||
		evaluation_answers === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		evaluatee_id === '' ||
		evaluator_id === '' ||
		form_id === '' ||
		course_id === '' ||
		evaluation_answers === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}
	try {
		//Find group id by course id and student id
		const courseGroup = await CourseGroupEvaluation.findOne({
			where: { COURSE_ID: course_id },
			include: [
				{
					model: GroupMembersTable,
					where: { STUDENT_ID: evaluator_id },
				},
			],
		});
		if (courseGroup === null) {
			return {
				status: 'error',
				message: 'student not enrolled in provided course',
			};
		}
		const group_id = courseGroup.get('GROUP_ID');

		//Check if evaluatee and evaluator are the same
		if (evaluatee_id === evaluator_id) {
			return {
				status: 'error',
				message: 'evaluatee and evaluator are the same',
			};
		}
		//Check if evaluation answers are empty
		if (evaluation_answers.length === 0) {
			return {
				status: 'error',
				message: 'evaluation answers are empty',
			};
		}
		//Check if the number of evaluation answers match the number of questions
		const questions = await EvaluationQuestion.findAll({
			where: { FORM_ID: form_id },
		});
		if (evaluation_answers.length !== questions.length) {
			return {
				status: 'error',
				message:
					'number of evaluation answers do not match number of questions',
			};
		}
		//Check if evaluatee exist
		const student = await Student.findOne({
			where: { STUDENT_ID: evaluatee_id },
		});
		if (student === null) {
			return {
				status: 'error',
				message: 'student does not exist',
			};
		}
		//Check if evaluator exist
		const evaluator = await Student.findOne({
			where: { STUDENT_ID: evaluator_id },
		});
		if (evaluator === null) {
			return {
				status: 'error',
				message: 'evaluator does not exist',
			};
		}
		//Check if group exist
		const group = await CourseGroupEvaluation.findOne({
			where: { GROUP_ID: group_id },
		});
		console.log('Group', group);
		if (group === null) {
			return {
				status: 'error',
				message: 'group does not exist',
			};
		}
		//Check if evaluatee enrolled in provided group
		const evaluateeInGroup = await GroupMembersTable.findAll({
			where: { GROUP_ID: group_id, STUDENT_ID: evaluatee_id },
		});
		if (evaluateeInGroup.length === 0) {
			return {
				status: 'error',
				message: 'student not enrolled in provide group',
			};
		}
		//Check if evaluator enrolled in provided group
		const evaluatorInGroup = await GroupMembersTable.findAll({
			where: { GROUP_ID: group_id, STUDENT_ID: evaluator_id },
		});
		if (evaluatorInGroup.length === 0) {
			return {
				status: 'error',
				message: 'evaluator not enrolled in provide group',
			};
		}
		//Check if evaluation form exist
		const evaluationForm = await EvaluationForm.findOne({
			where: { FORM_ID: form_id },
		});
		if (evaluationForm === null) {
			return {
				status: 'error',
				message: 'evaluation form does not exist',
			};
		}
		//Check if there is already an evaluation for this evaluatee, evaluator and form
		const evaluation = await EvaluationAnswer.findOne({
			where: {
				EVALUATEE_ID: evaluatee_id,
				EVALUATOR_ID: evaluator_id,
				FORM_ID: form_id,
			},
		});
		if (evaluation !== null) {
			return {
				status: 'error',
				message: 'evaluation already exists',
			};
		}

		let submit_statuses = [];
		let answers = [];

		//Create evaluation
		for (let a = 0; a < evaluation_answers.length; a++) {
			let answer = '';

			const selected_option = evaluation_answers[a].selectedOption;
			const comment = evaluation_answers[a].comment;

			//Find question options
			const options = await EvaluationQuestionOption.findAll({
				where: { QUESTION_ID: evaluation_answers[a].question_id },
			});

			//If no options found, return error
			if (options.length === 0 && selected_option.length !== 0) {
				submit_statuses.push({
					status: 'error',
					question_id: evaluation_answers[a].question_id,
					message: 'question options not found',
				});
				continue;
			}

			const selected_option_text = [];

			for (let o = 0; o < selected_option.length; o++) {
				selected_option_text.push(
					options[selected_option[o]].get('OPTION_TEXT')
				);
			}

			if (
				selected_option !== undefined ||
				selected_option !== null ||
				selected_option !== ''
			) {
				if (selected_option.length) {
					for (let i = 0; i < selected_option.length; i++) {
						answer +=
							selected_option_text[i] + '   [THISISASPLITTER]   ';
					}
				}
			}
			answer += comment;
			answers.push(options);

			const evaluation = await EvaluationAnswer.create({
				EVALUATEE_ID: evaluatee_id,
				EVALUATOR_ID: evaluator_id,
				FORM_ID: form_id,
				QUESTION_ID: evaluation_answers[a].question_id,
				ANSWER: answer,
			});

			if (evaluation === null) {
				submit_statuses.push({
					status: 'error',
					question_id: evaluation_answers[a].question_id,
					message: 'evaluation not created',
				});
			} else {
				submit_statuses.push({
					status: 'success',
					question_id: evaluation.QUESTION_ID,
					evaluation_id: evaluation.get('EVALUATION_ID'),
					message: 'evaluation created',
				});
			}
		}
		return {
			status: 'success',
			submit_statuses: submit_statuses,
			answers: answers,
		};
	} catch (error) {
		console.log('Error in submitGroupEvaluationService: ', error);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in submitGroupEvaluationService.js: ' +
				error.message,
		};
	}
}

module.exports = submitGroupEvaluationService;


		// // CREATE ANSWERS
		// await EvaluationAnswer.create({
		// 	FORM_ID: form_id1,
		// 	QUESTION_ID: question_id1,
		// 	EVALUATOR_ID: student_id1,
		// 	EVALUATEE_ID: student_id2,
		// 	ANSWER: 'OPTION_TEXT3339-1',
		// });
		// await EvaluationAnswer.create({
		// 	FORM_ID: form_id1,
		// 	QUESTION_ID: question_id2,
		// 	EVALUATOR_ID: student_id1,
		// 	EVALUATEE_ID: student_id2,
		// 	ANSWER: 'OPTION_TEXT3339-5',
		// });
		// await EvaluationAnswer.create({
		// 	FORM_ID: form_id2,
		// 	QUESTION_ID: question_id3,
		// 	EVALUATOR_ID: student_id1,
		// 	EVALUATEE_ID: student_id2,
		// 	ANSWER: 'OPTION_TEXT3339-7',
		// });
		// await EvaluationAnswer.create({
		// 	FORM_ID: form_id1,
		// 	QUESTION_ID: question_id1,
		// 	EVALUATOR_ID: student_id3,
		// 	EVALUATEE_ID: student_id2,
		// 	ANSWER: 'OPTION_TEXT3339-2',
		// });
		// await EvaluationAnswer.create({
		// 	FORM_ID: form_id1,
		// 	QUESTION_ID: question_id2,
		// 	EVALUATOR_ID: student_id3,
		// 	EVALUATEE_ID: student_id2,
		// 	ANSWER: 'OPTION_TEXT3339-6',
		// });
		// await EvaluationAnswer.create({
		// 	FORM_ID: form_id2,
		// 	QUESTION_ID: question_id3,
		// 	EVALUATOR_ID: student_id3,
		// 	EVALUATEE_ID: student_id2,
		// 	ANSWER: 'OPTION_TEXT3339-7',
		// });
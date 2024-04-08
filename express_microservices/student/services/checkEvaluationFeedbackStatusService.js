// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const e = require('express');
const {
	GroupMembersTable,
	EvaluationAnswer,
	EvaluationForm,
	Student,
	CourseGroupEvaluation,
} = require('../database/index');

async function checkEvaluationFeedbackStatusService(
	evaluatee_id,
	group_id,
	form_id
) {
	try {
		if (
			evaluatee_id === undefined ||
			group_id === undefined ||
			form_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (evaluatee_id === '' || group_id === '' || form_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		//Check if student not exist
		const student = await Student.findOne({
			where: { STUDENT_ID: evaluatee_id },
		});
		if (student === null) {
			return {
				status: 'error',
				message: 'student does not exist',
			};
		}
		//Check if group not exist
		const group = await CourseGroupEvaluation.findOne({
			where: { GROUP_ID: group_id },
		});
		if (group === null) {
			return {
				status: 'error',
				message: 'group does not exist',
			};
		}
		//Check if student not enrolled in provided group
		const groupMembers = await GroupMembersTable.findAll({
			where: { GROUP_ID: group_id },
		});
		if (groupMembers.length === 0) {
			return {
				status: 'error',
				message: 'student not enrolled in provide group',
			};
		}
		//Check if form not exist
		const form = await EvaluationForm.findOne({
			where: { FORM_ID: form_id },
		});
		if (form === null) {
			return {
				status: 'error',
				message: 'form does not exist',
			};
		}

		const groupMemberEvluationStatus = [];

		for (let i = 0; i < groupMembers.length; i++) {
			const groupMember = groupMembers[i];

			if (groupMember.STUDENT_ID === evaluatee_id) {
				continue;
			}

			const student = await Student.findOne({
				where: { STUDENT_ID: groupMember.STUDENT_ID },
			});
			const student_id = student.STUDENT_ID;
			const student_firstname = student.FIRST_NAME;
			const student_middlename = student.MIDDLE_NAME;
			const student_lastname = student.LAST_NAME;
			let completion_status = false;

			const evaluationAnswers = await EvaluationAnswer.findAll({
				where: {
					EVALUATEE_ID: evaluatee_id,
					EVALUATOR_ID: groupMember.STUDENT_ID,
					FORM_ID: form_id,
				},
			});

			if (evaluationAnswers.length === 0) {
				feedback_available = false;
			} else if (evaluationAnswers.length > 0) {
				if (
					form.SHARE_FEEDBACK === true &&
					evaluationAnswers[0].VISIBILITY === true
				) {
					feedback_available = true;
				} else {
					feedback_available = false;
				}
			} else {
				feedback_available = false;
			}

			groupMemberEvluationStatus.push({
				student_id: student_id,
				student_firstname: student_firstname,
				student_middlename: student_middlename,
				student_lastname: student_lastname,
				feedback_available: feedback_available,
			});
		}

		return {
			status: 'success',
			evaluation_records: groupMemberEvluationStatus,
		};
	} catch (e) {
		console.log('Error in checkEvaluationFeedbackStatusService: ', e);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in checkEvaluationFeedbackStatusService.js: ' +
				e.message,
		};
	}
}

module.exports = checkEvaluationFeedbackStatusService;

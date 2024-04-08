// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const {
	GroupMembersTable,
	EvaluationAnswer,
	EvaluationForm,
	Student,
	Course,
	CourseGroupEvaluation,
} = require('../database/index');

async function getGroupMemberEvluationStatusService(
	evaluator_id,
	course_id,
	form_id
) {
	try {
		if (
			evaluator_id === undefined ||
			course_id === undefined ||
			form_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (evaluator_id === '' || course_id === '' || form_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		//Check if student not exist
		const student = await Student.findOne({
			where: { STUDENT_ID: evaluator_id },
		});
		if (student === null) {
			return {
				status: 'error',
				message: 'student does not exist',
			};
		}
		//Check if course not exist
		const course = await Course.findOne({
			where: { COURSE_ID: course_id },
		});
		if (course === null) {
			return {
				status: 'error',
				message: 'course does not exist',
			};
		}
		//find all the group members
		const found_group = await CourseGroupEvaluation.findOne({
			where: { COURSE_ID: course_id },
			include: [
				{
					model: GroupMembersTable,
					where: { STUDENT_ID: evaluator_id },
				},
			],
		});
		if (found_group === null) {
			return {
				status: 'error',
				message: 'group does not exist',
			};
		}
		const group_id = found_group.GROUP_ID;

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

			if (groupMember.STUDENT_ID === evaluator_id) {
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
					EVALUATEE_ID: groupMember.STUDENT_ID,
					EVALUATOR_ID: evaluator_id,
					FORM_ID: form_id,
				},
			});

			if (evaluationAnswers.length === 0) {
				completion_status = false;
			} else if (evaluationAnswers.length > 0) {
				completion_status = true;
			} else {
				completion_status = false;
			}

			groupMemberEvluationStatus.push({
				student_id: student_id,
				student_firstname: student_firstname,
				student_middlename: student_middlename,
				student_lastname: student_lastname,
				completion_status: completion_status,
			});
		}

		return {
			status: 'success',
			evaluation_records: groupMemberEvluationStatus,
		};
	} catch (e) {
		console.log('Error in getGroupMemberEvluationStatusService: ', e);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getGroupMemberEvluationStatusService.js: ' +
				e.message,
		};
	}
}

module.exports = getGroupMemberEvluationStatusService;

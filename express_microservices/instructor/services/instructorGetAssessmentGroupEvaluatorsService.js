// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const {
	Student,
	Instructor,
	CourseAssignment,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
} = require('../database/index');

async function instructorGetAssessmentGroupEvaluatorsService(
	instructor_id,
	assignment_id,
	evaluatee_id
) {
	if (
		instructor_id === undefined ||
		assignment_id === undefined ||
		evaluatee_id === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (instructor_id === '' || assignment_id === '' || evaluatee_id === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if instructor exists
		const instructor = await Instructor.findOne({
			where: {
				instructor_id: instructor_id,
			},
		});
		if (instructor === null) {
			return {
				status: 'error',
				message: 'Instructor does not exist',
			};
		}
		//Check if assignment exists
		const assignment = await CourseAssignment.findOne({
			where: {
				assignment_id: assignment_id,
			},
		});
		if (assignment === null) {
			return {
				status: 'error',
				message: 'Assignment does not exist',
			};
		}
		//Check if evaluatee exists
		const evaluatee = await AssignmentAssessmentGroup.findOne({
			where: {
				EVALUATEE_ID: evaluatee_id,
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (evaluatee === null) {
			return {
				status: 'error',
				message: 'Evaluatee does not exist',
			};
		}
		const assessment_group_id = evaluatee.ASSESSED_GROUP_ID;

		//Find all evaluators
		const evaluators = await AssessmentGroupMembersTable.findAll({
			where: {
				ASSESSED_GROUP_ID: assessment_group_id,
			},
		});
		if (evaluators === null) {
			return {
				status: 'error',
				message: 'No evaluators found',
			};
		}
		const evaluator_ids = evaluators.map((evaluator) => {
			return evaluator.EVALUATOR_ID;
		});

		let evaluator_info = [];
		for (let i = 0; i < evaluator_ids.length; i++) {
			evaluator_info.push(
				await Student.findOne({
					where: {
						student_id: evaluator_ids[i],
					},
				})
			);
		}

		for (let i = 0; i < evaluator_info.length; i++) {
			evaluator_info[i] = {
				student_id: evaluator_info[i].STUDENT_ID,
				first_name: evaluator_info[i].FIRST_NAME,
				middle_name: evaluator_info[i].MIDDLE_NAME,
				last_name: evaluator_info[i].LAST_NAME,
			};
		}

		return {
			status: 'success',
			message: 'Successfully retrieved evaluators',
			evaluators: evaluator_info,
		};
	} catch (error) {
		return {
			status: 'error',
			message:
				'Error occured in instructorGetAssessmentGroupEvaluatorsService' +
				error.message,
		};
	}
}

module.exports = instructorGetAssessmentGroupEvaluatorsService;

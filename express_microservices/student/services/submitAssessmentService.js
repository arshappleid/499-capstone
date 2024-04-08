// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const {
	Student,
	CourseAssignment,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
	AssignmentAssessment,
} = require('../database/index');

const submitAssessmentService = async (
	student_id,
	assignment_id,
	evaluatee_id,
	selected_options
) => {
	try {
		if (
			student_id === undefined ||
			assignment_id === undefined ||
			evaluatee_id === undefined ||
			selected_options === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			student_id === '' ||
			assignment_id === '' ||
			evaluatee_id === '' ||
			selected_options === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		// Check if student exists
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
		// Check if assignment exists
		const assignmentExist = await CourseAssignment.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assignmentExist === null) {
			return {
				status: 'error',
				message: 'Assignment id does not exist',
			};
		}
		// Check if evaluatee exists
		const evaluateeExist = await Student.findOne({
			where: {
				STUDENT_ID: evaluatee_id,
			},
		});
		if (evaluateeExist === null) {
			return {
				status: 'error',
				message: 'Evaluatee id does not exist',
			};
		}
		// Check if student is evaluating the evaluatee
		const assessed_group_id = await AssignmentAssessmentGroup.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
				EVALUATEE_ID: evaluatee_id,
			},
		});
		if (assessed_group_id === null) {
			return {
				status: 'error',
				message: 'Student is not evaluating the evaluatee',
			};
		}
		const evaluator = await AssessmentGroupMembersTable.findOne({
			where: {
				ASSESSED_GROUP_ID: assessed_group_id.ASSESSED_GROUP_ID,
				EVALUATOR_ID: student_id,
			},
		});
		if (evaluator === null) {
			return {
				status: 'error',
				message: 'Student is not evaluating the evaluatee',
			};
		}
		// Check if student has already submitted assessment
		const assessmentExist = await AssignmentAssessment.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
				EVALUATOR_ID: student_id,
				EVALUATEE_ID: evaluatee_id,
			},
		});

		let result = [];

		if (assessmentExist !== null) {
			//update overwrite existing assessment
			for (let i = 0; i < selected_options.length; i++) {
				const criteriaIdSelected = selected_options[i].criteriaId;
				const criteriaGrade = parseInt(
					selected_options[i].criteriaGrade
				);
				const criteriaFeedback = selected_options[i].criteriaFeedback;

				const criteriaExist = await AssignmentCriteria.findOne({
					where: {
						ASSIGNMENT_ID: assignment_id,
						CRITERIA_ID: criteriaIdSelected,
					},
				});
				if (criteriaExist === null) {
					result.push({
						status: 'error',
						criteria_id: criteriaIdSelected,
						message: 'Criteria id does not exist',
					});
					continue;
				}
				const optionExist =
					await AssignmentCriteriaRatingOption.findOne({
						where: {
							CRITERIA_ID: criteriaIdSelected,
							OPTION_POINT: criteriaGrade,
						},
					});
				if (optionExist === null) {
					result.push({
						status: 'error',
						criteria_id: criteriaIdSelected,
						message: 'Option id does not exist',
					});
					continue;
				}

				const existingAssessment = await AssignmentAssessment.findOne({
					where: {
						ASSIGNMENT_ID: assignment_id,
						EVALUATOR_ID: student_id,
						EVALUATEE_ID: evaluatee_id,
						CRITERIA_ID: criteriaIdSelected,
					},
				});
				const updateResult = await AssignmentAssessment.update(
					{
						OPTION_ID: optionExist.OPTION_ID,
					},
					{
						where: {
							ASSESSMENT_ID: existingAssessment.ASSESSMENT_ID,
						},
					}
				);
				if (updateResult[0] === 0) {
					result.push({
						status: 'error',
						criteria_id: criteriaIdSelected,
						message: 'Error updating assessment or no changes made',
					});
					continue;
				} else {
					result.push({
						status: 'success',
						criteria_id: criteriaIdSelected,
						message: 'Successfully updated assessment',
					});
				}
			}
		} else {
			//create new assessment
			for (let i = 0; i < selected_options.length; i++) {
				const criteriaIdSelected = selected_options[i].criteriaId;
				const criteriaGrade = parseInt(
					selected_options[i].criteriaGrade
				);
				const criteriaFeedback = selected_options[i].criteriaFeedback;

				const criteriaExist = await AssignmentCriteria.findOne({
					where: {
						ASSIGNMENT_ID: assignment_id,
						CRITERIA_ID: criteriaIdSelected,
					},
				});
				if (criteriaExist === null) {
					result.push({
						status: 'error',
						criteria_id: criteriaIdSelected,
						message: 'Criteria id does not exist',
					});
					continue;
				}
				const optionExist =
					await AssignmentCriteriaRatingOption.findOne({
						where: {
							CRITERIA_ID: criteriaIdSelected,
							OPTION_POINT: criteriaGrade,
						},
					});
				if (optionExist === null) {
					result.push({
						status: 'error',
						criteria_id: criteriaIdSelected,
						message: 'Option id does not exist',
					});
					continue;
				}
				const createResult = await AssignmentAssessment.create({
					ASSIGNMENT_ID: assignment_id,
					EVALUATOR_ID: student_id,
					EVALUATEE_ID: evaluatee_id,
					CRITERIA_ID: criteriaIdSelected,
					OPTION_ID: optionExist.OPTION_ID,
					ASSESSMENT_COMMENT: criteriaFeedback,
				});
				if (createResult === null) {
					result.push({
						status: 'error',
						criteria_id: criteriaIdSelected,
						message: 'Error creating assessment',
					});
					continue;
				} else {
					result.push({
						status: 'success',
						criteria_id: criteriaIdSelected,
						message: 'Successfully created assessment',
					});
				}
			}
		}

		return {
			status: 'success',
			message: 'Successfully submitted assessment',
			result: result,
		};
	} catch (error) {
		return {
			status: 'error',
			message:
				'error occured while retrieving results in submitAssessmentService' +
				error.message,
		};
	}
};

module.exports = submitAssessmentService;

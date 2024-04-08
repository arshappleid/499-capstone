// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const {
	Student,
	Instructor,
	Course,
	CourseAssignment,
	AssignmentAssessment,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
} = require('../database/index');

const getAssignmentService = require('../services/getAssignmentService');

async function viewAssignmentAssessmentService(
	course_id,
	assignment_id,
	evaluatee_id
) {
	if (
		course_id === undefined ||
		assignment_id === undefined ||
		evaluatee_id === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (course_id === '' || assignment_id === '' || evaluatee_id === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		// Check if the course exists.
		const course = await Course.findOne({
			where: {
				course_id: course_id,
			},
		});
		if (course === null) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		// Check if assignment exists.
		const assignment = await CourseAssignment.findOne({
			where: {
				course_id: course_id,
				assignment_id: assignment_id,
			},
		});
		if (assignment === null) {
			return {
				status: 'error',
				message: 'Assignment does not exist',
			};
		}
		//Get all evaluators
		const assessed_group_id = await AssignmentAssessmentGroup.findOne({
			where: {
				EVALUATEE_ID: evaluatee_id,
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assessed_group_id === null) {
			return {
				status: 'error',
				message: 'Evaluatee not in any assessment group',
			};
		}
		const evaluator_ids = await AssessmentGroupMembersTable.findAll({
			where: {
				ASSESSED_GROUP_ID: assessed_group_id.ASSESSED_GROUP_ID,
			},
		});
		if (evaluator_ids.length === 0) {
			return {
				status: 'error',
				message: 'No evaluators found',
			};
		}

		// Check if evaluatee exists.
		const evaluatee = await Student.findOne({
			where: {
				student_id: evaluatee_id,
			},
		});
		if (evaluatee === null) {
			return {
				status: 'error',
				message: 'Evaluatee does not exist',
			};
		}

		let response = [];
		let assignment_and_rubric = {};

		for (let e = 0; e < evaluator_ids.length; e++) {
			const evaluator_id = evaluator_ids[e].EVALUATOR_ID;
			//Check if the evaluator has already assessed the evaluatee
			const assessment = await AssignmentAssessment.findOne({
				where: {
					ASSIGNMENT_ID: assignment_id,
					EVALUATOR_ID: evaluator_id,
					EVALUATEE_ID: evaluatee_id,
				},
			});
			if (assessment === null) {
				// response.push({
				// 	evaluator_id: evaluator_id,
				// 	message: 'Evaluator has not assessed the evaluatee yet',
				// });
				continue;
			}
			assignment_and_rubric = await getAssignmentService(
				evaluatee_id,
				course_id,
				assignment_id
			);
			const result = await matchAssessmentWithRubric(
				assignment_and_rubric,
				assignment_id,
				evaluator_id,
				evaluatee_id
			);
			response.push({
				evaluator_id: evaluator_id,
				result: result,
			});
		}

		return {
			status: 'success',
			message: 'Assignment and Rubric retrieved',
			assignment: assignment_and_rubric.assignment,
			assessments: response,
		};
	} catch (err) {
		console.log(err);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in studentViewAssignmentService.js: ' +
				err.message,
		};
	}
}

async function matchAssessmentWithRubric(
	assignment_and_rubric,
	assignment_id,
	evaluator_id,
	evaluatee_id
) {
	let response = {};

	let rubric = [];

	//LOOP THROUGH THE CRITERIA
	for (let i = 0; i < assignment_and_rubric.rubric.length; i++) {
		const critera = assignment_and_rubric.rubric[i];
		const criteria_id = critera.CRITERIA_ID;

		const assessment = await AssignmentAssessment.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
				EVALUATOR_ID: evaluator_id,
				EVALUATEE_ID: evaluatee_id,
				CRITERIA_ID: criteria_id,
			},
		});
		if (assessment === null) {
			rubric.push({
				selected_option: 'Not yet assessed',
				selected_point: 'Not yet assessed',
				criteria_description: critera.CRITERIA_DESCRIPTION,
				criteria_options: critera.ASSIGNMENT_CRITERIA_RATING_OPTIONs,
			});
		} else {
			const optionSelected = await AssignmentCriteriaRatingOption.findOne(
				{
					where: {
						OPTION_ID: assessment.OPTION_ID,
						CRITERIA_ID: criteria_id,
					},
				}
			);
			rubric.push({
				selected_option: optionSelected.OPTION_DESCRIPTION,
				selected_point: optionSelected.OPTION_POINT,
				comment: assessment.ASSESSMENT_COMMENT,
				criteria_description: critera.CRITERIA_DESCRIPTION,
				criteria_options: critera.ASSIGNMENT_CRITERIA_RATING_OPTIONs,
			});
		}
	}

	response = rubric;

	return response;
}

module.exports = viewAssignmentAssessmentService;

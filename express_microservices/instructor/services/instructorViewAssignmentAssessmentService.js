// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
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

const instructorGetAssignmentService = require('../services/instructorGetAssignmentService');

async function instructorViewAssignmentAssessmentService(
	instructor_id,
	course_id,
	assignment_id,
	evaluator_id,
	evaluatee_id
) {
	if (
		instructor_id === undefined ||
		course_id === undefined ||
		assignment_id === undefined ||
		evaluator_id === undefined ||
		evaluatee_id === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		instructor_id === '' ||
		course_id === '' ||
		assignment_id === '' ||
		evaluator_id === '' ||
		evaluatee_id === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		// Check if the instructor exists.
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
		// Check if evaluator exists.
		const evaluator = await Student.findOne({
			where: {
				student_id: evaluator_id,
			},
		});
		if (evaluator === null) {
			return {
				status: 'error',
				message: 'Evaluator does not exist',
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

		//Check if the evaluator is in the assessment group
		const assessment_group = await AssignmentAssessmentGroup.findOne({
			where: {
				assignment_id: assignment_id,
				evaluatee_id: evaluatee_id,
			},
		});
		if (assessment_group === null) {
			return {
				status: 'error',
				message: 'Evaluatee is not in any assessment group',
			};
		}
		const assessment_group_members =
			await AssessmentGroupMembersTable.findAll({
				where: {
					ASSESSED_GROUP_ID: assessment_group.ASSESSED_GROUP_ID,
				},
			});
		if (assessment_group_members.length === 0) {
			return {
				status: 'error',
				message: 'Assessment group is empty',
			};
		} else {
			for (let i = 0; i < assessment_group_members.length; i++) {
				if (assessment_group_members[i].EVALUATOR_ID === evaluator_id) {
					break;
				}
				if (i === assessment_group_members.length - 1) {
					return {
						status: 'error',
						message: 'Evaluator is not in the assessment group',
					};
				}
			}
		}

		//Check if the evaluator has already assessed the evaluatee
		const assessment = await AssignmentAssessment.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
				EVALUATOR_ID: evaluator_id,
				EVALUATEE_ID: evaluatee_id,
			},
		});
		if (assessment === null) {
			return {
				status: 'error',
				message: 'Evaluator has not assessed the evaluatee yet',
			};
		}

		const assignment_and_rubric = await instructorGetAssignmentService(
			instructor_id,
			course_id,
			assignment_id
		);

		const response = await matchAssessmentWithRubric(
			assignment_and_rubric,
			assignment_id,
			evaluator_id,
			evaluatee_id
		);

		return {
			status: 'success',
			message: 'Assignment and Rubric retrieved',
			assignment: assignment_and_rubric.assignment,
			rubric: response,
		};
	} catch (err) {
		console.log(err);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetAssignmentService.js: ' +
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

module.exports = instructorViewAssignmentAssessmentService;

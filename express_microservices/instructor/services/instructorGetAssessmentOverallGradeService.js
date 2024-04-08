// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by Lance Haoxiang Xu
const {
	Student,
	Instructor,
	Course,
	StudentCourse,
	CourseAssignment,
	AssignmentSubmission,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
	AssignmentGrade,
} = require('../database/index');

const instructorGetAssessmentIndividualGradeService = require('../services/instructorGetAssessmentIndividualGradeService');

async function instructorGetAssessmentOverallGradeService(
	instructor_id,
	course_id,
	assignment_id,
	evaluatee_id
) {
	if (
		instructor_id === undefined ||
		course_id === undefined ||
		assignment_id === undefined ||
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
		evaluatee_id === ''
	) {
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
		//Check if course exists
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
		//Check if assignment exists
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
		//Check if evaluatee exists
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
		//Get all evaluators
		const assessmentGroup = await AssignmentAssessmentGroup.findOne({
			where: {
				EVALUATEE_ID: evaluatee_id,
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assessmentGroup === null) {
			return {
				status: 'error',
				message: 'Assessment Group does not exist',
			};
		}
		const evaluators = await AssessmentGroupMembersTable.findAll({
			where: {
				ASSESSED_GROUP_ID: assessmentGroup.ASSESSED_GROUP_ID,
			},
		});
		if (evaluators === null) {
			return {
				status: 'error',
				message: 'Evaluators do not exist',
			};
		}

		let OVERALL_TOTAL_GRADE_IN_PERCENTAGE = 0;
		let OVERALL_TOTAL_SCORE = 0;
		let OVERALL_MAX_SCORE = 0;

		let CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE = [];
		let CRITERIA_AVERAGE_SCORE = [];
		let CRITERIA_MAX_SCORE = [];
		let CRITERIA_DESCRIPTION = [];

		//Get all grades
		let grade_count = 0;
		let evaluator_data = [];
		for (let i = 0; i < evaluators.length; i++) {
			const grade = await instructorGetAssessmentIndividualGradeService(
				instructor_id,
				course_id,
				assignment_id,
				evaluators[i].EVALUATOR_ID,
				evaluatee_id
			);
			if (grade.status === 'error') {
				continue;
			}
			grade_count++;

			for (let c = 0; c < grade.criteria_grades.length; c++) {
				if (CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE[c] === undefined) {
					CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE[c] = 0;
					CRITERIA_AVERAGE_SCORE[c] = 0;
					CRITERIA_MAX_SCORE[c] = 0;
				}
				CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE[c] =
					grade.criteria_grades[c].criteria_grades_in_percentage +
					CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE[c];
				CRITERIA_AVERAGE_SCORE[c] =
					grade.criteria_grades[c].criteria_total_score +
					CRITERIA_AVERAGE_SCORE[c];
				CRITERIA_MAX_SCORE[c] =
					grade.criteria_grades[c].criteria_max_score +
					CRITERIA_MAX_SCORE[c];
				CRITERIA_DESCRIPTION[c] =
					grade.criteria_grades[c].criteria_description;
			}

			OVERALL_TOTAL_GRADE_IN_PERCENTAGE =
				grade.total_grade_in_percentage +
				OVERALL_TOTAL_GRADE_IN_PERCENTAGE;
			OVERALL_TOTAL_SCORE =
				grade.criteria_total_score + OVERALL_TOTAL_SCORE;
			OVERALL_MAX_SCORE = grade.criteria_max_score + OVERALL_MAX_SCORE;

			evaluator_data.push({
				evaluator_id: evaluators[i].EVALUATOR_ID,
				individual_grade: grade.total_grade_in_percentage,
			});
		}

		let criteria_grades = [];

		for (let c = 0; c < CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE.length; c++) {
			CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE[c] =
				CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE[c] / grade_count;
			CRITERIA_AVERAGE_SCORE[c] = CRITERIA_AVERAGE_SCORE[c] / grade_count;
			CRITERIA_MAX_SCORE[c] = CRITERIA_MAX_SCORE[c] / grade_count;

			criteria_grades.push({
				criteria_description: CRITERIA_DESCRIPTION[c],
				criteria_grades_in_percentage:
					CRITERIA_AVERGAE_GRADE_IN_PERCENTAGE[c],
				criteria_total_score: CRITERIA_AVERAGE_SCORE[c],
				criteria_max_score: CRITERIA_MAX_SCORE[c],
			});
		}

		const edited_grade = await AssignmentGrade.findOne({
			where: {
				assignment_id: assignment_id,
				evaluatee_id: evaluatee_id,
			},
		});
		if (edited_grade !== null) {
			return {
				status: 'success',
				overall_total_grade_in_percentage:
					OVERALL_TOTAL_GRADE_IN_PERCENTAGE / grade_count,
				overall_total_score: OVERALL_TOTAL_SCORE / grade_count,
				overall_max_score: OVERALL_MAX_SCORE / grade_count,
				criteria_grades: criteria_grades,
				total_evaluator_num_in_group: evaluators.length,
				evaluator_data: evaluator_data,
				edited_grade: edited_grade,
			};
		} else {
			return {
				status: 'success',
				overall_total_grade_in_percentage:
					OVERALL_TOTAL_GRADE_IN_PERCENTAGE / grade_count,
				overall_total_score: OVERALL_TOTAL_SCORE / grade_count,
				overall_max_score: OVERALL_MAX_SCORE / grade_count,
				criteria_grades: criteria_grades,
				total_evaluator_num_in_group: evaluators.length,
				evaluator_data: evaluator_data,
				edited_grade: null,
			};
		}
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured in instructorGetAssessmentOverallGradeService' +
				err.message,
		};
	}
}

module.exports = instructorGetAssessmentOverallGradeService;

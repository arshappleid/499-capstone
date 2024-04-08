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
} = require('../database/index');

const instructorViewAssignmentAssessmentService = require('../services/instructorViewAssignmentAssessmentService');

async function instructorGetAssessmentIndividualGradeService(
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

		//Get the assessment

		const assessment = await instructorViewAssignmentAssessmentService(
			instructor_id,
			course_id,
			assignment_id,
			evaluator_id,
			evaluatee_id
		);
		if (assessment.status === 'error') {
			return {
				status: 'error',
				message: assessment.message,
			};
		}

		let criteria_grades = [];

		let total_grade_in_percentage = 0;
		let criteria_total_score = 0;
		let criteria_total_max_score = 0;

		console.log('Assessment', assessment);

		//Loop through the rubric
		for (let i = 0; i < assessment.rubric.length; i++) {
			const selected_option = assessment.rubric[i].selected_option;
			const selected_point = assessment.rubric[i].selected_point;

			//Loop through the criteria options
			let max_point = 0;
			for (
				let j = 0;
				j < assessment.rubric[i].criteria_options.length;
				j++
			) {
				//find the max point
				const option_point =
					assessment.rubric[i].criteria_options[j].OPTION_POINT;
				if (option_point > max_point) {
					max_point = option_point;
				}
			}

			criteria_total_score = criteria_total_score + selected_point;
			criteria_total_max_score = criteria_total_max_score + max_point;

			//Calculate the grade
			const grade_in_percentage = (selected_point / max_point) * 100;

			criteria_grades.push({
				criteria_description: assessment.rubric[i].criteria_description,
				criteria_selected_option: selected_option,
				criteria_grades_in_percentage: grade_in_percentage,
				criteria_max_score: max_point,
				criteria_total_score: selected_point,
			});
		}

		total_grade_in_percentage =
			(criteria_total_score / criteria_total_max_score) * 100;

		return {
			status: 'success',
			total_grade_in_percentage: total_grade_in_percentage,
			criteria_max_score: criteria_total_max_score,
			criteria_total_score: criteria_total_score,
			criteria_grades: criteria_grades,
		};
	} catch (error) {
		console.log(error);
		return {
			status: 'error',
			message:
				'Error occured in instructorGetAssessmentIndividualGradeService' +
				error.message,
		};
	}
}

module.exports = instructorGetAssessmentIndividualGradeService;

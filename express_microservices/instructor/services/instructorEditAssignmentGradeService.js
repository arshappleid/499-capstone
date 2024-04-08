// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const {
	AssignmentGrade,
	Instructor,
	CourseAssignment,
	Student,
	AssignmentAssessment,
	EvaluationAnswer,
	AssessmentGroupMembersTable,
	AssignmentAssessmentGroup,
} = require('../database/index');

async function instructorEditAssignmentGradeService(
	instructor_id,
	assignment_id,
	evaluatee_id,
	new_grade
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
		// Check if the instructor exists
		const instructor = await Instructor.findOne({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
		if (instructor === null) {
			return {
				status: 'error',
				message: 'Instructor does not exist',
			};
		}
		// Check if the assignment exists
		const assignment = await CourseAssignment.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assignment === null) {
			return {
				status: 'error',
				message: 'Assignment does not exist',
			};
		}

		// Check if the evaluatee exists
		const evaluatee = await Student.findOne({
			where: {
				STUDENT_ID: evaluatee_id,
			},
		});
		if (evaluatee === null) {
			return {
				status: 'error',
				message: 'Evaluatee does not exist',
			};
		}

		// get the evaluatee's group id
		const assessed_group = await AssignmentAssessmentGroup.findOne({
			where: {
				EVALUATEE_ID: evaluatee_id,
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assessed_group === null) {
			return {
				status: 'error',
				message: 'Evaluatee does not belong to any group',
			};
		}
		const group_id = assessed_group.ASSESSED_GROUP_ID;

		// get all the evaluatee's group members
		const group_members = await AssessmentGroupMembersTable.findAll({
			where: {
				ASSESSED_GROUP_ID: group_id,
			},
		});

		let evaluator_ids = [];

		for (let i = 0; i < group_members.length; i++) {
			evaluator_ids.push(group_members[i].EVALUATOR_ID);
		}

		// Check if all evaluators did the evaluation
		for (let i = 0; i < evaluator_ids.length; i++) {
			const assessment = await AssignmentAssessment.findOne({
				where: {
					ASSIGNMENT_ID: assignment_id,
					EVALUATEE_ID: evaluatee_id,
					EVALUATOR_ID: evaluator_ids[i],
				},
			});
			if (assessment === null) {
				return {
					status: 'error',
					message: 'Not all evaluators did the assessment',
				};
			}
		}

		//Check if there is a grade for the evaluatee
		const grade = await AssignmentGrade.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
				EVALUATEE_ID: evaluatee_id,
			},
		});
		if (grade === null) {
			//Insert the grade
			await AssignmentGrade.create({
				ASSIGNMENT_ID: assignment_id,
				EVALUATEE_ID: evaluatee_id,
				GRADE: new_grade,
			});
			return {
				status: 'success',
				message: 'Grade inserted successfully',
			};
		} else {
			//Update the grade
			await AssignmentGrade.update(
				{
					GRADE: new_grade,
				},
				{
					where: {
						ASSIGNMENT_ID: assignment_id,
						EVALUATEE_ID: evaluatee_id,
					},
				}
			);
			return {
				status: 'success',
				message: 'Grade updated successfully',
			};
		}
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorEditAssignmentGradeService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorEditAssignmentGradeService;

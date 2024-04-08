// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	EvaluationGrade,
	Instructor,
	EvaluationForm,
	Student,
	CourseGroupEvaluation,
	GroupMembersTable,
	EvaluationAnswer,
} = require('../database/index');

async function instructorEditGradeService(
	instructor_id,
	form_id,
	evaluatee_id,
	new_grade
) {
	if (
		instructor_id === undefined ||
		form_id === undefined ||
		evaluatee_id === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (instructor_id === '' || form_id === '' || evaluatee_id === '') {
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
		// Check if the form exists
		const form = await EvaluationForm.findOne({
			where: {
				FORM_ID: form_id,
			},
		});
		if (form === null) {
			return {
				status: 'error',
				message: 'Form does not exist',
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
		const group = await GroupMembersTable.findOne({
			where: {
				STUDENT_ID: evaluatee_id,
			},
			include: [
				{
					model: CourseGroupEvaluation,
					where: {
						COURSE_ID: form.COURSE_ID,
					},
				},
			],
		});
		if (group === null) {
			return {
				status: 'error',
				message: 'Evaluatee does not belong to the course',
			};
		}
		const group_id = group.GROUP_ID;

		// get all the evaluatee's group members
		const group_members = await GroupMembersTable.findAll({
			where: {
				GROUP_ID: group_id,
			},
		});

		let evaluator_ids = [];

		for (let i = 0; i < group_members.length; i++) {
			if (group_members[i].STUDENT_ID !== evaluatee_id) {
				evaluator_ids.push(group_members[i].STUDENT_ID);
			}
		}

		// Check if all evaluators did the evaluation
		for (let i = 0; i < evaluator_ids.length; i++) {
			const answer = await EvaluationAnswer.findOne({
				where: {
					FORM_ID: form_id,
					EVALUATEE_ID: evaluatee_id,
					EVALUATOR_ID: evaluator_ids[i],
				},
			});
			if (answer === null) {
				return {
					status: 'error',
					message: 'Not all evaluators did the evaluation',
				};
			}
		}

		//Check if there is a grade for the evaluatee
		const grade = await EvaluationGrade.findOne({
			where: {
				FORM_ID: form_id,
				EVALUATEE_ID: evaluatee_id,
			},
		});
		if (grade === null) {
			//Insert the grade
			await EvaluationGrade.create({
				FORM_ID: form_id,
				EVALUATEE_ID: evaluatee_id,
				GRADE: new_grade,
			});
			return {
				status: 'success',
				message: 'Grade inserted successfully',
			};
		} else {
			//Update the grade
			await EvaluationGrade.update(
				{
					GRADE: new_grade,
				},
				{
					where: {
						FORM_ID: form_id,
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
				'Error occured while retrieving results in instructorEditGradeService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorEditGradeService;

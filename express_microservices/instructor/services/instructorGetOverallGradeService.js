// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const e = require('express');
const {
	EvaluationForm,
	EvaluationGrade,
	GroupMembersTable,
	CourseGroupEvaluation,
} = require('../database/index');

const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');
const instructorGetIndividualGradeService = require('../services/instructorGetIndividualGradeService');

async function instructorGetOverallGradeService(
	instructor_id,
	form_id,
	evaluatee_id
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
		const formExist = await EvaluationForm.findOne({
			where: {
				FORM_ID: form_id,
			},
		});
		if (formExist === null) {
			return {
				status: 'error',
				message: 'Form id does not exist',
			};
		}
		const course_id = formExist.COURSE_ID;
		const courseExist = await checkIfCourseExistService(course_id);
		if (courseExist.status === false) {
			return {
				status: 'error',
				message: 'Course id does not exist',
			};
		}
		const instructorExist = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorExist.status === false) {
			return {
				status: 'error',
				message: 'Instructor id does not exist',
			};
		}
		const instructorTeachesCourse =
			await checkIfInstructorTeachesCourseService(
				instructor_id,
				course_id
			);
		if (instructorTeachesCourse.status === false) {
			return {
				status: 'error',
				message: 'Instructor does not teach this course',
			};
		}
		const group_id = await GroupMembersTable.findOne({
			where: {
				STUDENT_ID: evaluatee_id,
			},
			include: [
				{
					model: CourseGroupEvaluation,
					where: {
						COURSE_ID: course_id,
					},
				},
			],
		});
		if (group_id === null) {
			return {
				status: 'error',
				message: 'Student id does not exist',
			};
		}
		const group_members = await GroupMembersTable.findAll({
			where: {
				GROUP_ID: group_id.GROUP_ID,
			},
		});
		const group_member_ids = [];
		for (let i = 0; i < group_members.length; i++) {
			group_member_ids.push(group_members[i].STUDENT_ID);
		}

		let individualStudentGrade = [];
		let section_grades = [];
		let individualStudentGradeSum = 0;
		let individualStudentGradeCount = 0;

		let evaluator_ids = [];

		for (let i = 0; i < group_member_ids.length; i++) {
			if (group_member_ids[i] === evaluatee_id) {
				continue;
			}
			const individualGrade = await instructorGetIndividualGradeService(
				instructor_id,
				form_id,
				evaluatee_id,
				group_member_ids[i]
			);
			if (individualGrade.status === 'error') {
				continue;
			}

			section_grades.push(individualGrade.section_grades);

			individualStudentGrade.push(individualGrade.form_grade);
			individualStudentGradeSum += individualGrade.form_grade;
			individualStudentGradeCount += 1;
			evaluator_ids.push(group_member_ids[i]);
		}

		let section_grades_sum = [];
		let section_total_score_sum = [];
		let section_names = [];

		for (let i = 0; i < section_grades.length; i++) {
			for (let j = 0; j < section_grades[i].length; j++) {
				if (section_grades_sum[j] === undefined) {
					section_grades_sum[j] = 0;
				}
				section_grades_sum[j] +=
					section_grades[i][j].section_grade_in_percentage;
				if (section_total_score_sum[j] === undefined) {
					section_total_score_sum[j] = 0;
				}
				section_total_score_sum[j] +=
					section_grades[i][j].section_total_score;
				section_names[j] = section_grades[i][j].section_name;
			}
		}

		let section_max_score = [];

		for (let i = 0; i < section_grades_sum.length; i++) {
			section_grades_sum[i] /= section_grades.length;
			section_max_score.push(section_grades[0][i].section_max_score);
		}

		let overallGrade = 0;
		if (individualStudentGradeCount !== 0) {
			overallGrade =
				individualStudentGradeSum / individualStudentGradeCount;
		}

		if (individualStudentGrade.length === 0) {
			return {
				status: 'error',
				message: 'No one has evaluated this student yet',
			};
		}

		let section_averages = [];
		for (let i = 0; i < section_names.length; i++) {
			section_averages.push({
				section_name: section_names[i],
				section_weightage: section_grades[0][i].section_weightage,
				section_grade_in_percentage: section_grades_sum[i],
				section_total_score: section_total_score_sum[i],
				section_max_score:
					section_max_score[i] * (group_member_ids.length - 1),
			});
		}
		let evaluator_data = [];
		for (let i = 0; i < evaluator_ids.length; i++) {
			evaluator_data.push({
				evaluator_id: evaluator_ids[i],
				individual_form_grade: individualStudentGrade[i],
			});
		}

		//Check if overall grade already exists
		const gradeExist = await EvaluationGrade.findOne({
			where: {
				FORM_ID: form_id,
				EVALUATEE_ID: evaluatee_id,
			},
		});

		let editedOverAllGrade = null;

		if (gradeExist !== null) {
			editedOverAllGrade = gradeExist.GRADE;
		}

		let number_of_evaluators = await GroupMembersTable.count({
			where: {
				GROUP_ID: group_id.GROUP_ID,
			},
		});
		number_of_evaluators -= 1;

		return {
			status: 'success',
			data: {
				form_grade: overallGrade,
				edited_overall_grade: editedOverAllGrade,
				number_of_evaluators: number_of_evaluators,
				section_averages: section_averages,
				evaluator_data: evaluator_data,
			},
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetOverallGradeService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorGetOverallGradeService;

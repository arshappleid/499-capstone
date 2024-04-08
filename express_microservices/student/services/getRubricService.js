// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const {
	Student,
	Course,
	CourseAssignment,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
} = require('../database/index');

async function GetRubricService(student_id, course_id, assignment_id) {
	try {
		if (
			student_id === undefined ||
			course_id === undefined ||
			assignment_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (student_id === '' || course_id === '' || assignment_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		// Check if the student exists.
		const student = await Student.findOne({
			where: {
				student_id: student_id,
			},
		});
		if (student === null) {
			return {
				status: 'error',
				message: 'Student does not exist',
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
		//Get the rubric for the assignment
		const rubric = await AssignmentCriteria.findAll({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
			include: [
				{
					model: AssignmentCriteriaRatingOption,
				},
			],
		});
		return {
			status: 'success',
			message: 'Rubric retrieved successfully',
			rubric: rubric,
		};
	} catch (error) {
		console.log(error);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getRubricService.js: ' +
				error.message,
		};
	}
}

module.exports = GetRubricService;

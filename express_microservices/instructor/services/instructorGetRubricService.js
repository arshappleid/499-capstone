// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const {
	Instructor,
	Course,
	CourseAssignment,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
} = require('../database/index');

async function instructorGetRubricService(
	instructor_id,
	course_id,
	assignment_id
) {
	try {
		if (
			instructor_id === undefined ||
			course_id === undefined ||
			assignment_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '' || course_id === '' || assignment_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
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
		//Get the rubric
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
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetRubricService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorGetRubricService;

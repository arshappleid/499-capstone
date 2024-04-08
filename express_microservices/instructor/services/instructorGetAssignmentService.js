// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const { Instructor, Course, CourseAssignment } = require('../database/index');

const instructorGetRubricService = require('../services/instructorGetRubricService');

async function instructorGetAssignmentService(
	instructor_id,
	course_id,
	assignment_id
) {
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

	const rubric = await instructorGetRubricService(
		instructor_id,
		course_id,
		assignment_id
	);

	// Get the assignment.
	const assignmentData = await CourseAssignment.findOne({
		where: {
			course_id: course_id,
			assignment_id: assignment_id,
		},
	});

	return {
		status: 'success',
		message: 'Assignment retrieved successfully',
		assignment: assignmentData,
		rubric: rubric.rubric,
	};
}

module.exports = instructorGetAssignmentService;

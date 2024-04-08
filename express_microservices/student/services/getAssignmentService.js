// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const { Student, Course, CourseAssignment } = require('../database/index');

const getRubricService = require('../services/getRubricService');

async function getAssignmentService(student_id, course_id, assignment_id) {
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

	try {
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

		const rubric = await getRubricService(
			student_id,
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
	} catch (err) {
		console.log(err);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results getAssignmentService.js: ' +
				err.message,
		};
	}
}

module.exports = getAssignmentService;

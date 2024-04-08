// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const {
	Instructor,
	Student,
	Course,
	CourseAssignment,
	AssignmentSubmission,
} = require('../database/index');

async function instructorGetSubmissionLinkService(
	instructor_id,
	course_id,
	assignment_id,
	student_id
) {
	if (
		instructor_id === undefined ||
		course_id === undefined ||
		assignment_id === undefined ||
		student_id === undefined
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
		student_id === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if instructor exists
		const instructor = await Instructor.findAll({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
		if (instructor.length === 0) {
			return {
				status: 'error',
				message: 'Instructor does not exist',
			};
		}
		//Check if course exists
		const course = await Course.findAll({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (course.length === 0) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		//Check if assignment exists
		const assignment = await CourseAssignment.findAll({
			where: {
				COURSE_ID: course_id,
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assignment.length === 0) {
			return {
				status: 'error',
				message: 'Assignment does not exist',
			};
		}
		//Check if student exists
		const student = await Student.findAll({
			where: {
				STUDENT_ID: student_id,
			},
		});
		if (student.length === 0) {
			return {
				status: 'error',
				message: 'Student does not exist',
			};
		}

		//Check if student has submitted
		const submission = await AssignmentSubmission.findAll({
			where: {
				STUDENT_ID: student_id,
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (submission.length === 0) {
			return {
				status: 'error',
				message: 'Student has not submitted',
			};
		}

		return {
			status: 'success',
			message: submission[0].SUBMISSION_LINK,
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetSubmissionLinkService.js: ' +
				err,
		};
	}
}

module.exports = instructorGetSubmissionLinkService;

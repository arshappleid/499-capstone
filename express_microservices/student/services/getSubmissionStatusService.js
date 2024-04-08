// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const {
	Student,
	CourseAssignment,
	AssignmentSubmission,
} = require('../database/index');

async function getSubmissionStatusService(student_id, course_id) {
	if (student_id === undefined || course_id === undefined) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (student_id === '' || course_id === '') {
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
		const assignments = await CourseAssignment.findAll({
			where: {
				course_id: course_id,
			},
		});
		if (assignments.length === 0) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}

		let assignments_status = [];

		for (let i = 0; i < assignments.length; i++) {
			const assignment = assignments[i];
			const submission = await AssignmentSubmission.findOne({
				where: {
					ASSIGNMENT_ID: assignment.ASSIGNMENT_ID,
					STUDENT_ID: student_id,
				},
			});
			if (submission === null) {
				assignments_status.push({
					status: 'not submitted',
					submission_link: '',
				});
			} else {
				assignments_status.push({
					status: 'submitted',
					submission_link: submission.SUBMISSION_LINK,
				});
			}
		}

		return {
			status: 'success',
			assignments_status: assignments_status,
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getSubmissionStatusService.js: ' +
				err.message,
		};
	}
}

module.exports = getSubmissionStatusService;

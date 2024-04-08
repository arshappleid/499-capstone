// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const {
	Student,
	Instructor,
	Course,
	StudentCourse,
	CourseAssignment,
	AssignmentSubmission,
} = require('../database/index');

async function instructorGetAssignmentCompletionStatusService(
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

	try {
		// Check if instructor exists
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
		// Check if course exists
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
		// Check if assignment exists
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
		// Get all students in the course
		const courseStudents = await StudentCourse.findAll({
			where: {
				course_id: course_id,
			},
		});

		if (courseStudents.length === 0) {
			return {
				status: 'error',
				message: 'No students in the course',
			};
		}

		let studentCompletionStatus = [];

		// Check if there's a record for assignment submission for each student
		for (let i = 0; i < courseStudents.length; i++) {
			const student_id = courseStudents[i].STUDENT_ID;

			const student_info = await Student.findOne({
				where: {
					STUDENT_ID: courseStudents[i].STUDENT_ID,
				},
			});

			const assignmentSubmission = await AssignmentSubmission.findOne({
				where: {
					assignment_id: assignment_id,
					student_id: student_id,
				},
			});
			if (assignmentSubmission === null) {
				studentCompletionStatus.push({
					student_id: student_id,
					student_first_name: student_info.FIRST_NAME,
					stduent_middle_name: student_info.MIDDLE_NAME,
					student_last_name: student_info.LAST_NAME,
					deadline: assignment.DEADLINE,
					status: 'incomplete',
					submission_link: '',
				});
			} else {
				studentCompletionStatus.push({
					student_id: student_id,
					student_first_name: student_info.FIRST_NAME,
					stduent_middle_name: student_info.MIDDLE_NAME,
					student_last_name: student_info.LAST_NAME,
					deadline: assignment.DEADLINE,
					status: 'complete',
					submission_link: assignmentSubmission.SUBMISSION_LINK,
				});
			}
		}

		return {
			status: 'success',
			studentCompletionStatus: studentCompletionStatus,
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorGetAssignmentCompletionStatusService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorGetAssignmentCompletionStatusService;

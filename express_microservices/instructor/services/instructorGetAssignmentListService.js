// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	Instructor,
	Course,
	StudentCourse,
	CourseAssignment,
	AssignmentSubmission,
} = require('../database/index');

async function instructorGetAssignmentListService(instructor_id, course_id) {
	if (instructor_id === undefined || course_id === undefined) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (instructor_id === '' || course_id === '') {
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
		//Get all assignments in course
		let assignments = await CourseAssignment.findAll({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (assignments.length === 0) {
			return {
				status: 'error',
				message: 'No assignments in course',
			};
		}
		//Reformatting reutrning data
		const response = await reformatingDate(assignments);

		return {
			status: 'success',
			message: 'Successfully retrieved assignments',
			assignments: response,
		};
	} catch (error) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getAssignmentListService.js: ' +
				error,
		};
	}
}

async function reformatingDate(assignments) {
	let assignmentList = [];

	for (let i = 0; i < assignments.length; i++) {
		let assignment = {
			assignment_id: assignments[i].ASSIGNMENT_ID,
			assignment_name: assignments[i].ASSIGNMENT_NAME,
			assignment_description: assignments[i].ASSIGNMENT_DESCRIPTION,
			deadline: assignments[i].DEADLINE,
			avaliableFrom: assignments[i].AVAILABLE_FROM,
			avaliableTo: assignments[i].AVAILABLE_TO,
			shareFeedback: assignments[i].SHARE_FEEDBACK,
			visibility: assignments[i].VISIBILITY,
			submitionType: assignments[i].SUBMITION_TYPE,
		};
		assignmentList.push(assignment);
	}
	return assignmentList;
}

module.exports = instructorGetAssignmentListService;

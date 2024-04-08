// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const { CourseAssignment, AssignmentAssessment } = require('../database/index');

const checkIfInstructorIdExistService = require('./checkIfInstructorIdExistService');

async function checkIfTheresAnyFormRecords(instructor_id, assignment_id) {
	try {
		if (instructor_id === undefined || assignment_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '' || assignment_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
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
		//Check if assignment exists
		const assignment = await CourseAssignment.findAll({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assignment.length === 0) {
			return {
				status: 'error',
				message: 'Assignment does not exist',
			};
		}
		//Check if assignment has an assessment
		const recordExist = await AssignmentAssessment.findAll({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});

		if (recordExist.length > 0) {
			return {
				status: true,
				message: 'There are records for this assignment',
			};
		}
		return {
			status: false,
			message: 'There are no records for this assignment',
		};
	} catch (err) {
		console.log(err);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in checkIfTheresAnyFormRecords.js: ' +
				e.message,
		};
	}
}

module.exports = checkIfTheresAnyFormRecords;

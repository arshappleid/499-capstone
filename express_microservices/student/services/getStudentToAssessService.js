// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	Student,
	CourseAssignment,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
} = require('../database/index');

const getStudentToAssessService = async (student_id, assignment_id) => {
	if (student_id === undefined || assignment_id === undefined) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (student_id === '' || assignment_id === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		const studentExist = await Student.findOne({
			where: {
				STUDENT_ID: student_id,
			},
		});
		if (studentExist === null) {
			return {
				status: 'error',
				message: 'Student id does not exist',
			};
		}
		const assignmentExist = await CourseAssignment.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assignmentExist === null) {
			return {
				status: 'error',
				message: 'Assignment id does not exist',
			};
		}
		const studentInAssignment = await AssessmentGroupMembersTable.findAll({
			where: {
				EVALUATOR_ID: student_id,
			},
			include: [
				{
					model: AssignmentAssessmentGroup,
					where: {
						ASSIGNMENT_ID: assignment_id,
					},
				},
			],
		});

		let studentToAssess = [];

		for (let i = 0; i < studentInAssignment.length; i++) {
			studentToAssess.push(
				studentInAssignment[i].ASSIGNMENT_ASSESSMENT_GROUP.EVALUATEE_ID
			);
		}

		if (studentInAssignment === null) {
			return {
				status: 'error',
				message: 'Student is not in this assignment',
			};
		}

		return {
			status: 'success',
			studentToAssess: studentToAssess,
		};
	} catch (error) {
		return {
			status: 'error',
			message:
				'error occured while retrieving results in getStudentToAssessService' +
				error.message,
		};
	}
};

module.exports = getStudentToAssessService;

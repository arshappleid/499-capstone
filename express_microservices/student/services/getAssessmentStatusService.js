// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	Student,
	CourseAssignment,
	AssignmentAssessmentGroup,
	AssignmentAssessment,
	AssessmentGroupMembersTable,
} = require('../database/index');

const getStudentToAssessService = require('../services/getStudentToAssessService');

const getAssessmentStatusService = async (student_id, assignment_id) => {
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
		//get student to assess
		const studentToAssess = await getStudentToAssessService(
			student_id,
			assignment_id
		);
		const assignment_deadline = await CourseAssignment.findOne({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
			attributes: ['AVAILABLE_TO'],
		});

		if (studentToAssess.status === 'error') {
			return studentToAssess;
		}

		let assessmentCompleteStatusList = [];

		for (let i = 0; i < studentToAssess.studentToAssess.length; i++) {
			const evaluatee_id = studentToAssess.studentToAssess[i];
			const assessmentCompleteStatus = await AssignmentAssessment.findOne(
				{
					where: {
						EVALUATOR_ID: student_id,
						ASSIGNMENT_ID: assignment_id,
						EVALUATEE_ID: evaluatee_id,
					},
				}
			);
			if (assessmentCompleteStatus === null) {
				assessmentCompleteStatusList.push({
					evaluatee_id: evaluatee_id,
					assessment_complete: false,
					assessment_deadline: assignment_deadline.AVAILABLE_TO,
				});
			} else {
				assessmentCompleteStatusList.push({
					evaluatee_id: evaluatee_id,
					assessment_complete: true,
					assessment_deadline: assignment_deadline.AVAILABLE_TO,
				});
			}
		}

		return {
			status: 'success',
			message: 'Assessment status retrieved',
			assessment_status: assessmentCompleteStatusList,
		};
	} catch (error) {
		return {
			status: 'error',
			message:
				'error occured while retrieving results in getAssessmentStatusService.js: ' +
				error.message,
		};
	}
};

module.exports = getAssessmentStatusService;

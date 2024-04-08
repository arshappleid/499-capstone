// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const {
	Instructor,
	Course,
	CourseAssignment,
	AssignmentSubmission,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
} = require('../database/index');

async function instructorRemoveAssignmentService(
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
		//Check if instructor exists
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
		//Check if course exists
		const course = await Course.findOne({
			where: {
				course_id: course_id,
				instructor_id: instructor_id,
			},
		});
		if (course === null) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		//Check if assignment exists
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
		//Check if assignment has submissions
		const submissions = await AssignmentSubmission.findAll({
			where: {
				assignment_id: assignment_id,
			},
		});
		if (submissions.length !== 0) {
			return {
				status: 'error',
				message: 'Assignment has submissions, cannot be deleted',
			};
		}
		//get all criteria for assignment
		const criteria = await AssignmentCriteria.findAll({
			where: {
				assignment_id: assignment_id,
			},
		});
		//delete all criteria rating options for assignment
		for (let i = 0; i < criteria.length; i++) {
			await AssignmentCriteriaRatingOption.destroy({
				where: {
					CRITERIA_ID: criteria[i].CRITERIA_ID,
				},
			});
		}
		//delete all criteria for assignment
		await AssignmentCriteria.destroy({
			where: {
				assignment_id: assignment_id,
			},
		});
		//get all assessment groups for assignment
		const assessmentGroups = await AssignmentAssessmentGroup.findAll({
			where: {
				assignment_id: assignment_id,
			},
		});
		//delete all assessment group members for assignment
		for (let i = 0; i < assessmentGroups.length; i++) {
			await AssessmentGroupMembersTable.destroy({
				where: {
					ASSESSED_GROUP_ID: assessmentGroups[i].ASSESSED_GROUP_ID,
				},
			});
		}
		//delete all assessment groups for assignment
		await AssignmentAssessmentGroup.destroy({
			where: {
				assignment_id: assignment_id,
			},
		});
		//Delete assignment
		await CourseAssignment.destroy({
			where: {
				assignment_id: assignment_id,
			},
		});

		return {
			status: 'success',
			message: 'Assignment deleted successfully',
		};
	} catch (err) {
		console.log(err);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorRemoveAssignmentService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorRemoveAssignmentService;

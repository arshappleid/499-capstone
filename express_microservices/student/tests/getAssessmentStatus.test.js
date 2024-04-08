// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';

const {
	Student,
	StudentCourse,
	CourseAssignment,
	Course,
	Instructor,
	AssignmentSubmission,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
	AssignmentAssessment,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
} = require('../database/index');

const getAssessmentStatusService = require('../services/getAssessmentStatusService');

describe('Testing getAssessmentStatusService', async () => {
    const ticket_num1 = 492;
	const ticket_num2 = 4921;
	const ticket_num3 = 4922;
	const ticket_num4 = 4923;
	const ticket_num5 = 4924;

	const instructor_id = ticket_num1;
	const student_id1 = ticket_num1;
	const student_id2 = ticket_num2;
	let course_id = 0;
	let assignment_id1 = 0;
	let assignment_id2 = 0;

	let criteria_id1 = 0;
	let criteria_id2 = 0;

	let rating_option_id1 = 0;
	let rating_option_id2 = 0;

	let assessment_group_id = 0;

	beforeEach(async () => {
		await Instructor.create({
			INSTRUCTOR_ID: instructor_id,
			FIRST_NAME: 'FIRST_NAME',
			MIDDLE_NAME: 'MIDDLE_NAME',
			LAST_NAME: 'LAST_NAME',
			EMAIL: 'INSTRUCTOR' + ticket_num1 + '@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		await Student.create({
			STUDENT_ID: student_id1,
			FIRST_NAME: 'FIRST_NAME',
			MIDDLE_NAME: 'MIDDLE_NAME',
			LAST_NAME: 'LAST_NAME',
			EMAIL: 'STUDENT' + ticket_num1 + '@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		await Student.create({
			STUDENT_ID: student_id2,
			FIRST_NAME: 'FIRST_NAME',
			MIDDLE_NAME: 'MIDDLE_NAME',
			LAST_NAME: 'LAST_NAME',
			EMAIL: 'STUDENT' + ticket_num2 + '@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		const courseCreated = await Course.create({
			INSTRUCTOR_ID: instructor_id,
			COURSE_NAME: 'TEST_COURSE_NAME' + ticket_num1,
			COURSE_CODE: 'COURSE_CODE' + ticket_num1,
			COURSE_SEMESTER: 'COURSE_SEMESTER' + ticket_num1,
			COURSE_YEAR: 'COURSE_YEAR' + ticket_num1,
			COURSE_TERM: 'COURSE_TERM' + ticket_num1,
			COURSE_VISIBILITY: 0,
		});
		course_id = courseCreated.get('COURSE_ID');
		await StudentCourse.create({
			STUDENT_ID: student_id1,
			COURSE_ID: course_id,
		});
		const assignmentCreated1 = await CourseAssignment.create({
			COURSE_ID: course_id,
			ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME' + ticket_num1,
			DEADLINE: '2021-04-30 23:59:59',
			AVAILABLE_FROM: '2021-04-30 23:59:59',
			AVAILABLE_TO: '2021-04-30 23:59:59',
			ASSIGNMENT_DESCRIPTION: 'TEST_ASSIGNMENT_DESCRIPTION' + ticket_num1,
			SUBMISSION_TYPE: 'TEST_SUBMISSION_TYPE' + ticket_num1,
			SHARE_FEEDBACK: 0,
			VISIBILITY: 0,
		});
		assignment_id1 = assignmentCreated1.get('ASSIGNMENT_ID');
		const assignmentCreated2 = await CourseAssignment.create({
			COURSE_ID: course_id,
			ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME' + ticket_num2,
			DEADLINE: '2021-04-30 23:59:59',
			AVAILABLE_FROM: '2021-04-30 23:59:59',
			AVAILABLE_TO: '2021-04-30 23:59:59',
			ASSIGNMENT_DESCRIPTION: 'TEST_ASSIGNMENT_DESCRIPTION' + ticket_num2,
			SUBMISSION_TYPE: 'TEST_SUBMISSION_TYPE' + ticket_num2,
			SHARE_FEEDBACK: 0,
			VISIBILITY: 0,
		});
		assignment_id2 = assignmentCreated2.get('ASSIGNMENT_ID');
		const assignmentCriteriaCreated1 = await AssignmentCriteria.create({
			ASSIGNMENT_ID: assignment_id1,
			CRITERIA_DESCRIPTION: 'TEST_CRITERIA_NAME' + ticket_num1,
		});
		criteria_id1 = assignmentCriteriaCreated1.get('CRITERIA_ID');
		const assignmentCriteriaCreated2 = await AssignmentCriteria.create({
			ASSIGNMENT_ID: assignment_id2,
			CRITERIA_DESCRIPTION: 'TEST_CRITERIA_NAME' + ticket_num2,
		});
		criteria_id2 = assignmentCriteriaCreated2.get('CRITERIA_ID');
		const assignmentCriteriaRatingOptionCreated1 =
			await AssignmentCriteriaRatingOption.create({
				CRITERIA_ID: criteria_id1,
				OPTION_DESCRIPTION: 'TEST_OPTION_DESCRIPTION' + ticket_num1,
				OPTION_POINT: 1,
			});
		rating_option_id1 =
			assignmentCriteriaRatingOptionCreated1.get('OPTION_ID');
		const assignmentCriteriaRatingOptionCreated2 =
			await AssignmentCriteriaRatingOption.create({
				CRITERIA_ID: criteria_id2,
				OPTION_DESCRIPTION: 'TEST_OPTION_DESCRIPTION' + ticket_num2,
				OPTION_POINT: 1,
			});
		rating_option_id2 =
			assignmentCriteriaRatingOptionCreated2.get('OPTION_ID');
		await AssignmentSubmission.create({
			ASSIGNMENT_ID: assignment_id1,
			STUDENT_ID: student_id1,
			SUBMISSION_LINK: 'TEST_SUBMISSION_LINK' + ticket_num1,
		});
		const assessmentGroupCreated = await AssignmentAssessmentGroup.create({
			ASSIGNMENT_ID: assignment_id1,
			EVALUATEE_ID: student_id1,
		});
		assessment_group_id = assessmentGroupCreated.get('ASSESSED_GROUP_ID');
		await AssessmentGroupMembersTable.create({
			EVALUATOR_ID: student_id2,
			ASSESSED_GROUP_ID: assessment_group_id,
		});
		await AssignmentAssessment.create({
			ASSIGNMENT_ID: assignment_id1,
			EVALUATOR_ID: student_id2,
			EVALUATEE_ID: student_id1,
			CRITERIA_ID: criteria_id1,
			OPTION_ID: rating_option_id1,
		});
	});
	afterEach(async () => {
		await AssignmentAssessment.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id1,
			},
		});
		await AssessmentGroupMembersTable.destroy({
			where: {
				ASSESSED_GROUP_ID: assessment_group_id,
			},
		});
		await AssignmentAssessmentGroup.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id1,
			},
		});
		await AssignmentSubmission.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id1,
			},
		});
		await AssignmentCriteriaRatingOption.destroy({
			where: {
				CRITERIA_ID: criteria_id1,
			},
		});
		await AssignmentCriteriaRatingOption.destroy({
			where: {
				CRITERIA_ID: criteria_id2,
			},
		});
		await AssignmentCriteria.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id1,
			},
		});
		await AssignmentCriteria.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id2,
			},
		});
		await CourseAssignment.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id1,
			},
		});
		await CourseAssignment.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id2,
			},
		});
		await StudentCourse.destroy({
			where: {
				STUDENT_ID: student_id1,
			},
		});
		await Course.destroy({
			where: {
				COURSE_ID: course_id,
			},
		});
		await Student.destroy({
			where: {
				STUDENT_ID: student_id2,
			},
		});
		await Student.destroy({
			where: {
				STUDENT_ID: student_id1,
			},
		});
		await Instructor.destroy({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
	});
    test('Undefined values passed to Service Function', async () => {
		const reslut = await getAssessmentStatusService(
			undefined,
			undefined
		);
		expect(reslut.status).toBe('error');
		expect(reslut.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty values passed', async () => {
		const reslut = await getAssessmentStatusService(
			'',
			''
		);
		expect(reslut.status).toBe('error');
		expect(reslut.message).toBe('Empty values passed');
	});
    test('Student does not exist', async () => {
		const reslut = await getAssessmentStatusService(
			0,
            assignment_id1
		);
		expect(reslut.status).toBe('error');
		expect(reslut.message).toBe('Student id does not exist');
	});
    test('Assignment does not exist', async () => {
        const reslut = await getAssessmentStatusService(
            student_id1,
            0
        );
        expect(reslut.status).toBe('error');
        expect(reslut.message).toBe('Assignment id does not exist');
    });
    test('Get Successfully', async () => {
        const reslut = await getAssessmentStatusService(
            student_id2,
            assignment_id1
        );
        expect(reslut.status).toBe('success');

        expect(reslut.assessment_status[0].evaluatee_id).toBe(student_id1);
    });
    test('Get Successfully', async () => {
        const reslut = await getAssessmentStatusService(
            student_id1,
            assignment_id1
        );
        expect(reslut.status).toBe('success');
        expect(reslut.assessment_status.length).toBe(0);
    });
});
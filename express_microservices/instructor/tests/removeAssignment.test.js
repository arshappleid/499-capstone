// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect, afterEach } from 'vitest';
const {
    Student,
    StudentCourse,
	CourseAssignment,
	Course,
	Instructor,
    AssignmentSubmission,
    AssignmentCriteria,
    AssignmentCriteriaRatingOption,
} = require('../database/index');

const instructorRemoveAssignmentService = require('../services/instructorRemoveAssignmentService');

describe('instructorRemoveAssignment', () => {
    const ticket_num1 = 457;
    const ticket_num2 = 4571;
    const ticket_num3 = 4572;
    const ticket_num4 = 4573;
    const ticket_num5 = 4574;


	const instructor_id = ticket_num1;
    const student_id1 = ticket_num1;
	let course_id;
	let assignment_id1;
    let assignment_id2;

    let criteria_id1;
    let criteria_id2;

    let rating_option_id1;
    let rating_option_id2;

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
        const assignmentCriteriaRatingOptionCreated1 = await AssignmentCriteriaRatingOption.create({
            CRITERIA_ID: criteria_id1,
            OPTION_DESCRIPTION: 'TEST_OPTION_DESCRIPTION' + ticket_num1,
            OPTION_POINT: 1,
        });
        rating_option_id1 = assignmentCriteriaRatingOptionCreated1.get('RATING_OPTION_ID');
        const assignmentCriteriaRatingOptionCreated2 = await AssignmentCriteriaRatingOption.create({
            CRITERIA_ID: criteria_id2,
            OPTION_DESCRIPTION: 'TEST_OPTION_DESCRIPTION' + ticket_num2,
            OPTION_POINT: 1,
        });
        rating_option_id2 = assignmentCriteriaRatingOptionCreated2.get('RATING_OPTION_ID');
        await AssignmentSubmission.create({
            ASSIGNMENT_ID: assignment_id1,
            STUDENT_ID: student_id1,
            SUBMISSION_LINK: 'TEST_SUBMISSION_LINK' + ticket_num1,
        });
	});
    afterEach(async () => {
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
                STUDENT_ID: student_id1,
            },
        });
		await Instructor.destroy({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
	});

    test('Undefined values passed to Service Function' , async () => {
        const result = await instructorRemoveAssignmentService();
        expect(result.status).toBe('error');
        expect(result.message).toBe('Undefined values passed to Service Function');
    });
    test('Empty values passed' , async () => {
        const result = await instructorRemoveAssignmentService('', '', '');
        expect(result.status).toBe('error');
        expect(result.message).toBe('Empty values passed');
    });
    test('instructor not exist' , async () => {
        const result = await instructorRemoveAssignmentService(0, course_id, assignment_id2);
        expect(result.status).toBe('error');
        expect(result.message).toBe('Instructor does not exist');
    });
    test('course not exist' , async () => {
        const result = await instructorRemoveAssignmentService(instructor_id, 0, assignment_id2);
        expect(result.status).toBe('error');
        expect(result.message).toBe('Course does not exist');
    });
    test('assignment not exist' , async () => {
        const result = await instructorRemoveAssignmentService(instructor_id, course_id, 0);
        expect(result.status).toBe('error');
        expect(result.message).toBe('Assignment does not exist');
    });
    test('Assignment has submissions, cannot be deleted' , async () => {
        const result = await instructorRemoveAssignmentService(instructor_id, course_id, assignment_id1);
        expect(result.status).toBe('error');
        expect(result.message).toBe('Assignment has submissions, cannot be deleted');
    });
    test('Assignment deleted successfully' , async () => {
        const result = await instructorRemoveAssignmentService(instructor_id, course_id, assignment_id2);
        expect(result.status).toBe('success');
        expect(result.message).toBe('Assignment deleted successfully');
    });
});
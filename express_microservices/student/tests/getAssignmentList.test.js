// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';

const {
	Instructor,
	Student,
	Course,
	StudentCourse,
	CourseAssignment,
    AssignmentSubmission,
} = require('../database/index');

const getAssignmentListService = require('../services/getAssignmentListService');

describe('getAssignmentListService', async () => {
    const instructor_id = 3356;
    const student_id = 3356;

    let course_id;
    let assignment_id1;
    let assignment_id2;

    beforeEach(async () => {
        try {
            await Instructor.create({
                INSTRUCTOR_ID: instructor_id,
                FIRST_NAME: 'FIRST_NAME3356',
                MIDDLE_NAME: 'MIDDLE_NAME3356',
                LAST_NAME: 'LAST_NAME3356',
                EMAIL: 'TEST3356@INSTRUCTOR.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            await Student.create({
                STUDENT_ID: student_id,
                FIRST_NAME: 'FIRST_NAME3356',
                MIDDLE_NAME: 'MIDDLE_NAME3356',
                LAST_NAME: 'LAST_NAME3356',
                EMAIL: 'TEST3356@STUDENT.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            const courseCreated = await Course.create({
                INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3356',
				COURSE_CODE: 'COURSE_CODE3356',
				COURSE_SEMESTER: 'COURSE_SEMESTE3356',
				COURSE_YEAR: 'COURSE_YEAR3356',
				COURSE_TERM: 'COURSE_TERM3356',
				COURSE_VISIBILITY: 0,
			});
            course_id = courseCreated.COURSE_ID;
            await StudentCourse.create({
                STUDENT_ID: student_id,
                COURSE_ID: course_id,
            });
            const assignmentCreated1 = await CourseAssignment.create({
                COURSE_ID: course_id,
                ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME33561',
                ASSIGNMENT_DESCRIPTION: 'TEST_ASSIGNMENT_DESCRIPTION33561',
                SUBMISSION_TYPE: 'TEST_ASSIGNMENT_TYPE33561',
                VISIBILITY: 1,
            });
            assignment_id1 = assignmentCreated1.ASSIGNMENT_ID;
            const assignmentCreated2 = await CourseAssignment.create({
                COURSE_ID: course_id,
                ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME33562',
                ASSIGNMENT_DESCRIPTION: 'TEST_ASSIGNMENT_DESCRIPTION33562',
                SUBMISSION_TYPE: 'TEST_ASSIGNMENT_TYPE33562',
                VISIBILITY: 1,
            });
            assignment_id2 = assignmentCreated2.ASSIGNMENT_ID;
            await AssignmentSubmission.create({
                ASSIGNMENT_ID: assignment_id1,
                STUDENT_ID: student_id,
                SUBMISSION_LINK: 'TEST_SUBMISSION_LINK33561',
            });
        } catch (err) {
            console.log(err);
        }
    });
    afterEach(async () => {
        try {
            await AssignmentSubmission.destroy({
                where: {
                    ASSIGNMENT_ID: assignment_id1,
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
                    STUDENT_ID: student_id,
                    COURSE_ID: course_id,
                },
            });
            await Course.destroy({
                where: {
                    COURSE_ID: course_id,
                },
            });
            await Instructor.destroy({
                where: {
                    INSTRUCTOR_ID: instructor_id,
                },
            });
            await Student.destroy({
                where: {
                    STUDENT_ID: student_id,
                },
            });
        } catch (err) {
            console.log(err);
        }
    });
    test('Undefined values passed to Service Function', async () => {
        const response = await getAssignmentListService(undefined, undefined);

        expect(response.status).toBe('error');
        expect(response.message).toBe("Undefined values passed to Service Function");
    });
    test('getAssignmentListService', async () => {
        const response = await getAssignmentListService("", "");

        expect(response.status).toBe('error');
        expect(response.message).toBe("Empty values passed");
    });
    test('getAssignmentListService', async () => {
        const response = await getAssignmentListService(0, course_id);

        expect(response.status).toBe('error');
        expect(response.message).toBe("Student does not exist");
    });
    test('getAssignmentListService', async () => {
        const response = await getAssignmentListService(student_id, 0);

        expect(response.status).toBe('error');
        expect(response.message).toBe("Course does not exist");
    });
    test('getAssignmentListService', async () => {
        const response = await getAssignmentListService(student_id, course_id);

        expect(response.status).toBe('success');
        expect(response.assignments.length).toBe(2);
        expect(response.assignments[0].assignment_id).toBe(assignment_id1);
        expect(response.assignments[0].assignment_completed).toBe(true);
    });
});


// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect, afterEach } from 'vitest';
const {
    CourseAssignment,
    Course,
    Student,
    Instructor,
    StudentCourse,
    AssignmentAssessmentGroup,
    AssessmentGroupMembersTable,
} = require('../database/index');

const instructorCreateAssignmentService = require('../services/instructorCreateAssignmentService');

describe('instructorCreateAssignment', () => {
    const instructor_id = 3347;
    const student_id1 = 33471;
    const student_id2 = 33472;
    const student_id3 = 33473;
    const student_id4 = 33474;
    const student_id5 = 33475;
    const student_id6 = 33476;
    const student_id7 = 33477;
    const student_id8 = 33478;
    const student_id9 = 33479;
    let course_id;
    let assignment_id1;
    let assignment_id2 = 0;

    beforeEach(async () => {
        await Instructor.create({
            INSTRUCTOR_ID: instructor_id,
            FIRST_NAME: 'FIRST_NAME3347',
            MIDDLE_NAME: 'MIDDLE_NAME3347',
            LAST_NAME: 'LAST_NAME3347',
            EMAIL: 'INSTRUCTOR3347@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id1,
            FIRST_NAME: 'FIRST_NAME33471',
            MIDDLE_NAME: 'MIDDLE_NAME33471',
            LAST_NAME: 'LAST_NAME33471',
            EMAIL: 'STUDENT33471@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });  
        await Student.create({
            STUDENT_ID: student_id2,
            FIRST_NAME: 'FIRST_NAME33472',
            MIDDLE_NAME: 'MIDDLE_NAME33472',
            LAST_NAME: 'LAST_NAME33472',
            EMAIL: 'STUDENT33472@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id3,
            FIRST_NAME: 'FIRST_NAME33473',
            MIDDLE_NAME: 'MIDDLE_NAME33473',
            LAST_NAME: 'LAST_NAME33473',
            EMAIL: 'STUDENT33473@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id4,
            FIRST_NAME: 'FIRST_NAME33474',
            MIDDLE_NAME: 'MIDDLE_NAME33474',
            LAST_NAME: 'LAST_NAME33474',
            EMAIL: 'STUDENT33474@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id5,
            FIRST_NAME: 'FIRST_NAME33475',
            MIDDLE_NAME: 'MIDDLE_NAME33475',
            LAST_NAME: 'LAST_NAME33475',
            EMAIL: 'STUDENT33475@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id6,
            FIRST_NAME: 'FIRST_NAME33476',
            MIDDLE_NAME: 'MIDDLE_NAME33476',
            LAST_NAME: 'LAST_NAME33476',
            EMAIL: 'STUDENT33476@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id7,
            FIRST_NAME: 'FIRST_NAME33477',
            MIDDLE_NAME: 'MIDDLE_NAME33477',
            LAST_NAME: 'LAST_NAME33477',
            EMAIL: 'STUDENT33477@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id8,
            FIRST_NAME: 'FIRST_NAME33478',
            MIDDLE_NAME: 'MIDDLE_NAME33478',
            LAST_NAME: 'LAST_NAME33478',
            EMAIL: 'STUDENT33478@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        await Student.create({
            STUDENT_ID: student_id9,
            FIRST_NAME: 'FIRST_NAME33479',
            MIDDLE_NAME: 'MIDDLE_NAME33479',
            LAST_NAME: 'LAST_NAME33479',
            EMAIL: 'STUDENT33479@TEST.COM',
            MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
        });
        const courseCreated = await Course.create({
            INSTRUCTOR_ID: instructor_id,
            COURSE_NAME: 'TEST_COURSE_NAME-3347',
            COURSE_CODE: 'COURSE_CODE-3347',
            COURSE_SEMESTER: 'COURSE_SEMESTER-3347',
            COURSE_YEAR: 'COURSE_YEAR-3347',
            COURSE_TERM: 'COURSE_TERM-3347',
            COURSE_VISIBILITY: 0,
            EXTERNAL_COURSE_LINK: 'https://EXTERNAL_COURSE_LINK-3347',
        });
        course_id = courseCreated.COURSE_ID;
        await StudentCourse.create({
            STUDENT_ID: student_id1,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id2,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id3,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id4,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id5,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id6,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id7,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id8,
            COURSE_ID: course_id,
        });
        await StudentCourse.create({
            STUDENT_ID: student_id9,
            COURSE_ID: course_id,
        });
        const assignmentCreated1 = await CourseAssignment.create({
            COURSE_ID: course_id,
            ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME-3347',
            DEADLINE: '2020-01-01 00:00:00',
            AVAILABLE_FROM: '2020-01-01 00:00:00',
            AVAILABLE_TO: '2020-01-01 00:00:00',
        });
        assignment_id1 = assignmentCreated1.ASSIGNMENT_ID;
    });
    afterEach(async () => {
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id1,
            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id2,
            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id3,

            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id4,
            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id5,
            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id6,
            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id7,
            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id8,
            },
        });
        await AssessmentGroupMembersTable.destroy({
            where: {
                EVALUATOR_ID: student_id9,
            },
        });
        await AssignmentAssessmentGroup.destroy({
            where: {
                ASSIGNMENT_ID: assignment_id1,
            },
        });
        await AssignmentAssessmentGroup.destroy({
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
                COURSE_ID: course_id,
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
        await Student.destroy({
            where: {
                STUDENT_ID: student_id2,
            },
        });
        await Student.destroy({
            where: {
                STUDENT_ID: student_id3,
            },
        });
        await Student.destroy({
            where: {
                STUDENT_ID: student_id4,
            },
        });
        await Student.destroy({
            where: {
                STUDENT_ID: student_id5,
            },
        });
        await Student.destroy({
            where: {
                STUDENT_ID: student_id6,
            },
        });
        await Student.destroy({
            where: {
                STUDENT_ID: student_id7,
            },
        });
        await Student.destroy({
            where: {
                STUDENT_ID: student_id8,
            },
        });
        await Student.destroy({
            where: {
                STUDENT_ID: student_id9,
            },
        });
        await Instructor.destroy({
            where: {
                INSTRUCTOR_ID: instructor_id,
            },
        });
    });

    test('Undefined values passed to Service Function', async () => {
		const assignments = await instructorCreateAssignmentService(
			undefined,
			undefined,
            undefined,
            undefined,
			undefined,
            undefined,
            undefined,
			undefined
		);
		expect(assignments.status).toBe('error');
		expect(assignments.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
    test('Empty values passed', async () => {
        const assignments = await instructorCreateAssignmentService(
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        );
        expect(assignments.status).toBe('error');
        expect(assignments.message).toBe(
            'Empty values passed'
        );
    });
    test('Instructor does not exist', async () => {
        const assignments = await instructorCreateAssignmentService(
            '0',
            course_id,
            'TEST_ASSIGNMENT_NAME-3347',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            undefined,
            3,
        );
        expect(assignments.status).toBe('error');
        expect(assignments.message).toBe(
            'Instructor does not exist'
        );
    });
    test('Course does not exist', async () => {
        const assignments = await instructorCreateAssignmentService(
            instructor_id,
            '0',
            'TEST_ASSIGNMENT_NAME-3347',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            undefined,
            3,
        );
        expect(assignments.status).toBe('error');
        expect(assignments.message).toBe(
            'Course does not exist'
        );
    });
    test('Assignment name already exists', async () => {
        const assignments = await instructorCreateAssignmentService(
            instructor_id,
            course_id,
            'TEST_ASSIGNMENT_NAME-3347',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            undefined,
            3,
        );
        expect(assignments.status).toBe('error');
        expect(assignments.message).toBe(
            'Assignment name is not unique'
        );
    });
    test('Assignment created successfully', async () => {
        const assignments = await instructorCreateAssignmentService(
            instructor_id,
            course_id,
            'TEST_ASSIGNMENT_NAME-33472',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            '2020-01-01 00:00:00',
            undefined,
            3,
        );

        assignment_id2 = assignments.assignment_id;

        expect(assignments.status).toBe('success');
        expect(assignments.message).toBe(
            'Assignment created successfully'
        );

        const groups = await AssignmentAssessmentGroup.findAll({
            where: {
                ASSIGNMENT_ID: assignment_id2,
            },
        });

        expect(groups.length).toBe(9);

        for (let i = 0; i < groups.length; i++) {
            expect(groups[i].ASSIGNMENT_ID).toBe(assignment_id2);
            const group_members = await AssessmentGroupMembersTable.findAll({
                where: {
                    ASSESSED_GROUP_ID: groups[i].ASSESSED_GROUP_ID,
                },
            });
            expect(group_members.length).toBe(3);
        }

    });
});
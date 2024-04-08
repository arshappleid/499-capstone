// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect, afterEach } from 'vitest';
const {
	CourseAssignment,
	Course,
	Instructor,
	EvaluationForm,
} = require('../database/index');

const instructorSetAssignmentVisibilityService = require('../services/instructorSetAssignmentVisibilityService');

describe('instructorSetAssignmentVisibility', () => {
	const instructor_id = 453;
	let course_id;
	let assignment_id;

	beforeEach(async () => {
		await Instructor.create({
			INSTRUCTOR_ID: instructor_id,
			FIRST_NAME: 'FIRST_NAME',
			MIDDLE_NAME: 'MIDDLE_NAME',
			LAST_NAME: 'LAST_NAME',
			EMAIL: 'INSTRUCTOR453@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		const courseCreated = await Course.create({
			INSTRUCTOR_ID: instructor_id,
			COURSE_NAME: 'TEST_COURSE_NAME-453',
			COURSE_CODE: 'COURSE_CODE-453',
			COURSE_SEMESTER: 'COURSE_SEMESTER-453',
			COURSE_YEAR: 'COURSE_YEAR-453',
			COURSE_TERM: 'COURSE_TERM-453',
			COURSE_VISIBILITY: 0,
		});
		course_id = courseCreated.get('COURSE_ID');
		const assignmentCreated = await CourseAssignment.create({
			COURSE_ID: course_id,
			ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME453',
			DEADLINE: '2021-04-30 23:59:59',
			AVAILABLE_FROM: '2021-04-30 23:59:59',
			AVAILABLE_TO: '2021-04-30 23:59:59',
			ASSIGNMENT_DESCRIPTION: 'TEST_ASSIGNMENT_DESCRIPTION',
			SUBMISSION_TYPE: 'TEST_SUBMISSION_TYPE',
			SHARE_FEEDBACK: 0,
			VISIBILITY: 0,
		});
		assignment_id = assignmentCreated.get('ASSIGNMENT_ID');
	});
	afterEach(async () => {
		await CourseAssignment.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id,
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
	});
	test('Undefined values passed to Service Function', async () => {
		const result = await instructorSetAssignmentVisibilityService(
			undefined,
			undefined,
			undefined,
			undefined
		);
		expect(result).toEqual({
			status: 'error',
			message: 'Undefined values passed to Service Function',
		});
	});
	test('Empty values passed', async () => {
		const result = await instructorSetAssignmentVisibilityService(
			'',
			'',
			'',
			''
		);
		expect(result).toEqual({
			status: 'error',
			message: 'Empty values passed',
		});
	});
	test('instructor not exist', async () => {
		const result = await instructorSetAssignmentVisibilityService(
			0,
			course_id,
			assignment_id,
			1
		);
		expect(result).toEqual({
			status: 'error',
			message: 'Instructor does not exist',
		});
	});
	test('course not exist', async () => {
		const result = await instructorSetAssignmentVisibilityService(
			instructor_id,
			0,
            assignment_id,
            1
		);
		expect(result).toEqual({
			status: 'error',
			message: 'Course does not exist',
		});
	});
    test('assignment not exist', async () => {
        const result = await instructorSetAssignmentVisibilityService(
            instructor_id,
            course_id,
            0,
            1
        );
        expect(result).toEqual({
            status: 'error',
            message: 'Assignment does not exist',
        });
    });
    test('set successfully', async () => {
        const result = await instructorSetAssignmentVisibilityService(
            instructor_id,
            course_id,
            assignment_id,
            1
        );
        expect(result).toEqual({
            status: 'success',
            message: 'Assignment visibility updated',
        });
    });
});

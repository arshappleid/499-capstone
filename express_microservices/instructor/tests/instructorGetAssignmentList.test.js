// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect, afterEach } from 'vitest';
const {
	CourseAssignment,
	Course,
	Instructor,
	EvaluationForm,
} = require('../database/index');

const instructorGetAssignmentListService = require('../services/instructorGetAssignmentListService');

describe('instructorGetAssignmentList', () => {
	const instructor_id = 447;
	let course_id;
	let assignment_id;

	beforeEach(async () => {
		await Instructor.create({
			INSTRUCTOR_ID: instructor_id,
			FIRST_NAME: 'FIRST_NAME',
			MIDDLE_NAME: 'MIDDLE_NAME',
			LAST_NAME: 'LAST_NAME',
			EMAIL: 'INSTRUCTOR447@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		const courseCreated = await Course.create({
			INSTRUCTOR_ID: instructor_id,
			COURSE_NAME: 'TEST_COURSE_NAME-447',
			COURSE_CODE: 'COURSE_CODE-447',
			COURSE_SEMESTER: 'COURSE_SEMESTER-447',
			COURSE_YEAR: 'COURSE_YEAR-447',
			COURSE_TERM: 'COURSE_TERM-447',
			COURSE_VISIBILITY: 0,
		});
		course_id = courseCreated.get('COURSE_ID');
		const assignmentCreated = await CourseAssignment.create({
			COURSE_ID: course_id,
			ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME447',
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
		const result = await instructorGetAssignmentListService(
			undefined,
			undefined
		);
		expect(result).toEqual({
			status: 'error',
			message: 'Undefined values passed to Service Function',
		});
	});
	test('Empty values passed', async () => {
		const result = await instructorGetAssignmentListService('', '');
		expect(result).toEqual({
			status: 'error',
			message: 'Empty values passed',
		});
	});
	test('instructor not exist', async () => {
		const result = await instructorGetAssignmentListService(0, course_id);
		expect(result).toEqual({
			status: 'error',
			message: 'Instructor does not exist',
		});
	});
	test('course not exist', async () => {
		const result = await instructorGetAssignmentListService(
			instructor_id,
			0
		);
		expect(result).toEqual({
			status: 'error',
			message: 'Course does not exist',
		});
	});
	test('Get successfully', async () => {
		const result = await instructorGetAssignmentListService(
			instructor_id,
			course_id
		);
		expect(result.status).toEqual('success');
        expect(result.message).toEqual('Successfully retrieved assignments');
        expect(result.assignments[0].assignment_id).toEqual(assignment_id);
        expect(result.assignments.length).toEqual(1);
	});
});

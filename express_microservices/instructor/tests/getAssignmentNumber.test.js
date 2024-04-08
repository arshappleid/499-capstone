// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect, afterEach } from 'vitest';
const {
	CourseAssignment,
	Course,
	Instructor,
	EvaluationForm,
} = require('../database/index');

const getAssignmentNumberService = require('../services/getAssignmentNumberService');

describe('getAssignmentList', () => {
	const instructor_id = 3137;
	let course_id;
	let assignment_id;
	let form_id;

	beforeEach(async () => {
		await Instructor.create({
			INSTRUCTOR_ID: instructor_id,
			FIRST_NAME: 'FIRST_NAME',
			MIDDLE_NAME: 'MIDDLE_NAME',
			LAST_NAME: 'LAST_NAME',
			EMAIL: 'INSTRUCTOR3107@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		const courseCreated = await Course.create({
			INSTRUCTOR_ID: instructor_id,
			COURSE_NAME: 'TEST_COURSE_NAME-3107',
			COURSE_CODE: 'COURSE_CODE-3107',
			COURSE_SEMESTER: 'COURSE_SEMESTER-3107',
			COURSE_YEAR: 'COURSE_YEAR-3107',
			COURSE_TERM: 'COURSE_TERM-3107',
			COURSE_VISIBILITY: 0,
		});
		course_id = courseCreated.get('COURSE_ID');
		const formCreated = await EvaluationForm.create({
			FORM_NAME: 'TEST_FORM_NAME',
			COURSE_ID: course_id,
			DEADLINE: '2021-04-30 23:59:59',
			SHARE_FEEDBACK: 1,
		});
		form_id = formCreated.get('FORM_ID');
		const assignmentCreated = await CourseAssignment.create({
			COURSE_ID: course_id,
			ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME',
			DEADLINE: '2021-04-30 23:59:59',
			FORM_ID: form_id,
		});
		assignment_id = assignmentCreated.get('ASSIGNMENT_ID');
	});
	afterEach(async () => {
		await CourseAssignment.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});
		await EvaluationForm.destroy({
			where: {
				FORM_ID: form_id,
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
	test('Get with undefined values', async () => {
		const assignments = await getAssignmentNumberService(
			undefined,
			undefined
		);
		expect(assignments.status).toBe('error');
		expect(assignments.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Get with empty values', async () => {
		const assignments = await getAssignmentNumberService('', '');
		expect(assignments.status).toBe('error');
		expect(assignments.message).toBe('Empty values passed');
	});
	test('Course does not exist', async () => {
		const assignments = await getAssignmentNumberService(instructor_id, -1);
		expect(assignments.status).toBe('error');
		expect(assignments.message).toBe('Course does not exist');
	});
	test('Instructor does not exist', async () => {
		const assignments = await getAssignmentNumberService(-1, course_id);
		expect(assignments.status).toBe('error');
		expect(assignments.message).toBe('Instructor id does not exist');
	});
	test('Get successfully', async () => {
		const assignments = await getAssignmentNumberService(
			instructor_id,
			course_id
		);
		expect(assignments.status).toBe('success');
		expect(assignments.data).toBe(1);
	});
});

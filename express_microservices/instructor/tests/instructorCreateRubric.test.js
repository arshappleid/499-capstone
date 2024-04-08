// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect, afterEach } from 'vitest';
const {
	CourseAssignment,
	Course,
	Student,
	Instructor,
	StudentCourse,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
} = require('../database/index');

const instrcutorCreateRubricService = require('../services/instructorCreateRubricService');

describe('Test instructorCreateRubricService', () => {
	const instructor_id = 425;
	const student_id = 425;
	let course_id;
	let assignment_id = 0;
	let criteria_id = 0;

	beforeEach(async () => {
		await Instructor.create({
			INSTRUCTOR_ID: instructor_id,
			FIRST_NAME: 'FIRST_NAME425',
			MIDDLE_NAME: 'MIDDLE_NAME425',
			LAST_NAME: 'LAST_NAME425',
			EMAIL: 'INSTRUCTOR425@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		await Student.create({
			STUDENT_ID: student_id,
			FIRST_NAME: 'FIRST_NAME425',
			MIDDLE_NAME: 'MIDDLE_NAME425',
			LAST_NAME: 'LAST_NAME425',
			EMAIL: 'STUDENT425@TEST.COM',
			MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
		});
		const courseCreated = await Course.create({
			INSTRUCTOR_ID: instructor_id,
			COURSE_NAME: 'TEST_COURSE_NAME-425',
			COURSE_CODE: 'COURSE_CODE-425',
			COURSE_SEMESTER: 'COURSE_SEMESTER-425',
			COURSE_YEAR: 'COURSE_YEAR-425',
			COURSE_TERM: 'COURSE_TERM-425',
			COURSE_VISIBILITY: 0,
			EXTERNAL_COURSE_LINK: 'https://EXTERNAL_COURSE_LINK-425',
		});
		course_id = courseCreated.COURSE_ID;
		await StudentCourse.create({
			STUDENT_ID: student_id,
			COURSE_ID: course_id,
		});
		const assignmentCreated = await CourseAssignment.create({
			COURSE_ID: course_id,
			ASSIGNMENT_NAME: 'TEST_ASSIGNMENT_NAME-3347',
			DEADLINE: '2020-01-01 00:00:00',
			AVAILABLE_FROM: '2020-01-01 00:00:00',
			AVAILABLE_TO: '2020-01-01 00:00:00',
		});
		assignment_id = assignmentCreated.ASSIGNMENT_ID;
	});
	afterEach(async () => {
		await AssignmentCriteriaRatingOption.destroy({
			where: {
				CRITERIA_ID: criteria_id,
			},
		});
		await AssignmentCriteria.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});
		await CourseAssignment.destroy({
			where: {
				ASSIGNMENT_ID: assignment_id,
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
	});
	test('Undefined values passed to Service Function', async () => {
		const response = await instrcutorCreateRubricService(
			undefined,
			undefined,
			undefined,
			undefined
		);
		expect(response.status).toBe('error');
		expect(response.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty values passed', async () => {
		const response = await instrcutorCreateRubricService('', '', '', '');
		expect(response.status).toBe('error');
		expect(response.message).toBe('Empty values passed');
	});
	test('Instructor id does not exist', async () => {
		const response = await instrcutorCreateRubricService(
			0,
			assignment_id,
			'TEST_CRITERIA_NAME-425',
			'TEST_CRITERIA_DESCRIPTION-425'
		);
		expect(response.status).toBe('error');
		expect(response.message).toBe('Instructor id does not exist');
	});
	test('Course id does not exist', async () => {
		const response = await instrcutorCreateRubricService(
			instructor_id,
			0,
			'TEST_CRITERIA_NAME-425',
			'TEST_CRITERIA_DESCRIPTION-425'
		);
		expect(response.status).toBe('error');
		expect(response.message).toBe('Course id does not exist');
	});
	test('Assignment id does not exist', async () => {
		const response = await instrcutorCreateRubricService(
			instructor_id,
			course_id,
			'TEST_CRITERIA_NAME-425',
			0
		);
		expect(response.status).toBe('error');
		expect(response.message).toBe('Assignment id does not exist');
	});
	test('Criteria created', async () => {
		const rubric = [
			{
				description: 'DESCRIPTION',
				rubrics: [
					{
						name: 'RUBRIC1',
						points: 2,
					},
					{
						name: 'RUBRIC1',
						points: 3,
					},
					{
						name: 'RUBRIC1',
						points: 4,
					},
				],
			},
		];

		const response = await instrcutorCreateRubricService(
			instructor_id,
			course_id,
			rubric,
			assignment_id
		);

		criteria_id = response.created_rubric[0].criteria_id;
		expect(response.status).toBe('success');
	});
});

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
import { describe, test, expect } from 'vitest';
const { EvaluationForm, Instructor, Course } = require('../database/index');

const instructorSetFormVisibiliyService = require('../services/instructorSetFormVisibiliyService');

describe('instructorSetFormVisibiliy', async () => {
	const instructor_id1 = 2000;
	const instructor_id2 = 2001;
	let course_id1;
	let course_id2;
	let form_id;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id1,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL2000@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id2,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL2001@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated1 = await Course.create({
				INSTRUCTOR_ID: instructor_id1,
				COURSE_NAME: 'TEST_COURSE_NAME2000',
				COURSE_CODE: 'COURSE_CODE2000',
				COURSE_SEMESTER: 'COURSE_SEMESTER2000',
				COURSE_YEAR: 'COURSE_YEAR2000',
				COURSE_TERM: 'COURSE_TERM2000',
				COURSE_VISIBILITY: 0,
			});
			course_id1 = courseCreated1.get('COURSE_ID');
			const courseCreated2 = await Course.create({
				INSTRUCTOR_ID: instructor_id2,
				COURSE_NAME: 'TEST_COURSE_NAME2001',
				COURSE_CODE: 'COURSE_CODE2001',
				COURSE_SEMESTER: 'COURSE_SEMESTER2001',
				COURSE_YEAR: 'COURSE_YEAR2001',
				COURSE_TERM: 'COURSE_TERM2001',
				COURSE_VISIBILITY: 0,
			});
			course_id2 = courseCreated2.get('COURSE_ID');
			const evaluationFormCreated = await EvaluationForm.create({
				FORM_NAME: 'FORM_NAME2000',
				COURSE_ID: course_id1,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
				VISIBILITY: 0,
			});
			form_id = evaluationFormCreated.get('FORM_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await EvaluationForm.destroy({
				where: { FORM_ID: form_id },
			});
			await Course.destroy({
				where: { COURSE_ID: course_id2 },
			});
			await Course.destroy({
				where: { COURSE_ID: course_id1 },
			});
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: instructor_id2 },
			});
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: instructor_id1 },
			});
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await instructorSetFormVisibiliyService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await instructorSetFormVisibiliyService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Invalid Variable', async () => {
		const result1 = await instructorSetFormVisibiliyService(
			instructor_id1,
			course_id1,
			2
		);

		expect(result1.status).toBe('error');
		expect(result1.message).toBe('Invalid form_visibility value');

		const result2 = await instructorSetFormVisibiliyService(
			instructor_id1,
			course_id1,
			-1
		);

		expect(result2.status).toBe('error');
		expect(result2.message).toBe('Invalid form_visibility value');

		const result3 = await instructorSetFormVisibiliyService(
			instructor_id1,
			course_id1,
			'1'
		);

		expect(result3.status).toBe('error');
		expect(result3.message).toBe('Invalid form_visibility value');
	});
	test('Instructor not found', async () => {
		const result = await instructorSetFormVisibiliyService(0, form_id, 1);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Form not found', async () => {
		const result = await instructorSetFormVisibiliyService(
			instructor_id1,
			0,
			1
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Form id does not exist');
	});
	test('Instructor not teaching this course', async () => {
		const result = await instructorSetFormVisibiliyService(
			instructor_id2,
			form_id,
			1
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor does not teach this course');
	});
	test('Successfully Set to true', async () => {
		const result = await instructorSetFormVisibiliyService(
			instructor_id1,
			form_id,
			1
		);

		expect(result.status).toBe('success');
		expect(result.data.form_visibility).toBe(1);

		const form_visibility = await EvaluationForm.findOne({
			where: { FORM_ID: form_id },
		});
		expect(form_visibility.VISIBILITY).toBe(true);
	});
	test('Successfully Set to false', async () => {
		const result = await instructorSetFormVisibiliyService(
			instructor_id1,
			form_id,
			0
		);

		expect(result.status).toBe('success');
		expect(result.data.form_visibility).toBe(0);

		const form_visibility = await EvaluationForm.findOne({
			where: { FORM_ID: form_id },
		});
		expect(form_visibility.VISIBILITY).toBe(false);
	});
});

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { Instructor } = require('../database/index');

const authenticateInstructorService = require('../services/authenticateInstructorService');

describe('authenticateInstructor', async () => {
	const instructor_id = 3208;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'LOGIN3208@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: instructor_id },
			});
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await authenticateInstructorService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await authenticateInstructorService('', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('No instructor found with the given email', async () => {
		const result = await authenticateInstructorService(
			'WRONG@EMAIL.COM',
			'MD5_PASSWORD'
		);

		expect(result.status).toBe('fail');
		expect(result.message).toBe('No instructor found with the given email');
	});
	test('Incorrect password', async () => {
		const result = await authenticateInstructorService(
			'LOGIN3208@TEST.COM',
			'WRONG_PASSWORD'
		);

		expect(result.status).toBe('fail');
		expect(result.message).toBe('Incorrect Password');
	});
	test('LogIn Successfully', async () => {
		const result = await authenticateInstructorService(
			'LOGIN3208@TEST.COM',
			'MD5_PASSWORD'
		);

		expect(result.status).toBe('success');
		expect(result.data.instructor_id).toBe(instructor_id);
	});
});

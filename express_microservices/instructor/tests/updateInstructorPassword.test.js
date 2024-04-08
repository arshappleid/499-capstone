// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { Instructor } = require('../database/index');

const updateInstructorPasswordService = require('../services/updateInstructorPasswordService');

describe('updateInstructorPassword', async () => {
	const instructor_id = 3237;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'UPDATE3237@TEST.COM',
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
		const result = await updateInstructorPasswordService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await updateInstructorPasswordService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await updateInstructorPasswordService(
			0,
			'NEW_PASSWORD',
			'OLD_PASSWORD'
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor does not exist');
	});
	test('Old password is incorrect', async () => {
		const result = await updateInstructorPasswordService(
			instructor_id,
			'NEW_PASSWORD',
			'INCORRECT_OLD_PASSWORD'
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Old password is incorrect');
	});
	test('Update Successfully', async () => {
		const result = await updateInstructorPasswordService(
			instructor_id,
			'NEW_PASSWORD',
			'MD5_PASSWORD'
		);

		expect(result.status).toBe('success');
		expect(result.message).toBe('Instructor password updated successfully');

		const instructor = await Instructor.findAll({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});

		expect(instructor[0].MD5_HASHED_PASSWORD).toBe('NEW_PASSWORD');
	});
});

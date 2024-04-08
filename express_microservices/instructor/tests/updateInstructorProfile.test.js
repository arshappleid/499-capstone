// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { Instructor } = require('../database/index');

const updateInstructorProfileService = require('../services/updateInstructorProfileService');

describe('updateInstructorProfile', async () => {
	const instructor_id = 3207;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'UPDATE3207@TEST.COM',
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
		const result = await updateInstructorProfileService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await updateInstructorProfileService('', '', '', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await updateInstructorProfileService(
			0,
            'FIRST_NAME',
            'MIDDLE_NAME',
            'LAST_NAME',
            'EMAIL'
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Middle name empty', async () => {
		const result = await updateInstructorProfileService(
			instructor_id,
            'FIRST_NAME',
            '',
            'LAST_NAME',
            'EMAIL'
		);

		expect(result.status).toBe('success');
        expect(result.data[0].INSTRUCTOR_ID).toBe(instructor_id);
        expect(result.data[0].FIRST_NAME).toBe('FIRST_NAME');
		expect(result.data[0].MIDDLE_NAME).toBe('');
        expect(result.data[0].LAST_NAME).toBe('LAST_NAME');
        expect(result.data[0].EMAIL).toBe('EMAIL');
	});
	test('Update Successfully', async () => {
        const result = await updateInstructorProfileService(
			instructor_id,
            'NEW_FIRST_NAME',
            'NEW_MIDDLE_NAME',
            'NEW_LAST_NAME',
            'NEW_EMAIL@EMAIL.COM'
		);

		expect(result.status).toBe('success');
		expect(result.data[0].INSTRUCTOR_ID).toBe(instructor_id);
        expect(result.data[0].FIRST_NAME).toBe('NEW_FIRST_NAME');
        expect(result.data[0].MIDDLE_NAME).toBe('NEW_MIDDLE_NAME');
        expect(result.data[0].LAST_NAME).toBe('NEW_LAST_NAME');
        expect(result.data[0].EMAIL).toBe('NEW_EMAIL@EMAIL.COM');
	});
});

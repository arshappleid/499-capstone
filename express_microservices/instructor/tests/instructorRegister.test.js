// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { Instructor } = require('../database/index');

const registerInstructorService = require('../services/registerInstructorService');

describe('updateInstructorProfile', async () => {
	const instructor_id = 3202;
    const instructor_register_id = 6023;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'REGISTER3202@TEST.COM',
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
            await Instructor.destroy({
                where: { INSTRUCTOR_ID: instructor_register_id },
            });
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await registerInstructorService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await registerInstructorService('', '', '', '', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Instructor id already exists', async () => {
		const result = await registerInstructorService(
            'FIRST_NAME',
            'MIDDLE_NAME',
            'LAST_NAME',
            'EMAIL',
            instructor_id,
            'MD5_PASSWORD'
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id already exists');
	});
    test('Instructor email already exists', async () => {
        const result = await registerInstructorService(
            'FIRST_NAME',
            'MIDDLE_NAME',
            'LAST_NAME',
            'REGISTER3202@TEST.COM',
            instructor_register_id,
            'MD5_PASSWORD'
        );

        expect(result.status).toBe('error');
        expect(result.message).toBe('Instructor email already exists');
    });
	test('Register Successfully', async () => {
        const result = await registerInstructorService(
            'FIRST_NAME',
            'MIDDLE_NAME',
            'LAST_NAME',
            'REGISTER6202@TEST.COM',
            instructor_register_id,
            'MD5_PASSWORD'
        );

		expect(result.status).toBe('success');
        expect(result.data.instructor_id).toBe(instructor_register_id);
	});
});

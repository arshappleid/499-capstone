// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { Instructor } = require('../database/index');

const getInstructorProfileService = require('../services/getInstructorProfileService');

describe('getInstructorProfile', async () => {
    const instructor_id = 3105;

    beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'GET3105@TEST.COM',
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
		const result = await getInstructorProfileService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await getInstructorProfileService('');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await getInstructorProfileService(0);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Get Successfully', async () => {
		const result = await getInstructorProfileService(instructor_id);

		expect(result.status).toBe('success');

        expect(result.data[0].get('FIRST_NAME')).toBe('FIRST_NAME');
        expect(result.data[0].get('MIDDLE_NAME')).toBe('MIDDLE_NAME');
        expect(result.data[0].get('LAST_NAME')).toBe('LAST_NAME');
        expect(result.data[0].get('EMAIL')).toBe('GET3105@TEST.COM');
	});
});
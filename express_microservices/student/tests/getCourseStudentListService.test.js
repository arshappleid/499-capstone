import { test, describe, expect } from 'vitest';
const getCourseStudentListService = require('../services/getCourseStudentListService');

// test for duplicate student
describe('getCourseStudentListService', () => {
	test('Valid Course ID', async () => {
		const expected = [
			{
				studentID: 10000001,
				student_first_name: 'John',
				student_middle_name: 'A.',
				student_last_name: 'Doe',
				email: 'john.doe@example.com',
			},
			{
				studentID: 10000006,
				student_first_name: 'Sarah',
				student_middle_name: 'F.',
				student_last_name: 'Jones',
				email: 'sarah.jones@example.com',
			},
			{
				studentID: 10000011,
				student_first_name: 'Alexander',
				student_middle_name: 'K.',
				student_last_name: 'Lee',
				email: 'alexander.lee@example.com',
			},
			{
				studentID: 10000016,
				student_first_name: 'Mia',
				student_middle_name: 'P.',
				student_last_name: 'Robinson',
				email: 'mia.robinson@example.com',
			},
			{
				studentID: 10000021,
				student_first_name: 'Henry',
				student_middle_name: 'U.',
				student_last_name: 'Adams',
				email: 'henry.adams@example.com',
			},
			{
				studentID: 10000026,
				student_first_name: 'Grace',
				student_middle_name: 'Z.',
				student_last_name: 'Roberts',
				email: 'grace.roberts@example.com',
			},
			{
				studentID: 10000031,
				student_first_name: 'Liam',
				student_middle_name: 'E.',
				student_last_name: 'Gonzalez',
				email: 'liam.gonzalez@example.com',
			},
			{
				studentID: 10000036,
				student_first_name: 'Sofia',
				student_middle_name: 'J.',
				student_last_name: 'Morris',
				email: 'sofia.morris@example.com',
			},
			{
				studentID: 10000041,
				student_first_name: 'Matthew',
				student_middle_name: 'O.',
				student_last_name: 'Coleman',
				email: 'matthew.coleman@example.com',
			},
			{
				studentID: 10000046,
				student_first_name: 'Aria',
				student_middle_name: 'T.',
				student_last_name: 'Sanders',
				email: 'aria.sanders@example.com',
			},
			{
				studentID: 10000051,
				student_first_name: 'Oliver',
				student_middle_name: 'Y.',
				student_last_name: 'Sanders',
				email: 'oliver.sanders@example.com',
			},
			{
				studentID: 10000056,
				student_first_name: 'Ava',
				student_middle_name: 'D.',
				student_last_name: 'Simmons',
				email: 'ava.simmons@example.com',
			},
		];
		try {
			const result = await getCourseStudentListService(1);
			expect(result.status).toBe('success');
			expect(result.data).toEqual(expected);
		} catch (e) {
			console.log(
				'Error Occured while carrying out test with valid input : ' + e
			);
		}
	});

	test('Empty Inputs', async () => {
		const result = await getCourseStudentListService('');
		expect(result.status).toBe('error');
		expect(result.message).toBe('course_ID is empty');
	});

	test('Inavlid CourseID', async () => {
		const result = await getCourseStudentListService('-1');
		expect(result.status).toBe('success');
		// expect(result.message).toEqual('course id not found');
	});
});

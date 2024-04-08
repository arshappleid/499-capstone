import { test } from 'vitest';
const getStudentProfileService = require('../services/getStudentProfileService');

// test for duplicate student
test('Valid Student ID', async () => {
	const result = await getStudentProfileService('10000001');

	expect(result.status).toBe('success');
	expect(result.data).toEqual({
		student_first_name: 'John',
		student_middle_name: 'A.',
		student_last_name: 'Doe',
		email: 'john.doe@example.com',
	});
});

test('Empty Student Id', async () => {
	const result = await getStudentProfileService('');
	expect(result.status).toBe('error');
	expect(result.message).toBe('student id not found');
});

test('Inavlid StudentID', async () => {
	const result = await getStudentProfileService('-1');
	console.log(result);
	expect(result.status).toBe('error');
	expect(result.message).toBe('student id not found');
});

import { describe, expect, test } from 'vitest';
import authenticateStudentService from '../services/authenticateStudentService';

describe('AuthenticateStudentService Tests : ', () => {
	test('authenticateStudentService Valid Entry', async () => {
		const result = await authenticateStudentService(
			'john.doe@example.com',
			'password1'
		);
		expect(result.status).toBe('success');
		expect(result.data.student_id).toBe(10000001);
	});

	test('authenticateStudentService Valid Entry , Wrong Password', async () => {
		const result = await authenticateStudentService(
			'john.doe@example.com',
			'password'
		);
		expect(result.status).toBe('error');
		expect(result.message).toBe('password incorrect');
	});

	test('authenticateStudentService Valid Entry , Wrong Email', async () => {
		const result = await authenticateStudentService(
			'john@example.com',
			'password1'
		);
		expect(result.status).toBe('error');
		expect(result.message).toBe('No student found with the given email');
	});

	test('authenticateStudentService Invalid Entry , Wrong Email & Wrong Password', async () => {
		const result = await authenticateStudentService(
			'john@example.com',
			'pass'
		);
		expect(result.status).toBe('error');
		expect(result.message).toBe('No student found with the given email');
	});
});

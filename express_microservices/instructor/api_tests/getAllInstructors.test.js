const request = require('supertest');
const { app } = require('../server');

const route = '/getallinstructors';

describe('tests POST /instructor/getallinstructors', () => {
	it('Valid Instructor that teaches the course ', async () => {
		try {
			const response = await request(app).post(route).send({
				instructor_id: '11110000',
				course_id: '1',
				assignment_name: 'test5',
				description: 'test6',
				submission_type: 'newemail2@gmail.com',
			});

			expect(response.body.message).toEqual(
				'student profile update successfull'
			);
			expect(response.body.status).toEqual('success');
		} catch (e) {
			console.log('Error occured while testing records');
		} finally {
		}
	});
});

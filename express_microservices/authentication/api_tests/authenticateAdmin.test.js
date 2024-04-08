const request = require('supertest');
const { app } = require('../server');

const route = '/admin';
describe('tests POST /student' + route, () => {
	it('Valid Credentials ', async () => {
		const response = await request(app).post(route).send({
			email: 'admin1@example.com',
			admin_password: 'password1',
		});
		expect(response.body.status).toEqual('success');
	});

	it('Invalid Email', async () => {
		const response = await request(app).post(route).send({
			email: 'admin@example.com',
			admin_password: 'password1',
		});
		expect(response.body.status).toEqual('error');
		expect(response.body.message).toEqual(
			'Unable to find user associated with email'
		);
	});

	it('Invalid Email', async () => {
		const response = await request(app).post(route).send({
			email: 'admin1@example.com',
			admin_password: 'password',
		});
		expect(response.body.status).toEqual('error');
		expect(response.body.message).toEqual('password incorrect');
	});
});

const request = require('supertest');
const { app } = require('./../server');
const { SuperAdmin } = require('../database');

const route = '/register';
describe('tests POST admin/register' + route, () => {
	it('Valid Register data', async () => {
		const response = await request(app).post(route).send({
			super_admin_email: 'new_email@gmail.com',
			password: 'newpassword',
		});
		expect(response.body.message).toEqual(
			'super admin register successful'
		);
		expect(response.body.status).toEqual('success');
		await SuperAdmin.destroy({
			where: {
				EMAIL: 'new_email@gmail.com',
			},
		});
	});

	it('User Already Exists', async () => {
		const response = await request(app).post(route).send({
			super_admin_email: 'admin1@example.com',
			password: 'newpassword',
		});
		expect(response.body.message).toEqual(
			'Account with email already exists'
		);
		expect(response.body.status).toEqual('error');
	});

	it('INVALID DATA PASSED ', async () => {
		const response = await request(app).post(route).send({
			super_admin_email: '',
			password: 'newpassword',
		});
		expect(response.body.message).toEqual(
			'Invalid Data passed : Email is required'
		);
		expect(response.body.status).toEqual('error');
	});

	it('INVALID DATA PASSED ', async () => {
		const response = await request(app).post(route).send({
			super_admin_email: 'new_email@gmail.com',
			password: '',
		});
		expect(response.body.message).toEqual(
			'Invalid Data passed : Password is required'
		);
		expect(response.body.status).toEqual('error');
	});
});

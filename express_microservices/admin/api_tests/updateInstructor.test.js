const request = require('supertest');
const { app } = require('./../server');

const route = '/updateinstructoraccess';
describe('tests POST /student' + route, () => {
	it('Valid Instructor ID', async () => {
		const response = await request(app).post(route).send({
			instructor_id: '11110000',
			instructor_access: '1',
		});
		expect(response.body.status).toEqual('success');
		expect(response.body.current_state.instructor_access).toEqual('1');
	});

	it('Valid Instructor ID', async () => {
		const response = await request(app).post(route).send({
			instructor_id: '11110000',
			instructor_access: '0',
		});
		expect(response.body.status).toEqual('success');
		expect(response.body.current_state.instructor_access).toEqual('0');
	});

	it('Invalid Instructor ID', async () => {
		const response = await request(app).post(route).send({
			instructor_id: '-10000010',
			instructor_access: '1',
		});
		expect(response.body.status).toEqual('error');
		expect(response.body.message).toEqual('Instructor id not found');
	});
});

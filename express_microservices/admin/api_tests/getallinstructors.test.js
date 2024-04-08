const request = require('supertest');
const { app } = require('./../server');

const route = '/getallinstructors';
describe('tests GET /student' + route, () => {
	it('GET Request', async () => {
		const response = await request(app).get(route);
		expect(response.body.status).toEqual('success');
		expect(response.body.instructors).not.toBeUndefined();
	});
});

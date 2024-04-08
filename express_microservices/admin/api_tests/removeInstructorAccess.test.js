const request = require('supertest');
const { app } = require('./../server');

const route = '/removeinstructoraccess';
describe('tests POST /student' + route, () => {
	it('All Valid Instructor IDs', async () => {
		const response = await request(app)
			.post(route)
			.send({
				instructors: [
					{ instructor_id: '11110000' },
					{ instructor_id: '22220000' },
					{ instructor_id: '33330000' },
				],
			});
		expect(response.body.response[0].status).toEqual(
			'removed successfully'
		);
		expect(response.body.response[1].status).toEqual(
			'removed successfully'
		);
		expect(response.body.response[2].status).toEqual(
			'removed successfully'
		);
	});

	it('Some Valid Instructor IDs', async () => {
		const response = await request(app)
			.post(route)
			.send({
				instructors: [
					{ instructor_id: '-11110000' },
					{ instructor_id: '22220000' },
					{ instructor_id: '-33330000' },
				],
			});
		expect(response.body.response[0].status).toEqual('not found');
		expect(response.body.response[1].status).toEqual(
			'removed successfully'
		);
		expect(response.body.response[2].status).toEqual('not found');
	});
});

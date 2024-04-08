const request = require('supertest');
const { app } = require('../server');

const route = '/instructor';

describe('tests POST /instructor/editrubric', () => {
	it('Valid Assignment Id , with criteria', async () => {
		try {
			const response = await request(app)
				.post(route)
				.send({
					assignment_id: '11110000',
					criteria_description: 'DESCRIPTION',
					criteria_options: [
						{ description: 'new description', option_point: '10' },
						{ description: 'new description 2', option_point: '5' },
					],
				});

			expect(response.body.message).toEqual('assignment info updated');
			expect(response.body.status).toEqual('success');
		} catch (e) {
			console.log('Error occured while testing records');
		} finally {
		}
	});

	it('InValid Assignment Id , with criteria', async () => {
		try {
			const response = await request(app)
				.post(route)
				.send({
					assignment_id: '-11110000',
					criteria_description: 'DESCRIPTION',
					criteria_options: [
						{ description: 'new description', option_point: '10' },
						{ description: 'new description 2', option_point: '5' },
					],
				});

			expect(response.body.message).toEqual(
				'No criteria found with associated assignment id'
			);
			expect(response.body.status).toEqual('error');
		} catch (e) {
			console.log('Error occured while testing records');
		} finally {
		}
	});

	it('Empty Description id passed , so do not update', async () => {
		try {
			const response = await request(app)
				.post(route)
				.send({
					assignment_id: '-11110000',
					criteria_description: '',
					criteria_options: [
						{ description: 'new description', option_point: '10' },
						{ description: 'new description 2', option_point: '5' },
					],
				});

			expect(response.body.status).toEqual('success');
			expect(response.body.description_updated).toEqual('no');
		} catch (e) {
			console.log('Error occured while testing records');
		} finally {
		}
	});
});

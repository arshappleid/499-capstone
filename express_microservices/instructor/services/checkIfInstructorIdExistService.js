// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { Instructor } = require('../database/index');

async function checkIfInstructorIdExistService(instructor_id) {
	try {
		if (instructor_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const response = await Instructor.findAll({
			where: { INSTRUCTOR_ID: instructor_id },
		});
		if (response.length > 0) {
			return { status: true, message: 'instructor id exists.' };
		} else {
			return {
				status: false,
				message: 'instructor id not exists.',
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = checkIfInstructorIdExistService;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { Instructor } = require('../database/index');

async function checkIdDuplicateService(instructor_id, instructor_email) {
	try {
		if (instructor_id === undefined || instructor_email === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '' || instructor_email === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const duplicateId = await Instructor.findAll({
			where: { INSTRUCTOR_ID: instructor_id },
		});
		if (duplicateId.length > 0) {
			return {
				status: 'error',
				message: 'Instructor id already exists',
			};
		}
		const duplicateEmail = await Instructor.findAll({
			where: { EMAIL: instructor_email },
		});
		if (duplicateEmail.length > 0) {
			return {
				status: 'error',
				message: 'Instructor email already exists',
			};
		}

		return {
			status: 'not exist',
			message: 'Instructor id and email not exists',
		};
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results in checkIdDuplicateService.js: ' + e.message,
		};
	}
}

module.exports = checkIdDuplicateService;

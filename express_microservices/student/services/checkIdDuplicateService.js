// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { Student } = require('../database/index');

async function checkIdDuplicateService(student_id, student_email) {
	try {
		const duplicateId = await Student.findAll({
			where: { STUDENT_ID: student_id },
		});
		if (duplicateId.length > 0) {
			return { status: 'error', message: 'student id already exists.' };
		}
		const duplicateEmail = await Student.findAll({
			where: { EMAIL: student_email },
		});
		if (duplicateEmail.length > 0) {
			return {
				status: 'error',
				message: 'student email already exists.',
			};
		}
		return {
			status: 'not exist',
			message: 'student id and email not exists.',
		};
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = checkIdDuplicateService;

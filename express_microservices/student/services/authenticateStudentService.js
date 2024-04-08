const { Student } = require('../database/index');

async function authenticateStudentService(student_email, student_password) {
	try {
		if (student_email === undefined || student_password === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (student_email === '' || student_password === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		const response = await Student.findAll({
			where: { EMAIL: student_email },
		});
		if (response.length == 0) {
			return {
				status: 'fail',
				message: 'No student found with the given email',
			};
		}
		if (response[0].MD5_HASHED_PASSWORD == student_password) {
			return {
				status: 'success',
				data: {
					student_id: response[0].STUDENT_ID,
					student_first_name: response[0].FIRST_NAME,
					student_last_name: response[0].LAST_NAME,
				},
			};
		} else {
			return {
				status: 'fail',
				message: 'Incorrect Password',
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results',
		};
	}
}

module.exports = authenticateStudentService;

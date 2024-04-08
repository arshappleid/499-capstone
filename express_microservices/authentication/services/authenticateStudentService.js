const { Student } = require('../database/index');
const { getNewJWTtoken } = require('./jwtToken');

async function authenticateStudentService(student_email, student_password) {
	try {
		if (student_email == '' || student_password == '') {
			return {
				status: 'error',
				message: 'student id not found',
			};
		}
		const response = await Student.findOne({
			where: { EMAIL: student_email },
		});
		if (response == null) {
			return {
				status: 'error',
				message: 'No student found with the given email',
			};
		}

		if (response.MD5_HASHED_PASSWORD === student_password) {
			return {
				status: 'success',
				data: {
					student_id: response.STUDENT_ID,
				},
				oAuthToken_encrypted_student_id: await getNewJWTtoken({
					student_id: response.STUDENT_ID,
				}),
			};
		} else {
			return {
				status: 'error',
				message: 'password incorrect',
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

// Tested by Lance Haoxiang Xu
const { Instructor } = require('../database/index');

async function authenticateInstructorService(
	instructor_email,
	instructor_password
) {
	try {
		if (
			instructor_email === undefined ||
			instructor_password === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_email === '' || instructor_password === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		const response = await Instructor.findAll({
			where: { EMAIL: instructor_email },
		});
		if (response.length === 0) {
			return {
				status: 'fail',
				message: 'No instructor found with the given email',
			};
		}
		if (response[0].MD5_HASHED_PASSWORD == instructor_password) {
			return {
				status: 'success',
				data: {
					instructor_id: response[0].INSTRUCTOR_ID,
					instructor_first_name: response[0].FIRST_NAME,
					instructor_last_name: response[0].LAST_NAME,
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
			message: 'Error occured while retrieving results in authenticateInstructorService.js: ' + e.message,
		};
	}
}

module.exports = authenticateInstructorService;

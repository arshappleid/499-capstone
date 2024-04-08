// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const { Instructor } = require('../database/index');

const checkIdDuplicateService = require('../services/checkIdDuplicateService');

async function registerInstructorService(
	instructor_firstname,
	instructor_middlename,
	instructor_lastname,
	instructor_email,
	instructor_id,
	instructor_password
) {
	try {
		if (
			instructor_firstname === undefined ||
			instructor_email === undefined ||
			instructor_id === undefined ||
			instructor_password === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			instructor_firstname === '' ||
			instructor_email === '' ||
			instructor_id === '' ||
			instructor_password === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		//Check if instructor id already exists
		const instructorIDstatus = await checkIdDuplicateService(
			instructor_id,
			instructor_email
		);
		if (instructorIDstatus.status === 'error') {
			return {
				status: 'error',
				message: instructorIDstatus.message,
			};
		}

		const newInstructor = await Instructor.create({
			INSTRUCTOR_ID: instructor_id,
			FIRST_NAME: instructor_firstname,
			MIDDLE_NAME: instructor_middlename,
			LAST_NAME: instructor_lastname,
			EMAIL: instructor_email,
			INSTRUCTOR_ACCESS: true,
			MD5_HASHED_PASSWORD: instructor_password,
		});
		const insertedInstructorId = newInstructor.get('INSTRUCTOR_ID');
		return {
			status: 'success',
			data: { instructor_id: insertedInstructorId },
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results at registerInstructorService.js',
		};
	}
}

module.exports = registerInstructorService;

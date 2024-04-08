// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const { Student } = require('../database/index');

const checkIdDuplicateService = require('../services/checkIdDuplicateService');

async function registerStudentService(
	student_firstname,
	student_middlename,
	student_lastname,
	student_email,
	student_id,
	student_password
) {
	try {
		if (
			student_firstname === undefined ||
			student_email === undefined ||
			student_id === undefined ||
			student_password === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			student_firstname === '' ||
			student_email === '' ||
			student_id === '' ||
			student_password === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const studentIDstatus = await checkIdDuplicateService(
			student_id,
			student_email
		);
		if (studentIDstatus.status === 'error') {
			return {
				status: 'error',
				message: studentIDstatus.message,
			};
		}
		const newStudent = await Student.create({
			STUDENT_ID: student_id,
			FIRST_NAME: student_firstname,
			MIDDLE_NAME: student_middlename,
			LAST_NAME: student_lastname,
			EMAIL: student_email,
			MD5_HASHED_PASSWORD: student_password,
		});
		const insertedStudentId = newStudent.get('STUDENT_ID');
		return {
			status: 'success',
			data: { student_id: insertedStudentId },
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'error occured while retrieving results in registerStudentService',
		};
	}
}

module.exports = registerStudentService;

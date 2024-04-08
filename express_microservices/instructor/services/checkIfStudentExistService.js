// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { Student } = require('../database/index');

async function checkIfStudentExist(student_id) {
	try {
		if (student_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (student_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const existStudent = await Student.findAll({
			where: {STUDENT_ID: student_id },
		});

		if (existStudent.length === 0) {
			return {
				status: 'not exist',
				message: 'student does not exist',
			};
		} else {
			return {
				status: 'exist',
				message: 'student exists',
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = checkIfStudentExist;

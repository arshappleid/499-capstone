// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const { Student, StudentAuthToken } = require('../database/index');
const { Op } = require('sequelize');

async function instructorResetPasswordService(
	verification_code,
	student_email,
	student_password
) {
	if (
		verification_code === undefined ||
		student_email === undefined ||
		student_password === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		verification_code === '' ||
		student_email === '' ||
		student_password === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}
	try {
		//Make sure the verification code is correct
		const studentExist = await Student.findOne({
			where: {
				EMAIL: student_email,
			},
		});
		if (studentExist === null) {
			return {
				status: 'error',
				message: 'Student Email is incorrect',
			};
		}
		//Check if the verification code is correct
		const studentAuthTokenExist = await StudentAuthToken.findOne({
			where: {
				STUDENT_ID: studentExist.STUDENT_ID,
				AUTH_TOKEN: verification_code,
			},
		});
		if (studentAuthTokenExist === null) {
			return {
				status: 'error',
				message: 'Verification code is Invalid',
			};
		} else {
			//Delete the verification code
			await StudentAuthToken.destroy({
				where: {
					STUDENT_ID: studentExist.STUDENT_ID,
					AUTH_TOKEN: verification_code,
				},
			});
		}
		//Update the password
		await Student.update(
			{
				MD5_HASHED_PASSWORD: student_password,
			},
			{
				where: {
					EMAIL: student_email,
				},
			}
		);

		const currentDate = new Date();
		//Delete all the other verification codes that has been expired
		await StudentAuthToken.destroy({
			where: {
				EXPIRY: {
					[Op.lt]: currentDate,
				},
			},
		});
				
		return {
			status: 'success',
			message: 'Password updated',
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results instructorResetPasswordService.js: ' +
				err.message,
		};
	}
}

module.exports = instructorResetPasswordService;

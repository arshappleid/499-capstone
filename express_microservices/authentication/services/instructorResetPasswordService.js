// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const { Instructor, InstructorAuthToken } = require('../database/index');
const { Op } = require('sequelize');

async function instructorResetPasswordService(
	verification_code,
	instructor_email,
	instructor_password
) {
	if (
		verification_code === undefined ||
		instructor_email === undefined ||
		instructor_password === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		verification_code === '' ||
		instructor_email === '' ||
		instructor_password === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}
	try {
		//Make sure the verification code is correct
		const instructorExist = await Instructor.findOne({
			where: {
				EMAIL: instructor_email,
			},
		});
		if (instructorExist === null) {
			return {
				status: 'error',
				message: 'Instructor Email is incorrect',
			};
		}
		//Check if the verification code is correct
		const instructorAuthTokenExist = await InstructorAuthToken.findOne({
			where: {
				INSTRUCTOR_ID: instructorExist.INSTRUCTOR_ID,
			},
		});
		if (instructorAuthTokenExist.AUTH_TOKEN !== verification_code) {
			return {
				status: 'error',
				message: 'Verification code is Invalid',
			};
		} else {
			//Delete the verification code
			await InstructorAuthToken.destroy({
				where: {
					INSTRUCTOR_ID: instructorExist.INSTRUCTOR_ID,
					AUTH_TOKEN: verification_code,
				},
			});
		}
		//Update the password
		await Instructor.update(
			{
				MD5_HASHED_PASSWORD: instructor_password,
			},
			{
				where: {
					EMAIL: instructor_email,
				},
			}
		);

		const currentDate = new Date();
		//Delete all the other verification codes that has been expired
		await InstructorAuthToken.destroy({
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

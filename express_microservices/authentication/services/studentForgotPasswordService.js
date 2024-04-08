// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const nodemailer = require('nodemailer');
const { Student, StudentAuthToken } = require('../database/index');

async function studentForgotPasswordService(student_email) {
	if (student_email === undefined) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (student_email === '') {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if the student exists
		const student = await Student.findOne({
			where: {
				EMAIL: student_email,
			},
		});
		if (student === null) {
			return {
				status: 'error',
				message: 'Student does not exist',
			};
		}
		//Generate a random password
		const randomPassword = Math.random().toString(36).slice(-8);
		//Create a new entry in the InstructorAuthToken table
		await StudentAuthToken.create({
			STUDENT_ID: student.STUDENT_ID,
			AUTH_TOKEN: randomPassword,
			EXPIRY: new Date(Date.now() + 3 * 60000),
		});
		//Send the email
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'learnificationtechnologies@gmail.com',
				pass: 'quesowksrtnhuscn',
			},
		});
		const mailOptions = {
			from: 'learnificationtechnologies@gmail.com',
			to: student_email,
			subject: 'Learnification: Password Reset',
			// Use HTML content with inline CSS for styling
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
					<h1 style="color: #0066cc; text-align: center;">LearnificationTechnology</h1>
					<p style="font-size: 16px; color: #333; text-align: center;">
						Your verification code: <strong>${randomPassword}</strong><br>
						Please use this code to reset your password.
					</p>
					<p style="font-size: 12px; color: #888; text-align: center;">
                (This is an auto-generated email, please do not reply.)<br>
                <strong>Please note:</strong> The verification code will expire in 3 minutes.
            </p>
				</div>
			`,
		};
		await transporter.sendMail(mailOptions);

		return {
			status: 'success',
			verification_code: randomPassword,
			secretJWTKey:
				'4025fb7266c3248a5ec6af0142069002110bca4bb340c8d9d47bb8103604c487',
		};
	} catch (err) {
		console.log(err);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results instructorForgotPasswordService.js: ' +
				err.message,
		};
	}
}

module.exports = studentForgotPasswordService;

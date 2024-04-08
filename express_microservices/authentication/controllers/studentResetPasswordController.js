// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const studentResetPasswordService = require('../services/studentResetPasswordService');

const verifyJWT = (req, res, next) => {
	const token = req.headers['authorization'];
	if (!token) {
		res.json({
			auth: false,
			message: 'Token required to access this API.',
		});
	} else {
		try {
			const secretJWTKey =
				'4025fb7266c3248a5ec6af0142069002110bca4bb340c8d9d47bb8103604c487';

			jwt.verify(token, secretJWTKey, (err, decoded) => {
				if (err) {
					res.json({
						auth: false,
						message: 'Verification Code is Expired.',
					});
				} else {
					req.verification_code = decoded.verification_code;
					next();
				}
			});
		} catch (err) {
			return res.json({
				status: 'error',
				message: 'Failed to read secret key.',
			});
		}
	}
};

router.post('/', verifyJWT, async (req, res) => {
	const verification_code = req.body.verification_code;
	const student_email = req.body.student_email;
	const student_password = req.body.student_password;

	if (
		student_email == null ||
		student_email == '' ||
		student_email === undefined
	) {
		return res.json({
			status: 'error',
			message: 'student email can not be null.',
		});
	}

	if (
		student_password == null ||
		student_password == '' ||
		student_password === undefined
	) {
		return res.json({
			status: 'error',
			message: 'student password can not be null.',
		});
	}

	const result = await studentResetPasswordService(
		verification_code,
		student_email,
		student_password
	);

	return res.json(result);
});

module.exports = router;

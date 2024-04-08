// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const instructorResetPasswordService = require('../services/instructorResetPasswordService');

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
	const instructor_email = req.body.instructor_email;
	const instructor_password = req.body.instructor_password;

	if (
		instructor_email == null ||
		instructor_email == '' ||
		instructor_email === undefined
	) {
		return res.json({
			status: 'error',
			message: 'instructor email can not be null.',
		});
	}

	if (
		instructor_password == null ||
		instructor_password == '' ||
		instructor_password === undefined
	) {
		return res.json({
			status: 'error',
			message: 'instructor password can not be null.',
		});
	}

	const result = await instructorResetPasswordService(
		verification_code,
		instructor_email,
		instructor_password
	);

	return res.json(result);
});

module.exports = router;

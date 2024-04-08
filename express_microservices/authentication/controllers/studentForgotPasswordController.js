// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const express = require('express');
path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const studentForgotPasswordService = require('../services/studentForgotPasswordService');

router.post('/', async (req, res) => {
	const student_email = req.body.student_email;

	if (
		student_email === null ||
		student_email === '' ||
		student_email === undefined
	) {
		return res.json({
			status: 'error',
			message: 'student email can not be null.',
		});
	}

	const result = await studentForgotPasswordService(student_email);
	const verification_code = result.verification_code;

	if (result.status !== 'error') {
		try {
			const token = jwt.sign({ verification_code }, result.secretJWTKey, {
				expiresIn: '3m',
			});
			return res.json({
				status: 'success',
				message: 'verification code sent.',
				token: token,
			});
		} catch (err) {
			return res.json({
				status: 'error',
				message: 'Failed to authenticate: ' + err.message,
			});
		}
	} else {
		return res.json(result);
	}
});

module.exports = router;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const express = require('express');
path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const instructorForgotPasswordService = require('../services/instructorForgotPasswordService');

router.post('/', async (req, res) => {
	const instructor_email = req.body.instructor_email;

	if (
		instructor_email === null ||
		instructor_email === '' ||
		instructor_email === undefined
	) {
		return res.json({
			status: 'error',
			message: 'instructor email can not be null.',
		});
	}

	const result = await instructorForgotPasswordService(instructor_email);
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

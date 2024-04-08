const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const authenticateStudentService = require('../services/authenticateStudentService');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
	try {
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

		const response = await authenticateStudentService(
			student_email,
			student_password
		);
		const secretKeyPath = path.join(__dirname, '../JWTSecretKey.txt');
		if (response.data !== undefined) {
			try {
				const secretJWTKey = fs.readFileSync(secretKeyPath, 'utf8');
				const student_id = response.data.student_id;
				const token = jwt.sign({ student_id }, secretJWTKey, {
					expiresIn: '48h',
				});
				return res.json({
					status: response.status,
					auth: true,
					token: token,
					data: response.data,
				});
			} catch (err) {
				return res.json({
					status: 'error',
					message: 'Failed to authenticate: ' + err.message,
				});
			}
		} else {
			return res.json({
				status: 'error',
				message: 'Failed to authenticate: ',
			});
		}
	} catch (e) {
		console.log(e);
		return (
			'Error occured while parsing request in authenticateStudentController.js: ' +
			e.message
		);
	}
});

module.exports = router;

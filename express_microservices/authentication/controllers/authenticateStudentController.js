const express = require('express');
const router = express.Router();
const authenticateStudentService = require('../services/authenticateStudentService');

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

		return res.json(response);
	} catch (e) {
		console.log(e);
		return 'Error occured while parsing request';
	}
});

module.exports = router;

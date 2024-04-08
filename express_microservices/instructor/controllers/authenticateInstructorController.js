// Tested by Lance Haoxiang Xu
const express = require('express');
const router = express.Router();
const authenticateInstructorService = require('../services/authenticateInstructorService');

router.post('/', async (req, res) => {
	try {
		const instructor_email = req.body.instructor_email;
		const instructor_password = req.body.instructor_password;

		if (
			instructor_email === null ||
			instructor_email === '' ||
			instructor_email === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor email can not be null',
			});
		}
		if (
			instructor_password === null ||
			instructor_password === '' ||
			instructor_password === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor password can not be null',
			});
		}

		const response = await authenticateInstructorService(
			instructor_email,
			instructor_password
		);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return (
			'Error occured while parsing request in authenticateInstructorController.js: ' +
			e.message
		);
	}
});

module.exports = router;

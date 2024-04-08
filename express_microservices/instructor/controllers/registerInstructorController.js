// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
const router = express.Router();

const registerInstructorService = require('../services/registerInstructorService');

router.post('/', async (req, res) => {
	try {
		const instructor_firstname = req.body.instructor_first_name;
		const instructor_middlename = req.body.instructor_middle_name;
		const instructor_lastname = req.body.instructor_last_name;
		const instructor_email = req.body.instructor_email;
		const instructor_id = req.body.instructor_id;
		const instructor_password = req.body.instructor_password;

		//Check if user request is valid and all the required fields are present
		if (
			instructor_firstname === null ||
			instructor_firstname === '' ||
			instructor_firstname === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor firstname can not be null',
			});
		}
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
			instructor_id === null ||
			instructor_id === '' ||
			instructor_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor id can not be null',
			});
		}
		if (
			instructor_password === null ||
			instructor_password === '' ||
			instructor_password === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor passowrd can not be null',
			});
		}

		//If instructor id does not exists then register the instructor
		const registerInstructorStatus = await registerInstructorService(
			instructor_firstname,
			instructor_middlename,
			instructor_lastname,
			instructor_email,
			instructor_id,
			instructor_password
		);
		return res.json(registerInstructorStatus);
	} catch (e) {
		console.log(e);
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in registerInstructorController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

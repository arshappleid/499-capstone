// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const express = require('express');
const router = express.Router();

// const checkIdDuplicateService = require("../services/checkIdDuplicateService");
const registerStudentService = require('../services/registerStudentService');

router.post('/', async (req, res) => {
	try {
		const student_firstname = req.body.student_first_name;
		const student_middlename = req.body.student_middle_name;
		const student_lastname = req.body.student_last_name;
		const student_email = req.body.student_email;
		const student_id = req.body.student_id;
		const student_password = req.body.student_password;

		//Check if user request is valid and all the required fields are present
		if (
			student_firstname === null ||
			student_firstname === '' ||
			student_firstname === undefined
		) {
			return res.json({
				status: 'error',
				message: 'student firstname can not be null.',
			});
		}
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
		if (
			student_id === null ||
			student_id === '' ||
			student_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'student id can not be null.',
			});
		}
		if (
			student_password === null ||
			student_password === '' ||
			student_password === undefined
		) {
			return res.json({
				status: 'error',
				message: 'student passowrd can not be null.',
			});
		}

		//Check if student id already exists
		// const studentIDstatus = await checkIdDuplicateService(
		// 	student_id,
		// 	student_email
		// );

		const registerStudentStatus = await registerStudentService(
			student_firstname,
			student_middlename,
			student_lastname,
			student_email,
			student_id,
			student_password
		);
		return res.json(registerStudentStatus);
	} catch (e) {
		console.log(e);
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in registerStudentController' +
				e.message,
		});
	}
});

module.exports = router;

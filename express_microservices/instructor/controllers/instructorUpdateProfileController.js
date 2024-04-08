// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const updateInstructorProfileService = require('../services/updateInstructorProfileService');

router.post('/', async (req, res) => {
	try {
		const instructor_firstname = req.body.instructor_first_name;
		const instructor_middlename = req.body.instructor_middle_name;
		const instructor_lastname = req.body.instructor_last_name;
		const instructor_email = req.body.instructor_email;
		const instructor_id = req.body.instructor_id;

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
			instructor_firstname === null ||
			instructor_firstname === '' ||
			instructor_firstname === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor first name can not be null',
			});
		}
		if (
			instructor_middlename === null ||
			instructor_middlename === '' ||
			instructor_middlename === undefined
		) {
			instructor_middlename === '';
		}
		if (
			instructor_lastname === null ||
			instructor_lastname === '' ||
			instructor_lastname === undefined
		) {
			instructor_lastname === '';
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

		return res.json(
			await updateInstructorProfileService(
				instructor_id,
				instructor_firstname,
				instructor_middlename,
				instructor_lastname,
				instructor_email
			)
		);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in instructorUpdateProfileController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const updateInstructorPasswordService = require('../services/updateInstructorPasswordService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const instructor_new_password = req.body.instructor_new_password;
		const instructor_old_password = req.body.instructor_old_password;

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
			instructor_old_password === null ||
			instructor_old_password === '' ||
			instructor_old_password === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor current password can not be null',
			});
		}
		if (
			instructor_new_password === null ||
			instructor_new_password === '' ||
			instructor_new_password === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor new password can not be null',
			});
		}
		return res.json(
			await updateInstructorPasswordService(
				instructor_id,
				instructor_new_password,
				instructor_old_password
			)
		);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in instructorUpdatePasswordController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

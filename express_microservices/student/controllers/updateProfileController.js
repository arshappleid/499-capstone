const express = require('express');
const router = express.Router();
const updateProfileService = require('../services/updateProfileService');

router.post('/', async (req, res) => {
	try {
		const student_id = req.body.student_id;
		const student_first_name = req.body.student_first_name;
		const student_middle_name = req.body.student_middle_name;
		const student_last_name = req.body.student_last_name;
		const email = req.body.student_email;

		if (
			student_id === null ||
			student_id === undefined ||
			student_id === ''
		) {
			return {
				status: 'error',
				message: 'invalid student id passed',
			};
		}

		const response = await updateProfileService(
			student_id,
			student_first_name,
			student_middle_name,
			student_last_name,
			email
		);

		return res.json(response);
	} catch (e) {
		console.log(
			'Error occured at updatePassword Controller , check request object' +
				e
		);
		return {
			status: 'error',
			message: 'Error occured while parsing request',
		};
	}
});

module.exports = router;

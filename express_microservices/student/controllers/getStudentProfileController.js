const express = require('express');
const router = express.Router();
const getStudentProfileService = require('../services/getStudentProfileService');

router.post('/', async (req, res) => {
	try {
		const student_id = req.body.studentID;

		if (
			student_id == null ||
			student_id == '' ||
			student_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'inavlid student id provided',
			});
		}

		const response = await getStudentProfileService(student_id);

		return res.json(response);
	} catch (e) {
		console.log(
			'Error occured at GetStudentProfile Controller , check request object' +
				e
		);
		return {
			status: 'error',
			message: 'Error occured while parsing request',
		};
	}
});

module.exports = router;

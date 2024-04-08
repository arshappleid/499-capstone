// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const studentGetOverallGradeService = require('../services/studentGetOverallGradeService');

router.post('/', async (req, res) => {
	const student_id = req.body.student_id;
	const form_id = req.body.form_id;

	if (
		student_id === null ||
		student_id === '' ||
		student_id === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Student ID is required.',
		});
	}
	if (form_id === null || form_id === '' || form_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Form ID is required.',
		});
	}

	try {
		const result = await studentGetOverallGradeService(
			student_id,
			form_id
		);

		return res.json(result);
	} catch (err) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in studentGetOverallGradeController.js:' +
				err.message,
		});
	}
});

module.exports = router;

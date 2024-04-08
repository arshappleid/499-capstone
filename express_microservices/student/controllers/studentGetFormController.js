// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const studentGetFormService = require('../services/studentGetFormService');

router.post('/', async (req, res) => {
	const student_id = req.body.student_id;
	const course_id = req.body.course_id;
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
	if (course_id === null || course_id === '' || course_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Course ID is required.',
		});
	}
	if (form_id === null || form_id === '' || form_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Form ID is required.',
		});
	}

	try {
		const result = await studentGetFormService(
			student_id,
			course_id,
			form_id
		);

		res.json(result);
	} catch (err) {
		res.json({
			status: 'error',
			message:
				'error occured while parsing request in studentGetFormController.js: ' +
				err.message,
		});
	}
});

module.exports = router;


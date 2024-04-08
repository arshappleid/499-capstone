// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const instructorSetFormShareFeedbackService = require('../services/instructorSetFormShareFeedbackService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const form_id = req.body.form_id;
		const form_sharefeedback = req.body.form_sharefeedback;

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
		if (form_id === null || form_id === '' || form_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Form id can not be null',
			});
		}
		if (
			form_sharefeedback === null ||
			form_sharefeedback === '' ||
			form_sharefeedback === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Form share feedback can not be null',
			});
		}

		const response = await instructorSetFormShareFeedbackService(
			instructor_id,
			form_id,
			form_sharefeedback
		);

		return res.json(response);
	} catch (e) {
		return res.json({ status: 'error', message: 'An error has occurred.' });
	}
});

module.exports = router;

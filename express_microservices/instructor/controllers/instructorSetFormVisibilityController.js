// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const instructorSetFormVisibiliyService = require('../services/instructorSetFormVisibiliyService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const form_id = req.body.form_id;
		const form_visibility = req.body.form_visibility;

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
			form_visibility === null ||
			form_visibility === '' ||
			form_visibility === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Form visibility can not be null',
			});
		}

		const response = await instructorSetFormVisibiliyService(
			instructor_id,
			form_id,
			form_visibility
		);

		return res.json(response);
	} catch (e) {
		return res.json({ status: 'error', message: 'An error has occurred.' });
	}
});

module.exports = router;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const checkIfTheresAnyFormRecordsService = require('../services/checkIfTheresAnyFormRecordsService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const form_id = req.body.form_id;

		if (
			instructor_id === null ||
			instructor_id === '' ||
			instructor_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor ID is required.',
			});
		}
		if (form_id === null || form_id === '' || form_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Form ID is required.',
			});
		}

		const result = await checkIfTheresAnyFormRecordsService(
			instructor_id,
			form_id
		);

		return res.json(result);
	} catch (err) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in getFormListController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

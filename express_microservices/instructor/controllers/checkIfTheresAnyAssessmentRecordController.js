// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const checkIfTheresAnyAssessmentRecordsService = require('../services/checkIfTheresAnyAssessmentRecordsService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const assignment_id = req.body.assignment_id;

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
		if (
			assignment_id === null ||
			assignment_id === '' ||
			assignment_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Assignment ID is required.',
			});
		}

		const result = await checkIfTheresAnyAssessmentRecordsService(
			instructor_id,
			assignment_id
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

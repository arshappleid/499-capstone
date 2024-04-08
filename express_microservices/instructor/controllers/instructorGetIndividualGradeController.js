// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
const e = require('express');
path = require('path');
const router = express.Router();

const instructorGetIndividualGradeService = require('../services/instructorGetIndividualGradeService');

router.post('/', async (req, res) => {
	const instructor_id = req.body.instructor_id;
	const form_id = req.body.form_id;
	const evaluatee_id = req.body.evaluatee_id;
	const evaluator_id = req.body.evaluator_id;

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
	if (
		evaluatee_id === null ||
		evaluatee_id === '' ||
		evaluatee_id === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Evaluatee ID is required.',
		});
	}
	if (
		evaluator_id === null ||
		evaluator_id === '' ||
		evaluator_id === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Evaluator ID is required.',
		});
	}

	try {
		const result = await instructorGetIndividualGradeService(
			instructor_id,
			form_id,
			evaluatee_id,
			evaluator_id
		);

		return res.json(result);
	} catch (err) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in instructorGetIndividualGradeController.js:' +
				err.message,
		});
	}
});

module.exports = router;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const express = require('express');
const router = express.Router();

const submitAssessmentService = require('../services/submitAssessmentService');

router.post('/', async (req, res) => {
	try {
		const student_id = req.body.student_id;
		const assignment_id = req.body.assignment_id;
		const evaluatee_id = req.body.evaluatee_id;
		const selected_options = req.body.selected_options;

		if (
			student_id === null ||
			student_id === '' ||
			student_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Student id can not be null',
			});
		}
		if (
			assignment_id === null ||
			assignment_id === '' ||
			assignment_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Assessment id can not be null',
			});
		}
		if (
			evaluatee_id === null ||
			evaluatee_id === '' ||
			evaluatee_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Evaluatee id can not be null',
			});
		}
		if (
			selected_options === null ||
			selected_options === '' ||
			selected_options === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Selected options can not be null',
			});
		}
		const result = await submitAssessmentService(
			student_id,
			assignment_id,
			evaluatee_id,
			selected_options
		);
		return res.json(result);
	} catch (err) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in submitAssessmentController.js: ' +
				err.message,
		});
	}
});

module.exports = router;

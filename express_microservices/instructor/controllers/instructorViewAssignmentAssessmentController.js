// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu

const express = require('express');
path = require('path');
const router = express.Router();

const instructorViewAssignmentAssessmentService = require('../services/instructorViewAssignmentAssessmentService');

router.post('/', async (req, res) => {
	const instructor_id = req.body.instructor_id;
	const course_id = req.body.course_id;
	const assignment_id = req.body.assignment_id;
	const evaluator_id = req.body.evaluator_id;
	const evaluatee_id = req.body.evaluatee_id;

	// Check if the request body is valid.
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
	if (course_id === null || course_id === '' || course_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Course id can not be null',
		});
	}
	if (
		assignment_id === null ||
		assignment_id === '' ||
		assignment_id === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Assignment id can not be null',
		});
	}
	if (
		evaluator_id === null ||
		evaluator_id === '' ||
		evaluator_id === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Evaluator id can not be null',
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

	try {
		const result = await instructorViewAssignmentAssessmentService(
			instructor_id,
			course_id,
			assignment_id,
			evaluator_id,
			evaluatee_id
		);
		return res.json(result);
	} catch (err) {
		console.log(err);
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in instructorViewAssignmentAssessmentController.js: ' +
				err.message,
		});
	}
});

module.exports = router;

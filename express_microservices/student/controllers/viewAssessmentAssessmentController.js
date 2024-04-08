// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)

const express = require('express');
path = require('path');
const router = express.Router();

const ViewAssignmentAssessmentService = require('../services/viewAssignmentAssessmentService');

router.post('/', async (req, res) => {
	const course_id = req.body.course_id;
	const assignment_id = req.body.assignment_id;
	const evaluatee_id = req.body.evaluatee_id;

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
		const result = await ViewAssignmentAssessmentService(
			course_id,
			assignment_id,
			evaluatee_id
		);
		return res.json(result);
	} catch (err) {
		console.log(err);
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in viewAssignmentAssessmentController.js: ' +
				err.message,
		});
	}
});

module.exports = router;

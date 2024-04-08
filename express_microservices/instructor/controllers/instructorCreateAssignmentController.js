// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const instructorCreateAssignmentService = require('../services/instructorCreateAssignmentService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;
		const assignment_name = req.body.assignment_name;
		const deadline = req.body.deadline;
		const available_form = req.body.available_form;
		const available_to = req.body.available_to;
		const form_id = req.body.form_id;
		const evaluator_group_size = req.body.evaluator_group_size;

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
			assignment_name === null ||
			assignment_name === '' ||
			assignment_name === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Assignment name can not be null',
			});
		}
		if (deadline === null || deadline === '' || deadline === undefined) {
			return res.json({
				status: 'error',
				message: 'Deadline can not be null',
			});
		}
		if (
			available_form === null ||
			available_form === '' ||
			available_form === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Available form can not be null',
			});
		}
		if (
			available_to === null ||
			available_to === '' ||
			available_to === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Available to can not be null',
			});
		}
		if (
			evaluator_group_size === null ||
			evaluator_group_size === '' ||
			evaluator_group_size === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Evaluator group size can not be null',
			});
		}

		const response = await instructorCreateAssignmentService(
			instructor_id,
			course_id,
			assignment_name,
			deadline,
			available_form,
			available_to,
			form_id,
			evaluator_group_size
		);
		return res.json(response);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in instructorCreateAssignmentController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

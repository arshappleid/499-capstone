// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const instructorCreateAssignmentService = require('../services/instructorCreateAssignmentService');
const instrcutorCreateRubricService = require('../services/instructorCreateRubricService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;
		const assignment_name = req.body.assignmentName;
		const assignment_description = req.body.description;
		const assignment_submission_type = req.body.submission_type;
		const deadline = req.body.deadline;
		const available_from = req.body.availableFrom;
		const available_to = req.body.availableUntil;
		const form_id = req.body.form_id;
		const evaluator_group_size = req.body.numAssessments;
		const rubric = req.body.criteria;

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
			available_from === null ||
			available_from === '' ||
			available_from === undefined
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
		if (rubric === null || rubric === '' || rubric === undefined) {
			return res.json({
				status: 'error',
				message: 'Rubric can not be null',
			});
		}
		const response = await instructorCreateAssignmentService(
			instructor_id,
			course_id,
			assignment_name,
			deadline,
			available_from,
			available_to,
			form_id,
			evaluator_group_size,
			assignment_description,
			assignment_submission_type
		);

		if (response.status === 'error') {
			return res.json(response);
		}

		const assignment_id = response.assignment_id;

		let rubric_response = await instrcutorCreateRubricService(
			instructor_id,
			course_id,
			rubric,
			assignment_id
		);
		rubric_response.message = response.message;
		rubric_response.assignment_id = assignment_id;

		return res.json(rubric_response);
	} catch (error) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in instructorCreateAssignmentAndRubricController.js: ' +
				error.message,
		});
	}
});

module.exports = router;

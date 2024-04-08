// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const express = require('express');
const router = express.Router();
const instrcutorCreateRubricService = require('../services/instructorCreateRubricService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;
		const rubric = req.body.rubric;
		const assignment_id = req.body.assignment_id;

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
		if (rubric === null || rubric === '' || rubric === undefined) {
			return res.json({
				status: 'error',
				message: 'Rubric can not be null',
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

		const response = await instrcutorCreateRubricService(
			instructor_id,
			course_id,
			rubric,
			assignment_id
		);
		return res.json(response);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in instructorCreateRubricController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

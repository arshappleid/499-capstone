// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const instructorGetAssignmentListService = require('../services/instructorGetAssignmentListService');

router.post('/', async (req, res) => {
	const instructor_id = req.body.instructor_id;
	const course_id = req.body.course_id;

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

	if (course_id === null || course_id === '' || course_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Course ID is required.',
		});
	}

	try {
		const result = await instructorGetAssignmentListService(
			instructor_id,
			course_id
		);
		return res.json(result);
	} catch (err) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in instructorGetAssignmentListController.js: ' +
				err.message,
		});
	}
});

module.exports = router;

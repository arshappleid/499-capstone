// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getCourseGroupsService = require('../services/getCourseGroupsService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;

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

		return res.json(await getCourseGroupsService(instructor_id, course_id));
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in getCourseGroupsController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

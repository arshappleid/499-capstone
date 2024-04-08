// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const instructorSetCourseVisibiliyService = require('../services/instructorSetCourseVisibiliyService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;
		const course_visibility = req.body.course_visibility;

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
				message: 'Course code can not be null',
			});
		}
		if (
			course_visibility === null ||
			course_visibility === '' ||
			course_visibility === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Course visibility can not be null',
			});
		}

		const response = await instructorSetCourseVisibiliyService(
			instructor_id,
			course_id,
			course_visibility
		);

		return res.json(response);
	} catch (e) {
		return res.json({ status: 'error', message: 'An error has occurred.' });
	}
});

module.exports = router;

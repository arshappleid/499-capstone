// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getCourseStudentListService = require('../services/getCourseStudentListService');

router.post('/', async (req, res) => {
	try {
		const course_id = req.body.course_id;

		if (course_id === null || course_id === '' || course_id === undefined) {
			return res.json({
				status: 'error',
				message: 'course_id can not be null.',
			});
		}

		const response = await getCourseStudentListService(course_id);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return 'error occured while parsing request';
	}
});

module.exports = router;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const instructorCreateGroupService = require('../services/instructorCreateGroupService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;
		const group_name = req.body.group_name;

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
		if (
			group_name === null ||
			group_name === '' ||
			group_name === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Group name can not be null',
			});
		}
		if (course_id === null || course_id === '' || course_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Course code can not be null',
			});
		}
		const response = await instructorCreateGroupService(
			instructor_id,
			course_id,
			group_name
		);

		return res.json(response);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in instructorCreateGroupController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const removeEmptyGroupService = require('../services/removeEmptyGroupService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;
		const group_id = req.body.group_id;

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
		if (group_id === null || group_id === '' || group_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Group id can not be null',
			});
		}

		const response = await removeEmptyGroupService(
			instructor_id,
			course_id,
			group_id
		);
		return res.json(response);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in removeEmptyGroupController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

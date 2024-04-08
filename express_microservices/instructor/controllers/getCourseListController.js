// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getCourseListService = require('../services/getCourseListService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;

		if (
			instructor_id === null ||
			instructor_id === '' ||
			instructor_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'instructor id can not be null.',
			});
		}

		return res.json(await getCourseListService(instructor_id));
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in getCourseListController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

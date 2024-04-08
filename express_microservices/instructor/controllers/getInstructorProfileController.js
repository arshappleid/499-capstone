// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getInstructorProfileService = require('../services/getInstructorProfileService');

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
				message: 'Instructor id can not be null',
			});
		}

		const response = await getInstructorProfileService(instructor_id);
		return res.json(response);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in getInstructorProfileController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

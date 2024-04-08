// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getAssignmentNumberService = require('../services/getAssignmentNumberService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;

		return res.json(
			await getAssignmentNumberService(instructor_id, course_id)
		);
	} catch (e) {
		return res.json({
			status: 'error',
			message: 'error occured while parsing request',
		});
	}
});

module.exports = router;

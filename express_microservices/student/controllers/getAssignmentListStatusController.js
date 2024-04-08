// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
const router = express.Router();
const getAssignmentListService = require('../services/getAssignmentListService');

router.post('/', async (req, res) => {
	try {
		const student_id = req.body.student_id;
		const course_id = req.body.course_id;

		if (
			student_id == null ||
			student_id == '' ||
			student_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'student id can not be null.',
			});
		}

		if (course_id == null || course_id == '' || course_id === undefined) {
			return res.json({
				status: 'error',
				message: 'course id can not be null.',
			});
		}

		const response = await getAssignmentListService(student_id, course_id);
		return res.json(response);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in getAssignmentListController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

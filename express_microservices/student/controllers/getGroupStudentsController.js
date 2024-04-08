// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
path = require('path');
const router = express.Router();

const getGroupStudentsService = require('../services/getGroupStudentsService');

router.post('/', async (req, res) => {
	try {
		const student_id = req.body.student_id;
		const course_id = req.body.course_id;

		if (
			student_id === null ||
			student_id === '' ||
			student_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Student_id can not be null',
			});
		}
		if (course_id === null || course_id === '' || course_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Course_id can not be null',
			});
		}

		const response = await getGroupStudentsService(student_id, course_id);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return res.json({
			status: 'error',
			message: 'Failed to get group students.',
		});
	}
});

module.exports = router;

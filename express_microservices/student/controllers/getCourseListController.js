const express = require('express');
const router = express.Router();
const getCourseListService = require('../services/getCourseListService');

router.post('/', async (req, res) => {
	try {
		const studentId = req.body.student_id;

		if (studentId === '' || studentId === null || studentId === undefined) {
			return {
				status: 'error',
				message: 'invalid student id passed',
			};
		}

		const response = await getCourseListService(studentId);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return 'Error occured while parsing request';
	}
});

module.exports = router;

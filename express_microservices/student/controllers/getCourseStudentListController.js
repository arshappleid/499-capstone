const express = require('express');
const router = express.Router();
const getCourseStudentListService = require('../services/getCourseStudentListService');

router.post('/', async (req, res) => {
	try {
		const course_ID = req.body.courseID;

		if (course_ID == null || course_ID == '' || course_ID === undefined) {
			return res.json({
				status: 'error',
				message: 'Invalid course ID provided.',
			});
		}

		const response = await getCourseStudentListService(course_ID);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return 'Error occured while parsing request';
	}
});

module.exports = router;

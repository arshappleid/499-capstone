const express = require('express');
const router = express.Router();
const {
	addGroupsToCourseService,
} = require('../services/addGroupsToCourseService');

router.post('/', async (req, res) => {
	try {
		const course_ID = req.body.courseID;
		const groups = req.body.groups;
		const instructorID = req.body.instructorId;

		if (course_ID == null || course_ID === '' || course_ID === undefined) {
			return res.json({
				status: 'error',
				message: 'Invalid course ID provided.',
			});
		}

		if (
			instructorID == null ||
			instructorID === '' ||
			instructorID === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Invalid Instructor ID provided.',
			});
		}

		if (
			groups == null ||
			groups === '' ||
			groups === undefined ||
			!Array.isArray(groups)
		) {
			return res.json({
				status: 'error',
				message:
					'Invalid groups provided, can only be a list of groups.',
			});
		}
		const response = await addGroupsToCourseService(
			instructorID,
			course_ID,
			groups
		);

		return res.json(response);
	} catch (e) {
		// console.log(
		// 	'Error occured while parsing request at addGroupToController ' + e
		// );
		// return 'Error occured while parsing request';
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in addStudentToCourseController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

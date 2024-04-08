const express = require('express');
const router = express.Router();
const updateInstructorService = require('../services/updateInstructorService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		var instructor_access = req.body.instructor_access;

		if (
			instructor_id === '' ||
			instructor_id === null ||
			instructor_id === undefined
		) {
			return {
				status: 'error',
				message: 'invalid instructor id passed',
			};
		}

		if (
			instructor_access === '' ||
			instructor_access === null ||
			instructor_access === undefined
		) {
			// Deafault to zero
			instructor_access = 0;
		}

		const response = await updateInstructorService(
			instructor_id,
			instructor_access
		);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return 'Error occured while parsing request';
	}
});

module.exports = router;

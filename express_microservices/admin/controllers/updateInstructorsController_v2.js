const express = require('express');
const router = express.Router();
const updateInstructorService = require('../services/updateInstructorService');

router.post('/', async (req, res) => {
	try {
		const instructors = req.body.instructors;
		if (instructors === null || instructors === undefined || !instructors) {
			return res.status(404).json({
				status: 'error',
				message: 'Invalid instructors list passed',
			});
		}
		var response = [];
		for (var i = 0; i < instructors.length; i++) {
			let instructor_id = instructors[i].instructor_id;
			let instructor_access = instructors[i].instructor_access;

			if (
				instructor_access === null ||
				instructor_access === undefined ||
				instructor_access === ''
			) {
				instructor_access = 0; // default to zero
			}
			const curr_response = await updateInstructorService(
				instructor_id,
				instructor_access
			);
			response.push(curr_response);
		}
		return res.json(response);
	} catch (e) {
		console.log(e);
		return 'Error occured while parsing request';
	}
});

module.exports = router;

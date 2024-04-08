// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const instructorEditGradeService = require('../services/instructorEditGradeService');

router.post('/', async (req, res) => {
	const instructor_id = req.body.instructor_id;
	const form_id = req.body.form_id;
	const evaluatee_id = req.body.evaluatee_id;
    const new_grade = req.body.new_grade;

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
	if (form_id === null || form_id === '' || form_id === undefined) {
		return res.json({
			status: 'error',
			message: 'Form id can not be null',
		});
	}
	if (
		evaluatee_id === null ||
		evaluatee_id === '' ||
		evaluatee_id === undefined
	) {
		return res.json({
			status: 'error',
			message: 'Evaluatee id can not be null',
		});
	}
    if (
        new_grade === null ||
        new_grade === '' ||
        new_grade === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'New grade can not be null',
        });
    }

	try {
		const result = await instructorEditGradeService(
			instructor_id,
			form_id,
			evaluatee_id,
            new_grade
		);

		return res.json(result);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in instructorEditGradeController.js: ' +
				e.message,
		});
	}
});

module.exports = router;
// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const instructorCreateCourseService = require('../services/instructorCreateCourseService');

router.post('/', async (req, res) => {
	try {
		const instructor_id = req.body.instructor_id;
		const course_name = req.body.course_name;
		const course_code = req.body.course_code;
		const course_semester = req.body.course_semester;
		const course_year = req.body.course_year;
		const course_term = req.body.course_term;
		const course_visibility = req.body.course_visibility;
		let external_course_link = req.body.external_course_link;

		if (
			instructor_id === null ||
			instructor_id === '' ||
			instructor_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'instructor id can not be null.',
			});
		}
		if (
			course_name === null ||
			course_name === '' ||
			course_name === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Course name can not be null',
			});
		}
		if (
			course_code === null ||
			course_code === '' ||
			course_code === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Course code can not be null',
			});
		}
		if (
			course_semester === null ||
			course_semester === '' ||
			course_semester === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Course semester can not be null',
			});
		}
		if (
			course_year === null ||
			course_year === '' ||
			course_year === undefined
		) {
			return res.json({
				status: 'error',
				message: 'course year can not be null.',
			});
		}
		if (
			course_term === null ||
			course_term === '' ||
			course_term === undefined
		) {
			return res.json({
				status: 'error',
				message: 'course term can not be null.',
			});
		}
		if (
			external_course_link === null ||
			external_course_link === '' ||
			external_course_link === undefined
		) {
			external_course_link = '';
		}

		const response = await instructorCreateCourseService(
			instructor_id,
			course_name,
			course_code,
			course_semester,
			course_year,
			course_term,
			course_visibility,
			external_course_link
		);

		return res.json(response);
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'error occured while parsing request in instructorCreateCourseController.js: ' +
				e.message,
		});
	}
});

module.exports = router;

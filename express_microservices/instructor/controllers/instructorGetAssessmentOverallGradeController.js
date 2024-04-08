// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const instructorGetAssessmentOverallGradeService = require('../services/instructorGetAssessmentOverallGradeService');

router.post('/', async (req, res) => {
    try{
        const instructor_id = req.body.instructor_id;
		const course_id = req.body.course_id;
		const assignment_id = req.body.assignment_id;
		const evaluatee_id = req.body.evaluatee_id;

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
        if (course_id === null || course_id === '' || course_id === undefined) {
            return res.json({
                status: 'error',
                message: 'Course id can not be null',
            });
        }
        if (
            assignment_id === null ||
            assignment_id === '' ||
            assignment_id === undefined
        ) {
            return res.json({
                status: 'error',
                message: 'Assessment id can not be null',
            });
        }
        if (
            evaluatee_id === null ||
            evaluatee_id === '' ||
            evaluatee_id === undefined
        ) {
            return res.json({
                status: 'error',
                message: 'Student id can not be null',
            });
        }

        const result = await instructorGetAssessmentOverallGradeService(
            instructor_id,
            course_id,
            assignment_id,
            evaluatee_id
        );
        return res.json(result);
    } catch (err) {
        return res.json({
            status: 'error',
            message: 'error occured while parsing request in instructorGetAssessmentOverallGradeController.js: ' + err.message,
        });
    }
});

module.exports = router;
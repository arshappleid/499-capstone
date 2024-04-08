// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const instructorGetSubmissionLinkService = require('../services/instructorGetSubmissionLinkService');

router.post('/', async (req, res) => {
    try {
        const instructor_id = req.body.instructor_id;
        const course_id = req.body.course_id;
        const assignment_id = req.body.assignment_id;
        const submissionor_id = req.body.submissionor_id;

        // Check if the request body is valid.
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
                message: 'Assignment id can not be null',
            });
        }
        if (
            submissionor_id === null ||
            submissionor_id === '' ||
            submissionor_id === undefined
        ) {
            return res.json({
                status: 'error',
                message: 'Submissionor id can not be null',
            });
        }

        const result = await instructorGetSubmissionLinkService(
            instructor_id,
            course_id,
            assignment_id,
            submissionor_id
        );

        res.json(result);
    } catch (err) {
        console.log(err);
        res.json({
            status: 'error',
            message: 'Error occured in instructorGetSubmissionLinkController',
        });
    }
});

module.exports = router;

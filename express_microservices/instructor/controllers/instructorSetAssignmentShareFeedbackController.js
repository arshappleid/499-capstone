// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const instructorSetAssignmentSharefeedbackService = require('../services/instructorSetAssignmentSharefeedbackService');

router.post('/', async (req, res) => {
    const instructor_id = req.body.instructor_id;
    const course_id = req.body.course_id;
    const assignment_id = req.body.assignment_id;
    const sharefeedback = req.body.sharefeedback;

    if (
        instructor_id === null ||
        instructor_id === '' ||
        instructor_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Instructor ID is required.',
        });
    }

    if (course_id === null || course_id === '' || course_id === undefined) {
        return res.json({
            status: 'error',
            message: 'Course ID is required.',
        });
    }

    if (
        assignment_id === null ||
        assignment_id === '' ||
        assignment_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Assignment ID is required.',
        });
    }

    if (sharefeedback === null || sharefeedback === '' || sharefeedback === undefined) {
        return res.json({
            status: 'error',
            message: 'Feedback is required.',
        });
    }

    try {
        const result = await instructorSetAssignmentSharefeedbackService(
            instructor_id,
            course_id,
            assignment_id,
            sharefeedback
        );

        res.json(result);
    }
    catch (err) {
        res.json({
            status: 'error',
            message:
                'error occured while parsing request in instructorSetAssignmentFeedbackController.js: ' +
                err.message,
        });
    }
});

module.exports = router;
// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
const router = express.Router();

const getSubmissionStatusService = require('../services/getSubmissionStatusService');

router.post('/', async (req, res) => {
    try{
        const student_id = req.body.student_id;
        const course_id = req.body.course_id;

        if (
            student_id === null ||
            student_id === '' ||
            student_id === undefined
        ) {
            return res.json({
                status: 'error',
                message: 'Student id can not be null',
            });
        }
        if (
            course_id === null ||
            course_id === '' ||
            course_id === undefined
        ) {
            return res.json({
                status: 'error',
                message: 'Course id can not be null',
            });
        }

        const result = await getSubmissionStatusService(
            student_id,
            course_id
        );
        return res.json(result);
    } catch (err) {
        return res.json({
            status: 'error',
            message: 'error occured while parsing request in getSubmissionStatusController.js: ' +
            err.message,
        });
    }
});

module.exports = router;
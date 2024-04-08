// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getRubricService = require('../services/getRubricService');

router.post('/', async (req, res) => {
    try{
        const student_id = req.body.student_id;
        const course_id = req.body.course_id;
        const assignment_id = req.body.assignment_id;

        // Check if the request body is valid.
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

        const result = await getRubricService(
            student_id,
            course_id,
            assignment_id
        );
        return res.json(result);
    } catch (err) {
        console.log(err);
        return res.json({
            status: 'error',
            message: 'Error occured while parsing request in getRubricController.js: ' +
            err.message,
        });
    }
});

module.exports = router;
// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
const router = express.Router();

const getStudentToAssessService = require('../services/getStudentToAssessService');

router.post('/', async (req, res) => {
    try{
        const student_id = req.body.student_id;
        const assignment_id = req.body.assignment_id;

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
            assignment_id === null ||
            assignment_id === '' ||
            assignment_id === undefined
        ) {
            return res.json({
                status: 'error',
                message: 'Assessment id can not be null',
            });
        }

        const result = await getStudentToAssessService(
            student_id,
            assignment_id
        );
        return res.json(result);
    } catch (err) {
        return res.json({
            status: 'error',
            message:
                'error occured while parsing request in getStudentToAssessController.js: ' +
                err.message,
        });
    }
});

module.exports = router;
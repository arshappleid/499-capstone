// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getGroupMemberEvluationStatusService = require('../services/getGroupMemberEvluationStatusService');

router.post('/', async (req, res) => {
    const evaluator_id = req.body.evaluator_id;
    const form_id = req.body.form_id;
    const course_id = req.body.course_id;

    if (
        evaluator_id === null ||
        evaluator_id === '' ||
        evaluator_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Evaluator ID is required.',
        });
    }
    if (
        course_id === null ||
        course_id === '' ||
        course_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Course ID is required.',
        });
    }
    if (
        form_id === null ||
        form_id === '' ||
        form_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Form ID is required.',
        });
    }

    try {
    const response = await getGroupMemberEvluationStatusService(
        evaluator_id,
        course_id,
        form_id
    );

    return res.json(response);
    } catch (e) {
        return res.json({
            status: 'error',
            message:
                'error occured while parsing request in getGroupMemberEvluationStatusController.js: ' +
                e.message,
        });
    }
});

module.exports = router;
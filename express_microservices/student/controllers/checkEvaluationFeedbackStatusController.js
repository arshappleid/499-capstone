// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const checkEvaluationFeedbackStatusService = require('../services/checkEvaluationFeedbackStatusService');

router.post('/', async (req, res) => {
    const evaluatee_id = req.body.evaluatee_id;
    const group_id = req.body.group_id;
    const form_id = req.body.form_id;

    if (
        evaluatee_id === null ||
        evaluatee_id === '' ||
        evaluatee_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Evaluatee ID is required.',
        });
    }
    if (
        group_id === null ||
        group_id === '' ||
        group_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Group ID is required.',
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
    const response = await checkEvaluationFeedbackStatusService(
        evaluatee_id,
        group_id,
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
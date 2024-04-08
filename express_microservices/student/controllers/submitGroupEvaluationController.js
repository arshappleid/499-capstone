// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const submitGroupEvaluationService = require('../services/submitGroupEvaluationService');

router.post('/', async (req, res) => {
    const evaluatee_id = req.body.evaluatee_id;
    const evaluator_id = req.body.evaluator_id;
    const form_id = req.body.form_id;
    const course_id = req.body.course_id;
    const evaluation_answers = req.body.evaluation_answers;

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
        form_id === null ||
        form_id === '' ||
        form_id === undefined
    ) {
        return res.json({
            status: 'error',
            message: 'Form ID is required.',
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
        evaluation_answers === null ||
        evaluation_answers === '' ||
        evaluation_answers === undefined ||
        evaluation_answers.length === 0
    ) {
        return res.json({
            status: 'error',
            message: 'Evaluation answers are required.',
        });
    }

    try {
        const response = await submitGroupEvaluationService(
            evaluatee_id,
            evaluator_id,
            form_id,
            course_id,
            evaluation_answers
        );

        return res.json(response);
    }
    catch (error) {
        return res.json({
            status: 'error',
            message:
                'error occured while parsing request in submitGroupEvaluationController.js: ' +
                error.message,
        });
    }
});

module.exports = router;

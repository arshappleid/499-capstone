const express = require('express');
path = require('path');
const router = express.Router();
const getSubmissionLinkService = require('./../services/getsubmissionlinkService');


router.post('/', async (req, res) => {
    try {
        const student_id = req.body.student_id;
        const assignment_id = req.body.assignment_id;

        if (
            student_id === null ||
            student_id === '' ||
            student_id === undefined
        ) {
            return res.status(404).json({
                status: 'error',
                message: 'Student ID is required.',
            });
        }

        if (assignment_id === null || assignment_id === undefined || assignment_id === "") {
            return res.status(404).json({
                status: "error",
                message: "Assignment ID is required"
            });
        }

        const result = await getSubmissionLinkService(student_id, assignment_id);

        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({
            status: 'error',
            message:
                'error occured while parsing request in studentGetFormController.js: ' +
                err.message,
        });
    }
});

module.exports = router;


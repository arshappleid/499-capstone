const express = require('express');
const router = express.Router();
const submitAssignmentService = require('../services/submitAssignmentService');


router.post('/', async (req, res) => {
    try {
        const student_id = req.body.student_id;
        const assignment_id = req.body.assignment_id;
        const submission_url = req.body.submission_link;
        console.log("Request recieved by submit Assignment Controller");
        if (student_id === null || !student_id || student_id === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Invalid student Id"
            });
        }

        if (assignment_id === null || !assignment_id || assignment_id === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Invalid Assignment Id"
            });
        }

        if (submission_url === null || !submission_url || submission_url === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Invalid Submission Link"
            });
        }

        const response = await submitAssignmentService(student_id, assignment_id, submission_url);
        return res.status(200).json(response);
    } catch (e) {
        console.log(
            'Error occured at updatePassword Controller , check request object' +
            e
        );
        return {
            status: 'error',
            message: 'Error occured while parsing request',
        };
    }
});

module.exports = router;

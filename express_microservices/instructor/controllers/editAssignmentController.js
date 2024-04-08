const express = require('express');
const router = express.Router();
const editAssignmentService = require('../services/editAssignmentService');

router.post('/', async (req, res) => {
    try {
        const instructor_id = req.body.instructor_id || "";
        const assignment_id = req.body.assignment_id || "";
        const assignment_name = req.body.assignment_name || "";
        const deadline = req.body.deadline || "";
        const availableFrom = req.body.availableFrom || "";
        const availableTo = req.body.availableTo || "";
        const submissionType = req.body.submissionType || "";

        const response = await editAssignmentService(instructor_id, assignment_id, assignment_name, deadline, availableFrom, availableTo, submissionType);

        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return 'Error occured while parsing request';
    }
});

module.exports = router;

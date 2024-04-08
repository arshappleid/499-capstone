// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const express = require('express');
const router = express.Router();
const getCourseFormListService = require('../services/getCourseFormListService');

router.post('/', async (req, res) => {
    try {
        const student_id = req.body.student_id;
        const course_id = req.body.course_id;

        if (student_id === '' || student_id === null || student_id === undefined) {
            return {
                status: "error",
                message: "invalid form id passed"
            };
        }

        const response = await getCourseFormListService(student_id, course_id);

        return res.json(response);
    } catch (e) {
        console.log(e);
        return 'Error occured while parsing request';
    }
});

module.exports = router;

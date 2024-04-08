const express = require('express');
const router = express.Router();
const removeInstructorAccessService = require('../services/removeInstructorAccessService');

router.post('/', async (req, res) => {
    try {
        const instructor_id_list = req.body.instructors;
        console.log("Data recieved : "+instructor_id_list);
        if (instructor_id_list.length < 1) {
            return res.json({
                status: "Empty list passed"
            });
        }

        const response = await removeInstructorAccessService(instructor_id_list);

        return res.json(response);
    } catch (e) {
        console.log(e);
        return 'Error occured while parsing request';
    }
});

module.exports = router;

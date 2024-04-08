const express = require('express');
path = require('path');
const router = express.Router();
const editRubricService = require('./../services/editRubricService');

router.post('/', async (req, res) => {
    try {
        const assignment_id = req.body.assignment_id||"";
        const criteria_description = req.body.criteria_description || "";
        const criteria_options = req.body.criteria_options || [];

        if(assignment_id== ""){
            return res.status(404).json({
                status : "error",
                message : "assignment id cannot be null"
            });
        }
        
        return res.status(200).json(
            await editRubricService(assignment_id, criteria_description , criteria_options)
            );
    } catch (e) {
        return res.status(404).json({
            status: 'error',
            message: 'Error occured while parsing request in EditRubricController : '+e,
        });
    }
});

module.exports = router;

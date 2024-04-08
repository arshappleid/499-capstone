const express = require('express');
const router = express.Router();
const updatePasswordService = require('../services/updatePasswordService');

router.post('/', async (req, res) => {
    try {
        const student_id = req.body.student_id;
        const old_password_hash = req.body.old_password_hash;
        const new_password_hash = req.body.new_password_hash;

        if (
            student_id === null ||
            student_id === '' ||
            student_id === undefined
        ) {
            return res.json({
                status: 'error',
                message: 'inavlid student id provided',
            });
        }

       
        
        const response = await updatePasswordService(student_id, old_password_hash, new_password_hash);

        return res.json(response);
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

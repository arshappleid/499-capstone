const express = require('express');
var crypto = require('crypto');
const router = express.Router();
const registerSuperAdminService = require('../services/registerSuperAdminService');

router.post('/', async (req, res) => {
    try {
        const super_admin_email = req.body.super_admin_email;
        const password = req.body.password;
        if (super_admin_email == null || super_admin_email == undefined || super_admin_email == "") {
            return res.status(400).json({
                status: "error",
                message: 'Invalid Data passed : Email is required'
            });
        }

        if (password == null || password == undefined || password == "") {
            return res.status(400).json({
                status: "error",
                message: 'Invalid Data passed : Password is required',
            });
        }
        const hashed_password = crypto.createHash('md5').update(password).digest('hex');

        const response = await registerSuperAdminService(super_admin_email, hashed_password);
        return res.json(response);
    } catch (e) {
        console.log(e);
        return 'Error occured while parsing request';
    }
});

module.exports = router;

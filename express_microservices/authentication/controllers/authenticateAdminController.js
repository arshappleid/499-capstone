const express = require('express');
const router = express.Router();
const authenticateAdminService = require('../services/authenticateAdminService');

router.post('/', async (req, res) => {
	try {
		const admin_email = req.body.email;
		const admin_password = req.body.admin_password;

		if (
			admin_email === null ||
			admin_email === '' ||
			admin_email === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Invalid Admin email passed.',
			});
		}
		if (
			admin_password === null ||
			admin_password === '' ||
			admin_password === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Invalid Admin password passed.',
			});
		}

		const response = await authenticateAdminService(
			admin_email,
			admin_password
		);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return 'Error occured while parsing request';
	}
});

module.exports = router;

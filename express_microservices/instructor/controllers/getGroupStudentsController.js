// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const getGroupStudentsService = require('../services/getGroupStudentsService');

router.post('/', async (req, res) => {
	try {
		const group_id = req.body.group_id;

		if (group_id === null || group_id === '' || group_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Group_id can not be null',
			});
		}

		const response = await getGroupStudentsService(group_id);

		return res.json(response);
	} catch (e) {
		console.log(e);
		return (
			'Error occured while parsing request in getGroupStudentsController.js: ' +
			e.message
		);
	}
});

module.exports = router;

const express = require('express');
const router = express.Router();
const getAllInstructorsService = require('../services/getAllInstructorsService');
router.get('/', async (req, res) => {
	const response = await getAllInstructorsService();
	return res.json(response);
});
module.exports = router;

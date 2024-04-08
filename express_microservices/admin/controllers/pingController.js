// pingController.js
const express = require('express');
const router = express.Router();

// Define the ping route
router.get('/ping', (req, res) => {
	res.json({ message: 'Pong!' });
});

module.exports = router;

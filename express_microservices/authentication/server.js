const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const port = process.env.port || 3000;
const { sequelize } = require('./database/index');
// import all the controllers here
const authenticateStudentController = require('./controllers/authenticateStudentController');
const authenticateInstructorController = require('./controllers/authenticateInstructorController');
const authenticateAdminController = require('./controllers/authenticateAdminController');
const instructorForgotPasswordController = require('./controllers/instructorForgotPasswordController');
const instructorResetPasswordController = require('./controllers/instructorResetPasswordController');
const studentForgotPasswordController = require('./controllers/studentForgotPasswordController');
const studentResetPasswordController = require('./controllers/studentResetPasswordController');
// Allow express to parse JSON
app.use(express.json());

const corsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'], // Add 'Authorization' to the allowed headers
};

app.use(cors(corsOptions));
// Routes , and the controllers we map them to.
app.use('/student', authenticateStudentController);
app.use('/instructor', authenticateInstructorController);
app.use('/instructorforgotpassword', instructorForgotPasswordController);
app.use('/instructorresetpassword', instructorResetPasswordController);
app.use('/studentforgotpassword', studentForgotPasswordController);
app.use('/studentresetpassword', studentResetPasswordController);
app.use('/admin', authenticateAdminController);

sequelize
	.sync({
		logging:
			process.env.NODE_ENV !== 'production' ||
			process.env.NODE_ENV !== 'test',
	})
	.then((result) => {
		//console.log(result);
	})
	.catch((error) => {
		console.log(error);
	});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack); // Log error stack trace to console
	res.status(500).send('Something broke!'); // Send error response to client
});

// Create HTTPS Server
http.createServer(app).listen(port, () => {
	console.log('HTTP server is running on http://localhost:' + port);
});

module.exports = { app };

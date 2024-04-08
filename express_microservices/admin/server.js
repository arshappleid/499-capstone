const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const port = process.env.port || 3000;
const { sequelize } = require('./database/index');
const authenticateToken = require('./jwt_auth'); // make sure the route is correct

// import all the controllers here
const updateInstructorController = require('./controllers/updateInstructorsController');
const updateInstructorController_v2 = require('./controllers/updateInstructorsController_v2');
const getAllInstructorsController = require('./controllers/getAllInstructorsController');
const removeInstructorAccessController = require('./controllers/removeInstructorAccessController');
const registerAdminController = require('./controllers/registerAdminController');
const pingController = require('./controllers/pingController');

// Allow express to parse JSON
app.use(express.json());

const corsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'], // Add 'Authorization' to the allowed headers
};

app.use(cors(corsOptions));

// Apis below will not use JWT Auth
app.use('/ping', pingController);
app.use('/register', registerAdminController);
app.use('/getallinstructors', getAllInstructorsController);
app.use(authenticateToken); // Apply authentication to all routes below.
// Routes , and the controllers we map them to.
app.use('/updateinstructoraccess', updateInstructorController_v2);
app.use('/removeinstructoraccess', removeInstructorAccessController);

// Sequelize setup
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
try {
	http.createServer(app).listen(port, () => {
		console.log('HTTP server is running on http://localhost:' + port);
	});
} catch (e) {
	http.createServer(app).listen(port + 1, () => {
		console.log('HTTP server is running on http://localhost:' + (port + 1));
	});
}

module.exports = { app };

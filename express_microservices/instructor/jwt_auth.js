const jsonwebtoken = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { Instructor } = require('./database/index');

// JWT Middleware
async function authenticateToken(req, res, next) {
	try {
		if (process.env.NODE_ENV === 'test') {
			next();
			return;
		} // skip validation if testing
		const authHeader = req.headers['authorization'];
		const token = authHeader;
		if (token == null) {
			return res
				.status(401)
				.send({ message: 'Could not read token , check format.' });
		}
		jsonwebtoken.verify(
			token,
			process.env.jwt_secret,
			{ algorithms: ['HS256'] },
			async (err, user) => {
				if (err) {
					if (err.name === 'UnauthorizedError') {
						res.status(401).send({ message: 'Invalid token' });
					} else if (err.name === 'TokenExpiredError') {
						res.status(401).send({ message: 'Expired Token' });
					} else {
						res.sendStatus(403).send({ message: err });
					}
				} else {
					// Verified token
					const instructor_id = await jwt_decode(token).instructor_id;
					const resp = await verifyUser(instructor_id);
					if (resp === false) {
						res.status(401).send({
							message: 'Instructor id could not be verified.',
						});
						return;
					}
					req.user = instructor_id;
					next();
				}
			}
		);
	} catch (e) {
		return res.sendStatus(401).send({
			message: 'Could not read token error occured, check format.',
		});
	}
}

async function verifyUser(instructor_id) {
	try {
		const resp = await Instructor.findOne({
			where: { INSTRUCTOR_ID: instructor_id },
		});
		if (resp == null) return false;

		return true;
	} catch (e) {
		console.log(
			'Error occured while verifying instructor , at jwt_auth/verifyUser : ' +
				e
		);
		return false;
	}
}

module.exports = authenticateToken;

const jsonwebtoken = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { Student } = require('./database/index');

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
			res.status(401).send({
				message: 'Could not read token , check format.',
			});
			return;
		}

		jsonwebtoken.verify(
			token,
			process.env.jwt_secret,
			{ algorithms: ['HS256'] },
			async (err, user) => {
				if (err) {
					if (err.name === 'UnauthorizedError') {
						res.status(401).send({ message: 'Invalid token' });
						return;
					} else if (err.name === 'TokenExpiredError') {
						res.status(401).send({ message: 'Expired Token' });
						return;
					} else {
						console.log(err);
						res.status(403).send({ err });
						return;
					}
				} else {
					// Verified token
					const student_id = await jwt_decode(token).student_id;
					const resp = await verifyUser(student_id);
					if (resp === false) {
						res.status(401).send({
							message: 'Student id could not be verified.',
						});
						return;
					}
					req.user = student_id;
					next();
				}
			}
		);
	} catch (e) {
		return res.status(401).send({
			message: 'Could not read token error occured, check format.',
		});
	}
}

async function verifyUser(student_id) {
	try {
		const resp = await Student.findOne({
			where: { STUDENT_ID: student_id },
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

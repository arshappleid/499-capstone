const jsonwebtoken = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { Instructor, SuperAdmin } = require('./database/index');

// JWT Middleware
async function authenticateToken(req, res, next) {
	if (process.env.NODE_ENV === 'test') {
		next();
		return;
	} // Skip authentication in test environment
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
					res.status(403).send({ message: err });
				}
			} else {
				// Verified token
				const admin_id = await jwt_decode(token).super_admin_id;
				const resp = await verifyUser(admin_id);
				if (resp === false) {
					res.status(401).send({
						message: 'Admin id could not be verified.',
					});
					return;
				}
				req.user = admin_id;
				next();
			}
		}
	);
}

async function verifyUser(super_admin_id) {
	try {
		const resp = await SuperAdmin.findOne({
			where: { SUPER_ADMIN_ID: super_admin_id },
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

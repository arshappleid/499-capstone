const jwt = require('jsonwebtoken');
const fs = require('fs');
let tokenExpirtationTime = process.env.tokenExpirtationTime || '48h';
// Path to secret
let dir = './../secret';
let file = 'JWTsecret.txt';

async function getNewJWTtoken(payload_to_encrypt) {
	try {
		return await jwt.sign(payload_to_encrypt, process.env.jwt_secret, {
			expiresIn: process.env.tokenExpirtationTime,
			algorithm: 'HS256',
		});
	} catch (e) {
		console.log('Error in getNewJWTtoken ' + e);
	}
}

async function generateNewSecret() {
	try {
		const crypto = require('crypto');
		const fs = require('fs');
		const path = require('path'); // Add this line
		let secret = await crypto.randomBytes(32).toString('hex');
		// write the secret to a file
		let fullPath = path.join(dir, file);

		// make sure the directory exists
		fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(fullPath, secret);
		return fullPath;
	} catch (e) {
		console.log('Error occured while generating a new Secret.' + e);
	}
}

module.exports = { getNewJWTtoken, generateNewSecret };

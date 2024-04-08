import { describe, expect, test } from 'vitest';
const jwt = require('jsonwebtoken');
import { getNewJWTtoken } from './../services/jwtToken';

if (process.env.NODE_ENV !== 'production') {
	describe('JWTToken Service Tests', () => {
		test('Test if returns the right value', async () => {
			const resp = await getNewJWTtoken({ user_email: 'test@gmail.com' });
			console.log('Response ' + resp);
			// Ensure that the function returns a value
			expect(resp).not.toBeNull();

			// Extract payload from the token
			let decoded;
			try {
				// secret key
				let secretKey = process.env.jwt_secret;
				if (secretKey != null || secretKey != undefined) {
					// Note: do not use the secret key used in production
					// Replace 'yourSecretKey' with the secret key used when signing the JWT
					decoded = await jwt.verify(resp, secretKey);
					// Ensure that the payload contains the right information
					expect(decoded.user_email).toBe('test@gmail.com');
				}
			} catch (err) {
				// The JWT is invalid
				console.error(err);
				throw err;
			}
		});
	});
}

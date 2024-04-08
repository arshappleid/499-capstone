const { SuperAdmin } = require('../database/index');
const { getNewJWTtoken } = require('./jwtToken');

async function authenticateAdminService(admin_email, admin_hashed_password) {
	try {
		const resp = await SuperAdmin.findOne({
			where: {
				EMAIL: admin_email,
			},
		});

		if (resp == null) {
			return {
				status: 'error',
				message: 'Unable to find user associated with email',
			};
		}

		if (resp.MD5_HASHED_PASSWORD != admin_hashed_password) {
			return {
				status: 'error',
				message: 'password incorrect',
			};
		}

		return {
			status: 'success',
			message: 'admin sign in successful',
			data: {
				super_admin_id: resp.SUPER_ADMIN_ID,
			},
			oAuthToken_encrypted_super_admin_id: await getNewJWTtoken({
				super_admin_id: resp.SUPER_ADMIN_ID,
			}),
		};
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results',
		};
	}
}

module.exports = authenticateAdminService;

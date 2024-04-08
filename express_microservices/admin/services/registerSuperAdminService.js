const {SuperAdmin} = require('../database/index');

async function registerSuperAdminService(super_admin_email, hashed_password) {
    try {
        const super_admin = await SuperAdmin.findOne({
            where: {
                EMAIL: super_admin_email
            }
        });

        if (super_admin != null) {
            return {
                status: "error",
                message: "Account with email already exists"
            }
        }

        await SuperAdmin.create({
            EMAIL: super_admin_email,
            MD5_HASHED_PASSWORD: hashed_password
        });

        return {
            status: "success",
            message: "super admin register successful"
        }

    } catch (e) {
        return {
            status: 'error',
            message: 'Error occured while retrieving results : '+e,
        };
    }
}

module.exports = registerSuperAdminService;

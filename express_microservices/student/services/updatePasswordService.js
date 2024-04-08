const { Student } = require('../database/index');

async function updatePasswordService(
	student_id,
	old_password_hash,
	new_password_hash
) {
	try {
		if (
			old_password_hash === null ||
			old_password_hash.length === '' ||
			old_password_hash === undefined
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		if (
			new_password_hash === null ||
			new_password_hash === '' ||
			new_password_hash === undefined
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		if (new_password_hash === old_password_hash) {
			return {
				status: 'error',
				message: 'new password should not be the same as the old one',
			};
		}
		const student = await Student.findOne({
			where: { STUDENT_ID: student_id },
		});
		if (student == null) {
			return {
				status: 'error',
				message: 'student id not found',
			};
		}

		if (old_password_hash != student.MD5_HASHED_PASSWORD) {
			return {
				status: 'error',
				message: 'Incorred old password provided',
			};
		}

		if (new_password_hash == student_id.MD5_HASHED_PASSWORD) {
			return {
				status: 'error',
				message: 'new password should not be the same as the old one',
			};
		}

		await student.update({ MD5_HASHED_PASSWORD: new_password_hash });
		await student.save();
		return {
			status: 'success',
			data: 'student password update successfull',
		};
	} catch (e) {
		console.log('Error in in updatePasswordService Service' + e);
		return {
			status: 'error',
			message:
				'error occured while retrieving results in updatePasswordService Service' +
				e,
		};
	}
}

module.exports = updatePasswordService;

const { Student } = require('../database/index');
const { Op } = require('sequelize');

async function updateProfileService(
	student_id,
	student_first_name,
	student_middle_name,
	student_last_name,
	email
) {
	try {
		const student = await Student.findOne({
			where: { STUDENT_ID: student_id },
		});
		if (student == null) {
			return {
				status: 'error',
				message: 'invalid student id passed',
			};
		}

		if (
			student_first_name !== '' ||
			student_first_name !== undefined ||
			student_first_name !== null
		) {
			await student.update({ FIRST_NAME: student_first_name });
		}

		if (
			student_middle_name !== '' ||
			student_middle_name !== undefined ||
			student_middle_name !== null
		) {
			await student.update({ MIDDLE_NAME: student_middle_name });
		}

		if (
			student_last_name !== '' ||
			student_last_name !== undefined ||
			student_last_name !== null
		) {
			await student.update({ LAST_NAME: student_last_name });
		}

		if (email !== '' || email !== undefined || email !== null) {
			let student_with_email = await Student.findOne({
				where: {
					EMAIL: email,
					STUDENT_ID: {
						[Op.ne]: student_id,
					},
				},
			});
			if (student_with_email == null) {
				await student.update({ EMAIL: email });
			} else {
				return {
					status: 'error',
					message:
						'A student with different email was found, nothing was updated , try again with a different email.',
				};
			}
		}

		await student.save();
		return {
			status: 'success',
			message: 'student profile update successfull',
		};
	} catch (e) {
		console.log('Error in in updateProfileService' + e);
		return {
			status: 'error',
			message:
				'error occured while retrieving results in updateProfileService' +
				e,
		};
	}
}

module.exports = updateProfileService;

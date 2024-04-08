// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const e = require('express');
const { Instructor } = require('../database/index');

async function updateInstructorPasswordService(
	instructor_id,
	instructor_new_password,
	instructor_old_password
) {
	try {
		if (
			instructor_id === undefined ||
			instructor_new_password === undefined ||
			instructor_old_password === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			instructor_id === '' ||
			instructor_new_password === '' ||
			instructor_old_password === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const instructorExist = await Instructor.findAll({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
		if (instructorExist.length === 0) {
			return {
				status: 'error',
				message: 'Instructor does not exist',
			};
		} else {
			if (
				instructorExist[0].MD5_HASHED_PASSWORD !=
				instructor_old_password
			) {
				return {
					status: 'error',
					message: 'Old password is incorrect',
				};
			} else {
				await Instructor.update(
					{
						MD5_HASHED_PASSWORD: instructor_new_password,
					},
					{
						where: {
							INSTRUCTOR_ID: instructor_id,
						},
					}
				);
			}
		}

		return {
			status: 'success',
			message: 'Instructor password updated successfully',
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in updateInstructorPasswordService.js: ' +
				e.message,
		};
	}
}

module.exports = updateInstructorPasswordService;

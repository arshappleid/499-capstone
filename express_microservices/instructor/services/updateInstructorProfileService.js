// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const e = require('express');
const { Instructor } = require('../database/index');

const checkIfInstructorIdExistService = require('./checkIfInstructorIdExistService');

async function updateInstructorProfileService(
	instructor_id,
	instructor_firstname,
	instructor_middlename,
	instructor_lastname,
	instructor_email
) {
	try {
		if (
			instructor_id === undefined ||
			instructor_firstname === undefined ||
			instructor_email === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			instructor_id === '' ||
			instructor_firstname === '' ||
			instructor_email === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const instructorExist = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorExist.status === false) {
			return {
				status: 'error',
				message: 'Instructor id does not exist',
			};
		}

		const instructorEmailExist = await Instructor.findAll({
			where: {
				EMAIL: instructor_email,
			},
		});
		if (
			instructorEmailExist.length > 0 &&
			instructorEmailExist[0].INSTRUCTOR_ID !== instructor_id
		) {
			return {
				status: 'error',
				message: 'Email already exist',
			};
		}

		await Instructor.update(
			{
				FIRST_NAME: instructor_firstname,
				MIDDLE_NAME: instructor_middlename,
				LAST_NAME: instructor_lastname,
				EMAIL: instructor_email,
			},
			{
				where: {
					INSTRUCTOR_ID: instructor_id,
				},
			}
		);

		const instructorUpdated = await Instructor.findAll({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
			attributes: [
				'INSTRUCTOR_ID',
				'FIRST_NAME',
				'MIDDLE_NAME',
				'LAST_NAME',
				'EMAIL',
			],
		});
		return {
			status: 'success',
			data: instructorUpdated,
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorUpdateProfileService.js: ' +
				e.message,
		};
	}
}

module.exports = updateInstructorProfileService;

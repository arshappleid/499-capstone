// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const { EvaluationForm, EvaluationAnswer } = require('../database/index');

const checkIfInstructorIdExistService = require('./checkIfInstructorIdExistService');

async function checkIfTheresAnyFormRecords(instructor_id, form_id) {
	try {
		if (instructor_id === undefined || form_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (instructor_id === '' || form_id === '') {
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
		const formExist = await EvaluationForm.findAll({
			where: {
				FORM_ID: form_id,
			},
		});
		if (formExist.length === 0) {
			return {
				status: 'error',
				message: 'Form does not exist',
			};
		}
		const recordExist = await EvaluationAnswer.findAll({
			where: {
				FORM_ID: form_id,
			},
		});

		if (recordExist.length > 0) {
			return {
				status: true,
				message: 'There are records for this form',
			};
		}
		return {
			status: false,
			message: 'There are no records for this form',
		};
	} catch (err) {
		console.log(err);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in checkIfTheresAnyFormRecords.js: ' +
				e.message,
		};
	}
}

module.exports = checkIfTheresAnyFormRecords;

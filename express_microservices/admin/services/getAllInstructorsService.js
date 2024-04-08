const { Instructor } = require('../database/index');

async function getAllInstructorsService() {
	try {
		const response = await Instructor.findAll({
			attributes: [
				['INSTRUCTOR_ID', 'instructor_id'],
				['FIRST_NAME', 'instructor_first_name'],
				['MIDDLE_NAME', 'instructor_middle_name'],
				['LAST_NAME', 'instructor_last_name'],
				['EMAIL', 'email'],
				['INSTRUCTOR_ACCESS', 'instructor_access'],
			],
		});
		if (response == null || response.length == 0) {
			return {
				status: 'error',
				message: 'Error Ocuured While retrieving results',
			};
		}
		console.log('Instructors retrieved successfully : ' + response);
		return {
			status: 'success',
			instructors: response,
		};
	} catch (e) {
		console.log(
			'Error occured while retrieving results in getAllInstructorsService ' +
				e
		);
		return {
			status: 'error',
			message: 'Error occured while retrieving results',
		};
	}
}

module.exports = getAllInstructorsService;

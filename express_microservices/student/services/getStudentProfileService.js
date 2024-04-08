// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { sequelize } = require('../database/index');
const { Student, StudentCourse } = require('../database/index');

async function getStudentProfileService(student_id) {
	try {
		if (student_id == undefined || student_id == '') {
			return {
				status: 'error',
				message: 'student id not found',
			};
		}

		let resp = await Student.findAll({
			attributes: [
				// [original_name, new_name]
				['FIRST_NAME', 'student_first_name'],
				['MIDDLE_NAME', 'student_middle_name'],
				['LAST_NAME', 'student_last_name'],
				['EMAIL', 'email'],
			],
			where: { STUDENT_ID: student_id },
		});
		// Return an empty list , if no students are registered
		if (resp == undefined) {
			return { status: 'error', message: 'student id not found' };
		}
		if (resp.length == 0) {
			return { status: 'error', message: 'student id not found' };
		}
		resp = JSON.parse(JSON.stringify(resp));
		return { status: 'success', data: resp[0] };
	} catch (e) {
		console.log('Error in in getStudentProfileService ' + e);
		return {
			status: 'error',
			message:
				'error occured while retrieving results in getStudentProfileService\n' +
				e,
		};
	}
}

module.exports = getStudentProfileService;

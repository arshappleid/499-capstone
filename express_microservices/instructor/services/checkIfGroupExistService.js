// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { CourseGroupEvaluation } = require('../database/index');

async function checkIfGroupExistService(course_id, group_name) {
	try {
		if (course_id === undefined || group_name === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (course_id === '' || group_name === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const response = await CourseGroupEvaluation.findAll({
			where: { COURSE_ID: course_id, GROUP_NAME: group_name },
		});
		if (response.length > 0) {
			return { status: true, message: 'group exists.' };
		} else {
			return {
				status: false,
				message: 'group not exists.',
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = checkIfGroupExistService;

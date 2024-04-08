// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { CourseGroupEvaluation } = require('../database/index');

async function checkIfGroupBelongsToCourseService(group_id, course_id) {
	try {
		if (group_id === undefined || course_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (group_id === '' || course_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const response = await CourseGroupEvaluation.findAll({
			where: { GROUP_ID: group_id, COURSE_ID: course_id },
		});
		if (response.length === 0) {
			return {
				status: false,
				message: 'group does not belong to this course',
			};
		} else {
			return {
				status: true,
				message: 'group belongs to this course',
			};
		}
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}

module.exports = checkIfGroupBelongsToCourseService;

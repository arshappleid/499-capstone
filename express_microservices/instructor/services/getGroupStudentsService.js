// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const {
	GroupMembersTable,
	CourseGroupEvaluation,
	Student,
} = require('../database/index');

async function getGroupStudentsService(group_id) {
	try {
		if (group_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (group_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const group = await CourseGroupEvaluation.findOne({
			where: { GROUP_ID: group_id },
		});

		if (group === null) {
			return {
				status: 'error',
				message: 'Group does not exist',
			};
		}

		const groupMembers = await GroupMembersTable.findAll({
			where: { GROUP_ID: group_id },
			include: [
				{
					model: Student,
					attributes: [
						'STUDENT_ID',
						'FIRST_NAME',
						'MIDDLE_NAME',
						'LAST_NAME',
						'EMAIL',
					],
				},
			],
		});

		const students = groupMembers.map((groupMember) => groupMember.STUDENT);

		return { status: 'success', data: students };
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results in getGroupStudentsService.js: ' + e.message,
		};
	}
}

module.exports = getGroupStudentsService;

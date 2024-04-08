// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
//Tested by: Lance Haoxiang Xu
const {
	GroupMembersTable,
	CourseGroupEvaluation,
	Student,
} = require('../database/index');

async function getGroupStudentsService(student_id, course_id) {
	try {
		if (student_id === undefined || course_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (student_id === '' || course_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const groupId = await GroupMembersTable.findOne({
			where: {
				STUDENT_ID: student_id,
			},
			include: [
				{
					model: CourseGroupEvaluation,
					where: { COURSE_ID: course_id },
				},
			],
		});
		if (groupId === null) {
			return {
				status: 'error',
				message: 'Student is not in any group',
			};
		}
		const group_id = groupId.GROUP_ID;

		const groupName = await CourseGroupEvaluation.findOne({
			where: { GROUP_ID: group_id },
		});
		if (groupName === null) {
			return {
				status: 'error',
				message: 'Group not found',
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

		return { status: 'success', data: students, group: groupName };
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in getGroupStudentsService.js: ' +
				e.message,
		};
	}
}

module.exports = getGroupStudentsService;

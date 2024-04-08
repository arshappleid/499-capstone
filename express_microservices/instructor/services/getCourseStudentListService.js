// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	GroupMembersTable,
	CourseGroupEvaluation,
	StudentCourse,
	Student,
} = require('../database/index');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');

async function getCourseStudentListService(course_id) {
	try {
		if (course_id === undefined) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (course_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		const courseExist = await checkIfCourseExistService(course_id);
		if (courseExist.status === false) {
			return {
				status: 'error',
				message: 'Course id does not exist',
			};
		}
		const response = await StudentCourse.findAll({
			where: { COURSE_ID: course_id },
			include: [
				{
					model: Student,
					required: true,
					attributes: [
						'STUDENT_ID',
						'FIRST_NAME',
						'MIDDLE_NAME',
						'LAST_NAME',
						'EMAIL',
					],
					include: [
						{
							model: GroupMembersTable,
							attributes: ['GROUP_ID'],
							include: [
								{
									model: CourseGroupEvaluation,
									where: { COURSE_ID: course_id },
									attributes: ['GROUP_NAME'],
								},
							],
						},
					],
				},
			],
		});

		let students = response.map((groupMember) => groupMember.STUDENT);

		return { status: 'success', data: await dataReformatting(students) };
	} catch (e) {
		return {
			status: 'error',
			message: 'error occured while retrieving results',
		};
	}
}
async function dataReformatting(students) {
	let result = [];
	for (let i = 0; i < students.length; i++) {
		let student = students[i];
		let studentObj = {};
		if (student.GROUP_MEMBERS_TABLEs[0] === undefined) {
			studentObj = {
				STUDENT_ID: student.STUDENT_ID,
				FIRST_NAME: student.FIRST_NAME,
				MIDDLE_NAME: student.MIDDLE_NAME,
				LAST_NAME: student.LAST_NAME,
				EMAIL: student.EMAIL,
				GROUP_ID: 0,
				GROUP_NAME: '',
			};
		} else {
			studentObj = {
				STUDENT_ID: student.STUDENT_ID,
				FIRST_NAME: student.FIRST_NAME,
				MIDDLE_NAME: student.MIDDLE_NAME,
				LAST_NAME: student.LAST_NAME,
				EMAIL: student.EMAIL,
				GROUP_ID: student.GROUP_MEMBERS_TABLEs[0].GROUP_ID,
				GROUP_NAME:
					student.GROUP_MEMBERS_TABLEs[0].COURSE_GROUP_EVALUATION
						.GROUP_NAME,
			};
		}
		result.push(studentObj);
	}
	return result;
}

module.exports = getCourseStudentListService;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu
const {
	GroupMembersTable,
	StudentCourse,
	CourseGroupEvaluation,
} = require('../database/index');

async function addStudentToGroupPreviewService(
	course_id,
	group_id,
	student_id
) {
	try {
		if (
			course_id === undefined ||
			group_id === undefined ||
			student_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (course_id === '' || group_id === '' || student_id === '') {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}

		const relationExist = await GroupMembersTable.findAll({
			where: { STUDENT_ID: student_id, GROUP_ID: group_id },
		});
		if (relationExist.length > 0) {
			return {
				status: 'duplicate',
				message: 'Student already enrolled in group',
			};
		}

		const studentInCourse = await StudentCourse.findAll({
			where: { STUDENT_ID: student_id, COURSE_ID: course_id },
		});
		if (studentInCourse.length === 0) {
			return {
				status: 'not in course',
				message: 'Student not enrolled in course',
			};
		}

		const studentInAnotherGroupForThisCourse =
			await GroupMembersTable.findAll({
				attributes: ['STUDENT_ID', 'GROUP_ID'],
				include: [
					{
						model: CourseGroupEvaluation,
						attributes: [],
						where: { COURSE_ID: course_id },
					},
				],
				where: { STUDENT_ID: student_id },
			});

		if (studentInAnotherGroupForThisCourse.length > 0) {
			return {
				status: 'in another group',
				message:
					'Student already enrolled in another group for this course',
			};
		}

		return {
			status: 'success',
			data: { student_id: student_id },
		};
	} catch (e) {
		console.log('Error in addStudentToCourseService: ', e);
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in addStudentToCourseService.js: ' +
				e.message,
		};
	}
}

module.exports = addStudentToGroupPreviewService;

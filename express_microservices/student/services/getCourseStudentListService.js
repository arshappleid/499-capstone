// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const { sequelize } = require('../database/index');
const { Student, StudentCourse } = require('../database/index');

async function getCourseStudentList(course_ID) {
	try {
		if (course_ID == undefined) {
			return {
				status: 'error',
				message: 'course_ID is undefined',
			};
		}

		if (course_ID == '') {
			return {
				status: 'error',
				message: 'course_ID is empty',
			};
		}

		let registeredStudents = await Student.findAll({
			attributes: [
				// [original_name, new_name]
				['STUDENT_ID', 'studentID'],
				['FIRST_NAME', 'student_first_name'],
				['MIDDLE_NAME', 'student_middle_name'],
				['LAST_NAME', 'student_last_name'],
				['EMAIL', 'email'],
			],
			include: [
				{
					model: StudentCourse,
					where: { COURSE_ID: course_ID },
					required: true,
					attributes: [],
				},
			],
		});
		// Return an empty list , if no students are registered
		if (registeredStudents == undefined) {
			return { status: 'error', message: 'course id not found' };
		}
		return { status: 'success', data: registeredStudents };
	} catch (e) {
		console.log('Error in in getCourseStudentList Service' + e);
		return {
			status: 'error',
			message:
				'error occured while retrieving results in getCourseStudentList Service' +
				e,
		};
	}
}

module.exports = getCourseStudentList;

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Test by Lance Haoxiang Xu
const { CourseGroupEvaluation } = require('../database/index');

const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');

async function instructorCreateGroupService(
	instructor_id,
	course_id,
	group_name
) {
	try {
		if (
			course_id === undefined ||
			group_name === undefined ||
			instructor_id === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}

		if (course_id === '' || group_name === '' || instructor_id === '') {
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
		const courseExist = await checkIfCourseExistService(course_id);
		if (courseExist.status === false) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		const instructorTeachesCourse =
			await checkIfInstructorTeachesCourseService(
				instructor_id,
				course_id
			);
		if (instructorTeachesCourse.status === false) {
			return {
				status: 'error',
				message: 'Instructor does not teach this course',
			};
		}

		const groupExist = await CourseGroupEvaluation.findAll({
			where: {
				COURSE_ID: course_id,
				GROUP_NAME: group_name,
			},
		});
		if (groupExist.length > 0) {
			return {
				status: 'duplicate',
				message: 'Group name already exists',
			};
		}
		const newGroup = await CourseGroupEvaluation.create({
			COURSE_ID: course_id,
			GROUP_NAME: group_name,
		});

		return {
			status: 'success',
			message: 'group created successfully',
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in InstructorCreateGroupService.js: ' +
				e.message,
		};
	}
}

module.exports = instructorCreateGroupService;

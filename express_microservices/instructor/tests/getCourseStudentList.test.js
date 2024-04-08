// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	GroupMembersTable,
	CourseGroupEvaluation,
	StudentCourse,
	Student,
	Instructor,
	Course,
} = require('../database/index');

const getCourseStudentListService = require('../services/getCourseStudentListService');

describe('getCourseStudentList', async () => {
	const student_id = 3100;
	const instructor_id = 3100;
	let course_id;
	let group_id;

	beforeEach(async () => {
		try {
			await Student.create({
				STUDENT_ID: student_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3100',
				COURSE_CODE: 'COURSE_CODE3100',
				COURSE_SEMESTER: 'COURSE_SEMESTER3100',
				COURSE_YEAR: 'COURSE_YEAR3100',
				COURSE_TERM: 'COURSE_TERM3100',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			await StudentCourse.create({
				STUDENT_ID: student_id,
				COURSE_ID: course_id,
			});
			const groupCreated = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'TEST_GROUP_NAME',
			});
			group_id = groupCreated.get('GROUP_ID');

			await GroupMembersTable.create({
				STUDENT_ID: student_id,
				GROUP_ID: group_id,
			});
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await GroupMembersTable.destroy({
				where: { STUDENT_ID: student_id },
			});
			await CourseGroupEvaluation.destroy({
				where: { COURSE_ID: course_id },
			});
			await StudentCourse.destroy({
				where: { STUDENT_ID: student_id },
			});
			await Course.destroy({
				where: { COURSE_ID: course_id },
			});
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: instructor_id },
			});
			await Student.destroy({
				where: { STUDENT_ID: student_id },
			});
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await getCourseStudentListService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await getCourseStudentListService('');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Course ID', async () => {
		const result = await getCourseStudentListService(0);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Course id does not exist');
	});
	test('Get Successfully', async () => {
		const result = await getCourseStudentListService(course_id);

		expect(result.status).toBe('success');
		expect(result.data[0].STUDENT_ID).toBe(student_id);
		expect(result.data[0].FIRST_NAME).toBe('FIRST_NAME');
		expect(result.data[0].LAST_NAME).toBe('LAST_NAME');
		expect(result.data[0].EMAIL).toBe('EMAIL@TEST.COM');
		expect(result.data[0].GROUP_ID).toBe(group_id);
		expect(result.data[0].GROUP_NAME).toBe('TEST_GROUP_NAME');
	});
});

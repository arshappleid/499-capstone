// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	Instructor,
	Student,
	Course,
	StudentCourse,
	CourseGroupEvaluation,
	GroupMembersTable,
} = require('../database/index');

const removeStudentsAndGroupsFromCourseService = require('../services/removeStudentsAndGroupsFromCourseService');

describe('addStudentToCourse', async () => {
	const instructor_id = 3240;
	const error_instructor_id = 6240;
	const student_id1 = 3240;
	const student_id2 = 6240;
	const student_id3 = 9240;
	const student_id4 = 12240;
	let course_id;
	let group_id;
	let other_group_id;

	beforeEach(async () => {
		try {
			await Student.create({
				STUDENT_ID: student_id1,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'STUDENT3240@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id2,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'STUDENT6240@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id3,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'STUDENT9240@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id4,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'STUDENT12240@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL3240@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Instructor.create({
				INSTRUCTOR_ID: error_instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL6240@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3240',
				COURSE_CODE: 'COURSE_CODE3240',
				COURSE_SEMESTER: 'COURSE_SEMESTER3240',
				COURSE_YEAR: 'COURSE_YEAR3240',
				COURSE_TERM: 'COURSE_TERM3240',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			await StudentCourse.create({
				STUDENT_ID: student_id1,
				COURSE_ID: course_id,
			});
			await StudentCourse.create({
				STUDENT_ID: student_id2,
				COURSE_ID: course_id,
			});
			await StudentCourse.create({
				STUDENT_ID: student_id4,
				COURSE_ID: course_id,
			});
			const groupCreated = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'TEST_GROUP_EVALUATION_NAME3240',
			});
			group_id = groupCreated.get('GROUP_ID');
			const otherGroupCreated = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'TEST_GROUP_EVALUATION_NAME12240',
			});
			other_group_id = otherGroupCreated.get('GROUP_ID');
			await GroupMembersTable.create({
				GROUP_ID: group_id,
				STUDENT_ID: student_id1,
			});
			await GroupMembersTable.create({
				GROUP_ID: other_group_id,
				STUDENT_ID: student_id4,
			});
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await GroupMembersTable.destroy({
				where: { GROUP_ID: group_id },
			});
			await GroupMembersTable.destroy({
				where: { GROUP_ID: other_group_id },
			});
			await CourseGroupEvaluation.destroy({
				where: { GROUP_ID: group_id },
			});
			await CourseGroupEvaluation.destroy({
				where: { GROUP_ID: other_group_id },
			});
			await StudentCourse.destroy({
				where: { STUDENT_ID: student_id1 },
			});
			await StudentCourse.destroy({
				where: { STUDENT_ID: student_id2 },
			});
			await StudentCourse.destroy({
				where: { STUDENT_ID: student_id3 },
			});
			await StudentCourse.destroy({
				where: { STUDENT_ID: student_id4 },
			});
			await Course.destroy({
				where: { COURSE_ID: course_id },
			});
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: instructor_id },
			});
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: error_instructor_id },
			});
			await Student.destroy({
				where: { STUDENT_ID: student_id1 },
			});
			await Student.destroy({
				where: { STUDENT_ID: student_id2 },
			});
			await Student.destroy({
				where: { STUDENT_ID: student_id3 },
			});
			await Student.destroy({
				where: { STUDENT_ID: student_id4 },
			});
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await removeStudentsAndGroupsFromCourseService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await removeStudentsAndGroupsFromCourseService(
			'',
			'',
			''
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Instructor not exist', async () => {
		const result = await removeStudentsAndGroupsFromCourseService(
			group_id,
			course_id,
			0
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor does not exist');
	});
	test('Group not exist', async () => {
		const result = await removeStudentsAndGroupsFromCourseService(
			course_id,
			0,
			instructor_id
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Group does not exist or does not belong to this course'
		);
	});
	test('Instructor not exist', async () => {
		const result = await removeStudentsAndGroupsFromCourseService(
			course_id,
			group_id,
			0
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor does not exist');
	});
	test('Instructor does not teach this course', async () => {
		const result = await removeStudentsAndGroupsFromCourseService(
			course_id,
			group_id,
			error_instructor_id
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor does not teach this course');
	});
	test('Remove Students from Group', async () => {
		const result = await removeStudentsAndGroupsFromCourseService(
			course_id,
			group_id,
			instructor_id
		);

		expect(result.status).toBe('success');
		expect(result.message).toBe('Group Remove success');

		const group = await CourseGroupEvaluation.findOne({
			where: { GROUP_ID: group_id },
		});

		expect(group).toBeNull();
	});
});

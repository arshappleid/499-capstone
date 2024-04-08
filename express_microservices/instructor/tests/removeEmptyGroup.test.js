// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	CourseGroupEvaluation,
	GroupMembersTable,
	Student,
	Instructor,
	Course,
} = require('../database/index');

const removeEmptyGroupService = require('../services/removeEmptyGroupService');

describe('removeEmptyGroupService', async () => {
	const student_id = 3220;
	const instructor_id = 3220;
	let course_id;
	let group_id1;
	let group_id2;

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
				COURSE_NAME: 'TEST_COURSE_NAME3220',
				COURSE_CODE: 'COURSE_CODE3220',
				COURSE_SEMESTER: 'COURSE_SEMESTER3220',
				COURSE_YEAR: 'COURSE_YEAR3220',
				COURSE_TERM: 'COURSE_TERM3220',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			const groupCreated1 = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'TEST_GROUP_NAME1',
			});
			const groupCreated2 = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'TEST_GROUP_NAME2',
			});
			group_id1 = groupCreated1.get('GROUP_ID');
			group_id2 = groupCreated2.get('GROUP_ID');

			await GroupMembersTable.create({
				STUDENT_ID: student_id,
				GROUP_ID: group_id2,
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
				where: { GROUP_ID: group_id1 },
			});
			await CourseGroupEvaluation.destroy({
				where: { GROUP_ID: group_id2 },
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
		const result = await removeEmptyGroupService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await removeEmptyGroupService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Course ID', async () => {
		const result = await removeEmptyGroupService(
			instructor_id,
			0,
			group_id1
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Course id does not exist');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await removeEmptyGroupService(0, course_id, group_id1);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Non-Existent Group ID', async () => {
		const result = await removeEmptyGroupService(
			instructor_id,
			course_id,
			0
		);
	
		expect(result.status).toBe('error');
		expect(result.message).toBe('Group does not exist');
	});
	test('Group is not empty', async () => {
		const result = await removeEmptyGroupService(
			instructor_id,
			course_id,
			group_id2
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Group is not empty');
	});
	test('Remove Successfully', async () => {
		const result = await removeEmptyGroupService(
			instructor_id,
			course_id,
			group_id1
		);

		expect(result.status).toBe('success');
		expect(result.message).toBe('Group removed successfully');
	});
});

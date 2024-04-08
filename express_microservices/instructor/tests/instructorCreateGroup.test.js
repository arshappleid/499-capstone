// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	CourseGroupEvaluation,
	Instructor,
	Course,
} = require('../database/index');

const instructorCreateGroupService = require('../services/instructorCreateGroupService');

describe('instructorCreateGroup', async () => {
	const instructor_id = 3212;
	let course_id;
	let group_id1;
	let group_id2 = 0;

	beforeEach(async () => {
		try {
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
				COURSE_NAME: 'TEST_COURSE_NAME3212',
				COURSE_CODE: 'COURSE_CODE3212',
				COURSE_SEMESTER: 'COURSE_SEMESTER3212',
				COURSE_YEAR: 'COURSE_YEAR3212',
				COURSE_TERM: 'COURSE_TERM3212',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			const groupCreated1 = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'DUPLICATE_TEST_GROUP_NAME',
			});
			group_id1 = groupCreated1.get('GROUP_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
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
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await instructorCreateGroupService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await instructorCreateGroupService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Course ID', async () => {
		const result = await instructorCreateGroupService(
			instructor_id,
			0,
			'DUPLICATE_TEST_GROUP_NAME'
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Course does not exist');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await instructorCreateGroupService(
			0,
			course_id,
			'DUPLICATE_TEST_GROUP_NAME'
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Group name already exists', async () => {
		const result = await instructorCreateGroupService(
			instructor_id,
			course_id,
			'DUPLICATE_TEST_GROUP_NAME'
		);

		expect(result.status).toBe('duplicate');
		expect(result.message).toBe('Group name already exists');
	});
	test('Create Successfully', async () => {
		const result = await instructorCreateGroupService(
			instructor_id,
			course_id,
			'TEST_GROUP_NAME3212'
		);

		const groupCreated2 = await CourseGroupEvaluation.findOne({
			where: { GROUP_NAME: 'TEST_GROUP_NAME3212' },
			attributes: ['GROUP_ID'],
		});

		group_id2 = groupCreated2.get('GROUP_ID');

		expect(result.status).toBe('success');
		expect(result.message).toBe('group created successfully');
	});
});

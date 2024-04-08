// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { InstructorCourse, Instructor, Course } = require('../database/index');

const instructorCreateCourseService = require('../services/instructorCreateCourseService');

describe('instructorCreateCourse', async () => {
	const instructor_id = 3210;
	let course_id1;
	let course_id2;

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
			const courseCreated1 = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3210',
				COURSE_CODE: 'COURSE_CODE3210',
				COURSE_SEMESTER: 'COURSE_SEMESTER3210',
				COURSE_YEAR: 'COURSE_YEAR3210',
				COURSE_TERM: 'COURSE_TERM3210',
				COURSE_VISIBILITY: 0,
			});
			course_id1 = courseCreated1.get('COURSE_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await InstructorCourse.destroy({
				where: { COURSE_ID: course_id1 },
			});
			await InstructorCourse.destroy({
				where: { COURSE_ID: course_id2 },
			});
			await Course.destroy({
				where: { COURSE_ID: course_id1 },
			});
			await Course.destroy({
				where: { COURSE_ID: course_id2 },
			});
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: instructor_id },
			});
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await instructorCreateCourseService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await instructorCreateCourseService(
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			''
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await instructorCreateCourseService(
			0,
			'TEST_COURSE_NAME',
			'COURSE_CODE',
			'COURSE_SEMESTER',
			`COURSE_YEAR`,
			'COURSE_TERM',
			0,
			0,
			0,
			'EXTERNAL_LINK'
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Course is already exist', async () => {
		const result = await instructorCreateCourseService(
			instructor_id,
			'TEST_COURSE_NAME3210',
			'COURSE_CODE3210',
			'COURSE_SEMESTER3210',
			`COURSE_YEAR3210`,
			'COURSE_TERM3210',
			0
		);

		expect(result.status).toBe('duplicate');
		expect(result.message).toBe('Course already exists');
	});
	test('Create Successfully', async () => {
		const result = await instructorCreateCourseService(
			instructor_id,
			'NEW_COURSE_NAME3230',
			'COURSE_CODE3230',
			'COURSE_SEMESTER3230',
			'COURSE_YEAR3230',
			'COURSE_TERM3230',
			0
		);

		const courseCreated2 = await Course.findOne({
			where: { COURSE_NAME: 'NEW_COURSE_NAME3230' },
			attributes: ['COURSE_ID'],
		});

		course_id2 = courseCreated2.get('COURSE_ID');

		expect(result.status).toBe('success');
		expect(result.data.course_id).toBe(course_id2);
	});
});

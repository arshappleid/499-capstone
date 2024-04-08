// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
import { describe, test, expect } from 'vitest';
const { InstructorCourse, Instructor, Course } = require('../database/index');

const instructorSetCourseVisibiliyService = require('../services/instructorSetCourseVisibiliyService');

describe('instructorSetCourseVisibiliy', async () => {
	const instructor_id = 3239;
	const error_instructor_id = 6239;
	let course_id;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL3239@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Instructor.create({
				INSTRUCTOR_ID: error_instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL6239@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated1 = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3239',
				COURSE_CODE: 'COURSE_CODE3239',
				COURSE_SEMESTER: 'COURSE_SEMESTER3239',
				COURSE_YEAR: 'COURSE_YEAR3239',
				COURSE_TERM: 'COURSE_TERM3239',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated1.get('COURSE_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await InstructorCourse.destroy({
				where: { COURSE_ID: course_id },
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
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await instructorSetCourseVisibiliyService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await instructorSetCourseVisibiliyService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await instructorSetCourseVisibiliyService(
			0,
			course_id,
			0
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Instructor does not own the course', async () => {
		const result = await instructorSetCourseVisibiliyService(
			error_instructor_id,
			course_id,
			0
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor does not teach this course');
	});
	test('Set Successfully', async () => {
		const result = await instructorSetCourseVisibiliyService(
			instructor_id,
			course_id,
			1
		);

		expect(result.status).toBe('success');
		expect(result.data.course_visibility).toBe(1);

		const course_visibility = await Course.findOne({
			where: { COURSE_ID: course_id },
		});

		expect(course_visibility.get('COURSE_VISIBILITY')).toBe(true);
	});
});

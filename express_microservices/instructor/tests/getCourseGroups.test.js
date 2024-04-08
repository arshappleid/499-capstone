// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
    CourseGroupEvaluation,
	Instructor,
	Course,
} = require('../database/index');

const getCourseGroupsService = require('../services/getCourseGroupsService');

describe('instructorCreateCourse', async () => {
	const instructor_id = 3201;
	let course_id;
    let course_group_id;

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
				COURSE_NAME: 'TEST_COURSE_NAME3201',
				COURSE_CODE: 'COURSE_CODE3201',
				COURSE_SEMESTER: 'COURSE_SEMESTER3201',
				COURSE_YEAR: 'COURSE_YEAR3201',
				COURSE_TERM: 'COURSE_TERM3201',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
            const courseGroupCreated = await CourseGroupEvaluation.create({
                COURSE_ID: course_id,
                GROUP_NAME: 'TEST_COURSE_GROUP_NAME3201',
            });
            course_group_id = courseGroupCreated.get('GROUP_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
            await CourseGroupEvaluation.destroy({
                where: { GROUP_ID: course_group_id },
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
		const result = await getCourseGroupsService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await getCourseGroupsService(
			'',
			''
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await getCourseGroupsService(
			0,
            course_id
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Non-Existent Course ID', async () => {
		const result = await getCourseGroupsService(
			instructor_id,
			0
		);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Course does not exist');
	});
 
	test('Create Successfully', async () => {
		const result = await getCourseGroupsService(
			instructor_id,
			course_id
		);

		expect(result.status).toBe('success');
		expect(result.data[0].GROUP_ID).toBe(course_group_id);
        expect(result.data[0].GROUP_NAME).toBe('TEST_COURSE_GROUP_NAME3201');
        expect(result.data[0].COURSE_ID).toBe(course_id);
	});
});

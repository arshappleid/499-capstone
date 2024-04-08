// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	Instructor,
	Course,
} = require('../database/index');

const getCourseListService = require('../services/getCourseListService');

describe('getCourseList', () => {
	const instructor_id = 3200;
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
				COURSE_NAME: 'TEST_COURSE_NAME1-3200',
				COURSE_CODE: 'COURSE_CODE1-3200',
				COURSE_SEMESTER: 'COURSE_SEMESTER1-3200',
				COURSE_YEAR: 'COURSE_YEAR1-3200',
				COURSE_TERM: 'COURSE_TERM1-3200',
				COURSE_VISIBILITY: 0,
			});
            const courseCreated2 = await Course.create({
                INSTRUCTOR_ID: instructor_id,
                COURSE_NAME: 'TEST_COURSE_NAME2-3200',
                COURSE_CODE: 'COURSE_CODE2-3200',
                COURSE_SEMESTER: 'COURSE_SEMESTER2-3200',
                COURSE_YEAR: 'COURSE_YEAR2-3200',
                COURSE_TERM: 'COURSE_TERM2-3200',
                COURSE_VISIBILITY: 0,
            });
			course_id1 = courseCreated1.get('COURSE_ID');
            course_id2 = courseCreated2.get('COURSE_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
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
		const result = await getCourseListService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await getCourseListService('');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await getCourseListService(0);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
	test('Get Successfully', async () => {
		const result = await getCourseListService(instructor_id);

		expect(result.status).toBe('success');
        expect(result.data[0].COURSE_ID).toBe(course_id1);
        expect(result.data[0].COURSE_NAME).toBe('TEST_COURSE_NAME1-3200');
        expect(result.data[0].COURSE_CODE).toBe('COURSE_CODE1-3200');
        expect(result.data[0].COURSE_SEMESTER).toBe('COURSE_SEMESTER1-3200');
        expect(result.data[0].COURSE_YEAR).toBe('COURSE_YEAR1-3200');
        expect(result.data[0].COURSE_TERM).toBe('COURSE_TERM1-3200');

		expect(result.data[1].COURSE_ID).toBe(course_id2);
		expect(result.data[1].COURSE_NAME).toBe('TEST_COURSE_NAME2-3200');
		expect(result.data[1].COURSE_CODE).toBe('COURSE_CODE2-3200');
		expect(result.data[1].COURSE_SEMESTER).toBe('COURSE_SEMESTER2-3200');
		expect(result.data[1].COURSE_YEAR).toBe('COURSE_YEAR2-3200');
		expect(result.data[1].COURSE_TERM).toBe('COURSE_TERM2-3200');
	});
});

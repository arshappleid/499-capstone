// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { EvaluationForm, Instructor, Course } = require('../database/index');

const getFormListService = require('../services/getFormListService');

describe('getCourseFormList', async () => {
	const instructor_id1 = 3106;
    const instructor_id2 = 6106;
	let course_id1;
    let course_id2;
	let form_id;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id1,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
            await Instructor.create({
                INSTRUCTOR_ID: instructor_id2,
                FIRST_NAME: 'FIRST_NAME',
                MIDDLE_NAME: 'MIDDLE_NAME',
                LAST_NAME: 'LAST_NAME',
                EMAIL: 'EMAIL@TEST.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
			const courseCreated1 = await Course.create({
				INSTRUCTOR_ID: instructor_id1,
				COURSE_NAME: 'TEST_COURSE_NAME1-3106',
				COURSE_CODE: 'COURSE_CODE1-3106',
				COURSE_SEMESTER: 'COURSE_SEMESTER1-3106',
				COURSE_YEAR: 'COURSE_YEAR1-3106',
				COURSE_TERM: 'COURSE_TERM1-3106',
				COURSE_VISIBILITY: 0,
			});
            const courseCreated2 = await Course.create({
                INSTRUCTOR_ID: instructor_id2,
                COURSE_NAME: 'TEST_COURSE_NAME2-3106',
                COURSE_CODE: 'COURSE_CODE2-3106',
                COURSE_SEMESTER: 'COURSE_SEMESTER2-3106',
                COURSE_YEAR: 'COURSE_YEAR2-3106',
                COURSE_TERM: 'COURSE_TERM2-3106',
                COURSE_VISIBILITY: 0,
            });
			course_id1 = courseCreated1.get('COURSE_ID');
            course_id2 = courseCreated2.get('COURSE_ID');
			const formCreated = await EvaluationForm.create({
				FORM_NAME: 'TEST_FORM_NAME',
				COURSE_ID: course_id1,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
			});
			form_id = formCreated.get('FORM_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await EvaluationForm.destroy({
				where: { FORM_ID: form_id },
			});
			await Course.destroy({
				where: { COURSE_ID: course_id1 },
			});
            await Course.destroy({
                where: { COURSE_ID: course_id2 },
            });
            await Instructor.destroy({
                where: { INSTRUCTOR_ID: instructor_id2 },
            });
			await Instructor.destroy({
				where: { INSTRUCTOR_ID: instructor_id1 },
			});
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await getFormListService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await getFormListService('', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Non-Existent Course ID', async () => {
		const result = await getFormListService(instructor_id1, 0);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Course does not exist');
	});
	test('Non-Existent Instructor ID', async () => {
		const result = await getFormListService(0, course_id1);

		expect(result.status).toBe('error');
		expect(result.message).toBe('Instructor id does not exist');
	});
    test('Instructor is not teaching the course', async () => {
        const result = await getFormListService(instructor_id2, course_id1);

        expect(result.status).toBe('error');
        expect(result.message).toBe('Instructor is not teaching this course');
    });
	test('Get Successfully', async () => {
		const result = await getFormListService(
			instructor_id1,
            course_id1
		);

		expect(result.status).toBe('success');
		expect(result.data[0].FORM_ID).toBe(form_id);
		expect(result.data[0].FORM_NAME).toBe('TEST_FORM_NAME');
		expect(result.data[0].COURSE_ID).toBe(course_id1);
	});
});

// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import {
	describe,
	test,
	expect
} from 'vitest';
const { Instructor, Course, EvaluationForm } = require('../database/index');

const instructorCreateFormService = require('../services/instructorCreateFormService');

describe('instructorCreateForm', async () => {
	const instructor_id = 2002;
	let course_id;
	let form_id1;
	let form_id2 = 0;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME2002',
				MIDDLE_NAME: 'MIDDLE_NAME2002',
				LAST_NAME: 'LAST_NAME2002',
				EMAIL: 'EMAIL2002@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME2002',
				COURSE_CODE: 'COURSE_CODE2002',
				COURSE_SEMESTER: 'COURSE_SEMESTER2002',
				COURSE_YEAR: 'COURSE_YEAR2002',
				COURSE_TERM: 'COURSE_TERM2002',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			const evaluationFormCreated1 = await EvaluationForm.create({
				FORM_NAME: 'FORM_NAME2002',
				COURSE_ID: course_id,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
			});
			form_id1 = evaluationFormCreated1.get('FORM_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await EvaluationForm.destroy({
				where: {
					FORM_ID: form_id1,
				},
			});
			await EvaluationForm.destroy({
				where: {
					FORM_ID: form_id2,
				},
			});
			await Course.destroy({
				where: {
					COURSE_ID: course_id,
				},
			});
			await Instructor.destroy({
				where: {
					INSTRUCTOR_ID: instructor_id,
				},
			});
		} catch (e) {
			console.log(e);
		}
	});

	test('Undefined Variable', async () => {
		const result = await instructorCreateFormService(
			undefined,
			undefined,
			undefined,
			undefined,
			undefined
		);
		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await instructorCreateFormService('', '', '', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
    test('Invalid Instructor ID', async () => {
        const result = await instructorCreateFormService(
            0,
            course_id,
            '2021-04-30 23:59:59',
            0,
            'TEST_FORM_NAME2002'
        );

        expect(result.status).toBe('error');
        expect(result.message).toBe('Instructor id does not exist');
    });
    test('Invalid Course ID', async () => {
        const result = await instructorCreateFormService(
            instructor_id,
            0,
            '2021-04-30 23:59:59',
            0,
            'FORM_NAME2002'
        );

        expect(result.status).toBe('error');
        expect(result.message).toBe('Course id does not exist');
    });
	test('Form Name Already Exists', async () => {
		const result = await instructorCreateFormService(
			instructor_id,
			course_id,
			'2021-04-30 23:59:59',
			0,
			'FORM_NAME2002'
		);

		expect(result.status).toBe('duplicate');
		expect(result.message).toBe('Form name already exists for this course');
	});
    test('Form Create successfully', async () => {
		const result = await instructorCreateFormService(
			instructor_id,
			course_id,
			'2021-04-30 23:59:59',
			0,
			'FORM_NAME2006'
		);

        form_id2 = result.data.form_id;

		expect(result.status).toBe('success');
	});
});

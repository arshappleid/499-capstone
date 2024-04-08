// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	Instructor,
	Course,
	EvaluationForm,
	EvaluationQuestion,
	EvaluationSection,
    EvaluationQuestionOption,
} = require('../database/index');

const instructorCreateQuestionOptionService = require('../services/instructorCreateQuestionOptionService');

describe('instructorCreateForm', async () => {
	const instructor_id = 2004;
	let course_id;
	let form_id;
	let question_id;
    let option_id;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME2004',
				MIDDLE_NAME: 'MIDDLE_NAME2004',
				LAST_NAME: 'LAST_NAME2004',
				EMAIL: 'EMAIL2004@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME2004',
				COURSE_CODE: 'COURSE_CODE2004',
				COURSE_SEMESTER: 'COURSE_SEMESTER2004',
				COURSE_YEAR: 'COURSE_YEAR2004',
				COURSE_TERM: 'COURSE_TERM2004',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			const evaluationFormCreated = await EvaluationForm.create({
				FORM_NAME: 'FORM_NAME2004',
				COURSE_ID: course_id,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
			});
            form_id = evaluationFormCreated.get('FORM_ID');
            const evaluationQuestionCreated = await EvaluationQuestion.create({
                FORM_ID: evaluationFormCreated.get('FORM_ID'),
                QUESTION_TYPE: 'TEXT',
                QUESTION_TEXT: 'QUESTION_TEXT2004',
            });
            question_id = evaluationQuestionCreated.get('QUESTION_ID');
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id,
                },
            });
			await EvaluationSection.destroy({
				where: {
					FORM_ID: form_id,
					QUESTION_ID: question_id,
				},
			});
			await EvaluationQuestion.destroy({
				where: {
					QUESTION_ID: question_id,
				},
			});
			await EvaluationForm.destroy({
				where: {
					FORM_ID: form_id,
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
		const result = await instructorCreateQuestionOptionService(
			undefined,
			undefined,
            undefined,
        );
		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await instructorCreateQuestionOptionService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
	test('Create successfully', async () => {
		const optionCreated = await instructorCreateQuestionOptionService(
			question_id,
            'OPTION_TEXT2004',
            0,
		);

        option_id = optionCreated.data.option_id;

        expect(optionCreated.status).toBe('success');
	});
});
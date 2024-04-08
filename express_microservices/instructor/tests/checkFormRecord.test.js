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

const checkIfTheresAnyFormRecordsService = require('../services/checkIfTheresAnyFormRecordsService');

describe('instructorGetForm', async () => {
	const instructor_id = 192;
	let course_id;
	let form_id;
	let question_id;
    let option_id;

    beforeEach(async () => {
        try {
            await Instructor.create({
                INSTRUCTOR_ID: instructor_id,
                FIRST_NAME: 'FIRST_NAME192',
                MIDDLE_NAME: 'MIDDLE_NAME192',
                LAST_NAME: 'LAST_NAME192',
                EMAIL: 'TEST192@INSTRUCTOR.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            const courseCreated = await Course.create({
                INSTRUCTOR_ID: instructor_id,
                COURSE_NAME: 'TEST_COURSE_NAME192',
                COURSE_CODE: 'COURSE_CODE192',
                COURSE_SEMESTER: 'COURSE_SEMESTER192',
                COURSE_YEAR: 'COURSE_YEAR192',
                COURSE_TERM: 'COURSE_TERM192',
                COURSE_VISIBILITY: 0,
            });
            course_id = courseCreated.get('COURSE_ID');
            const evaluationFormCreated = await EvaluationForm.create({
                FORM_NAME: 'FORM_NAME192',
                COURSE_ID: course_id,
                DEADLINE: '2021-04-30 23:59:59',
                SHARE_FEEDBACK: 0,
            });
            form_id = evaluationFormCreated.get('FORM_ID');
            const evaluationQuestionCreated = await EvaluationQuestion.create({
                FORM_ID: evaluationFormCreated.get('FORM_ID'),
                QUESTION_TYPE: 'TEXT',
                QUESTION_TEXT: 'QUESTION_TEXT192',
            });
            question_id = evaluationQuestionCreated.get('QUESTION_ID');
            const evaluationSectionCreated = await EvaluationSection.create({
                FORM_ID: evaluationFormCreated.get('FORM_ID'),
                QUESTION_ID: evaluationQuestionCreated.get('QUESTION_ID'),
                SECTION_NAME: 'SECTION_NAME192',
                SECTION_WEIGHT: 10,
            });
            const evaluationQuestionOptionCreated = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id,
                OPTION_TEXT: 'OPTION_TEXT192',
            });
            option_id = evaluationQuestionOptionCreated.get('OPTION_ID');
        } catch (e) {
            console.log(e);
        }
    });
    afterEach(async () => {
        try {
            await EvaluationSection.destroy({
                where: {
                    FORM_ID: form_id,
                    QUESTION_ID: question_id,
                },
            });
            await EvaluationQuestionOption.destroy({
                where: {
                    OPTION_ID: option_id,
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
		const result = await checkIfTheresAnyFormRecordsService(
			undefined,
			undefined
        );
		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await checkIfTheresAnyFormRecordsService('', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
    test('Non-Existent Instructor', async () => {
        const result = await checkIfTheresAnyFormRecordsService(0, form_id);
        expect(result.status).toBe('error');
        expect(result.message).toBe('Instructor id does not exist');
    });
    test('checkIfTheresAnyFormRecordsService', async () => {
        const result = await checkIfTheresAnyFormRecordsService(instructor_id, form_id);
        expect(result.status).toBe(false);
    });
});
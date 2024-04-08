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

const instructorGetFormService = require('../services/instructorGetFormService');

describe('instructorGetForm', async () => {
	const instructor_id = 2005;
	let course_id;
	let form_id;
	let question_id;
    let option_id;

    beforeEach(async () => {
        try {
            await Instructor.create({
                INSTRUCTOR_ID: instructor_id,
                FIRST_NAME: 'FIRST_NAME2005',
                MIDDLE_NAME: 'MIDDLE_NAME2005',
                LAST_NAME: 'LAST_NAME2005',
                EMAIL: 'TEST2005@INSTRUCTOR.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            const courseCreated = await Course.create({
                INSTRUCTOR_ID: instructor_id,
                COURSE_NAME: 'TEST_COURSE_NAME2005',
                COURSE_CODE: 'COURSE_CODE2005',
                COURSE_SEMESTER: 'COURSE_SEMESTER2005',
                COURSE_YEAR: 'COURSE_YEAR2005',
                COURSE_TERM: 'COURSE_TERM2005',
                COURSE_VISIBILITY: 0,
            });
            course_id = courseCreated.get('COURSE_ID');
            const evaluationFormCreated = await EvaluationForm.create({
                FORM_NAME: 'FORM_NAME2005',
                COURSE_ID: course_id,
                DEADLINE: '2021-04-30 23:59:59',
                SHARE_FEEDBACK: 0,
                VISIBILITY: 0,
            });
            form_id = evaluationFormCreated.get('FORM_ID');
            const evaluationQuestionCreated = await EvaluationQuestion.create({
                FORM_ID: evaluationFormCreated.get('FORM_ID'),
                QUESTION_TYPE: 'TEXT',
                QUESTION_TEXT: 'QUESTION_TEXT2005',
            });
            question_id = evaluationQuestionCreated.get('QUESTION_ID');
            const evaluationSectionCreated = await EvaluationSection.create({
                FORM_ID: evaluationFormCreated.get('FORM_ID'),
                QUESTION_ID: evaluationQuestionCreated.get('QUESTION_ID'),
                SECTION_NAME: 'SECTION_NAME2005',
                SECTION_WEIGHT: 100,
            });
            const evaluationQuestionOptionCreated = await EvaluationQuestionOption.create({
                QUESTION_ID: question_id,
                OPTION_TEXT: 'OPTION_TEXT2005',
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
		const result = await instructorGetFormService(
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
		const result = await instructorGetFormService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
    test('instructorGetFormService', async () => {
        const result = await instructorGetFormService(instructor_id, course_id, form_id);

        expect(result.formName).toBe('FORM_NAME2005');
        expect(result.sections.length).toBe(1);
        expect(result.sections[0].name).toBe('SECTION_NAME2005'); 
        expect(result.sections[0].weightage).toBe(100);
        expect(result.sections[0].questions.length).toBe(1);
        expect(result.sections[0].questions[0].question).toBe('QUESTION_TEXT2005');
        expect(result.sections[0].questions[0].type).toBe('TEXT');
        expect(result.sections[0].questions[0].options.length).toBe(1);
        expect(result.sections[0].questions[0].options[0]).toBe('OPTION_TEXT2005');
    });
});


// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
    Student,
	Instructor,
	Course,
    StudentCourse,
	EvaluationForm,
	EvaluationQuestion,
	EvaluationSection,
    EvaluationQuestionOption,
} = require('../database/index');

const studentGetFormService = require('../services/studentGetFormService');

describe('studentGetForm', async () => {
    const instructor_id = 3343;
    const student_id = 3343;
    let course_id = 0;
    let form_id = 0;
    let question_id = 0;
    let option_id = 0;

    beforeEach(async () => {
        try {
            await Student.create({
                STUDENT_ID: student_id,
                FIRST_NAME: 'FIRST_NAME3343',
                MIDDLE_NAME: 'MIDDLE_NAME3343',
                LAST_NAME: 'LAST_NAME3343',
                EMAIL: 'TEST3343@INSTRUCTOR.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            await Instructor.create({
                INSTRUCTOR_ID: instructor_id,
                FIRST_NAME: 'FIRST_NAME3343',
                MIDDLE_NAME: 'MIDDLE_NAME3343',
                LAST_NAME: 'LAST_NAME3343',
                EMAIL: 'TEST3343@INSTRUCTOR.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            const courseCreated = await Course.create({
                INSTRUCTOR_ID: instructor_id,
                COURSE_NAME: 'TEST_COURSE_NAME3343',
                COURSE_CODE: 'COURSE_CODE3343',
                COURSE_SEMESTER: 'COURSE_SEMESTER3343',
                COURSE_YEAR: 'COURSE_YEAR3343',
                COURSE_TERM: 'COURSE_TERM3343',
                COURSE_VISIBILITY: 0,
            });
            course_id = courseCreated.get('COURSE_ID');
            await StudentCourse.create({
                STUDENT_ID: student_id,
                COURSE_ID: course_id,
            });
            const evaluationFormCreated = await EvaluationForm.create({
                FORM_NAME: 'FORM_NAME3343',
                COURSE_ID: course_id,
                DEADLINE: '2021-04-30 23:59:59',
                SHARE_FEEDBACK: 0,
                VISIBILITY: 0,
            });
            form_id = evaluationFormCreated.get('FORM_ID');
            const evaluationQuestionCreated = await EvaluationQuestion.create({
                FORM_ID: evaluationFormCreated.get('FORM_ID'),
                QUESTION_TYPE: 'TEXT',
                QUESTION_TEXT: 'QUESTION_TEXT3343',
            });
            question_id = evaluationQuestionCreated.get('QUESTION_ID');
            const evaluationSectionCreated = await EvaluationSection.create({
                FORM_ID: evaluationFormCreated.get('FORM_ID'),
                QUESTION_ID: evaluationQuestionCreated.get('QUESTION_ID'),
                SECTION_NAME: 'SECTION_NAME3343',
                SECTION_WEIGHT: 100,
            });
            const evaluationQuestionOptionCreated = await EvaluationQuestionOption.create({
                QUESTION_ID: evaluationQuestionCreated.get('QUESTION_ID'),
                OPTION_TEXT: 'OPTION_TEXT3343',
            });
            option_id = evaluationQuestionOptionCreated.get('OPTION_ID');
        } catch (err) {
            console.log(err);
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
            await StudentCourse.destroy({
                where: {
                    STUDENT_ID: student_id,
                    COURSE_ID: course_id,
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
            await Student.destroy({
                where: {
                    STUDENT_ID: student_id,
                },
            });
        } catch (e) {
            console.log(e);
        }
    });
    test('Undefined Variable', async () => {
		const result = await studentGetFormService(
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
		const result = await studentGetFormService('', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
    test('studentGetFormService', async () => {
        const result = await studentGetFormService(student_id, course_id, form_id);

        console.log(result);

        expect(result.formName).toBe('FORM_NAME3343');
        expect(result.sections.length).toBe(1);
        expect(result.sections[0].name).toBe('SECTION_NAME3343'); 
        expect(result.sections[0].weightage).toBe(100);
        expect(result.sections[0].questions.length).toBe(1);
        expect(result.sections[0].questions[0].question).toBe('QUESTION_TEXT3343');
        expect(result.sections[0].questions[0].type).toBe('TEXT');
        expect(result.sections[0].questions[0].options.length).toBe(1);
        expect(result.sections[0].questions[0].options[0]).toBe('OPTION_TEXT3343');
    });
});
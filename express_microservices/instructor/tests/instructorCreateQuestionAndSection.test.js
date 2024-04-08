// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const {
	Instructor,
	Course,
	EvaluationForm,
	EvaluationQuestion,
	EvaluationSection,
} = require('../database/index');

const instructorCreateQuestionAndSectionService = require('../services/instructorCreateQuestionAndSectionService');

describe('instructorCreateForm', async () => {
	const instructor_id = 2003;
	let course_id;
	let form_id;
	let question_id;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME2003',
				MIDDLE_NAME: 'MIDDLE_NAME2003',
				LAST_NAME: 'LAST_NAME2003',
				EMAIL: 'EMAIL2003@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME2003',
				COURSE_CODE: 'COURSE_CODE2003',
				COURSE_SEMESTER: 'COURSE_SEMESTER2003',
				COURSE_YEAR: 'COURSE_YEAR2003',
				COURSE_TERM: 'COURSE_TERM2003',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			const evaluationFormCreated = await EvaluationForm.create({
				FORM_NAME: 'FORM_NAME2003',
				COURSE_ID: course_id,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
			});
			form_id = evaluationFormCreated.get('FORM_ID');
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
		const result = await instructorCreateQuestionAndSectionService(
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
		const result = await instructorCreateQuestionAndSectionService('', '', '', '', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
    test('Form Does Not Exist', async () => {
		const questionCreated = await instructorCreateQuestionAndSectionService(
			0,
			'QUESTION_TYPE2003',
			'QUESTION_TEXT2003',
			1,
			'SECTION_NAME2003'
		);
        expect(questionCreated.status).toBe('error');
        expect(questionCreated.message).toBe('Form does not exist');
	});
	test('Create successfully', async () => {
		const questionCreated = await instructorCreateQuestionAndSectionService(
			form_id,
			'QUESTION_TYPE2003',
			'QUESTION_TEXT2003',
			1,
			'SECTION_NAME2003'
		);
		question_id = questionCreated.data.question_id;
		const question = await EvaluationQuestion.findOne({
			where: {
				QUESTION_ID: question_id,
			},
		});
		expect(question.get('QUESTION_TEXT')).toBe('QUESTION_TEXT2003');
		expect(question.get('QUESTION_TYPE')).toBe('QUESTION_TYPE2003');
	});
});

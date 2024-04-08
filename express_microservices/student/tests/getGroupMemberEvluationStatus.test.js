// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)import { describe, test, expect } from 'vitest';
import { describe, test, expect } from 'vitest';
const {
	Instructor,
	Student,
	Course,
	EvaluationForm,
	EvaluationAnswer,
	EvaluationQuestion,
	EvaluationSection,
	CourseGroupEvaluation,
	GroupMembersTable,
	EvaluationQuestionOption,
} = require('../database/index');

const getGroupMemberEvluationStatusService = require('../services/getGroupMemberEvluationStatusService');

describe('instructorGetOverAllGrade', async () => {
	const instructor_id = 288;
	const student_id1 = 2881;
	const student_id2 = 2882;
	const student_id3 = 2883;

	let group_id;

	let course_id;
	let form_id1;
	let form_id2;

	let question_id1;
	let question_id2;
	let question_id3;

	let option_id1;
	let option_id2;
	let option_id3;
	let option_id4;
	let option_id5;
	let option_id6;
	let option_id7;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME288',
				MIDDLE_NAME: 'MIDDLE_NAME288',
				LAST_NAME: 'LAST_NAME288',
				EMAIL: 'TEST288@INSTRUCTOR.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id1,
				FIRST_NAME: 'FIRST_NAME2881',
				MIDDLE_NAME: 'MIDDLE_NAME2881',
				LAST_NAME: 'LAST_NAME2881',
				EMAIL: 'STUDENT2881@STUDENT.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id2,
				FIRST_NAME: 'FIRST_NAME2882',
				MIDDLE_NAME: 'MIDDLE_NAME2882',
				LAST_NAME: 'LAST_NAME2882',
				EMAIL: 'STUDENT2882@STUDENT.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id3,
				FIRST_NAME: 'FIRST_NAME2883',
				MIDDLE_NAME: 'MIDDLE_NAME2883',
				LAST_NAME: 'LAST_NAME2883',
				EMAIL: 'STUDENT2883@STUDENT.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME288',
				COURSE_CODE: 'COURSE_CODE288',
				COURSE_SEMESTER: 'COURSE_SEMESTE288',
				COURSE_YEAR: 'COURSE_YEAR288',
				COURSE_TERM: 'COURSE_TERM288',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');

			// CREATE GROUP
			const groupCreated = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'GROUP_NAME288',
			});
			group_id = groupCreated.get('GROUP_ID');

			// CREATE GROUP MEMBERS
			await GroupMembersTable.create({
				GROUP_ID: group_id,
				STUDENT_ID: student_id1,
			});
			await GroupMembersTable.create({
				GROUP_ID: group_id,
				STUDENT_ID: student_id2,
			});
			await GroupMembersTable.create({
				GROUP_ID: group_id,
				STUDENT_ID: student_id3,
			});
			const evaluationForm1Created = await EvaluationForm.create({
				FORM_NAME: 'FORM_NAME288-1',
				COURSE_ID: course_id,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
				VISIBILITY: 0,
			});
			form_id1 = evaluationForm1Created.get('FORM_ID');
			const evaluationForm2Created = await EvaluationForm.create({
				FORM_NAME: 'FORM_NAME288-2',
				COURSE_ID: course_id,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
				VISIBILITY: 0,
			});
			form_id2 = evaluationForm2Created.get('FORM_ID');

			// CREATE QUESTIONS
			const evaluationQuestion1Created = await EvaluationQuestion.create({
				FORM_ID: form_id1,
				QUESTION_TYPE: 'mcq',
				QUESTION_TEXT: 'QUESTION_TEXT288-1',
			});
			question_id1 = evaluationQuestion1Created.get('QUESTION_ID');
			const evaluationQuestion2Created = await EvaluationQuestion.create({
				FORM_ID: form_id1,
				QUESTION_TYPE: 'mcq',
				QUESTION_TEXT: 'QUESTION_TEXT288-2',
			});
			question_id2 = evaluationQuestion2Created.get('QUESTION_ID');
			const evaluationQuestion3Created = await EvaluationQuestion.create({
				FORM_ID: form_id2,
				QUESTION_TYPE: 'mcq',
				QUESTION_TEXT: 'QUESTION_TEXT288-3',
			});
			question_id3 = evaluationQuestion3Created.get('QUESTION_ID');

			// CREATE SECTIONS
			await EvaluationSection.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id1,
				SECTION_NAME: 'SECTION_NAME288-1',
				SECTION_WEIGHT: 40,
			});
			await EvaluationSection.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id2,
				SECTION_NAME: 'SECTION_NAME288-2',
				SECTION_WEIGHT: 60,
			});
			await EvaluationSection.create({
				FORM_ID: form_id2,
				QUESTION_ID: question_id3,
				SECTION_NAME: 'SECTION_NAME288-3',
				SECTION_WEIGHT: 100,
			});

			// CREATE OPTIONS
			const evaluationQuestionOption1Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id1,
					OPTION_TEXT: 'OPTION_TEXT288-1',
					OPTION_POINT: 1,
				});
			option_id1 = evaluationQuestionOption1Created.get('OPTION_ID');
			const evaluationQuestionOption2Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id1,
					OPTION_TEXT: 'OPTION_TEXT288-2',
					OPTION_POINT: 2,
				});
			option_id2 = evaluationQuestionOption2Created.get('OPTION_ID');
			const evaluationQuestionOption3Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id1,
					OPTION_TEXT: 'OPTION_TEXT288-3',
					OPTION_POINT: 0,
				});
			option_id3 = evaluationQuestionOption3Created.get('OPTION_ID');
			const evaluationQuestionOption4Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id2,
					OPTION_TEXT: 'OPTION_TEXT288-4',
					OPTION_POINT: 0,
				});
			option_id4 = evaluationQuestionOption4Created.get('OPTION_ID');
			const evaluationQuestionOption5Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id2,
					OPTION_TEXT: 'OPTION_TEXT288-5',
					OPTION_POINT: 1,
				});
			option_id5 = evaluationQuestionOption5Created.get('OPTION_ID');
			const evaluationQuestionOption6Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id2,
					OPTION_TEXT: 'OPTION_TEXT288-6',
					OPTION_POINT: 2,
				});
			option_id6 = evaluationQuestionOption6Created.get('OPTION_ID');
			const evaluationQuestionOption7Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id3,
					OPTION_TEXT: 'OPTION_TEXT288-7',
					OPTION_POINT: 2,
				});
			option_id7 = evaluationQuestionOption7Created.get('OPTION_ID');

			// CREATE ANSWERS
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id1,
				EVALUATOR_ID: student_id1,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT288-1',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id2,
				EVALUATOR_ID: student_id1,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT288-5',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id2,
				QUESTION_ID: question_id3,
				EVALUATOR_ID: student_id1,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT288-7',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id1,
				EVALUATOR_ID: student_id3,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT288-2',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id2,
				EVALUATOR_ID: student_id3,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT288-6',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id2,
				QUESTION_ID: question_id3,
				EVALUATOR_ID: student_id3,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT288-7',
			});
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await EvaluationAnswer.destroy({
				where: {
					FORM_ID: form_id2,
					QUESTION_ID: question_id3,
					EVALUATOR_ID: student_id3,
					EVALUATEE_ID: student_id2,
				},
			});
			await EvaluationAnswer.destroy({
				where: {
					FORM_ID: form_id1,
					QUESTION_ID: question_id2,
					EVALUATOR_ID: student_id3,
					EVALUATEE_ID: student_id2,
				},
			});
			await EvaluationAnswer.destroy({
				where: {
					FORM_ID: form_id1,
					QUESTION_ID: question_id1,
					EVALUATOR_ID: student_id3,
					EVALUATEE_ID: student_id2,
				},
			});
			await EvaluationAnswer.destroy({
				where: {
					FORM_ID: form_id2,
					QUESTION_ID: question_id3,
					EVALUATOR_ID: student_id1,
					EVALUATEE_ID: student_id2,
				},
			});
			await EvaluationAnswer.destroy({
				where: {
					FORM_ID: form_id1,
					QUESTION_ID: question_id2,
					EVALUATOR_ID: student_id1,
					EVALUATEE_ID: student_id2,
				},
			});
			await EvaluationAnswer.destroy({
				where: {
					FORM_ID: form_id1,
					QUESTION_ID: question_id1,
					EVALUATOR_ID: student_id1,
					EVALUATEE_ID: student_id2,
				},
			});
			await EvaluationSection.destroy({
				where: {
					FORM_ID: form_id1,
					QUESTION_ID: question_id1,
				},
			});
			await EvaluationSection.destroy({
				where: {
					FORM_ID: form_id1,
					QUESTION_ID: question_id2,
				},
			});
			await EvaluationSection.destroy({
				where: {
					FORM_ID: form_id2,
					QUESTION_ID: question_id3,
				},
			});
			await EvaluationQuestionOption.destroy({
				where: {
					OPTION_ID: option_id1,
				},
			});
			await EvaluationQuestionOption.destroy({
				where: {
					OPTION_ID: option_id2,
				},
			});
			await EvaluationQuestionOption.destroy({
				where: {
					OPTION_ID: option_id3,
				},
			});
			await EvaluationQuestionOption.destroy({
				where: {
					OPTION_ID: option_id4,
				},
			});
			await EvaluationQuestionOption.destroy({
				where: {
					OPTION_ID: option_id5,
				},
			});
			await EvaluationQuestionOption.destroy({
				where: {
					OPTION_ID: option_id6,
				},
			});
			await EvaluationQuestionOption.destroy({
				where: {
					OPTION_ID: option_id7,
				},
			});
			await EvaluationQuestion.destroy({
				where: {
					QUESTION_ID: question_id1,
				},
			});
			await EvaluationQuestion.destroy({
				where: {
					QUESTION_ID: question_id2,
				},
			});
			await EvaluationQuestion.destroy({
				where: {
					QUESTION_ID: question_id3,
				},
			});
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
			await GroupMembersTable.destroy({
				where: {
					STUDENT_ID: student_id1,
				},
			});
			await GroupMembersTable.destroy({
				where: {
					STUDENT_ID: student_id2,
				},
			});
			await GroupMembersTable.destroy({
				where: {
					STUDENT_ID: student_id3,
				},
			});
			await CourseGroupEvaluation.destroy({
				where: {
					COURSE_ID: course_id,
				},
			});
			await Course.destroy({
				where: {
					COURSE_ID: course_id,
				},
			});
			await Student.destroy({
				where: {
					STUDENT_ID: student_id2,
				},
			});
			await Student.destroy({
				where: {
					STUDENT_ID: student_id1,
				},
			});
			await Student.destroy({
				where: {
					STUDENT_ID: student_id3,
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

    test('Undefined values passed to Service Function', async () => {
        const response = await getGroupMemberEvluationStatusService(
            undefined,
            undefined,
            undefined
        );
        expect(response).toEqual({
            status: 'error',
            message: 'Undefined values passed to Service Function',
        });
    });
    test('Empty values passed', async () => {
        const response = await getGroupMemberEvluationStatusService(
            '',
            '',
            ''
        );
        expect(response).toEqual({
            status: 'error',
            message: 'Empty values passed',
        });
    });
    test('student does not exist', async () => {
        const response = await getGroupMemberEvluationStatusService(
            0,
            group_id,
            form_id1
        );
        expect(response).toEqual({
            status: 'error',
            message: 'student does not exist',
        });
    });

});

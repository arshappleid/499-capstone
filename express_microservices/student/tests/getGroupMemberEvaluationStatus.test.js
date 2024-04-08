// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
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
	EvaluationGrade,
} = require('../database/index');

const getGroupMemberEvluationStatusService = require('../services/getGroupMemberEvluationStatusService');

describe('getGroupMemberEvluationStatusService', async () => {
	const instructor_id = 3337;
	const student_id1 = 33371;
	const student_id2 = 33372;
	const student_id3 = 33373;

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
				FIRST_NAME: 'FIRST_NAME3337',
				MIDDLE_NAME: 'MIDDLE_NAME3337',
				LAST_NAME: 'LAST_NAME3337',
				EMAIL: 'TEST3337@INSTRUCTOR.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id1,
				FIRST_NAME: 'FIRST_NAME33371',
				MIDDLE_NAME: 'MIDDLE_NAME33371',
				LAST_NAME: 'LAST_NAME33371',
				EMAIL: 'STUDENT33371@STUDENT.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id2,
				FIRST_NAME: 'FIRST_NAME33372',
				MIDDLE_NAME: 'MIDDLE_NAME33372',
				LAST_NAME: 'LAST_NAME33372',
				EMAIL: 'STUDENT33372@STUDENT.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id3,
				FIRST_NAME: 'FIRST_NAME33373',
				MIDDLE_NAME: 'MIDDLE_NAME33373',
				LAST_NAME: 'LAST_NAME33373',
				EMAIL: 'STUDENT33373@STUDENT.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3337',
				COURSE_CODE: 'COURSE_CODE3337',
				COURSE_SEMESTER: 'COURSE_SEMESTE3337',
				COURSE_YEAR: 'COURSE_YEAR3337',
				COURSE_TERM: 'COURSE_TERM3337',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');

			// CREATE GROUP
			const groupCreated = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'GROUP_NAME3337',
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
				FORM_NAME: 'FORM_NAME3110-1',
				COURSE_ID: course_id,
				DEADLINE: '2021-04-30 23:59:59',
				SHARE_FEEDBACK: 0,
				VISIBILITY: 0,
			});
			form_id1 = evaluationForm1Created.get('FORM_ID');
			const evaluationForm2Created = await EvaluationForm.create({
				FORM_NAME: 'FORM_NAME3110-2',
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
				QUESTION_TEXT: 'QUESTION_TEXT3110-1',
			});
			question_id1 = evaluationQuestion1Created.get('QUESTION_ID');
			const evaluationQuestion2Created = await EvaluationQuestion.create({
				FORM_ID: form_id1,
				QUESTION_TYPE: 'mcq',
				QUESTION_TEXT: 'QUESTION_TEXT3110-2',
			});
			question_id2 = evaluationQuestion2Created.get('QUESTION_ID');
			const evaluationQuestion3Created = await EvaluationQuestion.create({
				FORM_ID: form_id2,
				QUESTION_TYPE: 'mcq',
				QUESTION_TEXT: 'QUESTION_TEXT3110-3',
			});
			question_id3 = evaluationQuestion3Created.get('QUESTION_ID');

			// CREATE SECTIONS
			await EvaluationSection.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id1,
				SECTION_NAME: 'SECTION_NAME3110-1',
				SECTION_WEIGHT: 40,
			});
			await EvaluationSection.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id2,
				SECTION_NAME: 'SECTION_NAME3110-2',
				SECTION_WEIGHT: 60,
			});
			await EvaluationSection.create({
				FORM_ID: form_id2,
				QUESTION_ID: question_id3,
				SECTION_NAME: 'SECTION_NAME3110-3',
				SECTION_WEIGHT: 100,
			});

			// CREATE OPTIONS
			const evaluationQuestionOption1Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id1,
					OPTION_TEXT: 'OPTION_TEXT3110-1',
					OPTION_POINT: 1,
				});
			option_id1 = evaluationQuestionOption1Created.get('OPTION_ID');
			const evaluationQuestionOption2Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id1,
					OPTION_TEXT: 'OPTION_TEXT3110-2',
					OPTION_POINT: 2,
				});
			option_id2 = evaluationQuestionOption2Created.get('OPTION_ID');
			const evaluationQuestionOption3Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id1,
					OPTION_TEXT: 'OPTION_TEXT3110-3',
					OPTION_POINT: 0,
				});
			option_id3 = evaluationQuestionOption3Created.get('OPTION_ID');
			const evaluationQuestionOption4Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id2,
					OPTION_TEXT: 'OPTION_TEXT3110-4',
					OPTION_POINT: 0,
				});
			option_id4 = evaluationQuestionOption4Created.get('OPTION_ID');
			const evaluationQuestionOption5Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id2,
					OPTION_TEXT: 'OPTION_TEXT3110-5',
					OPTION_POINT: 1,
				});
			option_id5 = evaluationQuestionOption5Created.get('OPTION_ID');
			const evaluationQuestionOption6Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id2,
					OPTION_TEXT: 'OPTION_TEXT3110-6',
					OPTION_POINT: 2,
				});
			option_id6 = evaluationQuestionOption6Created.get('OPTION_ID');
			const evaluationQuestionOption7Created =
				await EvaluationQuestionOption.create({
					QUESTION_ID: question_id3,
					OPTION_TEXT: 'OPTION_TEXT3110-7',
					OPTION_POINT: 2,
				});
			option_id7 = evaluationQuestionOption7Created.get('OPTION_ID');

			// CREATE ANSWERS
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id1,
				EVALUATOR_ID: student_id1,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT3110-1',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id2,
				EVALUATOR_ID: student_id1,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT3110-5',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id2,
				QUESTION_ID: question_id3,
				EVALUATOR_ID: student_id1,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT3110-7',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id1,
				EVALUATOR_ID: student_id3,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT3110-2',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id1,
				QUESTION_ID: question_id2,
				EVALUATOR_ID: student_id3,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT3110-6',
			});
			await EvaluationAnswer.create({
				FORM_ID: form_id2,
				QUESTION_ID: question_id3,
				EVALUATOR_ID: student_id3,
				EVALUATEE_ID: student_id2,
				ANSWER: 'OPTION_TEXT3110-7',
			});
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
			await EvaluationGrade.destroy({
				where: {
					FORM_ID: form_id1,
					EVALUATEE_ID: student_id2,
				},
			});
			await EvaluationGrade.destroy({
				where: {
					FORM_ID: form_id2,
					EVALUATEE_ID: student_id2,
				},
			});
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
	test('Undefined Variable', async () => {
		const result = await getGroupMemberEvluationStatusService(
			undefined,
			undefined,
			undefined
		);
		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
    test('Empty values passed', async () => {
        const result = await getGroupMemberEvluationStatusService(
            "",
            "",
            ""
        );
        expect(result.status).toBe('error');
        expect(result.message).toBe(
            'Empty values passed'
        );
    });
    test('student does not exist', async () => {
        const result = await getGroupMemberEvluationStatusService(
            0,
            course_id,
            form_id2
        );

        expect(result.status).toBe('error');
        expect(result.message).toBe("student does not exist");

    });
    test('course does not exist', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id1,
            0,
            form_id2
        );

        expect(result.status).toBe('error');
        expect(result.message).toBe("course does not exist");

    });
    test('form does not exist', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id1,
            course_id,
            0
        );

        expect(result.status).toBe('error');
        expect(result.message).toBe("form does not exist");

    });
    test('Get Successfully', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id1,
            course_id,
            form_id1
        );

        expect(result.status).toBe('success');
        expect(result.evaluation_records[0].completion_status).toBe(true);
        expect(result.evaluation_records[1].completion_status).toBe(false);
    });
    test('Get Successfully', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id1,
            course_id,
            form_id2
        );
        expect(result.status).toBe('success');
        expect(result.evaluation_records[0].completion_status).toBe(true);
        expect(result.evaluation_records[1].completion_status).toBe(false);
    });
    test('Get Successfully', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id2,
            course_id,
            form_id2
        );

        expect(result.status).toBe('success');
        expect(result.evaluation_records[0].completion_status).toBe(false);
        expect(result.evaluation_records[1].completion_status).toBe(false);
    });
    test('Get Successfully', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id3,
            course_id,
            form_id2
        );

    expect(result.status).toBe('success');
    expect(result.evaluation_records[0].completion_status).toBe(false);
    expect(result.evaluation_records[1].completion_status).toBe(true);
});
    test('Get Successfully', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id2,
            course_id,
            form_id1
        );

        expect(result.status).toBe('success');
        expect(result.evaluation_records[0].completion_status).toBe(false);
        expect(result.evaluation_records[1].completion_status).toBe(false);
    });
    test('Get Successfully', async () => {
        const result = await getGroupMemberEvluationStatusService(
            student_id3,
            course_id,
            form_id1
        );

        expect(result.status).toBe('success');
        expect(result.evaluation_records[0].completion_status).toBe(false);
        expect(result.evaluation_records[1].completion_status).toBe(true);
    });

});

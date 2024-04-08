// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect, afterEach } from 'vitest';
const { Student, Instructor, Course, EvaluationGrade, EvaluationForm, CourseGroupEvaluation, GroupMembersTable, StudentCourse, EvaluationAnswer, EvaluationQuestion } = require('../database/index');

const instructorEditGradeService = require('../services/instructorEditGradeService');

describe('instructorEditGradeService', async () => {
    const instructor_id = 283;
    const evaluatee_id = 283;
    const not_grade_evalatee_id = 2831;
    let course_id;
    let form_id;
    let grade_id;
    let group_id;
    let evaluation_answer_id;

    const new_grade = 1;

    beforeEach(async () => {
        try {
            await Instructor.create({
                INSTRUCTOR_ID: instructor_id,
                FIRST_NAME: 'FIRST_NAME',
                MIDDLE_NAME: 'MIDDLE_NAME',
                LAST_NAME: 'LAST_NAME',
                EMAIL: 'INSTRUCTOR283@TEST.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            await Student.create({
                STUDENT_ID: evaluatee_id,
                FIRST_NAME: 'FIRST_NAME',
                MIDDLE_NAME: 'MIDDLE_NAME',
                LAST_NAME: 'LAST_NAME',
                EMAIL: 'STUDENT283@TEST.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            await Student.create({
                STUDENT_ID: not_grade_evalatee_id,
                FIRST_NAME: 'FIRST_NAME',
                MIDDLE_NAME: 'MIDDLE_NAME',
                LAST_NAME: 'LAST_NAME',
                EMAIL: 'STUDENT2831@TEST.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            const createdCourse = await Course.create({
                INSTRUCTOR_ID: instructor_id,
                COURSE_NAME: 'TEST_COURSE_NAME-283',
                COURSE_CODE: 'COURSE_CODE-283',
                COURSE_SEMESTER: 'COURSE_SEMESTER-283',
                COURSE_YEAR: 'COURSE_YEAR-283',
                COURSE_TERM: 'COURSE_TERM-283',
                COURSE_VISVIBILITY: 1,
            });
            course_id = createdCourse.get('COURSE_ID');
            await StudentCourse.create({
                STUDENT_ID: evaluatee_id,
                COURSE_ID: course_id,
            });
            await StudentCourse.create({
                STUDENT_ID: not_grade_evalatee_id,
                COURSE_ID: course_id,
            });
            const groupCreated = await CourseGroupEvaluation.create({
                COURSE_ID: course_id,
                GROUP_NAME: 'TEST_GROUP_NAME-283',
            });
            group_id = groupCreated.get('GROUP_ID');
            await GroupMembersTable.create({
                GROUP_ID: group_id,
                STUDENT_ID: evaluatee_id,
            });
            await GroupMembersTable.create({
                GROUP_ID: group_id,
                STUDENT_ID: not_grade_evalatee_id,
            });
            const formCreated = await EvaluationForm.create({
                FORM_NAME: 'TEST_FORM_NAME',
                COURSE_ID: course_id,
                DEADLINE: '2021-04-30 23:59:59',
                SHARE_FEEDBACK: 0,
            });
            form_id = formCreated.get('FORM_ID');
            const gradeCreated = await EvaluationGrade.create({
                FORM_ID: form_id,
                EVALUATEE_ID: evaluatee_id,
                FORM_ID: form_id,
                GRADE: 0,
            });
            grade_id = gradeCreated.get('EVALUATION_GRADE_ID');
            const createdQuestion = await EvaluationQuestion.create({
                FORM_ID: form_id,
                QUESTION_TEXT: 'TEST_QUESTION',
                QUESTION_TYPE: 'TEST_TYPE',
            });
            const evaluationAnswerCreated = await EvaluationAnswer.create({
                FORM_ID: form_id,
                EVALUATEE_ID: evaluatee_id,
                EVALUATOR_ID: not_grade_evalatee_id,
                QUESTION_ID: createdQuestion.get('QUESTION_ID'),
                ANSWER: 'TEST_ANSWER',
            });
            evaluation_answer_id = evaluationAnswerCreated.get('EVALUATION_ID');
        } catch (e) {
            console.log(e);
        }
    });
    afterEach(async () => {
        try {
            await EvaluationAnswer.destroy({
                where: {
                    EVALUATION_ID: evaluation_answer_id,
                },
            });
            await EvaluationQuestion.destroy({
                where: {
                    FORM_ID: form_id,
                },
            });
            await EvaluationGrade.destroy({
                where: {
                    EVALUATION_GRADE_ID: grade_id,
                },
            });
            await EvaluationForm.destroy({
                where: {
                    FORM_ID: form_id,
                },
            });
            await GroupMembersTable.destroy({
                where: {
                    GROUP_ID: group_id,
                },
            });
            await CourseGroupEvaluation.destroy({
                where: {
                    GROUP_ID: group_id,
                },  
            });
            await StudentCourse.destroy({
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
                    STUDENT_ID: not_grade_evalatee_id,
                },
            });
            await Student.destroy({
                where: {
                    STUDENT_ID: evaluatee_id,
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
    test('undefined values', async () => {
        const result = await instructorEditGradeService(
            undefined,
            undefined,
            undefined,
            undefined
        );
        expect(result.status).toBe('error');
        expect(result.message).toBe('Undefined values passed to Service Function');
    });
    test('empty values', async () => {
        const result = await instructorEditGradeService(
            '',
            '',
            '',
            ''
        );
        expect(result.status).toBe('error');
        expect(result.message).toBe('Empty values passed');
    });
    test('instructor not exist', async () => {
        const result = await instructorEditGradeService(
            0,
            form_id,
            evaluatee_id,
            new_grade
        );
        expect(result.status).toBe('error');
        expect(result.message).toBe('Instructor does not exist');
    });
    test('form not exist', async () => {
        const result = await instructorEditGradeService(
            instructor_id,
            0,
            evaluatee_id,
            new_grade
        );
        expect(result.status).toBe('error');
        expect(result.message).toBe('Form does not exist');
    });
    test('evaluatee not exist', async () => {
        const result = await instructorEditGradeService(
            instructor_id,
            form_id,
            0,
            new_grade
        );
        expect(result.status).toBe('error');
        expect(result.message).toBe('Evaluatee does not exist');
    });
    test('grade not exist', async () => {
        const result = await instructorEditGradeService(
            instructor_id,
            form_id,
            not_grade_evalatee_id,
            new_grade
        );

        console.log(result);
        expect(result.status).toBe('error');
        expect(result.message).toBe('Not all evaluators did the evaluation');
    });
    test('instructorEditGradeService', async () => {
        const result = await instructorEditGradeService(
            instructor_id,
            form_id,
            evaluatee_id,
            new_grade
        );
        
        const changed_grade = await EvaluationGrade.findOne({
            where: {
                EVALUATION_GRADE_ID: grade_id,
            },
        });
        expect(changed_grade.get('GRADE')).toBe(new_grade);

        expect(result.status).toBe('success');
        expect(result.message).toBe('Grade updated successfully');
    });
});
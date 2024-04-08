// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { Instructor, Student, Course, StudentCourse } = require('../database/index');

const addStudentToCourseService = require('../services/addStudentToCourseService');

describe('addStudentToCourse', async () => {
	const instructor_id = 3203;
    const student_id1 = 3203;
    const student_id2 = 6203;
	let course_id;

	beforeEach(async () => {
		try {
            await Student.create({
                STUDENT_ID: student_id1,
                FIRST_NAME: 'FIRST_NAME',
                MIDDLE_NAME: 'MIDDLE_NAME',
                LAST_NAME: 'LAST_NAME',
                EMAIL: 'STUDENT1@TEST.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
            await Student.create({
                STUDENT_ID: student_id2,
                FIRST_NAME: 'FIRST_NAME',
                MIDDLE_NAME: 'MIDDLE_NAME',
                LAST_NAME: 'LAST_NAME',
                EMAIL: 'STUDENT2@TEST.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME',
				MIDDLE_NAME: 'MIDDLE_NAME',
				LAST_NAME: 'LAST_NAME',
				EMAIL: 'EMAIL@TEST.COM',
				MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3203',
				COURSE_CODE: 'COURSE_CODE3203',
				COURSE_SEMESTER: 'COURSE_SEMESTER3203',
				COURSE_YEAR: 'COURSE_YEAR3203',
				COURSE_TERM: 'COURSE_TERM3203',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
            await StudentCourse.create({
                STUDENT_ID: student_id1,
                COURSE_ID: course_id,
            });
		} catch (e) {
			console.log(e);
		}
	});
	afterEach(async () => {
		try {
            await StudentCourse.destroy({
                where: { STUDENT_ID: student_id1 },
            });
            await StudentCourse.destroy({
                where: { STUDENT_ID: student_id2 },
            });
			await Course.destroy({
				where: { COURSE_ID: course_id },
			});
            await Instructor.destroy({
                where: { INSTRUCTOR_ID: instructor_id },
            });
            await Student.destroy({
                where: { STUDENT_ID: student_id1 },
            });
            await Student.destroy({
                where: { STUDENT_ID: student_id2 },
            });
		} catch (e) {
			console.log(e);
		}
	});
	test('Undefined Variable', async () => {
		const result = await addStudentToCourseService();

		expect(result.status).toBe('error');
		expect(result.message).toBe(
			'Undefined values passed to Service Function'
		);
	});
	test('Empty Variable', async () => {
		const result = await addStudentToCourseService('', '');

		expect(result.status).toBe('error');
		expect(result.message).toBe('Empty values passed');
	});
    test('Student already enrolled in course', async () => {
        const result = await addStudentToCourseService(course_id, student_id1);

        expect(result.status).toBe('duplicate');
        expect(result.message).toBe('Student already enrolled in course');
    });
	test('Get Successfully', async () => {
		const result = await addStudentToCourseService(
			course_id, student_id2
		);

		expect(result.status).toBe('success');
		expect(result.data.student_id).toBe(student_id2);
	});
});

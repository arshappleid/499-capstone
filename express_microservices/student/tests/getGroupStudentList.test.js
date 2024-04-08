// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';

const {
	Instructor,
	Student,
	Course,
	StudentCourse,
	CourseGroupEvaluation,
	GroupMembersTable,
} = require('../database/index');

const getGroupStudentsService = require('../services/getGroupStudentsService');

describe('getGroupStudentsService', async () => {
	const instructor_id = 3330;
	const student_id1 = 33301;
	const student_id2 = 33302;
	const student_id3 = 33303;

	let course_id = 0;
	let group_id = 0;

	beforeEach(async () => {
		try {
			await Instructor.create({
				INSTRUCTOR_ID: instructor_id,
				FIRST_NAME: 'FIRST_NAME3330',
				MIDDLE_NAME: 'MIDDLE_NAME3330',
				LAST_NAME: 'LAST_NAME3330',
				EMAIL: 'TEST3330@INSTRUCTOR.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id1,
				FIRST_NAME: 'FIRST_NAME33301',
				MIDDLE_NAME: 'MIDDLE_NAME33301',
				LAST_NAME: 'LAST_NAME33301',
				EMAIL: 'TEST33301@STUDENT.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id2,
				FIRST_NAME: 'FIRST_NAME33302',
				MIDDLE_NAME: 'MIDDLE_NAME33302',
				LAST_NAME: 'LAST_NAME33302',
				EMAIL: 'TEST33302@STUDENT.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			await Student.create({
				STUDENT_ID: student_id3,
				FIRST_NAME: 'FIRST_NAME33303',
				MIDDLE_NAME: 'MIDDLE_NAME33303',
				LAST_NAME: 'LAST_NAME33303',
				EMAIL: 'TEST33303@STUDENT.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
			});
			const courseCreated = await Course.create({
				INSTRUCTOR_ID: instructor_id,
				COURSE_NAME: 'TEST_COURSE_NAME3330',
				COURSE_CODE: 'COURSE_CODE3330',
				COURSE_SEMESTER: 'COURSE_SEMESTE3330',
				COURSE_YEAR: 'COURSE_YEAR3330',
				COURSE_TERM: 'COURSE_TERM3330',
				COURSE_VISIBILITY: 0,
			});
			course_id = courseCreated.get('COURSE_ID');
			await StudentCourse.create({
				STUDENT_ID: student_id1,
				COURSE_ID: course_id,
			});
			await StudentCourse.create({
				STUDENT_ID: student_id2,
				COURSE_ID: course_id,
			});
			await StudentCourse.create({
				STUDENT_ID: student_id3,
				COURSE_ID: course_id,
			});
			const groupCreated = await CourseGroupEvaluation.create({
				COURSE_ID: course_id,
				GROUP_NAME: 'GROUP_NAME3330',
			});
			group_id = groupCreated.get('GROUP_ID');
			await GroupMembersTable.create({
				GROUP_ID: group_id,
				STUDENT_ID: student_id1,
			});
			await GroupMembersTable.create({
				GROUP_ID: group_id,
				STUDENT_ID: student_id2,
			});
		} catch (err) {
			console.log(err);
		}
	});
	afterEach(async () => {
		try {
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
			await Instructor.destroy({
				where: {
					INSTRUCTOR_ID: instructor_id,
				},
			});
			await Student.destroy({
				where: {
					STUDENT_ID: student_id1,
				},
			});
			await Student.destroy({
				where: {
					STUDENT_ID: student_id2,
				},
			});
			await Student.destroy({
				where: {
					STUDENT_ID: student_id3,
				},
			});
		} catch (err) {
			console.log(err);
		}
	});
    test('Undefined values passed to Service Function', async () => {
		const groupStudents = await getGroupStudentsService(undefined);

        expect(groupStudents.status).toBe("error");
        expect(groupStudents.message).toBe("Undefined values passed to Service Function");
	});
    test('Empty values passed', async () => {
		const groupStudents = await getGroupStudentsService("","");

        expect(groupStudents.status).toBe("error");
        expect(groupStudents.message).toBe("Empty values passed");
	});
    test('Student is not in any group', async () => {
		const groupStudents = await getGroupStudentsService(0, course_id);

        expect(groupStudents.status).toBe("error");
        expect(groupStudents.message).toBe("Student is not in any group");
	});
    test('Student is not in any group', async () => {
		const groupStudents = await getGroupStudentsService(student_id3, course_id);

        expect(groupStudents.status).toBe("error");
        expect(groupStudents.message).toBe("Student is not in any group");
	});
	test('getGroupStudentsService', async () => {
		const groupStudents = await getGroupStudentsService(student_id1, course_id);

        expect(groupStudents.data.length).toBe(2);
	});
});

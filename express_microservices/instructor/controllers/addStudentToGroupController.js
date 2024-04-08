// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const express = require('express');
path = require('path');
const router = express.Router();

const addStudentToGroupService = require('../services/addStudentToGroupService');
const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfStudentExistService = require('../services/checkIfStudentExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');
const checkIfGroupBelongsToCourseService = require('../services/checkIfGroupBelongsToCourseService');

router.post('/', async (req, res) => {
	try {
		const course_id = req.body.course_id;
		const group_id = req.body.group_id;
		const instructor_id = req.body.instructor_id;
		const students = req.body.students;

		const data = [];

		if (course_id === null || course_id === '' || course_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Course id can not be null',
			});
		}

		const courseExist = await checkIfCourseExistService(course_id);
		if (courseExist.status === false) {
			return res.json({
				status: 'error',
				message: 'Course does not exist',
			});
		}

		if (group_id === null || group_id === '' || group_id === undefined) {
			return res.json({
				status: 'error',
				message: 'Group id can not be null',
			});
		}

		const groupBelongsToCourse = await checkIfGroupBelongsToCourseService(
			group_id,
			course_id
		);
		if (groupBelongsToCourse.status === false) {
			return res.json({
				status: 'error',
				message: 'Group does not belong to this course',
			});
		}

		if (
			instructor_id === null ||
			instructor_id === '' ||
			instructor_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'Instructor id can not be null',
			});
		}

		const instructorExist = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorExist.status === false) {
			return res.json({
				status: 'error',
				message: 'Instructor does not exist',
			});
		}

		const instructorTeachesCourse =
			await checkIfInstructorTeachesCourseService(
				instructor_id,
				course_id
			);
		if (instructorTeachesCourse.status === false) {
			return res.json({
				status: 'error',
				message: 'Instructor does not teach this course',
			});
		}

		if (students === null || students === '' || students === undefined) {
			return res.json({
				status: 'error',
				message: 'Students can not be null',
			});
		}

		if (students.length === 0) {
			return res.json({
				status: 'error',
				message: 'Students can not be empty',
			});
		}

		for (let i = 0; i < students.length; i++) {
			const student_id = students[i].student_id;
			if (
				student_id === null ||
				student_id === '' ||
				student_id === undefined
			) {
				data.push({
					student_id: student_id,
					message: 'Student id can not be null',
				});
			} else {
				const studentExist = await checkIfStudentExistService(
					student_id
				);

				if (studentExist.status === 'not exist') {
					data.push({
						student_id: student_id,
						message: 'Student does not exist',
					});
				} else {
					const result = await addStudentToGroupService(
						course_id,
						group_id,
						student_id
					);
					if (result.status === 'error') {
						data.push({
							student_id: student_id,
							message: 'Student add failed',
						});
					} else if (result.status === 'duplicate') {
						data.push({
							student_id: student_id,
							message: 'Student already enrolled in group',
						});
					} else if (result.status === 'not in course') {
						data.push({
							student_id: student_id,
							message: 'Student is not enrolled in course',
						});
					} else if (result.status === 'in another group') {
						data.push({
							student_id: student_id,
							message:
								'Student already enrolled in another group for this course',
						});
					} else {
						data.push({
							student_id: student_id,
							message: 'Student add success',
						});
					}
				}
			}
		}
		return res.json({
			status: 'success',
			data: data,
		});
	} catch (e) {
		return res.json({
			status: 'error',
			message:
				'Error occured while parsing request in addStudentToGroupController.js: ' +
				e.message,
		});
	}
});

module.exports = router;
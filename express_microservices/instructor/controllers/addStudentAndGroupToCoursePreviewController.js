// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
const express = require('express');
path = require('path');
const router = express.Router();

const checkIfInstructorIdExistService = require('../services/checkIfInstructorIdExistService');
const checkIfGroupExistService = require('../services/checkIfGroupExistService');
const checkIfCourseExistService = require('../services/checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('../services/checkIfInstructorTeachesCourseService');
const checkIfStudentExistService = require('../services/checkIfStudentExistService');
const addStudentToGroupPreviewService = require('../services/addStudentToGroupPreviewService');

router.post('/', async (req, res) => {
	try {
		const course_id = req.body.courseID;
		const instructor_id = req.body.instructorId;
		const groups = req.body.groups;

		const data = [];

		if (course_id === null || course_id === '' || course_id === undefined) {
			return res.json({
				status: 'error',
				message: 'course id can not be null.',
			});
		}
		const courseExist = await checkIfCourseExistService(course_id);
		if (courseExist.status === false) {
			return res.json({
				status: 'error',
				message: 'course does not exist.',
			});
		}
		if (
			instructor_id === null ||
			instructor_id === '' ||
			instructor_id === undefined
		) {
			return res.json({
				status: 'error',
				message: 'instructor id can not be null.',
			});
		}
		const instructorExist = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorExist.status === false) {
			return res.json({
				status: 'error',
				message: 'instructor does not exist.',
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
				message: 'instructor does not teach this course.',
			});
		}
		if (groups === null || groups === '' || groups === undefined) {
			return res.json({
				status: 'error',
				message: 'students can not be null.',
			});
		}
		if (groups.length === 0) {
			return res.json({
				status: 'error',
				message: 'groups can not be empty.',
			});
		}
		for (let i = 0; i < groups.length; i++) {
			const group_name = groups[i].group_name;
			if (
				group_name === null ||
				group_name === '' ||
				group_name === undefined
			) {
				data.push({
					group_name: group_name,
					status: 'group name can not be null.',
				});
			} else {
				const groupExist = await checkIfGroupExistService(
					course_id,
					group_name
				);
				if (groupExist.status) {
					let student_status = [];
					const student_ids = groups[i].student_ids;

					for (let j = 0; j < student_ids.length; j++) {
						const student_id = student_ids[j];

						const studentExist = await checkIfStudentExistService(
							student_id
						);
						if (studentExist.status === false) {
							student_status.push({
								student_id: student_id,
								status: 'student does not exist.',
							});
							continue;
						}
						const studentAddStatus =
							await addStudentToGroupPreviewService(
								course_id,
								-1,
								student_id
							);
						if (studentAddStatus.status === 'error') {
							student_status.push({
								student_id: student_id,
								status: 'student add failed.',
							});
						} else if (studentAddStatus.status === 'duplicate') {
							student_status.push({
								student_id: student_id,
								status: 'student already enrolled in group.',
							});
						} else if (
							studentAddStatus.status === 'not in course'
						) {
							student_status.push({
								student_id: student_id,
								status: 'student is not enrolled in course.',
							});
						} else if (
							studentAddStatus.status === 'in another group'
						) {
							student_status.push({
								student_id: student_id,
								status: 'student already enrolled in another group for this course.',
							});
						} else {
							student_status.push({
								student_id: student_id,
								status: 'student add success.',
							});
						}
					}
					data.push({
						group_name: group_name,
						status: 'group already exists.',
						student_status: student_status,
					});
				} else {
					let added_student = 0;
					let student_status = [];
					const student_ids = groups[i].student_ids;

					for (let j = 0; j < student_ids.length; j++) {
						const student_id = student_ids[j];

						const studentExist = await checkIfStudentExistService(
							student_id
						);
						if (studentExist.status === false) {
							student_status.push({
								student_id: student_id,
								status: 'student does not exist.',
							});
							continue;
						}
						const studentAddStatus =
							await addStudentToGroupPreviewService(
								course_id,
								-1,
								student_id
							);
						if (studentAddStatus.status === 'error') {
							student_status.push({
								student_id: student_id,
								status: 'student add failed.',
							});
						} else if (studentAddStatus.status === 'duplicate') {
							student_status.push({
								student_id: student_id,
								status: 'student already enrolled in group.',
							});
						} else if (
							studentAddStatus.status === 'not in course'
						) {
							student_status.push({
								student_id: student_id,
								status: 'student is not enrolled in course.',
							});
						} else if (
							studentAddStatus.status === 'in another group'
						) {
							student_status.push({
								student_id: student_id,
								status: 'student already enrolled in another group for this course.',
							});
						} else {
							student_status.push({
								student_id: student_id,
								status: 'student add success.',
							});
							added_student++;
						}
					}

					if (added_student === 0) {
						data.push({
							group_name: group_name,
							status: 'Group not created',
							student_status: student_status,
						});
					} else {
						data.push({
							group_name: group_name,
							status: 'group create success',
							student_status: student_status,
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
			message: 'error occured while parsing request',
		});
	}
});

module.exports = router;

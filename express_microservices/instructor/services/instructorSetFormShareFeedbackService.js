// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by Lance Haoxiang Xu
const checkIfInstructorIdExistService = require('./checkIfInstructorIdExistService');
const checkIfCourseExistService = require('./checkIfCourseExistService');
const checkIfInstructorTeachesCourseService = require('./checkIfInstructorTeachesCourseService');

const {
	Course,
	EvaluationForm,
	Student,
	StudentCourse,
} = require('../database/index');
const nodemailer = require('nodemailer');

async function instructorSetFormShareFeedbackService(
	instructor_id,
	form_id,
	form_sharefeedback
) {
	try {
		if (
			instructor_id === undefined ||
			form_id === undefined ||
			form_sharefeedback === undefined
		) {
			return {
				status: 'error',
				message: 'Undefined values passed to Service Function',
			};
		}
		if (
			instructor_id === '' ||
			form_id === '' ||
			form_sharefeedback === ''
		) {
			return {
				status: 'error',
				message: 'Empty values passed',
			};
		}
		if (form_sharefeedback !== 1 && form_sharefeedback !== 0) {
			return {
				status: 'error',
				message: 'Invalid form_visibility value',
			};
		}
		const instructorExist = await checkIfInstructorIdExistService(
			instructor_id
		);
		if (instructorExist.status === false) {
			return {
				status: 'error',
				message: 'Instructor id does not exist',
			};
		}
		const course_id = await checkFormIdExist(form_id);
		if (course_id === false) {
			return {
				status: 'error',
				message: 'Form id does not exist',
			};
		}
		const courseExist = await checkIfCourseExistService(course_id);
		if (courseExist.status === false) {
			return {
				status: 'error',
				message: 'Course id does not exist',
			};
		}
		const instructorTeachesCourse =
			await checkIfInstructorTeachesCourseService(
				instructor_id,
				course_id
			);
		if (instructorTeachesCourse.status === false) {
			return {
				status: 'error',
				message: 'Instructor does not teach this course',
			};
		}
		await EvaluationForm.update(
			{
				SHARE_FEEDBACK: form_sharefeedback,
			},
			{
				where: {
					FORM_ID: form_id,
				},
			}
		);

		//sent emails to students
		if (form_sharefeedback === 1) {
			const courseInfo = await Course.findAll({
				where: {
					COURSE_ID: course_id,
				},
			});

			const formInfo = await EvaluationForm.findAll({
				where: {
					FORM_ID: form_id,
				},
			});

			let studentEmailList = [];

			studentEmailList = await StudentCourse.findAll({
				where: {
					COURSE_ID: course_id,
				},
				include: [
					{
						model: Student,
						attributes: ['EMAIL'],
					},
				],
			});

			for (const student of studentEmailList) {
				studentEmailList[studentEmailList.indexOf(student)] =
					student.STUDENT.EMAIL;
			}
			// In-order to send emails, uncomment these lines of code. Swap the sender email and generate an app password from gmail account settings
			//sendEmailTo(studentEmailList, form_id, courseInfo, formInfo);
		}

		return {
			status: 'success',
			data: { form_sharefeedback: form_sharefeedback },
		};
	} catch (e) {
		return {
			status: 'error',
			message: 'Error occured while retrieving results: ' + e.toString(),
		};
	}
}

//Author : Sehajvir Pannu
async function sendEmailTo(emailList, form_id, courseInfo, formInfo) {
	try {
		// Swap out the user and pass with the sender's email and password to send emails. Use learnification.tech@gmail.com here and generate an App password in gmail

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'learnificationtechnologies@gmail.com',
				pass: 'quesowksrtnhuscn',
			},
		});

		const datetime = new Date(formInfo[0].DEADLINE);
		const formattedDate = datetime.toDateString();
		const options = {
			timeZone: 'America/Los_Angeles',
			hours12: true,
		};
		const formattedTime = datetime.toLocaleTimeString('en-US', options);

		for (const email of emailList) {
			let mailOptions = {
				from: 'learnificationtechnologies@gmail.com',
				to: email,
				subject:
					'Evaluation Form Released, ' +
					courseInfo[0].COURSE_CODE +
					' ' +
					courseInfo[0].COURSE_NAME,
				html: `
				<p style="font-size: 16px; color: #333;">Evaluation Feedback has been released for your course, ${courseInfo[0].COURSE_CODE} ${courseInfo[0].COURSE_NAME}.</p>
				<hr>
				<strong>${formInfo[0].FORM_NAME}</strong>
				<p style="font-size: 12px; color: #888; text-align: center;">(This is an auto-generated email, please do not reply.)</p>
			`,
			};
			await transporter.sendMail(mailOptions);
		}
	} catch (e) {
		console.log(e);
	}
}

async function checkFormIdExist(form_id) {
	try {
		const form = await EvaluationForm.findAll({
			where: {
				form_id: form_id,
			},
		});
		if (form.length === 0) {
			return false;
		}
		return form[0].COURSE_ID;
	} catch (e) {
		return false;
	}
}

module.exports = instructorSetFormShareFeedbackService;

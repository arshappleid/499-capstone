// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
// Tested by: Lance Haoxiang Xu (All the code here is tested by Lance Haoxiang Xu unless specified otherwise)
const {
	Instructor,
	Course,
	Student,
	CourseAssignment,
	StudentCourse,
} = require('../database/index');

async function instructorSetAssignmentVisibilityService(
	instructor_id,
	course_id,
	assignment_id,
	visibility
) {
	if (
		instructor_id === undefined ||
		course_id === undefined ||
		assignment_id === undefined ||
		visibility === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		instructor_id === '' ||
		course_id === '' ||
		assignment_id === '' ||
		visibility === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if instructor exists
		const instructor = await Instructor.findAll({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
		if (instructor.length === 0) {
			return {
				status: 'error',
				message: 'Instructor does not exist',
			};
		}
		//Check if course exists
		const course = await Course.findAll({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (course.length === 0) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		//Check if assignment exists
		const assignment = await CourseAssignment.findAll({
			where: {
				COURSE_ID: course_id,
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assignment.length === 0) {
			return {
				status: 'error',
				message: 'Assignment does not exist',
			};
		}
		//Update assignment visibility
		await CourseAssignment.update(
			{
				VISIBILITY: visibility,
			},
			{
				where: {
					COURSE_ID: course_id,
					ASSIGNMENT_ID: assignment_id,
				},
			}
		);

		let studentEmailList = [];

		if (visibility === 1) {
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
			// sendEmailTo(studentEmailList, assignment_id, course, assignment);
		}

		return {
			status: 'success',
			message: 'Assignment visibility updated',
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorSetAssignmentVisibilityService.js: ' +
				err,
		};
	}
}

//Author : Sehajvir Pannu
async function sendEmailTo(emailList, assignment_id, course, assignmentInfo) {
	try {
		// Swap out the email and password with the sender's email and password to send emails. Use learnification.tech@gmail.com here and generate an App password
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			pool: true,
			maxMessages: Infinity,
			maxConnections: 400,
			auth: {
				user: 'learnificationtechnologies@gmail.com',
				pass: 'quesowksrtnhuscn',
			},
		});

		const datetime = new Date(assignmentInfo[0].DEADLINE);
		const formattedDate = datetime.toDateString();
		const options = {
			timeZone: 'America/Los_Angeles',
			hours12: true,
			hour: 'numeric',
			minute: 'numeric',
		};
		const formattedTime = datetime.toLocaleTimeString('en-US', options);

		for (const email of emailList) {
			let mailOptions = {
				from: 'learnificationtechnologies@gmail.com',
				to: email,
				subject:
					'Assignment Released, ' +
					course[0].COURSE_CODE +
					' ' +
					course[0].COURSE_NAME,
				html: `
				<p style="font-size: 16px; color: #333;">A new assignment has been released for your course, ${courseInfo[0].COURSE_CODE} ${courseInfo[0].COURSE_NAME}.</p>
				<hr>
				<strong>${assignmentInfo[0].ASSIGNMENT_NAME}</strong>
				<p style="font-size: 14px;">Deadline: ${formattedDate} ${formattedTime}.</p>
				<p style="font-size: 12px; color: #888; text-align: center;">(This is an auto-generated email, please do not reply.)</p>
			`,
			};
			await transporter.sendMail(mailOptions);
		}
		transporter.close();
	} catch (e) {
		console.log(e);
	}
}

module.exports = instructorSetAssignmentVisibilityService;

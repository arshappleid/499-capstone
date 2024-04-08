// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const {
	Instructor,
	Course,
	CourseAssignment,
	StudentCourse,
	AssignmentAssessmentGroup,
	AssessmentGroupMembersTable,
} = require('../database/index');

async function getInstructorProfileService(
	instructor_id,
	course_id,
	assignment_name,
	deadline,
	available_from,
	available_to,
	form_id,
	evaluator_group_size,
	assignment_description,
	assignment_submission_type
) {
	//Check if the request body is valid.
	if (
		instructor_id === undefined ||
		course_id === undefined ||
		assignment_name === undefined ||
		deadline === undefined ||
		available_from === undefined ||
		available_to === undefined ||
		evaluator_group_size === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		instructor_id === '' ||
		course_id === '' ||
		assignment_name === '' ||
		deadline === '' ||
		available_from === '' ||
		available_to === '' ||
		evaluator_group_size === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if instructor exists
		const instructor = await Instructor.findOne({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
		if (instructor === null) {
			return {
				status: 'error',
				message: 'Instructor does not exist',
			};
		}
		//Check if course exists
		const course = await Course.findOne({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (course === null) {
			return {
				status: 'error',
				message: 'Course does not exist',
			};
		}
		//Check if assignment name is unique
		const assignment = await CourseAssignment.findOne({
			where: {
				ASSIGNMENT_NAME: assignment_name,
				COURSE_ID: course_id,
			},
		});
		if (assignment !== null) {
			return {
				status: 'error',
				message: 'Assignment name is not unique',
			};
		}
		//Check if instructor is teaching the course
		const instructor_course = await Course.findOne({
			where: {
				INSTRUCTOR_ID: instructor_id,
				COURSE_ID: course_id,
			},
		});
		if (instructor_course === null) {
			return {
				status: 'error',
				message: 'Instructor is not teaching the course',
			};
		}
		//Get the course student list
		const course_student_list = await StudentCourse.findAll({
			where: {
				COURSE_ID: course_id,
			},
		});
		//Create the assignment
		const created_assignment = await CourseAssignment.create({
			COURSE_ID: course_id,
			ASSIGNMENT_NAME: assignment_name,
			DEADLINE: deadline,
			AVAILABLE_FROM: available_from,
			AVAILABLE_TO: available_to,
			FORM_ID: form_id,
			ASSIGNMENT_DESCRIPTION: assignment_description,
			SUBMISSION_TYPE: assignment_submission_type,
			SHAREFEEDBACK: 0,
			VISIBILITY: 0,
		});
		if (created_assignment === null) {
			return {
				status: 'error',
				message:
					'Error occured while creating assignment in instructorCreateAssignmentService.js',
			};
		}
		//Get the assignment id
		const assignment_id = created_assignment.ASSIGNMENT_ID;

		const student_ids = [];
		for (let i = 0; i < course_student_list.length; i++) {
			student_ids.push(course_student_list[i].STUDENT_ID);
		}

		let splitor = 0;

		if (course_student_list.length <= 2) {
			splitor = 1;
		} else {
			for (let d = 1; d < course_student_list.length; d++) {
				if (course_student_list.length % d !== 0) {
					splitor = d;
					break;
				}
			}
		}

		for (let i = 0; i < course_student_list.length; i++) {
			let evaluatee_id = student_ids[i];

			//Create the assignment assessment group
			const createdAssessmentGroup =
				await AssignmentAssessmentGroup.create({
					ASSIGNMENT_ID: assignment_id,
					EVALUATEE_ID: evaluatee_id,
				});
			if (createdAssessmentGroup === null) {
				return {
					status: 'error',
					message:
						'Error occured while creating assignment assessment group in instructorCreateAssignmentService.js',
				};
			}

			for (let r = 1; r <= evaluator_group_size; r++) {
				let evaluator_id =
					student_ids[(i + splitor * r) % course_student_list.length];

				//Create the assessment group members table
				await AssessmentGroupMembersTable.create({
					ASSESSED_GROUP_ID: createdAssessmentGroup.ASSESSED_GROUP_ID,
					EVALUATOR_ID: evaluator_id,
				});
			}
		}

		return {
			status: 'success',
			assignment_id: assignment_id,
			message: 'Assignment created successfully',
		};
	} catch (err) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorCreateAssignmentService.js: ' +
				err.message,
		};
	}
}

module.exports = getInstructorProfileService;

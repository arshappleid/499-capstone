// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
//Tested by Lance Haoxiang Xu
const {
	Instructor,
	AssignmentCriteria,
	AssignmentCriteriaRatingOption,
	CourseAssignment,
} = require('../database/index.js');

async function instructorCreateAssignmentService(
	instructor_id,
	course_id,
	rubric,
	assignment_id
) {
	if (
		instructor_id === undefined ||
		course_id === undefined ||
		rubric === undefined ||
		assignment_id === undefined
	) {
		return {
			status: 'error',
			message: 'Undefined values passed to Service Function',
		};
	}
	if (
		instructor_id === '' ||
		course_id === '' ||
		rubric === '' ||
		assignment_id === ''
	) {
		return {
			status: 'error',
			message: 'Empty values passed',
		};
	}

	try {
		//Check if the instructor exists
		const instructorExist = await Instructor.findAll({
			where: {
				INSTRUCTOR_ID: instructor_id,
			},
		});
		if (instructorExist.length === 0) {
			return {
				status: 'error',
				message: 'Instructor id does not exist',
			};
		}
		//Check if the course exists
		const courseExist = await CourseAssignment.findAll({
			where: {
				COURSE_ID: course_id,
			},
		});
		if (courseExist.length === 0) {
			return {
				status: 'error',
				message: 'Course id does not exist',
			};
		}
		//Check if assignment exists
		const assignmentExist = await CourseAssignment.findAll({
			where: {
				ASSIGNMENT_ID: assignment_id,
			},
		});
		if (assignmentExist.length === 0) {
			return {
				status: 'error',
				message: 'Assignment id does not exist',
			};
		}

		let created_rubric = [];

		//Loop through the rubric
		for (let i = 0; i < rubric.length; i++) {
			const criteria_description = rubric[i].description;

			//Create the criteria
			const criteria = await AssignmentCriteria.create({
				ASSIGNMENT_ID: assignment_id,
				CRITERIA_DESCRIPTION: criteria_description,
			});

			if (criteria === null) {
				created_rubric.push({
					status: 'error',
					message: 'Error occured while creating criteria',
				});
				continue;
			}

			const criteria_id = criteria.CRITERIA_ID;

			let created_rating_options = [];

			//Loop through the rating options
			for (let j = 0; j < rubric[i].rubrics.length; j++) {
				const rating_option_description = rubric[i].rubrics[j].name;
				const rating_option_point = rubric[i].rubrics[j].points;

				//Create the rating option
				const rating_option =
					await AssignmentCriteriaRatingOption.create({
						CRITERIA_ID: criteria_id,
						OPTION_DESCRIPTION: rating_option_description,
						OPTION_POINT: rating_option_point,
					});

				if (rating_option === null) {
					created_rating_options.push({
						status: 'error',
						message: 'Error occured while creating rating option',
					});
				} else {
					created_rating_options.push({
						status: 'success',
						rating_option_id: rating_option.OPTION_ID,
						message: 'Rating option created successfully',
					});
				}
			}
			created_rubric.push({
				status: 'success',
				criteria_id: criteria_id,
				rating_options: created_rating_options,
				message: 'Criteria created successfully',
			});
		}
		return {
			status: 'success',
			created_rubric: created_rubric,
		};
	} catch (e) {
		return {
			status: 'error',
			message:
				'Error occured while retrieving results in instructorCreateRubricService.js: ' +
				e.message,
		};
	}
}

module.exports = instructorCreateAssignmentService;

const {
    Course,
    CourseAssignment, InstructorCourse
} = require('../database/index');
const {Instructor} = require("../database");
const {Op} = require('sequelize');

async function editAssignmentService(instructor_id, assignment_id, assignment_name, deadline, availableFrom, availableTo, submission_type) {
    try {
        const instructor = await Instructor.findOne({where: {INSTRUCTOR_ID: instructor_id}});
        if (instructor == null) {
            return {
                status: 'error',
                message: 'instructor does not exist'
            }
        }
        const assignment = await CourseAssignment.findOne({
            where: {
                ASSIGNMENT_ID: assignment_id
            }
        });
        if(assignment == null){
            return {
                status : 'error',
                message : 'invalid assignment id'
            }
        }
        let course_id = assignment.COURSE_ID;
        
        const instructor_course = await InstructorCourse.findOne({
            where: {
                INSTRUCTOR_ID: instructor_id, COURSE_ID: course_id
            }
        });

        if (instructor_course == null) {
            return {
                status: 'error',
                message: "Instructor does not teach the course"
            }
        }

        if (!isEmpty(assignment_name)) {
            const otherAssignmentWithThisName = await CourseAssignment.findOne({
                where: {
                    ASSIGNMENT_ID: assignment_id,
                    ASSIGNMENT_NAME: {[Op.not]: assignment_name}
                }
            });

            if (otherAssignmentWithThisName == null) {
                return {
                    status: "error",
                    message: "duplicate assignment name"
                }
            }

            // If a different CourseAssignment with the Assignment name is not found in the Course Assignment table , then only update the data.
            assignment.ASSIGNMENT_NAME = assignment_name;
        }
        if (!isEmpty(deadline)) {
            assignment.DEADLINE = deadline;
        }
        if (!isEmpty(availableFrom)) {
            assignment.AVAILABLE_FROM = availableFrom;
        }
        if (!isEmpty(availableTo)) {
            assignment.AVAILABLE_TO = availableTo;
        }
        if (!isEmpty(submission_type)) {
            assignment.SUBMISSION_TYPE = submission_type;
        }

        assignment.save();

        return {
            status: 'success',
            message: 'assignment info updated'
        }


    } catch (error) {
        console.log(error);
        return {
            status: 'error',
            message:
                'Error occured while retrieving results in editAssignmentService.js: ' +
                error.stack
        };
    }
}


function isEmpty(variable) {
    // Would want it to return false, if undefined or null
    if (variable == null || variable == undefined) {
        return false;
    }
    if (variable == "") {
        return true;
    }

    return false;
}

module.exports = editAssignmentService;

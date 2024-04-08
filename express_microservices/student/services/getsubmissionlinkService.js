const {Student, CourseAssignment} = require('../database/index');
const {AssignmentSubmission} = require("../database");


async function getSubmissionLinkService(student_id, assignment_id) {
    try {
        const student = await Student.findOne({where: {STUDENT_ID: student_id}});
        if (student == null) {
            return {
                status: "error",
                message: "student does not exist"
            }
        }
        const assignment_submission = await AssignmentSubmission.findOne({
            where: {STUDENT_ID: student_id, ASSIGNMENT_ID: assignment_id}
        });

        if (assignment_submission == null) {
            return {
                status: "error",
                message: "no submission found associated with student id"
            }
        }

        return {
            status: "success",
            assignment_link: assignment_submission.SUBMISSION_LINK + ""
        }

    } catch (e) {
        console.log('Error in in getSubmissionLinkService' + e);
        return {
            status: 'error',
            message:
                'error occured while retrieving results in getSubmissionLinkService' +
                e,
        };
    }
}

module.exports = getSubmissionLinkService;

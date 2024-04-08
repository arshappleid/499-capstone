const {Student, CourseAssignment} = require('../database/index');
const {StudentCourse, AssignmentSubmission} = require("../database");

async function submitAssignmentService(student_id, assignment_id, submission_url) {
    try {
        if (submission_url.length > 999) {
            return {
                status: "error",
                message: "Cannot Store this big of a submission link"
            }
        }
        var student = await Student.findOne({where: {STUDENT_ID: student_id}});
        if (student == null) {
            return {
                status: "error",
                message: "Invalid Student Id"
            }
        }

        var assignment = await CourseAssignment.findOne({
            where: {ASSIGNMENT_ID: assignment_id}
        });

        if (assignment == null) {
            return {
                status: "error",
                message: "Invalid Assignment Id"
            }
        }

        var enrolled = await StudentCourse.findOne({
            where: {STUDENT_ID: student_id, COURSE_ID: assignment.COURSE_ID}
        });

        if (enrolled == null) {
            return {
                status: "error",
                message: "Student not Enrolled in the Course for the Assignment"
            }
        }

        const prevSubmission = await AssignmentSubmission.findOne({
            where: {STUDENT_ID: student_id, ASSIGNMENT_ID: assignment_id}
        })
        if (prevSubmission != null) {
            prevSubmission.SUBMISSION_LINK = submission_url;
            await prevSubmission.save();
            return {
                status: "success",
                message: "A previous Submission was found , Link Updated."
            }
        }
        // Now create the record in Assignment Submission
        const submission = await AssignmentSubmission.create({
            ASSIGNMENT_ID: assignment_id,
            STUDENT_ID: student_id,
            SUBMISSION_LINK: submission_url
        });

        if (!(submission instanceof AssignmentSubmission)) {
            return {
                status: "error",
                message: "Unable to create the record"
            }
        }

        return {
            status: "success",
            message: "assignment submit successfully"
        }

    } catch (e) {
        console.log('Error in in submitAssignmentService Service' + e);
        return {
            status: 'error',
            message:
                'error occured while retrieving results in submitAssignmentService Service' +
                e,
        };
    }
}

module.exports = submitAssignmentService;

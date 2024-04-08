const {AssignmentAssessmentGroup, AssessmentGroupMembersTable} = require('../database/index');
const {Student} = require("../database");

async function getAssesmentGroupNumberService(student_id, assignment_id) {
    try {
        const student = await Student.findOne({where: {STUDENT_ID: student_id}});
        if (student == null || student == undefined) {
            return {
                status: "error",
                message: "student id not found"
            }
        }


        const assignment = await AssignmentAssessmentGroup.findOne({
            where: {
                ASSIGNMENT_ID: assignment_id
            }
        });

        if (assignment == null || assignment == undefined) {
            return {
                status: "error",
                message: "assignment does not exist"
            }
        }
        const response = await AssignmentAssessmentGroup.findOne({
            attributes: ['ASSESSED_GROUP_ID'],
            include: [{
                model: AssessmentGroupMembersTable,
                where: {
                    EVALUATOR_ID: student_id
                },
            }],
            where: {
                ASSIGNMENT_ID: assignment_id
            },
        });

        if (response == null || response == undefined) {
            return {
                status: "success",
                message: "assignment does not exist , for associated student"
            }
        }

        return {
            status: "success",
            assessment_group_id: response.ASSESSED_GROUP_ID
        }


    } catch (e) {
        return {
            status: 'error',
            message: 'error occured while retrieving results : ' + e,
        };
    }
}

module.exports = getAssesmentGroupNumberService;

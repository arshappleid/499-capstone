const {AssignmentCriteria, AssignmentCriteriaRatingOption} = require("../database");

async function editRubricService(assignment_id, criteria_description, criteria_options) {
    try {
        let assignment_criteria = await AssignmentCriteria.findOne({where: {ASSIGNMENT_ID: assignment_id}});
        if (assignment_criteria == null) {
            return {
                status: "error",
                message: "No criteria found with associated assignment id"
            }
        }
        let description_updated = false;
        if (criteria_description != "") {
            assignment_criteria.CRITERIA_DESCRIPTION = criteria_description;
            await assignment_criteria.save();
            description_updated = true;
        }
        let option_responses = [];
        console.log("Criteria options : "+criteria_options.toString());
        for (let i = 0; i < criteria_options.length; i++) {
            let option = criteria_options[i];
            
            let assignment_criteria_rating_option = await AssignmentCriteriaRatingOption.findOne({
                where: {CRITERIA_ID: assignment_criteria.CRITERIA_ID, OPTION_DESCRIPTION: option.description}
            });
            if (assignment_criteria_rating_option == null) {
                option_responses.push({
                    status: "error",
                    description: option.description,
                    message: "no option found matching Description"
                });
                continue;
            }
            assignment_criteria_rating_option.OPTION_POINT = option.option_point;
            await assignment_criteria_rating_option.save();
            option_responses.push({
                status: "success",
                description: option.description,
                message: "Option point updated to : " + option.option_point
            });
        }

        return {
            status: "success",
            description_updated: (description_updated ? "yes" : "no"),
            options: option_responses
        }

    } catch (e) {
        console.log('Error in editRubricService: ', e);
        return {
            status: 'error',
            message:
                'Error occured while retrieving results in editRubricService.js: ' +
                e.stack,
        };
    }
}

module.exports = editRubricService;

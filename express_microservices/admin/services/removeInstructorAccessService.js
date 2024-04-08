const { Instructor } = require('../database/index');

async function removeInstructorAccessService(instructor_id_list) {
    try {
       let response = [];
       for (const instructor of instructor_id_list) {
           let instructor_id = instructor.instructor_id;
        try {
            
            let instructor = await Instructor.findOne({ where: { INSTRUCTOR_ID: instructor_id } });

            if (!instructor) {
                response.push({ instructor_id: instructor_id, status: "not found" });
            } else {
                instructor.INSTRUCTOR_ACCESS = "0";
                await instructor.save();
                response.push({ instructor_id: instructor_id, status: "removed successfully" });
            }
        } catch (error) {
            // Handle errors if any occurred during the loop
            response.push({ instructor_id: instructor_id, status: "error occurred : "+error });
        }
       }
        
        return {response : response};
    } catch (e) {
        return {
            status: 'error',
            message: 'Error occured while retrieving results in RemoveInstructorAccessService : '+e,
        };
    }
}

module.exports = removeInstructorAccessService;

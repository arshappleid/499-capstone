const { sequelize } = require('../database/index');
const { Student, StudentCourse , Course } = require('../database/index');

async function getCourseListService(student_id) {
    try {
        const student = await Student.findOne({where : {STUDENT_ID : student_id}});
        if(student == null){
            return {
                status :"error",
                message: "student id not found"
            }
        }
        
        const registered_courses_ids = await StudentCourse.findAll({where : {STUDENT_ID : student_id}});
        const courses = new Array();
        
        for(let i = 0; i < registered_courses_ids.length;i++){

            const currCourse = await Course.findOne({where:{COURSE_ID :  registered_courses_ids[i].COURSE_ID}});
            if(currCourse == null) continue;
            // Do not return the course if course visibility is set to 0.
            if(currCourse.COURSE_VISIBILITY == '0') continue;
            
            const course = {
                courseID : currCourse.COURSE_ID,
                course_name: currCourse.COURSE_NAME,
                course_code: currCourse.COURSE_CODE,
                course_semester: currCourse.COURSE_SEMESTER,
                course_year: currCourse.COURSE_YEAR,
                course_term: currCourse.COURSE_TERM
            }
            courses.push(course);
        }
        
        return {
            status :"success",
            data : courses
        }
        
       
    } catch (e) {
        console.log('Error in in getCourseListService Service' + e);
        return {
            status: 'error',
            message:
				'error occured while retrieving results in getCourseListService Service' +
				e,
        };
    }
}

module.exports = getCourseListService;

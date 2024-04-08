const request = require('supertest');
const {app} = require("../server");
const {Student} = require("../database");
const route = '/updateprofile'
describe('tests POST /student/updateprofile', () => {
    it('valid Student ID', async () => {
        let testRecord  ; 
        try {
            testRecord = await Student.create({
                student_id: "999999",
                student_first_name: "test1",
                student_middle_name: "test2",
                student_last_name: "test3",
                email: "newemail@gmail.com"
            })
            const response = await request(app).post(route).send(
                {
                    student_id: "999999",
                    student_first_name: "test4",
                    student_middle_name: "test5",
                    student_last_name: "test6",
                    email: "newemail2@gmail.com"
                }
                );
            expect(response.body.message).toEqual("student profile update successfull");
            expect(response.body.status).toEqual("success");
            testRecord = await Student.findOne({where : {
                STUDENT_ID : "999999"
            }});            
            expect(testRecord.FIRST_NAME).toEqual("test4");
            expect(testRecord.MIDDLE_NAME).toEqual("test5");
            expect(testRecord.LAST_NAME).toEqual("test5");
            expect(testRecord.EMAIL).toEqual("newemail2@gmail.com");
        }catch(e){
            console.log("Error occured while testing records");
        }finally {
            Student.destroy({where :{STUDENT_ID : 999999}});
        }
    });

    it('Invalid Student ID', async () => {
        const response = await request(app).post(route).send(
            {
                student_id: "-1007",
                student_first_name: "test1",
                student_middle_name: "test2",
                student_last_name: "test3",
                email: "newemail@gmail.com"
            }
        );
        expect(response.body.message).toEqual("invalid student id passed");
        expect(response.body.status).toEqual("error");
        
    });


});

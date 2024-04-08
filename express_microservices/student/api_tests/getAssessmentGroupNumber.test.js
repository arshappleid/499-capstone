const request = require('supertest');
const {app} = require("../server");
const route = "/getassessmentgroupnumber";
describe('tests POST /student/getassessmentgroupnumber', () => {
    
    it('valid Student ID', async() => {
        const response = await request(app).post(route).send(
            {
                student_id:"1001",
                assignment_id : "1"
            }
            );
        expect(response.body.status).toEqual("success");
    });
    
    
    it('Invalid Student ID', async() => {
        const response = await request(app).post(route).send(
            {
                student_id:"-1001",
                assignment_id : "1"
            }
            );
        expect(response.body.status).toEqual("error");
        expect(response.body.message).toEqual("student id not found");
    });
    
    it('Invalid Assignment ID', async() => {
        const response = await request(app).post(route).send(
            {
                student_id:"1001",
                assignment_id : "-1"
            }
            );
        expect(response.body.status).toEqual("error");
        expect(response.body.message).toEqual("invalid assignment id");
    });


});

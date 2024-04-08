const request = require('supertest');
const {app} = require("../server");
const {StudentCourse, CourseAssignment} = require("../database");
const route = '/getsubmissionlink';

describe('tests POST /student/getsubmissionlink', () => {
    it('Valid Student ID , and Valid Assignment Id', async () => {
        const response = await request(app).post(route).send(
            {
                student_id: "1001",
                assignment_id: "1"
            }
            );
        expect(response.body.status).toEqual("success");
    });
    
    it('InValid Student ID , and Valid Assignment Id', async () => {
        const response = await request(app).post(route).send(
            {
                student_id: "-1",
                assignment_id: "10000001"
            }
            );
        expect(response.body.status).toEqual("error");
        expect(response.body.message).toEqual("student does not exist");
    });
    
    it('Valid Student ID , and InValid Assignment Id', async () => {
        const response = await request(app).post(route).send(
            {
                student_id: "1001",
                assignment_id: "123"
            }
            );
        expect(response.body.status).toEqual("error");
        expect(response.body.message).toEqual("no submission found associated with student id");
    });
    
    

});

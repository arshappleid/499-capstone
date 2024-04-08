const request = require('supertest');
const {app} = require("../server");
const {StudentCourse, CourseAssignment} = require("../database");
const route = '/submitassignment';

describe('tests POST /student/viewassessment', () => {
    it('Valid Evaluatee ID , and Valid Assessment Id', async () => {
        const response = await request(app).post(route).send(
            {
                evaluatee_id: "1",
                assessment_id: "10000001"
            }
            );

        expect(response.body.status).toEqual("success");
    });

});

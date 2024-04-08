const request = require('supertest');
const {app} = require("../server");

describe('tests POST /student/getcourselist', () => {
    it('valid Student ID', async() => {
        const response = await request(app).post('/getcourselist').send(
            {
                student_id:"10000010"
            }
        );
        expect(response.body.status).toEqual("success");
    });
    
    it('Invalid Student ID', async() => {
        const response = await request(app).post('/getcourselist').send(
            {
                student_id:"-10000010"
            }
            );
        expect(response.body.status).toEqual("error");
        expect(response.body.message).toEqual("student id not found");
    });

    
});

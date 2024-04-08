const request = require('supertest');
const {app} = require("../server");
const {StudentCourse, CourseAssignment} = require("../database");
const route = '/submitassignment';

describe('tests POST /student/submitassignment', () => {
    it('Valid Student ID , Valid Assignment Id , and Enrolled in Course', async () => {
        const response = await request(app).post(route).send(
            {
                assignment_id: "1",
                student_id: "10000001",
                submission_link: "www.google.com"
            }
        );

        expect(response.body.status).toEqual("success");
    });

    it('Invalid Student ID', async () => {
        const response = await request(app).post(route).send(
            {
                assignment_id: "1",
                student_id: "-10000001",
                submission_link: "www.google.com"
            }
        );
        expect(response.body.message).toEqual("Invalid Student Id");
        expect(response.body.status).toEqual("error");

    });

    it('Invalid Assignment ID', async () => {
        const response = await request(app).post(route).send(
            {
                assignment_id: "-1",
                student_id: "10000001",
                submission_link: "www.google.com"
            }
        );
        expect(response.body.message).toEqual("Invalid Assignment Id");
        expect(response.body.status).toEqual("error");

    });


    it('Student not enrolled in course', async () => {
        // Ensures the student is not enrolled in the course.
        await StudentCourse.destroy({
            where: {STUDENT_ID: "10000056", COURSE_ID: "1"}
        });
        const response = await request(app).post(route).send(
            {
                assignment_id: "1",
                student_id: "10000056",
                submission_link: "www.google.com"
            }
        );
        expect(response.body.message).toEqual("Student not Enrolled in the Course for the Assignment");
        expect(response.body.status).toEqual("error");
    });

});

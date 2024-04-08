const request = require('supertest');
const {app} = require("../server");
const {Student} = require('../database/index');

describe('tests POST /student/updatepassword', () => {
    it('valid Student ID , Valid New Password', async () => {
        try {
            // Create A test user
            await Student.create({
                STUDENT_ID: '1234',
                FIRST_NAME: 'test',
                MIDDLE_NAME: 'test',
                LAST_NAME: 'test',
                EMAIL: 'test@gmail.com',
                MD5_HASHED_PASSWORD: '12345'
            });
            const response = await request(app).post('/updatepassword').send(
                {
                    student_id: "10000010",
                    old_password_hash: "12345",
                    new_password_hash: "145678"
                }
            );
            expect(response.body.status).toEqual("success");
            expect(response.body.status).toEqual('student password update successful');
        } catch (e) {
            console.log("Error occured while testing out POST /student/updatepassword : " + e);
        } finally {
            // Lets make sure we delete the test user
            await Student.destroy({where: {STUDENT_ID: '1234'}});
        }
    });

    it('valid Student ID , Invalid Valid New Password - Wrong old Password', async () => {
        try {
            // Create A test user
            await Student.create({
                STUDENT_ID: '1234',
                FIRST_NAME: 'test',
                MIDDLE_NAME: 'test',
                LAST_NAME: 'test',
                EMAIL: 'test@gmail.com',
                MD5_HASHED_PASSWORD: '12345'
            });
            const response = await request(app).post('/updatepassword').send(
                {
                    student_id: "10000010",
                    old_password_hash: "1456",
                    new_password_hash: "145678"
                }
            );
            expect(response.body.status).toEqual("error");
            expect(response.body.message).toEqual('wrong password')
        } catch (e) {
            console.log("Error occured while testing out POST /student/updatepassword : " + e);
        } finally {
            // Lets make sure we delete the test user
            await Student.destroy({where: {STUDENT_ID: '1234'}});
        }
    });


    it('valid Student ID , Invalid Valid New Password - OLD PASSWORD==NEW PASSWORD', async () => {
        try {
            // Create A test user
            await Student.create({
                STUDENT_ID: '1234',
                FIRST_NAME: 'test',
                MIDDLE_NAME: 'test',
                LAST_NAME: 'test',
                EMAIL: 'test@gmail.com',
                MD5_HASHED_PASSWORD: '12345'
            });
            const response = await request(app).post('/updatepassword').send(
                {
                    student_id: "10000010",
                    old_password_hash: "12345",
                    new_password_hash: "12345"
                }
            );
            expect(response.body.status).toEqual("error");
            expect(response.body.message).toEqual('new password should not be the same as the old one')
        } catch (e) {
            console.log("Error occured while testing out POST /student/updatepassword : " + e);
        } finally {
            // Lets make sure we delete the test user
            await Student.destroy({where: {STUDENT_ID: '1234'}});
        }
    });

    it('Invalid values passed - Empty password hashes passed', async () => {
        const response = await request(app).post('/updatepassword').send(
            {
                student_id: "10000010",
                old_password_hash: "",
                new_password_hash: ""
            }
        );
        expect(response.body.message).toEqual("Empty values passed");
        expect(response.body.status).toEqual("error");
    });


    it('Invalid Student ID - does not exist in database', async () => {
        const response = await request(app).post('/updatepassword').send(
            {
                student_id: "-10000010",
                old_password_hash: "1234",
                new_password_hash: "1234567"
            }
        );
        
        expect(response.body.status).toEqual("error");
        expect(response.body.message).toEqual("student id not found");
    });


});

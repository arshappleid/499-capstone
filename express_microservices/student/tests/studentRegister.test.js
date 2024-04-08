// Author: Lance Haoxiang Xu (All the code here is written by Lance Haoxiang Xu unless specified otherwise)
import { describe, test, expect } from 'vitest';
const { Student } = require('../database/index');

const registerStudentService = require('../services/registerStudentService');

describe('registerStudentService', async () => {
    const student_id = 3302;
    const student_register_id = 6303;

    beforeEach(async () => {
        try {
            await Student.create({
                STUDENT_ID: student_register_id,
                FIRST_NAME: 'FIRST_NAME6303',
                MIDDLE_NAME: 'MIDDLE_NAME6303',
                LAST_NAME: 'LAST_NAME6303',
                EMAIL: 'REGISTER3302@TEST.COM',
                MD5_HASHED_PASSWORD: 'MD5_PASSWORD',
            });
        } catch (e) {
            console.log(e);
        }
    });
    afterEach(async () => {
        try {
            await Student.destroy({
                where: { STUDENT_ID: student_id },
            });
            await Student.destroy({
                where: { STUDENT_ID: student_register_id },
            });
        } catch (e) {
            console.log(e);
        }
    });
    test('Undefined Variable', async () => {
        const result = await registerStudentService();

        expect(result.status).toBe('error');
        expect(result.message).toBe(
            'Undefined values passed to Service Function'
        );
    });
    test('Empty Variable', async () => {
        const result = await registerStudentService('', '', '', '', '', '');

        expect(result.status).toBe('error');
        expect(result.message).toBe('Empty values passed');
    });
    test('Student id already exists', async () => {
        const result = await registerStudentService(
            'FIRST_NAME',
            'MIDDLE_NAME',
            'LAST_NAME',
            'EMAIL',
            student_register_id,
            'MD5_PASSWORD'
        );

        expect(result.status).toBe('error');
        expect(result.message).toBe('student id already exists.');
    });
    test('Email already exists', async () => {
        const result = await registerStudentService(
            'FIRST_NAME',
            'MIDDLE_NAME',
            'LAST_NAME',
            'REGISTER3302@TEST.COM',
            student_id,
            'MD5_PASSWORD'
        );
    });
    test('Successful Registration', async () => {
        const result = await registerStudentService(
            'FIRST_NAME',
            'MIDDLE_NAME',
            'LAST_NAME',
            'NEW_REGISTER3302@TEST.COM',
            student_id,
            'MD5_PASSWORD'
        );
    });
});
            
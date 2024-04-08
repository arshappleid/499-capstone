-- SQL statements to create tables and insert test data
CREATE DATABASE test_Database;
USE test_Database;

CREATE TABLE STUDENT (
    STUDENT_ID INT PRIMARY KEY,
    FIRST_NAME VARCHAR(50) NOT NULL,
    MIDDLE_NAME VARCHAR(50),
    LAST_NAME VARCHAR(50),
    EMAIL VARCHAR(50) NOT NULL,                -- Will also act as a login , therefore is required.
    MD5_HASHED_PASSWORD VARCHAR(255) NOT NULL  -- Cannot have a student without a password
);
 
CREATE TABLE SUPER_ADMIN (
    SUPER_ADMIN_ID INT AUTO_INCREMENT PRIMARY KEY,
    EMAIL VARCHAR(100) NOT NULL,
    MD5_HASHED_PASSWORD VARCHAR(255) NOT NULL
);

CREATE TABLE INSTRUCTOR(
	INSTRUCTOR_ID INT PRIMARY KEY,
    FIRST_NAME VARCHAR(50) NOT NULL,
    MIDDLE_NAME VARCHAR(50),
    LAST_NAME VARCHAR(50),
    EMAIL VARCHAR(50) NOT NULL,
    INSTRUCTOR_ACCESS TINYINT(1) DEFAULT 1 NOT NULL,
    MD5_HASHED_PASSWORD VARCHAR(255) NOT NULL
    
);

CREATE TABLE COURSE(
	COURSE_ID INT PRIMARY KEY AUTO_INCREMENT,
    INSTRUCTOR_ID INT,
    COURSE_NAME VARCHAR(100) NOT NULL,
    COURSE_CODE VARCHAR(50) NOT NULL,
    COURSE_SEMESTER VARCHAR(50) NOT NULL,
    COURSE_YEAR VARCHAR(50) NOT NULL,
    COURSE_TERM VARCHAR(50) NOT NULL,
    COURSE_VISIBILITY TINYINT(1) DEFAULT 0 NOT NULL,  -- 0 is not visible and 1 is visible (This is basically a toggle to show/hide the course)
    EXTERNAL_COURSE_LINK VARCHAR(255),    
    FOREIGN KEY (INSTRUCTOR_ID) REFERENCES INSTRUCTOR(INSTRUCTOR_ID) -- EVERY COURSE HAS TO HAVE AN INSTRUCTOR
);

CREATE TABLE INSTRUCTOR_COURSE (
    INSTRUCTOR_ID INT,
    COURSE_ID INT,
    PRIMARY KEY (INSTRUCTOR_ID, COURSE_ID),
    FOREIGN KEY (INSTRUCTOR_ID) REFERENCES INSTRUCTOR (INSTRUCTOR_ID),
    FOREIGN KEY (COURSE_ID) REFERENCES COURSE (COURSE_ID)
);
CREATE TABLE STUDENT_COURSE(   -- This will hold all the student ids of the students in the course
    STUDENT_ID INT,
    COURSE_ID INT,

    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(STUDENT_ID),
    FOREIGN KEY (COURSE_ID) REFERENCES COURSE(COURSE_ID),
    PRIMARY KEY (STUDENT_ID,COURSE_ID)
);

CREATE TABLE COURSE_GROUP_EVALUATION(
    GROUP_ID INT PRIMARY KEY AUTO_INCREMENT,
    GROUP_NAME VARCHAR(255),
    COURSE_ID INT,
    FOREIGN KEY (COURSE_ID) REFERENCES COURSE(COURSE_ID)
);

CREATE TABLE GROUP_MEMBERS_TABLE(
    STUDENT_ID INT,
    GROUP_ID INT,
    FOREIGN KEY (GROUP_ID) REFERENCES COURSE_GROUP_EVALUATION(GROUP_ID),
    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(STUDENT_ID),
    PRIMARY KEY (STUDENT_ID,GROUP_ID)
);

CREATE TABLE EVALUATION_FORM(
    FORM_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    FORM_NAME VARCHAR(255) NOT NULL,
    COURSE_ID INT,
    DEADLINE DATETIME,
    SHARE_FEEDBACK TINYINT(1) DEFAULT 0 NOT NULL,
    VISIBILITY TINYINT(1) DEFAULT 0 NOT NULL,
    FOREIGN KEY (COURSE_ID) REFERENCES COURSE(COURSE_ID)
);

CREATE TABLE EVALUATION_QUESTION(
    QUESTION_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    FORM_ID BIGINT,
    QUESTION_TEXT VARCHAR(1000),
    QUESTION_TYPE VARCHAR(255),
    FOREIGN KEY (FORM_ID) REFERENCES EVALUATION_FORM(FORM_ID)
);

CREATE TABLE EVALUATION_SECTION(
    FORM_ID BIGINT,
    QUESTION_ID BIGINT,
    SECTION_NAME VARCHAR(255),
    SECTION_WEIGHT FLOAT(4) DEFAULT 1.0 NOT NULL,
    FOREIGN KEY (FORM_ID) REFERENCES EVALUATION_FORM(FORM_ID),
    FOREIGN KEY (QUESTION_ID) REFERENCES EVALUATION_QUESTION(QUESTION_ID)
);

CREATE TABLE EVALUATION_QUESTION_OPTION(
    OPTION_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    QUESTION_ID BIGINT,
    OPTION_TEXT VARCHAR(5000),
    OPTION_POINT FLOAT(4) DEFAULT 0.0 NOT NULL,

    FOREIGN KEY (QUESTION_ID) REFERENCES EVALUATION_QUESTION(QUESTION_ID)
);

CREATE TABLE EVALUATION_ANSWER(
  EVALUATION_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
  FORM_ID BIGINT,
  EVALUATOR_ID INT,
  EVALUATEE_ID INT,
  QUESTION_ID BIGINT,
  ANSWER VARCHAR(5000),
  -- Add other evaluation-related attributes
  FOREIGN KEY (FORM_ID) REFERENCES EVALUATION_FORM(FORM_ID),
  FOREIGN KEY (EVALUATOR_ID) REFERENCES STUDENT(STUDENT_ID),
  FOREIGN KEY (EVALUATEE_ID) REFERENCES STUDENT(STUDENT_ID),
  FOREIGN KEY (QUESTION_ID) REFERENCES EVALUATION_QUESTION(QUESTION_ID)
);

CREATE TABLE EVALUATION_GRADE(
    EVALUATION_GRADE_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    EVALUATEE_ID INT,
    FORM_ID BIGINT,
    GRADE FLOAT(4) DEFAULT 0.0 NOT NULL,
    FOREIGN KEY (EVALUATEE_ID) REFERENCES STUDENT(STUDENT_ID),
    FOREIGN KEY (FORM_ID) REFERENCES EVALUATION_FORM(FORM_ID)
);

CREATE TABLE STUDENT_AUTH_TOKEN(
    STUDENT_ID INT,
    AUTH_TOKEN VARCHAR(500),
    EXPIRY DATETIME,
    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(STUDENT_ID),
    PRIMARY KEY (STUDENT_ID,AUTH_TOKEN)
);

CREATE TABLE INSTRUCTOR_AUTH_TOKEN(
    INSTRUCTOR_ID INT,
    AUTH_TOKEN VARCHAR(500),
    EXPIRY DATETIME,
    FOREIGN KEY (INSTRUCTOR_ID) REFERENCES INSTRUCTOR(INSTRUCTOR_ID),
    PRIMARY KEY (INSTRUCTOR_ID,AUTH_TOKEN)
);

CREATE TABLE COURSE_ASSIGNMENT(
    ASSIGNMENT_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    COURSE_ID INT NOT NULL,
    ASSIGNMENT_NAME VARCHAR(255),
    DEADLINE DATETIME,
    AVAILABLE_FROM DATETIME,
    AVAILABLE_TO DATETIME,
    FORM_ID BIGINT,
    ASSIGNMENT_DESCRIPTION VARCHAR(5000),
    SUBMISSION_TYPE VARCHAR(255),
    SHARE_FEEDBACK TINYINT(1) DEFAULT 0 NOT NULL,
    VISIBILITY TINYINT(1) DEFAULT 0 NOT NULL,

    FOREIGN KEY (COURSE_ID) REFERENCES COURSE(COURSE_ID),
    FOREIGN KEY (FORM_ID) REFERENCES EVALUATION_FORM(FORM_ID)
);

CREATE TABLE ASSIGNMENT_CRITERIA(
    CRITERIA_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    ASSIGNMENT_ID BIGINT,
    CRITERIA_DESCRIPTION VARCHAR(255),
    FOREIGN KEY (ASSIGNMENT_ID) REFERENCES COURSE_ASSIGNMENT(ASSIGNMENT_ID)
);

CREATE TABLE ASSIGNMENT_CRITERIA_RATING_OPTION(
    OPTION_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    CRITERIA_ID BIGINT NOT NULL,
    OPTION_DESCRIPTION VARCHAR(255),
    OPTION_POINT FLOAT(4) DEFAULT 0.0 NOT NULL,
    FOREIGN KEY (CRITERIA_ID) REFERENCES ASSIGNMENT_CRITERIA(CRITERIA_ID)
);

CREATE TABLE ASSIGNMENT_ASSESSMENT(
    ASSESSMENT_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    ASSIGNMENT_ID BIGINT NOT NULL,
    EVALUATOR_ID INT NOT NULL,
    EVALUATEE_ID INT NOT NULL,
    CRITERIA_ID BIGINT NOT NULL,
    OPTION_ID BIGINT NOT NULL,
    ASSESSMENT_COMMENT VARCHAR(5000),
    FOREIGN KEY (ASSIGNMENT_ID) REFERENCES COURSE_ASSIGNMENT (ASSIGNMENT_ID),
    FOREIGN KEY (EVALUATOR_ID) REFERENCES STUDENT (STUDENT_ID),
    FOREIGN KEY (EVALUATEE_ID) REFERENCES STUDENT (STUDENT_ID),
    FOREIGN KEY (CRITERIA_ID) REFERENCES ASSIGNMENT_CRITERIA (CRITERIA_ID),
    FOREIGN KEY (OPTION_ID) REFERENCES ASSIGNMENT_CRITERIA_RATING_OPTION (OPTION_ID)
);

CREATE TABLE ASSIGNMENT_ASSESSMENT_GROUP (
    ASSESSED_GROUP_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    ASSIGNMENT_ID BIGINT,
    EVALUATEE_ID INT,
    FOREIGN KEY (ASSIGNMENT_ID) REFERENCES COURSE_ASSIGNMENT (ASSIGNMENT_ID),
    FOREIGN KEY (EVALUATEE_ID) REFERENCES STUDENT (STUDENT_ID)
);

CREATE TABLE ASSESSMENT_GROUP_MEMBERS_TABLE(
    EVALUATOR_ID INT NOT NULL,
    ASSESSED_GROUP_ID BIGINT NOT NULL,
    FOREIGN KEY (EVALUATOR_ID) REFERENCES STUDENT(STUDENT_ID),
    FOREIGN KEY (ASSESSED_GROUP_ID) REFERENCES ASSIGNMENT_ASSESSMENT_GROUP(ASSESSED_GROUP_ID),
    PRIMARY KEY (EVALUATOR_ID,ASSESSED_GROUP_ID)
);

CREATE TABLE ASSIGNMENT_SUBMISSION(
    SUBMISSION_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    ASSIGNMENT_ID BIGINT,
    STUDENT_ID INT,
    SUBMISSION_LINK VARCHAR(1000) NOT NULL, 

    FOREIGN KEY (ASSIGNMENT_ID) REFERENCES COURSE_ASSIGNMENT(ASSIGNMENT_ID),
    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(STUDENT_ID)
);

CREATE TABLE ASSESSMENT_GRADE(
    ASSESSMENT_GRADE_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
    EVALUATEE_ID INT,
    ASSIGNMENT_ID BIGINT,
    GRADE FLOAT(4) DEFAULT 0.0 NOT NULL,
    FOREIGN KEY (EVALUATEE_ID) REFERENCES STUDENT(STUDENT_ID),
    FOREIGN KEY (ASSIGNMENT_ID) REFERENCES COURSE_ASSIGNMENT(ASSIGNMENT_ID)
);

-- Add testing data into the tables


INSERT INTO STUDENT (STUDENT_ID, FIRST_NAME, MIDDLE_NAME, LAST_NAME, EMAIL, MD5_HASHED_PASSWORD)
VALUES
    (10000001, 'John', 'A.', 'Doe', 'john.doe@example.com', 'password1'),
    (10000002, 'Jane', 'B.', 'Smith', 'jane.smith@example.com', 'password2'),
    (10000003, 'David', 'C.', 'Johnson', 'david.johnson@example.com', 'password3'),
    (10000004, 'Emily', 'D.', 'Brown', 'emily.brown@example.com', 'password4'),
    (10000005, 'Michael', 'E.', 'Wilson', 'michael.wilson@example.com', 'password5'),
    (10000006, 'Sarah', 'F.', 'Jones', 'sarah.jones@example.com', 'password6'),
    (10000007, 'Matthew', 'G.', 'Davis', 'matthew.davis@example.com', 'password7'),
    (10000008, 'Olivia', 'H.', 'Taylor', 'olivia.taylor@example.com', 'password8'),
    (10000009, 'Daniel', 'I.', 'Anderson', 'daniel.anderson@example.com', 'password9'),
    (10000010, 'Sophia', 'J.', 'Wilson', 'sophia.wilson@example.com', 'password10'),
    (10000011, 'Alexander', 'K.', 'Lee', 'alexander.lee@example.com', 'password11'),
    (10000012, 'Isabella', 'L.', 'Harris', 'isabella.harris@example.com', 'password12'),
    (10000013, 'James', 'M.', 'Clark', 'james.clark@example.com', 'password13'),
    (10000014, 'Ava', 'N.', 'Lewis', 'ava.lewis@example.com', 'password14'),
    (10000015, 'Ethan', 'O.', 'King', 'ethan.king@example.com', 'password15'),
    (10000016, 'Mia', 'P.', 'Robinson', 'mia.robinson@example.com', 'password16'),
    (10000017, 'William', 'Q.', 'Parker', 'william.parker@example.com', 'password17'),
    (10000018, 'Charlotte', 'R.', 'Carter', 'charlotte.carter@example.com', 'password18'),
    (10000019, 'Benjamin', 'S.', 'Thomas', 'benjamin.thomas@example.com', 'password19'),
    (10000020, 'Amelia', 'T.', 'Hall', 'amelia.hall@example.com', 'password20'),
    (10000021, 'Henry', 'U.', 'Adams', 'henry.adams@example.com', 'password21'),
    (10000022, 'Evelyn', 'V.', 'Green', 'evelyn.green@example.com', 'password22'),
    (10000023, 'Samuel', 'W.', 'Hill', 'samuel.hill@example.com', 'password23'),
    (10000024, 'Victoria', 'X.', 'Baker', 'victoria.baker@example.com', 'password24'),
    (10000025, 'Joseph', 'Y.', 'Cruz', 'joseph.cruz@example.com', 'password25'),
    (10000026, 'Grace', 'Z.', 'Roberts', 'grace.roberts@example.com', 'password26'),
    (10000027, 'Andrew', 'A.', 'Phillips', 'andrew.phillips@example.com', 'password27'),
    (10000028, 'Scarlett', 'B.', 'Evans', 'scarlett.evans@example.com', 'password28'),
    (10000029, 'David', 'C.', 'Turner', 'david.turner@example.com', 'password29'),
    (10000030, 'Chloe', 'D.', 'Perez', 'chloe.perez@example.com', 'password30'),
    (10000031, 'Liam', 'E.', 'Gonzalez', 'liam.gonzalez@example.com', 'password31'),
    (10000032, 'Abigail', 'F.', 'Cook', 'abigail.cook@example.com', 'password32'),
    (10000033, 'Daniel', 'G.', 'Rogers', 'daniel.rogers@example.com', 'password33'),
    (10000034, 'Elizabeth', 'H.', 'Hernandez', 'elizabeth.hernandez@example.com', 'password34'),
    (10000035, 'Michael', 'I.', 'Stewart', 'michael.stewart@example.com', 'password35'),
    (10000036, 'Sofia', 'J.', 'Morris', 'sofia.morris@example.com', 'password36'),
    (10000037, 'Benjamin', 'K.', 'Sullivan', 'benjamin.sullivan@example.com', 'password37'),
    (10000038, 'Avery', 'L.', 'Powell', 'avery.powell@example.com', 'password38'),
    (10000039, 'Alexander', 'M.', 'Patterson', 'alexander.patterson@example.com', 'password39'),
    (10000040, 'Ella', 'N.', 'Rivera', 'ella.rivera@example.com', 'password40'),
    (10000041, 'Matthew', 'O.', 'Coleman', 'matthew.coleman@example.com', 'password41'),
    (10000042, 'Scarlett', 'P.', 'Howard', 'scarlett.howard@example.com', 'password42'),
    (10000043, 'David', 'Q.', 'Foster', 'david.foster@example.com', 'password43'),
    (10000044, 'Victoria', 'R.', 'Washington', 'victoria.washington@example.com', 'password44'),
    (10000045, 'James', 'S.', 'Simmons', 'james.simmons@example.com', 'password45'),
    (10000046, 'Aria', 'T.', 'Sanders', 'aria.sanders@example.com', 'password46'),
    (10000047, 'Joseph', 'U.', 'Price', 'joseph.price@example.com', 'password47'),
    (10000048, 'Madison', 'V.', 'Bennett', 'madison.bennett@example.com', 'password48'),
    (10000049, 'William', 'W.', 'Reed', 'william.reed@example.com', 'password49'),
    (10000050, 'Grace', 'X.', 'Ross', 'grace.ross@example.com', 'password50'),
    (10000051, 'Oliver', 'Y.', 'Sanders', 'oliver.sanders@example.com', 'password51'),
    (10000052, 'Chloe', 'Z.', 'Bell', 'chloe.bell@example.com', 'password52'),
    (10000053, 'Elijah', 'A.', 'Bryant', 'elijah.bryant@example.com', 'password53'),
    (10000054, 'Emily', 'B.', 'Foster', 'emily.foster@example.com', 'password54'),
    (10000055, 'Daniel', 'C.', 'Perry', 'daniel.perry@example.com', 'password55'),
    (10000056, 'Ava', 'D.', 'Simmons', 'ava.simmons@example.com', 'password56'),
    (10000057, 'Matthew', 'E.', 'Morgan', 'matthew.morgan@example.com', 'password57'),
    (10000058, 'Scarlett', 'F.', 'Foster', 'scarlett.foster@example.com', 'password58'),
    (10000059, 'James', 'G.', 'Ross', 'james.ross@example.com', 'password59'),
    (10000060, 'Sophia', 'H.', 'Stewart', 'sophia.stewart@example.com', 'password60');

INSERT INTO SUPER_ADMIN (SUPER_ADMIN_ID, EMAIL, MD5_HASHED_PASSWORD)
VALUES
    (1, 'admin1@example.com', 'password1'),
    (2, 'admin2@example.com', 'password2');

    INSERT INTO INSTRUCTOR (INSTRUCTOR_ID,FIRST_NAME, MIDDLE_NAME, LAST_NAME, EMAIL, INSTRUCTOR_ACCESS, MD5_HASHED_PASSWORD)
VALUES
    (11110000,'Robert', 'A.', 'Smith', 'robert.smith@example.com', 1, 'password1'),
    (22220000, 'Jennifer', 'B.', 'Johnson', 'jennifer.johnson@example.com', 1, 'password2'),
    (33330000,'Michael', 'C.', 'Williams', 'michael.williams@example.com', 1, 'password3');

INSERT INTO COURSE (INSTRUCTOR_ID, COURSE_NAME, COURSE_CODE, COURSE_SEMESTER, COURSE_YEAR, COURSE_TERM, COURSE_VISIBILITY, EXTERNAL_COURSE_LINK)
VALUES
    (11110000, 'Physics', 'PHY111', 'Fall', '2023', 'Term 1', 1, 'https://example.com/physics'),
    (22220000, 'Sociology', 'SOCI111', 'Spring', '2023', 'Term 2', 1, 'https://example.com/chemistry'),
    (33330000, 'Computer Science', 'COSC499', 'Spring', '2023', 'Term 2', 1, 'https://example.com/mathematics'),
    (11110000, 'Mathematics', 'MATH200', 'Spring', '2023', 'Term 2', 1, 'https://example.com/biology'),
    (22220000, 'Computer Science', 'COSC407', 'Fall', '2023', 'Term 1', 1, 'https://example.com/computer-science');

INSERT INTO INSTRUCTOR_COURSE (INSTRUCTOR_ID, COURSE_ID)
VALUES
    (11110000, 1),
    (22220000, 2),
    (33330000, 3),
    (11110000, 4),
    (22220000, 5);


INSERT INTO STUDENT_COURSE (STUDENT_ID, COURSE_ID)
SELECT s.STUDENT_ID, c.COURSE_ID
FROM (
    SELECT STUDENT_ID, ROW_NUMBER() OVER () AS ROW_NUM
    FROM STUDENT
    WHERE STUDENT_ID BETWEEN 10000001 AND 10000060
) AS s
JOIN (
    SELECT COURSE_ID, ROW_NUMBER() OVER () AS ROW_NUM
    FROM COURSE
    WHERE COURSE_ID BETWEEN 1 AND 5
) AS c ON ((s.ROW_NUM - 1) % 5) + 1 = c.COURSE_ID;

INSERT INTO COURSE_GROUP_EVALUATION (GROUP_NAME, COURSE_ID)
SELECT CONCAT('Group ', ((n.number - 1) % 4) + 1), c.COURSE_ID
FROM
    (SELECT 1 AS number UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) AS n
CROSS JOIN
    (SELECT COURSE_ID FROM COURSE WHERE COURSE_ID BETWEEN 1 AND 5) AS c;

INSERT INTO GROUP_MEMBERS_TABLE (STUDENT_ID, GROUP_ID)
VALUES
  (10000001, 4),
  (10000006, 3),
  (10000011, 2),
  (10000016, 1),
  (10000021, 4),
  (10000026, 3),
  (10000031, 2),
  (10000036, 1),
  (10000041, 4),
  (10000046, 3),
  (10000051, 2),
  (10000056, 1);

  INSERT INTO GROUP_MEMBERS_TABLE (STUDENT_ID, GROUP_ID)
VALUES
  (10000002, 9),
  (10000007, 9),
  (10000012, 10),
  (10000017, 10),
  (10000022, 11),
  (10000027, 11),
  (10000032, 12),
  (10000037, 12),
  (10000042, 9),
  (10000047, 10),
  (10000052, 11),
  (10000057, 12);
  INSERT INTO GROUP_MEMBERS_TABLE (STUDENT_ID, GROUP_ID)
VALUES
  (10000003, 17),
  (10000008, 17),
  (10000013, 18),
  (10000018, 18),
  (10000023, 19),
  (10000028, 19),
  (10000033, 20),
  (10000038, 20),
  (10000043, 17),
  (10000048, 18),
  (10000053, 19),
  (10000058, 20);

  INSERT INTO GROUP_MEMBERS_TABLE (STUDENT_ID, GROUP_ID)
VALUES
  (10000004, 5),
  (10000009, 5),
  (10000014, 6),
  (10000019, 6),
  (10000024, 7),
  (10000029, 7),
  (10000034, 8),
  (10000039, 8),
  (10000044, 5),
  (10000049, 6),
  (10000054, 7),
  (10000059, 8);

  INSERT INTO GROUP_MEMBERS_TABLE (STUDENT_ID, GROUP_ID)
VALUES
  (10000005, 13),
  (10000010, 13),
  (10000015, 14),
  (10000020, 14),
  (10000025, 15),
  (10000030, 15),
  (10000035, 16),
  (10000040, 16),
  (10000045, 13),
  (10000050, 14),
  (10000055, 15),
  (10000060, 16);

 -- Insert into EVALUATION_FORM table
INSERT INTO EVALUATION_FORM (FORM_NAME, COURSE_ID, DEADLINE)
VALUES ('Group Assignment 1', 1, DATE_ADD(NOW(), INTERVAL 30 DAY));

INSERT INTO EVALUATION_QUESTION (QUESTION_ID, QUESTION_TEXT, QUESTION_TYPE)
VALUES
    (1, 'Give a mark from 0-5 on how well this team member participated in group tasks?', 'mcq'),
    (2, 'Describe their enthusiasm towards taking up group tasks.', 'shortAnswer'),
    (3, 'Choose all the qualities they presented over the course of the group project. Select all that apply.', 'ma'),
    (4, 'You absolutely love to have them in your team.', 'matrix'),
    (5, 'Rate how well they performed on tasks assigned to them.', 'mcq'),
    (6, 'Do you think they lived up to the expectations you had from them?', 'shortAnswer');


INSERT INTO EVALUATION_QUESTION_OPTION (QUESTION_ID, OPTION_TEXT)
VALUES
    (1, '0'),
    (1, '1'),
    (1, '2'),
    (1, '3'),
    (1, '4'),
    (1, '5'),
    (4, 'Strongly Disagree'),
    (4, 'Disagree'),
    (4, 'Neutral'),
    (4, 'Agree'),
    (4, 'Strongly Agree'),
    (5, '0'),
    (5, '1'),
    (5, '2'),
    (5, '3'),
    (5, '4'),
    (5, '5');

INSERT INTO STUDENT (STUDENT_ID, FIRST_NAME, EMAIL, MD5_HASHED_PASSWORD) VALUES 
(1001, 'Test1', 'test1@gmail.com', 'testpassword'),
(1002, 'Test2', 'test2@gmail.com', 'testpassword'),
(1003, 'Test3', 'test3@gmail.com', 'testpassword'),
(1004, 'Test4', 'test4@gmail.com', 'testpassword'),
(1005, 'Test5', 'test5@gmail.com', 'testpassword'),
(1006, 'Test6', 'test6@gmail.com', 'testpassword'),
(1007, 'Test7', 'test7@gmail.com', 'testpassword'),
(1008, 'Test8', 'test8@gmail.com', 'testpassword'),
(1009, 'Test9', 'test9@gmail.com', 'testpassword'),
(1010, 'Test10', 'test10@gmail.com', 'testpassword'),
(1011, 'Test11', 'test11@gmail.com', 'testpassword'),
(1012, 'Test12', 'test12@gmail.com', 'testpassword'),
(1013, 'Test13', 'test13@gmail.com', 'testpassword'),
(1014, 'Test14', 'test14@gmail.com', 'testpassword'),
(1015, 'Test15', 'test15@gmail.com', 'testpassword'),
(1016, 'Test16', 'test16@gmail.com', 'testpassword'),
(1017, 'Test17', 'test17@gmail.com', 'testpassword'),
(1018, 'Test18', 'test18@gmail.com', 'testpassword'),
(1019, 'Test19', 'test19@gmail.com', 'testpassword'),
(1020, 'Test20', 'test20@gmail.com', 'testpassword'),
(1021, 'Test21', 'test21@gmail.com', 'testpassword'),
(1022, 'Test22', 'test22@gmail.com', 'testpassword'),
(1023, 'Test23', 'test23@gmail.com', 'testpassword'),
(1024, 'Test24', 'test24@gmail.com', 'testpassword'),
(1025, 'Test25', 'test25@gmail.com', 'testpassword'),
(1026, 'Test26', 'test26@gmail.com', 'testpassword'),
(1027, 'Test27', 'test27@gmail.com', 'testpassword'),
(1028, 'Test28', 'test28@gmail.com', 'testpassword'),
(1029, 'Test29', 'test29@gmail.com', 'testpassword'),
(1030, 'Test30', 'test30@gmail.com', 'testpassword'),
(1031, 'Test31', 'test31@gmail.com', 'testpassword'),
(1032, 'Test32', 'test32@gmail.com', 'testpassword'),
(1033, 'Test33', 'test33@gmail.com', 'testpassword'),
(1034, 'Test34', 'test34@gmail.com', 'testpassword'),
(1035, 'Test35', 'test35@gmail.com', 'testpassword'),
(1036, 'Test36', 'test36@gmail.com', 'testpassword'),
(1037, 'Test37', 'test37@gmail.com', 'testpassword'),
(1038, 'Test38', 'test38@gmail.com', 'testpassword'),
(1039, 'Test39', 'test39@gmail.com', 'testpassword'),
(1040, 'Test40', 'test40@gmail.com', 'testpassword'),
(1041, 'Test41', 'test41@gmail.com', 'testpassword'),
(1042, 'Test42', 'test42@gmail.com', 'testpassword'),
(1043, 'Test43', 'test43@gmail.com', 'testpassword'),
(1044, 'Test44', 'test44@gmail.com', 'testpassword'),
(1045, 'Test45', 'test45@gmail.com', 'testpassword'),
(1046, 'Test46', 'test46@gmail.com', 'testpassword'),
(1047, 'Test47', 'test47@gmail.com', 'testpassword'),
(1048, 'Test48', 'test48@gmail.com', 'testpassword'),
(1049, 'Test49', 'test49@gmail.com', 'testpassword'),
(1050, 'Test50', 'test50@gmail.com', 'testpassword'),
(1051, 'Test51', 'test51@gmail.com', 'testpassword'),
(1052, 'Test52', 'test52@gmail.com', 'testpassword'),
(1053, 'Test53', 'test53@gmail.com', 'testpassword'),
(1054, 'Test54', 'test54@gmail.com', 'testpassword'),
(1055, 'Test55', 'test55@gmail.com', 'testpassword'),
(1056, 'Test56', 'test56@gmail.com', 'testpassword'),
(1057, 'Test57', 'test57@gmail.com', 'testpassword'),
(1058, 'Test58', 'test58@gmail.com', 'testpassword'),
(1059, 'Test59', 'test59@gmail.com', 'testpassword'),
(1060, 'Test60', 'test60@gmail.com', 'testpassword');

INSERT INTO STUDENT (STUDENT_ID, FIRST_NAME, LAST_NAME, EMAIL, MD5_HASHED_PASSWORD) VALUES 
(2001, 'Alex','Foot', 'alex@example.com', 'testpassword'),
(2002, 'Liam','Stienstra', 'liam@example.com', 'testpassword'),
(2003, 'Nariman', 'Milanfar','nariman@example.com', 'testpassword'),
(2004, 'Shukang', 'Wang','shukang@example.com', 'testpassword'),
(2005, 'Andrei', 'Zipis','andrei@example.com', 'testpassword'),
(2006, 'Matthew', 'Obirek','matthew@example.com', 'testpassword'),
(2007, 'Nishant', 'Srinivasan','nishant@example.com', 'testpassword'),
(2008, 'Skyler', 'Alderson','skylar@example.com', 'testpassword'),
(2009, 'Charvie', 'Yadav','charvie@example.com', 'testpassword'),
(2010, 'Louis', 'Lascelles-Palys','louis@example.com', 'testpassword'),
(2011, 'Rylan', 'Cox','rylan@example.com', 'testpassword'),
(2012, 'Sheel', 'Patel','sheel@example.com', 'testpassword'),
(2013, 'Yegor', 'Smertenko','yegor@example.com', 'testpassword'),
(2014, 'Alrick', 'Vincent','alrick@example.com', 'testpassword'),
(2015, 'Archita', 'Gattani','archita@example.com', 'testpassword'),
(2016, 'Gyumin', 'Moon','gyumin@example.com', 'testpassword'),
(2017, 'Jason', 'Ramos','jason@example.com', 'testpassword'),
(2018, 'Joe', 'Gaspari','joe@example.com', 'testpassword'),
(2019, 'Bilel', 'Matmti','bilel@example.com', 'testpassword'),
(2020, 'Nicholas', 'Pippo','nicholas@example.com', 'testpassword'),
(2021, 'Robert', 'Barnstead','robert@example.com', 'testpassword'),
(2022, 'Shreyasi', 'Chauhan','shreyasi@example.com', 'testpassword'),
(2023, 'Adam', 'Fipke','adam@example.com', 'testpassword'),
(2024, 'Eddy', 'Zhang','eddy@example.com', 'testpassword'),
(2025, 'Edwin', 'Zhou','edwin@example.com', 'testpassword'),
(2026, 'Jordan', 'Roberts','jordan@example.com', 'testpassword'),
(2027, 'Yuan', 'Zhu','yuan@example.com', 'testpassword'),
(2028, 'Charlotte', 'Zhang','charlotte@example.com', 'testpassword'),
(2029, 'Lance', 'Xu','lance@example.com', 'testpassword'),
(2030, 'Prabhmeet', 'Deol','prabh@example.com', 'testpassword'),
(2031, 'Sehajvir', 'Pannu','sehaj@example.com', 'testpassword'),
(2032, 'Shila', 'Rahman','shila@example.com', 'testpassword'),
(2033, 'Chad', 'Lantz','chad@example.com', 'testpassword'),
(2034, 'Erfan', 'Kazemi','erfan@example.com', 'testpassword'),
(2035, 'Livia', 'Zalilla','livia@example.com', 'testpassword'),
(2036, 'Nathania', 'Hendradjaja','nathania@example.com', 'testpassword'),
(2037, 'Rodrigo', 'Lopez','rodrigo@example.com', 'testpassword'),
(2038, 'Luke', 'Roblesky','luke@example.com', 'testpassword'),
(2039, 'Nikita', 'Korobkin','nikita@example.com', 'testpassword'),
(2040, 'Quan', 'Le','quan@example.com', 'testpassword'),
(2041, 'Sierra', 'Williams','sierra@example.com', 'testpassword');

INSERT INTO `EVALUATION_FORM`(`FORM_ID`, `FORM_NAME`, `COURSE_ID`, `DEADLINE`, `SHARE_FEEDBACK`, `VISIBILITY`) VALUES 
(2, 'Group Assignment', 2, '2023-09-01 05:02:40', 0, 0),
(3, 'Individual Assignment', 3, '2023-09-10 14:00:00', 1, 1),
(4, 'Final Project', 4, '2023-12-20 23:59:59', 1, 0),
(5, 'Midterm Assignment', 5, '2023-10-15 18:30:00', 0, 1);


INSERT INTO `COURSE_ASSIGNMENT` (`ASSIGNMENT_ID`, `COURSE_ID`, `ASSIGNMENT_NAME`, `DEADLINE`, `AVAILABLE_FROM`, `AVAILABLE_TO`, `FORM_ID`, `ASSIGNMENT_DESCRIPTION`, `SUBMISSION_TYPE`, `SHARE_FEEDBACK`, `VISIBILITY`) VALUES
(1, 1, 'Physics Assignment 1', '2023-09-01 23:59:59', '2023-08-01 00:00:00', '2023-09-01 23:59:59', 1, 'Chapter 1: Motion', 'ONLINE', true, 0),
(2, 2, 'Math Assignment 1', '2023-09-10 23:59:59', '2023-08-10 00:00:00', '2023-09-10 23:59:59', 2, 'Chapter 1: Algebra', 'OFFLINE', true, 0),
(3, 3, 'Chemistry Assignment 1', '2023-09-15 23:59:59', '2023-08-15 00:00:00', '2023-09-15 23:59:59', 3, 'Chapter 1: Elements', 'ONLINE', false, 0),
(4, 4, 'Biology Assignment 1', '2023-09-20 23:59:59', '2023-08-20 00:00:00', '2023-09-20 23:59:59', 4, 'Chapter 1: Cells', 'OFFLINE', true, 0),
(5, 5, 'English Assignment 1', '2023-09-25 23:59:59', '2023-08-25 00:00:00', '2023-09-25 23:59:59', 5, 'Chapter 1: Grammar', 'ONLINE', false, 0);



INSERT INTO `ASSIGNMENT_SUBMISSION` (`SUBMISSION_ID`, `ASSIGNMENT_ID`, `STUDENT_ID`, `SUBMISSION_LINK`) VALUES 
(1, 1, 1001, 'http://submissions.com/submission1.pdf'),
(2, 2, 1002, 'http://submissions.com/submission2.pdf'),
(3, 3, 1003, 'http://submissions.com/submission3.pdf'),
(4, 4, 1004, 'http://submissions.com/submission4.pdf'),
(5, 5, 1005, 'http://submissions.com/submission5.pdf');


INSERT INTO ASSIGNMENT_ASSESSMENT_GROUP (`ASSESSED_GROUP_ID` , `ASSIGNMENT_ID` , `EVALUATEE_ID`) VALUES 
(1,1,1001),
(2,2,1002),
(3, 3, 1003),
(4, 4, 1004),
(5, 5, 1005);

INSERT INTO `ASSESSMENT_GROUP_MEMBERS_TABLE` (`EVALUATOR_ID` , `ASSESSED_GROUP_ID`) VALUES (1001, 1);

INSERT INTO `ASSIGNMENT_CRITERIA` (`CRITERIA_ID` , `ASSIGNMENT_ID` , `CRITERIA_DESCRIPTION`) VALUES 
(1 , 1 , "OLD DESCRIPTION"),
(2 , 2 , "OLD DESCRIPTION"),
(3 , 3 , "OLD DESCRIPTION");

INSERT INTO `ASSIGNMENT_CRITERIA_RATING_OPTION`
(`OPTION_ID` , `CRITERIA_ID` , `OPTION_DESCRIPTION` , `OPTION_POINT`) VALUES 
(1, 1, 'Excellent', 10),
(2, 1, 'Good', 8),
(3, 1, 'Average', 5),
(4, 1, 'Poor', 2),
(5, 1, 'Very Poor', 0),
(6, 2, 'Excellent', 10),
(7, 2, 'Good', 8),
(8, 2, 'Average', 5),
(9, 2, 'Poor', 2);


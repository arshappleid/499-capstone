const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const port = process.env.port || 3000;
const {sequelize} = require('./database/index');
const authenticateToken = require('./jwt_auth'); // make sure the route is correct
// import all the controllers here
const registerStudentController = require('./controllers/registerStudentController');
const authenticateStudentController = require('./controllers/authenticateStudentController');
const getCourseStudentListController = require('./controllers/getCourseStudentListController');
const getStudentProfileController = require('./controllers/getStudentProfileController');
const getCourseListController = require('./controllers/getCourseListController');
const updatePasswordController = require('./controllers/updatePasswordController');
const getGroupMemberEvluationStatusController = require('./controllers/getGroupMemberEvluationStatusController');
const checkEvaluationFeedbackStatusController = require('./controllers/checkEvaluationFeedbackStatusController');
const getGroupPeopleListController = require('./controllers/getGroupStudentsController');
const submitGroupEvaluationController = require('./controllers/submitGroupEvaluationController');
const getCourseFormListController = require('./controllers/getCourseFormListController');
const studentGetFormController = require('./controllers/studentGetFormController');
const updateProfileController = require('./controllers/updateProfileController');
const studentGetIndiviudalGradeController = require('./controllers/studentGetIndiviudalGradeController');
const studentGetOverallGradeController = require('./controllers/studentGetOverallGradeController');
const viewEvaluationFeedbackController = require('./controllers/viewEvaluationFeedbackController');
// const getCourseAssignmentListController = require('./controllers/getCourseAssignmentListController');
const submitAssignmentController = require('./controllers/submitAssignmentController');
const getAssignmentListStatusController = require('./controllers/getAssignmentListStatusController');
const getRubricController = require('./controllers/getRubricController');
const getStudentToAssessController = require('./controllers/getStudentToAssessController');
const getAssessmentGroupNumber = require('./controllers/getAssessmentGroupNumberController');
const getAssessmentStatusController = require('./controllers/getAssessmentStatusController');
const getSubmissionLinkController = require('./controllers/getSubmissionLinkController');
const getAssignmentController = require('./controllers/getAssignmentController');
const getSubmissionStatusController = require('./controllers/getSubmissionStatusController');
const submitAssessmentController = require('./controllers/submitAssessmentController');
const viewAssessmentAssessmentController = require('./controllers/viewAssessmentAssessmentController');
const getAssessmentIndividualGradeController = require('./controllers/getAssessmentIndividualGradeController');
const getAssessmentOverallGradeController = require('./controllers/getAssessmentOverallGradeController');


// Allow express to parse JSON
app.use(express.json());
// Apply authentication to all routes.

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Add 'Authorization' to the allowed headers
};

app.use(cors(corsOptions));

app.use('/registerstudent', registerStudentController);

app.use(authenticateToken);

app.use('/authenticatestudent', authenticateStudentController);
app.use('/getcoursestudentlist', getCourseStudentListController);
app.use('/getstudentprofile', getStudentProfileController);
app.use('/getcourselist', getCourseListController);
app.use('/updatepassword', updatePasswordController);
app.use('/getevaluationstatus', getGroupMemberEvluationStatusController);
app.use('/getfeedbackstatus', checkEvaluationFeedbackStatusController);
app.use('/getgrouppeoplelist', getGroupPeopleListController);
app.use('/submitevaluation', submitGroupEvaluationController);
app.use('/getcourseformlist', getCourseFormListController);
app.use('/getform', studentGetFormController);
app.use('/updateprofile', updateProfileController);
app.use('/getindividualgrade', studentGetIndiviudalGradeController);
app.use('/getoverallgrade', studentGetOverallGradeController);
app.use('/viewevaluationfeedback', viewEvaluationFeedbackController);
// app.use('/getcoursassignmentlist', getCourseAssignmentListController);
app.use('/submitassignment', submitAssignmentController);
app.use('/getassignmentliststatus', getAssignmentListStatusController);
app.use('/getrubric', getRubricController);
app.use('/getstudenttoassess', getStudentToAssessController);
app.use('/getassessmentstatus', getAssessmentStatusController);
app.use('/getassignment', getAssignmentController);
app.use('/getsubmissionstatus', getSubmissionStatusController);
app.use('/submitassessment', submitAssessmentController);
app.use('/getassessmentgroupnumber', getAssessmentGroupNumber);
app.use('/getassessmentstatus', getAssessmentStatusController);
app.use('/getsubmissionlink', getSubmissionLinkController);
app.use('/getassignment', getAssignmentController);
app.use('/getsubmissionstatus', getSubmissionStatusController);
app.use('/viewassessment', viewAssessmentAssessmentController);
app.use('/getassessmentindividualgrade', getAssessmentIndividualGradeController);
app.use('/getassessmentoverallgrade', getAssessmentOverallGradeController);



// Cross Origin Resource Sharing
// app.use(cors())
// Sequelize setup
sequelize
    .sync({
        logging:
            process.env.NODE_ENV !== 'production' ||
            process.env.NODE_ENV !== 'test',
    })
    .then((result) => {
        //console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack trace to console
    res.status(500).send('Something broke!'); // Send error response to client
});

// Create HTTPS Server
http.createServer(app).listen(port, () => {
    console.log('HTTP server is running on http://localhost:' + port);
});

module.exports = {app};

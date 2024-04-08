const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const port = process.env.port || 3000;
const { sequelize } = require('./database/index');
const authenticateToken = require('./jwt_auth');
// import all the controllers here
const authenticateInstructorController = require('./controllers/authenticateInstructorController');
const getCourseListController = require('./controllers/getCourseListController');
const addStudentToCourseController = require('./controllers/addStudentToCourseController');
const addStudentToCoursePreviewController = require('./controllers/addStudentToCoursePreviewController');
const getGroupStudentsController = require('./controllers/getGroupStudentsController');
const registerInstructorController = require('./controllers/registerInstructorController');
const getCourseGroupsController = require('./controllers/getCourseGroupsController');
const getFormListController = require('./controllers/getFormListController');
const getAssignmentListController = require('./controllers/getAssignmentListController');
const instructorUpdateProfileController = require('./controllers/instructorUpdateProfileController');
const instructorUpdatePasswordController = require('./controllers/instructorUpdatePasswordController');
const getInstructorProfileController = require('./controllers/getInstructorProfileController');
const instructorCreateCourseController = require('./controllers/instructorCreateCourseController');
const addStudentToGroupController = require('./controllers/addStudentToGroupController');
const instructorCreateGroupController = require('./controllers/instructorCreateGroupController');
const instructorSetCourseVisibiliyController = require('./controllers/instructorSetCourseVisibiliyController');
const getCourseStudentListController = require('./controllers/getCourseStudentListController');
const removeStudentFromGroupController = require('./controllers/removeStudentFromGroupController');
const getAssignmentNumberController = require('./controllers/getAssignmentNumberController');
const removeEmptyGroupController = require('./controllers/removeEmptyGroupController');
const addStudentAndGroupToCourseController = require('./controllers/addStudentAndGroupToCourseController');
const addStudentAndGroupToCoursePreviewController = require('./controllers/addStudentAndGroupToCoursePreviewController');
const removeStudentsAndGroupsFromCourseController = require('./controllers/removeStudentsAndGroupsFromCourseController');
const instructorSetFormVisibilityController = require('./controllers/instructorSetFormVisibilityController');
const instructorCreateFormController = require('./controllers/instructorCreateFormController');
const instructorGetFormController = require('./controllers/instructorGetFormController');
const instructorGetFormAnswersController = require('./controllers/instructorGetFormAnswersController');
const instructorSetFormShareFeedbackController = require('./controllers/instructorSetFormShareFeedbackController');
const instructorEditFormController = require('./controllers/instructorEditFormController');
const instructorGetIndividualGradeController = require('./controllers/instructorGetIndividualGradeController');
const instructorGetOverallGradeController = require('./controllers/instructorGetOverallGradeController');
const checkIfTheresAnyFormRecordsController = require('./controllers/checkIfTheresAnyFormRecordsController');
const addGroupsToCourseController = require('./controllers/addGroupToCourseController');
const instructorEditGradeController = require('./controllers/instructorEditGradeController');
const instructorRemoveFormController = require('./controllers/instructorRemoveFormController.js');
const getStudentProfileController = require('./controllers/getStudentProfileController');
const instructorCreateAssignmentController = require('./controllers/instructorCreateAssignmentController');
const instructorCreateRubricController = require('./controllers/instructorCreateRubricController');
const instructorCreateAssignmentAndRubricController = require('./controllers/instructorCreateAssignmentAndRubricController');
const instructorGetRubricController = require('./controllers/instructorGetRubricController');
const instructorGetAssignmentListController = require('./controllers/instructorGetAssignmentListController');
const instructorSetAssignmentVisibilityController = require('./controllers/instructorSetAssignmentVisibilityController');
const instructorSetAssignmentShareFeedbackController = require('./controllers/instructorSetAssignmentShareFeedbackController');
const instructorGetSubmissionLinkController = require('./controllers/instructorGetSubmissionLinkController');
const instructorGetAssignmentCompletionStatusController = require('./controllers/instructorGetAssignmentCompletionStatusController');
const instructorViewAssignmentAssessmentController = require('./controllers/instructorViewAssignmentAssessmentController');
const instructorRemoveAssignmentController = require('./controllers/instructorRemoveAssignmentController');
const instructorGetAssignmentController = require('./controllers/instructorGetAssignmentController');
const instructorGetAssessmentIndividualGradeController = require('./controllers/instructorGetAssessmentIndividualGradeController');
const instructorGetAssessmentOverallGradeController = require('./controllers/instructorGetAssessmentOverallGradeController');
const instructorGetAssessmentGroupEvaluatorsController = require('./controllers/instructorGetAssessmentGroupEvaluatorsController');
const editAssignmentController = require('./controllers/editAssignmentController');
const editRubricController = require('./controllers/editRubricController');
const instructorEditAssignmentGradeController = require('./controllers/instructorEditAssignmentGradeController');
const checkIfTheresAnyAssessmentRecordController = require('./controllers/checkIfTheresAnyAssessmentRecordController');
// Allow express to parse JSON
app.use(express.json());

const corsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'], // Add 'Authorization' to the allowed headers
};

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

app.use(cors(corsOptions));

// All the routes below , will not require an Auth token.
app.use('/registerinstructor', registerInstructorController);

app.use(authenticateToken); // Apply authentication to all routes.
// All the routes below will require an auth token.

// Routes , and the controllers we map them to.
app.use('/authenticateinstructor', authenticateInstructorController);
app.use('/getcourselist', getCourseListController);
app.use('/addstudenttocourse', addStudentToCourseController);
app.use('/addstudenttocoursepreview', addStudentToCoursePreviewController);
app.use('/getgroupstudents', getGroupStudentsController);
app.use('/getcoursegroups', getCourseGroupsController);
app.use('/getformlist', getFormListController);
app.use('/getassignmentlist', getAssignmentListController);
app.use('/instructorupdateprofile', instructorUpdateProfileController);
app.use('/instructorupdatepassword', instructorUpdatePasswordController);
app.use('/getinstructorprofile', getInstructorProfileController);
app.use('/instructorcreatecourse', instructorCreateCourseController);
app.use('/addstudenttogroup', addStudentToGroupController);
app.use('/instructorcreategroup', instructorCreateGroupController);
app.use(
	'/instructorsetcoursevisibiliy',
	instructorSetCourseVisibiliyController
);
app.use('/getcoursestudentlist', getCourseStudentListController);
app.use('/removestudentfromgroup', removeStudentFromGroupController);
app.use('/getassignmentnumber', getAssignmentNumberController);
app.use('/removeemptygroup', removeEmptyGroupController);
app.use('/addstudentandgrouptocourse', addStudentAndGroupToCourseController);
app.use(
	'/addstudentandgrouptocoursepreview',
	addStudentAndGroupToCoursePreviewController
);
app.use(
	'/removestudentsandgroupsfromcourse',
	removeStudentsAndGroupsFromCourseController
);
app.use('/instructorsetformvisibility', instructorSetFormVisibilityController);
app.use('/instructorcreateform', instructorCreateFormController);
app.use('/instructorgetform', instructorGetFormController);
app.use('/viewevaluationfeedback', instructorGetFormAnswersController);
app.use(
	'/instructorsetformsharefeedback',
	instructorSetFormShareFeedbackController
);
app.use('/instructoreditform', instructorEditFormController);
app.use(
	'/instructorgetindividualgrade',
	instructorGetIndividualGradeController
);
app.use('/instructorgetoverallgrade', instructorGetOverallGradeController);
app.use('/checkiftheresanyformrecords', checkIfTheresAnyFormRecordsController);
app.use('/addgrouptocourse', addGroupsToCourseController);
app.use('/instructoreditgrade', instructorEditGradeController);
app.use('/instructorremoveform', instructorRemoveFormController);
app.use('/getstudentprofile', getStudentProfileController);
app.use('/createassignment', instructorCreateAssignmentController);
app.use('/createrubric', instructorCreateRubricController);
app.use(
	'/createassignmentandrubric',
	instructorCreateAssignmentAndRubricController
);
app.use('/getrubric', instructorGetRubricController);
app.use('/instructorgetassignmentlist', instructorGetAssignmentListController);
app.use(
	'/setassignmentvisibility',
	instructorSetAssignmentVisibilityController
);
app.use(
	'/setassignmentsharefeedback',
	instructorSetAssignmentShareFeedbackController
);
app.use('/getsubmissionlink', instructorGetSubmissionLinkController);
app.use(
	'/getassignmentcompletionstatus',
	instructorGetAssignmentCompletionStatusController
);
app.use(
	'/viewassignmentassessment',
	instructorViewAssignmentAssessmentController
);
app.use('/removeassignment', instructorRemoveAssignmentController);
app.use('/getassignment', instructorGetAssignmentController);
app.use(
	'/getassessmentindividualgrade',
	instructorGetAssessmentIndividualGradeController
);
app.use(
	'/getassessmentoverallgrade',
	instructorGetAssessmentOverallGradeController
);
app.use(
	'/getassessmentgroupevaluators',
	instructorGetAssessmentGroupEvaluatorsController
);
app.use('/editassignment', editAssignmentController);
app.use('/editrubric', editRubricController);
app.use('/editassignmentgrade', instructorEditAssignmentGradeController);
app.use(
	'/checkiftheresanyassessmentrecord',
	checkIfTheresAnyAssessmentRecordController
);
// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack); // Log error stack trace to console
	res.status(500).send('Something broke!'); // Send error response to client
});

// Create HTTPS Server
http.createServer(app).listen(port, () => {
	console.log('HTTP server is running on http://localhost:' + port);
});

module.exports = { app };

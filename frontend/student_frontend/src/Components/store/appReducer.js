// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

const initialState = {
	user: null,
	studentId: null,
	courseId: null,
	courseName: null,
	courseCode: null,
	courseSemester: null,
	courseYear: null,
	courseTerm: null,
	groupId: null,
	groupName: null,
	formId: null,
	formName: null,
	evaluatorId: null,
	evaluateeId: null,
	assignmentId: null,
	assignmentName: null,
	assignmentEvaluatorId: null,
	assignmentEvaluateeId: null,
	forgotPasswordTemporaryToken: null,
};

const UPDATE_USER = 'UPDATE_USER';
const UPDATE_STUDENTID = 'UPDATE_STUDENTID';
const UPDATE_COURSEID = 'UPDATE_COURSEID';
const UPDATE_COURSENAME = 'UPDATE_COURSENAME';
const UPDATE_COURSECODE = 'UPDATE_COURSECODE';
const UPDATE_COURSESEMESTER = 'UPDATE_COURSESEMESTER';
const UPDATE_COURSEYEAR = 'UPDATE_COURSEYEAR';
const UPDATE_COURSETERM = 'UPDATE_COURSETERM';
const UPDATE_GROUPID = 'UPDATE_GROUPID';
const UPDATE_GROUPNAME = 'UPDATE_GROUPNAME';
const UPDATE_FORMID = 'UPDATE_FORMID';
const UPDATE_FORMNAME = 'UPDATE_FORMNAME';
const UPDATE_EVALUATORID = 'UPDATE_EVALUATORID';
const UPDATE_EVALUATEEID = 'UPDATE_EVALUATEEID';
const UPDATE_ASSIGNMENTID = 'UPDATE_ASSIGNMENTID';
const UPDATE_ASSIGNMENTNAME = 'UPDATE_ASSIGNMENTNAME';
const UPDATE_ASSIGNMENTEVALUATORID = 'UPDATE_ASSIGNMENTEVALUATORID';
const UPDATE_ASSIGNMENTEVALUATEEID = 'UPDATE_ASSIGNMENTEVALUATEEID';
const UPDATE_FORGOTPASSWORDTEMPORARYTOKEN =
	'UPDATE_FORGOTPASSWORDTEMPORARYTOKEN';

export const updateStudentId = (studentId) => ({
	type: UPDATE_STUDENTID,
	payload: studentId,
});

export const updateCourseId = (courseId) => ({
	type: UPDATE_COURSEID,
	payload: courseId,
});

export const updateCourseName = (courseName) => ({
	type: UPDATE_COURSENAME,
	payload: courseName,
});

export const updateCourseCode = (courseCode) => ({
	type: UPDATE_COURSECODE,
	payload: courseCode,
});

export const updateCourseSemester = (courseSemester) => ({
	type: UPDATE_COURSESEMESTER,
	payload: courseSemester,
});

export const updateCourseYear = (courseYear) => ({
	type: UPDATE_COURSEYEAR,
	payload: courseYear,
});

export const updateCourseTerm = (courseTerm) => ({
	type: UPDATE_COURSETERM,
	payload: courseTerm,
});

export const updateGroupId = (groupId) => ({
	type: UPDATE_GROUPID,
	payload: groupId,
});

export const updateGroupName = (groupName) => ({
	type: UPDATE_GROUPNAME,
	payload: groupName,
});

export const updateUser = (user) => ({
	type: UPDATE_USER,
	payload: user,
});

export const updateFormId = (formId) => ({
	type: UPDATE_FORMID,
	payload: formId,
});

export const updateFormName = (formName) => ({
	type: UPDATE_FORMNAME,
	payload: formName,
});

export const updateEvaluatorId = (evaluatorId) => ({
	type: UPDATE_EVALUATORID,
	payload: evaluatorId,
});

export const updateEvaluateeId = (evaluateeId) => ({
	type: UPDATE_EVALUATEEID,
	payload: evaluateeId,
});

export const updateAssignmentId = (assignmentId) => ({
	type: UPDATE_ASSIGNMENTID,
	payload: assignmentId,
});

export const updateAssignmentName = (assignmentName) => ({
	type: UPDATE_ASSIGNMENTNAME,
	payload: assignmentName,
});

export const updateAssignmentEvaluatorId = (assignmentEvaluatorId) => ({
	type: UPDATE_ASSIGNMENTEVALUATORID,
	payload: assignmentEvaluatorId,
});

export const updateAssignmentEvaluateeId = (assignmentEvaluateeId) => ({
	type: UPDATE_ASSIGNMENTEVALUATEEID,
	payload: assignmentEvaluateeId,
});

export const updateForgotPasswordTemporaryToken = (
	forgotPasswordTemporaryToken
) => ({
	type: UPDATE_FORGOTPASSWORDTEMPORARYTOKEN,
	payload: forgotPasswordTemporaryToken,
});

const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_USER':
			return { ...state, user: action.payload };
		case 'UPDATE_STUDENTID':
			return { ...state, studentId: action.payload };
		case 'UPDATE_COURSEID':
			return { ...state, courseId: action.payload };
		case 'UPDATE_COURSENAME':
			return { ...state, courseName: action.payload };
		case 'UPDATE_COURSECODE':
			return { ...state, courseCode: action.payload };
		case 'UPDATE_COURSESEMESTER':
			return { ...state, courseSemester: action.payload };
		case 'UPDATE_COURSEYEAR':
			return { ...state, user: action.payload };
		case 'UPDATE_COURSETERM':
			return { ...state, courseTerm: action.payload };
		case 'UPDATE_GROUPID':
			return { ...state, groupId: action.payload };
		case 'UPDATE_GROUPNAME':
			return { ...state, groupName: action.payload };
		case 'UPDATE_FORMID':
			return { ...state, formId: action.payload };
		case 'UPDATE_FORMNAME':
			return { ...state, formName: action.payload };
		case 'UPDATE_EVALUATORID':
			return { ...state, evaluatorId: action.payload };
		case 'UPDATE_EVALUATEEID':
			return { ...state, evaluateeId: action.payload };
		case 'UPDATE_ASSIGNMENTID':
			return { ...state, assignmentId: action.payload };
		case 'UPDATE_ASSIGNMENTNAME':
			return { ...state, assignmentName: action.payload };
		case 'UPDATE_ASSIGNMENTEVALUATORID':
			return { ...state, assignmentEvaluatorId: action.payload };
		case 'UPDATE_ASSIGNMENTEVALUATEEID':
			return { ...state, assignmentEvaluateeId: action.payload };
		case 'UPDATE_FORGOTPASSWORDTEMPORARYTOKEN':
			return { ...state, forgotPasswordTemporaryToken: action.payload };

		default:
			return state;
	}
};

export default appReducer;

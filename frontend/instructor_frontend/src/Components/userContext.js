// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { createContext, useContext } from 'react';

import { useSelector, useDispatch } from 'react-redux';

const UserContext = createContext();

export function UseUserContext() {
	return useContext(UserContext);
}

export function UserProvider({ children }) {
	const dispatch = useDispatch();
	const {
		user,
		instructorId,
		instructorAccess,
		courseId,
		courseName,
		courseCode,
		courseSemester,
		courseYear,
		courseTerm,
		courseVisibility,
		groupId,
		groupName,
		formId,
		evaluatorId,
		evaluateeId,
		evaluationFormName,
		assignmentId,
		assignmentName,
		assignmentEvaluateeId,
		assignmentEvaluatorId,
		forgotPasswordTemporaryToken,
	} = useSelector((state) => state);

	const updateUser = (user) => {
		dispatch({ type: 'UPDATE_USER', payload: user });
	};
	const updateInstructorId = (instructorId) => {
		dispatch({ type: 'UPDATE_INSTRUCTORID', payload: instructorId });
	};
	const updateInstructorAccess = (instructorAccess) => {
		dispatch({
			type: 'UPDATE_INSTRUCTORACCESS',
			payload: instructorAccess,
		});
	};

	const updateCourseId = (courseId) => {
		dispatch({ type: 'UPDATE_COURSEID', payload: courseId });
	};

	const updateCourseName = (courseName) => {
		dispatch({ type: 'UPDATE_COURSENAME', payload: courseName });
	};

	const updateCourseCode = (courseCode) => {
		dispatch({ type: 'UPDATE_COURSECODE', payload: courseCode });
	};

	const updateCourseSemester = (courseSemester) => {
		dispatch({ type: 'UPDATE_COURSESEMESTER', payload: courseSemester });
	};

	const updateCourseYear = (courseYear) => {
		dispatch({ type: 'UPDATE_COURSEYEAR', payload: courseYear });
	};

	const updateCourseTerm = (courseTerm) => {
		dispatch({ type: 'UPDATE_COURSETERM', payload: courseTerm });
	};

	const updateCourseVisibility = (courseVisibility) => {
		dispatch({
			type: 'UPDATE_COURSEVISIBILITY',
			payload: courseVisibility,
		});
	};

	const updateGroupId = (groupId) => {
		dispatch({ type: 'UPDATE_GROUPID', payload: groupId });
	};

	const updateGroupName = (groupName) => {
		dispatch({ type: 'UPDATE_GROUPNAME', payload: groupName });
	};
	const updateFormId = (formId) => {
		dispatch({ type: 'UPDATE_FORMID', payload: formId });
	};

	const updateEvaluatorId = (evaluatorId) => {
		dispatch({ type: 'UPDATE_EVALUATORID', payload: evaluatorId });
	};

	const updateEvaluateeId = (evaluateeId) => {
		dispatch({ type: 'UPDATE_EVALUATEEID', payload: evaluateeId });
	};
	const updateEvaluationFormName = (evaluationFormName) => {
		dispatch({
			type: 'UPDATE_EVALUATIONFORMNAME',
			payload: evaluationFormName,
		});
	};
	const updateAssignmentId = (assignmentId) => {
		dispatch({ type: 'UPDATE_ASSIGNMENTID', payload: assignmentId });
	};
	const updateAssignmentName = (assignmentName) => {
		dispatch({ type: 'UPDATE_ASSIGNMENTNAME', payload: assignmentName });
	};
	const updateAssignmentEvaluateeId = (assignmentEvaluateeId) => {
		dispatch({
			type: 'UPDATE_ASSIGNMENTEVALUATEEID',
			payload: assignmentEvaluateeId,
		});
	};
	const updateAssignmentEvaluatorId = (assignmentEvaluatorId) => {
		dispatch({
			type: 'UPDATE_ASSIGNMENTEVALUATORID',
			payload: assignmentEvaluatorId,
		});
	};
	const updateForgotPasswordTemporaryToken = (
		forgotPasswordTemporaryToken
	) => {
		dispatch({
			type: 'UPDATE_FORGOTPASSWORDTEMPORARYTOKEN',
			payload: forgotPasswordTemporaryToken,
		});
	};

	return (
		<UserContext.Provider
			value={{
				user,
				updateUser,
				instructorId,
				updateInstructorId,
				instructorAccess,
				updateInstructorAccess,
				courseId,
				updateCourseId,
				courseName,
				updateCourseName,
				courseCode,
				updateCourseCode,
				courseSemester,
				updateCourseSemester,
				courseYear,
				updateCourseYear,
				courseTerm,
				updateCourseTerm,
				courseVisibility,
				updateCourseVisibility,
				groupId,
				updateGroupId,
				groupName,
				updateGroupName,
				formId,
				updateFormId,
				updateEvaluatorId,
				evaluatorId,
				updateEvaluateeId,
				evaluateeId,
				evaluationFormName,
				updateEvaluationFormName,
				assignmentId,
				updateAssignmentId,
				assignmentName,
				updateAssignmentName,
				assignmentEvaluateeId,
				updateAssignmentEvaluateeId,
				assignmentEvaluatorId,
				updateAssignmentEvaluatorId,
				forgotPasswordTemporaryToken,
				updateForgotPasswordTemporaryToken,
			}}>
			{children}
		</UserContext.Provider>
	);
}

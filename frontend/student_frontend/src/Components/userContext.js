// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

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
		studentId,
		courseId,
		courseName,
		courseCode,
		courseSemester,
		courseYear,
		courseTerm,
		groupId,
		groupName,
		formId,
		formName,
		evaluatorId,
		evaluateeId,
		assignmentId,
		assignmentName,
		assignmentEvaluatorId,
		assignmentEvaluateeId,
		forgotPasswordTemporaryToken,
	} = useSelector((state) => state);

	const updateUser = (user) => {
		dispatch({ type: 'UPDATE_USER', payload: user });
	};
	const updateStudentId = (studentId) => {
		dispatch({ type: 'UPDATE_STUDENTID', payload: studentId });
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

	const updateGroupId = (groupId) => {
		dispatch({ type: 'UPDATE_GROUPID', payload: groupId });
	};

	const updateGroupName = (groupName) => {
		dispatch({ type: 'UPDATE_GROUPNAME', payload: groupName });
	};

	const updateFormId = (formId) => {
		dispatch({ type: 'UPDATE_FORMID', payload: formId });
	};

	const updateFormName = (formName) => {
		dispatch({ type: 'UPDATE_FORMNAME', payload: formName });
	};

	const updateEvaluatorId = (evaluatorId) => {
		dispatch({ type: 'UPDATE_EVALUATORID', payload: evaluatorId });
	};

	const updateEvaluateeId = (evaluateeId) => {
		dispatch({ type: 'UPDATE_EVALUATEEID', payload: evaluateeId });
	};

	const updateAssignmentId = (assignmentId) => {
		dispatch({ type: 'UPDATE_ASSIGNMENTID', payload: assignmentId });
	};

	const updateAssignmentName = (assignmentName) => {
		dispatch({ type: 'UPDATE_ASSIGNMENTNAME', payload: assignmentName });
	};

	const updateAssignmentEvaluatorId = (assignmentEvaluatorId) => {
		dispatch({
			type: 'UPDATE_ASSIGNMENTEVALUATORID',
			payload: assignmentEvaluatorId,
		});
	};

	const updateAssignmentEvaluateeId = (assignmentEvaluateeId) => {
		dispatch({
			type: 'UPDATE_ASSIGNMENTEVALUATEEID',
			payload: assignmentEvaluateeId,
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
				studentId,
				updateStudentId,
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
				groupId,
				updateGroupId,
				groupName,
				updateGroupName,
				formId,
				updateFormId,
				formName,
				updateFormName,
				evaluatorId,
				updateEvaluatorId,
				evaluateeId,
				updateEvaluateeId,
				assignmentId,
				updateAssignmentId,
				assignmentName,
				updateAssignmentName,
				assignmentEvaluatorId,
				updateAssignmentEvaluatorId,
				assignmentEvaluateeId,
				updateAssignmentEvaluateeId,
				forgotPasswordTemporaryToken,
				updateForgotPasswordTemporaryToken,
			}}>
			{children}
		</UserContext.Provider>
	);
}

import React from 'react';
import Home from './Components/Home.js';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './Components/login-signup/signUp.js';
import Login from './Components/login-signup/login.js';
import { Dashboard } from './Components/dashboard/dashboard.js';
import { CoursePage } from './Components/course-page/coursepage.js';
import { StudentListPage } from './Components/studentTable/studentListPage.js';
import { UserProvider } from './Components/userContext.js';
import { GroupListPage } from './Components/groupTable/groupListPage.js';
import { GroupEvaluationsListPage } from './Components/groupEvaluation/groupEvaluationListPage.js';
import { GroupMembersList } from './Components/groupEvaluationMembers/groupMembersList.js';
import { SubmitGroupEvaluation } from './Components/submitGroupEvaluation/submitGroupEvaluation.js';
import { GroupEvaluationFeedbackAndGradesPage } from './Components/groupEvaluation/groupEvaluationFeedbackAndGradesPage.js';
import { AssignmentPage } from './Components/assignments/assignmentPage.js';
import { AssignmentSubmissionPage } from './Components/assignments/assignmentSubmissionPage.js';
import { AssignmentAssessmentSubmissionPage } from './Components/assignments/assignmentAssessmentSubmissionPage.js';
import { AssignmentAssessmentGradeAndFeedbackPage } from './Components/assignments/assignmentAssessmentGradeAndFeedbackPage.js';
import StudentProfile from './Components/student-profile/studentProfile.js';
import ForgotPassword from './Components/login-signup/forgotPassword.js';
import ResetPassword from './Components/login-signup/resetPassword.js';
import ProtectedRoute from './Components/utils/auth.js';

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<UserProvider>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
						<Route
							path="/forgotpassword"
							element={<ForgotPassword />}
						/>
						<Route
							path="/resetpassword"
							element={<ResetPassword />}
						/>

						<Route element={<ProtectedRoute />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route
								path="/coursepage"
								element={<CoursePage />}
							/>
							<Route
								path="/studentListPage"
								element={<StudentListPage />}
							/>
							<Route
								path="/studentprofile"
								element={<StudentProfile />}
							/>
							<Route
								path="/grouplistpage"
								element={<GroupListPage />}
							/>
							<Route
								path="/evaluationlistpage"
								element={<GroupEvaluationsListPage />}
							/>
							<Route
								path="/groupmemberslist"
								element={<GroupMembersList />}
							/>
							<Route
								path="/submitevaluationpage"
								element={<SubmitGroupEvaluation />}
							/>
							<Route
								path="/groupevaluationfeedbackandgradespage"
								element={
									<GroupEvaluationFeedbackAndGradesPage />
								}
							/>
							<Route
								path="/assignmentlistpage"
								element={<AssignmentPage />}
							/>
							<Route
								path="/assignmentsubmissionpage"
								element={<AssignmentSubmissionPage />}
							/>
							<Route
								path="/assignmentassessmentpage"
								element={<AssignmentAssessmentSubmissionPage />}
							/>
							<Route
								path="/assignmentassessmentfeedbackpage"
								element={
									<AssignmentAssessmentGradeAndFeedbackPage />
								}
							/>
							<Route path="/logout" element={<Login />} />
						</Route>

						<Route path="*" element={<Home />} />
					</Routes>
				</UserProvider>
			</BrowserRouter>
		</div>
	);
};

export default App;

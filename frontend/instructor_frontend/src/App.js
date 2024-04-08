import React from 'react';
import Home from './Components/Home.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateCourse from './Components/CreateCourse/Createcourse.js';
import { Signup } from './Components/login-signup/signup.js';
import Login from './Components/login-signup/login.js';
import { Dashboard } from './Components/dashboard/dashboard.js';
import CourseSetting from './Components/CourseSetting/CourseSetting.js';
import { CoursePage } from './Components/course-page/coursepage.js';
import { StudentListPage } from './Components/course-page/studentListPage.js';
import { GroupListPage } from './Components/course-page/groupListPage.js';
import { AssignmentListPage } from './Components/course-page/assignmentListPage.js';
import { AssignmentSubmissionsAndAssessmentsListPage } from './Components/course-page/assignmentSubmissionsAndAssessmentsListPage.js';
import { GroupMembersPage } from './Components/course-page/groupMembersPage.js';
import { AddStudentPage } from './Components/course-page/addStudentPage.js';
import { AddGroupsPage } from './Components/course-page/addGroupsPage.js';
import { AddStudentToGroup } from './Components/course-page/addStudentToGroupPage.js';
import { InstructorProfile } from './Components/InstructorProfile/instructorProfile.js';
import { EvaluationForm } from './Components/CreateEvaluationForm/createEvaluationForm.jsx';
import { EvaluationListPage } from './Components/course-page/evaluationListPage.js';
import { EvaluationOverview } from './Components/course-page/evaluationOverviewPage.js';
import { EditEvaluationForm } from './Components/CreateEvaluationForm/editEvaluationForm.jsx';
import { UserProvider } from './Components/userContext.js';
import { ViewEvaluationFeedback } from './Components/viewFeedback/viewEvaluationFeedback.js';
import { ViewAndEditGrade } from './Components/viewAndEditGrade/viewAndEditGrade.js';
import CreateAssignment from './Components/createAssignment/createAssignment.js';
import { ViewAssignmentAssessmentFeedback } from './Components/course-page/viewAssignmentAssessmentFeedback.js';
import { ViewAndEditFinalAssessmentGrade } from './Components/course-page/viewAndEditFinalAssessmentGrade.js';
import ForgotPassword from './Components/login-signup/forgotPassword.js';
import ResetPassword from './Components/login-signup/resetPassword.js';
import ProtectedRoute from './utils/auth.js';

const App = () => {
	return (
		<BrowserRouter>
			<UserProvider>
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/forgotpassword"
						element={<ForgotPassword />}
					/>
					<Route path="/resetpassword" element={<ResetPassword />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/coursepage" element={<CoursePage />} />
						<Route
							path="/instructorprofile"
							element={<InstructorProfile />}
						/>
						<Route
							path="/studentListPage"
							element={<StudentListPage />}
						/>
						<Route
							path="/grouplistpage"
							element={<GroupListPage />}
						/>
						<Route
							path="/groupmemberspage"
							element={<GroupMembersPage />}
						/>
						<Route
							path="/addstudenttogroup"
							element={<AddStudentToGroup />}
						/>

						<Route
							path="/addstudentpage"
							element={<AddStudentPage />}
						/>

						<Route
							path="/addgroupspage"
							element={<AddGroupsPage />}
						/>
						<Route
							path="/CreateCourse"
							element={<CreateCourse />}
						/>
						<Route
							path="/coursesetting"
							element={<CourseSetting />}
						/>
						<Route
							path="/evaluationlistpage"
							element={<EvaluationListPage />}
						/>
						<Route
							path="/evaluationform"
							element={<EvaluationForm />}
						/>
						<Route
							path="/groupevaluationsoverviewpage"
							element={<EvaluationOverview />}
						/>
						<Route
							path="/editevaluationform"
							element={<EditEvaluationForm />}
						/>
						<Route
							path="/viewevaluationfeedback"
							element={<ViewEvaluationFeedback />}
						/>
						<Route
							path="/viewandeditgrade"
							element={<ViewAndEditGrade />}
						/>
						<Route
							path="/createassignment"
							element={<CreateAssignment />}
						/>
						<Route
							path="/assignmentlistpage"
							element={<AssignmentListPage />}
						/>
						<Route
							path="/assignmentdetails"
							element={
								<AssignmentSubmissionsAndAssessmentsListPage />
							}
						/>
						<Route
							path="/viewassessmentfeedback"
							element={<ViewAssignmentAssessmentFeedback />}
						/>
						<Route
							path="/viewandeditfinalassessmentgrade"
							element={<ViewAndEditFinalAssessmentGrade />}
						/>
						<Route path="/logout" element={<Login />} />
					</Route>
					<Route path="*" element={<Home />}></Route>
				</Routes>
			</UserProvider>
		</BrowserRouter>
	);
};

export default App;

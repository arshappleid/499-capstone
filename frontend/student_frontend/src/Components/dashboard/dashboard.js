// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import CourseCard from './coursecard';
import { Button, Space, Layout, Breadcrumb, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {
	updateCourseId,
	updateCourseName,
	updateCourseCode,
	updateCourseSemester,
	updateCourseYear,
	updateCourseTerm,
} from '../store/appReducer';
import { useNavigate } from 'react-router-dom';

const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function Dashboard() {
	const [loading, isLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [studentFirstName, setStudentName] = useState(null);
	const [studentLastName, setStudentLastName] = useState(null);

	const studentId = useSelector((state) => state.studentId);

	const [networkErrorModalVisible, setNetworkErrorModalVisible] =
		useState(false);
	const [networkErrorMessage, setNetworkErrorMessage] = useState('');
	const handleNetworkErrorModalClose = () => {
		setNetworkErrorModalVisible(false);
		setNetworkErrorMessage('');
	};
	const NetworkErrorModal = () => {
		return (
			<Modal
				open={networkErrorModalVisible}
				onCancel={handleNetworkErrorModalClose}
				title="Network Error"
				footer={[
					<Button key="close" onClick={handleNetworkErrorModalClose}>
						Close
					</Button>,
				]}>
				<p>{networkErrorMessage}</p>
			</Modal>
		);
	};

	useEffect(() => {
		const fetchStudentProfile = async () => {
			try {
				isLoading(true);
				const requestData = {
					studentID: studentId,
				};
				const headers = {
					'Content-type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'student/getstudentprofile',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;
				if (status === 'success') {
					const student_first_name =
						response.data.data.student_first_name;
					const student_last_name =
						response.data.data.student_last_name;
					setStudentName(student_first_name);
					setStudentLastName(student_last_name);
				} else {
					const student_first_name = '';
					const student_last_name = '';
					setStudentName(student_first_name);
					setStudentLastName(student_last_name);
				}
				isLoading(false);
			} catch (error) {
				isLoading(false);
				if (error.isAxiosError && error.response === undefined) {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				} else {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				}
			}
		};
		fetchStudentProfile();
	}, []);
	const [courses, setCourses] = useState(null);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				isLoading(true);

				const requestData = {
					student_id: studentId,
				};
				const headers = {
					'Content-type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'student/getcourselist',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;

				if (status === 'success') {
					const allcourses = response.data.data.map((course) => {
						return {
							CourseName: course.course_name,
							CourseCode: course.course_code,
							CourseSemester: course.course_semester,
							CourseYear: course.course_year,
							CourseTerm: course.course_term,
							CourseId: course.courseID,
						};
					});
					setCourses(allcourses);
				} else {
					setCourses([]);
				}
				isLoading(false);
			} catch (error) {
				isLoading(false);
				if (error.isAxiosError && error.response === undefined) {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				} else {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				}
			}
		};
		fetchCourses();
	}, []);

	const onCourseClickHandler = (
		courseID,
		courseName,
		courseCode,
		CourseSemester,
		CourseYear,
		CourseTerm
	) => {
		dispatch(updateCourseId(courseID));
		dispatch(updateCourseName(courseName));
		dispatch(updateCourseCode(courseCode));
		dispatch(updateCourseSemester(CourseSemester));
		dispatch(updateCourseYear(CourseYear));
		dispatch(updateCourseTerm(CourseTerm));
		navigate('/coursepage');
	};
	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow bg-white">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex justify-between p-2 items-center bg-[#DDEEFF] overflow-auto">
						<h1 className="ml-8 text-2xl text-ellipsis">
							Welcome to the Student Dashboard, {studentFirstName}
							!
						</h1>
					</div>
				</div>
				<Breadcrumb
					className="ml-10 mt-4 text-lg font-futura"
					items={[
						{
							title: <a href="/dashboard">Dashboard</a>,
						},
					]}
				/>
				<Space className="flex justify-center items-center">
					<h1 className="w-full font-futura font-semibold text-2xl text-center my-10">
						Courses
					</h1>
				</Space>
				{loading && (
					<h3 className="w-full font-futura text-2xl text-center">
						<span className="font-futura flex items-center justify-center">
							<LoadingOutlined spin className="mr-4" /> Loading
							Courses...
						</span>
					</h3>
				)}
				{!loading && !courses?.length && (
					<h3 className="w-full font-futura text-3xl text-center">
						You currently don't have any courses that you are
						enrolled in.
					</h3>
				)}
				<Space>
					<div className="flex-col items-center mt-10 mb-20 mx-10">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
							{courses?.map((cur) => (
								<div
									className="mb-8 md:shrink-0"
									onClick={(e) => {
										e.preventDefault();
										onCourseClickHandler(
											cur.CourseId,
											cur.CourseName,
											cur.CourseCode,
											cur.CourseSemester,
											cur.CourseYear,
											cur.CourseTerm
										);
									}}>
									<CourseCard course={cur} />
								</div>
							))}
						</div>
					</div>
				</Space>
				<NetworkErrorModal />
				<div className="flex-grow" />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

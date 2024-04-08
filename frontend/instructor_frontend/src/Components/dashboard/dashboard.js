//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import CourseCard from './coursecard';
import { Button, Space, Layout, Breadcrumb, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
	updateCourseId,
	updateCourseName,
	updateCourseCode,
	updateCourseSemester,
	updateCourseYear,
	updateCourseTerm,
	updateCourseVisibility,
	updateInstructorAccess,
} from '../store/appReducer';
const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function Dashboard() {
	const [loading, isLoading] = useState(true);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [instFirstName, setInstructorName] = useState(null);
	const [instLastName, setInstructorLastName] = useState(null);
	const instructorId = useSelector((state) => state.instructorId);
	const instructorAccess = useSelector((state) => state.instructorAccess);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

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

	const checkInstructorAccess = () => {
		if (instructorAccess) {
			navigate('/CreateCourse');
		} else {
			setModalTitle('Access Denied');
			setModalContent(
				'You need instructor access to create a course. Contact the Admin to get Instructor access.'
			);
			setIsModalVisible(true);
			setTimeout(() => {
				setIsModalVisible(false);
			}, 2500);
		}
	};

	useEffect(() => {
		const fetchInstructorProfile = async () => {
			try {
				isLoading(true);
				const requestData = {
					instructor_id: instructorId,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/getinstructorprofile',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;
				if (status === 'success') {
					const instructor_first_name =
						response.data.data[0].FIRST_NAME;
					const instructor_last_name =
						response.data.data[0].LAST_NAME;
					const instructor_access =
						response.data.data[0].INSTRUCTOR_ACCESS;
					dispatch(updateInstructorAccess(instructor_access));
					setInstructorName(instructor_first_name);
					setInstructorLastName(instructor_last_name);
				} else {
					const instructor_first_name = '';
					const instructor_last_name = '';
					const instructor_access = '';
					dispatch(updateInstructorAccess(instructor_access));
					setInstructorName(instructor_first_name);
					setInstructorLastName(instructor_last_name);
				}
				isLoading(false);
			} catch (error) {
				if (error.isAxiosError && error.response === undefined) {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				} else {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				}
			}
		};
		fetchInstructorProfile();
	}, []);

	const [courses, setCourses] = useState(null);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				isLoading(true);
				const requestData = {
					instructor_id: instructorId,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/getcourselist',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;
				if (status === 'success') {
					const allcourses = response.data.data.map((course) => {
						return {
							CourseName: course.COURSE_NAME,
							CourseCode: course.COURSE_CODE,
							CourseSemester: course.COURSE_SEMESTER,
							CourseYear: course.COURSE_YEAR,
							CourseTerm: course.COURSE_TERM,
							CourseId: course.COURSE_ID,
							CourseVisibility: course.COURSE_VISIBILITY,
						};
					});
					setCourses(allcourses);
				} else {
					setCourses([]);
				}
				isLoading(false);
			} catch (error) {
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
		CourseTerm,
		CourseVisibility
	) => {
		if (instructorAccess) {
			dispatch(updateCourseId(courseID));
			dispatch(updateCourseName(courseName));
			dispatch(updateCourseCode(courseCode));
			dispatch(updateCourseSemester(CourseSemester));
			dispatch(updateCourseYear(CourseYear));
			dispatch(updateCourseTerm(CourseTerm));
			dispatch(updateCourseVisibility(CourseVisibility));
			navigate('/coursepage');
		} else {
			setModalTitle('Access Denied');
			setModalContent(
				'You do not have access to this course. Contact the Admin to get Instructor access.'
			);
			setIsModalVisible(true);
			setTimeout(() => {
				setIsModalVisible(false);
			}, 2500);
		}
	};

	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow bg-white pb-10">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex justify-between p-2 items-center bg-[#DDEEFF] overflow-auto">
						<h1 className="ml-8 text-2xl text-ellipsis">
							Welcome to the Instructor Dashboard, {instFirstName}
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
				{instructorAccess ? (
					<>
						<Space className="flex justify-center items-center">
							<h1 className="w-full font-futura font-semibold text-2xl text-center my-10">
								Courses
							</h1>
						</Space>
						<Space className="flex justify-end mx-10">
							<div>
								<Button
									type="default"
									onClick={() => {
										checkInstructorAccess();
									}}
									className="rounded-lg h-auto ml-12 font-futura text-white bg-green-500 hover:bg-green-400 drop-shadow-xl shadow-slate-500">
									<span className="text-base text-white font-futura">
										{' '}
										Create Course
									</span>
								</Button>
							</div>
						</Space>
						{loading && (
							<h3 className="w-full font-futura text-2xl text-center">
								<span className="font-futura flex items-center justify-center">
									<LoadingOutlined spin /> Loading Courses...
								</span>
							</h3>
						)}
						{!loading && !courses?.length && (
							<h3 className="w-full font-futura text-3xl text-center">
								You currently don't have any courses that you
								are teaching.
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
													cur.CourseTerm,
													cur.CourseVisibility
												);
											}}>
											<CourseCard course={cur} />
										</div>
									))}
								</div>
							</div>
						</Space>
					</>
				) : (
					<>
						<div className="w-full font-futura text-center justify-items-center items-center mt-20">
							<p className=" text-2xl">
								You currently do not have Instructor Access.
								<a
									className=" text-blue-500 underline"
									href="mailto:learnification.tech@gmail.com">
									Contact the Admin
								</a>{' '}
								to get Instructor access.
							</p>
							{/* <p className="text-xl mt-6">
								Email:{' '}
								<a
									className=" text-blue-500 underline"
									href="mailto:learnification.tech@gmail.com">
									learnification.tech@gmail.com
								</a>{' '}
								to get the Instructor Access.
							</p> */}
						</div>
					</>
				)}
				<Modal
					open={isModalVisible}
					title={
						<span className="text-center font-futura text-2xl">
							{modalTitle}
						</span>
					}
					className="text-center font-futura text-2xl"
					footer={null}
					onCancel={() => setIsModalVisible(false)}>
					<p className=" font-futura text-xl">{modalContent}</p>
				</Modal>
				<NetworkErrorModal />

				<div className="flex-grow" />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

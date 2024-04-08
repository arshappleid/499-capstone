// Author: Shila Rahman and Sehajvir Singh Pannu

import React, { useEffect, useState } from 'react';
import NavigationBar from '../navigationbar';
import {
	Switch,
	Modal,
	Button,
	Layout,
	Breadcrumb,
	ConfigProvider,
	Tooltip,
} from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import axios from 'axios';
import CourseSettingCard from './CourseSettingCard';
import AppFooter from '../appfooter';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateCourseVisibility } from '../store/appReducer';

const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
function CourseSetting() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');
	const dispatch = useDispatch();

	// Author : Sehajvir Singh Pannu (Redux)
	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	const courseName = useSelector((state) => state.courseName);
	const courseCode = useSelector((state) => state.courseCode);
	const courseSemester = useSelector((state) => state.courseSemester);
	const courseYear = useSelector((state) => state.courseYear);
	const courseTerm = useSelector((state) => state.courseTerm);
	const courseVisibility = useSelector((state) => state.courseVisibility);
	const [isVisible, setIsVisible] = useState();

	useEffect(
		() =>
			courseVisibility === true || courseVisibility === 'true'
				? setIsVisible(true)
				: setIsVisible(false),
		[courseVisibility]
	);

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

	const onCourseVisibility = async (checked) => {
		try {
			const requestData = {
				instructor_id: instructorId,
				course_id: courseId,
				course_visibility: checked,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorsetcoursevisibiliy',
				requestData,
				{ headers: headers }
			);
			const status = response['data']['status'];
			const message = response['data']['message'];

			if (status === 'success') {
				if (checked) {
					setModalTitle('Course Published!');
					setIsVisible(response['data']['data']['course_visibility']);
					setModalContent(
						'The course is now published to the Student Dashboard.'
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
					}, 2000);
				} else {
					setModalTitle('Course Unpublished!');
					setIsVisible(response['data']['data']['course_visibility']);
					setModalContent(
						'The course is unpublished from the Student Dashboard.'
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
					}, 2000);
				}
				dispatch(updateCourseVisibility(checked.toString()));
			} else {
				setModalTitle('Something Went Wrong!');
				setModalContent(message);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
				}, 2000);
			}
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
	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura">
				<div className="bg-[#F4F4F4] h-20">
					<div className="w-full h-full m-auto flex justify-left pl-8 items-center bg-[#DDEEFF]">
						<h1 className=" text-2xl text-ellipsis">
							{courseName}, {courseCode}, {courseSemester} -{' '}
							{courseYear}, {courseTerm}{' '}
						</h1>
					</div>
				</div>
				<div
					className={`flex w-full h-10 justify-center items-center ${
						isVisible ? 'bg-green-200' : 'bg-red-200'
					}`}
					data-testid="course-visibility">
					{isVisible ? (
						<span className="font-futura text-lg">
							The course is published to the student dashboard
						</span>
					) : (
						<span className="font-futura text-lg">
							The course is not published to the student dashboard
						</span>
					)}
				</div>

				<Breadcrumb
					className="pl-10 mt-4 text-lg font-futura "
					items={[
						{
							title: <a href="/dashboard">Dashboard</a>,
						},
						{
							title: (
								<a href="/coursepage">Course: {courseName}</a>
							),
						},
						{
							title: <p className="text-black">Course Tools</p>,
						},
					]}
				/>

				<div className="w-full m-auto flex justify-between p-2 mt-2 items-center">
					<h3 className="text-2xl ml-8">Course Tools</h3>
					<div className="flex gap-2 text-[#0F62FE] mr-8">
						<span className="font-futura text-lg flex items-center justify-center">
							Publish/Unpublish course{' '}
							<Tooltip
								className="mt-1"
								title={
									<span className="text-base font-futura">
										The toggle will publish/unpublish the
										course on the student dashboard
									</span>
								}>
								<InfoCircleOutlined className="text-sm ml-2 mr-4" />
							</Tooltip>
							<ConfigProvider
								theme={{
									token: {
										colorPrimary: '#2563EB',
									},
								}}>
								<StyleProvider hashPriority="high">
									<Switch
										data-testid="course-visibility-toggle"
										key={courseId}
										onChange={onCourseVisibility}
										checked={isVisible}
									/>
								</StyleProvider>
							</ConfigProvider>
						</span>
					</div>
				</div>

				<div className="w-full m-auto my-10 flex flex-col justify-center items-center">
					<div className="mb-20 grid  gap-8 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
						<Link className="hover:text-black" to="/addstudentpage">
							<CourseSettingCard
								type="Enroll Students"
								color="#F9998B"
								value="student"
							/>
						</Link>
						<Link className="hover:text-black" to="/addgroupspage">
							<CourseSettingCard
								type="Create Student Groups"
								color="#A3E9CF"
								value="studentGroup"
							/>
						</Link>
						<Link
							className="hover:text-black"
							to="/createassignment">
							<CourseSettingCard
								type="Create Assignments"
								color="#DDEEFF"
								value="assignmentForm"
							/>
						</Link>
						<Link className="hover:text-black" to="/evaluationform">
							<CourseSettingCard
								type="Create Evaluation Forms"
								color="#FFE3D6"
								value="evaluationForm"
							/>
						</Link>
					</div>
				</div>
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
				<div className="flex-grow" />
				<NetworkErrorModal />
			</Content>

			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

export default CourseSetting;

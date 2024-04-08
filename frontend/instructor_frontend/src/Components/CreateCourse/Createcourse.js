import React, { useState } from 'react';
import { Button, Form, Input, Layout, Breadcrumb, Modal, Tooltip } from 'antd';
import axios from 'axios';
import NavigationBar from '../navigationbar';
import { useNavigate } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
	updateCourseCode,
	updateCourseName,
	updateCourseSemester,
	updateCourseTerm,
	updateCourseYear,
} from '../store/appReducer';
import AppFooter from '../appfooter';
const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

function CreateCourse() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const instructorId = useSelector((state) => state.instructorId);
	const [formValues, setFormValues] = useState({});

	// Modal for displaying success/error messages
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

	const [isModalVisible2, setIsModalVisible2] = useState(false);
	const [modalContent2, setModalContent2] = useState('');
	const [modalTitle2, setModalTitle2] = useState('');

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

	const onFinish = async (values) => {
		try {
			const requestData = {
				instructor_id: instructorId,
				course_name: values.courseName,
				course_code: values.courseCode,
				course_semester: values.courseSemester,
				course_year: values.courseYear,
				course_term: values.courseTerm,
				course_visibility: true,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorcreatecourse',
				requestData,
				{ headers: headers }
			);
			const status = response['data']['status'];
			const message = response['data']['message'];

			if (status === 'success') {
				dispatch(updateCourseCode(values.courseCode));
				dispatch(updateCourseName(values.courseName));
				dispatch(updateCourseSemester(values.courseSemester));
				dispatch(updateCourseTerm(values.courseTerm));
				dispatch(updateCourseYear(values.courseYear));

				setModalTitle('Course created successfully!');
				setModalContent('Redirecting to dashboard page...');
				setIsModalVisible2(false);
				setIsModalVisible(true);
				form.resetFields();
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/dashboard');
				}, 2000);
			} else {
				setIsModalVisible2(false);
				setModalTitle('Error! Course could not be created!');
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
				form.resetFields();
			} else {
				setNetworkErrorMessage(error.message);
				setNetworkErrorModalVisible(true);
				form.resetFields();
			}
		}
	};

	const onFinishFailed = (errorInfo) => {
		setModalContent(
			'One or many fields in the Create Course form are invalid!'
		);
		setModalTitle('Validation failed', errorInfo);
		setIsModalVisible(true);
		setTimeout(() => {
			setIsModalVisible(false);
		}, 2000);
	};
	const currentYear = new Date().getFullYear();

	const validateCourseYear = (_, value) => {
		if (value && parseInt(value, 10) < currentYear) {
			return Promise.reject('Course year cannot be in the past!');
		}
		return Promise.resolve();
	};
	const [form] = Form.useForm();

	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow bg-white">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex justify-between p-2 items-center bg-[#DDEEFF] overflow-auto">
						<h1 className="ml-8 text-2xl text-ellipsis">
							Create a new Course!
						</h1>
					</div>
				</div>
				<Breadcrumb
					className="ml-10 mt-4 text-lg font-futura"
					items={[
						{
							title: <a href="/dashboard">Dashboard</a>,
						},
						{
							title: <p className="text-black">Create Course</p>,
						},
					]}
				/>

				<div className="flex justify-center p-8">
					<Form
						name="createCourse"
						labelCol={{ span: 8 }}
						className="w-[50%] m-auto tablet:w-[80%]"
						initialValues={{
							remember: true,
						}}
						onFinish={() => {
							setFormValues(form.getFieldsValue());
							setIsModalVisible2(true);
						}}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						layout="vertical"
						form={form}>
						<h1 className="text-2xl font-futura font-extrabold text-center">
							Create Course
						</h1>

						<Form.Item
							label={
								<span className="font-futura text-lg flex items-center justify-center">
									Course Name
									<Tooltip
										title={
											<span className="font-futura text-sm">
												Enter the course name, Example:
												Mathematics
											</span>
										}>
										<InfoCircleOutlined className="ml-2 text-sm" />
									</Tooltip>
								</span>
							}
							name="courseName"
							rules={[
								{
									required: true,
									pattern: /^[A-Za-z][A-Za-z0-9\s]*$/,
									message: (
										<span className="text-base font-futura">
											Please enter a valid course name
										</span>
									),
								},
							]}>
							<Input
								className="font-futura text-base"
								placeholder={'Enter the course name'}
								maxLength={100}
							/>
						</Form.Item>

						<Form.Item
							label={
								<span className="font-futura text-lg flex items-center">
									Course Code and Section
									<Tooltip
										title={
											<span className="font-futura text-sm">
												Enter the course code, Example:
												COSC499 001
											</span>
										}>
										<InfoCircleOutlined className="ml-2 text-sm" />
									</Tooltip>
								</span>
							}
							name="courseCode"
							rules={[
								{
									required: true,
									pattern:
										/^(?!\s)[A-Za-z0-9!@#$%^&*()-_=+\\|[\]{};:'",.<>/? ]+(?<!\s)$/,
									message: (
										<span className="text-base font-futura">
											Please enter a valid course code
										</span>
									),
								},
							]}>
							<Input
								className="font-futura text-base"
								placeholder="Enter the course code, example COSC499 001"
								maxLength={50}
							/>
						</Form.Item>

						<Form.Item
							label={
								<span className="font-futura text-lg flex items-center">
									Course Semester
									<Tooltip
										title={
											<span className="font-futura text-sm">
												Enter the course semester,
												Example Fall
											</span>
										}>
										<InfoCircleOutlined className="ml-2 text-sm" />
									</Tooltip>
								</span>
							}
							name="courseSemester"
							rules={[
								{
									required: true,
									pattern: /^[A-Za-z][A-Za-z0-9\s]*$/,
									message: (
										<span className="text-base font-futura">
											Please enter a valid course
											semester.
										</span>
									),
								},
							]}>
							<Input
								className="font-futura text-base"
								placeholder="Enter the course semester, Example Fall"
								maxLength={50}
							/>
						</Form.Item>

						<Form.Item
							label={
								<span className="font-futura text-lg flex items-center">
									Course Year
									<Tooltip
										title={
											<span className="font-futura text-sm">
												Enter the course year, Example
												2023
											</span>
										}>
										<InfoCircleOutlined className="ml-2 text-sm" />
									</Tooltip>
								</span>
							}
							name="courseYear"
							rules={[
								{
									required: true,
									pattern: /^[0-9][0-9 ]*$/,
									message: (
										<span className="text-base font-futura">
											Please enter a valid numeric value
											for course year.
										</span>
									),
								},
								{ validator: validateCourseYear },
							]}>
							<Input
								className="font-futura text-base"
								placeholder="Enter the course year, Example 2023"
								// min={currentYear}
								maxLength={4}
							/>
						</Form.Item>

						<Form.Item
							label={
								<span className="font-futura text-lg flex items-center">
									Course Term
									<Tooltip
										title={
											<span className="font-futura text-sm">
												Enter the course term, Example
												May - Aug (Term - 1)
											</span>
										}>
										<InfoCircleOutlined className="ml-2 text-sm" />
									</Tooltip>
								</span>
							}
							name="courseTerm"
							rules={[
								{
									required: true,
									pattern:
										/^(?!\s)[A-Za-z0-9!@#$%^&*()-_=+\\|[\]{};:'",.<>/? ]+(?<!\s)$/,
									message: (
										<span className="text-base font-futura">
											Please enter a valid course term.
										</span>
									),
								},
							]}>
							<Input
								className="font-futura text-base"
								placeholder="Enter the course term, Example Jan-April(Term - 1)"
								maxLength={50}
							/>
						</Form.Item>
						<Form.Item className="flex justify-center">
							<Button
								type="primary"
								htmlType="submit"
								block
								className="bg-[#0F62FE] h-auto text-[white] ">
								<span className="font-futura text-base">
									{' '}
									Create Course
								</span>
							</Button>
						</Form.Item>
					</Form>
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
					<Modal
						open={isModalVisible2}
						title={
							<span className="text-center font-futura text-2xl">
								Create Course Confirmation
							</span>
						}
						className="text-center font-futura text-2xl"
						// footer={null}
						onCancel={() => setIsModalVisible2(false)}
						// onOk={() => {
						// 	handleToggleVisibility();
						// }}
						footer={[
							<div className="flex justify-center" key="buttons">
								<Button
									key="close"
									className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
									onClick={() => setIsModalVisible2(false)}>
									<span className="text-white hover:text-hover text-base font-futura">
										Close
									</span>
								</Button>
								<Button
									key="ok"
									className="bg-green-500 h-auto hover:bg-green-400"
									onClick={() => {
										onFinish(formValues);
									}}>
									<span className="text-white hover:text-white text-base font-futura">
										Confirm
									</span>
								</Button>
							</div>,
						]}>
						<p className=" font-futura text-xl">
							You are about to submit your course for creation.
							Please take a moment to review the details you have
							entered for accuracy. Once you submit the course,
							you won't be able to change the values of the
							fields.
						</p>
					</Modal>
					<NetworkErrorModal />
				</div>
				<div className="flex-grow" />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

export default CreateCourse;

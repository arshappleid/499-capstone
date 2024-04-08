//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Tooltip, Layout } from 'antd';
import AppFooter from '../appfooter';

import { useNavigate } from 'react-router-dom';
import { MD5 } from 'crypto-js';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';

import {
	updateInstructorId,
	updateInstructorAccess,
	updateCourseId,
	updateCourseName,
	updateCourseCode,
	updateCourseSemester,
	updateCourseYear,
	updateCourseTerm,
	updateCourseVisibility,
	updateGroupId,
	updateGroupName,
	updateFormId,
	updateEvaluatorId,
	updateEvaluateeId,
	updateEvaluationFormName,
	updateAssignmentEvaluateeId,
	updateAssignmentEvaluatorId,
	updateAssignmentId,
	updateAssignmentName,
} from '../store/appReducer';
const { Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export default function Login() {
	const dispatch = useDispatch();
	useEffect(() => {
		if (localStorage.getItem('Authorization') !== null) {
			localStorage.removeItem('Authorization');
		}
		dispatch(updateInstructorId(null));
		dispatch(updateInstructorAccess(null));
		dispatch(updateCourseId(null));
		dispatch(updateCourseName(null));
		dispatch(updateCourseCode(null));
		dispatch(updateCourseSemester(null));
		dispatch(updateCourseYear(null));
		dispatch(updateCourseTerm(null));
		dispatch(updateCourseVisibility(null));
		dispatch(updateGroupId(null));
		dispatch(updateGroupName(null));
		dispatch(updateFormId(null));
		dispatch(updateEvaluatorId(null));
		dispatch(updateEvaluateeId(null));
		dispatch(updateEvaluationFormName(null));
		dispatch(updateAssignmentEvaluateeId(null));
		dispatch(updateAssignmentEvaluatorId(null));
		dispatch(updateAssignmentId(null));
		dispatch(updateAssignmentName(null));
	}, []);

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

	const navigate = useNavigate();

	const onFinish = async (values) => {
		try {
			const requestData = {
				instructor_email: values.EMAIL,
				instructor_password: MD5(values.password).toString(),
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'authenticate/instructor',
				requestData,
				{ headers: headers }
			);
			const status = response['data']['status'];
			const message = response['data']['message'];
			if (status === 'success') {
				const token =
					response['data']['oAuthToken_encrypted_instructor_id'];
				localStorage.setItem('Authorization', token);
				const decodedToken = jwtDecode(token);
				const instructor_id = decodedToken.instructor_id;
				dispatch(updateInstructorId(instructor_id));
				setModalTitle('Sign In successful!');
				setModalContent('Redirecting to Dashboard...');
				setIsModalVisible(true);
				form.resetFields();
				navigate('/dashboard');
			} else {
				setModalTitle('Sign In failed!');
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

	const onFinishFailed = (errorInfo) => {
		setModalContent('One or many fields in the Sign In form are invalid!');
		setModalTitle('Sign In failed', errorInfo);
		setIsModalVisible(true);
		setTimeout(() => {
			setIsModalVisible(false);
		}, 2000);
	};

	const [form] = Form.useForm();

	return (
		<>
			<div className="flex w-full min-h-screen">
				<div className=" bg-[#DDEEFF] flex-1 flex items-center justify-center">
					<p className="flex-none font-futura text-5xl text-center max-w-full">
						Peer Review Application{' '}
						<span className="block text-3xl">
							By Learnification Technologies
						</span>
					</p>
				</div>

				<div className="flex-1 p-10 flex items-center">
					<div className="w-full">
						<Form
							name="login_instructor"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							className="w-full"
							form={form}>
							<h1 className="text-center font-futura text-3xl mb-10">
								Instructor Sign In
							</h1>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Email Address{' '}
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter your registered email
													address here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="EMAIL"
								className="font-futura"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please input a valid email
												address!
											</span>
										),
										type: 'email',
									},
								]}>
								<Input className="text-base font-futura" />
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Password{' '}
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter your password here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm" />
										</Tooltip>
									</span>
								}
								name="password"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please input your password!
											</span>
										),
									},
								]}>
								<Input.Password className="text-base font-futura" />
							</Form.Item>

							<Form.Item>
								<Button
									type="default"
									htmlType="submit"
									block
									className="bg-slate-600 hover:bg-slate-500 h-auto font-futura text-lg align-middle">
									<span className="text-white hover:text-white">
										Sign In
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
							<p className=" font-futura text-xl">
								{modalContent}
							</p>
						</Modal>
						<NetworkErrorModal />

						<p className=" font-futura text-lg">
							New Here?{' '}
							<Button
								type="link"
								className="p-0 m-0 font-futura text-lg"
								href="/signup">
								Create Account
							</Button>
						</p>
						<p className=" font-futura text-lg">
							<Button
								type="link"
								className="p-0 m-0 font-futura text-lg"
								href="/forgotpassword">
								Forgot Password?
							</Button>
						</p>
					</div>
				</div>
			</div>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</>
	);
}

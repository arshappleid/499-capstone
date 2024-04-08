// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Input, Modal, Tooltip, Layout } from 'antd';
import AppFooter from '../appfooter';
import { useNavigate } from 'react-router-dom';
import { MD5 } from 'crypto-js';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateForgotPasswordTemporaryToken } from '../store/appReducer';
const { Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export default function ResetPassword() {
	const dispatch = useDispatch();
	const forgotPasswordTempToken = useSelector(
		(state) => state.forgotPasswordTemporaryToken
	);
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
				student_email: values.EMAIL,
				student_password: MD5(values.password).toString(),
				verification_code: values.verification_code,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: forgotPasswordTempToken,
			};
			const response = await axios.post(
				BACKEND_URL + 'authenticate/studentresetpassword',
				requestData,
				{ headers: headers }
			);
			const status = response['data']['status'];
			const message = response['data']['message'];
			if (status === 'success') {
				dispatch(updateForgotPasswordTemporaryToken(null));
				setModalTitle('Password Reset successful!');
				setModalContent('Redirecting to Login page...');
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/login');
				}, 2000);
				form.resetFields();
			} else {
				setModalTitle('Error!');
				setModalContent(message);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
				}, 2000);
			}
			form.resetFields();
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
		setModalContent(
			'One or many fields in the Reset Password form are invalid!'
		);
		setModalTitle('Submission failed', errorInfo);
		setIsModalVisible(true);
		setTimeout(() => {
			setIsModalVisible(false);
		}, 2500);
	};

	const [form] = Form.useForm();
	return (
		<>
			<div className="flex w-full min-h-screen">
				<div className="bg-slate-300 flex-1 flex items-center justify-center">
					<p className="flex-none font-futura text-5xl text-center max-w-full">
						Peer Review Application{' '}
						<sub>by Learnification Technologies</sub>
					</p>
				</div>

				<div className="flex-1 p-10 flex items-center">
					<div className="w-full">
						<Form
							name="forgot_password_form"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							className="w-full"
							form={form}>
							<h1 className=" text-center font-futura text-3xl mb-10">
								Reset Password
							</h1>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Verification Code{' '}
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter the verification code
													sent to your registered
													email address here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="verification_code"
								className="font-futura"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please input a valid
												verification code!
											</span>
										),
									},
								]}>
								<Input
									className="font-futura text-base"
									placeholder="Enter your verification code here"
								/>
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Registered Email Address{' '}
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter the email address
													registered with your
													account. An email will be
													sent to this address with a
													Verification Code to reset
													your password.
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
								<Input
									className="font-futura text-base"
									placeholder="Enter your registered email address here"
								/>
							</Form.Item>
							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										New Password{' '}
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter a strong password
													here. Password must be a
													combination of atleast one
													lowercase letter, one
													uppercase letter, one
													symbol, and one digit! (No
													Spces Allowed)
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="ml-2 text-sm" />
										</Tooltip>
									</span>
								}
								name="password"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please input your new password!
											</span>
										),
									},
									{
										min: 6,
										max: 18,
										message: (
											<span className="text-base font-futura">
												Password must be between 6 and
												18 characters!
											</span>
										),
									},
									{
										pattern:
											/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{6,18}$/,
										message: (
											<span className="text-base font-futura">
												Password must be a combination
												of atleast one lowercase letter,
												one uppercase letter, one
												symbol, and one digit! (No
												Spaces Allowed)
											</span>
										),
									},
								]}>
								<Input.Password className="font-futura text-base" />
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Confirm New Password
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Confirm your new password
													here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="confirmPassword"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please confirm your new
												password!
											</span>
										),
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												!value ||
												getFieldValue('password') ===
													value
											) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error(
													'Passwords do not match!'
												)
											);
										},
									}),
								]}>
								<Input.Password className="font-futura text-base" />
							</Form.Item>

							<Form.Item>
								<Button
									type="default"
									htmlType="submit"
									block
									className="bg-slate-600 hover:bg-slate-500 h-auto font-futura text-lg align-middle">
									<span className="text-white hover:text-white">
										Submit
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
					</div>
				</div>
			</div>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</>
	);
}

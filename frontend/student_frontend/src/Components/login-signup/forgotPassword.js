import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Input, Modal, Tooltip, Layout } from 'antd';
import AppFooter from '../appfooter';
import { useNavigate } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateForgotPasswordTemporaryToken } from '../store/appReducer';
const { Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export default function ForgotPassword() {
	const dispatch = useDispatch();
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
			};
			const response = await axios.post(
				BACKEND_URL + 'authenticate/studentforgotpassword',
				requestData
			);
			const status = response['data']['status'];
			const message = response['data']['message'];
			if (status === 'success') {
				const token = response['data']['token'];
				dispatch(updateForgotPasswordTemporaryToken(token));
				setModalTitle('Email sent successfully!');
				setModalContent('Redirecting to Reset Password page...');
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/resetpassword');
				}, 2000);
				form.resetFields();
			} else {
				setModalTitle('Unregistered Email Address');
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
			'Email address field in the Forgot Password form is invalid!'
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
								Forgot Password
							</h1>

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
													Verification code to reset
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
							<p className="text-center font-futura text-base">
								A Verification code will be sent to your
								registered email address to reset your password.
							</p>
							<p className=" font-futura text-lg">
								New Here?{' '}
								<Button
									type="link"
									className="p-0 m-0 font-futura text-lg"
									href="/signup">
									Create Account
								</Button>
							</p>
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

// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import axios from 'axios';
import { Button, Form, Input, Modal, Tooltip, Layout } from 'antd';
import AppFooter from '../appfooter';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MD5 } from 'crypto-js';
import { InfoCircleOutlined } from '@ant-design/icons';
const { Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function Signup() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');
	const navigate = useNavigate();
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
				]}
				data-testid="network-error-modal">
				<p>{networkErrorMessage}</p>
			</Modal>
		);
	};

	const onFinish = async (values) => {
		try {
			const requestData = {
				instructor_first_name: values.FIRST_NAME,
				instructor_middle_name: values.MIDDLE_NAME,
				instructor_last_name: values.LAST_NAME,
				instructor_email: values.EMAIL,
				instructor_id: values.INSTRUCTOR_ID,
				instructor_password: MD5(values.password).toString(),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/registerinstructor',
				requestData
			);

			const status = response['data']['status'];
			const message = response['data']['message'];

			if (status === 'success') {
				setModalTitle('Signup successful!');
				setModalContent('Redirecting to login page...');
				setIsModalVisible(true);
				form.resetFields();
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/login');
				}, 1000);
			} else {
				setModalTitle('Signup failed!');
				setModalContent(message);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
				}, 1000);
			}

			// form.resetFields();
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
		setModalContent('One or many fields in the Sign Up form are invalid!');
		setModalTitle('Sign Up failed', errorInfo);
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
							name="signup_user"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							className="w-full"
							form={form}
							data-testid="signup-form">
							<h1 className=" text-center font-futura text-3xl mb-10">
								Instructor Sign Up
							</h1>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										First Name{' '}
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter your first name here.
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm" />
										</Tooltip>
									</span>
								}
								name="FIRST_NAME"
								rules={[
									{
										required: true,
										// pattern: /^[A-Za-z]+$/,
										pattern:
											/^[A-Za-z]+[A-Za-z\s-]*[A-Za-z\s]+$/,
										message: (
											<span className="text-base font-futura">
												Please input your first name!
												Only lowercase and uppercase
												alphabets are allowed!
											</span>
										),
										// 'Please input your first name! Only lowercase and uppercase alphabets are allowed!',
									},
								]}>
								<Input
									className="font-futura text-base"
									placeholder="Enter your first name"
								/>
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Middle Name
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter your Middle Name here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="MIDDLE_NAME"
								className="font-futura"
								rules={[
									{
										required: false,
										pattern:
											/^[A-Za-z]+[A-Za-z\s-]*[A-Za-z\s]+$/,
										message: (
											<span className="text-base font-futura">
												Please input your middle name!
												Only lowercase and uppercase
												alphabets are allowed!
											</span>
										),
									},
								]}>
								<Input
									className="font-futura text-base"
									placeholder="Enter your middle name"
								/>
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Last Name
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter your Last Name here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="LAST_NAME"
								className="font-futura"
								rules={[
									{
										required: false,
										pattern:
											/^[A-Za-z]+[A-Za-z\s-]*[A-Za-z\s]+$/,
										message: (
											<span className="text-base font-futura">
												Please input your last name!
												Only lowercase and uppercase
												alphabets are allowed!
											</span>
										),
									},
								]}>
								<Input
									className="font-futura text-base"
									placeholder="Enter your last name"
								/>
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Email Address
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter your email address
													here, this email address
													would be used to login to
													your account.
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="EMAIL"
								className="font-futura"
								data-testid="signup-email"
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
									placeholder="Enter your email address name"
								/>
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Employee ID
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Enter your Employee ID here.
													This id won't be visible in
													the application
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="INSTRUCTOR_ID"
								className="font-futura"
								rules={[
									{
										required: true,
										pattern: /^[0-9]+$/,
										message: (
											<span className="text-base font-futura">
												Please input your Employee Id!
												It should only contain numbers!
											</span>
										),
									},
								]}>
								<Input
									className="font-futura text-base"
									placeholder="Enter your Employee Id here"
								/>
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Password
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
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="password"
								data-testid="signup-password"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please input your password!
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
										Confirm Password
										<Tooltip
											title={
												<span className="font-futura text-sm">
													Confirm your entered
													password here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="confirmPassword"
								data-testid="signup-confirm-password"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please confirm your password!
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
									data-testid="signup-submit"
									block
									className="bg-slate-600 hover:bg-slate-500 font-futura h-auto text-lg align-middle">
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
						<p className="font-futura text-lg">
							Already have an account?{' '}
							<Button
								type="link"
								className="p-0 m-0 font-futura text-lg"
								href="/login">
								Sign In
							</Button>
						</p>
					</div>
				</div>
				<NetworkErrorModal />
			</div>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</>
	);
}

//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Tooltip, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MD5 } from 'crypto-js';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { updateAdminId } from '../store/appReducer';
import AppFooter from '../appfooter';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
const { Footer } = Layout;

export default function Login() {
	useEffect(() => {
		if (localStorage.getItem('Authorization') !== null) {
			localStorage.removeItem('Authorization');
		}
	}, []);
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
				email: values.EMAIL,
				admin_password: MD5(values.password).toString(),
			};
			const response = await axios.post(
				BACKEND_URL + 'authenticate/admin',
				requestData
			);
			const status = response['data']['status'];
			const message = response['data']['message'];
			if (status === 'success') {
				const token =
					response['data']['oAuthToken_encrypted_super_admin_id'];
				localStorage.setItem('Authorization', token);
				const decodedToken = jwtDecode(token);
				const super_admin_id = decodedToken.super_admin_id;
				dispatch(updateAdminId(super_admin_id));
				setModalTitle('Login successful!');
				setModalContent('Redirecting to Dashboard...');
				setIsModalVisible(true);
				form.resetFields();
				navigate('/dashboard');
			} else {
				setModalTitle('Login failed!');
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
		setModalContent('One or many fields in the Login form are invalid!');
		setModalTitle('Login failed', errorInfo);
		setIsModalVisible(true);
		setTimeout(() => {
			setIsModalVisible(false);
		}, 3000);
	};

	const [form] = Form.useForm();

	return (
		<>
			<div className="flex w-full min-h-screen">
				<div className=" bg-indigo-200 flex-1 flex items-center justify-center">
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
							name="login_admin"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							className="w-full"
							form={form}>
							<h1 className=" text-center font-futura text-3xl mb-10">
								Admin Sign In
							</h1>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Email Address{' '}
										<Tooltip
											title={
												<span className="font-futura text-base">
													Enter email address here
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
										message:
											'Please input a valid email address!',
										type: 'email',
									},
								]}>
								<Input
									className="font-futura text-base"
									placeholder="Enter email address here"
								/>
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg flex items-center justify-center">
										Password{' '}
										<Tooltip
											title={
												<span className="font-futura text-base">
													Enter your password here
												</span>
											}
											className="ml-4">
											<InfoCircleOutlined className="text-sm ml-2" />
										</Tooltip>
									</span>
								}
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your password!',
									},
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
					</div>
				</div>
			</div>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</>
	);
}

// Author: Charlotte Zhang;
import axios from 'axios';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MD5 } from 'crypto-js';
import { useSelector } from 'react-redux';
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function UpdatePassword() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');
	const navigate = useNavigate();
	const instructorID = useSelector((state) => state.instructorId);

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
				instructor_id: instructorID,
				instructor_new_password: MD5(values.NEW_PASSWORD).toString(),
				instructor_old_password: MD5(values.OLD_PASSWORD).toString(),
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorupdatepassword',
				requestData,
				{ headers: headers }
			);
			const status = response['data']['status'];
			const message = response['data']['message'];

			if (status === 'success') {
				setModalTitle('Password Updated Successfully!');
				setIsModalVisible(true);
				form.resetFields();
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/instructorprofile');
				}, 2000);
			} else {
				setModalTitle('Oops! Password Change Failed');
				setModalContent(message);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/instructorprofile');
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
		setModalContent(
			'One or many fields in the Create Course form are invalid!'
		);
		setModalTitle('Validation failed', errorInfo);
		setIsModalVisible(true);
		setTimeout(() => {
			setIsModalVisible(false);
		}, 2000);
	};
	const [form] = Form.useForm();
	return (
		<div>
			<div className="container mx-auto px-4 py-8">
				<div className="flex-1  items-center  ">
					<div className="w-96  mx-auto">
						<Form
							name="change_password"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							className="w-128"
							form={form}>
							<h1 className="font-semibold text-center font-futura text-2xl mb-10">
								Change Password
							</h1>
							<Form.Item
								label={
									<span className="font-futura text-lg">
										Current Password
									</span>
								}
								name="OLD_PASSWORD"
								rules={[
									{
										required: true,
										message: (
											<span className="text-base font-futura">
												Please input your old password!
											</span>
										),
									},
								]}>
								<Input.Password className="text-lg" />
							</Form.Item>
							<Form.Item
								label={
									<span className="font-futura text-lg">
										New Password
									</span>
								}
								name="NEW_PASSWORD"
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
												symbol, and one digit! (No Spces
												Allowed)
											</span>
										),
									},
								]}>
								<Input.Password className="text-lg" />
							</Form.Item>
							<Form.Item
								label={
									<span className="font-futura text-lg">
										Confirm Password
									</span>
								}
								name="CONFIRM_PASSWORD"
								dependencies={['NEW_PASSWORD']}
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
												getFieldValue(
													'NEW_PASSWORD'
												) === value
											) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error(
													'The new password that you entered do not match!'
												)
											);
										},
									}),
								]}>
								<Input.Password className="text-lg" />
							</Form.Item>
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
							<Form.Item className="flex justify-center">
								<Button
									type="primary"
									htmlType="submit"
									block
									className="bg-blue-500 hover:bg-blue-400 h-auto font-futura text-lg w-auto">
									<span className="text-base font-futura">
										Update Password
									</span>
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}

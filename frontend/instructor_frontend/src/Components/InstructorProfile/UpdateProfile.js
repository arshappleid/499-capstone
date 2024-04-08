// Author: Charlotte Zhang;
import axios from 'axios';
import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

function UpdateProfile() {
	const navigate = useNavigate();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

	const instructorID = useSelector((state) => state.instructorId);

	const [networkErrorModalVisible, setNetworkErrorModalVisible] =
		useState(false);
	const [networkErrorMessage, setNetworkErrorMessage] = useState('');
	const [form] = Form.useForm();
	const handleNetworkErrorModalClose = () => {
		setNetworkErrorModalVisible(false);
		setNetworkErrorMessage('');
	};
	useEffect(() => {
		getProfile();
	}, [form]);

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
	const getProfile = async () => {
		try {
			const requestData = {
				instructor_id: instructorID,
			};
			// Author: Sehajvir Singh Pannu
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getinstructorprofile',
				requestData,
				{ headers: headers }
			);
			const instructorData = response.data.data[0];
			form.setFieldValue('FIRST_NAME', instructorData['FIRST_NAME']);
			form.setFieldValue('MIDDLE_NAME', instructorData['MIDDLE_NAME']);
			form.setFieldValue('LAST_NAME', instructorData['LAST_NAME']);
			form.setFieldValue('EMAIL', instructorData['EMAIL']);
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
	const onFinish = async (values) => {
		try {
			const requestData = {
				instructor_id: instructorID,
				instructor_first_name: values.FIRST_NAME,
				instructor_middle_name: values.MIDDLE_NAME,
				instructor_last_name: values.LAST_NAME,
				instructor_email: values.EMAIL,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorupdateprofile',
				requestData,
				{ headers: headers }
			);
			const status = response['data']['status'];
			const message = response['data']['message'];

			if (status === 'success') {
				setModalTitle('Profile Updated Successfully!');
				setIsModalVisible(true);
				form.resetFields();
				getProfile();
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/instructorprofile');
				}, 2000);
			} else {
				setModalTitle('Oops! Profile Change Failed');
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

	return (
		<div>
			<div className="container mx-auto px-4 py-8">
				<div className="flex-1  items-center  ">
					<div className="w-96  mx-auto">
						<Form
							name="profile_update"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							className="w-128 "
							form={form}>
							<h1 className="font-bold text-center font-futura text-2xl mx-10 mb-10">
								Profile Information
							</h1>

							{/* Profile Form Fields */}
							<Form.Item
								label={
									<span className="font-futura text-lg ">
										First Name
									</span>
								}
								name="FIRST_NAME"
								rules={[
									{
										required: true,
										pattern: /^[A-Za-z]+$/,
										message: (
											<span className="text-base font-futura">
												Please input your first name!
												Only lowercase and uppercase
												alphabets are allowed!
											</span>
										),
									},
								]}>
								<Input className="font-futura text-lg" />
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg ">
										Middle Name
									</span>
								}
								name="MIDDLE_NAME"
								rules={[
									{
										required: false,
										pattern: /^[A-Za-z\s!@#$%^&*().-]+$/,
										message: (
											<span className="text-base font-futura">
												Only lowercase and uppercase
												alphabets are allowed!
											</span>
										),
									},
								]}>
								<Input className="font-futura text-lg" />
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg ">
										Last Name
									</span>
								}
								name="LAST_NAME"
								className="font-futura"
								rules={[
									{
										required: false,
										pattern: /^[A-Za-z\s!@#$%^&*().-]+$/,
										message: (
											<span className="text-base font-futura">
												Only lowercase and uppercase
												alphabets are allowed!
											</span>
										),
									},
								]}>
								<Input className="font-futura text-lg" />
							</Form.Item>

							<Form.Item
								label={
									<span className="font-futura text-lg">
										Email
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
								<Input className="font-futura text-lg" />
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
								{/* className="w-3/4 content-center" */}
								<Button
									type="primary"
									htmlType="submit"
									block
									className="bg-blue-500 hover:bg-blue-400 h-auto font-futura text-lg w-auto">
									{/* items-end */}
									<span className="text-base font-futura">
										Update Information
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
export default UpdateProfile;

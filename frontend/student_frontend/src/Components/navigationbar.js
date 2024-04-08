// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Avatar, Space, Dropdown, Menu, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export default function NavigationBar() {
	const items = [
		{
			key: '1',
			label: (
				<a className="font-futura text-base" href="/studentprofile">
					Profile Settings
				</a>
			),
		},
		{
			key: '2',
			label: (
				<a className="font-futura text-base" href="/logout">
					Logout
				</a>
			),
		},
	];
	const [studentFirstName, setStudentName] = useState(null);
	const [studentLastName, setStudentLastName] = useState(null);
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

	const studentId = useSelector((state) => state.studentId);

	useEffect(() => {
		const fetchStudentProfile = async () => {
			try {
				const requestData = {
					studentID: studentId,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'student/getstudentprofile',
					requestData,
					{
						headers: headers,
					}
				);
				if (response.data.status === 'success') {
					const student_first_name =
						response.data.data.student_first_name;
					const student_last_name =
						response.data.data.student_last_name;

					setStudentName(student_first_name);
					setStudentLastName(student_last_name);
				} else {
					setStudentName('Invalid');
					setStudentLastName('User');
				}
			} catch (error) {
				if (error.isAxiosError) {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				} else {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				}
			}
		};
		fetchStudentProfile();
	}, []);

	return (
		<div className="flex items-center justify-between p-5 bg-customBlue w-full">
			<Space className="flex -ml-8">
				<h3 className="flex-none text-2xl font-futura text-left text-white">
					Peer Review Application{' '}
				</h3>
				<Link to="/dashboard">
					<Button
						type="default"
						className=" rounded-lg ml-12 font-futura h-auto text-white bg-white">
						<span className="text-slate-800 text-base">
							{' '}
							Dashboard
						</span>
					</Button>
				</Link>
			</Space>

			<Space className="flex -mr-8">
				<span className="font-futura text-white mr-4 text-lg">
					{studentFirstName} {studentLastName}
				</span>

				<Dropdown
					className="flex-none cursor-pointer"
					menu={{
						items,
					}}
					trigger={['click']}
					placement="bottomLeft"
					arrow>
					<div onClick={(e) => e.preventDefault()}>
						<Avatar
							shape="circle"
							size="large"
							icon={<UserOutlined />}
							data-testid="user-avatar"
						/>
					</div>
				</Dropdown>
			</Space>
			<NetworkErrorModal />
		</div>
	);
}

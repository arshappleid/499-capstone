//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

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
				<a className="font-futura text-base" href="/instructorprofile">
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

	const [instFirstName, setInstructorName] = useState(null);
	const [instLastName, setInstructorLastName] = useState(null);
	const instructorId = useSelector((state) => state.instructorId);

	const [networkErrorModalVisible, setNetworkErrorModalVisible] =
		useState(false);
	const [networkErrorMessage, setNetworkErrorMessage] = useState('');

	const handleNetworkErrorModalClose = () => {
		setNetworkErrorModalVisible(false);
		setNetworkErrorMessage('');
	};

	useEffect(() => {
		const fetchInstructorProfile = async () => {
			try {
				const instructor_id = instructorId;
				const requestData = {
					instructor_id: instructor_id,
				};
				const headers = {
					authorization: localStorage.getItem('Authorization'),
					'Content-Type': 'application/json',
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/getinstructorprofile',
					requestData,
					{
						headers: headers,
					}
				);
				if (response.data.status === 'success') {
					const instructor_first_name =
						response.data.data[0].FIRST_NAME;
					const instructor_last_name =
						response.data.data[0].LAST_NAME;

					setInstructorName(instructor_first_name);
					setInstructorLastName(instructor_last_name);
				} else {
					setInstructorName('Invalid');
					setInstructorLastName('User');
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
		fetchInstructorProfile();
	}, []);

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
					{instFirstName} {instLastName}
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

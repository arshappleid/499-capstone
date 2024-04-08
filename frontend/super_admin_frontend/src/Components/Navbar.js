//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Avatar, Space, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function NavigationBar() {
	const items = [
		{
			key: '1',
			label: (
				<a className="font-futura text-base" href="/logout">
					Logout
				</a>
			),
		},
	];

	return (
		<div className="flex items-center justify-between p-5 bg-customBlue w-full">
			<Space className="flex -ml-8">
				<h3 className="flex-none text-2xl font-futura text-left text-white">
					Peer Review Application{' '}
				</h3>
				<Link to="/dashboard">
					<Button
						type="default"
						className="rounded-lg ml-12 font-futura h-auto text-white bg-white">
						<span className="text-slate-800 text-base">
							{' '}
							<span className="text-black">Dashboard</span>
						</span>
					</Button>
				</Link>
			</Space>

			<Space className="flex -mr-8">
				<p className="font-futura text-white mr-4 mt-1 text-lg">
					Super Admin
				</p>
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
		</div>
	);
}

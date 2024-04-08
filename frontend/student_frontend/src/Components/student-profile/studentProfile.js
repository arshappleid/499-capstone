// Author: Charlotte Zhang;

import React from 'react';
import UpdateProfile from './UpdateProfile';
import { UpdatePassword } from './UpdatePassword';
import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import { Layout, Breadcrumb } from 'antd';
const { Header, Footer, Content } = Layout;

export default function StudentProfile() {
	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow bg-white">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							Profile Settings
						</h1>
					</div>
				</div>
				<Breadcrumb
					className="ml-10 mt-4 text-lg font-futura"
					items={[
						{
							title: <a href="/dashboard">Dashboard</a>,
						},
						{
							title: (
								<p className="text-black">Profile Settings</p>
							),
						},
					]}
				/>
				<UpdateProfile />
				<UpdatePassword />
			</Content>
			<Footer className="p-0" data-testid="footer">
				<AppFooter data-testid="app-footer" />
			</Footer>
		</Layout>
	);
}

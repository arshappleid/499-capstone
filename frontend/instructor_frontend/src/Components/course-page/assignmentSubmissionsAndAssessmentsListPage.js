// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import AssignmentNavigationBar from './assignmentNavigationBar';
import NavigationBar from '../navigationbar';
import {  Layout, Breadcrumb } from 'antd';
import { useSelector } from 'react-redux';
import AppFooter from '../appfooter';

const { Header, Footer, Content } = Layout;

export function AssignmentSubmissionsAndAssessmentsListPage() {
	const courseName = useSelector((state) => state.courseName);

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura mb-20 ">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							{courseName}
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
								<a href="/coursepage">Course: {courseName}</a>
							),
						},
						{
							title: (
								<a href="/assignmentlistpage">
									Assignments List
								</a>
							),
						},
						{
							title: (
								<span className="text-black">
									Assignment Submissions And Assessments
								</span>
							),
						},
					]}
				/>

				<div className="flex flex-col px-10 min-h-screen items-left w-full pt-10 pb-20">
					<AssignmentNavigationBar value={1} />
				</div>
				<div className="flex-grow" />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import { Layout, Breadcrumb } from 'antd';
import CourseNavigationBar from '../course-page/courseNavigationBar';
import { useSelector } from 'react-redux';

const { Header, Content, Footer } = Layout;

export function GroupEvaluationsListPage() {
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
								<span className="text-black">
									Group Evaluations
								</span>
							),
						},
					]}
				/>
				<div className="flex flex-col font-futura items-center w-full m-auto text-xl mt-10">
					<h2>
						Select a Group Evaluation Form to complete evaluations
					</h2>
				</div>
				<div className="flex flex-col min-h-screen items-center w-full pt-10 pb-20">
					<CourseNavigationBar value={3} />
				</div>
				<div className="flex-grow" />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

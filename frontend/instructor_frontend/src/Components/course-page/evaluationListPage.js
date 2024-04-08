// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import NavigationBar from '../navigationbar';
import CourseNavigationbar from './courseNavigationBar';
import { Layout, Breadcrumb } from 'antd';
import AppFooter from '../appfooter';
import { useSelector } from 'react-redux';

const { Header, Footer, Content } = Layout;

export function EvaluationListPage() {
	const courseName = useSelector((state) => state.courseName);
	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow bg-white">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							{courseName}
						</h1>
					</div>
				</div>
				<Breadcrumb
					className="pl-10 mt-4 text-lg font-futura"
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
							title: <span>Evaluation Forms</span>,
						},
					]}
				/>
				<div className="flex flex-col min-h-screen items-center w-full pt-10 pb-20">
					<CourseNavigationbar value={3} />
				</div>
				<div className="flex-grow" />
			</Content>
			<Footer className="p-0" data-testid="footer">
				<AppFooter data-testid="app-footer" />
			</Footer>
		</Layout>
	);
}

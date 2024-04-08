// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
import CoursePageCard from './coursepagecard';
import NavigationBar from '../navigationbar';
import { Button, Layout, Breadcrumb } from 'antd';
import AppFooter from '../appfooter';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const { Header, Footer, Content } = Layout;
export function CoursePage() {
	const courseName = useSelector((state) => state.courseName);

	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="font-futura flex flex-col flex-grow bg-white pb-20">
				<div className="bg-[#F4F4F4] h-20">
					<div className="w-full h-full m-auto flex justify-between p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							{courseName}
						</h1>
						<Link to="/CourseSetting">
							<Button
								type="default"
								className="bg-[#0F62FE] hover:text-black mr-8 h-auto text-white rounded-md">
								<span className="font-futura text-base text-white hover:text-white hover:drop-shadow-lg">
									Course Tools
								</span>
							</Button>
						</Link>
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
								<p className="text-black" href="/coursepage">
									Course: {courseName}
								</p>
							),
						},
					]}
				/>
				<div className="flex items-center justify-center mx-10">
					<div className="mb-20 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
						<Link
							className="hover:text-black"
							to="/studentListPage">
							<CoursePageCard
								type="Students"
								color="#F9998B"
								value="student"
							/>
						</Link>
						<Link className="hover:text-black" to="/grouplistpage">
							<CoursePageCard
								type="Groups"
								color="#A3E9CF"
								value="studentGroup"
							/>
						</Link>
						<Link
							className="hover:text-black"
							to="/assignmentlistpage">
							<CoursePageCard
								type="Assignments"
								color="#DDEEFF"
								value="assignmentForm"
							/>
						</Link>
						<Link
							className="hover:text-black"
							to="/evaluationlistpage">
							<CoursePageCard
								type="Evaluation Forms"
								color="#FFE3D6"
								value="evaluationForm"
							/>
						</Link>
					</div>
				</div>
				<div className="flex-grow" />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

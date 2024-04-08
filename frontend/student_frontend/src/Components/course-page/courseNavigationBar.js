// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import React, { useState } from 'react';
import StudentTable from '../studentTable/studentTable';
import { GroupTable } from '../groupTable/groupTable';
import { GroupEvaluationsTable } from '../groupEvaluation/groupEvaluationTable';
import { AssignmentListPage } from '../assignments/assignmentListPage';
import {
	UserOutlined,
	TeamOutlined,
	ProjectOutlined,
	StarOutlined,
} from '@ant-design/icons';
import { Tabs } from 'antd';
const CourseNavigationBar = (props) => {
	const [activeTab, setActiveTab] = useState(`${props.value}`);
	const renderTabContent = (key) => {
		if (key === '1') {
			return (
				<div className=" flex justify-center items-center">
					<StudentTable />
				</div>
			);
		} else if (key === '2') {
			return (
				<div className=" flex justify-center items-center">
					<GroupTable />
				</div>
			);
		} else if (key === '3') {
			return (
				<div className=" flex justify-center items-center">
					<GroupEvaluationsTable />
				</div>
			);
		} else if (key === '4') {
			return (
				<div className=" flex justify-center items-center">
					<AssignmentListPage />
				</div>
			);
		}
	};

	const menuItems = ['Students', 'Group', 'Group Evaluations', 'Assignments'];

	return (
		<div className=" flex flex-col flex-grow min-h-screen max-w-full w-full">
			<div className="overflow-x-auto">
				<Tabs
					// className="justify-items-center items-center overflow-scroll font-futura text-base"
					className=" justify-items-center font-futura text-base"
					defaultActiveKey={activeTab}
					// tabBarGutter={10}
					// centered={true}
					// tabBarExtraContent={{ style: { display: 'none' } }}
					onChange={setActiveTab}
					tabPosition="left"
					type="line"
					items={[
						UserOutlined,
						TeamOutlined,
						StarOutlined,
						ProjectOutlined,
					].map((Icon, i) => {
						const id = String(i + 1);
						return {
							label: (
								<span className="text-lg font-futura px-4">
									<Icon />
									{menuItems[i]}
								</span>
							),
							key: id,
							children: renderTabContent(id),
						};
					})}
				/>
			</div>
		</div>
	);
};

export default CourseNavigationBar;

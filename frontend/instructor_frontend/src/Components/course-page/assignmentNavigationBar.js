// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import React, { useState } from 'react';
import { AssignmentSubmissionsTable } from './assignmentSubmissionsTable';
import { AssignmentAssessmentOverviewPage } from './assignmentAssessmentOverviewPage';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';

const AssignmentNavigationBar = (props) => {
	const [activeTab, setActiveTab] = useState(`${props.value}`);
	const assignment_name = useSelector((state) => state.assignmentName);
	const renderTabContent = (key) => {
		if (key === '1') {
			return (
				<div>
					<div className="flex font-futura items-center w-full text-xl mt-10 mb-10">
						<h2>
							Select a student to view their Assignment submission
							for: {assignment_name}
						</h2>
					</div>
					<AssignmentSubmissionsTable />
				</div>
			);
		} else if (key === '2') {
			return (
				<div>
					<AssignmentAssessmentOverviewPage />
				</div>
			);
		}
	};

	const menuItems = ['Assignment Submissions', 'Assignment Assessments'];

	return (
		<div className=" flex flex-col flex-grow min-h-screen max-w-full">
			<div className="overflow-x-auto">
				<Tabs
					className=" overflow-scroll  font-futura text-base"
					defaultActiveKey={activeTab}
					tabBarExtraContent={{ style: { display: 'none' } }}
					onChange={setActiveTab}
					type="line"
					items={new Array(2).fill(null).map((_, i) => {
						const id = String(i + 1);
						return {
							label: (
								<span className="text-lg font-futura px-4">
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

export default AssignmentNavigationBar;

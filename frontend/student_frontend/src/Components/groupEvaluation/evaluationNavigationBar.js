// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import React, { useState } from 'react';
import { ViewGroupEvaluationsFeedback } from './viewGroupEvaluationsFeedback';
import { ViewFinalGrade } from './viewFinalGrade';
import { Tabs } from 'antd';
const EvaluationNavigationBar = (props) => {
	const [activeTab, setActiveTab] = useState(`${props.value}`);
	const renderTabContent = (key) => {
		if (key === '1') {
			return <ViewFinalGrade />;
		} else if (key === '2') {
			return <ViewGroupEvaluationsFeedback />;
		}
	};
	const menuItems = ['Grades', 'Individual Feedback'];
	return (
		<div className=" flex flex-col flex-grow min-h-screen max-w-full">
			<div className="overflow-x-auto">
				<Tabs
					className=" overflow-scroll font-futura text-base"
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

export default EvaluationNavigationBar;

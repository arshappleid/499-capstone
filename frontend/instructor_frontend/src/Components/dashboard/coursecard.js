//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { Card } from 'antd';
import React from 'react';

export default function CourseCard(props) {
	const CourseSemester =
		props.course.CourseSemester.length > 10
			? `${props.course.CourseSemester.slice(0, 7)}...`
			: props.course.CourseSemester;
	const CourseYear =
		props.course.CourseYear.length > 10
			? `${props.course.CourseYear.slice(0, 7)}...`
			: props.course.CourseYear;

	const CourseTerm =
		props.course.CourseTerm.length > 20
			? `${props.course.CourseTerm.slice(0, 15)}...`
			: props.course.CourseTerm;
	const actions = [
		`${CourseSemester.toUpperCase()} ${CourseYear.toUpperCase()} ${CourseTerm.toUpperCase()}`,
	];

	return (
		<div className="flex items-center justify-center h-auto shadow-2xl ">
			<Card
				className="w-96 h-56 bg-blue-200 rounded-lg text-white flex flex-col justify-between font-futura"
				actions={actions}
				hoverable>
				<p className=" uppercase text-base text-black text-center font-futura font-extrabold mb-4">{`${
					props.course.CourseName.length > 40
						? `${props.course.CourseName.slice(0, 35)}...`
						: props.course.CourseName
				}`}</p>
				<p className="uppercase text-base text-black text-center font-futura font-extrabold mb-4">{`${
					props.course.CourseCode.length > 20
						? `${props.course.CourseCode.slice(0, 20)}...`
						: props.course.CourseCode
				}`}</p>
			</Card>
		</div>
	);
}

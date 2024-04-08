// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function CourseSettingCard({ type, color, value }) {
	return (
		<div
			className="w-full h-full p-12 rounded-md  hover:border-transparent flex justify-center items-center relative my-10 shadow-lg shadow-slate-300 hover:shadow-2xl hover:shadow-slate-400 hover:scale-105 transform transition-all duration-300 ease-in-out"
			style={{
				backgroundColor: color,
				transition: 'background-color 0.3s ease',
				cursor: 'pointer',
			}}
			// THIS IS FOR THE HOVER EFFECT ON THE CARD BUT ITS BUGGY SO I COMMENTED IT OUT
			// onMouseEnter={(e) => {
			// 	e.target.style.backgroundColor = '#094872';
			// }}
			// onMouseLeave={(e) => {
			// 	e.target.style.backgroundColor = color;
			// }}
		>
			<p data-testid="course-type" className="text-2xl ">
				{type}
			</p>
		</div>
	);
}

export default CourseSettingCard;

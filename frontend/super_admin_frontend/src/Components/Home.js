//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import React, { useEffect } from 'react';
import { Button, Space } from 'antd';
import illustration from './asset/Teamwork.png';

const Home = () => {
	useEffect(() => {
		// Clearing localStorage
		localStorage.clear();
	}, []);
	return (
		<div className="bg-[#E5EAF0] w-full min-h-screen">
			<div className="text-3xl font-futura flex items-center justify-center flex-col p-5 pt-10">
				<h4 className="text-2xl">Welcome to </h4>
				<h1>
					<span className=" font-extrabold">
						Peer Review Application
					</span>
					<div className=" text-xxl flex flex-col ml-5 mt-3">
						<sub>By Learnification Technologies</sub>
					</div>
				</h1>
			</div>
			<div className="flex flex-grow items-center justify-center font-futura text-2xl mt-10">
				<img src={illustration} alt="SVG Image" />
			</div>

			<div className="flex flex-grow items-center justify-center font-futura text-2xl mt-10">
				<Space className="flex">
					<Button
						className="font-futura h-auto bg-customBlue px-6 py-2  text-white hover:text-white"
						href="/login"
						type="default">
						<span className="text-white hover:text-white text-xl">
							Admin Login
						</span>
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default Home;

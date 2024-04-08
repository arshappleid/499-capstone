//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import React from 'react';
// import '../dist/output.css';

export default function AppFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<p className="p-4 m-0 bg-customBlue items-center text-center text-base font-futura text-white">
			Learnification Technologies @ {currentYear}. All rights reserved.
		</p>
	);
}

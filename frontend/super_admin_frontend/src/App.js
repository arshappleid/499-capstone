//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import React from 'react';
import Home from './Components/Home.js';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/login/login.js';
import { Dashboard } from './Components/dashboard/dashboard.js';
import { UserProvider } from './userContext.js';
import ProtectedRoute from './utils/auth.js';

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<UserProvider>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route element={<ProtectedRoute />}>
							<Route path="/dashboard" element={<Dashboard />} />
						</Route>
						<Route path="/logout" element={<Login />} />
						<Route path="*" element={<Home />}></Route>
					</Routes>
				</UserProvider>
			</BrowserRouter>
		</div>
	);
};

export default App;

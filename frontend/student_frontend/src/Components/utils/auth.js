// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = () => {
	let auth;
	const userToken = localStorage.getItem('Authorization');
	auth = userToken === null || userToken === undefined ? false : true;
	if (!auth) {
		return <Navigate to="/login" />;
	} else if (auth) {
		const decodedToken = jwtDecode(userToken);
		const currentTime = Date.now() / 1000;
		if (decodedToken.exp < currentTime) {
			auth = false;
		} else {
			auth = true;
		}
		return auth ? <Outlet /> : <Navigate to="/login" />;
	}
};

export default ProtectedRoute;

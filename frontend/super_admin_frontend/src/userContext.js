// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { createContext, useContext } from 'react';

import { useSelector, useDispatch } from 'react-redux';

const UserContext = createContext();

export function UseUserContext() {
	return useContext(UserContext);
}

export function UserProvider({ children }) {
	const dispatch = useDispatch();
	const { adminId } = useSelector((state) => state);

	const updateAdminId = (adminId) => {
		dispatch({ type: 'UPDATE_ADMINID', payload: adminId });
	};

	return (
		<UserContext.Provider
			value={{
				adminId,
				updateAdminId,
			}}>
			{children}
		</UserContext.Provider>
	);
}

// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

const initialState = {
	adminId: null,
};

const UPDATE_ADMINID = 'UPDATE_ADMINID';

export const updateAdminId = (adminId) => ({
	type: UPDATE_ADMINID,
	payload: adminId,
});

const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_ADMINID':
			return { ...state, adminId: action.payload };
		default:
			return state;
	}
};

export default appReducer;

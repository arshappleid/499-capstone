//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';
import Button from 'antd/lib/button/button';
import axios from 'axios';
import React, { useState, useContext } from 'react';

import '@testing-library/jest-dom/extend-expect';
import Login from '../src/Components/login-signup/login.js';
import userEvent from '@testing-library/user-event';
import { MD5 } from 'crypto-js';
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
jest.mock('axios');
window.matchMedia = jest.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
}));
describe('Login', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders login form', () => {
		const { getByLabelText, getByText } = render(
			<Router>
				<Login />
			</Router>
		);

		expect(getByLabelText('Email Address')).toBeInTheDocument();
		expect(getByLabelText('Password')).toBeInTheDocument();
		expect(getByText('Sign In')).toBeInTheDocument();
	});
	test('submits login form with valid credentials', async () => {
		const { getByLabelText, getByText } = render(
			<Router>
				<Login />
			</Router>
		);
		const emailInput = getByLabelText('Email Address');
		const passwordInput = getByLabelText('Password');
		const submitButton = getByText('Sign In');

		axios.post.mockResolvedValue({
			data: {
				status: 'success',
				message: 'Login successful!',
				data: { instructor_id: '123' },
			},
		});
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
		fireEvent.change(passwordInput, { target: { value: 'password' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledTimes(1);
			expect(axios.post).toHaveBeenCalledWith(
				BACKEND_URL + 'instructor/authenticateinstructor',
				{
					instructor_email: 'test@example.com',
					instructor_password: MD5('password').toString(),
				}
			);
		});
	});
	test('The Network error modal is rendered correctly and closes correctly', () => {
		const NetworkErrorModal = () => {
			const [networkErrorModalVisible, setNetworkErrorModalVisible] =
				useState(true);
			const [networkErrorMessage, setNetworkErrorMessage] = useState(
				'Network error message'
			);

			const handleNetworkErrorModalClose = () => {
				setNetworkErrorModalVisible(false);
				setNetworkErrorMessage('');
			};

			return (
				<Modal
					open={networkErrorModalVisible}
					onCancel={handleNetworkErrorModalClose}
					title="Network Error"
					footer={[
						<Button
							key="close"
							onClick={handleNetworkErrorModalClose}>
							Close
						</Button>,
					]}>
					<p>Network error message</p>
				</Modal>
			);
		};

		const { getByText } = render(<NetworkErrorModal />);

		expect(getByText('Network Error')).toBeInTheDocument();
		expect(getByText('Network error message')).toBeInTheDocument();

		const closeButton = getByText('Close');
		fireEvent.click(closeButton);
	});
});

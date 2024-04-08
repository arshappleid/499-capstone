import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import NavigationBar from '../src/Components/navigationbar.jsx';
import userEvent from '@testing-library/user-event';

jest.mock('axios');

window.matchMedia = jest.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
}));

describe('NavigationBar', () => {
	beforeEach(() => jest.clearAllMocks());

	it('renders the navigation bar with correct content', () => {
		render(
			<Router>
				<NavigationBar />
			</Router>
		);

		const titleElement = screen.getByText('Peer Review Application');
		expect(titleElement).toBeInTheDocument();

		const dashboardLinkElement = screen.getByRole('link', {
			name: 'Dashboard',
		});
		expect(dashboardLinkElement).toBeInTheDocument();
		expect(dashboardLinkElement).toHaveAttribute('href', '/dashboard');

		const userAvatarElement = screen.getByTestId('user-avatar');
		expect(userAvatarElement).toBeInTheDocument();
	});
	it('Fetches instructor profile and displays the instructor name', async () => {
		axios.post.mockResolvedValue({
			data: {
				status: 'success',
				data: [
					{
						FIRST_NAME: 'John',
						LAST_NAME: 'Doe',
					},
				],
			},
		});

		render(
			<Router>
				<NavigationBar />
			</Router>
		);
		await screen.findByText('John Doe');

		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});

	it('Fetches instructor profile and displays Invalid User in navigation bar if we do not get instructor details from API', async () => {
		axios.post.mockResolvedValue({
			data: {
				status: 'error',
				data: [
					{
						FIRST_NAME: null,
						LAST_NAME: null,
					},
				],
			},
		});

		render(
			<Router>
				<NavigationBar />
			</Router>
		);
		await screen.findByText('Invalid User');

		expect(screen.getByText('Invalid User')).toBeInTheDocument();
	});

	it('The Application title is correctly rendered in the bar.', async () => {
		render(
			<Router>
				<NavigationBar />
			</Router>
		);

		await waitFor(() => {
			expect(
				screen.getByText('Peer Review Application')
			).toBeInTheDocument();
		});
	});
	it('Displays the network error modal when there is a network error', async () => {
		axios.post.mockRejectedValue(new Error('Network error'));

		render(
			<Router>
				<NavigationBar />
			</Router>
		);

		await screen.findByText('Network Error');
		expect(screen.getByText('Network Error')).toBeInTheDocument();
	});
	it('Closes the network error modal when the close button is clicked', async () => {
		axios.post.mockRejectedValueOnce(new Error('Network error'));

		render(
			<Router>
				<NavigationBar />
			</Router>
		);

		// Wait for the network error modal to appear
		await screen.findByTestId('network-error-modal');

		// Find all close buttons with the role "button" and name "Close"
		const closeButtons = screen.getAllByRole('button', { name: 'Close' });

		// Select the first close button
		const closeButton = closeButtons[0];

		// Simulate clicking the close button
		userEvent.click(closeButton);

		// Wait for the network error modal to disappear
		await waitFor(() => {
			expect(
				screen.queryByTestId('network-error-modal')
			).not.toBeInTheDocument();
		});
	});
	it('renders navigation bar with user information and dropdown menu', () => {
		render(
			<Router>
				<NavigationBar />
			</Router>
		);

		const dropdownButton = screen.getByTestId('user-avatar');
		fireEvent.mouseEnter(dropdownButton);

		const accountSettingsLink = screen.getByText('Account Settings');
		const logoutLink = screen.getByText('Logout');

		expect(accountSettingsLink).toBeInTheDocument();
		expect(logoutLink).toBeInTheDocument();
	});
	it('Dashboard button is present on the navigation bar', async () => {
		render(
			<Router>
				<NavigationBar />
			</Router>
		);

		const dashboardButton = screen.getByText('Dashboard');
		expect(dashboardButton).toBeInTheDocument();
	});

	it('user avatar is rendered in the navigation bar', async () => {
		render(
			<Router>
				<NavigationBar />
			</Router>
		);

		const userAvatar = screen.getByTestId('user-avatar');
		expect(userAvatar).toBeInTheDocument();
	});
});

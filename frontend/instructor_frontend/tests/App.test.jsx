import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { UserProvider } from './controller/usercontext';
import App from '../src/App';

test('renders home page when the route is "/"', () => {
	render(<App />);

	const homeElement = screen.getByText(
		'Peer Review Application by Learnification Technologies'
	);
	expect(homeElement).toBeInTheDocument();
});

test('renders signup page when the route is "/signup"', () => {
	const history = createMemoryHistory();
	history.push('/signup');

	render(
		<Router history={history}>
			<App />
		</Router>
	);

	const signupElement = screen.getByText('Instructor Sign Up');
	expect(signupElement).toBeInTheDocument();
});

test('renders login page when the route is "/login"', () => {
	render(
		<MemoryRouter initialEntries={['/login']}>
			<App />
		</MemoryRouter>
	);

	const loginElement = screen.getByText('Login');
	expect(loginElement).toBeInTheDocument();
});

test('renders dashboard page when the route is "/dashboard"', () => {
	render(
		<MemoryRouter initialEntries={['/dashboard']}>
			<App />
		</MemoryRouter>
	);

	const dashboardElement = screen.getByText('Dashboard');
	expect(dashboardElement).toBeInTheDocument();
});

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../src/Components/Home.jsx';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Home Component', () => {
	it('Home Screen renders without crashing', () => {
		render(<Home />);
	});

	it('The Sign up and Login buttons are correctly rendered and are visible', () => {
		render(<Home />);
		const signUpButton = screen.getByRole('link', { name: 'Sign up' });
		const loginButton = screen.getByRole('link', { name: 'Login' });
		expect(signUpButton).toBeVisible();
		expect(loginButton).toBeVisible();
	});

	it('Renders a Sign up button with correct props', () => {
		render(<Home />);
		const signUpButton = screen.getByRole('link', { name: 'Sign up' });
		expect(signUpButton).toHaveAttribute('href', '/signup');
		expect(signUpButton).toHaveClass('ant-btn', 'ant-btn-lg');
	});

	it('Renders a Login button with correct props', () => {
		render(<Home />);
		const loginButton = screen.getByRole('link', { name: 'Login' });
		expect(loginButton).toHaveAttribute('href', '/login');
		expect(loginButton).toHaveClass(
			'ant-btn ant-btn-lg bg-slate-600 hover:bg-slate-700 text-white'
		);
	});

	it('Renders the Sign up button with the correct text', () => {
		render(<Home />);
		const signUpButton = screen.getByRole('link', { name: 'Sign up' });
		expect(signUpButton).toHaveTextContent('Sign up');
	});

	it('renders the Login button with the correct text', () => {
		render(<Home />);
		const loginButton = screen.getByRole('link', { name: 'Login' });
		expect(loginButton).toHaveTextContent('Login');
	});

	it('Peer Review Application title is correctly rendered', () => {
		render(<Home />);
		const title = screen.getByRole('heading', {
			level: 1,
			name: 'Peer Review Application by Learnification Technologies',
		});
		expect(title).toBeInTheDocument();
	});

	it('The Home page of the application is rendered within the Router', () => {
		render(
			<Router>
				<Home />
			</Router>
		);
		const title = screen.getByRole('heading', {
			level: 1,
			name: 'Peer Review Application by Learnification Technologies',
		});
		expect(title).toBeInTheDocument();
	});
});

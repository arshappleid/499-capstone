import React from 'react';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	findByTextContent,
} from '@testing-library/react';
import { Signup } from '../src/Components/login-signup/signup';
import { MemoryRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

jest.mock('axios');
window.matchMedia = jest.fn().mockImplementation((query) => {
	return {
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	};
});

describe('Signup', () => {
	beforeEach(() => {
		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		);
	});

	test('renders signup form', () => {
		const signupForm = screen.getByTestId('signup-form');
		expect(signupForm).toBeInTheDocument();
	});

	test('form item labels are rendered correctly', () => {
		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		);

		const firstNameLabel = screen.getByLabelText('First Name');
		expect(firstNameLabel).toBeInTheDocument();

		const middleNameLabel = screen.getByLabelText('Middle Name');
		expect(middleNameLabel).toBeInTheDocument();

		const lastNameLabel = screen.getByLabelText('Last Name');
		expect(lastNameLabel).toBeInTheDocument();

		const emailAddressLabel = screen.getByLabelText('Email Address');
		expect(emailAddressLabel).toBeInTheDocument();

		const instructorIdLabel = screen.getByLabelText('Employee ID');
		expect(instructorIdLabel).toBeInTheDocument();

		const passwordLabel = screen.getByLabelText('Password');
		expect(passwordLabel).toBeInTheDocument();

		const confirmPasswordLabel = screen.getByLabelText('Confirm Password');
		expect(confirmPasswordLabel).toBeInTheDocument();
	});
});

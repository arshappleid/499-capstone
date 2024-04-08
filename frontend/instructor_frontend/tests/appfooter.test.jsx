import React from 'react';
import { render, screen } from '@testing-library/react';
import AppFooter from '../src/Components/appfooter.jsx';
import '@testing-library/jest-dom/extend-expect';

describe('AppFooter Component', () => {
	it('Renders AppFooter component correctly', () => {
		render(<AppFooter />);
		const footerText = screen.getByText(
			/Learnification Technologies @ \d{4}\. All rights reserved\./i
		);
		expect(footerText).toBeInTheDocument();
	});

	it('It displays the current year in the footer text', () => {
		const currentYear = new Date().getFullYear();
		render(<AppFooter />);
		const footerText = screen.getByText(
			new RegExp(
				`Learnification Technologies @ ${currentYear}. All rights reserved.`,
				'i'
			)
		);
		expect(footerText).toBeInTheDocument();
	});

	it('Footer has the correct background color', () => {
		render(<AppFooter />);
		const footerElement = screen.getByText(
			/Learnification Technologies @ \d{4}\. All rights reserved\./i
		);
		expect(footerElement).toHaveClass('bg-customBlue');
	});

	it('Text in Footer has the correct text color', () => {
		render(<AppFooter />);
		const footerElement = screen.getByText(
			/Learnification Technologies @ \d{4}\. All rights reserved\./i
		);
		expect(footerElement).toHaveClass('text-white');
	});

	it('Footer is using the correct font we are using in the application', () => {
		render(<AppFooter />);
		const footerElement = screen.getByText(
			/Learnification Technologies @ \d{4}\. All rights reserved\./i
		);
		expect(footerElement).toHaveClass('font-futura');
	});
});

import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../src/Components/Footer';
import '@testing-library/jest-dom/extend-expect';

describe('Footer component', () => {
	it('Footer componentis renderedd correctly with the current year in the text', () => {
		const { getByText } = render(<Footer />);

		const currentYear = new Date().getFullYear();
		const expectedText = `Learnification Technology @ ${currentYear}. All rights reserved.`;
		const footerElement = getByText(expectedText);
		expect(footerElement).toBeInTheDocument();
	});

	it('Footer renders the component with the assigned CSS', () => {
		const { container } = render(<Footer />);
		const footerElement = container.querySelector('.bg-customBlue');
		expect(footerElement).toBeInTheDocument();
		expect(footerElement).toHaveClass('text-center');
		expect(footerElement).toHaveClass('font-futura');
		expect(footerElement).toHaveClass('text-[white]');
		expect(footerElement).toHaveClass('p-[10px]');
	});

	it('Footer renders the correct copyright text', () => {
		const { getByText } = render(<Footer />);
		const currentYear = new Date().getFullYear();
		const expectedText = `Learnification Technology @ ${currentYear}. All rights reserved.`;
		const copyrightElement = getByText(expectedText);
		expect(copyrightElement).toBeInTheDocument();
	});
});

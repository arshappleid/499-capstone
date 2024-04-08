import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CourseSettingCard from '../src/Components/CourseSetting/CourseSettingCard';

describe('CourseSettingCard', () => {
	it('The course settings card renders with the correct type', () => {
		const { getByText } = render(
			<CourseSettingCard type="Math" color="#123456" value={10} />
		);
		expect(getByText('Math')).toBeInTheDocument();
	});
	it('The component is rendered correctly', () => {
		const { getByText } = render(
			<CourseSettingCard type="Math" color="#123456" value={10} />
		);

		const typeElement = getByText('Math');

		expect(typeElement).toBeInTheDocument();
		expect(typeElement).toHaveTextContent('Math');
	});
	it('The Course Settings Card renders correctly with empty props', () => {
		const { getByTestId } = render(<CourseSettingCard />);

		const typeElement = getByTestId('course-type');

		expect(typeElement).toBeInTheDocument();
		expect(typeElement.textContent).toBe('');
	});

	it('The Card changes background color on mouse enter and restores on mouse leave', () => {
		const { container } = render(
			<CourseSettingCard type="Science" color="#789ABC" value={20} />
		);
		const cardElement = container.firstChild;

		fireEvent.mouseEnter(cardElement);
		expect(cardElement.style.backgroundColor).toBe('rgb(9, 72, 114)');

		fireEvent.mouseLeave(cardElement);
		expect(cardElement.style.backgroundColor).toBe('rgb(120, 154, 188)');
	});
});

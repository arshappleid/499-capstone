import { render, screen } from '@testing-library/react';
import React from 'react';
import CourseCard from '../src/Components/dashboard/coursecard';

const mockCourse = {
	CourseName: 'Introduction to Programming',
	CourseCode: 'CS101',
	CourseSemester: 'Fall',
	CourseYear: '2023',
	CourseTerm: 'A',
};

describe('CourseCard', () => {
	test('renders course name correctly', () => {
		render(<CourseCard course={mockCourse} />);
		const courseNameElement = screen.getByText(
			'Introduction to Programming'
		);
		expect(courseNameElement).toBeInTheDocument();
	});

	test('renders course code correctly', () => {
		render(<CourseCard course={mockCourse} />);
		const courseCodeElement = screen.getByText('CS101');
		expect(courseCodeElement).toBeInTheDocument();
	});

	test('trims course name if it exceeds 40 characters', () => {
		const longCourseName =
			'This is a very long course name that exceeds 40 characters';
		const courseWithLongName = {
			...mockCourse,
			CourseName: longCourseName,
		};
		render(<CourseCard CourseName={courseWithLongName} />);
		const trimmedCourseName = screen.getByText(
			'This is a very long course name...'
		);
		expect(trimmedCourseName).toBeInTheDocument();
	});

	test('renders semester, year, and term correctly', () => {
		render(<CourseCard course={mockCourse} />);
		const semesterInfo = screen.getByText('FALL 2023 A');
		expect(semesterInfo).toBeInTheDocument();
	});

	test('renders card with appropriate styling', () => {
		render(<CourseCard course={mockCourse} />);
		const cardElement = screen.getByRole('card');
		expect(cardElement).toHaveClass('bg-blue-200');
		expect(cardElement).toHaveClass('border-2');
		expect(cardElement).toHaveClass('border-black');
		expect(cardElement).toHaveClass('rounded-lg');
		expect(cardElement).toHaveClass('text-white');
	});
	test('renders the card as hoverable', () => {
		render(<CourseCard course={course} />);
		const card = screen.getByRole('card');
		expect(card).toHaveClass('hoverable');
	});

	test('renders the card with correct actions', () => {
		render(<CourseCard course={course} />);
		const actions = screen.getAllByRole('action');
		expect(actions).toHaveLength(1);
		expect(actions[0]).toHaveTextContent(
			`${course.CourseSemester.toUpperCase()} ${course.CourseYear.toUpperCase()} ${course.CourseTerm.toUpperCase()}`
		);
	});

	test('renders the card with correct hoverable actions', () => {
		render(<CourseCard course={course} />);
		const actions = screen.getAllByRole('action');
		expect(actions[0]).toHaveClass('hoverable');
	});
});

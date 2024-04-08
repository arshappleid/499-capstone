import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StudentListPage } from '../src/Components/course-page/studentListPage.js';
import AppFooter from '../src/Components/appfooter.jsx';

jest.mock('axios');

window.matchMedia = jest.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
}));
describe('StudentListPage', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<StudentListPage />
			</MemoryRouter>
		);
	});
	it('The Course name is correctly displayed', () => {
		const localStorageMock = {
			getItem: jest.fn().mockReturnValue('Sample Course Name'),
		};
		Object.defineProperty(window, 'localStorage', {
			value: localStorageMock,
		});

		const { getByText } = render(
			<MemoryRouter>
				<StudentListPage />
			</MemoryRouter>
		);
		expect(getByText('Sample Course Name')).toBeInTheDocument();
	});

	it('The Navigation Bar is correctly rendered', () => {
		const { getByRole } = render(
			<MemoryRouter>
				<StudentListPage />
			</MemoryRouter>
		);
		expect(getByRole('navigation')).toBeInTheDocument();
	});

	it('The BreadCrumb is correctly rendered.', () => {
		const { getAllByText } = render(
			<MemoryRouter>
				<StudentListPage />
			</MemoryRouter>
		);
		const DashboardElements = getAllByText('Dashboard');
		expect(DashboardElements.length).toBeGreaterThan(0);

		const CourseElements = getAllByText('Course: Sample Course Name');
		expect(CourseElements.length).toBeGreaterThan(0);

		const StudentsElements = getAllByText('Students');
		expect(StudentsElements.length).toBeGreaterThan(0);
	});

	it('renders the footer with AppFooter component', () => {
		const { getByTestId } = render(
			<MemoryRouter>
				<StudentListPage />
			</MemoryRouter>
		);
		const footerElement = getByTestId('footer');
		expect(footerElement).toBeInTheDocument();
	});
});

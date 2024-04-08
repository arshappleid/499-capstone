import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import CourseSetting from '../src/Components/CourseSetting/CourseSetting';
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
jest.mock('axios');

window.matchMedia = jest.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
}));

describe('CourseSetting', () => {
	test('renders course settings and handles course visibility', async () => {
		render(
			<BrowserRouter>
				<CourseSetting />
			</BrowserRouter>
		);

		const visibilityToggle = screen.getByTestId('course-visibility-toggle');
		expect(visibilityToggle).toBeInTheDocument();
	});
	test('renders course settings cards', () => {
		render(
			<BrowserRouter>
				<CourseSetting />
			</BrowserRouter>
		);

		const enrollStudentsCard = screen.getByText(/Enroll Students/i);
		expect(enrollStudentsCard).toBeInTheDocument();

		const createStudentGroupsCard = screen.getByText(
			/Create Student Groups/i
		);
		expect(createStudentGroupsCard).toBeInTheDocument();

		const createAssignmentsCard = screen.getByText(/Create Assignments/i);
		expect(createAssignmentsCard).toBeInTheDocument();

		const createEvaluationFormsCard = screen.getByText(
			/Create Evaluation Forms/i
		);
		expect(createEvaluationFormsCard).toBeInTheDocument();
	});
	test('Renders course visibility correctly when course_visibility is element set True', () => {
		localStorage.setItem('course_visibility', 'true');
		render(
			<BrowserRouter>
				<CourseSetting />
			</BrowserRouter>
		);
		const visibilityElement = screen.getByTestId('course-visibility');

		expect(visibilityElement).toHaveClass(
			'flex w-full h-10 justify-center items-center bg-green-200'
		);
		const expectedContent =
			'The course is published to the student dashboard';
		expect(visibilityElement).toHaveTextContent(expectedContent);
	});
	test('Renders course visibility correctly when course_visibility is element set False', () => {
		localStorage.setItem('course_visibility', 'false');
		render(
			<BrowserRouter>
				<CourseSetting />
			</BrowserRouter>
		);
		const visibilityElement = screen.getByTestId('course-visibility');

		expect(visibilityElement).toHaveClass(
			'flex w-full h-10 justify-center items-center bg-red-200'
		);
		const expectedContent =
			'The course is not published to the student dashboard';
		expect(visibilityElement).toHaveTextContent(expectedContent);
	});
	test('updates course visibility and shows success message', async () => {
		const mockResponse = {
			data: {
				status: 'success',
				message: 'Course visibility updated',
				data: {
					course_visibility: true,
				},
			},
		};

		axios.post.mockResolvedValue(mockResponse);

		render(
			<BrowserRouter>
				<CourseSetting />
			</BrowserRouter>
		);
		const visibilityToggle = screen.getByTestId('course-visibility-toggle');
		fireEvent.click(visibilityToggle);

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalled();
			expect(axios.post).toHaveBeenCalledWith(
				BACKEND_URL + 'instructor/instructorsetcoursevisibiliy',
				expect.objectContaining({
					instructor_id: null,
					course_id: null,
					course_visibility: true,
				})
			);
		});

		const successMessage = screen.getByText(
			'The course is now visible to the students.'
		);
		expect(successMessage).toBeInTheDocument();
	});

	test('updates course visibility and shows error message', async () => {
		const mockResponse = {
			data: {
				status: 'error',
				message: 'Failed to update course visibility',
				data: null,
			},
		};

		axios.post.mockResolvedValue(mockResponse);

		render(
			<BrowserRouter>
				<CourseSetting />
			</BrowserRouter>
		);

		const visibilityToggle = screen.getByTestId('course-visibility-toggle');
		fireEvent.click(visibilityToggle);

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalled();
			expect(axios.post).toHaveBeenCalledWith(
				BACKEND_URL + 'instructor/instructorsetcoursevisibiliy',
				expect.objectContaining({
					instructor_id: null,
					course_id: null,
					course_visibility: true,
				})
			);
		});

		const errorMessage = screen.getByText('Something Went Wrong!');
		expect(errorMessage).toBeInTheDocument();
	});
	test('updates course visibility and shows success message', async () => {
		const response = {
			data: {
				status: 'success',
				data: {
					course_visibility: true,
				},
			},
		};
		axios.post.mockResolvedValue(response);

		render(
			<BrowserRouter>
				<CourseSetting />
			</BrowserRouter>
		);

		const visibilityToggle = screen.getByTestId('course-visibility-toggle');

		fireEvent.click(visibilityToggle);

		await screen.findByText('The course is now visible to the students.');

		expect(
			screen.getByText('The course is now visible to the students.')
		).toBeInTheDocument();
		expect(screen.getByText('Course Posted!')).toBeInTheDocument();

		expect(axios.post).toHaveBeenCalled();
		expect(axios.post).toHaveBeenCalledWith(
			BACKEND_URL + 'instructor/instructorsetcoursevisibiliy',
			{
				instructor_id: null,
				course_id: null,
				course_visibility: true,
			}
		);
	});
});

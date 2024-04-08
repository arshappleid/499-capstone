import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { useState } from 'react';
import StudentTable from '../src/Components/course-page/studentTable';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, Input, Space, Tooltip, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from '@mui/material';

jest.mock('axios');

describe('StudentTable', () => {
	beforeEach(() => {
		axios.post.mockResolvedValue({
			data: {
				data: [
					{
						STUDENT_ID: 1,
						FIRST_NAME: 'John',
						MIDDLE_NAME: 'Doe',
						LAST_NAME: 'Smith',
						EMAIL: 'john.doe@example.com',
						GROUP_NAME: 'Group A',
					},
				],
			},
		});
	});
	test('The StudentTable component is correctly ', () => {
		render(
			<Router>
				<StudentTable />
			</Router>
		);
	});
	test('The enrollment message and enroll students button are correctly rendered', () => {
		render(
			<Router>
				<StudentTable />
			</Router>
		);

		const enrollmentMessage = screen.getByText(
			'Currently there are no students enrolled in this course'
		);
		expect(enrollmentMessage).toBeInTheDocument();

		const enrollStudentsButton = screen.getByRole('button', {
			name: '+ Enroll Students',
		});
		expect(enrollStudentsButton).toBeInTheDocument();
	});
	test('renders student information section with search input and enroll students button', () => {
		render(
			<Router>
				<Divider>
					<Space>
						<div>
							<p>Student Information</p>
							<Input
								bordered={true}
								placeholder="Search here..."
								className="border-slate-300 mr-2 mb-6 mt-4 font-futura text-base w-96"
								size="large"
								onSearch={(e) => {
									searchText = e.target.value;
									applyFilter(searchText);
								}}
								onPressEnter={(e) => {
									searchText = e.target.value;
									applyFilter(searchText);
								}}
								onChange={(e) => {
									searchText = e.target.value;
									applyFilter(searchText);
								}}
							/>
						</div>
						<div className="flex ml-40 ">
							<Button
								type="primary"
								className="bg-blue-400 text-white hover:text-white">
								<span className="font-futura text-base">
									+ Enroll Students
								</span>
							</Button>
						</div>
					</Space>
				</Divider>
			</Router>
		);

		const studentInformationTitle = screen.getByText('Student Information');
		expect(studentInformationTitle).toBeInTheDocument();

		const searchInput = screen.getByPlaceholderText('Search here...');
		expect(searchInput).toBeInTheDocument();

		const enrollStudentsButton = screen.getByText('+ Enroll Students');
		expect(enrollStudentsButton).toBeInTheDocument();
	});
	test('Renders no student found if we do not get any data from backend', () => {
		render(
			<Router>
				<StudentTable />
			</Router>
		);
		const studentInformationTitle = screen.getByText(
			'Currently there are no students enrolled in this course'
		);
		expect(studentInformationTitle).toBeInTheDocument();
	});
});

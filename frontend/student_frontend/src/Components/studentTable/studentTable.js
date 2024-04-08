// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).
import { Button, Input, Space, Tooltip, Divider, Modal } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

function StudentTable() {
	const [loading, isLoading] = useState(true);
	const [student, setStudent] = useState(null);
	const [originalStudent, setOriginalStudent] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const [sortedData, setSortedData] = useState();
	const [sortColumn, setSortColumn] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const [networkErrorModalVisible, setNetworkErrorModalVisible] =
		useState(false);
	const [networkErrorMessage, setNetworkErrorMessage] = useState('');
	const handleNetworkErrorModalClose = () => {
		setNetworkErrorModalVisible(false);
		setNetworkErrorMessage('');
	};
	const NetworkErrorModal = () => {
		return (
			<Modal
				open={networkErrorModalVisible}
				onCancel={handleNetworkErrorModalClose}
				title={
					<span className="text-center font-futura text-2xl">
						Network Error
					</span>
				}
				footer={[
					<Button key="close" onClick={handleNetworkErrorModalClose}>
						Close
					</Button>,
				]}>
				<p className="font-futura text-base">{networkErrorMessage}</p>
			</Modal>
		);
	};
	const courseId = useSelector((state) => state.courseId);
	const courseName = useSelector((state) => state.courseName);
	const courseCode = useSelector((state) => state.courseCode);
	let searchText = '';
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				isLoading(true);
				const requestData = { courseID: courseId };
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'student/getcoursestudentlist',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;

				if (status === 'success') {
					const allstudents = response.data.data.map((student) => {
						if (student.student_middle_name === null) {
							student.student_middle_name = '';
						}
						if (student.student_last_name === null) {
							student.student_last_name = '';
						}
						return {
							studentid: student.studentID,
							studentname:
								student.student_first_name +
								' ' +
								student.student_middle_name +
								' ' +
								student.student_last_name,
							studentemail: student.email,
						};
					});

					setStudent(allstudents);
					setOriginalStudent(allstudents);
					setSortedData(allstudents);
					isLoading(false);
				} else {
					setStudent([]);
					setOriginalStudent([]);
					setSortedData([]);
					isLoading(false);
				}
			} catch (error) {
				isLoading(false);
				if (error.isAxiosError && error.response === undefined) {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				} else {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
				}
			}
		};
		fetchStudents();
	}, []);

	const applyFilter = (value) => {
		if (value === '') {
			setStudent(originalStudent);
			setSortedData(originalStudent);
		} else {
			const filteredValue = originalStudent.filter((student) =>
				student.studentname.toLowerCase().includes(value.toLowerCase())
			);

			setPage(0);
			setStudent(filteredValue);
			setSortedData(filteredValue);
		}
	};
	const handleSort = (column) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortColumn(column);
			setSortDirection('asc');
		}
		sortData(column);
	};
	const sortData = (column) => {
		const sorted = [...sortedData].sort((a, b) => {
			if (a[column] < b[column]) return sortDirection === 'asc' ? 1 : -1;
			if (a[column] > b[column]) return sortDirection === 'asc' ? -1 : 1;
			return 0;
		});
		setSortedData(sorted);
	};
	return (
		<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll ">
			{loading && (
				<h3 className="w-full font-futura text-lg text-center">
					<p className="font-futura flex items-center justify-center">
						<LoadingOutlined spin />
					</p>
					<br /> Loading Student Information...
				</h3>
			)}
			{!loading && !originalStudent?.length ? (
				<div>
					<h3 className="w-full mx-8 text-center font-futura text-xl">
						Currently there are no students enrolled in this course
					</h3>
				</div>
			) : null}
			{!loading && originalStudent?.length ? (
				<header className="outline-offset-2 outline-1 rounded-lg border p-4 flex flex-col">
					<Divider className="text-3xl font-futura mx-auto w-full rounded-lg bg-blue-200">
						<Space className="flex justify-between">
							<div className="flex">
								<p className="text-xl font-semibold font-futura mt-6 mr-6">
									Student Information
								</p>
								<Input
									bordered={true}
									placeholder="Search using Student Name"
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
								<div className=" justify-center mt-4 mr-20">
									<Tooltip
										title={
											<span className="text-base font-futura">
												Search the table using Student
												Name
											</span>
										}>
										<InfoCircleOutlined />
									</Tooltip>
								</div>
							</div>
						</Space>
					</Divider>
					<div className="overflow-x-auto w-full font-futura ">
						<TableContainer className="font-futura rounded-lg border-2 border-slate-200">
							<Table>
								<TableHead className="bg-slate-200">
									<TableRow>
										<TableCell
											align="left"
											className="mr-10">
											<Tooltip
												title={
													sortColumn ===
													'studentname' ? (
														<span className="text-base font-futura">
															Sort by{' '}
															{sortDirection ===
															'asc'
																? 'Descending Order'
																: 'Ascending Order'}
														</span>
													) : (
														<span className="text-base font-futura">
															Sort rows by Student
															Name
														</span>
													)
												}>
												<TableSortLabel
													active={
														sortColumn ===
														'studentname'
													}
													direction={
														sortColumn ===
														'studentname'
															? sortDirection
															: 'asc'
													}>
													<div
														className="flex justify-center items-center ml-4 "
														onClick={() =>
															handleSort(
																'studentname'
															)
														}>
														<span className="font-futura text-base font-semibold">
															Student Name
														</span>
													</div>
												</TableSortLabel>
											</Tooltip>
											<Tooltip
												title={
													<span className="text-base font-futura">
														Click on the column name
														to sort the rows by
														Student Name
													</span>
												}>
												<InfoCircleOutlined />
											</Tooltip>
										</TableCell>
										<TableCell align="left">
											<span className="font-futura text-base font-semibold">
												Section
											</span>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sortedData.length === 0 ? (
										<TableRow className="bg-white">
											<TableCell
												colSpan={4}
												align="center">
												<span className="font-futura text-base">
													No student found
												</span>
											</TableCell>
										</TableRow>
									) : (
										sortedData
											.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											.map((row) => (
												<TableRow
													className="bg-white"
													key={row.studentid}>
													<TableCell
														align="left"
														className=" w-6/12">
														<span className="font-futura text-base ml-4 mr-10">
															{row.studentname}
														</span>
													</TableCell>
													<TableCell align="left">
														<span className="font-futura text-base mr-10">
															{courseName}{' '}
															{courseCode}
														</span>
													</TableCell>
												</TableRow>
											))
									)}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							// rowsPerPageOptions={[5, 10, 25]}
							rowsPerPageOptions={[
								{
									label: (
										<span className="font-futura text-base">
											5
										</span>
									),
									value: 5,
								},
								{
									label: (
										<span className="font-futura text-base">
											10
										</span>
									),
									value: 10,
								},
								{
									label: (
										<span className="font-futura text-base">
											25
										</span>
									),
									value: 25,
								},
							]}
							component="div"
							count={sortedData.length}
							rowsPerPage={rowsPerPage}
							labelRowsPerPage={
								<span className="text-base font-futura">
									Rows per page
								</span>
							}
							labelDisplayedRows={({ from, to, count }) => {
								return (
									<span className="text-base font-futura">
										{from}-{to} of {count}
									</span>
								);
							}}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</div>
				</header>
			) : null}
			<NetworkErrorModal />
		</div>
	);
}

export default StudentTable;

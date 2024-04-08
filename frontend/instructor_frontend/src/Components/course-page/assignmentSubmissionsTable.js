// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { Layout, Modal, Button, Divider, Space, Input, Tooltip } from 'antd';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	TableSortLabel,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

export function AssignmentSubmissionsTable() {
	const [loading, setLoading] = useState(false);
	const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
	let searchText = '';
	const instructor_id = useSelector((state) => state.instructorId);
	const course_id = useSelector((state) => state.courseId);
	const assignment_id = useSelector((state) => state.assignmentId);
	const assignment_name = useSelector((state) => state.assignmentName);
	const [assignment, setAssignment] = useState([]);
	const [originalAssignments, setOriginalAssignments] = useState([]);

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
				title="Network Error"
				footer={[
					<Button key="close" onClick={handleNetworkErrorModalClose}>
						Close
					</Button>,
				]}>
				<p>{networkErrorMessage}</p>
			</Modal>
		);
	};

	const fetchAssignment = async () => {
		try {
			setLoading(true);
			const requestData = {
				instructor_id: instructor_id,
				course_id: course_id,
				assignment_id: assignment_id,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getassignmentcompletionstatus',
				requestData,
				{
					headers: headers,
				}
			);
			const status = response.data.status;

			if (status === 'success') {
				const allAssignmentRecords =
					response.data.studentCompletionStatus.map((assignment) => {
						if (
							assignment.student_middle_name === null ||
							assignment.student_middle_name === undefined
						)
							assignment.student_middle_name = '';
						if (
							assignment.student_last_name === null ||
							assignment.student_last_name === undefined
						)
							assignment.student_last_name = '';
						return {
							studentId: assignment.student_id,
							studentName:
								assignment.student_first_name +
								' ' +
								assignment.student_middle_name +
								' ' +
								assignment.student_last_name,
							studentStatus: assignment.status,
							studentLink: assignment.submission_link,
						};
					});

				setAssignment(allAssignmentRecords);
				setSortedData(allAssignmentRecords);
				setOriginalAssignments(allAssignmentRecords);
			} else {
				setAssignment();
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			if (error.isAxiosError && error.response === undefined) {
				setNetworkErrorMessage(error.message);
				setNetworkErrorModalVisible(true);
			} else {
				setNetworkErrorMessage(error.message);
				setNetworkErrorModalVisible(true);
			}
		}
	};

	useEffect(() => {
		fetchAssignment();
		return;
	}, []);

	const applyFilter = (value) => {
		if (value === '') {
			setAssignment(originalAssignments);
			setSortedData(originalAssignments);
		} else {
			const filteredValue = originalAssignments.filter(
				(assignment) =>
					assignment.studentName
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					String(assignment.studentId).includes(value.toLowerCase())
			);
			setPage(0);
			setAssignment(filteredValue);
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
		<div className="flex justify-center items-center w-full">
			<div className="flex rounded-lg w-auto outline-offset-2 outline-1 justify-items-center content-center self-center overflow-scroll">
				<header className="outline-offset-2 outline-1 rounded border p-4 flex flex-col">
					<Divider className="text-3xl font-futura mx-auto w-full rounded-lg bg-blue-200">
						<Space className="flex justify-between">
							<div className="flex">
								<p className="text-xl font-semibold font-futura mt-6 mr-6">
									Assignment Submissions
								</p>
								<Input
									bordered={true}
									placeholder="Search using Student ID and Student Name"
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
								<div className=" justify-cente mt-4 mr-2">
									<Tooltip
										title={
											<span className="text-base font-futura">
												Search using Student ID and
												Student Name
											</span>
										}>
										<InfoCircleOutlined />
									</Tooltip>
								</div>
							</div>
						</Space>
					</Divider>
					<div className="overflow-x-auto font-futura w-full">
						{loading && (
							<h3 className="w-full font-futura text-lg text-center">
								<p className="font-futura flex items-center justify-center">
									<LoadingOutlined spin />
								</p>
								<br /> Loading Student Submissions...
							</h3>
						)}
						{!loading && sortedData?.length > 0 ? (
							<>
								<TableContainer
									component={Paper}
									className="font-futura rounded-lg border-2 border-slate-200">
									<Table className="table-responsive">
										<TableHead className="bg-slate-200">
											<TableRow>
												<TableCell align="left">
													<Tooltip
														title={
															sortColumn ===
															'studentName' ? (
																<span className="text-base font-futura">
																	Sort by{' '}
																	{sortDirection ===
																	'asc'
																		? 'Descending Order'
																		: 'Ascending Order'}
																</span>
															) : (
																<span className="text-base font-futura">
																	Sort rows by
																	Student Name
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'studentName'
															}
															direction={
																sortColumn ===
																'studentName'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center"
																onClick={() =>
																	handleSort(
																		'studentName'
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
																Click on the
																column name to
																sort the rows by
																Student Name
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>
												<TableCell
													align="left"
													className="mr-10">
													<Tooltip
														title={
															sortColumn ===
															'studentId' ? (
																<span className="text-base font-futura">
																	Sort by{' '}
																	{sortDirection ===
																	'asc'
																		? 'Descending Order'
																		: 'Ascending Order'}
																</span>
															) : (
																<span className="text-base font-futura">
																	Sort rows by
																	Student Id
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'studentId'
															}
															direction={
																sortColumn ===
																'studentId'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center "
																onClick={() =>
																	handleSort(
																		'studentId'
																	)
																}>
																<span className="font-futura text-base font-semibold">
																	Student Id
																</span>
															</div>
														</TableSortLabel>
													</Tooltip>
													<Tooltip
														title={
															<span className="text-base font-futura">
																Click on the
																column name to
																sort the rows by
																Student Id
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>

												<TableCell
													align="left"
													className="bg-slate-200">
													<span className="font-futura font-extrabold text-base">
														Submission Status
													</span>
												</TableCell>
												<TableCell
													align="left"
													className="bg-slate-200">
													<span className="font-futura font-extrabold text-base">
														Submission Link
													</span>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{!sortedData ? (
												<TableRow className="bg-white">
													<TableCell
														colSpan={4}
														align="center">
														<span className="font-futura text-base">
															There are no
															students in this
															course.
														</span>
													</TableCell>
												</TableRow>
											) : (
												sortedData
													.slice(
														page * rowsPerPage,
														page * rowsPerPage +
															rowsPerPage
													)
													.map((assignment) => {
														return (
															<TableRow
																className="bg-white"
																key={
																	assignment.studentId
																}>
																<TableCell align="left">
																	<span className="text-base font-futura">
																		{
																			assignment.studentName
																		}
																	</span>
																</TableCell>
																<TableCell align="left">
																	<span className="text-base font-futura">
																		{
																			assignment.studentId
																		}
																	</span>
																</TableCell>
																{assignment.studentStatus ===
																'complete' ? (
																	<TableCell align="left">
																		<span className="text-base font-futura text-green-400">
																			Complete
																		</span>
																	</TableCell>
																) : (
																	<TableCell align="left">
																		<span className="text-base font-futura text-red-400">
																			Incomplete
																		</span>
																	</TableCell>
																)}
																<TableCell align="left">
																	{assignment.studentStatus ===
																	'complete' ? (
																		<span className="text-base font-futura">
																			<Button
																				className="p-0"
																				type="link"
																				onClick={() =>
																					window.open(
																						assignment.studentLink,
																						'_blank'
																					)
																				}>
																				<span className="text-base font-futura">
																					View
																					Submission
																				</span>
																			</Button>
																		</span>
																	) : null}
																</TableCell>
															</TableRow>
														);
													})
											)}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
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
									count={sortedData?.length}
									rowsPerPage={rowsPerPage}
									labelRowsPerPage={
										<span className="text-base font-futura">
											Rows per page
										</span>
									}
									labelDisplayedRows={({
										from,
										to,
										count,
									}) => {
										return (
											<span className="text-base font-futura">
												{from}-{to} of {count}
											</span>
										);
									}}
									page={page}
									onPageChange={handleChangePage}
									onRowsPerPageChange={
										handleChangeRowsPerPage
									}
								/>
							</>
						) : loading ? null : (
							<TableContainer className="font-futura rounded-lg border-2 border-slate-200">
								<Table>
									<TableHead className="bg-slate-200">
										<TableRow>
											<TableCell align="left">
												<div className="flex justify-center items-center ml-16">
													<span className="font-futura text-base font-semibold">
														Student Name
													</span>
												</div>
											</TableCell>
											<TableCell
												align="left"
												className="mr-10">
												<div className="flex justify-center items-center ml-4 ">
													<span className="font-futura text-base font-semibold">
														Student Id
													</span>
												</div>
											</TableCell>
											<TableCell align="left">
												<div className="flex justify-center items-center ml-12">
													<span className="font-futura text-base font-semibold">
														Assignment Completion
														Status
													</span>
												</div>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow className="bg-white">
											<TableCell
												colSpan={3}
												align="center">
												<span className="font-futura text-base">
													No student found
												</span>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</div>
					<NetworkErrorModal />
				</header>
			</div>
		</div>
	);
}

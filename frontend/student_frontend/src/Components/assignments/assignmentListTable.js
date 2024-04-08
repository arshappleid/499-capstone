// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { Button, Divider, Input, Modal, Tooltip, Space } from 'antd';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { TableSortLabel } from '@mui/material';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateAssignmentId, updateAssignmentName } from '../store/appReducer';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AssignmentListTable() {
	const [loading, isLoading] = useState(true);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const studentId = useSelector((state) => state.studentId);
	const courseId = useSelector((state) => state.courseId);

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

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	let searchText = '';
	const [assignments, setAssignments] = useState([]);
	const [originalAssignments, setOriginalAssignments] = useState([]);
	const [sortedData, setSortedData] = useState([]);
	const [sortColumn, setSortColumn] = useState([]);
	const [sortDirection, setSortDirection] = useState('asc');

	const fetchAssignments = async () => {
		try {
			isLoading(true);

			const requestData = { student_id: studentId, course_id: courseId };
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getassignmentliststatus',
				requestData,
				{ headers: headers }
			);

			const status = response.data.status;
			if (status === 'success') {
				const allAssignments = response.data.assignments.map(
					(assignments) => {
						return {
							assignment_id: assignments.assignment_id,
							assignment_name: assignments.assignment_name,
							assignment_deadline: assignments.deadline,
							assignment_availablefrom: assignments.avaliableFrom,
							assignment_availableto: assignments.avaliableTo,
							assignment_submission_status:
								assignments.assignment_completed,
							assignment_sharefeedback: assignments.shareFeedback,
						};
					}
				);

				setAssignments(allAssignments);
				setOriginalAssignments(allAssignments);
				setSortedData(allAssignments);
			} else {
				setAssignments([]);
				setOriginalAssignments([]);
				setSortedData([]);
			}
			isLoading(false);
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
	useEffect(() => {
		fetchAssignments();
	}, []);

	const applyFilter = (value) => {
		if (value === '') {
			setAssignments(originalAssignments);
			setSortedData(originalAssignments);
			return;
		} else {
			const filteredValue = originalAssignments.filter((assignments) =>
				assignments.assignment_name
					.toLowerCase()
					.includes(value.toLowerCase())
			);
			setPage(0);
			setAssignments(filteredValue);
			setSortedData(filteredValue);
			return;
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

	const assignmentButtonHandler = (assignmentId, assignmentName) => {
		dispatch(updateAssignmentId(assignmentId));
		dispatch(updateAssignmentName(assignmentName));
		navigate('/assignmentsubmissionpage');
	};

	const feedbackButtonHandler = (assignmentId, assignmentName) => {
		dispatch(updateAssignmentId(assignmentId));
		dispatch(updateAssignmentName(assignmentName));
		navigate('/assignmentassessmentfeedbackpage');
	};

	return (
		<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll ">
			{loading && (
				<h3 className="w-full font-futura text-lg text-center">
					<p className="font-futura flex items-center justify-center">
						<LoadingOutlined spin />
					</p>
					<br /> Loading Assignments Information...
				</h3>
			)}
			{!loading ? (
				<header className="outline-offset-2 outline-1 rounded-lg border p-4 flex flex-col ">
					<Divider className="mx-auto rounded-lg w-full font-futura bg-blue-200">
						<Space>
							<div className="flex flex-row flex-grow ">
								<p className="text-xl font-semibold font-futura mt-6 mr-6">
									Assignments Information
								</p>
								<Input
									bordered={true}
									placeholder="Search using Assignment Name"
									className="border-slate-300 mr-2 mb-6 mt-6 font-futura text-base w-96 h-8"
									//value={searchedText}
									size="large"
									onSearch={(e) => {
										searchText = e.target.value;
										applyFilter(searchText);
									}}
									onChange={(e) => {
										searchText = e.target.value;
										applyFilter(searchText);
									}}
									onPressEnter={(e) => {
										//setSearchText(e.target.value);
										searchText = e.target.value;
										applyFilter(searchText);
									}}
								/>
								<div className=" justify-center mt-6 mr-2">
									<Tooltip
										title={
											<span className="text-base font-futura">
												Search the table using
												Assignment Name
											</span>
										}>
										<InfoCircleOutlined />
									</Tooltip>
								</div>
							</div>
						</Space>
					</Divider>
					<div className="flex justify-center w-full">
						<div className="w-full">
							<TableContainer
								className="font-futura rounded-lg border-2 border-slate-200"
								component={Paper}>
								<Table aria-label="simple table">
									<TableHead className="bg-slate-200">
										<TableCell
											className="w-auto "
											align="left">
											<Tooltip
												title={
													sortColumn ===
													'assignment_name' ? (
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
															Assignment Name
														</span>
													)
												}>
												<TableSortLabel
													active={
														sortColumn ===
														'assignment_name'
													}
													direction={
														sortColumn ===
														'assignment_name'
															? sortDirection
															: 'asc'
													}>
													<div
														className="flex justify-center items-center "
														onClick={() =>
															handleSort(
																'assignment_name'
															)
														}>
														<span className="font-futura  text-base font-semibold">
															Assignment Name
														</span>
													</div>
												</TableSortLabel>
											</Tooltip>
											<Tooltip
												title={
													<span className="text-base font-futura">
														Click on the column name
														to sort the rows by
														Assignment Name
													</span>
												}>
												<InfoCircleOutlined />
											</Tooltip>
										</TableCell>

										<TableCell
											className="w-auto "
											align="left">
											<span className="font-futura  text-base font-semibold">
												Assignment Deadline
											</span>
										</TableCell>

										<TableCell
											className="w-auto "
											align="left">
											<span className="font-futura text-base font-semibold">
												Available From
											</span>
										</TableCell>

										<TableCell
											className="w-auto "
											align="left">
											<span className="font-futura  text-base font-semibold">
												Available Until
											</span>
										</TableCell>

										<TableCell
											className="w-auto "
											align="left">
											<span className="font-futura text-base font-semibold">
												Submission Status
											</span>
										</TableCell>
										<TableCell
											className="w-auto "
											align="left">
											<span className="font-futura text-base font-semibold">
												View Grade/Feedback
											</span>
										</TableCell>
									</TableHead>
									<TableBody>
										{sortedData.length === 0 ? (
											<TableRow className="bg-white">
												<TableCell
													colSpan={6}
													align="center">
													<span className="font-futura text-base">
														No assignments found
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
													const options = {
														timeZone:
															'America/Los_Angeles',
														hour12: true,
														hour: 'numeric',
														minute: 'numeric',
													};
													const currentTime =
														new Date();
													const deadlineDate =
														new Date(
															assignment.assignment_deadline
														);
													const availableFromDate =
														new Date(
															assignment.assignment_availablefrom
														);
													const availableToDate =
														new Date(
															assignment.assignment_availableto
														);
													const formattedAvailableFromDate =
														availableFromDate.toDateString();
													const formattedAvailableFromTime =
														availableFromDate.toLocaleTimeString(
															'en-US',
															options
														);
													const formattedAvailableToDate =
														availableToDate.toDateString();
													const formattedAvailableToTime =
														availableToDate.toLocaleTimeString(
															'en-US',
															options
														);
													const formattedDate =
														deadlineDate.toDateString();

													const formattedTime =
														deadlineDate.toLocaleTimeString(
															'en-US',
															options
														);
													return (
														<TableRow
															className="bg-white"
															key={
																assignment.assignment_id
															}
															sx={{
																'&:last-child td, &:last-child th':
																	{
																		border: 0,
																	},
															}}>
															<TableCell
																align="left"
																component="th"
																scope="row">
																{currentTime <
																	availableFromDate ||
																currentTime >
																	availableToDate ? (
																	<span className="font-futura text-base ">
																		{
																			assignment.assignment_name
																		}
																	</span>
																) : (
																	<Button
																		type="link"
																		className="p-0"
																		onClick={() =>
																			assignmentButtonHandler(
																				assignment.assignment_id,
																				assignment.assignment_name
																			)
																		}>
																		<span className="font-futura text-base ">
																			{
																				assignment.assignment_name
																			}
																		</span>
																	</Button>
																)}
															</TableCell>
															<TableCell align="left">
																<span
																	className={`font-futura text-base ${
																		currentTime >
																		deadlineDate
																			? 'text-red-500'
																			: 'text-black'
																	}`}>
																	{
																		formattedDate
																	}{' '}
																	{
																		formattedTime
																	}
																</span>
															</TableCell>
															<TableCell align="left">
																<span
																	className={`font-futura text-base `}>
																	{
																		formattedAvailableFromDate
																	}{' '}
																	{
																		formattedAvailableFromTime
																	}
																</span>
															</TableCell>
															<TableCell align="left">
																<span
																	className={`font-futura text-base `}>
																	{
																		formattedAvailableToDate
																	}{' '}
																	{
																		formattedAvailableToTime
																	}
																</span>
															</TableCell>
															<TableCell align="left">
																{assignment.assignment_submission_status ===
																true ? (
																	<span className="font-futura text-base  text-green-500">
																		Submitted
																	</span>
																) : (
																	<span className="font-futura text-base  text-red-500">
																		Not
																		Submitted
																	</span>
																)}
															</TableCell>
															{assignment.assignment_sharefeedback ===
															true ? (
																<TableCell align="left">
																	<Button
																		type="link"
																		className="p-0"
																		onClick={() =>
																			feedbackButtonHandler(
																				assignment.assignment_id,
																				assignment.assignment_name
																			)
																		}>
																		<span className="font-futura text-base ">
																			View
																			Feeback
																		</span>
																	</Button>
																</TableCell>
															) : (
																<TableCell align="left">
																	<span className="font-futura text-base "></span>
																</TableCell>
															)}
														</TableRow>
													);
												})
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
					</div>
				</header>
			) : null}
			<div className="flex-grow" />
			<NetworkErrorModal />
		</div>
	);
}

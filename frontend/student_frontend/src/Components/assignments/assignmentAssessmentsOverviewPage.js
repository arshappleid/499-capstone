import {
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	Paper,
} from '@mui/material';
import {
	Layout,
	Input,
	Modal,
	Button,
	Space,
	Tooltip,
	Divider,
	Dropdown,
} from 'antd';
import {
	InfoCircleOutlined,
	DownOutlined,
	LoadingOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import TablePagination from '@mui/material/TablePagination';
import { TableSortLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
	updateAssignmentEvaluateeId,
	updateAssignmentEvaluatorId,
	updateAssignmentId,
} from '../store/appReducer';

const { Header, Content, Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AssignmentAssessmentsOverviewPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	//const assignmentId = useSelector((state) => state.assignmentId);
	const studentId = useSelector((state) => state.studentId);
	const courseId = useSelector((state) => state.courseId);
	const [assignmentId, setAssignmentId] = useState('');
	const [assignmentName, setAssignmentName] = useState('');
	// const [assignmentName, setAssignmentName] = useState("");
	const [assignments, setAssignments] = useState([]);
	const [assignmentAssessments, setAssignmentAssessments] = useState([]);
	const [originalAssignmentAssessments, setOriginalAssignmentAssessments] =
		useState([]);
	const [sortedData, setSortedData] = useState([]);
	//const assignmentId = useSelector((state) => state.assignmentId);
	const [text, setText] = useState(
		assignmentId ? assignmentName : 'Select Assignment'
	);
	const [dropdownVisible, setDropdownVisible] = useState(false);

	const [sortColumn, setSortColumn] = useState([]);
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

	const fetchAssignments = async () => {
		try {
			const requestData = { student_id: studentId, course_id: courseId };
			const headers = {
				'Content-type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getassignmentliststatus',
				requestData,
				{
					headers: headers,
				}
			);

			const allAssignments = response.data.assignments.map(
				(assignment) => {
					return {
						assignment_id: assignment.assignment_id,
						assignment_name: assignment.assignment_name,
					};
				}
			);

			setAssignments(allAssignments);
		} catch (error) {
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
	}, [studentId, courseId]);

	const fetchAssignmentAssessments = async () => {
		try {
			const requestData = {
				student_id: studentId,
				assignment_id: assignmentId,
			};
			const headers = {
				'Content-type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getassessmentstatus',
				requestData,
				{
					headers: headers,
				}
			);

			if (response.data.status === 'success') {
				const allAssignmentAssessments =
					response.data.assessment_status.map(
						(assignmentAssessment) => {
							return {
								assessment_id:
									assignmentAssessment.evaluatee_id,
								assessment_status:
									assignmentAssessment.assessment_complete,
								assessment_deadline:
									assignmentAssessment.assessment_deadline,
							};
						}
					);
				setAssignmentAssessments(allAssignmentAssessments);
				setOriginalAssignmentAssessments(allAssignmentAssessments);
				setSortedData(allAssignmentAssessments);
			} else {
				setAssignmentAssessments([]);
				setOriginalAssignmentAssessments([]);
				setSortedData([]);
			}
		} catch (error) {
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
		if (assignmentId) {
			fetchAssignmentAssessments();
		}
	}, [assignmentId]);

	const handleAssignmentClick = (assignmentId, assignmentName) => {
		dispatch(updateAssignmentId(assignmentId));
		setAssignmentId(assignmentId);
		setAssignmentName(assignmentName);
		setText(assignmentName);
		setDropdownVisible(false);
	};

	const assignmentItems = assignments.map((assignment) => (
		<a
			key={assignment.assignmentId}
			className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900"
			onClick={() =>
				handleAssignmentClick(
					assignment.assignment_id,
					assignment.assignment_name
				)
			}>
			{assignment.assignment_name}
		</a>
	));

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

	const [sortDirection, setSortDirection] = useState('asc');

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
	const handleDropdownVisibleChange = (visible) => {
		setDropdownVisible(visible);
	};

	const handleAssessmentClick = (assessmentId) => {
		dispatch(updateAssignmentEvaluateeId(assessmentId));
		dispatch(updateAssignmentEvaluatorId(studentId));
		dispatch(updateAssignmentId(assignmentId));
		navigate('/assignmentAssessmentPage');
	};

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Content className="flex flex-col flex-grow">
				<div className="flex flex-col font-futura items-start">
					<Space>
						<p className="text-xl font-futura ml-10">
							Select an Assignment to view Assessment Details:
						</p>
						<Dropdown
							placement="bottomLeft"
							trigger={['click']}
							visible={dropdownVisible}
							overlay={
								<div className="bg-white shadow text-xl font-futura rounded py-1">
									<span className="text-2xl font-futura">
										{assignmentItems}
									</span>
								</div>
							}
							onVisibleChange={handleDropdownVisibleChange}>
							<Divider className="font-futura mx-auto w-full rounded-lg py-1 bg-slate-200 text-black hover:text-black">
								<a
									onClick={(e) => e.preventDefault()}
									className="font-futura text-base hover:text-black">
									{text}
									<DownOutlined className="text-sm ml-12" />
								</a>
							</Divider>
						</Dropdown>
					</Space>
				</div>
				{assignmentId ? (
					<div className="flex flex-col flex-grow justify-items-center items-center justify-center mb-20 ">
						<header className="outline-offset-2 outline-1 rounded  p-4 flex flex-col">
							<Divider className="mx-auto rounded-lg font-futura w-full bg-blue-200">
								<Space>
									<div className="flex flex-row flex-grow">
										<p className="text-xl text-left font-semibold font-futura py-4">
											Assignment Assessment(s)
										</p>
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
													className="w-auto"
													align="left">
													<span className="font-futura text-base font-semibold">
														Assignment Assessments
													</span>
												</TableCell>

												<TableCell
													className="w-auto "
													align="left">
													<Tooltip
														title={
															sortColumn ===
															'assignment_deadline' ? (
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
																	Assessment
																	Deadline
																	Date
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'assessment_deadline'
															}
															direction={
																sortColumn ===
																'assessment_deadline'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center "
																onClick={() =>
																	handleSort(
																		'assessment_deadline'
																	)
																}>
																<span className="font-futura text-base font-semibold">
																	Deadline
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
																Assessment
																Deadline Date
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>

												<TableCell
													className="w-auto "
													align="left">
													<Tooltip
														title={
															sortColumn ===
															'assignment_status' ? (
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
																	Assessment
																	Status
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'assessment_status'
															}
															direction={
																sortColumn ===
																'assessment_status'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center "
																onClick={() =>
																	handleSort(
																		'assessment_status'
																	)
																}>
																<span className="font-futura text-base font-semibold">
																	Assessment
																	Status
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
																Assignment
																Submission
																status
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>
											</TableHead>
											<TableBody>
												{sortedData.length === 0 ? (
													<TableRow className="bg-white">
														<TableCell
															colSpan={4}
															align="left">
															<span className="font-futura text-base">
																No assessment
																found
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
														.map((assessment) => {
															const currentTime =
																new Date();
															const deadlineDate =
																new Date(
																	assessment.assessment_deadline
																);
															const formattedDate =
																deadlineDate.toDateString();
															const options = {
																timeZone:
																	'America/Los_Angeles',
																hour12: true,
																hour: 'numeric',
																minute: 'numeric',
															};
															const formattedTime =
																deadlineDate.toLocaleTimeString(
																	'en-US',
																	options
																);

															return (
																<TableRow
																	className="bg-white"
																	key={
																		assessment.assessment_id
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
																		{currentTime >
																			deadlineDate ||
																		assessment.assessment_status ? (
																			<span className="font-futura text-base mr-10">
																				Student
																				Assignment
																			</span>
																		) : (
																			<Button
																				type="link"
																				onClick={() =>
																					handleAssessmentClick(
																						assessment.assessment_id
																					)
																				}
																				className="p-0">
																				<span className="font-futura text-base mr-10">
																					Student
																					Assignment
																				</span>
																			</Button>
																		)}
																	</TableCell>

																	<TableCell align="left">
																		<span
																			className={`font-futura text-base mr-10 ${
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
																			className={`font-futura text-base mr-10 ${
																				assessment.assessment_status ===
																				true
																					? 'text-green-500'
																					: 'text-red-500'
																			}}`}>
																			{assessment.assessment_status ===
																			true ? (
																				<span className="text-base font-futura text-green-500">
																					Submitted
																				</span>
																			) : (
																				<span className="text-base font-futura text-red-500">
																					Not
																					Submitted
																				</span>
																			)}
																		</span>
																	</TableCell>
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
								</div>
							</div>
						</header>
					</div>
				) : null}
				<div className="flex-grow" />
				<NetworkErrorModal />
			</Content>
		</Layout>
	);
}

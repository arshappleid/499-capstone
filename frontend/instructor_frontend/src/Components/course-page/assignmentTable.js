// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).
import {
	Button,
	Divider,
	Space,
	Tooltip,
	Form,
	Modal,
	Input,
	ConfigProvider,
	Switch,
} from 'antd';
import {
	LoadingOutlined,
	InfoCircleOutlined,
	DeleteTwoTone,
} from '@ant-design/icons';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useSelector, useDispatch } from 'react-redux';
import { updateAssignmentName, updateAssignmentId } from '../store/appReducer';
import { StyleProvider } from '@ant-design/cssinjs';
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

function AssignmentTable() {
	const dispatch = useDispatch();
	const [checked1, setChecked1] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const [assignmentId, setAssignmentId] = useState(0);
	const [assignmentName, setAssignmentName] = useState('');

	const [checked2, setChecked2] = useState(false);
	const navigate = useNavigate();
	const [loading, isLoading] = useState(true);
	const [assignment, setAssignment] = useState([]);
	const [originalAssignments, setOriginalAssignments] = useState([]);
	const [openAll, setOpenAll] = useState(false);
	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	//const instId = localStorage.getItem('instructor_id');
	//const courseId = localStorage.getItem('course_id');
	const [searchText, setSearchText] = useState('');

	const [groupValue, setGroupValue] = useState('');
	const [sortedData, setSortedData] = useState([]);
	const [sortColumn, setSortColumn] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

	const [isModalVisible4, setIsModalVisible4] = useState(false);
	const [modalContent4, setModalContent4] = useState('');
	const [modalTitle4, setModalTitle4] = useState('');

	const [isModalVisible2, setIsModalVisible2] = useState(false);
	const [modalContent2, setModalContent2] = useState('');
	const [modalTitle2, setModalTitle2] = useState('');

	const [isModalVisible3, setIsModalVisible3] = useState(false);
	const [modalContent3, setModalContent3] = useState('');
	const [modalTitle3, setModalTitle3] = useState('');

	const [isModalVisible5, setIsModalVisible5] = useState(false);
	const [modalContent5, setModalContent5] = useState('');
	const [modalTitle5, setModalTitle5] = useState('');

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
			isLoading(true);
			const requestData = {
				instructor_id: instructorId,
				course_id: courseId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorgetassignmentlist',
				requestData,
				{ headers: headers }
			);

			if (response.data.status === 'success') {
				const allAssignments = response.data.assignments.map(
					(assignment) => {
						const deadlineDate = new Date(assignment.deadline);
						const formattedDeadlineDate =
							deadlineDate.toDateString();
						const options = {
							timeZone: 'America/Los_Angeles',
							hour12: true,
							hour: 'numeric',
							minute: 'numeric',
						};
						const formattedDeadlineTime =
							deadlineDate.toLocaleTimeString('en-US', options);
						const availableFromDate = new Date(
							assignment.avaliableFrom
						);
						const formattedAvailableFromDate =
							availableFromDate.toDateString();
						const formattedAvailableFromTime =
							availableFromDate.toLocaleTimeString(
								'en-US',
								options
							);
						const availableToDate = new Date(
							assignment.avaliableTo
						);
						const formattedAvailableToDate =
							availableToDate.toDateString();
						const formattedAvailableToTime =
							availableToDate.toLocaleTimeString(
								'en-US',
								options
							);

						return {
							assignmentId: assignment.assignment_id,
							assignmentName: assignment.assignment_name,
							assignmentDescription:
								assignment.assignment_description,
							assignmentDeadline:
								formattedDeadlineDate +
								' ' +
								formattedDeadlineTime,
							assignmentAvailableFrom:
								formattedAvailableFromDate +
								' ' +
								formattedAvailableFromTime,
							assignmentAvailableTo:
								formattedAvailableToDate +
								' ' +
								formattedAvailableToTime,
							assignmentShareFeedback: assignment.shareFeedback,
							assignmentVisibility: assignment.visibility,
						};
					}
				);

				setAssignment(allAssignments);
				setOriginalAssignments(allAssignments);
				setSortedData(allAssignments);
				isLoading(false);
			} else {
				setAssignment([]);
				setOriginalAssignments([]);
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
	useEffect(() => {
		fetchAssignment();
	}, [instructorId, courseId]);

	const applyFilter = (value) => {
		if (value === '') {
			setAssignment(originalAssignments);
			setSortedData(originalAssignments);
		} else {
			const filteredValue = originalAssignments.filter((assignment) =>
				assignment.assignmentName
					.toLowerCase()
					.includes(value.toLowerCase())
			);
			setPage(0);
			setSortedData(filteredValue);
			setAssignment(filteredValue);
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

	const [form] = Form.useForm();

	const handleToggleFeedback = async () => {
		try {
			const requestData = {
				instructor_id: instructorId,
				assignment_id: assignmentId,
				course_id: courseId,
				sharefeedback: checked2 ? 1 : 0,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/setassignmentsharefeedback',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			setSortedData((prevEvaluations) =>
				prevEvaluations.map((assignment) => {
					if (assignment.assignmentId === assignmentId) {
						return {
							...assignment,
							assignmentShareFeedback: checked2,
						};
					}
					return assignment;
				})
			);
			if (status === 'success') {
				if (checked2 === true) {
					setModalTitle4('Feedback Released!');
					setModalContent4(
						`${assignmentName} feedback has been released to the students.`
					);
					setIsModalVisible4(true);
					setTimeout(() => {
						setIsModalVisible4(false);
						setIsModalVisible3(false);
					}, 2000);
				} else {
					setModalTitle4('Feedback Hidden!');
					setModalContent4(
						`${assignmentName} feedback has been hidden from the students.`
					);
					setIsModalVisible4(true);
					setTimeout(() => {
						setIsModalVisible4(false);
						setIsModalVisible3(false);
					}, 2000);
				}
			} else {
				const message = response.data.message;
				setModalTitle3('Error!');
				setModalContent3(message);
				setIsModalVisible3(true);
				setTimeout(() => {
					setIsModalVisible3(false);
				}, 2000);
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
	const confirmToggleFeedback = (checked, assignmentId, assignmentName) => {
		if (checked === true) {
			setModalTitle3('Feedback Release/Hide');
			setModalContent3(
				`Are you sure you want to release ${assignmentName} feedback?`
			);
			setIsModalVisible3(true);
		} else {
			setModalTitle3('Feedback Release/Hide');
			setModalContent3(
				`Are you sure you want to hide ${assignmentName} feedback?`
			);
			setIsModalVisible3(true);
		}
	};
	const handleToggleVisibility = async () => {
		//confirmToggleVisibility(checked, formId, formName);

		try {
			const requestData = {
				instructor_id: instructorId,
				assignment_id: assignmentId,
				course_id: courseId,
				visibility: checked1 ? 1 : 0,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/setassignmentvisibility',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			setSortedData((prevEvaluations) =>
				prevEvaluations.map((assignment) => {
					if (assignment.assignmentId === assignmentId) {
						return {
							...assignment,
							assignmentVisibility: checked1,
						};
					}
					return assignment;
				})
			);
			if (status === 'success') {
				if (checked1 === true) {
					setModalTitle('Assignment Published!');
					setModalContent(
						`${assignmentName} Assignment has been released to the students.`
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						setIsModalVisible2(false);
					}, 2000);
				} else {
					// await handleToggleFeedback(false, formId, formName);
					setModalTitle('Assignment Unpublished!');
					setModalContent(
						`${assignmentName} Assignment has been hidden from the students.`
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						setIsModalVisible2(false);
					}, 2000);
				}
			} else {
				const message = response.data.message;
				setModalTitle('Error!');
				setModalContent(
					'Cannot unpublish the assignment since the ' + message
				);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					setIsModalVisible2(false);
					window.location.reload();
				}, 2000);
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
	const confirmToggleVisibility = (checked, assignmentId, assignmentName) => {
		if (checked === true) {
			setModalTitle2('Assignment Publish/Unpublish');
			setModalContent2(
				`Are you sure you want to publish ${assignmentName} Assignment?`
			);
			setIsModalVisible2(true);
		} else {
			setModalTitle2('Assignment Publish/Unpublish');
			setModalContent2(
				`Are you sure you want to unpublish ${assignmentName} Assignment?`
			);
			setIsModalVisible2(true);
		}
	};

	const deleteAssignmentHandler = async (assignmentId) => {
		setModalTitle5('Delete Assignment');
		setModalContent5(
			'Are you sure you want to delete this assignment? This action cannot be undone.'
		);
		setIsModalVisible5(true);
	};

	// const checkAssignmentRecords = async (assignmentId) => {
	// 	try {
	// 		const requestData = {
	// 			assignment_id: assignmentId,
	// 			instructor_id: instructorId,
	// 		};
	// 		const headers = {
	// 			'Content-Type': 'application/json',
	// 			authorization: localStorage.getItem('Authorization'),
	// 		};
	// 		const response = await axios.post(
	// 			BACKEND_URL + 'instructor/checkiftheresanyformrecords',
	// 			requestData,
	// 			{ headers: headers }
	// 		);
	// 		const status = response.data.status;
	// 		console.log('Response', status);
	// 		return status;
	// 	} catch (error) {
	// 		if (error.isAxiosError && error.response === undefined) {
	// 			setNetworkErrorMessage(error.message);
	// 			setNetworkErrorModalVisible(true);
	// 			console.log(error);
	// 		} else {
	// 			setNetworkErrorMessage(error.message);
	// 			setNetworkErrorModalVisible(true);
	// 			console.log(error);
	// 		}
	// 	}
	// };

	const deleteAssignment = async () => {
		try {
			const requestData = {
				assignment_id: assignmentId,
				instructor_id: instructorId,
				course_id: courseId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/removeassignment',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			if (status === 'success') {
				setIsModalVisible5(false);
				setModalTitle('Success!');
				setModalContent('Assignment deleted successfully.');
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
				}, 2500);
				const newAssignment = originalAssignments.filter(
					(assignment) => assignment.assignmentId !== assignmentId
				);
				setOriginalAssignments(newAssignment);
				setAssignment(newAssignment);
				setSortedData(newAssignment);
			} else {
				setIsModalVisible5(false);

				const message = response.data.message;
				setModalTitle('Error!');
				setModalContent(
					'Assignment could not be deleted! One or many students have already submitted the assignment.'
				);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
				}, 2500);
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

	const handleAssignmentDetails = (assignmentId, assignmentName) => {
		dispatch(updateAssignmentId(assignmentId));
		dispatch(updateAssignmentName(assignmentName));
		navigate('/assignmentdetails');
	};

	return (
		<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll">
			<header className="outline-offset-2 outline-1 rounded border p-4 flex flex-col">
				<Divider className="font-futura mx-auto w-full rounded-lg py-4 bg-blue-200">
					<Space class="flex justify-between">
						<div className="flex">
							<p className="text-xl font-semibold font-futura mt-2">
								Assignments Information
							</p>
							<Input
								bordered={true}
								placeholder="Search through the table using the Assignment name"
								className="border-slate-300 font-futura text-base w-96 ml-6 mr-2"
								size="large"
								onChange={(e) => {
									setSearchText(e.target.value);
									applyFilter(e.target.value);
								}}
								onPressEnter={(e) => {
									setSearchText(e.target.value);
									applyFilter(e.target.value);
								}}
							/>
							<Tooltip
								className=" mr-2 mt-2"
								title={
									<span className="text-base font-futura">
										Search through the table using the
										Assignment name
									</span>
								}>
								<InfoCircleOutlined />
							</Tooltip>
						</div>
						<div className="flex justify-cente ml-10 mr-2 mt-2">
							<Button
								type="primary"
								className="bg-blue-400 text-white h-auto hover:text-white ml-2"
								onClick={() => {
									navigate('/createassignment');
								}}>
								<span className="font-futura text-base">
									+ Create Assignment
								</span>
							</Button>
							<Tooltip
								className=" ml-2 mt-2"
								title={
									<span className="text-base font-futura">
										Clicking this button will take you to
										the Create Assignment Page
									</span>
								}>
								<InfoCircleOutlined />
							</Tooltip>
						</div>
					</Space>
				</Divider>
				<div className="flex justify-center w-full">
					<div className="w-full">
						{loading && (
							<h3 className="w-full font-futura text-lg text-center">
								<p className="font-futura flex items-center justify-center">
									<LoadingOutlined spin />
								</p>
								<br /> Loading Assignments Information...
							</h3>
						)}
						{!loading && sortedData?.length > 0 ? (
							<>
								<TableContainer
									component={Paper}
									className="w-full">
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell
													align="left"
													className="bg-slate-200">
													<Tooltip
														title={
															sortColumn ===
															'assignmentName' ? (
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
																	Assignment
																	Name
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																	'assignmentName' &&
																sortDirection ===
																	'asc'
															}
															direction={
																sortColumn ===
																'assignment'
																	? sortDirection
																	: 'asc'
															}
															label="Assignment Name"
															onClick={() =>
																handleSort(
																	'assignmentName'
																)
															}>
															<div
																className="flex justify-center items-center"
																onClick={() =>
																	handleSort(
																		'assignmentName'
																	)
																}>
																<span className="font-futura text-base font-extrabold ml-2">
																	Assignment
																	Name
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
																Assignment Name
															</span>
														}>
														<InfoCircleOutlined className="ml-2" />
													</Tooltip>
												</TableCell>

												<TableCell
													align="center"
													className=" bg-slate-200 w-36">
													{/* <Tooltip
														title={
															sortColumn ===
															'assignmentAvailableFrom' ? (
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
																	Assignment
																	Available
																	from date
																</span>
															)
														}> */}
													{/* <TableSortLabel
														active={
															sortColumn ===
																'assignmentAvailableFrom' &&
															sortDirection ===
																'asc'
														}
														direction={
															sortColumn ===
															'assignment'
																? sortDirection
																: 'asc'
														}
														label="Assignment Available from"
														onClick={() =>
															handleSort(
																'assignmentAvailableFrom'
															)
														}> */}
													{/* <div
															className="flex justify-center items-center"
															onClick={() =>
																handleSort(
																	'assignmentAvailableFrom'
																)
															}> */}
													<span className="font-futura text-base font-extrabold">
														Available From
													</span>
													{/* </div> */}
													{/* </TableSortLabel> */}
													{/* </Tooltip> */}
													{/* <Tooltip
														title={
															<span className="text-base font-futura">
																Click on the
																column name to
																sort the rows by
																Assignment
																Available from
																date
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip> */}
												</TableCell>
												<TableCell
													align="center"
													className=" bg-slate-200 w-36">
													{/* <Tooltip
														title={
															sortColumn ===
															'assignmentDeadline' ? (
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
																	Assignment
																	Deadline
																</span>
															)
														}> */}
													{/* <TableSortLabel
															active={
																sortColumn ===
																	'assignmentDeadline' &&
																sortDirection ===
																	'asc'
															}
															direction={
																sortColumn ===
																'assignment'
																	? sortDirection
																	: 'asc'
															}
															label="Assignment Deadline"
															onClick={() =>
																handleSort(
																	'assignmentDeadline'
																)
															}> */}
													{/* <div
														className="flex justify-center items-center"
														onClick={() =>
															handleSort(
																'assignmentDeadline'
															)
														}> */}
													<span className="font-futura text-base ml-2 font-extrabold">
														Deadline
													</span>
													{/* </div> */}
													{/* </TableSortLabel> */}
													{/* </Tooltip> */}
													{/* <Tooltip
														title={
															<span className="text-base font-futura">
																Click on the
																column name to
																sort the rows by
																Assignment
																Deadline
															</span>
														}>
														<InfoCircleOutlined className="ml-2" />
													</Tooltip> */}
												</TableCell>

												<TableCell
													align="center"
													className=" bg-slate-200 w-36">
													{/* <Tooltip
														title={
															sortColumn ===
															'assignmentAvailableTo' ? (
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
																	Assignment
																	Available
																	until date
																</span>
															)
														}> */}
													{/* <TableSortLabel
															active={
																sortColumn ===
																	'assignmentAvailableTo' &&
																sortDirection ===
																	'asc'
															}
															direction={
																sortColumn ===
																'assignment'
																	? sortDirection
																	: 'asc'
															}
															label="Assignment Available until date"
															onClick={() =>
																handleSort(
																	'assignmentAvailableTo'
																)
															}> */}
													{/* <div
														className="flex justify-center items-center"
														onClick={() =>
															handleSort(
																'assignmentAvailableTo'
															)
														}> */}
													<span className="font-futura text-base  font-extrabold">
														Available Until
													</span>
													{/* </div> */}
													{/* </TableSortLabel> */}
													{/* </Tooltip> */}
													{/* <Tooltip
														title={
															<span className="text-base font-futura">
																Click on the
																column name to
																sort the rows by
																Assignment
																Available until
																date
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip> */}
												</TableCell>

												<TableCell
													align="center"
													className=" bg-slate-200 ">
													<span className="font-futura text-base ml-2 font-semibold">
														Release Assessment(s)
													</span>
													<Tooltip
														title={
															<span className="text-base font-futura">
																Release the
																Assignment
																Assessments to
																the students
																using this
																toggle. You can
																only release the
																assessments if
																the Assignment
																is Released
															</span>
														}>
														<InfoCircleOutlined className="ml-1" />
													</Tooltip>
												</TableCell>

												<TableCell
													align="center"
													className=" bg-slate-200">
													<span className="font-futura text-base ml-2 font-semibold">
														Release Assignment(s)
													</span>
													<Tooltip
														title={
															<span className="text-base font-futura">
																Release the
																Assignment in
																order for the
																students to
																submit their
																assignments and
																complete
																assignment
																assessments
																using this
																toggle.
															</span>
														}>
														<InfoCircleOutlined className="ml-1" />
													</Tooltip>
												</TableCell>

												<TableCell
													align="center"
													className=" bg-slate-200 w-24">
													<span className="font-futura text-base ml-2 font-semibold">
														Action
													</span>
													<Tooltip
														title={
															<span className="text-base font-futura">
																Delete
																Assignment(s)
															</span>
														}>
														<InfoCircleOutlined className="ml-2" />
													</Tooltip>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{sortedData.map((row) => (
												<>
													<TableRow
														key={row.assignmentId}>
														<TableCell align="left">
															<Tooltip
																title={
																	<span className="text-base font-futura">
																		{
																			row.assignmentName
																		}
																	</span>
																}>
																<Button
																	type="link"
																	className="p-0"
																	onClick={() =>
																		handleAssignmentDetails(
																			row.assignmentId,
																			row.assignmentName
																		)
																	}>
																	<span className="font-futura text-base">
																		{/* {
																			row.assignmentName
																		} */}
																		{row
																			.assignmentName
																			.length >
																		35
																			? row.assignmentName.slice(
																					0,
																					35
																			  ) +
																			  '...'
																			: row.assignmentName}
																	</span>
																</Button>
															</Tooltip>
														</TableCell>

														<TableCell align="center">
															<span className="font-futura text-base ml-2">
																{
																	row.assignmentAvailableFrom
																}
															</span>
														</TableCell>
														<TableCell align="center">
															<span className="font-futura text-base ml-2">
																{
																	row.assignmentDeadline
																}
															</span>
														</TableCell>
														<TableCell align="center">
															<span className="font-futura text-base ml-2">
																{
																	row.assignmentAvailableTo
																}
															</span>
														</TableCell>
														<TableCell align="center">
															{!row.assignmentVisibility ? null : (
																<span className="font-futura text-base ml-2">
																	<ConfigProvider
																		theme={{
																			token: {
																				colorPrimary:
																					'#2563EB',
																			},
																		}}>
																		<StyleProvider hashPriority="high">
																			<Switch
																				key={
																					row.assignmentId
																				}
																				checked={
																					row.assignmentShareFeedback
																				}
																				onChange={(
																					checked
																				) => {
																					setChecked2(
																						checked
																					);
																					setAssignmentId(
																						row.assignmentId
																					);
																					setAssignmentName(
																						row.assignmentName
																					);
																					confirmToggleFeedback(
																						checked,
																						row.assignmentId,
																						row.assignmentName
																					);
																				}}
																				disabled={
																					!row.assignmentVisibility
																				}
																				className={`outline-none ring-2 ${
																					row.assignmentShareFeedback
																						? 'ring-green-500'
																						: 'ring-red-500'
																				}`}
																			/>
																		</StyleProvider>
																	</ConfigProvider>
																</span>
															)}
														</TableCell>
														<TableCell align="center">
															<span className="font-futura text-base ml-2">
																<ConfigProvider
																	theme={{
																		token: {
																			colorPrimary:
																				'#2563EB',
																		},
																	}}>
																	<StyleProvider hashPriority="high">
																		<Switch
																			key={
																				row.assignmentId
																			}
																			checked={
																				row.assignmentVisibility
																			}
																			onChange={(
																				checked
																			) => {
																				setChecked1(
																					checked
																				);
																				setAssignmentId(
																					row.assignmentId
																				);
																				setAssignmentName(
																					row.assignmentName
																				);
																				confirmToggleVisibility(
																					checked,
																					row.assignmentId,
																					row.assignmentName
																				);
																			}}
																			className={`outline-none ring-2 ${
																				row.assignmentVisibility
																					? 'ring-green-500'
																					: 'ring-red-500'
																			}`}
																		/>
																	</StyleProvider>
																</ConfigProvider>
															</span>
														</TableCell>
														<TableCell align="center">
															<Tooltip
																title={
																	<span className="text-base font-futura">
																		Delete
																		Assignment
																	</span>
																}>
																<span className="font-futura text-base ">
																	<Button
																		className=" text-center h-auto"
																		onClick={() => {
																			setAssignmentId(
																				row.assignmentId
																			);
																			deleteAssignmentHandler(
																				row.assignmentId
																			);
																		}}>
																		<DeleteTwoTone
																			className=" text-lg"
																			twoToneColor={
																				'red'
																			}
																		/>
																	</Button>
																</span>
															</Tooltip>
														</TableCell>
													</TableRow>
												</>
											))}
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
							</>
						) : loading ? null : (
							<TableContainer
								component={Paper}
								className="w-full">
								<Table aria-label="collapsible table">
									<TableHead>
										<TableRow>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Assignment Name
												</span>
											</TableCell>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Available from
												</span>
											</TableCell>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Assignment Deadline
												</span>
											</TableCell>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Available Until
												</span>
											</TableCell>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Release Feedback
												</span>
											</TableCell>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Release Assignment
												</span>
											</TableCell>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Action
												</span>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell
												align="center"
												colSpan={7}>
												<span className="font-futura text-base">
													No Assignment Found
												</span>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</div>
				</div>

				<NetworkErrorModal />
			</header>

			<Modal
				open={isModalVisible}
				title={
					<span className="text-center font-futura text-2xl">
						{modalTitle}
					</span>
				}
				className="text-center font-futura text-2xl"
				footer={null}
				onCancel={() => {
					setIsModalVisible(false);
					setIsModalVisible2(false);
				}}>
				<p className=" font-futura text-xl">{modalContent}</p>
			</Modal>
			<Modal
				open={isModalVisible4}
				title={
					<span className="text-center font-futura text-2xl">
						{modalTitle4}
					</span>
				}
				className="text-center font-futura text-2xl"
				footer={null}
				onCancel={() => {
					setIsModalVisible4(false);
					setIsModalVisible3(false);
				}}>
				<p className=" font-futura text-xl">{modalContent4}</p>
			</Modal>
			<Modal
				open={isModalVisible2}
				title={
					<span className="text-center font-futura text-2xl">
						{modalTitle2}
					</span>
				}
				className="text-center font-futura text-2xl"
				onCancel={() => setIsModalVisible2(false)}
				footer={[
					<div className="flex justify-center" key="buttons">
						<Button
							key="close"
							className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
							onClick={() => setIsModalVisible2(false)}>
							<span className="text-white hover:text-hover text-base font-futura">
								Close
							</span>
						</Button>
						<Button
							key="ok"
							className={'bg-green-500 hover:bg-green-400 h-auto'}
							onClick={() => {
								setIsModalVisible2(false);
								handleToggleVisibility();
							}}>
							<span className="text-white hover:text-white text-base font-futura">
								Confirm
							</span>
						</Button>
					</div>,
				]}>
				<p className=" font-futura text-xl">{modalContent2}</p>
			</Modal>

			<Modal
				name="handleToggleFeedback"
				open={isModalVisible3}
				title={
					<span className="text-center font-futura text-2xl">
						{modalTitle3}
					</span>
				}
				className="text-center font-futura text-2xl"
				onCancel={() => setIsModalVisible3(false)}
				footer={[
					<div className="flex justify-center" key="buttons">
						<Button
							key="close"
							className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
							onClick={() => setIsModalVisible3(false)}>
							<span className="text-white hover:text-hover text-base font-futura">
								Close
							</span>
						</Button>
						<Button
							key="ok"
							className={'bg-green-500 hover:bg-green-400 h-auto'}
							onClick={() => {
								setIsModalVisible3(false);
								handleToggleFeedback();
							}}>
							<span className="text-white hover:text-white text-base font-futura">
								Confirm
							</span>
						</Button>
					</div>,
				]}>
				<p className=" font-futura text-xl">{modalContent3}</p>
			</Modal>
			<Modal
				open={isModalVisible5}
				title={
					<span className="text-center font-futura text-2xl">
						{modalTitle5}
					</span>
				}
				className="text-center font-futura text-2xl"
				onCancel={() => setIsModalVisible5(false)}
				footer={[
					<div className="flex justify-center" key="buttons">
						<Button
							key="close"
							className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
							onClick={() => setIsModalVisible5(false)}>
							<span className="text-white hover:text-hover text-base font-futura">
								Close
							</span>
						</Button>
						<Button
							key="ok"
							className="bg-red-500 h-auto hover:bg-red-400"
							onClick={() => {
								deleteAssignment();
							}}>
							<span className="text-white hover:text-white text-base font-futura">
								Confirm
							</span>
						</Button>
					</div>,
				]}>
				<p className=" font-futura text-xl">{modalContent5}</p>
			</Modal>
		</div>
	);
}

export default AssignmentTable;

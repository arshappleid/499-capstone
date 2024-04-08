// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { Button, Input, Space, Tooltip, Divider, Modal } from 'antd';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	TableSortLabel,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import {
	updateEvaluateeId,
	updateFormId,
	updateFormName,
} from '../store/appReducer';
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function GroupEvaluationsTable() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, isLoading] = useState(true);

	const studentId = useSelector((state) => state.studentId);
	const courseId = useSelector((state) => state.courseId);
	const [evaluations, setEvaluations] = useState([]);
	const [originalGroupsEvaluations, setOriginalGroupsEvaluations] = useState(
		[]
	);
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
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

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

	const fetchGroupEvals = async () => {
		try {
			isLoading(true);
			const requestData = { student_id: studentId, course_id: courseId };
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getcourseformlist',
				requestData,
				{
					headers: headers,
				}
			);
			const status = response.data.status;

			if (status === 'success') {
				const allEvaluations = response.data.form.map((evaluations) => {
					return {
						formId: evaluations.FORM_ID,
						formName: evaluations.FORM_NAME,
						formDeadline: evaluations.DEADLINE,
						formShareFeedback: evaluations.SHARE_FEEDBACK,
					};
				});

				setEvaluations(allEvaluations);
				setSortedData(allEvaluations);
				setOriginalGroupsEvaluations(allEvaluations);
				isLoading(false);
			} else {
				setEvaluations();
				setSortedData();
				setOriginalGroupsEvaluations();
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
		fetchGroupEvals();
		return;
	}, []);

	const formClickHandler = (formId, form_name) => {
		dispatch(updateFormId(formId));
		dispatch(updateFormName(form_name));
		navigate('/groupmemberslist');
	};

	let searchText = '';

	const applyFilter = (value) => {
		if (value === '') {
			setEvaluations(originalGroupsEvaluations);
			setSortedData(originalGroupsEvaluations);
		} else {
			const filteredValue = originalGroupsEvaluations.filter(
				(evaluation) =>
					evaluation.formName
						.toLowerCase()
						.includes(value.toLowerCase())
			);
			setPage(0);
			setEvaluations(filteredValue);
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
	const checkDeadline = (deadlineDate) => {
		const currentTime = new Date();
		if (deadlineDate < currentTime) {
			setModalTitle('Form is no longer available');
			setModalContent(
				'The deadline for this form has passed. You can no longer submit this form.'
			);
			setIsModalVisible(true);
			setTimeout(() => {
				setIsModalVisible(false);
			}, 3000); // 3 seconds
		}
	};

	const feedbackButtonHandler = (formId, form_name) => {
		dispatch(updateFormId(formId));
		dispatch(updateEvaluateeId(studentId));
		dispatch(updateFormName(form_name));
		navigate('/groupevaluationfeedbackandgradespage');
	};
	return (
		<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll ">
			<header className="outline-offset-2 outline-1 rounded-lg border p-4 flex flex-col">
				<Divider className="text-3xl font-futura mx-auto w-full rounded-lg bg-blue-200">
					<Space className="flex justify-between">
						<div className="flex">
							<p className="text-xl font-semibold font-futura mt-6 mr-6">
								Group Evaluation Forms
							</p>
							<Input
								bordered={true}
								placeholder="Search using Form Name"
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
											Search the table using Form Name
										</span>
									}>
									<InfoCircleOutlined className="mr-10" />
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
									<TableCell align="left" className="mr-10">
										<Tooltip
											title={
												sortColumn === 'formName' ? (
													<span className="text-base font-futura">
														Sort by{' '}
														{sortDirection === 'asc'
															? 'Descending Order'
															: 'Ascending Order'}
													</span>
												) : (
													<span className="text-base font-futura">
														Sort rows by Form Name
													</span>
												)
											}>
											<TableSortLabel
												active={
													sortColumn === 'formName'
												}
												direction={
													sortColumn === 'formName'
														? sortDirection
														: 'asc'
												}>
												<div
													className="flex justify-center items-center "
													onClick={() =>
														handleSort('formName')
													}>
													<span className="font-futura text-base font-extrabold">
														Form Name
													</span>
												</div>
											</TableSortLabel>
										</Tooltip>
										<Tooltip
											title={
												<span className="text-base font-futura">
													Click on the column name to
													sort the rows by Form Name
												</span>
											}>
											<InfoCircleOutlined />
										</Tooltip>
									</TableCell>
									<TableCell
										align="left"
										className="align-center">
										<span className="font-futura text-base font-extrabold">
											Deadline
										</span>
									</TableCell>
									<TableCell align="left">
										<span className="font-futura text-base font-extrabold">
											View Feedback/Grade
										</span>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{loading && (
									<TableRow className="bg-white">
										<TableCell colSpan={4} align="center">
											<h3 className="w-full font-futura text-lg text-center">
												<p className="font-futura flex items-center justify-center">
													<LoadingOutlined spin />
												</p>
												<br /> Loading Evaluation
												Forms...
											</h3>
										</TableCell>
									</TableRow>
								)}
								{!loading && !sortedData ? (
									<TableRow className="bg-white">
										<TableCell colSpan={4} align="center">
											<span className="font-futura text-base">
												No Evaluation Form has been
												created yet
											</span>
										</TableCell>
									</TableRow>
								) : loading ? null : (
									sortedData.map((evaluation) => {
										const currentTime = new Date();
										const deadlineDate = new Date(
											evaluation.formDeadline
										);
										const options = {
											timeZone: 'America/Los_Angeles',
											hour12: true,
											hour: 'numeric',
											minute: 'numeric',
										};
										const formattedTime =
											deadlineDate.toLocaleTimeString(
												'en-US',
												options
											);
										const formattedDate =
											deadlineDate.toDateString();
										return (
											<TableRow className="bg-white">
												{deadlineDate > currentTime && (
													<TableCell align="left">
														<Button
															type="link"
															className="p-0"
															onClick={() => {
																checkDeadline(
																	deadlineDate
																);

																formClickHandler(
																	evaluation.formId,
																	evaluation.formName
																);
															}}>
															<span className="font-futura text-base mr-10">
																{
																	evaluation.formName
																}
															</span>
														</Button>
													</TableCell>
												)}
												{deadlineDate < currentTime && (
													<TableCell align="left">
														<Tooltip
															title={
																<span className="font-futura text-base">
																	Form
																	deadline
																	passed
																</span>
															}>
															<span className="font-futura text-base mr-10">
																{
																	evaluation.formName
																}
															</span>
														</Tooltip>
													</TableCell>
												)}
												<TableCell>
													<span
														className={`font-futura text-base align-center ${
															deadlineDate <
															currentTime
																? 'text-red-500'
																: 'text-black-500'
														}`}>
														{formattedDate}{' '}
														{formattedTime}
													</span>
												</TableCell>
												{evaluation.formShareFeedback ===
												true ? (
													<TableCell align="left">
														<Button
															type="link"
															className="p-0"
															onClick={() => {
																feedbackButtonHandler(
																	evaluation.formId,
																	evaluation.formName
																);
															}}>
															<span className="font-futura text-base">
																View
																Feedback/Grade
															</span>
														</Button>
													</TableCell>
												) : (
													<TableCell />
												)}
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</TableContainer>
					{sortedData ? (
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
					) : null}
				</div>
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
				onCancel={() => setIsModalVisible(false)}>
				<p className=" font-futura text-xl">{modalContent}</p>
			</Modal>
			<NetworkErrorModal />
		</div>
	);
}

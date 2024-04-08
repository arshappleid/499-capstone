// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import {
	Divider,
	Layout,
	Dropdown,
	Space,
	Button,
	Input,
	Tooltip,
	Modal,
	Breadcrumb,
} from 'antd';
import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import { useSelector, useDispatch } from 'react-redux';
import {
	DownOutlined,
	InfoCircleOutlined,
	LoadingOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	updateGroupId,
	updateGroupName,
	updateEvaluatorId,
	updateEvaluateeId,
} from '../store/appReducer';
import {
	TableContainer,
	TableBody,
	TableCell,
	TableRow,
	Table,
	TableHead,
	TableSortLabel,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function EvaluationOverview() {
	const [loading, isLoading] = useState(true);
	const navigate = useNavigate();
	const [groups, setGroups] = useState([]);
	const groupId = useSelector((state) => state.groupId);
	const groupName = useSelector((state) => state.groupName);
	const evalFormName = useSelector((state) => state.evaluationFormName);
	const [text, setText] = useState(groupId ? groupName : 'Select Group');
	const [students, setStudents] = useState([]);
	const [sortedData, setSortedData] = useState([]);
	const [originalStudent, setOriginalStudent] = useState([]);
	const dispatch = useDispatch();
	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	const courseName = useSelector((state) => state.courseName);

	const [sortColumn, setSortColumn] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');

	const [dropdownVisible, setDropdownVisible] = useState(false);

	const handleDropdownVisibleChange = (visible) => {
		setDropdownVisible(visible);
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
	const fetchStudents = async () => {
		try {
			isLoading(true);
			const requestStudent = { group_id: groupId };
			const headers = {
				'Content-type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getgroupstudents',
				requestStudent,
				{ headers: headers }
			);

			const status = response.data.status;
			if (status === 'success') {
				const allStudents = response.data.data.map((student) => {
					const {
						STUDENT_ID,
						FIRST_NAME,
						MIDDLE_NAME,
						LAST_NAME,
						EMAIL,
					} = student;
					const fullName = `${FIRST_NAME} ${MIDDLE_NAME || ''} ${
						LAST_NAME || ''
					}`;
					return {
						student_id: STUDENT_ID,
						student_firstname: FIRST_NAME,
						student_middlename: MIDDLE_NAME || '',
						student_lastname: LAST_NAME || '',
						student_email: EMAIL,
						fullName,
					};
				});

				setStudents(allStudents);
				setSortedData(allStudents);
				setOriginalStudent(allStudents);
			} else {
				setStudents([]);
				setSortedData([]);
				setOriginalStudent([]);
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
		if (groupId) {
			fetchStudents();
		}
	}, [groupId]);

	const fetchGroups = async () => {
		try {
			isLoading(true);
			const requestData = {
				instructor_id: instructorId,
				course_id: courseId,
			};
			const headers = {
				'Content-type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getcoursegroups',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			if (status === 'success') {
				const allGroups = response.data.data.map((group) => ({
					groupId: group.GROUP_ID,
					groupName: group.GROUP_NAME,
				}));
				setGroups(allGroups);
			} else {
				setGroups([]);
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
		fetchGroups();
	}, [instructorId, courseId]);

	const handleGroupClick = (groupId, groupName) => {
		dispatch(updateGroupId(groupId));
		dispatch(updateGroupName(groupName));
		setText(groupName);
		setDropdownVisible(false);
	};

	const groupItems = groups.map((group) => (
		<a
			key={group.groupId}
			className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900"
			onClick={() => handleGroupClick(group.groupId, group.groupName)}>
			{group.groupName}
		</a>
	));

	const emptyGroupItems = (
		<p className="text-base block text-gray-700 hover:bg-gray-100 hover:text-gray-900">
			No Groups created yet
		</p>
	);

	let reqId;
	const fetchGridStudent = (id) => {
		const gridStudents = [];

		for (let i = 0; i < students.length; i++)
			if (students[i].student_id === id) {
				reqId = i;
				break;
			}
		const student = originalStudent[reqId];
		for (let j = 0; j < students.length; j++) {
			if (j !== reqId) gridStudents.push(students[j]);
			else continue;
		}

		const viewGradeClickHandler = (evaluateeId) => {
			dispatch(updateEvaluateeId(evaluateeId));
		};
		const evaluateeCLickHandler = (evaluateeId) => {
			dispatch(updateEvaluateeId(student.student_id));
			dispatch(updateEvaluatorId(evaluateeId));
			navigate('/viewevaluationfeedback');
		};

		return (
			<TableRow key={student.student_id}>
				<TableCell className="font-futura text-xl border-r-2 border-slate-200">
					<Tooltip
						title={
							<span className="font-futura text-base">
								{student.student_firstname}{' '}
								{student.student_lastname}
							</span>
						}>
						<span className="font-futura text-base">
							{student.student_firstname} {/* <br /> */}
							{student.student_lastname}
						</span>
					</Tooltip>
				</TableCell>
				<TableCell className="font-futura text-xl border-r-2 border-slate-200">
					<span
						className={` font-futura text-base ${
							gridStudents.length >= 5
								? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`
								: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridStudents.length} xl:grid-cols-${gridStudents.length}`
						}`}>
						{gridStudents.map((stud) => (
							<div>
								<Tooltip
									title={
										<span className="text-base font-futura">
											{stud.student_firstname}{' '}
											{stud.student_lastname}
										</span>
									}>
									<Button
										type="link"
										onClick={() => {
											evaluateeCLickHandler(
												stud.student_id
											);
										}}>
										<span className="font-futura text-base">
											{stud.student_firstname}
											{stud.student_lastname
												? ` ${stud.student_lastname[0]}.`
												: ''}
										</span>
									</Button>
								</Tooltip>
							</div>
						))}
					</span>
				</TableCell>
				<TableCell align="center">
					<Link to="/viewandeditgrade">
						<Button
							type="link"
							className="p-0"
							onClick={() =>
								viewGradeClickHandler(student.student_id)
							}>
							<span className="font-futura text-base">
								View Final Grade
							</span>
						</Button>
					</Link>
				</TableCell>
			</TableRow>
		);
	};

	const applyFilter = (value) => {
		if (value === '') {
			setStudents(originalStudent);
			setSortedData(originalStudent);
		} else {
			const filteredValue = originalStudent.filter(
				(student) =>
					student.student_firstname
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.student_lastname
						.toLowerCase()
						.includes(value.toLowerCase())
			);

			//setStudents(filteredValue);
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
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow bg-white mb-10">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							{courseName}: {evalFormName} Evaluation Overview
						</h1>
					</div>
				</div>
				<Breadcrumb
					className="ml-10 mt-4 text-lg font-futura"
					items={[
						{
							title: <a href="/dashboard">Dashboard</a>,
						},
						{
							title: (
								<a href="/coursepage">Course: {courseName}</a>
							),
						},
						{
							title: (
								<a href="/evaluationlistpage">
									Evaluation Forms
								</a>
							),
						},
						{
							title: (
								<span>{evalFormName} Evaluation Overview</span>
							),
						},
					]}
				/>
				<div className="flex flex-col font-futura items-start">
					<Space>
						<p className="text-xl font-futura ml-10">
							Select a Group to view Group Evaluation Data:
						</p>
						<Dropdown
							placement="bottomLeft"
							trigger={['click']}
							visible={dropdownVisible}
							overlay={
								<div className="bg-white shadow text-xl font-futura rounded py-1">
									<span className="text-2xl font-futura">
										{groupItems
											? groupItems
											: emptyGroupItems}
									</span>
								</div>
							}
							onVisibleChange={handleDropdownVisibleChange}>
							<Divider className="font-futura mx-auto w-full rounded-lg py-1 bg-slate-200 text-black hover:text-black overflow-hidden">
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
				{loading && (
					<h3 className="w-full font-futura text-lg text-center">
						<p className="font-futura flex items-center justify-center">
							<LoadingOutlined spin />
						</p>
						<br /> Loading Evaluation Overview...
					</h3>
				)}
				{!loading && groupId ? (
					<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll overflow-x-auto ">
						<header className="outline-offset-2 outline-1 rounded border p-4 flex flex-col mt-10 ">
							<Divider className="text-3xl font-futura mx-auto w-full rounded-lg bg-blue-200">
								<Space className="flex justify-between">
									<div className="flex">
										<p className="text-xl font-semibold font-futura mt-6 mr-6">
											Group Evaluation Overview
										</p>
										<Input
											bordered={true}
											placeholder="Search the table using Evaluatee Name"
											className="border-slate-300 mr-2 mb-6 mt-4 font-futura text-base w-96"
											size="large"
											onSearch={(e) => {
												applyFilter(e.target.value);
											}}
											onPressEnter={(e) => {
												applyFilter(e.target.value);
											}}
											onChange={(e) => {
												applyFilter(e.target.value);
											}}
										/>
										<div className=" justify-cente mt-4 mr-2">
											<Tooltip
												title={
													<span className="text-base font-futura">
														Search the table using
														Evaluatee Name
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
										<TableHead className="bg-slate-200 w-auto">
											<TableRow>
												<TableCell
													align="center"
													className="mr-10 ">
													<Tooltip
														title={
															sortColumn ===
															'student_firstname' ? (
																<span className="text-base font-futura">
																	Sort by
																	{sortDirection ===
																	'asc'
																		? 'Descending Order'
																		: 'Ascending Order'}
																</span>
															) : (
																<span className="text-base font-futura">
																	Sort rows by
																	Evaluatee
																	Name
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'student_firstname'
															}
															direction={
																sortColumn ===
																'student_firstname'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center ml-4 "
																onClick={() =>
																	handleSort(
																		'student_firstname'
																	)
																}>
																<span className="font-futura text-base font-semibold">
																	Evaluatee{' '}
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
																Evaluatee Name
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>
												<TableCell
													align="center"
													className="font-semibold font-futura">
													<div className="flex flex-row justify-center items-center ml-4 ">
														<span className=" font-semibold text-base font-futura">
															Evaluator(s)
														</span>
														<Tooltip
															title={
																<span className="text-base font-futura">
																	Click on an
																	Evaluator
																	name to view
																	their
																	feedback for
																	the
																	corresponding
																	Evaluatee
																</span>
															}>
															<InfoCircleOutlined className="ml-4" />
														</Tooltip>
													</div>
												</TableCell>
												<TableCell align="center">
													<div className="flex flex-row justify-center items-center ml-4 ">
														<span className=" font-semibold text-base font-futura">
															View Grade
														</span>
														<Tooltip
															title={
																<span className="text-base font-futura">
																	Clicking on
																	View Final
																	Grade will
																	show the
																	Grade
																	calculated
																	for the
																	Evaluator
																	from the
																	feedbacks
																	they have
																	recieved
																</span>
															}>
															<InfoCircleOutlined className="ml-4" />
														</Tooltip>
													</div>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{sortedData.length ? (
												sortedData.map((student) =>
													fetchGridStudent(
														student.student_id
													)
												)
											) : (
												<TableRow className="bg-white">
													<TableCell
														colSpan={4}
														align="center">
														<span className="font-futura text-lg">
															No student found
														</span>
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</header>
					</div>
				) : null}
				<NetworkErrorModal />
			</Content>
			<Footer className="p-0" data-testid="footer">
				<AppFooter data-testid="app-footer" />
			</Footer>
		</Layout>
	);
}

// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import {
	Button,
	Divider,
	Input,
	Modal,
	Layout,
	Breadcrumb,
	Tooltip,
	Space,
} from 'antd';

import { DeleteTwoTone } from '@ant-design/icons';
import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import { Link } from 'react-router-dom';
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
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { updateGroupId, updateGroupName } from '../store/appReducer';
import { useDispatch, useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function GroupMembersPage() {
	const dispatch = useDispatch();
	const [loading, isLoading] = useState(true);
	const groupId = useSelector((state) => state.groupId);
	const groupName = useSelector((state) => state.groupName);
	const courseName = useSelector((state) => state.courseName);
	const instructorId = useSelector((state) => state.instructorId);
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
	const [students, setStudents] = useState([]);
	const [originalStudents, setOriginalStudents] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [sortedData, setSortedData] = useState([]);
	const [sortColumn, setSortColumn] = useState([]);
	const [sortDirection, setSortDirection] = useState('asc');
	const [modalVisible1, setModalVisible1] = useState(false);
	const [modalTitle1, setModalTitle1] = useState('');
	const [modalContent1, setModalContent1] = useState('');

	const fetchStudents = async () => {
		try {
			isLoading(true);
			const requestStudent = { group_id: groupId };
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getgroupstudents',
				requestStudent,
				{ headers: headers }
			);
			const status = response.data.status;

			if (status === 'success') {
				const allStudents = response.data.data.map((students) => {
					if (students.MIDDLE_NAME === null) {
						students.MIDDLE_NAME = '';
					}

					if (students.LAST_NAME === null) {
						students.LAST_NAME = '';
					}
					return {
						student_id: students.STUDENT_ID,
						student_firstname: students.FIRST_NAME,
						student_middlename: students.MIDDLE_NAME,
						student_lastname: students.LAST_NAME,
						student_email: students.EMAIL,
					};
				});

				setStudents(allStudents);
				setOriginalStudents(allStudents);
				setSortedData(allStudents);
			} else {
				setStudents([]);
				setOriginalStudents([]);
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
		fetchStudents();
	}, []);

	const onDeleteHandler = (value) => {
		window.confirm({
			title: 'Remove Student from Group',
			icon: <ExclamationCircleOutlined />,
			content: `Are you sure you want to remove ${value.student_firstname} from the group?`,
			okText: 'Remove',
			okType: 'danger',
			cancelText: 'Cancel',
			onOk() {
				removeStudentFromGroup(value);
			},
			onCancel() {
				// Do nothing
			},
		});
	};

	const removeStudentFromGroup = async () => {
		try {
			const requestStudent = {
				group_id: groupId,
				course_id: courseId,
				instructor_id: instructorId,
				student_id: selectedStudent.student_id,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/removestudentfromgroup',
				requestStudent,
				{ headers: headers }
			);
			const status = response.data.status;
			const message = response.data.message;
			if (status === 'success') {
				setModalTitle1('Success');
				setModalContent1(
					<span className="text-lg font-futura">{message}</span>
				);
				setModalVisible1(true);
				setTimeout(() => {
					setModalVisible1(false);
					fetchStudents();
				}, 2000);
			} else {
				setModalTitle1('Student not removed');
				setModalContent1(
					<span className="text-lg font-futura">{message}</span>
				);
				setModalVisible1(true);
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
	const applyFilter = (value) => {
		if (value === '') {
			setStudents(originalStudents);
			setSortedData(originalStudents);
			return;
		} else {
			const filteredValue = originalStudents.filter(
				(student) =>
					student.student_email
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.student_firstname
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.student_middlename
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.student_lastname
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					String(student.student_id)
						.toLowerCase()
						.includes(value.toLowerCase())
			);
			setPage(0);
			setStudents(filteredValue);
			setSortedData(filteredValue);
			return;
		}
	};

	const removeGroupId = () => {
		dispatch(updateGroupId(null));
		dispatch(updateGroupName(null));
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
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow bg-white">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							{groupName}
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
							title: <a href="/grouplistpage">Student Groups</a>,
						},
						{
							title: (
								<p className="text-black">Group: {groupName}</p>
							),
						},
					]}
				/>
				<div className="flex flex-col flex-grow justify-items-center items-center justify-center mb-20 mt-10">
					<header className="outline-offset-2 outline-1 rounded border p-4 flex flex-col">
						<Space className="flex justify-between">
							<Link to="/grouplistpage">
								<Button
									onClick={removeGroupId}
									className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
									type="primary">
									<span className="font-futura text-base text-white">
										← View all groups
									</span>
								</Button>
							</Link>
						</Space>

						<Divider className="mx-auto rounded-lg  font-futura w-auto bg-blue-200">
							<Space>
								<div className="flex flex-row flex-grow">
									<p className="text-xl font-semibold font-futura mt-6 mr-6">
										Group Information
									</p>
									<Input
										bordered={true}
										placeholder="Search using Student Name, Student ID or Student Email"
										className="border-slate-300 mr-2 mb-6 mt-6 font-futura text-base w-96 h-8"
										onSearch={(e) => {
											searchText = e.target.value;
											applyFilter(searchText);
										}}
										onChange={(e) => {
											searchText = e.target.value;
											applyFilter(searchText);
										}}
										onPressEnter={(e) => {
											searchText = e.target.value;
											applyFilter(searchText);
										}}
									/>
									<div className=" justify-center mt-6 mr-2">
										<Tooltip
											title={
												<span className="text-base font-futura">
													Search the table using
													Student Name, Student ID or
													Student Email
												</span>
											}>
											<InfoCircleOutlined />
										</Tooltip>
									</div>
								</div>
								<div className="flex ml-20">
									<Link to="/addstudenttogroup">
										<Button
											type="primary"
											className="ml-2 bg-blue-500 h-auto">
											<span className="text-white hover:text-white font-futura text-base">
												+ Add Student
											</span>
										</Button>
									</Link>
									<Tooltip
										className="ml-2 mt-2"
										title={
											<span className="text-base font-futura">
												This button will take you to the
												Student List Page where you can
												add students to this group who
												are currenlty not in a group
											</span>
										}>
										<InfoCircleOutlined />
									</Tooltip>
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
												<Tooltip
													title={
														sortColumn ===
														'student_firstname' ? (
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
															'student_firstname'
														}
														direction={
															sortColumn ===
															'student_firstname'
																? sortDirection
																: 'asc'
														}>
														<div
															className="flex justify-center items-center "
															onClick={() =>
																handleSort(
																	'student_firstname'
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
															Click on the column
															name to sort the
															rows by Student Name
														</span>
													}>
													<InfoCircleOutlined />
												</Tooltip>
											</TableCell>
											<TableCell align="left">
												<Tooltip
													title={
														sortColumn ===
														'student_id' ? (
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
															'student_id'
														}
														direction={
															sortColumn ===
															'student_id'
																? sortDirection
																: 'asc'
														}>
														<div
															className="flex justify-center items-center"
															onClick={() =>
																handleSort(
																	'student_id'
																)
															}>
															<span className="font-futura text-base font-semibold">
																Student ID
															</span>
														</div>
													</TableSortLabel>
												</Tooltip>
												<Tooltip
													title={
														<span className="text-base font-futura">
															Click on the column
															name to sort the
															rows by Student ID
														</span>
													}>
													<InfoCircleOutlined />
												</Tooltip>
											</TableCell>
											<TableCell
												className="w-auto"
												align="left">
												<Tooltip
													title={
														sortColumn ===
														'email' ? (
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
																Student Email
															</span>
														)
													}>
													<TableSortLabel
														active={
															sortColumn ===
															'student_email'
														}
														direction={
															sortColumn ===
															'student_email'
																? sortDirection
																: 'asc'
														}>
														<div
															className="flex justify-center items-center"
															onClick={() =>
																handleSort(
																	'student_email'
																)
															}>
															<span className="font-futura text-base font-semibold">
																Student Email
															</span>
														</div>
													</TableSortLabel>
												</Tooltip>
												<Tooltip
													title={
														<span className="text-base font-futura">
															Click on the column
															name to sort the
															rows by Student
															Email
														</span>
													}>
													<InfoCircleOutlined />
												</Tooltip>
											</TableCell>
											<TableCell align="left">
												<span className="font-futura text-base font-semibold">
													Action
												</span>
											</TableCell>
										</TableHead>
										<TableBody>
											{loading && (
												<TableRow className="bg-white">
													<TableCell
														colSpan={4}
														align="center">
														<h3 className="w-full font-futura text-lg text-center">
															<p className="font-futura flex items-center justify-center">
																<LoadingOutlined
																	spin
																/>
															</p>
															<br /> Loading
															Groups Members...
														</h3>
													</TableCell>
												</TableRow>
											)}
											{!loading &&
											sortedData.length === 0 ? (
												<TableRow className="bg-white">
													<TableCell
														colSpan={4}
														align="center">
														<span className="font-futura text-base">
															No student found
														</span>
													</TableCell>
												</TableRow>
											) : loading ? null : (
												sortedData
													.slice(
														page * rowsPerPage,
														page * rowsPerPage +
															rowsPerPage
													)
													.map((student) => (
														<TableRow
															className="bg-white"
															key={
																student.student_id
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
																<span className="font-futura text-base">
																	{
																		student.student_firstname
																	}{' '}
																	{
																		student.student_middlename
																	}{' '}
																	{
																		student.student_lastname
																	}
																</span>
															</TableCell>
															<TableCell align="left">
																<span className="font-futura text-base">
																	{
																		student.student_id
																	}
																</span>
															</TableCell>
															<TableCell align="left">
																<span className="font-futura text-base">
																	{
																		student.student_email
																	}
																</span>
															</TableCell>
															<TableCell>
																<Tooltip
																	title={
																		<span className="text-base font-futura">
																			Delete{' '}
																			{
																				student.student_firstname
																			}{' '}
																			from{' '}
																			{
																				groupName
																			}
																		</span>
																	}>
																	<Button
																		className="text-center h-auto"
																		onClick={() => {
																			setSelectedStudent(
																				student
																			);
																			setModalVisible(
																				true
																			);
																		}}>
																		<DeleteTwoTone
																			className=" text-lg"
																			twoToneColor={
																				'red'
																			}
																		/>
																	</Button>
																</Tooltip>
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
				<div className="flex-grow" />
				<NetworkErrorModal />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
			<Modal
				className="overflow-scroll text-center"
				title={
					<span className="font-futura text-center text-xl font-extrabold">
						Remove Student from Group
					</span>
				}
				width={600}
				height={550}
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				footer={[
					<div className="flex justify-center">
						<Button
							type="default"
							className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
							onClick={() => setModalVisible(false)}>
							<span className="text-base font-futura text-white hover:text-white">
								Cancel
							</span>
						</Button>
						<Button
							type="default"
							className="bg-red-500 hover:bg-red-400 h-auto text-white hover:text-white"
							onClick={() => {
								removeStudentFromGroup(selectedStudent);
								setModalVisible(false);
							}}>
							<span className="text-base font-futura text-white hover:text-white">
								Confirm
							</span>
						</Button>
					</div>,
				]}>
				<div className="text-center">
					<p className="text-base font-futura">
						Are you sure you want to remove: {<br />}
						<span className="font-semibold">
							Student Name:
						</span>{' '}
						{selectedStudent && selectedStudent.student_firstname}
						{<br />}
						<span className="font-semibold">Student ID:</span>{' '}
						{selectedStudent && selectedStudent.student_id}
						{<br />}
						<span className="font-semibold">
							Student Email:
						</span>{' '}
						{selectedStudent && selectedStudent.student_email}
						{<br />} from the group?
					</p>
					<br />
					<p className="text-base font-futura">Group Information:</p>
					<Table className="border-2 border-slate-200 rounded-lg">
						<TableHead className="bg-slate-200">
							<TableCell>
								<span className="text-base font-futura">
									Student Name
								</span>
							</TableCell>
							<TableCell>
								<span className="text-base font-futura">
									Student ID
								</span>
							</TableCell>
							<TableCell>
								<span className="text-base font-futura">
									Student Email
								</span>
							</TableCell>
						</TableHead>
						<TableBody>
							{sortedData &&
								sortedData.map((student) => (
									<TableRow
										key={student && student.student_id}
										sx={{
											'&:last-child td, &:last-child th':
												{
													border: 0,
												},
										}}>
										<TableCell component="th" scope="row">
											<span className="text-base font-futura">
												{student &&
													student.student_firstname}
											</span>
										</TableCell>
										<TableCell align="left">
											<span className="text-base font-futura">
												{student && student.student_id}
											</span>
										</TableCell>
										<TableCell align="left">
											<span className="text-base font-futura">
												{student &&
													student.student_email}
											</span>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</div>
			</Modal>
			<Modal
				open={modalVisible1}
				title={
					<span className="text-center font-futura text-2xl">
						{modalTitle1}
					</span>
				}
				className="text-center font-futura text-lg"
				footer={null}
				onCancel={() => {
					setModalVisible1(false);
				}}>
				<p className=" font-futura text-base">{modalContent1}</p>
			</Modal>
			{/* <Modal
				title={modalTitle1}
				open={modalVisible1}
				onCancel={() => setModalVisible1(false)}
				onOk={() => {
					setModalVisible1(false);
				}}>
				{modalContent1}
			</Modal> */}
		</Layout>
	);
}

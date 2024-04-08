//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import NavigationBar from '../navigationbar';
import {
	Button,
	Input,
	Modal,
	Divider,
	Tooltip,
	Space,
	Layout,
	Breadcrumb,
	App,
} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	PlusOutlined,
	UserAddOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import AppFooter from '../appfooter';

const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AddStudentToGroup() {
	const [students, setStudents] = useState([]);
	const [originalStudent, setOriginalStudent] = useState([]);
	let searchValue = '';
	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	const groupId = useSelector((state) => state.groupId);
	const groupName = useSelector((state) => state.groupName);
	const courseName = useSelector((state) => state.courseName);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const [sortedData, setSortedData] = useState([]);
	const [sortColumn, setSortColumn] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalVisible1, setModalVisible1] = useState(false);
	const [modalContent1, setModalContent1] = useState('');
	const [modalTitle1, setModalTitle1] = useState('');
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
			const requestData = { course_id: courseId };
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getcoursestudentlist',
				requestData,
				{ headers: headers }
			);

			const allstudents = response.data.data.map((student) => {
				if (student.MIDDLE_NAME === null) {
					student.MIDDLE_NAME = '';
				}
				if (student.LAST_NAME === null) {
					student.LAST_NAME = '';
				}
				return {
					studentid: student.STUDENT_ID,
					studentname:
						student.FIRST_NAME +
						' ' +
						student.MIDDLE_NAME +
						' ' +
						student.LAST_NAME,
					studentemail: student.EMAIL,
					studentGroup: student.GROUP_NAME,
				};
			});

			allstudents.sort((a) => {
				if (a.studentGroup === '') {
					return -1;
				} else {
					return 1;
				}
			});
			setStudents(allstudents);
			setOriginalStudent(allstudents);
			setSortedData(allstudents);
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
		fetchStudents();
	}, []);

	const applyFilter = (value) => {
		if (value === '') {
			setStudents(originalStudent);
			setSortedData(originalStudent);
		} else {
			const filteredValue = originalStudent.filter(
				(student) =>
					student.studentname
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.studentemail
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.studentGroup
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					String(student.studentid).includes(value.toLowerCase())
			);

			setPage(0);
			setStudents(filteredValue);
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
		});
		setSortedData(sorted);
	};

	const addButtonHandler = (studentId) => {
		const addStudent = async () => {
			try {
				const requestStudent = {
					group_id: groupId,
					instructor_id: instructorId,
					course_id: courseId,
					students: [{ student_id: studentId }],
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/addstudenttogroup',
					requestStudent,
					{ headers: headers }
				);
				const status = response['data']['status'];
				const message = response['data']['message'];
				setModalTitle1(status);
				if (status === 'success') {
					setModalContent1('Student added to group successfully');
					setTimeout(() => {
						setModalVisible1(false);
					}, 2000);
					fetchStudents();
				} else {
					setModalContent1(
						'Error occurred while adding student to group'
					);
					setTimeout(() => {
						setModalVisible1(false);
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
		addStudent();
	};

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>

			<Content className="flex flex-col flex-grow">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							Add student to {groupName}
						</h1>
					</div>
					<Breadcrumb
						className="ml-10 mt-4 text-lg font-futura"
						items={[
							{
								title: <a href="/dashboard">Dashboard</a>,
							},
							{
								title: (
									<a href="/coursepage">
										Course: {courseName}
									</a>
								),
							},
							{
								title: (
									<a href="/grouplistpage">Student Groups</a>
								),
							},
							{
								title: (
									<p className="text-black">
										Group: {groupName}
									</p>
								),
							},
						]}
					/>
					<p className="text-lg font-futura ml-10 mt-4">
						Select a student to add to the selected group
					</p>
				</div>

				<div className="flex flex-col flex-grow rounded-lg w-auto outline-offset-2 outline-1 justify-items-center content-center self-center overflow-scroll mb-20 mt-28">
					{!originalStudent?.length ? (
						<TableContainer className="font-futura rounded-lg border-2 border-slate-200">
							<Table>
								<TableHead className="bg-slate-200">
									<TableRow>
										<TableCell
											align="left"
											className="mr-10">
											<div className="flex justify-center items-center ml-4 ">
												<span className="font-futura text-base font-semibold">
													Student Name
												</span>
											</div>
										</TableCell>
										<TableCell align="left">
											<div className="flex justify-center items-center ml-16">
												<span className="font-futura text-base font-semibold">
													Student ID
												</span>
											</div>
										</TableCell>
										<TableCell align="left">
											<div className="flex justify-center items-center ml-12">
												<span className="font-futura text-base font-semibold">
													Student Email
												</span>
											</div>
										</TableCell>
										<TableCell align="left">
											<div className="flex justify-center items-center ml-16">
												<span className="font-futura text-base font-semibold">
													Group
												</span>
											</div>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow className="bg-white">
										<TableCell colSpan={4} align="center">
											<span className="font-futura text-base">
												Currently no students are
												enrolled in the course
											</span>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					) : null}
					{originalStudent?.length ? (
						<header className="outline-offset-2 outline-1 rounded-lg border p-4 flex flex-col">
							<Divider className="text-3xl font-futura mx-auto w-full rounded-lg bg-blue-200">
								<Space className="flex justify-between">
									<div className="flex">
										<p className="text-xl font-semibold font-futura mt-6 mr-6">
											Students
										</p>
										<Input
											bordered={true}
											placeholder="Search using
											Student ID, Student
											Name, Student Email or
											Group Name"
											className="border-slate-300 mr-2 mb-6 mt-4 font-futura text-base w-96"
											size="large"
											onPressEnter={(e) => {
												searchValue = e.target.value;
												applyFilter(searchValue);
											}}
											onChange={(e) => {
												searchValue = e.target.value;
												applyFilter(searchValue);
											}}
										/>
										<div className=" justify-center mt-4 mr-2">
											<Tooltip
												title={
													<span className="text-base font-futura">
														Search the table using
														Student ID, Student
														Name, Student Email or
														Group Name
													</span>
												}>
												<InfoCircleOutlined />
											</Tooltip>
										</div>
									</div>
								</Space>
							</Divider>
							<div className="overflow-x-auto w-full font-futura">
								<div className="w-full">
									<TableContainer className="font-futura rounded-lg border-2 border-slate-200">
										<Table>
											<TableHead className="bg-slate-200">
												<TableCell
													align="left"
													className="w-auto mr-10">
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
																	Sort rows by
																	Student Name
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
																className="flex justify-center items-center "
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
																Click on the
																column name to
																sort the rows by
																Student Name
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>
												<TableCell align="left">
													<Tooltip
														title={
															sortColumn ===
															'studentid' ? (
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
																	Student ID
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'studentid'
															}
															direction={
																sortColumn ===
																'studentid'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center"
																onClick={() =>
																	handleSort(
																		'studentid'
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
																Click on the
																column name to
																sort the rows by
																Student ID
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>
												<TableCell align="left">
													<Tooltip
														title={
															sortColumn ===
															'studentemail' ? (
																<span>
																	Sort by{' '}
																	{sortDirection ===
																	'asc'
																		? 'Descending Order'
																		: 'Ascending Order'}
																</span>
															) : (
																<span className="text-base font-futura">
																	Sort rows by
																	Student
																	Email
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'studentemail'
															}
															direction={
																sortColumn ===
																'studentemail'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center"
																onClick={() =>
																	handleSort(
																		'studentemail'
																	)
																}>
																<span className="font-futura text-base font-semibold ">
																	Student
																	Email
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
																Student Email
															</span>
														}>
														<InfoCircleOutlined />
													</Tooltip>
												</TableCell>
												<TableCell align="left">
													<Tooltip
														title={
															sortColumn ===
															'studentGroup' ? (
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
																	Group Name
																</span>
															)
														}>
														<TableSortLabel
															active={
																sortColumn ===
																'studentGroup'
															}
															direction={
																sortColumn ===
																'studentGroup'
																	? sortDirection
																	: 'asc'
															}>
															<div
																className="flex justify-center items-center"
																onClick={() =>
																	handleSort(
																		'studentGroup'
																	)
																}>
																<span className="font-futura text-base font-semibold">
																	Group
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
																Student Group
															</span>
														}>
														<InfoCircleOutlined className="mr-20" />
													</Tooltip>
												</TableCell>
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
															page * rowsPerPage +
																rowsPerPage
														)
														.map((row) => (
															<TableRow
																className="bg-white"
																key={
																	row.studentid
																}>
																<TableCell align="left">
																	<span className="font-futura text-base  mr-10">
																		{
																			row.studentname
																		}
																	</span>
																</TableCell>
																<TableCell align="left">
																	<span className="font-futura text-base  mr-10">
																		{
																			row.studentid
																		}
																	</span>
																</TableCell>
																<TableCell align="left">
																	<span className="font-futura text-base  mr-10">
																		{
																			row.studentemail
																		}
																	</span>
																</TableCell>
																<TableCell align="left">
																	<span className="font-futura text-base mr-10">
																		{row.studentGroup ===
																		'' ? (
																			<Button
																				onClick={() => {
																					setModalVisible(
																						true
																					);
																					setModalContent(
																						{
																							studentId:
																								row.studentid,
																							studentName:
																								row.studentname,
																							studentEmail:
																								row.studentemail,
																						}
																					);
																					// addButtonHandler(
																					// 	row.studentid
																					// );
																				}}>
																				<UserAddOutlined className="text-lg" />
																			</Button>
																		) : (
																			// row.studentGroup
																			<Tooltip
																				title={
																					<span className="text-base font-futura">
																						{
																							row.studentGroup
																						}
																					</span>
																				}>
																				<span className="font-futura text-base">
																					{/* {row.studentGroup} */}
																					{row
																						.studentGroup
																						.length >
																					25
																						? `${row.studentGroup.substring(
																								0,
																								25
																						  )}...`
																						: row.studentGroup}
																				</span>
																			</Tooltip>
																		)}
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
					) : null}
					<NetworkErrorModal />
					<Modal
						className="font-futura text-center"
						style={{ width: '125%', height: '75%' }}
						open={modalVisible}
						onCancel={() => setModalVisible(false)}
						// onOk={() => {
						// 	addButtonHandler(modalContent.studentId);
						// 	setModalVisible(false);
						// 	setModalVisible1(true);
						// }}
						title={
							<span className="text-center font-futura text-lg font-semibold">
								Add student to group
							</span>
						}
						footer={[
							<div className="flex justify-center" key="buttons">
								<Button
									type="default"
									className="bg-blue-500 hover:bg-blue-400 h-auto hover:border-transparent font-futura text-base"
									key="cancel"
									onClick={() => setModalVisible(false)}>
									<span className="font-futura text-base text-white hover:text-white">
										Cancel
									</span>
								</Button>
								<Button
									type="default"
									className="bg-green-500 hover:bg-green-400 h-auto hover:border-transparent font-futura text-base"
									key="cancel"
									onClick={() => {
										addButtonHandler(
											modalContent.studentId
										);
										setModalVisible(false);
										setModalVisible1(true);
									}}>
									<span className="font-futura text-base text-white hover:text-white">
										Confirm
									</span>
								</Button>
							</div>,
						]}>
						<p className="font-futura text-base">
							Are you sure you want to add student{<br />}
							<span className=" font-semibold font-futura text-base">
								Student Name: {modalContent.studentName}
							</span>
							{<br />}
							<span className=" font-semibold font-futura text-base">
								Student Id: {modalContent.studentId}
							</span>
							{<br />}
							<span className=" font-semibold font-futura text-base">
								Student Email: {modalContent.studentEmail}
							</span>
							{<br />}to the group?
						</p>
					</Modal>
					<Modal
						className="font-futura text-center"
						open={modalVisible1}
						onCancel={() => {
							setModalVisible1(false);
						}}
						onOk={() => setModalVisible1(false)}
						title={
							<span className="text-center font-futura text-2xl capitalize">
								{modalTitle1}
							</span>
						}
						footer={null}>
						<p className="font-futura text-base capitalize">
							{modalContent1}
						</p>
					</Modal>
				</div>
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

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
import { updateGroupId, updateGroupName } from '../store/appReducer';
import { useSelector, useDispatch } from 'react-redux';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function GroupTable() {
	const dispatch = useDispatch();
	const [loading, isLoading] = useState(true);
	const [studentInGroup, setStudentInGroup] = useState(false);
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
	const [students, setStudents] = useState([]);
	const [originalStudents, setOriginalStudents] = useState([]);
	const [sortedData, setSortedData] = useState([]);
	const [sortColumn, setSortColumn] = useState([]);
	const [sortDirection, setSortDirection] = useState('asc');

	const fetchStudents = async () => {
		try {
			isLoading(true);
			const requestStudent = {
				student_id: studentId,
				course_id: courseId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getgrouppeoplelist',
				requestStudent,
				{ headers: headers }
			);
			const status = response.data.status;
			const message = response.data.message;

			if (status === 'success') {
				setStudentInGroup(true);
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

				const groupName = response.data.group.GROUP_NAME;
				const groupId = response.data.group.GROUP_ID;
				dispatch(updateGroupName(groupName));
				dispatch(updateGroupId(groupId));

				setStudents(allStudents);
				setOriginalStudents(allStudents);
				setSortedData(allStudents);
				isLoading(false);
			} else {
				setStudents([]);
				setOriginalStudents([]);
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
		fetchStudents();
	}, []);

	const applyFilter = (value) => {
		if (value === '') {
			setStudents(originalStudents);
			setSortedData(originalStudents);
			return;
		} else {
			const filteredValue = originalStudents.filter(
				(student) =>
					student.student_firstname
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.student_middlename
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					student.student_lastname
						.toLowerCase()
						.includes(value.toLowerCase())
			);
			setPage(0);
			setStudents(filteredValue);
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

	const group_name = useSelector((state) => state.groupName);
	const MAX_LENGTH = 15;
	function formatGroupName(group_name) {
		if (group_name === null) {
			return null;
		} else {
			if (group_name.length <= MAX_LENGTH) {
				return group_name;
			} else {
				return group_name.slice(0, MAX_LENGTH) + '...';
			}
		}
	}

	return (
		<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll">
			{studentInGroup ? (
				<header className="outline-offset-2 outline-1 rounded-lg border p-4 flex flex-col">
					<Divider className=" text-3xl font-futura mx-auto w-full rounded-lg bg-blue-200">
						<Space className="flex justify-between">
							<div className="flex">
								<Tooltip
									title={
										<span className="text-lg font-futura">
											{group_name}
										</span>
									}>
									<p className="text-xl font-semibold font-futura mt-6 mr-6">
										{group_name
											? formatGroupName(group_name)
											: 'Group Name'}
									</p>
								</Tooltip>
								<Input
									bordered={true}
									placeholder="Search the table using Student Name"
									className="border-slate-300 mr-2 mb-6 mt-6 font-futura text-base w-96"
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
										searchText = e.target.value;
										applyFilter(searchText);
									}}
								/>
								<div className=" justify-center mt-6 mr-2">
									<Tooltip
										title={
											<span className="text-base font-futura">
												Search the table using Student
												Name
											</span>
										}>
										<InfoCircleOutlined className=" mr-32" />
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
													'student_firstname' ? (
														<span className="text-base font-futura">
															Sort by{' '}
															{sortDirection ===
															'asc'
																? 'Descending Order'
																: 'Ascending Order'}
															`
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
														<span className="font-futura text-base font-extrabold">
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
									</TableHead>
									<TableBody>
										{loading && (
											<h3 className="w-full font-futura text-lg text-center">
												<p className="font-futura flex items-center justify-center">
													<LoadingOutlined spin />
												</p>
												<br /> Loading Group
												Information...
											</h3>
										)}
										{!loading && sortedData.length === 0 ? (
											<TableRow className="bg-white">
												<TableCell
													colSpan={4}
													align="left">
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
														key={student.student_id}
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
															<span className="font-futura text-base mr-10">
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
						<NetworkErrorModal />
					</div>
				</header>
			) : (
				<>
					{loading && (
						<h3 className="w-full font-futura text-lg text-center">
							<p className="font-futura flex items-center justify-center">
								<LoadingOutlined spin />
							</p>
							<br /> Loading Group Information...
						</h3>
					)}
					{!loading && sortedData.length === 0 ? (
						<div className="flex justify-center items-center w-full py-10 h-full bg-slate-100">
							<p className="text-lg font-futura text-center mx-10">
								Your instructor has not added you to a group
								yet.
							</p>
						</div>
					) : null}
				</>
			)}
		</div>
	);
}

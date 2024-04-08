//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import Navbar from '../Navbar';
import AppFooter from '../appfooter';
import axios from 'axios';
import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import { Button, Modal, Divider, Input, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';

const { Header, Content, Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function Dashboard() {
	let searchText = '';
	const [loading, isLoading] = useState(true);
	const [instructors, setInstructors] = useState([]);
	const [originalInstructors, setOriginalInstructors] = useState([]);
	const [selected, setSelected] = useState([]);
	const [selectedInstructorIds, setSelectedInstructorIds] = useState([]);
	const [selectedInstructorsData, setSelectedInstructorsData] = useState([]);
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

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

	const [isModalVisible2, setIsModalVisible2] = useState(false);
	const [modalContent2, setModalContent2] = useState('');
	const [modalTitle2, setModalTitle2] = useState('');

	const [isModalVisible3, setIsModalVisible3] = useState(false);
	const [modalContent3, setModalContent3] = useState('');
	const [modalTitle3, setModalTitle3] = useState('');

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

	const fetchInstructors = async () => {
		try {
			isLoading(true);
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.get(
				BACKEND_URL + 'admin/getallinstructors',
				{ headers }
			);
			const status = response.data.status;
			const message = response.data.message;
			const allInstructors = response.data.instructors?.map(
				(instructor) => {
					if (instructor.instructor_middle_name === null) {
						instructor.instructor_middle_name = '';
					}
					if (instructor.instructor_last_name === null) {
						instructor.instructor_last_name = '';
					}
					return {
						id: instructor.instructor_id,
						name:
							instructor.instructor_first_name +
							' ' +
							instructor.instructor_middle_name +
							' ' +
							instructor.instructor_last_name,
						email: instructor.email,
						access: instructor.instructor_access,
						selected: false,
					};
				}
			);
			if (status === 'success') {
				setInstructors(allInstructors);
				setOriginalInstructors(allInstructors);
				setSortedData(allInstructors);
			} else {
				setInstructors([]);
				setOriginalInstructors([]);
				setSortedData([]);
				setNetworkErrorMessage(message);
				setNetworkErrorModalVisible(true);
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
		fetchInstructors();
	}, []);

	const applyFilter = (value) => {
		if (value === '') {
			setInstructors(originalInstructors);
			setSortedData(originalInstructors);
		} else {
			const filteredValue = originalInstructors.filter(
				(instructor) =>
					instructor.name
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					instructor.id.toString().includes(value.toLowerCase()) ||
					instructor.email.toLowerCase().includes(value.toLowerCase())
			);
			setPage(0);
			setInstructors(filteredValue);
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

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = sortedData.map((instructor) => instructor.name);
			setSortedData(
				sortedData.map((instructor) => ({
					...instructor,
					selected: true,
				}))
			);
			setSelected(newSelected);
			setSelectedInstructorIds(
				sortedData.map((instructor) => instructor.id)
			);
			const selectedInstructorsData = sortedData.map((instructor) => ({
				id: instructor.id,
				name: instructor.name,
				email: instructor.email,
			}));
			setSelectedInstructorsData(selectedInstructorsData);
			return;
		}
		setSortedData(
			sortedData.map((instructor) => ({ ...instructor, selected: false }))
		);
		setSelected([]);
		setSelectedInstructorIds([]);
	};
	let newSelectedInstructorIds = [...selectedInstructorIds];
	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];
		// let newSelectedInstructorIds = [...selectedInstructorIds];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
			const instructorIdToAdd = instructors.find(
				(instructor) => instructor.name === name
			)?.id;
			if (instructorIdToAdd) {
				newSelectedInstructorIds.push(instructorIdToAdd);
			}
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
			const instructorIdToRemove = instructors.find(
				(instructor) => instructor.name === name
			)?.id;
			if (instructorIdToRemove) {
				newSelectedInstructorIds = newSelectedInstructorIds.filter(
					(id) => id !== instructorIdToRemove
				);
			}
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
			const instructorIdToRemove = instructors.find(
				(instructor) => instructor.name === name
			)?.id;
			if (instructorIdToRemove) {
				newSelectedInstructorIds = newSelectedInstructorIds.filter(
					(id) => id !== instructorIdToRemove
				);
			}
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
			const instructorIdToRemove = instructors.find(
				(instructor) => instructor.name === name
			)?.id;
			if (instructorIdToRemove) {
				newSelectedInstructorIds = newSelectedInstructorIds.filter(
					(id) => id !== instructorIdToRemove
				);
			}
		}

		setSortedData(
			sortedData.map((instructor) => ({
				...instructor,
				selected: newSelected.includes(instructor.name),
			}))
		);

		setSelected(newSelected);
		setSelectedInstructorIds(newSelectedInstructorIds);
		const selectedInstructors = newSelectedInstructorIds.map((id) => {
			for (let i = 0; i < sortedData.length; i++)
				if (sortedData[i].id === id)
					return {
						id: sortedData[i].id,
						name: sortedData[i].name,
						email: sortedData[i].email,
					};
		});
		setSelectedInstructorsData(selectedInstructors);
	};
	const [numSelected, setNumSelected] = useState(0);

	// Use useEffect to update numSelected whenever the selected state changes
	useEffect(() => {
		setNumSelected(selected.length);
	}, [selected]);

	const grantRevokeButtonHandler = async (access) => {
		try {
			isLoading(true);
			const requestData = selectedInstructorIds.map((id) => ({
				instructor_id: id.toString(),
				instructor_access: access,
			}));
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'admin/updateinstructoraccess',
				{ instructors: requestData },
				{ headers }
			);
			const status = response.data.status;
			const message = response.data.message;
			if (status === 'error') {
				setNetworkErrorMessage(message);
				setNetworkErrorModalVisible(true);
			} else {
				if (access === '1') {
					setSelectedInstructorsData([]);
					setIsModalVisible2(false);
					setModalTitle('Access Granted');
					setModalContent(
						'Access has been granted to the selected instructors'
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						window.location.reload();
					}, 2000);
				}
				if (access === '0') {
					setSelectedInstructorsData([]);
					setIsModalVisible3(false);
					setModalTitle('Access Revoked');
					setModalContent(
						'Access has been revoked from the selected instructors'
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						window.location.reload();

						// setIsModalVisible3(false);
					}, 2000);
				}
				setSelected([]);
				fetchInstructors();
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

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Header className="flex w-full bg-customBlue">
				<Navbar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura mb-20 ">
				<div className="flex flex-col flex-grow justify-items-center items-center justify-center mb-20  pt-20">
					<div className="mb-10">
						<h2 className="text-xl font-futura ">
							Grant/Revoke Instructor Access
						</h2>
					</div>
					<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll ">
						{loading && (
							<h3 className="w-full font-futura text-lg text-center">
								<p className="font-futura flex items-center justify-center">
									<LoadingOutlined spin />
								</p>
								<br /> Loading Instructor Information...
							</h3>
						)}
						{!loading && (
							<header className="outline-offset-2 outline-1 rounded-lg border p-4 flex flex-col">
								<Divider className="mx-auto rounded-lg  font-futura w-full bg-blue-200">
									<Space>
										<div className="flex flex-row flex-grow">
											<p className="text-xl font-semibold font-futura mt-6 mr-6">
												Instructor Details
											</p>
											<Input
												bordered={true}
												placeholder="Search for an instructor here..."
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
															Search the table
															using Instructor
															Name, Id orEmail
														</span>
													}>
													<InfoCircleOutlined />
												</Tooltip>
											</div>
											<div className="mt-6 justify center font-futura mr-2">
												{numSelected ? (
													<>
														<Button
															type="default"
															className="bg-green-500 h-auto hover:bg-green-400"
															onClick={() =>
																setIsModalVisible2(
																	true
																)
															}>
															<span className="font-futura text-white hover:text-white text-base font-semibold">
																Grant Access
															</span>
														</Button>
														<Button
															type="default"
															className="bg-red-500 hover:bg-red-400 h-auto ml-4"
															onClick={() =>
																setIsModalVisible3(
																	true
																)
															}>
															<span className="font-futura text-base font-semibold text-white hover:text-white">
																Revoke Access
															</span>
														</Button>
													</>
												) : null}
											</div>
										</div>
									</Space>
								</Divider>
								<div className="flex justify-center w-full ">
									<div className="w-full ">
										<TableContainer
											className="font-futura rounded-lg border-2 border-slate-200"
											component={Paper}>
											<Table aria-label="simple table">
												<TableHead className="bg-slate-200">
													<TableCell padding="checkbox">
														<Checkbox
															color="primary"
															indeterminate={
																selected.length >
																	0 &&
																selected.length <
																	instructors.length
															}
															checked={
																instructors.length >
																	0 &&
																selected.length ===
																	instructors.length
															}
															onChange={
																handleSelectAllClick
															}
															inputProps={{
																'aria-label':
																	'select all instructors',
															}}
														/>
													</TableCell>
													<TableCell
														className="w-auto"
														align="left">
														<Tooltip
															title={
																sortColumn ===
																'name' ? (
																	<span className="text-sm font-futura">
																		Sort by{' '}
																		{sortDirection ===
																		'asc'
																			? 'Descending Order'
																			: 'Ascending Order'}
																	</span>
																) : (
																	<span className="text-sm font-futura">
																		Sort
																		rows by
																		Instructor
																		Name
																	</span>
																)
															}>
															<TableSortLabel
																active={
																	sortColumn ===
																	'name'
																}
																direction={
																	sortColumn ===
																	'name'
																		? sortDirection
																		: 'asc'
																}>
																<div
																	className="flex justify-center items-center "
																	onClick={() =>
																		handleSort(
																			'name'
																		)
																	}>
																	<span className="font-futura text-base font-extrabold">
																		Instructor
																		Name
																	</span>
																</div>
															</TableSortLabel>
														</Tooltip>
														<Tooltip
															title={
																<span className="text-sm font-futura">
																	Click on the
																	column name
																	to sort the
																	rows by
																	Instructor
																	Name
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
																'id' ? (
																	<span className="text-sm font-futura">
																		Sort by{' '}
																		{sortDirection ===
																		'asc'
																			? 'Descending Order'
																			: 'Ascending Order'}
																	</span>
																) : (
																	<span className="text-sm font-futura">
																		Sort
																		rows by
																		Instructor
																		Id
																	</span>
																)
															}>
															<TableSortLabel
																active={
																	sortColumn ===
																	'id'
																}
																direction={
																	sortColumn ===
																	'id'
																		? sortDirection
																		: 'asc'
																}>
																<div
																	className="flex justify-center items-center "
																	onClick={() =>
																		handleSort(
																			'id'
																		)
																	}>
																	<span className="font-futura text-base font-extrabold">
																		Instructor
																		ID
																	</span>
																</div>
															</TableSortLabel>
														</Tooltip>
														<Tooltip
															title={
																<span className="text-sm font-futura">
																	Click on the
																	column name
																	to sort the
																	rows by
																	Instructor
																	Id
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
																'email' ? (
																	<span className="text-sm font-futura">
																		Sort by{' '}
																		{sortDirection ===
																		'asc'
																			? 'Descending Order'
																			: 'Ascending Order'}
																	</span>
																) : (
																	<span className="text-sm font-futura">
																		Sort
																		rows by
																		Instructor
																		Email
																	</span>
																)
															}>
															<TableSortLabel
																active={
																	sortColumn ===
																	'email'
																}
																direction={
																	sortColumn ===
																	'email'
																		? sortDirection
																		: 'asc'
																}>
																<div
																	className="flex justify-center items-center "
																	onClick={() =>
																		handleSort(
																			'email'
																		)
																	}>
																	<span className="font-futura text-base font-extrabold">
																		Instructor
																		Email
																	</span>
																</div>
															</TableSortLabel>
														</Tooltip>
														<Tooltip
															title={
																<span className="text-sm font-futura">
																	Click on the
																	column name
																	to sort the
																	rows by
																	Instructor
																	Email
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
																'access' ? (
																	<span className="text-sm font-futura">
																		Sort by{' '}
																		{sortDirection ===
																		'asc'
																			? 'Descending Order'
																			: 'Ascending Order'}
																	</span>
																) : (
																	<span className="text-sm font-futura">
																		Sort
																		rows by
																		Instructor
																		Access
																	</span>
																)
															}>
															<TableSortLabel
																active={
																	sortColumn ===
																	'access'
																}
																direction={
																	sortColumn ===
																	'access'
																		? sortDirection
																		: 'asc'
																}>
																<div
																	className="flex justify-center items-center "
																	onClick={() =>
																		handleSort(
																			'access'
																		)
																	}>
																	<span className="font-futura text-base font-extrabold">
																		Instructor
																		Access
																	</span>
																</div>
															</TableSortLabel>
														</Tooltip>
														<Tooltip
															title={
																<span className="text-sm font-futura">
																	Click on the
																	column name
																	to sort the
																	rows by
																	Instructor
																	Access
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
																	No
																	instructors
																	found
																</span>
															</TableCell>
														</TableRow>
													) : (
														sortedData
															.slice(
																page *
																	rowsPerPage,
																page *
																	rowsPerPage +
																	rowsPerPage
															)
															.map(
																(
																	instructor
																) => (
																	// <TableRow
																	//   className="bg-white"
																	//   key={instructor.id}
																	//   sx={{
																	//     "&:last-child td, &:last-child th": {
																	//       border: 0,
																	//     },
																	//   }}
																	// >
																	<TableRow
																		className="bg-white"
																		key={
																			instructor.id
																		}
																		sx={{
																			'&:last-child td, &:last-child th':
																				{
																					border: 0,
																				},
																			cursor: 'pointer',
																		}}
																		hover
																		onClick={(
																			event
																		) =>
																			handleClick(
																				event,
																				instructor.name
																			)
																		}
																		role="checkbox"
																		aria-checked={
																			instructor.selected
																		}
																		tabIndex={
																			-1
																		}
																		selected={
																			instructor.selected
																		}>
																		<TableCell padding="checkbox">
																			<Checkbox
																				color="primary"
																				checked={
																					instructor.selected
																				}
																				inputProps={{
																					'aria-labelledby': `enhanced-table-checkbox-${instructor.id}`,
																				}}
																			/>
																		</TableCell>
																		<TableCell
																			align="left"
																			component="th"
																			scope="row"
																			id={`enhanced-table-checkbox-${instructor.id}`}>
																			<span className="font-futura text-base mr-10">
																				{
																					instructor.name
																				}
																			</span>
																		</TableCell>
																		<TableCell align="left">
																			<span className="font-futura text-base">
																				{
																					instructor.id
																				}
																			</span>
																		</TableCell>
																		<TableCell align="left">
																			<span className="font-futura text-base">
																				{
																					instructor.email
																				}
																			</span>
																		</TableCell>
																		<TableCell align="left">
																			<span
																				className={`font-futura text-base ${
																					instructor.access
																						? 'text-green-500'
																						: `text-red-500`
																				}`}>
																				{instructor.access
																					? 'Granted'
																					: 'Revoked'}
																			</span>
																		</TableCell>
																	</TableRow>
																)
															)
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
						)}
					</div>
				</div>
				<div className="flex-grow" />
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
					}}>
					<p className=" font-futura text-xl">{modalContent}</p>
				</Modal>
				<Modal
					name="grant_access"
					width={750}
					open={isModalVisible2}
					title={
						<span className="text-center font-futura text-2xl">
							Grant Access
						</span>
					}
					className="text-center font-futura text-xl"
					// footer={null}
					onCancel={() => setIsModalVisible2(false)}
					// onOk={() => {
					// 	handleToggleVisibility();
					// }}
					footer={[
						<div className="flex justify-center" key="buttons">
							<Button
								key="close"
								className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
								onClick={() => {
									setIsModalVisible2(false);
								}}>
								<span className="text-white hover:text-hover text-base font-futura">
									Cancel
								</span>
							</Button>
							<Button
								key="ok"
								className="bg-green-500 h-auto hover:bg-green-400"
								onClick={() => {
									grantRevokeButtonHandler('1');
								}}>
								<span className="text-white hover:text-white text-base font-futura">
									Confirm, Grant Access
								</span>
							</Button>
						</div>,
					]}>
					<p className=" font-futura text-xl">
						Are you sure you want to grant Instructor access to the
						selected instructor(s)?
					</p>
					<Box sx={{ marginTop: 5 }}>
						<Table size="small" aria-label="instructor">
							{/* <TableHead>
								<span className="font-futura text-base font-semibold">
									Instructor Information:
								</span>
							</TableHead> */}
							<TableCell
								align="left"
								className="text-left font-futura bg-slate-200">
								<span className="font-futura text-base font-semibold ">
									Instructor ID
								</span>
							</TableCell>
							<TableCell
								align="left"
								className=" font-futura  bg-slate-200">
								<span className="font-futura text-base mr-6 font-semibold">
									Instructor Name
								</span>
							</TableCell>
							<TableCell
								align="left"
								className=" font-futura  bg-slate-200">
								<span className="font-futura text-base mr-6 font-semibold">
									Instructor Email
								</span>
							</TableCell>

							<TableBody>
								{selectedInstructorsData?.map(
									(instructor, index) => (
										<TableRow key={instructor.id}>
											<TableCell align="left">
												<span className="font-bold text-green-500 text-base font-futura">
													{instructor.id}
												</span>
											</TableCell>
											<TableCell align="left">
												<span
													className={
														'text-base text-green-500 font-futura'
													}>
													{instructor.name}
												</span>
											</TableCell>
											<TableCell align="left">
												<span
													className={
														'text-base text-green-500 font-futura'
													}>
													{instructor.email}
												</span>
											</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</Box>
				</Modal>
				<Modal
					name="revoke_access"
					width={750}
					open={isModalVisible3}
					title={
						<span className="text-center font-futura text-2xl">
							Revoke Access
						</span>
					}
					className="text-center font-futura text-2xl"
					// footer={null}
					onCancel={() => setIsModalVisible3(false)}
					// onOk={() => {
					// 	handleToggleVisibility();
					// }}
					footer={[
						<div className="flex justify-center" key="buttons">
							<Button
								key="close"
								className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
								onClick={() => {
									setIsModalVisible3(false);
								}}>
								<span className="text-white hover:text-hover text-base font-futura">
									Cancel
								</span>
							</Button>
							<Button
								key="ok"
								className="bg-green-500 h-auto hover:bg-green-400"
								onClick={() => {
									grantRevokeButtonHandler('0');
								}}>
								<span className="text-white hover:text-white text-base font-futura">
									Confirm, Revoke Access
								</span>
							</Button>
						</div>,
					]}>
					<p className=" font-futura text-xl">
						Are you sure you want to revoke Instructor access for
						the selected instructor(s)?
					</p>
					<Box sx={{ marginTop: 5 }}>
						<Table
							size="small"
							aria-label="instructor"
							className="border-2 border-slate-200">
							{/* <TableHead>
								<span className="font-futura text-base font-semibold">
									Instructor Information:
								</span>
							</TableHead> */}
							<TableCell
								align="left"
								className=" font-futura bg-slate-200">
								<span className="font-futura text-base font-semibold ">
									Instructor Id
								</span>
							</TableCell>
							<TableCell
								align="left"
								className=" font-futura  bg-slate-200">
								<span className="font-futura text-base mr-6 font-semibold">
									Instructor Name
								</span>
							</TableCell>
							<TableCell
								align="left"
								className="font-futura  bg-slate-200">
								<span className="font-futura text-base mr-6 font-semibold">
									Instructor Email
								</span>
							</TableCell>

							<TableBody>
								{selectedInstructorsData?.map(
									(instructor, index) => (
										<TableRow key={instructor.id}>
											<TableCell align="left">
												<span className="font-bold text-red-500 text-base font-futura">
													{instructor.id}
												</span>
											</TableCell>
											<TableCell align="left">
												<span
													className={
														'text-base text-red-500 font-futura'
													}>
													{instructor.name}
												</span>
											</TableCell>
											<TableCell align="left">
												<span
													className={
														'text-base text-red-500 font-futura'
													}>
													{instructor.email}
												</span>
											</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</Box>
				</Modal>
				<NetworkErrorModal />
			</Content>
			<Footer className="p-0">{<AppFooter />}</Footer>
		</Layout>
	);
}

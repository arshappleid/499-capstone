// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import {
	Button,
	Divider,
	Space,
	Tooltip,
	Form,
	Modal,
	Input,
	message,
} from 'antd';
import {
	LoadingOutlined,
	InfoCircleOutlined,
	EditTwoTone,
	DeleteTwoTone,
} from '@ant-design/icons';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useSelector, useDispatch } from 'react-redux';
import { updateGroupName, updateGroupId } from '../store/appReducer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

function Row(props) {
	const dispatch = useDispatch();
	const [loading, isLoading] = useState(true);
	const navigate = useNavigate();
	const { row, openAll, fetchGroups } = props;
	const [open, setOpen] = useState(false);
	const [students, setStudents] = useState([]);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [deleteModalVisible1, setDeleteModalVisible1] = useState(false);
	const [deleteModalTitle1, setDeleteModalTitle1] = useState('');
	const [deleteModalContent1, setDeleteModalContent1] = useState('');

	const groupId = useSelector((state) => state.groupId);
	const courseId = useSelector((state) => state.courseId);
	const instructorId = useSelector((state) => state.instructorId);
	const groupName = useSelector((state) => state.groupName);
	const courseName = useSelector((state) => state.courseName);

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

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				isLoading(true);
				const requestStudent = { group_id: row.groupId };
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
				const message = response.data.message;

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
				} else {
					setStudents([]);
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

		fetchStudents();
	}, [row.groupId]);

	useEffect(() => {
		setOpen(openAll);
	}, [openAll]);

	const groupClickHandler = (groupId, groupname) => {
		//localStorage.setItem('groupId', groupId);
		//localStorage.setItem('groupName', groupname);
		dispatch(updateGroupId(groupId));
		dispatch(updateGroupName(groupname));
	};

	const [data, setData] = useState([]);
	const deleteGroupHandler = () => {
		const deleteGroup = async () => {
			try {
				const requestData = {
					group_id: groupId,
					instructor_id: instructorId,
					course_id: courseId,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL +
						'instructor/removestudentsandgroupsfromcourse',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;
				if (status === 'success') {
					setDeleteModalVisible(false);
					setDeleteModalVisible1(true);
					setDeleteModalTitle1(response.data.status);
					setDeleteModalContent1(message);
					setTimeout(() => {
						setDeleteModalVisible1(false);
						fetchGroups();
					}, 2000);
					const grpMemberStatus = response.data.groupMemberStatus;
					setDeleteModalContent1(grpMemberStatus);
					setData(grpMemberStatus);
				} else {
					setDeleteModalVisible(false);
					setDeleteModalVisible1(true);
					setDeleteModalTitle1(response.data.status);
					setDeleteModalContent1(message);
					setTimeout(() => {
						setDeleteModalVisible1(false);
						fetchGroups();
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
		deleteGroup();
	};

	return (
		<Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell onClick={() => setOpen(!open)}>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}>
						{open ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}
					</IconButton>

					<span className="font-futura text-base">
						{row.groupName}
					</span>
				</TableCell>
				<TableCell align="right">
					<Tooltip
						title={
							<span className="font-futura text-base">
								Edit Group Members
							</span>
						}>
						<Button
							href="/groupmemberspage"
							type="default"
							onClick={() =>
								groupClickHandler(row.groupId, row.groupName)
							}
							className=" text-center h-auto">
							<span className="font-futura text-base">
								<EditTwoTone className=" text-xl" />
							</span>
						</Button>
					</Tooltip>
					<Tooltip
						title={
							<span className="font-futura text-base">
								Delete Group
							</span>
						}>
						<Button
							className="ml-6 text-center h-auto"
							onClick={() => {
								//localStorage.setItem('group_id', row.groupId);
								dispatch(updateGroupId(row.groupId));
								dispatch(updateGroupName(row.groupName));
								setDeleteModalVisible(true);
							}}>
							<DeleteTwoTone
								className=" text-lg"
								twoToneColor={'red'}
							/>
						</Button>
					</Tooltip>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					className="pb-0 pt-0"
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" aria-label="students">
								<TableCell className="text-left font-futura bg-slate-200">
									<span className="font-futura text-base font-semibold">
										Student Name
									</span>
								</TableCell>
								<TableCell
									align="right"
									className="text-left font-futura  bg-slate-200">
									<span className="font-futura text-base mr-6 font-semibold">
										Student ID
									</span>
								</TableCell>

								<TableBody>
									{students.length > 0 ? (
										students.map((student) => (
											<TableRow key={student.student_id}>
												<TableCell align="left">
													<span className="font-futura text-base">
														{student.fullName}
													</span>
												</TableCell>
												<TableCell align="right">
													<span className="font-futura mr-6 text-base">
														{student.student_id}
													</span>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												align="center"
												colSpan={6}>
												<span className="font-futura text-base">
													Empty Group{' '}
												</span>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
			{/* <Modal
				title={deleteModalTitle}
				open={deleteModalVisible}
				onCancel={() => setDeleteModalVisible(false)}
				onOk={() => {
					setDeleteModalVisible(false);
				}}>
				{deleteModalContent}
			</Modal> */}
			<Modal
				className="font-futura text-center"
				width={600}
				title={
					<span className="text-lg font-semibold">Delete Group</span>
				}
				open={deleteModalVisible}
				onCancel={() => setDeleteModalVisible(false)}
				// onOk={() => {
				// 	deleteGroupHandler();
				// 	setDeleteModalVisible1(true);
				// }}
				footer={[
					<div className="flex justify-center" key="buttons">
						<Button
							type="default"
							className="bg-blue-500 hover:bg-blue-400 h-auto hover:border-transparent font-futura text-base"
							key="cancel"
							onClick={() => setDeleteModalVisible(false)}>
							<span className="font-futura text-base text-white hover:text-white">
								Cancel
							</span>
						</Button>
						<Button
							type="default"
							className="bg-red-500 hover:bg-red-400 h-auto hover:border-transparent font-futura text-base"
							key="cancel"
							onClick={() => {
								deleteGroupHandler();
								setDeleteModalVisible1(true);
							}}>
							<span className="font-futura text-base text-white hover:text-white">
								Delete
							</span>
						</Button>
					</div>,
				]}>
				<span className="text-base">
					<span className="font-bold">Group: </span>
					{groupName} from <br />
					<span className="font-bold">Course: </span>
					{courseName}?
				</span>
				<br />
				<br />

				<span className="text-red-500 text-base">
					<span className=" font-bold">Warning: </span>All the Group
					Evaluation records and Peer Assignment Assessment data
					related to the following students and the following group
					will be lost on deletion of the group{' '}
				</span>
				<Box sx={{ marginTop: 5 }}>
					<Table size="small" aria-label="students">
						{/* <TableHead>
							<span className="font-futura text-base font-semibold">
								Student Information:
							</span>
						</TableHead> */}
						<TableCell className="text-left font-futura bg-slate-200">
							<span className="font-futura text-base font-semibold ">
								Student Name
							</span>
						</TableCell>
						<TableCell
							align="right"
							className="text-left font-futura  bg-slate-200">
							<span className="font-futura text-base mr-6 font-semibold">
								Student ID
							</span>
						</TableCell>

						<TableBody>
							{students.length > 0 ? (
								students.map((student) => (
									<TableRow key={student.student_id}>
										<TableCell align="left">
											<span className="font-futura text-base text-red-500">
												{student.fullName}
											</span>
										</TableCell>
										<TableCell align="right">
											<span className="font-futura mr-6 text-base text-red-500">
												{student.student_id}
											</span>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell align="center" colSpan={6}>
										<span className="font-futura text-base text-red-500">
											No students in this group
										</span>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Box>
				<span className="text-base">
					Are you sure you want to delete the group?
					<br />
				</span>
			</Modal>
			<Modal
				className="text-center font-futura text-xl font-extrabold"
				title={
					<span className="text-center font-semibold text-xl capitalize">
						{deleteModalTitle1}
					</span>
				}
				open={deleteModalVisible1}
				footer={null}
				onCancel={() => {
					setDeleteModalVisible1(false);
					fetchGroups();
				}}
				onOk={() => {
					setDeleteModalVisible1(false);
					fetchGroups();
				}}
				// footer={[
				// 	<div className="flex justify-center" key="buttons">
				// 		<Button
				// 			type="default"
				// 			className=" hover:border-transparent bg-blue-500 hover:bg-blue-400 h-auto font-futura text-base"
				// 			key="ok"
				// 			onClick={() => {
				// 				setDeleteModalVisible1(false);
				// 				fetchGroups();
				// 			}}>
				// 			<span className="font-futura text-base text-white hover:text-white">
				// 				OK
				// 			</span>
				// 		</Button>
				// 	</div>,
				// ]}
			>
				{data?.map((student, index) => (
					<div key={index} className="flex font-futura">
						<p className="mr-2 font-bold text-base font-futura">
							Student Id:
						</p>
						<p className="mr-2 font-bold text-base font-futura">
							{student.student_id},&nbsp;
						</p>
						<p className="mr-2 font-bold text-base font-futura">
							&nbsp;Status:{' '}
						</p>
						<p
							className={
								student.student_status ===
								'Student remove from group error'
									? 'text-red-500 text-base font-futura'
									: 'text-green-500 text-base font-futura'
							}>
							{student.student_status}
						</p>
					</div>
				))}
			</Modal>
			<NetworkErrorModal />
		</Fragment>
	);
}

function GroupTable() {
	const navigate = useNavigate();
	const [loading, isLoading] = useState(true);
	const [groups, setGroups] = useState([]);
	const [originalGroups, setOriginalGroups] = useState([]);
	const [openAll, setOpenAll] = useState(false);
	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	//const instId = localStorage.getItem('instructor_id');
	//const courseId = localStorage.getItem('course_id');
	const [searchText, setSearchText] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible1, setModalVisible1] = useState(false);
	const [modalContent1, setModalContent] = useState('');
	const [modalTitle1, setModalTitle1] = useState('');
	const [groupValue, setGroupValue] = useState('');
	const [sortedData, setSortedData] = useState([]);
	const [sortColumn, setSortColumn] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');

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

	const fetchGroups = async () => {
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
				setOriginalGroups(allGroups);
				setSortedData(allGroups);
			} else {
				setGroups([]);
				setOriginalGroups([]);
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
		fetchGroups();
	}, [instructorId, courseId]);

	const applyFilter = (value) => {
		if (value === '') {
			setGroups(originalGroups);
			setSortedData(originalGroups);
		} else {
			const filteredValue = originalGroups.filter((groupItem) =>
				groupItem.groupName.toLowerCase().includes(value.toLowerCase())
			);
			setSortedData(filteredValue);
			setGroups(filteredValue);
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

	const toggleAllGroups = () => {
		setOpenAll(!openAll);
	};

	const [form] = Form.useForm();

	const validatePattern = (_, value) => {
		if (value && value.trimLeft() !== value) {
			return Promise.reject('Value cannot start with a space');
		}
		return Promise.resolve();
	};

	const onFinish = async (values) => {
		const groupName = values.GROUP_NAME;
		const validateGroup = async () => {
			try {
				const requestData = {
					instructor_id: instructorId,
					course_id: courseId,
					group_name: groupName,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/instructorcreategroup',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;
				if (status === 'success') {
					fetchGroups();
					setModalTitle1('Add group status');
					setModalContent(message);
					setModalVisible1(true);
					setTimeout(() => {
						setModalVisible1(false);
					}, 2000);
				} else {
					setModalTitle1('Add group status');
					setModalContent(message);
					setModalVisible1(true);
					setTimeout(() => {
						setModalVisible1(false);
					}, 2000);
				}
				form.resetFields();
			} catch (error) {
				if (error.isAxiosError && error.response === undefined) {
					setNetworkErrorMessage(error.message);
					setNetworkErrorModalVisible(true);
					form.resetFields();
				} else {
					setModalContent(message);
					setModalTitle1('Error');
					setModalVisible1(true);
					form.resetFields();
				}
			}
		};
		validateGroup();
		setModalVisible(false);
	};

	const onFinishFailed = () => {
		setModalContent('Please enter a valid Group Name');
		setModalTitle1('Add Group Failed');
		setModalVisible1(true);
		setTimeout(() => {
			setModalVisible1(false);
		}, 2000);
	};

	return (
		<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll">
			<header className="outline-offset-2 outline-1 rounded border p-4 flex flex-col">
				<Divider className="font-futura mx-auto w-full rounded-lg py-4 bg-blue-200">
					<Space class="flex justify-between">
						<div className="flex">
							<p className="text-xl font-semibold font-futura mt-2">
								Groups Information
							</p>
							<Input
								bordered={true}
								placeholder="Search through the table using the Group name"
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
								className=" mr-2 mt-3"
								title={
									<span className="text-base font-futura">
										Search through the table using the Group
										name
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
									navigate('/addgroupspage');
								}}>
								<span className="font-futura text-base">
									+ Student Groups
								</span>
							</Button>
							<Button
								type="primary"
								className="bg-blue-400 text-white h-auto hover:text-white ml-2"
								onClick={() => {
									setModalVisible(true);
								}}>
								<span className="font-futura text-base">
									+ Empty Group
								</span>
							</Button>
							<Tooltip
								className=" ml-2 mt-2"
								title={
									<span className="text-base font-futura">
										Add an empty group to the course using
										this button, input a unique Group name
										and edit the newly formed group to add
										students to the group
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
								<br /> Loading Groups Information...
							</h3>
						)}
						{!loading && sortedData?.length > 0 ? (
							<TableContainer
								component={Paper}
								className="w-full">
								<Table aria-label="collapsible table">
									<TableHead>
										<TableRow>
											<TableCell className="text-left bg-slate-200">
												<Tooltip
													title={
														sortColumn ===
														'groupName' ? (
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
																'groupName' &&
															sortDirection ===
																'asc'
														}
														direction={
															sortColumn ===
															'groupName'
																? sortDirection
																: 'asc'
														}
														label="Group Name"
														onClick={() =>
															handleSort(
																'groupName'
															)
														}>
														<div
															style={{
																display: 'flex',
																alignItems:
																	'center',
																cursor: 'pointer',
															}}
															onClick={() =>
																handleSort(
																	'groupName'
																)
															}>
															<span className="font-futura text-base ml-2 font-semibold">
																Group Name
															</span>
														</div>
													</TableSortLabel>
												</Tooltip>
												<Tooltip
													title={
														<span className="text-base font-futura">
															Click on the column
															name to sort the
															rows by Group Name
														</span>
													}>
													<InfoCircleOutlined />
												</Tooltip>
											</TableCell>
											<TableCell className=" bg-slate-200 ">
												{/* <span className="font-futura text-base ml-2 font-semibold"></span> */}
												<div className=" flex justify-end items-end">
													<Button
														type="primary"
														className="bg-blue-400 text-white h-auto hover:text-white "
														onClick={
															toggleAllGroups
														}>
														{openAll ? (
															<span className="font-futura text-white hover:text-white text-base px-2">
																Collapse All
																Groups
															</span>
														) : (
															<span className="font-futura text-white hover:text-white text-base px-2">
																Expand All
																Groups
															</span>
														)}
													</Button>
												</div>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{sortedData.map((row) => (
											<Row
												key={row.groupId}
												row={row}
												openAll={openAll}
												fetchGroups={fetchGroups}
											/>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						) : loading ? null : (
							// <p className="text-lg font-futura mb-10 mt-4">
							// 	No Groups found
							// </p>
							<TableContainer
								component={Paper}
								className="w-full">
								<Table aria-label="collapsible table">
									<TableHead>
										<TableRow>
											<TableCell className="text-left bg-slate-200">
												<span className="font-futura text-base ml-2 font-semibold">
													Group Name
												</span>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell align="center">
												<span className="font-futura text-base">
													No Group Found
												</span>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</div>
				</div>
				<Modal
					open={modalVisible}
					title={
						<span className="text-center text-xl font-semibold font-futura">
							Add Empty Student Group
						</span>
					}
					className="text-center font-futura"
					onCancel={() => setModalVisible(false)}
					// onOk={submitHandler}
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
						</div>,
					]}>
					<Form
						name="add_group"
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						layout="horizontal"
						className="w-full"
						form={form}>
						<Space className="flex flex-row flex-grow whitespace-nowrap mt-4">
							<Form.Item
								label={
									<span className="font-futura text-lg">
										Group Name
									</span>
								}
								name="GROUP_NAME"
								rules={[
									{
										required: true,
										pattern:
											/^[A-Za-z0-9\s!@#$%^&*()-=_+{}[\]|:;"'<>,.?/\\]+$/,
										message:
											'Please input valid group name!',
									},
									{ validator: validatePattern },
								]}
								className="inline-flex ">
								<div>
									<Input
										className="font-futura text-base pr-20"
										placeholder="Enter Group Name"
										maxLength={150}
									/>
									<Tooltip
										title={
											<span className="text-base font-futura">
												Enter new Group Name here, it
												should not start with a space
												and should be unique. You cannot
												change the Group Name later.
											</span>
										}
										className="ml-4">
										<InfoCircleOutlined className="text-base mb-2" />
									</Tooltip>
								</div>
							</Form.Item>
						</Space>
						<Form.Item>
							<Button
								type="default"
								htmlType="submit"
								data-testid="signup-submit"
								className="bg-green-500  hover:bg-green-400  h-auto hover:border-transparent font-futura text-base">
								<span className="text-white hover:text-white">
									Submit
								</span>
							</Button>
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					className="text-center font-futura capitalize text-xl"
					title={
						<span className="text-xl font-semibold">
							{modalTitle1}
						</span>
					}
					open={modalVisible1}
					onCancel={() => {
						setModalVisible1(false);
					}}
					footer={null}
					// onOk={() => {
					// 	setModalVisible1(false);
					// }}
					// footer={[
					// 	<div className="flex justify-center" key="buttons">
					// 		<Button
					// 			type="default"
					// 			className="bg-blue-500 hover:bg-blue-400 hover:border-transparent font-futura text-base"
					// 			key="ok"
					// 			onClick={() => setModalVisible1(false)}>
					// 			<span className="font-futura text-base text-white hover:text-white">
					// 				OK
					// 			</span>
					// 		</Button>
					// 	</div>,
					// ]}
				>
					<span className=" text-lg ">{modalContent1}</span>
				</Modal>
				<NetworkErrorModal />
			</header>
		</div>
	);
}

export default GroupTable;

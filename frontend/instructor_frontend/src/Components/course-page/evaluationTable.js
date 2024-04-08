// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)
import {
	Button,
	Divider,
	Input,
	Space,
	Switch,
	Modal,
	ConfigProvider,
	Tooltip,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import {
	InfoCircleOutlined,
	EditTwoTone,
	DeleteTwoTone,
} from '@ant-design/icons';
import { StyleProvider } from '@ant-design/cssinjs';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useSelector, useDispatch } from 'react-redux';
import {
	updateGroupId,
	updateEvaluationFormName,
	updateFormId,
} from '../store/appReducer';
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

function EvaluationTable() {
	const [loading, isLoading] = useState(true);

	const [checked1, setChecked1] = useState(false);
	const [formId, setFormId] = useState(0);
	const [formName, setFormName] = useState('');

	const [checked2, setChecked2] = useState(false);
	const [formId2, setFormId2] = useState(0);
	const [formName2, setFormName2] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [groupsEvaluations, setGroupsEvaluations] = useState([]);
	const [originalGroupsEvaluations, setOriginalGroupsEvaluations] = useState(
		[]
	);
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

	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	dispatch(updateGroupId());

	useEffect(() => {
		const fetchEvaluations = async () => {
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
					BACKEND_URL + 'instructor/getformlist',
					requestData,
					{ headers: headers }
				);

				const status = response.data.status;

				if (status === 'success') {
					if (response.data.data.length !== 0) {
						const allEvaluations = response.data.data.map(
							(evaluation) => {
								const datetime = new Date(evaluation.DEADLINE);
								const formattedDate = datetime.toDateString();
								const options = {
									timeZone: 'America/Los_Angeles',
									hour12: true,
									hour: 'numeric',
									minute: 'numeric',
								};
								const formattedTime =
									datetime.toLocaleTimeString(
										'en-US',
										options
									);
								return {
									formId: evaluation.FORM_ID,
									formName: evaluation.FORM_NAME,
									formDeadline: `${formattedDate} ${formattedTime}`,
									formFeedback: evaluation.SHARE_FEEDBACK,
									shareFeedback: evaluation.SHARE_FEEDBACK,
									visibility: evaluation.VISIBILITY,
								};
							}
						);

						setOriginalGroupsEvaluations(allEvaluations);
						setGroupsEvaluations(allEvaluations);
						setSortedData(allEvaluations);
					} else {
						setOriginalGroupsEvaluations([]);
						setGroupsEvaluations([]);
						setSortedData([]);
					}
					isLoading(false);
				} else {
					isLoading(false);
					setOriginalGroupsEvaluations([]);
					setGroupsEvaluations([]);
					setSortedData([]);
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

		fetchEvaluations();
	}, []);

	const applyFilter = (value) => {
		if (value === '') {
			setGroupsEvaluations(originalGroupsEvaluations);
			setSortedData(originalGroupsEvaluations);
		} else {
			const filteredValue = originalGroupsEvaluations.filter(
				(evaluation) =>
					evaluation.formName
						.toLowerCase()
						.includes(value.toLowerCase())
			);
			setPage(0);
			setGroupsEvaluations(filteredValue);
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

	const handleToggleFeedback = async () => {
		try {
			const requestData = {
				instructor_id: instructorId,
				form_id: formId,
				form_sharefeedback: checked2 ? 1 : 0,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorsetformsharefeedback',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			setSortedData((prevEvaluations) =>
				prevEvaluations.map((evaluation) => {
					if (evaluation.formId === formId) {
						return { ...evaluation, shareFeedback: checked2 };
					}
					return evaluation;
				})
			);
			if (status === 'success') {
				if (checked2 === true) {
					setModalTitle4('Feedback Released!');
					setModalContent4(
						`${formName} feedback has been released to the students.`
					);
					setIsModalVisible4(true);
					setTimeout(() => {
						setIsModalVisible4(false);
						setIsModalVisible3(false);
					}, 2000);
				} else {
					setModalTitle4('Feedback Hidden!');
					setModalContent4(
						`${formName} feedback has been hidden from the students.`
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
	const confirmToggleFeedback = (checked, formId, formName) => {
		if (checked === true) {
			setModalTitle3('Feedback Release/Hide');
			setModalContent3(
				`Are you sure you want to release ${formName} feedback?`
			);
			setIsModalVisible3(true);
		} else {
			setModalTitle3('Feedback Release/Hide');
			setModalContent3(
				`Are you sure you want to hide ${formName} feedback?`
			);
			setIsModalVisible3(true);
		}
	};
	const confirmToggleVisibility = (checked, formId, formName) => {
		if (checked === true) {
			setModalTitle2('Form Publish/Unpublish');
			setModalContent2(
				`Are you sure you want to publish ${formName} Form?`
			);
			setIsModalVisible2(true);
		} else {
			setModalTitle2('Form Publish/Unpublish');
			setModalContent2(
				`Are you sure you want to unpublish ${formName} Form?`
			);
			setIsModalVisible2(true);
		}
	};
	const handleToggleVisibility = async () => {
		//confirmToggleVisibility(checked, formId, formName);

		try {
			const requestData = {
				instructor_id: instructorId,
				form_id: formId,
				form_visibility: checked1 ? 1 : 0,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorsetformvisibility',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			setSortedData((prevEvaluations) =>
				prevEvaluations.map((evaluation) => {
					if (evaluation.formId === formId) {
						return { ...evaluation, visibility: checked1 };
					}
					return evaluation;
				})
			);
			if (status === 'success') {
				if (checked1 === true) {
					setModalTitle('Form Published!');
					setModalContent(
						`${formName} Form has been released to the students.`
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						setIsModalVisible2(false);
					}, 2000);
				} else {
					// await handleToggleFeedback(false, formId, formName);
					setModalTitle('Form Unpublished!');
					setModalContent(
						`${formName} Form has been hidden from the students.`
					);
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						setIsModalVisible2(false);
					}, 2000);
					try {
						const requestData = {
							instructor_id: instructorId,
							form_id: formId,
							form_sharefeedback: 0,
						};
						const headers = {
							'Content-Type': 'application/json',
							authorization:
								localStorage.getItem('Authorization'),
						};
						const response = await axios.post(
							BACKEND_URL +
								'instructor/instructorsetformsharefeedback',
							requestData,
							{ headers: headers }
						);
						const status = response.data.status;
						if (status === 'success') {
							setChecked2(false);
						}
						// setSortedData((prevEvaluations) =>
						// 	prevEvaluations.map((evaluation) => {
						// 		if (evaluation.formId === formId) {
						// 			return {
						// 				...evaluation,
						// 				shareFeedback: checked2,
						// 			};
						// 		}
						// 		return evaluation;
						// 	})
						// );
						// if (status === 'success') {
						// 	if (checked2 === true) {
						// 		setModalTitle4('Feedback Released!');
						// 		setModalContent4(
						// 			`${formName} feedback has been released to the students.`
						// 		);
						// 		setIsModalVisible4(true);
						// 		setTimeout(() => {
						// 			setIsModalVisible4(false);
						// 			setIsModalVisible3(false);
						// 		}, 2000);
						// 	} else {
						// 		setModalTitle4('Feedback Hidden!');
						// 		setModalContent4(
						// 			`${formName} feedback has been hidden from the students.`
						// 		);
						// 		setIsModalVisible4(true);
						// 		setTimeout(() => {
						// 			setIsModalVisible4(false);
						// 			setIsModalVisible3(false);
						// 		}, 2000);
						// 	}
						// } else {
						// 	const message = response.data.message;
						// 	setModalTitle3('Error!');
						// 	setModalContent3(message);
						// 	setIsModalVisible3(true);
						// 	setTimeout(() => {
						// 		setIsModalVisible3(false);
						// 	}, 2000);
						// }
					} catch (error) {
						if (
							error.isAxiosError &&
							error.response === undefined
						) {
							setNetworkErrorMessage(error.message);
							setNetworkErrorModalVisible(true);
						} else {
							setNetworkErrorMessage(error.message);
							setNetworkErrorModalVisible(true);
						}
					}
					window.location.reload();
				}
			} else {
				const message = response.data.message;
				setModalTitle('Error!');
				setModalContent(
					'Cannot unpublish the form since the ' + message
				);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					setIsModalVisible2(false);
					// window.location.reload();
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
	const checkEvaluationFormRecords = async (formId) => {
		try {
			const requestData = {
				form_id: formId,
				instructor_id: instructorId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/checkiftheresanyformrecords',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			return status;
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

	const editFormHandler = async (formId) => {
		const response = await checkEvaluationFormRecords(formId);
		if (response) {
			setModalTitle('Error!');
			setModalContent(
				'Cannot edit the form as there are already responses recorded for this form.'
			);
			setIsModalVisible(true);
			setTimeout(() => {
				setIsModalVisible(false);
			}, 2500);
		} else {
			dispatch(updateFormId(formId));
			navigate('/editevaluationform');
		}
	};
	const deleteFormHandler = async (formId) => {
		const response = await checkEvaluationFormRecords(formId);
		if (response) {
			setModalTitle('Error!');
			setModalContent(
				'Cannot delete the form as there are already responses recorded for this form.'
			);
			setIsModalVisible(true);
			setTimeout(() => {
				setIsModalVisible(false);
			}, 2500);
		} else {
			setModalTitle5('Delete Form');
			setModalContent5(
				'Are you sure you want to delete this form? This action cannot be undone.'
			);
			setIsModalVisible5(true);
		}
	};

	const deletForm = async () => {
		try {
			const requestData = {
				form_id: formId,
				instructor_id: instructorId,
				course_id: courseId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/instructorremoveform',
				requestData,
				{ headers: headers }
			);
			const status = response.data.status;
			if (status === 'success') {
				setModalTitle('Success!');
				setModalContent('Form deleted successfully.');
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					setIsModalVisible5(false);
				}, 2500);
				const newEvaluations = originalGroupsEvaluations.filter(
					(evaluation) => evaluation.formId !== formId
				);
				setOriginalGroupsEvaluations(newEvaluations);
				setGroupsEvaluations(newEvaluations);
				setSortedData(newEvaluations);
			} else {
				const message = response.data.message;
				setModalTitle('Error!');
				setModalContent(message);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					setIsModalVisible5(false);
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

	return (
		<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll">
			<header className="outline-offset-2 outline-1 rounded border p-4 flex flex-col">
				<Divider className="text-3xl font-futura mx-auto w-full rounded-lg bg-blue-200">
					<Space className="flex justify-between">
						<div className="flex">
							<p className="text-xl font-semibold font-futura mt-6 mr-6">
								Evaluation Forms
							</p>
							<Input
								bordered={true}
								placeholder="Search using group evaluation form name"
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
											Search the table using Group
											Evaluation Form name
										</span>
									}>
									<InfoCircleOutlined />
								</Tooltip>
							</div>
						</div>
						<div className="flex ml-40 ">
							<Link to="/evaluationform">
								<Button
									type="primary"
									className="bg-blue-400 text-white h-auto hover:text-white ">
									<span className="font-futura text-base">
										+ New Form
									</span>
								</Button>
							</Link>
							<Tooltip
								className="ml-2 mt-2"
								title={
									<span className="text-base font-futura">
										Create a new Evaluation Form for all
										groups
									</span>
								}>
								<InfoCircleOutlined />
							</Tooltip>
						</div>
					</Space>
				</Divider>
				{loading && (
					<h3 className="w-full font-futura text-lg text-center">
						<p className="font-futura flex items-center justify-center">
							<LoadingOutlined spin />
						</p>
						<br /> Loading Evaluation Forms...
					</h3>
				)}
				{!loading && sortedData.length > 0 ? (
					<div className="overflow-x-auto w-full font-futura ">
						<TableContainer
							className="font-futura rounded-lg border-2 border-slate-200"
							component={Paper}>
							<Table>
								<TableHead className="bg-slate-200">
									<TableRow>
										<TableCell
											align="left"
											className=" mr-10">
											<Tooltip
												title={
													sortColumn ===
													'formName' ? (
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
															Evaluation Form Name
														</span>
													)
												}>
												<TableSortLabel
													active={
														sortColumn ===
															'formName' &&
														sortDirection === 'asc'
													}
													direction={
														sortColumn ===
														'formName'
															? sortDirection
															: 'asc'
													}
													label="Form Name">
													<div
														className="flex justify-center items-center"
														onClick={() =>
															handleSort(
																'formName'
															)
														}>
														<span className="font-futura text-base font-extrabold ml-4 ">
															Evaluation Form
														</span>
													</div>
												</TableSortLabel>
											</Tooltip>
											<Tooltip
												title={
													<span className="text-base font-futura">
														Click on the column name
														to sort the rows by
														Group Evaluation Form
														Name
													</span>
												}>
												<InfoCircleOutlined />
											</Tooltip>
										</TableCell>
										<TableCell
											align="center"
											className=" w-44 ">
											<span className="font-extrabold font-futura text-base">
												Deadline
											</span>
											<Tooltip
												title={
													<span className="text-base font-futura">
														Group Evaluation
														Deadline
													</span>
												}>
												<InfoCircleOutlined className="ml-4" />
											</Tooltip>
										</TableCell>
										<TableCell align="center">
											<span className="font-extrabold font-futura text-base">
												Release Feedback
											</span>
											<Tooltip
												title={
													<span className="text-base font-futura">
														Release the Evaluation
														feedback to the students
														using this toggle. You
														can only release the
														feedback if the Form is
														Released
													</span>
												}>
												<InfoCircleOutlined className="ml-4" />
											</Tooltip>
										</TableCell>
										<TableCell align="center">
											<span className="font-extrabold font-futura text-base">
												Release Form
											</span>
											<Tooltip
												title={
													<span className="text-base font-futura">
														Release the Evaluation
														Form for the students to
														complete using this
														toggle.
													</span>
												}>
												<InfoCircleOutlined className="ml-4" />
											</Tooltip>
										</TableCell>
										<TableCell align="center">
											<span className="font-extrabold font-futura text-base">
												Actions
											</span>
											<Tooltip
												title={
													<span className="text-base font-futura">
														Edit/Delete Evaluation
														Forms
													</span>
												}>
												<InfoCircleOutlined className="ml-4" />
											</Tooltip>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sortedData
										.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
										)
										.map((evaluation) => (
											<TableRow
												className="bg-white"
												key={evaluation.formId}>
												<TableCell align="left">
													<span className="font-futura text-base">
														<Link to="/groupevaluationsoverviewpage">
															<Tooltip
																title={
																	<span className="text-base font-futura">
																		{
																			evaluation.formName
																		}
																	</span>
																}>
																<Button
																	type="link"
																	onClick={() => {
																		dispatch(
																			updateEvaluationFormName(
																				evaluation.formName
																			)
																		);
																		dispatch(
																			updateFormId(
																				evaluation.formId
																			)
																		);
																	}}
																	className="hover:border-blue-500 text-base font-futura hover:border-transparent">
																	{evaluation
																		.formName
																		.length >
																	25
																		? evaluation.formName.slice(
																				0,
																				15
																		  ) +
																		  '...'
																		: evaluation.formName}
																</Button>
															</Tooltip>
														</Link>
													</span>
												</TableCell>
												<TableCell align="center">
													<span className="font-futura text-base">
														{
															evaluation.formDeadline
														}
													</span>
												</TableCell>
												<TableCell
													align="center"
													className="opacity-100">
													<Space>
														<span className="text-base font-futura">
															{/* Release feedback{' '} */}
														</span>
														{evaluation.visibility && (
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
																			evaluation.formId
																		}
																		checked={
																			evaluation.shareFeedback
																		}
																		onChange={(
																			checked
																		) => {
																			setChecked2(
																				checked
																			);
																			setFormId(
																				evaluation.formId
																			);
																			setFormName(
																				evaluation.formName
																			);
																			confirmToggleFeedback(
																				checked,
																				evaluation.formId,
																				evaluation.formName
																			);
																		}}
																		disabled={
																			!evaluation.visibility
																		}
																		className={`outline-none ring-2 ${
																			evaluation.shareFeedback
																				? 'ring-green-500'
																				: 'ring-red-500'
																		}`}
																	/>
																	{!evaluation.visibility && (
																		<Tooltip
																			title="Form must be released first inorder to release feedback"
																			placement="top">
																			<InfoCircleOutlined className="text-base ml-2" />
																		</Tooltip>
																	)}
																</StyleProvider>
															</ConfigProvider>
														)}
													</Space>
												</TableCell>
												<TableCell
													align="center"
													className="opacity-100">
													<Space>
														<span className="text-base font-futura">
															{/* Release feedback{' '} */}
														</span>

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
																		evaluation.formId
																	}
																	checked={
																		evaluation.visibility
																	}
																	onChange={(
																		checked
																	) => {
																		setChecked1(
																			checked
																		);
																		setFormId(
																			evaluation.formId
																		);
																		setFormName(
																			evaluation.formName
																		);
																		confirmToggleVisibility(
																			checked,
																			evaluation.formId,
																			evaluation.formName
																		);
																	}}
																	// className="outline-none ring-2 ring-blue-500 "
																	className={`outline-none ring-2 ${
																		evaluation.visibility
																			? 'ring-green-500'
																			: 'ring-red-500'
																	}`}
																/>
															</StyleProvider>
														</ConfigProvider>
													</Space>
												</TableCell>
												<TableCell align="center">
													<Tooltip
														title={
															<span className="text-base font-futura">
																Edit Group
																Evaluation
															</span>
														}>
														<Button
															type="default"
															align="center"
															onClick={() =>
																editFormHandler(
																	evaluation.formId
																)
															}
															className=" font-bold text-center h-auto">
															<EditTwoTone className="text-xl" />
														</Button>
													</Tooltip>
													<Tooltip
														title={
															<span className="text-base font-futura">
																Delete
																Evaluation
															</span>
														}>
														<Button
															className="ml-6 text-center h-auto"
															onClick={() => {
																//localStorage.setItem('group_id', row.groupId);
																setFormId(
																	evaluation.formId
																);
																deleteFormHandler(
																	evaluation.formId
																);
															}}>
															<DeleteTwoTone
																className=" text-lg"
																// style={{
																// 	fontSize: '1.1rem',
																// }}
																twoToneColor={
																	'red'
																}
															/>
														</Button>
													</Tooltip>
												</TableCell>
											</TableRow>
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
				) : loading ? null : (
					<TableContainer
						component={Paper}
						className="font-futura rounded-lg border-2 border-slate-200 w-full">
						<Table>
							<TableHead className="bg-slate-200">
								<TableRow>
									<TableCell align="center" className="mr-10">
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
														Sort rows by Evaluation
														Form Name
													</span>
												)
											}>
											<div
												className="flex justify-center items-center"
												onClick={() =>
													handleSort('formName')
												}>
												<TableSortLabel
													active={
														sortColumn ===
															'formName' &&
														sortDirection === 'asc'
													}
													direction={
														sortColumn ===
														'formName'
															? sortDirection
															: 'asc'
													}
													label="Form Name">
													<span className="font-futura text-base font-semibold ml-4 ">
														Evaluation Form
													</span>
												</TableSortLabel>
											</div>
										</Tooltip>
									</TableCell>
									<TableCell align="center">
										<span className="font-semibold font-futura text-base">
											Deadline
										</span>
									</TableCell>
									<TableCell align="center">
										<span className="font-semibold font-futura text-base">
											Release Feedback
										</span>
									</TableCell>
									<TableCell align="center">
										<span className="font-semibold font-futura text-base">
											Edit Form
										</span>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow className="bg-white">
									<TableCell colSpan={4} align="center">
										<span className="font-futura text-base">
											No Group Evaluations Forms found
										</span>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				)}
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
				// footer={null}
				onCancel={() => setIsModalVisible5(false)}
				// onOk={() => {
				// 	handleToggleVisibility();
				// }}
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
								deletForm();
							}}>
							<span className="text-white hover:text-white text-base font-futura">
								Confirm
							</span>
						</Button>
					</div>,
				]}>
				<p className=" font-futura text-xl">{modalContent5}</p>
			</Modal>

			<NetworkErrorModal />
		</div>
	);
}

export default EvaluationTable;

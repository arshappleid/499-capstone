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
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	TableContainer,
	TableBody,
	TableCell,
	TableRow,
	Table,
	TableHead,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
	updateAssignmentEvaluatorId,
	updateAssignmentEvaluateeId,
} from '../store/appReducer';

const { Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AssignmentAssessmentOverviewPage() {
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const navigate = useNavigate();
	const [text, setText] = useState();
	const [sortedData, setSortedData] = useState([]);
	const [originalStudent, setOriginalStudent] = useState([]);
	const [gridStudents, setGridStudents] = useState([]);
	const dispatch = useDispatch();
	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	const courseName = useSelector((state) => state.courseName);
	const assignmentId = useSelector((state) => state.assignmentId);
	const assignmentName = useSelector((state) => state.assignmentName);

	const [dropdownVisible, setDropdownVisible] = useState(false);

	const handleDropdownVisibleChange = (visible) => {
		setDropdownVisible(visible);
		if (!visible) {
			setText('');
		}
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
			const requestStudent = { course_id: courseId };
			const headers = {
				'Content-type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getcoursestudentlist',
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
						studentId: STUDENT_ID,
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

	const fetchGridStudent = async (student) => {
		try {
			const requestStudent = {
				instructor_id: instructorId,
				assignment_id: assignmentId,
				evaluatee_id: student.studentId,
			};
			const headers = {
				'Content-type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getassessmentgroupevaluators',
				requestStudent,
				{ headers: headers }
			);
			const status = response.data.status;
			if (status === 'success') {
				const allStudents = response.data.evaluators.map((student) => {
					const { student_id, first_name, middle_name, last_name } =
						student;
					const fullName = `${first_name} ${middle_name || ''} ${
						last_name || ''
					}`;
					return {
						studentId: student_id,
						student_firstname: first_name,
						student_middlename: middle_name || '',
						student_lastname: last_name || '',

						fullName,
					};
				});
				setGridStudents(allStudents);
			} else {
				setNetworkErrorMessage(response.data.message);
				setNetworkErrorModalVisible(true);
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

	const handleStudentClick = (studentId, fullName) => {
		dispatch(updateAssignmentEvaluateeId(studentId));
		setSelectedStudent(
			students.find((student) => student.studentId === studentId)
		);
		// dispatch(updateAssignmentName(groupName));
		setText(fullName);
		setDropdownVisible(false);
	};
	const [studentItems, setStudentItems] = useState([]);

	useEffect(() => {
		const studentItem = students.map((student) => {
			return (
				<a
					key={student.studentId}
					className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900"
					onClick={() =>
						handleStudentClick(student.studentId, student.fullName)
					}>
					{student.fullName}
				</a>
			);
		});
		setStudentItems(studentItem);
	}, [students]);

	useEffect(() => {
		if (selectedStudent) {
			fetchGridStudent(selectedStudent);
		}
	}, [selectedStudent]);
	const viewGradeClickHandler = (evaluateeId) => {
		dispatch(updateAssignmentEvaluateeId(evaluateeId));
		navigate('/viewandeditfinalassessmentgrade');
	};
	const evaluateeCLickHandler = (evaluateeId) => {
		dispatch(updateAssignmentEvaluateeId(selectedStudent.studentId));
		dispatch(updateAssignmentEvaluatorId(evaluateeId));
		navigate('/viewassessmentfeedback');
	};

	const handleSearchChange = (e) => {
		setText(e.target.value);
		const filteredStudents =
			e.target.value !== ''
				? originalStudent.map((student) => {
						if (
							student.student_firstname
								.toLowerCase()
								.includes(e.target.value.toLowerCase()) ||
							student.student_middlename
								.toLowerCase()
								.includes(e.target.value.toLowerCase()) ||
							student.student_lastname
								.toLowerCase()
								.includes(e.target.value.toLowerCase())
						) {
							return (
								<a
									key={student.studentId}
									className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900"
									onClick={() =>
										handleStudentClick(
											student.studentId,
											student.fullName
										)
									}>
									{student.fullName}
								</a>
							);
						}
				  })
				: originalStudent.map((student) => {
						return (
							<a
								key={student.studentId}
								className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								onClick={() =>
									handleStudentClick(
										student.studentId,
										student.fullName
									)
								}>
								{student.fullName}
							</a>
						);
				  });

		setStudentItems(filteredStudents);
	};

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Content className="flex flex-col flex-grow bg-white mb-10">
				<div className="flex flex-col font-futura items-start">
					<Space className="flex flex-row mt-6">
						<p className="text-xl font-futura">
							Select a Student to view their Assignment
							Assessments:
						</p>
						<Dropdown
							placement="bottomLeft"
							trigger={['click']}
							visible={dropdownVisible}
							overlay={
								<div className="bg-white shadow text-xl font-futura rounded py-1">
									<Input
										value={text}
										onChange={handleSearchChange}
										placeholder="Search for a Student..."
										className="font-futura text-base w-full mb-2"
									/>
									<div
										className={`overflow-y-auto  max-h-40`}>
										<span className="text-2xl font-futura">
											{studentItems}
										</span>
									</div>
								</div>
							}
							onVisibleChange={handleDropdownVisibleChange}>
							<Divider className="font-futura mx-auto w-full rounded-lg py-1 bg-slate-200 text-black hover:text-black overflow-hidden">
								<a
									onClick={(e) => e.preventDefault()}
									className="font-futura text-base hover:text-black">
									{text || 'Select a Student'}
									<DownOutlined className="text-sm ml-12" />
								</a>
							</Divider>
						</Dropdown>
					</Space>
				</div>
				{selectedStudent ? (
					<div className="flex rounded-lg w-auto outline-offset-2 outline-1  justify-items-center content-center self-center overflow-scroll overflow-x-auto ">
						<header className="outline-offset-2 outline-1 rounded border p-4 flex flex-col mt-10 ">
							<div className="overflow-x-auto w-full font-futura ">
								<TableContainer className="font-futura rounded-lg border-2 border-slate-200">
									<Table>
										<TableHead className="bg-slate-200 w-auto">
											<TableRow>
												<TableCell
													align="center"
													className="mr-10 ">
													<span className="font-futura text-base font-semibold">
														Evaluatee{' '}
													</span>
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
																	Evaluatee
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
											<TableRow
												key={selectedStudent.studentId}>
												<TableCell className="font-futura text-xl border-r-2 border-slate-200">
													<Tooltip
														title={
															<span className="text-base font-futura">
																{
																	selectedStudent.student_firstname
																}{' '}
																{
																	selectedStudent.student_lastname
																}
															</span>
														}>
														<span className="font-futura text-base">
															{
																selectedStudent.fullName
															}
														</span>
													</Tooltip>
												</TableCell>
												<TableCell className="font-futura text-xl border-r-2 border-slate-200">
													<span
														className={` font-futura text-base grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${
															gridStudents.length >=
															5
																? `5`
																: `${gridStudents.length}`
														}`}>
														{gridStudents.map(
															(stud) => (
																<div>
																	<Tooltip
																		title={
																			<span className="text-base font-futura">
																				{
																					stud.student_firstname
																				}{' '}
																				{
																					stud.student_lastname
																				}
																			</span>
																		}>
																		<Button
																			type="link"
																			onClick={() => {
																				evaluateeCLickHandler(
																					stud.studentId
																				);
																			}}>
																			<span className="font-futura text-base">
																				{
																					stud.student_firstname
																				}
																				{stud.student_lastname
																					? ` ${stud.student_lastname[0]}.`
																					: ''}
																			</span>
																		</Button>
																	</Tooltip>
																</div>
															)
														)}
													</span>
												</TableCell>
												<TableCell>
													<Button
														type="link"
														onClick={() =>
															viewGradeClickHandler(
																selectedStudent.studentId
															)
														}>
														<span className="font-futura text-base">
															View Final Grade
														</span>
													</Button>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</header>
					</div>
				) : null}
				<NetworkErrorModal />
			</Content>
		</Layout>
	);
}

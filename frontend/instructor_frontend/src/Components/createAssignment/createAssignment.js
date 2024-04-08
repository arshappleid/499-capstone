// Author : Shila Rahman and Sehajvir Singh Pannu

import React, { useEffect, useState } from 'react';
import NavigationBar from '../navigationbar';
import { Modal, Button, Space, Layout, Breadcrumb, Tooltip } from 'antd';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import axios from 'axios';
import AppFooter from '../appfooter';
import { useNavigate } from 'react-router-dom';
import { DeleteTwoTone } from '@ant-design/icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { UseUserContext } from '../userContext';

const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
dayjs.extend(utc);
dayjs.extend(timezone);

const CreateAssignment = () => {
	const { courseId } = UseUserContext();
	const navigate = useNavigate();
	const instructorId = useSelector((state) => state.instructorId);
	const [studentList, setStudentList] = useState([]);
	const [value, setValue] = React.useState(dayjs.utc());
	const [numberOfStudents, setNumberOfStudents] = useState(0);
	const courseName = useSelector((state) => state.courseName);
	const [availableFromValue, setAvailableFromValue] = React.useState(
		dayjs.utc().add(1, 'day').hour(6).minute(59)
	);
	const [deadlineValue, setDeadlineValue] = React.useState(
		dayjs.utc().add(1, 'day').hour(6).minute(59)
	);
	const [availableUntilValue, setAvailableUntilValue] = React.useState(
		dayjs.utc().add(1, 'day').hour(6).minute(59)
	);
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
	const RubricSchema = Yup.object().shape({
		assignmentName: Yup.string().required('Assignment Name is required'),
		description: Yup.string().required('Description is required'),
		submissionType: Yup.string()
			.required('Submission Type is required')
			.oneOf(
				[
					'Google Documents',
					'Google Drive',
					'Google Spreadsheets',
					'Google Slides',
					'Dropbox',
				],
				'Invalid Submission Type'
			),
		availableFrom: Yup.string().required('Available From is required'),
		deadline: Yup.string()
			.required('Deadline must be greater than Available From')
			.test(
				'is-greater-than-available-from',
				'Deadline must be greater than Available From',
				function (value) {
					const { availableFrom } = this.parent;
					if (!availableFrom || !value) {
						// If either field is empty, no need to perform validation
						return true;
					}
					return dayjs(value).isAfter(availableFrom);
				}
			),
		availableUntil: Yup.string()
			.required('Available Until must be greater than Deadline')
			.test(
				'is-greater-than-deadline',
				'Available Until must be greater than Deadline',
				function (value) {
					const { deadline } = this.parent;
					if (!deadline || !value) {
						// If either field is empty, no need to perform validation
						return true;
					}
					return dayjs(value).isAfter(deadline);
				}
			),
		numAssessments: Yup.number()
			.required('Number of Assessments per Student is required')
			.integer('Number of Assessments must be an integer')
			.min(0, 'At least one assessment must be selected.')
			.typeError('Number of Assessments must be a valid number'),
		criteria: Yup.array().of(
			Yup.object().shape({
				description: Yup.string().required(
					'All table fields description is required'
				),
				rubrics: Yup.array().of(
					Yup.object().shape({
						name: Yup.string().required(
							'Rating description is required'
						),
						points: Yup.number()
							.required('Rubric points are required')
							.integer('Points must be an integer')
							.min(0, 'Points cannot be negative'),
					})
				),
			})
		),
	});

	useEffect(() => {
		fetchStudentList();
	}, []);

	const fetchStudentList = async () => {
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
			const students = response.data.data;
			setNumberOfStudents(students.length);

			const updatedStudents = students?.map((student) => {
				return {
					value: student.STUDENT_ID,
					label: student.FIRST_NAME + ' ' + student.LAST_NAME,
				};
			});

			const everyoneObj = {
				value: 'everyone',
				label: 'EVERYONE',
			};
			updatedStudents.push(everyoneObj);
			setStudentList(updatedStudents);
		} catch (error) {
			console.error('Failed to fetch student list:', error);
		}
	};

	const initialRubric = {
		assignmentName: '',
		description: '',
		submissionType: '',
		numAssessments: 0,
		availableFrom: availableFromValue?.format('YYYY-MM-DD HH:mm'),
		deadline: deadlineValue?.format('YYYY-MM-DD HH:mm'),
		availableUntil: availableUntilValue?.format('YYYY-MM-DD HH:mm'),
		criteria: [
			{
				id: 0,
				description: '',
				rubrics: [{ id: 0, name: '', points: 0 }],
			},
		],
	};
	const calculateTotalPoints = (rubrics) => {
		const maxPoints = rubrics.reduce(
			(max, rubric) => Math.max(max, rubric.points),
			0
		);
		return maxPoints;
	};

	const spaceItems = document.querySelectorAll('.formfields .ant-space-item');
	spaceItems.forEach((element) => {
		element.classList.add('w-full');
	});

	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura bg-white ">
				<div className="bg-[#F4F4F4] h-20">
					<div className="w-full h-full m-auto flex justify-center p-2 items-center bg-[#DDEEFF]">
						<h1 className=" text-2xl text-ellipsis">
							Create Assignment
						</h1>
					</div>
				</div>
				<Breadcrumb
					className="pl-10 mt-4 text-lg font-futura "
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
							title: <a href="/coursesetting">Course Settings</a>,
						},
						{
							title: (
								<p className="text-black">Create Assignment</p>
							),
						},
					]}
				/>
				{/* <div className="bg-slate-100 mx-auto mt-10 mb-10 rounded-lg w-md h-md md:w-3/4  flex flex-col items-center"> */}
				<div className="bg-slate-100 mx-20 mt-10 mb-10 rounded-lg">
					<div className="flex justify-center">
						<h1 className=" font-futura text-2xl font-bold mt-10">
							Create Assignment
						</h1>
					</div>
					<Formik
						initialValues={initialRubric}
						validationSchema={RubricSchema}
						onSubmit={async (values) => {
							try {
								const requestData = {
									instructor_id: instructorId,
									course_id: courseId,
									assignmentName: values.assignmentName,
									description: values.description,
									submission_type: values.submissionType,
									deadline: values.deadline,
									availableFrom: values.availableFrom,
									availableUntil: values.availableUntil,
									numAssessments: values.numAssessments,
									criteria: values.criteria,
								};
								const headers = {
									'Content-Type': 'application/json',
									authorization:
										localStorage.getItem('Authorization'),
								};
								const response = await axios.post(
									BACKEND_URL +
										'instructor/createassignmentandrubric',
									requestData,
									{ headers: headers }
								);
								const status = response.data.status;
								const message = response.data.message;
								if (status === 'success') {
									setModalTitle('Success');
									setModalContent(
										message +
											'\nRedirecting to Assignment List Page...'
									);
									setIsModalVisible(true);
									setTimeout(() => {
										setIsModalVisible(false);
										navigate('/assignmentlistpage');
									}, 2000);
								} else {
									setModalTitle('Error');
									setModalContent(message);
									setIsModalVisible(true);
								}
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
						}}>
						{({ values, setFieldValue, isValid, errors }) => (
							<>
								<Form>
									<Space className="flex flex-col items-start justify-items-start w-full mt-10 formfields">
										<div className="flex flex-col items-start w-full mt-10">
											<label
												htmlFor="assignmentName"
												className="font-futura font-bold ml-14 text-lg h-10">
												Assignment Name:{' '}
												<span className="text-red-600">
													*
												</span>
											</label>

											<Field
												type="text"
												id="assignmentName"
												name="assignmentName"
												className="ml-14 font-futura text-lg border-2 border-slate-200 w-6/12 pl-1 rounded-md"
												title="Add assignment name"
												placeholder="Enter Assignment Name"
												maxLength="255"
											/>
											<ErrorMessage
												name="assignmentName"
												component="div"
												className="ml-14 font-futura text-lg mt-1 text-red-500"
											/>
										</div>
										<label
											htmlFor="assignmentName"
											className="font-futura font-bold mt-5 ml-14 text-lg h-10">
											Description:
											<span className="text-red-600">
												*
											</span>
										</label>
										<Field
											as="textarea"
											id="description"
											name="description"
											className="ml-14 font-futura text-lg border-2 border-slate-200 w-6/12 h-40 pl-1 rounded-md"
											title="Add assignment description"
											placeholder="Enter Assignment Description"
											maxLength="5000"
										/>
										<ErrorMessage
											name="description"
											component="div"
											className="font-futura text-lg ml-14 mt-1 text-red-500"
										/>
										<label
											htmlFor="assignmentName"
											className="font-futura font-bold ml-14 text-lg h-10">
											Submission Type:
											<span className="text-red-600">
												*
											</span>
										</label>
										<Field
											as="select"
											id="submissionType"
											name="submissionType"
											className="font-futura text-lg border-2 border-slate-200 ml-14 pl-1 pb-1 w-3/12 pt-1 rounded-md">
											<option value="" disabled>
												Select Submission Type
											</option>
											<option value="Google Drive">
												Google Drive
											</option>
											<option value="Google Documents">
												Google Documents
											</option>
											<option value="Google Spreadsheets">
												Google Spreadsheets
											</option>
											<option value="Google Slides">
												Google Slides
											</option>
											<option value="Dropbox">
												Dropbox
											</option>
										</Field>
										<ErrorMessage
											name="submissionType"
											component="div"
											className="font-futura text-lg mt-1 ml-14 text-red-500"
										/>
										<div className="flex items-center">
											<label
												htmlFor="numAssessments"
												className="font-futura font-bold mt-5 text-lg ml-14 h-10">
												Number of Assessments per
												Student:
												<span className="text-red-600">
													*
												</span>
											</label>
											<Field
												className="border-2 border-slate-200  ml-5 mt-5 mb-4 p-3 text-center rounded-md"
												as="select"
												id="numAssessments"
												name="numAssessments">
												{Array.from(
													{
														length: numberOfStudents,
													},
													(_, index) => (
														<option
															key={index}
															value={index}>
															{index}
														</option>
													)
												)}
											</Field>
											<ErrorMessage
												name="numAssessments"
												component="div"
												className="font-futura text-lg mt-1 ml-5 text-red-500"
											/>
										</div>

										<label
											htmlFor="availableFrom"
											className="inline font-futura w-full font-bold text-lg ml-14 h-10">
											Available From:
											<span className="text-red-600">
												*
											</span>
										</label>
										<LocalizationProvider
											dateAdapter={AdapterDayjs}>
											<div className="text-red font-futura ml-14 ">
												<DateTimePicker
													className="ml-2 mb-5 mt-10 font-futura w-1/5 text-lg p-0 bg-white border-2 border-slate-200 rounded-md"
													id="availableFrom"
													name="availableFrom"
													format="MMMM D, YYYY HH:mm"
													timezone="system"
													localeText={{
														datePlaceholder:
															'MM/DD/YYYY',
														timePlaceholder:
															'HH:MM',
													}}
													disablePast
													timeSteps={{
														minutes: 1,
													}}
													value={availableFromValue}
													onChange={(date) => {
														setAvailableFromValue(
															date
														);
														setFieldValue(
															'availableFrom',
															date?.format(
																'YYYY-MM-DD HH:mm'
															)
														);
													}}
												/>
											</div>
										</LocalizationProvider>
										<ErrorMessage
											name="availableFrom"
											component="div"
											className="font-futura text-lg ml-14 mt-1 text-red-500"
										/>
										<label
											htmlFor="deadline"
											className="inline font-futura w-full font-bold text-lg ml-14 h-10">
											Deadline:
											<span className="text-red-600">
												*
											</span>
										</label>
										<LocalizationProvider
											dateAdapter={AdapterDayjs}>
											<div className="text-red font-futura ml-14 ">
												<DateTimePicker
													className="ml-2 mb-10 mt-10 font-futura w-1/5 text-lg p-0 bg-white border-2 border-slate-200 rounded-md"
													id="deadline"
													name="deadline"
													format="MMMM D, YYYY HH:mm"
													timezone="system"
													localeText={{
														datePlaceholder:
															'MM/DD/YYYY',
														timePlaceholder:
															'HH:MM',
													}}
													disablePast
													timeSteps={{
														minutes: 1,
													}}
													value={deadlineValue}
													onChange={(date) => {
														setDeadlineValue(date);
														setFieldValue(
															'deadline',
															date?.format(
																'YYYY-MM-DD HH:mm'
															)
														);
													}}
													disabledDate={(date) =>
														date &&
														date.isBefore(
															dayjs(
																availableFromValue
															).subtract(1, 'day')
														)
													}
												/>
											</div>
										</LocalizationProvider>
										<ErrorMessage
											name="deadline"
											component="div"
											className="font-futura text-lg ml-14 mt-1 text-red-500"
										/>

										<label
											htmlFor="availableUntil"
											className="inline font-futura w-full font-bold text-lg ml-14 h-10">
											Available Until:
											<span className="text-red-600">
												*
											</span>
										</label>
										<LocalizationProvider
											dateAdapter={AdapterDayjs}>
											<div className="text-red font-futura ml-14 ">
												<DateTimePicker
													className="ml-2 mb-10 mt-10 font-futura w-1/5 text-lg p-0 bg-white border-2 border-slate-200 rounded-md"
													id="availableUntil"
													name="availableUntil"
													format="MMMM D, YYYY HH:mm"
													timezone="system"
													localeText={{
														datePlaceholder:
															'MM/DD/YYYY',
														timePlaceholder:
															'HH:MM',
													}}
													disablePast
													timeSteps={{
														minutes: 1,
													}}
													value={availableUntilValue}
													onChange={(date) => {
														setAvailableUntilValue(
															date
														);
														setFieldValue(
															'availableUntil',
															date?.format(
																'YYYY-MM-DD HH:mm'
															)
														);
													}}
													disabledDate={(date) =>
														date &&
														date.isBefore(
															dayjs(
																availableFromValue
															).subtract(1, 'day')
														)
													}
												/>
											</div>
										</LocalizationProvider>
										<ErrorMessage
											name="availableUntil"
											component="div"
											className="font-futura text-lg ml-14 mt-1 text-red-500"
										/>
									</Space>
									<TableContainer
										className="mt-10"
										component={Paper}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell className="text-lg font-futura">
														<span className="text-lg font-futura">
															Criteria
														</span>
													</TableCell>
													<TableCell className="text-lg font-futura">
														<span className="text-lg font-futura">
															Rating
														</span>
													</TableCell>
													<TableCell className="text-lg font-futura">
														<span className="text-lg font-futura">
															Points
														</span>
													</TableCell>
													<TableCell className="text-lg font-futura">
														<span className="text-lg font-futura">
															Max Points
														</span>
													</TableCell>
													<TableCell></TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{values.criteria.map(
													(
														criterion,
														criterionIndex
													) => (
														<TableRow
															className="bg-blue-100 rounded-lg"
															key={criterion.id}>
															<TableCell>
																<Field
																	type="text"
																	as="textarea"
																	id="criteria"
																	className=" font-futura text-lg border-2 border-slate-200 pb-10 w-72 ml-2 pl-1 rounded-md"
																	name={`criteria[${criterionIndex}].description`}
																	placeholder="Enter Criteria"
																	maxLength="255"
																/>
																<ErrorMessage
																	name={`criteria[${criterionIndex}].description`}
																	component="div"
																	className="font-futura text-lg mt-1 text-red-500 ml-2"
																/>
															</TableCell>
															<TableCell className="">
																{criterion.rubrics.map(
																	(
																		rubric,
																		rubricIndex
																	) => (
																		<div
																			className="bg-grey-200"
																			key={
																				rubric.id
																			}>
																			<Field
																				type="text"
																				as="textarea"
																				className=" font-futura text-lg border-2 border-slate-200 ml-2 mr-4  pl-1 rounded-md"
																				name={`criteria[${criterionIndex}].rubrics[${rubricIndex}].name`}
																				placeholder="Enter Rating"
																				maxLength="255"
																			/>
																			<ErrorMessage
																				name={`criteria[${criterionIndex}].rubrics[${rubricIndex}].name`}
																				component="div"
																				className="font-futura text-lg mt-1 text-red-500 ml-2"
																			/>
																		</div>
																	)
																)}
															</TableCell>
															<TableCell>
																{criterion.rubrics.map(
																	(
																		rubric,
																		rubricIndex
																	) => (
																		<div
																			key={
																				rubric.id
																			}>
																			<Field
																				type="number"
																				className=" font-futura text-lg border-2 border-slate-200 ml-2 w-12 mt-2 pl-1 rounded-md"
																				name={`criteria[${criterionIndex}].rubrics[${rubricIndex}].points`}
																			/>
																			<ErrorMessage
																				name={`criteria[${criterionIndex}].rubrics[${rubricIndex}].points`}
																				component="div"
																				className="font-futura text-lg mt-1 text-red-500 ml-2"
																			/>
																			<Tooltip
																				title={
																					<span className="text-base font-futura">
																						Add
																						rating
																					</span>
																				}>
																				<PlusOutlined
																					className=" h-auto text-blue-500 py-2 px-4 mt-4 rounded-md cursor-pointer"
																					onClick={() =>
																						setFieldValue(
																							`criteria[${criterionIndex}].rubrics`,
																							[
																								...criterion.rubrics,
																								{
																									id:
																										criterion
																											.rubrics[
																											rubricIndex
																										]
																											.id +
																										1,
																									name: '',
																									points: 0,
																								},
																							]
																						)
																					}
																				/>
																			</Tooltip>
																			<Tooltip
																				title={
																					<span className="text-base font-futura">
																						Delete
																						Rating
																					</span>
																				}>
																				<MinusCircleOutlined
																					className="text-red-500 ml-2 mr-1 cursor-pointer"
																					onClick={() =>
																						setFieldValue(
																							`criteria[${criterionIndex}].rubrics`,
																							criterion.rubrics.filter(
																								(
																									r,
																									i
																								) =>
																									i !==
																									rubricIndex
																							)
																						)
																					}
																				/>
																			</Tooltip>
																		</div>
																	)
																)}
															</TableCell>
															<TableCell>
																<div className="relative">
																	<div className="absolute font-futura text-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-md flex items-center justify-center">
																		{calculateTotalPoints(
																			criterion.rubrics
																		)}
																	</div>
																</div>
															</TableCell>
															<TableCell>
																<Tooltip
																	title={
																		<span className="text-base font-futura">
																			Delete
																			Criteria
																		</span>
																	}>
																	<Button
																		type="default"
																		onClick={() =>
																			setFieldValue(
																				'criteria',
																				values.criteria.filter(
																					(
																						c,
																						i
																					) =>
																						i !==
																						criterionIndex
																				)
																			)
																		}
																		className="ml-6 text-center h-auto bg-white mr-8 ">
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
													)
												)}
											</TableBody>
										</Table>
										<div className=" flex justify-center items-center mb-4">
											<Button
												type="default"
												onClick={() =>
													setFieldValue('criteria', [
														...values.criteria,
														{
															id: values.criteria
																.length,
															description: '',
															rubrics: [
																{
																	id: 0,
																	name: '',
																	points: 0,
																},
															],
														},
													])
												}
												className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 mt-4 rounded-md flex items-center justify-center">
												<span className="text-white hover:text-white text-lg font-futura">
													Add Criteria
												</span>
											</Button>
										</div>
									</TableContainer>
									<div className="flex justify-center">
										<Button
											className={`text-base h-auto font-futura font-bold drop-shadow-2xl rounded-lg w-1/6 p-2 mt-10 mb-10 ${
												!isValid
													? 'disabled:bg-slate-400 cursor-not-allowed'
													: 'bg-green-500 hover:bg-green-400'
											} text-white text-center`}
											type="default"
											disabled={!isValid}
											htmlType="submit"
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}>
											<span className="text-lg font-futura text-white hover:text-white">
												Submit
											</span>
										</Button>
									</div>
								</Form>
							</>
						)}
					</Formik>
				</div>
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
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
};

export default CreateAssignment;

// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import { Layout, Modal, Button, Space, Tooltip, Breadcrumb } from 'antd';
import React, { useState, useEffect } from 'react';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
} from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const { Header, Content, Footer } = Layout;

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AssignmentSubmissionPage() {
	const [loading, isLoading] = useState(true);
	const navigate = useNavigate();
	const studentId = useSelector((state) => state.studentId);
	const courseId = useSelector((state) => state.courseId);
	const courseName = useSelector((state) => state.courseName);
	const assignmentId = useSelector((state) => state.assignmentId);
	const [assignment, setAssignment] = useState([]);
	const [rubric, setRubric] = useState([]);
	const validationSchema = () => {
		if (assignment && assignment.SUBMISSION_TYPE === 'Dropbox') {
			return Yup.object().shape({
				submissionLink: Yup.string()
					.required('Submission Link is required')
					.matches(/(https:\/\/dropbox)/, {
						message: 'Invalid submission format',
						excludeEmptyString: true,
					}),
			});
		} else if (
			assignment &&
			assignment.SUBMISSION_TYPE === 'Google Slides'
		) {
			return Yup.object().shape({
				submissionLink: Yup.string()
					.required('Submission Link is required')
					.matches(/(https:\/\/docs.google.com\/presentation\/d\/)/, {
						message: 'Invalid submission format for Google Slides',
						excludeEmptyString: true,
					}),
			});
		} else if (
			assignment &&
			assignment.SUBMISSION_TYPE === 'Google Documents'
		) {
			return Yup.object().shape({
				submissionLink: Yup.string()
					.required('Submission Link is required')
					.matches(/(https:\/\/docs.google.com\/document\/d\/)/, {
						message:
							'Invalid submission format for Google Documents',
						excludeEmptyString: true,
					}),
			});
		} else if (
			assignment &&
			assignment.SUBMISSION_TYPE === 'Google Spreadsheets'
		) {
			return Yup.object().shape({
				submissionLink: Yup.string()
					.required('Submission Link is required')
					.matches(/(https:\/\/docs.google.com\/spreadsheet\/d\/)/, {
						message:
							'Invalid submission format for Google Spreadsheets',
						excludeEmptyString: true,
					}),
			});
		} else if (
			assignment &&
			assignment.SUBMISSION_TYPE === 'Google Drive'
		) {
			return Yup.object().shape({
				submissionLink: Yup.string()
					.required('Submission Link is required')
					.matches(/(https:\/\/drive.google.com\/drive\/folders\/)/, {
						message: 'Invalid submission format for Google Drive',
						excludeEmptyString: true,
					}),
			});
		} else {
			return Yup.object().shape({
				submissionLink: Yup.string().required(
					'Submission Link is required'
				),
			});
		}
	};

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

	const [deleteModalVisible1, setDeleteModalVisible1] = useState(false);
	const [deleteModalTitle1, setDeleteModalTitle1] = useState('');
	const [deleteModalContent1, setDeleteModalContent1] = useState('');

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
	const fetchStudentSubmissionLink = async () => {
		try {
			isLoading(true);
			const requestData = {
				student_id: studentId,
				assignment_id: assignmentId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getsubmissionlink',
				requestData,
				{
					headers: headers,
				}
			);
			const status = response.data.status;
			if (status === 'success') {
				setModalTitle('Attention!');
				setModalContent(
					'There is a submission already made for this assignment. Any new submissions will overwrite the previous submission.'
				);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
				}, 4000);
			} else {
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
		fetchStudentSubmissionLink();
	}, []);

	const fetchAssignment = async () => {
		try {
			isLoading(true);
			const requestData = {
				student_id: studentId,
				course_id: courseId,
				assignment_id: assignmentId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getassignment',
				requestData,
				{
					headers: headers,
				}
			);
			const status = response.data.status;
			if (status === 'success') {
				const assignmentdata = response.data.assignment;
				const rubricData = response.data.rubric.map((criteria) => {
					return {
						criteriaId: criteria.CRITERIA_ID,
						criteriaDescription: criteria.CRITERIA_DESCRIPTION,
						criteriaRatings:
							criteria.ASSIGNMENT_CRITERIA_RATING_OPTIONs.map(
								(rating) => {
									return {
										optionId: rating.OPTION_ID,
										optionDescription:
											rating.OPTION_DESCRIPTION,
										optionPoints: rating.OPTION_POINT,
									};
								}
							),
					};
				});
				setAssignment(assignmentdata);
				setRubric(rubricData);
			} else {
				setAssignment([]);
				setRubric([]);
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
		fetchAssignment();
	}, []);

	const submissionlinktype = () => {
		if (assignment.SUBMISSION_TYPE === 'Dropbox') {
			return 'https://dropbox.com';
		} else if (assignment.SUBMISSION_TYPE === 'Google Slides') {
			return 'https://docs.google.com/presentation/d/';
		} else if (assignment.SUBMISSION_TYPE === 'Google Documents') {
			return 'https://docs.google.com/document/d/';
		} else if (assignment.SUBMISSION_TYPE === 'Google Spreadsheets') {
			return 'https://docs.google.com/spreadsheet/d/';
		} else if (assignment.SUBMISSION_TYPE === 'Google Drive') {
			return 'https://drive.google.com/drive/folders/';
		} else {
			return '';
		}
	};
	const onSubmitHandler = async (values) => {
		try {
			const requestData = {
				student_id: studentId,
				assignment_id: assignmentId,
				submission_link: values.submissionLink,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/submitassignment',
				requestData,
				{
					headers: headers,
				}
			);
			const status = response.data.status;
			if (status === 'success') {
				setModalTitle('Success!');
				setModalContent(
					'Assignment submitted successfully! Redirecting to assignment list page...'
				);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/assignmentlistpage');
				}, 2000);
			} else {
				setModalTitle('Error!');
				setModalContent(
					'Assignment submission failed! Please try again.'
				);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
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

	const calculateTotalPoints = (rubrics) => {
		const maxPoints = rubrics.reduce(
			(max, rubric) => Math.max(max, rubric.optionPoints),
			0
		);
		return maxPoints;
	};

	const maxRubricColumns = rubric.reduce(
		(max, criteria) => Math.max(max, criteria.criteriaRatings.length),
		0
	);

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura bg-white mb-20">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							{courseName}
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
								<a href="/assignmentlistpage">Assignments</a>
							),
						},
						{
							title: (
								<p className="text-black">
									Assignment Submission
								</p>
							),
						},
					]}
				/>
				<div className="flex justify-center items-start min-h-screen">
					<div className="bg-slate-200 p-2 mx-40 text-center w-full h-auto rounded-lg  drop-shadow-2xl shadow-slate-300 mt-10">
						{loading && (
							<h3 className="w-full font-futura text-lg text-center my-20">
								<p className="font-futura flex items-center justify-center">
									<LoadingOutlined spin />
								</p>
								<br /> Loading Assignment Information...
							</h3>
						)}
						{!loading && Object.keys(assignment).length > 0 && (
							<>
								<div className=" w-full flex flex-col font-futura font-extrabold items-center text-xl mt-4">
									<h2>
										{assignment &&
											assignment.ASSIGNMENT_NAME}
									</h2>
								</div>
								<div className="w-full flex flex-col font-futura text-center text-lg mt-10 mb-10">
									<h2 className="font-extrabold">
										Assignment Description
									</h2>
									<span className="font-futura text-base text-justify mt-4 mx-10">
										{assignment &&
											assignment.ASSIGNMENT_DESCRIPTION}
									</span>
								</div>

								<div className="mx-10">
									<TableContainer component={Paper}>
										<Table aria-label="simple table">
											<TableHead className="bg-slate-300 ">
												<TableRow>
													<TableCell
														align="center"
														className="border-r-2 border-slate-200">
														<span className="text-base font-futura">
															Criteria
														</span>
													</TableCell>

													<TableCell
														align="center"
														className="border-r-2 border-slate-200"
														// colSpan={maxRubricColumns}
													>
														<span className="text-base font-futura">
															Ratings
														</span>
													</TableCell>

													<TableCell align="center">
														<span className="text-base font-futura">
															Maximum Points
														</span>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{rubric &&
													rubric.map(
														(
															criterion,
															criterionIndex
														) => (
															<TableRow
																key={
																	criterion.criteriaId
																}>
																<TableCell
																	component="th"
																	scope="row"
																	className="flex flex-grow items-start border-r-2 border-slate-200">
																	<p className="text-base font-futura">
																		{
																			criterion.criteriaDescription
																		}
																	</p>
																</TableCell>
																<TableCell
																	component="th"
																	scope="row"
																	className="border-r-2 border-slate-200">
																	<div>
																		{criterion.criteriaRatings.map(
																			(
																				rubric,
																				rubricIndex
																			) => (
																				<>
																					<Space className="flex justify-between w-full  p-2 ">
																						<p className="text-base font-futura">
																							{
																								rubric.optionDescription
																							}
																						</p>
																						<p className="text-base font-futura">
																							{
																								rubric.optionPoints
																							}
																						</p>
																					</Space>
																				</>
																			)
																		)}
																	</div>
																</TableCell>

																<TableCell
																	className="w-auto"
																	align="center">
																	<span className="text-base font-futura">
																		{calculateTotalPoints(
																			criterion.criteriaRatings
																		)}
																	</span>
																</TableCell>
															</TableRow>
														)
													)}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
								<Formik
									initialValues={{ submissionLink: '' }}
									validationSchema={validationSchema}
									onSubmit={onSubmitHandler}>
									{({ values, isValid, setFieldValue }) => (
										<Form>
											<Space className="flex flex-col justify-start w-full mt-10">
												<label
													htmlFor="submissionType"
													className="font-futura font-bold text-lg h-10">
													Submission Type
													<p className="font-futura text-lg  bg-slate-300 p-1 rounded-md">
														{assignment &&
															assignment.SUBMISSION_TYPE}
													</p>
												</label>
											</Space>
											<Space className="flex flex-col items-stretch justify-start w-full mt-10">
												<span className="font-futura text-lg flex items-center justify-center">
													<Tooltip
														className="text-base font-futura"
														title={
															<span className="font-futura text-sm">
																Please look at
																the submission
																type and enter
																the submission
																link
																accordingly.
																Check the
																placeholder for
																the correct
																format.
															</span>
														}>
														<label
															htmlFor="submissionLink"
															className="font-futura font-bold text-lg h-10">
															Submission Link
															<InfoCircleOutlined className="text-sm ml-2" />
														</label>
													</Tooltip>
												</span>

												<Field
													type="text"
													as="textarea"
													id="submissionLink"
													name="submissionLink"
													className=" font-futura items-start text-base border-2 w-8/12 h-36 border-slate-200 pl-1 rounded-md"
													title="Add your submission link here"
													placeholder={
														submissionlinktype() +
														'...'
													}
												/>
												<ErrorMessage
													name="submissionLink"
													component="div"
													className="font-futura text-lg mt-1 text-red-500"
												/>
											</Space>
											<Tooltip
												title={
													<span className="text-base font-futura">
														{isValid
															? 'Submit Assignment'
															: 'Please submit a valid submission link'}
													</span>
												}>
												<div className="flex justify-center">
													<Button
														type="submit"
														htmlType="submit"
														// onClick={() => {
														// 	setDeleteModalVisible1(
														// 		true
														// 	);
														// }}
														className={`text-base font-futura h-auto font-bold drop-shadow-2xl rounded-lg w-1/6 p-2 mt-10 mb-10 ${
															!isValid
																? 'bg-gray-400 cursor-not-allowed'
																: 'bg-green-600 hover:bg-green-500'
														} text-white`}
														disabled={!isValid}>
														Submit
													</Button>
												</div>
											</Tooltip>
										</Form>
									)}
								</Formik>
							</>
						)}
						{!loading && assignment.length === 0 && (
							<h3 className="w-full font-futura text-lg text-center my-10">
								No Assignment Information Available
							</h3>
						)}
					</div>
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
}

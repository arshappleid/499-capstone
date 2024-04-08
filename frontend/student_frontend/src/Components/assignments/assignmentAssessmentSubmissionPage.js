//Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import {
	Layout,
	Input,
	Modal,
	Button,
	Space,
	Form,
	Breadcrumb,
	Radio,
} from 'antd';
import React, { useState } from 'react';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
} from '@mui/material';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AssignmentAssessmentSubmissionPage() {
	const [loading, isLoading] = useState(true);
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const studentId = useSelector((state) => state.studentId);
	const courseId = useSelector((state) => state.courseId);
	const assignmentId = useSelector((state) => state.assignmentId);
	const courseName = useSelector((state) => state.courseName);
	const assignmentEvaluateeId = useSelector(
		(state) => state.assignmentEvaluateeId
	);
	const [assignment, setAssignment] = useState([]);
	const [rubric, setRubric] = useState([]);
	const [values, setValues] = useState([]);
	const [submissionLink, setSubmissionLink] = useState('');

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

	const fetchSubmissionLink = async () => {
		try {
			const requestData = {
				student_id: assignmentEvaluateeId,
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
				const submissionLink = response.data.assignment_link;
				setSubmissionLink(submissionLink);
			} else {
				setSubmissionLink('');
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
		fetchSubmissionLink();
	}, []);

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

	const onGradeFieldChange = (value, criterionIndex) => {
		const grade =
			rubric[criterionIndex].criteriaRatings[value].optionPoints;

		setValues((prevState) => {
			return {
				...prevState,
				[`criteria-${criterionIndex}-grade`]: grade,
			};
		});
	};

	const onFeedbackFieldChange = (value, criterionIndex) => {
		setValues((prevState) => {
			return {
				...prevState,
				[`criteria-${criterionIndex}-feedback`]: value,
			};
		});
	};

	const handleFormSubmit = async (valuess) => {
		const criteriaGrades = rubric.map((criteria, criteriaIndex) => {
			return {
				criteriaId: criteria.criteriaId,
				criteriaGrade: values[`criteria-${criteriaIndex}-grade`],
				criteriaFeedback: values[`criteria-${criteriaIndex}-feedback`],
			};
		});
		try {
			const requestData = {
				student_id: studentId,
				assignment_id: assignmentId,
				evaluatee_id: assignmentEvaluateeId,
				selected_options: criteriaGrades,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/submitassessment',
				requestData,
				{
					headers: headers,
				}
			);
			const status = response.data.status;
			// const message = response.data.message;
			if (status === 'success') {
				setModalTitle('Assessment Submission Successful!');
				setModalContent(
					'Your assessment has been submitted! Redirecting to Assignment List Page...'
				);
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					navigate('/assignmentlistpage');
				}, 2000);
			} else {
				setModalTitle('Assessment Submission Failed!');
				setModalContent(
					'Your assessment could not be submitted! Please try again.'
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
	const onFinishFailed = (errorInfo) => {
		setModalContent('Please fill in all the assessment grades!');
		setModalTitle('Assessment Submission Failed!', errorInfo);
		setIsModalVisible(true);
		setTimeout(() => {
			setIsModalVisible(false);
		}, 2000);
	};

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
									Assignment Assessment Submission
								</p>
							),
						},
					]}
				/>

				<div className="flex justify-center items-start min-h-screen ">
					<div className="bg-slate-100 p-2 mx-40 text-center w-full h-auto rounded-lg  drop-shadow-2xl shadow-slate-300 mt-10">
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
																	className="flex flex-grow items-start border-r-2 border-slate-200 w-1/3">
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

								{submissionLink ? (
									<>
										<div className="flex justify-center items-center w-full ">
											<Space className="flex flex-col items-center justify-items-center w-full mt-10 mx-10">
												<h2 className="text-lg font-futura font-extrabold">
													Submission Link:{' '}
													<span>
														<a
															href={
																submissionLink
															}
															target="_blank"
															className="text-lg font-futura text-blue-500 hover:text-blue-400"
															rel="noopener noreferrer">
															View Assignment
														</a>
													</span>
												</h2>
												<Form
													name="submitEval"
													autoComplete="off"
													layout="vertical"
													className="w-full"
													form={form}
													onFinish={handleFormSubmit}
													onFinishFailed={
														onFinishFailed
													}>
													<p className="  text-xl font-futura font-extrabold mt-10">
														Submit Assessment
													</p>
													{rubric.map(
														(
															criterion,
															criterionIndex
														) => {
															return (
																<div className="flex flex-col items-start justify-items-start mt-6">
																	<span className=" text-lg font-futura text-justify">
																		{criterionIndex +
																			1}
																		){' '}
																		{
																			criterion.criteriaDescription
																		}{' '}
																		(Max
																		Points:{' '}
																		{calculateTotalPoints(
																			criterion.criteriaRatings
																		)}
																		)
																	</span>
																	<Form.Item
																		name={`criteria-${criterionIndex}-grade`}
																		rules={[
																			{
																				required: true,
																				message:
																					(
																						<span className="text-base font-futura">
																							Please
																							select
																							an
																							option!
																						</span>
																					),
																			},
																		]}>
																		<Radio.Group
																			className="mt-4 w-full"
																			onChange={(
																				e
																			) => {
																				onGradeFieldChange(
																					e
																						.target
																						.value,
																					criterionIndex
																				);
																			}}>
																			<span className="text-base font-futura mt-6">
																				<Space
																					direction="horizontal"
																					className="w-full ">
																					{criterion.criteriaRatings.map(
																						(
																							rubric,
																							rubricIndex
																						) => {
																							return (
																								<>
																									<Radio
																										value={
																											rubricIndex
																										}
																										key={
																											rubricIndex
																										}>
																										{
																											<span className="text-base font-futura">
																												{
																													rubric.optionPoints
																												}
																											</span>
																										}
																									</Radio>
																								</>
																							);
																						}
																					)}
																				</Space>
																			</span>
																		</Radio.Group>
																	</Form.Item>
																	{values[
																		`criteria-${criterionIndex}-grade`
																	]?.toString() &&
																	values[
																		`criteria-${criterionIndex}-grade`
																	] <
																		calculateTotalPoints(
																			criterion.criteriaRatings
																		).toString() ? (
																		<>
																			<Form.Item
																				name={`criteria-${criterionIndex}-feedback`}
																				className="-mb-4"
																				rules={[
																					{
																						required: true,
																						message:
																							(
																								<span className="text-base font-futura -ml-48">
																									Please
																									enter
																									your
																									feedback
																								</span>
																							),
																					},
																				]}>
																				<TextArea
																					// as="textarea"
																					id={`criteria-${criterionIndex}-feedback`}
																					rows={
																						4
																					}
																					maxLength={
																						1500
																					}
																					name={`criteria-${criterionIndex}-feedback`}
																					className=" font-futura text-lg border-2 border-slate-200 w-96 pl-1 rounded-md"
																					title="Add your feedback here"
																					placeholder="Enter Feedback"
																					onChange={(
																						e
																					) => {
																						onFeedbackFieldChange(
																							e
																								.target
																								.value,
																							criterionIndex
																						);
																					}}
																				/>
																			</Form.Item>
																		</>
																	) : null}
																</div>
															);
														}
													)}
													<div className=" justify-items-center text-center">
														<Form.Item>
															<Button
																type="defalt"
																htmlType="submit"
																className="bg-green-500 hover:bg-green-400 hover:border-transparent font-futura text-lg h-auto align-middle mt-10">
																<span className="text-white hover:text-white">
																	Submit
																	Assessment
																</span>
															</Button>
														</Form.Item>
													</div>
												</Form>
											</Space>
										</div>
									</>
								) : (
									<div className="w-full font-futura justify-center items-center text-xl mt-10 mb-10">
										<Space>
											<h2 className="font-extrabold">
												No Submission has been done by
												the student for this assignment
												yet.
											</h2>
										</Space>
									</div>
								)}
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

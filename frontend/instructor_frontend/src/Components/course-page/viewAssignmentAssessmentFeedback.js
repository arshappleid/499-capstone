// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import {
	Layout,
	Button,
	Modal,
	Space,
	Breadcrumb,
	Form,
	Radio,
	Checkbox,
	Input,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function ViewAssignmentAssessmentFeedback() {
	const [loading, isLoading] = useState(true);

	const [evaluateeFirstName, setEvaluateeFirstName] = useState('');
	const [evaluateeLastName, setEvaluateeLastName] = useState('');
	const [evaluatorFirstName, setEvaluatorFirstName] = useState('');
	const [evaluatorLastName, setEvaluatorLastName] = useState('');
	const instructorId = useSelector((state) => state.instructorId);
	const evaluatorId = useSelector((state) => state.assignmentEvaluatorId);
	const evaluateeId = useSelector((state) => state.assignmentEvaluateeId);
	const assignmentId = useSelector((state) => state.assignmentId);
	const courseId = useSelector((state) => state.courseId);
	const courseName = useSelector((state) => state.courseName);

	const [feedback, setFeedback] = useState([]);

	const [individualGrade, setIndividualGrade] = useState([]);
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
		const fetchStudentProfile = async () => {
			try {
				isLoading(true);
				const requestData = {
					studentID: evaluateeId,
				};
				const headers = {
					'Content-type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/getstudentprofile',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;

				if (status === 'success') {
					const student_first_name =
						response.data.data.student_first_name;
					const student_last_name =
						response.data.data.student_last_name;
					setEvaluateeFirstName(student_first_name);
					setEvaluateeLastName(student_last_name);
				} else {
					setEvaluateeFirstName('');
					setEvaluateeLastName('');
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
		fetchStudentProfile();
	}, []);

	useEffect(() => {
		const fetchStudentProfile = async () => {
			try {
				isLoading(true);
				const requestData = {
					studentID: evaluatorId,
				};
				const headers = {
					'Content-type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/getstudentprofile',
					requestData,
					{ headers: headers }
				);
				const status = response.data.status;
				const message = response.data.message;

				if (status === 'success') {
					const student_first_name =
						response.data.data.student_first_name;
					const student_last_name =
						response.data.data.student_last_name;

					setEvaluatorFirstName(student_first_name);
					setEvaluatorLastName(student_last_name);
				} else {
					setEvaluatorFirstName('');
					setEvaluatorLastName('');
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
		fetchStudentProfile();
	}, []);

	useEffect(() => {
		const fetchIndividualGrade = async () => {
			try {
				isLoading(true);
				const requestData = {
					instructor_id: instructorId,
					course_id: courseId,
					assignment_id: assignmentId,
					evaluatee_id: evaluateeId,
					evaluator_id: evaluatorId,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/getassessmentindividualgrade',
					requestData,
					{ headers }
				);
				const status = response.data.status;
				// const message = response.data.message;
				if (status === 'success') {
					const all_grades = () => {
						return {
							total_grade_in_percentage:
								response.data.total_grade_in_percentage,
							criteria_max_score:
								response.data.criteria_max_score,
							criteria_total_score:
								response.data.criteria_total_score,
							criteria_grades: response.data.criteria_grades.map(
								(criteria_grade) => {
									return {
										criteria_description:
											criteria_grade.criteria_description,
										criteria_selected_option:
											criteria_grade.criteria_selected_option,
										criteria_grades_in_percentage:
											criteria_grade.criteria_grades_in_percentage,
										criteria_max_score:
											criteria_grade.criteria_max_score,
										criteria_total_score:
											criteria_grade.criteria_total_score,
									};
								}
							),
						};
					};
					setIndividualGrade(all_grades);
				} else {
					setIndividualGrade([]);
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
		fetchIndividualGrade();
	}, []);

	const fetchEvaluationFeedback = async () => {
		try {
			isLoading(true);
			const requestData = {
				instructor_id: instructorId,
				assignment_id: assignmentId,
				course_id: courseId,
				evaluatee_id: evaluateeId,
				evaluator_id: evaluatorId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/viewassignmentassessment',
				requestData,
				{ headers }
			);
			const status = response.data.status;
			const message = response.data.message;
			if (status === 'success') {
				const allFeedback = {
					assignmentName: response.data.assignment.ASSIGNMENT_NAME,
					assignmentDescription:
						response.data.assignment.ASSIGNMENT_DESCRIPTION,
					rubric: response.data.rubric?.map((criterion) => {
						let selected_option = 0;
						return {
							selectedOption: criterion.selected_option,

							criterionDescription:
								criterion.criteria_description,
							comment: criterion.comment,
							criteriaOptions: criterion.criteria_options?.map(
								(option, index) => {
									if (
										option.OPTION_POINT ===
										criterion.selected_point
									) {
										selected_option = index;
									}
									return {
										optionId: option.OPTION_ID,
										optionDescription:
											option.OPTION_DESCRIPTION,
										optionPoint: option.OPTION_POINT,
										criteriaId: option.CRITERIA_ID,
									};
								}
							),
							selectedPoint: selected_option,
						};
					}),
				};

				setFeedback(allFeedback);
			} else {
				setFeedback([]);
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
		fetchEvaluationFeedback();
	}, []);

	const calculateTotalPoints = (rubrics) => {
		const maxPoints = rubrics.reduce(
			(max, rubric) => Math.max(max, rubric.optionPoint),
			0
		);
		return maxPoints;
	};
	const [submissionLink, setSubmissionLink] = useState('');
	const fetchSubmissionLink = async () => {
		try {
			isLoading(true);
			const requestData = {
				instructor_id: instructorId,
				assignment_id: assignmentId,
				course_id: courseId,
				submissionor_id: evaluateeId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getsubmissionlink',
				requestData,
				{ headers }
			);
			const status = response.data.status;
			const message = response.data.message;
			if (status === 'success') {
				setSubmissionLink(response.data.message);
			} else {
				setSubmissionLink('');
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
		fetchSubmissionLink();
	}, []);

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
							title: <a href="/assignmentdetails">Assignments</a>,
						},

						{
							title: (
								<p className="text-black">
									Assignment Assessments:{' '}
									{feedback && feedback.assignmentName}
								</p>
							),
						},
					]}
				/>
				<div className="flex justify-center items-start min-h-screen ">
					<div className="bg-slate-200 mx-40 mt-10 mb-10 rounded-lg w-full">
						{loading && (
							<div className="py-10">
								<h3 className="w-full font-futura text-lg text-center">
									<p className="font-futura flex items-center justify-center">
										<LoadingOutlined spin />
									</p>
									<br /> Loading Assignment Assessments
									Feedback and Grades...
								</h3>
							</div>
						)}
						{!loading && (
							<>
								<div className="flex flex-col font-futura font-extrabold items-center w-full px-10 text-xl mt-10">
									<h2>
										Assignment Feedback for{' '}
										<span className="text-red-500">
											{evaluateeFirstName}{' '}
											{evaluateeLastName}
										</span>{' '}
										by {evaluatorFirstName}{' '}
										{evaluatorLastName}
									</h2>
								</div>

								<Form Layout="vertical" disabled={true}>
									{/* <div className=" w-full font-futura mt-10 bg-white"> */}
									<div className=" w-full font-futura mt-10 bg-slate-100 pt-10 pb-20 rounded-b-lg">
										{feedback.length === 0 ? (
											<>
												<div className="flex flex-col font-futura font-extrabold items-center w-full mt-10">
													<p className="font-futura text-lg">
														{evaluatorFirstName} has
														not performed the
														assessment yet
													</p>
												</div>
											</>
										) : (
											feedback && (
												<>
													<div className=" w-full flex flex-col font-futura font-extrabold items-center text-xl mt-4">
														<h2>
															{feedback &&
																feedback.assignmentName}
														</h2>
													</div>
													<div className="w-full flex flex-col font-futura text-center text-lg mt-10 mb-10">
														<h2 className="font-extrabold">
															Assignment
															Description
														</h2>
														<span className="font-futura text-base text-justify mt-4 mx-10">
															{feedback &&
																feedback.assignmentDescription}
														</span>
													</div>
													<div className="mx-10">
														<TableContainer
															component={Paper}>
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
																				Maximum
																				Points
																			</span>
																		</TableCell>
																	</TableRow>
																</TableHead>
																<TableBody>
																	{feedback.rubric &&
																		feedback.rubric.map(
																			(
																				criterion,
																				criterionIndex
																			) => (
																				<TableRow
																					key={
																						criterion
																							.criteriaOptions[0]
																							.criteriaId
																					}>
																					<TableCell
																						component="th"
																						scope="row"
																						className="flex flex-grow items-start border-r-2 border-slate-200 w-1/3">
																						<p className="text-base font-futura">
																							{
																								criterion.criterionDescription
																							}
																						</p>
																					</TableCell>
																					<TableCell
																						component="th"
																						scope="row"
																						className="border-r-2 border-slate-200">
																						<div>
																							{criterion.criteriaOptions.map(
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
																													rubric.optionPoint
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
																								criterion.criteriaOptions
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
													<br />

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
																		View
																		Assignment
																	</a>
																</span>
															</h2>
															<Form
																name="viewEval"
																layout="vertical"
																className="w-full"
																disabled={true}>
																<span className="  text-lg font-futura font-extrabold underline">
																	Assessment:
																</span>
																{feedback?.rubric?.map(
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
																						criterion.criterionDescription
																					}{' '}
																					(Max
																					Points:{' '}
																					{calculateTotalPoints(
																						criterion.criteriaOptions
																					)}

																					)
																				</span>

																				<Radio.Group
																					className="mt-4 w-full"
																					value={
																						criterion.selectedPoint
																					}>
																					<span className="text-base font-futura mt-6">
																						<Space
																							direction="horizontal"
																							className="w-full ">
																							{criterion.criteriaOptions.map(
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
																													<span className="text-base font-futura text-black">
																														{
																															rubric.optionPoint
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
																				{criterion.comment && (
																					<span className="text-base font-futura mt-6">
																						<TextArea
																							// as="textarea"
																							id={`criteria-${criterionIndex}-feedback`}
																							rows={
																								4
																							}
																							name={`criteria-${criterionIndex}-feedback`}
																							className=" font-futura text-lg border-2 border-slate-200 w-96 pl-1 rounded-md disabled:bg-white disabled:text-black"
																							value={
																								criterion.comment
																							}
																						/>
																					</span>
																				)}
																			</div>
																		);
																	}
																)}
															</Form>
														</Space>
													</div>

													{feedback.length !== 0 && (
														<Space className=" flex flex-col text-left text-lg font-extrabold text-futura mt-10 bg-slate-200 py-10">
															<span className="underline text-xl">
																Grade Overview
															</span>
															<span className="text-lg font-extrabold">
																Final Grade:{' '}
																{parseFloat(
																	individualGrade.total_grade_in_percentage
																).toFixed(2)}
																%
															</span>

															<Box
																sx={{
																	marginTop: 5,
																}}
																className="bg-white mt-4 p-4 w-full rounded-lg">
																<Table
																	size="small"
																	aria-label="grades"
																	className="bg-white">
																	<TableHead>
																		<TableRow>
																			<TableCell className=" font-futura bg-slate-200">
																				<span className="font-futura  text-base font-semibold ">
																					Assessment
																					Grades
																				</span>
																			</TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		{individualGrade?.criteria_grades?.map(
																			(
																				criteria_grade,
																				criteria_index
																			) => {
																				return (
																					<>
																						<TableRow>
																							<TableCell className="font-futura">
																								<Space className=" justify-between w-full">
																									<p className="font-futura text-base mr-6 bg-white font-semibold">
																										{
																											criteria_grade.criteria_description
																										}{' '}
																										:
																									</p>
																									<p className=" font-futura text-base bg-white">
																										{
																											criteria_grade.criteria_total_score
																										}{' '}
																										/{' '}
																										{
																											criteria_grade.criteria_max_score
																										}{' '}
																										{
																											'( '
																										}
																										{criteria_grade.criteria_grades_in_percentage.toFixed(
																											2
																										)}
																										{
																											'%) '
																										}
																									</p>
																								</Space>
																							</TableCell>
																						</TableRow>
																					</>
																				);
																			}
																		)}
																	</TableBody>
																</Table>
															</Box>
														</Space>
													)}
												</>
											)
										)}
									</div>
								</Form>
							</>
						)}
					</div>
				</div>
				<NetworkErrorModal />
			</Content>

			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

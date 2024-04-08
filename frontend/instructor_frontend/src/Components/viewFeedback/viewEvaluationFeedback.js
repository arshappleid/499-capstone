//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

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
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

const { Header, Content, Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function ViewEvaluationFeedback() {
	const [loading, isLoading] = useState(true);

	const [evaluateeFirstName, setEvaluateeFirstName] = useState('');
	const [evaluateeLastName, setEvaluateeLastName] = useState('');
	const [evaluatorFirstName, setEvaluatorFirstName] = useState('');
	const [evaluatorLastName, setEvaluatorLastName] = useState('');
	const instructorId = useSelector((state) => state.instructorId);
	const evaluatorId = useSelector((state) => state.evaluatorId);
	const evaluateeId = useSelector((state) => state.evaluateeId);
	const formId = useSelector((state) => state.formId);
	const courseId = useSelector((state) => state.courseId);
	const courseName = useSelector((state) => state.courseName);

	const [feedback, setFeedback] = useState([]);

	const [individualGrade, setIndividualGrade] = useState({
		form_grade: '',
		form_max_score: '',
		form_total_score: '',
		section_grades: [],
	});
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
					form_id: formId,
					evaluatee_id: evaluateeId,
					evaluator_id: evaluatorId,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/instructorgetindividualgrade',
					requestData,
					{ headers }
				);

				const status = response.data.status;
				const message = response.data.message;
				if (status === undefined) {
					const all_grades = () => {
						return {
							form_grade: response.data.form_grade,
							form_max_score: response.data.form_max_score,
							form_total_score: response.data.form_total_score,
							section_grades: response.data.section_grades.map(
								(section_grade) => {
									return {
										section_name:
											section_grade.section_name,
										section_weightage:
											section_grade.section_weightage,
										section_max_score:
											section_grade.section_max_score,
										section_grade_in_percentage:
											section_grade.section_grade_in_percentage,
										section_grade_after_weightage:
											section_grade.section_grade_after_weightage,
										section_total_score:
											section_grade.section_total_score,
									};
								}
							),
						};
					};
					setIndividualGrade(all_grades);
				} else {
					// setIndividualGrade([]);
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
				form_id: formId,
				course_id: courseId,
				evaluatee_id: evaluateeId,
				evaluator_id: evaluatorId,
			};

			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/viewevaluationfeedback',
				requestData,
				{ headers }
			);

			const status = response.data.status;
			const message = response.data.message;

			if (status === undefined) {
				const allFeedback = {
					formName: response.data.formName,
					formDeadline: response.data.deadline,
					sections: response.data.sections?.map((section) => {
						return {
							name: section.name,
							weightage: section.weightage,

							questions: section.questions?.map((question) => {
								return {
									type: question.type,
									questionId: question.id,
									question: question.question,
									options: question.options
										? question.options?.map((option) => {
												return option;
										  })
										: null,
									optionPoints: question.optionPoints
										? question.optionPoints?.map(
												(optionPoint) => {
													return optionPoint;
												}
										  )
										: null,
									selectedOptionText:
										question.selectedOptionText
											? question.selectedOptionText?.map(
													(selectedOptionText) => {
														return selectedOptionText;
													}
											  )
											: null,
									comment: question.comment
										? question.comment
										: null,
									selectedOption: question.selectedOption
										? question.selectedOption?.map(
												(selectedOption) => {
													return selectedOption;
												}
										  )
										: null,
								};
							}),
						};
					}),
				};
				setFeedback(allFeedback);
			} else {
				if (message === 'No answers found') {
					setFeedback([]);
				} else {
					setFeedback([]);
					setNetworkErrorMessage(message);
					setNetworkErrorModalVisible(true);
				}
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
	const exportEvaluationData = () => {
		const datetime = new Date(feedback.formDeadline);
		const formattedDate = datetime.toDateString();
		const options = {
			timeZone: 'America/Los_Angeles',
			hour12: true,
			hour: 'numeric',
			minute: 'numeric',
		};
		const formattedTime = datetime.toLocaleTimeString('en-US', options);
		// const numColumns = 12;
		// let csvContent = `"Evaluation Feedback for ${evaluateeFirstName} ${evaluateeLastName} by ${evaluatorFirstName} ${evaluatorLastName}"\n`;
		let csvContent =
			'Form Name,Form Deadline,Section Name,Section Weightage,Question Type,Question No.,Question Text,Options,Option Points,Selected Option,Comment/Feedback\n';
		csvContent += `"${feedback.formName}",`;
		csvContent += `"${formattedDate} ${formattedTime}",`;
		feedback.sections.forEach((section) => {
			section.questions.forEach((question, index) => {
				if (index != 0) {
					csvContent += ',';
					csvContent += ',';
				}
				csvContent += `"${section.name}",`;
				csvContent += `"${section.weightage}",`;
				if (question.type === 'ma')
					csvContent += `"Multiple Answer Question",`;
				else if (question.type === 'mcq')
					csvContent += `"Multiple Choice Question",`;
				else if (question.type === 'matrix')
					csvContent += `"Matrix Question",`;
				else if (question.type === 'shortAnswer')
					csvContent += `"Short Answer Question",`;
				else csvContent += `"${question.type}",`;
				csvContent += `"${index + 1}",`;
				csvContent += `"${question.question}",`;
				csvContent += `"${
					question.options ? question.options.join(',') : ''
				}",`;
				csvContent += `"${
					question.optionPoints ? question.optionPoints.join(',') : ''
				}",`;
				csvContent += `"${
					question.selectedOptionText
						? question.selectedOptionText.join(',')
						: ''
				}",`;
				csvContent += `"${question.comment || ''}"`;
				csvContent += '\n';
			});
		});
		const blob = new Blob([csvContent], {
			type: 'text/csv;charset=utf-8;',
		});
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute(
				'download',
				`Evaluation_For_${evaluateeFirstName}_${evaluateeLastName}_by_${evaluatorFirstName}_${evaluatorLastName}.csv`
			);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	useEffect(() => {
		fetchEvaluationFeedback();
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
							title: (
								<a href="/groupevaluationsoverviewpage">
									Group Evaluations
								</a>
							),
						},

						{
							title: (
								<a className="text-black">
									Evaluation: {feedback && feedback.formName}
								</a>
							),
						},
					]}
				/>
				<div className="bg-slate-200 mx-40 mt-10 mb-10 rounded-lg">
					{loading && (
						<div className="py-10">
							<h3 className="w-full font-futura text-lg text-center">
								<p className="font-futura flex items-center justify-center">
									<LoadingOutlined spin />
								</p>
								<br /> Loading Group Evaluation Feedback and
								Grades...
							</h3>
						</div>
					)}
					{!loading && (
						<>
							<div className="flex flex-col font-futura font-extrabold items-center w-full text-xl mt-10">
								<h2>
									Evaluation Feedback for {evaluateeFirstName}{' '}
									{evaluateeLastName} by {evaluatorFirstName}{' '}
									{evaluatorLastName}
								</h2>
							</div>

							<Form Layout="vertical" disabled={true}>
								<div className=" w-full font-futura mt-10 bg-slate-100 pt-10  rounded-b-lg">
									{feedback.length === 0 ? (
										<>
											<div className="flex flex-col font-futura font-extrabold items-center w-full mt-10 pb-20">
												<p className="font-futura text-lg">
													{evaluatorFirstName} has not
													performed the evaluation yet
												</p>
											</div>
										</>
									) : (
										feedback.sections &&
										Array.isArray(feedback.sections) &&
										feedback.sections.map(
											(section, sectionIndex) => {
												return (
													<>
														<div className=" mt-4">
															<span className="font-futura ml-8 mb-4 mt-4 font-extrabold text-xl">
																Section{' '}
																{sectionIndex +
																	1}
																: {section.name}{' '}
																(Weightage:{' '}
																{
																	section.weightage
																}
																%) (Section
																Score:{' '}
																{
																	individualGrade
																		.section_grades[
																		sectionIndex
																	]
																		?.section_total_score
																}
																/
																{
																	individualGrade
																		.section_grades[
																		sectionIndex
																	]
																		?.section_max_score
																}
																)
															</span>
															{section.questions &&
																Array.isArray(
																	section.questions
																) &&
																section.questions.map(
																	(
																		question,
																		index
																	) => {
																		return (
																			<>
																				{(question.type ===
																					'mcq' ||
																					question.type ===
																						'matrix') && (
																					<div>
																						<br />
																						<span className="text-base font-futura ml-10 mb-6">
																							Section{' '}
																							{sectionIndex +
																								1}

																							:
																							Q
																							{index +
																								1}

																							.{' '}
																							{
																								question.question
																							}
																							{
																								' (Max Points:'
																							}
																							<span className="text-base font-extrabold">
																								{Math.max.apply(
																									null,
																									question.optionPoints
																								)}
																							</span>
																							{
																								') '
																							}
																						</span>
																						<br />
																						<Radio.Group
																							className=" mt-4 w-full opacity-100 "
																							value={
																								question
																									.selectedOption[0]
																							}>
																							<span className="text-base font-futura mt-6 ">
																								<Space
																									direction="vertical"
																									className=" pl-10 w-full">
																									{question.options &&
																										Array.isArray(
																											question.options
																										) &&
																										question.options.map(
																											(
																												option,
																												index
																											) => {
																												return (
																													<div className="opacity-100 text-black mr-10">
																														<Radio
																															value={
																																index
																															}
																															key={
																																index
																															}>
																															{
																																<span className="text-base font-futura text-black">
																																	{
																																		option
																																	}
																																</span>
																															}
																															<span className="ml-2 text-base font-futura text-black">
																																(
																																{
																																	question
																																		.optionPoints[
																																		index
																																	]
																																}

																																)
																															</span>
																														</Radio>
																													</div>
																												);
																											}
																										)}
																									{question.comment && (
																										<div className=" w-full">
																											<textarea
																												className=" w-3/4 pl-2 pb-16 rounded-md border-2 border-slate-200 font-futura text-base disabled:bg-white disabled:text-black"
																												id={`mcq-comment-${question.questionId}`}
																												value={
																													question.comment
																												}
																											/>
																										</div>
																									)}
																								</Space>
																							</span>
																						</Radio.Group>
																					</div>
																				)}
																				{question.type ===
																					'shortAnswer' && (
																					<div>
																						<br />
																						<span className="text-base font-futura ml-10">
																							Section{' '}
																							{sectionIndex +
																								1}

																							:
																							Q
																							{index +
																								1}

																							.{' '}
																							{
																								question.question
																							}
																						</span>
																						<div className="w-full">
																							<textarea
																								className="w-3/4 pb-16 pl-2 ml-10 rounded-md border-2 border-slate-200 font-futura text-base mt-6 disabled:bg-white disabled:text-black"
																								placeholder="Add your answer here..."
																								id={`short-answer-${question.questionId}`}
																								value={
																									question.comment
																								}
																							/>
																						</div>
																						<br />
																					</div>
																				)}
																				{question.type ===
																					'ma' && (
																					<div>
																						<br />
																						<span className="text-base font-futura ml-10">
																							Section{' '}
																							{sectionIndex +
																								1}

																							:
																							Q
																							{index +
																								1}

																							.{' '}
																							{
																								question.question
																							}
																						</span>
																						<br />
																						<span className="text-base font-futura">
																							<Space
																								direction="vertical"
																								className=" pl-10 w-full mt-5">
																								{question.options &&
																									Array.isArray(
																										question.options
																									) &&
																									question.options.map(
																										(
																											option,
																											index
																										) => {
																											return (
																												<>
																													<Checkbox
																														checked={question.selectedOption.includes(
																															index
																														)}
																														value={
																															index
																														}
																														key={
																															index
																														}>
																														{' '}
																														{
																															<span className="text-base font-futura text-black">
																																{
																																	option
																																}
																															</span>
																														}
																													</Checkbox>
																												</>
																											);
																										}
																									)}
																							</Space>
																						</span>
																						<br />
																					</div>
																				)}
																			</>
																		);
																	}
																)}
														</div>
														<br />
													</>
												);
											}
										)
									)}
									{feedback.length !== 0 && (
										<Space className=" flex flex-col text-left text-lg font-extrabold text-futura mt-10 bg-slate-200 py-10">
											<span className="underline text-xl">
												Grade Overview
											</span>
											<span className="text-lg font-extrabold">
												Final Grade:{' '}
												{parseFloat(
													individualGrade.form_grade
												).toFixed(2)}
												%
											</span>

											{individualGrade.section_grades.map(
												(
													section_grade,
													section_index
												) => {
													return (
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
																				{
																					section_grade.section_name
																				}
																			</span>
																		</TableCell>
																	</TableRow>
																</TableHead>
																<TableBody>
																	<TableRow>
																		<TableCell className="font-futura">
																			<Space className=" justify-between w-full">
																				<p className="font-futura text-base mr-6 bg-white font-semibold">
																					Weightage:
																				</p>
																				<p className=" font-futura text-base bg-white">
																					{
																						section_grade.section_weightage
																					}

																					%
																				</p>
																			</Space>
																		</TableCell>
																	</TableRow>
																	<TableRow>
																		<TableCell className=" font-futura ">
																			<Space className=" justify-between w-full">
																				<p className="font-futura text-base mr-6 bg-white font-semibold">
																					Section
																					Score:
																				</p>
																				<p className="font-futura text-base bg-white">
																					{
																						section_grade.section_total_score
																					}

																					/
																					{
																						section_grade.section_max_score
																					}
																				</p>
																			</Space>
																		</TableCell>
																	</TableRow>
																	<TableRow>
																		<TableCell
																			// align="right"
																			className=" font-futura  ">
																			<Space className=" justify-between w-full">
																				<p className="font-futura text-base mr-6 bg-white font-semibold">
																					Section
																					Grade
																					pre
																					Weightage:
																				</p>
																				<p className="font-futura text-base bg-white">
																					{(
																						section_grade.section_grade_in_percentage *
																						100
																					).toFixed(
																						2
																					)}

																					%
																				</p>
																			</Space>
																		</TableCell>
																	</TableRow>
																	<TableRow>
																		<TableCell className=" font-futura ">
																			<Space className=" justify-between w-full">
																				<p className="font-futura text-base mr-6 font-semibold  bg-white">
																					Section
																					Grade
																					after
																					Weightage:
																				</p>
																				<p className="font-futura text-base  bg-white">
																					{section_grade.section_grade_after_weightage.toFixed(
																						2
																					)}

																					%
																				</p>
																			</Space>
																		</TableCell>
																	</TableRow>
																</TableBody>
															</Table>
														</Box>
													);
												}
											)}
										</Space>
									)}
								</div>
							</Form>
							{feedback.length != 0 && (
								<div className="flex justify-center items-center bg-slate-100 pt-10 pb-10">
									<Button
										onClick={() => {
											exportEvaluationData();
											// alert('Meoww');
										}}
										type="default"
										className="text-base h-auto font-futura  bg-green-500 hover:bg-green-400">
										<span className="text-base font-futura text-white hover:text-white">
											Export Evaluation Data
										</span>
									</Button>
								</div>
							)}
						</>
					)}
				</div>
				<NetworkErrorModal />
			</Content>

			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

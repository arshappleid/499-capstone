// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import {
	Layout,
	Button,
	Modal,
	Space,
	Form,
	Radio,
	Checkbox,
	Pagination,
} from 'antd';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const { Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function ViewGroupEvaluationsFeedback() {
	const [loading, isLoading] = useState(true);
	const evaluatee_id = useSelector((state) => state.evaluateeId);
	const formId = useSelector((state) => state.formId);
	const courseId = useSelector((state) => state.courseId);
	const formName = useSelector((state) => state.formName);

	const [individualGrade, setIndividualGrade] = useState([]);

	const fetchIndividualGrade = async (evaluator_id) => {
		try {
			isLoading(true);
			const requestData = {
				student_id: evaluatee_id,
				form_id: formId,
				evaluator_id: evaluator_id,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getindividualgrade',
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
									section_name: section_grade.section_name,
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
				isLoading(false);
				return all_grades();
			} else {
				isLoading(false);
				return;
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

	const [feedback, setFeedback] = useState({});
	const [evaluatorIds, setEvaluatorIds] = useState([]);

	const fetchEvaluationFeedback = async () => {
		try {
			isLoading(true);
			const requestData = {
				student_id: evaluatee_id,
				course_id: courseId,
				form_id: formId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/viewevaluationfeedback',
				requestData,
				{ headers }
			);
			const status = response.data.status;

			if (status === 'success') {
				const allFeedback = response.data.evaluationFeedback.map(
					(feedback) => {
						return {
							formName: feedback.formName,
							formDeadline: feedback.deadline,
							evaluatorId: feedback.evaluator_id,
							sections: feedback.sections.map((section) => {
								return {
									name: section.name,
									weightage: section.weightage,

									questions: section.questions.map(
										(question) => {
											return {
												type: question.type,
												questionId:
													question.question_id,
												question: question.question,
												options: question.options
													? question.options.map(
															(option) => {
																return option;
															}
													  )
													: null,
												optionPoints:
													question.optionPoints
														? question.optionPoints.map(
																(
																	optionPoint
																) => {
																	return optionPoint;
																}
														  )
														: null,
												selectedOptionText:
													question.selectedOptionText
														? question.selectedOptionText.map(
																(
																	selectedOptionText
																) => {
																	return selectedOptionText;
																}
														  )
														: null,
												comment: question.comment
													? question.comment
													: null,
												selectedOption:
													question.selectedOption
														? question.selectedOption.map(
																(
																	selectedOption
																) => {
																	return selectedOption;
																}
														  )
														: null,
											};
										}
									),
								};
							}),
						};
					}
				);
				response.data.evaluationFeedback.map((feedback) => {
					setEvaluatorIds((prevIds) => [
						...prevIds,
						feedback.evaluator_id,
					]);
				});
				setFeedback(allFeedback);
			} else {
				setFeedback([]);
				setNetworkErrorMessage('Error fetching evaluation feedback');
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
		fetchEvaluationFeedback();
	}, []);

	useEffect(() => {
		const getIndividualGrades = async () => {
			const fetchedGrades = [];
			for (
				let feedbackIndex = 0;
				feedbackIndex < feedback.length;
				feedbackIndex++
			) {
				try {
					const gradeData = await fetchIndividualGrade(
						evaluatorIds[feedbackIndex]
					);

					fetchedGrades.push(gradeData);
				} catch (error) {
					if (error.isAxiosError && error.response === undefined) {
						setNetworkErrorMessage(error.message);
						setNetworkErrorModalVisible(true);
					} else {
						setNetworkErrorMessage(error.message);
						setNetworkErrorModalVisible(true);
					}
				}
			}

			setIndividualGrade(fetchedGrades);
		};

		if (feedback && feedback.length > 0) {
			getIndividualGrades();
		}
	}, [feedback]);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 1;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	const currentFeedback =
		feedback.length > 0 ? feedback.slice(startIndex, endIndex) : null;

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
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

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Content className="flex flex-col flex-grow font-futura bg-white mb-20">
				<div className="bg-slate-200 mx-40 mt-10 mb-10 rounded-lg">
					<div className="flex flex-col font-futura font-extrabold items-center w-full text-xl mt-10">
						<h2>Evaluation Feedbacks for {formName}</h2>
					</div>
					<Form Layout="vertical" disabled={true}>
						<div className=" w-full font-futura mt-10 bg-slate-100 pt-10 pb-20 rounded-b-lg">
							{loading && (
								<div className="py-10">
									<h3 className="w-full font-futura text-lg text-center">
										<p className="font-futura flex items-center justify-center">
											<LoadingOutlined spin />
										</p>
										<br /> Loading Group Evaluation Feedback
										and Grades...
									</h3>
								</div>
							)}
							{!loading && !currentFeedback && (
								<p className="text-center font-futura text-base ">
									No Feedback data found
								</p>
							)}
							{!loading &&
								currentFeedback &&
								Array.isArray(currentFeedback) &&
								currentFeedback.map(
									(feedback, feedbackIndex) => {
										return (
											feedback.sections &&
											Array.isArray(feedback.sections) &&
											feedback.sections.map(
												(section, sectionIndex) => {
													return (
														<>
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
																	individualGrade[
																		currentPage -
																			1
																	]
																		?.section_grades[
																		sectionIndex
																	]
																		?.section_total_score
																}
																/
																{
																	individualGrade[
																		currentPage -
																			1
																	]
																		?.section_grades[
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
																							<span className="text-base font-futura mt-6">
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
																												className=" w-3/4 pb-16 font-futura pl-2 rounded-md border-2 border-slate-200 text-base disabled:bg-white disabled:text-black "
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
																								className="w-3/4 pb-16 ml-10 pl-2 font-futura rounded-md border-2 border-slate-200 text-base mt-6 disabled:bg-white disabled:text-black"
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
																														value={
																															index
																														}
																														key={
																															index
																														}
																														checked={question.selectedOption?.includes(
																															index
																														)}>
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
															<br />
														</>
													);
												}
											)
										);
									}
								)}
							{!loading && currentFeedback && (
								<Space className=" flex flex-col text-left text-lg font-extrabold text-futura mt-10 bg-slate-200 py-10">
									<span className="underline text-xl">
										Grade Overview
									</span>
									<span className="text-lg font-extrabold">
										Grade:{' '}
										{parseFloat(
											individualGrade[currentPage - 1]
												?.form_grade
										).toFixed(2)}
										%
									</span>

									{individualGrade[
										currentPage - 1
									]?.section_grades.map((section_grade) => {
										return (
											<Box
												sx={{ marginTop: 5 }}
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
															<TableCell
																// align="right"
																className=" font-futura  ">
																<Space className=" justify-between w-full">
																	<p className="font-futura text-base mr-6 bg-white font-semibold">
																		Weightage
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
															<TableCell
																// align="right"
																className=" font-futura  ">
																<Space className=" justify-between w-full">
																	<p className="font-futura text-base mr-6 bg-white font-semibold">
																		Section
																		Score
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
																className="font-futura  ">
																<Space className=" justify-between w-full">
																	<p className="font-futura text-base mr-6 bg-white font-semibold">
																		Section
																		Grade
																		pre
																		Weightage
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
															<TableCell
																// align="right"
																className=" font-futura ">
																<Space className=" justify-between w-full">
																	<p className="font-futura text-base mr-6 font-semibold  bg-white">
																		Section
																		Grade
																		after
																		Weightage
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
									})}
								</Space>
							)}
							<div className=" w-full  flex flex-col font-futura font-extrabold items-center text-xl">
								<Pagination
									style={{
										marginTop: '20px',
										color: 'red',
										'font-size': '1rem',
										'font-weight': '100',
									}}
									current={currentPage}
									total={feedback.length}
									pageSize={itemsPerPage}
									onChange={handlePageChange}
								/>
							</div>
						</div>
					</Form>
				</div>
				<NetworkErrorModal />
			</Content>
		</Layout>
	);
}

// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import React, { useState } from 'react';
import NavigationBar from '../navigationbar';
import {
	Modal,
	Button,
	Space,
	Layout,
	Breadcrumb,
	Tooltip,
	Select,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
import AppFooter from '../appfooter';
import { useNavigate } from 'react-router-dom';
import { InfoCircleOutlined, DeleteTwoTone } from '@ant-design/icons';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
dayjs.extend(utc);
dayjs.extend(timezone);

export function EvaluationForm() {
	const [value, setValue] = React.useState(
		dayjs.utc().add(0, 'day').hour(7).minute(0)
	);
	const navigate = useNavigate();
	const validationSchema = Yup.object().shape({
		formName: Yup.string().required('Form Name is required'),
		deadline: Yup.string().required('Deadline is required'),
		sections: Yup.array()
			.of(
				Yup.object().shape({
					name: Yup.string().required('Section Name is required'),
					weightage: Yup.number()
						.typeError('Section Weightage must be a number')
						.min(0, 'Section Weightage cannot be negative')
						.max(100, 'Section Weightage cannot exceed 100')
						.required('Section Weightage is required'),
					questions: Yup.array()
						.of(
							Yup.object().shape({
								question: Yup.string().required(
									'Question Text cannot be empty'
								),
								type: Yup.string().required(
									'Question Type is required'
								),
								options: Yup.array()
									.of(
										Yup.string().required(
											'Option field can not be left empty'
										)
									)
									.min(1, 'At least one option is required')
									.test(
										'options-required',
										'At least one option is required',
										function (options) {
											return this.parent.type === 'mcq' ||
												this.parent.type === 'ma'
												? options && options.length > 0
												: true;
										}
									),
							})
						)
						.min(1, 'Each section should have atleast 1 question'),
				})
			)
			.min(1, 'At least one section is required')
			.test(
				'weightage-total',
				'Total weightage should be 100%',
				function (sections) {
					const totalWeightage = sections.reduce(
						(total, section) => total + section.weightage,
						0
					);
					return totalWeightage === 100;
				}
			),
	});

	const courseName = useSelector((state) => state.courseName);
	const courseID = useSelector((state) => state.courseId);
	const instructorID = useSelector((state) => state.instructorId);
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
	const updatedSectionsWithWeightage = (updatedSections, sections) => {
		const equalWeightage = Math.floor(100 / updatedSections.length);
		const remainingWeightage =
			100 - equalWeightage * (updatedSections.length - 1);
		const updatedSectionsWithWeightage = updatedSections.map(
			(section, index) => ({
				...section,
				weightage:
					index === updatedSections.length - 1
						? remainingWeightage
						: equalWeightage,
			})
		);
		return updatedSectionsWithWeightage;
	};

	const [selectedQuestionType, setSelectedQuestionType] = useState('');

	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura bg-white">
				<div className="bg-[#F4F4F4] h-20">
					<div className="w-full h-full m-auto flex justify-center p-2 items-center bg-[#DDEEFF]">
						<h1 className=" text-2xl text-ellipsis">
							Create Evaluation Form
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
								<p className="text-black">
									Create Evaluation Form
								</p>
							),
						},
					]}
				/>
				<div className="bg-slate-100 mx-14 mt-10 mb-10 rounded-lg">
					<div className="flex justify-center">
						<h1 className=" font-futura text-2xl font-bold mt-10">
							Create Evaluation Form
						</h1>
					</div>
					<Formik
						initialValues={{
							formName: '',
							sections: [
								{ name: '', weightage: 100, questions: [] },
							],
							deadline: value?.format('MMMM D, YYYY HH:mm'),
						}}
						validationSchema={validationSchema}
						onSubmit={async (values) => {
							try {
								const requestData = {
									course_id: courseID,
									instructor_id: instructorID,
									formName: values.formName,
									deadline: values.deadline,
									sections: values.sections,
								};
								const headers = {
									'Content-Type': 'application/json',
									authorization:
										localStorage.getItem('Authorization'),
								};
								const response = await axios.post(
									BACKEND_URL +
										'instructor/instructorcreateform',
									requestData,
									{ headers: headers }
								);
								const status = response['data']['status'];
								const message = response['data']['message'];
								if (status === 'success') {
									setModalTitle('Form Created Successfully!');
									setModalContent(
										'Redirecting to Group Evaluation List Page...'
									);
									setIsModalVisible(true);
									setTimeout(() => {
										setIsModalVisible(false);
										navigate('/evaluationlistpage');
									}, 2000);
								} else {
									setModalTitle(
										'Error! Evaluation From could not be created!'
									);
									setModalContent(message);
									setIsModalVisible(true);
									setTimeout(() => {
										setIsModalVisible(false);
									}, 2000);
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
						{({ values, isValid, setFieldValue, errors }) => (
							<Form>
								<Space className=" flex flex-col justify-start items-start w-full mt-10">
									<h2 className="font-futura text-xl ml-14">
										Instructions for a successful Evaluation
										Form Creation:
									</h2>
									<br />
									<ol className="text-lg font-futura ml-14 -mt-4 list-disc list-inside">
										<li>
											Evaluation Form Name should be
											unique.
										</li>
										<li>
											Each Evaluation Form should have a
											deadline.
										</li>
										<li>
											Each Evaluation Form should have
											atleast 1 Section.
										</li>
										<li>
											Each section should have at least 1
											question.
										</li>
										<li>
											The total weightage of all the
											sections should be 100%.
										</li>
										<li>
											Each Question should have a question
											text.
										</li>
										<li>
											Questions that have option point(s)
											should have a numeric value (could
											be a decimal).
										</li>
										<li>
											Each Multiple Choice Question should
											have at least 2 options.
										</li>
									</ol>
								</Space>
								<Space className="flex flex-row items-start justify-items-start w-full mt-10">
									<label
										htmlFor="formName"
										className="font-futura font-bold text-lg ml-14 h-10">
										Form Name:
									</label>
									<Field
										type="text"
										as="textarea"
										id="formName"
										name="formName"
										className=" font-futura text-lg border-2 border-slate-200 w-96 ml-2 mb-10 pl-1 rounded-md"
										title="Add group assignment name"
										placeholder="Enter Group Evaluation Form Name"
										maxLength="255"
									/>
									<ErrorMessage
										name="formName"
										component="div"
										className="font-futura  text-lg mt-1 text-red-500"
									/>
								</Space>
								<Space className="flex flex-row items-start justify-items-start w-full">
									<label
										htmlFor="deadline"
										className="inline font-futura font-bold text-lg ml-14 h-10">
										Deadline (PDT/PST):
									</label>
									<LocalizationProvider
										dateAdapter={AdapterDayjs}>
										<div className=" font-futura ml-2">
											<DateTimePicker
												className="ml-2 mb-10 mt-10 font-futura text-lg  bg-white border-2 border-slate-600 rounded-md"
												id="deadline"
												name="deadline"
												// format="YYYY-MM-DD HH:mm"
												format="MMMM D, YYYY HH:mm"
												timezone="system"
												localeText={{
													datePlaceholder:
														'MM/DD/YYYY',
													timePlaceholder: 'HH:MM',
												}}
												disablePast
												timeSteps={{ minutes: 1 }}
												value={value}
												onChange={(date) => {
													setValue(date);
													setFieldValue(
														'deadline',
														date?.format(
															'MMMM D, YYYY HH:mm'
														)
													);
												}}
											/>
										</div>
									</LocalizationProvider>
									<ErrorMessage
										name="deadline"
										component="div"
										className="font-futura text-lg mt-1 text-red-500"
									/>
								</Space>

								<FieldArray name="sections">
									{({
										push: pushSection,
										remove: removeSection,
									}) => (
										<div>
											{values.sections.map(
												(section, sectionIndex) => (
													<div
														key={sectionIndex}
														className=" bg-blue-100 mx-14 mt-10 pb-10 pt-2 mb-10 rounded-lg">
														<Space className="flex flex-row justify-between">
															<h2 className="font-futura text-lg font-bold pt-4 mb-10 ml-6 h-10">
																Section{' '}
																{String.fromCharCode(
																	65 +
																		sectionIndex
																)}
															</h2>
															<Tooltip
																title={
																	<span className="text-base font-futura">
																		Delete
																		Section
																	</span>
																}>
																<Button
																	type="button"
																	onClick={() => {
																		removeSection(
																			sectionIndex
																		);
																		const updatedSections =
																			values.sections.filter(
																				(
																					_,
																					index
																				) =>
																					index !==
																					sectionIndex
																			);
																		setFieldValue(
																			'sections',
																			updatedSectionsWithWeightage(
																				updatedSections
																			)
																		);
																	}}
																	className="text-base font-futura font-bold rounded-lg w-1/10 h-12 bg-white mr-4 -mt-2 text-white">
																	<DeleteTwoTone
																		className=" text-lg"
																		twoToneColor={
																			'red'
																		}
																	/>
																</Button>
															</Tooltip>
														</Space>
														<Space className="flex flex-row items-start justify-items-start w-full">
															<label
																htmlFor={`sections.${sectionIndex}.name`}
																className="font-futura text-lg pt-4 ml-14 h-10">
																Section Name:
															</label>
															<Field
																type="text"
																as="textarea"
																id={`sections.${sectionIndex}.name`}
																name={`sections.${sectionIndex}.name`}
																className=" font-futura border-2 border-slate-200 text-lg w-96 ml-2 pl-1 rounded-md"
																placeholder="Enter Section Name"
																maxLength="255"
															/>
															<ErrorMessage
																name={`sections.${sectionIndex}.name`}
																component="div"
																className="font-futura border-black-500 text-lg ml-2 text-red-500"
															/>
														</Space>
														<Space className="flex flex-row items-start justify-items-start w-full mt-4 ">
															{/* <span className="font-futura text-lg flex items-center justify-center"> */}
															<label
																htmlFor={`sections.${sectionIndex}.weightage`}
																className="font-futura text-lg ml-14">
																Section
																Weightage (%):
															</label>
															<Field
																type="number"
																id={`sections.${sectionIndex}.weightage`}
																name={`sections.${sectionIndex}.weightage`}
																className="font-futura border-2 text-lg border-blacke-500 w-24 ml-2 pl-1 h-8 rounded-md"
															/>
															<Tooltip
																title={
																	<span className="text-base font-futura">
																		The
																		section
																		weightage
																		total
																		must be
																		100%,
																		inorder
																		to
																		successfully
																		create
																		an
																		evaluation
																		form.
																	</span>
																}
																className="ml-4 text-base">
																<InfoCircleOutlined className="text-base" />
															</Tooltip>
															<ErrorMessage
																name={`sections.${sectionIndex}.weightage`}
																component="div"
																className="font-futura border-blacke-500 text-lg ml-14 text-red-500"
															/>
															<ErrorMessage
																name={`sections.${sectionIndex}.weightage-total`}
																component="div"
																className="font-futura border-blacke-500 text-lg ml-14 text-red-500"
															/>
														</Space>

														<FieldArray
															name={`sections.${sectionIndex}.questions`}>
															{({
																push: pushQuestion,
																remove: removeQuestion,
															}) => (
																<div>
																	{section.questions.map(
																		(
																			question,
																			questionIndex
																		) => (
																			<div
																				key={
																					questionIndex
																				}
																				className=" bg-blue-50 mx-14 rounded-lg mt-10 pb-10 pt-2 mb-10">
																				<Space className="flex flex-row justify-between">
																					<h2 className="font-futura text-lg font-bold pt-4 mb-10 ml-6 h-10">
																						Question{' '}
																						{questionIndex +
																							1}
																					</h2>
																					<Tooltip
																						title={
																							<span className="text-base font-futura">
																								Delete
																								Question
																							</span>
																						}>
																						<Button
																							type="button"
																							onClick={() =>
																								removeQuestion(
																									questionIndex
																								)
																							}
																							className="text-base font-futura font-bold rounded-lg w-1/10 h-12 bg-white mr-4 -mt-2 text-white">
																							<DeleteTwoTone
																								className=" text-lg"
																								twoToneColor={
																									'red'
																								}
																							/>
																						</Button>
																					</Tooltip>
																				</Space>
																				<ErrorMessage
																					name="question"
																					component="div"
																				/>
																				{question.type ===
																					'mcq' && (
																					<div>
																						<Space className="flex flex-row items-start justify-items-start w-full">
																							<label
																								htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								className="font-futura text-lg pt-4 mb-10 ml-14">
																								Question
																								Text:
																							</label>
																							<Field
																								type="text"
																								as="textarea"
																								id={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								className="font-futura text-lg border-2 w-96 ml-2 pl-1 rounded-md"
																								placeholder="Enter Question Text"
																								maxLength="1000"
																							/>
																							<ErrorMessage
																								name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								component="div"
																								className="font-futura text-lg ml-14 mt-1 text-red-500"
																							/>
																						</Space>

																						<label className="block font-futura text-lg pt-4 mb-5 ml-14">
																							Options:
																						</label>

																						<FieldArray
																							name={`sections.${sectionIndex}.questions.${questionIndex}.options`}>
																							{({
																								push: pushOption,
																								remove: removeOption,
																							}) => (
																								<div>
																									{question.options.map(
																										(
																											option,
																											optionIndex
																										) => (
																											<div
																												key={
																													optionIndex
																												}>
																												<Space className=" pr-4">
																													<label
																														htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																														className="inline font-futura text-lg pt-1 mb-2 ml-14">
																														{String.fromCharCode(
																															97 +
																																optionIndex
																														)}
																														<span>
																															)
																														</span>
																													</label>
																												</Space>
																												<Field
																													type="text"
																													name={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													className="font-futura border-2 text-lg  w-1/2 mb-3 ml-2 pl-1 rounded-md"
																													placeholder="Enter Option Text"
																													maxLength="1000"
																												/>

																												<label
																													htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													className="inline font-futura text-lg pt-1 mb-2 ml-6">
																													Point(s):
																												</label>
																												<Field
																													type="number"
																													id={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													name={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													className="font-futura text-lg border-2 w-14 ml-2 rounded-md"
																												/>

																												<ErrorMessage
																													name={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													component="div"
																													className="inline font-futura border-blacke-500 text-lg ml-5 mt-1 text-red-500"
																												/>
																												<Tooltip
																													title={
																														<span className="text-base font-futura">
																															Delete
																															Option
																														</span>
																													}>
																													<Button
																														type="default"
																														onClick={() => {
																															removeOption(
																																optionIndex
																															);
																															const updatedOptions =
																																values
																																	.sections[
																																	sectionIndex
																																]
																																	.questions[
																																	questionIndex
																																]
																																	.options;
																															const updatedOptionPoints =
																																values
																																	.sections[
																																	sectionIndex
																																]
																																	.questions[
																																	questionIndex
																																]
																																	.optionPoints;

																															if (
																																updatedOptions &&
																																updatedOptionPoints &&
																																updatedOptions.length >
																																	0 &&
																																updatedOptionPoints.length >
																																	0
																															) {
																																const filteredOptions =
																																	updatedOptions.filter(
																																		(
																																			_,
																																			i
																																		) =>
																																			i !==
																																			optionIndex
																																	);
																																const filteredOptionPoints =
																																	updatedOptionPoints.filter(
																																		(
																																			_,
																																			i
																																		) =>
																																			i !==
																																			optionIndex
																																	);

																																// Update the optionPoints array
																																setFieldValue(
																																	`sections.${sectionIndex}.questions.${questionIndex}.options`,
																																	filteredOptions
																																);
																																setFieldValue(
																																	`sections.${sectionIndex}.questions.${questionIndex}.optionPoints`,
																																	filteredOptionPoints
																																);
																															}
																														}}
																														className="inline h-auto text-base  font-futura font-bold rounded-lg w-12 ml-4 mb-5 p-1.5 bg-white text-white">
																														<DeleteTwoTone
																															className=" text-lg"
																															twoToneColor={
																																'red'
																															}
																														/>
																													</Button>
																												</Tooltip>
																												<br />
																												<ErrorMessage
																													name={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													component="div"
																													className="inline font-futura border-blacke-500 text-lg ml-20 mt-1 text-red-500"
																												/>
																											</div>
																										)
																									)}

																									<Button
																										type="default"
																										onClick={() =>
																											pushOption(
																												''
																											)
																										}
																										className="text-base font-futura h-auto font-bold rounded-lg w-1/10 ml-14 p-2 bg-blue-500 hover:bg-blue-400 drop-shadow-xl text-white">
																										<span className="text-white hover:text-white">
																											+
																											Add
																											Option
																										</span>
																									</Button>
																								</div>
																							)}
																						</FieldArray>
																					</div>
																				)}

																				{question.type ===
																					'ma' && (
																					<div>
																						<Space className="flex flex-row items-start justify-items-start w-full">
																							<label
																								htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								className="font-futura text-lg pt-4 mb-10 ml-14 h-10">
																								Question
																								Text:
																							</label>
																							<Field
																								type="text"
																								as="textarea"
																								id={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								className=" font-futura border-2 text-lg w-96 ml-2 pl-1 rounded-md"
																								placeholder="Enter Question Text"
																								maxLength="1000"
																							/>
																							<ErrorMessage
																								name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								component="div"
																								className="font-futura  text-lg ml-14 mt-1 text-red-500"
																							/>
																						</Space>

																						<label className="block font-futura text-lg pt-4 mb-5 ml-14">
																							Options:
																						</label>
																						<FieldArray
																							name={`sections.${sectionIndex}.questions.${questionIndex}.options`}>
																							{({
																								push: pushOption,
																								remove: removeOption,
																							}) => (
																								<div>
																									{question.options.map(
																										(
																											option,
																											optionIndex
																										) => (
																											<div
																												key={
																													optionIndex
																												}>
																												<label
																													htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													className="inline font-futura text-lg pt-1 mb-2 ml-14">
																													{String.fromCharCode(
																														97 +
																															optionIndex
																													)}
																													<span>
																														)
																													</span>
																												</label>
																												<Field
																													type="text"
																													name={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													className=" font-futura border-2 text-lg w-1/2 mb-3 ml-2 pl-1 rounded-md"
																													placeholder="Enter Option Text"
																													maxLength="1000"
																												/>
																												<Tooltip
																													title={
																														<span className="text-base font-futura">
																															Delete
																															Option
																														</span>
																													}>
																													<Button
																														type="default"
																														onClick={() => {
																															removeOption(
																																optionIndex
																															);

																															const updatedOptions =
																																values
																																	.sections[
																																	sectionIndex
																																]
																																	.questions[
																																	questionIndex
																																]
																																	.options;

																															if (
																																updatedOptions &&
																																updatedOptions.length >
																																	0
																															) {
																																const filteredOptions =
																																	updatedOptions.filter(
																																		(
																																			_,
																																			i
																																		) =>
																																			i !==
																																			optionIndex
																																	);

																																// Update the optionPoints array
																																setFieldValue(
																																	`sections.${sectionIndex}.questions.${questionIndex}.options`,
																																	filteredOptions
																																);
																																// setFieldValue(
																																// 	`sections.${sectionIndex}.questions.${questionIndex}.optionPoints`,
																																// 	filteredOptionPoints
																																// );
																															}
																														}}
																														className="inline h-auto text-base  font-futura font-bold rounded-lg w-12 ml-4 mb-5 p-1.5 bg-white text-white">
																														{/* Remove Option */}
																														<DeleteTwoTone
																															className=" text-lg"
																															twoToneColor={
																																'red'
																															}
																														/>
																													</Button>
																												</Tooltip>
																												<br />

																												<ErrorMessage
																													name={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													component="div"
																													className="inline font-futura text-lg ml-20 mt-1 text-red-500"
																												/>
																											</div>
																										)
																									)}
																									<Button
																										type="default"
																										onClick={() =>
																											pushOption(
																												''
																											)
																										}
																										className="text-base font-futura h-auto font-bold rounded-lg w-1/10 ml-14 p-2 bg-blue-500 hover:bg-blue-400 drop-shadow-xl text-white">
																										<span className="text-white hover:text-white">
																											+
																											Add
																											Option
																										</span>
																									</Button>
																								</div>
																							)}
																						</FieldArray>
																					</div>
																				)}

																				{question.type ===
																					'shortAnswer' && (
																					<Space className="flex flex-row items-start justify-items-start w-full">
																						<label
																							htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																							className="font-futura text-lg pt-4 mb-10 ml-14 h-10">
																							Question
																							Text:
																						</label>
																						<Field
																							type="text"
																							as="textarea"
																							id={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																							name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																							className=" font-futura border-2 text-lg w-96 ml-2 pl-1 rounded-md"
																							placeholder="Enter Question Text"
																							maxLength="1000"
																						/>
																						<ErrorMessage
																							name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																							component="div"
																							className="font-futura text-lg ml-14 mt-1 text-red-500"
																						/>
																					</Space>
																				)}

																				{question.type ===
																					'matrix' && (
																					<div>
																						<Space className="flex flex-row items-start justify-items-start w-full">
																							<label
																								htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								className="font-futura text-lg pt-4 mb-10 ml-14 h-10">
																								Question
																								Text:
																							</label>
																							<Field
																								type="text"
																								as="textarea"
																								id={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								className=" font-futura text-lg border-2  w-96 ml-2 pl-1 rounded-md"
																								placeholder="Enter Question Text"
																								maxLength="1000"
																							/>
																							<ErrorMessage
																								name={`sections.${sectionIndex}.questions.${questionIndex}.question`}
																								component="div"
																								className="font-futura border-blacke-500 text-lg ml-14 mt-1 text-red-500"
																							/>
																						</Space>
																						<br />
																						<Space className="flex flex-row w-full justify-start mt-10">
																							<h2 className="font-futura text-lg ml-14 ">
																								Select
																								a
																								possible
																								matrix
																								type
																								question:
																							</h2>
																							<div>
																								<Button
																									type="default"
																									onClick={() => {
																										const likertOptions =
																											[
																												'Strongly Agree',
																												'Agree',
																												'Neutral',
																												'Disagree',
																												'Strongly Disagree',
																											];
																										const likertOptionPoints =
																											[
																												2,
																												1,
																												0,
																												-1,
																												-2,
																											];
																										setFieldValue(
																											`sections.${sectionIndex}.questions.${questionIndex}.options`,
																											likertOptions
																										);
																										setFieldValue(
																											`sections.${sectionIndex}.questions.${questionIndex}.optionPoints`,
																											likertOptionPoints
																										);
																									}}
																									className="text-base font-futura font-bold rounded-lg w-auto ml-14 h-auto drop-shadow-2xl bg-blue-500 hover:bg-blue-400 text-white">
																									<span className="text-white hover:text-white">
																										Likert
																										Scale
																									</span>
																								</Button>

																								<Button
																									type="default"
																									onClick={() => {
																										const numericOptions =
																											[
																												'0',
																												'1',
																												'2',
																												'3',
																												'4',
																											];
																										const numericOptionPoints =
																											[
																												0,
																												1,
																												2,
																												3,
																												4,
																											];
																										setFieldValue(
																											`sections.${sectionIndex}.questions.${questionIndex}.options`,
																											numericOptions
																										);
																										setFieldValue(
																											`sections.${sectionIndex}.questions.${questionIndex}.optionPoints`,
																											numericOptionPoints
																										);
																									}}
																									className="text-base font-futura font-bold rounded-lg w-auto ml-4 h-auto drop-shadow-2xl bg-blue-500 hover:bg-blue-400 text-white">
																									<span className="text-white hover:text-white">
																										0-4
																										Scale
																									</span>
																								</Button>
																							</div>
																						</Space>
																						<label className="block font-futura text-lg pt-4 mb-5 ml-14">
																							Options:
																						</label>

																						<FieldArray
																							name={`sections.${sectionIndex}.questions.${questionIndex}.options`}>
																							{({
																								push: pushOption,
																								remove: removeOption,
																							}) => (
																								<div>
																									{question.options.map(
																										(
																											option,
																											optionIndex
																										) => (
																											<div
																												key={
																													optionIndex
																												}>
																												<label
																													htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													className="inline font-futura text-lg pt-1 mb-2 ml-14">
																													{String.fromCharCode(
																														97 +
																															optionIndex
																													)}
																													<span>
																														)
																													</span>
																												</label>
																												<Field
																													type="text"
																													name={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													className="font-futura border-2 text-lg border-blacke-500 w-1/2 mb-3 ml-2 pl-1 rounded-md"
																													placeholder="Enter Option Text"
																													maxLength="1000"
																												/>

																												<label
																													htmlFor={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													className="inline font-futura text-lg pt-1 mb-2 ml-6">
																													Point(s):
																												</label>
																												<Field
																													type="number"
																													id={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													name={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													className="font-futura text-lg border-2 w-14 ml-2 rounded-md"
																													// defaultValue={
																													// 	1
																													// }
																												/>
																												<ErrorMessage
																													name={`sections.${sectionIndex}.questions.${questionIndex}.optionPoints.${optionIndex}`}
																													component="div"
																													className="inline font-futura border-blacke-500 text-lg ml-5 mt-1 text-red-500"
																												/>
																												<Tooltip
																													title={
																														<span className="text-base font-futura">
																															Delete
																															Option
																														</span>
																													}>
																													<Button
																														type="default"
																														onClick={() => {
																															// Remove the option
																															removeOption(
																																optionIndex
																															);

																															// Update the option points for subsequent options
																															const updatedOptions =
																																values
																																	.sections[
																																	sectionIndex
																																]
																																	.questions[
																																	questionIndex
																																]
																																	.options;
																															const updatedOptionPoints =
																																values
																																	.sections[
																																	sectionIndex
																																]
																																	.questions[
																																	questionIndex
																																]
																																	.optionPoints;

																															if (
																																updatedOptions &&
																																updatedOptionPoints &&
																																updatedOptions.length >
																																	0 &&
																																updatedOptionPoints.length >
																																	0
																															) {
																																const filteredOptions =
																																	updatedOptions.filter(
																																		(
																																			_,
																																			i
																																		) =>
																																			i !==
																																			optionIndex
																																	);
																																const filteredOptionPoints =
																																	updatedOptionPoints.filter(
																																		(
																																			_,
																																			i
																																		) =>
																																			i !==
																																			optionIndex
																																	);

																																// Update the optionPoints array
																																setFieldValue(
																																	`sections.${sectionIndex}.questions.${questionIndex}.options`,
																																	filteredOptions
																																);
																																setFieldValue(
																																	`sections.${sectionIndex}.questions.${questionIndex}.optionPoints`,
																																	filteredOptionPoints
																																);
																															}
																														}}
																														className="inline text-base h-auto font-futura font-bold rounded-lg w-12 ml-4 mb-5 p-1.5 bg-white text-white">
																														<DeleteTwoTone
																															className=" text-lg"
																															twoToneColor={
																																'red'
																															}
																														/>
																													</Button>
																												</Tooltip>
																												<br />
																												<ErrorMessage
																													name={`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}`}
																													component="div"
																													className="inline font-futura border-blacke-500 text-lg ml-20 mt-1 text-red-500"
																												/>
																											</div>
																										)
																									)}

																									<Button
																										type="default"
																										onClick={() =>
																											pushOption(
																												''
																											)
																										}
																										className="text-base h-auto font-futura font-bold rounded-lg w-1/10 ml-14 p-2 bg-blue-500 hover:bg-blue-400 drop-shadow-xl text-white">
																										<span className="text-base font-futura text-white hover:text-white">
																											+
																											Add
																											Option
																										</span>
																									</Button>
																									<ErrorMessage
																										name={`sections.${sectionIndex}.questions.${questionIndex}.options`}
																										component="div"
																										className="font-futura border-blacke-500 text-l ml-14 mt-1 text-red-500"
																									/>
																								</div>
																							)}
																						</FieldArray>
																					</div>
																				)}
																			</div>
																		)
																	)}
																	{/* Add question buttons */}
																	<div className="flex items-center mt-10">
																		<Select
																			placeholder={
																				<span className="font-futura text-base">
																					Select
																					Question
																					Type
																				</span>
																			}
																			// value={selectedQuestionType}
																			value={
																				selectedQuestionType ||
																				undefined
																			}
																			onChange={(
																				value
																			) =>
																				setSelectedQuestionType(
																					value
																				)
																			}
																			className="w-auto ml-14 mr-4">
																			<Select.Option value="mcq">
																				<span className="font-futura text-base ">
																					Multiple
																					Choice
																				</span>
																			</Select.Option>
																			<Select.Option value="ma">
																				<span className="font-futura text-base ">
																					Multiple
																					Answer
																				</span>
																			</Select.Option>
																			<Select.Option value="shortAnswer">
																				<span className="font-futura text-base ">
																					Short
																					Answer
																				</span>
																			</Select.Option>
																			<Select.Option value="matrix">
																				<span className="font-futura text-base ">
																					Matrix
																					Type
																				</span>
																			</Select.Option>
																		</Select>
																		<Button
																			type="default"
																			onClick={() => {
																				if (
																					selectedQuestionType
																				) {
																					let options =
																						[];
																					let optionPoints =
																						[];

																					if (
																						selectedQuestionType ===
																						'mcq'
																					) {
																						options =
																							[
																								'',
																								'',
																								'',
																								'',
																							];
																						optionPoints =
																							[
																								1,
																								1,
																								1,
																								1,
																							];
																						pushQuestion(
																							{
																								type: selectedQuestionType,
																								question:
																									'',
																								options:
																									options,
																								optionPoints:
																									optionPoints,
																							}
																						);
																					} else if (
																						selectedQuestionType ===
																						'ma'
																					) {
																						options =
																							[
																								'',
																								'',
																								'',
																								'',
																							];
																						pushQuestion(
																							{
																								type: selectedQuestionType,
																								question:
																									'',
																								options:
																									options,
																							}
																						);
																					} else if (
																						selectedQuestionType ===
																						'matrix'
																					) {
																						pushQuestion(
																							{
																								type: selectedQuestionType,
																								question:
																									'',
																								options:
																									[],
																							}
																						);
																					} else {
																						pushQuestion(
																							{
																								type: selectedQuestionType,
																								question:
																									'',
																							}
																						);
																					}

																					setSelectedQuestionType(
																						''
																					);
																				}
																			}}
																			disabled={
																				!selectedQuestionType
																			}
																			className="text-base font-futura font-bold rounded-lg w-2/12 h-2/6 bg-blue-500 hover:bg-blue-400  text-white drop-shadow-lg disabled:bg-slate-300">
																			<span className="text-white hover:text-white ">
																				+
																				Add
																				Question
																			</span>
																		</Button>
																	</div>
																</div>
															)}
														</FieldArray>
													</div>
												)
											)}
											{/* Add section buttons */}
											<div>
												<Button
													type="default"
													onClick={() => {
														pushSection({
															name: '',
															questions: [],
														});
														const updatedSections =
															[
																...values.sections,
																{
																	name: '',
																	questions:
																		[],
																},
															];
														setFieldValue(
															'sections',
															updatedSectionsWithWeightage(
																updatedSections
															)
														);
													}}
													className="text-base font-futura h-auto font-bold rounded-lg w-1/10 ml-14 p-2 mt-10 drop-shadow-2xl bg-green-500 hover:bg-green-400 text-white">
													<span className="text-white hover:text-white">
														+ Add Section
													</span>
												</Button>
											</div>
										</div>
									)}
								</FieldArray>

								<Tooltip
									title={
										<span className="text-base font-futura">
											{isValid
												? 'Submit Form'
												: 'Complete the form according to the instructions in order to submit'}
										</span>
									}>
									<div className="flex justify-center">
										<Button
											type="default"
											htmlType="submit"
											className={`text-base font-futura h-auto font-bold drop-shadow-2xl rounded-lg w-1/6 p-2 mt-10 mb-10 ${
												!isValid
													? ' disabled:bg-slate-300 cursor-not-allowed '
													: 'bg-green-500 hover:bg-green-400'
											} text-white`}
											disabled={!isValid}>
											<span className="text-white text-base hover:text-white">
												Submit
											</span>
										</Button>
									</div>
								</Tooltip>
							</Form>
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
}

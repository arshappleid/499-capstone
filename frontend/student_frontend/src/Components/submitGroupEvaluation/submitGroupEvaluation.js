//Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import {
	Layout,
	Breadcrumb,
	Radio,
	Checkbox,
	Space,
	Modal,
	Button,
	Form,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function SubmitGroupEvaluation() {
	const [loading, isLoading] = useState(true);
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const evaluatorId = useSelector((state) => state.evaluatorId);
	const evaluateeId = useSelector((state) => state.evaluateeId);
	const courseId = useSelector((state) => state.courseId);
	const formId = useSelector((state) => state.formId);
	const courseName = useSelector((state) => state.courseName);
	const [studentName, setStudentName] = useState();
	const [studentLastName, setStudentLastName] = useState();

	const [formData, setFormData] = useState({
		formName: '',
		sections: [{ questions: [] }],
		deadline: '',
	});
	const [answers, setAnswers] = useState({
		formAnswer: [],
	});
	const [mcqAnswer, setMcqAnswer] = useState();
	const [matrixAnswer, setMatrixAnswer] = useState();
	const [mcqComments, setMcqComments] = useState();
	const [matrixComments, setMatrixComments] = useState();
	let maValidation;

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
	useEffect(() => {
		const checkEvaluationStatus = async () => {
			try {
				const requestData = {
					evaluator_id: evaluatorId,
					course_id: courseId,
					form_id: formId,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'student/getevaluationstatus',
					requestData,
					{
						headers: headers,
					}
				);
				const status = response.data.status;
				const message = response.data.message;
				if (status === 'success') {
					const evalRecords = response.data.evaluation_records;
					for (let i = 0; i < evalRecords.length; i++) {
						if (evalRecords[i].student_id === evaluateeId) {
							if (evalRecords[i].completion_status === true) {
								navigate('/groupmemberslist');
							} else {
								break;
							}
						}
					}
				} else {
					setModalContent(message);
					setModalTitle('Error');
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						navigate('/groupmemberslist');
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
		checkEvaluationStatus();
	}, []);

	useEffect(() => {
		const fetchStudentProfile = async () => {
			try {
				const requestData = {
					studentID: evaluateeId,
				};
				const headers = {
					'Content-type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'student/getstudentprofile',
					requestData,
					{ headers: headers }
				);
				const student_first_name =
					response.data.data.student_first_name;
				const student_last_name = response.data.data.student_last_name;

				setStudentName(student_first_name);
				setStudentLastName(student_last_name);
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
		fetchStudentProfile();
	}, []);

	const fetchForm = async () => {
		try {
			isLoading(true);
			const requestData = {
				student_id: evaluatorId,
				course_id: courseId,
				form_id: formId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getform',
				requestData,
				{
					headers: headers,
				}
			);
			const status = response.data.status;
			if (status === undefined) {
				const allForms = {
					formName: response.data.formName,
					deadline: response.data.deadline,
					sections: response.data.sections.map((section) => {
						return {
							name: section.name,
							weightage: section.weightage,

							questions: section.questions.map((question) => {
								return {
									type: question.type,
									questionId: question.question_id,
									question: question.question,
									options: question.options
										? question.options.map((option) => {
												return option;
										  })
										: null,
									optionPoints: question.optionPoints
										? question.optionPoints.map(
												(optionPoint) => {
													return optionPoint;
												}
										  )
										: null,
								};
							}),
						};
					}),
				};
				setFormData(allForms);
			} else {
				setFormData([]);
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
		fetchForm();
		return;
	}, []);

	const updateAnswer = (questionId, selectedOption, comment) => {
		const existingAnswerIndex = answers.formAnswer.findIndex(
			(answer) => answer.question_id === questionId
		);

		if (existingAnswerIndex !== -1) {
			const updatedFormAnswer = [...answers.formAnswer];
			updatedFormAnswer[existingAnswerIndex] = {
				...updatedFormAnswer[existingAnswerIndex],
				selectedOption,
				comment,
			};
			setAnswers({ ...answers, formAnswer: updatedFormAnswer });
		} else {
			const newAnswer = {
				question_id: questionId,
				selectedOption,
				comment,
			};
			setAnswers({
				...answers,
				formAnswer: [...answers.formAnswer, newAnswer],
			});
		}
	};

	const onMcqChange = (selectedOption, questionId, comment) => {
		const option = [
			selectedOption
				? selectedOption.target
					? selectedOption.target.value
					: selectedOption
				: mcqAnswer
				? mcqAnswer[questionId]
				: null,
		];
		option !== null &&
			setMcqAnswer((prevAnswers) => ({
				...prevAnswers,
				[questionId]: option[0],
			}));
		setMcqComments((prevComments) => ({
			...prevComments,
			[questionId]: comment,
		}));
		updateAnswer(questionId, option, comment);
	};

	const onMatrixChange = (selectedOption, questionId, comment) => {
		const option = [
			selectedOption
				? selectedOption.target
					? selectedOption.target.value
					: selectedOption
				: matrixAnswer
				? matrixAnswer[questionId]
				: null,
		];

		option !== null &&
			setMatrixAnswer((prevAnswers) => ({
				...prevAnswers,
				[questionId]: option[0],
			}));
		setMatrixComments((prevComments) => ({
			...prevComments,
			[questionId]: comment,
		}));

		updateAnswer(questionId, option, comment);
	};

	const [maAnswer, setMaAnswer] = useState({});

	const onMaChange = (selectedOptions, questionId, sectionIndex) => {
		const existingAnswerIndex = answers.formAnswer.findIndex(
			(answer) => answer.question_id === questionId
		);

		const existingAnswer = maAnswer[questionId] || [];

		const option = selectedOptions.target
			? selectedOptions.target.value
			: selectedOptions;

		// const updateAnswer = [...existingAnswer, option];
		const updateAnswer = existingAnswer.includes(option)
			? existingAnswer.filter(
					(selectedOption) => selectedOption !== option
			  )
			: [...existingAnswer, option];

		setMaAnswer((prevAnswers) => ({
			...prevAnswers,
			[questionId]: updateAnswer,
		}));

		if (existingAnswerIndex !== -1) {
			const updatedFormAnswer = [...answers.formAnswer];
			updatedFormAnswer[existingAnswerIndex] = {
				...updatedFormAnswer[existingAnswerIndex],
				selectedOption: updateAnswer,
			};
			setAnswers({ ...answers, formAnswer: updatedFormAnswer });
		} else {
			const newAnswer = {
				question_id: questionId,
				selectedOption: updateAnswer,
				comment: '',
			};
			setAnswers({
				...answers,
				formAnswer: [...answers.formAnswer, newAnswer],
			});
		}
	};

	const onShortAnswerChange = (comment, questionId) => {
		const existingAnswerIndex = answers.formAnswer.findIndex(
			(answer) => answer.question_id === questionId
		);

		if (existingAnswerIndex !== -1) {
			const updatedFormAnswer = [...answers.formAnswer];
			updatedFormAnswer[existingAnswerIndex] = {
				...updatedFormAnswer[existingAnswerIndex],
				comment: comment,
			};
			setAnswers({ ...answers, formAnswer: updatedFormAnswer });
		} else {
			const newAnswer = {
				question_id: questionId,
				selectedOption: [],
				comment: comment,
			};
			setAnswers({
				...answers,
				formAnswer: [...answers.formAnswer, newAnswer],
			});
		}
	};

	const getMaxPointIndex = (optionPoints) => {
		let maxKey = null;
		let maxValue = Number.NEGATIVE_INFINITY;

		for (const key in optionPoints) {
			if (optionPoints.hasOwnProperty(key)) {
				const value = optionPoints[key];
				if (value > maxValue) {
					maxValue = value;
					maxKey = key;
				}
			}
		}
		return maxKey;
	};

	const handleFormSubmit = async () => {
		maAnswer.length > 0 && (maValidation = checkMaValidation());
		if (maAnswer.length > 0 && !maValidation) {
			setModalContent(
				'One or many fields in the evaluation are invalid!'
			);
			setModalTitle('Submission failed');
			setIsModalVisible(true);
			setTimeout(() => {
				setIsModalVisible(false);
			}, 2000);
		} else {
			try {
				const requestData = {
					evaluatee_id: evaluateeId,
					evaluator_id: evaluatorId,
					course_id: courseId,
					form_id: formId,
					evaluation_answers: answers.formAnswer,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'student/submitevaluation',
					requestData,
					{
						headers: headers,
					}
				);
				const status = response.data.status;
				const message = response.data.message;
				if (status === 'success') {
					setModalContent('Your evaluation has been submitted!');
					setModalTitle('Submission successful');
					setIsModalVisible(true);
					setTimeout(() => {
						setIsModalVisible(false);
						navigate('/groupmemberslist');
					}, 2000);
				} else {
					setModalContent(message);
					setModalTitle('Submission failed');
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
		}
	};
	const onFinishFailed = (errorInfo) => {
		maAnswer.length > 0 && (maValidation = checkMaValidation());
		setModalContent('One or many fields in the evaluation are invalid!');
		setModalTitle('Submission failed');
		setIsModalVisible(true);
		setTimeout(() => {
			setIsModalVisible(false);
		}, 2000);
	};
	const checkMaValidation = () => {
		const isObjectEmpty = Object.keys(maAnswer).length === 0;
		const allKeysHaveValues = Object.values(maAnswer).every(
			(value) => value.length > 0
		);

		return !isObjectEmpty && allKeysHaveValues ? true : false;
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
								<a href="/evaluationlistpage">
									Group Evaluations
								</a>
							),
						},

						{
							title: (
								<span className="text-black">
									Evaluation: {formData && formData.formName}
								</span>
							),
						},
					]}
				/>
				{loading && (
					<h3 className="w-full font-futura text-lg text-center mt-20">
						<p className="font-futura flex items-center justify-center">
							<LoadingOutlined spin />
						</p>
						<br /> Loading Evaluation Form...
					</h3>
				)}
				{!loading && (
					<div className="bg-slate-200 mx-40 mt-10 mb-10 rounded-lg">
						<div className="flex flex-col font-futura font-extrabold items-center w-full text-xl mt-10">
							<h2>
								You are evaluating{' '}
								<span className=" text-red-500 font-extrabold">
									{studentName} {studentLastName}
								</span>{' '}
								for{' '}
								<span className=" underline">
									{formData && formData.formName}
								</span>
							</h2>
						</div>
						<Form
							name="submitEval"
							autoComplete="off"
							layout="vertical"
							className="w-full"
							form={form}
							onFinish={handleFormSubmit}
							onFinishFailed={onFinishFailed}>
							<div className=" w-full font-futura mt-10 bg-slate-100 pt-10 pb-20 rounded-b-lg">
								{formData.sections.map(
									(section, sectionIndex) => {
										return (
											<>
												<span className="font-futura ml-8 mb-4 mt-4 font-semibold text-xl ">
													Section {sectionIndex + 1}:{' '}
													{section.name} (Weightage:{' '}
													{section.weightage}%)
												</span>
												{section.questions.map(
													(question, index) => {
														return (
															<>
																{question.type ===
																	'mcq' && (
																	<div>
																		<br />
																		<Space className="px-10 text-justify">
																			<span className="text-base font-extrabold font-futura mb-6 ">
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
																		</Space>
																		<br />
																		<Form.Item
																			className="-mb-4"
																			name={`radio-${question.questionId}`}
																			rules={[
																				{
																					required: true,
																					message:
																						(
																							<span className="text-red-500 text-base pl-10 font-futura">
																								Please
																								select
																								an
																								option!
																							</span>
																						),
																				},
																			]}>
																			<Radio.Group
																				className=" mt-4 w-full"
																				onChange={(
																					e
																				) =>
																					onMcqChange(
																						e,
																						question.questionId,
																						''
																					)
																				}
																				value={
																					mcqAnswer
																						? mcqAnswer[
																								`${question.questionId}`
																						  ]
																						: undefined
																				}>
																				<span className="text-base font-futura mt-6 ">
																					<Space
																						direction="vertical"
																						className=" pl-10 w-full ">
																						{question.options.map(
																							(
																								option,
																								index
																							) => {
																								return (
																									<>
																										<Radio
																											value={
																												index
																											}
																											key={
																												index
																											}>
																											{
																												<span className="text-base font-futura">
																													{
																														option
																													}
																												</span>
																											}
																											<span className="ml-2 text-base font-futura">
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
																									</>
																								);
																							}
																						)}
																						{mcqAnswer ? (
																							mcqAnswer[
																								`${question.questionId}`
																							] ===
																							parseInt(
																								getMaxPointIndex(
																									question.optionPoints
																								),
																								10
																							) ? null : (
																								<>
																									<p>
																										Justify
																										your
																										grade
																										with
																										a
																										comment
																									</p>
																									<div className=" w-full">
																										<Form.Item
																											// name="input"
																											className="-mb-4 font-futura"
																											name={`comment-${question.questionId}`}
																											rules={[
																												{
																													required: true,
																													message:
																														(
																															<span className="text-red-500 text-base font-futura">
																																Please
																																input
																																your
																																comment!
																															</span>
																														),
																												},
																											]}>
																											<textarea
																												className=" w-3/4 pb-16 pl-2 font-futura text-base rounded-md border-2 border-slate-200"
																												placeholder="Add your comment here..."
																												name={`mcq-comment-${question.questionId}`}
																												id={`mcq-comment-${question.questionId}`}
																												maxLength={
																													400
																												}
																												value={
																													mcqComments[
																														`${question.questionId}`
																													]
																														? mcqComments[
																																`${question.questionId}`
																														  ]
																														: ''
																												}
																												onChange={(
																													e
																												) =>
																													onMcqChange(
																														answers
																															.formAnswer
																															.questionId
																															?.selectedOption,
																														question.questionId,
																														e
																															.target
																															.value
																													)
																												}
																											/>
																										</Form.Item>
																									</div>
																								</>
																							)
																						) : null}
																					</Space>
																				</span>
																			</Radio.Group>
																		</Form.Item>
																		<br />
																	</div>
																)}
																{question.type ===
																	'matrix' && (
																	<div>
																		<br />
																		<Space className="px-10 text-justify">
																			<span className="text-base font-extrabold font-futura mb-6">
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
																		</Space>
																		<br />
																		<Form.Item
																			className="-mb-4"
																			name={`radio2-${question.questionId}`}
																			rules={[
																				{
																					required: true,
																					message:
																						(
																							<span className="text-red-500 text-base pl-10 font-futura">
																								Please
																								select
																								an
																								option!
																							</span>
																						),
																				},
																			]}>
																			<Radio.Group
																				className=" mt-4 w-full"
																				onChange={(
																					e
																				) =>
																					onMatrixChange(
																						e,
																						question.questionId,
																						''
																					)
																				}
																				value={
																					matrixAnswer
																						? matrixAnswer[
																								`${question.questionId}`
																						  ]
																						: undefined
																				}>
																				<span className="text-base font-futura mt-6">
																					<Space
																						direction="vertical"
																						className=" pl-10 w-full">
																						{question.options.map(
																							(
																								option,
																								index
																							) => {
																								return (
																									<Radio
																										value={
																											index
																										}
																										key={
																											index
																										}>
																										{
																											<span className="text-base font-futura">
																												{
																													option
																												}
																											</span>
																										}
																										<span className="ml-2 text-base font-futura">
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
																								);
																							}
																						)}
																						{matrixAnswer ? (
																							matrixAnswer[
																								`${question.questionId}`
																							] ===
																							parseInt(
																								getMaxPointIndex(
																									question.optionPoints
																								),
																								10
																							) ? null : (
																								<>
																									<p>
																										Justify
																										your
																										grade
																										with
																										a
																										comment
																									</p>
																									<div className=" w-full">
																										<Form.Item
																											// name="input"
																											className="-mb-4 font-futura"
																											name={`matrix-comment-${question.questionId}`}
																											rules={[
																												{
																													required: true,
																													message:
																														(
																															<span className="text-red-500 text-base font-futura">
																																Please
																																input
																																your
																																comment!
																															</span>
																														),
																												},
																											]}>
																											<textarea
																												className=" w-3/4 pb-16 pl-2 font-futura text-base rounded-md border-2 border-slate-200"
																												placeholder="Add your comment here..."
																												id={`matrix-comment-${question.questionId}`}
																												name={`matrix-comment-${question.questionId}`}
																												maxLength={
																													400
																												}
																												value={
																													matrixComments[
																														`${question.questionId}`
																													]
																														? matrixComments[
																																`${question.questionId}`
																														  ]
																														: ''
																												}
																												onChange={(
																													e
																												) => {
																													onMatrixChange(
																														answers
																															.formAnswer
																															.questionId
																															?.selectedOption,
																														question.questionId,
																														e
																															.target
																															.value
																													);
																												}}
																											/>
																										</Form.Item>
																									</div>
																								</>
																							)
																						) : null}
																					</Space>
																				</span>
																			</Radio.Group>
																		</Form.Item>
																		<br />
																	</div>
																)}

																{question.type ===
																	'ma' && (
																	<div>
																		<br />
																		<Space className="px-10 text-justify">
																			<span className="text-base font-extrabold font-futura">
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
																		</Space>
																		<br />
																		<span className="text-base font-futura">
																			<Form.Item
																				className="-mb-4"
																				name={`ma-${question.questionId}`}
																				rules={[
																					{
																						required: true,
																						message:
																							(
																								<span className="text-red-500 text-base pl-10 font-futura">
																									Please
																									select
																									at
																									least
																									one
																									option!
																								</span>
																							),
																					},
																				]}>
																				<Space
																					direction="vertical"
																					className=" pl-10 w-full mt-5">
																					{question.options.map(
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
																										onChange={(
																											e
																										) => {
																											onMaChange(
																												e,
																												question.questionId,
																												sectionIndex
																											);
																										}}>
																										{' '}
																										{
																											<span className="text-base font-futura">
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
																			</Form.Item>
																		</span>
																		<br />
																	</div>
																)}
																{question.type ===
																	'shortAnswer' && (
																	<div>
																		<br />
																		<Space className="px-10 text-justify">
																			<span className="text-base font-extrabold font-futura">
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
																		</Space>
																		<div className="w-full">
																			<Form.Item
																				name={`input-${question.questionId}`}
																				className="font-futura -mb-4"
																				rules={[
																					{
																						required: true,
																						message:
																							(
																								<span className="text-red-500 text-base pl-10 font-futura">
																									Please
																									input
																									your
																									answer!
																								</span>
																							),
																					},
																				]}>
																				<textarea
																					className="w-3/4 pb-16 ml-10 pl-2 font-futura text-base mt-6 rounded-md border-2 border-slate-200"
																					placeholder="Add your answer here..."
																					maxLength={
																						1000
																					}
																					onChange={(
																						e
																					) =>
																						onShortAnswerChange(
																							e
																								.target
																								.value,
																							question.questionId
																						)
																					}
																				/>
																			</Form.Item>
																		</div>
																		<br />
																	</div>
																)}
															</>
														);
													}
												)}
												<br />
												<br />
											</>
										);
									}
								)}
								<div className=" justify-items-center text-center">
									<Form.Item>
										<Button
											type="defalt"
											htmlType="submit"
											// onClick={() => {
											// 	maValidation = checkMaValidation();
											// }}
											// disabled={!maValidation}
											className="bg-green-500 hover:bg-green-400 hover:border-transparent font-futura text-lg h-auto align-middle mt-10">
											<span className="text-white hover:text-white">
												Submit Evaluation
											</span>
										</Button>
									</Form.Item>
								</div>
							</div>
						</Form>
					</div>
				)}
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

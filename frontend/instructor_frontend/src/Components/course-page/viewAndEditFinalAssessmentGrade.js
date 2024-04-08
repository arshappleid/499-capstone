// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import NavigationBar from '../navigationbar';
import axios from 'axios';
import { Button, Layout, Modal, Space, Input, Form, Tooltip } from 'antd';
import AppFooter from '../appfooter';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

const { Header, Footer, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function ViewAndEditFinalAssessmentGrade() {
	const [form] = Form.useForm();
	const [loading, isLoading] = useState(true);

	const [evaluateeFirstName, setEvaluateeFirstName] = useState('');
	const [evaluateeLastName, setEvaluateeLastName] = useState('');
	const courseName = useSelector((state) => state.courseName);
	const instructorId = useSelector((state) => state.instructorId);
	const courseId = useSelector((state) => state.courseId);
	const assignmentId = useSelector((state) => state.assignmentId);
	const assignmentName = useSelector((state) => state.assignmentName);

	const assignmentEvaluateeId = useSelector(
		(state) => state.assignmentEvaluateeId
	);
	const [gradeData, setGradeData] = useState({});

	const [editing, setEditing] = useState(false);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalTitle, setModalTitle] = useState('');

	const [isModalVisible2, setIsModalVisible2] = useState(false);
	const [modalContent2, setModalContent2] = useState('');
	const [modalTitle2, setModalTitle2] = useState('');

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

	useEffect(() => {
		const fetchStudentProfile = async () => {
			try {
				isLoading(true);
				const requestData = {
					studentID: assignmentEvaluateeId,
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

	const handleEdit = () => {
		if (
			gradeData &&
			gradeData.numOfEvalations === gradeData.numOfEvaluators
		) {
			setEditing(true);
		} else {
			setModalTitle('Error!');
			setModalContent(
				'You cannot edit the grade until all assessments are completed.'
			);
			setIsModalVisible(true);
			setTimeout(() => {
				setIsModalVisible(false);
			}, 2500);
		}
		// setEditing(true);
	};

	const editGradeHandler = async () => {
		try {
			isLoading(true);
			const requestData = {
				instructor_id: instructorId,
				assignment_id: assignmentId,
				evaluatee_id: assignmentEvaluateeId,
				new_grade: editedGrades,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/editassignmentgrade',
				requestData,
				{
					headers: headers,
				}
			);
			if (response.data.status === 'success') {
				fetchGrades();
				setModalTitle('Success!');
				setModalContent('Grade successfully updated.');
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					setIsModalVisible2(false);
				}, 2000);
				setEditing(false);
			} else {
				setEditedGrades(gradeData.formGrade.toFixed(2));
				setModalTitle('Error!');
				setModalContent('Grade could not be updated.');
				setIsModalVisible(true);
				setTimeout(() => {
					setIsModalVisible(false);
					setIsModalVisible2(false);
				}, 2000);
				setEditing(false);
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

	const handleSave = () => {
		// setEditing(false);
		setModalContent2(
			'Are you sure you want to edit the Final grade, this will override the original final grade and cannot be undone.'
		);
		setModalTitle2('Confirm Edit');
		setIsModalVisible2(true);

		// editGradeHandler();
	};

	const handleChange = (event) => {
		setEditedGrades(event.target.value);
	};

	const fetchGrades = async () => {
		try {
			isLoading(true);
			const requestData = {
				instructor_id: instructorId,
				course_id: courseId,
				assignment_id: assignmentId,
				evaluatee_id: assignmentEvaluateeId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'instructor/getassessmentoverallgrade',
				requestData,
				{
					headers: headers,
				}
			);

			if (response.data.status === 'success') {
				const allGrades = () => {
					return {
						overall_total_grade_in_percentage:
							response.data.overall_total_grade_in_percentage,
						overall_total_score: response.data.overall_total_score,
						overall_max_score: response.data.overall_max_score,

						numOfEvaluators:
							response.data.total_evaluator_num_in_group,
						numOfEvalations: response.data.evaluator_data.length,
						instructor_edited_grade:
							response.data.edited_grade?.GRADE,
						criteriaGrades: response.data.criteria_grades.map(
							(section) => {
								return {
									criteriaDescription:
										section.criteria_description,
									criteriaGradesInPercentage:
										section.criteria_grades_in_percentage,

									criteriaMaxScore:
										section.criteria_max_score,
									criteriaTotalScore:
										section.criteria_total_score,
								};
							}
						),
						evaluatorData: response.data.evaluator_data?.map(
							(evaluator) => {
								return {
									evaluatorId: evaluator.evaluator_id,
									individualGrade: evaluator.individual_grade,
								};
							}
						),
					};
				};
				setGradeData(allGrades);
			} else {
				setGradeData([]);
			}
			isLoading(false);
		} catch (error) {
			isLoading(false);
			setGradeData([]);
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
		fetchGrades();
		return;
	}, []);
	const [editedGrades, setEditedGrades] = useState(
		gradeData.overall_total_grade_in_percentage
	);

	useEffect(() => {
		setEditedGrades(
			gradeData?.instructor_edited_grade
				? gradeData?.instructor_edited_grade?.toFixed(2)
				: gradeData?.overall_total_grade_in_percentage?.toFixed(2)
		);
	}, [gradeData]);

	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>

			<Content className="flex flex-col flex-grow bg-white">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex p-2 items-center bg-[#DDEEFF]">
						<h1 className="ml-8 text-2xl text-ellipsis">
							{courseName}: {assignmentName} Final Grade
						</h1>
					</div>
				</div>
				<div className="font-futura justify-items-center text-center pt-10 pb-10 items-center">
					<h1 className=" text-2xl fonot-extrabold text-center">
						{evaluateeFirstName} {evaluateeLastName} Final Grade{' '}
						<br /> {assignmentName}
					</h1>
				</div>

				<div className="flex  justify-center items-start min-h-screen">
					<div className="bg-slate-200 p-2 mx-40 text-center w-full h-auto rounded-lg  drop-shadow-2xl shadow-slate-300">
						{/* <div className="bg-slate-200 p-2 mx-2 sm:mx-4 md:mx-10 lg:mx-20 text-center w-full rounded-lg"> */}
						{loading && (
							<div className="py-10">
								<h3 className="w-full font-futura text-lg text-center">
									<p className="font-futura flex items-center justify-center">
										<LoadingOutlined spin />
									</p>
									<br /> Loading Final Grades...
								</h3>
							</div>
						)}
						{!loading && gradeData.numOfEvalations === 0 ? (
							<p className="text-lg font-futura py-20">
								None of the students have performed an
								assessment yet.{' '}
								<span>
									<br />
								</span>
								No grades to show.
							</p>
						) : loading ? null : (
							<>
								<Form
									name="login_instructor"
									onFinish={handleSave}
									// onFinishFailed={onFinishFailed}
									// autoComplete="off"
									layout="vertical"
									className="w-full"
									form={form}>
									<div className="flex flex-col  bg-slate-200 justify-center items-center p-2 mb-4 rounded-md  mt-10 ">
										<div className="p-2 px-16 h-auto bg-slate-100 rounded-md drop-shadow-2xl shadow-slate-600">
											<p className="text-lg font-futura font-extrabold items-start pb-4 break-words">
												Final Grade*
											</p>

											{editing ? (
												<Form.Item
													name="final_grade"
													className="font-futura"
													rules={[
														{
															required: true,
															pattern:
																/^(100(\.\d+)?|\d{1,2}(\.\d+)?)$/,
															message: (
																<span className="font-futura text-base flex items-center justify-center">
																	Please input
																	a valid
																	grade!
																	<Tooltip
																		title={
																			<span className="font-futura text-base">
																				Grade
																				must
																				be
																				a
																				number
																				between
																				0
																				and
																				100
																			</span>
																		}>
																		<InfoCircleOutlined className="ml-2" />
																	</Tooltip>
																</span>
															),
														},
													]}>
													<Input
														id="final_grade"
														placeholder="Enter New Final Grade"
														allowClear={true}
														value={editedGrades}
														onChange={(event) =>
															handleChange(event)
														}
														className="text-base font-futura border-2 border-slate-400 text-center rounded-md p-2"
													/>
												</Form.Item>
											) : (
												<p className="font-futura text-base  text-center">
													{gradeData.instructor_edited_grade ===
														null ||
													gradeData.instructor_edited_grade ===
														undefined ? (
														<span>
															{editedGrades}%
														</span>
													) : (
														<span>
															Edited Final Grade:{' '}
															{gradeData?.instructor_edited_grade?.toFixed(
																2
															)}
															%
															<br />
															Original Final
															Grade:{' '}
															{gradeData?.overall_total_grade_in_percentage?.toFixed(
																2
															)}
															%
														</span>
													)}
												</p>
											)}
										</div>
										<p className="font-futura text-base mt-6">
											*The grades shown here have been
											calculated using{' '}
											{gradeData.numOfEvalations} out of a
											total of {gradeData.numOfEvaluators}{' '}
											assessments.
										</p>
									</div>

									<Space className="w-auto h-auto font-futura text-base">
										<Box
											sx={{ marginTop: 5 }}
											className="bg-white mt-4 p-4 w-full rounded-lg">
											<p className="font-futura text-lg pb-6 pt-2  font-extrabold ">
												Section Grades
											</p>
											<Table
												aria-label="grades"
												className="bg-white">
												<TableHead>
													<TableRow>
														<TableCell className=" font-futura bg-slate-300 rounded-tl-lg">
															<span className="font-futura  text-base font-semibold ">
																Section Name
															</span>
														</TableCell>
														<TableCell className=" font-futura bg-slate-300 rounded-tr-lg">
															<span className="font-futura  text-base font-semibold ">
																Section Grade
															</span>
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{gradeData.criteriaGrades?.map(
														(section, index) => (
															<TableRow>
																<TableCell className=" font-futura bg-slate-200">
																	<span className="font-futura  text-base font-semibold ">
																		{
																			section.criteriaDescription
																		}
																	</span>
																</TableCell>
																<TableCell className=" font-futura text-base bg-slate-200">
																	<span className=" text-center text-base font-futura">
																		{
																			section.criteriaTotalScore
																		}{' '}
																		/{' '}
																		{
																			section.criteriaMaxScore
																		}{' '}
																		{'( '}
																		{section.criteriaGradesInPercentage.toFixed(
																			2
																		)}
																		%{') '}
																	</span>
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										</Box>
									</Space>
									<div className="mt-10 mb-10">
										{editing ? (
											<Form.Item>
												<Button
													type="default"
													htmlType="submit"
													className="bg-green-500 hover:bg-green-400 h-auto font-futura text-lg align-middle">
													<span className="text-white hover:text-white">
														Save and Submit
													</span>
												</Button>
											</Form.Item>
										) : (
											<>
												<Button
													type="default"
													onClick={() => handleEdit()}
													disabled={
														gradeData.numOfEvalations !==
														gradeData.numOfEvaluators
													}
													className="bg-blue-500  h-auto font-futura text-base align-middle disabled:bg-slate-400">
													<span className="text-white hover:text-white">
														Edit Final Grade{' '}
														{gradeData.numOfEvalations !==
															gradeData.numOfEvaluators && (
															<span>**</span>
														)}
													</span>
												</Button>
												{gradeData.numOfEvalations !==
													gradeData.numOfEvaluators && (
													<p className="text-base font-futura mt-2">
														**You cannot edit the
														grade until all
														assessments are
														completed.
													</p>
												)}
											</>
										)}
									</div>
								</Form>
							</>
						)}
					</div>
				</div>

				<div className="flex-grow" />
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
				<Modal
					open={isModalVisible2}
					title={
						<span className="text-center font-futura text-2xl">
							{modalTitle2}
						</span>
					}
					className="text-center font-futura text-2xl"
					onCancel={() => setIsModalVisible2(false)}
					footer={[
						<div className="flex justify-center" key="buttons">
							<Button
								key="close"
								className="bg-blue-500 hover:bg-blue-400 h-auto text-white hover:text-white"
								onClick={() => {
									setIsModalVisible2(false);
									setEditing(false);
								}}>
								<span className="text-white hover:text-hover text-base font-futura">
									Cancel
								</span>
							</Button>
							<Button
								key="ok"
								className="bg-green-500 h-auto hover:bg-green-400"
								onClick={() => {
									editGradeHandler();
								}}>
								<span className="text-white hover:text-white text-base font-futura">
									Confirm
								</span>
							</Button>
						</div>,
					]}>
					<p className=" font-futura text-xl">{modalContent2}</p>
				</Modal>
				<NetworkErrorModal />
			</Content>

			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

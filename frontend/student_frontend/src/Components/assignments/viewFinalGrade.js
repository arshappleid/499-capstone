// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise).

import axios from 'axios';
import { Button, Layout, Modal, Space } from 'antd';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { LoadingOutlined } from '@ant-design/icons';

const { Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function ViewFinalGrade() {
	const [loading, isLoading] = useState(true);
	const assignmentName = useSelector((state) => state.assignmentName);
	const assignmentId = useSelector((state) => state.assignmentId);
	const courseId = useSelector((state) => state.courseId);
	const studentId = useSelector((state) => state.studentId);
	const [gradeData, setGradeData] = useState({});

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
	const fetchGrades = async () => {
		try {
			isLoading(true);
			const requestData = {
				evaluatee_id: studentId,
				course_id: courseId,
				assignment_id: assignmentId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getassessmentoverallgrade',
				requestData,
				{
					headers: headers,
				}
			);
			if (response.data.status === 'success') {
				const allGrades = () => {
					return {
						totalGrade:
							response.data.overall_total_grade_in_percentage,
						overallTotalScore: response.data.overall_total_score,
						overallMaxScore: response.data.overall_max_score,
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
						evaluatorData: response.data.evaluator_data.map(
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
	const [editedGrades, setEditedGrades] = useState(gradeData.totalGrade);
	useEffect(() => {
		setEditedGrades(
			gradeData?.instructor_edited_grade
				? gradeData?.instructor_edited_grade?.toFixed(2)
				: gradeData?.totalGrade?.toFixed(2)
		);
	}, [gradeData]);
	return (
		<Content className="flex flex-col flex-grow bg-white">
			<div className="font-futura justify-items-center text-center pt-10 pb-10 items-center">
				<h1 className=" text-2xl fonot-extrabold text-center">
					Grades for <br /> {assignmentName}
				</h1>
			</div>

			<div className="flex justify-center items-start min-h-screen">
				<div className="bg-slate-200 p-2 mx-40 text-center w-full h-auto rounded-lg  drop-shadow-2xl shadow-slate-300">
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
					{!loading && gradeData.criteriaGrades.length === 0 ? (
						<p className="text-lg font-futura py-20">
							No student has performed an assessment for your
							assignmet yet.{' '}
							<span>
								<br />
							</span>
							No grades to show.
						</p>
					) : loading ? null : (
						<>
							<div className="flex flex-col  bg-slate-200 justify-center items-center p-2 mb-4 rounded-md  mt-10">
								<div className="p-2 px-16 h-auto bg-slate-100 rounded-md drop-shadow-2xl shadow-slate-600">
									<p className="text-lg font-futura font-extrabold items-start pb-4 break-words">
										Final Grade*
									</p>
									<p className="font-futura text-base  text-center">
										{gradeData.instructor_edited_grade ===
											null ||
										gradeData.instructor_edited_grade ===
											undefined ? (
											<span>
												{gradeData?.totalGrade?.toFixed(
													2
												)}
												%
											</span>
										) : (
											<span>
												Edited Final Grade:{' '}
												{gradeData?.instructor_edited_grade?.toFixed(
													2
												)}
												%
												<br />
												Original Final Grade:{' '}
												{gradeData?.totalGrade?.toFixed(
													2
												)}
												%
											</span>
										)}
									</p>
								</div>
							</div>
							<p className="font-futura text-base">
								*The grades shown here have been calculated
								using {gradeData.numOfEvalations} out of a total
								of {gradeData.numOfEvaluators} assignment
								assessments.
							</p>
							<Space className="w-auto h-auto font-futura text-base mb-10 ">
								<Box
									sx={{ marginTop: 5 }}
									className="bg-white mt-4 p-4 w-full rounded-lg">
									<p className="font-futura text-lg pb-6 pt-2  font-extrabold ">
										Assessment Grades
									</p>
									<Table
										aria-label="grades"
										className="bg-white">
										<TableHead>
											<TableRow>
												<TableCell className=" font-futura bg-slate-300 rounded-tl-lg">
													<span className="font-futura  text-base font-semibold ">
														Criteria Name
													</span>
												</TableCell>
												<TableCell className=" font-futura bg-slate-300 rounded-tr-lg">
													<span className="font-futura  text-base font-semibold ">
														Criteria Grade
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
																{section.criteriaGradesInPercentage.toFixed(
																	2
																)}
																%
															</span>
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</Box>
							</Space>
						</>
					)}
				</div>
			</div>

			<div className="flex-grow" />
			<NetworkErrorModal />
		</Content>
	);
}

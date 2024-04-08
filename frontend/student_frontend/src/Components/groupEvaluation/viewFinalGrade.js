// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

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

	const formId = useSelector((state) => state.formId);
	const formName = useSelector((state) => state.formName);
	const studentId = useSelector((state) => state.studentId);

	const [gradeData, setGradeData] = useState({
		formGrade: 0,
		sectionAverage: [],
		evaluatorData: [],
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
				student_id: studentId,
				form_id: formId,
			};
			const headers = {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('Authorization'),
			};
			const response = await axios.post(
				BACKEND_URL + 'student/getoverallgrade',
				requestData,
				{
					headers: headers,
				}
			);
			if (response.data.status === 'success') {
				const allGrades = () => {
					return {
						formGrade: response.data.data.form_grade,
						numOfEvaluators:
							response.data.data.number_of_evaluators,
						numOfEvalations:
							response.data.data.evaluator_data.length,
						instructor_edited_grade:
							response.data.data.edited_grade,
						sectionAverage: response.data.data.section_averages.map(
							(section) => {
								return {
									sectionName: section.section_name,
									sectionWeightage: section.section_weightage,
									sectionGradeInPercentage:
										section.section_grade_in_percentage,
									sectionMaxScore: section.section_max_score,
									sectionTotalScore:
										section.section_total_score,
								};
							}
						),
						evaluatorData: response.data.data.evaluator_data.map(
							(evaluator) => {
								return {
									evaluatorId: evaluator.evaluator_id,
									individualGrade:
										evaluator.individual_form_grade,
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
	const [editedGrades, setEditedGrades] = useState(gradeData.formGrade);

	useEffect(() => {
		setEditedGrades(
			gradeData?.instructor_edited_grade
				? gradeData?.instructor_edited_grade?.toFixed(2)
				: gradeData?.formGrade?.toFixed(2)
		);
	}, [gradeData]);

	return (
		<Content className="flex flex-col flex-grow bg-white">
			<div className="font-futura justify-items-center text-center pt-10 pb-10 items-center">
				<h1 className=" text-2xl fonot-extrabold text-center">
					Grades for <br /> {formName}
				</h1>
			</div>

			<div className="flex justify-center items-start min-h-screen">
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
					{!loading && gradeData.length === 0 ? (
						<p className="text-lg font-futura py-20">
							None of the students in your Group have performed an
							evalaution yet.{' '}
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
										{gradeData.instructor_edited_grade !==
										null ? (
											<span>
												Edited Final Grade:{' '}
												{gradeData?.instructor_edited_grade?.toFixed(
													2
												)}
												%
												<br />
												Original Final Grade:{' '}
												{gradeData?.formGrade?.toFixed(
													2
												)}
												%
											</span>
										) : (
											// <span>{editedGrades}</span>
											<span>
												{gradeData?.formGrade?.toFixed(
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
								of {gradeData.numOfEvaluators} evaluations.
							</p>
							<Space className="w-auto h-auto font-futura text-base mb-10 ">
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
											{gradeData.sectionAverage?.map(
												(section, index) => (
													<TableRow>
														<TableCell className=" font-futura bg-slate-200">
															<span className="font-futura  text-base font-semibold ">
																{
																	section.sectionName
																}
															</span>
														</TableCell>
														<TableCell className=" font-futura text-base bg-slate-200">
															<span className=" text-center text-base font-futura">
																{(
																	section.sectionGradeInPercentage *
																	100
																).toFixed(2)}
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

// Author: Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import { Layout, Modal, Button, Breadcrumb } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	TableSortLabel,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { updateEvaluatorId, updateEvaluateeId } from '../store/appReducer';

const { Header, Content, Footer } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;
export function GroupMembersList() {
	const [loading, isLoading] = useState(true);
	const dispatch = useDispatch();
	const courseName = useSelector((state) => state.courseName);
	const student_id = useSelector((state) => state.studentId);
	const course_id = useSelector((state) => state.courseId);
	const form_id = useSelector((state) => state.formId);
	const form_name = useSelector((state) => state.formName);
	const [evaluationForm, setEvaluationForm] = useState([]);

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

	const fetchEvaluationForm = async () => {
		try {
			isLoading(true);
			const requestData = {
				evaluator_id: student_id,
				course_id: course_id,
				form_id: form_id,
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

			if (status === 'success') {
				const allEvaluationRecords =
					response.data.evaluation_records.map((evaluation) => {
						if (evaluation.student_middlename === null)
							evaluation.student_middlename = '';
						if (evaluation.student_lastname === null)
							evaluation.student_lastname = '';
						return {
							studentId: evaluation.student_id,
							studentName:
								evaluation.student_firstname +
								' ' +
								evaluation.student_middlename +
								' ' +
								evaluation.student_lastname,
							studentStatus: evaluation.completion_status,
						};
					});

				setEvaluationForm(allEvaluationRecords);
			} else {
				setEvaluationForm();
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
		fetchEvaluationForm();
		return;
	}, []);

	const evaluateeClickHandler = (evaluateeId) => {
		dispatch(updateEvaluatorId(student_id));
		dispatch(updateEvaluateeId(evaluateeId));
	};

	return (
		<Layout className="flex flex-col font-futura min-h-screen bg-white">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura mb-20 ">
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
								<p className="text-black">
									Evaluation: {form_name}
								</p>
							),
						},
					]}
				/>
				<div className="flex flex-col font-futura items-left w-full text-xl pl-10 mt-10">
					<h2>Select a student to evaluate for {form_name}</h2>
				</div>
				{loading && (
					<h3 className="w-full font-futura text-lg text-center">
						<p className="font-futura flex items-center justify-center">
							<LoadingOutlined spin />
						</p>
						<br /> Loading Evaluation Group Members Information...
					</h3>
				)}
				{!loading && (
					<div className="flex justify-center w-full">
						<div className="w-2/5 pt-10">
							<TableContainer
								component={Paper}
								className="font-futura rounded-lg border-2 border-slate-200">
								<Table className="table-responsive">
									<TableHead className="bg-slate-200">
										<TableRow>
											<TableCell
												align="center"
												className="mr-10 bg-slate-200">
												<span className="font-futura font-extrabold text-base">
													Evaluatee Name
												</span>
											</TableCell>
											<TableCell
												align="center"
												className="bg-slate-200">
												<span className="font-futura font-extrabold text-base">
													Evaluation Status
												</span>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{!evaluationForm ? (
											<TableRow className="bg-white">
												<TableCell
													colSpan={4}
													align="center">
													<span className="font-futura text-base">
														There are no students in
														your group
													</span>
												</TableCell>
											</TableRow>
										) : (
											evaluationForm.map((evaluation) => {
												return (
													<TableRow
														className="bg-white"
														key={
															evaluation.studentId
														}>
														{!evaluation.studentStatus ? (
															<TableCell align="center">
																<Link to="/submitevaluationpage">
																	<Button
																		type="link"
																		onClick={() =>
																			evaluateeClickHandler(
																				evaluation.studentId
																			)
																		}>
																		<span className="text-base font-futura">
																			{
																				evaluation.studentName
																			}
																		</span>
																	</Button>
																</Link>
															</TableCell>
														) : (
															<TableCell align="center">
																<span className="text-base font-futura">
																	{
																		evaluation.studentName
																	}
																</span>
															</TableCell>
														)}
														{evaluation.studentStatus ? (
															<TableCell align="center">
																<span className="text-base font-futura text-green-400">
																	Complete
																</span>
															</TableCell>
														) : (
															<TableCell align="center">
																<span className="text-base font-futura text-red-400">
																	Incomplete
																</span>
															</TableCell>
														)}
													</TableRow>
												);
											})
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					</div>
				)}
				<NetworkErrorModal />
			</Content>

			<Footer className="p-0">
				<AppFooter />
			</Footer>
		</Layout>
	);
}

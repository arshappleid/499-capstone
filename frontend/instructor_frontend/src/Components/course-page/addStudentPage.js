// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { Button, Card, Space, Layout, Breadcrumb, Modal, Upload } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios, { formToJSON } from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AddStudentPage() {
	const navigate = useNavigate();
	const [fileData, setFileData] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');

	const [modalVisible1, setModalVisible1] = useState(false);

	const [csvData, setCsvData] = useState([]);
	const [fileName, setFileName] = useState('');
	const [exportFileContent, setExportFileContent] = useState('');

	const courseName = useSelector((state) => state.courseName);
	const courseId = useSelector((state) => state.courseId);
	const instructorId = useSelector((state) => state.instructorId);

	const handleExportCsv = () => {
		const exportContent = generateCsvContent(responseModalContent);
		setExportFileContent(exportContent);
	};
	const generateCsvContent = (data) => {
		let csvContent = '';
		csvContent += 'Student ID, Status\n';
		data.forEach((student) => {
			const studentId = student.student_id;
			const studentAddStatus = student.message;
			csvContent += `${studentId}, ${studentAddStatus}\n`;
		});

		return csvContent;
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFileName(file.name);
			const reader = new FileReader();
			reader.onload = (e) => {
				const fileContent = e.target.result;
				Papa.parse(fileContent, {
					complete: (result) => {
						setCsvData(result.data);
						const studentIds = result.data.map(
							(row) => Object.values(row)[0]
						);

						const formattedStudentIds = studentIds
							.map((id, index) => `${index + 1}) ${id}`)
							.join('<br />');

						setModalContent(
							<div>
								<h3>Student IDs:</h3>
								<p
									dangerouslySetInnerHTML={{
										__html: formattedStudentIds,
									}}
								/>
							</div>
						);
						setModalVisible(true);
						setFileData(fileContent);
					},
					header: true,
					skipEmptyLines: true,
				});
			};
			reader.readAsText(file);
		}
	};

	const [errorModalVisible, setErrorModalVisible] = useState(false);

	const studentIds = csvData.map((student) => student['Student Id']);

	const [responseModalVisible, setResponseModalVisible] = useState(false);
	const [responseModalContent, setResponseModalContent] = useState([]);
	const [responseModalData, setResponseModalData] = useState({});

	const [networkErrorModalVisible, setNetworkErrorModalVisible] =
		useState(false);
	const [networkErrorMessage, setNetworkErrorMessage] = useState('');

	const handleNetworkErrorModalClose = () => {
		setNetworkErrorModalVisible(false);
		setNetworkErrorMessage('');
	};

	const ResponseModal = () => {
		const isError = responseModalContent.length === 0;
		return (
			<Modal
				open={responseModalVisible}
				onCancel={handleResponseModalClose}
				className=" overflow-scroll text-center"
				style={{ width: '125%', height: '75%' }}
				title={
					isError ? (
						<span className="text-center font-futura text-2xl">
							Error
						</span>
					) : (
						<span className="text-center font-futura text-2xl">
							Add Student Status
						</span>
					)
				}
				footer={
					isError
						? [
								<Button
									key="close"
									className="bg-red-600 hover:bg-red-500 text-white border border-transparent hover:border-white hover:border-1"
									onClick={handleResponseModalClose}>
									<span className="text-center font-futura text-white text-base">
										Ok
									</span>
								</Button>,
						  ]
						: null
				}>
				{isError ? (
					<p>{responseModalData}</p>
				) : (
					<>
						{responseModalContent.some(
							(item) => item.message !== 'Student add success'
						) && (
							<>
								<div className="bg-slate-200 rounded-lg p-2">
									<p className="text-red-500 font-futura">
										Student does not exist:{' '}
										<span className="text-black">
											Student has not signed up in the
											platform. Please ask the student to
											sign up and try again.
										</span>
									</p>
									<p className="text-red-500 font-futura">
										Student already enrolled in course:{' '}
										<span className="text-black">
											Student has already been enrolled in
											the course.
										</span>
									</p>
								</div>
								<br />
								<br />
							</>
						)}
						{responseModalContent.map((item, index) => (
							<div key={index} className="flex font-futura">
								<p className="mr-2 font-bold">Student Id:</p>
								<p>{item.student_id},&nbsp;</p>
								<p className="mr-2 font-bold">&nbsp;Status: </p>
								<p
									className={
										item.message === 'Student add success'
											? 'text-green-500'
											: 'text-red-500'
									}>
									{item.message}
								</p>
							</div>
						))}
						<div className="flex justify-center mt-6">
							<Button onClick={() => handleExportCsv()}>
								<span className="text-sm font-futura">
									Export as CSV
								</span>
							</Button>
							{exportFileContent && (
								<a
									href={`data:text/csv;charset=utf-8,${encodeURIComponent(
										exportFileContent
									)}`}
									download="student_add_to_course_status.csv"
									ref={(link) => {
										if (link) {
											link.click();
										}
									}}
									style={{ display: 'none' }}>
									Download
								</a>
							)}
						</div>
					</>
				)}
			</Modal>
		);
	};

	const handleDataSubmit = async () => {
		if (fileData) {
			const students = [];
			for (var i = 0; i < studentIds.length; i++) {
				students.push({ student_id: studentIds[i] });
			}
			try {
				const requestData = {
					course_id: courseId,
					instructor_id: instructorId,
					students: students,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/addstudenttocourse',
					requestData,
					{ headers: headers }
				);
				const status = response['data']['status'];
				const message = response['data']['message'];

				if (status === 'success') {
					setResponseModalContent(response.data.data);
					setResponseModalVisible(true);
					removeFile();
					setExportFileContent('');
				} else {
					setResponseModalContent([]);
					setResponseModalData(message);
					setResponseModalVisible(true);
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
		} else {
			setErrorModalVisible(true);
		}
	};
	const handleResponseModalClose = () => {
		setResponseModalVisible(false);
		setModalVisible1(true);
		setTimeout(() => {
			setResponseModalContent([]);
			setModalVisible1(false);
			navigate('/coursesetting');
		}, 2000);
	};

	const handleErrorModalClose = () => {
		setErrorModalVisible(false);
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

	const removeFile = () => {
		setFileData(null);
		setFileName('');
		setModalContent('');

		if (hiddenFileInput.current) {
			hiddenFileInput.current.value = null;
		}
	};

	const hiddenFileInput = React.useRef(null);
	const handleClick = (event) => {
		hiddenFileInput.current.click();
	};
	const downloadSampleCsv = () => {
		const csvContent =
			'Student Id\nstudentID1\nstudentID2\nstudentID3\nstudentID4\nstudentID5';
		const blob = new Blob([csvContent], {
			type: 'text/csv;charset=utf-8;',
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'sample.csv');
		link.click();
	};

	return (
		<Layout className="flex flex-col font-futura min-h-screen">
			<Header className="flex w-full bg-customBlue">
				<NavigationBar />
			</Header>
			<Content className="flex flex-col flex-grow font-futura pb-10">
				<div className="bg-[#F4F4F4] h-20 font-futura">
					<div className="w-full h-full m-auto flex justify-between p-2 items-center bg-[#DDEEFF] overflow-auto">
						<h1 className="ml-8 text-2xl text-ellipsis">
							Enroll students to course: {courseName}
						</h1>
					</div>
				</div>
				<Breadcrumb
					className=" pl-10 mt-4 text-lg font-futura "
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
							title: <a href="/coursesetting">Course Tools</a>,
						},
						{
							title: (
								<p className="text-black">Enroll Students</p>
							),
						},
					]}
				/>
				<div className="flex flex-col items-center justify-center w-full mt-10 mb-10">
					<div className="w-[60%] bg-[#F9F9F9] rounded-lg drop-shadow-2xl text-center mt-6">
						<p className="text-2xl font-bold text-center mt-8 mb-8">
							Enroll Students
						</p>
						<p className="text-xl">
							Please use the sample CSV template to add students
							to the course
						</p>
						<div className="flex-col mt-6">
							<a
								className="text-lg text-blue-400 hover:text-blue-500 underline cursor-pointer "
								onClick={downloadSampleCsv}>
								Download Sample CSV
							</a>
						</div>
						<div className="mt-6">
							<p className="text-lg mb-4">
								Upload your csv file containing the student data
								using this upload button
							</p>
							<Button className="h-auto" onClick={handleClick}>
								<span className="text-base font-futura">
									Upload file
								</span>
							</Button>
							<input
								ref={hiddenFileInput}
								type="file"
								accept=".csv"
								onChange={handleFileUpload}
								className="p-4 hidden"
							/>
							{fileName && (
								<div className="flex justify-center items-center mt-2">
									<p className="text-base text-green-500">
										{fileName}
									</p>
									<CloseCircleOutlined
										className="text-red-500 ml-2 cursor-pointer"
										onClick={removeFile}
									/>
								</div>
							)}
						</div>
						<div className="flex-col">
							<Button
								className=" h-auto bg-blue-500 hover:bg-blue-400 border border-transparent hover:border-white hover:border-1 p-1 pl-8 pr-8 rounded-lg text-white font-futura text-base mt-8 mb-8"
								type="primary"
								onClick={() => setModalVisible(true)}>
								View File Preview
							</Button>
						</div>
						<Button
							className={`${
								!fileData
									? 'h-auto bg-gray-400 cursor-not-allowed'
									: 'h-auto bg-green-500 hover:bg-green-400'
							} border border-transparent hover:border-white hover:border-1 p-1 pl-8 pr-8 rounded-lg disabled:bg-slate-400 text-white font-futura text-lg mb-8`}
							type="default"
							onClick={handleDataSubmit}
							disabled={!fileData}>
							<span className="text-base font-futura text-white hover:text-white">
								Submit
							</span>
						</Button>
					</div>
				</div>
				<div className="flex-grow" />
			</Content>
			<Footer className="p-0">
				<AppFooter />
			</Footer>

			<Modal
				open={modalVisible}
				onCancel={handleModalClose}
				onOk={handleModalClose}
				title={
					<span className="text-center font-futura text-xl">
						File Preview
					</span>
				}
				className=" overflow-scroll font-futura text-xl"
				width={250}
				height={600}
				footer={[
					<div className=" flex justify-center">
						<Button
							type="default"
							className="h-auto bg-blue-500 hover:bg-blue-400 border border-transparent hover:border-white hover:border-1 rounded-lg text-white font-futura text-sm"
							key="close"
							onClick={handleModalClose}>
							<span className="text-sm text-white hover:text-white">
								Close
							</span>
						</Button>
					</div>,
				]}>
				<p>{modalContent}</p>
			</Modal>
			<Modal
				open={errorModalVisible}
				className="text-center font-futura text-xl overflow-y-auto"
				onCancel={handleErrorModalClose}
				onOk={handleErrorModalClose}
				title={
					<span className="text-center font-futura text-2xl">
						Error
					</span>
				}
				footer={[
					<Button
						key="close"
						className="bg-red-600 hover:bg-red-500 text-white border border-transparent hover:border-white hover:border-1"
						onClick={handleErrorModalClose}>
						<span className="text-center font-futura text-white text-base">
							Ok
						</span>
					</Button>,
				]}>
				<p className="font-futura text-xl">
					No File/Empty File has been uploaded!
				</p>
			</Modal>
			<Modal
				open={modalVisible1}
				className="text-center font-futura text-xl overflow-y-auto"
				onCancel={() => setModalVisible1(false)}
				footer={null}
				title={
					<span className="text-center font-futura text-xl">
						Redirecting to Course Tools
					</span>
				}>
				<p className="font-futura text-xl invisible">
					Student successfully enrolled to course!
				</p>
			</Modal>
			<ResponseModal />
			<NetworkErrorModal />
		</Layout>
	);
}

// Author : Sehajvir Singh Pannu (All the code here is written by Sehajvir Singh Pannu unless specified otherwise)

import { Button, Layout, Breadcrumb, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

import NavigationBar from '../navigationbar';
import AppFooter from '../appfooter';
import React, { useState } from 'react';
import Papa from 'papaparse';
import axios, { formToJSON } from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;
const BACKEND_URL = process.env.REACT_APP_BACKEND_API;

export function AddGroupsPage() {
	const navigate = useNavigate();

	const [fileData, setFileData] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalVisible1, setModalVisible1] = useState(false);
	const [csvData, setCsvData] = useState({});
	const [fileName, setFileName] = useState('');
	const [exportFileContent, setExportFileContent] = useState('');

	const handleExportCsv = () => {
		const exportContent = generateCsvContent(responseModalContent);
		setExportFileContent(exportContent);
	};
	const generateCsvContent = (data) => {
		let csvContent = '';

		// Append headers
		csvContent += 'Group Name, All Students Added, Student ID, Status\n';

		// Append data rows
		data.forEach((group) => {
			const groupName = group.group_name;
			const allStudentsAdded = group.all_students_added ? 'Yes' : 'No';
			if (group.students_not_added.length === 0) {
				csvContent += `${groupName}, ${allStudentsAdded}, , \n`;
			} else {
				csvContent += `${groupName}, ${allStudentsAdded}, ${group.students_not_added[0].student_id}, ${group.students_not_added[0].status}\n`;

				for (let i = 1; i < group.students_not_added.length; i++) {
					csvContent += ` , , ${group.students_not_added[i].student_id}, ${group.students_not_added[i].status}\n`;
				}
			}
		});

		return csvContent;
	};

	const downloadCsv = () => {
		const encodedUri = encodeURIComponent(exportFileContent);
		const link = document.createElement('a');
		link.setAttribute('href', `data:text/csv;charset=utf-8,${encodedUri}`);
		link.setAttribute('download', 'groups_status.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const courseName = useSelector((state) => state.courseName);
	const courseId = useSelector((state) => state.courseId);
	const instructorId = useSelector((state) => state.instructorId);

	const handleModalClose = () => {
		setModalVisible(false);
	};
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			setFileName(file.name);
			const reader = new FileReader();
			reader.onload = (event) => {
				const fileContent = event.target.result;
				const parsedData = Papa.parse(fileContent).data;

				if (parsedData.length > 1) {
					const groupNames = parsedData[0];
					const studentData = parsedData.slice(1);

					const groupData = {};

					for (let i = 0; i < groupNames.length; i++) {
						const groupName = groupNames[i];
						const studentsInGroup = studentData.map(
							(row) => row[i]
						);
						groupData[groupName] = studentsInGroup;
					}

					setCsvData(groupData);

					const modalContent = (
						<div>
							<h2>Group Information</h2>
							{Object.keys(groupData).map((groupName, index) => (
								<div key={groupName}>
									<h3 className="font-extrabold">
										{groupName}
									</h3>
									<p>{groupData[groupName].join(', ')}</p>
									{index !==
										Object.keys(groupData).length - 1 && (
										<hr />
									)}{' '}
									{/* Add spacing between groups */}
								</div>
							))}
						</div>
					);

					setModalContent(modalContent);
					setModalVisible(true);
					setFileData(fileContent);
				} else {
					setModalContent('Empty CSV File');
					setModalVisible(true);
				}
			};
			reader.readAsText(file);
		}
	};

	// Modals for error and response
	const [errorModalVisible, setErrorModalVisible] = useState(false);
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
			<div className="w-[150%] bg-black">
				<Modal
					open={responseModalVisible}
					onCancel={handleResponseModalClose}
					className="overflow-scroll text-center"
					width={1250}
					height={600}
					title={
						isError ? (
							<span className="text-center font-futura text-2xl">
								Error
							</span>
						) : (
							<span className="text-center font-futura text-2xl">
								Student Group(s) Creation Status
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
						<p>Error retrieving Data</p>
					) : (
						<>
							{responseModalContent.some(
								(group) => !group.all_students_added
							) && (
								<>
									<div className="bg-slate-200 rounded-lg p-2">
										<p className="text-red-500 font-futura">
											Student Not Enrolled in course:{' '}
											<span className="text-black">
												Student has not been enrolled in
												the course. Please enroll the
												student in the course and try
												again.
											</span>
										</p>
										<p className="text-red-500 font-futura">
											Student Id not found, in registered
											students:{' '}
											<span className="text-black">
												Student has not signed up in the
												platform. Please ask the student
												to sign up and try again.
											</span>
										</p>
										<p className="text-red-500 font-futura">
											Student Exists in Some Other group
											for this course:{' '}
											<span className="text-black">
												Student is already in some other
												group for this course. Please
												remove the student from the
												other group and try again.
											</span>
										</p>
									</div>
									<br />
									<br />
								</>
							)}
							{responseModalContent.map((group, index) => (
								<>
									<div
										key={index}
										className="flex font-futura">
										<p className="mr-2 font-bold">
											Group Name:
										</p>
										<p>{group.group_name}</p>
										<p className="mr-2 ml-4 font-bold">
											All Students Added:
										</p>
										<p>
											{group.all_students_added
												? 'Yes'
												: 'No'}
										</p>
										<div className="ml-4">
											{group.students_not_added.map(
												(student, index) => (
													<div
														key={index}
														className="flex">
														<p className="mr-2 font-bolde">
															Student ID:
														</p>
														<p>
															{student.student_id}
															,&nbsp;
														</p>
														<p className="mr-2 font-bold">
															Status:
														</p>
														<p
															className={
																student.status ===
																'Successfully Added'
																	? 'text-green-500'
																	: 'text-red-500'
															}>
															{student.status}
														</p>
													</div>
												)
											)}
										</div>
									</div>
									<br />
									<br />
								</>
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
										download="groups_status.csv"
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
			</div>
		);
	};

	const handleDataSubmit = async () => {
		if (fileData) {
			const formattedGroupData = {
				groups: [],
			};

			for (const [group_name, student_ids] of Object.entries(csvData)) {
				const formatted_group = {
					group_name: group_name,
					student_ids: student_ids,
				};
				formattedGroupData.groups.push(formatted_group);
			}

			try {
				const requestData = {
					courseID: courseId,
					instructorId: instructorId,
					groups: formattedGroupData.groups,
				};
				const headers = {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('Authorization'),
				};
				const response = await axios.post(
					BACKEND_URL + 'instructor/addGroupToCourse',
					requestData,
					{ headers: headers }
				);
				const status = response['data']['status'];

				if (status === 'success') {
					setResponseModalContent(response['data']['result']);
					setResponseModalVisible(true);
					removeFile();
					setExportFileContent('');
				} else {
					setResponseModalContent(response['data']['result']);
					setResponseModalVisible(true);
					removeFile();
					setExportFileContent('');
				}

				// setResponseModalVisible(true);
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
			'GroupName, GroupName, GroupName\n' +
			'StudentID,StudentID,StudentID\n' +
			'StudentID,StudentID,StudentID\n' +
			'StudentID,StudentID,StudentID\n' +
			'StudentID,StudentID,StudentID\n' +
			'StudentID,StudentID,StudentID';
		const blob = new Blob([csvContent], {
			type: 'text/csv;charset=utf-8;',
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'addGroupsToCourseTemplate.csv');
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
							Create Student Groups in course: {courseName}
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
								<p className="text-black">
									Create Student Groups
								</p>
							),
						},
					]}
				/>
				<div className="flex flex-col items-center justify-center w-full mt-10 mb-10">
					<div className="w-[60%] bg-[#F9F9F9] rounded-lg drop-shadow-2xl text-center mt-6">
						<p className="text-2xl font-bold text-center mt-8 mb-8">
							Create Student Groups
						</p>
						<p className="text-xl">
							Please use the sample CSV template to create student
							groups in the course
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
								Upload your csv file containing the groups data
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
				className="overflow-scroll font-futura text-xl"
				width={650}
				height={600}
				footer={[
					<div className=" flex justify-center">
						<Button
							type="default"
							className="h-auto bg-blue-500 hover:bg-blue-400 border border-transparent hover:border-white hover:border-1  rounded-lg text-white font-futura text-sm"
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

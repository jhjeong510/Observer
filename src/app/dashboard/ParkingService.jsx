import React, { useState, useEffect, useRef } from 'react';
import styles from './ParkingService.module.css'
import { Modal, Button, Form, Tabs, Tab, Nav, Row, Col, Table } from 'react-bootstrap';
import ParkingInfo from './ParkingInfo';
import AddParkingCameraModal from '../shared/modal/AddParkingCameraModal';
import AddVCounterModal from '../shared/modal/AddVCounterModal';
import { handleCloseContext } from "./handlers/ContextMenuHandler";
import ParkingCameraStream from './ParkingCameraStream';
import { getParkingCamera, getParkingCoords } from './api/apiService';
import ParkingArea from './ParkingArea';
import ParkingCamera from './ParkingCamera';
import ParkingSpaceSetting from './ParkingSpaceSetting';
import ParkingEventList from './ParkingEventList';
import ParkingCameraSetting from './ParkingCameraSetting';
import VCounterInfo from './VCounterInfo';

export default function ParkingService({
	showParkingServiceModal,
	handleShowParkingServiceModal,
	parkingCameraUpdate,
	parkingAreaUpdate,
	parkingCoordsUpdate,
	parkingSpaceUpdate,
	socketClient,
	eventListUpdate,
	deviceList,
	vCounters,
	parkingEvent
}) {
	const [parkingCameras, setParkingCameras] = useState([]);
	const [modalWarnMessage, setModalWarnMessage] = useState('');
	const [currentTabName, setCurrentTabName] = useState('observer parkingService');
	const [cameraModal, setCameraModal] = useState({ show: false, title: '', message: '' });
	const [vCounterModal, setVCounterModal] = useState({ show: false, title: '', message: '' });
	const [socketCamera, setSocketCamera] = useState([]);
	const socketCameraRef = useRef(null);

	const handleShowModalCamera = () => {
		setCameraModal({ show: true, title: '주차 카메라 이름 지정', message: '카메라 선택' });
		handleCloseContext();
	}

	const handleShowModalVCounter = () => {
		setVCounterModal({ show: true, title: 'V-Counter 추가' });
		handleCloseContext();
	}

	const handleCancel = (e) => {
		handleShowParkingServiceModal(e);
	}

	const getParkingCameraList = async () => {
		try {
			const res = await getParkingCamera();
			if (res && res.data && res.data.result.length > 0) {
				await setParkingCameras(res.data.result);
			} else {
				await setParkingCameras([]);
			}
		} catch (err) {
			console.error('getParkingCameraList err: ', err);
		}
	}

	const handleConnectSocket = async () => {
		const socket = socketClient;
		parkingCameras && parkingCameras.forEach(async (parkingCamera) => {
			if (parkingCamera.camera_id && socketCameraRef.current && !socketCameraRef.current.includes(parkingCamera.camera_id)) {
				const cameraId = parkingCamera.camera_id;
				await socket && socket.emit('cameraStream', {
					cameraId,
					cmd: 'on'
				});
			}
		})
	}

	const handleDisconnectSocket = async () => {
		const socket = socketClient;
		parkingCameras && parkingCameras.forEach(async (parkingCamera) => {
			if (parkingCamera.camera_id) {
				const cameraId = parkingCamera.camera_id;
				await socket && socket.emit('cameraStream', {
					cameraId,
					cmd: 'off'
				});
			}
		})
		setSocketCamera([]);
	}

	useEffect(() => {
		if (socketClient && showParkingServiceModal) {
			handleConnectSocket();
		} else if (socketClient && !showParkingServiceModal) {
			handleDisconnectSocket();
		}
		return () => {
			socketClient && handleDisconnectSocket();
		}
	}, [showParkingServiceModal])


	useEffect(() => {
		getParkingCameraList();
	}, [parkingCameraUpdate]);

	useEffect(() => {
		socketCameraRef.current = socketCamera;
	}, [socketCamera])

	return (
		<>
			<Modal
				show={showParkingServiceModal}
				size='xl'
				centered
				contentClassName={styles.modal_content_observer_parkingService}
				onHide={handleCancel}
			>
				<Modal.Header>
					<Modal.Title>옵저버 주차관제시스템</Modal.Title>
					<div >
						<a href="!#" className={styles.setting_modal_closer} onClick={handleCancel}></a>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Tab.Container id="left-tabs-example" defaultActiveKey="all">
							<div className='col-12'>
								<Button style={{ position: 'relative', left: '46.6%', marginBottom: '0.9rem', }} onClick={handleShowModalCamera}> 카메라 이름 지정</Button>
								{/* <Button style={{ position: 'relative', left: '34%', marginBottom: '1rem', }} onClick={handleShowModalVCounter}> V-Counter 추가 </Button> */}
								<Row className='parking-tab'>
									<Col sm={1} className={styles.observer_parking_col_sm_1}>
										<Nav variant="tabs" className="flex-column nav-tabs-vertical">
											<Nav.Item>
												<Nav.Link eventKey="all">
													전체
												</Nav.Link>
											</Nav.Item>
											{parkingCameras && parkingCameras.map((parkingCamera) => {
												if (parkingCamera.name) {
													return <Nav.Item key={parkingCamera.idx}>
														<Nav.Link eventKey={parkingCamera.idx + '_camera'}>
															{parkingCamera.name}
														</Nav.Link>
													</Nav.Item>
												}
											})}
										</Nav>
									</Col>
									<Col sm={8} className={styles.observer_parking_col_sm_8}>
										<Tab.Content className="tab-content-vertical">
											<Tab.Pane eventKey="all">
												<h4 className={styles.parkingCamera_title}>전체</h4>
												{/* <VCounterInfo
													vCounters={vCounters}
												/> */}
												<div className={styles.parkingCamera_wrapper}>
													<ParkingCamera
														parkingCameras={parkingCameras}
														socketClient={socketClient}
														socketCameraRef={socketCameraRef.current}
														handleConnectSocket={handleConnectSocket}
														handleDisconnectSocket={handleDisconnectSocket}
														parkingCoordsUpdate={parkingCoordsUpdate}
														parkingSpaceUpdate={parkingSpaceUpdate}
													/>
												</div>
											</Tab.Pane>

											{parkingCameras && parkingCameras.map((parkingCamera) => {
												return (
													<Tab.Pane key={parkingCamera.idx} eventKey={`${parkingCamera.idx}_camera`}>
														<h4 className={styles.parkingCamera_title}>{parkingCamera.name}</h4>
														<ParkingCamera
															parkingCamera={parkingCamera}
															socketClient={socketClient}
															socketCameraRef={socketCameraRef.current}
															handleConnectSocket={handleConnectSocket}
															handleDisconnectSocket={handleDisconnectSocket}
															parkingCoordsUpdate={parkingCoordsUpdate}
															parkingSpaceUpdate={parkingSpaceUpdate}
														/>
													</Tab.Pane>
												)
											})
											}
										</Tab.Content>
									</Col>

									<Col sm={3} className={styles.observer_parking_col_sm_3}>
										<Row style={{
											maxWidth: '25rem',
											backgroundColor: '#000000',
											height: '46vh',
											borderRadius: '1rem',
											// borderRight: 'thin solid rgb(75, 71, 71)',
											marginBottom: '7px'

										}}>
											<Tab.Content className="tab-content-vertical">
												<Tab.Pane eventKey="all">
													<Tabs defaultActiveKey="status_all" id="uncontrolled-tab-example">
														<Tab eventKey="status_all" title="실시간 주차 현황" className='test-tab'>
															<div className={styles.info_title}>
																{/* <h4 className={styles.parking_status}>실시간 주차 현황</h4> */}
																<ParkingInfo
																	parkingCameras={parkingCameras}
																	parkingAreaUpdate={parkingAreaUpdate}
																	parkingSpaceUpdate={parkingSpaceUpdate}
																/>
															</div>
														</Tab>
													</Tabs>
												</Tab.Pane>
												{parkingCameras && parkingCameras.map((parkingCamera) => {
													if (parkingCamera.name) {
														return <Tab.Pane eventKey={parkingCamera.idx + '_camera'} key={parkingCamera.idx}>
															<Tabs defaultActiveKey="status_detail" id="uncontrolled-tab-example">
																<Tab eventKey="status_detail" title="실시간 주차 현황" className='test-tab'>
																	<div className={styles.info_title}>
																		<ParkingInfo
																			parkingCamera={parkingCamera}
																			parkingAreaUpdate={parkingAreaUpdate}
																			parkingSpaceUpdate={parkingSpaceUpdate}
																		/>
																	</div>
																</Tab>
																<Tab eventKey="space_type_setting" title="구역 설정" className='test-tab'>
																	<ParkingSpaceSetting
																		parkingCamera={parkingCamera}
																		parkingAreaUpdate={parkingAreaUpdate}
																		parkingSpaceUpdate={parkingSpaceUpdate}
																	/>
																</Tab>
																<Tab eventKey="parkingCamera_setting" title="설정" className='test-tab'>
																	<ParkingCameraSetting
																		parkingCamera={parkingCamera}
																		parkingAreaUpdate={parkingAreaUpdate}
																		parkingSpaceUpdate={parkingSpaceUpdate}
																	/>
																</Tab>
															</Tabs>
														</Tab.Pane>
													}
												})
												}
											</Tab.Content>
										</Row>

										<Row style={{
											maxWidth: '25rem',
											// backgroundColor: '#424242',
											height: '32vh',
											borderRadius: '1rem',
											// borderRight: 'thin solid rgb(75, 71, 71)',
											marginBottom: '7px',
											marginTop: '15px'

										}}>
											<ParkingEventList
												parkingCameras={parkingCameras}
												parkingEvent={parkingEvent}
											/>
										</Row>
									</Col>
								</Row>
							</div>
						</Tab.Container>
					</div>
				</Modal.Body>
			</Modal>
			{cameraModal.show ? <AddParkingCameraModal show={cameraModal.show} setShow={setCameraModal} message={cameraModal.message} title={cameraModal.title} cameraList={parkingCameras} /> : null}
			{/* {vCounterModal.show ? <AddVCounterModal show={vCounterModal.show} setShow={setVCounterModal} message={vCounterModal.message} title={vCounterModal.title} deviceList={deviceList} /> : null} */}
		</>
	)
}

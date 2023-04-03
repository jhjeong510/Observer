import React, { useState, useEffect } from 'react';
import styles from './CrowdDensityService.module.css'
import { Modal, Button } from 'react-bootstrap';
import AddCrowdDensityCameraModal from '../shared/modal/AddCrowdDensityCameraModal';
import { handleCloseContext } from "./handlers/ContextMenuHandler";
import { getCrowdDensityCamera } from './api/apiService';
import CrowdDensityCameraDetail from './CrowdDensityCameraDetail';

export default function CrowdDensityService({
	showCrowdDensityServiceModal,
	handleShowCrowdDensityModal,
	crowdDensityCamera,
	cameraList,
	crowdDensityCountingLog,
	crowdDensityCameraOnEvent
}) {
	const [crowdDensityCameraList, setCrowdDensityCameraList] = useState([]);
	const [crowdDensityCameraModal, setCrowdDensityCameraModal] = useState({ show: false, title: '', message: '' });

	const handleShowModalCamera = () => {
		setCrowdDensityCameraModal({ show: true, title: '군중 밀집도 카메라 추가', message: '카메라 선택' });
		handleCloseContext();
	}

	const handleCancel = (e) => {
		handleShowCrowdDensityModal(e);
	}

	const handleGetCrowdDensityCameraList = async () => {
		const res = await getCrowdDensityCamera();
		if (res && res.data && res.data.result) {
			setCrowdDensityCameraList(res.data.result);
		}
	}

	useEffect(() => {
		handleGetCrowdDensityCameraList();
	}, [crowdDensityCamera])

	return (
		<>
			<Modal
				show={showCrowdDensityServiceModal}
				size='xl'
				centered
				contentClassName={styles.modal_content_observer_crowdDensityService}
				onHide={handleCancel}
			>
				<Modal.Header>
					<Modal.Title>군중밀집도 관리</Modal.Title>
					<div >
						<a href="!#" className={styles.setting_modal_closer} onClick={handleCancel}></a>
					</div>
				</Modal.Header>
				<Modal.Body className={styles.body}>
					<Button className={styles.addCamera} onClick={handleShowModalCamera}> 카메라 추가 </Button>
					{crowdDensityCameraList && crowdDensityCameraList.map((crowdDensityCamera) => {
						return (
							<React.Fragment key={crowdDensityCamera.idx}>
								<CrowdDensityCameraDetail
									crowdDensityCamera={crowdDensityCamera}
									selectedCameraId={'0'}
									crowdDensityCountingLog={crowdDensityCountingLog}
									crowdDensityCameraOnEvent={crowdDensityCameraOnEvent}
								/>
							</React.Fragment>
						)
					})
					}
				</Modal.Body>
			</Modal>
			{crowdDensityCameraModal.show ? <AddCrowdDensityCameraModal show={crowdDensityCameraModal.show} setShow={setCrowdDensityCameraModal} message={crowdDensityCameraModal.message} title={crowdDensityCameraModal.title} crowdDensityCameraList={crowdDensityCameraList} cameraList={cameraList} /> : null}
		</>
	)
}
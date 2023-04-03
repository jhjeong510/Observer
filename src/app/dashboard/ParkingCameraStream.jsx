import React, { useEffect, useState, useRef } from 'react';
import { getParkingCoords, removeParkingCamera } from './api/apiService';
import ModalConfirm from './ModalConfirm';
import ParkingArea from './ParkingArea';
import styles from './ParkingCameraStream.module.css';

export default function ParkingCameraStream({ cameraId, socket, oneCamera, cameraIp, parkingCoordsUpdate, parkingSpaceUpdate }) {
	const isMountedRef = useRef();
	const [receivedData, setReceivedData] = useState('');
	const [parkingCoordsData, setParkingCoordsData] = useState([]);
	const [modalConfirm, setModalConfirm] = useState({
		showModal: '',
		modalTitle: '',
		modalMessage: '',
		modalMessageWarn: '',
		modalConfirmBtnText: '',
		modalCancelBtnText: ''
	})

	const getCameraLiveStream = async () => {
		if (socket && cameraId) {
			await socket.on('cameraStream', (received) => {
				if (received && received.cameraId === cameraId) {
					isMountedRef.current && setReceivedData(received.data);
				}
			})
		}
	}

	useEffect(() => {
		isMountedRef.current = new Date();
		getCameraLiveStream();
		return () => {
			isMountedRef.current = null;
			// console.log('unmount');
		}
	}, [])

	const getParkingCoordinates = async (cameraIp) => {
		try {
			const res = await getParkingCoords(cameraIp);
			if (res && res.data && res.data.result.length > 0) {
				isMountedRef.current && await setParkingCoordsData(res.data.result);
			}
		} catch (err) {
			console.log('getParkingCoordinates err: ', err);
		}
	}

	const handleCancel = async () => {
		setModalConfirm({
			showModal: false,
			modalTitle: '',
			modalMessage: '',
			modalMessageWarn: '',
			modalConfirmBtnText: '',
			modalCancelBtnText: ''
		});
	}

	const handleConfirm = async () => {
		let data = {
			ipaddress: cameraIp
		}
		const res = await removeParkingCamera(data);
		if (res && res.data && res.data.status && res.data.status === 'success') {
			return setModalConfirm({
				showModal: false,
				modalTitle: '',
				modalMessage: '',
				modalMessageWarn: '',
				modalConfirmBtnText: '',
				modalCancelBtnText: ''
			});
		} else {
			console.error('remove parking camera failed: ', res);
			return setModalConfirm((prev) => ({
				...prev,
				modalMessageWarn: '카메라 삭제에 실패했습니다.'
			}))
		}
	}

	const deleteParkingCamera = () => {
		setModalConfirm({
			showModal: true,
			modalTitle: '주차 카메라 삭제',
			modalMessage: '해당 카메라를 삭제하시겠습니까?',
			modalMessageWarn: '해당 카메라에 관련된 그룹과 주차구역이 모두 삭제됩니다.',
			modalConfirmBtnText: '삭제',
			modalCancelBtnText: '취소'
		})
	}

	useEffect(() => {
		cameraIp && getParkingCoordinates(cameraIp);
	}, [parkingCoordsUpdate])


	useEffect(() => {
		cameraIp && getParkingCoordinates(cameraIp);
	}, [parkingSpaceUpdate])


	if (cameraId) {
		return <div>
			<div className={oneCamera ? styles.parentDiv : styles.parentDiv_all}>
				{oneCamera && <span className={styles.delete_btn} onClick={deleteParkingCamera}>
					카메라 삭제
				</span>}
				<img src={receivedData ? 'data:image/jpeg;base64,' + receivedData : require('../../assets/images/loading_rm_bg.gif')} className={(receivedData !== '' && oneCamera) ? styles.video_large : (receivedData !== '' && !oneCamera) ? styles.video : oneCamera ? styles.loading_large : styles.loading} />
				<div className={oneCamera ? styles.childDiv : styles.childDiv_all}>
					<ParkingArea
						oneCamera={oneCamera}
						src={receivedData}
						parkingCoordsData={parkingCoordsData}
						parkingSpaceUpdate={parkingSpaceUpdate}
					/>
				</div>
			</div>
			<ModalConfirm
				showModal={modalConfirm.showModal}
				modalTitle={modalConfirm.modalTitle}
				modalMessage={modalConfirm.modalMessage}
				modalMessageWarn={modalConfirm.modalMessageWarn}
				modalConfirmBtnText={modalConfirm.modalConfirmBtnText}
				modalCancelBtnText={modalConfirm.modalCancelBtnText}
				handleCancel={handleCancel}
				handleConfirm={handleConfirm}
			/>
		</div>
	} else {
		return ''
	}
}
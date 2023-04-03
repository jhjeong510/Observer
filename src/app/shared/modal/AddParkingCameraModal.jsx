import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { setParkingCamera } from '../../dashboard/api/apiService';
import styles from './AddParkingCameraModal.module.css';

export default function AddParkingCameraModal({ show, setShow, message, title, callback, clickPoint, cameraList, insdie, buildingInfo }) {
	const [modalCurrentCamera, setModalCurrentCamera] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');
	const [cameraName, setCameraName] = useState('');

	const handleChangeCurrentCamera = async (e) => {
		setModalCurrentCamera(e.target.value);
	}

	const handleConfirm = () => {
		const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
		if (modalCurrentCamera === '') {
			setModalWarnMessage('장치를 선택하세요.');
			return
		}
		if (cameraName.trim() === '') {
			setModalWarnMessage('해당 카메라의 이름(그룹명)을 입력해주세요.');
			return;
		}
		if (!regex.test(cameraName.trim())) {
			setModalWarnMessage('해당 카메라의 이름(그룹명)을 한글, 영어, 숫자로 입력해주세요.');
			return;
		}
		if (cameraName.trim().length < 2 || cameraName.trim().length > 50) {
			setModalWarnMessage('해당 카메라의 이름(그룹명)을 2자 이상 50자 이하로 입력해주세요.');
			return;
		}
		try {
			setParkingCamera({
				ipaddress: modalCurrentCamera,
				name: cameraName
			})
		} catch (err) {
			console.log('set parking camera name err: ', err);
		}
		handleCancel();
	}
	const handleCancel = () => {
		setModalCurrentCamera('')
		setShow({ show: false });
	}

	return (
		<div className='AddCameraModal'>
			{show ?
				<Modal show={show} onHide={handleCancel} animation={true}>
					<Modal.Header closeButton>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="Idx">
							<Form.Label>{message}</Form.Label>
							<select className={styles.select} onChange={handleChangeCurrentCamera} value={modalCurrentCamera || ''}>
								<option key={0} value={''}></option>
								{cameraList && cameraList.sort((a, b) => a.idx - b.idx).map((camera) => {
									if (camera.ipaddress) {
										return <option key={camera.idx} value={camera.ipaddress}>{(camera.name ? (camera.name + ' ') : '') + '(' + camera.ipaddress + ')'}</option>
									}
								})}
							</select>
							<br />
							<Form.Label htmlFor='parking_camera_name'>주차 그룹명 입력 (*필수)</Form.Label>
							<input className="form-control" name='modalCurrentFloor' onChange={(e) => setCameraName(e.target.value)} placeholder='그룹명을 입력하세요.' />
						</Form.Group>
						<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleConfirm}> 추가
						</Button>
						<Button variant="secondary" onClick={handleCancel}> 취소
						</Button>
					</Modal.Footer>
				</Modal>
				:
				''
			}
		</div >
	)
}
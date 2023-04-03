import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addCamera } from '../../dashboard/api/apiService';

export default function ParkingBoxControlModal({ show, setShow, message, title, callback, clickPoint, cameraList, insdie, buildingInfo }) {
	const [modalCurrentCamera, setModalCurrentCamera] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const handleChangeCurrentCamera = async (e) => {
		setModalCurrentCamera(e.target.value);
	}

	const handleConfirm = () => {
		if (modalCurrentCamera === undefined) {
			setModalWarnMessage('장치를 선택하세요.');
			return
		}

		try {
			addCamera({
				id: modalCurrentCamera,
				left_location: JSON.stringify(clickPoint.x),
				top_location: JSON.stringify(clickPoint.y),
				type: 'camera',
				buildingIdx: buildingInfo ? buildingInfo.buildingIdx : 0,
				floorIdx: buildingInfo ? buildingInfo.floorIdx : 0,
				buildingServiceType: 'observer',
			})
		} catch (err) {
			console.log('카메라 추가 오류: ', err);
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
							<select className="form-control" onChange={handleChangeCurrentCamera} value={modalCurrentCamera || ''}>
								<option></option>
								{cameraList && cameraList.sort((a, b) => a.cameraid - b.cameraid).map((camera, index) => {
									if (camera.left_location === null || camera.top_location === null || camera.left_location === 'null' || camera.top_location === 'null' || camera.left_location === '' || camera.top_location === '' || camera.left_location === undefined || camera.top_location === undefined || camera.left_location === 'undefined' || camera.top_location === 'undefined') {
										return <option key={index} value={camera.cameraid}>{camera.cameraid + ". " + camera.cameraname + ' (' + camera.ipaddress + ')'}</option>
									}
								})}
							</select>
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
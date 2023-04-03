import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addDoor } from '../../dashboard/api/apiService';

export default function AddDoorModal({ show, setShow, message, title, callback, clickPoint, deviceList, buildingInfo }) {
	const [modalCurrentDoor, setModalCurrentDoor] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const handleChangeCurrentDoor = async (e) => {
		setModalCurrentDoor(e.target.value);
	}

	const handleConfirm = () => {
		if (modalCurrentDoor === undefined) {
			setModalWarnMessage('출입문을 선택하세요.');
			return
		}
		try {
			addDoor({
				id: modalCurrentDoor,
				left_location: JSON.stringify(clickPoint.x),
				top_location: JSON.stringify(clickPoint.y),
				type: 'door',
				buildingIdx: buildingInfo.buildingIdx,
				floorIdx: buildingInfo.floorIdx,
				buildingServiceType: 'observer',
			})
		} catch (err) {
			console.log('출입문 추가 오류: ', err);
		}
		handleCancel();
	}
	const handleCancel = () => {
		setModalCurrentDoor('')
		setShow({ show: false });
	}

	return (
		<div className='AddDoorModal'>
			{show ?
				<Modal show={show} onHide={handleCancel} animation={true}>
					<Modal.Header closeButton>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="Idx">
							<Form.Label>{message}</Form.Label>
							<select className="form-control" onChange={handleChangeCurrentDoor} value={modalCurrentDoor || ''}>
								<option></option>
								{deviceList && deviceList.sort((a, b) => a.id - b.id).map((door, index) => {
									if (door.left_location === null || door.top_location === null || door.left_location === 'null' || door.top_location === 'null' || door.left_location === '' || door.top_location === '' || door.left_location === undefined || door.top_location === undefined || door.left_location === 'undefined' || door.top_location === 'undefined') {
										if (door.type === 'door') {
											return <option key={index} value={door.id}>{door.name}</option>
										}
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
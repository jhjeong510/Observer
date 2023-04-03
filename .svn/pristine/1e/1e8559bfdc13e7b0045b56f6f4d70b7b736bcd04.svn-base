import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addVCounterToMap } from '../../dashboard/api/apiService';

export default function AddVCounterToMapModal({ show, setShow, message, title, callback, clickPoint, lineInfo, selectObject, deviceList, buildingInfo }) {
	const [modalCurrentVCounter, setModalCurrentVCounter] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const handleChangeVCounter = async (e) => {
		setModalCurrentVCounter(e.currentTarget.value);
	}

	const handleConfirm = () => {
		if (modalCurrentVCounter === undefined || modalCurrentVCounter === '') {
			setModalWarnMessage('*V-Counter를 선택하세요.');
			return
		}

		addVCounterToMap({
			id: modalCurrentVCounter,
			buildingIdx: buildingInfo ? buildingInfo.buildingIdx : 0,
			floorIdx: buildingInfo ? buildingInfo.floorIdx : 0,
			buildingServiceType: 'observer',
			left_location: JSON.stringify(clickPoint.x),
			top_location: JSON.stringify(clickPoint.y),
			type: 'vcounter'
		})
		handleCancel();
	}
	const handleCancel = () => {
		setShow({ show: false });
		setModalCurrentVCounter('');
		setModalWarnMessage('');
	}

	return (
		<div className='modalconfirm'>
			{show ?
				<Modal show={show} onHide={handleCancel} animation={true}>
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group controlId="Idx">
								<Form.Group controlId="formFloorId">
									<Form.Label>{message}</Form.Label>
									<select className="form-control floorImage" onChange={handleChangeVCounter} value={modalCurrentVCounter}>
										<option></option>
										{deviceList && deviceList.map((vcounter, index) => {
											if (vcounter.left_location === null || vcounter.top_location === null || vcounter.left_location === 'null' || vcounter.top_location === 'null' || vcounter.left_location === '' || vcounter.top_location === '') {
												if (vcounter.type === 'vcounter') {
													return <option key={index} value={vcounter.ipaddress}>{vcounter.name}({vcounter.ipaddress})</option>
												}
											}
										})}
									</select>
								</Form.Group>
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleConfirm}>
							추가
						</Button>
						<Button variant="secondary" onClick={handleCancel}>
							취소
						</Button>
					</Modal.Footer>
				</Modal>
				:
				''
			}
		</div>
	)
}
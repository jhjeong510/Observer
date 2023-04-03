import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addFence } from '../../dashboard/api/apiService';

export default function AddFenceModal({ show, setShow, message, title, callback, clickPoint, lineInfo, selectObject, pidsList }) {
	const [modalCurrentPidsZone, setModalCurrentPidsZone] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const handleChangePidsZone = async (e) => {
		setModalCurrentPidsZone(e.currentTarget.value);
	}

	const handleConfirm = () => {
		if (modalCurrentPidsZone === undefined || modalCurrentPidsZone === '') {
			setModalWarnMessage('*울타리를 선택하세요.');
			return
		}

		addFence({
			id: modalCurrentPidsZone,
			left_location: JSON.stringify(lineInfo.left),
			top_location: JSON.stringify(lineInfo.top),
			line_x1: lineInfo.x1,
			line_x2: lineInfo.x2,
			line_y1: lineInfo.y1,
			line_y2: lineInfo.y2,
			floor_idx: 0,
			building_idx: 0,
			service_type: 'observer',
		})
		handleCancel();
	}
	const handleCancel = () => {
		setShow({ show: false });
		setModalCurrentPidsZone('');
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
									<select className="form-control floorImage" onChange={handleChangePidsZone} value={modalCurrentPidsZone}>
										<option></option>
										{/* {pidsList && pidsList.map((pidsZone, index) => { */}
										{pidsList && pidsList.map((pidsZone, index) => {
											if (pidsZone.left_location === null || pidsZone.top_location === null || pidsZone.left_location === 'null' || pidsZone.top_location === 'null' || pidsZone.left_location === '' || pidsZone.top_location === '') {
												return <option key={index} value={pidsZone.pidsid}>{pidsZone.pidsid}</option>
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
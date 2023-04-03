import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addEbell } from '../../dashboard/api/apiService';

export default function AddEbellModal({ show, setShow, message, title, callback, clickPoint, deviceList, buildingInfo }) {
	const [modalCurrentEbell, setModalCurrentEbell] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const handleChangeCurrentEbell = async (e) => {
		setModalCurrentEbell(e.target.value);
	}

	const handleConfirm = () => {
		if (modalCurrentEbell === undefined) {
			setModalWarnMessage('장치를 선택하세요.');
			return
		}
		try {
			addEbell({
				id: modalCurrentEbell,
				left_location: JSON.stringify(clickPoint.x),
				top_location: JSON.stringify(clickPoint.y),
				type: 'ebell',
				buildingIdx: buildingInfo ? buildingInfo.buildingIdx : 0,
				floorIdx: buildingInfo ? buildingInfo.floorIdx : 0,
				buildingServiceType: 'observer',
			})
		} catch (err) {
			console.log('비상벨 추가 오류: ', err);
		}
		handleCancel();
	}
	const handleCancel = () => {
		setModalCurrentEbell('')
		setShow({ show: false });
	}

	return (
		<div className='AddEbellModal'>
			{show ?
				<Modal show={show} onHide={handleCancel} animation={true}>
					<Modal.Header closeButton>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group controlId="Idx">
								<Form.Label>{message}</Form.Label>
								<select className="form-control" onChange={handleChangeCurrentEbell} value={modalCurrentEbell || ''}>
									<option></option>
									{deviceList && deviceList.sort((a, b) => a.idx - b.idx).map((ebell, index) => {
										if (ebell.type === 'ebell') {
											if (ebell.left_location === null || ebell.top_location === null || ebell.left_location === 'null' || ebell.top_location === 'null' || ebell.left_location === '' || ebell.top_location === '' || ebell.left_location === undefined || ebell.top_location === undefined || ebell.left_location === 'undefined' || ebell.top_location === 'undefined') {
												return <option key={index} value={ebell.id}>{index + ". " + ebell.name + ' (' + ebell.ipaddress + ')'}</option>
											}
										}
									})}
								</select>
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
						</Form>
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
		</div>
	)
}
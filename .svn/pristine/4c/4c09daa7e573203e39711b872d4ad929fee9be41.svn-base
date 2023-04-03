import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { removePids, removePidsList } from '../../dashboard/api/apiService';

export default function RemovePidsModal({ show, setShow, message, title, callback, clickPoint, selectObject, deviceList }) {
	const [modalCurrentGdp200DelList, setModalCurrentGdp200DelList] = useState([]);
	const [modalCurrentGdp200Ipaddress, setModalCurrentGdp200Ipaddress] = useState([]);
	const [modalWarnMessage, setModalWarnMessage] = useState('');


	const handleChangeGroupImageId = async (e) => {
		if (e && e.target && e.target.value) {
			const value = e.target.value.split('&&');
			const name = value[0];
			const ipaddress = value[1];
			await setModalCurrentGdp200DelList(name);
			await setModalCurrentGdp200Ipaddress(ipaddress);
		}
	}

	const handleConfirm = async () => {
		if (modalCurrentGdp200DelList === undefined || modalCurrentGdp200DelList === '') {
			setModalWarnMessage('*PIDS를 선택하세요.');
			return
		}

		const res = await removePids({
			name: modalCurrentGdp200DelList,
			ipaddress: modalCurrentGdp200Ipaddress
		})
		if (res) {
			removePidsList({
				name: modalCurrentGdp200DelList,
				ipaddress: modalCurrentGdp200Ipaddress
			})
		}
		handleCancel();
	}
	const handleCancel = () => {
		setShow({ show: false });
		setModalCurrentGdp200DelList('');
		setModalCurrentGdp200Ipaddress('');
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
								<Form.Group controlId="pidsId">
									<Form.Label>{message}</Form.Label>
									<select className="form-control pidsList" onChange={handleChangeGroupImageId} >
										<option></option>
										{deviceList && deviceList.map((device, index) => {
											if (device.type === 'pids') {
												return <option key={index} value={device.name + '&&' + device.ipaddress}> {device.name} ({device.ipaddress}) </option>
											}
										})}
									</select>
								</Form.Group>
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>(주의 - PIDS 삭제 시 맵에 설정한 PIDS의 울타리(Zone)도 함께 삭제됩니다.)</Form.Text>
							<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleConfirm}>
							삭제
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
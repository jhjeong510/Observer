import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addGdp2000 } from '../../dashboard/api/apiService';

export default function AddPidsModal({ show, setShow, message, title, callback, clickPoint, deviceList }) {
	const [inputs, setInputs] = useState({
		modalCurrentPids: '',
		modalPidsIpaddress: '',
		modalPidsLocation: '',
	})
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const { modalCurrentPids, modalPidsIpaddress, modalPidsLocation } = inputs;
	const handleChangePids = async (e) => {
		const { value, name } = e.target;
		setInputs({
			...inputs,
			[name]: value,
		})
	}

	const validateIpaddress = async (ip) => {
		const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		if (ipformat.test(ip)) {
			return true;
		} else {
			return false;
		}
	}

	const handleConfirm = async (e) => {
		e.preventDefault();
		const redundancyPids = deviceList.find((device) => device.ipaddress === modalPidsIpaddress);
		if (redundancyPids) {
			setModalWarnMessage('*동일한 IP의 장치가 있습니다.');
			return
		}
		const pidsSameNameCheck = deviceList.find((device) => device.name === modalCurrentPids);
		if (pidsSameNameCheck) {
			setModalWarnMessage('*동일한 이름의 장치가 있습니다.');
			return
		}
		if (modalCurrentPids === undefined ||
			modalCurrentPids === null ||
			modalCurrentPids.length === 0) {
			setModalWarnMessage('*PIDS 이름을 입력하세요.');
			return
		} else if (modalCurrentPids.length > 10) {
			setModalWarnMessage('*PIDS 이름은 최대 10자 입니다.');
			return
		} else if (modalPidsIpaddress === undefined ||
			modalPidsIpaddress === null ||
			modalPidsIpaddress.length === 0) {
			setModalWarnMessage('*PIDS IP Address를 입력하세요.');
			return
		} else if (await validateIpaddress(modalPidsIpaddress) === false) {
			setModalWarnMessage('*잘못된 IP Address 형식입니다.');
			return
		} else if (modalPidsLocation === undefined || modalPidsLocation === '') {
			setModalWarnMessage('*설치 위치를 입력하세요.');
			return
		} else if (modalPidsLocation.length > 10) {
			setModalWarnMessage('*설치 위치명은 최대 10자 입니다.');
			return
		}

		try {
			addGdp2000({
				id: modalCurrentPids,
				name: modalCurrentPids,
				top_location: clickPoint.y.toString(),
				left_location: clickPoint.x.toString(),
				building_idx: 0,
				building_service_type: 'observer',
				floor_idx: 0,
				type: 'pids',
				ipaddress: modalPidsIpaddress,
				location: modalPidsLocation,
			})
			handleCancel();
		} catch (err) {
			console.log(err);
		}
	}
	const handleCancel = () => {
		setShow({ show: false });
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
							<Form.Group controlId="formName">
								<Form.Label>이름 (*필수)</Form.Label>
								<Form.Control type='text' maxLength='50' name='modalCurrentPids' value={modalCurrentPids} onChange={handleChangePids} placeholder='PIDS의 이름을 입력하세요.' />
							</Form.Group>
							<Form.Group controlId="formIpaddress">
								<Form.Label>IP Address (*필수)</Form.Label>
								<Form.Control type='text' maxLength='15' name='modalPidsIpaddress' value={modalPidsIpaddress} onChange={handleChangePids} placeholder='PIDS의 IP를 입력하세요.' />
							</Form.Group>
							<Form.Group controlId="formLocation">
								<Form.Label>설치 위치 (*필수)</Form.Label>
								<Form.Control type='text' maxLength='15' name='modalPidsLocation' value={modalPidsLocation} onChange={handleChangePids} placeholder='PIDS의 설치 위치를 입력하세요.' />
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleConfirm}>
							확인
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
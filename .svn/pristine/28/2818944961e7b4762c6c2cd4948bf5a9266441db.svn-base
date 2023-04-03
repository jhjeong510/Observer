import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addVCounter } from '../../dashboard/api/apiService';
import Select from 'react-select';
import styles from './AddVCounterModal.module.css';

export default function AddVCounterModal({ show, setShow, title, deviceList }) {
	const [inputs, setInputs] = useState({
		modalCurrentVCounter: '',
		modalVCounterIpaddress: '',
		modalVCounterPort: '',
		modalVCounterLocation: '',
		modalVCounterInstallType: '',
	})
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const { modalCurrentVCounter, modalVCounterIpaddress, modalVCounterPort, modalVCounterLocation, modalVCounterInstallType } = inputs;
	const handleChangeVCounter = async (e) => {
		const { value, name } = e.target;
		setInputs({
			...inputs,
			[name]: value,
		})
	}

	const handleChangeVCounterInstallType = async (e) => {
		const { value } = e;
		console.log(e);
		setInputs({
			...inputs,
			modalVCounterInstallType: value,
		})
		console.log(inputs);
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
		const portRegExp = new RegExp('^[0-9]+$');
		const portRegExp2 = new RegExp('^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$');
		e.preventDefault();
		const redundancyVCounter = deviceList.find((device) => device.ipaddress === modalVCounterIpaddress);
		if (redundancyVCounter) {
			setModalWarnMessage('*동일한 IP의 장치가 있습니다.');
			return
		}
		const VCounterSameNameCheck = deviceList.find((device) => device.name === modalCurrentVCounter);
		if (VCounterSameNameCheck) {
			setModalWarnMessage('*동일한 이름의 장치가 있습니다.');
			return
		}
		if (modalCurrentVCounter === undefined ||
			modalCurrentVCounter === null ||
			modalCurrentVCounter.length === 0) {
			setModalWarnMessage('*VCounter 이름을 입력하세요.');
			return
		} else if (modalCurrentVCounter.length > 10) {
			setModalWarnMessage('*VCounter 이름은 최대 10자 입니다.');
			return
		} else if (modalVCounterIpaddress === undefined ||
			modalVCounterIpaddress === null ||
			modalVCounterIpaddress.length === 0) {
			setModalWarnMessage('*VCounter IP Address를 입력하세요.');
			return
		} else if (await validateIpaddress(modalVCounterIpaddress) === false) {
			setModalWarnMessage('*잘못된 IP Address 형식입니다.');
			return
		} else if (modalVCounterPort === '') {
			setModalWarnMessage('*VCounter Port를 입력하세요.');
			return
		} else if (!portRegExp.test(modalVCounterPort)) {
			setModalWarnMessage('VCounter Port값을 0~65535의 숫자 형식으로 입력해주세요.');
			return
		} else if (!portRegExp2.test(modalVCounterPort)) {
			setModalWarnMessage('VCounter Port값을 0~65535의 숫자 형식으로 입력해주세요.');
			return
		} else if (modalVCounterLocation === undefined || modalVCounterLocation === '') {
			setModalWarnMessage('*설치 위치를 입력하세요.');
			return
		} else if (modalVCounterInstallType === '') {
			setModalWarnMessage('*VCounter 종류를 선택하세요.');
			return
		} else if (modalVCounterLocation.length > 10) {
			setModalWarnMessage('*설치 위치명은 최대 10자 입니다.');
			return
		}

		try {
			addVCounter({
				id: modalCurrentVCounter,
				name: modalCurrentVCounter,
				building_idx: 0,
				building_service_type: 'observer',
				floor_idx: 0,
				type: 'vcounter',
				ipaddress: modalVCounterIpaddress,
				port: modalVCounterPort,
				location: modalVCounterLocation,
				install_type: modalVCounterInstallType
			})
			handleCancel();
		} catch (err) {
			console.log(err);
		}
	}
	const handleCancel = () => {
		setShow({ show: false });
	}

	const VCounter_options = [
		{ value: '', label: '선택 안 함' },
		{ value: 'in', label: '입구' },
		{ value: 'out', label: '출구' },
		{ value: 'in-out', label: '입출구' }
	]

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
								<Form.Control type='text' maxLength='50' name='modalCurrentVCounter' value={modalCurrentVCounter} onChange={handleChangeVCounter} placeholder='VCounter의 이름을 입력하세요.' />
							</Form.Group>
							<Form.Group controlId="formIpaddress">
								<Form.Label>IP Address (*필수)</Form.Label>
								<Form.Control type='text' maxLength='15' name='modalVCounterIpaddress' value={modalVCounterIpaddress} onChange={handleChangeVCounter} placeholder='VCounter의 IP를 입력하세요.' />
							</Form.Group>
							<Form.Group controlId="formPort">
								<Form.Label>Port (*필수)</Form.Label>
								<Form.Control type='int' maxLength='5' name='modalVCounterPort' value={modalVCounterPort} onChange={handleChangeVCounter} placeholder='VCounter의 Port를 입력하세요.' />
							</Form.Group>
							<Form.Group controlId="formLocation">
								<Form.Label>설치 위치 (*필수)</Form.Label>
								<Form.Control type='text' maxLength='15' name='modalVCounterLocation' value={modalVCounterLocation} onChange={handleChangeVCounter} placeholder='VCounter의 설치 위치를 입력하세요.' />
							</Form.Group>
							<Form.Group controlId='formType'>
								<Form.Label>종류 (*필수)</Form.Label>
								<Select
									className={styles.type_option}
									options={VCounter_options}
									name="modalVCounterInstallType"
									onChange={handleChangeVCounterInstallType}
									value={VCounter_options.filter(obj => obj.value === modalVCounterInstallType)}
								/>
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
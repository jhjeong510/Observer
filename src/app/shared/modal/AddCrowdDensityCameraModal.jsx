import React, { useState } from 'react';
import styles from './AddCrowdDensityCameraModal.module.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { addCrowdDensityCamera } from '../../dashboard/api/apiService';

export default function AddCrowdDensityCameraModal({ show, setShow, message, title, callback, clickPoint, cameraList, crowdDensityCameraList, inside, buildingInfo }) {
	const [modalCurrentCamera, setModalCurrentCamera] = useState('');
	const [cameraName, setCameraName] = useState('');
	const [id, setId] = useState('');
	const [cameraId, setCameraId] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	const handleChangeCurrentCamera = async (e) => {
		const { value, camera_id, id } = e;
		console.log(value);
		setModalCurrentCamera(value);
		setId(`${id}`);
		setCameraId(camera_id);
	}

	const handleChangeName = async (e) => {
		const { value } = e.target;
		setCameraName(value);

	}

	const handleConfirm = async () => {
		const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
		if (modalCurrentCamera === '') {
			setModalWarnMessage('카메라를 선택하세요.');
			return
		}
		if (cameraName.trim() === '') {
			setModalWarnMessage('해당 카메라의 이름을 입력해주세요.');
			return;
		}
		if (!regex.test(cameraName.trim())) {
			setModalWarnMessage('해당 카메라의 이름을 한글, 영어, 숫자로 입력해주세요.');
			return;
		}
		if (cameraName.trim().length < 2 || cameraName.trim().length > 50) {
			setModalWarnMessage('해당 카메라의 이름을 2자 이상 50자 이하로 입력해주세요.');
			return;
		}
		if (crowdDensityCameraList.length > 0 && crowdDensityCameraList.some((crowdCamera) => crowdCamera.name === cameraName)) {
			setModalWarnMessage('해당 카메라의 이름이 이미 있습니다.')
			return;
		}

		try {
			const parsingIpAndPort = modalCurrentCamera && modalCurrentCamera.length > 0 && modalCurrentCamera.split('//')[1].split('/')[0];
			let ipaddress;
			let rtsp_port
			if (parsingIpAndPort) {
				ipaddress = parsingIpAndPort.split(':')[0];
				rtsp_port = parsingIpAndPort.split(':')[1];
			}
			if (ipaddress && cameraName && cameraId && rtsp_port) {
				let data = {
					ipaddress,
					name: cameraName,
					id,
					camera_id: cameraId,
					rtsp_port
				}
				const res = await addCrowdDensityCamera(data)
				if (res && res.data && res.data.message && res.data.message === 'success') {
					return handleCancel();
				}
			}
		} catch (err) {
			console.log('set parking camera name err: ', err);
		}
		handleCancel();
	}
	const handleCancel = () => {
		setModalCurrentCamera('')
		setShow({ show: false });
	}

	const camera_options = [{ label: '선택 안 함', value: '', camera_id: '' }].concat(
		cameraList && cameraList.sort((a, b) => a.idx - b.idx).filter((camera) => camera.cameraid.includes('crowd')).filter((camera) => !(crowdDensityCameraList.length > 0 && crowdDensityCameraList.map(crowdCamera => crowdCamera.rtsp_url).includes(camera.ipaddress))).map((camera, index) => {
			if (camera.ipaddress) {
				return { label: ((camera.cameraname ? (camera.cameraname + ' ') : '') + '(' + camera.ipaddress + ')'), value: camera.ipaddress, camera_id: camera.cameraid, id: parseInt(camera.cameraid[camera.cameraid.length - 1]) }
			}
		}))


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
							<Select
								name="addCrowdDensityCamera"
								className={styles.camera_select}
								onChange={handleChangeCurrentCamera}
								value={camera_options.filter((camera) => (camera && camera.value) === modalCurrentCamera)}
								options={camera_options}
							>
							</Select>
							{/* <br /> */}
							<Form.Group controlId="formName">
								<Form.Label>이름 (*필수)</Form.Label>
								<Form.Control className={styles.name_input} type='text' maxLength='50' name='crowd_density_camera_name' value={cameraName} onChange={handleChangeName} placeholder='카메라의 이름을 입력하세요.' />
							</Form.Group>
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
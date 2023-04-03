import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { setScheduleGroup } from '../../dashboard/api/apiService';

export default function HandleVitalsensorScheduleModal({ show, setShow, message, title, callback, selectObject, clickPoint, inside, vitalsensorScheduleList }) {
	const [modalWarnMessage, setModalWarnMessage] = useState('');
	const [modalCurrentScheduleGroup, setModalCurrentScheduleGroup] = useState('');

	const handleChangeApplySchduleGroup = (e) => {
		setModalCurrentScheduleGroup(e.currentTarget.value);
	}
	const handleConfirm = () => {
		// const device_type = selectObject.device_type;
		// const service_type = selectObject.service_type;
		const groupName = modalCurrentScheduleGroup;
		const ipaddress = selectObject.data.ipaddress;
		try {
			setScheduleGroup({
				groupName,
				ipaddress
			})
		} catch (err) {
			console.log('바이탈센서 스케줄 할당 오류: ', err);
		}
		handleCancel();
	}
	const handleCancel = (e) => {
		if (e) {
			e.preventDefault();
		}
		setShow({ show: false });
		setModalWarnMessage('');
		setModalCurrentScheduleGroup('');
	}

	return (
		<div className='HandleVitalsensorScheduleModal'>
			{show ?
				<Modal show={show} onHide={handleCancel} animation={true}>
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group controlId="Idx">
								<Form.Label>{message}</Form.Label>
								<Form>
									<select className="form-control groupSelect" onChange={handleChangeApplySchduleGroup} value={modalCurrentScheduleGroup}>
										<option>{selectObject && selectObject.data && selectObject.data.schedule_group ? selectObject.data.schedule_group : '스케줄 그룹 선택'}</option>
										<option value={'none'} disabled>-------------------------------------------------</option>
										<option value={'없음'}>선택 해제</option>
										{vitalsensorScheduleList && vitalsensorScheduleList.map((data, index) => {
											return <option key={index} value={data.name}>{data.name}</option>
										})}
									</select>
								</Form>
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleConfirm}>
							적용
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
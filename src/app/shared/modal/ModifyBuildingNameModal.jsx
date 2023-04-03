import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { modifyBuilding } from '../../dashboard/api/apiService';

export default function ModifyBuildingNameModal({ show, setShow, message, title, callback, selectObject, buildingList }) {
	const [modalModifyBuilding, setModalModifyBuilding] = useState('');
	const [modalBuildingWarn, setModalBuildingWarn] = useState('');

	const handleChangeModifyBuilding = (e) => {
		setModalModifyBuilding(e.currentTarget.value);
	}

	const handleConfirm = () => {
		if (modalModifyBuilding === undefined || modalModifyBuilding === '') {
			setModalBuildingWarn('*건물 이름을 입력하세요.');
			return
		}
		if (modalModifyBuilding && modalModifyBuilding.length > 10) {
			setModalBuildingWarn('*건물 이름 글자수 제한을 초과했습니다. (10자 이내)');
			return
		}
		if (modalModifyBuilding === selectObject.data.name) {
			setModalBuildingWarn('*현재 건물 이름과 동일합니다.');
			return
		}
		const checkDuplicateBuilding = buildingList.find((building) => building.name === modalModifyBuilding);
		if (checkDuplicateBuilding) {
			setModalBuildingWarn('*동일한 이름의 건물이 있습니다.');
			return
		}
		try {
			modifyBuilding({
				name: selectObject.data.name,
				modifyName: modalModifyBuilding,
				service_type: 'observer'
			})
		} catch (err) {
			console.log('빌딩 이름 수정: ', err);
		}
		handleCancel();
	}
	const handleCancel = () => {
		setModalModifyBuilding('');
		setModalBuildingWarn('');
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
							<Form.Group controlId="Idx">
								<Form.Label>{message}</Form.Label>
								<input className="form-control" onChange={handleChangeModifyBuilding} value={modalModifyBuilding || ''} placeholder={selectObject.data.name} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}>
								</input>
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>{modalBuildingWarn || ''}</Form.Text>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleConfirm}>
							수정
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
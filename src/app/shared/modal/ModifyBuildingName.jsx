import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { modifyBuilding } from '../../dashboard/api/apiService';

export default function ModifyBuildingName({ show, setShow, message, title, callback, selectObject }) {
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
		if (modalModifyBuilding === selectObject._objects[0].data.name) {
			setModalBuildingWarn('*현재 건물 이름과 동일합니다.');
			return
		}
		const checkDuplicateBuilding = this.props.buildingList.find((building) => building.name === this.state.modalmodifyBuilding);
		if (checkDuplicateBuilding) {
			this.setState({ modalBuildingWarn: '*동일한 이름의 건물이 있습니다.' });
			return
		}
		try {
			modifyBuilding({
				name: selectObject._objects[0].data.name,
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
								<input className="form-control" onChange={handleChangeModifyBuilding} value={modalModifyBuilding || ''} placeholder={selectObject._objects[0].data.name} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}>
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
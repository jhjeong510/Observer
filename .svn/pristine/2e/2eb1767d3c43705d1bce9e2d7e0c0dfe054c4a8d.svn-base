import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { removeFloor } from '../../dashboard/api/apiService';

export default function RemoveFloorModal({ show, setShow, message, title, callback, clickPoint, selectObject, floorList }) {
	const [floorLists, setFloorList] = useState([]);
	const [modalGroupImageId, setModalGroupImageId] = useState('');
	const [modalWarnMessage, setModalWarnMessage] = useState('');

	useEffect(() => {
		let isLoaded = true;
		if (isLoaded) {
			setFloorList(floorList);
		}
		return () => {
			isLoaded = false;
		}
	}, [floorList])

	const handleChangeGroupImageId = async (e) => {
		setModalGroupImageId(e.currentTarget.value);
	}

	let iconType = '';
	let selectTargetBuilding = selectObject ? selectObject : '';

	if (selectObject && selectObject._objects) {
		switch (selectObject.data.type) {
			case 'building':
				iconType = '건물';
				break;
			case 'ebell':
				iconType = '비상벨';
			default:
				break;
		}
	}

	const handleConfirm = () => {
		if (modalGroupImageId === undefined || modalGroupImageId === '') {
			setModalWarnMessage('*층을 선택하세요.');
			return
		}
		const floorIdx = floorList.find((floor) => floor.name === modalGroupImageId).idx;
		removeFloor({
			floorName: modalGroupImageId,
			buildingIdx: String(selectObject.data.buildingIdx),
			serviceType: 'observer',
			floorIdx: String(floorIdx),
		})
		handleCancel();
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
					{/* <Modal.Body>{iconType + '을 ' + message}</Modal.Body> */}
					<Modal.Body>
						<Form>
							<Form.Group controlId="Idx">
								<Form.Group controlId="formFloorId">
									<Form.Label>{message}</Form.Label>
									<select className="form-control floorImage" onChange={handleChangeGroupImageId} value={modalGroupImageId}>
										<option></option>
										{floorLists && floorLists.map((floor, index) => {
											if (selectTargetBuilding) {
												if (floor.building_idx === selectTargetBuilding.data.buildingIdx && floor.service_type === selectTargetBuilding.data.serviceType) {
													return <option key={index} value={floor.name}> {floor.name} </option>
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
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateCrowdDensityThreshold } from '../../dashboard/api/apiService';
import styles from './CrowdDensityThresholdModal.module.css';

export default function CrowdDensityThresholdModal({ show, setShow, message, title, idx, threshold }) {
	const [modalWarnMessage, setModalWarnMessage] = useState('');
	const [updateTreshold, setUpdateTreshold] = useState('');

	const handleConfirm = async () => {
		if (updateTreshold === '') {
			await setModalWarnMessage('임계치를 입력해주세요.');
			return;
		}
		if (isNaN(updateTreshold)) {
			await setModalWarnMessage('임계치를 숫자(정수)로 입력해주세요.');
			return;
		}
		try {
			let data = {
				idx,
				threshold: updateTreshold
			}
			const res = await updateCrowdDensityThreshold(data);
			if (res && res.data && res.data.result && res.data.result.status === 'success') {
				return handleCancel();
			}
		} catch (err) {
			console.error('update crowd density camera threshold err: ', err);
			await setModalWarnMessage('서버에서 임계치 수정 에러 발생');
		}
	}

	const handleChangeTreshold = async (e) => {
		await setUpdateTreshold(e.target.value);
	}

	const handleCancel = (e) => {
		if (e) {
			e.preventDefault();
		}
		setShow({ show: false });
		setModalWarnMessage('');
	}

	return (
		<div className='HandleVitalsensorValueModal'>
			{show ?
				<Modal
					show={show}
					onHide={handleCancel}
					animation={true}
				>
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
						<a href='!#' className={styles.close} onClick={handleCancel} />
					</Modal.Header>
					<Modal.Body>
						<Form>
							<span className='current-crowd_density-value'>현재 임계치 : {threshold ? threshold : '없음'}</span>
							<Form.Group className={styles.form_group}>
								<Form.Label className={styles.label}>군중감지 이벤트<br />임계치 설정</Form.Label>
								<div className={styles.input_box}>
									<Form.Control className={styles.crowd_density_input}
										onChange={handleChangeTreshold}
										onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
									/>
									<Button onClick={handleConfirm}>변경</Button>
								</div>
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
						</Form>
					</Modal.Body>
				</Modal>
				:
				''
			}
		</div>
	)
}
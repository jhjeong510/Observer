import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { setVitalValueFunc } from '../../dashboard/api/apiService';
import styles from './HandleVitalsensorValueModal.module.css';

export default function HandleVitalsensorScheduleModal({ show, setShow, message, title, callback, selectObject, clickPoint, inside, handleCloseVitalsensorValueModal, updateValue }) {
	const [modalWarnMessage, setModalWarnMessage] = useState('');
	const [breathValue, setBreathValue] = useState('');
	const [updateBreathValue, setUpdateBreathValue] = useState('');

	const handleConfirm = async () => {
		if (breathValue === '') {
			await setModalWarnMessage('임계치를 입력해주세요.');
			return;
		}
		if (isNaN(breathValue)) {
			await setModalWarnMessage('임계치를 숫자(정수)로 입력해주세요.');
			return;
		}
		try {
			const res = await setVitalValueFunc(selectObject.ipaddress, breathValue);
			if (res && res.data && res.data.message === 'ok') {
				await setUpdateBreathValue(breathValue);
			} else {
				await setModalWarnMessage('임계치 설정에 실패하였습니다.');
			}
		} catch (err) {
			console.log('바이탈센서 임계치 설정 오류: ', err);
		}
	}

	const handleChangeBreathValue = async (e) => {
		await setBreathValue(e.target.value);
	}

	const handleCancel = (e) => {
		if (e) {
			e.preventDefault();
		}
		setShow({ show: false });
		handleCloseVitalsensorValueModal();
		setModalWarnMessage('');
	}



	return (
		<div className='HandleVitalsensorValueModal'>
			{show ?
				<Modal
					show={show}
					ohHide={handleCancel}
					animation={true}
				>
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
						<a href='!#' className={styles.close} onClick={handleCancel} />
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group id="breathValue">
								<Form.Label>바이탈센서 임계치 설정</Form.Label>
								<div style={{ display: 'flex' }}>
									<Form.Control id={'breath-value-input'}
										onChange={handleChangeBreathValue}
										onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
									/>
									<Button onClick={handleConfirm}>변경</Button>
									<span className='current-breath-value'>{selectObject && selectObject.breath_value ? '(현재 임계치:' + (updateBreathValue !== '' ? updateBreathValue : selectObject.breath_value) + ')' : '(현재 임계치: )'}</span>
								</div>
							</Form.Group>
							<Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
						</Form>
						{/* 
						<Form id="breathValue AutoSet">
							<Form.Group>
								<div style={{ marginTop: '40px' }}>
									<Form.Label>호흡감지센서 자동 임계치 설정</Form.Label>

									<div>
										<DatePicker
											selected={this.state.startDate}
											onChange={(date) => this.handleChangeStartDate(date)}
											selectsStart
											startDate={this.state.startDateForAutoValue}
											// endDate={this.state.endDate}
											className="form-control report-datePicker"
										/>
										<DatePicker
											selected={this.state.startTime}
											onChange={(date) => this.handleChangeStartTime(date)}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={1}
											timeCaption="Time"
											dateFormat="h:mm aa"
											className="form-control report-TimePicker"
										/>
									</div>

									<div style={{ display: 'inline-block' }}>
										<p className='current-breath-value'>최대값: {this.state.maxValue ? this.state.maxValue : ''}</p>
										<p className='current-breath-value'>최소값: {this.state.minValue ? this.state.minValue : ''}</p>
										<p className='current-breath-value'>평균값: {this.state.avgValue ? this.state.avgValue : ''}</p>
									</div>
									<div>
										<Button onClick={(e) => this.breathValueAutoSetting(e, this.state.selectedShape.ipaddress)}>임계치 자동 설정</Button>
										<span className='current-breath-value'>{this.state.autoBreathValue && this.state.autoBreathValue.length > 0 ? '(자동 임계치 적용 값 :' + this.state.autoBreathValue + ')' : '(자동 임계치 적용 값 : )'} </span>
									</div>
									<Form.Text style={{ color: 'red' }}>{this.state.modalAutoBreathValueWarn}</Form.Text>
								</div>
							</Form.Group>
						</Form> */}
					</Modal.Body>
					{/* <Modal.Footer>
						<Button
							variant="primary"
						>
							적용
						</Button>
						<Button
							variant="secondary"
							onClick={handleCancel}
						>
							취소
						</Button>
					</Modal.Footer> */}
				</Modal>
				:
				''
			}
		</div>
	)
}
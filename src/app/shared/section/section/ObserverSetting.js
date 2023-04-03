import React, { Component, Fragment } from 'react';
import { Tab, Col, Row, Nav, Form, Button, ThemeProvider } from 'react-bootstrap';
import axios from 'axios';
import ModalConfirm from '../../../dashboard/ModalConfirm';
import VmsSetting from './VmsSetting';
import BreathSchedule from './BreathSchedule';
import { handleGetSettings, handleUpdateSettings } from '../../../dashboard/api/apiService';
// import VmsSetting from './_VmsSetting';
import styles from './ObserverSetting.module.css';

class ObserverSetting extends Component {

	state = {
		showDelConfirm: false,
		modalConfirmTitle: '',
		modalConfirmMessage: '',
		modalConfirmBtnText: '',
		modalConfirmCancelBtnText: '',

		//세부설정 항목
		observerSettings: [],
		setting_value: 'high',
		condition_setting_value_warn: '',
		period_setting_value_warn: '',
		redZone_setting_value_warn: ''
	}

	handleDelCancel = async (e) => {

    this.setState({
      showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
    });
  }

	handleCancel = async () => {
		this.setState({ showModal: false });
	}

	// handleGetSettings = async () => {
	// 	try {
	// 		const res = await axios.get('/api/observer/setting')
	// 		if(res && res.data && res.data.result && res.data.result.length > 0) {
	// 			this.setState({ observerSettings: res.data.result});
	// 		}
	// 	} catch(err) {
	// 		console.log('Read Observer Settings ERR: ', err);
	// 	}
	// }

	onChange = (e) => {
		this.setState({setting_value: e.target.value});
	}

	handleChangeResolution = async (e) => {
		await this.setState({setting_value: e.currentTarget.value});
		console.log(this.state.setting_value);
	}

	handleGetSettingList = async () => {
		try {
			const settings = await handleGetSettings();
			this.setState({ observerSettings: settings});
		} catch(err) {
			console.log('get setting List err: ', err);
		}		
	}

	handleSettingValue = async (e, idx, name) => {

		e.preventDefault();

		const { setting_value } = this.state;

		if(name === 'vitalsensor Data Storage Period') {
			const periodRegExp = new RegExp('^[0-9]');
			const checkPeriodValue = periodRegExp.test(setting_value);
			if(setting_value === ''){
				this.setState({ period_setting_value_warn: '값을 입력해주세요.' });
				return;
			} else if(!checkPeriodValue) {
				this.setState({ period_setting_value_warn: '값을 숫자로 입력해주세요.(0~60)' });
				return;
			} else if(setting_value > 60){ 
				this.setState({ period_setting_value_warn: '0일 이상 최대 60일 이하로 입력해주세요.' });
				return;
			} else {
				this.setState({ period_setting_value_warn: '' });
			}
		} else if(name === 'vitalsensor Event Condition') {
			const conditionRegExp = new RegExp('^(?!0$)[0-9]{1,3}$');
			const checkCondition = conditionRegExp.test(setting_value);
			if(setting_value === ''){
				this.setState({ condition_setting_value_warn: '값을 입력해주세요.' });
				return;
			} else if(!checkCondition) {
				this.setState({ condition_setting_value_warn: '999 이내의 값으로 초:횟수 형식으로 입력해주세요. 예)60:2' });
				return;
			} else {
				this.setState({ condition_setting_value_warn: '' });
			}
		} else if(name === 'setting detection time for red-zone') {
			const conditionRegExp = new RegExp('^[0-9]');
			const checkCondition = conditionRegExp.test(setting_value);
			if(setting_value === ''){
				this.setState({ redZone_setting_value_warn: '초(s)를 입력해주세요.' });
				return;
			} else if(!checkCondition) {
				this.setState({ redZone_setting_value_warn: '초:횟수 형식으로 입력해주세요. 예)60' });
				return;
			} else {
				this.setState({ redZone_setting_value_warn: '' });
			}
		}

		try {
			const updateSettings = await handleUpdateSettings(idx, name, setting_value);
			this.setState({ observerSettings: updateSettings });
		} catch (err) {
			console.log('Handle Observer Setting Value Func Err: ', err);
		}
	}

	render () {
		return (
			<div>
				<div className="tab-vertical">
					<Tab.Container id="left-tabs-example" defaultActiveKey="vms">
						<Row className='eventType-tab'>
							<Col sm={4} className='observer_setting'>
								<Nav variant="tabs" className="flex-column nav-tabs-vertical">
									<Nav.Item>
										<Nav.Link eventKey="vms">
											VMS
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="detail" onClick={this.handleGetSettingList}>
											세부 설정
										</Nav.Link>
									</Nav.Item>
									{this.props.handleEnableServiceType('vitalsensor') &&
										<Nav.Item>
											<Nav.Link eventKey="schedule">
												<p style={{marginBottom: '1px', fontSize: "0.77rem", textShadow: "2px 2px 2px black" }}>바이탈센서</p> 
												<p style={{marginBottom: '1px', fontSize: "0.77rem", textShadow: "2px 2px 2px black", marginTop: "-0.7px" }}>스케쥴 설정</p>
											</Nav.Link>
										</Nav.Item>
										}
								</Nav>
							</Col>
							<Col sm={8} className='observer_setting'>
								<Tab.Content className="tab-content-vertical">
									<Tab.Pane eventKey="vms">
										<VmsSetting
											VMSList={this.props.VMSList}
											readVMSList={this.props.readVMSList}
										/>
									</Tab.Pane>
									<Tab.Pane eventKey="detail">
										<div className="table-responsive breathSensorValue">
											<table className="table table-bordered breathSensorValue">
												<thead>
													<tr>
														<th> Name </th>
														<th> Setting Value </th>
														<th> Description </th>
														<th> Change Value </th>
														<th> Button </th>
													</tr>
												</thead>
												<tbody>
													{
														this.state.observerSettings && this.state.observerSettings.map((item, index) => {
															return (
																<tr key={index}>
																	<td>{item.name}</td>
																	<td>{item.setting_value ? item.setting_value : item.default_value}{item.name==='vital Data Storage Period'?'일':''}</td>
																	<td>{item.description}</td>
																	<td className='observer-setting-detail-input'>
																		{
																			((item.name === 'vitalsensor Event Condition') && this.props.handleEnableServiceType('vitalsensor')) ?
																				<div>
																					<Form.Control onChange={this.onChange}></Form.Control>
																					{this.state.condition_setting_value_warn && <Form.Text className={styles.valid_warn}>{this.state.condition_setting_value_warn}</Form.Text>}
																				</div>
																			:
																			((item.name === 'vitalsensor Data Storage Period') && this.props.handleEnableServiceType('vitalsensor')) ?
																				<div>
																					<div className='data-storage-period'>
																						<Form.Control onChange={this.onChange} id='data-storage-period-input'></Form.Control>
																						&nbsp;<span>일 (0일: 영구 보관)</span>
																					</div>
																					{this.state.period_setting_value_warn && <Form.Text className={styles.valid_warn}>{this.state.period_setting_value_warn}</Form.Text>}
																				</div>
																				:
																				((item.name === 'setting detection time for red-zone') && this.props.handleEnableServiceType('parkingcontrol')) ?
																				<div>
																					<div>
																						<Form.Control onChange={this.onChange}></Form.Control>
																					</div>
																					<Form.Text className={styles.valid_warn}>{this.state.redZone_setting_value_warn}</Form.Text>
																				</div>
																				:
																				item.name === 'Set Camera Resolution' ?
																					<select onChange={this.handleChangeResolution} value={this.state.setting_value}>
																						<option value="high">high(고해상도)</option>
																						<option value="low">low(저해상도)</option>
																					</select>
																					:
																					<div>
																						<Form.Control onChange={this.onChange}></Form.Control>
																					</div>
																		}
																	</td>
																	<td>
																		<button className={styles.update_btn} onClick={(e) => this.handleSettingValue(e, item.idx, item.name)}>
																			Update
																		</button>
																	</td>
																</tr>
															)
														})
													}
												</tbody>
											</table>
										</div>
									</Tab.Pane>
									{this.props.handleEnableServiceType('vitalsensor') &&
										<Tab.Pane eventKey="schedule">
											<BreathSchedule
												breathSensorList={this.props.breathSensorList}
												breathSensorScheduleList={this.props.breathSensorScheduleList}
											/>
										</Tab.Pane>
									}
								</Tab.Content>
							</Col>
						</Row>
					</Tab.Container>
				</div>
				<ModalConfirm
					showModal = {this.state.showDelConfirm}
          modalTitle = {this.state.modalConfirmTitle}
          modalMessage = {this.state.modalConfirmMessage}
          modalConfirmBtnText = {this.state.modalConfirmBtnText}
          modalCancelBtnText = {this.state.modalConfirmCancelBtnText}
          handleConfirm = {this.handleDelConfirm}
          handleCancel = {this.handleDelCancel}
				/>
			</div>
		);
	}
}

export default ObserverSetting;
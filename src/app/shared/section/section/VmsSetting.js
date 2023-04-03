import React, { Component } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import ModalConfirm from '../../../dashboard/ModalConfirm';
import axios from 'axios';
import styles from './VmsSetting.module.css';

class VmsSetting extends Component {
	state = {
		VMSIP: '',
		VMSPort: '',
		VMSID: '',
		VMSPW: '',
		modalIPWarn: '',
		modalPortWarn: '',
		modalIDWarn: '',
		modalPWWarn: '',
		getVMSArray: [],
		showModal: false,
		modalTitle: '',
		modalMessage: '',
		syncCameraList: true,

		ipList: [],
	}

	handleGetVms = async () => {

		try {
			const result = await axios.get('/api/observer/vms');
			if(result && result.data.result && result.data.result.length > 0) {
				this.setState({ getVMSArray: result.data.result });
			}
			return result;
		} catch(err) {
			console.log('err', err);
		}
	}

	onChange = (e) => {
		this.setState({ [e.currentTarget.name] : e.currentTarget.value });
	}

	handleSyncCameraList = async (checkOption) => {
		await this.setState({ syncCameraList: !this.state.syncCameraList })
		const action = checkOption === 'VMS 수정' ? '수정':'삭제'
		const warnText = `선택한 VMS정보를 ${action}하시겠습니까?`;
		const warnText2 = (action === '수정')?'수정 시 해당 VMS에 등록된 카메라가 모두 추가됩니다.(중복 시 덮어쓰기)':'삭제 시 해당 VMS에 등록된 카메라도 모두 삭제됩니다.';
		const printWarnMsg = () => {
			return (
				<>
					{warnText}
					<br />
					{this.state.syncCameraList ? <p style={{color: 'red', marginTop: '5px', marginBottom: '1px'}}>{warnText2}</p>:''}
				</>
			)
		}
		this.setState({ modalConfirmMessage: printWarnMsg() });
	}

	handleCancel = async () => {
		this.setState({ showModal: false });
	}

	handleAddVMS = async (e) => {
		e.preventDefault();

		const { VMSIP, VMSPort, VMSID, VMSPW } = this.state;
		const ipRegExp =  new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
		const ipResult = ipRegExp.test(VMSIP);
		const portRegExp = new RegExp('^[0-9]+$');
		const portResult = portRegExp.test(VMSPort);
		const portRegExp2 = new RegExp('^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$');
		const portResult2 = portRegExp2.test(VMSPort);

		if(VMSIP === ''){
			this.setState({ modalIPWarn: 'IP Address 값을 입력해주세요.' });
		} else if(!ipResult) {
			this.setState({ modalIPWarn: 'IP Address값을 올바른 IP형식으로 입력해주세요.' });
		} else {
			this.setState({ modalIPWarn: '' });
		}

		if(VMSPort === '') {
			this.setState({ modalPortWarn: 'VMS Port\n값을 입력해주세요.' });
		} else if(portResult === false) {
			this.setState({ modalPortWarn: 'VMS Port값을 0~65535의 숫자 형식으로 입력해주세요.' });
		} else if(portResult2 === false) {
			this.setState({ modalPortWarn: 'VMS Port값을 0~65535의 숫자 형식으로 입력해주세요.' });
		} else {
			this.setState({ modalPortWarn: '' });
		}

		if(VMSID === '') {
			this.setState({ modalIDWarn: 'ID를 입력해주세요.' });
		} else {
			this.setState({ modalIDWarn: '' });
		}

		if(VMSPW === '') {
			this.setState({ modalPWWarn: 'Password를 입력해주세요.' });
		} else {
			this.setState({ modalPWWarn: '' });
		}

		if(VMSIP === '' || VMSPort === '' || VMSID === '' || VMSPW === '' || ipResult === false || portResult === false || portResult2 === false ) {
			return;
		}

		const checkDuplicate = this.props.VMSList.find((vms) => vms.ipaddress === this.state.VMSIP);
		if(checkDuplicate && checkDuplicate !== undefined) {
			this.setState({ showModal: true  });
			this.setState({ modalTitle: 'VMS 중복' });
			this.setState({ modalMessage: "입력하신 VMS정보가 이미 존재합니다." });
			return;
		} else {
			this.setState({ showConfirmModal: true });
			this.setState({ modalConfirmTitle: 'VMS 추가'});
			this.setState({ modalConfirmMessage: '입력하신 VMS를 추가하시겠습니까?' });
			this.setState({ modalConfirmBtnText: '확인' });
			this.setState({ modalConfirmCancelBtnText: '취소'});
		}
	}

	handleModifyVMS = async (e) => {
		e.preventDefault();
		
		const { VMSIP, VMSPort, VMSID, VMSPW } = this.state;
	
		const ipRegExp =  new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
		const ipResult = ipRegExp.test(VMSIP);
		const portRegExp = new RegExp('^[0-9]+$');
		const portResult = portRegExp.test(VMSPort);
		const portRegExp2 = new RegExp('^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$');
		const portResult2 = portRegExp2.test(VMSPort);

		if(VMSIP === ''){
			this.setState({ modalIPWarn: 'IP Address 값을 입력해주세요.' });
		} else if(!ipResult) {
			this.setState({ modalIPWarn: 'IP Address값을 올바른 IP형식으로 입력해주세요.' });
		} else {
			this.setState({ modalIPWarn: '' });
		}

		if(VMSPort === '') {
			this.setState({ modalPortWarn: 'VMS Port\n값을 입력해주세요.' });
		} else if(portResult === false) {
			this.setState({ modalPortWarn: 'VMS Port값을 0~65535의 숫자 형식으로 입력해주세요.' });
		} else if(portResult2 === false) {
			this.setState({ modalPortWarn: 'VMS Port값을 0~65535의 숫자 형식으로 입력해주세요.' });
		} else {
			this.setState({ modalPortWarn: '' });
		}

		if(VMSID === '') {
			this.setState({ modalIDWarn: 'ID를 입력해주세요.' });
		} else {
			this.setState({ modalIDWarn: '' });
		}

		if(VMSPW === '') {
			this.setState({ modalPWWarn: 'Password를 입력해주세요.' });
		} else {
			this.setState({ modalPWWarn: '' });
		}

		if(VMSIP === '' || VMSPort === '' || VMSID === '' || VMSPW === '' || ipResult === false || portResult === false || portResult2 === false ) {
			return;
		}
		
		if (!this.state.ipList || (this.state.ipList && this.state.ipList.length === 0)) {
			this.setState({ showModal: true });
			this.setState({ modalTitle: 'VMS 수정'});
			this.setState({ modalMessage: "수정하실 VMS를 선택해주세요."});
			return;
		} 

		if(VMSIP === '' || VMSPort === '' || VMSID === '' || VMSPW === '') {
			this.setState({ showModal: true });
			this.setState({ modalTitle: 'VMS 수정'});
			this.setState({ modalMessage: "변경정보 입력 후 수정이 가능합니다."});
			return;
		}

		if(this.state.ipList && this.state.ipList.length > 1) {
			this.setState({ showModal: true });
			this.setState({ modalTitle: 'VMS 수정'});
			this.setState({ modalMessage: "수정하실 VMS를 1개만 선택하세요."});
			return;
		}

		try {
			if(this.props.VMSList && this.props.VMSList.some((detailVms) => (detailVms.ipaddress === VMSIP) && (detailVms.port === VMSPort) &&  (detailVms.id === VMSID) && (detailVms.password === VMSPW))) {
				this.setState({ showModal: true });
				this.setState({ modalTitle: 'VMS 중복'});
				this.setState({ modalMessage: "입력하신 VMS정보가 이미 설정되었습니다."});
				return;
			} else {
				const warnText = '선택된 VMS정보를 수정하시겠습니까?';
				const warnText2 = '(수정 시 해당 VMS에 등록된 카메라가 모두 추가됩니다.(중복 시 덮어쓰기))';
				const printWarnMsg = () => {
					return (
						<>
							{warnText}
							<br />
							{this.state.syncCameraList ? <p style={{color: 'red', marginTop: '5px', marginBottom: '1px'}}>{warnText2}</p>:''}
						</>
					)
			}
				this.setState({ showConfirmModal: true });
				this.setState({ modalConfirmTitle: 'VMS 수정'});
				this.setState({ modalConfirmMessage: printWarnMsg() });
				this.setState({ modalConfirmBtnText: '확인' });
				this.setState({ modalConfirmCancelBtnText: '취소'});
			}
		} catch(err) {
			console.log('vms modify err:', err);
		}
	}

	handleAddConfirm = async () => {

		const { VMSIP, VMSPort, VMSID, VMSPW } = this.state;

		try {
			const res = await axios.post('/api/observer/vms', {
				VMSIP,
				VMSPort,
				VMSID,
				VMSPW,
			})
			console.log('Create VMS Setting: ', res);
			if(res && res.data && res.data.result && res.data.result.rowCount === 1) {
				this.setState({ showModal: true })
				this.setState({ modalTitle: 'VMS 추가 완료' })
				this.setState({ modalMessage: 'VMS 추가를 완료했습니다.' });
			} else {
				this.setState({ showModal: true })
				this.setState({ modalTitle: 'VMS 추가 에러' })
				this.setState({ modalMessage: 'VMS 추가 에러.' });
			}
			return res
		} catch (err) {
			console.log('Create VNS err: ', err);
			if(err.response.status === 400){
				console.log(err.response.data.error);
				this.setState({ showModal: true })
				this.setState({ modalTitle: 'VMS 추가'})
				// this.setState({ modalMessage: `${err.response.data.error}`});
				this.setState({ modalMessage: 'VMS 비밀번호는 4~12자 사이로 입력하세요.' });
			}
		} finally {
			this.setState({
				showConfirmModal: false,
				modalConfirmTitle: '',
				modalConfirmMessage: '',
				modalConfirmBtnText: '',
				modalConfirmCancelBtnText: '',
				VMSIP: '',
				VMSPort: '',
				VMSID: '',
				VMSPW: '',
			});
		}
	}	

	handleModifyConfirm = async () => {
		if (this.state.ipList && this.state.ipList.length > 0) {
			try {
				const { VMSIP, VMSPort, VMSID, VMSPW } = this.state;
				const res = await axios.put('/api/observer/vms', {
					ipaddress: this.state.ipList,
					VMSIP,
					VMSPort,
					VMSID,
					VMSPW,
					syncCameraList: this.state.syncCameraList
				})
				console.log('Modify VMS Setting:', res);
				this.handleGetVms();
				if(res && res.data && res.data.result && res.data.result === 1){
					this.setState({ 
						showModal: true, 
						VMSIP: '',
						VMSPort: '',
						VMSID: '',
						VMSPW: '',
						ipList: []
					});
					
					this.setState({ modalTitle: 'VMS 수정'});
					this.setState({ modalMessage: '입력하신 VMS정보로 수정하였습니다.'});
				}
			} catch (err) {
				console.log('Modify VMS err: ', err);
			} finally {
				this.setState({
					showConfirmModal: false,
					modalConfirmTitle: '',
					modalConfirmMessage: '',
					modalConfirmBtnText: '',
					modalConfirmCancelBtnText: '',
					syncCameraList: false,
					ipList: []
				});
			}
		} else {
			this.setState({ showModal: true })
			this.setState({ modalTitle: 'VMS 수정'});
			this.setState({ modalMessage: '선택된 VMS가 없습니다.' });
			this.setState({ showConfirmModal: false, });
		}
	}

	handleDelConfirm = async () => {
		if (this.state.ipList && this.state.ipList.length > 0) {
			try {
				const res = await axios.delete('/api/observer/vms', {
					data : {
						ipaddress: this.state.ipList,
						syncCameraList: this.state.syncCameraList
					}
				});
				if(res && res.data && res.data.result > 0){
					this.setState({ 
						VMSIP: '',
						VMSPort: '',
						VMSID: '', 
						VMSPW: '',
						ipList: [],
						syncCameraList: false
					});
					console.log('Delete VMS Setting info Successfully: ', res);
				}
				return res;
			} catch(err) {
				console.log('Delete VMS Setting Info err: ', err);
			} finally {
				this.setState({
					showConfirmModal: false,
					modalConfirmTitle: '',
					modalConfirmMessage: '',
					modalConfirmBtnText: '',
					modalConfirmCancelBtnText: '',
					syncCameraList: false,
					ipList: []
				});
			}
		} else {
			this.setState({ showModal: true })
			this.setState({ modalTitle: 'VMS 삭제'});
			this.setState({ modalMessage: '선택된 VMS가 없습니다.' });
			this.setState({ showConfirmModal: false });
		}
	}

	handleDelCancel = async (e) => {
    console.log('confirm modal: cancel');

    this.setState({
      showConfirmModal: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
    });
  }

	handleDeleteVMS = async (e) => {
		e.preventDefault();
		if(this.state.ipList && this.state.ipList.length === 0) {
			this.setState({ showModal: true })
			this.setState({ modalTitle: 'VMS 삭제'});
			this.setState({ modalMessage: '삭제할 VMS를 선택해주세요.' });
			return;
		} else if(this.props.VMSList === undefined || (this.props.VMSList && this.props.VMSList.length === 0)) {
			this.setState({ showModal: true })
			this.setState({ modalTitle: 'VMS 삭제'});
			this.setState({ modalMessage: '설정된 VMS가 없습니다.' });
			return;
		} else {
			const warnText = '선택된 VMS정보를 삭제하시겠습니까?';
			const warnText2 = '(삭제 시 해당 VMS에 등록된 카메라도 모두 삭제됩니다.)';
			const printWarnMsg = () => {
				return (
					<>
						{warnText}
						<br />
						{this.state.syncCameraList ? <p style={{color: 'red', marginTop: '5px', marginBottom: '1px'}}>{warnText2}</p>:''}
					</>
				)
			}
			this.setState({ showConfirmModal: true });
			this.setState({ modalConfirmTitle: 'VMS 삭제'});
			this.setState({ modalConfirmMessage: printWarnMsg() });
			this.setState({ modalConfirmBtnText: '확인' });
			this.setState({ modalConfirmCancelBtnText: '취소'});
		}
	}

	selectVMS = async (value) => {

		const currentIndex = this.state.ipList.indexOf(value);

    const newIpList = [...this.state.ipList];

    if(currentIndex === -1) {
      newIpList.push(value)
    } else {
			newIpList.splice(currentIndex, 1);
    }
    this.setState({ ipList: newIpList });
	}

	render () {
		return (
			<div>
				<div className="vms configuration">
					<div className="card vms">
						<div className="card-body">
							<h4 className="card-title vms">VMS 서버</h4>
							<h5 className="vms-card-description"> VMS 서버 설정 및 관리</h5>
							<form className="forms-vms-configuration">
								<Form.Group>
									<label>IP Address</label>
									<Form.Control type="text" style={{ width: '160px' }} className="vms-ipaddress" name="VMSIP" placeholder={"IP 주소를 입력하세요."} onChange={this.onChange} value={this.state.VMSIP}/>
									<Form.Text style={{ color: 'red', width: '175px' }}>{this.state.modalIPWarn}</Form.Text>
								</Form.Group>
								<Form.Group>
									<label>Port</label>
									<Form.Control type="int" style={{ width: '175px'}} className="vms-port" name="VMSPort" placeholder={'포트 번호를 입력하세요.'} onChange={this.onChange} value={this.state.VMSPort}/>
									<Form.Text style={{ color: 'red',  width: '175px' }}>{this.state.modalPortWarn}</Form.Text>
								</Form.Group>
								<Form.Group>
									<label>ID</label>
									<Form.Control type="text" style={{ width: '130px'}} className="vms-id" name="VMSID" placeholder={'ID를 입력하세요.'} onChange={this.onChange} value={this.state.VMSID} />
									<Form.Text style={{ color: 'red', width: '130px' }}>{this.state.modalIDWarn}</Form.Text>
								</Form.Group>
								<Form.Group>
									<label>Password</label>
									<Form.Control type="password" style={{ width: '170px' }} className="vms-pw" name="VMSPW" placeholder={'비밀번호를 입력하세요.'} onChange={this.onChange} value={this.state.VMSPW} />
									<Form.Text style={{ color: 'red', width: '170px' }}>{this.state.modalPWWarn}</Form.Text>
								</Form.Group>
							</form>
							{
								(this.props.VMSList && this.props.VMSList.length > 0) ?
									<div className="vms-buttons">
										<button type="submit" className={styles.add_btn} onClick={(e) => this.handleAddVMS(e)}>추가</button>
										<button type="submit" className={styles.modify_btn} onClick={(e) => this.handleModifyVMS(e)}>수정</button>
										<button type="delete" className={styles.delete_btn} onClick={(e) => this.handleDeleteVMS(e)}>삭제</button>
									</div>
									:
									<div className="vms-buttons">
										<button type="submit" className="btn btn-primary vms-config" onClick={(e) => this.handleAddVMS(e)}>추가</button>
									</div>
							}
							{
								(this.props.VMSList && this.props.VMSList.length > 0) ?
									<Table striped bordered className='VMS'>
										<thead style={{ display: 'table'}}>
											<tr className='setting-vms-list'>
												<th style={{ width: '4.3%' }}></th>
												<th style={{ width: '32.8%' }}>IP Address</th>
												<th style={{ width: '12.3%' }}>Port</th>
												<th style={{ width: '16.4%' }}>ID</th>
												<th style={{ width: '18%' }}>Password</th>
											</tr>
										</thead>
											{
												this.props.VMSList && this.props.VMSList.sort((a,b)=> a.ipaddress - b.ipaddress).map((vms, index) => {
													return (
														<tbody className='vms-setting-list'  style={{ display: 'table'}} key={index}>
															<tr className='setting-vms-list'> 
																<td name='vmsList' className="registered-check"> 
																	<Form >
																		<Form.Check
																			id={vms.ipaddress}
																			key={index}
																			className='vms radioButton'
																			type="checkbox"
																			name={vms.name}
																			value={vms.ipaddress}
																			checked={this.state.ipList.indexOf(vms.ipaddress) === -1 ? false:true}
																			onChange={() => this.selectVMS(vms.ipaddress)}
																		/>
																	</Form>
																</td>
																<td className="registered-vmsIP">{vms.ipaddress}</td>
																<td className="registered-vmsPort">{vms.port}</td>
																<td className='registered-vmsId'>{vms.id}</td>
																<td type='password' className="registered-vmsPW">{vms.password}</td>
															</tr>
														</tbody>
													)
												})
											}
									</Table>
									:
									<Table striped bordered className='VMS'>
										<thead style={{ display: 'table'}}>
											<tr className='setting-vms-list'>
												<th style={{ width: '4.3%' }}></th>
												<th style={{ width: '32.8%' }}>IP Address</th>
												<th style={{ width: '12.3%' }}>Port</th>
												<th style={{ width: '16.4%' }}>ID</th>
												<th style={{ width: '18%' }}>Password</th>
											</tr>
										</thead>
										<tbody className='vms-setting-list'  style={{ display: 'table'}}>
											<tr className='setting-vms-list'> 
												<td className="registered-no-vms" colSpan={6}>등록된 VMS가 없습니다.</td>
											</tr>
										</tbody>
									</Table>
							}							
						</div>				
					</div>								
				</div>
				<Modal show={this.state.showModal} centered>
					<Modal.Header className="vms-alert-modal">
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{this.state.modalMessage}</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.handleCancel}>
							확인
						</Button>
					</Modal.Footer>
				</Modal>										
				<ModalConfirm
					showModal = {this.state.showConfirmModal}
          modalTitle = {this.state.modalConfirmTitle}
          modalMessage = {this.state.modalConfirmMessage}
          modalConfirmBtnText = {this.state.modalConfirmBtnText}
          modalCancelBtnText = {this.state.modalConfirmCancelBtnText}
          handleConfirm = {this.state.modalConfirmTitle === 'VMS 추가'? this.handleAddConfirm: this.state.modalConfirmTitle === 'VMS 수정'? this.handleModifyConfirm: this.handleDelConfirm}
          handleCancel = {this.handleDelCancel}
					checkOption={this.state.modalConfirmTitle !== 'VMS 추가' ? this.state.modalConfirmTitle: ''}
					syncCameraList={this.state.syncCameraList}
					handleSyncCameraList={this.handleSyncCameraList}
				/>
			</div>
		);
	}
}

export default VmsSetting;

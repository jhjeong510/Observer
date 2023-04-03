import React, { Component } from 'react';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import EventTypeSetting from './section/EventTypeSetting';
import NDoctorSetting from './section/NDoctorSetting';
import ObserverSetting from './section/ObserverSetting';
import ServiceTypeSetting from './section/ServiceTypeSetting';

class Setting extends Component {

	state = {
		currentTabName: 'observer setting' 
	}

	handleCurrentTabName = async (value) => {
		this.setState({ currentTabName: value });
	}

	render () {
		return (
			<>
				<Modal 
					show={true}
					size='xl'
					centered
					contentClassName={this.state.currentTabName}
					onHide={this.props.handleCancelSettingModal}
				>
					<Modal.Header className="setting-modal">
						<Modal.Title>설정</Modal.Title>
						<div className="modal-close" style={{left: '-31px'}}>
            	<a href="!#" className="setting-modal-closer" onClick={this.props.handleCancelSettingModal}></a>
          	</div>
					</Modal.Header>
					<Modal.Body>
						<Tabs defaultActiveKey="observer setting" id="uncontrolled-tab-example" className="mb-3" onSelect={this.handleCurrentTabName}>
							<Tab eventKey="observer setting" title="옵저버 설정" className='tab-observer'>
								<ObserverSetting
									breathSensorList={this.props.breathSensorList}
									breathSensorScheduleList={this.props.breathSensorScheduleList}
									VMSList={this.props.VMSList}
									readVMSList={this.props.readVMSList}
									handleEnableServiceType={this.props.handleEnableServiceType}
								/>
							</Tab>
							<Tab eventKey="service use setting" title="서비스 사용 여부" className='tab-service-use'>
								<ServiceTypeSetting 
									serviceTypes={this.props.serviceTypes}
									getServiceTypes={this.props.getServiceTypes}
									handleChangeServiceTypeName={this.props.handleChangeServiceTypeName}
								/>
							</Tab>
							<Tab eventKey="eventType setting" title="이벤트 설정" className='tab-eventType'>
								<EventTypeSetting
									handleEnableServiceType={this.props.handleEnableServiceType}
								/>
							</Tab>
							{
								this.props.handleEnableServiceType('ndoctor')?
									<Tab eventKey="n-doctor setting" title="N-Doctor" className='n-doctor'>
										<NDoctorSetting/>
									</Tab>
									:
									''
							}
							
						</Tabs>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}

export default Setting;
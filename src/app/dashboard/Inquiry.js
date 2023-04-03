import React, { Component } from 'react';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import AllEvent from './AllEvent';
import AccessCtlLog from './AccessCtllog';
import AnprLog from './AnprLog';
import ParkingControlLog from './ParkingControlLog';
import { VcounterLog } from './VcounterLog';

class Inquiry extends Component {

	state = {
		showAlert: false
	}

	handleShowTimeSelectAlert = () => {
		this.setState({ showAlert: !this.state.showAlert });
	}

	render () {
		return (
			<>
				<Modal 
					show={this.props.showInquiryModal}
					size='lg'
					centered
					onHide={this.props.handleShowInquiryModal}
					contentClassName={this.props.defaultActiveKey === 'allEvents' ? 'allEvent' : 'accessCtlLog'} 
				>
					<Modal.Header className="all-Events-modal">
						<Modal.Title>데이터 조회</Modal.Title>
						<div className="modal-close" style={{left: '-31px'}}>
							<a href="!#" className="inquiry-modal-closer" onClick={(e) => this.props.handleShowInquiryModal(e)}></a>
						</div>
					</Modal.Header>
					<Modal.Body id='inquiry-modal'>
						<Tabs defaultActiveKey={this.props.defaultActiveKey === 'allEvents' ? 'allEvent' : this.props.defaultActiveKey === 'ackStatusFalse' ? 'allEvent' : 'accessCtlLog'} id="uncontrolled-tab-example">
              <Tab eventKey="allEvent" title="이벤트" className="test-tab">
								<AllEvent
									handleShowTimeSelectAlert={this.handleShowTimeSelectAlert}
									serviceTypes={this.props.serviceTypes}
									breathIp={this.props.breathIp}
									defaultActiveKey={this.props.defaultActiveKey}
									getEvents={this.props.getEvents}
								/>
              </Tab>
							{
								this.props.handleEnableServiceType('accesscontrol') &&
									<Tab eventKey="accessCtlLog" title="출입기록">
										<AccessCtlLog
											door_id={this.props.door_id}
										/>
									</Tab>
							}
							{
								this.props.handleEnableServiceType('parkingcontrol') &&
									<Tab eventKey="parkingCtlLog" title="주차관제시스템 로그">
										<ParkingControlLog
											parkingCameraUpdate={this.props.parkingCameraUpdate}
											parkingAreaUpdate={this.props.parkingAreaUpdate}
											parkingCoordsUpdate={this.props.parkingCoordsUpdate}
										/>
									</Tab>
							}
							{
								this.props.handleEnableServiceType('parkingcontrol') &&
									<Tab eventKey="vCounterLog" title="VCounter 로그">
										<VcounterLog
										
										/>
									</Tab>
							}
							{
								this.props.serviceTypes && this.props.serviceTypes.find((serviceType) => serviceType.name === 'anpr' && serviceType.setting_value === 'true')?
									<Tab eventKey="anprLog" title="ANPR 차량번호판 인식">
										<AnprLog 
											cameraList={this.props.cameraList}
											handleShowTimeSelectAlert={this.handleShowTimeSelectAlert}
										/>
									</Tab>
									:
									'' 
							}
            </Tabs>
					</Modal.Body>
				</Modal>
			<div>
				<Modal
          size="sm"
          show={this.state.showAlert}
          onHide={this.handleShowTimeSelectAlert}
          aria-labelledby="example-modal-sizes-title-sm"
        >
					<Modal.Header closeButton>
            <Modal.Title>날짜 미입력</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>이벤트 발생 날짜를 입력하세요..</p>
          </Modal.Body>

          <Modal.Footer className="flex-wrap">
            <Button variant="success btn-sm m-2" onClick={this.handleShowTimeSelectAlert}>확인</Button>
          </Modal.Footer>
        </Modal>
			</div>
			</>
		);
	}

}

export default Inquiry;
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import DetailBreathSensor from './section/DetailBreathSensor';
import breathSensorIcon_stabled from "../../assets/icon/breathSensorIcon_stabled.png";
import breathSensorIcon_disabled from "../../assets/icon/breathSensorIcon_disabled.png";
import breathSensorIcon_event from "../../assets/icon/breathSensorIcon_event.gif";
import breathSensorIcon_off from "../../assets/icon/breathSensorIcon_off.png";
import styles from './BreathSensorList.module.css';
import { setAcknowledge } from './api/apiService';
import { UserInfoContext } from '../context/context';

class BreathSensorList extends Component {

  static contextType = UserInfoContext; 

  state = {
    DetailBreathSensor: {
      ipaddress: undefined,
      use_status: undefined,
      name: undefined
    },
    showAlert: false,
    target: undefined,
    location: undefined
  }

  handleCreateContextMenu = (event, ipaddress, use_status, name) => {

    console.log(event);

    const ctxMenu = document.getElementById('detailBreathSensor_context_menu');
    const scrollHeight = document.getElementsByClassName('breathSensorListRows');
    if(scrollHeight && scrollHeight.length > 0 && scrollHeight[0] && scrollHeight[0].scrollTop > 0){
      ctxMenu.style.display = 'block';
      ctxMenu.style.top = (event.target.offsetParent.offsetTop + event.target.offsetTop - scrollHeight[0].scrollTop + event.target.clientHeight/2)+'px'
      ctxMenu.style.left = (event.target.offsetParent.offsetLeft+event.target.offsetLeft + event.target.clientWidth/2)+'px';
    } else {
      ctxMenu.style.display = 'block';
      ctxMenu.style.top = (event.target.offsetParent.offsetTop + event.target.offsetTop + event.target.clientHeight/2)+'px'
      ctxMenu.style.left = (event.target.offsetParent.offsetLeft+event.target.offsetLeft + event.target.clientWidth/2)+'px';
    }

    this.setState({ 
      DetailBreathSensor: {
        ipaddress: ipaddress,
        use_status: use_status,
        name: name
      }
    });
  }

  handleClearContextMenu = (event) => {
    const ctxMenu = document.getElementById('detailBreathSensor_context_menu');
    if(ctxMenu){
      ctxMenu.style.display = 'none';   
      ctxMenu.style.top = null;
      ctxMenu.style.left = null;
    }
  } 

  handleBreathSensor = async (ipaddress, use_status, location, name) => {

    try {
      const status = use_status==='true'?'false':'true';
      const res = await axios.put('/api/observer/vitalsensorStatus', {
        ipaddress,
        status
      })
      if(res.status === 200){
        this.props.handleShowToast('success', `${location} ${name} ${use_status === 'true' ? 'OFF':'ON'}`, 'breathSensorList')
        return;
      } else {
        this.props.handleShowToast('alert', `${location} ${name} ${use_status === 'true' ? 'OFF 실패':'ON 실패'}`, 'breathSensorList')
      }
      return;
    } catch(err) {
      console.log('호흡센서 작동 제어 Error : ', err);
      this.props.handleShowToast('error', `${location} ${name} ${use_status === 'true' ? 'OFF 실패':'ON 실패'}`, 'breathSensorList')
    }
  }

  handleCloseAlert = async () => {
    this.setState({ showAlert: !this.state.showAlert });
    this.setState({ location: undefined });
    this.setState({ target: undefined });
  }

  handleAck = async (name, device_type, service_type, ipaddress, location) => {
    if(location){
      const data = {
        device_type,
        service_type,
        location,
        acknowledge_user: this.context.id
      }
      return await setAcknowledge(data);
    } else {
      const data = {
        device_id: name,
        device_type,
        service_type,
        ipaddress,
        acknowledge_user: this.context.id
      }
      return await setAcknowledge(data);
    }
  }
  
  render () {
    return (
      <div>
        <Modal 
          show={this.props.breathSensorListShow} 
          contentClassName="breathSensorList" size='xl' 
          centered
          onHide={this.props.handleShowBreathSensorList}
          onClick={this.handleClearContextMenu}
        >
          <Modal.Header className="breathSensorList">
            바이탈센서 목록
            <div className="modal-close" style={{left: '-31px'}}>
              <a href="!#" className="breathSensor-modal-closer" onClick={this.props.handleShowBreathSensorList}></a>
            </div>
          </Modal.Header>
          <Modal.Body className='breathSensorList'>
            <div>
              <div className="row breathSensor">
                <div className='breathSensorList_status'>
                  <span className='breathSensorList_status_total'>총 개수 : {this.props.breathSensors.length}</span>
                  <div className='breathSensor_status'>
                    <span><img src={breathSensorIcon_event} width='26'></img></span>
                    <span className='breathSensorList_status_event'>호흡이상감지 : {this.props.breathSensors.filter((breathSensor) => breathSensor.status === 1).length}</span>
                  </div>
                  <div className='breathSensor_status'>
                    <span><img src={breathSensorIcon_stabled} width='26'></img></span>
                    <span className='breathSensorList_status_stabled'>ON : {this.props.breathSensors.filter((breathSensor) => breathSensor.use_status === 'true' && breathSensor.prison_door_status === 'lock' && breathSensor.status === 0).length}</span>
                  </div>
                  <div className='breathSensor_status'>
                    <span><img src={breathSensorIcon_disabled} width='26'></img></span>
                    <span className='breathSensorList_status_disabled'>OFF : {this.props.breathSensors.filter((breathSensor) => breathSensor.use_status === 'false').length}</span>
                  </div>
                  {/* <div className='breathSensor_status'>
                    <span><img src={breathSensorIcon_unlock} width='26'></img></span>
                    <span className='breathSensorList_status_unlock'>잠금 해제 : {this.props.breathSensors.filter((breathSensor) => breathSensor.use_status === 'true' && breathSensor.prison_door_status === 'unlock').length}</span>
                  </div> */}
                  <div className='breathSensor_status'>
                    <span><img src={breathSensorIcon_off} width='26'></img></span>
                    <span className='breathSensorList_status_off'>장비 이상 : {this.props.breathSensors.filter((breathSensor) => breathSensor.status === 2).length}</span>
                  </div>
                </div>
                <div className='breathSensorListRows'>
                  {
                    this.props.breathSensors && Object.keys(Object.fromEntries(this.props.breathSensors.map((breathSensor) => [breathSensor.location, 0]))).map((location, index) => {
                      return (
                        <div className="grid-margin stretch-card breathSensorList" key={index}>
                          <div className="card breathSensorList">
                            <div className="card-body breathSensorList">
                              <div className='breathSensorListLocation'>
                                <h4 className="card-title breathSensorList">{location}</h4>
                                <button className={styles.turnOffGroupEvent_btn} onClick={() => this.setState({ showAlert: !this.state.showAlert, location: location, target: 'group' })}>그룹 이벤트<br/>알림 해제</button>
                              </div>
                              <div className='breathSensorIcons'>
                                {
                                  this.props.breathSensors.sort((a, b) => a.ipaddress.substring(a.ipaddress.lastIndexOf('.') + 1) - b.ipaddress.substring(b.ipaddress.lastIndexOf('.') + 1)).filter((breathSensor) => breathSensor.location === location).map((breathSensor, index) => {
                                    return (
                                      <DetailBreathSensor
                                        key={index}
                                        breathSensor={breathSensor}
                                        handleCreateContextMenu={this.handleCreateContextMenu}
                                        handleClearContextMenu={this.handleClearContextMenu}
                                        handleBreathSensor={this.handleBreathSensor}
                                      />  
                                    )
                                  })
                                }
                              </div>
                              {
                                this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length > 10 && this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length <= 15 ?
                                    <span className='vertical_Line'></span>
                                  :
                                  this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length > 15 && this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length <= 20 ?
                                    <>
                                      <span className='vertical_Line'></span>
                                      <span className='vertical_Line2'></span>
                                    </>
                                  :
                                  this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length > 20 && this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length <= 25 ?
                                    <>
                                      <span className='vertical_Line3'></span>
                                      <span className='vertical_Line4'></span>
                                    </>
                                    :
                                    this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length > 25 && this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length <= 30 ?
                                    <>
                                      <span className='vertical_Line3'></span>
                                      <span className='vertical_Line4'></span>
                                      <span className='vertical_Line5'></span>
                                    </>
                                    :
                                    (
                                      this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length > 5 && this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length <= 10 ?
                                      <span className='vertical_Line_long'></span>
                                      :
                                      ''
                                    )
                              }
                              {
                                this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length > 10 && this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length <= 20 ? <hr className='first-hr'></hr>
                                :
                                this.props.breathSensors.filter((breathSensor) => breathSensor.location === location).length > 20 ? <span><hr className='second-hr'></hr><hr className='third-hr'></hr></span>
                                :
                                ''
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div 
                id='detailBreathSensor_context_menu' 
                className="custom-context-menu"
              >
                <ul>
                  <li className='breathSensorsModal-ack' onClick={() => this.setState({ showAlert: !this.state.showAlert, target: 'detail' })}>이벤트 알림 해제</li>
                </ul>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* 해당 장치의 이벤트 알림 해제 모달창 */}
        <Modal show={this.state.showAlert} centered >
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 {this.state.target === 'group' ? '그룹':'장치'}의 이벤트 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={styles.check_btn} onClick={
              () => {
                this.setState({ showAlert: !this.state.showAlert });
                this.state.target === 'group' ? this.handleAck(undefined, 'vitalsensor', 'observer', undefined, this.state.location):this.handleAck(this.state.DetailBreathSensor.name, 'vitalsensor', 'observer', this.state.DetailBreathSensor.ipaddress, undefined)
              }
            }>
              예
            </button>
            <button className={styles.close_btn} onClick={this.handleCloseAlert}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default BreathSensorList;


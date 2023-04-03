import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { UserInfoContext } from '../context/context';
import { Dropdown } from 'react-bootstrap';
import ModalConfirm from '../dashboard/ModalConfirm';
import blackAndWhiteListSetting from "../../assets/icon/blackAndWhiteList.ico";
import Setting from './section/Setting';
import BlackOrWhiteSetting from './section/BlackOrWhiteSetting';
import Report from './section/Report';
import iconBreathSensor from '../../assets/images/breathsensor.png';
import styles from './Navbar.module.css';
import WeatherTime from '../dashboard/WeatherTime.jsx';
import eventList from '../../assets/images/eventList.png';
import unresolvedEventList from '../../assets/images/unresolved.png';
import customLayoutIcon from '../../assets/icon/custom_layout.png';
import { readEvents } from '../dashboard/api/apiService';

class Navbar extends Component {

  static contextType = UserInfoContext;

  state = {
    showSettingModal: false,
    showBreathSensorModal: false,
    showCarNumberModal: false,
    showReportModal: false,
    showDelConfirm: false,
    modalConfirmTitle: '',
    modalConfirmMessage: '',
    modalConfirmBtnText: '',
    modalConfirmCancelBtnText: '',
    modalConfirmIdx: undefined,
    modalConfirmType: undefined,
    eventLists: [],
    eventCount: '',
    updateCheck: new Date(),
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

  async componentDidMount () {
    await this.getEvents();
    // console.log('navbar context:', this.context);
    document.body.classList.add('sidebar-icon-only');
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.updateCheck !== prevProps.updateCheck) {
      this.getEvents();
    }
    if (this.props.updateAckStatus !== prevProps.updateAckStatus) {
      this.getEvents();
    }
  }

  getEvents = async (selectedValue) => {
    const res = await readEvents(selectedValue, 'noLmit');
    if (res && res.eventList) {
      this.setState({ eventLists: res.eventList});
    }
    let count = 0;
    this.state.eventLists.map((c) => { 
      if (c.acknowledge === false) {
        count ++;
    }})
    this.setState({ eventCount: count });
  }

  handleLogout = async (evt) => {
    evt.preventDefault();
    this.context.setUserInfo(false, '', '');
    localStorage.removeItem('userInfo');
    this.props.history.push('/login');
  }

  handleCarNumberModal = async (e) => {
    if(e){
      e.preventDefault();
    }
    this.setState({ showCarNumberModal: !this.state.showCarNumberModal });
  }

  handleReportModal = async (e) => {

    if(e) {
      e.preventDefault();
    }

    this.setState({
      showReportModal: !this.state.showReportModal
    });
  }

  handleSettingModal = async (e) => {
    
    if(e){
      e.preventDefault();
    }

    this.setState({
      showSettingModal: !this.state.showSettingModal,
    });
  }

  handleDelCancel = async (e) => {
    console.log('confirm modal: cancel');

    this.setState({
      showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
      modalConfirmIdx: undefined,
      modalConfirmType: undefined,
    });
  }

  render() {
    return (
      <nav className={styles.navbar} id='navbar'>
        {/* <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch"> */}
        <div className={styles.navbar_wrapper}>
          <ul className={styles.observer_title}>
            <h2>Observer 통합관제시스템</h2>
          </ul>            
          {/* <ul className="navbar-nav navbar-nav-right"> */}
          <div className={styles.view_dashboard} onClick={(e) => this.props.handleSettingLayout(e)} title="레이아웃 사용자 설정">
            <img src={customLayoutIcon} />
          </div>
          <ul className={styles.navbar_menu}>
            {this.props.serviceTypes.find((serviceType) => serviceType.name === 'anpr' && serviceType.setting_value === 'true')?
              <>
                <div className={this.props.showAnpr?"navbar-carNumberRecognition":"navbar-carNumberRecognition-red"} onClick={this.props.handleEnableAnpr}>
                  <i className="mdi mdi-car d-none d-sm-block"></i>
                </div>
                <div className="navbar-blackAndWhiteList" onClick={this.handleCarNumberModal}>
                  <img src={blackAndWhiteListSetting} width="32px" height="32px"/>
                </div>
              </>
              :
              ''
            }
            <div className={styles.navbar_items}>
              <div className={styles.eventBellImage} onClick={(e) => this.props.handleShowInquiryModal(e, 'ackStatusFalse')} title="이벤트 ack 처리 현황">
                <img src={this.state.eventLists.find((e) => e.acknowledge === false) ? unresolvedEventList : eventList} className={styles.ack_status_img} title="이벤트현황"/>
                <div className={(this.state.eventCount < 10) ? styles.eventCount : (this.state.eventCount >= 10 && this.state.eventCount <= 99) ? styles.eventCount2 : (this.state.eventCount >= 100 && this.state.eventCount <= 999) ? styles.eventCount3 : this.state.eventCount ?styles.eventCount3:styles.eventCount_0}>{this.state.eventCount ? this.state.eventCount : ''}</div>
              </div>
              {this.props.serviceTypes.find((serviceType) => serviceType.name === 'vitalsensor' && serviceType.setting_value === 'true')?
                <div className={styles.breathSensorList} onClick={this.props.handleShowBreathSensorList}>
                  <img src={iconBreathSensor} style={{ width: '30px', height: '30px' }} title="호흡감지센서 목록"/>
                </div>
                :
                ''
              }
              {this.props.handleEnableServiceType('parkingcontrol') &&
                <div className={styles.parkingService} onClick={(e) => this.props.handleShowParkingServiceModal()} title="주차서비스">
                  <i className="mdi mdi-car-connected d-none d-sm-block"></i> 
                </div>
              }
              {this.props.handleEnableServiceType('crowddensity') &&
                <div className={styles.crowd_density} onClick={(e) => this.props.handleShowCrowdDensityModal(e)} title="군중 밀집도 감지">
                  <i className="mdi mdi-account-switch d-none d-sm-block" style={{paddingTop: '4.5px'}}></i>
                </div>
              }
              <div className={styles.inquiry_data} onClick={(e) => this.props.handleShowInquiryModal(e, 'allEvents')} title="데이터 조회">
                <i className="mdi mdi-magnify-plus d-none d-sm-block"></i>
              </div>
              <div className={styles.report} onClick={this.handleReportModal} title="보고서">
                <i className="mdi mdi-file-document d-none d-sm-block"></i>
              </div>
              <div className={styles.setting} onClick={this.handleSettingModal} title="설정">
                <i className="mdi mdi-settings d-none d-sm-block"></i>
              </div>
            </div>
            {/* <Dropdown alignRight as="li" className="nav-item"> */}
          </ul>
          <WeatherTime
          />
          <Dropdown alignRight as="li" className={styles.login_dropDown}>
              {/* <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret"> */}
              <Dropdown.Toggle as="a" className={styles.login_dropDown_toggle}>
                <div className={styles.profile}>
                  {/* <img className="img-xs rounded-circle" src={require('../../assets/images/faces/face15.jpg')} alt="profile" /> */}
                  <p className={styles.loginId}><Trans>{this.context.id}</Trans></p>
                  <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                <h6 className="p-3 mb-0"><Trans>Profile</Trans></h6>
                <Dropdown.Divider />
                <Dropdown.Item href="!#" onClick={this.handleLogout} className="preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-logout text-danger"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Log Out</p>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={this.toggleOffcanvas}>
            <span className="mdi mdi-format-line-spacing"></span>
          </button>
        </div>
        <BlackOrWhiteSetting
          showCarNumberModal={this.state.showCarNumberModal}
          handleCarNumberModal={this.handleCarNumberModal}
        />
        <ModalConfirm 
          showModal = {this.state.showDelConfirm}
          modalTitle = {this.state.modalConfirmTitle}
          modalMessage = {this.state.modalConfirmMessage}
          modalConfirmBtnText = {this.state.modalConfirmBtnText}
          modalCancelBtnText = {this.state.modalConfirmCancelBtnText}
          handleConfirm = {this.handleDelConfirm}
          handleCancel = {this.handleDelCancel}
        />
        {this.state.showSettingModal ? 
          <Setting 
            handleCancelSettingModal = {this.handleSettingModal}
            breathSensorList = {this.props.breathSensorList}
            breathSensorScheduleList={this.props.breathSensorScheduleList}
            VMSList={this.props.VMSList}
            readVMSList={this.props.readVMSList}
            serviceTypes={this.props.serviceTypes}
            getServiceTypes={this.props.getServiceTypes}
            handleChangeServiceTypeName={this.props.handleChangeServiceTypeName}
            handleEnableServiceType={this.props.handleEnableServiceType}
          />
          :
          null
        }
        <Report
          showModal={this.state.showReportModal}
          handleReportModal={this.handleReportModal}
          serviceTypes={this.props.serviceTypes}
        />
      </nav>
    );
  }
}

export default withRouter(Navbar);

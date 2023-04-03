import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import { UserInfoContext } from './context/context';
import { handleGetSettings } from './dashboard/api/apiService';

class App extends Component {
  state = {
    serviceTypes: [],
    VMSList: [],
    breathSensorList: [],
    breathSensorScheduleList: [],
    accessControlLog: [],
    showBillboard: false,
    billboardEvent: undefined,
    eventsByIpForWeek: undefined,
    //임시
    showAnpr: false,
    showSetLayout: false,
    showInquiryModal: false,
    defaultActiveKey: 'allEvents',
    door_id: '',
    showParkingServiceModal: false,
    showCrowdDensityServiceModal: false,
    breathSensorListShow: false,
    updateCheck: new Date(),
    updateAckStatus: new Date()
  }

  static contextType = UserInfoContext;
  
  readServiceTypes = async () => {
    try {
      const res = await handleGetSettings('serviceType');
      await this.setState({ serviceTypes: res });
    } catch(err) {
      console.log('read ServiceTypes Err: ', err);
    }
  }

  // VMS 조회
  readVMSList = async () => {
    try {
      const resVMS = await axios.get('/api/observer/vms');
      if (resVMS && resVMS.data && resVMS.data.result) {
        this.setState({
          VMSList: resVMS.data.result
        });
        // console.log('App.js에서 cameraList 확인: ', this.state.cameraList);
      } else {
        console.log('readVMSList - No Error but No Result:', resVMS);
      }
    } catch(err) {
      console.log('readVMSList Error', err);
    }
  }

  // 호흡센서 조회
  readVitalsensorList = async () => {
    try {
      const resBreathSensor = await axios.get('api/observer/vitalsensor');
      if (resBreathSensor && resBreathSensor.data && resBreathSensor.data.result) {
        // console.log('readBreathSensor:', JSON.stringify(resBreathSensor.data.result, null, 2));
        const newBreathSensor = JSON.parse(JSON.stringify(resBreathSensor.data.result));
        this.setState({
          breathSensorList: newBreathSensor
        });
      } else {
        console.log('readBreathSensorList - No Error but No Result:', resBreathSensor);
      }
    } catch(err) {
      console.log('readBreathSensorList Error', err);
    }
  }

   // 호흡센서 스케줄 조회
   readVitalsensorScheduleList = async () => {
    try {
      const resBreathSensorSchedule = await axios.get('api/observer/scheduleGroup');
      if (resBreathSensorSchedule && resBreathSensorSchedule.data && resBreathSensorSchedule.data.result) {
        // console.log('readBreathSensorSchedule:', JSON.stringify(resBreathSensorSchedule.data.result, null, 2));
        const newBreathSensorSchedule = JSON.parse(JSON.stringify(resBreathSensorSchedule.data.result));
        await this.setState({
          breathSensorScheduleList: newBreathSensorSchedule
        });
      } else {
        console.log('readBreathSensorScheduleList - No Error but No Result:', resBreathSensorSchedule);
      }
    } catch(err) {
      console.log('readBreathSensorScheduleList Error', err);
    }
  }

  // 출입통제기록 조회
  readAccessControlLog = async () => {
    try {
      const resAccessControl = await axios.get('api/observer/accesscontrollog');
      if (resAccessControl && resAccessControl.data && resAccessControl.data.result) {
        this.setState({
          accessControlLog: resAccessControl.data.result
        });
      } else {
        console.log('readAccessControlLog - No Error but No Result:', resAccessControl);
      }
    } catch(err) {
      console.log('readAccessControlLog Error', err);
    }
  } 

  readEventsByIpForWeek = async (ipaddress) => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const t = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();

    let week = new Date(year, month, day - 5);
    let rightNow = new Date(year, month, day, t + 9, m, s);
    
    rightNow = rightNow.toISOString().replaceAll('-','').replaceAll(':','');
    week = week.toISOString().replaceAll('T15','T00').replaceAll('-','').replaceAll(':','');

    let startDate = week;
    let endDate = rightNow;

    try {
      const res = await axios.get('/api/observer/events', {
        params: {
          startDate,
          endDate,
          ipaddress
        }
      });
      if (res.data && res.data.result && res.data.result.length > 0) {
        this.setState({ eventsByIpForWeek: res.data.result});
      } else {
        this.setState({ eventsByIpForWeek: []});
      }
      // console.log('App get events res:', res);
      return res.data.result;
    } catch (err) {
      console.log('App get event catch err:', err);
    }

  }

  handleShowBillboard = async () => {
    try {
      const res = await axios.get('api/observer/billboard');
      if (res && res.data && res.data.result && res.data.result.length > 0) {
        this.setState({
          billboardEvent: res.data.result[0]
        });
        this.setState({
          showBillboard: true
        });
      } else {
        this.setState({
          showBillboard: false
        })
        // console.log('readBillboardEvent - No Error but No Result:', res);
      }
    } catch(err) {
      console.log('readBillboardEvent Error', err);
    }
  }

  removeBillboardEvent = async (idx, service_type) => {
    try {
      const res = await axios.delete('/api/observer/billboard', {
        params: {
          idx: idx,
          service_type: service_type
        }
      });
      if(res.data.result.rowCount === 1) {
        this.setState({
          showBillboard: false
        });
      }
      return res;
    } catch(err) {
      console.log('remove Billboard Event Error', err);
    }
  }

  handleEnableAnpr = async () => {
    this.setState({ showAnpr: !this.state.showAnpr });
  }

  handleShowParkingServiceModal = async (e) => {
    if(e){
      e.preventDefault();
    }
    await this.setState({ showParkingServiceModal: !this.state.showParkingServiceModal });
  }

  handleShowCrowdDensityModal = async (e, isOpen) => {
    if(e){
      e.preventDefault();
    }
    if(isOpen){
      if(this.state.showCrowdDensityServiceModal === true){
        return;
      }
    } 
    await this.setState({ showCrowdDensityServiceModal: !this.state.showCrowdDensityServiceModal });
  }

  handleSettingLayout = async (e) => {
    if(e){
      e.preventDefault();
    }
    await this.setState({ showSetLayout: !this.state.showSetLayout });
  }

  handleShowInquiryModal = async (e, value, deviceValue) => {
    if(e) {
      e.preventDefault();
    }
    if(value) {
      await this.setState({ defaultActiveKey: value });
    }
    if(value === 'accessCtlLog' && deviceValue) {
      await this.setState({ door_id: deviceValue });
    } else if(value === 'allEvents' && deviceValue){
      await this.setState({ breathIp: deviceValue });
    } else {
      if(this.state.door_id) {
        await this.setState({ door_id: undefined });
      } else if(this.state.breathIp) {
        await this.setState({ breathIp: undefined });
      }
    }
    await this.setState({ showInquiryModal: !this.state.showInquiryModal });
  }

  handleEnableServiceType = (serviceTypeItem) => {
    return this.state.serviceTypes.find((serviceType) => (serviceType.name === serviceTypeItem && serviceType.setting_value === 'true'));
  }

  handleChangeServiceTypeName = (serviceName) => {
		switch(serviceName) {
			case 'mgist':
				return 'MGIST'
			case 'ebell':
				return '비상벨'
			case 'accesscontrol':
				return '출입통제'
			case 'guardianlite':
				return '가디언라이트'
			case 'anpr':
				return 'ANPR'
			case 'vitalsensor':
				return '바이탈센서'
			case 'pids':
				return 'PIDS'
			case 'ndoctor':
				return 'N-Doctor'
      case 'parkingcontrol':
        return '주차 관제'
      case 'crowddensity':
        return '군중 밀집도'
      case 'mdet':
        return 'M-DET'
      default:
        return serviceName
		}
	}

  handleShowBreathSensorList = (e) => {
    if(e){
      e.preventDefault();
    }
    this.setState({ breathSensorListShow: !this.state.breathSensorListShow});
  }

  handleGetEvents = async () => {
    this.setState({ updateCheck: new Date() })
  }

  handleUpdateAckStatus = async () => {
    this.setState({ updateAckStatus: new Date()});
  }

  componentDidMount() {
    this.readServiceTypes();
    this.readVMSList();
    this.readVitalsensorList();
    this.readVitalsensorScheduleList();
    this.onRouteChanged();
    this.readAccessControlLog();
  }

  render () {
    let navbarComponent = !this.state.isFullPageLayout ? 
      <Navbar 
        showAnpr={this.state.showAnpr} 
        handleEnableAnpr={this.handleEnableAnpr}
        showSetLayout={this.state.showSetLayout}
        handleSettingLayout={this.handleSettingLayout}
        handleShowCrowdDensityModal={this.handleShowCrowdDensityModal}
        showInquiryModal={this.state.showInquiryModal}
        handleShowInquiryModal={this.handleShowInquiryModal}
        VMSList={this.state.VMSList}
        readVMSList={this.readVMSList}
        breathSensorList={this.state.breathSensorList}
        breathSensorScheduleList={this.state.breathSensorScheduleList}
        serviceTypes={this.state.serviceTypes}
        getServiceTypes={this.readServiceTypes}
        handleChangeServiceTypeName={this.handleChangeServiceTypeName}
        handleShowBreathSensorList={this.handleShowBreathSensorList}
        updateAckCheck={this.state.updateAckCheck}
        handleEnableServiceType={this.handleEnableServiceType}
        handleShowParkingServiceModal={this.handleShowParkingServiceModal}
        updateAckStatus={this.state.updateAckStatus}
        moveCustomLayout={this.state.moveCustomLayout}
      /> 
      : 
      '';
    // let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar/> : '';
    return (
      <div className="container-scroller">
        {/* { sidebarComponent } */}
          <div className="page-body-wrapper">
            { navbarComponent }
            <div className="main-panel">
              <div className="content-wrapper">
                <AppRoutes
                  breathSensorList={this.state.breathSensorList}
                  breathSensorScheduleList={this.state.breathSensorScheduleList}
                  accessControlLog={this.state.accessControlLog}
                  readVMSList={this.readVMSList}
                  readVitalsensorList={this.readVitalsensorList}
                  readVitalsensorScheduleList={this.readVitalsensorScheduleList}
                  readAccessControlLog={this.readAccessControlLog}
                  criteriaForSorting={this.state.criteriaForSorting}
                  showBillboard={this.state.showBillboard}
                  handleShowBillboard={this.handleShowBillboard}
                  removeBillboardEvent={this.removeBillboardEvent}
                  billboardEvent={this.state.billboardEvent}
                  initialSelectedEvent={this.initialSelectedEvent}
                  readEventsByIpForWeek={this.readEventsByIpForWeek}
                  eventsByIpForWeek={this.state.eventsByIpForWeek}
                  showAnpr={this.state.showAnpr}
                  handleEnableAnpr={this.handleEnableAnpr}
                  showSetLayout={this.state.showSetLayout}
                  handleSettingLayout={this.handleSettingLayout}
                  showInquiryModal={this.state.showInquiryModal}
                  handleShowInquiryModal={this.handleShowInquiryModal}
                  defaultActiveKey={this.state.defaultActiveKey}
                  serviceTypes={this.state.serviceTypes}
                  getServiceTypes={this.readServiceTypes}
                  handleChangeServiceTypeName={this.handleChangeServiceTypeName}
                  breathSensorListShow={this.state.breathSensorListShow}
                  handleShowBreathSensorList={this.handleShowBreathSensorList}
                  door_id={this.state.door_id}
                  breathIp={this.state.breathIp}
                  getEvents={this.handleGetEvents}
                  showParkingServiceModal={this.state.showParkingServiceModal}
                  handleEnableServiceType={this.handleEnableServiceType}
                  handleShowParkingServiceModal={this.handleShowParkingServiceModal}
                  showCrowdDensityServiceModal={this.state.showCrowdDensityServiceModal}
                  handleShowCrowdDensityModal={this.handleShowCrowdDensityModal}
                  handleUpdateAckStatus={this.handleUpdateAckStatus}
                />
              </div>
            </div>
          </div>
	    </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    // console.log("ROUTE CHANGED");
    //const { i18n } = this.props;
    const body = document.querySelector('body');
    if(this.props.location.pathname === '/layout/RtlLayout') {
      body.classList.add('rtl');
      //i18n.changeLanguage('ar');
    }
    else {
      body.classList.remove('rtl')
      //i18n.changeLanguage('en');
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['/login','/user-pages/login-1', '/user-pages/login-2', '/user-pages/register-1', '/user-pages/register-2', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
    for ( let i = 0; i < fullPageLayoutRoutes.length; i++ ) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true
        })
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        break;
      } else {
        this.setState({
          isFullPageLayout: false
        })
        document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
      }
    }
  }

}

//export default withTranslation()(withRouter(App));
export default withRouter(App);

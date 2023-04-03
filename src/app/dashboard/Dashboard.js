import React, { Component } from 'react';
import axios from'axios';
import socketClient from 'socket.io-client';
import Leftbar from './Leftbar';
import Rightbar from './Rightbar.jsx';
import CustomLayout from './CustomLayout';
import { UserInfoContext } from '../context/context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BreathSensorList from './BreathSensorList';
import Inquiry from './Inquiry';
import cogoToast from 'cogo-toast';
import FCanvasOutside from './FCanvasOutside';
import FCanvasInside from './FCanvasInside';
import styles from './Dashboard.module.css';
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import EventDetail from './EventDetail';
import { getGuardianlites, getVCounters, handleGetSettings, handleUpdateSettings, readBuildingList, readCameraList, readDeviceList, readFloorList, readMapImage, readPidsList, getCrowdDensityCountingLog } from './api/apiService';
import ParkingService from './ParkingService';
import CrowdDensityService from './CrowdDensityService';

export class Dashboard extends Component {
  
  static contextType = UserInfoContext;
  state = {
    mapServerUrl: '',
    mapType: 1, // 1:외부지도,2:실내지도
    currBuildingIdx: 0,
    currBuildingServiceType: 'observer',
    currFloorIdx: 0,
    moveToFeature: {},
    deviceInformationValue: { 
      value: '', 
      timestamp: undefined 
    },
    accessControlEnter: [],
    breathData: {
      ipaddress: undefined,
      respiration: undefined,
      timestamp: undefined
    },
    eventPopup: { timestamp: 0 },
    socketClient: undefined,
    breathSocketClient: undefined,
    breathSensorStatus: '',
    leftLayout1: {
      element: '',
      visible: false
    },
    leftLayout2: {
      element: '',
      visible: false
    },
    rightLayout1: {
      element: '',
      visible: false
    },
    rightLayout2: {
      element: '',
      visible: false
    },
    eventListUpdate: new Date(),
    eventDetail: undefined,
    buildingList: [],
    floorList: [],
    floorImageList: [],
    deviceList: [],
    cameraList: [],
    guardianliteList: [],
    pidsList: [],
    parkingCameraUpdate: new Date(),
    parkingAreaUpdate: '',
    parkingCoordsUpdate: '',
    parkingSpaceUpdate: '',
    parkingEvent: '',
    vCounters: [],
    peopleCountData: [],
    crowdDensityCountingLog: [],
    crowdDensityCamera: new Date(),
    crowdDensityCameraOnEvent: '',
  }
  
  connectWebsocket = async () => {
    try {
      // console.log('websocketurl:', this.context.websocket_url);
      if (this.context.websocket_url && this.context.websocket_url.length > 0) {
        const socket = socketClient(this.context.websocket_url);
        socket.on('connect', (vSocket) => {
          console.log('socket connected:', this.context.websocket_url);
          this.setState({ socketClient: socket})
        });
        socket.on('disconnect', (socket) => {
          console.log('socket disconnected');
        });
        socket.on('serviceTypes', (received) => {
          //console.log('socket data received!!!');
          if (received) {            
            this.props.getServiceTypes();
          }
        });
        socket.on('buildingList', (received) => {
          if (received) {            
            if(JSON.stringify(received.buildingList) != JSON.stringify(this.state.buildingList.sort((a, b) => a.idx > b.idx ? 1:-1))){
              this.callReadBuildingList();
            } 
          }
        });
        socket.on('floorList', (received) => {
          if (received) {            
            if(JSON.stringify((Array.isArray(received.floorList) && received.floorList.sort((a, b) => a.name > b.name ? 1 : -1))) !== JSON.stringify(this.state.floorList)){
              this.callReadFloorList();
            } else if(!Array.isArray(received.floorList)) {
              this.callReadFloorList();
            }
          }
        });
        socket.on('deviceList', (received) => {
          //console.log('socket data received!!!');
          if (received) {            
            // console.log('deviceList socket event:', received);
            if(received.deviceList && received.deviceList > 0){
              this.callReadDeviceList();
            }
          }
        });
        socket.on('cameraList', (received) => {
          // console.log('socket data received!!!');
          if (received) {            
            // console.log('cameraList socket event:', received);
            this.callReadCameraList();
          }
        });
        socket.on('VMSList', (received) => {
          // console.log('socket data received!!!');
          if (received) {            
            // console.log('VMSList socket event:', received);
            this.props.readVMSList();
          }
        });
        socket.on('pidsList', (received) => {
          // console.log('socket data received!!!');
          if (received) {            
            // console.log('pidsList socket event:', received);
            this.callReadPidsList();
          }
        });
        socket.on('vitalsensorList', (received) => {
          // console.log('socket data received!!!');
          if (received) {            
            // console.log('pidsList socket event:', received);
            this.props.readVitalsensorList();
          }
        });
        socket.on('vitalsensorScheduleList', (received) => {
          // console.log('socket data received!!!');
          if (received) {            
            // console.log('pidsList socket event:', received);
            this.props.readVitalsensorScheduleList();
          }
        });
        socket.on('eventList', async (received) => {
          if (received) {
            if (received.eventList &&
              Array.isArray(received.eventList) &&
              received.eventList.length > 0 &&
              received.eventList[0].lastEvent.deviceId !== undefined &&
              received.eventList[0].lastEvent.deviceType !== undefined &&
              received.eventList[0].lastEvent.buildingIdx !== undefined &&
              received.eventList[0].lastEvent.floorIdx !== undefined &&
              received.eventList[0].lastEvent.buildingServiceType !== undefined) {

              const timestamp = new Date().getTime();
              await this.moveToTheThisDevice(received.eventList[0].lastEvent.deviceId, received.eventList[0].lastEvent.deviceType, received.eventList[0].lastEvent.buildingIdx, received.eventList[0].lastEvent.floorIdx, received.eventList[0].lastEvent.buildingServiceType, timestamp);
              this.setState({
                eventPopup: {
                  eventName: received.eventList[0].lastEvent.eventName,
                  deviceIdx: received.eventList[0].lastEvent.deviceIdx,
                  deviceId: received.eventList[0].lastEvent.deviceId,
                  deviceType: received.eventList[0].lastEvent.deviceType,
                  serviceType: received.eventList[0].lastEvent.serviceType,
                  buildingIdx: received.eventList[0].lastEvent.buildingIdx,
                  floorIdx: received.eventList[0].lastEvent.floorIdx,
                  buildingServiceType: received.eventList[0].lastEvent.buildingServiceType,
                  ipaddress: received.eventList[0].lastEvent.ipaddress,
                  cameraId: received.eventList[0].lastEvent.cameraId,
                  timestamp
                }
              });
            }
            this.setState({ eventListUpdate: new Date()});
            this.props.handleUpdateAckStatus();
            // this.props.readEventsByPeriod(this.props.period);
          }
        });
        socket.on('billboard', (received) => {
          // console.log('socket data received!!!');
          if (received) {            
            // console.log('billboard socket event:', received);
            this.props.handleShowBillboard();
          }
        });
        socket.on('guardianlites', (received) => {
          if (received && received.guardianlites && parseInt(received.guardianlites) > 0) {            
            this.callReadGuardianliteList();
          }
        });
        socket.on('accessControlLog', (received) => {
          // console.log('socket data received!!!');
          if (received) {
            //console.log('accessControlLog socket event:', received.accessControlLog);
            this.setState({ accessControlEnter: received.accessControlLog });
            this.props.readAccessControlLog();
          }
        });
        socket.on('anpr', (received) => {
          //console.log('anpr websocket data received!!!');
          if (received) {
            //console.log('anpr socket event:', received.anpr);
            //console.log('show anpr:', this.props.showAnpr);
            if (this.props.showAnpr) {
              toast.info(' ' + received.anpr + ' 시속 OOkm/h',
              {
                position: 'top-right',
                autoClose: true,
                hideProgressBar: true,
                pauseOnHover: true,
                progress: undefined
              });
            }
          }
        });
        socket.on('parkingCamera', (received) => {
          if(received){
            this.setState({ parkingCameraUpdate: new Date()});
          }
        })
        socket.on('parkingAreas', (received) => {
          if(received){
            this.setState({ parkingAreaUpdate: new Date()});
          }
        })
        socket.on('parkingCoords', (received) => {
          if(received){
            this.setState({ parkingCoordsUpdate: new Date()});
          }
        })
        socket.on('parkingSpaces', (received) => {
          if(received){
            this.setState({ parkingSpaceUpdate: new Date()});
          }
        })
        socket.on('parkingEvent', (received) => {
          if(received && received.parkingEvent){
            this.setState({ parkingEvent: new Date()});
          }
        })

        socket.on('vCounterInfo', (received) => {
          if(received && received.updateVcounter) {
            const updateVcounters = [...this.state.vCounters];
            this.setState({ vCounters: updateVcounters.map((vCounter) => (vCounter.ipaddress === received.updateVcounter.ipaddress)? received.updateVcounter: vCounter)});
          }
        })    
        socket.on('crowdDensityCount', (received) => {
          if(received){
            this.callReadCrowdDensityCountingLog();
            // this.setState({ crowddensityData: received.data});
          }
        })
        socket.on('crowdDensityCamera', (received) => {
          if(received && received.crowdDensityCamera && received.crowdDensityCamera === 1){
            this.setState({ crowdDensityCamera: new Date()})
          }
        })
        socket.on('crowdDensityEvent', (received) => {
          if(received && received.crowdDensityEvent) {
            this.props.handleShowCrowdDensityModal('','open');
            this.setState({ crowdDensityCameraOnEvent: received.crowdDensityEvent.cameraId})
          }
        })
      }
    } catch(err) {
      console.error('connectWebsocket err:', err);
    }
  }

  handleGetLayoutSetting = async (layoutSetting) => {
    try {
      const res = await handleGetSettings(layoutSetting);
      res && res.map((layout) => {
        const settingValueStr = layout.setting_value;
        const settingValue = settingValueStr.split(':');
        if(layout.name === 'layout1'){
          this.setState({ 
            leftLayout1: { 
              element: settingValue[0],
              visible: JSON.parse(settingValue[1])
            }
          })
        } else if(layout.name === 'layout2') {
          this.setState({ 
            leftLayout2: { 
              element: settingValue[0],
              visible: JSON.parse(settingValue[1])
            }
          })
        } else if(layout.name === 'layout3') {
          this.setState({ 
            rightLayout1: { 
              element: settingValue[0],
              visible: JSON.parse(settingValue[1])
            }
          })
        } else if(layout.name === 'layout4'){
          this.setState({ 
            rightLayout2: { 
              element: settingValue[0],
              visible: JSON.parse(settingValue[1])
            }
          })
        }
      })
    } catch(err) {
      console.log('handle Get LayoutSetting From Dashboard Err: ', err);
    }
  }

  connectWsBreath = async () => {
    try {
      if (this.context.websocket_url && this.context.websocket_url.length > 0) {
        const arrSplit = this.context.websocket_url.split(':');
        if (arrSplit.length < 2) {
          console.log('connectWsBreath websocket url splite error');
          return;
        }
        let newPort = parseInt(arrSplit[1]) + 1;
        const socket = socketClient(arrSplit[0] + ':' + newPort);

        socket.on('connect', (vSocket) => {
          console.log('vitalSensor socket connected:', this.context.websocket_url);
          this.setState({ breathSocketClient: socket })
        });
        socket.on('disconnect', () => {
          console.log('socket disconnected');
        });
        socket.on('breathData', (received) => {
          if (received) {{
              this.setState({ breathData: {
                respiration: received.val,
                timestamp: new Date(),
                ipaddress: received.sensorIp
              }})
            }
          }
        });
      }
    } catch (err) {
      console.log('connectWsBreath err:', err);
    }
  }

  connectWsVCounter = async () => {
    try {
      if (this.context.websocket_url && this.context.websocket_url.length > 0) {
        const arrSplit = this.context.websocket_url.split(':');
        if (arrSplit.length < 2) {
          console.log('connectWsVCounter websocket url splite error');
          return;
        }
        let newPort = parseInt(arrSplit[1]) + 2;
        const socket = socketClient(arrSplit[0] + ':' + newPort);

        socket.on('connect', (socket) => {
          console.log('vCounter socket connected:', this.context.websocket_url);
          this.setState({ vCounterSocketClient: socket })
        });

        socket.on('vCounterInfo', (received) => {
          if(received && received.updateVcounter) {
            const updateVcounters = [...this.state.vCounters];
            this.setState({ vCounters: updateVcounters.map((vCounter) => (vCounter.ipaddress === received.updateVcounter.ipaddress)? received.updateVcounter: vCounter)});
          }
        })

        socket.on('disconnect', () => {
          console.log('vCounter socket disconnected');
        });
      }
    } catch (err) {
      console.log('connectWsVCounter err:', err);
    }
  }

  moveToTheThisDevice = async (deviceId, deviceType, buildingIdx, floorIdx, buildingServiceType, timestamp) => {
    if (buildingIdx === 0) { //실외지도에 배치된 장비(또는카메라)
      await this.handleChangeMapType(1, buildingIdx, floorIdx, buildingServiceType, timestamp);
      this.setState({ moveToFeature: { deviceId, deviceType, buildingServiceType, timestamp }});
    } else if (buildingIdx > 0) { //실내지도에 배치된 장비
      this.handleChangeMapType(2, buildingIdx, floorIdx, buildingServiceType, timestamp);
    }
  }

  handleChangeMapType = async (mapType, buildingIdx, floorIdx, serviceType) => {
    if (mapType === 1) {
      await this.setState({ 
        mapType: mapType,
        currBuildingIdx: 0,
        currFloorIdx: 0,
        currBuildingServiceType: 'observer',
      });
    } else if (mapType === 2 && buildingIdx && floorIdx && serviceType) {
      await this.setState({ 
        mapType: mapType, 
        currBuildingIdx: parseInt(buildingIdx),
        currFloorIdx: parseInt(floorIdx),
        currBuildingServiceType: serviceType,
      });
    }
  }

  handleDeviceInformation = (idx, name, service_type, ipaddress, type) => {
    let value;
    if(type) {
      value = `${idx}:${name}:${service_type}:${ipaddress}:${type}`;
    } else {
      value = `${idx}:${name}:${service_type}:${ipaddress}`;
    }
    this.setState({ 
      deviceInformationValue: { 
        value: value,
        timestamp: new Date()
      }})
  }

  handleRespiration = async (ipaddress, cmd) => {
      if((this.state.breathData && this.state.breathData.ipaddress) === ipaddress){
        await this.setState({ breathData: {
          respiration: undefined,
          timestamp: undefined,
          ipaddress: undefined
        }});
      }
  }

  handleRespirationOnEvent = async (ipaddress, cmd) => {
    if(cmd === 'on') {
      await this.setState({ breathDataOnEvent: {
        respiration: undefined,
        timestamp: new Date(),
        ipaddress: ipaddress
      }});
    } else if(cmd === 'off'){
      if((this.state.breathDataOnEvent && this.state.breathDataOnEvent.ipaddress) === ipaddress){
        await this.setState({ breathDataOnEvent: {
          respiration: undefined,
          timestamp: undefined,
          ipaddress: undefined
        }});
      }
    }
  }

  handleShowToast = async (status, message, fromWhere) => {
    const toastoptions = {
      hideAfter: 5,
      position: fromWhere === 'breathSensorList'?'top-center':'top-right',
      // heading: 'Attention'
    }
    if(status === 'success'){
      cogoToast.success(message, toastoptions);
    } else if(status === 'failed') {
      cogoToast.error(message, toastoptions);
    } else if(status === 'warn') {
      cogoToast.warn(message, toastoptions);
    } else {
      cogoToast.info(message, toastoptions);
    }
    const setZIndex = document.getElementById('ct-container');
    if(setZIndex){
      console.log(setZIndex);
      setZIndex.style.zIndex = 1000000001;
    }
  }

  handleCheckServiceTypeUseOrNot = (servcieType) => {
    if(this.props.serviceTypes){
      const res = this.props.serviceTypes.filter((servcieTypeItem) => (servcieTypeItem.name) === servcieType)
      if(res && res[0] && res[0].setting_value === 'true'){
        return true;
      } else {
        return false;
      }
    }
  }

  handleShowEventDetail = (idx, serviceType, buildingName, floorName, location, eventTypeName) => {
    this.setState({ 
      eventDetail: {
        eventIdx: idx,
        serviceType,
        buildingName,
        floorName,
        location,
        eventTypeName
      } 
    });
  }

  handleCloseEventDetail = async() => {
    await this.setState({ eventDetail: undefined });
  }

  handleDisconnectSocket = async (cameraId, startDateTime) => {
    const socket = this.state.socketClient;
    if(socket) {
      if(cameraId && startDateTime){
        socket.emit('cameraArchive', {
          cameraId,
          startDateTime,
          cmd: 'off'
        });
      }
    };
  }

  handleChangeDateTimeFormat = (dateTimeValue) => {
    try {
      const dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy년 M월 d일 E요일 HH:mm", { locale: ko });
      return dateTime;
    } catch(err) {
      console.log('event_occurrence_time dateTime format change fail error');
      return ''
    }
  }

  handleCustomLayout = async (layout, settingValue) => {
    try {
      if(layout === 1){
        if(settingValue !== 'close'){
          await this.setState({ 
            leftLayout1: {
              element: settingValue,
              visible: true
            }
          })
          handleUpdateSettings(undefined, 'layout1', `${settingValue}:true`);
        } else {
          const { element } = this.state.leftLayout1;
          await this.setState({ 
            leftLayout1: {
              ...this.state.leftLayout1,
              visible: false
            }
          })
          handleUpdateSettings(undefined, 'layout1', `${element}:false`);
        }
      } else if(layout === 2){
        if(settingValue !== 'close'){
          await this.setState({ 
            leftLayout2: {
              element: settingValue,
              visible: true
            }
          })
          handleUpdateSettings(undefined, 'layout2', `${settingValue}:true`);
        } else {
          const { element } = this.state.leftLayout2;
          await this.setState({ 
            leftLayout2: {
              ...this.state.leftLayout2,
              visible: false
            }
          })
          handleUpdateSettings(undefined, 'layout2', `${element}:false`);
        }
      } else if(layout === 3){
        if(settingValue !== 'close'){
          await this.setState({ 
            rightLayout1: {
              element: settingValue,
              visible: true
            }
          })
          handleUpdateSettings(undefined, 'layout3', `${settingValue}:true`);
        } else {
          const { element } = this.state.rightLayout1;
          await this.setState({ 
            rightLayout1: {
              ...this.state.rightLayout1,
              visible: false
            }
          })
          handleUpdateSettings(undefined, 'layout3', `${element}:false`);
        }
      } else if(layout === 4){
        if(settingValue !== 'close'){
          await this.setState({ 
            rightLayout2: {
              element: settingValue,
              visible: true
            }
          })
          handleUpdateSettings(undefined, 'layout4', `${settingValue}:true`);
        } else {
          const { element } = this.state.rightLayout2;
          await this.setState({ 
            rightLayout2: {
              ...this.state.rightLayout2,
              visible: false
            }
          })
          handleUpdateSettings(undefined, 'layout4', `${element}:false`);
        }
      }
    } catch(err) {
      console.log('update setting layout REST API ERR: ', err);
    }
  }

  callReadBuildingList = async () => {
    try {
      const res = await readBuildingList();
      res && await this.setState({ buildingList: res });
    } catch(err) {
      console.log('Call readBuildingList REST API Err: ', err);
    }
  }

  callReadFloorList = async () => {
    try {
      const res = await readFloorList();
      res && await this.setState({  floorList: res });
    } catch(err) {
      console.log('call readFloorList API Error: ', err);
    }
  }

  callReadMapImages = async () => {
    try {
      const res = await readMapImage();
      res && await this.setState({ floorImageList: res });
    } catch (err) {
      console.log('call readMapImAGE API Error: ', err);
    }
  }

  callReadDeviceList = async () => {
    try {
      const res = await readDeviceList();
      res && await this.setState({ deviceList: res });
    } catch(err) {
      console.log('Call readDeviceList API Error: ', err);
    }
  }

  callReadCameraList = async () => {
    try {
      const res = await readCameraList();
      res && res.length > 0 && await this.setState({ cameraList: res });
    } catch(err) {
      console.log('call readCameraList API Error: ', err);
    }
  }

  callReadGuardianliteList = async () => {
    try {
      const res = await getGuardianlites();
      await this.setState({ guardianliteList : res});
    } catch(err) {
      console.log('call readGuardianliteList API Error: ', err);
    }
  }

  callReadPidsList = async () => {
    try {
      const res = await readPidsList();
      res && this.setState({ pidsList: res });
    } catch(err) {
      console.log('call readPids API Error: ', err);
    }
  }

  callReadVcounters = async () => {
    try {
      const res = await getVCounters();
      if(res && res.data && res.data.result && res.data.result.length > 0){
        this.setState({ vCounters: res.data.result});
      }
    } catch(err) {
      console.log('call read vCounters Error: ', err);
    }
  }

  callReadCrowdDensityCountingLog = async () => {
    try {
      const res = await getCrowdDensityCountingLog();
      // console.log(res);
      if(res && res.data && res.data.result && res.data.result.length > 0){
        this.setState({ crowdDensityCountingLog: res.data.result});
      }
    } catch(err) {
      console.error('call read crowd density counting log error: ', err);
    }
  }

  componentDidMount() {
    this.connectWebsocket();
    // this.connectWsBreath();
    // this.connectWsVCounter();
    this.handleGetLayoutSetting('layout');
    this.callReadBuildingList();
    this.callReadFloorList();
    this.callReadMapImages();
    this.callReadDeviceList();
    this.callReadCameraList();
    this.callReadGuardianliteList();
    this.callReadPidsList();
    this.callReadVcounters();
    this.callReadCrowdDensityCountingLog();
  }

  render() {
    return (
      <div className='dashboard' id='dashboard'>
        <div className="dashboard-content" id='dashboard-content'>
          {this.state.mapType === 1 ?
            <FCanvasOutside
              changeMapType={this.handleChangeMapType}
              buildingList={this.state.buildingList}
              floorList={this.state.floorList}
              deviceList={this.state.deviceList}
              cameraList={this.state.cameraList}
              pidsList={this.state.pidsList}
              floorImageList={this.state.floorImageList}
              breathSensorList={this.props.breathSensorList}
              guardianliteList={this.state.guardianliteList}
              events={this.props.events}
              eventList={this.props.eventList}
              accessControlLog={this.props.accessControlLog}
              readEvents={this.props.readEvents}
              currBuildingIdx={this.state.currBuildingIdx}
              currFloorIdx={this.state.currFloorIdx}
              currBuildingServiceType={this.state.currBuildingServiceType}
              socketClient={this.state.socketClient}
              handleShowInquiryModal={this.props.handleShowInquiryModal}
              eventPopup={this.state.eventPopup}
            />
            :
            <FCanvasInside
              changeMapType={this.handleChangeMapType}
              buildingList={this.state.buildingList}
              floorList={this.state.floorList}
              deviceList={this.state.deviceList}
              cameraList={this.state.cameraList}
              pidsList={this.state.pidsList}
              floorImageList={this.state.floorImageList}
			        guardianliteList={this.state.guardianliteList}
              breathSensorList={this.props.breathSensorList}
              breathSensorScheduleList={this.props.breathSensorScheduleList}
              socketClient={this.state.socketClient}
              currBuildingIdx={this.state.currBuildingIdx}
              currFloorIdx={this.state.currFloorIdx}
              currBuildingServiceType={this.state.currBuildingServiceType}
              handleShowInquiryModal={this.props.handleShowInquiryModal}
              breathSocketClient={this.state.breathSocketClient}
              handleRespiration={this.handleRespiration}
              handleRespirationOnEvent={this.handleRespirationOnEvent}
              breathData={this.state.breathData}
              handleShowToast={this.handleShowToast}
              handleShowEventDetail={this.handleShowEventDetail}
              eventPopup={this.state.eventPopup}
              accessControlEnter={this.state.accessControlEnter}
            />
          }
          <div className={styles.leftMenu}>
            <Leftbar
              buildingList={this.state.buildingList}
              floorList={this.state.floorList}
              deviceList={this.state.deviceList}
              cameraList={this.state.cameraList}
              pidsList={this.state.pidsList}
              moveToTheThisDevice={this.moveToTheThisDevice}
              showInquiryModal={this.props.showInquiryModal}
              handleShowInquiryModal={this.props.handleShowInquiryModal}
              serviceTypes={this.props.serviceTypes}
              handleChangeServiceTypeName={this.props.handleChangeServiceTypeName}
              handleChangeDateTimeFormat={this.handleChangeDateTimeFormat}
              handleCheckServiceTypeUseOrNot={this.handleCheckServiceTypeUseOrNot}
              userId={this.context.id}
              eventListUpdate={this.state.eventListUpdate}
              eventDetail={this.state.eventDetail}
              handleShowEventDetail={this.handleShowEventDetail}
              socketClient={this.state.socketClient}
              leftLayout1={this.state.leftLayout1}
              leftLayout2={this.state.leftLayout2}
              handleCustomLayout={this.handleCustomLayout}
              deviceInformationValue={this.state.deviceInformationValue}
              accessControlLog={this.props.accessControlLog}
              readAccessControlLog={this.props.readAccessControlLog}
            />
          </div>
          <div className='dashboard-center' 
            style={{ width: '1000px', height: '80.7vh', float: 'left', display: 'flex', flexDirection: 'column', backgroundColor: 'gray' }}
          >
        </div>
        <div className={styles.rightMenu}>
          <Rightbar
            buildingList={this.state.buildingList}
            floorList={this.state.floorList}
            deviceList={this.state.deviceList}
            cameraList={this.state.cameraList}
            pidsList={this.state.pidsList}
            accessControlLog={this.props.accessControlLog}
            moveToTheThisDevice={this.moveToTheThisDevice}
            deviceInformationValue={this.state.deviceInformationValue}
            serviceTypes={this.props.serviceTypes}      
            readAccessControlLog={this.props.readAccessControlLog}
            socketClient={this.state.socketClient}
            handleChangeDateTimeFormat={this.handleChangeDateTimeFormat}
            rightLayout1={this.state.rightLayout1}
            rightLayout2={this.state.rightLayout2}
            handleCustomLayout={this.handleCustomLayout}
            handleCheckServiceTypeUseOrNot={this.handleCheckServiceTypeUseOrNot}
            handleChangeServiceTypeName={this.props.handleChangeServiceTypeName}
            userId={this.context.id}
            eventListUpdate={this.state.eventListUpdate}
            eventDetail={this.state.eventDetail}
            handleShowEventDetail={this.handleShowEventDetail}
            setAcknowledge={this.setAcknowledge}
            showInquiryModal={this.props.showInquiryModal}
            handleShowInquiryModal={this.props.handleShowInquiryModal}
          />
          </div>
        </div>
        {
          this.props.showSetLayout &&
          <CustomLayout
            showSetLayout={this.props.showSetLayout}
            handleSettingLayout={this.props.handleSettingLayout}
            leftLayout1={this.state.leftLayout1}
            leftLayout2={this.state.leftLayout2}
            rightLayout1={this.state.rightLayout1}
            rightLayout2={this.state.rightLayout2}
            handleCustomLayout={this.handleCustomLayout}
          />
        }
        <ToastContainer 
          newestOnTop
        />
        <BreathSensorList
          breathSensorListShow={this.props.breathSensorListShow}
          handleShowBreathSensorList={this.props.handleShowBreathSensorList}
          breathSensors={this.props.breathSensorList}
          setAcknowledge={this.setAcknowledge}
          handleShowToast={this.handleShowToast}
        />
        <Inquiry
          showInquiryModal={this.props.showInquiryModal}
          handleShowInquiryModal={this.props.handleShowInquiryModal}
          defaultActiveKey={this.props.defaultActiveKey}
          door_id={this.props.door_id}
          breathIp={this.props.breathIp}
          cameraList={this.state.cameraList}
          getServiceTypes={this.props.getServiceTypes}
          serviceTypes={this.props.serviceTypes}
          getEvents={this.props.getEvents}
          handleEnableServiceType={this.props.handleEnableServiceType}
          parkingCameraUpdate={this.state.parkingCameraUpdate}
          parkingAreaUpdate={this.state.parkingAreaUpdate}
          parkingCoordsUpdate={this.state.parkingCoordsUpdate}
        />
        {this.state.eventDetail && this.state.eventDetail !== {} && 
          <EventDetail
            eventDetail={this.state.eventDetail}
            socketClient={this.state.socketClient}
            handleDisconnectSocket={this.handleDisconnectSocket}
            handleChangeDateTimeFormat={this.handleChangeDateTimeFormat}
            handleCloseEventDetail={this.handleCloseEventDetail}
          />
        }
        {this.props.handleEnableServiceType('parkingcontrol') &&
          <ParkingService
            showParkingServiceModal={this.props.showParkingServiceModal}
            handleShowParkingServiceModal={this.props.handleShowParkingServiceModal}
            parkingCameraUpdate={this.state.parkingCameraUpdate}
            parkingAreaUpdate={this.state.parkingAreaUpdate}
            parkingCoordsUpdate={this.state.parkingCoordsUpdate}
            socketClient={this.state.socketClient}
            eventListUpdate={this.state.eventListUpdate}
            parkingSpaceUpdate={this.state.parkingSpaceUpdate}
            deviceList={this.state.deviceList}
            vCounters={this.state.vCounters}
            parkingEvent={this.state.parkingEvent}
          />
        }
          {this.props.handleEnableServiceType('crowddensity') &&
          <CrowdDensityService
            showCrowdDensityServiceModal={this.props.showCrowdDensityServiceModal}
            handleShowCrowdDensityModal={this.props.handleShowCrowdDensityModal}
            socketClient={this.state.socketClient}
            eventListUpdate={this.state.eventListUpdate}
            deviceList={this.state.deviceList}
            cameraList={this.state.cameraList}
            crowdDensityCountingLog={this.state.crowdDensityCountingLog}
            crowdDensityCamera={this.state.crowdDensityCamera}
            crowdDensityCameraOnEvent={this.state.crowdDensityCameraOnEvent}
          />
        }
      </div>
    );
  }
}

export default Dashboard;
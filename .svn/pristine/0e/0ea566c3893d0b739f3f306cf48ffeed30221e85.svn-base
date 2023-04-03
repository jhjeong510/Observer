import axios from 'axios';
import React from 'react';
import { Modal, Form, Button, Container } from 'react-bootstrap';
//import { Stage, Layer, Image, Text, Rect, Label, Tag } from 'react-konva';
//import iconBlinker from '../../assets/images/blinker03.png';
import DatePicker from 'react-datepicker';
import * as dateFns from "date-fns";
import iconOnButton from '../../assets/images/onButton.png';
import iconOffButton from '../../assets/images/offButton.png';
import iconBreathOnOff from '../../assets/images/breath-onoff.png';
import iconBreathSchedule from '../../assets/images/breath-schedule.png';
import iconBreathValueSetting from '../../assets/images/breath-value-setting.png';
import iconBlinker from '../../assets/images/alert.webp';
import iconGoToGmap from '../../assets/images/gotogmap.png';
import iconEbellNormal from '../../assets/images/indoor_ebell.ico';
import iconEbellEvent from '../../assets/images/indoor_ebell_event.ico';
import iconCamera from '../../assets/images/cctv.ico';
import iconCameraEvent from '../../assets/images/cctv_event.ico';
import iconDoor from '../../assets/images/door.ico';
import iconDoorEvent from '../../assets/images/door_event.ico';
import iconBreathSensor from '../../assets/images/breathsensor.png';
import iconBreathSensorAdd from '../../assets/images/detection_breathing.ico';
import iconBreathSensorEvent from '../../assets/images/event_breathsensor.png';
import iconBreathSensorRemove from '../../assets/images/context_breathSensor_remove_indoor.png';
import { UserInfoContext } from '../context/context';
import iconCameraAdd from '../../assets/images/context_camera_add_indoor.png';
import iconDoorAdd from '../../assets/images/context_door_add_indoor.png';
import iconCameraRemove from '../../assets/images/context_camera_remove_indoor.png';
import iconDoorRemove from '../../assets/images/door_delete.ico';
import iconEbellAdd from '../../assets/images/context_bell_add.png';  
import iconEbellRemove from '../../assets/images/context_bell_remove.png';
import iconDoorLiveVideo from '../../assets/images/door_live.ico';
import iconDoorUpdate from '../../assets/images/camera_update.ico';
import iconDoorLock from '../../assets/images/door_lock.ico';
import iconDoorUnlock from '../../assets/images/door_unlock.ico';
import iconDoorUnlock10 from '../../assets/images/door_unlock10.ico';
import iconDoorLog from '../../assets/images/door_log.ico';
import iconEventClear from '../../assets/images/event_clear.ico';
import ModalConfirm from './ModalConfirm';
import Inquiry from './Inquiry';
import noEvent from '../../assets/images/access_no_event.png';
import iconGuardianlite from '../../assets/images/guardianlite.ico'; 
import iconGuardianliteAdd from '../../assets/images/context_guardianlite_add.png';
import iconGuardianliteRemove from '../../assets/images/guardianlite_remove.ico';
import { Line } from 'react-chartjs-2';
import cytoscape from "cytoscape";
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';

cytoscape.use(contextMenus);
cytoscape.warnings(false);

class GCanvas extends React.Component {

  static contextType = UserInfoContext;
  _isMounted = false;
  constructor(props) {
    super(props);

    this.cyRef = React.createRef();

    //this.refStage = React.createRef();

    this.state = {
      mounted: false,
      blinker: false,
      selectedShape: undefined,
      selectedShapeBreathSensor: undefined,
      selectedShapeGuardianlite: undefined,
      videoPresence: false,
      mapClickPoint: { x: 0, y: 0 },

      modalCameraShow: false,
      modalCameraFloorIdx: undefined,
      modalCameraLatitude: '',
      modalCameraLongitude: '',
      modalCameraWarn: '',
      modalCurrentCamera: undefined,

      modalEbellShow: false,
      modalEbellFloorIdx: '',
      modalEbellLatitude: '',
      modalEbellLongitude: '',
      modalEbellWarn: '',
      modalCurrentEbell: undefined,

      modalCameraEbellShow: false,
      modalCameraEbellFloorIdx: '',
      modalCameraEbellLatitude: '',
      modalCameraEbellLongitude: '',
      modalCameraEbellWarn: '',
      modalCurrentCameraEbell: undefined,

      modalDoorShow: false,
      modalDoorFloorIdx: undefined,
      modalDoorLatitude: '',
      modalDoorLongitude: '',
      modalDoorWarn: '',
      modalCurrentDoor: undefined,

      modalCameraDoorShow: false,
      modalCameraDoorFloorIdx: '',
      modalCameraDoorLatitude: '',
      modalCameraDoorLongitude: '',
      modalCameraDoorWarn: '',
      modalCurrentCameraDoor: undefined,

      modalBreathSensorShow: false,
      modalBreathSensorFloorIdx: '',
      modalBreathSensorLatitude: '',
      modalBreathSensorLongitude: '',
      modalBreathSensorWarn: '',
      modalCurrentBreathSensor: undefined,

      modalBreathSensorScheduleShow: false,
      modalBreathSensorScheduleWarn: '',
      modalCurrentScheduleGroup: '',

      modalBreathSensorBreathValueShow: false,
      modalBreathSensorBreathValueWarn: '',
      modalBreathSensorBreathValueList: '',

      modalCurrentBreathSensorMode: '',

      modalCameraBreathSensorShow: false,
      modalCameraBreathSensorFloorIdx: '',
      modalCameraBreathSensorLatitude: '',
      modalCameraBreathSensorLongitude: '',
      modalCameraBreathSensorWarn: '',
      modalCurrentCameraBreathSensor: undefined,

      modalPidsFloorIdx: '',
      modalPidsLocation: '',
      modalPidsIpaddress: '',
      modalPidsLatitude: '',
      modalPidsLongitude: '',
      modalPidsWarn: '',
      modalCurrentPids: undefined,

      modalCameraPidsShow: false,
      modalCameraPidsFloorIdx: '',
      modalCameraPidsLatitude: '',
      modalCameraPidsLongitude: '',
      modalCameraPidsWarn: '',
      modalCurrentCameraPids: undefined,

      modalPidsZoneListShow: false,
      modalPidsZoneFloorIdx: undefined,
      modalPidsZoneSource: '',
      modalPidsZoneSourceLatitude: '',
      modalPidsZoneSourceLongitude: '',
      modalPidsZoneTarget: '',
      modalPidsZoneTargetLatitude: '',
      modalPidsZoneTargetLongitude: '',
      modalPidsZoneWarn: '',
      modalCurrentPidsZone: undefined,

      modalGdp200DelListShow: false,
      modalGdp200DelListFloorIdx: '',
      modalGdp200DelListLatitude: '',
      modalGdp200DelListLongitude: '',
      modalGdp200DelListWarn: '',
      modalCurrentGdp200DelList: undefined,

      modalGuardianliteShow: false,
      modalGuardianliteLatitude: '',
      modalGuardianliteLongitude: '',
      modalGuardianliteWarn: '',
      modalGuardianliteName: '',
      modalGuardianliteIpaddress: '',
      currGuardianlite: '',
      guardianliteCh1: undefined,
      guardianliteCh2: undefined,
      guardianliteCh3: undefined,
      guardianliteCh4: undefined,
      guardianliteCh5: undefined,
      guardianliteCh6: undefined,
      guardianliteCh7: undefined,
      guardianliteCh8: undefined,
      guardianliteTemper: undefined,

      startDate: '',
      startDateForAutoValue: '',
      startTime: '',
      startTimeForAutoValue: '',
      minValue: '',
      maxValue: '',
      avgValue: '',
      autoBreathValue: '',
      modalAutoBreathValueWarn: '',
      autoStart: '',
      autoEnd: '',

      editMode: false,
      addNodeMode: false, 

      nodeEventCheckArr: [],
      eventTest: undefined,

      modalDoorLogShow: false,

      modalDoorRecShow: false,
      modalDoorRecSrc: '',
      modalCameraDoorRecWarn: '',
      modaldoorRecSrcFormat: '',

      showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
      modalConfirmIdx: undefined,
      modalConfirmServiceType: undefined,
      modalConfirmFloorName: undefined,
      modalConfirmIpaddress: undefined,

      LogDoorID: undefined,

      breathSensorData: '',

      showAlert: false,
      device_id: undefined,
      device_type: undefined,
      service_type: undefined,
      ipaddress: undefined,

      //장치 팝업 디자인
      cameraPopup: "ol-indoor-popup",
      ebellPopup: "ol-indoor-ebell-popup",
      doorPopup: "ol-indoor-door-popup",
      breathSensorPopup: "ol-indoor-breathSensor-popup",
      pidsPopup: "ol-indoor-pids-popup",
      guardianlitePopup: "guardianlite",

      //지도위 장치 라이브 영상
      cameraVideo: '',
      ebellVideo: '',
      doorVideo: '',
      breathSensorVideo: '',

      // 호흡센서 그래프 초기값
      socket: undefined,
      breathSensorIp: '',
      breathValue: '',
      dataArr: {
        labels: [''],
        datasets: [
          {
            label: '측정값',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 0.3,
          },
          {
            label: '임계치',
            data: [],
            borderColor: [
              'white',
            ],
            borderWidth: 0.5,
          }
        ],
      },
      xGraphTime: '',
      beforeBreathDataArr: [],
      bbSensor: '',

      cy: undefined,
      // eh: undefined,

      liveStreamCamera: undefined,
      liveStreamCameraCheckReceived: false,
      liveStreamEBell: undefined,
      liveStreamDoor: undefined,
      liveStreamDoorCheckReceived: false,
      liveStreamBreathSensor: undefined,
      liveStreamZone: undefined,
      doorCameraArchive: undefined,
      videoURL: undefined,

      addGuardianliteCheck: false,
      addBreathSensorCheck: false
    };

    setInterval(() => {
      this._isMounted && this.setState({ blinker: !this.state.blinker });
    }, 600);
  }
  
  handleGoToGmap = async () => {
    await this.handleDisconnectSocket();
    await this.handleClosePopup();
    await this.handleCloseEbellPopup();
    await this.handleCloseDoorPopup();
    await this.handleCloseBreathSensorPopup();
    await this.handleCloseModalGuardianlite();
    // 기존 실외지도로 이동
    await this.props.changeMapType(1, null, null, null);

    // 국군교도소 조감도
    // this.props.changeMapType(, )
  }

  getCameraById = async (id) => {
    return this.props.cameraList.find(camera => camera.cameraid === id);
  }

  getEbellByKey = async (idx, service_type) => {
    return this.props.deviceList.find((device) => (device.idx === parseInt(idx) && device.service_type === service_type));
  }

  getGuardianliteByKey = async (idx, service_type) => {
    return this.props.deviceList.find((device) => (device.idx === parseInt(idx) && device.service_type === service_type));
  }

  getDoorByKey = async (idx, service_type) => {
    return this.props.deviceList.find((device) => (parseInt(device.id) === parseInt(idx) && device.service_type === service_type));
  }

  getBreathSensorByKey = async (idx, service_type) => {
    return this.props.deviceList.find((device) => device.idx === parseInt(idx) && device.service_type === service_type);
  }

  getPidsByKey = async (id, serviceType) => {  
    return this.props.pidsList.find((pids) => pids.pidsid === id && pids.service_type === serviceType);
  }

  handleChangePopUpArrowDirection = (direction) => {
    if (direction === 'top') {
      const arrowDirection = document.getElementById("ol-indoor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '-30px';
      }
    } else if (direction === 'left') {
      const arrowDirection = document.getElementById("ol-indoor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '100%';
      }
    } else if (direction === 'topLeft') {
      const arrowDirection = document.getElementById("ol-indoor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '100%';
      }
    } else {
      const arrowDirection = document.getElementById("ol-indoor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '-30px';
      }
    }
  }

  handleChangeEbellPopUpArrowDirection = (direction) => {
    if (direction === 'top') {
      const arrowDirection = document.getElementById("ol-indoor-ebell-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '-30px';
      }
    } else if (direction === 'left') {
      const arrowDirection = document.getElementById("ol-indoor-ebell-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '100%';
      }
    } else if (direction === 'topLeft') {
      const arrowDirection = document.getElementById("ol-indoor-ebell-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '100%';
      }
    } else {
      const arrowDirection = document.getElementById("ol-indoor-ebell-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '-30px';
      }
    }
  }

  handleChangeDoorPopUpArrowDirection = (direction) => {
    if (direction === 'top') {
      const arrowDirection = document.getElementById("ol-indoor-door-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '-30px';
      }
    } else if (direction === 'left') {
      const arrowDirection = document.getElementById("ol-indoor-door-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '100%';
      }
    } else if (direction === 'topLeft') {
      const arrowDirection = document.getElementById("ol-indoor-door-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '100%';
      }
    } else {
      const arrowDirection = document.getElementById("ol-indoor-door-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '-30px';
      }
    }
  }

  handleChangeBreathSensorPopUpArrowDirection = (direction) => {
    if (direction === 'top') {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '-33px';
      }
    } else if (direction === 'left') {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '101%';
      }
    } else if (direction === 'topLeft') {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '101%';
      }
    } else {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '-33px';
      }
    }
  }

  handleChangePidsPopUpArrowDirection = (direction) => {
    if(direction === 'top') {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '-30px';
      }
    } else if (direction === 'left') {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '100%';
      }
    } else if (direction === 'topLeft') {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "0px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "transparent";

        arrowDirection.style.borderLeft = "0px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "30px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "15px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "#272F42";

        arrowDirection.style.top = '90%';
        arrowDirection.style.left = '100%';
      }
    } else {
      const arrowDirection = document.getElementById("ol-indoor-breathSensor-popup-arrow");
      if (arrowDirection && arrowDirection.style) {
        arrowDirection.style.borderTop = "15px";
        arrowDirection.style.borderTopStyle = "solid";
        arrowDirection.style.borderTopColor = "#272F42";

        arrowDirection.style.borderLeft = "30px";
        arrowDirection.style.borderLeftStyle = "solid";
        arrowDirection.style.borderLeftColor = "transparent";

        arrowDirection.style.borderRight = "0px";
        arrowDirection.style.borderRightStyle = "solid";
        arrowDirection.style.borderRightColor = "transparent";

        arrowDirection.style.borderBottom = "0px";
        arrowDirection.style.borderBottomStyle = "solid";
        arrowDirection.style.borderBottomColor = "transparent";

        arrowDirection.style.top = '15px';
        arrowDirection.style.left = '-30px';
      }
    }
  }

  showDevicePopup = async (e) => {
    if (e.originalEvent && e.originalEvent.button !== 0) { return; }
    if (e.evt && e.evt.button === 0) { return; }
    const popup = document.getElementById("indoor-popup");
    const ebell_popup = document.getElementById("indoor-ebell-popup");
    const door_popup = document.getElementById("indoor-door-popup");
    const breathSensor_popup = document.getElementById("indoor-breathSensor-popup");
    const guardianlite_popup = document.getElementById("guardianlite");
    const pids_popup = document.getElementById("indoor-pids-popup");
    const closerGrdlte = document.getElementById('guardianlite-closer')
    closerGrdlte.onclick = (e) => {
      e.preventDefault();
      guardianlite_popup.style.display = 'none';
      this.setState({ currGuardianlite: '' });
      closerGrdlte.blur();
      return false;
    };    

    const camera_video = document.getElementById('indoor-popup-video');
    const ebell_video = document.getElementById('ebell-indoor-popup-video');
    const door_video = document.getElementById('door-indoor-popup-video');
    if(door_video){
      door_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
    }
    const breathSensor_video = document.getElementById('breathSensor-indoor-popup-video');
    const pids_video = document.getElementById('pids-indoor-popup-video');
    
    if (e.target._private.data.value === 'cameraicon') {
      const camera = await this.getCameraById(e.target._private.data.camera_id); // 체크 필요
      if(camera_video) {
        camera_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      }
      this.props.readEventsByIpForWeek(camera ? camera.ipaddress : null)
      if (camera) {
        this.setState({ cameraPopup: "ol-indoor-popup" });
        try {
          const socket = this.props.socketClient;
          if(socket) {
            socket.emit('cameraStream', { 
              cameraId: camera.cameraid, 
              cmd: 'on' 
            });
            this.setState({ liveStreamCamera: camera }, () => {
              socket.on('cameraStream', (received) => {
                if(received.cameraId === (this.state.liveStreamCamera && this.state.liveStreamCamera.cameraid)) {
                  camera_video.innerHTML = `<img alt='' style="width: 300px; height: 200px;" src=${'data:image/jpeg;base64,' + received.data} autoplay></img>`;
                  if (this.state.liveStreamCameraCheckReceived === false) {
                    this.setState({ liveStreamCameraCheckReceived: true }, () => {
                      if (popup && popup.style) {
                        popup.style.display = 'initial';
                        popup.classList.add('active');
                        ebell_popup.classList.remove('active');
                        door_popup.classList.remove('active');
                        breathSensor_popup.classList.remove('active');
                        pids_popup.classList.remove('active');
                        
                        if (e.originalEvent.clientY > 883) {
                          popup.style.top = e.originalEvent.clientY - 198 + 'px';
                        } else {
                          popup.style.top = e.originalEvent.clientY - 18 + 'px';
                        }
                        if (e.originalEvent.clientX > 1087) {
                          popup.style.left = e.originalEvent.clientX - 366 + 'px';
                        } else {
                          popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                        }
                        if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                          this.handleChangePopUpArrowDirection("topLeft");
                        } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                          this.handleChangePopUpArrowDirection("top");
                        } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                          this.handleChangePopUpArrowDirection("left");
                        } else {
                          this.handleChangePopUpArrowDirection("default");
                        }
                      }
                    });
                  } else {
                    if (popup && popup.style) {
                      popup.style.display = 'initial';
                      popup.classList.add('active');
                      ebell_popup.classList.remove('active');
                      door_popup.classList.remove('active');
                      breathSensor_popup.classList.remove('active');
                      pids_popup.classList.remove('active');
                      
                      if (e.originalEvent.clientY > 883) {
                        popup.style.top = e.originalEvent.clientY - 198 + 'px';
                      } else {
                        popup.style.top = e.originalEvent.clientY - 18 + 'px';
                      }
                      if (e.originalEvent.clientX > 1087) {
                        popup.style.left = e.originalEvent.clientX - 366 + 'px';
                      } else {
                        popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                      }
                      if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                        this.handleChangePopUpArrowDirection("topLeft");
                      } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                        this.handleChangePopUpArrowDirection("top");
                      } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                        this.handleChangePopUpArrowDirection("left");
                      } else {
                        this.handleChangePopUpArrowDirection("default");
                      }
                    }
                  }
                }
              });
            });
          }
        } catch (err) {
          if(camera_video) {
            camera_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/cctv_error.png')}></img>`;
          }  
          if (popup && popup.style) {
            popup.style.display = 'initial';
            popup.classList.add('active');
            ebell_popup.classList.remove('active');
            door_popup.classList.remove('active');
            breathSensor_popup.classList.remove('active');
            pids_popup.classList.remove('active');

            if (e.originalEvent.clientY > 883) {
              popup.style.top = e.originalEvent.clientY - 198 + 'px';
            } else {
              popup.style.top = e.originalEvent.clientY - 18 + 'px';
            }
            if (e.originalEvent.clientX > 1087) {
              popup.style.left = e.originalEvent.clientX - 366 + 'px';
            } else {
              popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
            }
            if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
              this.handleChangePopUpArrowDirection("topLeft");
            } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
              this.handleChangePopUpArrowDirection("top");
            } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
              this.handleChangePopUpArrowDirection("left");
            } else {
              this.handleChangePopUpArrowDirection("default");
            }
          }
        }
      } else {
        if(camera_video) {
            camera_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/cctv_error.png')}></img>`;
        }  
        if (popup && popup.style) {
          popup.style.display = 'initial';
          popup.classList.add('active');
          ebell_popup.classList.remove('active');
          door_popup.classList.remove('active');
          breathSensor_popup.classList.remove('active');
          pids_popup.classList.remove('active');
          
          if (e.originalEvent.clientY > 883) {
            popup.style.top = e.originalEvent.clientY - 198 + 'px';
          } else {
            popup.style.top = e.originalEvent.clientY - 18 + 'px';
          }
          if (e.originalEvent.clientX > 1087) {
            popup.style.left = e.originalEvent.clientX - 366 + 'px';
          } else {
            popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
          }
          if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
            this.handleChangePopUpArrowDirection("topLeft");
          } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
            this.handleChangePopUpArrowDirection("top");
          } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
            this.handleChangePopUpArrowDirection("left");
          } else {
            this.handleChangePopUpArrowDirection("default");
          }
        }
      }
    } else if (e.target._private.data.value === 'ebellicon') {
      const ebell = await this.getEbellByKey(e.target._private.data.idx, e.target._private.data.service_type);
      if(ebell_video){
        ebell_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      }
      this.props.readEventsByIpForWeek(ebell ? ebell.ipaddress : null)
      if (ebell) {
        if (ebell.camera_id && ebell.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === ebell.camera_id);
          if (cameraInfo) {
            try {
              const socket = this.props.socketClient;
              if(socket) {
                socket.emit('cameraStream', { 
                  cameraId: cameraInfo.cameraid, 
                  cmd: 'on' 
                });
                this.setState({ liveStreamEBell: ebell }, () => {
                  socket.on('cameraStream', (received) => {
                    if(received.cameraId === (this.state.liveStreamEBell && this.state.liveStreamEBell.camera_id)) {
                      ebell_video.innerHTML = `<img alt='' style="width: 300px; height: 200px;" src=${'data:image/jpeg;base64,' + received.data} autoplay></img>`;
                    }
                  });
                });
                this.setState({ ebellPopup: "ol-indoor-ebell-popup" });
                if (ebell_popup && ebell_popup.style) {
                  ebell_popup.style.display = 'initial';
                  ebell_popup.classList.add('active');
                  popup.classList.remove('active');
                  door_popup.classList.remove('active');
                  breathSensor_popup.classList.remove('active');
                  pids_popup.classList.remove('active');
                  if (e.originalEvent.clientY > 883) {
                    ebell_popup.style.top = e.originalEvent.clientY - 198 + 'px';
                  } else {
                    ebell_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                  }
                  if (e.originalEvent.clientX > 1087) {
                    ebell_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                  } else {
                    ebell_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                  }
                  if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                    this.handleChangeEbellPopUpArrowDirection("topLeft");
                  } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                    this.handleChangeEbellPopUpArrowDirection("top");
                  } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                    this.handleChangeEbellPopUpArrowDirection("left");
                  } else {
                    this.handleChangeEbellPopUpArrowDirection("default");
                  }
                }
              }
            } catch (err) {
              if(ebell_video) {
                ebell_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/cctv_error.png')}></img>`;
              }
              if (ebell_popup && ebell_popup.style) {
                ebell_popup.style.display = 'initial';
                ebell_popup.classList.add('active');
                popup.classList.remove('active');
                door_popup.classList.remove('active');
                breathSensor_popup.classList.remove('active');
                pids_popup.classList.remove('active');
                if (e.originalEvent.clientY > 883) {
                  ebell_popup.style.top = e.originalEvent.clientY - 198 + 'px';
                } else {
                  ebell_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                }
                if (e.originalEvent.clientX > 1087) {
                  ebell_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                } else {
                  ebell_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                }
                if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                  this.handleChangeEbellPopUpArrowDirection("topLeft");
                } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                  this.handleChangeEbellPopUpArrowDirection("top");
                } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                  this.handleChangeEbellPopUpArrowDirection("left");
                } else {
                  this.handleChangeEbellPopUpArrowDirection("default");
                }
              }
            }
          } else {
            if (ebell_popup && ebell_popup.style) {
              ebell_popup.style.display = 'initial';
              ebell_popup.classList.add('active');
              popup.classList.remove('active');
              door_popup.classList.remove('active');
              breathSensor_popup.classList.remove('active');
              pids_popup.classList.remove('active');
              if(ebell_video) {
                ebell_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/without_camera.png')}></img>`;
              }
              if (e.originalEvent.clientY > 883) {
                ebell_popup.style.top = e.originalEvent.clientY - 198 + 'px';
              } else {
                ebell_popup.style.top = e.originalEvent.clientY - 18 + 'px';
              }
              if (e.originalEvent.clientX > 1087) {
                ebell_popup.style.left = e.originalEvent.clientX - 366 + 'px';
              } else {
                ebell_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
              }
              if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                this.handleChangeEbellPopUpArrowDirection("topLeft");
              } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                this.handleChangeEbellPopUpArrowDirection("top");
              } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                this.handleChangeEbellPopUpArrowDirection("left");
              } else {
                this.handleChangeEbellPopUpArrowDirection("default");
              }
            }
          }
        } else {
          if(ebell_video) {
            ebell_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/without_camera.png')}></img>`;
          }
          
          if (ebell_popup && ebell_popup.style) {
            ebell_popup.style.display = 'initial';
            ebell_popup.classList.add('active');
            popup.classList.remove('active');
            door_popup.classList.remove('active');
            breathSensor_popup.classList.remove('active');
            pids_popup.classList.remove('active');

            if (e.originalEvent.clientY > 883) {
              ebell_popup.style.top = e.originalEvent.clientY - 198 + 'px';
            } else {
              ebell_popup.style.top = e.originalEvent.clientY - 18 + 'px';
            }
            if (e.originalEvent.clientX > 1087) {
              ebell_popup.style.left = e.originalEvent.clientX - 366 + 'px';
            } else {
              ebell_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
            }
            if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
              this.handleChangeEbellPopUpArrowDirection("topLeft");
            } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
              this.handleChangeEbellPopUpArrowDirection("top");
            } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
              this.handleChangeEbellPopUpArrowDirection("left");
            } else {
              this.handleChangeEbellPopUpArrowDirection("default");
            }
          }
        }
      }
    } else if (e.target._private.data.value === 'guardianliteicon') {
      const guardianlite_device = await this.getGuardianliteByKey(e.target._private.data.idx, e.target._private.data.service_type);
      const guardianlite = this.props.guardianliteList.find(grdlte => grdlte.name === guardianlite_device.name);
      this.props.readEventsByIpForWeek(guardianlite ? guardianlite.ipaddress : null)
      if (guardianlite_device) {
        this.setState({
          selectedShapeGuardianlite: guardianlite_device
        });
        
          if (guardianlite_popup && guardianlite_popup.style) {
            guardianlite_popup.classList.add('active');
            ebell_popup.classList.remove('active');
            popup.classList.remove('active');
            door_popup.classList.remove('active');
            breathSensor_popup.classList.remove('active');
            pids_popup.classList.remove('active');
            guardianlite_popup.style.display = 'grid';

            if (e.originalEvent.clientY > 1107) {
              guardianlite_popup.style.top = e.originalEvent.clientY - 59 + 'px';
            } else {
              guardianlite_popup.style.top = e.originalEvent.clientY - 12 + 'px';
            }

            if (e.originalEvent.clientX > 1206) {
              guardianlite_popup.style.left = e.originalEvent.clientX - 247 + 'px';
            } else {
              guardianlite_popup.style.left = e.originalEvent.clientX + 12 + 'px';
            }

            if (e.originalEvent.clientY > 1107 && e.originalEvent.clientX > 1206) {
              this.handleChangeEbellPopUpArrowDirection("topLeft");
            } else if (e.originalEvent.clientY > 1107 && !(e.originalEvent.clientX > 1206)) {
              this.handleChangeEbellPopUpArrowDirection("top");
            } else if (!(e.originalEvent.clientY > 1107) && e.originalEvent.clientX > 1206) {
              this.handleChangeEbellPopUpArrowDirection("left");
            } else {
              this.handleChangeEbellPopUpArrowDirection("default");
            }
          }          
          this.setState({ guardianlite_popup: "guardianlite" });
          this.setState({
            currGuardianlite: guardianlite.name,
            guardianliteCh1: guardianlite.ch1,
            guardianliteCh2: guardianlite.ch2,
            guardianliteCh3: guardianlite.ch3,
            guardianliteCh4: guardianlite.ch4,
            guardianliteCh5: guardianlite.ch5,
            guardianliteCh6: guardianlite.ch6,
            guardianliteCh7: guardianlite.ch7,
            guardianliteCh8: guardianlite.ch8,
            guardianliteTemper: guardianlite.temper,
          })
      }
    } else if (e.target._private.data.value === 'dooricon') {
      const door = await this.getDoorByKey(e.target._private.data.idx, e.target._private.data.service_type);
      // if(door_video){
      //   door_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      // }
      if (door) {
        this.props.readEventsByIpForWeek(door ? door.ipaddress : null);
        if (door.camera_id && door.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === door.camera_id);
          if (cameraInfo) {
            try {
              const socket = this.props.socketClient;
              if(socket) {
                socket.emit('cameraStream', { 
                  cameraId: cameraInfo.cameraid, 
                  cmd: 'on' 
                });
                this.setState({ liveStreamDoor: door }, () => {
                  socket.on('cameraStream', (received) => {
                    if(received.cameraId === (this.state.liveStreamDoor && this.state.liveStreamDoor.camera_id)) {
                      door_video.innerHTML = `<img alt='' style="width: 300px; height: 200px;" src=${'data:image/jpeg;base64,' + received.data} autoplay></img>`;
                      if (this.state.liveStreamDoorCheckReceived === false) {
                        this.setState({ liveStreamDoorCheckReceived: true }, () => {
                          if (door_popup && door_popup.style) {
                            door_popup.style.display = 'initial';
                            door_popup.classList.add('active');
                            ebell_popup.classList.remove('active');
                            popup.classList.remove('active');
                            breathSensor_popup.classList.remove('active');
                            pids_popup.classList.remove('active');
                            
                            if (e.originalEvent.clientY > 883) {
                              door_popup.style.top = e.originalEvent.clientY - 198 + 'px';
                            } else {
                              door_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                            }
                            if (e.originalEvent.clientX > 1087) {
                              door_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                            } else {
                              door_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                            }
                            if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                              this.handleChangeDoorPopUpArrowDirection("topLeft");
                            } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                              this.handleChangeDoorPopUpArrowDirection("top");
                            } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                              this.handleChangeDoorPopUpArrowDirection("left");
                            } else {
                              this.handleChangeDoorPopUpArrowDirection("default");
                            }
                          }
                        });
                      } else {
                        if (door_popup && door_popup.style) {
                          door_popup.style.display = 'initial';
                          door_popup.classList.add('active');
                          ebell_popup.classList.remove('active');
                          popup.classList.remove('active');
                          breathSensor_popup.classList.remove('active');
                          pids_popup.classList.remove('active');
                          
                          if (e.originalEvent.clientY > 883) {
                            door_popup.style.top = e.originalEvent.clientY - 198 + 'px';
                          } else {
                            door_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                          }
                          if (e.originalEvent.clientX > 1087) {
                            door_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                          } else {
                            door_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                          }
                          if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                            this.handleChangeDoorPopUpArrowDirection("topLeft");
                          } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                            this.handleChangeDoorPopUpArrowDirection("top");
                          } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                            this.handleChangeDoorPopUpArrowDirection("left");
                          } else {
                            this.handleChangeDoorPopUpArrowDirection("default");
                          }
                        }
                      }
                    }
                  });
                });
                this.setState({ doorPopup: "ol-indoor-door-popup" });                
              }
            } catch (err) {
              if(door_video){
                door_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/cctv_error.png')}></img>`;
              }
              if (door_popup && door_popup.style) {
                door_popup.style.display = 'initial';
                door_popup.classList.add('active');
                ebell_popup.classList.remove('active');
                popup.classList.remove('active');
                breathSensor_popup.classList.remove('active');
                pids_popup.classList.remove('active');

                if (e.originalEvent.clientY > 883) {
                  door_popup.style.top = e.originalEvent.clientY - 198 + 'px';
                } else {
                  door_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                }
                if (e.originalEvent.clientX > 1087) {
                  door_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                } else {
                  door_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                }
                if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                  this.handleChangeDoorPopUpArrowDirection("topLeft");
                } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                  this.handleChangeDoorPopUpArrowDirection("top");
                } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                  this.handleChangeDoorPopUpArrowDirection("left");
                } else {
                  this.handleChangeDoorPopUpArrowDirection("default");
                }
              }
            }
          } else {
            if(door_video){
              door_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/without_camera.png')}></img>`;
            }
            if (door_popup && door_popup.style) {
              door_popup.style.display = 'initial';
              door_popup.classList.add('active');
              ebell_popup.classList.remove('active');
              popup.classList.remove('active');
              breathSensor_popup.classList.remove('active');
              pids_popup.classList.remove('active');
              
              if (e.originalEvent.clientY > 883) {
                door_popup.style.top = e.originalEvent.clientY - 198 + 'px';
              } else {
                door_popup.style.top = e.originalEvent.clientY - 18 + 'px';
              }
              if (e.originalEvent.clientX > 1087) {
                door_popup.style.left = e.originalEvent.clientX - 366 + 'px';
              } else {
                door_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
              }
              if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                this.handleChangeDoorPopUpArrowDirection("topLeft");
              } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                this.handleChangeDoorPopUpArrowDirection("top");
              } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                this.handleChangeDoorPopUpArrowDirection("left");
              } else {
                this.handleChangeDoorPopUpArrowDirection("default");
              }
            }
          }
        } else {
          if(door_video){
            door_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/without_camera.png')}></img>`;
          }
          if (door_popup && door_popup.style) {
            door_popup.style.display = 'initial';
            door_popup.classList.add('active');
            ebell_popup.classList.remove('active');
            popup.classList.remove('active');
            breathSensor_popup.classList.remove('active');
            pids_popup.classList.remove('active');
            
            if (e.originalEvent.clientY > 883) {
              door_popup.style.top = e.originalEvent.clientY - 198 + 'px';
            } else {
              door_popup.style.top = e.originalEvent.clientY - 18 + 'px';
            }
            if (e.originalEvent.clientX > 1087) {
              door_popup.style.left = e.originalEvent.clientX - 366 + 'px';
            } else {
              door_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
            }
            if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
              this.handleChangeDoorPopUpArrowDirection("topLeft");
            } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
              this.handleChangeDoorPopUpArrowDirection("top");
            } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
              this.handleChangeDoorPopUpArrowDirection("left");
            } else {
              this.handleChangeDoorPopUpArrowDirection("default");
            }
          }
        }
      }
    } else if (e.target._private.data.value === 'breathSensoricon') {
      const breathSensor = await this.getBreathSensorByKey(e.target._private.data.idx, e.target._private.data.service_type);
      this.getBeforeDataForBreathGraph(breathSensor);
      if(breathSensor_video) {
        breathSensor_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      }
      if (breathSensor.ipaddress.length > 0) {
        this.setState({ breathSensorIp: breathSensor.ipaddress});
        if (this.props.breathSocketClient) {
          this.props.breathSocketClient.emit('setbreath', { sensorIp: breathSensor.ipaddress, cmd: 'on' });
        }
      }
      if (breathSensor) {
        this.props.readEventsByIpForWeek(breathSensor ? breathSensor.ipaddress : null);
        this.setState({ selectedShapeBreathSensor: breathSensor });
        if (breathSensor.camera_id && breathSensor.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === breathSensor.camera_id);
          if (cameraInfo) {
            try {
              const socket = this.props.socketClient;
              if(socket) {
                socket.emit('cameraStream', { 
                  cameraId: cameraInfo.cameraid, 
                  cmd: 'on' 
                });
                this.setState({ liveStreamBreathSensor: breathSensor }, () => {
                  socket.on('cameraStream', (received) => {
                    if(received.cameraId === (this.state.liveStreamBreathSensor && this.state.liveStreamBreathSensor.camera_id)) {
                      breathSensor_video.innerHTML = `<img alt='' style="width: 300px; height: 200px;" src=${'data:image/jpeg;base64,' + received.data} autoplay></img>`;
                    }
                  });
                });
                this.setState({ breathSensorPopup: "ol-indoor-breathSensor-popup" })
                if (breathSensor_popup && breathSensor_popup.style) {
                  breathSensor_popup.style.display = 'initial';
                  breathSensor_popup.classList.add('active');
                  ebell_popup.classList.remove('active');
                  popup.classList.remove('active');
                  door_popup.classList.remove('active');
                  pids_popup.classList.remove('active');
                  
                  if (e.originalEvent.clientY > 667) {
                    breathSensor_popup.style.top = e.originalEvent.clientY - 390 + 'px';
                  } else {
                    breathSensor_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                  }

                  if (e.originalEvent.clientX > 1087) {
                    breathSensor_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                  } else {
                    breathSensor_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                  }

                  if(e.originalEvent.clientY > 667 && e.originalEvent.clientX > 1087) {
                    this.handleChangeBreathSensorPopUpArrowDirection("topLeft");
                  } else if(e.originalEvent.clientY > 667 && !(e.originalEvent.clientX > 1087)) {
                    this.handleChangeBreathSensorPopUpArrowDirection("top");
                  } else if(!(e.originalEvent.clientY > 667) && e.originalEvent.clientX > 1087) {
                    this.handleChangeBreathSensorPopUpArrowDirection("left");
                  } else {
                    this.handleChangeBreathSensorPopUpArrowDirection("default");
                  }
                }
              }
            } catch (err) {
              if (breathSensor_video) {
                breathSensor_video.innerHTML =  '';
              }
              this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup noCamera'});
              if (breathSensor_popup && breathSensor_popup.style) {
                breathSensor_popup.style.display = 'initial';
                breathSensor_popup.classList.add('active');
                ebell_popup.classList.remove('active');
                popup.classList.remove('active');
                door_popup.classList.remove('active');
                pids_popup.classList.remove('active');
                
                if (e.originalEvent.clientY > 883) {
                  breathSensor_popup.style.top = e.originalEvent.clientY - 212 + 'px';
                } else {
                  breathSensor_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                }

                if (e.originalEvent.clientX > 1087) {
                  breathSensor_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                } else {
                  breathSensor_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                }

                if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                  this.handleChangeBreathSensorPopUpArrowDirection("topLeft");
                } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                  this.handleChangeBreathSensorPopUpArrowDirection("top");
                } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                  this.handleChangeBreathSensorPopUpArrowDirection("left");
                } else {
                  this.handleChangeBreathSensorPopUpArrowDirection("default");
                }
              }
            }
          } else {
            if (breathSensor_video) {
              breathSensor_video.innerHTML =  '';
            }
            this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup noCamera'});
            if (breathSensor_popup && breathSensor_popup.style) {
              breathSensor_popup.style.display = 'initial';
              breathSensor_popup.classList.add('active');
              ebell_popup.classList.remove('active');
              popup.classList.remove('active');
              door_popup.classList.remove('active');
              pids_popup.classList.remove('active');
              
              if (e.originalEvent.clientY > 883) {
                breathSensor_popup.style.top = e.originalEvent.clientY - 212 + 'px';
              } else {
                breathSensor_popup.style.top = e.originalEvent.clientY - 18 + 'px';
              }

              if (e.originalEvent.clientX > 1087) {
                breathSensor_popup.style.left = e.originalEvent.clientX - 366 + 'px';
              } else {
                breathSensor_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
              }

              if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                this.handleChangeBreathSensorPopUpArrowDirection("topLeft");
              } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                this.handleChangeBreathSensorPopUpArrowDirection("top");
              } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                this.handleChangeBreathSensorPopUpArrowDirection("left");
              } else {
                this.handleChangeBreathSensorPopUpArrowDirection("default");
              }
            }
          }
        } else {
          if (breathSensor_video) {
            breathSensor_video.innerHTML =  '';
          }
          this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup noCamera'});
          if (breathSensor_popup && breathSensor_popup.style) {
            breathSensor_popup.style.display = 'initial';
            breathSensor_popup.classList.add('active');
            ebell_popup.classList.remove('active');
            popup.classList.remove('active');
            door_popup.classList.remove('active');
            pids_popup.classList.remove('active');
            
            if (e.originalEvent.clientY > 883) {
              breathSensor_popup.style.top = e.originalEvent.clientY - 212 + 'px';
            } else {
              breathSensor_popup.style.top = e.originalEvent.clientY - 18 + 'px';
            }

            if (e.originalEvent.clientX > 1087) {
              breathSensor_popup.style.left = e.originalEvent.clientX - 366 + 'px';
            } else {
              breathSensor_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
            }
            if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
              this.handleChangeBreathSensorPopUpArrowDirection("topLeft");
            } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
              this.handleChangeBreathSensorPopUpArrowDirection("top");
            } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
              this.handleChangeBreathSensorPopUpArrowDirection("left");
            } else {
              this.handleChangeBreathSensorPopUpArrowDirection("default");
            }
          }
        }
      }
    } else if (e.target._private.data.value === 'pidsicon') {
      const pids = await this.getPidsByKey(e.target._private.data.device_id, e.target._private.data.service_type);
      if(pids_video) {
        pids_video.innerHTML =`<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      }
      if (pids) {
        this.props.readEventsByIpForWeek(pids ? pids.ipaddress : null);
        if (pids.camera_id && pids.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === pids.camera_id);
          if (cameraInfo) {
            try {
              const socket = this.props.socketClient;
              if(socket) {
                socket.emit('cameraStream', { 
                  cameraId: cameraInfo.cameraid, 
                  cmd: 'on' 
                });
                this.setState({ liveStreamZone: pids }, () => {
                  socket.on('cameraStream', (received) => {
                    if(received.cameraId === (this.state.liveStreamZone && this.state.liveStreamZone.camera_id)) {
                      pids_video.innerHTML = `<img alt='' style="width: 300px; height: 200px;" src=${'data:image/jpeg;base64,' + received.data} autoplay></img>`;
                    }
                  });
                });
                if (pids_popup && pids_popup.style) {
                  pids_popup.style.display = 'initial';
                  pids_popup.classList.add('active');
                  ebell_popup.classList.remove('active');
                  popup.classList.remove('active');
                  door_popup.classList.remove('active');
                  breathSensor_popup.classList.remove('active');
                  
                  if (e.originalEvent.clientY > 883) {
                    pids_popup.style.top = e.originalEvent.clientY - 198 + 'px';
                  } else {
                    pids_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                  }
                  if (e.originalEvent.clientX > 1087) {
                    pids_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                  } else {
                    pids_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                  }
                  if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                    this.handleChangePidsPopUpArrowDirection("topLeft");
                  } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                    this.handleChangePidsPopUpArrowDirection("top");
                  } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                    this.handleChangePidsPopUpArrowDirection("left");
                  } else {
                    this.handleChangePidsPopUpArrowDirection("default");
                  }
                }
              }
            } catch (err) {
              if (pids_video) {
                pids_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/cctv_error.png')}></img>`;
              }
              
              if (pids_popup && pids_popup.style) {
                pids_popup.style.display = 'initial';
                pids_popup.classList.add('active');
                ebell_popup.classList.remove('active');
                popup.classList.remove('active');
                door_popup.classList.remove('active');
                breathSensor_popup.classList.remove('active');
                
                if (e.originalEvent.clientY > 883) {
                  pids_popup.style.top = e.originalEvent.clientY - 198 + 'px';
                } else {
                  pids_popup.style.top = e.originalEvent.clientY - 18 + 'px';
                }
                if (e.originalEvent.clientX > 1087) {
                  pids_popup.style.left = e.originalEvent.clientX - 366 + 'px';
                } else {
                  pids_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
                }
                if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                  this.handleChangePidsPopUpArrowDirection("topLeft");
                } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                  this.handleChangePidsPopUpArrowDirection("top");
                } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                  this.handleChangePidsPopUpArrowDirection("left");
                } else {
                  this.handleChangePidsPopUpArrowDirection("default");
                }
              }
            }
          } else {
            if (pids_video) {
              pids_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/without_camera.png')}></img>`;
            }
            if (pids_popup && pids_popup.style) {
              pids_popup.style.display = 'initial';
              pids_popup.classList.add('active');
              ebell_popup.classList.remove('active');
              popup.classList.remove('active');
              door_popup.classList.remove('active');
              breathSensor_popup.classList.remove('active');
              
              if (e.originalEvent.clientY > 883) {
                pids_popup.style.top = e.originalEvent.clientY - 198 + 'px';
              } else {
                pids_popup.style.top = e.originalEvent.clientY - 18 + 'px';
              }
              if (e.originalEvent.clientX > 1087) {
                pids_popup.style.left = e.originalEvent.clientX - 366 + 'px';
              } else {
                pids_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
              }
              if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
                this.handleChangePidsPopUpArrowDirection("topLeft");
              } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
                this.handleChangePidsPopUpArrowDirection("top");
              } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
                this.handleChangePidsPopUpArrowDirection("left");
              } else {
                this.handleChangePidsPopUpArrowDirection("default");
              }
            }
          }
        } else {
          if (pids_video) {
            pids_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/without_camera.png')}></img>`;
          }
          if (pids_popup && pids_popup.style) {
            pids_popup.style.display = 'initial';
            pids_popup.classList.add('active');
            ebell_popup.classList.remove('active');
            popup.classList.remove('active');
            door_popup.classList.remove('active');
            breathSensor_popup.classList.remove('active');
            
            if (e.originalEvent.clientY > 883) {
              pids_popup.style.top = e.originalEvent.clientY - 198 + 'px';
            } else {
              pids_popup.style.top = e.originalEvent.clientY - 18 + 'px';
            }
            if (e.originalEvent.clientX > 1087) {
              pids_popup.style.left = e.originalEvent.clientX - 366 + 'px';
            } else {
              pids_popup.style.left = e.originalEvent.clientX + 61 + 'px'; 
            }
            if(e.originalEvent.clientY > 883 && e.originalEvent.clientX > 1087) {
              this.handleChangePidsPopUpArrowDirection("topLeft");
            } else if(e.originalEvent.clientY > 883 && !(e.originalEvent.clientX > 1087)) {
              this.handleChangePidsPopUpArrowDirection("top");
            } else if(!(e.originalEvent.clientY > 883) && e.originalEvent.clientX > 1087) {
              this.handleChangePidsPopUpArrowDirection("left");
            } else {
              this.handleChangePidsPopUpArrowDirection("default");
            }
          }
        }
      }
    }
  }

  handleClosePopup = async (e, bClearSelectedShape = true) => {
    if (e) {
      e.preventDefault();
    }
    if (bClearSelectedShape === true) {
      this._isMounted && await this.setState({
        selectedShape: undefined,
        cameraVideo: ''
      });
    }
    const socket = this.props.socketClient;
    if(socket && (this.state.liveStreamCamera && this.state.liveStreamCamera.cameraid)) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamCamera.cameraid,
        cmd: 'off'
      });
      this._isMounted && await this.setState({ liveStreamCamera: undefined });
      this._isMounted && await this.setState({ liveStreamCameraCheckReceived: false });
    };
    if(this.state.liveStreamCamera) {
      this._isMounted && await this.setState({ liveStreamCamera: undefined });
      this._isMounted && await this.setState({ liveStreamCameraCheckReceived: false });
    }
    const popup = document.getElementsByClassName(this.state.cameraPopup);
    if (popup.length > 0 && popup[0] && popup[0].style) {
      popup[0].style.display = 'none';
    }
    const camera_video = document.getElementById('indoor-popup-video');
    if (camera_video) {
      camera_video.innerHTML = null;
    }
  }

  handleCloseEbellPopup = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const socket = this.props.socketClient;
    if(socket && (this.state.liveStreamEBell && this.state.liveStreamEBell.camera_id)) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamEBell.camera_id,
        cmd: 'off'
      });
      this._isMounted && await this.setState({ liveStreamEBell: undefined });
    };
    if(this.state.liveStreamEBell){
      this._isMounted && await this.setState({ liveStreamEBell: undefined });
    }
    const popup = document.getElementsByClassName(this.state.ebellPopup);
    if (popup.length > 0 && popup[0] && popup[0].style) {
      popup[0].style.display = 'none';
    }
    const ebell_video = document.getElementById('ebell-indoor-popup-video');
    if (ebell_video) {
      ebell_video.innerHTML = null;
    }

  }

  handleCloseDoorPopup = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const socket = this.props.socketClient;
    if(socket && (this.state.liveStreamDoor && this.state.liveStreamDoor.camera_id)) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamDoor.camera_id,
        cmd: 'off'
      });
      this._isMounted && await this.setState({ liveStreamDoor: undefined });
      this._isMounted && await this.setState({ liveStreamDoorCheckReceived: false });
    };
    if(this.state.liveStreamDoor){
      this._isMounted && await this.setState({ liveStreamDoor: undefined });
      this._isMounted && await this.setState({ liveStreamDoorCheckReceived: false });
    };
    const popup = document.getElementById("indoor-door-popup");
    if (popup && popup.style) {
      popup.style.display = 'none';
    };
    const door_video = document.getElementById('door-indoor-popup-video');
    if (door_video) {
      door_video.innerHTML = null;
    };
    }

  handleCloseBreathSensorPopup = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const socket = this.props.socketClient;
    if(socket && (this.state.liveStreamBreathSensor && this.state.liveStreamBreathSensor.camera_id)) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamBreathSensor.camera_id,
        cmd: 'off'
      });
      this._isMounted && await this.setState({ liveStreamBreathSensor: undefined });
    };
    if(this.state.liveStreamBreathSensor){
      this._isMounted && await this.setState({ liveStreamBreathSensor: undefined });
    };
    const popup = document.getElementById("indoor-breathSensor-popup");
    if (popup && popup.style) {
      popup.style.display = 'none';
    }
    const breathSensor_video = document.getElementById('breathSensor-indoor-popup-video');
    if (breathSensor_video) {
      breathSensor_video.innerHTML = null;
    }

    if (this.state.breathSensorIp.length > 0) {
      if (this.props.breathSocketClient) {
        await this.props.breathSocketClient.emit('setbreath', { sensorIp: this.state.breathSensorIp, cmd: 'off' });
      }
      let emptyDataArr = {
        labels: [''],
        datasets: [
          {
            label: '측정값',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 0.3,
          },
          {
            label: '임계치',
            data: [],
            borderColor: [
              'white',
            ],
            borderWidth: 0.5,
          }
        ],
      }
      this._isMounted && await this.setState({
        breathSensorIp: '',
        dataArr: emptyDataArr,
        xGraphTime: '',
        breathValue: '',
        beforeBreathDataArr: [],
      });
      await this.props.handleRespiration();
    } 
  }

  handleClosePidsPopup = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const socket = this.props.socketClient;
    if(socket && (this.state.liveStreamZone && this.state.liveStreamZone.camera_id)) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamZone.camera_id,
        cmd: 'off'
      });
      this._isMounted && await this.setState({ liveStreamZone: undefined });
    };

    if(this.state.liveStreamZone) {
      this._isMounted && await this.setState({ liveStreamZone: undefined });
    };
    const popup = document.getElementById("indoor-pids-popup");
    if (popup && popup.style) {
      popup.style.display = 'none';
    }
    const pids_video = document.getElementById('pids-indoor-popup-video');
    if (pids_video) {
      pids_video.innerHTML = null;
    }
  }

  handleDisconnectSocket = async () => {
    const socket = this.props.socketClient;
    if(socket && this.state.liveStreamCamera) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamCamera.cameraid,
        cmd: 'off'
      });
      await this.setState({ liveStreamCamera: undefined });
      await this.setState({ liveStreamCameraCheckReceived: false });
    };
    if(socket && this.state.liveStreamEBell && this.state.liveStreamEBell.camera_id) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamEBell.camera_id,
        cmd: 'off'
      });
      await this.setState({ liveStreamEBell: undefined });
    };
    if(socket && this.state.liveStreamDoor && this.state.liveStreamDoor.camera_id) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamDoor.camera_id,
        cmd: 'off'
      });
      await this.setState({ liveStreamDoor: undefined });
      await this.setState({ liveStreamDoorCheckReceived: false });
    };
    if(socket && this.state.liveStreamBreathSensor && this.state.liveStreamBreathSensor.camera_id) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamBreathSensor.camera_id,
        cmd: 'off'
      });
      await this.setState({ liveStreamBreathSensor: undefined });
    };
    if(socket && this.state.doorCameraArchive && this.state.doorCameraArchive.camera_id) {
      await socket.emit('cameraArchive', {
        cameraId: this.state.doorCameraArchive.camera_id,
        startDateTime: this.state.doorCameraArchive.startDateTime,
        cmd: 'off'
      });
      await this.setState({ doorCameraArchive: undefined });
    };
  }

  handleSelectFloor = async (idx) => {
    if (idx) {
      const floor = this.props.floorList.find(floor => floor.idx === idx && floor.service_type === this.props.currBuildingServiceType);
      if (floor) {  // 설정된 floor index 에 해당하는 floor 정보가 있으면
        await this.handleDisconnectSocket();
        let image_path = floor.map_image;
        if (!floor.map_image.includes('http://')) {
          image_path = `http://${this.context.websocket_url}/images/floorplan/${floor.map_image}`;
        }
        this.props.changeMapType(2, this.props.currBuildingIdx, floor.idx, this.props.currBuildingServiceType);
        // this.setState({
        //   bgImage: image_path,
        // });
      }
    }
  }

  handleChangeCamera = (e) => {
    this.setState({ modalCurrentCamera: e.currentTarget.value });
  }
  
  handleChangeEbell = (e) => {
    this.setState({ modalCurrentEbell: e.currentTarget.value });
  }

  handleChangeDoor = (e) => {
    this.setState({ modalCurrentDoor: e.currentTarget.value });
  }

  handleChangeBreathSensor = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleChangePids = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleChangePidsZone = (e) => {
    // const { name, value } = e.target;
    this.setState({ modalCurrentPidsZone: e.currentTarget.value });
  }

  handleChangeCameraDoor = (e) => {
    this.setState({ modalCurrentCameraDoor: e.currentTarget.value });
  }

  handleChangeCameraBreathSensor = (e) => {
    this.setState({ modalCurrentCameraBreathSensor: e.currentTarget.value });
  }
  
  handleChangeCameraPids= (e) => {
    this.setState({ modalCurrentCameraPids: e.currentTarget.value });
  }

  handleChangeCameraEbell = (e) => {
    this.setState({ modalCurrentCameraEbell: e.currentTarget.value });
  }

  handleChangeDelGdp200List = (e) => {
    this.setState({ modalCurrentGdp200DelList: e.currentTarget.value });
  }

  handleChangeApplySchduleGroup = (e) => {
    this.setState({ modalCurrentScheduleGroup: e.currentTarget.value });
  }

  handleChangeBreathValue = (e) => {
    this.setState({ modalCurrentBreathSensorBreathValue: e.currentTarget.value });
  }

  handleChangeAddBreathSensorMode = (e) => {
    this.setState({ modalCurrentBreathSensorMode: e.currentTarget.value });
  }

  getMidCoordinate = (source, target) => {
    let result
    if(target > source) {
      result = target - parseInt(target - source) / 2;
    } else {
      result = source - parseInt(source - target) / 2; 
    }
    return result;
  }

  AddDeviceToElement = async (elements) => {
    if (this.props.deviceList && this.props.deviceList.length > 0) {
      this.props.deviceList.forEach((device, index) => {
        if (device.type === 'door' &&
          device.building_idx === this.props.currBuildingIdx &&
          device.building_service_type === this.props.currBuildingServiceType &&
          device.floor_idx === this.props.currFloorIdx &&
          device.latitude !== '' && device.longitude !== '') {
          let icon = iconDoor;
          if(device.status !== 0 && device.status !== '0') { icon = iconDoorEvent }
          elements.push({
            data: {
              // parent: 'background2',
              id: device.type + '.' + device.id,
              idx: device.idx,
              device_id: device.id,
              label: device.name,
              device_type: 'door',
              value: 'dooricon',
              buildingIdx: device.building_idx,
              floorIdx: device.floor_idx,
              buildingServiceType: device.building_service_type,
              ipaddress: device.ipaddress,
              camera_id: device.camera_id,
              service_type: device.service_type
            },
            style: {
              fontSize: 15,
              backgroundColor: 'green',
              fontWeight: 'bold',
              textValign: 'bottom',
              color: 'black',
              shape: 'ellipse',
              backgroundImage: icon,
              backgroundFit: 'cover',
              zIndex: '1',
              textBackgroundOpacity: 1,
              textBackgroundColor: "#FFB74D",
              textBackgroundShape: "roundrectangle",
              textBorderColor: "gray",
              textBorderWidth: 0.5,
              textBorderOpacity: 1,
            },
            position: {
              //x: 0+((index-1)*100),
              //y: 200,
              x: parseFloat(device.latitude),
              y: parseFloat(device.longitude)
            },
            locked: true,
            grabbable: false,
          });
          // this.setState({
          //   selectedShapeDoor: {
          //     idx: device.idx,
          //     device_id: device.id,
          //     building_idx: device.building_idx,
          //     building_service_type: device.building_service_tpe,
          //     floor_idx: device.floor_idx,
          //     device_type: device.type,
          //     device_name: device.name,
          //     location: device.location,
          //     ipaddress: device.ipaddress,
          //     latitude: device.latitude,
          //     longitude: device.longitude,
          //     camera_id: device.camera_id,
          //     status: device.status,
          //     service_type: device.service_type
          //   }
          // })
        } else if (device.type === 'ebell' &&
          device.building_idx === this.props.currBuildingIdx &&
          device.building_service_type === this.props.currBuildingServiceType &&
          device.floor_idx === this.props.currFloorIdx &&
          device.latitude !== '' && device.longitude !== '') {
          let icon = iconEbellNormal;
          if(device.status !== 0 && device.status !== '0') { icon = iconEbellEvent }
          elements.push({
            data: {
              id:  device.type + '.' + device.id,
            // parent: 'background2',
              device_id: device.id,
              idx: device.idx,
              label: device.name,
              device_type: 'ebell',
              value: 'ebellicon',
              buildingIdx: device.building_idx,
              floorIdx: device.floor_idx,
              buildingServiceType: device.building_service_type,
              ipaddress: device.ipaddress,
              camera_id: device.camera_id,
              service_type: device.service_type
              },
            style: {
              fontSize: 15,
              backgroundColor: 'green',
              fontWeight: 'bold',
              textValign: 'bottom',
              color: 'black',
              shape: 'ellipse',
              backgroundImage: icon,
              backgroundFit: 'cover',
              zIndex: '1',
              textBackgroundOpacity: 1,
              textBackgroundColor: "#FFB74D",
              textBackgroundShape: "roundrectangle",
              textBorderColor: "gray",
              textBorderWidth: 0.5,
              textBorderOpacity: 1,
            },
            position: {
              //x: 0+((index-1)*100),
              //y: 200,
              x: parseFloat(device.latitude),
              y: parseFloat(device.longitude)
            },
            locked: true,
            grabbable: false,
          });
          // this.setState({
          //   selectedShapeEbell: {
          //     idx: device.idx,
          //     device_id: device.id,
          //     building_idx: device.building_idx,
          //     building_service_type: device.building_service_tpe,
          //     floor_idx: device.floor_idx,
          //     device_type: device.type,
          //     device_name: device.name,
          //     location: device.location,
          //     ipaddress: device.ipaddress,
          //     latitude: device.latitude,
          //     longitude: device.longitude,
          //     camera_id: device.camera_id,
          //     status: device.status,
          //     service_type: device.service_type
          //   }
          // })
        } else if (device.type === 'guardianlite' &&
          device.building_idx === this.props.currBuildingIdx &&
          device.building_service_type === this.props.currBuildingServiceType &&
          device.floor_idx === this.props.currFloorIdx &&
          device.latitude !== '' && device.longitude !== '') {
          let icon = iconGuardianlite;
          //if(device.status === 1 || device.status === '1') { icon = iconEbellEvent }
          elements.push({
            data: {
              id: device.type + '.' + device.id,
              // parent: 'background2',
              device_id: device.id,
              idx: device.idx,
              label: device.name,
              device_type: 'guardianlite',
              value: 'guardianliteicon',
              buildingIdx: device.building_idx,
              floorIdx: device.floor_idx,
              buildingServiceType: device.building_service_type,
              ipaddress: device.ipaddress,
              camera_id: device.camera_id,
              service_type: device.service_type
            },
            style: {
              fontSize: 15,
              backgroundColor: 'green',
              fontWeight: 'bold',
              textValign: 'bottom',
              color: 'black',
              shape: 'ellipse',
              backgroundImage: icon,
              backgroundFit: 'cover',
              zIndex: '1',
              textBackgroundOpacity: 1,
              textBackgroundColor: "#FFB74D",
              textBackgroundShape: "roundrectangle",
              textBorderColor: "gray",
              textBorderWidth: 0.5,
              textBorderOpacity: 1,
            },
            position: {
              //x: 0+((index-1)*100),
              //y: 200,
              x: parseFloat(device.latitude),
              y: parseFloat(device.longitude)
            },
            locked: true,
            grabbable: false,
          });
        } else if (device.type === 'breathSensor' &&
          device.building_idx === this.props.currBuildingIdx &&
          device.building_service_type === this.props.currBuildingServiceType &&
          device.floor_idx === this.props.currFloorIdx &&
          device.latitude !== '' && device.longitude !== '') {
          const findBreath = this.props.breathSensorList.find((breath) => breath.ipaddress === device.ipaddress);
          if(findBreath) {
            let icon = iconBreathSensor;
            if(device.status !== 0 && device.status !== '0') { icon = iconBreathSensorEvent }
            elements.push({
              data: {
                // parent: 'background2',
                id: 'breathSensor.' + device.id,
                device_id: device.id,
                idx: device.idx,
                label: device.name,
                device_type: 'breathSensor',
                value: 'breathSensoricon',
                buildingIdx: device.building_idx,
                floorIdx: device.floor_idx,
                location: device.location,
                buildingServiceType: device.building_service_type,
                ipaddress: device.ipaddress,
                camera_id: device.camera_id,
                service_type: device.service_type,
                ipaddress: device.ipaddress,
                use_status: findBreath.use_status,
                prison_door_status: findBreath.prison_door_status,
                prison_door_id: findBreath.prison_door_id,
                schedule_group: findBreath.schedule_group,
                breath_value: findBreath.breath_value,
              },
              style: {
                fontSize: 11,
                backgroundColor: 'green',
                fontWeight: 'bold',
                textValign: 'bottom',
                color: 'black',
                shape: 'ellipse',
                width: '25px',
                height: '25px',
                backgroundImage: icon,
                backgroundFit: 'cover',
                zIndex: '1',
                textBackgroundOpacity: 1,
                textBackgroundColor: "#FFB74D",
                textBackgroundShape: "roundrectangle",
                textBorderColor: "gray",
                textBorderWidth: 0.5,
                textBorderOpacity: 1,
              },
              position: {
                //x: 0+((index-1)*100),
                //y: 200,
                x: parseFloat(device.latitude),
                y: parseFloat(device.longitude)
              },
              locked: true,
              grabbable: false,
            });
          } else {
            let icon = iconBreathSensor;
            if(device.status !== 0 && device.status !== '0') { icon = iconBreathSensorEvent }
            elements.push({
              data: {
                // parent: 'background2',
                id: device.type + '.' + device.id,
                device_id: device.id,
                idx: device.idx,
                label: device.name,
                device_type: 'breathSensor',
                value: 'breathSensoricon',
                buildingIdx: device.building_idx,
                floorIdx: device.floor_idx,
                buildingServiceType: device.building_service_type,
                ipaddress: device.ipaddress,
                camera_id: device.camera_id,
                service_type: device.service_type,
                ipaddress: device.ipaddress,
                // use_status: findBreath.use_status,
                // schedule_group: findBreath.schedule_group,
                // breath_value: findBreath.breath_value,
              },
              style: {
                fontSize: 11,
                backgroundColor: 'green',
                fontWeight: 'bold',
                textValign: 'bottom',
                color: 'black',
                shape: 'ellipse',
                width: '25px',
                height: '25px',
                backgroundImage: icon,
                backgroundFit: 'cover',
                zIndex: '1',
                textBackgroundOpacity: 1,
                textBackgroundColor: "#FFB74D",
                textBackgroundShape: "roundrectangle",
                textBorderColor: "gray",
                textBorderWidth: 0.5,
                textBorderOpacity: 1,
              },
              position: {
                //x: 0+((index-1)*100),
                //y: 200,
                x: parseFloat(device.latitude),
                y: parseFloat(device.longitude)
              },
              locked: true,
              grabbable: false,
            });
          }
        }
        // this.setState({
          //   selectedShapeBreathSensor: {
          //     idx: device.idx,
          //     device_id: device.id,
          //     building_idx: device.building_idx,
          //     building_service_type: device.building_service_tpe,
          //     floor_idx: device.floor_idx,
          //     device_type: device.type,
          //     device_name: device.name,
          //     location: device.location,
          //     ipaddress: device.ipaddress,
          //     latitude: device.latitude,
          //     longitude: device.longitude,
          //     camera_id: device.camera_id,
          //     status: device.status,
          //     service_type: device.service_type
          //   }
          // })
      });
    }

    if (this.props.cameraList && this.props.cameraList.length > 0) {
      this.props.cameraList.forEach((device, index) => {
        if (device.building_idx === this.props.currBuildingIdx &&
          device.building_service_type === this.props.currBuildingServiceType &&
          device.floor_idx === this.props.currFloorIdx &&
          device.latitude !== '' && device.longitude !== '') {
          let icon = iconCamera
          if (device.status !== 0 && device.status !== '0'){icon = iconCameraEvent}
          elements.push({
            data: {
              // parent: 'background2',
              id: 'camera.' + device.cameraid,
              device_id: device.cameraid,
              idx: index,
              label: device.cameraid + '.' + device.cameraname,
              device_type: 'camera',
              value: 'cameraicon',
              buildingIdx: device.building_idx,
              floorIdx: device.floor_idx,
              buildingServiceType: device.building_service_type,
              ipaddress: device.ipaddress,
              camera_id: device.cameraid,
              service_type: device.service_type
            },
            style: {
              fontSize: 15,
              backgroundColor: 'green',
              fontWeight: 'bold',
              textValign: 'bottom',
              color: 'black',
              shape: 'ellipse',
              backgroundImage: icon, 
              backgroundFit: 'cover cover',
              zIndex: '1',
              textBackgroundOpacity: 1,
              textBackgroundColor: "#FFB74D",
              textBackgroundShape: "roundrectangle",
              textBorderColor: "gray",
              textBorderWidth: 0.5,
              textBorderOpacity: 1,
            },
            position: {
              //x: 0+((index-1)*100),
              //y: 200,
              x: parseFloat(device.latitude),
              y: parseFloat(device.longitude)
            },
            locked: true,
            grabbable: false,
          });
        }
        // this.setState({
        //   selectedShapeCamera: {
        //     idx: index,
        //     device_id: device.id,
        //     building_idx: device.building_idx,
        //     building_service_type: device.building_service_tpe,
        //     floor_idx: device.floor_idx,
        //     device_type: 'camera',
        //     device_name: device.name,
        //     location: '',
        //     ipaddress: device.ipaddress,
        //     latitude: device.latitude,
        //     longitude: device.longitude,
        //     camera_id: device.id,
        //     status: device.status,
        //     service_type: device.service_type
        //   }
        // })
      });
    }

      // pids source
    if (this.props.pidsList && this.props.pidsList.length > 0) {
      this.props.pidsList && this.props.pidsList.forEach((device, index) => {
        if (device.building_idx === this.props.currBuildingIdx &&
          device.building_service_type === this.props.currBuildingServiceType &&
          device.floor_idx === this.props.currFloorIdx &&
          device.source_latitude !== null && device.source_longitude !== null && device.target_latitude !== null && device.target_longitude !== null) {
          let color = 'blue';
        if (device.status !== 0 && device.status !== '0') {color = 'red'}
            elements.push({
              data: {
                // parent: 'background2',
                id: 'pids.' + device.source,
                device_id: device.pidsid,
                // idx: device.idx,
                // label: device.source,
                device_type: 'zone',
                value: 'pidsicon',
                buildingIdx: device.building_idx,
                floorIdx: device.floor_idx,
                buildingServiceType: device.building_service_type,
                ipaddress: device.ipaddress,
                service_type: device.service_type
              },
              style: {
                width: '20px',
                height: '20px',
                fontSize: 15,
                backgroundColor: color,
                fontWeight: 'bold',
                textValign: 'bottom',
                color: 'black',
                shape: 'round-diamond',
                // backgroundImage: iconCamera,
                backgroundFit: 'cover',
                zIndex: '1',
                textBackgroundOpacity: 1,
                textBackgroundColor: "#FFB74D",
                textBackgroundShape: "roundrectangle",
                textBorderColor: "gray",
                textBorderWidth: 0.5,
                textBorderOpacity: 1,
              },
              locked: true,
              position: {
                //x: 0+((index-1)*100),
                //y: 200,
                x: parseFloat(device.source_latitude),
                y: parseFloat(device.source_longitude)
              },
            })
        }
      })

        this.props.pidsList && this.props.pidsList.forEach((device, index) => {
          if (device.building_idx === this.props.currBuildingIdx &&
            device.building_service_type === this.props.currBuildingServiceType &&
            device.floor_idx === this.props.currFloorIdx &&
            device.source_latitude !== null && device.source_longitude !== null && device.target_latitude !== null && device.target_longitude !== null) {
            let color = 'blue';
            if (device.status !== 0 && device.status !== '0') {color = 'red';}
            elements.push({
              data: {
                // parent: 'background2',
                id: 'pids.' + device.target,
                device_id: device.pidsid,
                // idx: device.idx,
                // label: device.target,
                device_type: 'zone',
                value: 'pidsicon',
                buildingIdx: device.building_idx,
                floorIdx: device.floor_idx,
                buildingServiceType: device.building_service_type,
                ipaddress: device.ipaddress,
                service_type: device.service_type
              },
              style: {
                width: '20px',
                height: '20px',
                fontSize: 15,
                backgroundColor: color,
                fontWeight: 'bold',
                textValign: 'bottom',
                color: 'black',
                shape: 'round-diamond',
                // backgroundImage: iconCamera,
                backgroundFit: 'cover',
                zIndex: '1',
                textBackgroundOpacity: 1,
                textBackgroundColor: "#FFB74D",
                textBackgroundShape: "roundrectangle",
                textBorderColor: "gray",
                textBorderWidth: 0.5,
                textBorderOpacity: 1,
              },
              locked: true,
              position: { 
                //x: 0+((index-1)*100),
                //y: 200,
                x: parseFloat(device.target_latitude),
                y: parseFloat(device.target_longitude)
              },
            })
        }
      })

          this.props.pidsList && this.props.pidsList.forEach((device, index) => {
            if (device.building_idx === this.props.currBuildingIdx &&
              device.building_service_type === this.props.currBuildingServiceType &&
              device.floor_idx === this.props.currFloorIdx &&
              device.source_latitude !== null && device.source_longitude !== null && device.target_latitude !== null && device.target_longitude !== null) { 
                let color = 'blue';
                if (device.status !== 0 && device.status !== '0') {color = 'red'}
              elements.push({
                data: {
                  id: 'pids.' + device.pidsid,
                  device_id: device.pidsid,
                  // class: "consumption",
                  cardinality: 0,
                  source: device.source,
                  target: device.target,
                  // parent: 'background2',
                  // idx: device.idx,
                  label: device.pidsid,
                  type: 'zone',
                  value: 'pidsicon',
                  service_type: device.service_type,
                  camera_id: device.camera_id,
                  // buildingIdx: device.building_idx,
                  // floorIdx: device.floor_idx,
                  // buildingServiceType: device.building_service_type,
                  // ipaddress: device.ipaddress,
                  // serviceType: device.service_type
                },
                style: {
                  label: device.pidsid,
                  // lineType: 'contiguous arrow',
                  // lineStyle: 'dotted',
                  lineStyle: "dashed",
                  lineDashPattern: [8, 4],
                  lineColor: color,
                  fontWeight: 'bold',
                  // group: "edges",
                  // removed: false,
                  // selected: false,
                  // selectable: true,
                  // locked: false,
                  // grabbable: true,
                  // pannable: true,
                  // classes: "",
                  zIndex: '1',
                  textBackgroundOpacity: 1,
                  textBackgroundColor: "#FFB74D",
                  textBackgroundShape: "roundrectangle",
                  textBorderColor: "gray",
                  textBorderWidth: 0.5,
                  textBorderOpacity: 1,
                },
              })
        }
      })
    }
  }

  async componentWillUnmount() {
    this._isMounted = false;
    await this.handleClosePopup();
    await this.handleCloseEbellPopup();
    await this.handleCloseDoorPopup();
    await this.handleCloseBreathSensorPopup();
    await this.handleCloseModalDoorRec();
  }

  async componentDidMount() {
    this._isMounted = true;
    this.defaultShowingDate();
    const newElements = [];
    if (this.props.currBuildingIdx &&
      this.props.currBuildingServiceType &&
      this.props.currFloorIdx &&
      this.props.floorList && this.props.floorList.length > 0) {
      const currFloor = this.props.floorList.find((floor) => {
        if (floor.building_idx === this.props.currBuildingIdx && floor.idx === this.props.currFloorIdx && floor.service_type === this.props.currBuildingServiceType) {
          return true;
        }
      });
      if (currFloor) {
        newElements.push(
          {
            data: {
              id: 'background',
              type: 'background',
              value: 'background',
              label: '',
              idx: currFloor.idx,
              buildingIdx: currFloor.building_idx
            },
            style: {
              backgroundImage: `http://${this.context.websocket_url}/images/floorplan/${currFloor.map_image}`,
              minWidth: '1000px',
              minHeight: '600px',
              width: '1000px',
              height: '660px',
              zIndex: '0',
              backgroundFit: 'cover',
              backgroundColor: '#141414',
              borderColor: '#141414',
              shape: 'rectangle',
            },
            locked: true,
            position: {
              x: 0,
              y: 0
            },
          },
          // 투명 layer 추가
          {
            data: {
              parent: 'background',
              id: 'parent',
              type: 'parent',
              value: 'parent'
            },
            style: {
              minWidth: '2000px',
              minHeight: '1500px',
              backgroundFit: 'cover cover',
              backgroundOpacity: '0',
              borderOpacity: '0'
            },
            zIndex: '-2',
            locked: true,
            selectable: false,
          },
        );

        await this.AddDeviceToElement(newElements);
      }
    }

    const config = {
      container: this.cyRef.current,
      elements: newElements,
      style: [
        {
          selector: 'node[name]',
          style: {
            'content': 'data(name)'
          }
        },

        {
          selector: 'edge[id]',
          style: {
            curveStyle: 'bezier',
            targetArrowShape: 'triangle'
          }
        },
        // {
        //   selector: '.eh-handle',
        //   style: {
        //     backgroundColor: 'red',
        //     width: 12,
        //     height: 12,
        //     shape: 'ellipse',
        //     overlayOpacity: 0,
        //     borderWidth: 12, // makes the handle easier to hit
        //     borderOpacity: 0
        //   }
        // },

        // {
        //   selector: '.eh-hover',
        //   style: {
        //     backgroundColor: 'red'
        //   }
        // },

        // {
        //   selector: '.eh-source',
        //   style: {
        //     borderWidth: 2,
        //     borderColor: 'red'
        //   }
        // },

        // {
        //   selector: '.eh-target',
        //   style: {
        //     borderWidth: 2,
        //     borderColor: 'red'
        //   }
        // },

        // {
        //   selector: '.eh-preview, .eh-ghost-edge',
        //   style: {
        //     backgroundColor: 'red',
        //     lineColor: 'red',
        //     targetArrowColor: 'red',
        //     sourceArrowColor: 'red'
        //   }
        // },

        // {
        //   selector: '.eh-ghost-edge.eh-preview-active',
        //   style: {
        //     opacity: 0
        //   }
        // }
      ],
      layout: { 
        name: 'preset',
        ready: function(){},
        stop: function(){}
      },
      zoom: 1.2,
      wheelSensitivity: 0.2,
      minZoom: 1.2,
      maxZoom: 3,
    }
    const currFloor = this.props.floorList.find((floor) => {
      if (floor.building_idx === this.props.currBuildingIdx && floor.idx === this.props.currFloorIdx && floor.service_type === this.props.currBuildingServiceType) {
        return true;
      }
    });
    if(currFloor) {
      if (config.elements.length === 0) {
        config.elements.push(
          {
            data: {
              id: 'background',
              type: 'background',
              value: 'background',
              label: '',
              idx: 1,
              buildingIdx: 1
            },
            style: {
              backgroundImage: `http://${this.context.websocket_url}/images/floorplan/${currFloor.map_image}`,
              minWidth: '1000px',
              minHeight: '600px',
              width: '1000px',
              height: '660px',
              zIndex: '0',
              backgroundFit: 'cover',
              backgroundColor: '#141414',
              borderColor: '#141414',
              shape: 'rectangle',
            },
            locked: true,
            position: {
              x: 0,
              y: 0
            },
          },
  
          // 투명 layer
          {
            data: {
              parent: 'background',
              id: 'parent',
              type: 'parent',
              value: 'parent'
            },
            style: {
              minWidth: '2000px',
              minHeight: '1500px',
              backgroundFit: 'cover cover',
              backgroundOpacity: '0',
              borderOpacity: '0'
            },
            zIndex: '-2',
            locked: true,
            selectable: false,
          },
        );
      }

    }
    const cy = cytoscape(config);
    
    // const eh = cy.edgehandles();

    cy.style([
      {
        selector: "node",
        style: {
          label: "data(label)",
          shape: "rectangle",
        }
      },
      {
        selector: ".mid",
        style: {
          width: 8,
          height: 8,
          label: ""
        }
      }
    ]);

    const showDevicePopup = (e) => {
      this.showDevicePopup(e)
    }

    const handleShowModifyDeleteContext = (e) => {
      this.handleShowModifyDeleteContext(e)
    }

    cy.on('cxttap', (e) => {
      this.setState({ selectedShape: e.target._private.data});
      this.setState({ mapClickPoint: { x: e.position.x , y: e.position.y}});
      // handleShowModifyDeleteContext(e);
    })

    cy.on('tap', async (e) => {
      if(e.target._private.data.device_type === "breathSensor") {
        this.props.readBreathSensorList();
        const bSensor = this.props.breathSensorList.find((sensor) => sensor.ipaddress === e.target._private.data.ipaddress)
        this.setState({ breathSensorData: bSensor, bbSensor: bSensor.ipaddress })
      }
      // this.state.cy.resize()
      const socket = this.props.socketClient;
      const findCamera = this.props.cameraList.find((camera) => (camera.cameraid === e.target._private.data.device_id && camera.service_type === e.target._private.data.service_type));
      const findDevice = this.props.deviceList.find((device) => (device.id === e.target._private.data.device_id && device.service_type === e.target._private.data.service_type));
      const findZone = this.props.pidsList.find((device) => (device.pidsid === e.target._private.data.device_id && device.service_type === e.target._private.data.service_type));
      // 이벤트가 발생한 해당 장치 팝업 띄우기
      if (findCamera) {
        const res = this.state.cy && this.state.cy.getElementById('camera.'+findCamera.cameraid);
        if (res && res._private && res._private.data) {
          if(this.state.liveStreamCamera && this.state.liveStreamCamera.cameraid === findCamera.cameraid) {
            return;
          } else if(socket && this.state.liveStreamCamera){
            socket.emit('cameraStream', { 
              cameraId: this.state.liveStreamCamera.cameraid,
              cmd: 'off'
            });
            this.setState({ liveStreamCamera: undefined });
            this.handleClosePopup();
          }
          const event = {
            originalEvent: {
              button: 0,
              clientX: parseInt(res.renderedPosition().x) + 450,
              clientY: parseInt(res.renderedPosition().y) + 170
            },
            target: res
          }
          this.showDevicePopup(event);
        }
      } else if (findDevice) {
        const res = this.state.cy && this.state.cy.getElementById(findDevice.type + '.' + findDevice.id);
        if (res && res._private && res._private.data) {
          if(findDevice.type === 'door') {
            if(this.state.liveStreamDoor && this.state.liveStreamDoor.id === findDevice.id) {
              return;
            } else if(socket && this.state.liveStreamDoor){
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamDoor.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamDoor: undefined });
              this.setState({ liveStreamDoorCheckReceived: false });
              this.handleCloseDoorPopup();
            }
          } else if (findDevice.type === 'ebell') {
            if(this.state.liveStreamEBell && this.state.liveStreamEBell.id === findDevice.id) {
              return;
            } else if(socket && this.state.liveStreamEBell){
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamEBell.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamEBell: undefined });
            }
          } else if (findDevice.type === 'breathSensor') { 
            if(this.state.liveStreamBreathSensor && this.state.liveStreamBreathSensor.ipaddress === findDevice.ipaddress) {
              return;
            } else if(socket && this.state.liveStreamBreathSensor){
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamBreathSensor.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamBreathSensor: undefined });
              this.handleCloseBreathSensorPopup();
            }
            if (this.state.breathSensorIp && this.state.breathSensorIp === findDevice.ipaddress) {
              return;
            } else if(this.state.breathSensorIp) {
              if (this.props.breathSocketClient) {
                await this.props.breathSocketClient.emit('setbreath', { sensorIp: this.state.breathSensorIp, cmd: 'off' });
                await this.props.handleRespiration();
              }
              let emptyDataArr = {
                labels: [''],
                datasets: [
                  {
                    label: '측정값',
                    data: [],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 0.3,
                  },
                  {
                    label: '임계치',
                    data: [],
                    borderColor: [
                      'white',
                    ],
                    borderWidth: 0.5,
                  }
                ],
              }
              await this.setState({
                breathSensorIp: '',
                dataArr: emptyDataArr,
                xGraphTime: '',
                breathValue: '',
                breathSensorData: '',
                respiration: ''
              });
              this.handleCloseBreathSensorPopup();
            }
          }
          const event = {
            originalEvent: {
              button: 0,
              clientX: parseInt(res.renderedPosition().x) + 450,
              clientY: parseInt(res.renderedPosition().y) + 170
            },
            target: res
          }
          await this.showDevicePopup(event);
        }
      } else if (findZone) {
        const res = this.state.cy && this.state.cy.getElementById(findZone.pidsid);
        if (res && res._private && res._private.data) {
          if(this.state.liveStreamZone && this.state.liveStreamZone.pidsid === findDevice.pidsid) {
            return;
          } else if(socket && this.state.liveStreamZone){
            socket.emit('cameraStream', { 
              cameraId: this.state.liveStreamZone.camera_id,
              cmd: 'off'
            });
            this.setState({ liveStreamZone: undefined });
          }
          const event = {
            originalEvent: {
              button: 0,
              clientX: this.getMidCoordinate(res._private.source.renderedPosition().x, res._private.target.renderedPosition().x) + 450,
              clientY: this.getMidCoordinate(res._private.source.renderedPosition().y, res._private.target.renderedPosition().y) + 170
            },
            target: res
          }
          this.showDevicePopup(event);
        }
      }

      this.state.cy.on('click', (e) => {
        if( e && e.length !== 0){
          if (e.target._private.data.id === 'background') {
            this.state.cy
              .layout({
                name: "preset",
                ready: function () {},
              })
              .run();
          }
        }
      })
      if( this.state.editMode === true ) {
        if( this.state.mapClickPoint ) {
          this.pidsFunction(e);
        }
      }
    })

    const options = {
      // Customize event to bring up the context menu
      // Possible options https://js.cytoscape.org/#events/user-input-device-events
      evtType: 'cxttap',
      // List of initial menu items
      // A menu item must have either onClickFunction or submenu or both
      menuItems: [],
      // css classes that menu items will have
      menuItemClasses: [
        // add class names to this list
      ],
      // css classes that context menu will have
      contextMenuClasses: [
        // add class names to this list
        'contextMenu'
      ],
      // Indicates that the menu item has a submenu. If not provided default one will be used
      submenuIndicator: { src: 'assets/submenu-indicator-default.svg', width: 12, height: 12 }
    };

    let instance = cy.contextMenus(options);

    const handleShowModalAddCamera = (e) => {
      this.handleShowModalAddCamera(e)
    }
    const handleShowModalAddEbell = (e) => {
      this.handleShowModalAddEbell(e)
    }
    const handleCameraForEbell = (e) => {
      this.handleCameraForEbell(e)
    }
    const handleShowModalAddDoor = (e) => {
      this.handleShowModalAddDoor(e)
    }
    const handleShowModalAddBreathSensor = (e) => {
      this.handleShowModalAddBreathSensor(e)
    }
    const handleShowModalAddGuardianlite = (e) => {
      this.handleShowModalAddGuardianlite(e)
    }
    const handleAddGdp200 = (e) => {
      this.handleAddGdp200(e)
    }
    const handleRemoveEbell = (e) => {
      this.handleRemoveEbell(e)
    }
    const handlePidsEdit = (e) => {
      this.handlePidsEdit(e)
    }
    const handleStopAnimation = (e) => {
      this.handleStopAnimation(e)
    }
    const handleModalShowRemoveGdp200List = (e) => {
      this.handleModalShowRemoveGdp200List(e)
    }
    const handleLockDoor = (e) => {
      this.handleLockDoor(e)
    }
    const handleUnlock10sDoor = (e) => {
      this.handleUnlock10sDoor(e)
    }
    const handleUnlockDoor = (e) => {
      this.handleUnlockDoor(e)
    }
    const handleDoorLog = (e) => {
      this.handleDoorLog(e)
    }
    const handleBreathEventLog = (e) => {
      this.handleBreathEventLog(e)
    }
    const handleAddMapDoorRec = (e) => {
      this.handleAddMapDoorRec(e)
    }
    const handleCameraDoor = (e) => {
      this.handleCameraDoor(e)
    }
    const handleRemoveDoor = (e) => {
      this.handleRemoveDoor(e)
    }
    const handleCameraBreathSensor = (e) => {
      this.handleCameraBreathSensor(e)
    }
    const handleRemovePids = (e) => {
      this.handleRemovePids(e)
    }
    const handleCameraPids = (e) => {
      this.handleCameraPids(e)
    }
    const handleRemoveBreathSensor = (e) => {
      this.handleRemoveBreathSensor(e)
    }
    const handleActiveBreathSensor = (e) => {
      this.handleActiveBreathSensor(e)
    }
    const handleScheduleBreathSensor = (e) => {
      this.handleScheduleBreathSensor(e)
    } 
    const handleSetBreathValue = (e) => {
      this.handleSetBreathValue(e)
    }
    const handleRemoveGuardianlite = (e) => {
      this.handleRemoveGuardianlite(e)
    }
    const handleConfirmAllEvent = (e) => {
      this.handleConfirmAllEvent(e)
    }
    const handleRemoveCamera = () => {
      this.handleRemoveCamera()
    }
    const getMidCoordinate = (source, target) => {
      this.getMidCoordinate(source, target)
    }

    let menuItem = [
      {
        id: 'add-camera',
        content: '&nbsp' + ' 카메라 추가',
        image: { src: iconCameraAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        onClickFunction: handleShowModalAddCamera
      },
      {
        id: 'add-door',
        content: '&nbsp' + ' 출입문 추가',
        image: { src: iconDoorAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        onClickFunction: handleShowModalAddDoor
      },
      {
        id: 'add-breathSensor',
        content: '&nbsp' + ' 호흡감지센서 추가',
        image: { src: iconBreathSensorAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        //hasTrailingDivider: true,
        onClickFunction: handleShowModalAddBreathSensor
      },
      {
        id: 'add-guardianlite',
        content: '&nbsp' + ' 전원장치 추가',
        image: { src: iconGuardianliteAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        hasTrailingDivider: true,
        onClickFunction: handleShowModalAddGuardianlite
      },
      {
        id: 'add-ebell',
        content: '&nbsp' + ' 비상벨 추가',
        image: { src: iconEbellAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        hasTrailingDivider: true,
        onClickFunction: handleShowModalAddEbell
      },
      // 카메라 메뉴
      {
        id: 'remove-camera',
        content: '&nbsp' + ' 카메라 삭제',
        tooltipText: 'remove',
        image: { src: iconCameraRemove, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="camera"]',
        hasTrailingDivider: false,
        onClickFunction: handleRemoveCamera
      },
      {
        id: 'acknowledge-allEvent-camera',
        content: '&nbsp' + ' 전체 이벤트 알람 해제',
        image: { src: iconEventClear, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="camera"]',
        coreAsWell: false,
        onClickFunction: handleConfirmAllEvent
      },

      // 비상벨 메뉴
      {
        id: 'delete-ebell',
        content: '&nbsp' + ' 비상벨 삭제',
        image: { src: iconEbellRemove, width: 17, height: 17, x: 3, y: 2 }, // 삭제 아이콘 필요
        selector: 'node[device_type="ebell"]',
        coreAsWell: false,
        // show: false, // 추후 비상벨 직접 삭제 시 true 변경
        onClickFunction: handleRemoveEbell,
      },
      {
        id: 'setCamera-ebell',
        content: '&nbsp' + ' 비상벨 카메라 설정',
        image: { src: iconDoorUpdate, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="ebell"]',
        hasTrailingDivider: false,
        onClickFunction: handleCameraForEbell
      },

      // 출입문 메뉴
      {
        id: 'lock-door',
        content: '&nbsp' + ' 출입문 잠금',
        image: { src: iconDoorLock, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        onClickFunction: handleLockDoor
      },
      {
        id: 'unlock10sec-door',
        content: '&nbsp' + ' 출입문 잠금 해제(10초)',
        image: { src: iconDoorUnlock10, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        onClickFunction: handleUnlock10sDoor
      },
      {
        id: 'unlock-door',
        content: '&nbsp' + ' 출입문 잠금 해제',
        image: { src: iconDoorUnlock, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        onClickFunction: handleUnlockDoor
      },
      {
        id: 'door-log',
        content: '&nbsp' + ' 출입 기록 조회',
        image: { src: iconDoorLog, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        onClickFunction: handleDoorLog
      },
      {
        id: 'recCamera-door',
        content: '&nbsp' + ' 직전 이벤트 영상 보기',
        image: { src: iconDoorLiveVideo, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        hasTrailingDivider: true,
        onClickFunction: handleAddMapDoorRec
      },
      {
        id: 'setCamera-door',
        content: '&nbsp' + ' 카메라 설정',
        image: { src: iconDoorUpdate, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        hasTrailingDivider: true,
        onClickFunction: handleCameraDoor
      },
      {
        id: 'delete-door',
        content: '&nbsp' + ' 출입문 삭제',
        image: { src: iconDoorRemove, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        onClickFunction: handleRemoveDoor
      },
      {
        id: 'acknowledge-allEvent-door',
        content: '&nbsp' + ' 이벤트 알림 해제',
        image: { src: iconEventClear, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="door"]',
        coreAsWell: false,
        onClickFunction: handleConfirmAllEvent
      },

      // 호흡감지 센서 메뉴
      {
        id: 'activeMode',
        content: '&nbsp' + ' 센서동작 ON/OFF',
        image: { src: iconBreathOnOff, width: 17, height: 17, x: 3, y: 2 },
        // tooltipText: 'AUTO 시 문 상태에 따라 동작하고, OFF 일 경우 문 상태와 상관없이 센서 동작 OFF',
        selector: 'node[device_type="breathSensor"]',
        onClickFunction: handleActiveBreathSensor
      },
      {
        id: 'setSchedule',
        content: '&nbsp' + ' 스케줄 그룹 할당',
        image: { src: iconBreathSchedule, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="breathSensor"]',
        onClickFunction: handleScheduleBreathSensor
      },
      {
        id: 'setBreathValue',
        content: '&nbsp' + ' 임계치 설정',
        image: { src: iconBreathValueSetting, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="breathSensor"]',
        hasTrailingDivider: true,
        onClickFunction: handleSetBreathValue
      },
      {
        id: 'remove',
        content: '&nbsp' + ' 호흡감지센서 삭제',
        tooltipText: 'remove',
        image: { src: iconBreathSensorRemove, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="breathSensor"]',
        hasTrailingDivider: true,
        onClickFunction: handleRemoveBreathSensor
      },
      {
        id: 'setCamera-breathSensor',
        content: '&nbsp' + ' 카메라 설정',
        image: { src: iconDoorUpdate, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="breathSensor"]',
        coreAsWell: false,
        onClickFunction: handleCameraBreathSensor
      },
      {
        id: 'acknowledge-allEvent-breathSensor',
        content: '&nbsp' + ' 이벤트 알림 해제',
        image: { src: iconEventClear, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="breathSensor"]',
        coreAsWell: false,
        onClickFunction: handleConfirmAllEvent
      },
      {
        id: 'inquiry-breathSensor-event-history',
        content: '&nbsp' + ' 이벤트 조회',
        image: { src: iconDoorLog, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="breathSensor"]',
        coreAsWell: false,
        onClickFunction: handleBreathEventLog
      },
      // 가디언라이트 메뉴
      {
        id: 'delete-guardianlite',
        content: '&nbsp' + ' 전원장치 삭제',
        //tooltipText: 'remove',
        image: { src: iconGuardianliteRemove, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="guardianlite"]',
        hasTrailingDivider: true,
        onClickFunction: handleRemoveGuardianlite
      },
    ]

    instance.appendMenuItems(menuItem);
    this.setState({ cy: cy });
    // , () => this.pidsEventIconChange()
    await this.setState({ mounted: true });
  } 

  async componentDidUpdate(prevProps) {
    const newElements = [];
    if(prevProps.breathData.timestamp !== this.props.breathData.timestamp){
      this.setBreathValue(this.props.breathData.respiration)
    }
    if (this.props.currBuildingIdx !== prevProps.currBuildingIdx ||
      this.props.currFloorIdx !== prevProps.currFloorIdx ||
      this.props.currBuildingServiceType !== prevProps.currBuildingServiceType ||
      (this.props.floorList !== undefined && prevProps.floorList !== undefined && this.props.floorList.length !== prevProps.floorList.length) ||
      (this.props.deviceList !== undefined && prevProps.deviceList !== undefined && this.props.deviceList !== prevProps.deviceList) ||
      (this.props.pidsList !== undefined && prevProps.pidsList !== undefined && this.props.pidsList !== prevProps.pidsList) ||
      (this.props.breathSensorList !== undefined && prevProps.breathSensorList !== undefined && this.props.breathSensorList !== prevProps.breathSensorList) ||
      (this.props.cameraList !== undefined && prevProps.cameraList !== undefined && this.props.cameraList !== prevProps.cameraList)) {

      const currFloor = this.props.floorList.find((floor) => {
        if (floor.building_idx === this.props.currBuildingIdx && floor.idx === this.props.currFloorIdx && floor.service_type === this.props.currBuildingServiceType) {
          return true;
        }
      });
      if (currFloor) {
        newElements.push(
          {
            data: {
              id: 'background',
              type: 'background',
              value: 'background',
              label: '',
              idx: currFloor.idx,
              buildingIdx: currFloor.building_idx
            },
            style: {
              backgroundImage: `http://${this.context.websocket_url}/images/floorplan/${currFloor.map_image}`,
              minWidth: '1000px',
              minHeight: '600px',
              width: '1000px',
              height: '660px',
              zIndex: '0',
              backgroundFit: 'cover',
              backgroundColor: '#141414',
              borderColor: '#141414',
              shape: 'rectangle',
            },
            locked: true,
            position: {
              x: 0,
              y: 0
            },
          },
          // 투명 layer
          {
            data: {
              parent: 'background',
              id: 'parent',
              type: 'parent',
              value: 'parent'
            },
            style: {
              minWidth: '2000px',
              minHeight: '1500px',
              backgroundFit: 'cover cover',
              backgroundOpacity: '0',
              borderOpacity: '0'
            },
            zIndex: '-2',
            locked: true,
            selectable: false,
          },
        );

      await this.AddDeviceToElement(newElements);
      
      // const config = {
        //   elements: newElements
        // }
        this.state.cy.elements().remove();
        this.state.cy.add(newElements);
        
        this.handleCloseContext();
      } else {
        console.log('GCanvas componentDidMount currFloor 없음');
      }

      // animation
      let eventNodeArr = [];
      this.props.pidsList && this.props.pidsList.forEach((device, index) => {
        if (device.building_idx === this.props.currBuildingIdx &&
          device.building_service_type === this.props.currBuildingServiceType &&
          device.floor_idx === this.props.currFloorIdx &&
          device.source_latitude !== null && device.source_longitude !== null && device.target_latitude !== null && device.target_longitude !== null) { 
            if( device.status === 1) {
              eventNodeArr.push({
                device
              })
              // this.eventAnimationStart(eventCheck.pidsid)
            }
          }
        })
        this.setState({ nodeEventCheckArr: eventNodeArr});       
    }

    //  this.eventAnimationStart();

    if (this.props.accessControlEnter !== prevProps.accessControlEnter) {
      this.props.accessControlEnter.map(enter => {
        const doorId = enter.LogDoorID;
        const personId = enter.LogPersonID;
        const popup = document.getElementsByClassName('door' + doorId);
        if (popup && popup.length > 0 && personId && personId.length > 0) {
          const element = popup[0];
          element.childNodes[0].src = `http://${this.context.websocket_url}/images/access_control_person/${personId}.png`;
          popup[0].style.display = 'initial';
          const timeoutId = setTimeout(() => {
            popup[0].style.display = 'none';
          }, 10 * 1000);
        }
      });
    }

    if (this.props.eventPopup.timestamp != 0 &&
      this.props.eventPopup.timestamp !== prevProps.eventPopup.timestamp) {
        if(this.props.eventPopup.buildingIdx !== prevProps.eventPopup.buildingIdx || this.props.eventPopup.floorIdx !== prevProps.eventPopup.floorIdx || this.props.eventPopup.buildingServiceType !== prevProps.eventPopup.buildingServiceType) {
          await this.handleDisconnectSocket();
          await this.handleClosePopup();
          await this.handleCloseEbellPopup();
          await this.handleCloseDoorPopup();
          await this.handleCloseBreathSensorPopup();
          await this.handleCloseModalGuardianlite();
        }
      const socket = this.props.socketClient;
      const findCamera = this.props.cameraList.find((camera) => (camera.cameraid === this.props.eventPopup.deviceId && 'selectctl' === this.props.eventPopup.serviceType));
      const findDevice = this.props.deviceList.find((device) => (device.id === this.props.eventPopup.deviceId && device.service_type === this.props.eventPopup.serviceType));
      const findZone = this.props.pidsList.find((device) => (device.pidsid === this.props.eventPopup.deviceId && device.service_type === this.props.eventPopup.serviceType));
      // 이벤트가 발생한 해당 장치 팝업 띄우기
      if (findCamera) {
        const res = this.state.cy && this.state.cy.getElementById('camera.'+findCamera.cameraid);
        if(res && res._private && res._private.data) {
          if(this.state.liveStreamCamera && this.state.liveStreamCamera.cameraid === findCamera.cameraid) {
            return;
          } else if(socket && this.state.liveStreamCamera){
            socket.emit('cameraStream', { 
              cameraId: this.state.liveStreamCamera.cameraid,
              cmd: 'off'
            });
            this.setState({ liveStreamCamera: undefined });
            this.handleClosePopup();
          }
          const event = {
            originalEvent: {
              button: 0,
              clientX: parseInt(res.renderedPosition().x)+450,
              clientY: parseInt(res.renderedPosition().y)+170
            },
            target: res
          }
          this.showDevicePopup(event);
        }
      } else if (findDevice) {
        const res = this.state.cy && this.state.cy.getElementById(findDevice.type+ '.' + findDevice.id);
        if(res && res._private && res._private.data) {
          if(findDevice.type === 'door') {
            if(this.state.liveStreamDoor && this.state.liveStreamDoor.id === findDevice.id) {
              return;
            } else if(socket && this.state.liveStreamDoor){
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamDoor.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamDoor: undefined });
              this.setState({ liveStreamDoorCheckReceived: false });

            }
          } else if (findDevice.type === 'ebell') {
            if(this.state.liveStreamEBell && this.state.liveStreamEBell.id === findDevice.id) {
              return;
            } else if(socket && this.state.liveStreamEBell){
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamEBell.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamEBell: undefined });
            }
          } else if (findDevice.type === 'breathSensor') { 
            if(this.state.liveStreamBreathSensor && this.state.liveStreamBreathSensor.ipaddress === findDevice.ipaddress) {
              if(findDevice.camera_id){
                this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup event'});
              } else {
                this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup noCamera event'});
              }
              return;
            } else if(socket && this.state.liveStreamBreathSensor){
              this.props.readBreathSensorList();
              const bSensor = this.props.breathSensorList.find((sensor) => sensor.ipaddress === res._private.data.ipaddress)
              this.setState({ breathSensorData: bSensor });
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamBreathSensor.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamBreathSensor: undefined });
            }
            if (this.state.breathSensorIp && this.state.breathSensorIp === findDevice.ipaddress) {
              if(findDevice.camera_id){
                this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup event'});
              } else {
                this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup noCamera event'});
              }
              return;
            } else if(this.state.breathSensorIp.length > 0) {
              if (this.props.breathSocketClient) {
                await this.props.breathSocketClient.emit('setbreath', { sensorIp: this.state.breathSensorIp, cmd: 'off' });
                await this.props.handleRespiration();
          }
              let emptyDataArr = {
                labels: [''],
                datasets: [
                  {
                    label: '측정값',
                    data: [],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 0.3,
                  },
                  {
                    label: '임계치',
                    data: [],
                    borderColor: [
                      'white',
                    ],
                    borderWidth: 0.5,
                  }
                ],
              }
              await this.setState({
                breathSensorIp: '',
                dataArr: emptyDataArr,
                xGraphTime: '',
                breathValue: '',
                breathSensorData: ''
              });
              this.handleCloseBreathSensorPopup();
            }
          }
          const event = {
            originalEvent: {
              button: 0,
              clientX: parseInt(res.renderedPosition().x)+450,
              clientY: parseInt(res.renderedPosition().y)+170
            },
            target: res
          }
          await this.showDevicePopup(event);
          if(findDevice.type === 'breathSensor') {
            if(findDevice.camera_id){
              this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup event'});
            } else {
              this.setState({ breathSensorPopup: 'ol-indoor-breathSensor-popup noCamera event'});
            }
          }
        }
      } else if (findZone) {
        const res = this.state.cy && this.state.cy.getElementById('pids.' + findZone.pidsid);
        if(res && res._private && res._private.data) {
          if(this.state.liveStreamZone && this.state.liveStreamZone.pidsid === findDevice.pidsid) {
            return;
          } else if(socket && this.state.liveStreamZone){
            socket.emit('cameraStream', { 
              cameraId: this.state.liveStreamZone.camera_id,
              cmd: 'off'
            });
            this.setState({ liveStreamZone: undefined });
          }
          const event = {
            originalEvent: {
              button: 0,
              clientX: this.getMidCoordinate(res._private.source.renderedPosition().x, res._private.target.renderedPosition().x) + 450,
              clientY: this.getMidCoordinate(res._private.source.renderedPosition().y, res._private.target.renderedPosition().y) + 170
            },
            target: res
          }
          this.showDevicePopup(event);
        }
      }
    }

    if (this.props.guardianliteList !== prevProps.guardianliteList) {
      const guardianlite = this.props.guardianliteList.find(grdlte => grdlte.name === this.state.currGuardianlite);
      if (guardianlite) {
        this.setState({
          guardianliteCh1: guardianlite.ch1,
          guardianliteCh2: guardianlite.ch2,
          guardianliteCh3: guardianlite.ch3,
          guardianliteCh4: guardianlite.ch4,
          guardianliteCh5: guardianlite.ch5,
          guardianliteCh6: guardianlite.ch6,
          guardianliteCh7: guardianlite.ch7,
          guardianliteCh8: guardianlite.ch8,
          guardianliteTemper: guardianlite.temper,
        });
      }
    }
  }

  eventAnimationStart = () => {
  
    let blink = this.state.cy.edges();
      var evtPids = blink.animation({
      style: {
        'line-color': 'red',
        "width": 8,
      },
      duration: 1000
    });

    evtPids
    .play() // start
    .promise('completed').then(() => { // on next completed
        evtPids
        .reverse() // switch animation direction
        .rewind() // optional but makes intent clear
        .play().promise('complete').then(this.eventAnimationStart) // start again
        ;
      });

      this.setState({
        eventTest: evtPids
      })

    // this.state.nodeEventCheckArr.map((evt) => { 
      
    //   let blink = this.state.cy.edges(`'#${evt.eventCheck.pidsid}'`);
    //   let 
    //   var evtPids = blink.animation({
    //   style: {
    //     'line-color': 'red',
    //     "width": 8,
    //   },
    //   duration: 1000
    // });

    // evtPids
    // .play() // start
    // .promise('completed').then(() => { // on next completed
    //     evtPids
    //     .reverse() // switch animation direction
    //     .rewind() // optional but makes intent clear
    //     .play().promise('complete').then(this.eventAnimationStart) // start again
    //     ;
    //   });
    // })

  }

handleStopAnimation = (id, type) => {
  // if (id && (type === 'pids')) {
  //   this.state.cy.edge(`'#${id}'`).stop();
  //   this.state.cy.edge(`'#${id}'`).style({'line-color': 'blue'})  
  // } else {
  //   this.state.cy.nodes().stop();
  //   this.state.cy.nodes().style({'background-color': 'black'})
  // }
}

  handleClickNothing = (e) => {
    e.preventDefault();
  }

  handleCloseContext = () => {
    const menuMap = document.getElementsByClassName('menu-map');
    if (menuMap.length > 0 && menuMap[0] && menuMap[0].style) {
      menuMap[0].style.display = 'none';
    }

    const menuCamera = document.getElementsByClassName('menu-camera');
    if (menuCamera.length > 0 && menuCamera[0] && menuCamera[0].style) {
      menuCamera[0].style.display = 'none';
    }

    const menuEbell = document.getElementsByClassName('menu-ebell');
    if (menuEbell.length > 0 && menuEbell[0] && menuEbell[0].style) {
      menuEbell[0].style.display = 'none';
    }

    const menuDoor = document.getElementsByClassName('menu-door');
    if (menuDoor.length > 0 && menuDoor[0] && menuDoor[0].style) {
      menuDoor[0].style.display = 'none';
    }

    const menuBreathSensor = document.getElementsByClassName('menu-breathSensor');
    if (menuBreathSensor.length > 0 && menuBreathSensor[0] && menuBreathSensor[0].style) {
      menuBreathSensor[0].style.display = 'none';
    }

    const menuGuardianlite = document.getElementsByClassName('menu-guardianlite');
    if (menuGuardianlite.length > 0 && menuGuardianlite[0] && menuGuardianlite[0].style) {
      menuGuardianlite[0].style.display = 'none';
    }

    const menuPids = document.getElementsByClassName('menu-pids');
    if (menuPids.length > 0 && menuPids[0] && menuPids[0].style) {
      menuPids[0].style.display = 'none';
    }
  }

  handleShowModalAddCamera = async (e) => {
    this.setState({ mapClickPoint: { x: e.position.x, y: e.position.y } });

    // 카메라 추가 모달 보이기
    this.setState({
      modalCameraShow: true,
      modalCameraMode: 'add'
    });
    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleShowModalAddDoor = async (e) => {
    this.setState({
      modalDoorShow: true,
      modalDoorMode: 'add'
    });
    this.handleCloseContext();
  }

  handleShowModalAddBreathSensor = async () => {
    this.setState({
      modalBreathSensorShow: true,
      modalBreathSensorMode: 'add'
    });
    this.handleCloseContext();
  }

  handleAddGdp200 = () => {
    this.setState({
      modalPidsShow: true,
    });
  }

  handleShowModalAddEbell = (e) => {
    this.setState({
      mapClickPoint: { x: e.position.x, y: e.position.y },
      modalEbellShow: true,
      modalEbellMode: 'add'
    });
    // 팝업창 닫기
    this.handleCloseContext();
  }

  
  handleCameraForEbell = (e) => {
    this.setState({ 
      modalCameraEbellShow: true
    })
  }

  handleShowModalAddGuardianlite = async () => {
    this.setState({
      modalGuardianliteShow: true,
    });
    this.handleCloseContext();
  }

  handleShowAddContext = (e) => {
    e.evt.preventDefault();
    const popup = document.getElementById("indoor-popup");
    if (popup) {
      popup.classList.remove('active');
    }
    const ebell_popup = document.getElementById("indoor-ebell-popup");
    if (ebell_popup) {
      ebell_popup.classList.remove('active');
    }
    const door_popup = document.getElementById("indoor-door-popup");
    if (door_popup) {
      door_popup.classList.remove('active');
    }
    const breathSensor_popup = document.getElementById("indoor-breathSensor-popup");
    if (breathSensor_popup) {
      breathSensor_popup.classList.remove('active');
    }
    const pids_popup = document.getElementById("indoor-pids-popup");
    if (pids_popup) {
      pids_popup.classList.remove('active');
    }

    // 마우스 클릭위치 저장
    this.setState({ mapClickPoint: { x: e.evt.layerX, y: e.evt.layerY } });

    // 출입 기록 조회할 장치 정보 저장
    this.setState({ LogDoorID: e.target.attrs.device_id })

    if (e.target.getType() === 'Stage') {
      // 마우스 클릭위치에 contextmenu 표시
      const menu = document.getElementsByClassName('menu-map');
      for (let i = 0; i < menu.length; i++) {
        menu[i].classList.add('active');
      }
      if (menu.length > 0 && menu[0] && menu[0].style) {
        if ((e.evt.clientX > 450 && e.evt.clientX < 1264 && e.evt.clientY > 170 && e.evt.clientY < 946) && !(e.evt.clientX < 547 && e.evt.clientY < 257)) {
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY + 2 + 'px';
          menu[0].style.left = e.evt.clientX + 2 + 'px';
        } else if (e.evt.clientX >= 1265 && e.evt.clientX < 1433 && e.evt.clientY >= 946 && e.evt.clientY < 1049) {
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY - 122 + 'px';
          menu[0].style.left = e.evt.clientX - 189 + 'px';
        } else if (e.evt.clientX < 1264 && e.evt.clientY >= 946 && e.evt.clientY < 1049) {
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY - 122 + 'px';
          menu[0].style.left = e.evt.clientX + 2 + 'px';
        } else if ((e.evt.clientY > 170 && e.evt.clientY < 1049 && e.evt.clientX >= 1265 && e.evt.clientX < 1433) && !(e.evt.clientX > 1350 && e.evt.clientY < 243)) {
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY + 2 + 'px';
          menu[0].style.left = e.evt.clientX - 189 + 'px';
        }
      }
    }
  }

  handleCloseModalCamera = () => {
    this.setState({
      modalCurrentCamera: undefined,
      modalCameraShow: false,
      modalCameraFloorIdx: '',
      modalCameraLatitude: '',
      modalCameraLongitude: '',
      modalCameraWarn: ''
    });
  }

  handleCloseModalEbell = () => {
    this.setState({
      modalEbellShow: false,
      modalEbellFloorIdx: '',
      modalEbellLatitude: '',
      modalEbellLongitude: '',
      modalEbellWarn: '',
      modalCurrentEbell: undefined,
      mapClickPoint: { x: 0, y: 0 }
    });
  }
  
  handleCloseModalPidsZoneList = () => {
    this.setState({
      modalPidsZoneListShow: false,
      modalPidsZoneFloorIdx: undefined,
      modalPidsZoneSource: '',
      modalPidsZoneSourceLatitude: '',
      modalPidsZoneSourceLongitude: '',
      modalPidsZoneTarget: '',
      modalPidsZoneTargetLatitude: '',
      modalPidsZoneTargetLongitude: '',
      modalPidsZoneWarn: '',
      modalCurrentPidsZone: undefined,

    });
  }

  handleCloseModalDoor = () => {
    this.setState({
      modalDoorShow: false,
      modalDoorFloorIdx: '',
      modalDoorLatitude: '',
      modalDoorLongitude: '',
      modalDoorWarn: ''
    });
  }

  handleCloseModalCameraDoor = () => {
    this.setState({
      modalCameraDoorShow: false,
      modalCameraDoorFloorIdx: '',
      modalCameraDoorLatitude: '',
      modalCameraDoorLongitude: '',
      modalCameraDoorWarn: '',
      modalCurrentCameraDoor: undefined
    });
  }

  handleCloseModalCameraBreathSensor = () => {
    this.setState({
      modalCameraBreathSensorShow: false,
      modalCameraBreathSensorFloorIdx: '',
      modalCameraBreathSensorLatitude: '',
      modalCameraBreathSensorLongitude: '',
      modalCameraBreathSensorWarn: '',
      modalCurrentCameraBreathSensor: undefined
    });
  }

  handleCloseModalPids = async (e) => {
    this.setState({
      modalPidsShow: false,
      modalPidsFloorIdx: '',
      modalPidsLatitude: '',
      modalPidsLongitude: '',
      modalPidsWarn: '',
      modalPidsIpaddress: '',
      modalPidsLocation: '',
      modalCurrentPids: '',
    });
  }

  handleCloseModalGuardianlite = () => {
    this.setState({
      modalGuardianliteShow: false,
      modalGuardianliteIpaddress: '',
      modalGuardianliteLatitude: '',
      modalGuardianliteLongitude: '',
      modalGuardianliteName: '',
      modalGuardianliteWarn: '',
    });
  }

  handleCloseModalCameraPids = () => {
    this.setState({
      modalCameraPidsShow: false,
      modalCameraPidsFloorIdx: '',
      modalCameraPidsLatitude: '',
      modalCameraPidsLongitude: '',
      modalCameraPidsWarn: '',
      modalCurrentCameraPids: undefined
    });
  }

  handleCloseModalCameraEbell = () => {
    this.setState({
      modalCameraEbellShow: false,
      modalCameraEbellFloorIdx: '',
      modalCameraEbellLatitude: '',
      modalCameraEbellLongitude: '',
      modalCameraEbellWarn: '',
      modalCurrentCameraEbell: undefined,
    });
  }

  handleCloseModalDoorLog = () => {
    this.setState({
      modalDoorLogShow: false,
    });
  }

  handleCloseModalDoorRec = async () => {
    const socket = this.props.socketClient;
    if(socket && this.state.doorCameraArchive) {
      await socket.emit('cameraArchive', {
        cameraId: this.state.doorCameraArchive.cameraId,
        startDateTime: this.state.doorCameraArchive.startDateTime,
        cmd: 'off'
      });
      this._isMounted && await this.setState({ doorCameraArchive: undefined });
    };

    this._isMounted && await this.setState({
      modalDoorRecShow: false,
      modalCameraDoorRecWarn: '',
      modaldoorRecSrcFormat: false,
    });
  }

  handleCloseModalDelGdp200 = async () => {
    await this.setState({    
      modalGdp200DelListShow: false,
      modalGdp200DelListWarn: '',
      modalCurrentGdp200DelList: undefined,
    });
  }

  handleCloseModalBreathSensor = () => {
    this.setState({
      modalBreathSensorShow: false,
      modalBreathSensorFloorIdx: '',
      modalBreathSensorLatitude: '',
      modalBreathSensorLongitude: '',
      modalBreathSensorWarn: '',
      modalBreathSensorIpaddress: '',
      modalBreathSensorLocation: '',
      modalCurrentBreathSensor: '',
      modalCurrentBreathSensorMode: '',
    });
  }

  handleCloseModalBreathSensorSchedule = async () => {
    await this.setState({
      modalBreathSensorScheduleShow: false,
      modalBreathSensorScheduleWarn: '',
      modalCurrentScheduleGroup: '',
    });
  }

  handleCloseModalBreathSensorBreathValue = async () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const midnight = new Date(year, month+1, day, '00','00','00' );

    await this.setState({
      modalBreathSensorBreathValueShow: false,
      modalBreathSensorBreathValueWarn: '',
      modalBreathSensorBreathValueList: '',
      autoBreathValue: '',
      minValue: '',
      maxValue: '',
      avgValue: '',
      modalAutoBreathValueWarn: '',
      autoStart: '',
      autoEnd: '',
      startDate: new Date(),
      startTime: midnight,
    });
  }

  handleAddMapCamera = async (e) => {
    e.preventDefault();
    if (this.state.modalCurrentCamera === undefined) {
      await this.setState({ modalCameraWarn: '장치를 선택하세요.' });
      return
    }
    
    try {
      const res = await axios.put('/api/observer/addLocation', {
        id: this.state.modalCurrentCamera,
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        buildingIdx: this.props.currBuildingIdx,
        buildingServiceType: this.props.currBuildingServiceType,
        floorIdx: this.props.currFloorIdx
      });
      // 모달창 닫기
      await this.handleCloseModalCamera();
    } catch (err) {
      console.log(err);
      return;
    }
    await this.setState({
      showCameraModal: false,
      modalCameraLatitude: '',
      modalCameraLongitude: '',
      modalCameraWarn: '',
      modalCurrentCamera: undefined,
      mapClickPoint: { x: 0, y: 0 }
    });
  }

  handleAddMapEbell = async (e) => {
    e.preventDefault();
    if (this.state.modalCurrentEbell === undefined) {
      this.setState({ modalEbellWarn: '장치를 선택하세요.' });
      return
    }

    try {
      const res = await axios.put('/api/observer/addLocation', {
        id: this.state.modalCurrentEbell,
        type: 'ebell',
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        buildingIdx: this.props.currBuildingIdx,
        buildingServiceType: this.props.currBuildingServiceType,
        floorIdx: this.props.currFloorIdx
      });
      // 모달창 닫기
      await this.handleCloseModalEbell();
    } catch (err) {
      console.log(err);
      return;
    }
    await this.setState({
      showEbellModal: false,
      modalEbellLatitude: '',
      modalEbellLongitude: '',
      modalEbellWarn: '',
      modalCurrentEbell: undefined,
      mapClickPoint: { x: 0, y: 0 }
    });
  }

  handleAddMapDoor = async (e) => {
    e.preventDefault();
    if (this.state.modalCurrentDoor === undefined) {
      await this.setState({ modalDoorWarn: '출입문을 선택하세요.' });
      return
    }

    try {
      const res = await axios.put('/api/observer/addLocation', {
        id: this.state.modalCurrentDoor,
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        buildingIdx: this.props.currBuildingIdx,
        buildingServiceType: this.props.currBuildingServiceType,
        floorIdx: this.props.currFloorIdx,
        type: 'door'
      });
      // 모달창 닫기
      await this.handleCloseModalDoor();
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      showDoorModal: false,
      modalDoorLatitude: '',
      modalDoorLongitude: '',
      modalDoorWarn: '',
      modalCurrentDoor: undefined,
    });
  }

  handleApplyScheduleGroup = async (ipaddress) => {
    const groupName = this.state.modalCurrentScheduleGroup;
    try {
      if (groupName !== '선택 해제' && groupName !== '없음') {
        const res = await axios.put('/api/observer/setEachScheduleGroup', {
          groupName,
          ipaddress
        })
      } else {
        const res = await axios.put('/api/observer/setEachScheduleGroup', {
          groupName,
          ipaddress
        })
      }
    } catch (err) {
      console.log('호흡센서 개별 스케줄 적용 err: ', err);
    }
    this.setState({
      modalBreathSensorScheduleShow: false,
      modalBreathSensorScheduleWarn: '',
      modalCurrentScheduleGroup: '',
    });
  }

  changeSetDbBreathValue = async (e, ipaddress) => {
    e.preventDefault();
    let value = this.state.modalCurrentBreathSensorBreathValue;
    const thresHoldRegExp = new RegExp('^[0-9]');
    const checkThresHoldValue = thresHoldRegExp.test(value);
    let res
    if (value === '') {
      this.setState({ modalBreathSensorBreathValueWarn: '값을 입력해주세요.' });
      return;
    } else if (!checkThresHoldValue) {
      this.setState({ modalBreathSensorBreathValueWarn: '값을 숫자로 입력해주세요.' });
      return;
    } else if (value > 2000) {
      this.setState({ modalBreathSensorBreathValueWarn: '값을 2000이하의 수로 입력해주세요.' });
      return;
    } else {
      this.setState({ modalBreathSensorBreathValueWarn: '' });
    }
    try {
      res = await axios.put('/api/observer/setEachBreathValue', {
        ipaddress,
        breathValue: value
      })
    } catch (err) {
      console.log('임계치 설정 err: ', err);
    }
    this.setState({
      modalBreathSensorBreathValueShow: false,
      modalBreathSensorBreathValueWarn: '',
      modalBreathSensorBreathValueList: '',
      threshold_value_warn: '',
      value: '',
    });
  }

  defaultShowingDate = async () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();

    const midnight = new Date(year, month+1, day, '00','00','00' );
    this.setState({
      startDate: new Date(),
      startTime: midnight,
    });
  }

  minMaxAverage = async (stime, etime, ip) => {
    const startTimeData = stime;
    const endTimeData = etime;
    const ip1 = ip;
    let ipaddress;
    if(this.state.selectedShape) {
      ipaddress =this.state.selectedShape.ipaddress;
    };
    
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const ss = dateFns.format( this.state.startDate, "yyyyMMdd");
    const tt = dateFns.format( this.state.startTime, "HHmmss");
    const tt5 = dateFns.addMinutes(this.state.startTime, 5);
    const endTime = dateFns.format( tt5, "HHmmss");
    const newStartTime = ss + 'T' + tt;
    const newEndTime = ss + 'T' + endTime;

    if(newStartTime && newEndTime){
      this.setState({
        autoStart: newStartTime,
        autoEnd: newEndTime
      })
    }

    try {
      if(startTimeData && endTimeData && ip1){
        const res = await axios.get('api/observer/getBreathLogData',{
          params: {
            newStartTime: startTimeData,
            newEndTime: endTimeData,
            ipaddress: ip1
          }})
          if(res.data.result[0].min !== null && res.data.result[0].max !== null && res.data.result[0].round !== null){
            this.setState({ 
              minValue: res.data.result[0].min,
              maxValue: res.data.result[0].max,
              avgValue: res.data.result[0].round,
              modalAutoBreathValueWarn: ''
            })
          } else {
            this.setState({
              minValue: '',
              maxValue: '',
              avgValue: '',
              modalAutoBreathValueWarn: '해당 시간에 측정된 값이 존재하지 않습니다.'
            })
          }
      } else {
        const res = await axios.get('api/observer/getBreathLogData',{
          params: {
            newStartTime,
            newEndTime,
            ipaddress
          }})
        this.setState({ 
          minValue: res.data.result[0].min,
          maxValue: res.data.result[0].max,
          avgValue: res.data.result[0].round
        })
      }
    } catch (error) {
      console.log('기본 시간 호흡 데이터 표출:', error);
    }
  }

  handleChangeStartDate = (startDate) => {
    if (this.props.breathSensorList.length === 0) {
      this.setState({ modalBreathWarn: '지도(도면) 상에 호흡감지센서를 등록 후 스케줄 생성이 가능합니다.' })
    } else {
      try {
        this.setState({ startDate: startDate });
        const newStartTime = dateFns.format(startDate, 'yyyyMMdd');
        this.setState({
          startDateForAutoValue: newStartTime,
          autoStart: '',
          autoEnd: '',
        });
      } catch (err) {
        console.error('이벤트 발생 시간 선택 Error: ', err);
      }
    }
    return
  }
  
  handleChangeStartTime = async (startTime) => {
    this.setState({ startTime: startTime });
    const startTime1 = dateFns.format(startTime, 'HHmmss');
    const endTime = dateFns.addMinutes(startTime, 5);
    const newEndTime = dateFns.format(endTime, 'HHmmss');
    if (newEndTime) {
      this.setState({ startTimeForAutoValue: startTime1 });
    }

    const ipaddress = this.state.selectedShape.ipaddress;
    const start = this.state.startDateForAutoValue;
    const end = newEndTime; 

    const stime = start + 'T' + startTime1;
    const etime = start + 'T' + end;
    
    try {
      if (stime && etime && stime.length > 13 && etime.length > 13) {
        await this.minMaxAverage(stime, etime, ipaddress);
      }
    } catch (err) {
      console.error('이벤트 종료 시간 선택 Error: ', err)
    }
  }

  breathValueAutoSetting = async () => {
    const ipaddress = this.state.selectedShape.ipaddress;
    const startTime = this.state.startDateForAutoValue;
    const endTime = this.state.startTimeForAutoValue;

    const theStartTime = startTime + 'T' + endTime;
    const notAddFiveMinutes = dateFns.addMinutes(this.state.startTime, 5);
    const notFormattingEndTime = dateFns.format(notAddFiveMinutes, 'HHmmss');
    const theEndTime = startTime + 'T' + notFormattingEndTime;

    try {
      if (this.state.startDateForAutoValue && this.state.startTimeForAutoValue){
        const res = await axios.put('api/observer/breaththresholdcalc', {
          ipaddress,
          start: theStartTime,
          end: theEndTime,
        })
        if (res.data.result === 'ok' && res.data.threashold !== undefined && res.data.threashold !== 0) {
          const temp = { ...this.state.selectedShape };
          temp.breath_value = res.data.threashold;
          this.setState({
            autoBreathValue: res.data.threashold + '',
            selectedShape: temp,
            modalAutoBreathValueWarn: '',
            autoStart: '',
            autoEnd: '',
            startDateForAutoValue: '',
            startTimeForAutoValue: ''
          })
        } else if (res.data.threashold === 0) {
          this.setState({
            modalAutoBreathValueWarn: '해당 시간에 측정된 값이 존재하지 않습니다.'
          })
        }
      } else {
        if (this.state.autoStart && this.state.autoEnd) {
          const res = await axios.put('api/observer/breaththresholdcalc', {
            ipaddress,
            start: this.state.autoStart,
            end: this.state.autoEnd,
          })
          if (res.data.result === 'ok' && res.data.threashold !== undefined && res.data.threashold !== 0) {
            const temp = { ...this.state.selectedShape };
            temp.breath_value = res.data.threashold;
            this.setState({
              autoBreathValue: res.data.threashold + '',
              selectedShape: temp,
              modalAutoBreathValueWarn: '',
              autoStart: '',
              autoEnd: '',
              startDateForAutoValue: '',
              startTimeForAutoValue: ''
            })
          } else if (res.data.threashold === 0) {
            this.setState({
              modalAutoBreathValueWarn: '해당 시간에 측정된 값이 존재하지 않습니다.'
            })
          }
        }
      }
    } catch (error) {
      this.setState({
        modalAutoBreathValueWarn: '자동으로 임계치 값을 설정할 수 없습니다.'
      })
      console.log('임계치 자동 설정 error', error);
    }
  }

  handleAddMapCameraDoor = async (e) => {
    const doorCheck = this.props.deviceList.find((door) => this.state.selectedShape.device_id === door.id);
    if ((e.camera_id === '' || e.camera_id === null || e.camera_id === undefined) && (this.state.modalCurrentCameraDoor === undefined)) {
      this.setState({ modalCameraDoorWarn: '*카메라를 선택하세요.' });
      return
    }
    if (this.state.modalCurrentCameraDoor === undefined) {
      if ((this.state.modalCurrentCameraDoor !== '없음') && (this.state.selectedShape.camera_id !== "") &&
        (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) &&
        (e.camera_id === (doorCheck && doorCheck.camera_id))) {
        this.setState({ modalCameraDoorWarn: '*현재 등록된 카메라 입니다.' });
        return
      }
    }
    if ((this.state.modalCurrentCameraDoor !== '없음') && (this.state.selectedShape.camera_id !== "") &&
      (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) &&
      (e.camera_id === (doorCheck && doorCheck.camera_id)) && (this.state.modalCurrentCameraDoor == this.state.selectedShape.camera_id)) {
      this.setState({ modalCameraDoorWarn: '*현재 등록된 카메라 입니다.' });
      return
    }

    try {
      if (this.state.modalCurrentCameraDoor !== '선택 해제' && this.state.modalCurrentCameraDoor !== '없음') {
        const cameraId = this.state.modalCurrentCameraDoor.replace('.카메라', '');
        const res = await axios.put('/api/observer/cameraForDoor', {
          id: this.state.selectedShape.device_id,
          cameraId,
          service_type: 'accesscontrol'
        });
        this.handleCloseModalDoor();
      } else {

        const res = await axios.put('/api/observer/cameraForDoor', {
          id: this.state.selectedShape.device_id,
          cameraId: '',
          service_type: 'accesscontrol'
        });
        this.handleCloseModalDoor();
      }
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      modalCameraDoorShow: false,
      modalCameraDoorFloorIdx: '',
      modalCameraDoorLatitude: '',
      modalCameraDoorLongitude: '',
      modalCameraDoorWarn: '',
      modalCurrentCameraDoor: undefined
    });
  }

  // 호흡센서 연동 카메라 추가
  handleAddMapCameraBreathSensor = async (e) => {
    // e.preventDefault();
    const breathCheck = this.props.deviceList.find((breath) => this.state.selectedShape.device_id === breath.id);
    if ((e.camera_id === '' || e.camera_id === null || e.camera_id === undefined) && (this.state.modalCurrentCameraBreathSensor === undefined)) {
      this.setState({ modalCameraBreathSensorWarn: '*카메라를 선택하세요.' });
      return
    }
    if (this.state.modalCurrentCameraBreathSensor === undefined) {
      if ((this.state.modalCurrentCameraBreathSensor !== '없음') && (this.state.selectedShape.camera_id !== "") &&
        (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) && 
        (e.camera_id === (breathCheck && breathCheck.camera_id))) {
        this.setState({ modalCameraBreathSensorWarn: '*현재 등록된 카메라 입니다.' });
        return
      }
    }
    if ((this.state.modalCurrentCameraBreathSensor !== '없음') && (this.state.selectedShape.camera_id !== "") &&
      (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) &&
      (e.camera_id === (breathCheck && breathCheck.camera_id)) && (this.state.modalCurrentCameraBreathSensor == this.state.selectedShape.camera_id)) {
      this.setState({ modalCameraBreathSensorWarn: '*현재 등록된 카메라 입니다.' });
      return
    }

    try {
      if (this.state.modalCurrentCameraBreathSensor !== '선택 해제' && this.state.modalCurrentCameraBreathSensor !== '없음') {
        const cameraId = this.state.modalCurrentCameraBreathSensor.replace('.카메라', '');
        const res = await axios.put('/api/observer/cameraForBreathSensor', {
          id: this.state.selectedShape.device_id,
          cameraId,
          service_type: this.state.selectedShape.service_type,
          type: 'breathSensor'
        });
        this.handleCloseModalBreathSensor();
      } else {

        const res = await axios.put('/api/observer/cameraForBreathSensor', {
          id: this.state.selectedShape.device_id,
          cameraId: '',
          service_type: this.state.selectedShape.service_type,
          type: 'breathSensor'
        });
        this.handleCloseModalBreathSensor();
      }
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      modalCameraBreathSensorShow: false,
      modalCameraBreathSensorFloorIdx: '',
      modalCameraBreathSensorLatitude: '',
      modalCameraBreathSensorLongitude: '',
      modalCameraBreathSensorWarn: '',
      modalCurrentCameraBreathSensor: undefined
    });
  }

  handleAddMapCameraEbell = async (e) => {
    const ebellCheck = this.props.deviceList.find((ebell) => this.state.selectedShape.device_id === ebell.id);
    if ((e.camera_id === '' || e.camera_id === null || e.camera_id === undefined) && (this.state.modalCurrentCameraEbell === undefined)) {
      this.setState({ modalCameraEbellWarn: '*카메라를 선택하세요.' });
      return
    }
    if (this.state.modalCurrentCameraEbell === undefined) {
      if ((this.state.modalCurrentCameraEbell !== '없음') && (this.state.selectedShape.camera_id !== "") &&
        (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) &&
        (e.camera_id === (ebellCheck && ebellCheck.camera_id))) {
        this.setState({ modalCameraEbellWarn: '*현재 등록된 카메라 입니다.' });
        return
      }
    }
    if ((this.state.modalCurrentCameraEbell !== '없음') && (this.state.selectedShape.camera_id !== "") && 
        (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) && 
        (e.camera_id === (ebellCheck && ebellCheck.camera_id)) && (this.state.modalCurrentCameraEbell == this.state.selectedShape.camera_id)) {
      this.setState({ modalCameraEbellWarn: '*현재 등록된 카메라 입니다.' });
      return
    }
    try {
      if (this.state.modalCurrentCameraEbell !== '선택 해제' && this.state.modalCurrentCameraEbell !== '없음') {
        const cameraId = this.state.modalCurrentCameraEbell.replace('.카메라', '');
        const res = await axios.put('/api/observer/cameraForEbell', {
          id: this.state.selectedShape.device_id,
          cameraId,
          service_type: this.state.selectedShape.service_type,
          type: 'ebell'
        });
        this.handleCloseModalCameraEbell();
      } else {
        const res = await axios.put('/api/observer/cameraForEbell', {
          id: this.state.selectedShape.device_id,
          cameraId: '',
          service_type: this.state.selectedShape.service_type,
          type: 'ebell'
        });
        this.handleCloseModalCameraEbell();
      }
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      modalCameraEbellShow: false,
      modalCameraEbellFloorIdx: '',
      modalCameraEbellLatitude: '',
      modalCameraEbellLongitude: '',
      modalCameraEbellWarn: '',
      modalCurrentCameraEbell: undefined
    });
  }

  handleAddMapDoorRec = async (e) => {
    e.preventDefault();
    const detailDevice = this.props.deviceList.find((device) => this.state.selectedShape && device.id === this.state.selectedShape.device_id);
    this.handleDoorRec()
    const socket = this.props.socketClient;
    try {
      if (detailDevice) {
        const res = await axios.get('/api/observer/accessEventRec', {
          params: {
            deviceInfo: detailDevice.name,
            deviceType: detailDevice.type
          }
        });
        if(res && res.data && res.data.result && res.data.result.startDateTime) {
          if(socket){
            if(this.state.doorCameraArchive) {
              socket.emit('cameraArchive', {
                cameraId: this.state.doorCameraArchive.cameraId,
                startDateTime: this.state.doorCameraArchive.startDateTime,
                cmd: 'off'
              });
            }
            this.setState({ doorCameraArchive: {
              cameraId: detailDevice.camera_id,
              startDateTime: res.data.result.startDateTime
            }}, () => {
              socket.emit('cameraArchive', { 
                cameraId: this.state.doorCameraArchive.cameraId,
                startDateTime: this.state.doorCameraArchive.startDateTime,
                cmd: 'on' 
              });
              socket.on('cameraArchive', (received) => {
                if(this.state.doorCameraArchive && (received.cameraId === this.state.doorCameraArchive.cameraId && received.startDateTime === this.state.doorCameraArchive.startDateTime)) {
                  this.setState({ videoURL: `${'data:image/jpeg;base64,' + received.data}`})
                }
              });
              this.setState({ videoURL: `${require('../../assets/images/loading.gif')}`})
            })
          }
        } else {
          this.setState({ videoURL: noEvent});
        }
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  handleAddMapBreathSensor = async (e) => {
    e.preventDefault();
    // const sensorCheck = this.props.deviceList.find((sensor) => this.state.selectedShape.device_id === sensor.id);
    // if (this.state.modalCurrentBreathSensor === undefined) { 
    //   this.setState({ modalBreathSensorWarn: '*호흡감지센서를 선택하세요.' });
    //   return
    // }
    // if (this.state.selectedShape && (this.state.modalCurrentBreathSensor === (sensorCheck && sensorCheck.camera_id))) {
    //   this.setState({ modalBreathSensorWarn: '*현재 등록된 호흡감지센서 입니다.' });
    //   return
    // }
    const duplicateBreathSensor = this.props.deviceList.find((device) => device.ipaddress === this.state.modalBreathSensorIpaddress);
    if (duplicateBreathSensor) {
      this.setState({ modalBreathSensorWarn: '*동일한 IP의 호흡감지센서가 있습니다.' });
      return
    }
    const breathSensorSameNameCheck = this.props.deviceList.find((device) => device.name === this.state.modalCurrentBreathSensor);
    if (breathSensorSameNameCheck) {
      this.setState({ modalBreathSensorWarn: '*동일한 이름의 호흡감지센서가 있습니다.' });
      return
    }

    // 입력값 검사
    if (this.state.modalCurrentBreathSensorMode === undefined ||
      this.state.modalCurrentBreathSensorMode === null ||
      this.state.modalCurrentBreathSensorMode.length === 0) {
      this.setState({ modalBreathSensorWarn: '*호흡감지센서 설치위치를 설정하세요.' });
      return
    } 
    if (this.state.modalCurrentBreathSensor === undefined ||
      this.state.modalCurrentBreathSensor === null ||
      this.state.modalCurrentBreathSensor.length === 0) {
      this.setState({ modalBreathSensorWarn: '*호흡감지센서 이름을 입력하세요.' });
      return
    } else if (this.state.modalCurrentBreathSensor.length > 30) {
      this.setState({ modalBreathSensorWarn: '*호흡감지센서 이름은 최대 30자 입니다.' });
      return
    } else if (this.state.modalBreathSensorIpaddress === undefined ||
      this.state.modalBreathSensorIpaddress === null ||
      this.state.modalBreathSensorIpaddress.length === 0) {
      this.setState({ modalBreathSensorWarn: '*호흡감지센서 IP Address를 입력하세요.' });
      return
    } else if (await this.validateIpaddress(this.state.modalBreathSensorIpaddress) === false) {
      this.setState({ modalBreathSensorWarn: '*잘못된 IP Address 형식입니다.' });
      return
    }

    if(this.state.addBreathSensorCheck) {
      this.setState({ modalBreathSensorWarn: '이미 호흡감지센서 추가 작업이 진행 중입니다.' });
      return
    }

    try {
      this.setState({ addBreathSensorCheck: true });
      const res = await axios.put('/api/observer/addLocation', {
        id: this.state.modalCurrentBreathSensor,
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        buildingIdx: this.props.currBuildingIdx,
        buildingServiceType: this.props.currBuildingServiceType,
        floorIdx: this.props.currFloorIdx,
        type: 'breathSensor',
        ipaddress: this.state.modalBreathSensorIpaddress,
        location: this.state.modalBreathSensorLocation,
        install_location: this.state.modalCurrentBreathSensorMode
        // schedule_status: ''
      });
      if(res && res.status === 200){
        this.setState({ addBreathSensorCheck: false });
      }
    } catch (err) {
      console.log(err);
      this.setState({ addBreathSensorCheck: false });
      return;
    }
    this.setState({
      modalBreathSensorShow: false,
      modalBreathSensorFloorIdx: '',
      modalBreathSensorLatitude: '',
      modalBreathSensorLongitude: '',
      modalBreathSensorWarn: '',
      modalCurrentBreathSensor: undefined,
      modalBreathSensorIpaddress: '',
      modalBreathSensorLocation: '',
      modalCurrentBreathSensorMode: '',
    });
  }

  handleAddGuardianlite = async (e) => {
    e.preventDefault();
    const duplicateGuradian = this.props.deviceList.find((device) => device.ipaddress === this.state.modalGuardianliteIpaddress);
    if (duplicateGuradian) {
      this.setState({ modalGuardianliteWarn: '*동일한 IP의 가디언라이트가 있습니다.' });
      return
    }
    // 입력값 검사
    if (this.state.modalGuardianliteName === undefined ||
      this.state.modalGuardianliteName === null ||
      this.state.modalGuardianliteName.length === 0) {
      this.setState({ modalGuardianliteWarn: '*전원장치 이름을 입력하세요.' });
      return
    } else if (this.state.modalGuardianliteName.length > 30) {
      this.setState({ modalGuardianliteWarn: '*전원장치 이름은 최대 30자 입니다.' });
      return
    } else if (this.state.modalGuardianliteIpaddress === undefined ||
      this.state.modalGuardianliteIpaddress === null ||
      this.state.modalGuardianliteIpaddress.length === 0) {
      this.setState({ modalGuardianliteWarn: '*전원장치 IP Address를 입력하세요.' });
      return
    } else if (await this.validateIpaddress(this.state.modalGuardianliteIpaddress) === false) {
      this.setState({ modalGuardianliteWarn: '*잘못된 IP Address 형식입니다.' });
      return
    }

    if(this.state.addGuardianliteCheck) {
      this.setState({ modalGuardianliteWarn: '*이미 가디언라이트 추가 작업이 진행 중입니다..' });
      return
    }

    try {
      this.setState({ addGuardianliteCheck: true });
      // 가디언라이트 장치추가 REST API 호출
      const res = await axios.post('/api/observer/guardianlite', {
        name: this.state.modalGuardianliteName,
        ipaddress: this.state.modalGuardianliteIpaddress,
        building_idx: this.props.currBuildingIdx,
        building_service_type: 'observer',
        floor_idx: this.props.currFloorIdx,
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
      });
      if(res && res.status === 200){
        this.setState({ addGuardianliteCheck: false });
      }
      this.props.readGuardianliteList();
    } catch (err) {
      console.log('handleAddGuardianlite:', err);
      this.setState({ addGuardianliteCheck: false });
    } finally {
      this.setState({
        modalGuardianliteShow: !this.state.modalGuardianliteShow,
        modalGuardianliteName: '',
        modalGuardianliteIpaddress: '',
        modalGuardianliteWarn: '',
      });
    }
  }

  handleGuardianliteSetBtn = async (e, ch, cmd) => {
    e.preventDefault();
    const channel = parseInt(ch);
    if (channel >= 1 && channel <= 8 && (cmd === 'reset' || cmd === 'on' || cmd === 'off')) {
      try {
        // 가디언라이트 전원 on/off 설정 rest api 호출
        const grdlte = this.props.guardianliteList.find(gl => gl.name === this.state.currGuardianlite);
        if (grdlte) {
          if (grdlte.ipaddress) {
            const res = await axios.put('/api/observer/guardianlitechannel', {
              ipaddress: grdlte.ipaddress,
              channel: ch,
              cmd: cmd,
            });
            this.props.readGuardianliteList();
          }
        }
      } catch (err) {
        console.log('handleGuardianliteSetBtn', err);
      }
    }
  }

  handleAddMapPids = async (e) => {
    e.preventDefault();
    const redundancyPids = this.props.deviceList.find((device) => device.ipaddress === this.state.modalPidsIpaddress);
    if (redundancyPids) {
      this.setState({ modalPidsWarn: '*동일한 IP의 PIDS가 있습니다.' });
      return
    }
    const pidsSameNameCheck = this.props.deviceList.find((device) => device.name === this.state.modalCurrentPids);
    if (pidsSameNameCheck) {
      this.setState({ modalPidsWarn: '*동일한 이름의 Pids가 있습니다.' });
      return
    }
    // 입력값 검사
    if (this.state.modalCurrentPids === undefined ||
      this.state.modalCurrentPids === null ||
      this.state.modalCurrentPids.length === 0) {
      this.setState({ modalPidsWarn: '*PIDS 이름을 입력하세요.' });
      return
    } else if (this.state.modalCurrentPids.length > 30) {
      this.setState({ modalPidsWarn: '*PIDS 이름은 최대 30자 입니다.' });
      return
    } else if (this.state.modalPidsIpaddress === undefined ||
      this.state.modalPidsIpaddress === null ||
      this.state.modalPidsIpaddress.length === 0) {
      this.setState({ modalPidsWarn: '*PIDS IP Address를 입력하세요.' });
      return
    } else if (await this.validateIpaddress(this.state.modalPidsIpaddress) === false) {
      this.setState({ modalPidsWarn: '*잘못된 IP Address 형식입니다.' });
      return
    }


    try {
      const res = await axios.post('/api/observer/pids', {
        id: this.state.modalCurrentPids,
        name: this.state.modalCurrentPids,
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        building_idx: this.props.currBuildingIdx,
        building_service_type: this.props.currBuildingServiceType,
        floor_idx: this.props.currFloorIdx,
        type: 'pids',
        ipaddress: this.state.modalPidsIpaddress,
        location: this.state.modalPidsLocation,
      });
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      modalPidsShow: false,
      modalPidsFloorIdx: '',
      modalPidsLatitude: '',
      modalPidsLongitude: '',
      modalPidsWarn: '',
      modalCurrentPids: undefined,
      modalPidsIpaddress: '',
      modalPidsLocation: '',
    });
  }

  // 예외 - 편집모드 > pids zone 설정까지만 하고 편집모드 종료 시 처리 적용필요
  handleAddMapPidsZone = async (e) => {
    e.preventDefault();
    if (this.state.modalCurrentPidsZone === undefined) {
      this.setState({ modalPidsZoneWarn: '장치를 선택하세요.' });
      return
    }

    this.setState({ 
      //     mapClickPoint: {x: '', y: ''},
          modalPidsZoneListShow: false,
    })
    // source
  //   this.state.cy.add({
  //     data: { id: 'source.' + this.state.modalCurrentPidsZone, label: 'source.' + this.state.modalCurrentPidsZone },
  //     style: { 
  //       backgroundFit: 'cover',
  //       shape: 'ellipse' ,
  //       backgroundColor: 'red',
  //       color: 'red'
  //     },
  //     position: {
  //       x: this.state.mapClickPoint.x,
  //       y: this.state.mapClickPoint.y 
  //     },
  //     locked: true
  //   });
  //   this.setState({ 
  //     mapClickPoint: {x: '', y: ''},
  //     modalPidsZoneListShow: false,
  //     modalPidsZoneSource: 'source.' + this.state.modalCurrentPidsZone,
  //     modalPidsZoneSourceLatitude:  this.state.mapClickPoint.x,
  //     modalPidsZoneSourceLongitude:  this.state.mapClickPoint.y,
  // });
  }
  
  pidsFunction = async (e) => {
    try {
      const res = await axios.put('/api/observer/pidsZone', {
        id: this.state.modalCurrentPidsZone,
        source: 'source.' + this.state.modalCurrentPidsZone,
        source_latitude: this.state.mapClickPoint.x,
        source_longitude: this.state.mapClickPoint.y,

        target: 'target.' + this.state.modalCurrentPidsZone,
        target_latitude: e.position.x,
        target_longitude: e.position.y,
        
        buildingIdx: this.props.currBuildingIdx,
        buildingServiceType: this.props.currBuildingServiceType,
        floorIdx: this.props.currFloorIdx
      });
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      editMode: false,
      addNodeMode: false,
      mapClickPoint: { x: '', y: '' },
      modalPidsZoneListShow: false,
      modalPidsZoneSource: '',
      modalPidsZoneSourceLatitude: '',
      modalPidsZoneSourceLongitude: '',
      modalPidsZoneTarget: '',
      modalPidsZoneTargetLatitude: '',
      modalPidsZoneTargetLongitude: '',
      modalPidsZoneWarn: '',
      modalCurrentPidsZone: undefined,
    });
  }

  edgeDraw = async (e) => {
      this.state.cy.add({
        data: { id: 'source.' + this.state.modalCurrentPidsZone, label: 'PIDS 시작점', type: 'zone' },
        style: { 
          backgroundFit: 'cover',
          shape: 'ellipse' ,
          backgroundColor: 'red',
          color: 'red'
        },
        position: {
          x: this.state.mapClickPoint.x,
          y: this.state.mapClickPoint.y 
        },
        locked: true
      });
    this.setState({ addNodeMode: true, editMode: true });
  }

  handlePidsEdit = (e) => {
    this.setState({
      // editMode: true,
      modalPidsZoneListShow: true,
      mapClickPoint: {x: e.position.x, y: e.position.y}
    },() => this.edgeDraw())
  }

  validateIpaddress = async (ip) => {
    const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipformat.test(ip)) {
      return true;
    } else {
      return false;
    }
  }

  handleRemoveCamera = async (e) => {
    if (this.state.selectedShape === undefined) {
      return;
    }

    this.setState({
      showDelConfirm: true,
      modalConfirmTitle: '카메라 삭제',
      modalConfirmMessage: '[ ' + this.state.selectedShape.label+ ' ] 카메라를 삭제하시겠습니까?',
      modalConfirmBtnText: '삭제',
      modalConfirmCancelBtnText: '취소',
      modalConfirmIdx: this.state.selectedShape.camera_id,
      modalConfirmServiceType: this.state.selectedShape.service_type,
    });

    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleRemoveEbell = async (e) => {
    if (this.state.selectedShape === undefined) {
      return;
    }

    this.setState({
      showDelConfirm: true,
      modalConfirmTitle: '비상벨 삭제',
      modalConfirmMessage: '[ ' + this.state.selectedShape.label + ' ] 비상벨을 삭제하시겠습니까?',
      modalConfirmBtnText: '삭제',
      modalConfirmCancelBtnText: '취소',
      modalConfirmIdx: this.state.selectedShape.id,
      modalConfirmServiceType: this.state.selectedShape.service_type,
      modalConfirmIpaddress: this.state.selectedShape.ipaddress
    });

    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });

    // 팝업창 닫기
    this.handleCloseContext();
  }
  
  handleRemoveDoor = async (e) => {
    try {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '출입문 삭제',
        modalConfirmMessage: '[ ' + this.state.selectedShape.device_id + '.' + this.state.selectedShape.label + ' ] 출입문을 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: this.state.selectedShape.idx,
        modalConfirmServiceType: this.state.selectedShape.service_type,
      });
    } catch (e) {
      console.log('err:', e);
    }
    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });
    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleScheduleBreathSensor = () => {
    this.setState({ 
      modalBreathSensorScheduleShow: true
    })
  }

  handleSetBreathValue = async () => {
    await this.minMaxAverage();
    this.setState({ 
      modalBreathSensorBreathValueShow: true
    })
  }

  handleActiveBreathSensor = async (e) => {
    if (e && e.target.length > 0) {
      const sensor = e.target._private.data;
      const ipaddress = sensor.ipaddress;
      const id = sensor.device_id;
      const location = sensor.location;
      let status = 'true';
      if (sensor.use_status === 'true') {
        status = 'false'
      } 
      try {
        const res = await axios.put('/api/observer/breathSensor', {
          ipaddress,
          status
        })
        if(res.status === 200){
          this.props.handleShowToast('success', `${location} ${id} ${status === 'false' ? 'OFF':'ON'}`)
          return;
        } else {
          this.props.handleShowToast('alert', `${location} ${id} ${status === 'false' ? 'OFF 실패':'ON 실패'}`)
        }
      } catch (error) {
        console.log('호흡센서 on/off err : ', error);
        this.props.handleShowToast('error', `${location} ${id} ${status === 'false' ? 'OFF 실패':'ON 실패'}`)
      }
    }
  }

  handleRemoveBreathSensor = async (e) => {
    if (this.state.selectedShape === undefined) {
      return;
    }

    try {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '호흡감지센서 삭제',
        // modalConfirmMessage: '[ ' + this.state.selectedShape.device_id + '.' + this.state.selectedShape.device_name + ' ] 호흡감지센서를 삭제하시겠습니까?',
        modalConfirmMessage: '[ ' + this.state.selectedShape.label + ' ] 호흡감지센서를 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: this.state.selectedShape.idx,
        modalConfirmServiceType: this.state.selectedShape.service_type,
      });
    } catch (e) {
      console.log('err:', e);
    }
    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleRemoveGuardianlite = async (e) => {
    if (this.state.selectedShape === undefined) {
      return;
    }

    try {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '전원장치 삭제',
        // modalConfirmMessage: '[ ' + this.state.selectedShape.device_id + '.' + this.state.selectedShape.device_name + ' ] 호흡감지센서를 삭제하시겠습니까?',
        modalConfirmMessage: '[ ' + this.state.selectedShape.label + ' ] 전원장치를 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: this.state.selectedShape.idx,
        modalConfirmServiceType: this.state.selectedShape.service_type,
      });
    } catch (e) {
      console.log('err:', e);
    }
    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleRemovePids = async (e) => {
    if (this.state.selectedShape === undefined) {
      return;
    }

    try {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: 'PIDS Zone 삭제',
        modalConfirmMessage: '[ ' + this.state.selectedShape.device_id + ' ] PIDS Zone을 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        // modalConfirmIdx: this.state.selectedShape.idx,
        // modalConfirmServiceType: this.state.selectedShape.service_type,
      });
    } catch (e) {
      console.log('err:', e);
    }
    // 팝업창 닫기
    this.handleCloseContext();
  }
  
  handleRemoveGdp200 = async (e) => { 
    if (this.state.selectedShape === undefined) {
      return;
    }
    if (!this.state.modalCurrentGdp200DelList) {
      this.setState({
        modalGdp200DelListWarn: '장치를 선택하세요.'
      })
      return
    }

    if (this.state.modalCurrentGdp200DelList && this.state.modalCurrentGdp200DelList.length > 0) {
      try {
        this.setState({
          showDelConfirm: true,
          modalConfirmTitle: 'PIDS(Gdp200) 삭제',
          modalConfirmMessage: '[ ' + this.state.modalCurrentGdp200DelList + ' ] PIDS(Gdp200)을 삭제하시겠습니까?',
          modalConfirmBtnText: '삭제',
          modalConfirmCancelBtnText: '취소'
        });
      } catch (e) {
        console.log('err:', e);
      }
      // 팝업창 닫기
      this.handleCloseContext();
    }
  }

  handleModalShowRemoveGdp200List = () => {
    this.setState({
      modalGdp200DelListShow: true,
    });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  // 출입문에 연동할 카메라 설정
  handleCameraDoor = async (e) => {
    this.setState({
      modalCameraDoorShow: true,
      modalCameraDoorMode: 'add'
    });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleCameraBreathSensor = async (e) => {
    this.setState({
      modalCameraBreathSensorShow: true,
      modalCameraBreathSensorMode: 'add'
    });

    // 팝업창 닫기
    if(this.state.breathSensorIp){
      this.handleCloseBreathSensorPopup();
    }
    this.handleCloseContext();
  }

  handleCameraPids= async (e) => {
    this.setState({
      modalCameraPidsShow: true,
    });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  // 출입문 출입기록 보기
  handleDoorLog = async (e) => {
    this.props.handleShowInquiryModal(e, 'accessCtlLog', e.target._private.data.device_id);
    this.handleCloseContext();
  }

  // 출입문 직전 출입영상 보기
  handleDoorRec = async (e) => {
    this.setState({
      modalDoorRecShow: true,
      modaldoorRecMode: 'add'
    });
    this.handleCloseContext();
  }

  // 출입문 컨텍스트 잠금 메뉴
  handleLockDoor = async (e) => {
    try {
      const doorId = this.state.selectedShape.device_id;
      if (doorId) {
        const prefix = doorId.substring(0, doorId.length - 2);
        const controlId = prefix.padStart(3, '0');
        const acu = this.props.deviceList.find(device => device.id === controlId && device.type === 'acu');
        if (acu) {
          const res = await axios.post('/api/observer/doorcontrol', {
            acuId: controlId,
            acuIpaddress: acu.ipaddress,
            doorId: doorId,
            command: 0, // 문닫기 0, 문열기 1
          });
          // 팝업창 닫기
          this.handleCloseContext();
        }
      }
    } catch (e) {
      console.log('handleLockDoor err', e);
    }
  }

  // 출입문 컨텍스트 잠금해제 메뉴
  handleUnlockDoor = async (e) => {
    try {
      const doorId = this.state.selectedShape.device_id;
      if (doorId) {
        const prefix = doorId.substring(0, doorId.length - 2);
        const controlId = prefix.padStart(3, '0');
        const acu = this.props.deviceList.find(device => device.id === controlId && device.type === 'acu');
        if (acu) {
          const res = await axios.post('/api/observer/doorcontrol', {
            acuId: controlId,
            acuIpaddress: acu.ipaddress,
            doorId: doorId,
            command: 1, // 문닫기 0, 문열기 1
          });
          // 팝업창 닫기
          this.handleCloseContext();
        }
      }
    } catch (e) {
      console.log('handleLockDoor err', e);
    }
  }

  // 출입문 컨텍스트 잠금 메뉴
  handleUnlock10sDoor = async (e) => {
    try {
      const doorId = this.state.selectedShape.device_id;
      if (doorId) {
        const prefix = doorId.substring(0, doorId.length - 2);
        const controlId = prefix.padStart(3, '0');
        const acu = this.props.deviceList.find(device => device.id === controlId && device.type === 'acu');
        if (acu) {
          const res = await axios.post('/api/observer/doorcontrol', {
            acuId: controlId,
            acuIpaddress: acu.ipaddress,
            doorId: doorId,
            command: 1, // 문닫기 0, 문열기 1
            cmdSec: 10 //잠금해제 시간(초)
          });
          // 팝업창 닫기
          this.handleCloseContext();
        }
      }
    } catch (e) {
      console.log('handleLockDoor err', e);
    }
  }

  // 호흡감지센서 이벤트 조회
  handleBreathEventLog = async (e) => {
    this.props.handleShowInquiryModal(e, 'allEvents', e.target._private.data.ipaddress);
    this.handleCloseContext();
  }

  handleDelCancel = async (e) => {
    this.setState({
      showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
      modalConfirmIdx: undefined,
      modalConfirmServiceType: undefined,
    });
  }

  handleDelConfirm = async (e) => {
    try {
      if (this.state.modalConfirmTitle.indexOf('전원장치 삭제') >= 0) {
        // 삭제하려는 가디언라이트 장치 오버레이창이 열려있는지 확인
        let bClose = false;
        const guardianlite = this.props.deviceList.find((device) => device.idx === parseInt(this.state.modalConfirmIdx));
        if (guardianlite) {
          if (guardianlite.name === this.state.currGuardianlite) {
            bClose = true;
          }
        }
        // 가디언라이트 장치삭제 REST API 호출
        const res = await axios.delete('/api/observer/guardianlite', {
          params: {
            idx: this.state.modalConfirmIdx,
            service_type: this.state.modalConfirmServiceType,
          }
        });
        if (bClose) {
          // const overlays = this.state.map.getOverlays().getArray();
          // if (overlays && overlays.length > 1) {
          //   overlays[2].setPosition(undefined);
          // }
        }
      } else if (this.state.modalConfirmTitle.indexOf('카메라 삭제') >= 0) {
        // 카메라 삭제 REST API 호출
        const res = await axios.put('/api/observer/camera', {
          id: this.state.modalConfirmIdx,
          service_type: this.state.modalConfirmServiceType,
        });
        if(res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('출입문 삭제') >= 0) {
        // 출입문 삭제 REST API 호출
        const res = await axios.put('/api/observer/door', {
          id: this.state.modalConfirmIdx,
          service_type: this.state.modalConfirmServiceType,
        });
        if(res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('호흡감지센서 삭제') >= 0) {
        // 호흡감지센서 삭제 REST API 호출
        const res = await axios.delete('/api/observer/breathSensor', {
          params: {
            idx: this.state.modalConfirmIdx,
            service_type: this.state.modalConfirmServiceType,
          }
        });
        if(res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
          this.handleCloseBreathSensorPopup();
        }
      } else if (this.state.modalConfirmTitle.indexOf('PIDS Zone 삭제') >= 0) { 
        // PIDS 삭제 REST API 호출
        const res = await axios.delete('/api/observer/pids', {
          params: {
            id: this.state.selectedShape.device_id,
            // service_type: this.state.modalConfirmServiceType,
          }
        });
        if(res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('PIDS(Gdp200) 삭제') >= 0) {
      // PIDS 삭제 REST API 호출
        let selectGdp200 = this.state.modalCurrentGdp200DelList; // dp200
        let ipaddress;
        let gdp200 = this.props.deviceList.map((gdp200) => { 
          if(gdp200.name === selectGdp200 ){ ipaddress = gdp200.ipaddress };
        })
        const res = await axios.delete('/api/observer/pidsGdp200', {
          params: {
            name: this.state.modalCurrentGdp200DelList,
            ipaddress
          }
      });
        if(res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('비상벨 삭제') >= 0) {
        // 층 삭제 REST API 호출
        const res = await axios.put('/api/observer/ebell', {
            ipaddress: this.state.modalConfirmIpaddress
        })
      } 
    } catch (e) {
      console.log('handleDelConfirm:', e);
    } finally {
      this.setState({
        showDelConfirm: false,
        delFloorModal: false,
        modalConfirmTitle: '',
        modalConfirmMessage: '',
        modalConfirmBtnText: '',
        modalConfirmCancelBtnText: '',
        modalConfirmIdx: undefined,
        modalConfirmServiceType: undefined,
        modalCurrentGdp200DelList: undefined,
        modalGdp200DelListShow: false,
      });
    }
  }

  buildingNameRender = () => {
    const building = this.props.buildingList.find(building => building.idx === this.props.currBuildingIdx && building.service_type === this.props.currBuildingServiceType);
    if (building) {
      return (
        <div>{building.name}</div>
      )
    }
  }

  floorListRender2 = () => {
    const floors = this.props.floorList && this.props.floorList.filter((floor) => {
      if (floor.building_idx === this.props.currBuildingIdx && floor.service_type === this.props.currBuildingServiceType) {
        return true;
      } else {
        return false;
      }
    });

    if (floors.length > 0) {
      return floors.map((floor, index) => {
        const topValue = 11.5 + (1.5 * index) + 'rem';
        return (
          // <div key={'floor:'+floor.idx} style={{position:'absolute', top:topValue, left:'30rem', fontSize:'0.7rem'}}>
          //   <input type='button' value={floor.name} onClick={()=>this.handleSelectFloor(floor.idx)}/>
          // </div>
          <div key={'floor:' + floor.idx} style={{ top: topValue, left: '32rem', fontSize: '0.6rem', width: '100%', height: '1.4rem' }}>
            <span className='d-inline-block' tabIndex={index} data-bs-toggle="tooltip" title={floor.name}>
              <button
                className={(this.props.currFloorIdx === floor.idx && (floor.status === 1 || floor.status === '1')) ? 'floorSelected_floorEvent' :
                  (this.props.currFloorIdx === floor.idx) ? 'floorSelected' : (floor.status === 1 || floor.status === '1') ? 'floorEvent' : ''}
                onClick={async () => {
                  if(this.props.currFloorIdx !== floor.idx) {
                    await this.handleDisconnectSocket();
                    await this.handleClosePopup();
                    await this.handleCloseEbellPopup();
                    await this.handleCloseDoorPopup();
                    await this.handleCloseBreathSensorPopup();
                    await this.handleCloseModalGuardianlite();
                    await this.props.changeMapType(2, this.props.currBuildingIdx, floor.idx, this.props.currBuildingServiceType); 
                    }}
                  }
                style={{ width: '5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {floor.name}
              </button>
            </span>
            <div className={(this.props.currFloorIdx === floor.idx) ? 'floor-arrow-selected' : ''}></div>
          </div>
        );
      });
    }
  }

  handleAcknowledgeAllEvent = () => {
    this.setState({ showAlert: !this.state.showAlert });
    this.props.setAcknowledge(this.state.device_id, this.state.device_type, this.state.service_type, this.state.ipaddress);
  }

  handleCloseAlert = async () => {
    this.setState({ showAlert: !this.state.showAlert });
    this.setState({ device_id: undefined });
    this.setState({ device_type: undefined });
    this.setState({ service_type: undefined });
  }

  handleConfirmAllEvent = async (e) => {

    if (this.state.selectedShape === undefined) {
      return;
    }

    this.setState({ showAlert: !this.state.showAlert });
    this.setState({ device_id: this.state.selectedShape.device_id });
    this.setState({ ipaddress: this.state.selectedShape.ipaddress});
    if(this.state.selectedShape.type === 'zone') {
      this.setState({ device_type: 'zone' });
    } else {
      this.setState({ device_type: this.state.selectedShape.device_type });
    }
    this.setState({ service_type: this.state.selectedShape.service_type });

    // let id;
    // if (e.target._private.data.source && e.target._private.data.target) {
    //   id = e.target._private.data.device_id
    //   this.handleStopAnimation(id, 'pids');
    // } 

    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });

    // 팝업창 닫기
    this.handleCloseContext();

  }

  generateDoorPersonPopup = () => {
    if (this.props.deviceList) {
      const doors = this.props.deviceList.filter(device => {
        if (device.type === 'door' &&
          device.building_idx === this.props.currBuildingIdx &&
          device.floor_idx === this.props.currFloorIdx &&
          device.building_service_type === this.props.currBuildingServiceType) {
          return true;
        } else {
          return false;
        }
      });

      if (doors.length > 0 && this.state.cy) {
        return doors.map((door, index) => {
          const res = this.state.cy.getElementById('door.' + door.id);
          if(res && res._private.data) {
            const divStyle = {
              position: 'absolute',              
              top: parseInt(res.renderedPosition().y) + 61,// + 562,
              left: parseInt(res.renderedPosition().x) + 407,
              border: '2px solid black',
              display: 'none',
              animation: 'bounce_frames 0.5s',
              animationDirection: 'alternate',
              animationTimingFunction: 'cubic-bezier(.5, 0.05,1,.5)',
              animationIterationCount: 4
            }
            return (
              <div className={'door' + door.id} style={divStyle} key={index}>
                <img src={`http://${this.context.websocket_url}/images/access_control_person/${'1.png'}`} style={{ height: '90px', width: '80px' }} />
              </div>
            );
          } else {
            return (<div key={index}>no person 2</div>);
          }
        });
      } else {
        return (<div>no person 1</div>);
      }
    }
  }

  generateDeviceBlinkPopup = () => {
    if (this.props.deviceList) {
      const devices = this.props.deviceList.filter(device => {
        if (device.type !== 'building' && device.type !== 'pids' &&
          device.building_idx === this.props.currBuildingIdx &&
          device.floor_idx === this.props.currFloorIdx &&
          device.building_service_type === this.props.currBuildingServiceType) {
          return true;
        } else {
          return false;
        }
      });

      if (devices.length > 0 && this.state.cy) {
        return devices.map((device, index) => {
          if (device.type === 'breathSensor') {
            const res = this.state.cy.getElementById(device.type + '.' + device.id);
            const checkSensor = this.props.breathSensorList.find((sensor) => device.ipaddress === sensor.ipaddress)
            if (res && res._private.data) {
              if (checkSensor && checkSensor.use_status === 'true') {
                if (device.status !== 0 && device.status !== '0') {
                  const divStyle = {
                    position: 'absolute',
                    top: parseInt(res.renderedPosition().y) + 136,  //for blinker01
                    left: parseInt(res.renderedPosition().x) + 465,
                    border: '0px solid black',
                    backgroundColor: '#ffffff',
                    backgroundColor: 'rgba( 255, 255, 255, 0 )',
                    display: 'none',
                  }

                  if (device.status != 0 && device.status != '0' && device.status != null) {
                    divStyle.display = 'initial';
                  }
                  return (
                    <div className={'device' + device.id} style={divStyle} key={index}>
                      <img src={iconBlinker} style={{ height: '20px', width: '20px' }} />
                    </div>
                  );
                } else {
                  if (checkSensor && checkSensor.prison_door_status === 'lock') {
                    const divStyle = {
                      position: 'absolute',
                      top: parseInt(res.renderedPosition().y) + 136,  //for blinker01
                      left: parseInt(res.renderedPosition().x) + 445,
                      border: '0px solid black',
                      backgroundColor: '#ffffff',
                      backgroundColor: 'rgba( 255, 255, 255, 0 )',
                      display: 'none',
                    }

                    if (device.status === 0 || device.status === '0') {
                      divStyle.display = 'initial';
                    }
                    return (
                      <div className={'device' + device.id} style={divStyle} key={index}>
                        <img src={iconOnButton} style={{ height: '12px', width: '12px' }} />
                      </div>
                    );
                  } else if (checkSensor && checkSensor.prison_door_status === 'unlock') {
                    const divStyle = {
                      position: 'absolute',
                      top: parseInt(res.renderedPosition().y) + 136,  //for blinker01
                      left: parseInt(res.renderedPosition().x) + 445,
                      border: '0px solid black',
                      backgroundColor: '#ffffff',
                      backgroundColor: 'rgba( 255, 255, 255, 0 )',
                      display: 'none',
                    }

                    if (device.status === 0 || device.status === '0') {
                      divStyle.display = 'initial';
                    }
                    return (
                      <div className={'device' + device.id} style={divStyle}>
                        <img src={iconOffButton} style={{ height: '12px', width: '12px' }} />
                      </div>
                    );
                  }
                }
              }
            } else {
              return (<div key={index}>no device 2</div>);
            }
          } else {
            const res = this.state.cy.getElementById(device.type + '.' + device.id);
            if (res && res._private.data) {
              const divStyle = {
                position: 'absolute',
                top: parseInt(res.renderedPosition().y) + 136,  //for blinker01
                left: parseInt(res.renderedPosition().x) + 465,
                border: '0px solid black',
                backgroundColor: '#ffffff',
                backgroundColor: 'rgba( 255, 255, 255, 0 )',
                display: 'none',
              }

              if (device.status != 0 && device.status != '0' && device.status != null) {
                divStyle.display = 'initial';
              }
              return (
                <div className={'device' + device.id} style={divStyle} key={index}>
                  <img src={iconBlinker} style={{ height: '20px', width: '20px' }} />
                </div>
              );
            } else {
              return (<div key={index}>no device 2</div>);
            }
          }
        });
      } else {
        return (<div>no device 1</div>);
      }
    }
  }

  generateCameraBlinkPopup = () => {
    if (this.props.cameraList) {
      const cameras = this.props.cameraList.filter(camera => {
        if (camera.type !== 'building' &&
          camera.building_idx === this.props.currBuildingIdx &&
          camera.floor_idx === this.props.currFloorIdx &&
          camera.building_service_type === this.props.currBuildingServiceType) {
          return true;
        } else {
          return false;
        }
      });

      if (cameras.length > 0 && this.state.cy) {
        return cameras.map((camera, index) => {
          const res = this.state.cy.getElementById('camera.' + camera.cameraid);
          if(res && res._private.data) {
            const divStyle = {
              position: 'absolute',
              top: parseInt(res.renderedPosition().y) + 136,  //for blinker01
              left: parseInt(res.renderedPosition().x) + 465,
              border: '0px solid black',
              backgroundColor: '#ffffff',
              backgroundColor: 'rgba( 255, 255, 255, 0 )',
              display: 'none',
            }
            if (camera.status != 0 && camera.status != '0' && camera.status != null) {
              divStyle.display = 'initial';
            }
            return (
              <div className={'device' + camera.id} style={divStyle} key={index}>
                <img src={iconBlinker} style={{ height: '20px', width: '20px' }} />
              </div>
            );
          } else {
            return (<div key={index}>no camera 2</div>);
          }
        });
      } else {
        return (<div>no camera 1</div>);
      }
    }
  }

  getBeforeDataForBreathGraph = async (breathSensor) => {
    const ipaddress = breathSensor.ipaddress;
    let valueArray = [];
    let labelArray = [];
    let fixValueArray = []; //
    let fixBreathValue;
    const checkBValue = this.props.breathSensorList.filter((sensor) => sensor.ipaddress === this.state.bbSensor);
    if(this.state.breathSensorData && this.state.breathSensorData.breath_value.length > 0) {
      fixBreathValue = this.state.breathSensorData.breath_value;
    } else if (checkBValue.length > 0 && checkBValue[0].breath_value) {
      fixBreathValue = checkBValue[0].breath_value;
    }
    if (labelArray.length < 50) {
      for (let k = 0; k < 60; k++) {
        labelArray.push(String(''));
        fixValueArray.push(fixBreathValue);
      }
    }
    try {
      const res = await axios.get('/api/observer/getBreathLog', {
        params: {
          ipaddress,
        }
      })
      if (res.data.message === 'ok') {
        for (let i = res.data.result.length - 1; i >= 0; i--) {
          valueArray.push(res.data.result[i].sensor_value);
        }
        this.setState({
          dataArr: {
            labels: labelArray,
            datasets: [
              {
                  label: '측정값',
                  data: valueArray,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                  ],
                  borderWidth: 0.3,
                },
                {
                  label: `임계치(${fixBreathValue})`,
                  data: fixValueArray,
                  borderColor: [
                    'white',
                  ],
                  borderWidth: 0.5,
                }
              ],
            },
          }, () => console.log('이전 호흡데이터값 조회'));
      } 

      if(res.data.message === 'fail') {
        this.setState({
          dataArr: {
            labels: [''],
            datasets: [
              {
                  label: '측정값',
                  data: [],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                  ],
                  borderWidth: 0.3,
                },
                {
                  label: '임계치',
                  data: [],
                  borderColor: [
                    'white',
                  ],
                  borderWidth: 0.5,
                }
              ],
            },
          }, () => console.log('이전 호흡데이터값 조회'));
      }
    } catch (err) {
      console.log('이전 호흡 데이터 조회 err : ', err);
    }
  }

  setBreathValue = (breathValue) => {
    let copyData = [];
    let copyLabel = [];
    let copyThreshold = [];
    // let fixBreathValue = this.state.breathSensorData.breath_value;
    const checkBValue = this.props.breathSensorList.filter((sensor) => sensor.ipaddress === this.state.bbSensor);
    let fixBreathValue;
    if(this.state.breathSensorData && this.state.breathSensorData.breath_value.length > 0) {
      fixBreathValue = this.state.breathSensorData.breath_value;
    } else if (checkBValue.length > 0 && checkBValue[0].breath_value) {
      fixBreathValue = checkBValue[0].breath_value;
    }
    try {
      // x축 시간
      this.setState({
        xGraphTime: ''
      })
    }
    catch (error) {
      console.log(error);
    }
    if ( this.state.dataArr ) {
      copyLabel = [...this.state.dataArr.labels];
      copyData = [...this.state.dataArr.datasets[0].data];
      copyThreshold = [...this.state.dataArr.datasets[1].data]
    }
    copyData.push(breathValue);
    copyLabel.push(String(''));
    copyThreshold.push(fixBreathValue)

    if (copyLabel.length < 50) {
      for (let k = 1; k < 60; k++) {
        copyLabel.push(String(''));
        copyThreshold.push(fixBreathValue)
      }
    }

    if (copyData.length >= 60) {
      copyData.shift();
      if (copyLabel.length > 60) {
        copyLabel.shift();
      }
    }

    const newDataArr = {
      labels: copyLabel,
      datasets: [
        {
          label: '측정값',
          data: copyData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 0.3,
        },
        {
          label: `임계치(${fixBreathValue})`,
          data: copyThreshold,
          borderColor: [
            'white',
          ],
          borderWidth: 0.5,
        }
      ]
    }
    this.setState({ dataArr: newDataArr });
  }

  breathGraph = () => {
    let data = this.state.dataArr;
    const options = {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            stepSize: 100,
          }
        }]
      },
    };
    return (
      <Line data={data} options={options}  />
    );
  }

  render() {
    const sortedCameraList = this.props.cameraList.sort((a, b) => a.cameraid > b.cameraid ? 1 : -1);
    const detailDoor = this.props.deviceList.find((door) => this.state.selectedShape && door.id === this.state.selectedShape.device_id);
    const detailSensor = this.props.breathSensorList.find((breathSensor) => this.state.selectedShape && (breathSensor.ipaddress === this.state.selectedShape.ipaddress));
    const detailZone = this.props.pidsList.find((pids) => this.state.selectedShape && (pids.pidsid === this.state.selectedShape.device_id));
    const detailEbell = this.props.deviceList.find((ebell) => this.state.selectedShape && (ebell.id === this.state.selectedShape.device_id));

    return (
      <div className="gcanvas"
      // style={{ backgroundImage: `url(${this.state.bgImage})` }}
      >
        <div 
        ref={this.cyRef} 
        style={{ height: "1000px" }}
        >
        </div>


        <div id="indoor-popup" className={this.state.cameraPopup}>
          <a href="!#" id="indoor-popup-closer" className={this.state.cameraPopup === "ol-indoor-popup" ? "ol-indoor-popup-closer" : "ol-indoor-popup-closer noVideo"} onClick={this.handleClosePopup}></a>
          <span id="ol-indoor-popup-arrow"></span>
          <Container id="indoor-popup-content">
            <div id="indoor-popup-video">
            </div>
          </Container>
        </div>
        <div id="indoor-ebell-popup" className={this.state.ebellPopup}>
          <a href="!#" id="indoor-ebell-popup-closer" className={this.state.ebellPopup === "ol-indoor-ebell-popup" ? "ol-indoor-ebell-popup-closer" : "ol-indoor-ebell-popup-closer noVideo"} onClick={this.handleCloseEbellPopup}></a>
          <span id="ol-indoor-ebell-popup-arrow"></span>
          <Container id="ebell-indoor-popup-content">
            <div id="ebell-indoor-popup-video">
            </div>
          </Container>
        </div>

        <div id="indoor-door-popup" className={this.state.doorPopup}>
          <a href="!#" id="indoor-door-popup-closer" className={this.state.doorPopup === "ol-indoor-door-popup" ? "ol-indoor-door-popup-closer" : "ol-indoor-door-popup-closer noVideo"} onClick={this.handleCloseDoorPopup}></a>
          <span id="ol-indoor-door-popup-arrow"></span>
          <Container id="door-indoor-popup-content">
            <div id="door-indoor-popup-video">
            </div>
          </Container>
        </div>

        <div id="indoor-breathSensor-popup" className={this.state.breathSensorPopup}>
          <a href="!#" id="indoor-breathSensor-popup-closer" className={this.state.breathSensorPopup === "ol-indoor-breathSensor-popup" ? "ol-indoor-breathSensor-popup-closer" : "ol-indoor-breathSensor-popup-closer noVideo"} onClick={this.handleCloseBreathSensorPopup}></a>
          <span id="ol-indoor-breathSensor-popup-arrow"></span>
          <Container id="breathSensor-indoor-popup-content">
            <div className='breathSensor-popup-title'>
            <h3>{this.state.selectedShapeBreathSensor && this.state.selectedShapeBreathSensor.name}</h3>
            </div>
            <h5 className='breathSensor respiration'>현재 호흡감지: {this.props.breathData.respiration}</h5>
            {/* <h5 className='breathSensor respiration'>IP 주소: {this.state.selectedShape4 && this.state.selectedShape4.ipaddress}</h5> */}
            <div id="breathSensor-indoor-popup-video">

            </div>
          </Container>
          <Container className='breathSensor-data-chart'>
            {/* {this.state.dataArr && <Line data={this.state.dataArr} options={options} key={Math.random()}/>} */}
            {this.breathGraph()}
          </Container>
        </div>

        <div id="indoor-pids-popup" className={this.state.pidsPopup}>
          <a href="!#" id="indoor-pids-popup-closer" className={this.state.pidsPopup === "ol-indoor-pids-popup" ? "ol-indoor-pids-popup-closer" : "ol-indoor-pids-popup-closer noVideo"} onClick={this.handleClosePidsPopup}></a>
          <span id="ol-indoor-pids-popup-arrow"></span>
          <Container id="pids-indoor-popup-content">
            <div id="pids-indoor-popup-video">
            </div>
          </Container>
        </div>

        <div>
          {this.generateDoorPersonPopup()}
        </div>

              
        <div>
          {this.generateDeviceBlinkPopup()}
        </div>
        <div>
          {this.generateCameraBlinkPopup()}
        </div>
      

        {/* <div className='ol-ctx-menu-container' /> */}
        <div id="guardianlite" className='guardianlite'>
          <div className='griditem'>
            {this.state.guardianliteTemper ? `Guardian Lite (${this.state.guardianliteTemper}℃)` : `Guardian Lite`}
            <a href="!#" id="guardianlite-closer" className="ol-popup-closer" style={{ color: '#FFF' }}></a>
          </div>
          <div className={this.state.guardianliteCh1 === 'on' ? 'ch ledgreen' : 'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh2 === 'on' ? 'ch ledgreen' : 'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh3 === 'on' ? 'ch ledgreen' : 'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh4 === 'on' ? 'ch ledgreen' : 'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh5 === 'on' ? 'ch ledgreen' : 'ch ledred'}>
          </div>
          <div>CH1</div>
          <div>CH2</div>
          <div>CH3</div>
          <div>CH4</div>
          <div>CH5</div>
          <div style={{ fontSize: '0.7rem' }}><button onClick={(e) => { this.handleGuardianliteSetBtn(e, 1, 'on') }}>RESET</button></div>
          <div style={{ fontSize: '0.7rem' }}><button onClick={(e) => { this.handleGuardianliteSetBtn(e, 2, this.state.guardianliteCh2) }}>On/Off</button></div>
          <div style={{ fontSize: '0.7rem' }}><button onClick={(e) => { this.handleGuardianliteSetBtn(e, 3, this.state.guardianliteCh3) }}>On/Off</button></div>
          <div style={{ fontSize: '0.7rem' }}><button onClick={(e) => { this.handleGuardianliteSetBtn(e, 4, this.state.guardianliteCh4) }}>On/Off</button></div>
          <div style={{ fontSize: '0.7rem' }}><button onClick={(e) => { this.handleGuardianliteSetBtn(e, 5, this.state.guardianliteCh5) }}>On/Off</button></div>
          {/* <div className='griditem'>Guardian Lite</div> */}
        </div>

        {/* 카메라 추가 모달 */}
        <Modal
          show={this.state.modalCameraShow}
          onHide={this.handleCloseModalCamera}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              카메라 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>카메라 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeCamera} value={this.state.modalCurrentCamera}>
                  <option></option>
                  {this.props.cameraList && this.props.cameraList.map((camera, index) => {
                    if (camera.longitude === null || camera.latitude === null || camera.longitude === 'null' || camera.latitude === 'null' || camera.longitude === '' || camera.latitude === '' || ((camera.longitude.indexOf(".") == -1 && camera.latitude.indexOf(".") == -1) && camera.floor_idx === null)) {
                      return <option key={index} value={camera.cameraid}>{camera.cameraid + "." + camera.cameraname}</option>
                    }
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalCameraWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapCamera}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalCamera}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 비상벨 추가 모달 */}
        <Modal
          show={this.state.modalEbellShow}
          onHide={this.handleCloseModalEbell}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              비상벨 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>비상벨 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeEbell} value={this.state.modalCurrentEbell}>
                  <option></option>
                  {this.props.deviceList && this.props.deviceList.map((ebell, index) => {
                    if (ebell.type === 'ebell') {
                      if(!((ebell.longitude && ebell.longitude.length > 0) || (ebell.latitude && ebell.latitude.length > 0) || (ebell.building_idx && ebell.building_idx.length > 0) || (ebell.floor_idx && ebell.floor_idx.length > 0))) {
                        return <option key={index} value={ebell.id}>{ebell.id + "번 " + ebell.name}</option>
                      }
                    }
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalEbellWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapEbell}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalEbell}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 도어 추가 모달 */}
        <Modal
          show={this.state.modalDoorShow}
          onHide={this.handleCloseModalDoor}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              출입문 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>출입문 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeDoor} value={this.state.modalCurrentDoor}>
                  <option></option>
                  {this.props.deviceList && this.props.deviceList.map((door, index) => {
                    if (door.longitude === null || door.latitude === null || door.longitude === 'null' || door.latitude === 'null' || door.longitude === '' || door.latitude === '' || ((door.longitude.indexOf(".") == -1 && door.latitude.indexOf(".") == -1) && door.floor_idx === null)) {
                      if (door.type === 'door') {
                        return <option key={index} value={door.id}>{door.name}</option>
                      }
                    }
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalDoorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapDoor}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalDoor}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 호흡감지센서 추가 모달 */}
        <Modal
          show={this.state.modalBreathSensorShow}
          onHide={this.handleCloseModalBreathSensor}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              호흡감지센서 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>이름 (*필수)</Form.Label>
                <Form.Control type='text' maxLength='50' name='modalCurrentBreathSensor' value={this.state.modalCurrentBreathSensor} onChange={this.handleChangeBreathSensor} placeholder='호흡감지센서의 이름을 입력하세요.' />
              </Form.Group>
              <Form.Group controlId="formIpaddress">
                <Form.Label>IP Address (*필수)</Form.Label>
                <Form.Control type='text' maxLength='15' name='modalBreathSensorIpaddress' value={this.state.modalBreathSensorIpaddress} onChange={this.handleChangeBreathSensor} placeholder='호흡감지센서의 IP를 입력하세요.' />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>설치 위치 (*필수)</Form.Label>
                <Form.Control type='text' maxLength='15' name='modalBreathSensorLocation' value={this.state.modalBreathSensorLocation} onChange={this.handleChangeBreathSensor} placeholder='호흡감지센서의 설치 위치를 입력하세요.' />
              </Form.Group>

              <Form.Group controlId="formLocation">
              <Form.Label>호흡감지센서 설치위치</Form.Label>
                <Form >
                  <div className='select-breath-mode'>
                  <Form.Check
                    className='breath-mode'
                    value='room'
                    type="radio"
                    aria-label="radio 1"
                    id={`custom-radio-`}
                    label='수감실 내부형'
                    // checked={sensor.use_status === 'true' ? true : false}
                    checked={this.state.modalCurrentBreathSensorMode === 'room'}
                    onChange={(e) => this.handleChangeAddBreathSensorMode(e)}
                  />
                  <Form.Check
                    className='breath-mode'
                    value='ceiling'
                    type="radio"
                    aria-label="radio 2"
                    label='복도 천장형'
                    id={`custom-checkbox-`}
                    // checked={sensor.use_status === 'true' ? true : false}
                    checked={this.state.modalCurrentBreathSensorMode === 'ceiling'}
                    onChange={(e) => this.handleChangeAddBreathSensorMode(e)}
                  />
                  </div>
                </Form>
              </Form.Group>

              {/* 업체출입문 선택 SELECT  */}
              {/* <Form.Group controlId="Idx">
                <Form.Label>출입문 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeDoor} value={this.state.modalCurrentDoor}>
                  <option></option>
                  {this.props.deviceList && this.props.deviceList.map((door, index) => {
                    if (door.longitude === null || door.latitude === null || door.longitude === 'null' || door.latitude === 'null' || door.longitude === '' || door.latitude === '' || ((door.longitude.indexOf(".") == -1 && door.latitude.indexOf(".") == -1) && door.floor_idx === null)) {
                      if (door.type === 'door') {
                        return <option key={index} value={door.id}>{door.name}</option>
                      }
                    }
                  })}
                </select>
              </Form.Group> */}


              <Form.Text style={{ color: 'red' }}>{this.state.modalBreathSensorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapBreathSensor}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalBreathSensor}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 호흡감지센서 스케줄 할당 모달 */} 
        <Modal
          show={this.state.modalBreathSensorScheduleShow}
          onHide={this.handleCloseModalBreathSensorSchedule}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              호흡감지센서 설정
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>호흡감지센서 스케줄 그룹 적용</Form.Label>
                <Form>
                  <select className="form-control groupSelect" onChange={this.handleChangeApplySchduleGroup} value={this.state.modalCurrentScheduleGroup}>
                    {/* {this.props.breathSensorList && this.props.breathSensorList.map((sensor, index) => {
                      return  <option>{sensor && sensor.schedule_group !== '' && sensor.schedule_group !== null ? sensor.schedule_group : '스케줄 그룹 선택'}</option>
                    })} */}
                    <option>{this.state.selectedShape && this.state.selectedShape.schedule_group !== '' && this.state.selectedShape.schedule_group !== null ? this.state.selectedShape.schedule_group : '스케줄 그룹 선택'}</option>
                    <option value={'none'} disabled>-------------------------------------------------</option>
                    <option value={'없음'}>선택 해제</option>
                    {this.props.breathSensorScheduleList && this.props.breathSensorScheduleList.map((data, index) => {
                      return <option key={index} value={data.name}>{data.name}</option>
                    })}
                  </select>
                </Form>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalBreathSensorScheduleWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.handleApplyScheduleGroup(this.state.selectedShape.ipaddress)}>
              적용
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalBreathSensorSchedule}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 호흡감지센서 임계치 설정 모달 */} 
        <Modal
          show={this.state.modalBreathSensorBreathValueShow}
          onHide={this.handleCloseModalBreathSensorBreathValue}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
          contentClassName='modal-content BreathValue'
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              호흡감지센서 설정
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group id="breathValue">
                <Form.Label>호흡감지센서 임계치 설정</Form.Label>
                  <div style={{ display: 'flex' }}>
                    <Form.Control id={'breath-value-input'} onChange={this.handleChangeBreathValue} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}/>
                    <Button onClick={(e) => this.changeSetDbBreathValue(e, this.state.selectedShape.ipaddress)}>변경</Button> 
                    <span className='current-breath-value'>{this.state.selectedShape && this.state.selectedShape.breath_value ? '(현재 임계치:' + this.state.selectedShape.breath_value + ')' : '(현재 임계치: )'}</span>
                  </div>
                  <Form.Text style={{ color: 'red' }}>{this.state.threshold_value_warn}</Form.Text>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalBreathSensorBreathValueWarn}</Form.Text>
            </Form>

            <Form id="breathValue AutoSet">
              <Form.Group>
                <div style={{marginTop: '40px'}}>
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
                  <span className='current-breath-value'>{this.state.autoBreathValue && this.state.autoBreathValue.length > 0 ? '(자동 임계치 적용 값 :' + this.state.autoBreathValue + ')': '(자동 임계치 적용 값 : )'} </span>
                </div>
                <Form.Text style={{ color: 'red' }}>{this.state.modalAutoBreathValueWarn}</Form.Text>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          {/* <Modal.Footer>
                  <span style={{color : '#85bec5'}}>자동 임계치 적용 값 : {this.state.autoBreathValue && this.state.autoBreathValue.length > 0 ? this.state.autoBreathValue : ''} </span>
          </Modal.Footer> */}
        </Modal>

        {/* pids 추가 모달 */}
        <Modal
          show={this.state.modalPidsShow}
          onHide={this.handleCloseModalPids}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              PIDS 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>이름 (*필수)</Form.Label>
                <Form.Control type='text' maxLength='50' name='modalCurrentPids' value={this.state.modalCurrentPids} onChange={this.handleChangePids} placeholder='PIDS의 이름을 입력하세요.' />
              </Form.Group>
              <Form.Group controlId="formIpaddress">
                <Form.Label>IP Address (*필수)</Form.Label>
                <Form.Control type='text' maxLength='15' name='modalPidsIpaddress' value={this.state.modalPidsIpaddress} onChange={this.handleChangePids} placeholder='PIDS의 IP를 입력하세요.' />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>설치 위치 (*필수)</Form.Label>
                <Form.Control type='text' maxLength='15' name='modalPidsLocation' value={this.state.modalPidsLocation} onChange={this.handleChangePids} placeholder='PIDS의 설치 위치를 입력하세요.' />
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalPidsWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapPids}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalPids}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 가디언라이트 추가 모달 */}
        <Modal
          show={this.state.modalGuardianliteShow}
          onHide={this.handleCloseModalGuardianlite}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              전원장치 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>이름 (*필수)</Form.Label>
                <Form.Control type='text' maxLength='50' name='modalGuardianliteName' value={this.state.modalGuardianliteName} onChange={this.handleChangeBreathSensor} placeholder='전원장치 이름을 입력하세요' />
              </Form.Group>
              <Form.Group controlId="formIpaddress">
                <Form.Label>IP Address (*필수)</Form.Label>
                <Form.Control type='text' maxLength='15' name='modalGuardianliteIpaddress' value={this.state.modalGuardianliteIpaddress} onChange={this.handleChangeBreathSensor} placeholder='전원장치 IP를 입력하세요' />
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalGuardianliteWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddGuardianlite}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalGuardianlite}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>
        
         {/* pids zone 선택 모달 */}
        <Modal
          show={this.state.modalPidsZoneListShow}
          onHide={this.handleCloseModalPidsZoneList}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              PIDS Zone 설정
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>PIDS Zone 선택 (추가 후 종료지점 좌클릭)</Form.Label>
                <select className="form-control" onChange={this.handleChangePidsZone} value={this.state.modalCurrentPidsZone}>
                  <option></option>
                  {this.props.pidsList && this.props.pidsList.map((pidsZone, index) => {
                    if ( pidsZone.source_longitude === null || pidsZone.source_latitude === null || pidsZone.source_longitude === 'null' || pidsZone.source_latitude === 'null' || pidsZone.source_longitude === '' || pidsZone.source_latitude === '' || 
                    pidsZone.target_longitude === null || pidsZone.target_latitude === null || pidsZone.target_longitude === 'null' || pidsZone.target_latitude === 'null' || pidsZone.target_longitude === '' || pidsZone.target_latitude === '') {
                      return <option key={index} value={pidsZone.pidsid}>{pidsZone.pidsid}</option>
                    }
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalPidsZoneWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapPidsZone}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalPidsZoneList}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 출입문 카메라 연동 모달 */}
        <Modal
          show={this.state.modalCameraDoorShow}
          onHide={this.handleCloseModalCameraDoor}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              출입문 카메라 연동
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* <Form.Group controlId="formBuildingId">
                  <Form.Label>연동된 카메라</Form.Label>
                  <form className="form-control BuildingImage" disabled>
                  <option selected="selected">  {doorCamera && doorCamera.camera_id !== '없음' ? doorCamera.camera_id + '.카메라' : '연동된 카메라 없음'} </option>
                  </form>
                </Form.Group> */}
              <Form.Group controlId="Idx">
                <Form.Label>연동된 카메라 변경</Form.Label>
                <select className="form-control" onChange={this.handleChangeCameraDoor} value={this.state.modalCurrentCameraDoor}>
                  <option>{detailDoor && sortedCameraList.find((camera) => camera.cameraid === detailDoor.camera_id) ? (sortedCameraList.find((camera) => camera.cameraid === detailDoor.camera_id).cameraid+'.'+sortedCameraList.find((camera) => camera.cameraid === detailDoor.camera_id).cameraname):'연동된 카메라 없음'}</option>
                  <option value={'none'} disabled>---------------------------------------------------------</option>
                  <option value={'없음'}>선택 해제</option>
                  {sortedCameraList.map((camera, index) => {
                    return <option key={index} value={camera.cameraid}>{camera.cameraid}.{camera.cameraname}</option>
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalCameraDoorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.handleAddMapCameraDoor(detailDoor)}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalCameraDoor}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 호흡센서 카메라 연동 모달 */}
        <Modal
          show={this.state.modalCameraBreathSensorShow}
          onHide={this.handleCloseModalBreathSensor}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              호흡감지센서 카메라 연동
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* <Form.Group controlId="formBuildingId">
                  <Form.Label>연동된 카메라</Form.Label>
                  <form className="form-control BuildingImage" disabled>
                  <option selected="selected">  {doorCamera && doorCamera.camera_id !== '없음' ? doorCamera.camera_id + '.카메라' : '연동된 카메라 없음'} </option>
                  </form>
                </Form.Group> */}
              <Form.Group controlId="Idx">
                <Form.Label>연동된 카메라 변경</Form.Label>
                <select className="form-control" onChange={this.handleChangeCameraBreathSensor} value={this.state.modalCurrentCameraBreathSensor}>
                  <option>{detailSensor && sortedCameraList.find((camera) => camera.cameraid === detailSensor.camera_id) ? (sortedCameraList.find((camera) => camera.cameraid === detailSensor.camera_id).cameraid+'.'+sortedCameraList.find((camera) => camera.cameraid === detailSensor.camera_id).cameraname):'연동된 카메라 없음'}</option>
                  <option value={'none'} disabled>---------------------------------------------------------</option>
                  <option value={'없음'}>선택 해제</option>
                  {sortedCameraList.map((camera, index) => {
                    return <option key={index} value={camera.cameraid}>{camera.cameraid}.{camera.cameraname}</option>
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalCameraBreathSensorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.handleAddMapCameraBreathSensor(detailSensor)}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalCameraBreathSensor}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* pids zone 카메라 연동 모달 */}
        <Modal
          show={this.state.modalCameraPidsShow}
          onHide={this.handleCloseModalCameraPids}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              PIDS ZONE 카메라 연동
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* <Form.Group controlId="formBuildingId">
                  <Form.Label>연동된 카메라</Form.Label>
                  <form className="form-control BuildingImage" disabled>
                  <option selected="selected">  {doorCamera && doorCamera.camera_id !== '없음' ? doorCamera.camera_id + '.카메라' : '연동된 카메라 없음'} </option>
                  </form>
                </Form.Group> */}
              <Form.Group controlId="Idx">
                <Form.Label>카메라 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeCameraPids} value={this.state.modalCurrentCameraPids}>
                  <option>{detailZone && detailZone.camera_id ? (detailZone.camera_id + '.'+sortedCameraList.find((camera) => (camera.cameraid === detailZone.camera_id)).cameraname): '연동된 카메라 없음'}</option>
                  <option value={'none'} disabled>---------------------------------------------------------</option>
                  <option value={'없음'}>선택 해제</option>
                  {sortedCameraList.map((camera, index) => {
                    return <option key={index} value={camera.cameraid}>{camera.cameraid}.{camera.cameraname}</option>
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalCameraPidsWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapCameraPids}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalCameraPids}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

         {/* Ebell 카메라 연동 모달 */}
        <Modal
          show={this.state.modalCameraEbellShow}
          onHide={this.handleCloseModalCameraEbell}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              비상벨 카메라 연동
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>카메라 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeCameraEbell} value={this.state.modalCurrentCameraEbell}>
                  <option>{detailEbell && sortedCameraList.find((camera) => camera.cameraid === detailEbell.camera_id) ? (sortedCameraList.find((camera) => camera.cameraid === detailEbell.camera_id).cameraid+'.'+sortedCameraList.find((camera) => camera.cameraid === detailEbell.camera_id).cameraname):'연동된 카메라 없음'}</option>
                  <option value={'none'} disabled>---------------------------------------------------------</option>
                  <option value={'없음'}>선택 해제</option>
                  {sortedCameraList.map((camera, index) => {
                    return <option key={index} value={camera.cameraid}>{camera.cameraid}.{camera.cameraname}</option>
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalCameraEbellWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.handleAddMapCameraEbell(detailEbell)}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalCameraEbell}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 출입문 기록/로그 모달 */}
        {/* <Modal
          show={this.state.modalDoorLogShow}
          onHide={this.handleCloseModalDoorLog}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
            출입문 출입기록
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Group controlId="formBuildingId">
                  <Form.Label>출입문 출입기록</Form.Label>
                  <form className="form-control BuildingImage" disabled>
                  <option selected="selected">   {this.state.modalCurrentCameraDoor} </option>
                  </form>
                </Form.Group>
              <Form.Group controlId="Idx">
                
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalCameraDoorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapCameraDoor}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalDoorLog}>
              취소
            </Button>
          </Modal.Footer>
        </Modal> */}

        {/* 출입문 카메라 녹화영상 모달 */}
        <Modal
          show={this.state.modalDoorRecShow}
          onHide={this.handleCloseModalDoorRec}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              출입문 연동 녹화영상
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBuildingId">
                <Form.Label>최신 이벤트 영상 (이벤트 발생 10초전부터 재생) </Form.Label>
              </Form.Group>
              <Form.Group controlId="Idx" className='doorCameraArchive'>
                {this.state.videoURL !== `${require('../../assets/images/loading.gif')}`? <img style={{ width: "100%" }} src={this.state.videoURL} />:<img src={this.state.videoURL}/>}
                {/* {this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'live') ? <video src={this.state.modaldoorRecSrc} controls muted autoPlay playsInline width={'110%'} />
                  : this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'virtual') ? <img style={{ width: "110%" }} src={this.state.modaldoorRecSrc} />
                    : this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'noEvent') ? <img style={{ width: "110%" }} src={noEvent} />
                      : this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'noCamera') ? <img style={{ width: "110%" }} src={noCamera} /> : <img style={{ width: '60%', marginLeft: '100px' }} src={require('../../assets/images/loading.gif')} />} */}
              </Form.Group>
              {/* <Form.Text style={{ color: 'red' }}>{this.state.modalCameraDoorRecWarn}</Form.Text> */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCloseModalDoorRec}>
              확인
            </Button>
            {/* <Button variant='primary' type='button' onClick={this.handleCloseModalDoorRec}>
              취소
            </Button> */}
          </Modal.Footer>
        </Modal>

         {/* DP200 삭제 모달 */}
        <Modal
          show={this.state.modalGdp200DelListShow}
          onHide={this.handleCloseModalDelGdp200}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              PIDS(Gdp200) 삭제
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                  <Form.Label>등록된 PIDS(Gdp200) 목록</Form.Label>
                  <select className="form-control" onChange={this.handleChangeDelGdp200List} value={this.state.modalCurrentGdp200DelList}>
                  <option></option>
                    {this.props.deviceList && this.props.deviceList.map((device, index) =>{
                      if (device.type === 'pids') {
                        return <option key={index} value={device.name}> {device.name} ({device.ipaddress}) </option>
                      }
                    })}
                  </select>
              </Form.Group>
                  <Form.Text style={{ color: 'red' }}>(주의 - PIDS 삭제 시 맵에 설치된 해당 PIDS의 Zone도 함께 삭제됩니다.)</Form.Text>
              <Form.Text style={{ color: 'red' }}>{this.state.modalGdp200DelListWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={(e) => this.handleRemoveGdp200(this.state.modalCurrentGdp200DelList)}>
              삭제
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalDelGdp200}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 해당 장치의 이벤트 알림 해제 모달창 */}
        <Modal show={this.state.showAlert} centered >
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 장치의 이벤트 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAcknowledgeAllEvent}>
              예
            </Button>
            <Button variant="secondary" onClick={this.handleCloseAlert}>
              아니오
            </Button>
          </Modal.Footer>
        </Modal>

        <div style={{ position: 'absolute', top: '11.0rem', left: '29rem', minWidth: '5.2rem', textAlign: 'center', padding: '1.5px', borderRadius: '2px 2px 0 0', border: '1px', backgroundColor: 'rgba(0, 60, 136, 0.5)' }}>
          {this.buildingNameRender()}
        </div>
        <div style={{ position: 'absolute', top: '13.0rem', left: '29rem', textAlign: 'center', padding: '1.5px', borderRadius: '2px 2px 0 0', border: '1px', backgroundColor: 'rgba(0, 60, 136, 0.5)' }}>
          층목록
          {this.floorListRender2()}
        </div>
        <div style={{ position: 'absolute ', top: '11.0rem', right: '30.5rem', width: '5rem', textAlign: 'center', padding: '1.5px', borderRadius: '2px 2px 0 0', border: '1px', backgroundColor: 'rgba(0, 60, 136, 0.5)' }}>
          실외지도<br />
          <img src={iconGoToGmap} style={{ width: '40px', height: '40px' }} onClick={this.handleGoToGmap} />
        </div>
        {/* 삭제 확인 모달창 */}
        <ModalConfirm
          showModal={this.state.showDelConfirm}
          modalTitle={this.state.modalConfirmTitle}
          modalMessage={this.state.modalConfirmMessage}
          modalConfirmBtnText={this.state.modalConfirmBtnText}
          modalCancelBtnText={this.state.modalConfirmCancelBtnText}
          handleConfirm={this.handleDelConfirm}
          handleCancel={this.handleDelCancel}
        />
        <Inquiry
          showInquiryModal={this.props.showInquiryModal}
          handleShowInquiryModal={this.props.handleShowInquiryModal}
          defaultActiveKey={this.props.defaultActiveKey}
          LogDoorID={this.state.LogDoorID}
        />
      </div>
    )
  }
}
export default GCanvas;

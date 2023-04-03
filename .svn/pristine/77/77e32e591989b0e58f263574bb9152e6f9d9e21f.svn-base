import axios from 'axios';
import React from 'react';
import { Modal, Form, Button, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
//import { Stage, Layer, Image, Text, Rect, Label, Tag } from 'react-konva';
import { format, parse, addHours, addSeconds } from 'date-fns';
import iconBlinker from '../../assets/images/alert.webp';
import iconGoToGmap from '../../assets/images/gotogmap.png';
import iconEbellNormal from '../../assets/images/indoor_ebell.ico';
import iconEbellEvent from '../../assets/images/indoor_ebell_event.ico';
import iconEbellAdd from '../../assets/images/context_bell_add.png';  
import iconEbellRemove from '../../assets/images/context_bell_remove.png';
import iconCamera from '../../assets/images/cctv.ico';
import iconCameraEvent from '../../assets/images/cctv_event.ico';
import iconDoor from '../../assets/images/door.ico';
import iconDoorEvent from '../../assets/images/door_event.ico';
import iconBreathSensor from '../../assets/images/breathsensor.png';
import iconBreathSensorEvent from '../../assets/images/event_breathsensor.png';
import iconBuilding from '../../assets/images/building.ico';
import iconBuildingAdd from '../../assets/images/building_add.ico';
import iconBuildingRemove from '../../assets/images/context_building_remove.png'; 
import iconBuildingUpdate from '../../assets/images/building_update.ico';
import iconFloorAdd from '../../assets/images/floor_add.ico';
import iconFloorRemove from '../../assets/images/floor_remove.ico';
import { UserInfoContext } from '../context/context';
import iconCameraAdd from '../../assets/images/context_camera_add_indoor.png';
import iconDoorAdd from '../../assets/images/context_door_add_indoor.png';
import iconCameraRemove from '../../assets/images/context_camera_remove_indoor.png';
import iconDoorRemove from '../../assets/images/door_delete.ico';
import iconBreathSensorRemove from '../../assets/images/context_breathSensor_remove_indoor.png';
import iconDoorLiveVideo from '../../assets/images/door_live.ico';
import iconDoorUpdate from '../../assets/images/camera_update.ico';
import iconDoorLock from '../../assets/images/door_lock.ico';
import iconDoorUnlock from '../../assets/images/door_unlock.ico';
import iconDoorUnlock10 from '../../assets/images/door_unlock10.ico';
import iconDoorLog from '../../assets/images/door_log.ico';
import iconFence from '../../assets/images/fence.png';
import iconEventClear from '../../assets/images/event_clear.ico';
import ModalConfirm from './ModalConfirm';
import line from '../../assets/images/line.png';
import Inquiry from './Inquiry';
import noEvent from '../../assets/images/access_no_event.png';
import noCamera from '../../assets/images/without_camera.png';
import CameraError from '../../assets/images/cctv_error.png';
import iconDetectionBreathing from '../../assets/images/detection_breathing.ico';
import { Line } from 'react-chartjs-2';
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import * as socketClient from 'socket.io-client';

cytoscape.use(contextMenus);
cytoscape.warnings(false);

class GCanvasOut extends React.Component {

  static contextType = UserInfoContext;
  _isMounted = false;
  constructor(props) {
    super(props);

    this.cyRef = React.createRef();
    
    this.state = {
      blinker: false,
      selectedShape: undefined,
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

      modalBuildingShow: false,
      modalBuildingLatitude: '',
      modalBuildingLongitude: '',
      modalBuildingWarn: '',
      modalServiceType: undefined,
      modalCurrentBuilding: undefined,

      showFloorModal: false,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalFloorMapImage: '',
      modalFloorTargetData: undefined,

      showFloorModifyModal: false,
      modalmodifyFloor: undefined,

      showBuildingModifyModal: false,
      modalmodifyBuilding: undefined,
      modalmodifyBuildingData: undefined,

      editMode: false,
      addNodeMode: false,

      nodeEventCheckArr: [],
      eventTest: undefined,

      showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
      modalConfirmIdx: undefined,
      modalConfirmServiceType: undefined,
      modalConfirmFloorName: undefined,
      modalConfirmIpaddress: undefined,

      showModal: false,
      modalTitle: '',
      modalMessage: '',

      showAlert: false,
      device_id: undefined,
      device_type: undefined,
      service_type: undefined,
      ipaddress: undefined,

      //장치 팝업 디자인
      cameraPopup: "ol-indoor-popup",
      ebellPopup: "ol-indoor-ebell-popup",
      pidsPopup: "ol-indoor-pids-popup",

      //지도위 장치 라이브 영상
      cameraVideo: '',
      ebellVideo: '',

      cy: undefined,

      floorImageList: [],

      addBuildingCheck: false,
      addFloorCheck: false,
      addPidsCheck: false,
    };

    setInterval(() => {
      this._isMounted && this.setState({ blinker: !this.state.blinker });
    }, 600);
  }

  getCameraById = async (id) => {
    return this.props.cameraList.find(camera => camera.cameraid === id);
  }

  getEbellByKey = async (idx, service_type) => {
    return this.props.deviceList.find((device) => (device.idx === parseInt(idx) && device.service_type === service_type));
  }

  getPidsByKey = async (id, serviceType) => {
    return this.props.pidsList.find((pids) => pids.pidsid === id && pids.service_type === serviceType);
  }

  getBuildingByKey = async (id, serviceType) => {
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

  handleChangePidsPopUpArrowDirection = (direction) => {
    if(direction === 'top') {
      const arrowDirection = document.getElementById("ol-indoor-pids-popup-arrow");
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
      const arrowDirection = document.getElementById("ol-indoor-pids-popup-arrow");
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
      const arrowDirection = document.getElementById("ol-indoor-pids-popup-arrow");
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
      const arrowDirection = document.getElementById("ol-indoor-pids-popup-arrow");
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
    const pids_popup = document.getElementById("indoor-pids-popup");

    const camera_video = document.getElementById('indoor-popup-video');
    const ebell_video = document.getElementById('ebell-indoor-popup-video');
    const pids_video = document.getElementById('pids-indoor-popup-video');

    const socket = this.props.socketClient;
    if (e.target._private.data.value === 'cameraicon') {
      camera_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      const camera = await this.getCameraById(e.target._private.data.camera_id); // 체크 필요
      this.props.readEventsByIpForWeek(camera ? camera.ipaddress : null)
      if (camera) {
        this.setState({ cameraPopup: "ol-indoor-popup" });
        try {
          if(socket) {
            socket.emit('cameraStream', { 
              cameraId: camera.cameraid, 
              cmd: 'on' 
            });
            this.setState({ liveStreamCamera: camera }, () => {
              socket.on('cameraStream', (received) => {
                if(received.cameraId === (this.state.liveStreamCamera && this.state.liveStreamCamera.cameraid)) {
                  camera_video.innerHTML = `<img alt='' style="width: 300px; height: 200px;" src=${'data:image/jpeg;base64,' + received.data} autoplay></img>`;
                }
              });
            });
            if (popup && popup.style) {
              popup.style.display = 'initial';
              popup.classList.add('active');
              ebell_popup.classList.remove('active');
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
        } catch (err) {
          if(camera_video){
            camera_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/cctv_error.png')}></img>`;
          }
          if (popup && popup.style) {
            popup.style.display = 'initial';
            popup.classList.add('active');
            ebell_popup.classList.remove('active');
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
        if(camera_video){
          camera_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-top: 17px;" src=${require('../../assets/images/without_camera.png')}></img>`;
        }
        if (popup && popup.style) {
          popup.style.display = 'initial';
          popup.classList.add('active');
          ebell_popup.classList.remove('active');
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
      if(ebell_video) {
        ebell_video.innerHTML = `<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      }
      this.props.readEventsByIpForWeek(ebell ? ebell.ipaddress : null)
      if (ebell) {
        if (ebell.camera_id && ebell.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === ebell.camera_id);
          if (cameraInfo) {
            try {
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

                if (ebell_popup && ebell_popup.style) {
                  ebell_popup.style.display = 'initial';
                  ebell_popup.classList.add('active');
                  
                  popup.classList.remove('active');
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
              if (ebell_popup && ebell_popup.style) {
                ebell_popup.style.display = 'initial';
                ebell_popup.classList.add('active');
                popup.classList.remove('active');
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
          if (ebell_popup && ebell_popup.style) {
            ebell_popup.style.display = 'initial';
            ebell_popup.classList.add('active');
            popup.classList.remove('active');
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
      }
    } else if (e.target._private.data.value === 'pidsicon') {
      const pids = await this.getPidsByKey(e.target._private.data.device_id, e.target._private.data.service_type);
      if(pids_video){
        pids_video.innerHTML =`<img alt='' style="max-width: 300px; max-height: 200px; display: flex; justify-content: center; margin-left: 50px; margin-right: 50px;" src=${require('../../assets/images/loading.gif')}></img>`;
      }
      if (pids) {
        this.props.readEventsByIpForWeek(pids ? pids.ipaddress : null);
        if (pids.camera_id && pids.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === pids.camera_id);
          if (cameraInfo) {
            try {
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
    }  else if (e.target._private.data.value === 'buildingicon') {
      const buildingIdx = e.target._private.data.idx; 
      const floor = this.props.floorList.find((floor) => floor.building_idx === buildingIdx);
      const serviceType = e.target._private.data.service_type;
      if(buildingIdx && floor) {
        await this.handleDisconnectSocket();
        await this.handleCloseEbellPopup();
        await this.handleClosePopup();
        await this.handleClosePidsPopup();
        await this.props.changeMapType(2, buildingIdx, floor.idx, serviceType);
      }
    }
  }

  handleClosePopup = (e, bClearSelectedShape = true) => {
    if (e) {
      e.preventDefault();
    }
    if (bClearSelectedShape === true) {
      this._isMounted && this.setState({
        selectedShape: undefined,
        cameraVideo: ''
      });
    }
    const socket = this.props.socketClient;
    if(socket && this.state.liveStreamCamera) {
      socket.emit('cameraStream', {
        cameraId: this.state.liveStreamCamera.cameraid,
        cmd: 'off'
      });
      this._isMounted && this.setState({ liveStreamCamera: undefined });
    };
    
    const popup = document.getElementsByClassName(this.state.cameraPopup);
    if (popup.length > 0 && popup[0] && popup[0].style) {
      popup[0].style.display = 'none';
    }
    const camera_video = document.getElementById('indoor-popup-video');
    if (camera_video) {
    camera_video.innerHTML = null;
  }
  }

  handleCloseEbellPopup = (e) => {
    if (e) {
      e.preventDefault();
    }

    const socket = this.props.socketClient;
    if(socket && this.state.liveStreamEBell && this.state.liveStreamEBell.camera_id) {
      socket.emit('cameraStream', {
        cameraId: this.state.liveStreamEBell.camera_id,
        cmd: 'off'
      });
      this._isMounted && this.setState({ liveStreamEBell: undefined });
    };
    if(this.state.liveStreamEBell) {
      this._isMounted && this.setState({ liveStreamEBell: undefined });
    };
    const popup = document.getElementsByClassName(this.state.ebellPopup);
    if (popup.length > 0 && popup[0] && popup[0].style) {
      popup[0].style.display = 'none';
    }
    const ebell_video = document.getElementById('ebell-indoor-popup-video');
    if(ebell_video) {
      ebell_video.innerHTML = null;
    }
  }

  handleClosePidsPopup = (e) => {
    if (e) {
      e.preventDefault();
    }

    const socket = this.props.socketClient;
    if(socket && this.state.liveStreamZone && this.state.liveStreamZone.camera_id) {
      socket.emit('cameraStream', {
        cameraId: this.state.liveStreamZone.camera_id,
        cmd: 'off'
      });
    };
    if(this.state.liveStreamZone){
      this._isMounted && this.setState({ liveStreamZone: undefined });
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
    };
    if(socket && this.state.liveStreamEBell &&  this.state.liveStreamEBell.camera_id) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamEBell.camera_id,
        cmd: 'off'
      });
      await this.setState({ liveStreamEBell: undefined });
    };
    if(socket && this.state.liveStreamZone && this.state.liveStreamZone.camera_id) {
      await socket.emit('cameraStream', {
        cameraId: this.state.liveStreamZone.camera_id,
        cmd: 'off'
      });
      await this.setState({ liveStreamZone: undefined });
    };
  }

  handleSelectFloor = async (idx) => {
    if (idx) {
      const floor = this.props.floorList.find(floor => floor.idx === idx && floor.service_type === this.props.currBuildingServiceType);
      if (floor) {  // 설정된 floor index 에 해당하는 floor 정보가 있으면
        let image_path = floor.map_image;
        if (!floor.map_image.includes('http://')) {
          image_path = `http://${this.context.websocket_url}/images/floorplan/${floor.map_image}`;
        }
        this.props.changeMapType(2, this.props.currBuildingIdx, floor.idx, this.props.currBuildingServiceType);
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

  handleChangeBuilding = (e) => {
    this.setState({ modalCurrentBuilding: e.currentTarget.value });
  }

  handleChangeGroupImageId = (e) => {
    const result = e.currentTarget.value;
    this.setState({ modalGroupImageId: result, modalFloorWarn: '' });
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

  handleChangeCameraPids = (e) => {
    this.setState({ modalCurrentCameraPids: e.currentTarget.value });
  }

  handleChangeCameraEbell = (e) => {
    this.setState({ modalCurrentCameraEbell: e.currentTarget.value });
  }

  handleChangeDelGdp200List = (e) => {
    this.setState({ modalCurrentGdp200DelList: e.currentTarget.value });
  }

  handleChangeModifyBuilding = (e) => {
    this.setState({ modalmodifyBuilding: e.currentTarget.value });
  }

  handleChangeFloor = (e) => {
    this.setState({ modalCurrentFloor: e.currentTarget.value });
  }

  getMidCoordinate = (source, target) => {
    let result
    if (target > source) {
      result = target - parseInt(target - source) / 2;
    } else {
      result = source - parseInt(source - target) / 2;
    }
    return result;
  }

  AddDeviceToElement = async (elements) => {
    if (this.props.cameraList && this.props.cameraList.length > 0) {
      this.props.cameraList.forEach((device, index) => {
        if (device.building_idx === 0 &&
          device.building_service_type === 'observer' &&
          device.floor_idx === 0 &&
          device.latitude !== '' && device.longitude !== '') {
          let icon = iconCamera
          if (device.status !== 0 && device.status !== '0') {
            icon = iconCameraEvent
          }
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
              buildingname: device.buildingname,
              floorname: device.floorname,
              location: device.location,
              ipaddress: device.ipaddress,
              camera_id: device.cameraid,
              service_type: device.service_type
            },
            style: {
              fontSize: 12,
              width: '25px',
              height: '25px',
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
      });
    }

    // building
    if (this.props.buildingList && this.props.buildingList.length > 0) {
      this.props.buildingList.forEach((building, index) => {
        if (building.service_type === 'observer' && 
            building.latitude !== '' && building.longitude !== '' ) {
          // let icon = iconCamera
          // if (building.status === '1' || building.status === 1) {
          //   icon = iconCameraEvent
          // }
          elements.push({
            data: {
              // parent: 'background2',
              id: 'building.' + building.idx,
              device_id: 'building',
              idx: building.idx,
              label: building.name,
              device_type: 'building',
              value: 'buildingicon',
              service_type: building.service_type
            },
            style: {
              fontSize: 15,
              opacity: 0.9,
              backgroundColor: 'green',
              width: '60px',
              height: '60px',
              fontWeight: 'bold',
              textValign: 'bottom',
              color: 'black',
              shape: 'ellipse',
              backgroundImage: iconBuilding,
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
              x: parseFloat(building.latitude),
              y: parseFloat(building.longitude)
            },
            locked: true,
            grabbable: false, 
          });
        }
      });
    }

     // ebell
     if (this.props.deviceList && this.props.deviceList.length > 0) {
      this.props.deviceList.forEach((device, index) => {
        if (device.type === 'ebell' && 
            device.latitude !== '' && device.longitude !== '' && 
            (device.building_idx === 0 || device.building_idx === '0') && 
            (device.floor_idx === 0 || device.floor_idx === '0')) {
          let icon = iconEbellNormal
          if (device.status !== 0 && device.status !== '0') {
            icon = iconEbellEvent
          }
          elements.push({
            data: {
              // parent: 'background2',
              id: device.type + '.' + device.id,
              device_id: device.id,
              idx: device.idx,
              label: device.name,
              device_type: 'ebell',
              value: 'ebellicon',
              buildingIdx: device.building_idx,
              floorIdx: device.floor_idx,
              buildingServiceType: device.building_service_type,
              service_type: device.service_type,
              ipaddress: device.ipaddress
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
              x: parseFloat(device.latitude),
              y: parseFloat(device.longitude)
            },
            locked: true,
            grabbable: false, 
          });
        }
      });
    }

    // pids source
    if (this.props.pidsList && this.props.pidsList.length > 0) {
      this.props.pidsList && this.props.pidsList.forEach((device, index) => {
        if (device.building_idx === 0 &&
          device.building_service_type === 'observer' &&
          device.floor_idx === 0 &&
          device.source_latitude !== null && device.source_longitude !== null && device.target_latitude !== null && device.target_longitude !== null) {
          let color = '#ffff33';
          if (device.status !== 0 && device.status !== '0') {
            color = 'red';
          }
          elements.push({
            data: {
              // parent: 'background2',
              id: device.source,
              device_id: device.pidsid,
              // idx: device.idx,
              label: '',
              device_type: 'zone',
              value: 'pidsicon',
              buildingIdx: device.building_idx,
              floorIdx: device.floor_idx,
              buildingServiceType: device.building_service_type,
              ipaddress: device.ipaddress,
              service_type: device.service_type
            },
            style: {
              width: '10px',
              height: '10px',
              fontSize: 11,
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
        if (device.building_idx === 0 &&
          device.building_service_type === 'observer' &&
          device.floor_idx === 0 &&
          device.source_latitude !== null && device.source_longitude !== null && device.target_latitude !== null && device.target_longitude !== null) {
          let color = '#ffff33';
          if (device.status !== 0 && device.status !== '0') {
            color = 'red';
          }
          elements.push({
            data: {
              // parent: 'background2',
              id: device.target,
              device_id: device.pidsid,
              // idx: device.idx,
              label: '',
              device_type: 'zone',
              value: 'pidsicon',
              buildingIdx: device.building_idx,
              floorIdx: device.floor_idx,
              buildingServiceType: device.building_service_type,
              ipaddress: device.ipaddress,
              service_type: device.service_type
            },
            style: {
              width: '10px',
              height: '10px',
              fontSize: 11,
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
        if (device.building_idx === 0 &&
          device.building_service_type === 'observer' &&
          device.floor_idx === 0 &&
          device.source_latitude !== null && device.source_longitude !== null && device.target_latitude !== null && device.target_longitude !== null) {
          let color = '#ffff33';
          if (device.status !== 0 && device.status !== '0') {
            color = 'red';
          }
          elements.push({
            data: {
              id: device.pidsid,
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
              fontSize: 12,
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
    await this.handleClosePidsPopup();
  }

  readFloorImageList = async () => {
    try {
      const res = await axios.get('/api/observer/mapimage', {
        params: {
          limit: 50
        }
      });
      if (res.data && res.data.result && res.data.result.length > 0) {
        this.setState({ floorImageList: res.data.result });
      }
    } catch (err) {
      console.log('gmap mapImage err:', err);
    }
  } 
  
  async componentDidMount() {
    this._isMounted = true;
    this.readFloorImageList();
    const newElements = [];
        newElements.push(
          {
            data: {
              id: 'background',
              type: 'background',
              value: 'background',
              label: '',
              idx: 0,
              buildingIdx: 0,
              floorIdx: 0,
              buildingServiceType: 'observer'
            },
            style: {
              backgroundImage: `http://${this.context.websocket_url}/images/floorplan/birdseyeview.png`,
              minWidth: '1000px',
              minHeight: '800px',
              backgroundWidth: '1000px',
              backgroundHeight: '800px',
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
      // }
    

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
      ],
      layout: { 
        name: 'preset',
        ready: function(){},
        stop: function(){}
      },
      zoom: 1,
      wheelSensitivity: 0.2,
      minZoom: 1,
      maxZoom: 3,
    }
    if (config.elements.length === 0) {
      config.elements.push(
        {
          data: {
            id: 'background',
            type: 'background',
            value: 'background',
            label: '',
            idx: 0,
            buildingIdx: 0,
            floorIdx: 0,
            buildingServiceType: 'observer'
          },
          style: {
            backgroundImage: `http://${this.context.websocket_url}/images/floorplan/birdseyeview.png`,
            minWidth: '1000px',
            minHeight: '800px',
            backgroundWidth: '1000px',
              backgroundHeight: '800px',
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
    const cy = cytoscape(config);

    cy.style([
      {
        selector: "node",
        style: {
          label: "data(label)",
          shape: "rectangle",
        }
      },
      // {
      //   selector: ".mid",
      //   style: {
      //     width: 8,
      //     height: 8,
      //     label: ""
      //   }
      // }
    ]);

    const showDevicePopup = (e) => {
      this.showDevicePopup(e)
    }

    const handleShowModifyDeleteContext = (e) => {
      this.handleShowModifyDeleteContext(e)
    }

    cy.on('cxttap', (e) => {
      this.setState({ selectedShape: e.target._private.data });
      this.setState({ mapClickPoint: { x: e.position.x, y: e.position.y } });
    })

    cy.on('tap', (e) => {
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
        const res = this.state.cy && this.state.cy.getElementById(findDevice.type+ '.' + findDevice.id);
        if (res && res._private && res._private.data) {
          if(findDevice.type === 'ebell') {
            if(this.state.liveStreamEBell && this.state.liveStreamEBell.id === findDevice.id) {
              return;
            } else if(socket && this.state.liveStreamEBell){
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamEBell.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamEBell: undefined });
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
          this.showDevicePopup(event);
        }
      } else if (findZone) {
        const res = this.state.cy && this.state.cy.getElementById(findZone.pidsid);
        if (res && res._private && res._private.data) {
          if(this.state.liveStreamZone && this.state.liveStreamZone.pidsid === findZone.pidsid) {
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
      } else {
        this.showDevicePopup(e);
      }
      this.state.cy.on('click', (e) => {
        if (e && e.length !== 0) {
          if (e.target._private.data.id === 'background') {
            this.state.cy
              .layout({
                name: "preset",
                ready: function () { },
              })
              .run();
          }
        }
      })
      if (this.state.editMode === true) {
        if (this.state.mapClickPoint) {
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
      ],
      // Indicates that the menu item has a submenu. If not provided default one will be used
      submenuIndicator: { src: 'assets/submenu-indicator-default.svg', width: 17, height: 17 }
    };

    let instance = cy.contextMenus(options);

    const handleShowModalAddCamera = (e) => {
      this.handleShowModalAddCamera(e)
    }
    const handleShowModalAddEbell = (e) => {
      this.handleShowModalAddEbell(e)
    }
    const handleRemoveEbell = (e) => {
      this.handleRemoveEbell(e)
    }
    const handleCameraForEbell = (e) => {
      this.handleCameraForEbell(e)
    }
    const handleShowModalAddBuilding = (e) => {
      this.handleShowModalAddBuilding(e)
    }
    const handleModifyBuildingModal = (e) => {
      this.handleModifyBuildingModal(e)
    }
    const handleRemoveBuilding = (e) => {
      this.handleRemoveBuilding(e)
    }
    const handleShowFloorModal = (e) => {
      this.handleShowFloorModal(e)
    }
    const handleDelFloorModal = (e) => {
      this.handleDelFloorModal(e)
    }
    const handleShowModalAddFloor = (e) => {
      this.handleShowModalAddFloor(e)
    }
    const handleAddGdp200 = (e) => {
      this.handleAddGdp200(e)
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
    const handleRemovePids = (e) => {
      this.handleRemovePids(e)
    }
    const handleCameraPids = (e) => {
      this.handleCameraPids(e)
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
        id: 'add-building',
        content: '&nbsp' + ' 건물 추가',
        image: { src: iconBuildingAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        onClickFunction: handleShowModalAddBuilding
      },

      // 건물 메뉴
      {
        id: 'remove-building',
        content: '&nbsp' + ' 건물 삭제',
        image: { src: iconBuildingRemove, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="building"]',
        coreAsWell: false,
        onClickFunction: handleRemoveBuilding
      },
      {
        id: 'modify-building',
        content: '&nbsp' + ' 건물명 수정',
        image: { src: iconBuildingUpdate, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="building"]',
        coreAsWell: false,
        hasTrailingDivider: true,
        onClickFunction: handleModifyBuildingModal
      },
      {
        id: 'add-floor',
        content: '&nbsp' + ' 건물 내 층 추가',
        image: { src: iconFloorAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="building"]',
        coreAsWell: false,
        onClickFunction: handleShowFloorModal
      },
      {
        id: 'remove-floor',
        content: '&nbsp' + ' 건물 내 층 삭제',
        image: { src: iconFloorRemove, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="building"]',
        coreAsWell: false,
        onClickFunction: handleDelFloorModal
      },
      {
        id: 'add-camera',
        content: '&nbsp' + ' 카메라 추가',
        image: { src: iconCameraAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        onClickFunction: handleShowModalAddCamera
      },
      {
        id: 'add-ebell',
        content: '&nbsp' + ' 비상벨 추가',
        image: { src: iconEbellAdd, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        hasTrailingDivider: true,
        onClickFunction: handleShowModalAddEbell
      },
      // -----------------------------------
      {
        id: 'add-pids',
        content: '&nbsp' + ' PIDS(Gdp200) 등록',
        image: { src: iconFence, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        onClickFunction: handleAddGdp200
      },
      {
        id: 'del-Gdp200',
        content: '&nbsp' + ' PIDS(Gdp200) 삭제',
        tooltipText: '',
        image: { src: iconFence, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        hasTrailingDivider: true,
        onClickFunction: handleModalShowRemoveGdp200List
      },
      {
        id: 'edit-pids',
        content: '&nbsp' + ' 울타리(PIDS Zone) 설정',
        tooltipText: 'PIDS Zone 선택 후 시작점이 생성된 상태에서 원하는 종료지점에 마우스 좌클릭합니다.',
        image: { src: iconFence, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[type="background"]',
        coreAsWell: false,
        onClickFunction: handlePidsEdit
      },
      // -----------------------------------
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
        content: '&nbsp' + ' 이벤트 알람 해제',
        image: { src: iconEventClear, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="camera"]',
        coreAsWell: false,
        onClickFunction: handleConfirmAllEvent
      },
      // -----------------------------------
      {
        id: 'delete-ebell',
        content: '&nbsp' + ' 비상벨 삭제',
        image: { src: iconEbellRemove, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="ebell"]',
        hasTrailingDivider: false,
        onClickFunction: handleRemoveEbell
      },
      {
        id: 'setCamera-ebell',
        content:  '&nbsp' + ' 비상벨 카메라 설정',
        image: { src: iconDoorUpdate, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="ebell"]',
        hasTrailingDivider: false,
        onClickFunction: handleCameraForEbell
      },

      // PIDS 메뉴
      {
        id: 'delete-pids',
        content: '&nbsp' + ' 선택한 PIDS Zone 삭제',
        image: { src: iconFence, width: 17, height: 17, x: 3, y: 2 }, // 삭제 아이콘 필요
        selector: 'node[device_type="zone"], edge[type="zone"]',
        coreAsWell: false,
        // show: false, // 추후 비상벨 직접 삭제 시 true 변경
        onClickFunction: handleRemovePids,
      },
      {
        id: 'setCamera-pids',
        content: '&nbsp' + ' 카메라 설정',
        image: { src: iconDoorUpdate, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="zone"], edge[type="zone"]',
        coreAsWell: false,
        onClickFunction: handleCameraPids
      },
      {
        id: 'acknowledge-allEvent-pids',
        content: '&nbsp' + ' 이벤트 알림 해제',
        image: { src: iconEventClear, width: 17, height: 17, x: 3, y: 2 },
        selector: 'node[device_type="zone"], edge[type="zone"]',
        coreAsWell: false,
        onClickFunction: handleConfirmAllEvent
      },
    ]

    instance.appendMenuItems(menuItem);

    this.setState({ cy: cy });
    // , () => this.pidsEventIconChange()
  }

  async componentDidUpdate(prevProps) {
    const newElements = [];
    
    newElements.push(
      {
        data: {
          id: 'background',
          type: 'background',
          value: 'background',
          label: '',
          idx: 0,
          buildingIdx: 0,
          floorIdx: 0,
          buildingServiceType: 'observer'
        },
        style: {
          backgroundImage: `http://${this.context.websocket_url}/images/floorplan/birdseyeview.png`,
          minWidth: '1000px',
          minHeight: '800px',
          backgroundWidth: '1000px',
          backgroundHeight: '800px',
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

    if ((this.props.deviceList !== undefined && prevProps.deviceList !== undefined && this.props.deviceList !== prevProps.deviceList) ||
      (this.props.pidsList !== undefined && prevProps.pidsList !== undefined && this.props.pidsList !== prevProps.pidsList) ||
      (this.props.cameraList !== undefined && prevProps.cameraList !== undefined && this.props.cameraList !== prevProps.cameraList) ||
      (this.props.buildingList !== undefined && prevProps.buildingList !== undefined && this.props.buildingList !== prevProps.buildingList)) {

        await this.AddDeviceToElement(newElements);
        this.state.cy.elements().remove();
        this.state.cy.add(newElements);
        this.handleCloseContext();
    }

    if (this.props.eventPopup.timestamp != 0 &&
      this.props.eventPopup.timestamp !== prevProps.eventPopup.timestamp) {
        if(this.props.eventPopup.buildingIdx !== prevProps.eventPopup.buildingIdx || this.props.eventPopup.floorIdx !== prevProps.eventPopup.floorIdx || this.props.eventPopup.buildingServiceType !== prevProps.eventPopup.buildingServiceType) {
          await this.handleDisconnectSocket();
          await this.handleClosePopup();
          await this.handleCloseEbellPopup();
          await this.handleClosePidsPopup();
        }
      const socket = this.props.socketClient;
      const findCamera = this.props.cameraList.find((camera) => (camera.cameraid === this.props.eventPopup.deviceId && (('selectctl' === this.props.eventPopup.serviceType) || ('observer' === this.props.eventPopup.serviceType))));
      const findDevice = this.props.deviceList.find((device) => (device.id === this.props.eventPopup.deviceId && device.service_type === this.props.eventPopup.serviceType));
      const findZone = this.props.pidsList.find((device) => (device.pidsid === this.props.eventPopup.deviceId && device.service_type === this.props.eventPopup.serviceType));
      // 이벤트가 발생한 해당 장치 팝업 띄우기
      if (findCamera) {
        const res = this.state.cy && this.state.cy.getElementById('camera.'+findCamera.cameraid);
        if (res && res._private && res._private.data) {
          if(this.state.liveStreamCamera && this.state.liveStreamCamera.cameraid === findCamera.cameraid) {
            return;
          } if(socket && this.state.liveStreamCamera){
            socket.emit('cameraStream', { 
              cameraId: this.state.liveStreamCamera.cameraid,
              cmd: 'off'
            });
            this.setState({ liveStreamCamera: undefined });
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
        const res = this.state.cy && this.state.cy.getElementById(findDevice.type+ '.' + findDevice.id);
        if (res && res._private && res._private.data) {
          if (findDevice.type === 'ebell') {
            if(this.state.liveStreamEBell && this.state.liveStreamEBell.id === findDevice.id) {
              return;
            } else if(socket && this.state.liveStreamEBell){
              socket.emit('cameraStream', { 
                cameraId: this.state.liveStreamEBell.camera_id,
                cmd: 'off'
              });
              this.setState({ liveStreamEBell: undefined });
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
          this.showDevicePopup(event);
        }
      } else if (findZone) {
        const res = this.state.cy && this.state.cy.getElementById(findZone.pidsid);
        if (res && res._private && res._private.data) {
          if(this.state.liveStreamZone && this.state.liveStreamZone.pidsid === findZone.pidsid) {
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

  handleShowModalAddBuilding = (e) => {
    this.setState({
      modalBuildingShow: true,
    });
    // 팝업창 닫기
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

  handleShowAddContext = (e) => {
    e.evt.preventDefault();
    const popup = document.getElementById("indoor-popup");
    if (popup) {
      popup.classList.remove('active');
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
      modalCameraShow: false,
      modalCameraFloorIdx: '',
      modalCameraLatitude: '',
      modalCameraLongitude: '',
      modalCameraWarn: '',
      modalCurrentCamera: undefined,
      mapClickPoint: { x: 0, y: 0 }
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

  handleCloseModalDelGdp200 = () => {
    this.setState({
      modalGdp200DelListShow: false,
      modalGdp200DelListWarn: '',
      modalCurrentGdp200DelList: undefined,
    });
  }

  handleAddMapCamera = async (e) => {
    e.preventDefault();
    if (this.state.modalCurrentCamera === undefined) {
      this.setState({ modalCameraWarn: '장치를 선택하세요.' });
      return
    }

    try {
      const res = await axios.put('/api/observer/addLocation', {
        id: this.state.modalCurrentCamera,
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        floorIdx: 0,
        buildingIdx: 0,
        buildingServiceType: 'observer',
      });
      // 모달창 닫기
      this.handleCloseModalCamera();
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
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
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        type: 'ebell',
        floorIdx: 0,
        buildingIdx: 0,
        buildingServiceType: 'observer',
      });
      // 모달창 닫기
      this.handleCloseModalEbell();
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      showEbellModal: false,
      modalEbellLatitude: '',
      modalEbellLongitude: '',
      modalEbellWarn: '',
      modalCurrentEbell: undefined,
    });
  }

  handleSubmit = () => {
    this.setState({ showModal: false }, () => this.handleAddMapBuilding2());
  }

  handleCancel = async () => {
    this.setState({ showModal: false });
  }

  handleAddMapBuilding = () => {
    this.setState({ showModal: true });
    this.setState({ modalTitle: '건물 추가' });
    this.setState({ modalMessage: '건물 추가하시겠습니까?' });
  }

  handleAddMapBuilding2 = async (e) => {
    const checkDuplicateBuilding = this.props.buildingList.find((building) => building.name === this.state.modalCurrentBuilding)
    if(checkDuplicateBuilding){
      this.setState({ modalBuildingWarn: '*동일한 이름의 건물이 있습니다.' });
      return
    }
    if (this.state.modalCurrentBuilding === undefined) {
      this.setState({ modalBuildingWarn: '*건물 이름을 입력하세요.' });
      return
    }
    if(this.state.modalCurrentBuilding && this.state.modalCurrentBuilding.length >= 31){
      this.setState({ modalBuildingWarn: '*건물이름 글자수 제한을 초과했습니다.(30자 이내)' });
      return
    }
    if(this.state.addBuildingCheck) {
      this.setState({ modalBuildingWarn: '*건물 추가가 이미 진행중입니다.' });
      return
    }
      try {
        await this.setState({ addBuildingCheck: true });
        const res = await axios.post('/api/observer/addBuilding', {
          name: this.state.modalCurrentBuilding,
          longitude: this.state.mapClickPoint.y.toString(),
          latitude: this.state.mapClickPoint.x.toString(),
          service_type: 'observer'
        })
        if(res && res.status === 200){
          this.setState({ addBuildingCheck: false });
        }
      }  catch (err) {
        console.error(err);
        this.setState({ addBuildingCheck: false });
        return;
      }
    this.setState({
      modalBuildingShow: false,
      modalBuildingLatitude: '',
      modalBuildingLongitude: '',
      modalBuildingWarn: '',
      modalServiceType: undefined,
      modalCurrentBuilding: undefined,
    });
  }

  handleModifyFloor = async () => {
    if (this.state.modalGroupImageId === undefined || this.state.modalGroupImageId === '') {
      this.setState({ modalFloorWarn: '*층을 선택하세요.' });
      return
    }
    if (this.state.modalmodifyFloor === undefined || this.state.modalmodifyFloor === '') {
      this.setState({ modalFloorWarn: '*층 이름을 입력하세요.' });
      return
    }
    if (this.state.modalmodifyFloor && this.state.modalmodifyFloor.length > 10) {
      this.setState({ modalFloorWarn: '*층이름 글자수 제한을 초과했습니다. (10자 이내)' });
      return
    }
    if (this.state.modalmodifyFloor === this.state.modalGroupImageId) {
      this.setState({ modalFloorWarn: '*현재 층 이름과 동일합니다.' });
      return
    }

    try {
      const testFeatureArr = this.state.testFeatureId.split(":");
      const buildingIdx = parseInt(testFeatureArr[0]);
      const checkDuplicateFloor = this.props.floorList.find((floor) => floor.name === this.state.modalmodifyFloor); 
      if (checkDuplicateFloor) {
        if (buildingIdx === checkDuplicateFloor.building_idx) {
          this.setState({ modalFloorWarn: '*동일한 이름의 층이 있습니다.' });
          return
        }
      }
      if(testFeatureArr.length < 2 || testFeatureArr[0] === undefined || testFeatureArr[1] === undefined || testFeatureArr[2] === undefined){
        this.setState({ modalFloorWarn: '*오류 발생' });
        return
      }
      const res = await axios.put('/api/observer/floor', {
        name: this.state.modalGroupImageId,
        buildingIdx: testFeatureArr[0],
        service_type: 'observer',
        modifyName: this.state.modalmodifyFloor
      });
    } catch (err) {
      console.error(err);
      return;
    }

    this.setState({
      testFeatureId: '',
      showFloorModifyModal: false,
      modalFloorWarn: '',
      modalServiceType: undefined,
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalmodifyFloor: '',
    });
  }

  handleRemoveFloor= async (selectFloor) => {
    const featureId = parseInt(this.state.modalFloorTargetData.idx);
    const featureServiceType = this.state.modalFloorTargetData.service_type;
    const floorName = this.state.modalGroupImageId;
    if(floorName && floorName.length > 0){
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '층 삭제',
        modalConfirmMessage: '선택한 층을 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: featureId,
        modalConfirmServiceType: featureServiceType,
        modalConfirmFloorName: floorName
      });
    }
    else {
      this.setState({
        modalFloorWarn: '층을 선택하세요.'
      });
      return
    }
  }

  handleAddMapFloor = async (e) => {
    if (this.state.modalCurrentFloor === undefined || this.state.modalCurrentFloor === '') {
      this.setState({ modalFloorWarn: '*층 이름을 입력하세요.' });
      return
    }
    if (this.state.modalGroupImageId === undefined || this.state.modalGroupImageId === '') {
      this.setState({ modalFloorWarn: '*층 이미지를 선택하세요.' });
      return
    }
    if (this.state.modalCurrentFloor && this.state.modalCurrentFloor.length > 10) {
      this.setState({ modalFloorWarn: '*층이름 글자수 제한을 초과했습니다. (10자 이내)' });
      return
    }

    if (this.state.modalCurrentFloor && this.state.modalCurrentFloor.length > 10) {
      this.setState({ modalFloorWarn: '*층이름 글자수 제한을 초과했습니다. (10자 이내)' });
      return
    }

    if(this.state.addFloorCheck) {
      this.setState({ modalFloorWarn: '*층 추가 작업이 이미 진행 중입니다.' });
      return
    }

    try {
      this.setState({ addFloorCheck: true });
      // const testFeatureArr = this.state.testFeatureId.split(":");
      const buildingIdx = this.state.modalFloorTargetData.idx
      const checkDuplicateFloor = this.props.floorList.find((floor) => floor.name === this.state.modalCurrentFloor && floor.building_idx === buildingIdx); 
      if (checkDuplicateFloor) {
          this.setState({ modalFloorWarn: '*동일한 이름의 층이 있습니다.' });
          return
      }

      const res = await axios.post('/api/observer/addFloor', {
        name: this.state.modalCurrentFloor,
        buildingIdx,
        mapImage: this.state.modalGroupImageId,
        service_type: 'observer'
      });

      if(res && res.status === 200){
        this.setState({ addFloorCheck: false });
      }
    } catch (err) {
      console.error(err);
      this.setState({ addFloorCheck: false });
      return;
    }

    this.setState({
      showFloorModal: false,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalServiceType: undefined,
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalFloorTargetData: undefined,
    });
  }

  handleModifyBuilding = async () => {
    if (this.state.modalmodifyBuilding === undefined || this.state.modalmodifyBuilding === '') {
      this.setState({ modalBuildingWarn: '*건물 이름을 입력하세요.' });
      return
    }
    if (this.state.modalmodifyBuilding && this.state.modalmodifyBuilding.length > 10) {
      this.setState({ modalBuildingWarn: '*건물 이름 글자수 제한을 초과했습니다. (10자 이내)' });
      return
    }
    if (this.state.modalmodifyBuilding === this.state.modalmodifyBuildingData.lebel) {
      this.setState({ modalBuildingWarn: '*현재 건물 이름과 동일합니다.' });
      return
    }
    try {
      // const testFeatureArr = this.state.testFeatureId.split(":");
      const checkDuplicateBuilding = this.props.buildingList.find((building) => building.name === this.state.modalmodifyBuilding);
      if (checkDuplicateBuilding) {
          this.setState({ modalBuildingWarn: '*동일한 이름의 건물이 있습니다.' });
          return
      }
      // if (testFeatureArr.length < 2 || testFeatureArr[0] === undefined || testFeatureArr[1] === undefined || testFeatureArr[2] === undefined) {
      //   this.setState({ modalBuildingWarn: '*오류 발생' });
      //   return
      // }
      const res = await axios.put('/api/observer/building', {
        name: this.state.modalmodifyBuildingData.label,
        service_type: 'observer',
        modifyName: this.state.modalmodifyBuilding
      });
    } catch (err) {
      console.error(err);
      return;
    }

    this.setState({
      testFeatureName: '',
      showBuildingModifyModal: false,
      modalBuildingWarn: '',
      modalServiceType: undefined,
      modalCurrentBuilding: undefined,
      mdalmodifyBuilding: '',
      modalmodifyBuildingData: undefined
    });
  }

  handleModifyBuildingModal = async (e) => {
    this.setState({
      showBuildingModifyModal: !this.state.showBuildingModifyModal,
      modalBuildingWarn: '',
      modalmodifyBuilding: '',
      modalmodifyBuildingData: e.target._private.data
    });
  }

  handleCloseModifyBuildingModal = async (e) => {
    this.setState({
      showBuildingModifyModal: !this.state.showBuildingModifyModal,
      modalBuildingWarn: '',
      modalmodifyBuilding: '',
      modalmodifyBuildingData: undefined
    });
  }

  handleShowFloorModal = async (e) => {
    this.setState({
      showFloorModal: !this.state.showFloorModal,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalFloorTargetData: e.target._private.data
    });
  };

  handleCloseFloorModal = async (e) => {
    this.setState({
      showFloorModal: !this.state.showFloorModal,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalFloorTargetData: undefined
    });
  };

  handleModifyFloorModal= async () => {
    this.setState({
      showFloorModifyModal: !this.state.showFloorModifyModal,
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalmodifyFloor: ''
    });
  }

  handleDelFloorModal = async (e) => {
    this.setState({
      delFloorModal: !this.state.delFloorModal,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalFloorTargetData: e.target._private.data
    });
  };

  
  handleCloseDelFloorModal = () => {
    this.setState({
      delFloorModal: !this.state.delFloorModal,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalFloorTargetData: undefined
    });
  }

  handleModalBuildingShow = async (obj) => {
    // obj.data 가 있으면 수정팝업
    if (obj && obj.data) {
      const feature = obj.data.marker;
      if (feature && feature.getId()) {
        for (let item of this.state.buildingList) {
          if (item.idx === feature.getId()) {
            this.setState({
              modalBuildingShow: !this.state.modalBuildingShow,
              modalBuildingLatitude: item.latitude,
              modalBuildingLongitude: item.longitude,
              modalBuildingWarn: '',
              modalCurrentBuilding: item.idx
            });
            break;
          }
        }
      }
    } else {
      this.setState({
        modalBuildingShow: !this.state.modalBuildingShow,
        modalBuildingLatitude: '',
        modalBuildingLongitude: '',
        modalBuildingWarn: '',
        modalCurrentBuilding: undefined,
      });
    }

    //this.props.changeMapMode('normal');
    if (this.state.map) {
    this.state.map.getViewport().style.cursor = '';
    }
  };

  // pids zone 카메라 연동 
  // e.preventDefault();
  handleAddMapCameraPids = async (e) => {
    const pidsCheck = this.props.pidsList.find((pids) => this.state.selectedShape.device_id === pids.pidsid);
    if ((e.camera_id === '' || e.camera_id === null || e.camera_id === undefined) && (this.state.modalCurrentCameraPids === undefined)) {
      this.setState({ modalCameraPidsWarn: '*카메라를 선택하세요.' });
      return
    }
    if (this.state.modalCurrentCameraPids === undefined) {
      if ((this.state.modalCurrentCameraPids !== '없음') && (this.state.selectedShape.camera_id !== "") &&
        (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) &&
        (e.camera_id === (pidsCheck && pidsCheck.camera_id))) {
        this.setState({ modalCameraPidsWarn: '*현재 등록된 카메라 입니다.' });
        return
      }
    }
    if ((this.state.modalCurrentCameraPids !== '없음') && (this.state.selectedShape.camera_id !== "") && 
        (e.camera_id !== null || e.camera_id !== "" || e.camera_id !== undefined) && 
        (e.camera_id === (pidsCheck && pidsCheck.camera_id)) && (this.state.modalCurrentCameraPids == this.state.selectedShape.camera_id)) {
      this.setState({ modalCameraPidsWarn: '*현재 등록된 카메라 입니다.' });
      return
    }
    try {
      if (this.state.modalCurrentCameraPids !== '선택 해제' && this.state.modalCurrentCameraPids !== '없음') {
        const cameraId = this.state.modalCurrentCameraPids.replace('.카메라', '');
        const res = await axios.put('/api/observer/cameraForPids', {
          id: this.state.selectedShape.device_id,
          cameraId,
          service_type: this.state.selectedShape.service_type,
          // type: 'zone'
        });
        this.handleCloseModalCameraPids();
      } else {
        const res = await axios.put('/api/observer/cameraForPids', {
          id: this.state.selectedShape.device_id,
          cameraId: '',
          service_type: this.state.selectedShape.service_type,
          // type: 'zone'
        });
        this.handleCloseModalCameraPids();
      }
    } catch (err) {
      console.log(err);
      return;
    }
    this.setState({
      modalCameraPidsShow: false,
      modalCameraPidsFloorIdx: '',
      modalCameraPidsLatitude: '',
      modalCameraPidsLongitude: '',
      modalCameraPidsWarn: '',
      modalCurrentCameraPids: undefined
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

  handleRemoveBuilding = async (e) => {
    const buildingName = e.target._private.data.label;
    const buildingIdx = e.target._private.data.idx;
    const buildingServiceType = e.target._private.data.service_type;
    try {
      if (buildingIdx) {
        this.setState({
          showDelConfirm: true,
          modalConfirmTitle: '건물 삭제',
          modalConfirmMessage: '[ ' + buildingName + ' ] 건물을 삭제하시겠습니까?',
          modalConfirmBtnText: '삭제',
          modalConfirmCancelBtnText: '취소',
          modalConfirmIdx: buildingIdx,
          modalConfirmServiceType: buildingServiceType,
        });
      }
    } catch (error) {
      console.log('handleRemoveBuilding()', error);
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
    // PIDS 등록 중복 방지
    if(this.state.addPidsCheck) {
      this.setState({ modalPidsWarn: '이미 PIDS 등록 작업이 진행 중입니다.' })
      return
    }

    try {

      this.setState({ addPidsCheck: true });

      const res = await axios.post('/api/observer/pids', {
        id: this.state.modalCurrentPids,
        name: this.state.modalCurrentPids,
        longitude: this.state.mapClickPoint.y.toString(),
        latitude: this.state.mapClickPoint.x.toString(),
        building_idx: 0,
        building_service_type: 'observer',
        floor_idx: 0,
        type: 'pids',
        ipaddress: this.state.modalPidsIpaddress,
        location: this.state.modalPidsLocation,
      });

      if(res && res.status === 200){
        this.setState({ addPidsCheck: false });
      }
    } catch (err) {
      console.log(err);
      this.setState({ addPidsCheck: false });
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

        floor_idx: 0,
        building_idx: 0,
        service_type: 'observer'
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
        shape: 'ellipse',
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
      mapClickPoint: { x: e.position.x, y: e.position.y }
    }, () => this.edgeDraw())
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
      modalConfirmMessage: '[ ' + this.state.selectedShape.label + ' ] 카메라를 삭제하시겠습니까?',
      modalConfirmBtnText: '삭제',
      modalConfirmCancelBtnText: '취소',
      modalConfirmIdx: this.state.selectedShape.id,
      modalConfirmServiceType: this.state.selectedShape.service_type,
    });

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
  }

  handleModalShowRemoveGdp200List = () => {
    this.setState({
      modalGdp200DelListShow: true,
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
    this.handleCloseContext();
  }

  handleCameraPids = async (e) => {
    this.setState({
      modalCameraPidsShow: true,
    });
    // 팝업창 닫기
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
          id: this.state.modalConfirmIdx.slice(7),
          service_type: this.state.modalConfirmServiceType,
        });
        if (res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('출입문 삭제') >= 0) {
        // 출입문 삭제 REST API 호출
        const res = await axios.put('/api/observer/door', {
          id: this.state.modalConfirmIdx,
          service_type: this.state.modalConfirmServiceType,
        });
        if (res.data.message === 'ok') {
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
        if (res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('PIDS Zone 삭제') >= 0) {
        // PIDS 삭제 REST API 호출
        const res = await axios.delete('/api/observer/pids', {
          params: {
            id: this.state.selectedShape.device_id,
            // service_type: this.state.modalConfirmServiceType,
          }
        });
        if (res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('PIDS(Gdp200) 삭제') >= 0) {
        // PIDS 삭제 REST API 호출
        let selectGdp200 = this.state.modalCurrentGdp200DelList; // Gdp200
        let ipaddress;
        let gdp200 = this.props.deviceList.map((gdp200) => {
          if (gdp200.name === selectGdp200) { ipaddress = gdp200.ipaddress };
        })
        const res = await axios.delete('/api/observer/pidsGdp200', {
          params: {
            name: this.state.modalCurrentGdp200DelList,
            ipaddress
          }
        });
        if (res.data.message === 'ok') {
          this.setState({ selectedShape: undefined });
        }
      } else if (this.state.modalConfirmTitle.indexOf('건물 삭제') >= 0) {
        // 건물 삭제 REST API 호출
        const res = await axios.delete('/api/observer/building', {
          params: {
            idx: this.state.modalConfirmIdx,
            serviceType: this.state.modalConfirmServiceType,
          }
        });
      } else if (this.state.modalConfirmTitle.indexOf('층 삭제') >= 0) {
        // 층 삭제 REST API 호출
        const res = await axios.delete('/api/observer/floor', {
          params: {
            buildingIdx: this.state.modalConfirmIdx,
            serviceType: this.state.modalConfirmServiceType,
            floorName: this.state.modalConfirmFloorName
          }
        })
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
        modalConfirmIpaddress: undefined,
        modalCurrentGdp200DelList: undefined,
        modalGdp200DelListShow: false,
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
    this.setState({ ipaddress: this.state.selectedShape.ipaddress });
    if (this.state.selectedShape.type === 'zone') {
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

  generateCameraBlinkPopup = () => {
    if (this.props.cameraList) {
      const cameras = this.props.cameraList.filter(camera => {
        if (camera.type !== 'building' &&
          camera.building_idx === 0 &&
          camera.floor_idx === 0 &&
          camera.longitude !== null && camera.latitude !== null && camera.longitude !== 'null' && camera.latitude !== 'null' && camera.longitude !== '' && camera.latitude !== '') {
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

  generateDeviceBlinkPopup = () => {
    if (this.props.deviceList) {
      const devices = this.props.deviceList.filter(device => {
        if (device.type !== 'building' && device.type !== 'pids' &&
          device.building_idx === 0 &&
          device.floor_idx === 0 &&
          device.building_service_type === 'observer') {
          return true;
        } else {
          return false;
        }
      });

      if (devices.length > 0 && this.state.cy) {
        return devices.map((device, index) => {
          const res = this.state.cy.getElementById(device.type + '.' + device.id);
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
            
            if (device.status != 0 && device.status != '0' && device.status != null) {
              divStyle.display = 'initial';
            }
            return (
              <div className={'device' + device.id} style={divStyle} key={index}>
                <img src={iconBlinker} style={{ height: '20px', width: '20px' }} />
              </div>
            );
          } else {
            return (<div key={index}></div>);
          }
        });
      } else {
        return (<div></div>);
      }
    }
  }

  render() {
    const sortedCameraList = this.props.cameraList.sort((a, b) => a.cameraid > b.cameraid ? 1 : -1);
    const doorCamera = this.props.deviceList.find((door) => this.state.selectedShape && door.id === this.state.selectedShape.device_id);
    const detailZone = this.props.pidsList.find((pids) => this.state.selectedShape && (pids.pidsid === this.state.selectedShape.device_id));
    const detailEbell = this.props.deviceList.find((ebell) => this.state.selectedShape && (ebell.id === this.state.selectedShape.device_id));
    return (
      <div className="gcanvas">
        <div
          ref={this.cyRef}
          style={{ height: "900px" }}
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

        <div id="indoor-pids-popup" className={this.state.pidsPopup}>
          <a href="!#" id="indoor-pids-popup-closer" className={this.state.pidsPopup === "ol-indoor-pids-popup" ? "ol-indoor-pids-popup-closer" : "ol-indoor-pids-popup-closer noVideo"} onClick={this.handleClosePidsPopup}></a>
          <span id="ol-indoor-pids-popup-arrow"></span>
          <Container id="pids-indoor-popup-content">
            <div id="pids-indoor-popup-video">
            </div>
          </Container>
        </div>

        <div>
          {this.generateDeviceBlinkPopup()}
        </div>
        <div>
          {this.generateCameraBlinkPopup()}
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
                    if(ebell.type === 'ebell') {
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

        {/* 건물 추가 모달 */}
        <Modal
          show={this.state.modalBuildingShow}
          onHide={this.handleModalBuildingShow}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              건물 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>건물명 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeBuilding} value={this.state.modalCurrentBuilding || ''} placeholder='건물명을 입력하세요' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                </input>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalBuildingWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapBuilding}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleModalBuildingShow}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 건물 수정 모달 */}
        <Modal
          show={this.state.showBuildingModifyModal} 
          onHide={this.handleCloseModifyBuildingModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              건물 이름 수정
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                {/* <Form.Group controlId="formBuildingId">
                  <Form.Label>선택된 건물 이름</Form.Label>
                  <form className="form-control BuildingImage" disabled>
                  <option selected="selected">   {this.state.testFeatureName} </option>
                  </form>
                </Form.Group> 
                <br />*/}
                <Form.Label>건물 이름 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeModifyBuilding} value={this.state.modalmodifyBuilding || ''} placeholder={this.state.testFeatureName} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                </input>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalBuildingWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleModifyBuilding}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModifyBuildingModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* 층 추가 모달 */}
        <Modal
          show={this.state.showFloorModal}
          onHide={this.handleCloseFloorModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              층 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>층 이름 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeFloor} value={this.state.modalCurrentFloor || ''} placeholder='층 이름을 입력하세요'>
                </input>
                <br />
                <Form.Group controlId="formFloorId">
                  <Form.Label>평면도(층) 이미지 (*필수)</Form.Label>
                  <select className="form-control floorImage" onChange={this.handleChangeGroupImageId} value={this.state.modalGroupImageId}>
                    <option></option>
                    {this.state.floorImageList.map((image, index) => (
                      <option key={index} value={image.name}> {image.name} </option>
                    ))}
                  </select>
                </Form.Group>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalFloorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapFloor}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseFloorModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 층 수정 모달 */}
        <Modal
          show={this.state.showFloorModifyModal}
          onHide={this.handleModifyFloorModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              층 이름 수정
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Group controlId="formFloorId">
                  <Form.Label>층 선택 (*필수)</Form.Label>
                  <select className="form-control floorImage" onChange={this.handleChangeGroupImageId} value={this.state.modalGroupImageId}>
                  <option></option>
                    {/* {this.props.floorList && this.props.floorList.map((floor, index) => {
                      if (featureId && featureServiceType) {
                        if (floor.building_idx === featureId && floor.service_type === featureServiceType) {
                          return <option key={index} value={floor.name}> {floor.name} </option>
                        }
                      }
                    })} */}
                  </select>
                </Form.Group>
                <br />
                <Form.Label>층 이름 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeModifyFloor} value={this.state.modalmodifyFloor || ''} placeholder='층 이름을 입력하세요'>
                </input>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalFloorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleModifyFloor}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleModifyFloorModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 층 삭제 모달 */}
        <Modal
          show={this.state.delFloorModal}
          onHide={this.handleCloseDelFloorModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              층 삭제
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Group controlId="formFloorId">
                  <Form.Label>층 목록</Form.Label>
                  <select className="form-control floorImage" onChange={this.handleChangeGroupImageId} value={this.state.modalGroupImageId}>
                  <option></option>
                    {this.props.floorList && this.props.floorList.map((floor, index) =>{
                      if(this.state.modalFloorTargetData){
                        if(floor.building_idx === this.state.modalFloorTargetData.idx && floor.service_type === this.state.modalFloorTargetData.service_type){
                          return <option key={index} value={floor.name}> {floor.name} </option>
                        }
                      } 
                    })}
                  </select>
                </Form.Group>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalFloorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={(e) => this.handleRemoveFloor(this.state.modalGroupImageId)}>
              삭제
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseDelFloorModal}>
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
                    if (pidsZone.source_longitude === null || pidsZone.source_latitude === null || pidsZone.source_longitude === 'null' || pidsZone.source_latitude === 'null' || pidsZone.source_longitude === '' || pidsZone.source_latitude === '' ||
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
                  <option>{doorCamera && doorCamera.camera_id ? doorCamera.camera_id + '.카메라' : '연동된 카메라 없음'}</option>
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
            <Button variant="primary" onClick={() => this.handleAddMapCameraDoor(doorCamera)}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalCameraDoor}>
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
              <Form.Group controlId="Idx">
                <Form.Label>카메라 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeCameraPids} value={this.state.modalCurrentCameraPids}>
                  <option>{detailZone && sortedCameraList.find((camera) => camera.cameraid === detailZone.camera_id) ? (sortedCameraList.find((camera) => camera.cameraid === detailZone.camera_id).cameraid+'.'+sortedCameraList.find((camera) => camera.cameraid === detailZone.camera_id).cameraname):'연동된 카메라 없음'}</option>
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
            <Button variant="primary" onClick={() => this.handleAddMapCameraPids(detailZone)}>
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

        {/* Gdp200 삭제 모달 */}
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
                  {this.props.deviceList && this.props.deviceList.map((device, index) => {
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
        <Modal show={this.state.showModal} centered>
          <Modal.Header className="vms-alert-modal">
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSubmit}>
              확인
            </Button>
            <Button variant="primary" onClick={this.handleCancel}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>
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
export default GCanvasOut;

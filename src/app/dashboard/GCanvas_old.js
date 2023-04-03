import axios from 'axios';
import React from 'react';
import { Modal, Form, Button, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Stage, Layer, Image, Text, Rect, Label, Tag } from 'react-konva';
import { format, parse, addHours, addSeconds } from 'date-fns';
import iconGoToGmap from '../../assets/images/gotogmap.png';
import iconEbellNormal from '../../assets/images/indoor_ebell.ico';
import iconEbellEvent from '../../assets/images/indoor_ebell_event.ico';
import iconCamera from '../../assets/images/cctv.ico';
import iconCameraEvent from '../../assets/images/cctv_event.ico';
import iconDoor from '../../assets/images/door.ico';
import iconDoorEvent from '../../assets/images/door_event.ico';
import iconBreathSensor from '../../assets/images/breathsensor.png';
import iconBreathSensorEvent from '../../assets/images/event_breathsensor.png';
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
import ModalConfirm from './ModalConfirm';
import line from '../../assets/images/line.png';
import Inquiry from '../Inquiry';
import noEvent from '../../assets/images/access_no_event.png';
import noCamera from '../../assets/images/without_camera.png';
import iconDetectionBreathing from '../../assets/images/detection_breathing.ico';
import { Line } from 'react-chartjs-2';

class GCanvas extends React.Component {

  static contextType = UserInfoContext;

  constructor(props) {
    super(props);

    this.refStage = React.createRef();

    this.state = {
      bgImage: require('../../assets/images/floor.png'),
      imageGoToGmap: undefined,
      blinker: false,
      imageEbellNormal: undefined,
      imageEbellEvent: undefined,
      imageEbellCall: undefined,
      imageCamera: undefined,
      imageCameraEvent: undefined,
      imageBg: undefined,
      floorList: [],
      deviceList: [],
      cameraList: [],
      //currFloorIdx: undefined,
      selectedShape: undefined,
      selectedShape2: undefined,
      selectedShape3: undefined,
      selectedShape4: undefined,
      videoPresence: false,
      mapClickPoint: { x: 0, y: 0 },

      modalCameraShow: false,
      modalCameraFloorIdx: undefined,
      modalCameraLatitude: '',
      modalCameraLongitude: '',
      modalCameraWarn: '',
      modalCurrentCamera: undefined,

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

      modalCameraBreathSensorShow: false,
      modalCameraBreathSensorFloorIdx: '',
      modalCameraBreathSensorLatitude: '',
      modalCameraBreathSensorLongitude: '',
      modalCameraBreathSensorWarn: '',
      modalCurrentCameraBreathSensor: undefined,

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

      LogDoorID: undefined,

      showAlert: false,
      device_id: undefined,
      device_type: undefined,
      service_type: undefined,

      //장치 팝업 디자인
      cameraPopup: "ol-indoor-popup",
      ebellPopup: "ol-indoor-ebell-popup",
      doorPopup: "ol-indoor-door-popup",
      breathSensorPopup: "ol-indoor-breathSensor-popup",

      //지도위 장치 라이브 영상
      cameraVideo: '',
      ebellVideo: '',
      doorVideo: '',
      breathSensorVideo: '',

      // 호흡센서 그래프 초기값
      breathValue: '',
            dataArr: {
                labels:[''],
                datasets: [
                    {
                        label: '호흡감지센서 체크',
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                          ],
                          borderWidth: 1,
                    },
                ],
            },
      xGraphTime: '',
    };

    setInterval(() => {
      this.setState({ blinker: !this.state.blinker });
    }, 600);
  }

  handleLoad = () => {
    this.setState({
      imageGoToGmap: this.imageGoToGmap
    });
  }

  handleLoad2 = () => {
    this.setState({
      imageEbellNormal: this.imageEbellNormal
    });
  }
  handleLoad2_1 = () => {
    this.setState({
      imageEbellEvent: this.imageEbellEvent
    });
  }

  handleLoad3 = () => {
    this.setState({
      imageCamera: this.imageCamera
    });
  }

  handleLoad4 = () => {
    this.setState({
      imageCameraEvent: this.imageCameraEvent
    });
  }

  handleLoad5 = () => {
    this.setState({
      imageDoor: this.imageDoor
    });
  }

  handleLoad6 = () => {
    this.setState({
      imageDoorEvent: this.imageDoorEvent
    });
  }

  handleLoad7 = () => {
    this.setState({
      imageBreathSensor: this.imageBreathSensor
    });
  }

  handleLoad8 = () => {
    this.setState({
      imageBreathSensorEvent: this.imageBreathSensorEvent
    });
  }

  handleGoToGmap = () => {
    this.props.changeMapType(1, null, null, null);
  }

  getCameraById = async (id) => {
    return this.props.cameraList.find(camera => camera.cameraid === id);
  }

  getEbellByKey = async (idx, service_type) => {
    return this.props.deviceList.find((device) => (device.idx === parseInt(idx) && device.service_type === service_type));
  }

  getDoorByKey = async (idx, service_type) => {
    console.log(idx, service_type);
    return this.props.deviceList.find((device) => (parseInt(device.id) === parseInt(idx) && device.service_type === service_type));
  }


  getBreathSensorByKey = async (idx, service_type) => {
    console.log(idx, service_type);
    return this.props.deviceList.find((device) => device.idx === parseInt(idx) && device.service_type === service_type);
  }

  // handlePopupLocationX = async (clientX) => {
  //   let LocationX = parseInt(clientX)
  //   if(LocationX > 698) {
  //     LocationX - 306
  //   }
  //   return LocationX 
  // }

  // handlePopupLocationY = async (clientY) => {
  //   let LocationY = parseInt(clientY)
  //   if(LocationY > 694) {
  //     LocationY - 201
  //   }
  //   return LocationY 
  // }


  showDevicePopup = async (e) => {
    console.log('showDevicePopup:', e);
    console.log(e.target.attrs.name);
    if (e.evt.button !== 0) { return; }
    const popup = document.getElementById("indoor-popup");
    const ebell_popup = document.getElementById("indoor-ebell-popup");
    const door_popup = document.getElementById("indoor-door-popup");
    const breathSensor_popup = document.getElementById("indoor-breathSensor-popup");
    if (door_popup) {
      door_popup.classList.remove('active');
    }
    const camera_video = document.getElementById('indoor-popup-video');
    const ebell_video = document.getElementById('ebell-indoor-popup-video');
    const door_video = document.getElementById('door-indoor-popup-video');
    const breathSensor_video = document.getElementById('breathSensor-indoor-popup-video');
    if (e.target.attrs.name === 'cameraicon') {
      const camera = await this.getCameraById(e.target.attrs.id);
      this.props.readEventsByIpForWeek(camera ? camera.ipaddress : null)
      if (camera) {
        try {
          const res = await axios(`/api/observer/getcameralivestreamurl?id=${camera.cameraid}`);
          if (res && res.data && res.data.result) {
            this.setState({ cameraVideo: res.data.result });
            camera_video.innerHTML = `<img style="width: 300px; height: 200px;" src=${this.state.cameraVideo} autoplay></img>`;
            this.setState({ cameraPopup: "ol-indoor-popup" });
            if (popup && popup.style) {
              popup.classList.add('active');
              ebell_popup.classList.remove('active');
              door_popup.classList.remove('acitve');
              breathSensor_popup.classList.remove('active');
              popup.style.display = 'initial';
              if(e.evt.clientY > 776) {
                popup.style.top = e.evt.clientY - 252 + 'px';
              } else {
                popup.style.top = e.evt.clientY + 2 + 'px';
              }
    
              if(e.evt.clientX > 1143) {
                popup.style.left = e.evt.clientX - 304 + 'px';
              } else {
                popup.style.left = e.evt.clientX + 2 + 'px';
              }
            }
          } else {
            camera_video.innerHTML = null;
            this.setState({ cameraPopup: "ol-indoor-popup noVideo" });
            if (popup && popup.style) {
              popup.classList.add('active');
              ebell_popup.classList.remove('active');
              door_popup.classList.remove('acitve');
              breathSensor_popup.classList.remove('active');
              popup.style.display = 'initial';
              if(e.evt.clientY > 976) {
                popup.style.top = e.evt.clientY - 59 + 'px';
              } else {
                popup.style.top = e.evt.clientY + 2 + 'px';
              }
    
              if(e.evt.clientX > 1143) {
                popup.style.left = e.evt.clientX - 234 + 'px';
              } else {
                popup.style.left = e.evt.clientX + 2 + 'px';
              }
            }
          }
        } catch (err) {
          camera_video.innerHTML = null;
          this.setState({ cameraPopup: "ol-indoor-popup noVideo" });
          console.log('getlivestream error:', err);
          if (popup && popup.style) {
            popup.classList.add('active');
            ebell_popup.classList.remove('active');
            door_popup.classList.remove('acitve');
            breathSensor_popup.classList.remove('active');
            popup.style.display = 'initial';
            if(e.evt.clientY > 976) {
              popup.style.top = e.evt.clientY - 59 + 'px';
            } else {
              popup.style.top = e.evt.clientY + 2 + 'px';
            }
  
            if(e.evt.clientX > 1143) {
              popup.style.left = e.evt.clientX - 234 + 'px';
            } else {
              popup.style.left = e.evt.clientX + 2 + 'px';
            }
          }
        }
        this.setState({
          selectedShape: camera
        });
      } else {
        if (popup && popup.style) {
          popup.classList.add('active');
          ebell_popup.classList.remove('active');
          door_popup.classList.remove('acitve');
          breathSensor_popup.classList.remove('active');
          popup.style.display = 'initial';
          if(e.evt.clientY > 976) {
            popup.style.top = e.evt.clientY - 59 + 'px';
          } else {
            popup.style.top = e.evt.clientY + 2 + 'px';
          }

          if(e.evt.clientX > 1143) {
            popup.style.left = e.evt.clientX - 234 + 'px';
          } else {
            popup.style.left = e.evt.clientX + 2 + 'px';
          }
        }
        this.setState({ cameraPopup: "ol-indoor-popup noVideo" });
        camera_video.innerHTML = null;
      }
    } else if (e.target.attrs.name === 'ebellicon') {
      const ebell = await this.getEbellByKey(e.target.attrs.id, e.target.attrs.service_type);
      this.props.readEventsByIpForWeek(ebell ? ebell.ipaddress : null)
      if (ebell) {
        if (ebell.camera_id && ebell.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === ebell.camera_id);
          if (cameraInfo) {
            try {
              const res = await axios(`/api/observer/getcameralivestreamurl?id=${cameraInfo.cameraid}`);
              if (res && res.data && res.data.result) {
                this.setState({ ebellVideo: res.data.result });
                ebell_video.innerHTML = `<img style="width: 300px; height: 200px;" src=${this.state.ebellVideo} autoplay></img>`;
                this.setState({ ebellPopup: "ol-indoor-ebell-popup" });
                this.setState({ videoPresence: true });
                if (ebell_popup && ebell_popup.style) {
                  ebell_popup.classList.add('active');
                  popup.classList.remove('active');
                  door_popup.classList.remove('acitve');
                  breathSensor_popup.classList.remove('active');
                  ebell_popup.style.display = 'initial';
                  if(e.evt.clientY > 776) {
                    ebell_popup.style.top = e.evt.clientY - 252 + 'px';
                  } else {
                    ebell_popup.style.top = e.evt.clientY + 2 + 'px';
                  }
        
                  if(e.evt.clientX > 1143) {
                    ebell_popup.style.left = e.evt.clientX - 304 + 'px';
                  } else {
                    ebell_popup.style.left = e.evt.clientX + 2 + 'px';
                  }
                }
              } else {
                ebell_video.innerHTML = null;
                this.setState({ ebellPopup: "ol-indoor-ebell-popup noVideo" });
                this.setState({ videoPresence: false });
                if (ebell_popup && ebell_popup.style) {
                  ebell_popup.classList.add('active');
                  popup.classList.remove('active');
                  door_popup.classList.remove('acitve');
                  breathSensor_popup.classList.remove('active');
                  ebell_popup.style.display = 'initial';
        
                  if(e.evt.clientY > 976) {
                    ebell_popup.style.top = e.evt.clientY - 59 + 'px';
                  } else {
                    ebell_popup.style.top = e.evt.clientY + 2 + 'px';
                  }
        
                  if(e.evt.clientX > 1143) {
                    ebell_popup.style.left = e.evt.clientX - 234 + 'px';
                  } else {
                    ebell_popup.style.left = e.evt.clientX + 2 + 'px';
                  }
                }
              }
            } catch (err) {
              ebell_video.innerHTML = null;
              this.setState({ ebellPopup: "ol-indoor-ebell-popup noVideo" });
              this.setState({ videoPresence: false });
              if (ebell_popup && ebell_popup.style) {
                ebell_popup.classList.add('active');
                popup.classList.remove('active');
                door_popup.classList.remove('acitve');
                breathSensor_popup.classList.remove('active');
                ebell_popup.style.display = 'initial';
      
                if(e.evt.clientY > 976) {
                  ebell_popup.style.top = e.evt.clientY - 59 + 'px';
                } else {
                  ebell_popup.style.top = e.evt.clientY + 2 + 'px';
                }
      
                if(e.evt.clientX > 1143) {
                  ebell_popup.style.left = e.evt.clientX - 234 + 'px';
                } else {
                  ebell_popup.style.left = e.evt.clientX + 2 + 'px';
                }
              }
              console.log('getlivestream error:', err);
            }
          } else {
            if (ebell_popup && ebell_popup.style) {
              ebell_popup.classList.add('active');
              popup.classList.remove('active');
              door_popup.classList.remove('acitve');
              breathSensor_popup.classList.remove('active');
              ebell_popup.style.display = 'initial';
    
              if(e.evt.clientY > 976) {
                ebell_popup.style.top = e.evt.clientY - 59 + 'px';
              } else {
                ebell_popup.style.top = e.evt.clientY + 2 + 'px';
              }
    
              if(e.evt.clientX > 1143) {
                ebell_popup.style.left = e.evt.clientX - 234 + 'px';
              } else {
                ebell_popup.style.left = e.evt.clientX + 2 + 'px';
              }
            }
            ebell_video.innerHTML = ``;
            this.setState({ ebellPopup: "ol-indoor-ebell-popup noVideo" });
            this.setState({ videoPresence: false });
          }
        } else {
          if (ebell_popup && ebell_popup.style) {
            ebell_popup.classList.add('active');
            popup.classList.remove('active');
            door_popup.classList.remove('acitve');
            breathSensor_popup.classList.remove('active');
            ebell_popup.style.display = 'initial';
  
            if(e.evt.clientY > 976) {
              ebell_popup.style.top = e.evt.clientY - 59 + 'px';
            } else {
              ebell_popup.style.top = e.evt.clientY + 2 + 'px';
            }
  
            if(e.evt.clientX > 1143) {
              ebell_popup.style.left = e.evt.clientX - 234 + 'px';
            } else {
              ebell_popup.style.left = e.evt.clientX + 2 + 'px';
            }
          }
          ebell_video.innerHTML = ``;
          this.setState({ ebellPopup: "ol-indoor-ebell-popup noVideo" });
          this.setState({ videoPresence: false });
        }
        this.setState({
          selectedShape2: ebell
        });
      }
    } else if (e.target.attrs.name === 'dooricon') {
      const door = await this.getDoorByKey(e.target.attrs.id, e.target.attrs.service_type);
      console.log('door: ', door);
      console.log('@@@X@@@: ', e.evt.clientX);
      console.log('@@@Y@@@: ', e.evt.clientY);
      if (door) {
        this.props.readEventsByIpForWeek(door ? door.ipaddress : null);
        if (door.camera_id && door.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === door.camera_id);
          if (cameraInfo) {
            try {
              const res = await axios(`/api/observer/getcameralivestreamurl?id=${cameraInfo.cameraid}`);
              if (res && res.data && res.data.result) {
                this.setState({ doorVideo: res.data.result });
                door_video.innerHTML = `<img style="width: 300px; height: 200px;" src=${this.state.doorVideo} autoplay></img>`;
                this.setState({ videoPresence: true });
                this.setState({ doorPopup: "ol-indoor-door-popup" });
                if (door_popup && door_popup.style) {
                  door_popup.classList.add('active');
                  ebell_popup.classList.remove('active');
                  popup.classList.remove('active');
                  breathSensor_popup.classList.remove('active');
                  door_popup.style.display = 'initial';
        
                  if(e.evt.clientY > 776) {
                    door_popup.style.top = e.evt.clientY - 259 + 'px';
                  } else {
                    door_popup.style.top = e.evt.clientY + 2 + 'px';
                  }
        
                  if(e.evt.clientX > 1143) {
                    door_popup.style.left = e.evt.clientX - 304 + 'px';
                  } else {
                    door_popup.style.left = e.evt.clientX + 2 + 'px';
                  }
                }
              } else {
                if (door_popup && door_popup.style) {
                  door_popup.classList.add('active');
                  ebell_popup.classList.remove('active');
                  popup.classList.remove('active');
                  breathSensor_popup.classList.remove('active');
                  door_popup.style.display = 'initial';
        
                  if(e.evt.clientY > 976) {
                    door_popup.style.top = e.evt.clientY - 59 + 'px';
                  } else {
                    door_popup.style.top = e.evt.clientY + 2 + 'px';
                  }
        
                  if(e.evt.clientX > 1215) {
                    door_popup.style.left = e.evt.clientX - 234 + 'px';
                  } else {
                    door_popup.style.left = e.evt.clientX + 2 + 'px';
                  }
                }
              }
            } catch (err) {
              console.log('getlivestream error:', err);
              door_video.innerHTML = ``;
              this.setState({ videoPresence: false });
              if (door_popup && door_popup.style) {
                door_popup.classList.add('active');
                ebell_popup.classList.remove('active');
                popup.classList.remove('active');
                breathSensor_popup.classList.remove('active');
                door_popup.style.display = 'initial';
      
                if(e.evt.clientY > 976) {
                  door_popup.style.top = e.evt.clientY - 59 + 'px';
                } else {
                  door_popup.style.top = e.evt.clientY + 2 + 'px';
                }
      
                if(e.evt.clientX > 1215) {
                  door_popup.style.left = e.evt.clientX - 234 + 'px';
                } else {
                  door_popup.style.left = e.evt.clientX + 2 + 'px';
                }
              }
            }

          } else {
            this.setState({ doorPopup: "ol-indoor-door-popup noVideo" });
            door_video.innerHTML = ``;
            this.setState({ videoPresence: false });
            if (door_popup && door_popup.style) {
              door_popup.classList.add('active');
              ebell_popup.classList.remove('active');
              popup.classList.remove('active');
              breathSensor_popup.classList.remove('active');
              door_popup.style.display = 'initial';
    
              if(e.evt.clientY > 976) {
                door_popup.style.top = e.evt.clientY - 59 + 'px';
              } else {
                door_popup.style.top = e.evt.clientY + 2 + 'px';
              }
    
              if(e.evt.clientX > 1215) {
                door_popup.style.left = e.evt.clientX - 234 + 'px';
              } else {
                door_popup.style.left = e.evt.clientX + 2 + 'px';
              }
            }
          }
        } else {
          this.setState({ doorPopup: "ol-indoor-door-popup noVideo" });
          door_video.innerHTML = ``;
          this.setState({ videoPresence: false });
          if (door_popup && door_popup.style) {
            door_popup.classList.add('active');
            ebell_popup.classList.remove('active');
            popup.classList.remove('active');
            breathSensor_popup.classList.remove('active');
            door_popup.style.display = 'initial';
  
            if(e.evt.clientY > 976) {
              door_popup.style.top = e.evt.clientY - 59 + 'px';
            } else {
              door_popup.style.top = e.evt.clientY + 2 + 'px';
            }
  
            if(e.evt.clientX > 1215) {
              door_popup.style.left = e.evt.clientX - 234 + 'px';
            } else {
              door_popup.style.left = e.evt.clientX + 2 + 'px';
            }
          }
        }
        this.setState({
          selectedShape3: door
        });
      }
    } else if (e.target.attrs.name === 'breathSensoricon') {
      const breathSensor = await this.getBreathSensorByKey(e.target.attrs.id, e.target.attrs.service_type);
      this.setBreathValue();
      console.log('breathSensor: ', breathSensor);
      console.log('@@@X@@@: ', e.evt.clientX);
      console.log('@@@Y@@@: ', e.evt.clientY);
      if (breathSensor) {
        this.setState({
          selectedShape4: breathSensor
        });
        this.props.readEventsByIpForWeek(breathSensor ? breathSensor.ipaddress : null);
        if (breathSensor.camera_id && breathSensor.camera_id.length > 0) {
          const cameraInfo = this.props.cameraList.find(camera => camera.cameraid === breathSensor.camera_id);
          if (cameraInfo) {
            try {
              const res = await axios(`/api/observer/getcameralivestreamurl?id=${cameraInfo.cameraid}`);
              if (res && res.data && res.data.result) {
                this.setState({ breathSensorVideo: res.data.result });
                breathSensor_video.innerHTML = `<img style="width: 300px; height: 200px;" src="${this.state.breathSensorVideo}" autoplay></img>`;
                this.setState({ breathSensorPopup: "ol-indoor-breathSensor-popup" })
                this.setState({ videoPresence: true });
                if (breathSensor_popup && breathSensor_popup.style) {
                  breathSensor_popup.classList.add('active');
                  ebell_popup.classList.remove('active');
                  popup.classList.remove('active');
                  door_popup.classList.remove('active');
                  breathSensor_popup.style.display = 'initial';
                  if(e.evt.clientY > 641) {
                    breathSensor_popup.style.top = e.evt.clientY - 420 + 'px';
                  } else {
                    breathSensor_popup.style.top = e.evt.clientY + 2 + 'px';
                  }
        
                  if(e.evt.clientX > 1143) {
                    breathSensor_popup.style.left = e.evt.clientX - 304 + 'px';
                  } else {
                    breathSensor_popup.style.left = e.evt.clientX + 2 + 'px';
                  }
                }
              } else {
                this.setState({ breathSensorPopup: "ol-indoor-breathSensor-popup-noVideo" });
                breathSensor_video.innerHTML = ``;
                if (breathSensor_popup && breathSensor_popup.style) {
                  breathSensor_popup.classList.add('active');
                  ebell_popup.classList.remove('active');
                  popup.classList.remove('active');
                  door_popup.classList.remove('active');
                  breathSensor_popup.style.display = 'initial';
                  if(e.evt.clientY > 841) {
                    breathSensor_popup.style.top = e.evt.clientY - 222 + 'px';
                  } else {
                    breathSensor_popup.style.top = e.evt.clientY + 2 + 'px';
                  }
        
                  if(e.evt.clientX > 1143) {
                    breathSensor_popup.style.left = e.evt.clientX - 304 + 'px';
                  } else {
                    breathSensor_popup.style.left = e.evt.clientX + 2 + 'px';
                  }
                }
              }
            } catch (err) {
              console.log('getlivestream error:', err);
              if (breathSensor_video) {
                breathSensor_video.innerHTML = ``;
              }
              this.setState({ videoPresence: false });
              this.setState({ breathSensorPopup: "ol-indoor-breathSensor-popup-noVideo" });
              if (breathSensor_popup && breathSensor_popup.style) {
                breathSensor_popup.classList.add('active');
                ebell_popup.classList.remove('active');
                popup.classList.remove('active');
                door_popup.classList.remove('active');
                breathSensor_popup.style.display = 'initial';
                if(e.evt.clientY > 841) {
                  breathSensor_popup.style.top = e.evt.clientY - 222 + 'px';
                } else {
                  breathSensor_popup.style.top = e.evt.clientY + 2 + 'px';
                }
      
                if(e.evt.clientX > 1143) {
                  breathSensor_popup.style.left = e.evt.clientX - 304 + 'px';
                } else {
                  breathSensor_popup.style.left = e.evt.clientX + 2 + 'px';
                }
              }
            }

          } else {
            this.setState({ breathSensorPopup: "ol-indoor-breathSensor-popup-noVideo" });
            breathSensor_video.innerHTML = ``;
            this.setState({ videoPresence: false });
            if (breathSensor_popup && breathSensor_popup.style) {
              breathSensor_popup.classList.add('active');
              ebell_popup.classList.remove('active');
              popup.classList.remove('active');
              door_popup.classList.remove('active');
              breathSensor_popup.style.display = 'initial';
              if(e.evt.clientY > 841) {
                breathSensor_popup.style.top = e.evt.clientY - 222 + 'px';
              } else {
                breathSensor_popup.style.top = e.evt.clientY + 2 + 'px';
              }
    
              if(e.evt.clientX > 1143) {
                breathSensor_popup.style.left = e.evt.clientX - 304 + 'px';
              } else {
                breathSensor_popup.style.left = e.evt.clientX + 2 + 'px';
              }
            }
          }
        } else {
          this.setState({ breathSensorPopup: "ol-indoor-breathSensor-popup-noVideo" });
          if (breathSensor_video) {
            breathSensor_video.innerHTML = ``;
          }
          if (breathSensor_popup && breathSensor_popup.style) {
            breathSensor_popup.classList.add('active');
            ebell_popup.classList.remove('active');
            popup.classList.remove('active');
            door_popup.classList.remove('active');
            breathSensor_popup.style.display = 'initial';
            if(e.evt.clientY > 841) {
              breathSensor_popup.style.top = e.evt.clientY - 222 + 'px';
            } else {
              breathSensor_popup.style.top = e.evt.clientY + 2 + 'px';
            }
  
            if(e.evt.clientX > 1143) {
              breathSensor_popup.style.left = e.evt.clientX - 304 + 'px';
            } else {
              breathSensor_popup.style.left = e.evt.clientX + 2 + 'px';
            }
          }
          this.setState({ videoPresence: false });
        }
      }
    }
  }

  handleClosePopup = async (e, bClearSelectedShape = true) => {
    if (e) {
      e.preventDefault();
    }
    if (bClearSelectedShape === true) {
      this.setState({
        selectedShape: undefined,
        cameraVideo: ''
      });
    }
    const popup = document.getElementsByClassName(this.state.cameraPopup);
    if (popup.length > 0 && popup[0] && popup[0].style) {
      popup[0].style.display = 'none';
    }
    const camera_video = document.getElementById('indoor-popup-video');
    camera_video.innerHTML = null;
  }

  handleCloseEbellPopup = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const popup = document.getElementsByClassName(this.state.ebellPopup);
    if (popup.length > 0 && popup[0] && popup[0].style) {
      popup[0].style.display = 'none';
    }
    const ebell_video = document.getElementById('ebell-indoor-popup-video');
    ebell_video.innerHTML = null;

    this.setState({
      selectedShape2: undefined,
      ebellVideo: ''
    });
  }

  handleCloseDoorPopup = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const popup = document.getElementById("indoor-door-popup");
    if (popup && popup.style) {
      popup.style.display = 'none';
    }
    const door_video = document.getElementById('door-indoor-popup-video');
    door_video.innerHTML = null;

    this.setState({
      selectedShape3: undefined,
      doorVideo: ''
    });
  }

  handleCloseBreathSensorPopup = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const popup = document.getElementById("indoor-breathSensor-popup");
    if (popup && popup.style) {
      popup.style.display = 'none';
    }
    const breathSensor_video = document.getElementById('breathSensor-indoor-popup-video');
    breathSensor_video.innerHTML = null;

    this.setState({
      selectedShape4: undefined,
      breathSensorVideo: '',
      xGraphTime: '',
      breathValue: ''
    });
  }

  handleSelectFloor = (idx) => {
    console.log('select floor:', idx)
    if (idx) {
      const floor = this.props.floorList.find(floor => floor.idx === idx && floor.service_type === this.props.currBuildingServiceType);
      if (floor) {  // 설정된 floor index 에 해당하는 floor 정보가 있으면
        let image_path = floor.map_image;
        if (!floor.map_image.includes('http://')) {
          image_path = `http://${this.context.websocket_url}/images/floorplan/${floor.map_image}`;
        }
        this.props.changeMapType(2, this.props.currBuildingIdx, floor.idx, this.props.currBuildingServiceType);
        this.setState({
          //currFloorIdx: idx,
          bgImage: image_path,
        });
      }
    }
  }

  handleChangeCamera = (e) => {
    this.setState({ modalCurrentCamera: e.currentTarget.value });
  }

  handleChangeDoor = (e) => {
    this.setState({ modalCurrentDoor: e.currentTarget.value });
  }

  handleChangeBreathSensor = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleChangeCameraDoor = (e) => {
    this.setState({ modalCurrentCameraDoor: e.currentTarget.value });
  }

  handleChangeCameraBreathSensor = (e) => {
    this.setState({ modalCurrentCameraBreathSensor: e.currentTarget.value });
  }

  componentDidMount() {
    this.imageGoToGmap = new window.Image();
    this.imageGoToGmap.src = iconGoToGmap;
    this.imageGoToGmap.addEventListener('load', this.handleLoad);

    this.imageEbellNormal = new window.Image();
    this.imageEbellNormal.src = iconEbellNormal;
    this.imageEbellNormal.width = 40;
    this.imageEbellNormal.height = 40;
    this.imageEbellNormal.addEventListener('load', this.handleLoad2);

    this.imageEbellEvent = new window.Image();
    this.imageEbellEvent.src = iconEbellEvent;
    this.imageEbellEvent.width = 40;
    this.imageEbellEvent.height = 40;
    this.imageEbellEvent.addEventListener('load', this.handleLoad2_1);

    this.imageCamera = new window.Image();
    this.imageCamera.src = iconCamera;
    this.imageCamera.width = 40;
    this.imageCamera.height = 40;
    this.imageCamera.addEventListener('load', this.handleLoad3);

    this.imageCameraEvent = new window.Image();
    this.imageCameraEvent.src = iconCameraEvent;
    this.imageCameraEvent.width = 40;
    this.imageCameraEvent.height = 40;
    this.imageCameraEvent.addEventListener('load', this.handleLoad4);

    this.imageDoor = new window.Image();
    this.imageDoor.src = iconDoor;
    this.imageDoor.width = 40;
    this.imageDoor.height = 40;
    this.imageDoor.addEventListener('load', this.handleLoad5);

    this.imageDoorEvent = new window.Image();
    this.imageDoorEvent.src = iconDoorEvent;
    this.imageDoorEvent.width = 40;
    this.imageDoorEvent.height = 40;
    this.imageDoorEvent.addEventListener('load', this.handleLoad6);

    this.imageBreathSensor = new window.Image();
    this.imageBreathSensor.src = iconBreathSensor;
    this.imageBreathSensor.width = 40;
    this.imageBreathSensor.height = 40;
    this.imageBreathSensor.addEventListener('load', this.handleLoad7);

    this.imageBreathSensorEvent = new window.Image();
    this.imageBreathSensorEvent.src = iconBreathSensorEvent;
    this.imageBreathSensorEvent.width = 40;
    this.imageBreathSensorEvent.height = 40;
    this.imageBreathSensorEvent.addEventListener('load', this.handleLoad8);

    if (this.props.currBuildingIdx && this.props.currFloorIdx && this.props.currBuildingServiceType) {
      if (this.props.floorList && this.props.floorList.length > 0) {
        const floor = this.props.floorList.find(floor => (floor.building_idx === this.props.currBuildingIdx && floor.idx === this.props.currFloorIdx && floor.service_type === this.props.currBuildingServiceType));
        if (floor) {
          let image_path = floor.map_image;
          if (!floor.map_image.includes('http://')) {
            image_path = `http://${this.context.websocket_url}/images/floorplan/${floor.map_image}`;
          }
          this.setState({
            //currFloorIdx: floor.idx,
            bgImage: image_path,
          });
        }
      }
    }
  }

  // static getDerivedStateFromProps(props, state) {
  // }

  componentDidUpdate(prevProps) {
    if (this.props.currBuildingIdx !== prevProps.currBuildingIdx ||
      this.props.currFloorIdx !== prevProps.currFloorIdx ||
      this.props.currBuildingServiceType !== prevProps.currBuildingServiceType ||
      this.props.floorList.length !== prevProps.floorList.length ||
      this.props.deviceList.length !== prevProps.deviceList.length) {

      if (this.props.currBuildingIdx && this.props.currBuildingServiceType && this.props.currFloorIdx) {
        if (this.props.floorList && this.props.floorList.length > 0) {
          const floor = this.props.floorList.find(floor => (floor.building_idx === this.props.currBuildingIdx && floor.idx === this.props.currFloorIdx && floor.service_type === this.props.currBuildingServiceType));
          if (floor) {
            let image_path = floor.map_image;
            if (!floor.map_image.includes('http://')) {
              image_path = `http://${this.context.websocket_url}/images/floorplan/${floor.map_image}`;
            }
            // if (this.state.currFloorIdx !== floor.idx ||
            //     this.state.bgImage !== image_path) {
            this.setState({
              //  currFloorIdx: floor.idx,
              bgImage: image_path,
            });
            //}
          }
        }
        this.handleCloseContext();
      }
    }

    if (this.props.accessControlEnter !== prevProps.accessControlEnter) {
      this.props.accessControlEnter.map(enter => {
        const doorId = enter.LogDoorID;
        const personId = enter.LogPersonID;
        const popup = document.getElementsByClassName('door' + doorId);
        if (popup && popup.length > 0 && personId && personId.length > 0) {
          const element = popup[0];
          element.childNodes[0].src = `http://${this.context.websocket_url}/images/access_control_person/${personId}.png`;
          console.log('element:', element.childNodes[0].attributes[0]);
          popup[0].style.display = 'initial';
          const timeoutId = setTimeout(() => {
            popup[0].style.display = 'none';
          }, 10 * 1000);
        }
      });

    }

    if (this.props.respiration !== prevProps.respiration) {
      console.log('respiration:', this.props.respiration);
    }

    if (this.props.eventPopup.timestamp != 0 &&
      this.props.eventPopup.timestamp !== prevProps.eventPopup.timestamp) {
      console.log('eventPopup:', this.props.eventPopup.timestamp);
      const findDevice = this.props.deviceList.find((device) => (device.id === this.props.eventPopup.deviceId && device.service_type === this.props.eventPopup.serviceType));
      if (findDevice) {
        const evt = {
          target: {
            attrs: {
              name: this.props.eventPopup.deviceType + 'icon',
              id: findDevice.idx,
              service_type: this.props.eventPopup.serviceType,
            }
          },
          evt: {
            button: 0,
            clientY: parseInt(findDevice.longitude) + 173,
            clientX: parseInt(findDevice.latitude) + 443,
          }
        }
        this.showDevicePopup(evt);
      }
    }

    // konva 에 이미지, 이름레이블, 텍스트 이미지 보정
    const layers = this.refStage.current.getLayers();
    if (layers && layers.length > 0) {
      const layer = layers[0];
      //console.log('layer:', layer);

      let lastRect;
      let lastImage;
      layer.find(node => {
        //console.log('shape:', node);
        //const type = node.getType();
        //console.log('node type:', node.getClassName());
        if (node.getClassName() === 'Image') {
          lastImage = node;
          if (node.getWidth() && node.getHeight()) {
            node.offsetX(node.getWidth() / 2);
            node.offsetY(node.getHeight() / 2);
          }
        }
        if (node.getClassName() === 'Rect') {
          lastRect = node;
        }
        if (node.getClassName() === 'Text') {
          //console.log('text width:', node.getWidth());
          if (node.getWidth() && node.getHeight()) {
            node.offsetX(node.getWidth() / 2);
            node.offsetY(-25);
            if (lastRect) {
              lastRect.setWidth(node.getWidth() + 4);
              lastRect.setHeight(node.getHeight() + 2);
              lastRect.offsetX(lastRect.getWidth() / 2);
              lastRect.offsetY(-24);
            }
          }
        }
        return node;
      });
    }
  }

  handleClickNothing = (e) => {
    e.preventDefault();
    console.log('e:', e);
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
  }

  handleShowModalAddCamera = async () => {
    console.log('clicked add device');
    // 카메라 추가 모달 보이기
    this.setState({
      modalCameraShow: true,
      modalCameraMode: 'add'
    });
    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleShowModalAddDoor = async () => {
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

  handleWheelStage = (e) => {
    e.evt.preventDefault();
    console.log('wheel:', e);
    const oldScale = this.refStage.current.scaleX();
    const newScale = e.evt.deltaY > 0 ? oldScale / 1.05 : oldScale * 1.05;
    this.refStage.current.scale({ x: newScale, y: newScale });

    const pointer = this.refStage.current.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - this.refStage.current.x()) / oldScale,
      y: (pointer.y - this.refStage.current.y()) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    };
    this.refStage.current.position(newPos);
  }

  handleShowAddContext = (e) => {
    console.log('showAddContext:', e);
    console.log('target:', e.target.getType());
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
        if((e.evt.clientX > 450 && e.evt.clientX < 1264 && e.evt.clientY > 170 && e.evt.clientY < 946) && !(e.evt.clientX < 547 && e.evt.clientY < 257)) {
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY + 2 + 'px';
          menu[0].style.left = e.evt.clientX + 2 + 'px';
        } else if(e.evt.clientX >= 1265 && e.evt.clientX < 1433 && e.evt.clientY >= 946 && e.evt.clientY < 1049){
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY - 122 + 'px';
          menu[0].style.left = e.evt.clientX - 189 + 'px';
        } else if(e.evt.clientX < 1264 && e.evt.clientY >= 946 && e.evt.clientY < 1049) {
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY - 122 + 'px';
          menu[0].style.left = e.evt.clientX + 2 + 'px';
        } else if((e.evt.clientY > 170 && e.evt.clientY < 1049 && e.evt.clientX >= 1265 && e.evt.clientX < 1433) && !(e.evt.clientX > 1350 && e.evt.clientY < 243)) {
          menu[0].style.display = 'initial';
          menu[0].style.top = e.evt.clientY + 2 + 'px';
          menu[0].style.left = e.evt.clientX - 189 + 'px';
        }
      }
    }
  }

  handleShowModifyDeleteContext = (e) => {
    console.log('showModifyDeleteContext:', e);
    console.log('target:', e.target.getType());
    e.evt.preventDefault();
    const popup = document.getElementsByClassName('ol-indoor-popup');
    for (let i = 0; i < popup.length; i++) {
      popup[i].classList.remove('active');
    }
    const ebell_popup = document.getElementsByClassName(this.state.videoPresence ? 'ol-indoor-ebell-popup' : 'ol-indoor-ebell-popup-noVideo');
    for (let i = 0; i < ebell_popup.length; i++) {
      ebell_popup[i].classList.remove('active');
    }
    const door_popup = document.getElementsByClassName(this.state.videoPresence ? 'ol-indoor-door-popup' : 'ol-indoor-door-popup-noVideo');
    for (let i = 0; i < door_popup.length; i++) {
      door_popup[i].classList.remove('active');
    }
    const breathSensor_popup = document.getElementsByClassName(this.state.videoPresence ? 'ol-indoor-breathSensor-popup' : 'ol-indoor-breathSensor-popup-noVideo');
    for (let i = 0; i < breathSensor_popup.length; i++) {
      breathSensor_popup[i].classList.remove('active');
    }
    this.setState({
      selectedShape: {
        type: e.target.attrs.name,
        id: e.target.attrs.id,
        device_id: e.target.attrs.device_id,
        device_name: e.target.attrs.device_name,
        device_type: e.target.attrs.device_type,
        service_type: e.target.attrs.service_type,
      }
    });

    // 마우스 클릭위치에 contextmenu 표시
    let menu;
    if (e.target.attrs.name === 'ebellicon') {
      if (this.state.selectedShape2 && this.state.selectedShape2.id === e.target.attrs.device_id) {
        this.handleCloseEbellPopup();
      }
      menu = document.getElementsByClassName('menu-ebell');
      for (let i = 0; i < menu.length; i++) {
        menu[i].classList.add('active');
      }
      if (menu.length > 0 && menu[0] && menu[0].style) {
        if (menu.length > 0 && menu[0] && menu[0].style) {
          if((e.evt.clientX < 1264 && e.evt.clientY < 1019)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if(e.evt.clientX >= 1265 && e.evt.clientY >= 1019){
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 42 + 'px';
            menu[0].style.left = e.evt.clientX - 189 + 'px';
          } else if(e.evt.clientX < 1264 && e.evt.clientY >= 1019) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 42 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if((e.evt.clientY < 1019 && e.evt.clientX >= 1265)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX - 189 + 'px';
          }
        }
      }
    } else if (e.target.attrs.name === 'cameraicon') {
      if (this.state.selectedShape.id === e.target.attrs.id) {
        this.handleClosePopup(undefined, false);
      }
      console.log('카메라 아이콘 우클릭: ', e.evt.clientX, e.evt.clientY)
      menu = document.getElementsByClassName('menu-camera');
      for (let i = 0; i < menu.length; i++) {
        menu[i].classList.add('active');
      }
      if (menu.length > 0 && menu[0] && menu[0].style) {
        if (menu.length > 0 && menu[0] && menu[0].style) {
          if((e.evt.clientX < 1264 && e.evt.clientY < 984)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if(e.evt.clientX >= 1265 && e.evt.clientY >= 984){
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 78 + 'px';
            menu[0].style.left = e.evt.clientX - 189 + 'px';
          } else if(e.evt.clientX < 1264 && e.evt.clientY >= 984) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 78 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if((e.evt.clientY < 984 && e.evt.clientX >= 1265)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX - 189 + 'px';
          }
        }
      }
    } else if (e.target.attrs.name === 'dooricon') {
      if (this.state.selectedShape3 && this.state.selectedShape3.id === e.target.attrs.id) {
        this.handleCloseDoorPopup();
      }
      menu = document.getElementsByClassName('menu-door');
      for (let i = 0; i < menu.length; i++) {
        menu[i].classList.add('active');
      }
      if (menu.length > 0 && menu[0] && menu[0].style) {
        if (menu.length > 0 && menu[0] && menu[0].style) {
          if((e.evt.clientX < 1254 && e.evt.clientY < 733.5)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if(e.evt.clientX >= 1255 && e.evt.clientY >= 733.5){
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 334.5 + 'px';
            menu[0].style.left = e.evt.clientX - 199 + 'px';
          } else if(e.evt.clientX < 1254 && e.evt.clientY >= 733.5) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 334.5 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if((e.evt.clientY < 733.5 && e.evt.clientX >= 1255)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX - 199 + 'px';
          }
        }
      }
    } else if (e.target.attrs.name === 'breathSensoricon') {
      if (this.state.selectedShape4 && this.state.selectedShape4.id === e.target.attrs.id) {
        this.handleCloseBreathSensorPopup();
      }
      menu = document.getElementsByClassName('menu-breathSensor');
      for (let i = 0; i < menu.length; i++) {
        menu[i].classList.add('active');
      }
      if (menu.length > 0 && menu[0] && menu[0].style) {
        if (menu.length > 0 && menu[0] && menu[0].style) {
          if((e.evt.clientX < 1254 && e.evt.clientY < 946)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if(e.evt.clientX >= 1255 && e.evt.clientY >= 946){
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 122 + 'px';
            menu[0].style.left = e.evt.clientX - 199 + 'px';
          } else if(e.evt.clientX < 1254 && e.evt.clientY >= 946) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY - 122 + 'px';
            menu[0].style.left = e.evt.clientX + 2 + 'px';
          } else if((e.evt.clientY < 946 && e.evt.clientX >= 1255)) {
            menu[0].style.display = 'initial';
            menu[0].style.top = e.evt.clientY + 2 + 'px';
            menu[0].style.left = e.evt.clientX - 199 + 'px';
          }
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
      modalCameraWarn: ''
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
    });
  }

  handleCloseModalCameraBreathSensor = () => {
    this.setState({
      modalCameraBreathSensorShow: false,
      modalCameraBreathSensorFloorIdx: '',
      modalCameraBreathSensorLatitude: '',
      modalCameraBreathSensorLongitude: '',
      modalCameraBreathSensorWarn: '',
    });
  }

  handleCloseModalDoorLog = () => {
    this.setState({
      modalDoorLogShow: false,
    });
  }

  handleCloseModalDoorRec = () => {
    this.setState({
      modalDoorRecShow: false,
      modalCameraDoorRecWarn: '',
      modaldoorRecSrcFormat: false,
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
        buildingIdx: this.props.currBuildingIdx,
        buildingServiceType: this.props.currBuildingServiceType,
        floorIdx: this.props.currFloorIdx
      });

      console.log('put device:', res);
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
    });
  }

  handleAddMapDoor = async (e) => {
    console.log('this.state.selectedShape >>> ', this.state.selectedShape);
    e.preventDefault();
    if (this.state.modalCurrentDoor === undefined) {
      this.setState({ modalDoorWarn: '출입문을 선택하세요.' });
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

      console.log('put device:', res);
      // 모달창 닫기
      this.handleCloseModalDoor();

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

  handleAddMapCameraDoor = async (e) => {
    e.preventDefault();
    const doorCheck = this.props.deviceList.find((door) => this.state.selectedShape.device_id === door.id);
    if (this.state.modalCurrentCameraDoor === undefined) {
      this.setState({ modalCameraDoorWarn: '*카메라를 선택하세요.' });
      return
    }
    if (this.state.selectedShape && (this.state.modalCurrentCameraDoor === (doorCheck && doorCheck.camera_id))) {
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
        console.log('put device:', res);
        this.handleCloseModalDoor();
      } else {

        const res = await axios.put('/api/observer/cameraForDoor', {
          id: this.state.selectedShape.device_id,
          cameraId: '',
          service_type: 'accesscontrol'
        });
        console.log('put device:', res);
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
    e.preventDefault();
    const breathCheck = this.props.deviceList.find((breath) => this.state.selectedShape.device_id === breath.id);
    if (this.state.modalCurrentCameraBreathSensor === undefined) {
      this.setState({ modalCameraDoorWarn: '*카메라를 선택하세요.' });
      return
    }
    if (this.state.selectedShape && (this.state.modalCurrentCameraBreathSensor === (breathCheck && breathCheck.camera_id))) {
      this.setState({ modalCameraDoorWarn: '*현재 등록된 카메라 입니다.' });
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
        console.log('put device:', res);
        this.handleCloseModalBreathSensor();
      } else {

        const res = await axios.put('/api/observer/cameraForBreathSensor', {
          id: this.state.selectedShape.device_id,
          cameraId: '',
          service_type: this.state.selectedShape.service_type,
          type: 'breathSensor'
        });
        console.log('put device:', res);
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

  handleAddMapDoorRec = async (e) => {
    e.preventDefault();
    const doorCamera = this.props.deviceList.find((door) => this.state.selectedShape && door.id === this.state.selectedShape.device_id);
    console.log('doorCamera >>> ', doorCamera);
    this.handleDoorRec()
    // const deviceEvent = this.props.accessControlLog.find((access) => this.state.selectedShape && access.LogDoorName === this.state.selectedShape.device_name);
    // const eventRec = this.props.accessControlLog.find((access) => this.state.selectedShape && (access.LogDoorName === this.state.selectedShape.device_name)
    //   && (access.LogStatusName !== '출입승인'));
    //   console.log('eventRec > > > ',eventRec, 'this.state.selectedShape.device_name >>  >', this.state.selectedShape.device_name);
    // // if (eventRec === undefined) {
    // //   this.setState({
    // //     modalCameraDoorRecWarn: '해당 출입문에 발생한 이벤트가 없습니다.',
    // //     modaldoorRecSrcFormat: 'noEvent',
    // //   });
    // //   return
    // // } else if (eventRec && !doorCamera.camera_id) {
    // //   this.setState({
    // //     modalCameraDoorRecWarn: '이벤트는 존재하나 연동된 카메라가 없습니다.',
    // //     modaldoorRecSrcFormat: 'noCamera',
    // //   });
    // //   return
    // // }
    // let eventTime;
    // if(eventRec){
    //   eventTime = eventRec.LogDate + 'T' + eventRec.LogTime;


    // const dateStr = eventTime.substring(0, 4) + '-' + eventTime.substring(4, 6) + '-' + eventTime.substring(6, 8) + ' ' + eventTime.substring(9, 11) + ':' + eventTime.substring(11, 13) + ':' + eventTime.substring(13, 15);
    // const dateOjb2 = addHours(new Date(dateStr), -9);
    // const dateOjb = addSeconds(new Date(dateOjb2), -10);
    // eventTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');
    try {
      if (doorCamera) {
        const res = await axios.get('/api/observer/accessEventRec', {
          params: {
            cameraId: doorCamera.camera_id,
            deviceName: encodeURIComponent(this.state.selectedShape.device_name),
            // eventTime
          }
        });
        console.log('door rec video src:', res);
        this.setState({
          modaldoorRecSrc: res.data.result.pathUrl,
          modaldoorRecSrcFormat: res.data.result.formatMark
        });
      }
    } catch (err) {
      console.log(err);
      return;
    }
    // }
    // try {
    //   if(doorCamera) {
    //     const res = await axios.get('/api/observer/eventRecData', {
    //       params: {
    //         cameraId: doorCamera.camera_id,
    //         eventStartTime: eventTime,
    //       }
    //     });
    //     console.log('door rec video src:', res);
    //     this.setState({ 
    //       modaldoorRecSrc: res.data.result.pathUrl,
    //       modaldoorRecSrcFormat: res.data.result.formatMark
    //     });
    //   }
    // } catch (err) {
    //   console.log(err);
    //   return;
    // }
  }

  handleAddMapBreathSensor = async (e) => {
    e.preventDefault();
    console.log('this.state.selectedShape >>> ', this.state.selectedShape);
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
    if(breathSensorSameNameCheck){
      this.setState({ modalBreathSensorWarn: '*동일한 이름의 호흡감지센서가 있습니다.' });
      return
    }
    // 입력값 검사
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


    try {
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
      });

      // if(this.state.modalCurrentBreathSensor !== '선택 해제' && this.state.modalCurrentBreathSensor !== '없음') {
      //   const cameraId = this.state.modalCurrentBreathSensor.replace('.카메라', '');
      //   const res = await axios.put('/api/observer/cameraForDoor', {
      //     id: this.state.selectedShape.device_id,
      //     cameraId,
      //     service_type: 'accesscontrol'
      //   });
      //   console.log('put device:', res);
      //   this.handleCloseModalDoor();
      // } else {
      //   const res = await axios.put('/api/observer/cameraForDoor', {
      //     id: this.state.selectedShape.device_id,
      //     cameraId: '',
      //     service_type: 'accesscontrol'
      //   });
      //   console.log('put device:', res);
      //   this.handleCloseModalDoor();
      // }
    } catch (err) {
      console.log(err);
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
    });
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
      console.log('오류 - 선택된 shape 가 없습니다.');
      return;
    }

    try {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '카메라 삭제',
        modalConfirmMessage: '[ ' + this.state.selectedShape.device_id + '.' + this.state.selectedShape.device_name + ' ] 카메라를 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: this.state.selectedShape.id,
        modalConfirmServiceType: this.state.selectedShape.service_type,
      });

      // const res = await axios.put('/api/observer/camera', {
      //   id: this.state.selectedShape.id,
      //   service_type: this.state.selectedShape.service_type,
      // });
      // console.log('put mapCamera:', res);
      // if(res.data.message === 'ok'){
      //   this.handleClosePopup(e);
      // }

    } catch (e) {
      console.log('err:', e);
    }

    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleRemoveDoor = async (e) => {
    if (this.state.selectedShape === undefined) {
      console.log('오류 - 선택된 shape 가 없습니다.');
      return;
    }

    try {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '출입문 삭제',
        modalConfirmMessage: '[ ' + this.state.selectedShape.device_id + '.' + this.state.selectedShape.device_name + ' ] 출입문을 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: this.state.selectedShape.id,
        modalConfirmServiceType: this.state.selectedShape.service_type,
      });

      // const res = await axios.put('/api/observer/camera', {
      //   id: this.state.selectedShape.id,
      //   service_type: this.state.selectedShape.service_type,
      // });
      // console.log('put mapCamera:', res);
      // if(res.data.message === 'ok'){
      //   this.handleClosePopup(e);
      // }

    } catch (e) {
      console.log('err:', e);
    }

    // 선택된 shape 초기화
    this.setState({ selectedShape: undefined });

    // 팝업창 닫기
    this.handleCloseContext();
  }

  handleRemoveBreathSensor = async (e) => {
    if (this.state.selectedShape === undefined) {
      console.log('오류 - 선택된 shape 가 없습니다.');
      return;
    }

    try {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '호흡감지센서 삭제',
        // modalConfirmMessage: '[ ' + this.state.selectedShape.device_id + '.' + this.state.selectedShape.device_name + ' ] 호흡감지센서를 삭제하시겠습니까?',
        modalConfirmMessage: '[ ' + this.state.selectedShape.device_name + ' ] 호흡감지센서를 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: this.state.selectedShape.id,
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
    this.handleCloseContext();
  }

  // 출입문 출입기록 보기
  handleDoorLog = async (e) => {
    this.props.handleShowInquiryModal(e, 'accessCtlLog');
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
      const id = this.state.selectedShape.id;
      const doorId = this.state.selectedShape.device_id;
      if (id) {
        const prefix = id.substring(0, id.length - 2);
        const controlId = prefix.padStart(3, '0');
        console.log('controlId:', controlId);
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
      const id = this.state.selectedShape.id;
      const doorId = this.state.selectedShape.device_id;
      if (id) {
        const prefix = id.substring(0, id.length - 2);
        const controlId = prefix.padStart(3, '0');
        console.log('controlId:', controlId);
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
      const id = this.state.selectedShape.id;
      const doorId = this.state.selectedShape.device_id;
      if (id) {
        const prefix = id.substring(0, id.length - 2);
        const controlId = prefix.padStart(3, '0');
        console.log('controlId:', controlId);
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

  handleDelCancel = async (e) => {
    console.log('confirm modal: cancel');

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
    console.log('confirm modal: confirm');
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

        console.log('del guardianlite:', res);
      } else if (this.state.modalConfirmTitle.indexOf('카메라 삭제') >= 0) {
        // 카메라 삭제 REST API 호출
        const res = await axios.put('/api/observer/camera', {
          id: this.state.modalConfirmIdx,
          service_type: this.state.modalConfirmServiceType,
        });
        console.log('put camera result:', res);
      } else if (this.state.modalConfirmTitle.indexOf('출입문 삭제') >= 0) {
        // 출입문 삭제 REST API 호출
        const res = await axios.put('/api/observer/door', {
          id: this.state.modalConfirmIdx,
          service_type: this.state.modalConfirmServiceType,
        });
        console.log('put door result:', res);
      } else if (this.state.modalConfirmTitle.indexOf('호흡감지센서 삭제') >= 0) {
        // 호흡감지센서 삭제 REST API 호출
        console.log(this.state.modalConfirmIdx, this.state.modalConfirmServiceType)
        const res = await axios.delete('/api/observer/breathSensor', {
          params: {
            id: this.state.modalConfirmIdx,
            service_type: this.state.modalConfirmServiceType,
          }
        });
        console.log('put door result:', res);
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
                onClick={() => this.props.changeMapType(2, this.props.currBuildingIdx, floor.idx, this.props.currBuildingServiceType)}
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

  floorListRender = () => {
    const floors = this.props.floorList && this.props.floorList.filter((floor) => {
      if (floor.building_idx === this.props.currBuildingIdx && floor.service_type === this.props.currBuildingServiceType) {
        return true;
      } else {
        return false;
      }
    });

    if (floors) {
      return floors.map((floor, index) => {
        return (
          <div key={'floor:' + floor.idx}>
            <Rect
              fill='#ffb74d'
              shadowBlur={2}
              x={20}
              y={20 + (16 * index)}
              width={20}
              height={20}
              onClick={() => this.handleSelectFloor(floor.idx)}
            />
            <Text
              key={'floor:' + floor.idx}
              id={floor.idx.toString()}
              name={floor.name}
              x={22}
              y={20 + (16 * index)}
              fontFamily='돋움체'
              text={floor.name}
              fill='white'
              fontSize={15}
            />
          </div>
        );
      });
    } else {
      return null;
    }
  }

  handleAcknowledgeAllEvent = () => {
    this.setState({ showAlert: !this.state.showAlert });
    this.props.setAcknowledge(this.state.device_id, this.state.device_type, this.state.service_type);
  }

  handleCloseAlert = async () => {
    this.setState({ showAlert: !this.state.showAlert });
    this.setState({ device_id: undefined });
    this.setState({ device_type: undefined });
    this.setState({ service_type: undefined });
  }

  handleConfirmAllEvent = async () => {

    if (this.state.selectedShape === undefined) {
      console.log('오류 - 선택된 shape 가 없습니다.');
      return;
    }

    this.setState({ showAlert: !this.state.showAlert });
    this.setState({ device_id: this.state.selectedShape.device_id });
    this.setState({ device_type: this.state.selectedShape.device_type });
    this.setState({ service_type: this.state.selectedShape.service_type });

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

      if (doors.length > 0) {
        return doors.map((door, index) => {
          const divStyle = {
            position: 'absolute',
            top: parseInt(door.longitude) + 60,
            left: parseInt(door.latitude) + 410,
            border: '2px solid black',
            display: 'none',
            animation: 'bounce_frames 0.5s',
            animationDirection: 'alternate',
            animationTimingFunction: 'cubic-bezier(.5, 0.05,1,.5)',
            animationIterationCount: 4
          }
          return (
            <div className={'door' + door.id} style={divStyle}>
              <img src={`http://${this.context.websocket_url}/images/access_control_person/${'1.png'}`} style={{ height: '90px', width: '80px' }} />
            </div>
            // <div key={'g' + index} >
            //   <span>aaaa</span>
            //   <img src={`http://${this.context.websocket_url}/images/access_control_person/${'1.png'}`} />
            // </div>
          );
        });
      } else {
        return (<div>aaa222</div>);
      }
    }
  }

  setBreathValue = () => {
    setInterval(async () => {
      let copyData = [];
      let copyLabel = [];
      try {
        // x축 시간
        // const date = new Date();
        // let formatDate = format(date, 'mm:ss');
        this.setState({
          breathValue: this.props.respiration,
          xGraphTime: ''
        })
      }
      catch (error) {
        console.log(error);
      }
      copyLabel = [...this.state.dataArr.labels];
      copyData = [...this.state.dataArr.datasets[0].data];
      copyData.push(this.state.breathValue);
      copyLabel.push(String(''));
      // copyLabel = ['1', '2', '3', '4', '5']
      if (copyData.length >= 60) {
        copyData.shift();
        copyLabel.shift();
      }
      const newDataArr = {
        labels: copyLabel,
        datasets: [
          {
            label: '호흡감지센서 수치',
            data: copyData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 0.3,
          }
        ]
      }
      this.setState({
        dataArr: newDataArr
      });
    }, 3000);
  }

  breathGraph = () => {
    const options = {
      animation: {
        animateScale: false,
        animateRotate: false
      },
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
        <Line data={this.state.dataArr} options={options} />
    );
  }

  render() {
    const sortedCameraList = this.props.cameraList.sort((a, b) => a.cameraid > b.cameraid ? 1 : -1);
    const doorCamera = this.props.deviceList.find((door) => this.state.selectedShape && door.id === this.state.selectedShape.device_id);
    
    return (
      <div className="gcanvas"
        style={{ backgroundImage: `url(${this.state.bgImage})` }}
      >
        <Stage
          ref={this.refStage}
          className='stage'
          onContextMenu={this.handleShowAddContext}
          onClick={this.handleCloseContext}
          //onWheel={this.handleWheelStage}
          //width={window.innerWidth}
          width={document.getElementsByClassName('gcanvas').length > 0 ? document.getElementsByClassName('gcanvas')[0].offsetWidth : 100}
          //width={100}
          height={document.getElementsByClassName('gcanvas').length > 0 ? document.getElementsByClassName('gcanvas')[0].offsetHeight : 100}
        //height={100}
        //draggable={true}
        >

          <Layer>
            {/* 층목록 */}
            {/* <Text
              key={'층목록테스트'}
              text={'층목록테스트'}
              fontSize={15}
              fontFamily='돋움체'
              fill='white'
              x={45}
              y={10}
            /> */}
            {/* {this.floorListRender()} */}

            {/* 실외지도 바로가기 버튼
            <Image
              //key='gotogmap'
              //name='gotogmap'
              //id='gotogmap'
              x={document.getElementsByClassName('gcanvas').length>0?document.getElementsByClassName('gcanvas')[0].offsetWidth - 50:100}
              //x={100}
              y={10}
              image={this.state.imageGoToGmap}
              width={40}
              height={40}
              onClick={this.handleGoToGmap}
            /> */}
            {/* 비상벨 아이콘 그리기 */}
            {this.props.currFloorIdx && this.props.deviceList.map(device => {
              if (parseInt(device.floor_idx) === this.props.currFloorIdx &&
                device.service_type === this.props.currBuildingServiceType &&
                device.latitude && device.longitude) {
                return (
                  <>
                    <Image
                      key={device.idx}
                      id={device.idx.toString()}
                      device_id={device.id}
                      service_type={device.service_type}
                      device_type={device.type}
                      ipaddress={device.ipaddress}
                      name={'ebellicon'}
                      x={parseInt(device.latitude)}
                      y={parseInt(device.longitude)}
                      image={((device.status === 1 || device.status === '1') && this.state.blinker === true) ? this.state.imageEbellEvent : this.state.imageEbellNormal}
                      onContextMenu={this.handleShowModifyDeleteContext}
                      //onMouseOver={this.handleMouseOver}
                      //onMouseOut={this.handleMouseOut}
                      onClick={(e) => this.showDevicePopup(e, true)}
                    //onDragEnd={(e)=>this.handleDragEndEbell(e, device.idx)}
                    //onDragStart={(e)=>this.handleDragStart(e, device.idx)}
                    //onDragMove={(e) => this.handleDragMove(e, device.idx)}
                    //draggable={this.state.shapeDrag}
                    >
                    </Image>
                    <Rect
                      fill='#ffb74d'
                      shadowBlur={2}
                      x={parseInt(device.latitude)}
                      y={parseInt(device.longitude)}
                      width={50}
                      height={18}
                    />
                    <Text
                      text={device.name}
                      fontSize={15}
                      fontFamily='돋움체'
                      x={parseInt(device.latitude)}
                      y={parseInt(device.longitude)}
                    />
                  </>
                );
              }
              return null;
            })}
            {/* 카메라 아이콘 그리기 */}
            {this.props.currBuildingIdx &&
              this.props.currBuildingServiceType &&
              this.props.currFloorIdx &&
              this.props.cameraList.map(camera => {
                if (parseInt(camera.building_idx) === this.props.currBuildingIdx &&
                  camera.building_service_type === this.props.currBuildingServiceType &&
                  parseInt(camera.floor_idx) === this.props.currFloorIdx &&
                  camera.latitude && camera.longitude) {
                  return (
                    <>
                      <Image
                        key={camera.cameraid}
                        id={camera.cameraid.toString()}
                        device_id={camera.cameraid}
                        name={'cameraicon'}
                        device_name={camera.cameraname}
                        device_type={'camera'}
                        x={parseInt(camera.latitude)}
                        y={parseInt(camera.longitude)}
                        service_type={camera.service_type}
                        image={((camera.status === 1 || camera.status === '1') && this.state.blinker === true) ? this.state.imageCameraEvent : this.state.imageCamera}
                        onContextMenu={this.handleShowModifyDeleteContext}
                        //onMouseOver={this.handleMouseOver}
                        //onMouseOut={this.handleMouseOut}
                        onClick={(e) => this.showDevicePopup(e, true)}
                      //onDragEnd={(e)=>this.handleDragEndEbell(e, device.idx)}
                      //onDragStart={(e)=>this.handleDragStart(e, device.idx)}
                      //onDragMove={(e) => this.handleDragMove(e, device.idx)}
                      //draggable={this.state.shapeDrag}
                      >
                      </Image>
                      <Rect
                        fill='#ffb74d'
                        shadowBlur={2}
                        x={parseInt(camera.latitude)}
                        y={parseInt(camera.longitude)}
                        width={2}
                        height={2}
                      />
                      <Text
                        text={camera.cameraid + '.' + camera.cameraname}
                        fontSize={15}
                        fontFamily='돋움체'
                        x={parseInt(camera.latitude)}
                        y={parseInt(camera.longitude)}
                      />
                    </>
                  );
                }
                return null;
              })}

            {/* 출입문 아이콘 그리기 */}
            {this.props.currBuildingIdx &&
              this.props.currBuildingServiceType &&
              this.props.currFloorIdx &&
              this.props.deviceList.map(door => {
                if (parseInt(door.building_idx) === this.props.currBuildingIdx &&
                  door.building_service_type === this.props.currBuildingServiceType &&
                  parseInt(door.floor_idx) === this.props.currFloorIdx &&
                  door.type === 'door' &&
                  door.latitude && door.longitude) {
                  return (
                    <>
                      <Image
                        key={door.id}
                        id={door.idx.toString()}
                        device_id={door.id}
                        name={'dooricon'}
                        device_name={door.name}
                        device_type={'door'}
                        x={parseInt(door.latitude)}
                        y={parseInt(door.longitude)}
                        service_type={door.service_type}
                        image={((door.status === 1 || door.status === '1' || door.status === 11 || door.status === '11' || door.status === 111 || door.status === '111' || door.status === 101 || door.status === '101') && this.state.blinker === true) ? this.state.imageDoorEvent : this.state.imageDoor}
                        onContextMenu={this.handleShowModifyDeleteContext}
                        //onMouseOver={this.handleMouseOver}
                        //onMouseOut={this.handleMouseOut}
                        onClick={(e) => this.showDevicePopup(e, true)}
                      //onDragEnd={(e)=>this.handleDragEndEbell(e, device.idx)}
                      //onDragStart={(e)=>this.handleDragStart(e, device.idx)}
                      //onDragMove={(e) => this.handleDragMove(e, device.idx)}
                      //draggable={this.state.shapeDrag}
                      >
                      </Image>
                      <Rect
                        fill='#ffb74d'
                        shadowBlur={2}
                        x={parseInt(door.latitude)}
                        y={parseInt(door.longitude)}
                        width={2}
                        height={2}
                      />
                      <Text
                        text={door.name}
                        fontSize={15}
                        fontFamily='돋움체'
                        x={parseInt(door.latitude)}
                        y={parseInt(door.longitude)}
                      />
                    </>
                  );
                }
                return null;
              })}

            {/* 호흡센서 아이콘 그리기 */}
            {this.props.currBuildingIdx &&
              this.props.currBuildingServiceType &&
              this.props.currFloorIdx &&
              this.props.deviceList.map(breathSensor => {
                if (parseInt(breathSensor.building_idx) === this.props.currBuildingIdx &&
                  breathSensor.building_service_type === this.props.currBuildingServiceType &&
                  parseInt(breathSensor.floor_idx) === this.props.currFloorIdx &&
                  breathSensor.type === 'breathSensor' &&
                  breathSensor.latitude && breathSensor.longitude) {
                  return (
                    <>
                      <Image
                        key={breathSensor.id}
                        id={breathSensor.idx.toString()}
                        device_id={breathSensor.id}
                        name={'breathSensoricon'}
                        device_name={breathSensor.name}
                        device_type={'breath'}
                        x={parseInt(breathSensor.latitude)}
                        y={parseInt(breathSensor.longitude)}
                        service_type={breathSensor.service_type}
                        image={((breathSensor.status === 1 || breathSensor.status === '1' || breathSensor.status === 5 || breathSensor.status === '5') && this.state.blinker === true) ? this.state.imageBreathSensorEvent : this.state.imageBreathSensor}
                        onContextMenu={this.handleShowModifyDeleteContext}
                        //onMouseOver={this.handleMouseOver}
                        //onMouseOut={this.handleMouseOut}
                        onClick={(e) => this.showDevicePopup(e, true)}
                      //onDragEnd={(e)=>this.handleDragEndEbell(e, device.idx)}
                      //onDragStart={(e)=>this.handleDragStart(e, device.idx)}
                      //onDragMove={(e) => this.handleDragMove(e, device.idx)}
                      //draggable={this.state.shapeDrag}
                      >
                      </Image>
                      <Rect
                        fill='#ffb74d'
                        shadowBlur={2}
                        x={parseInt(breathSensor.latitude)}
                        y={parseInt(breathSensor.longitude)}
                        width={2}
                        height={2}
                      />
                      <Text
                        text={breathSensor.name}
                        fontSize={15}
                        fontFamily='돋움체'
                        x={parseInt(breathSensor.latitude)}
                        y={parseInt(breathSensor.longitude)}
                      />
                    </>
                  );
                }
                return null;
              })}

            {/* {this.state.mapCameraList.map(camera => {
              if (parseInt(camera.floor_idx) === this.state.currFloorIdx) {
                return (
                  <>
                    <Image
                      key={camera.idx}
                      id={camera.idx.toString()}
                      name={'cameraicon'}
                      x={parseInt(camera.latitude)}
                      y={parseInt(camera.longitude)}
                      image={this.state.imageCamera}
                      onContextMenu={this.handleShowModifyDeleteContext}
                      onMouseOver={this.handleMouseOver}
                      onMouseOut={this.handleMouseOut}
                      onClick={(e) => this.showDevicePopup(e, true)}
                      onDragEnd={(e) => this.handleDragEndMcamera(e, camera.idx)}
                      onDragStart={(e)=>this.handleDragStart(e, camera.idx)}
                      onDragMove={(e) => this.handleDragMove(e, camera.idx)}
                      draggable={this.state.shapeDrag}
                    />
                    <Rect
                      fill='#ffb74d'
                      shadowBlur= {2}
                      x={this.state.draggingShapeIdx === camera.idx?this.state.draggingShapeX:parseInt(camera.latitude)}
                      y={this.state.draggingShapeIdx === camera.idx?this.state.draggingShapeY:parseInt(camera.longitude)}
                      width={2}
                      height={2}
                    />
                    <Text
                      text={camera.name}
                      fontSize={15}
                      fontFamily='돋움체'
                      x={this.state.draggingShapeIdx === camera.idx?this.state.draggingShapeX:parseInt(camera.latitude)}
                      y={this.state.draggingShapeIdx === camera.idx?this.state.draggingShapeY:parseInt(camera.longitude)}
                    />
                    
                  </>
                );
              }
              return null;
            })} */}
          </Layer>
        </Stage>
        <div className='menu-map'>
          <div className='indoor-contextMenu'>
            <img src={iconCameraAdd} />
            <button className='add-bell' onClick={this.handleShowModalAddCamera} onContextMenu={this.handleClickNothing}>카메라 추가</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={iconDoorAdd} />
            <button className='add-door' onClick={this.handleShowModalAddDoor} onContextMenu={this.handleClickNothing}>출입문 추가</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={iconDetectionBreathing} />
            <button className='add-door' onClick={this.handleShowModalAddBreathSensor} onContextMenu={this.handleClickNothing}>호흡감지센서 추가</button>
          </div>
        </div>

        <div className="menu-camera">
          <div className='indoor-contextMenu'>
            <img src={iconCameraRemove} />
            <button className="delete-camera" onClick={this.handleRemoveCamera} onContextMenu={this.handleClickNothing} >카메라 삭제</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={require('../../assets/images/event_clear.ico')} />
            <button className="acknowledge-allEvent" onClick={this.handleConfirmAllEvent} onContextMenu={this.handleClickNothing} >전체 이벤트 알림 해제</button>
          </div>
        </div>

        <div className="menu-door">
          <div className='indoor-contextMenu'>
            <img src={iconDoorLock} />
            <button className="lock-door" onClick={this.handleLockDoor} onContextMenu={this.handleClickNothing} >출입문 잠금</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={iconDoorUnlock10} />
            <button className="lock-door" onClick={this.handleUnlock10sDoor} onContextMenu={this.handleClickNothing} >출입문 잠금 해제(10초)</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={iconDoorUnlock} />
            <button className="lock-door" onClick={this.handleUnlockDoor} onContextMenu={this.handleClickNothing} >출입문 잠금 해제</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={iconDoorLog} />
            <button className="setCamera-door" onClick={this.handleDoorLog} onContextMenu={this.handleClickNothing} >출입 기록 조회</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={iconDoorLiveVideo} />
            <button className="recCamera-door" onClick={this.handleAddMapDoorRec} onContextMenu={this.handleClickNothing} >직전 이벤트 영상 보기</button>
          </div>
          <img src={line} />
          <div className='indoor-contextMenu'>
            <img src={iconDoorUpdate} />
            <button className="setCamera-door" onClick={this.handleCameraDoor} onContextMenu={this.handleClickNothing} >카메라 설정</button>
          </div>
          <img src={line} />
          <div className='indoor-contextMenu'>
            <img src={iconDoorRemove} />
            <button className="delete-door" onClick={this.handleRemoveDoor} onContextMenu={this.handleClickNothing} >출입문 삭제</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={require('../../assets/images/event_clear.ico')} style={{ width: '32', height: '32' }} />
            <button className="acknowledge-allEvent" onClick={this.handleConfirmAllEvent} onContextMenu={this.handleClickNothing} >전체 이벤트 알림 해제</button>
          </div>
        </div>

        <div className="menu-ebell">
          <div className='indoor-contextMenu'>
            <img src={require('../../assets/images/event_clear.ico')} />
            <button className="acknowledge-allEvent" onClick={this.handleConfirmAllEvent} onContextMenu={this.handleClickNothing} >전체 이벤트 알림 해제</button>
          </div>
        </div>

        <div className="menu-breathSensor">
          <div className='indoor-contextMenu'>
            <img src={iconDoorUpdate} />
            <button className="setCamera-breathSensor" onClick={this.handleCameraBreathSensor} onContextMenu={this.handleClickNothing} >카메라 설정</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={iconBreathSensorRemove} />
            <button className="delete-breathSensor" onClick={this.handleRemoveBreathSensor} onContextMenu={this.handleClickNothing} >호흡감지센서 삭제</button>
          </div>
          <div className='indoor-contextMenu'>
            <img src={require('../../assets/images/event_clear.ico')} />
            <button className="acknowledge-allEvent" onClick={this.handleConfirmAllEvent} onContextMenu={this.handleClickNothing} >전체 이벤트 알림 해제</button>
          </div>
        </div>

        <div id="indoor-popup" className={this.state.cameraPopup}>
          <a href="!#" id="indoor-popup-closer" className={this.state.cameraPopup === "ol-indoor-popup" ? "ol-indoor-popup-closer" : "ol-indoor-popup-closer noVideo"} onClick={this.handleClosePopup}></a>
          <Container id="indoor-popup-content">
            <div id="indoor-popup-video">
            </div>
          </Container>
          <Container>
            <Row className="ol-popup-content-detail">
              <>
                <OverlayTrigger
                  key={'left'}
                  placement={'left'}
                  overlay={
                    <Tooltip id={`camera-tooltip-left`}>
                      <strong>{this.state.selectedShape ? (this.state.selectedShape.buildingname + ' ' + this.state.selectedShape.floorname) : '위치없음'}</strong>
                    </Tooltip>
                  }
                >
                  <Col className={this.state.cameraPopup === "ol-indoor-popup" ? "ol-indoor-popup-content-location" : "ol-indoor-popup-content-location noVideo"}><span className="emap-Info-Icon"><i className="mdi mdi-map-marker"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'bottom'}
                  placement={'bottom'}
                  overlay={
                    <Tooltip id={`camera-tooltip-bottom`}>
                      <strong>최근 일주일 이벤트 발생: {this.props.eventsByIpForWeek ? this.props.eventsByIpForWeek.length : null}건</strong>
                    </Tooltip>
                  }
                >
                  <Col className="ol-indoor-popup-content-event-totalCount"><span className="emap-Info-Icon"><i className="mdi mdi-view-week"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'right'}
                  placement={'right'}
                  overlay={
                    <Tooltip id={`camera-tooltip-right`}>
                      <strong className="gmapRightTooltip">장치 상세정보를 확인하려면<br />클릭하세요.</strong>
                    </Tooltip>
                  }
                  className='tooltip-right'
                >
                  <Col className={this.state.cameraPopup === "ol-indoor-popup" ? "ol-indoor-popup-content-information" : "ol-indoor-popup-content-information noVideo"}><span className="emap-Info-Icon" onClick={() => this.props.handleDeviceInformation(this.state.selectedShape.cameraid, this.state.selectedShape.cameraid + '.' + this.state.selectedShape.cameraname, this.state.selectedShape.service_type, this.state.selectedShape.ipaddress)}><i className="mdi mdi-information-variant"></i></span></Col>
                </OverlayTrigger>
              </>
            </Row>
          </Container>
        </div>
        <div id="indoor-ebell-popup" className={this.state.ebellPopup}>
          <a href="!#" id="indoor-ebell-popup-closer" className={this.state.ebellPopup === "ol-indoor-ebell-popup" ? "ol-indoor-ebell-popup-closer" : "ol-indoor-ebell-popup-closer noVideo"} onClick={this.handleCloseEbellPopup}></a>
          <Container id="ebell-indoor-popup-content">
            <div id="ebell-indoor-popup-video">
            </div>
          </Container>
          <Container>
            <Row className="ol-indoor-ebell-popup-content-detail">
              <>
                <OverlayTrigger
                  key={'left'}
                  placement={'left'}
                  overlay={
                    <Tooltip id={`ebell-tooltip-left`}>
                      <strong>{this.state.selectedShape2 ? (this.state.selectedShape2.buildingname + ' ' + this.state.selectedShape2.floorname) : '위치없음'}</strong>
                    </Tooltip>
                  }
                >
                  <Col className={this.state.ebellPopup === "ol-indoor-ebell-popup" ? "ol-indoor-ebell-popup-content-location" : "ol-indoor-ebell-popup-content-location noVideo"}><span className="emap-Info-Icon"><i className="mdi mdi-map-marker"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'bottom'}
                  placement={'bottom'}
                  overlay={
                    <Tooltip id={`ebell-tooltip-bottom`}>
                      <strong>최근 일주일 이벤트 발생: {this.props.eventsByIpForWeek ? this.props.eventsByIpForWeek.length : null}건</strong>
                    </Tooltip>
                  }
                >
                  <Col className="ol-indoor-ebell-popup-content-event-totalCount"><span className="emap-Info-Icon"><i className="mdi mdi-view-week"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'right'}
                  placement={'right'}
                  overlay={
                    <Tooltip id={`ebell-tooltip-right`}>
                      <strong className="gmapRightTooltip">장치 상세정보를 확인하려면 <br />클릭하세요.</strong>
                    </Tooltip>
                  }
                >
                  <Col className={this.state.ebellPopup === "ol-indoor-ebell-popup" ? "ol-indoor-ebell-popup-content-information" : "ol-indoor-ebell-popup-content-information noVideo"}><span className="emap-Info-Icon" onClick={() => this.props.handleDeviceInformation(this.state.selectedShape2.idx, this.state.selectedShape2.name, this.state.selectedShape2.service_type, this.state.selectedShape2.ipaddress, this.state.selectedShape2.type)}><i className="mdi mdi-information-variant"></i></span></Col>
                </OverlayTrigger>
              </>
            </Row>
          </Container>
        </div>

        <div id="indoor-door-popup" className={this.state.doorPopup}>
          <a href="!#" id="indoor-door-popup-closer" className={this.state.doorPopup === "ol-indoor-door-popup" ? "ol-indoor-door-popup-closer" : "ol-indoor-door-popup-closer noVideo"} onClick={this.handleCloseDoorPopup}></a>
          <Container id="door-indoor-popup-content">
            <div id="door-indoor-popup-video">
            </div>
          </Container>
          <Container>
            <Row className="indoor-door-popup-content-detail">
              <>
                <OverlayTrigger
                  key={'left'}
                  placement={'left'}
                  overlay={
                    <Tooltip id={`door-tooltip-left`}>
                      <strong>{this.state.selectedShape3 ? (this.state.selectedShape3.buildingname + ' ' + this.state.selectedShape3.floorname) : '위치없음'}</strong>
                    </Tooltip>
                  }
                >
                  <Col className={this.state.doorPopup === "ol-indoor-door-popup" ? "door-popup-content-location" : "door-popup-content-location noVideo"}><span className="emap-Info-Icon"><i className="mdi mdi-map-marker"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'bottom'}
                  placement={'bottom'}
                  overlay={
                    <Tooltip id={`door-tooltip-bottom`}>
                      <strong>최근 일주일 이벤트 발생: {this.props.eventsByIpForWeek ? this.props.eventsByIpForWeek.length : null}건</strong>
                    </Tooltip>
                  }
                >
                  <Col className="ol-indoor-door-popup-content-event-totalCount"><span className="emap-Info-Icon"><i className="mdi mdi-view-week"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'right'}
                  placement={'right'}
                  overlay={
                    <Tooltip id={`door-tooltip-right`}>
                      <strong className="gmapRightTooltip">장치 상세정보를 확인하려면<br />클릭하세요.</strong>
                    </Tooltip>
                  }
                >
                  <Col className={this.state.doorPopup === "ol-indoor-door-popup" ? "door-popup-content-information" : "door-popup-content-information noVideo"}><span className="emap-Info-Icon" onClick={() => this.props.handleDeviceInformation(this.state.selectedShape3.idx, this.state.selectedShape3.name, this.state.selectedShape3.service_type, this.state.selectedShape3.ipaddress, this.state.selectedShape3.type)}><i className="mdi mdi-information-variant"></i></span></Col>
                </OverlayTrigger>
              </>
            </Row>
          </Container>
        </div>


        <div id="indoor-breathSensor-popup" className={this.state.breathSensorPopup}>
          <a href="!#" id="indoor-breathSensor-popup-closer" className={this.state.breathSensorPopup === "ol-indoor-breathSensor-popup" ? "ol-indoor-breathSensor-popup-closer" : "ol-indoor-breathSensor-popup-closer noVideo"} onClick={this.handleCloseBreathSensorPopup}></a>
          <Container id="breathSensor-indoor-popup-content">
            <div className='breathSensor-popup-title'>
              <h3>{this.state.selectedShape4 && this.state.selectedShape4.location}</h3>
            </div>
            <h5 className='breathSensor respiration'>현재 호흡감지: {this.props.respiration}</h5>
            {/* <h5 className='breathSensor respiration'>IP 주소: {this.state.selectedShape4 && this.state.selectedShape4.ipaddress}</h5> */}
            <div id="breathSensor-indoor-popup-video">

            </div>
          </Container>
          <Container className='breathSensor-data-chart'>
            {/* <Line data={this.state.dataArr} options={options} /> */}
            {this.breathGraph()}
          </Container>
        </div>

        <div>
          {this.generateDoorPersonPopup()}
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
            <Button variant="primary" onClick={this.handleAddMapCameraDoor}>
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
                  <option>{doorCamera && doorCamera.camera_id ? doorCamera.camera_id + '.카메라' : '연동된 카메라 없음'}</option>
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
            <Button variant="primary" onClick={this.handleAddMapCameraBreathSensor}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleCloseModalCameraBreathSensor}>
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
              <Form.Group controlId="Idx">
                {this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'live') ? <video src={this.state.modaldoorRecSrc} controls muted autoPlay playsInline width={'110%'} />
                  : this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'virtual') ? <img style={{ width: "110%" }} src={this.state.modaldoorRecSrc} />
                    : this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'noEvent') ? <img style={{ width: "110%" }} src={noEvent} />
                      : this.state.modaldoorRecSrcFormat && (this.state.modaldoorRecSrcFormat === 'noCamera') ? <img style={{ width: "110%" }} src={noCamera} /> : <img style={{ width: '60%', marginLeft: '100px' }} src={require('../../assets/images/loading.gif')} />}
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

        {/* 해당 장치의 전체 이벤트 알림 해제 모달창 */}
        <Modal show={this.state.showAlert} centered >
          <Modal.Header>
            <Modal.Title>전체 이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 장치의 전체 이벤트 알림을 해제하시겠습니까?</Modal.Body>
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
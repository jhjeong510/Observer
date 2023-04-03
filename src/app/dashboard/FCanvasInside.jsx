import { fabric } from "fabric";
import React, { useState, useEffect, useRef, useContext } from "react";
import styles from './FCanvasInside.module.css';
import * as common from './common';
import useContextMenu from "contextmenu";
import AddIconToMap from "./handlers/AddIconToCanvasHandler";
import { ContextMenuHandler, handleCloseContext } from "./handlers/ContextMenuHandler";
import AddCameraModal from "../shared/modal/AddCameraModal";
import AddEbellModal from "../shared/modal/AddEbellModal";
import AddDoorModal from "../shared/modal/AddDoorModal";
import AddVitalsensorModal from "../shared/modal/AddVitalsensorModal";
import HandleVitalsensorScheduleModal from "../shared/modal/HandleVitalsensorScheduleModal";
import HandleInterlockCameraModal from "../shared/modal/HandleInterlockCameraModal";
import AddGuardianliteModal from "../shared/modal/AddGuardianliteModal";
import HandleVitalsensorValueModal from "../shared/modal/HandleVitalsensorValueModal";
import RemoveIconModal from "../shared/modal/RemoveIconModal";
import HandleAcknowledgeEventModal from "../shared/modal/HandleAcknowledgeEventModal";
import { setAcknowledgeimport, controlVitalsensor, setAcknowledge, unlock10sDoor, unlockDoor, lockDoor, getVitalLog, accessEventRec, setGuardianliteChannel } from '../dashboard/api/apiService';
import iconOutside from "./icons/movetooutsidemap.png";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { v4 } from 'uuid';
import ContextMenuModal from '../shared/modal/ContextMenuModal';
import ShowDevicePopUp from './handlers/ShowDevicePopUp';
import DevicePopupModal from '../shared/modal/DevicePopupModal';
import Slider from "react-slick";
import DoorAccessPerson from './DoorAccessPerson';
import { UserInfoContext } from '../context/context';
import BlinkDeviceEventIcon from "./BlinkDeviceEventIcon";
import BlinkCameraEventIcon from "./BlinkCameraEventIcon";
import AddVCounterToMapModal from "../shared/modal/AddVCounterToMapModal";
import AddMDetModal from '../shared/modal/AddMDetModal';

export default function FCanvasInside(props) {
   const canvasRef = useRef(null);
   const isMountedRef = useRef(null);
   const transformComponentRef = useRef();
   const [canvas, setCanvas] = useState('');
   const [canvasId, setCanvasId] = useState('');
   const [selectParentObj, setSelectParentObj] = useState({});
   const [selectObject, setSelectObject] = useState({});
   const [contextMenu, useCM] = useContextMenu();
   const [doorModal, setDoorModal] = useState({ show: false, title: '', message: '', callback: false });
   const [guardianliteModal, setGuardianliteModal] = useState({ show: false, title: '', messageName: '', messageIp: '', callback: false });
   const [cameraModal, setCameraModal] = useState({ show: false, title: '', message: '', callback: false });
   const [vCounterModal, setVCounterModal] = useState({ show: false, title: '', message: '' });
   const [vitalsensorScheduleModal, setVitalsensorScheduleModal] = useState({ show: false, title: '', message: '', callback: false });
   const [vitalsensorValueModal, setVitalsensorValueModal] = useState({ show: false, title: '', message: '', callback: false });
   const [ebellModal, setEbellModal] = useState({ show: false, title: '', message: '', callback: false });
   const [interlockCameraModal, setInterlockCameraModal] = useState({ show: false, title: '', message: '', callback: false });
   const [acknowledgeModal, setAcknowledgeModal] = useState({ show: false, title: '', message: '', callback: false });
   const [vitalSensorModal, setVitalSensorModal] = useState({ show: false, title: '', message: '', callback: false });
   const [mdetModal, setMdetModal] = useState({ show: false, title: '', message: '', callback: false });
   const [removeIconModal, setRemoveIconModal] = useState({ show: false, title: '', message: '', callback: false });
   const [clickPoint, setClickPoint] = useState({ x: '', y: '' });
   const [doorRecDataModal, setDoorRecDataModal] = useState({ show: false, title: '', message: '', callback: false });
   const menuConfig = {};
   const [objUpdate, setObjUpdate] = useState('');
   const [hoverShow, setHoverShow] = useState(false)
   const [devicePopupModal, setDevicePopupModal] = useState(null);
   const [deviceEventPopupModal, setDeviceEventPopupModal] = useState(null);
   const socketRef = useRef(null);
   const [selectedVitalsensor, setSelectedVitalsensor] = useState({});
   const [selectedVitalsensorOnEvent, setSelectedVitalsensorOnEvent] = useState({});
   const [connectedVitalsensor, setConnectedVitalsensor] = useState('');
   const [onEventVitalsensor, setOnEventVitalsensor] = useState('');
   const vitalsensorRef = useRef(null);
   const vitalsensorOnEventRef = useRef(null);
   const { websocket_url } = useContext(UserInfoContext);
   const [xGraphTime, setXGraphTime] = useState('');
   const [beforeBreathDataArr, setBeforeBreathDataArr] = useState([]);
   const [dataArr, setDataArr] = useState({
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
   });
   const [xGraphTimeOnEvent, setXGraphTimeOnEvent] = useState('');
   const [beforeBreathDataArrOnEvent, setBeforeBreathDataArrOnEvent] = useState([]);
   const [dataArrOnEvent, setDataArrOnEvent] = useState({
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
   });

   const [liveStream, setLiveStream] = useState(undefined);
   const liveStreamRef = useRef(null);
   const [liveEventStream, setLiveEventStream] = useState(undefined);
   const liveEventStreamRef = useRef(null);
   const devicePopupModalRef = useRef(null);
   const deviceEventPopupModalRef = useRef(null);

   useEffect(() => {
      isMountedRef.current = true;
      handleInitCanvas();
      return () => {
         if (canvasRef.current && canvasRef.current.id === undefined && isMountedRef.current) {
            handleCloseDevicePopup();
            handleCloseDeviceEventPopup();
            canvasRef.current.dispose();
            canvasRef.current = null;
            isMountedRef.current = null;
         };
      }
   }, []);

   const handleInitCanvas = async () => {
      if (canvasRef.current && canvasRef.current.id === undefined && isMountedRef.current) {
         await canvasRef.current.dispose();
         canvasRef.current = null;
      }
      canvasRef.current = await initCanvas();
      if (canvasRef && canvasRef.current && canvasRef.current.id === undefined) {
         settingCanvas(canvasRef.current);
         canvasRef.current.on({ 'mouse:down': eventHandler });
      }
   }

   const initCanvas = async () => {
      const canvasId = v4();
      await setCanvasId(canvasId);
      return (
         new fabric.Canvas(canvasId, {
            width: 1920,
            height: window.innerHeight,
            initialWidth: 600,
            initialHeight: 400,
            objectNum: 0,
            componentSize: '',
            fireRightClick: true,
            renderOnAddRemove: true,
            stopContextMenu: true,
            backgroundImageStretch: true,
            hoverCursor: 'cursor',
            selection: false,
            preserveObjectStacking: true,
         })
      )
   }

   const handleDisconnectLiveStream = async () => {
      if (socketRef.current && liveStreamRef.current) {
         const { cameraId, received } = liveStreamRef.current;
         const socket = socketRef.current;
         if (received && !liveEventStreamRef.current || (liveEventStreamRef.current && (liveEventStreamRef.current.received && ((liveEventStreamRef.current.cameraId && liveEventStreamRef.current.cameraId) !== cameraId)))) {
            await socket.emit('cameraStream', {
               cameraId,
               cmd: 'off'
            });
         }
         await setLiveStream(null);
         return true;
      }
      return false;
   }

   const handleDisconnectLiveEventStream = async () => {
      if (socketRef.current && liveEventStreamRef.current) {
         const { cameraId, received } = liveEventStreamRef.current;
         const socket = socketRef.current;
         if (received && !liveStreamRef.current || (liveStreamRef.current && (liveStreamRef.current.received && ((liveStreamRef.current.cameraId && liveStreamRef.current.cameraId) !== cameraId)))) {
            await socket.emit('cameraStream', {
               cameraId,
               cmd: 'off'
            });
         }
         await setLiveEventStream(null);
         return true;
      }
      return false;
   }

   const handleSetLiveStream = async (cameraInfo) => {
      const { cameraId, received } = cameraInfo;
      await setLiveStream({ cameraId, received });
   }

   const handleSetLiveEventStream = async (cameraInfo) => {
      const { cameraId, received } = cameraInfo;
      await setLiveEventStream({ cameraId, received });
   }

   const handleDisconnectVitalSocket = async () => {
      if ((vitalsensorOnEventRef.current && vitalsensorOnEventRef.current) !== vitalsensorRef.current) {
         const ipaddress = vitalsensorRef.current;
         await props.breathSocketClient.emit('setbreath', { sensorIp: vitalsensorRef.current, cmd: 'off' });
         // await props.handleRespiration(ipaddress);
      }
      if (isMountedRef.current) {
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
         await setDataArr(emptyDataArr);
         await setXGraphTime('');
         await setBeforeBreathDataArr([]);
         await setConnectedVitalsensor('');
      }
   }

   const handleDisconnectVitalSocketOnEvent = async () => {
      if ((vitalsensorRef.current && vitalsensorRef.current) !== vitalsensorOnEventRef.current) {
         const ipaddress = vitalsensorOnEventRef.current;
         await props.breathSocketClient.emit('setbreath', { sensorIp: vitalsensorOnEventRef.current, cmd: 'off' });
         // await props.handleRespirationOnEvent(ipaddress);
         if (isMountedRef.current) {
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
            await setDataArrOnEvent(emptyDataArr);
            await setXGraphTimeOnEvent('');
            await setBeforeBreathDataArrOnEvent([]);
            await setOnEventVitalsensor('');
         }
      }
   }

   const handleCloseDevicePopup = async (e) => {
      if (e) {
         e.preventDefault();
      }
      await handleDisconnectLiveStream();
      if (vitalsensorRef.current && props.breathSocketClient && deviceEventPopupModalRef.current && deviceEventPopupModalRef.current.type !== 'vitalsensor') {
         await handleDisconnectVitalSocket();
         await setConnectedVitalsensor('');
      }
      isMountedRef.current && await setDevicePopupModal(null);
   }

   const handleCloseDeviceEventPopup = async (e) => {
      if (e) {
         e.preventDefault();
      }
      await handleDisconnectLiveEventStream();
      if (vitalsensorRef.current && props.breathSocketClient && devicePopupModalRef.current && devicePopupModalRef.current.type !== 'vitalsensor') {
         await handleDisconnectVitalSocket();
      }
      isMountedRef.current && await setDeviceEventPopupModal(null);
   }


   const handleShowDevicePopUp = async (popUpType) => {
      const opt = selectParentObj;
      if (opt && opt.target && opt.target.data && canvasRef && canvasRef.current) {
         const resPopUp = await ShowDevicePopUp(opt, canvasRef.current, popUpType, false);
         if (resPopUp) {
            await handleCloseContext();
            if (deviceEventPopupModalRef.current && ((deviceEventPopupModalRef.current.ipaddress) === (opt.target.data.ipaddress))) {
               await handleCloseDeviceEventPopup();
            }
            if (devicePopupModalRef.current && ((devicePopupModalRef.current.ipaddress === opt.target.data.ipaddress) && (devicePopupModalRef.current.popUpType === 'onlyCamera'))) {
               return;
            } else {
               await handleCloseDevicePopup();
            }
            connectedVitalsensor && await handleDisconnectVitalSocket();
            await setDevicePopupModal(resPopUp);
         }
      }
   }

   const zoomOutInit = () => {
      const { resetTransform } = transformComponentRef.current;
      resetTransform();
   }

   const findEventPopupDevice = async (eventPopupProps) => {
      switch (eventPopupProps.deviceType) {
         case 'camera':
            return props.cameraList.find((cameraDetail) => (cameraDetail.cameraid === eventPopupProps.deviceId));
         case 'door':
            return props.deviceList.find((deviceDetail) => deviceDetail.id === eventPopupProps.deviceId && deviceDetail.service_type === eventPopupProps.serviceType);
         case 'ebell':
            return props.deviceList.find((deviceDetail) => ((deviceDetail.id === eventPopupProps.deviceId) && (deviceDetail.service_type === eventPopupProps.serviceType)));
         case 'vitalsensor':
            return props.deviceList.find((deviceDetail) => ((deviceDetail.id === eventPopupProps.deviceId) && (deviceDetail.service_type === eventPopupProps.serviceType)));
         case 'mdet':
            return props.deviceList.find((deviceDetail) => ((deviceDetail.id === eventPopupProps.deviceId) && (deviceDetail.service_type === eventPopupProps.serviceType)));
      }
   }

   const handleShowEventPopup = async (eventPopupProps) => {
      const eventPopupDevice = await findEventPopupDevice(eventPopupProps);
      let resEventPopup;
      const opt = {
         e: {
            target: {
               clientWidth: document.documentElement.clientWidth,
               clientHeight: document.documentElement.clientHeight
            }
         },
         target: {
            data: eventPopupDevice
         }
      }
      if (eventPopupDevice) {
         if (devicePopupModalRef.current && (devicePopupModalRef.current.ipaddress === opt.target.data.ipaddress)) {
            await handleCloseDevicePopup();
         }
         if (deviceEventPopupModalRef.current) {
            await handleCloseDeviceEventPopup();
         }
         zoomOutInit();
         if (eventPopupDevice.type === 'vitalsensor') {
            await onEventVitalsensorFunc(opt.target.data);
         }
         resEventPopup = await ShowDevicePopUp(opt, canvasRef.current, eventPopupDevice.type === 'vitalsensor' ? 'optionCamera_vital' : 'optionCamera', true, eventPopupProps.eventName);
      }
      resEventPopup && isMountedRef.current && await setDeviceEventPopupModal(resEventPopup);
   }

   useEffect(() => {
      canvasRef && canvasRef.current && props.eventPopup.timestamp !== 0 && handleShowEventPopup(props.eventPopup);
   }, [props.eventPopup])

   // 추가
   const handleShowModalDoor = () => {
      setDoorModal({ show: true, title: '출입문 추가', message: '출입문 선택', callback: false });
      handleCloseContext();
   }
   const handleShowModalVitalSensor = () => {
      setVitalSensorModal({ show: true, title: '바이탈센서 추가', message: '바이탈 센서 추가', callback: false });
      handleCloseContext();
   }
   const handleShowModalMdet = () => {
      setMdetModal({ show: true, title: 'MDET 추가', message: 'MDET 추가', callback: false });
      handleCloseContext();
   }
   const handleShowModalCamera = () => {
      setCameraModal({ show: true, title: '카메라 추가', message: '카메라 선택', callback: false });
      handleCloseContext();
   }
   const handleShowModalGuardianlite = () => {
      setGuardianliteModal({ show: true, title: '전원장치 추가', messageName: '이름 (*필수)', messageIp: 'IP Address (*필수)', callback: false });
      handleCloseContext();
   }
   const handleShowModalEbell = () => {
      setEbellModal({ show: true, title: '비상벨 추가', message: '비상벨 선택', callback: false });
      handleCloseContext();
   }
   const handleVitalsensorScheduleGroup = () => {
      setVitalsensorScheduleModal({ show: true, title: '바이탈센서 설정', message: '바이탈센서 스케줄 그룹 적용', callback: false });
      handleCloseContext();
   }
   const handleVitalsensorValueGroup = () => {
      setVitalsensorValueModal({ show: true, title: '바이탈센서 임계치 설정', message: '바이탈센서 임계치 설정', callback: false });
      handleCloseContext();
   }
   const handleInterlockCamera = () => {
      setInterlockCameraModal({ show: true, title: '카메라 연동', message: '카메라 연동', callback: false });
      handleCloseContext();
   }
   const handleOnOffVitalsensor = async () => {
      const ipaddress = selectObject.data.ipaddress;
      const id = selectObject.data.device_id;
      const location = selectObject.data.location;
      let status = 'true';
      if (selectObject.data.use_status === 'true') {
         status = 'false'
      }
      try {
         const res = await controlVitalsensor({
            ipaddress,
            status
         })
         if (res && res.result && res.result === 'success') {
            props.handleShowToast('success', `${location} ${id} ${status === 'false' ? 'OFF' : 'ON'}`)
         } else {
            props.handleShowToast('error', `${location} ${id} ${status === 'false' ? 'OFF 실패' : 'ON 실패'}`)
         }
      } catch (error) {
         console.log('호흡센서 on/off err : ', error);
         props.handleShowToast('error', `${location} ${id} ${status === 'false' ? 'OFF 실패' : 'ON 실패'}`)
      }
      handleCloseContext();
   }

   // 삭제
   const handleRemoveIcon = () => {
      setRemoveIconModal({ show: true, title: '', message: '삭제 하시겠습니까?', callback: false });
      handleCloseContext();
   }

   // 확인
   const handleShowModalAckAllEvents = () => {
      setAcknowledgeModal({ show: true, title: '이벤트 알림 해제', message: '해당 장치의 이벤트 알림을 해제하시겠습니까?', callback: false });
      handleCloseContext();
   }
   const handleBreathEventLog = async (e) => {
      props.handleShowInquiryModal(e, 'allEvents', selectObject.data.ipaddress);
      handleCloseContext();
   }
   const showDropdownMenu = (e) => {
      setHoverShow(!hoverShow);
   }
   const hideDropdownMenu = (e) => {
      setHoverShow(!hoverShow);
   }

   const handleLockDoor = () => {
      const doorId = selectObject.data.device_id;
      try {
         if (doorId) {
            const prefix = doorId.substring(0, doorId.length - 2);
            const controlId = prefix.padStart(3, '0');
            const acu = props.deviceList.find(device => device.id === controlId && device.type === 'acu');
            if (acu) {
               lockDoor({
                  acuId: controlId,
                  acuIpaddress: acu.ipaddress,
                  doorId: doorId,
                  command: 0, // 문닫기 0, 문열기 1
               })
               handleCloseContext();
            }
         }
      } catch (err) {
         console.log('출입문 잠금 오류: ', err);
      }
   }

   const handleUnlock10sDoor = () => {
      const doorId = selectObject.data.device_id;
      try {
         if (doorId) {
            const prefix = doorId.substring(0, doorId.length - 2);
            const controlId = prefix.padStart(3, '0');
            const acu = props.deviceList.find(device => device.id === controlId && device.type === 'acu');
            if (acu) {
               unlock10sDoor({
                  acuId: controlId,
                  acuIpaddress: acu.ipaddress,
                  doorId: doorId,
                  command: 1, // 문닫기 0, 문열기 1
                  cmdSec: 10 //잠금해제 시간(초)
               })
               handleCloseContext();
            }
         }
      } catch (err) {
         console.log('출입문 잠금 해제 오류: ', err);
      }
   }

   const handleUnLockDoor = () => {
      const doorId = selectObject.data.device_id;
      try {
         if (doorId) {
            const prefix = doorId.substring(0, doorId.length - 2);
            const controlId = prefix.padStart(3, '0');
            const acu = props.deviceList.find(device => device.id === controlId && device.type === 'acu');
            if (acu) {
               unlockDoor({
                  acuId: controlId,
                  acuIpaddress: acu.ipaddress,
                  doorId: doorId,
                  command: 1, // 문닫기 0, 문열기 1
               })
               handleCloseContext();
            }
         }
      } catch (err) {
         console.log('출입문 10초 잠금해제 오류: ', err);
      }
   }

   const handleDoorLog = (e) => {
      props.handleShowInquiryModal(e, 'accessCtlLog', selectObject.data.device_id);
      handleCloseContext();
   }

   const handleShowModalVCounter = async => {
      setVCounterModal({ show: true, title: 'V-Counter 추가', message: 'V-Counter 선택' });
      handleCloseContext();
   }

   const handleShowEventDetail = async () => {
      const { type, ipaddress, device_id, buildingName, floorName, location } = selectObject.data;
      let deviceInfo;
      if (type === 'camera') {
         deviceInfo = device_id;
      } else if (type === 'door') {
         deviceInfo = device_id;
      } else {
         deviceInfo = ipaddress
      }
      const res = await accessEventRec(deviceInfo, type);
      if (res && res.data && res.data.result) {
         console.log(res.data)
         const { idx, serviceType, eventTypeName } = res.data.result;
         if (idx && serviceType) {
            props.handleShowEventDetail(idx, serviceType, buildingName, floorName, location, eventTypeName);
         }
      }
      handleCloseContext();
   }

   const handleClickNothing = (e) => {
      e.preventDefault();
   }

   const settingCanvas = async (canvas) => {
      try {
         if (canvas) {
            const floorImage = props.floorList.find((floor) => floor.idx === props.currFloorIdx && floor.building_idx === props.currBuildingIdx).map_image;
            const floorImageUrl = floorImage ? `${props.socketClient.io.uri}/images/floorplan/${floorImage}` : '';
            let innerWidth = common.getInnerSize(canvas)['innerWidth'];
            let innerHeight = common.getInnerSize(canvas)['innerHeight'];
            fabric.Image.fromURL(floorImageUrl, (img) => {
               let imgHeight = img.height;
               let imgWidth = img.width;
               let canvasAspect = canvas.width / canvas.height;
               let backImageAspect = img.width / img.height;
               let left, top, scaleFactor;

               if (canvasAspect >= backImageAspect) {
                  scaleFactor = canvas.width / imgWidth;
                  left = 0;
                  top = -((imgHeight * scaleFactor) - canvas.height) / 2;
               } else {
                  scaleFactor = canvas.height / imgHeight;
                  top = 0;
                  left = -((imgWidth * scaleFactor) - canvas.width) / 2;
               }
               canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                  top: top && top < 0 ? 0 : top,
                  left: left,
                  originX: 'left',
                  originY: 'top',
                  scaleX: canvas.width / img.width,
                  scaleY: canvas.height / img.height
               });

               if (img.width > innerWidth || img.height > innerHeight) common.fitToProportion(canvas)
            })
            canvas.componentSize = common.initialComponentSize();
            // common.setCanvasCenter(canvas);
            canvas.zoomInfo = 1;

            let flag;
            window.addEventListener("resize", function (opt) {
               // common.setCanvasCenter(canvas)
               let innerWidth = common.getInnerSize(canvas)['innerWidth'];
               let innerHeight = common.getInnerSize(canvas)['innerHeight'];
               let currentWidth = common.getCanvasStyleWidth();
               let currentHeight = common.getCanvasStyleHeight();
               let ratio = canvas.width / canvas.height;
               if (innerWidth < currentWidth) {
                  flag = 'width';
                  common.setCanvasStyleSize(innerWidth, innerWidth * (1 / ratio))
               }
               else if (innerHeight < currentHeight) {
                  flag = 'height'
                  common.setCanvasStyleSize(innerHeight * ratio, innerHeight)
               } else {
                  if (currentHeight < canvas.height && flag === 'height')
                     common.setCanvasStyleSize(innerHeight * ratio, innerHeight)
                  if (currentWidth < canvas.width && flag === 'width')
                     common.setCanvasStyleSize(innerWidth, innerWidth * (1 / ratio))
               }
            });
         }
      } catch (err) {
         console.log(err);
      }
      const buildingInfo = {
         buildingIdx: props.currBuildingIdx,
         floorIdx: props.currFloorIdx,
         buildingServiceType: props.currBuildingServiceType
      }
      canvas && settingObjectsToMap(canvas, '', props.cameraList, props.deviceList, props.pidsList, buildingInfo, props.breathSensorList, props.guardianliteList);
   }

   const eventHandler = async (opt) => {
      let downPosition = { x: 0, y: 0 };
      let panning = false;
      const target = canvasRef && canvasRef.current && canvasRef.current.findTarget(opt, true);
      const pointX = opt.absolutePointer.x;
      const pointY = opt.absolutePointer.y;
      const clickXY = { x: pointX, y: pointY }
      setClickPoint({ x: pointX, y: pointY });
      if (opt.button === 1) {
         if (opt.target && opt.target.data) {
            if (deviceEventPopupModalRef.current && ((deviceEventPopupModalRef.current.ipaddress) === (opt.target.data.ipaddress))) {
               await handleCloseDeviceEventPopup();
            }
            if (devicePopupModalRef.current && ((devicePopupModalRef.current.ipaddress === opt.target.data.ipaddress) && (devicePopupModalRef.current.popUpType !== 'onlyCamera'))) {
               return;
            } else {
               await handleCloseDevicePopup();
            }
            if (opt.target.data.type === 'vitalsensor') {
               await props.handleRespiration('on', opt.target.data.ipaddress);
               await connectVitalsensor(opt.target.data);
            }
            const resPopUp = await ShowDevicePopUp(opt, canvasRef.current, opt.target.data.type === 'vitalsensor' ? 'optionCamera_vital' : opt.target.data.type === 'guardianlite' ? 'guardianlite' : 'optionCamera', false);
            if (resPopUp) {
               await setDevicePopupModal(resPopUp);
            }
         }
         if (opt.subTargets && opt.subTargets.length > 0) // => icon 이름
            if (target === undefined) {
               panning = true;
            }
         downPosition = { x: opt.pointer.x, y: opt.pointer.y }
         handleCloseContext();
      } else if (opt.button === 3 && clickXY && canvasRef && canvasRef.current) {
         let inside = true;
         ContextMenuHandler(canvasRef.current, clickXY, opt, inside);
         setSelectObject(target);
         setSelectParentObj(opt);
      }
   }

   const setVitalsensorChart = async (ipaddress) => {
      let valueArray = [];
      let labelArray = [];
      let fixValueArray = []; //
      let fixBreathValue;
      const checkBValue = props.breathSensorList.filter((sensor) => sensor.ipaddress === ipaddress);
      if (selectedVitalsensor && selectedVitalsensor.breath_value) {
         fixBreathValue = selectedVitalsensor.breath_value;
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
         const res = await getVitalLog(ipaddress);
         if (res.data.message === 'ok') {
            for (let i = res.data.result.length - 1; i >= 0; i--) {
               valueArray.push(res.data.result[i].sensor_value);
            }
            setDataArr({
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
                     label: `임계치(${fixBreathValue ? fixBreathValue : ''})`,
                     data: fixValueArray,
                     borderColor: [
                        'white',
                     ],
                     borderWidth: 0.5,
                  }
               ]
            })
         } else if (res.data.message === 'fail') {
            setDataArr({
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
            })
         }
      } catch (err) {
         console.log('이전 호흡 데이터 조회 err : ', err);
      }
   }

   const setVitalsensorChartOnEvent = async (ipaddress) => {
      let valueArray = [];
      let labelArray = [];
      let fixValueArray = []; //
      let fixBreathValue;
      const checkBValue = props.breathSensorList.filter((sensor) => sensor.ipaddress === ipaddress);
      if (selectedVitalsensor && selectedVitalsensor.breath_value) {
         fixBreathValue = selectedVitalsensor.breath_value;
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
         const res = await getVitalLog(ipaddress);
         if (res.data.message === 'ok') {
            for (let i = res.data.result.length - 1; i >= 0; i--) {
               valueArray.push(res.data.result[i].sensor_value);
            }
            setDataArrOnEvent({
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
                     label: `임계치(${fixBreathValue ? fixBreathValue : ''})`,
                     data: fixValueArray,
                     borderColor: [
                        'white',
                     ],
                     borderWidth: 0.5,
                  }
               ]
            })
         } else if (res.data.message === 'fail') {
            setDataArrOnEvent({
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
            })
         }
      } catch (err) {
         console.log('이전 호흡 데이터 조회 err : ', err);
      }
   }

   const connectVitalsensor = async (selectedVitalsensor) => {
      const ipaddress = selectedVitalsensor.ipaddress;
      selectedVitalsensor && await setSelectedVitalsensor(selectedVitalsensor);
      if (vitalsensorRef.current && props.breathSocketClient) {
         await handleDisconnectVitalSocket();
      }
      if (props.breathSocketClient && !vitalsensorRef.current) {
         await props.breathSocketClient.emit('setbreath', { sensorIp: ipaddress, cmd: 'on' });
         await setConnectedVitalsensor(ipaddress);
         await setVitalsensorChart(ipaddress);
      }
   }

   const onEventVitalsensorFunc = async (selectedVitalsensor) => {
      const ipaddress = selectedVitalsensor.ipaddress;
      selectedVitalsensor && await setSelectedVitalsensorOnEvent(selectedVitalsensor);
      await props.handleRespirationOnEvent('on', ipaddress);
      if (vitalsensorOnEventRef.current && props.breathSocketClient) {
         await handleDisconnectVitalSocketOnEvent();
      }
      if (props.breathSocketClient && !vitalsensorOnEventRef.current) {
         await props.breathSocketClient.emit('setbreath', { sensorIp: ipaddress, cmd: 'on' });
         await setOnEventVitalsensor(ipaddress);
         await setVitalsensorChartOnEvent(ipaddress);
      }
   }

   const updateVitalsensorChart = async (breathValue) => {
      let copyData = [];
      let copyLabel = [];
      let copyThreshold = [];
      const checkBValue = props.breathSensorList.filter((sensor) => sensor.ipaddress === vitalsensorRef.current);
      let fixBreathValue;
      if (selectedVitalsensor && selectedVitalsensor.breath_value > 0) {
         fixBreathValue = selectedVitalsensor.breath_value;
      } else if (checkBValue.length > 0 && checkBValue[0].breath_value) {
         fixBreathValue = checkBValue[0].breath_value;
      }
      try {
         // x축 시간
         await setXGraphTime('');
      }
      catch (error) {
         console.log(error);
      }
      if (dataArr) {
         copyLabel = [...dataArr.labels];
         copyData = [...dataArr.datasets[0].data];
         copyThreshold = [...dataArr.datasets[1].data]
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
               label: `임계치(${fixBreathValue ? fixBreathValue : ''})`,
               data: copyThreshold,
               borderColor: [
                  'white',
               ],
               borderWidth: 0.5,
            }
         ]
      }
      await setDataArr(newDataArr);
   }

   const updateVitalsensorChartOnEvent = async (breathValue) => {
      let copyData = [];
      let copyLabel = [];
      let copyThreshold = [];
      const checkBValue = props.breathSensorList.filter((sensor) => sensor.ipaddress === vitalsensorRef.current);
      let fixBreathValue;
      if (selectedVitalsensorOnEvent && selectedVitalsensorOnEvent.breath_value > 0) {
         fixBreathValue = selectedVitalsensorOnEvent.breath_value;
      } else if (checkBValue.length > 0 && checkBValue[0].breath_value) {
         fixBreathValue = checkBValue[0].breath_value;
      }
      try {
         // x축 시간
         await setXGraphTimeOnEvent('');
      }
      catch (error) {
         console.log(error);
      }
      if (dataArrOnEvent) {
         copyLabel = [...dataArrOnEvent.labels];
         copyData = [...dataArrOnEvent.datasets[0].data];
         copyThreshold = [...dataArrOnEvent.datasets[1].data]
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
               label: `임계치(${fixBreathValue ? fixBreathValue : ''})`,
               data: copyThreshold,
               borderColor: [
                  'white',
               ],
               borderWidth: 0.5,
            }
         ]
      }
      await setDataArrOnEvent(newDataArr);
   }

   const handleCloseVitalsensorValueModal = () => {
      setVitalsensorValueModal({ show: false, title: '', message: '', callback: false })
   }

   useEffect(() => {
      isMountedRef.current = new Date();
      handleCloseDevicePopup();
      handleCloseDeviceEventPopup();
      handleInitCanvas();
      return () => {
         isMountedRef.current && canvasRef.current && canvasRef.current.id === undefined && canvasRef.current.dispose();
         canvasRef.current = null;
         isMountedRef.current = null;
      }
   }, [props.currFloorIdx]);

   useEffect(() => {
      handleShowEventPopup(props.eventPopup);
   }, [props.eventPopup])
   const settingObjectsToMap = async (canvasRefVal, buildingList, cameraList, deviceList, pidsList, buildingInfo, breathSensorList, guardianlites) => {
      await AddIconToMap(canvasRefVal, '', cameraList, deviceList, '', buildingInfo, breathSensorList, true, guardianlites);
   }

   const moveToOutside = () => {
      props.changeMapType(1);
   }

   const handleUpdateGuardianliteStatus = async (idx, ipaddress, id, password, channelInfo, cmd) => {

      try {
         const ch = channelInfo.slice(2);
         const channel = parseInt(ch);
         if (channel >= 1 && channel <= 8 && (cmd === 'reset' || cmd === 'on' || cmd === 'off')) {
            const res = await setGuardianliteChannel(idx, ipaddress, id, password, channel, cmd);
            return res;
         }
      } catch (err) {
         console.log('handle Update Guardianlite Channel Status Err: ', err);
      }
   }

   useEffect(() => {
      const buildingInfo = {
         buildingIdx: props.currBuildingIdx,
         floorIdx: props.currFloorIdx,
         buildingServiceType: props.currBuildingServiceType
      }
      canvasRef && canvasRef.current && canvasRef.current.id === undefined && settingObjectsToMap(canvasRef.current, '', props.cameraList, '', '', buildingInfo, '', '');
   }, [canvasRef.current, JSON.stringify(props.cameraList)])

   useEffect(() => {
      const buildingInfo = {
         buildingIdx: props.currBuildingIdx,
         floorIdx: props.currFloorIdx,
         buildingServiceType: props.currBuildingServiceType
      }
      canvasRef && canvasRef.current && canvasRef.current.id === undefined && settingObjectsToMap(canvasRef.current, '', '', props.deviceList, '', buildingInfo, '', '');
   }, [canvasRef.current, JSON.stringify(props.deviceList)])

   useEffect(() => {
      const buildingInfo = {
         buildingIdx: props.currBuildingIdx,
         floorIdx: props.currFloorIdx,
         buildingServiceType: props.currBuildingServiceType
      }
      canvasRef && canvasRef.current && canvasRef.current.id === undefined && settingObjectsToMap(canvasRef.current, '', '', '', '', buildingInfo, props.breathSensorList, '');
   }, [canvasRef.current, JSON.stringify(props.breathSensorList)])

   useEffect(() => {
      const buildingInfo = {
         buildingIdx: props.currBuildingIdx,
         floorIdx: props.currFloorIdx,
         buildingServiceType: props.currBuildingServiceType
      }
      canvasRef && canvasRef.current && canvasRef.current.id === undefined && settingObjectsToMap(canvasRef.current, '', '', '', '', buildingInfo, '', props.guardianliteList);
   }, [canvasRef.current, JSON.stringify(props.guardianliteList)])

   useEffect(() => {
      props.accessControlEnter.map(enter => {
         const doorId = enter.LogDoorID;
         const personId = enter.LogPersonID;
         const popup = document.getElementById('door' + doorId);
         if (popup && personId && personId.length > 0) {
            const element = popup;
            element.childNodes[0].src = `http://${websocket_url}/images/access_control_person/${personId}.png`;
            popup.style.display = 'initial';
            const timeoutId = setTimeout(() => {
               popup.style.display = 'none';
            }, 10 * 1000);
         }
      });
   }, [props.accessControlEnter])

   useEffect(() => {
      liveStreamRef.current = liveStream;
   }, [liveStream])

   useEffect(() => {
      liveEventStreamRef.current = liveEventStream;
   }, [liveEventStream])

   useEffect(() => {
      vitalsensorRef.current = connectedVitalsensor;
   }, [connectedVitalsensor])

   useEffect(() => {
      vitalsensorOnEventRef.current = onEventVitalsensor;
   }, [onEventVitalsensor])

   useEffect(() => {
      socketRef.current = props.socketClient;
   }, [props.socketClient])

   useEffect(() => {
      if ((vitalsensorRef.current && vitalsensorRef.current) === props.breathData.ipaddress) {
         updateVitalsensorChart(props.breathData.respiration);
      }
   }, [props.breathData.respiration])

   useEffect(() => {
      if ((vitalsensorOnEventRef.current && vitalsensorOnEventRef.current) === props.breathData.ipaddress) {
         updateVitalsensorChartOnEvent(props.breathData.respiration);
      }
   }, [props.breathData.respiration])

   useEffect(() => {
      devicePopupModalRef.current = devicePopupModal;
   }, [devicePopupModal]);

   useEffect(() => {
      deviceEventPopupModalRef.current = deviceEventPopupModal;
   }, [deviceEventPopupModal]);

   const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      swipeToSlide: true,
      className: "center",
      centerMode: true,
      afterChange: async function (index) {
         if (props.floorList && props.currBuildingIdx !== undefined && props.currBuildingServiceType !== undefined) {
            const floors = props.floorList.filter((floor) => {
               if (floor.building_idx === props.currBuildingIdx && floor.service_type === props.currBuildingServiceType) {
                  return true;
               } else {
                  return false;
               }
            });

            if (floors[index]) {
               await props.changeMapType(2, props.currBuildingIdx, floors[index].idx, props.currBuildingServiceType);
            }
         }
      },
   }

   const floorListShow = () => {
      const sortFloors = props.floorList.sort((a, b) => {
         const regex = /(-?\d+)?([^\d]+)?/;
         const aMatch = a.name.match(regex);
         const bMatch = b.name.match(regex);

         if (aMatch && bMatch) {
            const aNum = aMatch[1] ? parseInt(aMatch[1]) : undefined;
            const bNum = bMatch[1] ? parseInt(bMatch[1]) : undefined;
            const aStr = aMatch[2] ? aMatch[2].trim() : "";
            const bStr = bMatch[2] ? bMatch[2].trim() : "";

            if (aStr !== bStr) {
               return aStr.localeCompare(bStr);
            } else {
               if (aNum !== undefined && bNum !== undefined) {
                  return aNum - bNum;
               } else if (aNum !== undefined) {
                  return -1;
               } else if (bNum !== undefined) {
                  return 1;
               } else {
                  return 0;
               }
            }
         }
         return a.name.localeCompare(b.name);
      });

      if (sortFloors.length > 0) {
         return (
            <React.Fragment>
               <div>
                  <style>{cssstyle}</style>
                  <Slider {...settings}>
                     {
                        sortFloors.map((floor, index) => (
                           <h3 key={index} style={{ marginTop: '7px', marginBottom: '1rem' }} onClick={async () => {
                              if (props.currFloorIdx !== floor.idx) {
                                 await props.changeMapType(2, props.currBuildingIdx, floor.idx, props.currBuildingServiceType);
                              }
                           }} >
                              <span style={{ textShadow: 'rgb(86 59 59) 2px 2px 0px' }}>
                                 {floor.name}
                              </span>
                           </h3>
                        ))
                     }
                  </Slider>
               </div>
            </React.Fragment>
         )
      }
   }

   const outSideIconStyle = {
      position: 'absolute',
      left: '5.5rem',
      top: window.innerHeight * 0.9395,
      marginBottom: '50px',
      zIndex: '5000',
      textAlign: 'center',
      padding: '1.5px',
      borderRadius: '2px 2px 0 0',
      border: '1px',
   }

   const floorCarouselStyle = {
      position: 'absolute',
      left: '30%',
      top: window.innerHeight * 0.8895,
      zIndex: '5000',
      width: '745px',
      height: '60px',
      margin: '0 auto',
      padding: '0px 40px 40px 40px'
   }

   return (
      <div className={styles.layout} onContextMenu={useCM(menuConfig)}>
         <div style={outSideIconStyle}>
            <img src={iconOutside} style={{ width: '60px', height: '60px', cursor: 'pointer' }} onClick={moveToOutside} title="실외 지도" />
         </div>

         <div style={floorCarouselStyle}>
            {floorListShow()}
         </div>

         <div className={styles.center}>
            <div className={styles.mainContainer}>
               <TransformWrapper
                  ref={transformComponentRef}
               >
                  {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                     <>
                        <TransformComponent>
                           <canvas id={canvasId} ref={canvasRef} />
                           <BlinkDeviceEventIcon
                              deviceList={props.deviceList}
                              breathSensorList={props.breathSensorList}
                              currBuildingIdx={props.currBuildingIdx}
                              currFloorIdx={props.currFloorIdx}
                              currBuildingServiceType={props.currBuildingServiceType}
                           />
                           <BlinkCameraEventIcon
                              cameraList={props.cameraList}
                              currBuildingIdx={props.currBuildingIdx}
                              currFloorIdx={props.currFloorIdx}
                              currBuildingServiceType={props.currBuildingServiceType}
                           />
                        </TransformComponent>
                     </>
                  )}
               </TransformWrapper>
            </div>
         </div>
         <ContextMenuModal
            indoor
            handleShowModalCamera={handleShowModalCamera}
            handleShowModalEbell={handleShowModalEbell}
            handleShowModalDoor={handleShowModalDoor}
            handleShowModalVitalSensor={handleShowModalVitalSensor}
            handleShowModalMdet={handleShowModalMdet}
            handleShowModalGuardianlite={handleShowModalGuardianlite}
            handleVitalsensorScheduleGroup={handleVitalsensorScheduleGroup}
            handleVitalsensorValueGroup={handleVitalsensorValueGroup}
            handleOnOffVitalsensor={handleOnOffVitalsensor}
            handleBreathEventLog={handleBreathEventLog}
            handleInterlockCamera={handleInterlockCamera}
            handleRemoveIcon={handleRemoveIcon}
            handleShowModalAckAllEvents={handleShowModalAckAllEvents}
            handleClickNothing={handleClickNothing}
            handleLockDoor={handleLockDoor}
            handleUnlock10sDoor={handleUnlock10sDoor}
            handleUnLockDoor={handleUnLockDoor}
            handleDoorLog={handleDoorLog}
            handleShowDevicePopUp={handleShowDevicePopUp}
            handleShowEventDetail={handleShowEventDetail}
            handleShowModalVCounter={handleShowModalVCounter}
         />
         {/* <StreamingDoorRecDataModal show={doorRecDataModal.show} setShow={setDoorRecDataModal} message={doorRecDataModal.message} title={doorRecDataModal.title} callback={doorRecDataModal.callback} clickPoint={clickPoint} deviceList={props.deviceList} selectObject={selectObject} socketClient={props.socketClient} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> */}
         {cameraModal.show ? <AddCameraModal show={cameraModal.show} setShow={setCameraModal} message={cameraModal.message} title={cameraModal.title} callback={cameraModal.callback} clickPoint={clickPoint} cameraList={props.cameraList} inside={false} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {ebellModal.show ? <AddEbellModal show={ebellModal.show} setShow={setEbellModal} message={ebellModal.message} title={ebellModal.title} callback={ebellModal.callback} clickPoint={clickPoint} deviceList={props.deviceList} inside={false} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {doorModal.show ? <AddDoorModal show={doorModal.show} setShow={setDoorModal} message={doorModal.message} title={doorModal.title} callback={doorModal.callback} clickPoint={clickPoint} deviceList={props.deviceList} inside={false} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {guardianliteModal.show ? <AddGuardianliteModal show={guardianliteModal.show} setShow={setGuardianliteModal} messageName={guardianliteModal.messageName} messageIp={guardianliteModal.messageIp} title={guardianliteModal.title} callback={guardianliteModal.callback} clickPoint={clickPoint} deviceList={props.deviceList} inside={false} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {vCounterModal.show ?
            <AddVCounterToMapModal
               show={vCounterModal.show}
               setShow={setVCounterModal}
               message={vCounterModal.message}
               title={vCounterModal.title}
               callback={vCounterModal.callback}
               clickPoint={clickPoint}
               deviceList={props.deviceList}
               inside={true}
               buildingInfo={
                  { buildingIdx: props.currBuildingIdx, floorIdx: props.currFloorIdx, buildingServiceType: props.currBuildingServiceType }
               }
            />
            :
            null
         }
         {selectObject && selectObject.data && removeIconModal.show ?
            <RemoveIconModal
               show={removeIconModal.show}
               setShow={setRemoveIconModal}
               message={removeIconModal.message}
               title={removeIconModal.title}
               callback={removeIconModal.callback}
               selectObject={selectObject}
               cameraList={props.cameraList}
               deviceList={props.deviceList}
               breathSensorList={props.breathSensorList}
            /> : null}
         {<HandleVitalsensorScheduleModal show={vitalsensorScheduleModal.show} setShow={setVitalsensorScheduleModal} message={vitalsensorScheduleModal.message} title={vitalsensorScheduleModal.title} callback={vitalsensorScheduleModal.callback} selectObject={selectObject} clickPoint={clickPoint} inside={false} vitalsensorScheduleList={props.breathSensorScheduleList} />}
         {vitalSensorModal.show ? <AddVitalsensorModal show={vitalSensorModal.show} setShow={setVitalSensorModal} message={vitalSensorModal.message} title={vitalSensorModal.title} callback={vitalSensorModal.callback} clickPoint={clickPoint} selectObject={selectObject} deviceList={props.deviceList} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {mdetModal.show ? <AddMDetModal show={mdetModal.show} setShow={setMdetModal} message={mdetModal.message} title={mdetModal.title} callback={mdetModal.callback} clickPoint={clickPoint} selectObject={selectObject} deviceList={props.deviceList} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {interlockCameraModal.show ? <HandleInterlockCameraModal show={interlockCameraModal.show} setShow={setInterlockCameraModal} message={interlockCameraModal.message} title={interlockCameraModal.title} callback={interlockCameraModal.callback} clickPoint={clickPoint} selectObject={selectObject} cameraList={props.cameraList} deviceList={props.deviceList} breathSensorList={props.breathSensorList} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {acknowledgeModal.show ? <HandleAcknowledgeEventModal show={acknowledgeModal.show} setShow={setAcknowledgeModal} message={acknowledgeModal.message} title={acknowledgeModal.title} callback={acknowledgeModal.callback} clickPoint={clickPoint} selectObject={selectObject} cameraList={props.cameraList} deviceList={props.deviceList} breathSensorList={props.breathSensorList} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {
            vitalsensorValueModal.show &&
            <HandleVitalsensorValueModal
               show={vitalsensorValueModal.show}
               setShow={setVitalsensorValueModal}
               message={vitalsensorValueModal.message}
               title={vitalsensorValueModal.title}
               callback={vitalsensorValueModal.callback}
               selectObject={selectObject.data}
               clickPoint={clickPoint}
               inside={false}
               handleCloseVitalsensorValueModal={handleCloseVitalsensorValueModal}
            />
         }
         {
            devicePopupModal &&
            <DevicePopupModal
               deviceInfo={devicePopupModal}
               handleCloseDevicePopup={handleCloseDevicePopup}
               socketClient={props.socketClient}
               handleDisconnectLiveStream={handleDisconnectLiveStream}
               handleSetLiveStream={handleSetLiveStream}
               liveStream={liveStreamRef.current}
               deviceList={props.deviceList}
               cameraList={props.cameraList}
               breathData={(props.breathData.ipaddress === vitalsensorRef.current) && props.breathData}
               breathSocketClient={props.breathSocketClient}
               handleRespiration={props.handleRespiration}
               dataArr={dataArr}
               handleUpdateGuardianliteStatus={handleUpdateGuardianliteStatus}
            />
         }
         {deviceEventPopupModal &&
            <DevicePopupModal
               event
               deviceInfo={deviceEventPopupModal}
               handleCloseDeviceEventPopup={handleCloseDeviceEventPopup}
               socketClient={props.socketClient}
               handleDisconnectLiveEventStream={handleDisconnectLiveEventStream}
               handleSetLiveEventStream={handleSetLiveEventStream}
               liveStream={liveStreamRef.current}
               deviceList={props.deviceList}
               cameraList={props.cameraList}
               breathData={(props.breathData.ipaddress === vitalsensorOnEventRef.current) && props.breathData}
               breathSocketClient={props.breathSocketClient}
               handleRespiration={props.handleRespiration}
               liveEventStream={liveEventStreamRef.current}
               dataArr={dataArrOnEvent}
               handleUpdateGuardianliteStatus={handleUpdateGuardianliteStatus}
            />
         }
         <DoorAccessPerson
            websocketUrl={websocket_url}
            deviceList={props.deviceList}
            currBuildingIdx={props.currBuildingIdx}
            currFloorIdx={props.currFloorIdx}
            currBuildingServiceType={props.currBuildingServiceType}
         />
      </div>
   );
}

const cssstyle = `
height: 75px;

.slick-list {
   margin: 0 auto;
   padding: 80px 0px;
   position: relative;
   display: block;
   overflow: hidden;

   > .slick-track {
      position: relative; 
      top: 0;
      left: 0;
   
      display: block;
      margin-left: auto;
      margin-right: auto;
   }
}

.slick-slide > div {
   cursor: pointer;
}

h3 {
   color: #fff;
   font-size: 23px;
   line-height: 80px;
   margin: 10px;
   padding: 2%;
   position: relative;
   text-align: center;
}

.center .slick-center h3 {
   color: #e67e22;
   font-size: 32px;
   .shadow-test {
      text-shadow: 1px -1px 1px #f00;
   }
   opacity: 1;
   -ms-transform: scale(1.08);
   transform: scale(1.08);
}

.slick-next:before, .slick-prev:before {
   // color: #000;
   display: none
}

.slick-slider .slick-arrow.slick-prev, .slick-slider .slick-arrow.slick-next {
   background: transparent;
}

.slick-dots {
   position: absolute;
   bottom: 5px;
   display: block;
   width: 100%;
   list-style: none;
   text-align: center;
}      
`
// .slick-next:before, .slick-prev:before {
//     color: white;
// }
// .center h3 {
//     transition: all .3s ease;
// }
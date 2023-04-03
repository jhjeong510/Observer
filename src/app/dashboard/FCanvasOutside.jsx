import { fabric } from "fabric";
import React, { useState, useEffect, useRef } from "react";
import styles from './FCanvasOutside.module.css';
import * as common from './common';
import useContextMenu from "contextmenu";
import AddIconToMap from "./handlers/AddIconToCanvasHandler";
import { ContextMenuHandler, handleCloseContext } from "./handlers/ContextMenuHandler";
import AddBuildingModal from "../shared/modal/AddBuildingModal";
import AddCameraModal from "../shared/modal/AddCameraModal";
import AddPidsModal from "../shared/modal/AddPidsModal";
import AddEbellModal from "../shared/modal/AddEbellModal";
import RemovePidsModal from "../shared/modal/RemovePidsModal";
import RemoveIconModal from "../shared/modal/RemoveIconModal";
import RemoveFloorModal from "../shared/modal/RemoveFloorModal";
import ModifyBuildingNameModal from "../shared/modal/ModifyBuildingNameModal";
import HandleInterlockCameraModal from "../shared/modal/HandleInterlockCameraModal";
import HandleAcknowledgeEventModal from "../shared/modal/HandleAcknowledgeEventModal";
import ModifyIcon from "../shared/modal/ModifyIcon";
import backgroundImage from './icons/outdoor_map.png';
import AddFloorModal from "../shared/modal/AddFloorModal";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AddFenceModal from "../shared/modal/AddFenceModal";
import iconOutside from "./icons/movetooutsidemap.png";
import ShowDevicePopUp from './handlers/ShowDevicePopUp';
import DevicePopupModal from '../shared/modal/DevicePopupModal';
import ContextMenuModal from '../shared/modal/ContextMenuModal';
import AddGuardianliteModal from '../shared/modal/AddGuardianliteModal';
import { setGuardianliteChannel } from './api/apiService';
import BlinkDeviceEventIcon from "./BlinkDeviceEventIcon";
import BlinkCameraEventIcon from "./BlinkCameraEventIcon";
import WarningMsgModal from "../shared/modal/WarningMsgModal";
import AddVCounterToMapModal from "../shared/modal/AddVCounterToMapModal";
import AddMDetModal from '../shared/modal/AddMDetModal';

export default function FCanvasOutside(props) {
   const canvasRef = useRef(null);
   const isMountedRef = useRef(null);
   const transformComponentRef = useRef();
   const [canvas, setCanvas] = useState('');
   const [zoom, setZoom] = useState(true);
   const [selectParentObj, setSelectParentObj] = useState({});
   const [selectObject, setSelectObject] = useState({});
   const [contextMenu, useCM] = useContextMenu();
   const [buildingModal, setBuildingModal] = useState({ show: false, title: '', message: '', callback: false });
   const [vCounterModal, setVCounterModal] = useState({ show: false, title: '', message: '' });
   const [mdetModal, setMdetModal] = useState({ show: false, title: '', message: '', callback: false });
   const [pidsModal, setPidsModal] = useState({ show: false, title: '', message: '', callback: false });
   const [pidsRemoveModal, setPidsRemoveModal] = useState({ show: false, title: '', message: '', callback: false });
   const [fenceModal, setFenceModal] = useState({ show: false, title: '', message: '', callback: false, lineInfo: {} });
   const [floorModal, setFloorModal] = useState({ show: false, title: '', message: '', callback: false });
   const [cameraModal, setCameraModal] = useState({ show: false, title: '', message: '', callback: false });
   const [ebellModal, setEbellModal] = useState({ show: false, title: '', message: '', callback: false });
   const [guardianliteModal, setGuardianliteModal] = useState({ show: false, title: '', messageName: '', messageIp: '', callback: false });
   const [modifyBuildingModal, setModifyBuildingModal] = useState({ show: false, title: '', message: '', callback: false });
   const [removeIconModal, setRemoveIconModal] = useState({ show: false, title: '', message: '', callback: false });
   const [removeFloorModal, setRemoveFloorModal] = useState({ show: false, title: '', message: '', callback: false });
   const [modifyMapIcon, setModifyMapIcon] = useState({ show: false, title: '', message: '', callback: false });
   const [acknowledgeModal, setAcknowledgeModal] = useState({ show: false, title: '', message: '', callback: false });
   const [interlockCameraModal, setInterlockCameraModal] = useState({ show: false, title: '', message: '', callback: false });
   const [warningMsgModal, setWarningMsgModal] = useState({ show: false, title: '', message: '', callback: false });
   const [canvasEditMode, setCanvasEditMode] = useState(false);
   const [clickPoint, setClickPoint] = useState({ x: '', y: '' });
   const nodeRef = useRef(null);
   const [position, setPosition] = useState({ x: 0, y: 0 });
   const [Opacity, setOpacity] = useState(false);
   const menuConfig = {};
   const color = useRef('yellow');
   const [devicePopupModal, setDevicePopupModal] = useState(null);
   const [deviceEventPopupModal, setDeviceEventPopupModal] = useState(null);
   const devicePopupModalRef = useRef(null);
   const deviceEventPopupModalRef = useRef(null);
   const [liveStream, setLiveStream] = useState(undefined);
   const liveStreamRef = useRef(null);
   const [liveEventStream, setLiveEventStream] = useState(undefined);
   const liveEventStreamRef = useRef(null);
   const socketRef = useRef(null);

   const handleCloseDevicePopup = async (e) => {
      if (e) {
         e.preventDefault();
      }
      await handleDisconnectLiveStream();
      isMountedRef.current && await setDevicePopupModal(null);
   }

   const handleCloseDeviceEventPopup = async (e) => {
      if (e) {
         e.preventDefault();
      }
      await handleDisconnectLiveEventStream();
      isMountedRef.current && await setDeviceEventPopupModal(null);
   }

   useEffect(() => {
      isMountedRef.current = true;
      canvasRef.current && handleInitCanvas();
      canvasRef.current && !canvasRef.current.id && settingObjectsToMap(canvasRef.current, props.buildingList, props.cameraList, props.deviceList, props.pidsList, props.guardianliteList);
      return () => {
         handleCloseDevicePopup();
         handleCloseDeviceEventPopup();
         canvasRef.current = null;
         isMountedRef.current = null;
      }
   }, []);

   const handleInitCanvas = async () => {
      const resCanvas = await settingCanvas(initCanvas());
      isMountedRef.current && await setCanvas(resCanvas);
   }

   const initCanvas = () => {
      return (
         new fabric.Canvas('canvas', {
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

            // boundingbox 영역 제거 효과
            perPixelTargetFind: true,
            targetFindTolerance: 5,
         })
      )
   }

   // 추가
   const handleShowModalBuilding = () => {
      setBuildingModal({ show: true, title: '건물 추가', message: '건물명 입력 (*필수)', callback: false });
      handleCloseContext();
   }
   const handleShowModalFloor = () => {
      setFloorModal({ show: true, title: '층 추가', message: '', callback: false });
      handleCloseContext();
   }
   const handleShowModalCamera = () => {
      setCameraModal({ show: true, title: '카메라 추가', message: '카메라 선택', callback: false });
      handleCloseContext();
   }
   const handleShowModalEbell = () => {
      setEbellModal({ show: true, title: '비상벨 추가', message: '비상벨 선택', callback: false });
      handleCloseContext();
   }
   const handleShowModalGuardianlite = () => {
      setGuardianliteModal({ show: true, title: '전원장치 추가', messageName: '이름 (*필수)', messageIp: 'IP Address (*필수)', callback: false });
      handleCloseContext();
   }
   const handleAddPidsModal = async () => {
      setPidsModal({ show: true, title: 'PIDS 추가', message: 'Pids 선택', callback: false });
      handleCloseContext();
   }
   const handleShowModalVCounter = async => {
      setVCounterModal({ show: true, title: 'V-Counter 추가', message: 'V-Counter 선택' });
      handleCloseContext();
   }
   const handleShowModalMdet = () => {
      setMdetModal({ show: true, title: 'MDET 추가', message: 'MDET 추가', callback: false });
      handleCloseContext();
   }
   const handleRemovePidsModal = async () => {
      setPidsRemoveModal({ show: true, title: 'PIDS(Gdp200) 삭제', message: '등록된 PIDS(Gdp200) 목록', callback: false });
      handleCloseContext();
   }
   const handleAddFenceModal = (lineInfo) => {
      const objs = canvas.getObjects();
      console.log(objs);
      objs.forEach(object => {
         if (object.strokeWidth === 5) canvas.remove(object);
      })
      setFenceModal({ show: true, title: '울타리 추가', message: '울타리 선택', callback: false, lineInfo: lineInfo });
      handleCloseContext();
   }
   const handleInterlockCamera = () => {
      setInterlockCameraModal({ show: true, title: '카메라 연동', message: '카메라 연동', callback: false });
      handleCloseContext();
   }

   // 수정
   const handleShowModalModifyBuilding = () => {
      setModifyBuildingModal({ show: true, title: '건물명 수정', message: '건물 이름 입력(*필수)', callback: false });
      handleCloseContext();
   }
   const handleChangeIcon = () => {
      setModifyMapIcon({ show: true, title: '', message: '', callback: false });
      handleCloseContext();
   }

   // 삭제
   const handleRemoveIcon = () => {
      setRemoveIconModal({ show: true, title: '', message: '삭제 하시겠습니까?', callback: false });
      handleCloseContext();
   }
   const handleRemoveFloor = () => {
      setRemoveFloorModal({ show: true, title: '층 삭제', message: '층 목록', callback: false });
      handleCloseContext();
   }

   // 확인
   const handleShowModalAckAllEvents = () => {
      setAcknowledgeModal({ show: true, title: '이벤트 알림 해제', message: '해당 장치의 이벤트 알림을 해제하시겠습니까?', callback: false });
      handleCloseContext();
   }

   const handleClickNothing = (e) => {
      e.preventDefault();
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

   let unselectableObject = null;
   const drawStraight = () => {
      const res = props.deviceList.filter((device) => device.type === 'pids')
      if (res && res.length > 0) {
         handleCloseContext();
         setZoom(false);
         common.mouseEventOff(canvas);
         canvas.defaultCursor = 'crosshair';
         canvas.isDrawingMode = false;
         let line, isDown, label;
         let flag = false;
         canvas.on({
            'mouse:down:before': (e) => {
               flag = true;
               if (e.target && flag) {
                  canvas.discardActiveObject();
                  e.target.selectable = false;
                  unselectableObject = e.target
               }
               canvas.on({
                  'mouse:down': (opt) => {
                     let pointer = canvas.getPointer(opt.e);
                     const pointX = opt.absolutePointer.x;
                     const pointY = opt.absolutePointer.y;

                     let points = [pointX, pointY, pointX, pointY];
                     isDown = true;
                     line = new fabric.Line(points, {
                        stroke: 'yellow',
                        strokeWidth: 5,
                        strokeDashArray: [10, 10],
                        strokeDashOffset: 2,
                        // hasControls: false,
                        hasBorders: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        hoverCursor: 'default',
                        fill: 'red',
                        originX: 'center',
                        originY: 'center',
                        id: ++canvas.objectNum,
                     });
                     canvas.add(line);
                     canvas.setActiveObject(line)
                  },
                  'mouse:move': (o) => {
                     if (!isDown) return;
                     let pointer = canvas.getPointer(o.e);
                     line.set({ x2: pointer.x, y2: pointer.y });
                     canvas.renderAll();
                  },
                  'mouse:up': (o) => {
                     isDown = false;
                     flag = false;
                     canvas.defaultCursor = 'default';
                     if (unselectableObject && unselectableObject.main !== true) unselectableObject.selectable = true;
                     let objects = canvas.getObjects();
                     objects.forEach(object => {
                        if (object.main !== true) object.selectable = true;
                     })
                     common.mouseEventOff(canvas);
                     isMountedRef.current && setZoom(true);
                     // let lineInfo = {
                     //    x1: line.x1,
                     //    x2: line.x2,
                     //    y1: line.y1,
                     //    y2: line.y2,
                     //    left: line.left,
                     //    top: line.top,
                     // }
                     line.set({ left: clickPoint.x, top: clickPoint.y });
                     handleAddFenceModal(line);
                  },
                  'mouse:up:before': () => {
                     let objects = canvas.getObjects();
                     objects.forEach(object => { object.selectable = false; })
                  }
               })
            }
         })
      } else {
         setWarningMsgModal({ show: true, title: '도움말', message: 'PIDS를 추가하고 울타리를 설정해주세요.', callback: false });
         handleCloseContext();
      }

   }

   const eventHandler = {
      'mouse:over': (e) => {
         if (e.target) {
            if (e.target != canvas.getActiveObject()) {
               e.target._renderControls(e.target.canvas.contextTop, {
                  hasControls: false,
                  borderColor: 'red',
                  borderScaleFactor: 3,
               })
            }
         }
      },
      'mouse:out': (e) => {
         if (e.target) {
            e.target.canvas.clearContext(e.target.canvas.contextTop);
            canvas.renderAll();
         }
      },
      'mouse:down': async (opt) => {
         let pointer = canvas.getPointer(opt.e);
         const target = canvas.findTarget(opt, true);
         const pointX = opt.absolutePointer.x;
         const pointY = opt.absolutePointer.y;
         const clickXY = { x: pointX, y: pointY }
         let point1;
         isMountedRef.current && setClickPoint({ x: pointX, y: pointY });
         if (opt.button === 1) {
            const floor = props && props.floorList ? props.floorList.find((floor) => floor.building_idx === ((opt && opt.target && opt.target.data) ? (opt.target.data.buildingIdx) : ((opt && opt.subTargets[0] && opt.subTargets[0].data) ? (opt.subTargets[0].data.buildingIdx) : undefined))) : undefined;
            if ((opt && opt.target && opt.target.data) && floor && opt.target.data.icon === 'buildingicon') {
               props.changeMapType(2, opt.target.data.buildingIdx, floor.idx, opt.target.data.serviceType);
            } else if (opt.target && opt.target.data && opt.target.data.type !== 'building') {
               if (devicePopupModalRef.current && (devicePopupModalRef.current.type !== 'pids' ? (((devicePopupModalRef.current.ipaddress === opt.target.data.ipaddress) && (devicePopupModalRef.current.device_id === opt.target.data.device_id)) && (devicePopupModalRef.current.popUpType !== 'onlyCamera')) : ((devicePopupModalRef.current.device_id === opt.target.data.id) && (devicePopupModalRef.current.popUpType !== 'onlyCamera')))) {
                  return;
               } else {
                  await setDevicePopupModal();
               }
               const resPopUp = await ShowDevicePopUp(opt, canvas, opt.target.data.type === 'guardianlite' ? 'guardianlite' : 'optionCamera', false);
               if (deviceEventPopupModalRef.current && (deviceEventPopupModalRef.current.type !== 'pids' ? (deviceEventPopupModalRef.current.ipaddress === opt.target.data.ipaddress) : (deviceEventPopupModalRef.current.device_id === opt.target.data.id))) {
                  await handleCloseDeviceEventPopup();
               }
               resPopUp && await setDevicePopupModal(resPopUp);
            }
            handleCloseContext();
         } else if (opt.button === 3 && clickXY && canvas) {
            ContextMenuHandler(canvas, clickXY, opt);
            isMountedRef.current && setSelectParentObj(opt);
            isMountedRef.current && setSelectObject(target);
         }
      },
   }

   const syncMouseEvent = async () => {
      if (canvas) {
         canvas.__eventListeners = {};
         await canvas.on(eventHandler);
      }
   }

   useEffect(() => {
      let isLoaded = true;
      if (canvas && isLoaded) {
         canvas.on(eventHandler);
      }
      return () => {
         isLoaded = false;
      }
   }, [canvas, zoom, canvasEditMode]);

   useEffect(() => {
      liveStreamRef.current = liveStream;
   }, [liveStream])

   useEffect(() => {
      liveEventStreamRef.current = liveEventStream;
   }, [liveEventStream])

   useEffect(() => {
      socketRef.current = props.socketClient;
   }, [props.socketClient])

   useEffect(() => {
      canvasRef.current = canvas;
   }, [canvas])

   useEffect(() => {
      devicePopupModalRef.current = devicePopupModal;
   }, [devicePopupModal]);

   useEffect(() => {
      deviceEventPopupModalRef.current = deviceEventPopupModal;
   }, [deviceEventPopupModal]);

   useEffect(() => {
      isMountedRef.current = true;
      syncMouseEvent();
      return () => {
         isMountedRef.current = false;
      }
   }, [JSON.stringify(props.floorList)])

   const settingObjectsToMap = async (canvas, buildingList, cameraList, deviceList, pidsList, guardianliteList) => {
      const buildingInfo = {
         buildingIdx: 0,
         floorIdx: 0
      };
      if (canvas) {
         const addObjsRes = await AddIconToMap(canvas, buildingList, cameraList, deviceList, pidsList, buildingInfo, '', '', guardianliteList);
         isMountedRef && isMountedRef.current && await setCanvas(addObjsRes);
         await canvas.renderAll();
      }
   }

   useEffect(() => {
      canvas && settingObjectsToMap(canvas, props.buildingList, '', '', '', '');
   }, [canvas, JSON.stringify(props.buildingList)])

   useEffect(() => {
      canvas && settingObjectsToMap(canvas, '', props.cameraList, '', '', '');
   }, [canvas, JSON.stringify(props.cameraList)])

   useEffect(() => {
      canvas && settingObjectsToMap(canvas, '', '', props.deviceList, '', '');
   }, [canvas, JSON.stringify(props.deviceList)])

   useEffect(() => {
      canvas && settingObjectsToMap(canvas, '', '', '', '', props.guardianliteList);
   }, [canvas, JSON.stringify(props.guardianliteList)])

   useEffect(() => {
      canvas && settingObjectsToMap(canvas, '', '', '', props.pidsList, '');
   }, [canvas, JSON.stringify(props.pidsList)])

   const settingCanvas = (canvas) => {

      let innerWidth = common.getInnerSize(canvas)['innerWidth'];
      let innerHeight = common.getInnerSize(canvas)['innerHeight'];
      fabric.Image.fromURL(backgroundImage, (img) => {
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
      common.setCanvasCenter(canvas);

      let flag;
      window.addEventListener("resize", function (opt) {
         common.setCanvasCenter(canvas)
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
      return canvas;
   }

   const handleShowDevicePopUp = async (popUpType) => {
      const opt = selectParentObj;
      if (opt && opt.target && opt.target.data && opt.target.data.type !== 'building') {
         const resPopUp = await ShowDevicePopUp(opt, canvas, popUpType, false);
         if (resPopUp) {
            await handleCloseContext();
            if (devicePopupModalRef.current && (devicePopupModalRef.current.type !== 'pids' ? (((devicePopupModalRef.current.ipaddress === opt.target.data.ipaddress) && (devicePopupModalRef.current.device_id === opt.target.data.device_id)) && (devicePopupModalRef.current.popUpType === 'onlyCamera')) : ((devicePopupModalRef.current.device_id === opt.target.data.id) && (devicePopupModalRef.current.popUpType === 'onlyCamera')))) {
               return;
            } else {
               await setDevicePopupModal();
            }
            if (deviceEventPopupModalRef.current && (deviceEventPopupModalRef.current.type !== 'pids' ? (deviceEventPopupModalRef.current.ipaddress === opt.target.data.ipaddress) : (deviceEventPopupModalRef.current.device_id === opt.target.data.id))) {
               await handleCloseDeviceEventPopup();
            }
            await setDevicePopupModal(resPopUp);
         }
      }
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

   const findEventPopupDevice = async (eventPopupProps) => {
      console.log(eventPopupProps);
      switch (eventPopupProps.deviceType) {
         case 'camera':
            return props.cameraList.find((cameraDetail) => (cameraDetail.cameraid === eventPopupProps.deviceId));
         case 'ebell':
            return props.deviceList.find((deviceDetail) => ((deviceDetail.id === eventPopupProps.deviceId) && (deviceDetail.service_type === eventPopupProps.serviceType)));
         case 'zone':
            return props.pidsList.find((pidsDetail) => pidsDetail.pidsid === eventPopupProps.deviceId);
         case 'mdet':
            return props.deviceList.find((deviceDetail) => ((deviceDetail.id === eventPopupProps.deviceId) && (deviceDetail.service_type === eventPopupProps.serviceType)));
      }
   }

   const zoomOutInit = () => {
      const { resetTransform } = transformComponentRef.current;
      resetTransform();
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
         zoomOutInit();
         resEventPopup = await ShowDevicePopUp(opt, canvas, 'optionCamera', true, eventPopupProps.eventName);
      }
      if (devicePopupModalRef.current && (devicePopupModalRef.current.type !== 'pids' ? ((devicePopupModalRef.current.ipaddress === opt.target.data.ipaddress) && (devicePopupModalRef.current.device_id === opt.target.data.device_id)) : devicePopupModalRef.current.device_id === opt.target.data.pidsid)) {
         await handleCloseDevicePopup();
      }
      if (deviceEventPopupModalRef.current) {
         await handleCloseDeviceEventPopup();
      }
      resEventPopup && isMountedRef.current && await setDeviceEventPopupModal(resEventPopup);
   }

   useEffect(() => {
      canvasRef && canvasRef.current && props.eventPopup.timestamp !== 0 && handleShowEventPopup(props.eventPopup);
   }, [props.eventPopup])

   return (
      <div className={styles.layout} onContextMenu={useCM(menuConfig)}>
         <div className={styles.center}>
            <div className={styles.mainContainer}>
               <TransformWrapper
                  disabled={!zoom}
                  panning={{ disabled: !zoom }}
                  ref={transformComponentRef}
               >
                  {({ zoomIn, zoomOut, resetTransform, zoomToElement, ...rest }) => ( // zoom 버튼 생성 시 사용
                     <>
                        <TransformComponent>
                           <canvas id="canvas" ref={canvasRef} />
                           {/* <div className={styles.sonarWrapper}>
                              <div className={styles.sonarEmitter}>
                                 <div className={styles.sonarWave}></div>
                              </div>
                           </div> */}
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
            handleShowModalBuilding={handleShowModalBuilding}
            handleShowModalFloor={handleShowModalFloor}
            handleShowModalCamera={handleShowModalCamera}
            handleShowModalEbell={handleShowModalEbell}
            handleShowModalGuardianlite={handleShowModalGuardianlite}
            handleAddPidsModal={handleAddPidsModal}
            handleRemovePidsModal={handleRemovePidsModal}
            handleInterlockCamera={handleInterlockCamera}
            handleShowModalModifyBuilding={handleShowModalModifyBuilding}
            handleChangeIcon={handleChangeIcon}
            handleRemoveIcon={handleRemoveIcon}
            handleRemoveFloor={handleRemoveFloor}
            handleShowModalAckAllEvents={handleShowModalAckAllEvents}
            handleClickNothing={handleClickNothing}
            handleShowDevicePopUp={handleShowDevicePopUp}
            drawStraight={drawStraight}
            handleShowModalVCounter={handleShowModalVCounter}
            handleShowModalMdet={handleShowModalMdet}
         />
         {buildingModal.show ? <AddBuildingModal show={buildingModal.show} setShow={setBuildingModal} message={buildingModal.message} title={buildingModal.title} callback={buildingModal.callback} clickPoint={clickPoint} buildingList={props.buildingList} /> : null}
         {selectObject && selectObject !== undefined && floorModal.show ? <AddFloorModal show={floorModal.show} setShow={setFloorModal} message={floorModal.message} title={floorModal.title} callback={floorModal.callback} clickPoint={clickPoint} selectObject={selectObject} floorImageLists={props.floorImageList} floorList={props.floorList} /> : null}
         {cameraModal.show ? <AddCameraModal show={cameraModal.show} setShow={setCameraModal} message={cameraModal.message} title={cameraModal.title} callback={cameraModal.callback} clickPoint={clickPoint} cameraList={props.cameraList} inside={false} /> : null}
         {ebellModal.show ? <AddEbellModal show={ebellModal.show} setShow={setEbellModal} message={ebellModal.message} title={ebellModal.title} callback={ebellModal.callback} clickPoint={clickPoint} deviceList={props.deviceList} inside={false} /> : null}
         {guardianliteModal.show ? <AddGuardianliteModal show={guardianliteModal.show} setShow={setGuardianliteModal} messageName={guardianliteModal.messageName} messageIp={guardianliteModal.messageIp} title={guardianliteModal.title} callback={guardianliteModal.callback} clickPoint={clickPoint} guardianlites={props.guardianliteList} inside={false} deviceList={props.deviceList} /> : null}
         {pidsModal.show ? <AddPidsModal show={pidsModal.show} setShow={setPidsModal} message={pidsModal.message} title={pidsModal.title} callback={pidsModal.callback} clickPoint={clickPoint} deviceList={props.deviceList} inside={false} /> : null}
         {vCounterModal.show ?
            <AddVCounterToMapModal
               show={vCounterModal.show}
               setShow={setVCounterModal}
               message={vCounterModal.message}
               title={vCounterModal.title}
               callback={vCounterModal.callback}
               clickPoint={clickPoint}
               deviceList={props.deviceList}
               inside={false}
            />
            :
            null
         }
         {pidsRemoveModal.show ? <RemovePidsModal show={pidsRemoveModal.show} setShow={setPidsRemoveModal} message={pidsRemoveModal.message} title={pidsRemoveModal.title} callback={pidsRemoveModal.callback} clickPoint={clickPoint} deviceList={props.deviceList} inside={false} /> : null}
         {modifyMapIcon.show ? <ModifyIcon show={modifyMapIcon.show} setShow={setModifyMapIcon} message={modifyMapIcon.message} title={modifyMapIcon.title} inside={false} selectObject={selectObject} canvas={canvas} color={color} /> : null}
         {selectObject && selectObject !== undefined && modifyBuildingModal.show ? <ModifyBuildingNameModal show={modifyBuildingModal.show} setShow={setModifyBuildingModal} message={modifyBuildingModal.message} title={modifyBuildingModal.title} callback={modifyBuildingModal.callback} selectObject={selectObject} buildingList={props.buildingList} /> : null}
         {selectObject && selectObject !== undefined && removeIconModal.show ? <RemoveIconModal show={removeIconModal.show} setShow={setRemoveIconModal} message={removeIconModal.message} title={removeIconModal.title} callback={removeIconModal.callback} selectObject={selectObject} /> : null}
         {<AddFenceModal show={fenceModal.show} setShow={setFenceModal} message={fenceModal.message} title={fenceModal.title} callback={fenceModal.callback} lineInfo={fenceModal.lineInfo} selectObject={selectObject} pidsList={props.pidsList} />}
         {selectObject && selectObject !== undefined && removeFloorModal.show ? <RemoveFloorModal show={removeFloorModal.show} setShow={setRemoveFloorModal} message={removeFloorModal.message} title={removeFloorModal.title} callback={removeFloorModal.callback} selectObject={selectObject} floorList={props.floorList} /> : null}
         {mdetModal.show ? <AddMDetModal show={mdetModal.show} setShow={setMdetModal} message={mdetModal.message} title={mdetModal.title} callback={mdetModal.callback} clickPoint={clickPoint} selectObject={selectObject} deviceList={props.deviceList} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {interlockCameraModal.show ? <HandleInterlockCameraModal show={interlockCameraModal.show} setShow={setInterlockCameraModal} message={interlockCameraModal.message} title={interlockCameraModal.title} callback={interlockCameraModal.callback} clickPoint={clickPoint} selectObject={selectObject} cameraList={props.cameraList} deviceList={props.deviceList} breathSensorList={props.breathSensorList} pidsList={props.pidsList} buildingInfo={{ buildingIdx: props.currBuildingIdx, buildingServiceType: props.currBuildingServiceType, floorIdx: props.currFloorIdx }} /> : null}
         {acknowledgeModal.show ? <HandleAcknowledgeEventModal show={acknowledgeModal.show} setShow={setAcknowledgeModal} message={acknowledgeModal.message} title={acknowledgeModal.title} callback={acknowledgeModal.callback} clickPoint={clickPoint} selectObject={selectObject} /> : null}
         {devicePopupModal &&
            <DevicePopupModal
               deviceInfo={devicePopupModal}
               handleCloseDevicePopup={handleCloseDevicePopup}
               socketClient={props.socketClient}
               handleDisconnectLiveStream={handleDisconnectLiveStream}
               handleSetLiveStream={handleSetLiveStream}
               liveStream={liveStreamRef.current}
               liveEventStream={liveEventStreamRef.current}
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
               liveEventStream={liveEventStreamRef.current}
               handleUpdateGuardianliteStatus={handleUpdateGuardianliteStatus}
            />
         }
         <WarningMsgModal
            show={warningMsgModal.show} setShow={setWarningMsgModal} message={warningMsgModal.message} title={warningMsgModal.title}
         />
      </div>
   );
}
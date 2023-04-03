var express = require('express');
var router = express.Router();

const { tokenCheck } = require('../middleware/tokenCheck');
const observerController = require('../controllers/observerController');

router.post('/login', observerController.login);
router.post('/logout', observerController.logout);
router.get('/checksession', observerController.checkSession);
router.get('/websocketurl', observerController.getWebsocketUrl);

// router.get('/mapimage', tokenCheck, observerController.getMapImage);
router.get('/mapimage', observerController.getMapImage);

// 건물 
router.get('/building', observerController.getBuilding);
router.post('/addBuilding', observerController.addBuilding);
router.post('/building', observerController.removeBuilding);
router.put('/building',observerController.modifyBuilding)

// 층 
router.get('/floor', observerController.getFloor);
router.get('/findFloor', observerController.findFloor);
router.post('/addFloor', observerController.addFloor);
router.post('/floor', observerController.removeFloor);
router.put('/floor',observerController.modifyFloor)

// 장비 조회
router.get('/device', observerController.getDevice);
router.get('/camera', observerController.getCameraList);
router.get('/pids', observerController.getPidsList);
router.get('/vitalsensor', observerController.getVitalsensorList);

// 카메라의 위치정보 삭제
router.put('/camera', observerController.updateCamera);
// 출입문의 위치정보 삭제
router.put('/door', observerController.updateDoor);
// 비상벨의 위치정보 삭제
router.put('/ebell', observerController.updateEbell);
// 비상벨 카메라 설정
router.put('/cameraForEbell', observerController.cameraForEbell);

// 출입문 연동 카메라 설정
router.put('/cameraForDoor', observerController.cameraForDoor);
// 호흡센서 연동 카메라 설정
router.put('/cameraForVitalsensor', observerController.cameraForVitalsensor);
router.put('/cameraForMdet', observerController.cameraForMdet);

// 호흡센서 위치정보 삭제
router.put('/vitalsensor', observerController.removeVitalsensor);
// 호흡이벤트 생성
router.post('/breathEvent', observerController.addVitalEvent);
// 호흡이벤트 조회
router.get('/getVitalLog', observerController.getVitalLog);
router.get('/getVitalLogData', observerController.getVitalLogData); // 임계치 자동설정 용 min, max, avg
// N-Doctor 이벤트 생성
router.post('/ndoctorevent', observerController.addNDoctorEvent);

//MGIST 지능형 이벤트 생성
router.post('/vms/event/detection/start/fire', observerController.detectFire);
router.post('/vms/event/detection/start/smoke', observerController.detectSmoke);
router.post('/vms/event/detection/start/motion', observerController.detectMotion);
router.post('/vms/event/detection/start/loitering', observerController.detectLoitering);
router.post('/vms/event/detection/start/lostobject', observerController.detectLostObject);
router.post('/vms/event/detection/start/enterarea', observerController.detectEnterArea);
router.post('/vms/event/detection/start/falldown', observerController.detectFallDown);
router.post('/vms/event/detection/start/handUp', observerController.detectHandup);

// 출입문 제어
router.post('/doorcontrol', observerController.doorControl);

// 호흡센서 스케줄 설정
router.put('/scheduleSetting', observerController.setVitalsensorSchedule);
router.put('/delSchedule', observerController.delSchedule);
router.get('/schedule', observerController.getScheduleTime);
router.put('/vitalsensorStatus', observerController.vitalsensorChangeUseStatus);
router.put('/vitalValue', observerController.setVitalValue); // 호흡센서 임계치 설정 
router.get('/scheduleGroup', observerController.getScheduleGroup); // 스케줄 그룹 조회
router.put('/scheduleGroup', observerController.setScheduleGroup); // 스케줄 그룹 생성
router.put('/scheduleGroupApply', observerController.setScheduleGroupApply); // 스케줄 그룹 센서에 적용
router.put('/groupApplyToAll', observerController.setGroupApplyToAll); // 스케줄 그룹 일괄적용 
router.put('/setEachScheduleGroup', observerController.setEachScheduleGroup); // 스케줄 그룹 아이콘 별 개별적용 
router.put('/setEachVitalValue', observerController.setEachVitalValue); // 스케줄 그룹 아이콘 별 개별적용 

// 가디언라이트
router.get('/guardianlite', observerController.getGuardianlite);
router.post('/guardianlite', observerController.createGuardianlite);
router.delete('/guardianlite', observerController.deleteGuardianlite);
router.put('/guardianlitechannel', observerController.setGuardianliteChannel);

// PIDS
router.post('/pids', observerController.createPids);
router.put('/pidsZone', observerController.pidsZoneInterlock);
// PIDS 상태값 변경 임시
router.post('/pidsEvent', observerController.pidsEvent);
// PIDS 연동 카메라 설정
router.put('/cameraForPids', observerController.cameraForPids);
// PIDS ZONE 삭제
router.put('/pids', observerController.removePids);
// PIDS(DP200) 삭제 위치정보
router.put('/pidsGdp200', observerController.removePidsGdp200);
// gpd200 리스트 삭제
router.put('/removePidsGdp200', observerController.removePidsGdp); 

// node 조회 - getEvents REST API로 대체
// router.get('/node', observerController.getNodeAndHistory); // 장치리스트 장치 히스토리

// 우측 패널 이벤트 조회 (전체조회, 선택이벤트조회)
router.get('/selectEvent',observerController.selectEvent);
// 이벤트 영상재생
router.get('/eventRecData', observerController.eventRecData);
// 스냅샷 
router.get('/getSnapshot', observerController.getSnapshot);
// 스냅샷 로컬 저장
router.get('/snapshotLocalPathSave', observerController.snapshotLocalPathSave);
// 스냅샷 삭제
router.get('/delSnapshot', observerController.delSnapshot);
// 스냅샷 url 
router.get('/makeDownloadUrl', observerController.makeDownloadUrl)
// 스냅샷 path 조회
router.get('/getSnapshotPath', observerController.getSnapshotPath);

// 전체 이벤트 가져오기
router.get('/events', observerController.getEvents);
// 마지막 이벤트 가져오기
router.get('/lastEvents', observerController.getLastEvents);
// 실시간 이벤트 확인
router.put('/acknowledge', observerController.setAcknowledge);
// 히스토리 차트 이벤트
router.get('/getEventsForChart', observerController.getEventsForChart);

// 이벤트 조회
router.get('/inquiryEvent', observerController.getInquiryEvents);

//빌보드 이벤트 표시
router.get('/billboard', observerController.getBillboard);
router.delete('/billboard', observerController.removeBillboard);

router.get('/getCameraListByInfo', tokenCheck, observerController.getCameraListByInfo);
router.get('/getDbCameraList', tokenCheck, observerController.getDbCameraList);
router.get('/getcameralivestreamurl', observerController.getDbCameraLiveStream);

// 장비에 위치정보 추가
router.put('/addLocation', observerController.addLocation);

// ANPR 카메라 번호판 인식
router.get('/carRecognition', observerController.getCarRecognition);

// ANPR 카메라 번호판 관리
router.post('/recognizePlate', observerController.recognizePlate);
router.get('/carNumber', observerController.getCarNumber);
router.post('/carNumber', observerController.createCarNumber);
router.delete('/carNumber', observerController.removeCarNumber);

// vms 정보 조회, 추가, 수정, 삭제
router.post('/vms', observerController.createVms);
router.get('/vms', observerController.getVms);
router.put('/vms', observerController.modifyVms);
router.delete('/vms', observerController.deleteVms);

// vms에서 카메라 정보 읽어와서 저장하기
router.post('/vmscamera', observerController.saveCameraFromVms);

// 출입통제
router.get('/accesscontrollog', observerController.getAccessControlLog);
router.put('/accesscontrolperson', observerController.reloadAccessControlPerson);
router.get('/accessEventRec', observerController.accessEventRec);

// 이벤트 종류 설정
router.get('/eventType', observerController.getEventTypes);
router.put('/eventType', observerController.modifyEventType);

// 옵저버 설정
router.get('/setting', observerController.getSetting);
router.put('/setting', observerController.updateSetting);

// 보고서
router.get('/defaultReport', observerController.getReport);
router.get('/detailReport', observerController.getDetailReport);
router.get('/reportDetailEvents', observerController.reportDetailEvents);

// 타워램프 설정
router.put('/towerlamp', observerController.setTowerlamp);

// 호흡센서 자동 임계치 설정
router.put('/vitalthresholdcalc', observerController.setVitalThresholdCalc);

router.post('/parkingcontrol', observerController.parkingControl);
router.get('/parkingCamera', observerController.getParkingCamera);
router.patch('/parkingCamera', observerController.setParkingCamera);
router.delete('/parkingCamera', observerController.deleteParkingCamera);
router.get('/parkingCoords', observerController.getParkingCoords);
router.get('/parkingArea', observerController.getParkingArea);
router.get('/parkingspace', observerController.getParkingSpace);
router.put('/parkingspace', observerController.setParkingSpace);
router.delete('/parkingspace', observerController.removeParkingSpace);
router.get('/parkingDataLog', observerController.getParkingDataLog);

// v-counter 
router.post('/vCounter', observerController.addVCounter);
router.put('/vCounter', observerController.updateVCounter);
router.get('/vCounter', observerController.getVCounterList);
router.put('/vCounter', observerController.removeVCounter);
router.get('/vCounterDataLog', observerController.getVCounterDataLog);

// vit
router.get('/crowdDensityCount', observerController.crowdDensityCount);
router.get('/crowdDensityCountLog', observerController.crowdDensityCountLog);
router.post('/crowdDensityCamera', observerController.addCrowdDensityCamera);
router.get('/crowdDensityCamera', observerController.getCrowdDensityCamera);
router.put('/crowdDensityThreshold', observerController.updateCrowdDensityThreshold);

// m-det
router.put('/mdet', observerController.removeMdet)
router.post('/mdet', observerController.detectMetal)

module.exports = router;


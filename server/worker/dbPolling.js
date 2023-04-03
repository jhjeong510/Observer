const { Client } = require('pg');
const { format, addHours, subDays } = require('date-fns');
const fs = require('fs');
const path = require('path');
const dbManager = require('../db/dbManager');
const observerService = require('../services/observerService');
const { parkingRedZoneCheck } = require('./parkingRedZone');

let timerId;
let timerIdAcss;
const pollingInterval = 10 * 1000;
const pollingIntervalAcss = 5 * 1000;
const pollingIntervalParkingRedZone = 6 * 1000;
const pollingIntervalCrowdDensity = 12 * 100;

ebellQuery = async (query) => {
  const clientSelect = new Client({
    host: process.env.EBELL_DB_HOST,
    port: process.env.EBELL_DB_PORT,
    database: process.env.EBELL_DB_DBNAME,
    user: process.env.EBELL_DB_USER,
    password: process.env.EBELL_DB_PASSWORD,  });

  try {
    await clientSelect.connect();
    if (!query) { throw 'query param is undefined'; }
    const res = await clientSelect.query(query);
    await clientSelect.end();
    return res;
  } catch (error) {
    console.log('ebellQuery_query error:', error);
  }
}

selectCtlQuery = async (query) => {
  const clientSelect = new Client({
    host: process.env.SELECTCTL_DB_HOST,
    port: process.env.SELECTCTL_DB_PORT,
    database: process.env.SELECTCTL_DB_DBNAME,
    user: process.env.SELECTCTL_DB_USER,
    password: process.env.SELECTCTL_DB_PASSWORD,
  });

  try {
    await clientSelect.connect();
    if (!query) { throw 'query param is undefined'; }
    const res = await clientSelect.query(query);
    await clientSelect.end();
    return res;
  } catch (error) {
    console.log('selectCtlQuery_query error:', error);
  }
}

const pollingEbellBuilding = async () => {
  try {
    let query = `SELECT * FROM eb_building ORDER BY idx`;
    const resEbellFloow = await ebellQuery(query);
    if (resEbellFloow && resEbellFloow.rows.length > 0) {
      const strArr = resEbellFloow.rows.map((row) => {
        const strValue = `(
                    ${row['idx']}, 
                    '${row['name']}', 
                    '${row['description']}', 
                    '${row['left_location']}', 
                    '${row['top_location']}',
                    'ebell')`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_building" (
                "idx", 
                "name", 
                "description",
                "left_location", 
                "top_location", 
                "service_type") VALUES ${queryValues} 
                ON CONFLICT (idx, service_type) DO 
                UPDATE SET
                name=EXCLUDED.name,
                description=EXCLUDED.description,
                left_location=EXCLUDED.left_location,
                top_location=EXCLUDED.top_location;`
      const res3 = await dbManager.pgQuery(queryString);
      console.log(`ebell building polling: ${res3.rowCount} rows`);
    }
  } catch (error) {
    console.log('polling EbellBuilding:', error);
  }
}

const pollingEbellFloor = async () => {
  try {
    let query = `SELECT * FROM eb_group ORDER BY idx`;
    const resEbellFloow = await ebellQuery(query);
    if (resEbellFloow && resEbellFloow.rows.length > 0) {
      const strArr = resEbellFloow.rows.map((row) => {
        const strValue = `(
                    ${row['idx']}, 
                    '${row['name']}', 
                    ${row['building_idx']}, 
                    '${row['description']}', 
                    '${row['map_image']}',
                    'ebell')`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_floor" (
                "idx", 
                "name", 
                "building_idx",
                "description", 
                "map_image", 
                "service_type") VALUES ${queryValues} 
                ON CONFLICT (idx, service_type) DO 
                UPDATE SET
                name=EXCLUDED.name,
                building_idx=EXCLUDED.building_idx,
                description=EXCLUDED.description,
                map_image=EXCLUDED.map_image;`
      const res3 = await dbManager.pgQuery(queryString);
      console.log(`ebell floor polling: ${res3.rowCount} rows`);
    }
  } catch (error) {
    console.log('polling EbellFloor:', error);
  }
}

// ob_device 의 type이 camera 인것만 읽어서 ob_camera에 upsert 함
const pollingEbellCamera = async () => {
  try {
    let query = `SELECT d.idx, g.building_idx, d.group_idx, d.left_location, d.top_location, c.display_id, c.display_name, c.ip_address, c.telemetry_control_id, c.telemetry_control_preset 
    FROM eb_device d
    INNER JOIN camera c ON d.camera_id = CAST(c.idx AS TEXT)
    LEFT OUTER JOIN eb_group g ON d.group_idx = g.idx
    WHERE d."type"='camera'`;
    const resEbellCamera = await ebellQuery(query);
    if (resEbellCamera && resEbellCamera.rows.length > 0) {
      const strArr = resEbellCamera.rows.map((row) => {
        const strValue = `(
                    '${row['display_id']}',
                    ${row['building_idx']},
                    'ebell',
                    ${row['group_idx']},
                    '${row['display_name']}',
                    '${row['ip_address']}', 
                    '${row['left_location']}', 
                    '${row['top_location']}', 
                    '${row['telemetry_control_id']}', 
                    '${row['telemetry_control_preset']}'
                    )`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_camera" AS ori(
                "id", 
                "building_idx",
                "building_service_type",
                "floor_idx",
                "name", 
                "ipaddress", 
                "left_location",
                "top_location",
                "telemetry_control_id", 
                "telemetry_control_preset"
                ) VALUES ${queryValues} 
                ON CONFLICT (id) DO 
                UPDATE SET
                building_idx=EXCLUDED.building_idx,
                building_service_type=EXCLUDED.building_service_type,
                floor_idx=EXCLUDED.floor_idx,
                left_location=EXCLUDED.left_location,
                top_location=EXCLUDED.top_location,
                telemetry_control_id=EXCLUDED.telemetry_control_id,
                telemetry_control_preset=EXCLUDED.telemetry_control_preset,
                upserted_at=NOW()`;
      const resInsert = await dbManager.pgQuery(queryString);
      console.log(`ebell camera polling: ${resInsert.rowCount} rows`);
      
      const queryStringDiff = `SELECT COUNT(*) AS cnt FROM "ob_camera" WHERE updated_at != upserted_at;`;
      const resDiff = await dbManager.pgQuery(queryStringDiff);
      if (resDiff && resDiff.rows && resDiff.rows.length>0){
        if (parseInt(resDiff.rows[0].cnt) > 0){
          if (global.websocket) {
            global.websocket.emit("cameraList", { cameraList: resDiff.rows[0].cnt });
            
            const queryUpsertTime = `UPDATE "ob_camera" SET updated_at = upserted_at WHERE updated_at != upserted_at;`;
            const resUpsertTime = await dbManager.pgQuery(queryUpsertTime);
          }
        }
      }
    }
  } catch (error) {
    console.log('polling EbellCamera:', error);
  }
}

// 아래 방식은 사용안함(eb_device의 type이 camera 인것만 읽어서 처리하게 수정)
// 비상벨의 camera 테이블에서 데이터 읽어서 ob_camera에 insert 하는 방식
const pollingEbellCamera_old = async () => {
  try {
    let query = `SELECT * FROM camera ORDER BY display_id`;
    const resEbellCamera = await ebellQuery(query);
    if (resEbellCamera && resEbellCamera.rows.length > 0) {
      const strArr = resEbellCamera.rows.map((row) => {
        const strValue = `(
                    '${row['display_id']}',
                    0,
                    0, 
                    '${row['display_name']}',
                    '${row['ip_address']}', 
                    '${row['telemetry_control_id']}', 
                    '${row['telemetry_control_preset']}'
                    )`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_camera" AS ori(
                "id", 
                "building_idx",
                "floor_idx",
                "name", 
                "ipaddress", 
                "telemetry_control_id", 
                "telemetry_control_preset"
                ) VALUES ${queryValues} 
                ON CONFLICT (id) DO 
                UPDATE SET
                telemetry_control_id=EXCLUDED.telemetry_control_id,
                telemetry_control_preset=EXCLUDED.telemetry_control_preset`;
      const resInsert = await dbManager.pgQuery(queryString);
      console.log(`ebell camera polling: ${resInsert.rowCount} rows`);
      
      if (resInsert && resInsert.rowCount && resInsert.rowCount>0){
        if (global.websocket) {
          global.websocket.emit("cameraList", { cameraList: resInsert.rowCount });
        }
      }
    }
  } catch (error) {
    console.log('polling EbellCamera:', error);
  }
}

const pollingEbellDevice = async () => {
  try {
    let query = `SELECT * FROM eb_device 
      WHERE type='ebell' ORDER BY idx`;
    const resEbellDevice = await ebellQuery(query);
    if (resEbellDevice && resEbellDevice.rows.length > 0) {
      const strArr = resEbellDevice.rows.map((row) => {
        const strValue = `(
                    ${row['idx']}, 
                    '${row['extension']}',
                    0,
                    'ebell',
                    0, 
                    '${row['type']}', 
                    '${row['name']}', 
                    '${row['location']}', 
                    '${row['ipaddress']}',
                    '', 
                    '',  
                    '${row['camera_id_sub1']}', 
                    '${row['camera_id_sub2']}', 
                    '${row['camera_preset_start']}', 
                    '${row['camera_preset_end']}', 
                    ${row['status']},
                    'ebell')`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_device" AS ori(
                "idx", 
                "id", 
                "building_idx",
                "building_service_type",
                "floor_idx", 
                "type", 
                "name", 
                "location", 
                "ipaddress",
                "left_location", 
                "top_location", 
                "camera_id_sub1", 
                "camera_id_sub2", 
                "camera_preset_start", 
                "camera_preset_end", 
                "status",
                "service_type") VALUES ${queryValues} 
                ON CONFLICT (idx, service_type) DO 
                UPDATE SET
                id=EXCLUDED.id,
                type=EXCLUDED.type,
                name=EXCLUDED.name,
                location=EXCLUDED.location,
                ipaddress=EXCLUDED.ipaddress,
                camera_id_sub1=EXCLUDED.camera_id_sub1,
                camera_id_sub2=EXCLUDED.camera_id_sub2,
                camera_preset_start=EXCLUDED.camera_preset_start,
                camera_preset_end=EXCLUDED.camera_preset_end,
                status=EXCLUDED.status,
                upserted_at=NOW()
                WHERE ori.id != EXCLUDED.id OR 
                ori.type != EXCLUDED.type OR 
                ori.name != EXCLUDED.name OR 
                ori.location != EXCLUDED.location OR 
                ori.ipaddress != EXCLUDED.ipaddress OR 
                ori.camera_id_sub1 != EXCLUDED.camera_id_sub1 OR 
                ori.camera_id_sub2 != EXCLUDED.camera_id_sub2 OR 
                ori.camera_preset_start != EXCLUDED.camera_preset_start OR 
                ori.camera_preset_end != EXCLUDED.camera_preset_end OR 
                ori.status != EXCLUDED.status;`;
      const resUpsert = await dbManager.pgQuery(queryString);
      // console.log(`ebell device polling: ${resUpsert.rowCount} rows`);
      const queryStringDiff = `SELECT COUNT(*) AS cnt FROM "ob_device" WHERE service_type='ebell' AND updated_at != upserted_at;`;
      const resDiff = await dbManager.pgQuery(queryStringDiff);
      if (resDiff && resDiff.rows && resDiff.rows.length>0){
        if (parseInt(resDiff.rows[0].cnt) > 0){
          if (global.websocket) {
            //console.log('>>>> ebell device list emit');
            global.websocket.emit("deviceList", { deviceList: resDiff.rows[0].cnt });
            
            const queryUpsertTime = `UPDATE "ob_device" SET updated_at = upserted_at WHERE service_type='ebell' AND updated_at != upserted_at;`;
            const resUpsertTime = await dbManager.pgQuery(queryUpsertTime);
          }
        }
      }
    }
  } catch (error) {
    console.log('polling EbellDevice:', error);
  }
}

const pollingEbellEvent = async () => {
  try {
    let query = `SELECT e.*, d.name, d.ipaddress, d.display_id, d.group_idx 
      FROM eb_device_event AS e 
      INNER JOIN 
      (SELECT a.*, c.display_id 
      FROM eb_device a 
      LEFT OUTER JOIN camera c ON a.camera_id=CAST(c.idx AS TEXT) 
      WHERE a.type='ebell' ORDER BY a.idx) AS d 
      ON e.extension = d.extension
      ORDER BY e.idx`;
    const resEbellEvent = await ebellQuery(query);
    if (resEbellEvent && resEbellEvent.rows && resEbellEvent.rows.length > 0) {
        let strArr = [];
        for(let row of resEbellEvent.rows){
  
          const queryDevice = `SELECT * FROM ob_device WHERE idx='${row['idx']}' AND type='ebell'`;
          const resDevice = await dbManager.pgQuery(queryDevice);
          let deviceCameraId = '';
          if(resDevice && resDevice.rows && resDevice.rows.length > 0){
            deviceCameraId = resDevice.rows[0]['camera_id'];
          }

        const strValue = `(
                    ${row['idx']}, 
                    '${row['name']}', 
                    '${(row['status'] === 1)?row['name']+' 비상발생':(row['status'] === 2)?row['name']+' 비상발생(통화중)':row['name']+' 비상종료'}', 
                    '${row['extension']}',
                    0,
                    0,
                    '${row['callreq']}', 
                    '${row['callend']}', 
                    ${row['status']},
                    ${3},
                    false,
                    'ebell',
                    true,
                    '${row['ipaddress']}', 
                    'ebell',
                    19,
                    '${deviceCameraId}'
                    )`;
                    strArr.push(strValue);
      }
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_event" AS ori(
                "idx", 
                "name", 
                "description", 
                "id", 
                "building_idx",
                "floor_idx",
                "event_occurrence_time", 
                "event_end_time", 
                "status", 
                "severity", 
                "acknowledge", 
                "device_type",
                "connection", 
                "ipaddress", 
                "service_type",
                "event_type",
                "camera_id") 
                VALUES ${queryValues} 
                ON CONFLICT (idx, service_type) DO 
                UPDATE SET
                status=EXCLUDED.status,
                event_end_time=EXCLUDED.event_end_time,
                description=EXCLUDED.description,
                upserted_at=NOW()
                WHERE ori.name != EXCLUDED.name OR
                ori.description != EXCLUDED.description OR 
                ori.id != EXCLUDED.id OR 
                ori.building_idx != EXCLUDED.building_idx OR 
                ori.floor_idx != EXCLUDED.floor_idx OR 
                ori.event_occurrence_time != EXCLUDED.event_occurrence_time OR 
                ori.event_end_time != EXCLUDED.event_end_time OR 
                ori.status != EXCLUDED.status OR 
                ori.ipaddress != EXCLUDED.ipaddress OR
                ori.camera_id != EXCLUDED.camera_id;`;
      const resCount = await dbManager.pgQuery(`SELECT COUNT(*) AS cnt FROM "ob_event" WHERE service_type='ebell';`);
      const resUpsert = await dbManager.pgQuery(queryString);
      // console.log(`ebell event polling: ${resUpsert.rowCount} rows`);
      if (resCount && resCount.rows && resCount.rows.length > 0 && resEbellEvent && resEbellEvent.rows && resEbellEvent.rows.length > 0){
        if (parseInt(resCount.rows[0].cnt) < resEbellEvent.rows.length){
          const lastEbellEvent = resEbellEvent.rows[resEbellEvent.rows.length-1];
          const resLast = await observerService.getEvents(undefined, undefined, undefined, undefined, 'ebell', undefined, lastEbellEvent.ipaddress);
          const sqlDevice = `SELECT left_location, top_location, camera_id FROM ob_device WHERE ipaddress='${lastEbellEvent.ipaddress}' AND id='${lastEbellEvent.extension}'`;
          const resDevice = await dbManager.pgQuery(sqlDevice);
          const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
          if (resLast && resLast.rows && resLast.rows.length > 0 && resDevice && resDevice.rows && resDevice.rows.length > 0 && resDevice.rows[0].camera_id && resDevice.rows[0].camera_id !== 'null' && resDevice.rows[0].left_location && resDevice.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
            if (global.websocket) {
              global.websocket.emit("eventList", { eventList: [{
                lastEvent: {
                  eventName: '비상 상황 발생',
                  deviceId: resLast.rows[0].id,
                  deviceType: resLast.rows[0].device_type,
                  buildingIdx: resLast.rows[0].building_idx,
                  floorIdx: resLast.rows[0].floor_idx,
                  buildingServiceType:resLast.rows[0].building_service_type,
                  serviceType: resLast.rows[0].service_type,
                }
              }] });
            }
          } else {
            if (global.websocket && resUpsert && resUpsert.rowCount > 0) {
              global.websocket.emit("eventList", { eventList: resUpsert.rowCount });
            }
          }
        }
      }
    }
  } catch (error) {
    console.log('polling EbellEvent:', error);
  }
}

const updateBuilingFloorStatus = async () => {

  try {
    const queryBuildingInit = `UPDATE ob_building SET status=0`;
    const resBuildingInit = await dbManager.pgQuery(queryBuildingInit);
  
    const queryBuilding = `UPDATE ob_building b
      SET status=1
      FROM(
      (
      SELECT DISTINCT d.building_idx, d.building_service_type
      FROM ob_event e
      INNER JOIN ob_device d ON e.id = d.id
      WHERE e.event_occurrence_time > TO_CHAR((NOW() - INTERVAL '1 day'), 'YYYYMMDD') || 'T' || TO_CHAR((NOW() - INTERVAL '1 day'), 'HH24MISS')
        AND CASE WHEN d.type='ebell' THEN d.status!=0 ELSE e.acknowledge=FALSE END AND d.building_idx > 0
      GROUP BY d.building_idx, d.building_service_type
      ) 
      UNION 
      (
      SELECT DISTINCT c.building_idx, c.building_service_type
      FROM ob_event e
      INNER JOIN ob_camera c ON e.id = c.id
      WHERE e.event_occurrence_time > TO_CHAR((NOW() - INTERVAL '1 day'), 'YYYYMMDD') || 'T' || TO_CHAR((NOW() - INTERVAL '1 day'), 'HH24MISS')
        AND e.acknowledge=FALSE AND c.building_idx > 0
      GROUP BY c.building_idx, c.building_service_type
      )
      ) sub
      WHERE sub.building_idx=b.idx AND sub.building_service_type=b.service_type`;
    const resBuilding = await dbManager.pgQuery(queryBuilding);
  
    const queryFloorInit = `UPDATE ob_floor SET status=0`;
    const resFloorInit = await dbManager.pgQuery(queryFloorInit);
    
    const queryFloor = `UPDATE ob_floor f
      SET status=1
      FROM(
        (
          SELECT DISTINCT d.building_idx, d.building_service_type, d.floor_idx
          FROM ob_event e
          INNER JOIN ob_device d ON e.id = d.id
          WHERE e.event_occurrence_time > TO_CHAR((NOW() - INTERVAL '1 day'), 'YYYYMMDD') || 'T' || TO_CHAR((NOW() - INTERVAL '1 day'), 'HH24MISS')
            AND CASE WHEN d.type='ebell' THEN d.status!=0 ELSE e.acknowledge=FALSE END AND d.building_idx > 0
          GROUP BY d.building_idx, d.building_service_type, d.floor_idx
          ) 
          UNION 
          (
          SELECT DISTINCT c.building_idx, c.building_service_type, c.floor_idx
          FROM ob_event e
          INNER JOIN ob_camera c ON e.id = c.id
          WHERE e.event_occurrence_time > TO_CHAR((NOW() - INTERVAL '1 day'), 'YYYYMMDD') || 'T' || TO_CHAR((NOW() - INTERVAL '1 day'), 'HH24MISS')
            AND e.acknowledge=FALSE AND c.building_idx > 0
          GROUP BY c.building_idx, c.building_service_type, c.floor_idx
          )
      ) sub
      WHERE sub.building_idx=f.building_idx AND sub.building_service_type=f.service_type AND sub.floor_idx=f.idx`;
    const resFloor = await dbManager.pgQuery(queryFloor);
    const currBuildings = await observerService.getBuilding();
    const currFloors = await observerService.getFloor(); 

    if (global.websocket) {
      global.websocket.emit("buildingList", { buildingList: currBuildings.rows });
      global.websocket.emit("floorList", { floorList: currFloors.rows });
    }
  } catch (err) {
    console.log('updateBuilingFloorStatus err:', err);
  }
}

let lastLogDateDeviceNormal = 0;
let lastLogTimeDeviceNormal = 0;
const getLastIndexForLogDeviceNormal = async () => {
  try {
    const query = 'SELECT * FROM ob_access_control_log ORDER BY "LogDate" DESC, "LogTime" DESC LIMIT 1';
    const res = await dbManager.pgQuery(query);
    if (res && res.rows && res.rows.length > 0) {
      lastLogDateDeviceNormal = res.rows[0].LogDate;
      lastLogTimeDeviceNormal = res.rows[0].LogTime;
    }
  } catch(err){
    console.log('getLastIndexForLogDeviceNormal err:', err);
  }
}

const pollingIstLogDeviceNormal = async () => {
  try {    
    await getLastIndexForLogDeviceNormal();
    
    // const query = `SELECT * FROM Log_Device_Normal WHERE (LogType='0' OR LogType='1' OR LogType='3') AND LogIDX>${lastIndexLogDeviceNormal} ORDER BY LogIDX DESC`;
    const query = `SELECT t1.*, t2.DoorID AS LogDoorID2 FROM Log_Device_Normal t1
    LEFT OUTER JOIN System_Device_Door t2 on t1.LogDoorName=t2.DoorName
    WHERE (LogType='0' OR LogType='1' OR LogType='3') AND (LogDate>=${lastLogDateDeviceNormal} AND LogTime>${lastLogTimeDeviceNormal}) OR (LogDate>${lastLogDateDeviceNormal} AND LogTime<=${lastLogTimeDeviceNormal}) ORDER BY LogDate DESC, LogTime DESC`
    const resMssql = await dbManager.mssqlQuery(query);
    if (resMssql && resMssql.recordset && resMssql.recordset.length > 0) {
      // 로그중 출입이벤트 로그만 추출
      const accessLogRecordset = resMssql.recordset.filter(row => row['LogType'] === '0');
      // 로그중 시스템 이벤트 로그만 추출
      const systemEventRecordset = resMssql.recordset.filter(row => row['LogType'] === '3');
      // 미등록 출입시도 로그만 추출
      const notPermittedAccessLogRecordset = resMssql.recordset.filter(row => row['LogType'] === '0' && row['LogStatus'] === '30');
      // 강제출입문 열림 로그만 추출
      const forceOpenDoorLogRecordset = resMssql.recordset.filter(row => row['LogType'] === '1' && row['LogStatus'] === '6');

      // 폴링한 로그 전체 저장
      const strArr = resMssql.recordset.map((row) => {
        const strValue = `(${row['LogIDX']}, 
          '${row['LogDate']}', 
          '${row['LogTime']}', 
          '${row['LogType']}', 
          '${row['LogStatus']}', 
          '${row['LogStatusName']}', 
          '${row['LogRFID']}', 
          '${row['LogPIN']}', 
          '${row['LogIDType']}', 
          '${row['LogIDCredit']}', 
          '${row['LogAuthType']}', 
          '${row['LogDeviceID']}', 
          '${row['LogDeviceName']}', 
          '${row['LogReaderID']}', 
          '${row['LogReaderName']}', 
          '${parseInt(row['LogDeviceID'])*100 + parseInt(row['LogDoorID'])}', 
          '${row['LogDoorName']}', 
          '${row['LogInputMode']}', 
          '${row['LogInputID']}', 
          '${row['LogInputType']}', 
          '${row['LogInputName']}', 
          '${row['LogLocationArea']}', 
          '${row['LogLocationFloor']}', 
          '${row['LogPersonID']}', 
          '${row['LogPersonLastName']}', 
          '${row['LogPersonFirstName']}', 
          ${row['LogCompanyID']}, 
          '${row['LogCompanyName']}', 
          ${row['LogDepartmentID']}, 
          '${row['LogDepartmentName']}', 
          ${row['LogTitleID']}, 
          '${row['LogTitleName']}', 
          '${row['LastUpdateDateTime']}', 
          '${row['LogSystemWorkID']}')`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryInsert = `INSERT INTO ob_access_control_log (
              "LogIDX", 
              "LogDate", 
              "LogTime", 
              "LogType", 
              "LogStatus", 
              "LogStatusName", 
              "LogRFID", 
              "LogPIN", 
              "LogIDType", 
              "LogIDCredit", 
              "LogAuthType", 
              "LogDeviceID", 
              "LogDeviceName", 
              "LogReaderID", 
              "LogReaderName", 
              "LogDoorID", 
              "LogDoorName", 
              "LogInputMode", 
              "LogInputID", 
              "LogInputType", 
              "LogInputName", 
              "LogLocationArea", 
              "LogLocationFloor", 
              "LogPersonID", 
              "LogPersonLastName", 
              "LogPersonFirstName", 
              "LogCompanyID", 
              "LogCompanyName", 
              "LogDepartmentID", 
              "LogDepartmentName", 
              "LogTitleID", 
              "LogTitleName", 
              "LastUpdateDateTime", 
              "LogSystemWorkID") VALUES ${queryValues} ON CONFLICT ("LogIDX") DO NOTHING`;
      const resInsert = await dbManager.pgQuery(queryInsert);
      
      // 출입이벤트 로그로 웹소켓 데이터 생성
      if (accessLogRecordset && accessLogRecordset.length > 0) {
        const websocketDataArr = [];        
        accessLogRecordset.forEach((row) => {
          const websocketData = {
            LogIDX: row['LogIDX'],
            LogStatusName: row['LogStatusName'],
            LogDoorID: parseInt(row['LogDeviceID'])*100 + parseInt(row['LogDoorID']),
            LogDoorName: row['LogDoorName'],
            LogPersonID: row['LogPersonID'],
            LogPersonLastName: row['LogPersonLastName'],
            LogDate: row['LogDate'],
            LogTime: row['LogTime']
          };
          websocketDataArr.push(websocketData);
        });

        if (websocketDataArr.length > 0) {
          if (global.websocket) {
            global.websocket.emit("accessControlLog", { accessControlLog: websocketDataArr });
          }
        }

        // 출입기록도 이벤트처럼 처리할게 설정한 경우
        // const bSetAccessLogToEvent = true;
        // if (bSetAccessLogToEvent) {
        //   const deviceId = (parseInt(row['LogDeviceID'])*100) + parseInt(row['LogDoorID']);
        //   const queryDevice = `SELECT * FROM ob_device WHERE id='${deviceId}' AND type='door'`;
        //   const resDevice = await dbManager.pgQuery(queryDevice);
        //   if (resDevice && resDevice.rows && resDevice.rows.length > 0) {
        //     const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) 
        //     VALUES ('${row['LogDoorName']}', '미등록출입시도', '${(parseInt(row['LogDeviceID']) * 100) + parseInt(row['LogDoorID'])}', 0,0,'${row['LogDate']}' || 'T' || '${row['LogTime']}','door', '0.0.0.0','accesscontrol',26, '${resDevice.rows[0].camera_id}');`;
        //     const resEvent = await dbManager.pgQuery(sqlEvent);
        //     const resLast = await observerService.getEvents(undefined, undefined, undefined, (parseInt(row['LogDeviceID']) * 100) + parseInt(row['LogDoorID']), undefined, undefined, undefined);
        //     if (resLast) {
        //       if (global.websocket) {
        //         global.websocket.emit("eventList", { eventList: [{
        //           lastEvent: {
        //             deviceId: resLast.rows[0].id,
        //             deviceType: resLast.rows[0].device_type,
        //             buildingIdx: resLast.rows[0].building_idx,
        //             floorIdx: resLast.rows[0].floor_idx,
        //             buildingServiceType:resLast.rows[0].building_service_type,
        //             serviceType: resLast.rows[0].service_type,
        //           }
        //         }] });
        //       }
        //     } else {
        //       if (global.websocket) {
        //         global.websocket.emit("eventList", { eventList: resEvent.rowCount });
        //       }
        //     }
        //   }
        // }


      }
      // 폴링한 시스템이벤트로그에서 화재신고 이벤트 생성하여 처리
      if (systemEventRecordset && systemEventRecordset.length > 0) {
        // systemEventRecordset.forEach(async (row) => {
        for (const row of systemEventRecordset){
          // LogStatus: 0(로컬 화재), 1(글로벌 화재)
          if (row['LogStatus'] === '0' || row['LogStatus'] === '1') {
            const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type) 
                                            VALUES ('${row['LogDeviceName']}', '화재신고', '${row['LogDeviceID']}', 0,0,'${row['LogDate']}' || 'T' || '${row['LogTime']}','acu', '0.0.0.0','accesscontrol',25);`;
            const resEvent = await dbManager.pgQuery(sqlEvent);
            const resLast = await observerService.getEvents(undefined, undefined, undefined, (parseInt(row['LogDeviceID']) * 100) + parseInt(row['LogDoorID']), 'accesscontrol', undefined, undefined);
            const sqlDevice = `SELECT left_location, top_location, camera_id FROM ob_device WHERE id='${row['LogDeviceID']}'`;
            const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
            const resDevice = await dbManager.pgQuery(sqlDevice);
              if (resLast && resLast.rows && resLast.rows.length > 0 && resDevice && resDevice.rows && resDevice.rows.length > 0 && resDevice.rows[0].left_location && resDevice.rows[0].top_location && resDevice.rows[0].camera_id && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
                if (global.websocket) {
                  global.websocket.emit("eventList", { eventList: [{
                    lastEvent: {
                      eventName: '화재신고',
                      deviceId: resLast.rows[0].id,
                      deviceType: resLast.rows[0].device_type,
                      buildingIdx: resLast.rows[0].building_idx,
                      floorIdx: resLast.rows[0].floor_idx,
                      buildingServiceType:resLast.rows[0].building_service_type,
                      serviceType: resLast.rows[0].service_type,
                    }
                  }] });
                }
              } else {
                if (global.websocket && resEvent && resEvent.rowCount > 0) {
                  global.websocket.emit("eventList", { eventList: resEvent.rowCount });
                }
              }
          }
        };
      }

      // 폴링한 시스템이벤트로그에서 미등록 출입시도 이벤트 생성하여 처리
      if (notPermittedAccessLogRecordset && notPermittedAccessLogRecordset.length > 0) {
        // notPermittedAccessLogRecordset.forEach(async (row) => {
        for (const row of notPermittedAccessLogRecordset){
          // LogStatus: 30(미등록 출입시도)
          if (row['LogStatus'] === '30') {
            const deviceId = (parseInt(row['LogDeviceID'])*100) + parseInt(row['LogDoorID']);
            const queryDevice = `SELECT * FROM ob_device WHERE id='${deviceId}' AND type='door'`;
            const resDevice = await dbManager.pgQuery(queryDevice);
            if (resDevice && resDevice.rows && resDevice.rows.length > 0) {
              const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) 
              VALUES ('${row['LogDoorName']}', '미등록출입시도', '${(parseInt(row['LogDeviceID']) * 100) + parseInt(row['LogDoorID'])}', 0,0,'${row['LogDate']}' || 'T' || '${row['LogTime']}','door', '0.0.0.0','accesscontrol',26, '${resDevice.rows[0].camera_id}');`;
              const resEvent = await dbManager.pgQuery(sqlEvent);
              const resLast = await observerService.getEvents(undefined, undefined, undefined, deviceId, 'accesscontrol', undefined, resDevice.rows[0].ipaddress);
              const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
              if (resLast && resLast.rows && resLast.rows.length > 0 && resDevice.rows[0].camera_id && resDevice.rows[0].left_location && resDevice.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
                if (global.websocket) {
                  global.websocket.emit("eventList", { eventList: [{
                    lastEvent: {
                      eventName: '미등록 출입 시도',
                      deviceId: resLast.rows[0].id,
                      deviceType: resLast.rows[0].device_type,
                      buildingIdx: resLast.rows[0].building_idx,
                      floorIdx: resLast.rows[0].floor_idx,
                      buildingServiceType:resLast.rows[0].building_service_type,
                      serviceType: resLast.rows[0].service_type,
                    }
                  }] });
                }
              } else {
                if (global.websocket && resEvent && resEvent.rowCount > 0) {
                  global.websocket.emit("eventList", { eventList: resEvent.rowCount });
                }
              }

              // 미등록 출입시도 이벤트 생성후 출입문 장치 상태 변경 처리
              const queryUpdateState = `UPDATE ob_device
                SET status=1
                FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
                WHERE acknowledge=FALSE AND device_type='door' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
                WHERE ob_device.id=subquery.id`;
              const resUpdateState = await dbManager.pgQuery(queryUpdateState);
              if (resUpdateState && resUpdateState.rowCount > 0) {
                if (global.websocket) {
                  global.websocket.emit("deviceList", { deviceList: resUpdateState.rowCount });
                }
              }
            }
          }
        };
      }

      // 폴링한 입력이벤트(LogType:1)로그에서 강제문열림(LogStatus:6) 이벤트 생성하여 처리
      if (forceOpenDoorLogRecordset && forceOpenDoorLogRecordset.length > 0) {
        // forceOpenDoorLogRecordset.forEach(async (row) => {
        for (const row of forceOpenDoorLogRecordset){
          // LogStatus: 6(강제문열림)
          if (row['LogStatus'] === '6') {
            const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type) 
                                            VALUES ('${row['LogDoorName']}', '강제문열림', '${(parseInt(row['LogDeviceID'])*100) + parseInt(row['LogDoorID2'])}', 0,0,'${row['LogDate']}' || 'T' || '${row['LogTime']}','door', '0.0.0.0','accesscontrol',27);`;
            const resEvent = await dbManager.pgQuery(sqlEvent);
            const resLast = await observerService.getEvents(undefined, undefined, undefined, (parseInt(row['LogDeviceID']) * 100) + parseInt(row['LogDoorID2']), 'accesscontrol', undefined, undefined);
            const sqlDevice = `SELECT left_location, top_location, camera_id FROM ob_device WHERE id='${(parseInt(row['LogDeviceID'])*100) + parseInt(row['LogDoorID2'])}'`;
            const resDevice = await dbManager.pgQuery(sqlDevice);
            const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
              if (resLast && resLast.rows && resLast.rows.length > 0 && resDevice && resDevice.rows && resDevice.rows.length > 0 && resDevice.rows[0].camera_id && resDevice.rows[0].left_location && resDevice.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
                if (global.websocket) {
                  global.websocket.emit("eventList", { eventList: [{
                    lastEvent: {
                      eventName: '강제 출입문 열림',
                      deviceId: resLast.rows[0].id,
                      deviceType: resLast.rows[0].device_type,
                      buildingIdx: resLast.rows[0].building_idx,
                      floorIdx: resLast.rows[0].floor_idx,
                      buildingServiceType:resLast.rows[0].building_service_type,
                      serviceType: resLast.rows[0].service_type,
                    }
                  }] });
                }
              } else {
                if (global.websocket && resEvent && resEvent.rowCount > 0) {
                  global.websocket.emit("eventList", { eventList: resEvent.rowCount });
                }
              }

            // 강제문열림 이벤트 생성후 출입문 장치 상태 변경 처리
            const queryUpdateState = `UPDATE ob_device
              SET status=1
              FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
              WHERE acknowledge=FALSE AND device_type='door' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
              WHERE ob_device.id=subquery.id`;
            const resUpdateState = await dbManager.pgQuery(queryUpdateState);
            if (resUpdateState && resUpdateState.rowCount > 0) {
              if (global.websocket) {
                global.websocket.emit("deviceList", { deviceList: resUpdateState.rowCount });
              }
            }
          }
        };
      }
    }
  } catch(err) {
    console.log('pollingIstLogDeviceNormal err:', err);
  }
}

const pollingIstSystemDevice = async () => {
  try {
    const query = `SELECT * FROM System_Device`;
    const resMssql = await dbManager.mssqlQuery(query);
    if (resMssql && resMssql.recordset && resMssql.recordset.length > 0) {
      const strArr = resMssql.recordset.map((row) => {
        const strValue = `(${parseInt(row['DeviceID'])}, 
              '${row['DeviceID']}', 
              0,
              '',
              0,
              'acu',
              '${row['DeviceName']}', 
              '',
              '${row['DeviceIP']}', 
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              0,
              'accesscontrol'
              )`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_device" AS ori (
        "idx", 
        "id", 
        "building_idx",
        "building_service_type",
        "floor_idx", 
        "type", 
        "name", 
        "location", 
        "ipaddress", 
        "left_location", 
        "top_location", 
        "camera_id",
        "camera_id_sub1", 
        "camera_id_sub2", 
        "camera_preset_start", 
        "camera_preset_end", 
        "status",
        "service_type") VALUES ${queryValues} 
        ON CONFLICT (idx, service_type) DO 
        UPDATE SET
        name=EXCLUDED.name,
        ipaddress=EXCLUDED.ipaddress,
        upserted_at=NOW()
        WHERE 
        ori.name != EXCLUDED.name OR 
        ori.ipaddress != EXCLUDED.ipaddress`;
      const resUpsert = await dbManager.pgQuery(queryString);
      console.log(`accesscontrol device polling: ${resUpsert.rowCount} rows`);
      const queryStringDiff = `SELECT COUNT(*) AS cnt FROM "ob_device" WHERE service_type='accesscontrol' AND updated_at != upserted_at;`;
      const resDiff = await dbManager.pgQuery(queryStringDiff);
      if (resDiff && resDiff.rows && resDiff.rows.length>0){
        if (parseInt(resDiff.rows[0].cnt) > 0){
          if (global.websocket) {
            global.websocket.emit("deviceList", { deviceList: resDiff.rows[0].cnt });
            
            const queryUpsertTime = `UPDATE "ob_device" SET updated_at = upserted_at WHERE service_type='accesscontrol' AND updated_at != upserted_at;`;
            const resUpsertTime = await dbManager.pgQuery(queryUpsertTime);
          }
        }
      }
    }
  } catch(err) {
    console.log('pollingIstSystemDevice err:', err);
  }
}

const pollingIstSystemDeviceDoor = async () => {
  try {
    const query = `SELECT * FROM System_Device_Door`;
    const resMssql = await dbManager.mssqlQuery(query);
    if (resMssql && resMssql.recordset && resMssql.recordset.length > 0) {
      const strArr = resMssql.recordset.map((row) => {
        const strValue = `(${(parseInt(row['DeviceID']) * 100) + parseInt(row['DoorID'])}, 
              '${(parseInt(row['DeviceID']) * 100) + parseInt(row['DoorID'])}', 
              0,
              '',
              0,
              'door',
              '${row['DoorName']}', 
              '',
              '${'0.0.' + parseInt(row['DeviceID'])+'.'+parseInt(row['DoorID'])}', 
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              0,
              'accesscontrol'
              )`;
        return strValue;
      });
      const queryValues = strArr.join(',');
      const queryString = `INSERT INTO "ob_device" AS ori (
        "idx", 
        "id", 
        "building_idx",
        "building_service_type",
        "floor_idx", 
        "type", 
        "name", 
        "location", 
        "ipaddress", 
        "left_location", 
        "top_location", 
        "camera_id",
        "camera_id_sub1", 
        "camera_id_sub2", 
        "camera_preset_start", 
        "camera_preset_end", 
        "status",
        "service_type") VALUES ${queryValues} 
        ON CONFLICT (idx, service_type) DO 
        UPDATE SET
        name=EXCLUDED.name,
        upserted_at=NOW()
        WHERE 
        ori.name != EXCLUDED.name`;
      const resUpsert = await dbManager.pgQuery(queryString);
      console.log(`accesscontrol device door polling: ${resUpsert.rowCount} rows`);
      const queryStringDiff = `SELECT COUNT(*) AS cnt FROM "ob_device" WHERE service_type='accesscontrol' AND updated_at != upserted_at;`;
      const resDiff = await dbManager.pgQuery(queryStringDiff);
      if (resDiff && resDiff.rows && resDiff.rows.length>0){
        if (parseInt(resDiff.rows[0].cnt) > 0){
          if (global.websocket) {
            global.websocket.emit("deviceList", { deviceList: resDiff.rows[0].cnt });
            
            const queryUpsertTime = `UPDATE "ob_device" SET updated_at = upserted_at WHERE service_type='accesscontrol' AND updated_at != upserted_at;`;
            const resUpsertTime = await dbManager.pgQuery(queryUpsertTime);
          }
        }
      }
    }
  } catch(err) {
    console.log('pollingIstSystemDeviceDoor err:', err);
  }
}

const pollingIstDataPerson = async () => {
  try {
    const query = `SELECT * FROM Data_Person ORDER BY "PersonID"`;
    const resMssql = await dbManager.mssqlQuery(query);
    if (resMssql && resMssql.recordset && resMssql.recordset.length > 0) {
      const strArr = resMssql.recordset.map((row) => {
        const personId = row['PersonID'];
        const imageRaw = row['PersonPhoto'];
        fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', 'access_control_person', `${personId}.png`), imageRaw);
        return row;
      });
    }
    return true;
  } catch(err) {
    console.log('pollingIstDataPerson err:', err);
  }
}

exports.startDbPolling = () => {

  // 프로그램 실행시 출입통제 DB에서 출입자에 대한 이미지 다운로드 수행
  pollingIstDataPerson();

  timerId = setInterval(() => {
  //timerId = setTimeout(()=>{
    const date = new Date();
    console.log('========================================================');
    console.log(`[${format(date, 'yyyy-MM-dd HH:mm:ss')}] EBELL DB Polling`);
    
    // 소켓방식 변경으로 주석처리
    pollingEbellDevice();
    // 소켓방식 변경으로 주석처리
    pollingEbellEvent();    
    
    // 이벤트 폴링 후 각 카메라/장비의 이벤트 발생상태 업데이트 및 각 건물/층의 이벤트 발생상태 업데이트
    updateBuilingFloorStatus();

  }, pollingInterval);
  //}, 5000);

  timerIdAcss = setInterval(() => {
    const date = new Date();
    console.log('========================================================');
    console.log(`[${format(date, 'yyyy-MM-dd HH:mm:ss')}] 출통 서비스DB Polling`);
    
    //출입통제 로그데이터 폴링
    pollingIstLogDeviceNormal();
    pollingIstSystemDevice();
    pollingIstSystemDeviceDoor();

    //이벤트 폴링 후 각 카메라/장비의 이벤트 발생상태 업데이트 및 각 건물/층의 이벤트 발생상태 업데이트
    updateBuilingFloorStatus();

  }, pollingIntervalAcss);
}

exports.parkingRedZoneCheck = () => {
  let timerId;
  // 주정차금지구역 주차 여부 확인
  timerId = setInterval(async() => {
    await parkingRedZoneCheck();
  }, pollingIntervalParkingRedZone);
}

let intervalId;
exports.crowdDensityLogPolling = async () => {
  // if (intervalId) {
  //     clearInterval(intervalId);
  // }

  const polling = async () => {
      let crorwdCamQuery = `SELECT * FROM ob_crowddensity_camera`;
      const crowdCamResult = await dbManager.pgQuery(crorwdCamQuery);
      if (crowdCamResult.rows) {
          observerService.crowdDensityCount();
      } else {
          clearInterval(intervalId);
          return;
      }
  };

  polling();
  // intervalId = setInterval(polling, pollingIntervalCrowdDensity); // 30초
};



exports.stopDbPolling = () => {
  clearInterval(timerId);
}

exports.reloadAccessControlPerson = async () => {
  return await pollingIstDataPerson();
}

exports.refreshFloorStatus = async () => {
  updateBuilingFloorStatus();
}

exports.readEbellEventDb = async () => {
  pollingEbellEvent();
  pollingEbellDevice();
}

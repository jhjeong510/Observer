const fs = require('fs');
const path = require('path');
const axios = require("axios");
const _ = require('underscore');
const dbManager = require("../db/dbManager");
const dbPolling = require("../worker/dbPolling");
const auth = require('../services/auth');
const { format, addSeconds, addHours, subHours, subWeeks } = require('date-fns');
const anprList = require('./anprBlackWhiteList');
anprList.loadBlackWhiteList();
const eventConfig = require('../worker/eventConfig');
const towerLampClient = require('../worker/towerLampClient');
const axiosRetry = require('axios-retry');
const qs = require('qs')
const FormData = require('form-data');
const promClient = require('prom-client');
const moment = require("moment");
const plateMap = new Map();

let vmsIpaddress;

eventConfig.loadEventTypeConfig();
// exports.loadEventTypeConfig = async () => {
//   try {
//     const query = `SELECT * FROM ob_event_type WHERE idx=28`;
//     const res = await dbManager.pgQuery(query);
//     if (res && res.rows && res.rows.length > 0) {
//       const respirationUnuse = res.rows[0].unused;
//       global.respirationUnuse = respirationUnuse;
//     }
//   } catch(err){

//   }
// }

exports.login = async ({ id, password }) => {
  try {
    const token = await auth.login(id, password);

    return token;
  } catch (err) {
    throw err;
  }
}

exports.checkSession = async (token) => {
  try {
    const res = await auth.checkToekn(token);
    return res;
  } catch (err) {
    return err;
  }
}

exports.getCameraListByInfo = async (info) => {

  let queryValue = '';
  let parsedData;
  let response;

  try {
    const response = await axios({
      method: "get",
      url: info.url,
      responseType: "json",
    });

    parsedData = response.data.cameras;

  } catch (error) {
    console.error("timeout : ", error);
  }

  if (parsedData !== undefined) {
    // parse data
    for (let i = 0; i < parsedData.length; i++) {
      let camera = parsedData[i];
      let host = '';
      let deviceIpint = '';
      let telemetryControlId = '';
      let preset = '';
      if (camera !== undefined && camera.ipAddress !== undefined) {
        try {
          if (camera.videoStreams.length > 0) {
            const arr = camera.videoStreams[0].accessPoint.split('/');
            if (arr.length > 2) {
              host = arr[1];
              deviceIpint = arr[2];
            }
          }

          if (host.length > 0 && deviceIpint.length > 0) {
            let urlTele = `http://${info.NVRID}:${info.NVRPW}@${info.NVRIP}:${info.NVRPort}/control/telemetry/list/${host}/${deviceIpint}`;
            const resTelemetryId = await axios.get(urlTele);
            if (resTelemetryId.data.length > 0) {
              telemetryControlId = resTelemetryId.data[0];
            }
            if (telemetryControlId.length > 0) {
              let urlPreset = `http://${info.NVRID}:${info.NVRPW}@${info.NVRIP}:${info.NVRPort}/control/telemetry/preset/info/${telemetryControlId}`;
              const resPresetList = await axios.get(urlPreset);
              if (resPresetList.data) {
                const values = Object.values(resPresetList.data);
                Object.keys(resPresetList.data).map((item, index) => preset += `${item}:${values[index]},`);
                if (preset[preset.length - 1] === ',') {
                  preset = preset.slice(0, preset.length - 1);
                }
              }
            }
          }
        } catch (error) {
          console.log('get telemetry info err:', error);
        }
        queryValue += `('${info.NVRIP}', '${info.NVRPort}', '${info.NVRID}', '${info.NVRPW}', '${camera.displayId}', '${camera.displayName}', '${camera.videoStreams.length > 0 ? camera.videoStreams[camera.videoStreams.length - 1].accessPoint.slice(6) : ''}', '${telemetryControlId}', '${preset}', '${camera.ipAddress}'),`;
      }
    }
    queryValue = queryValue.slice(0, -1);
  }

  let query1 = `DELETE FROM camera WHERE mgist_ip = '${info.NVRIP}' AND mgist_port = '${info.NVRPort}'`;
  let query2 = `INSERT INTO camera (mgist_ip, mgist_port, id, password, display_id, display_name, video_access_point, telemetry_control_id, telemetry_control_preset, ip_address) VALUES `;
  let query3 = `SELECT * FROM camera`;

  query2 += queryValue;
  query2 += ` ON CONFLICT(ip_address) DO UPDATE SET mgist_ip = EXCLUDED.mgist_ip, mgist_port = EXCLUDED.mgist_port, id = EXCLUDED.id, password = EXCLUDED.password, display_id = EXCLUDED.display_id, display_name = EXCLUDED.display_name, video_access_point = EXCLUDED.video_access_point, ip_address = EXCLUDED.ip_address;`;
  console.log(query2);


  try {
    const res1 = await dbManager.pgQuery(query1);
    const res2 = await dbManager.pgQuery(query2);
    const res3 = await dbManager.pgQuery(query3);
    response = res3.rows;
  } catch (error) {
    console.log(error);
  }
  return response;
};

exports.getDbCameraList = async () => {

  let query = `SELECT a.id as cameraId, a.name as cameraName, b.name as floorName, c.name as buildingName, 
                a.top_location, a.left_location, a.building_idx, a.building_service_type, a.floor_idx, a.service_type, a.ipaddress, a.status, a.vendor, a.model
                FROM ob_camera a 
                LEFT OUTER JOIN ob_floor b ON a.floor_idx=b.idx AND a.building_service_type=b.service_type 
                LEFT OUTER JOIN ob_building c ON b.building_idx = c.idx AND c.service_type=b.service_type;`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getDbPidsList = async () => {
  let query = `SELECT a.id as pidsId, a.name as pidsName, b.name as floorName, c.name as buildingName, 
  a.top_location, a.left_location, a.building_idx, a.building_service_type, a.floor_idx, a.service_type, a.ipaddress, a.status, a.camera_id, a.type, a.location, a.line_x1, a.line_x2, a.line_y1, a.line_y2
  FROM ob_pids a
  LEFT OUTER JOIN ob_floor b ON a.floor_idx=b.idx AND a.building_service_type=b.service_type
  LEFT OUTER JOIN ob_building c ON b.building_idx = c.idx AND c.service_type=b.service_type;`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getVitalsensorList = async (limit, idx = undefined) => {
  // const query = `SELECT c.name AS building_name, f.name AS floor_name, a.left_location, a.top_location, a.camera_id, a.status, a.service_type, b.* FROM ob_device AS a RIGHT JOIN ob_breathsensor b ON a.ipaddress = b.ipaddress LEFT JOIN ob_floor f ON f.idx = a.floor_idx AND f.service_type=a.building_service_type
  // LEFT OUTER JOIN ob_building c ON c.idx = a.building_idx AND c.service_type=a.building_service_type ORDER BY CAST(SUBSTRING(b.ipaddress, 12) AS INTEGER) ASC;`
  const query = `SELECT c.name AS building_name, c.service_type AS building_service_type, f.name AS floor_name, f.idx AS floor_idx, c.idx AS building_idx, a.left_location, a.top_location, a.camera_id, a.status, a.service_type, a.id, a.id AS device_id, a.idx AS device_idx, b.* FROM ob_device AS a RIGHT JOIN ob_breathsensor b ON a.ipaddress = b.ipaddress LEFT JOIN ob_floor f ON f.idx = a.floor_idx AND f.service_type=a.building_service_type
  LEFT OUTER JOIN ob_building c ON c.idx = a.building_idx AND c.service_type=a.building_service_type ORDER BY idx ASC;`
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.vitalsensorChangeUseStatus = async (ipaddress, status) => {
  const query = `UPDATE "ob_breathsensor" SET use_status='${status}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
  try {
    const res = await dbManager.pgQuery(query);
    if (res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
        global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.setVitalValue = async (ipaddress, breathValue) => {
  const query1 = `SELECT * FROM "ob_breathsensor" WHERE ipaddress='${ipaddress}'`;
  const res = await dbManager.pgQuery(query1);
  const beforeData = res.rows[0].breath_value;

  const query2 = `SELECT * FROM "users"`;
  const res2 = await dbManager.pgQuery(query2);
  const userId = res2.rows[0].id;

  const now = new Date();
  const date = format(now, 'yyyyMMdd') + 'T' + format(now, 'HHmmss');

  const query = `UPDATE "ob_breathsensor" SET breath_value='${breathValue}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
  try {
    const res = await dbManager.pgQuery(query);
    if (res.rowCount > 0) {
      const queryInsert = `INSERT INTO ob_operation_log (id, ipaddress, datetime, before_data, after_data) 
                            values('${userId}', '${ipaddress}','${date}', '${beforeData}', '${breathValue}')`;
      const res2 = await dbManager.pgQuery(queryInsert);
      if (res.rowCount > 0 && res2.rowCount > 0) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: res.rowCount });
          global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
        }
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
exports.setEachVitalValue = async ({ ipaddress, breathValue }) => {
  const query1 = `SELECT * FROM "ob_breathsensor" WHERE ipaddress='${ipaddress}'`;
  const res = await dbManager.pgQuery(query1);
  const beforeData = res.rows[0].breath_value;

  const query2 = `SELECT * FROM "users"`;
  const res2 = await dbManager.pgQuery(query2);
  const userId = res2.rows[0].id;

  const now = new Date();
  const date = format(now, 'yyyyMMdd') + 'T' + format(now, 'HHmmss');

  const query = `UPDATE "ob_breathsensor" SET breath_value='${breathValue}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
  try {
    const res = await dbManager.pgQuery(query);
    console.log(res);
    if (res.rowCount > 0) {
      const queryInsert = `INSERT INTO ob_operation_log (id, ipaddress, datetime, before_data, after_data) 
                            values('${userId}', '${ipaddress}','${date}', '${beforeData}', '${breathValue}')`;
      const res2 = await dbManager.pgQuery(queryInsert);
      if (res.rowCount > 0 && res2.rowCount > 0) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: res.rowCount });
          global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
        }
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.updateCamera = async (id, service_type) => {

  const query = `UPDATE "ob_camera" SET building_idx = 0, floor_idx = 0, building_service_type='', left_location='', top_location='', updated_at=NOW() WHERE id='${id}' AND service_type='${service_type}'`;
  try {
    const res = await dbManager.pgQuery(query);
    if (res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("cameraList", { cameraList: res.rowCount });
        global.websocket.emit("eventList", { eventList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.removeVitalsensor = async (idx, service_type) => {
  const querySelect = `SELECT * FROM ob_device WHERE idx=${parseInt(idx)} AND service_type='${service_type}'`;
  const resSelect = await dbManager.pgQuery(querySelect);
  let ipaddress = '';
  if (resSelect && resSelect.rows && resSelect.rows.length > 0) {
    ipaddress = resSelect.rows[0].ipaddress
  }
  let query2;
  const query = `DELETE FROM ob_device WHERE idx=${parseInt(idx)} AND service_type='${service_type}'`;
  if (ipaddress) {
    query2 = `DELETE FROM ob_breathsensor WHERE ipaddress='${ipaddress}'`;
  }
  console.log('query >', query);
  try {
    const res = await dbManager.pgQuery(query);
    let res2;
    if (query2) {
      res2 = await dbManager.pgQuery(query2);
    }
    if (res && res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
        global.websocket.emit("eventList", { eventList: res.rowCount });
      }

      if (global.breathwebsocket && ipaddress.length > 0) {
        global.breathwebsocket.emit('manageVitalsensor', { cmd: 'remove', ipaddress: ipaddress });
      }

    }
    if (res2 && res2.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("vitalsensorList", { vitalsensorList: res2.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.removePids = async (id) => {
  const query = `UPDATE "ob_pids" SET top_location=NULL, left_location=NULL, line_x1=NULL, line_x2=NULL, line_y1=NULL, line_y2=NULL, camera_id=NULL, camera_id_sub1=NULL, camera_id_sub2=NULL, camera_id_preset_start=NULL, status=0, updated_at=NOW() WHERE id='${id}';`
  try {
    const res = await dbManager.pgQuery(query);
    if (res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
        global.websocket.emit("eventList", { eventList: res.rowCount });
        global.websocket.emit("pidsList", { pidsList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.updateDoor = async (id, service_type) => {
  const query = `UPDATE "ob_device" SET building_idx = 0, floor_idx = 0, building_service_type='', left_location='', top_location='', updated_at=NOW() WHERE id='${id}' AND service_type='${service_type}'`;
  try {
    const res = await dbManager.pgQuery(query);
    if (res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
        global.websocket.emit("eventList", { eventList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.updateEbell = async (ipaddress) => {
  const query = `UPDATE "ob_device" SET building_idx = 0, floor_idx = 0, building_service_type='', left_location='', top_location='', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;

  try {
    const res = await dbManager.pgQuery(query);
    if (res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log('remove ebell location error : ', error);
    throw error;
  }
}

exports.cameraForDoor = async (id, cameraId, service_type) => {
  const query = `UPDATE "ob_device" SET camera_id='${cameraId}', updated_at=NOW() WHERE id='${id}' AND service_type='${service_type}'`;
  try {
    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: res.rowCount });
          global.websocket.emit("eventList", { eventList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.cameraForPids = async ({ id, cameraId, service_type }) => {
  const query = `UPDATE "ob_pids" SET camera_id='${cameraId}', updated_at=NOW() WHERE id='${id}' AND service_type='${service_type}'`;
  try {
    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("pidsList", { pidsList: res.rowCount });
          global.websocket.emit("eventList", { eventList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.setVitalsensorSchedule = async (addScheduleTime) => {
  const beforeQuery = `SELECT schedule_time FROM "ob_breathsensor"`
  try {
    const result = await dbManager.pgQuery(beforeQuery);
    // let setScheduleTime;
    // if(result.rows[0].schedule_time === '') {
    //   setScheduleTime = result.rows[0].schedule_time + `${addScheduleTime}`
    // } else {
    //   setScheduleTime = result.rows[0].schedule_time + `^${addScheduleTime}`
    // }
    const query = `UPDATE "ob_breathsensor" SET schedule_time='${setScheduleTime}', updated_at=NOW()`;

    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
          global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.setScheduleGroup = async ({ groupName, groupTimeSchedule }) => {
  // const beforeQuery = `SELECT schedule_time FROM "ob_breathsensor_schedule"`
  try {
    // const result = await dbManager.pgQuery(beforeQuery);
    // let groupTime = '';
    // if (groupTimeSchedule.length > 1) {
    groupTimeSchedule = groupTimeSchedule.join('^');
    // }
    // groupTime = groupTimeSchedule;

    // let setScheduleTime;
    // if(result.rows[0].schedule_time === '') {
    //   setScheduleTime = result.rows[0].schedule_time + `${groupTimeSchedule}`
    // } else {
    //   setScheduleTime = result.rows[0].schedule_time + `^${groupTimeSchedule}`
    // }
    const query = `INSERT INTO "ob_breathsensor_schedule" (name, schedule_time) VALUES ('${groupName}', '${groupTimeSchedule}')`;
    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.setScheduleGroupApply = async ({ groupName, ipaddress }) => {
  let beforeQuery;
  let notExistGroup;
  if (groupName === '없음') {
    notExistGroup = '없음';
  } else {
    beforeQuery = `SELECT schedule_time FROM "ob_breathsensor_schedule" WHERE name='${groupName}'`
  }

  try {
    if (notExistGroup && notExistGroup.length > 0) {
      const query = `UPDATE "ob_breathsensor" SET schedule_group='', schedule_time='', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
      if (query) {
        const res = await dbManager.pgQuery(query);
        if (res.rowCount === 1) {
          if (global.websocket) {
            global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
            global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
          }
        }
        return res;
      }
    } else if (beforeQuery && beforeQuery.length > 0) {
      const result = await dbManager.pgQuery(beforeQuery);
      const groupTimeSchedule = result.rows[0].schedule_time

      const query = `UPDATE "ob_breathsensor" SET schedule_group='${groupName}',schedule_time='${groupTimeSchedule}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
      if (query) {
        const res = await dbManager.pgQuery(query);
        if (res.rowCount === 1) {
          if (global.websocket) {
            global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
            global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
          }
        }
        return res;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

exports.setEachScheduleGroup = async ({ groupName, ipaddress }) => {
  let beforeQuery;
  let notExistGroup;
  if (groupName === '없음') {
    notExistGroup = '없음';
  } else {
    beforeQuery = `SELECT schedule_time FROM "ob_breathsensor_schedule" WHERE name='${groupName}'`
  }

  try {
    if (notExistGroup && notExistGroup.length > 0) {
      const query = `UPDATE "ob_breathsensor" SET schedule_group='', schedule_time='', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
      if (query) {
        const res = await dbManager.pgQuery(query);
        if (res.rowCount === 1) {
          if (global.websocket) {
            global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
            global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
          }
        }
        return res;
      }
    } else if (beforeQuery && beforeQuery.length > 0) {
      const result = await dbManager.pgQuery(beforeQuery);
      const groupTimeSchedule = result.rows[0].schedule_time

      const query = `UPDATE "ob_breathsensor" SET schedule_group='${groupName}',schedule_time='${groupTimeSchedule}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
      if (query) {
        const res = await dbManager.pgQuery(query);
        if (res.rowCount === 1) {
          if (global.websocket) {
            global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
            global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
          }
        }
        return res;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

exports.setGroupApplyToAll = async ({ groupName }) => {
  let beforeQuery;
  let notExistGroup;
  if (groupName === '없음') {
    notExistGroup = '없음';
  } else {
    beforeQuery = `SELECT schedule_time FROM "ob_breathsensor_schedule" WHERE name='${groupName}'`
  }

  try {
    if (notExistGroup && notExistGroup.length > 0) {
      const query = `UPDATE "ob_breathsensor" SET schedule_group='', schedule_time='', updated_at=NOW()`;
      if (query) {
        const res = await dbManager.pgQuery(query);
        if (res && res.rowCount && res.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
            global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
          }
        }
        return res;
      }
    } else if (beforeQuery && beforeQuery.length > 0) {
      const result = await dbManager.pgQuery(beforeQuery);
      const groupTimeSchedule = result.rows[0].schedule_time
      const query = `UPDATE "ob_breathsensor" SET schedule_group='${groupName}',schedule_time='${groupTimeSchedule}', updated_at=NOW()`;
      if (query) {
        const res = await dbManager.pgQuery(query);
        if (res && res.rowCount && res.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
            global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
          }
        }
        return res;
      }
    }
  }



  catch (err) {
    console.log(err);
  }
}

exports.delSchedule = async (delScheduleTimeGroupName) => {
  const beforeQuery = `DELETE FROM ob_breathsensor_schedule WHERE name='${delScheduleTimeGroupName}'`;
  try {
    const result = await dbManager.pgQuery(beforeQuery);

    // let scheduleTime = result.rows[0].schedule_time;
    // const timeArray = scheduleTime.split("^");
    // const findDeleteTime = timeArray.findIndex((arr) => arr === delScheduleTimeGroupName)

    // let delResult;
    // if ((timeArray.length !== 1) && ((timeArray.length - 1) === findDeleteTime)) {
    //   delResult = scheduleTime.replace(`^${delScheduleTimeGroupName}`, '')
    // } else if (timeArray.length === 1) {
    //   delResult = '';
    // } else {
    //   delResult = scheduleTime.replace(`${delScheduleTimeGroupName}^`, '')
    // }

    const query = `UPDATE "ob_breathsensor" SET schedule_group='', schedule_time='' WHERE schedule_group='${delScheduleTimeGroupName}'`;

    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
          global.websocket.emit("vitalsensorScheduleList", { vitalsensorScheduleList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.getScheduleTime = async (limit, idx = undefined) => {
  let nLimit = 100;
  if (limit && limit !== null &&
    limit.trim() !== '' &&
    isNaN(limit) === false) {
    nLimit = limit;
  }

  const query = `SELECT * FROM ob_breathsensor ORDER BY idx ASC LIMIT ${nLimit}`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getScheduleGroup = async (limit, idx = undefined) => {
  let nLimit = 100;
  if (limit && limit !== null &&
    limit.trim() !== '' &&
    isNaN(limit) === false) {
    nLimit = limit;
  }

  const query = `SELECT * FROM ob_breathsensor_schedule ORDER BY idx ASC LIMIT ${nLimit}`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.cameraForVitalsensor = async (id, cameraId, service_type, type) => {
  const query = `UPDATE "ob_device" SET camera_id='${cameraId}', updated_at=NOW() WHERE id='${id}' AND service_type='${service_type}' AND type='${type}'`;
  console.log('query  > ', query);
  try {
    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: res.rowCount });
          global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.cameraForEbell = async (id, cameraId, service_type, type) => {
  const query = `UPDATE "ob_device" SET camera_id='${cameraId}', updated_at=NOW() WHERE id='${id}' AND service_type='${service_type}' AND type='${type}'`;
  try {
    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.cameraForMdet = async (idx, cameraId, service_type, type) => {
  const query = `UPDATE "ob_device" SET camera_id='${cameraId}', updated_at=NOW() WHERE idx=${idx} AND service_type='${service_type}' AND type='${type}'`;
  console.log('query  > ', query);
  try {
    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: res.rowCount });
        }
      }
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.getVitalLog = async (ipaddress) => {
  const nLimit = 60;
  const query = `SELECT * FROM ob_breath_log WHERE ipaddress='${ipaddress}' ORDER BY idx DESC LIMIT ${nLimit}`;
  try {
    const res = await dbManager.pgQuery(query);
    const valueData = res.rows;
    return valueData;
  } catch (error) {
    console.log('호흡로그 조회 err: ', error);
  }
}

exports.getVitalLogData = async (newStartTime, newEndTime, ipaddress) => {
  const query = `SELECT MIN(CAST(sensor_value AS DECIMAL)), MAX(CAST(sensor_value AS DECIMAL)), ROUND(AVG(CAST(sensor_value AS DECIMAL))) FROM ob_breath_log WHERE ipaddress='${ipaddress}' AND dateTime BETWEEN '${newStartTime}' AND '${newEndTime}'`
  try {
    const res = await dbManager.pgQuery(query);
    // const valueData = res.rows;
    return res;
  } catch (error) {
    console.log('호흡로그 조회 err: ', error);
  }
}

exports.addVitalEvent = async (ipaddress, dataVal) => {
  try {
    let device;
    const sqlDevice = `SELECT * FROM ob_device WHERE ipaddress='${ipaddress}' AND type='vitalsensor'`;
    const resDevice = await dbManager.pgQuery(sqlDevice);

    if (resDevice && resDevice.rows && resDevice.rows.length > 0) {
      device = resDevice.rows[0];
    }

    if (device) {
      const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) 
        VALUES ('호흡이상감지', '현재 호흡감지: ${dataVal}', '${device.id}', ${device.building_idx}, ${device.floor_idx}, '${format(new Date(), 'yyyyMMdd')}' || 'T' || '${format(new Date(), 'HHmmss')}', 'vitalsensor', '${ipaddress}', 'observer', ${parseInt(28)}, '${device.camera_id}');`;
      const resEvent = await dbManager.pgQuery(sqlEvent);

      const queryDevice = `UPDATE ob_device SET status='1' WHERE ipaddress='${ipaddress}' AND type='vitalsensor'`;
      const resDevice = await dbManager.pgQuery(queryDevice);

      if (global.websocket && resDevice && resDevice.rowCount > 0) {
        global.websocket.emit("deviceList", { deviceList: resDevice.rowCount });
        global.websocket.emit("vitalsensorList", { vitalsensorList: resDevice.rowCount });
      }

      //MGIST 에 post 전달해서 사운드 재생 처리
      try {
        const postJson = { state: 'closed' };
        const postData = JSON.stringify(postJson);
        const request = axios({
          method: 'post',
          url: 'http://192.168.9.12:8082/device/di/0',
          data: postData
        }).catch(function (error) {
          console.log('mgist breath event sound error');
        });
      } catch (error) {
        console.log('mgist breath event sound error');
      }
      this.setTowerlamp('on');

      const resLast = await this.getEvents(undefined, undefined, undefined, device.id, 'observer', undefined, ipaddress);
      const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
      if (resLast && resLast.rows && resLast.rows.length > 0 && device.top_location && device.left_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '호흡이상감지',
                deviceId: resLast.rows[0].id,
                deviceType: resLast.rows[0].device_type,
                buildingIdx: resLast.rows[0].building_idx,
                floorIdx: resLast.rows[0].floor_idx,
                buildingServiceType: resLast.rows[0].building_service_type,
                serviceType: resLast.rows[0].service_type,
                cameraId: device.camera_id
              }
            }]
          });
        }
      } else {
        if (global.websocket && resEvent && resEvent.rowCount > 0) {
          global.websocket.emit("eventList", { eventList: resEvent.rowCount });
        }
      }

      const insertBillboard = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT display, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);

      if (resLast && resLast.rows && resLast.rows.length > 0 && insertBillboard && insertBillboard.rows && insertBillboard.rows.length > 0 && !insertBillboard.rows[0].unused && insertBillboard.rows[0].display) {
        let queryBillboard = `INSERT INTO ob_billboard (id, event_idx, device_id, service_type) VALUES ('1', '${resLast.rows[0].idx}', '${resLast.rows[0].id}', '${resLast.rows[0].service_type}') ON CONFLICT (id) DO UPDATE SET event_idx='${resLast.rows[0].idx}', device_id='${resLast.rows[0].id}', service_type='${resLast.rows[0].service_type}';`;
        const resBillboard = await dbManager.pgQuery(queryBillboard);
        if (global.websocket && resBillboard && resBillboard.rowCount > 0) {
          global.websocket.emit("billboard", { billboard: resBillboard.rowCount });
        }
      }
      if (global.websocket && resEvent && resEvent.rowCount > 0) {
        global.websocket.emit("eventList", { eventList: resEvent.rowCount });
      }
      return true;
    } else {
      return false;
    }

  } catch (err) {
    console.log(err);
  }
}

exports.addNDoctorEvent = async (ipaddress, type) => {
  try {
    let device;
    const sqlDevice = `SELECT * FROM ob_device WHERE ipaddress='${ipaddress}'`;
    const resDevice = await dbManager.pgQuery(sqlDevice);

    if (resDevice && resDevice.rows && resDevice.rows.length > 0) {
      device = resDevice.rows[0];
    }

    if (device) {
      let sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) 
        VALUES ('연결 끊어짐', '네트워크 연결 끊어짐: ${dataVal}', '${device.id}', ${device.building_idx}, ${device.floor_idx}, '${format(new Date(), 'yyyyMMdd')}' || 'T' || '${format(new Date(), 'HHmmss')}', ${device.type}, '${ipaddress}', 'observer', ${parseInt(33)}, '${device.camera_id}');`;

      if (type === 2) {
        sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) 
          VALUES ('연결 복구', '네트워크 연결 복구: ${dataVal}', '${device.id}', ${device.building_idx}, ${device.floor_idx}, '${format(new Date(), 'yyyyMMdd')}' || 'T' || '${format(new Date(), 'HHmmss')}', ${device.type}, '${ipaddress}', 'observer', ${parseInt(34)}, '${device.camera_id}');`;
      }

      const resEvent = await dbManager.pgQuery(sqlEvent);

      const resLast = await this.getEvents(undefined, undefined, undefined, device.id, 'observer', undefined, ipaddress);
      const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
      const insertBillboard = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT display, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
      if (resLast && resLast.rows && resLast.rows.length > 0 && device.top_location && device.left_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup && global.websocket) {
        global.websocket.emit("eventList", {
          eventList: [{
            lastEvent: {
              eventName: '연결 끊어짐',
              deviceId: resLast.rows[0].id,
              deviceType: resLast.rows[0].device_type,
              buildingIdx: resLast.rows[0].building_idx,
              floorIdx: resLast.rows[0].floor_idx,
              buildingServiceType: resLast.rows[0].building_service_type,
              serviceType: resLast.rows[0].service_type,
            }
          }]
        });
      } else {
        if (global.websocket && resEvent && resEvent.rowCount > 0) {
          global.websocket.emit("eventList", { eventList: resEvent.rowCount });
        }
      }

      if (resLast && resLast.rows && resLast.rows.length > 0 && insertBillboard && insertBillboard.rows && insertBillboard.rows.length > 0 && !insertBillboard.rows[0].unused && insertBillboard.rows[0].display) {
        let queryBillboard = `INSERT INTO ob_billboard (id, event_idx, device_id, service_type) VALUES ('1', '${resLast.rows[0].idx}', '${resLast.rows[0].id}', '${resLast.rows[0].service_type}') ON CONFLICT (id) DO UPDATE SET event_idx='${resLast.rows[0].idx}', device_id='${resLast.rows[0].id}', service_type='${resLast.rows[0].service_type}';`;
        const resBillboard = await dbManager.pgQuery(queryBillboard);
        if (global.websocket && resBillboard && resBillboard.rowCount > 0) {
          global.websocket.emit("billboard", { billboard: resBillboard.rowCount });
        }
      }

      if (global.websocket && resEvent && resEvent.rowCount > 0) {
        global.websocket.emit("eventList", { eventList: resEvent.rowCount });
      }
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

// 출통 출입문 제어
// MSSQL의 Comm_Send_Packet 테이블에 insert 해주면 문열림/닫힘 처리됨
// 입력값은
// SenderIpAddress : Insert 하는 PC의 IP 정보
// DestIPAddress: 출입문 제어를 하려는 ACU의 IP 주소(ACU의 IP 정보는 System_Device 테이블 참고)
// SystemWorkID: 1로 고정
// DeviceID: 출입문 제어를 하려는 ACU의 DeviceID(ACU의 DeviceID 정보는 System_Device 테이블 참고)
// PacketCommand: OPC0로 고정
// PacketData1: 출입문 1번은 1, 2번은 3, 3번은 5, 4번은 7을 입력
// PacketData2: 문을 열기 1로, 닫기 0
// PacketData3: 5초 개방인 경우 50을 입력(10초면 100)
// PacketData4: 0 고정
// PacketData5는 0 고정
// PacketStatus는 SW로 고정(정상적으로 전송이 완료되면, 이 부분이 자동으로 SC로 변경됨)
exports.doorControl = async (acuId, acuIpaddress, doorId, command, cmdSec) => {
  const doorIdNew = doorId.substring(doorId.length - 1);
  let doorNum;
  if (doorIdNew === '1') {
    doorNum = '1';
  } else if (doorIdNew === '2') {
    doorNum = '3';
  } else if (doorIdNew === '3') {
    doorNum = '5';
  } else if (doorIdNew === '4') {
    doorNum = '7';
  } else {
    return false;
  }
  let setSeconds = 50;
  if (cmdSec && parseInt(cmdSec) > 5) {
    setSeconds = parseInt(cmdSec) * 10;
  }
  if ((command === '1' || command === 1) && cmdSec === undefined) {
    setSeconds = 65535;
  }
  if (command === 0 || command === '0') {
    setSeconds = 0;
  }
  try {
    const query = `INSERT INTO Comm_Send_Packet (
      SenderIPAddress,
      DestIPAddress,
      SystemWorkID,
      DeviceID, 
      PacketCommand,
      PacketData1,
      PacketData2,
      PacketData3,
      PacketData4,
      PacketData5,
      PacketStatus
      )
      VALUES
      (
      '${process.env.WEBSOCKET_URL}',
      '${acuIpaddress}',
      '1',
      '${acuId}',
      'OPC0',
      '${doorNum}',
      '${command}',
      '${setSeconds}',
      '0',
      '0',
      'SW'
      )`;
    const resMssql = await dbManager.mssqlQuery(query);

    return true;
  } catch (e) {
    console.log('doorControl err:', e);
  }
}

// exports.getNodeAndHistory = async (ipaddress) => {
//   const limit = 100;
//   let query = '';
//   console.log('ip : ',ipaddress);
//   if(ipaddress){
//     query = `SELECT * FROM ((
//       SELECT event.*, device.building_name, device.floor_name FROM
//       (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
//       FROM ob_event A
//       LEFT JOIN ob_event_type B ON A.event_type = B.idx
//       WHERE A.device_type='ebell') event
//       LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, d.id AS device_id FROM ob_device d
//                                               LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.service_type
//                                               LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.service_type) device
//       ON event.id = device.device_id
//       )
//       UNION
//       (
//       SELECT event.idx, event.name, event.description, event.id, camera.building_idx, camera.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user, event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name, event.event_type_severity, camera.building_name, camera.floor_name FROM
//       (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
//       FROM ob_event A
//       LEFT JOIN ob_event_type B ON A.event_type = B.idx
//       WHERE device_type='camera') event
//       LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, c.id AS camera_id, c.building_idx, c.floor_idx FROM ob_camera c
//                                               LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.service_type
//                                               LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.service_type) camera
//       ON camera.camera_id = event.id
//       )) AS A WHERE A.ipaddress='${ipaddress}' ORDER BY event_occurrence_time DESC, event_type_severity DESC LIMIT ${limit}`;
//   }


//   try {
//     const res = await dbManager.pgQuery(query);
//     if (res) {
//       return res.rows;

//     }
//   }
//   catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

exports.getDbCameraLiveStream = async (id, format = 'mjpeg', valid_token_hours = 12) => {
  const query1 = `SELECT * FROM ob_vms`;
  try {
    const res = await dbManager.pgQuery(query1);
    if (res && res.rows.length > 0) {
      let username = res.rows[0].id !== undefined ? res.rows[0].id : "root";
      let password = res.rows[0].password !== undefined ? res.rows[0].password : "root";
      let mgist_ip = res.rows[0].ipaddress !== undefined ? res.rows[0].ipaddress : "localhost";
      let mgist_port = res.rows[0].port !== undefined ? res.rows[0].port : "80";

      const vms = res.rows[0];
      const url = `http://${mgist_ip}:${mgist_port}/live/media/${vms.name}/DeviceIpint.${id}/SourceEndpoint.video:0:0?format=${format}&speed=1&w=480&h=360&valid_token_hours=${valid_token_hours}&enable_token_auth=1`;
      const restResponse = await axios({
        method: "get",
        url: url,
        auth: {
          username: username,
          password: password
        },
        responseType: "json",
      });

      if (restResponse.data.path) {
        return `http://${mgist_ip}:${mgist_port}` + restResponse.data.path;
      } else {
        throw 'no rest api result';
      }
    } else {
      throw 'no camera in db';
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getBuilding = async (limit, idx = undefined) => {
  let nLimit = 100;
  if (limit && limit !== null &&
    limit.trim() !== '' &&
    isNaN(limit) === false) {
    nLimit = limit;
  }
  let condition = '';
  if (idx) {
    condition += `WHERE idx='${idx}'`;
  }
  const query = `SELECT * FROM ob_building ${condition} ORDER BY idx ASC`;// LIMIT ${nLimit}`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.modifyBuilding = async (name, serviceType, modifyName) => {
  let query = '';
  if (serviceType && name && modifyName) {
    query = `UPDATE ob_building SET name='${modifyName}' WHERE service_type='${serviceType}' AND name='${name}'`;
  }
  try {
    const res = await dbManager.pgQuery(query);
    if (res) {
      if (global.websocket) {
        global.websocket.emit("buildingList", { buildingList: { 'modify': res.rowCount } });
      }
      return res;
    }
  }
  catch (err) {
  }
}

exports.getFloor = async (limit, idx = undefined) => {
  let nLimit = 100;
  if (limit && limit !== null &&
    limit.trim() !== '' &&
    isNaN(limit) === false) {
    nLimit = limit;
  }
  let condition = '';
  if (idx) {
    condition += `WHERE idx='${idx}'`;
  }
  const query = `SELECT * FROM ob_floor ${condition} ORDER BY idx ASC LIMIT ${nLimit}`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.findFloor = async (buildingIdx) => {
  const query = `SELECT * FROM ob_floor WHERE building_idx='${buildingIdx}'`;
  try {

  }
  catch (err) {
    console.log(err);
  }
}

exports.getDevice = async (limit, idx = undefined, ipaddress) => {
  let nLimit = 100;
  if (limit && limit !== null &&
    limit.trim() !== '' &&
    isNaN(limit) === false) {
    nLimit = limit;
  }
  let condition = '';
  if (idx) {
    condition += `WHERE idx='${idx}'`;
  }
  if (ipaddress) {
    condition += `WHERE ipaddress='${ipaddress}'`;
  }
  const query = `SELECT a.*, b.name as floorName, c.name as buildingName 
    FROM ob_device a 
    LEFT OUTER JOIN ob_floor b ON a.floor_idx=b.idx AND a.building_service_type = b.service_type
    LEFT OUTER JOIN ob_building c ON b.building_idx = c.idx AND b.service_type = c.service_type ${condition};`;

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getGuardianlite = async (limit, idx = undefined) => {
  let nLimit = 100;
  if (limit && limit !== null &&
    limit.trim() !== '' &&
    isNaN(limit) === false) {
    nLimit = limit;
  }
  let condition = '';
  if (idx) {
    condition += `WHERE idx='${idx}'`;
  }
  const query = `SELECT D.*, G.id AS gl_id, G.password, G.ch1, G.ch2, G.ch3, G.ch4, G.ch5, G.temper, G.idx AS gl_idx, F.name AS floorName, B.name AS buildingName FROM ob_guardianlite G 
    LEFT JOIN ob_device D ON G.ipaddress=D.ipaddress 
    LEFT OUTER JOIN ob_floor F ON D.floor_idx=F.idx AND D.building_service_type = F.service_type 
    LEFT OUTER JOIN ob_building B ON F.building_idx = B.idx AND F.service_type = B.service_type ${condition} ORDER BY idx DESC;`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.createGuardianlite = async ({ name, building_idx, building_service_type, floor_idx, ipaddress, left_location, top_location }) => {

  const queryDevice = `INSERT INTO ob_device (id, building_idx, building_service_type, floor_idx, type, name, ipaddress, left_location, top_location, service_type) 
                                      VALUES ('${name}', ${building_idx}, '${building_service_type}', ${floor_idx}, 'guardianlite', '${name}', '${ipaddress}', '${left_location}', '${top_location}', 'observer')`;

  const queryGuardianlite = `INSERT INTO ob_guardianlite (name, ipaddress) VALUES ('${name}', '${ipaddress}')`;

  try {
    const res1 = await dbManager.pgQuery(queryDevice);
    const res2 = await dbManager.pgQuery(queryGuardianlite);

    if (global.websocket && ((res1 && res1.rowCount > 0) && (res2 && res2.rowCount > 0))) {
      global.websocket.emit("guardianlites", { guardianlites: 1 });
    }

    return res2;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.deleteGuardianlite = async ({ idx, service_type }) => {

  try {
    const querySelect = `SELECT * FROM ob_device WHERE idx=${idx} AND service_type='${service_type}'`;
    const resSelect = await dbManager.pgQuery(querySelect);
    if (resSelect && resSelect.rows && resSelect.rows.length > 0) {
      if (resSelect.rows[0].ipaddress) {
        const queryDevice = `DELETE FROM ob_device WHERE idx=${idx} AND service_type='${service_type}'`;
        const queryGuardianlite = `DELETE FROM ob_guardianlite WHERE ipaddress='${resSelect.rows[0].ipaddress}'`;

        const res1 = await dbManager.pgQuery(queryDevice);
        const res2 = await dbManager.pgQuery(queryGuardianlite);

        if (global.websocket && ((res1 && res1.rowCount > 0) && (res2 && res2.rowCount > 0))) {
          global.websocket.emit("deviceList", { deviceList: res1.rowCount });
          global.websocket.emit("guardianlites", { guardianlites: res2.rowCount });
        }
        return res2;
      } else {
        throw `device does not have ipaddress:${resSelect.rows[0].ipaddress}`;
      }
    } else {
      throw `device does not exist with idx:${idx}, service_type:${service_type}`;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.setGuardianliteChannel = async ({ idx, ipaddress, id, password, channel, cmd }) => {

  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => {
      return retryCount * 1000
    }
  })
  try {
    let para = 'R';
    let command = cmd;
    // 채널1은 reset 만됨 - 채널1을 on으로 설정하면 reset 됨
    if (channel === 1) {
      command = 'on';
    }
    // 채널2~8 은 R2~R8 형식으로 파라메터가 사용됨
    if (channel > 1) {
      para += channel;
    }

    let timeout = 5000;
    let resGuardianlite = null;
    const CancelToken = axios.CancelToken;
    let cancel;
    setTimeout(() => {
      if (resGuardianlite === null) {
        cancel && cancel('가디언라이트 연결 시간 초과');
      }
    }, timeout);
    let form = new FormData();
    form.append('id', id);
    form.append('password', password)

    await axios({
      method: 'post',
      url: `http://${ipaddress}`,
      data: qs.stringify(form),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      cancelToken: new CancelToken((c) => {
        cancel = c;
      }),
    }).then((res) => {
      resGuardianlite = res;
    }).catch((err) => {
      console.log('guardianlite login err: ', err);
      throw err;
    })
    if (resGuardianlite && resGuardianlite.data && resGuardianlite.data.indexOf('Login') === -1) {
      // const url = `http://${ipaddress}/${id}:${password}?${para}=${command}`
      const url = `http://${ipaddress}?${para}=${command}`
      const resGuardianlite = await axios.get(url, {
        headers: {
          'Host': ipaddress,
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': 1,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6'
        },
        timeout: 3000
      });
      if (resGuardianlite && resGuardianlite.data && resGuardianlite.data.indexOf('Login') === -1) {
        // 문자열 형식의 응답을 채널별 특정문자로 분할
        const arrSplit1 = resGuardianlite.data.split('<a href="?R');
        const arrSplit2 = resGuardianlite.data.split('<table border="1"><tr>');
        const channel = [];
        let temper;
        // 9개로 분할된 문자열 배열에서 각 채널의 ON/OFF 상태 문자열 검출 및 장비 온도 검출
        if (arrSplit1.length >= 9) {
          arrSplit1.map((str, index) => {
            if (index === 8) {
              const indexChStart = str.indexOf(`${index}=`);
              const indexChLast = str.indexOf(`">`);
              const ch = str.substring(indexChStart + 2, indexChLast);
              channel.push(ch);

              const indexTemperStart = str.indexOf(`</table>`);
              const indexTemperLast = str.indexOf('</h1>');
              temper = str.substring(indexTemperStart + 8, indexTemperLast);
            } else if (index === 1) {
              const indexChStart = str.indexOf(`=`);
              const indexChLast = str.indexOf('">');
              const ch = str.substring(indexChStart + 1, indexChLast);
              channel.push(ch);
            } else if (index > 1) {
              const indexChStart = str.indexOf(`${index}=`);
              const indexChLast = str.indexOf(`">`);
              const ch = str.substring(indexChStart + 2, indexChLast);
              channel.push(ch);
            }
          });

          if (channel.length >= 8 && temper) {
            querySelect = `SELECT * FROM ob_guardianlite WHERE idx=${idx}`;
            const resSelect = await dbManager.pgQuery(querySelect);
            if (resSelect && resSelect.rows && resSelect.rows.length > 0) {
              const old = resSelect.rows[0];
              if (old.ch1 !== channel[0] || old.ch2 !== channel[1] ||
                old.ch3 !== channel[2] || old.ch4 !== channel[3] ||
                old.ch5 !== channel[4] || old.ch6 !== channel[5] ||
                old.ch7 !== channel[6] || old.ch8 !== channel[7] ||
                old.temper !== temper) {
                const queryStringGl = `UPDATE "ob_guardianlite" SET 
                  ch1='${channel[0]}', 
                  ch2='${channel[1]}', 
                  ch3='${channel[2]}', 
                  ch4='${channel[3]}', 
                  ch5='${channel[4]}', 
                  ch6='${channel[5]}', 
                  ch7='${channel[6]}', 
                  ch8='${channel[7]}', 
                  temper='${temper}',
                  updated_at=NOW()                  
                  WHERE idx=${idx};`;

                const resGlUpdate = await dbManager.pgQuery(queryStringGl);

                const updateGlStatus = `UPDATE ob_device SET status=0, updated_at=NOW() WHERE ipaddress='${ipaddress}' AND status!=0`;
                const updateGlStatusRes = await dbManager.pgQuery(updateGlStatus);

                if ((resGlUpdate && resGlUpdate.rowCount > 0) || (updateGlStatusRes && updateGlStatusRes.rowCount > 0) && global.websocket) {
                  global.websocket.emit("guardianlites", {
                    guardianlites: updateGlStatus.rowCount
                  });
                  global.websocket.emit("deviceList", {
                    deviceList: updateGlStatusRes.rowCount
                  })
                }
              }
            }
          } else {
            console.log(`guardianlite 응답결과파싱값 오류: 파싱채널수 ${channel.length}, 온도값:${temper}`);
          }
        } else {
          console.log(`guardianlite 응답결과 문자열 분할수(channel) 오류: split수 ${arrSplit1.length.length}`);
        }
      } else {
        console.log(`guardianlite set 응답값 이상: ${resGuardianlite}`);
        throw new Error('Guardianlite Channel Update Failed ');
      }
      return resGuardianlite.data;
    } else {
      throw new Error('Guardianlite Login Failed');
    }
  } catch (error) {
    const updateGlChStatus = `UPDATE ob_guardianlite SET ch1=NULL, ch2=NULL, ch3=NULL, ch4=NULL, ch5=NULL, updated_at=NOW() WHERE idx=${idx} AND ipaddress='${ipaddress}' AND (ch1 IS NOT NULL OR ch2 IS NOT NULL OR ch3 IS NOT NULL OR ch4 IS NOT NULL OR ch5 IS NOT NULL)`;
    const updateGlChStatusRes = await dbManager.pgQuery(updateGlChStatus);
    const updateGlStatus = `UPDATE ob_device SET status=1, updated_at=NOW() WHERE ipaddress='${ipaddress}' AND status!=1`;
    const updateGlStatusRes = await dbManager.pgQuery(updateGlStatus);
    if ((updateGlChStatusRes && updateGlChStatusRes.rowCount > 0) || (updateGlStatusRes && updateGlStatusRes.rowCount > 0)) {
      global.websocket.emit("guardianlites", {
        guardianlites: updateGlChStatusRes.rowCount
      });
      global.websocket.emit("deviceList", {
        deviceList: updateGlStatusRes.rowCount
      })
    }
    console.log(error);
    throw error;
  }
}

exports.addVCounter = async ({ name, building_idx, building_service_type, floor_idx, ipaddress, port, location, install_type }) => {
  const queryDevice = `INSERT INTO ob_device (id, building_idx, building_service_type, floor_idx, type, name, location, ipaddress, service_type) 
                        VALUES ('${name}', ${building_idx}, '${building_service_type}', ${floor_idx}, 'vcounter', '${name}', '${location}', '${ipaddress}', 'observer')`;
  const query2 = `INSERT INTO ob_vcounter_count (name, ipaddress, port, type) VALUES ('${name}', '${ipaddress}', ${port}, '${install_type}')`;
  try {
    const res = await dbManager.pgQuery(queryDevice);
    const resVCounter = await dbManager.pgQuery(query2);
    if (global.websocket && res && res.rowCount > 0) {
      global.websocket.emit("deviceList", { deviceList: res.rowCount });
    }
    if (global.vCounterwebsocket && resVCounter && resVCounter.rowCount > 0) {
      await this.addVCounterOperLog(name, ipaddress, 0, 0, 0, 'add vcounter');
      global.vCounterwebsocket.emit('manageVCounter', { cmd: 'add', ipaddress: ipaddress, port: port });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.updateVCounter = async ({ ipaddress, empty_slots, in_count, out_count, type }) => {
  let query;
  let inQuery;
  let outQuery;
  if(type === 'in_out'){
    query = `UPDATE ob_vcounter_count SET empty_slots=${empty_slots}, in_count=${in_count}, out_count=${out_count} WHERE ipaddress='${ipaddress}'`
  } else {
    inQuery = `UPDATE ob_vcounter_count SET empty_slots=${empty_slots}, in_count=${in_count} WHERE type='in'`;
    outQuery = `UPDATE ob_vcounter_count SET empty_slots=${empty_slots}, out_count=${out_count} WHERE type='out'`;
  }

  try {
    const resQuery = query && await dbManager.pgQuery(query);
    const resInQuery = inQuery && await dbManager.pgQuery(inQuery);
    const resOutQuery = outQuery && await dbManager.pgQuery(outQuery);

    if (global.websocket && resQuery && resQuery.rowCount > 0) {
      const vCountersQuery = `SELECT * FROM ob_vcounter_count WHERE ipaddress='${ipaddress}'`;
      const updateVCounter = await dbManager.pgQuery(vCountersQuery);
      if(updateVCounter && updateVCounter.rows && updateVCounter.rows.length > 0){
        const { name, ipaddress, empty_slots, in_count, out_count } = updateVCounter.rows[0];
        await this.addVCounterOperLog(name, ipaddress, empty_slots, in_count, out_count, '관리자 수동 조정');
        global.websocket.emit("vCounterInfo", { updateVcounter: {
          name,
          ipaddress,
          empty_slots,
          in_count,
          out_count
        }});
      }
      return resQuery;
    }

    if (global.websocket && resInQuery && resInQuery.rowCount > 0) {
      const vCountersInQuery = `SELECT * FROM ob_vcounter_count WHERE type='in`;
      const updateVCounter = await dbManager.pgQuery(vCountersInQuery);
      if(updateVCounter && updateVCounter.rows && updateVCounter.rows.length > 0){
        const { name, ipaddress, empty_slots, in_count } = updateVCounter.rows[0];
        await this.addVCounterOperLog(name, ipaddress, empty_slots, in_count, '', '관리자 수동 조정');
        global.websocket.emit("vCounterInfo", { updateVcounter: {
          name,
          ipaddress,
          empty_slots,
          in_count
        }});
      }
      return resInQuery;
    }

    if (global.websocket && resOutQuery && resOutQuery.rowCount > 0) {
      const vCountersOutQuery = `SELECT * FROM ob_vcounter_count WHERE type='out`;
      const updateVCounter = await dbManager.pgQuery(vCountersOutQuery);
      if(updateVCounter && updateVCounter.rows && updateVCounter.rows.length > 0){
        const { name, ipaddress, empty_slots, out_count } = updateVCounter.rows[0];
        await this.addVCounterOperLog(name, ipaddress, empty_slots, '', out_count, '관리자 수동 조정');
        global.websocket.emit("vCounterInfo", { updateVcounter: {
          name,
          ipaddress,
          empty_slots,
          out_count
        }});
      }
      return resOutQuery;
    }
  } catch (err) {
    console.error('custom update VCounter err: ', err)
    throw err;
  }
}

exports.getVCounterList = async () => {
  let query = `SELECT name, ipaddress, empty_slots, in_count, out_count FROM ob_vcounter_count`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.createPids = async ({ name, building_idx, building_service_type, floor_idx, ipaddress, left_location, top_location, location }) => {

  const queryDevice = `INSERT INTO ob_device (id, building_idx, building_service_type, floor_idx, type, name, location, ipaddress, left_location, top_location, service_type) 
                                      VALUES ('${name}', ${building_idx}, '${building_service_type}', ${floor_idx}, 'pids', '${name}', '${location}', '${ipaddress}', '${left_location}', '${top_location}', 'observer')`;

  const queryPids = `INSERT INTO ob_pids (id, name, location, ipaddress, type, building_idx, building_service_type, floor_idx) VALUES 
    ('${name}-zone1', 'zone1', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0'),
    ('${name}-zone2', 'zone2', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0'), 
    ('${name}-zone3', 'zone3', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0'), 
    ('${name}-zone4', 'zone4', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0'), 
    ('${name}-zone5', 'zone5', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0'), 
    ('${name}-zone6', 'zone6', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0'), 
    ('${name}-zone7', 'zone7', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0'), 
    ('${name}-zone8', 'zone8', '${location}', '${ipaddress}', 'zone', '0', '${building_service_type}', '0')
  `;

  try {
    const res1 = await dbManager.pgQuery(queryDevice);
    const res2 = await dbManager.pgQuery(queryPids);

    if (global.websocket) {
      global.websocket.emit("deviceList", { deviceList: res1.rowCount });
      global.websocket.emit("pidsList", { pidsList: res2.rowCount });
    }

    return res2;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.pidsZoneInterlock = async ({ id, left_location, top_location, line_x1, line_x2, line_y1, line_y2, floor_idx, building_idx, service_type }) => {
  const queryDevice = `UPDATE "ob_pids" SET left_location='${left_location}', top_location='${top_location}', line_x1='${line_x1}', line_x2='${line_x2}', line_y1='${line_y1}', line_y2='${line_y2}', floor_idx=${floor_idx}, building_idx=${building_idx}, building_service_type='${service_type}', updated_at=NOW() WHERE id='${id}'`;
  try {
    console.log('query Device : ', queryDevice);
    const res = await dbManager.pgQuery(queryDevice);
    if (global.websocket) {
      global.websocket.emit("pidsList", { pidsList: res.rowCount });
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.pidsEvent = async (id, status) => {
  console.log('service :: ', id, status);
  const queryDevice = `UPDATE "ob_pids" SET status='${status}', updated_at=NOW() WHERE id='${id}'`;
  const sqlZone = `SELECT * FROM ob_pids WHERE id='${id}'`;

  try {
    console.log('query Device : ', queryDevice);
    const res = await dbManager.pgQuery(queryDevice);
    const resZone = await dbManager.pgQuery(sqlZone);
    if (resZone && resZone.rows && resZone.rows.length > 0) {
      targetZone = resZone.rows[0];
      const sqlInsertEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) 
                                    VALUES ('${targetZone.id}', '${targetZone.location}', '${targetZone.id}', ${targetZone.building_idx},${targetZone.floor_idx}, TO_CHAR(NOW(), 'YYYYMMDD') || 'T' || TO_CHAR(NOW(), 'HH24MISS'),'${targetZone.type}', '${targetZone.ipaddress}','${targetZone.service_type}',29, '${targetZone.camera_id}');`;
      const resInsertEvent = await dbManager.pgQuery(sqlInsertEvent);
      const resLast = await this.getEvents(undefined, undefined, undefined, targetZone.id, targetZone.service_type, undefined, targetZone.ipaddress);
      const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
      if (targetZone && targetZone.camera_id && targetZone.left_location && targetZone.top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup && global.websocket) {
        global.websocket.emit("eventList", {
          eventList: [{
            lastEvent: {
              eventName: 'PIDS 이벤트 감지',
              deviceId: targetZone.id,
              deviceType: targetZone.type,
              buildingIdx: targetZone.building_idx,
              floorIdx: targetZone.floor_idx,
              buildingServiceType: targetZone.building_service_type,
              serviceType: targetZone.service_type,
              cameraId: targetZone.camera_id
            }
          }]
        });
      } else {
        if (global.websocket && resInsertEvent && resInsertEvent.rowCount > 0) {
          global.websocket.emit("eventList", { eventList: resInsertEvent.rowCount });
        }
      }
    }
    if (global.websocket && res && res.rowCount > 0) {
      global.websocket.emit("pidsList", { pidsList: res.rowCount });
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.removePidsGdp200 = async ({ name, ipaddress }) => {
  try {
    const query = `UPDATE "ob_pids" SET top_location=NULL, left_location=NULL, line_x1=NULL, line_x2=NULL, line_y1=NULL, line_y2=NULL, camera_id=NULL, camera_id_sub1=NULL, camera_id_sub2=NULL, camera_id_preset_start=NULL, status=0, updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
    const res = await dbManager.pgQuery(query);

    if (global.websocket) {
      await global.websocket.emit("pidsList", { pidsList: res.rowCount });
    }
    return res
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.removePidsGdp = async ({ name, ipaddress }) => {
  try {
    const querySelect = `SELECT * FROM ob_device WHERE name='${name}' AND ipaddress='${ipaddress}'`;
    const resSelect = await dbManager.pgQuery(querySelect);
    if (resSelect && resSelect.rows && resSelect.rows.length > 0) {
      if (resSelect.rows[0].ipaddress) {
        const queryDevice = `DELETE FROM ob_device WHERE name='${name}' AND ipaddress='${ipaddress}'`;
        const queryPids = `DELETE FROM ob_pids WHERE ipaddress='${resSelect.rows[0].ipaddress}'`;
        const res1 = await dbManager.pgQuery(queryDevice);
        const res2 = await dbManager.pgQuery(queryPids);

        if (global.websocket) {
          await global.websocket.emit("deviceList", { deviceList: res1.rowCount });
          await global.websocket.emit("pidsList", { pidsList: res2.rowCount });
        }
      } else {
        throw `device does not have ipaddress:${resSelect.rows[0].ipaddress}`;
      }
    } else {
      throw `device does not exist with name:${name}, ipaddress:${ipaddress}`;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getMapImage = async () => {
  try {
    let imageArray = [];
    const imagePath = path.join(__dirname, '..', 'public', 'images', 'floorplan');
    fs.readdirSync(imagePath).forEach(file => {
      console.log(file);
      const url = `http://${process.env.WEBSOCKET_URL}:${process.env.PORT}/images/floorplan/${file}`;
      imageArray.push({
        name: file,
        url: url
      });
    });
    return imageArray;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getEvents = async (theStartDate, theEndDate, sort, deviceId, serviceType, limit, ipaddress, noLimit) => {

  let condition1 = '';
  let condition2 = '';
  let nLimit = 20;
  if (limit) {
    nLimit = limit;
  } else if (noLimit) {
    nLimit = 999;
  }
  if (theStartDate && theEndDate) {
    if (ipaddress) {
      condition1 += `AND event_occurrence_time BETWEEN '${theStartDate}' AND '${theEndDate}' AND ipaddress='${ipaddress}'`;
    } else {
      condition1 += `AND event_occurrence_time BETWEEN '${theStartDate}' AND '${theEndDate}'`;
    }
  } else if (sort === 'severity') {
    condition2 += `ORDER BY event_type_severity DESC, event_occurrence_time DESC LIMIT '${nLimit}'`;
  } else {
    if ((!deviceId) && (!serviceType) && (!ipaddress)) {
      condition2 += `ORDER BY event_occurrence_time DESC, event_type_severity DESC LIMIT '${nLimit}'`
    } else {
      if (serviceType) {
        condition1 += ` AND A.service_type='${serviceType}'`;
      }
      if (deviceId && serviceType) {
        condition1 += ` AND id='${deviceId}'`;
      } else if (ipaddress) {
        condition1 += ` AND ipaddress='${ipaddress}'`;
      }
      condition2 += `ORDER BY event_occurrence_time DESC, event_type_severity DESC LIMIT '${nLimit}'`;
    }
  }


  const query = `SELECT E.* FROM ((
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE A.device_type='ebell' AND B.unused=false ${condition1}) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, d.id AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON event.id = device.device_id AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, device.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE (A.device_type!='ebell' AND A.device_type != 'camera' AND A.device_type != 'zone' AND B.unused=false ${condition1})) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, CAST(d.idx AS TEXT) AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name, d.camera_id, d.type, d.ipaddress FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON CASE WHEN device.type='pids' THEN event.ipaddress = device.ipaddress WHEN device.type='vitalsensor' THEN event.ipaddress = device.ipaddress WHEN device.type ='mdet' THEN event.ipaddress = device.ipaddress ELSE event.id = device.device_id END AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, camera.building_idx, camera.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, camera.building_name, camera.floor_name, camera.service_type AS building_service_type, camera.camera_id AS device_idx, camera.left_location, camera.top_location, camera.location, camera.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='camera' AND B.unused=false ${condition1}) event
      LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location, c.name FROM ob_camera c
      LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
      ON camera.camera_id = event.id
  ) 
  	UNION
	(
    SELECT event.idx, event.name, event.description, event.id, pids.building_idx, pids.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, pids.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, pids.building_name, pids.floor_name, pids.service_type AS building_service_type, pids.id, pids.left_location, pids.top_location, pids.location, pids.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='zone' AND B.unused=false ${condition1}) event
      LEFT OUTER JOIN (SELECT p.id, b.name AS building_name, CASE WHEN p.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, p.camera_id AS camera_id, p.building_idx, p.floor_idx, p.location, p.name, p.left_location, p.top_location FROM ob_pids p
      LEFT OUTER JOIN ob_floor f ON f.idx = p.floor_idx AND f.service_type=p.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=p.building_service_type) pids
      ON pids.id = event.id
  )) AS E LEFT JOIN ob_setting S ON (CASE WHEN E.service_type!='observer' THEN E.service_type=S.name WHEN (E.device_type != 'zone' AND E.device_type != 'camera') THEN E.device_type=S.name WHEN E.device_type='zone' THEN 'pids'=S.name END) WHERE S.setting_value='true' AND S.description='Use by service or not by service' OR (E.service_type='observer' AND E.device_type='camera' ) ${condition2}`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.getInquiryEvents = async (event_type, severity, startDateTime, endDateTime, acknowledge, service_type, device_type, ipaddress, noLimit) => {

  let condition1 = '';
  let condition2 = '';
  let nLimit = 20;
  if (noLimit) {
    nLimit = 999;
  }

  if (event_type) {
    if (condition2) {
      condition2 += ` AND event_type='${parseInt(event_type)}'`;
    } else {
      condition2 += `WHERE event_type='${parseInt(event_type)}'`;
    }
  }

  if (severity) {
    if (condition2) {
      condition2 += ` AND event_type_severity='${severity}' `;
    } else {
      condition2 += `WHERE event_type_severity='${severity}' `;
    }
  }

  if (startDateTime && endDateTime) {
    condition1 += `AND event_occurrence_time BETWEEN '${startDateTime}' AND '${endDateTime}'`;
  } else if (startDateTime) {
    condition1 += `AND event_occurrence_time >= '${startDateTime}'`;
  } else if (endDateTime) {
    condition1 += `AND event_occurrence_time <= '${endDateTime}'`;
  }

  if (acknowledge) {
    if (condition2) {
      condition2 += ` AND acknowledge='${acknowledge}' `;
    } else {
      condition2 += `WHERE acknowledge='${acknowledge}' `;
    }
  }

  if (service_type) {
    if (service_type === 'guardianlite') {
      if (condition2) {
        condition2 += ` AND service_type='observer' AND device_type='${service_type}' `;
      } else {
        condition2 += `WHERE service_type='observer' AND device_type='${service_type}' `;
      }
    } else if (service_type === 'abpr') {
      if (condition2) {
        condition2 += ` AND service_type='observer' AND device_type='${service_type}' `;
      } else {
        condition2 += `WHERE service_type='observer' AND device_type='${service_type}' `;
      }
    } else if (service_type === 'vitalsensor') {
      if (condition2) {
        condition2 += ` AND service_type='observer' AND device_type='${service_type}' `;
      } else {
        condition2 += `WHERE service_type='observer' AND device_type='${service_type}' `;
      }
    } else if (service_type === 'pids') {
      if (condition2) {
        condition2 += ` AND service_type='observer' AND device_type='zone' `;
      } else {
        condition2 += `WHERE service_type='observer' AND device_type='zone' `;
      }
    } else {
      if (condition2) {
        condition2 += ` AND service_type='${service_type}' `;
      } else {
        condition2 += `WHERE service_type='${service_type}'`;
      }
    }
  }

  if (device_type) {
    if (condition2) {
      condition2 += ` AND device_type='${device_type}' `;
    } else {
      condition2 += `WHERE device_type='${device_type}' `;
    }
  }

  if (ipaddress) {
    if (condition2) {
      condition2 += ` AND ipaddress='${ipaddress}' `;
    } else {
      condition2 += `WHERE ipaddress='${ipaddress}' `;
    }
  }

  const query = `SELECT * FROM ((
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE A.device_type='ebell' ${condition1}) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, d.id AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON event.id = device.device_id AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, device.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE (A.device_type!='ebell' AND A.device_type != 'camera' AND A.device_type != 'zone' AND B.unused=false ${condition1})) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, CAST(d.idx AS TEXT) AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name, d.camera_id, d.type, d.ipaddress FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON CASE WHEN device.type='pids' THEN event.ipaddress = device.ipaddress WHEN device.type='vitalsensor' THEN event.ipaddress = device.ipaddress WHEN device.type ='mdet' THEN event.ipaddress = device.ipaddress ELSE event.id = device.device_id END AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, camera.building_idx, camera.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, camera.building_name, camera.floor_name, camera.service_type AS building_service_type, camera.camera_id AS device_idx, camera.left_location, camera.top_location, camera.location, camera.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='camera' ${condition1}) event
      LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location, c.name FROM ob_camera c
      LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
      ON camera.camera_id = event.id
  ) 
  	UNION
	(
    SELECT event.idx, event.name, event.description, event.id, pids.building_idx, pids.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, pids.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, pids.building_name, pids.floor_name, pids.service_type AS building_service_type, pids.id, pids.left_location, pids.top_location, pids.location, pids.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='zone' ${condition1}) event
      LEFT OUTER JOIN (SELECT p.id, b.name AS building_name, CASE WHEN p.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, p.camera_id AS camera_id, p.building_idx, p.floor_idx, p.location, p.name, p.left_location, p.top_location FROM ob_pids p
      LEFT OUTER JOIN ob_floor f ON f.idx = p.floor_idx AND f.service_type=p.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=p.building_service_type) pids
      ON pids.id = event.id
  )) AS ob_inquiry ${condition2} ORDER BY event_occurrence_time DESC, event_type_severity DESC LIMIT '${nLimit}'`
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.getEventsForChart = async (startDate, endDate, deviceIp) => {
  try {
    let query;
    if (startDate && endDate && deviceIp) {
      query =
        `SELECT ipaddress, to_char(to_date(event_occurrence_time, 'YYYYMMDD'), 'YYYY-MM') AS monthly, COUNT(*)
        FROM ob_event
        WHERE ipaddress='${deviceIp}' AND to_date(event_occurrence_time, 'YYYYMMDD') BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY ipaddress, monthly`;
      const res = await dbManager.pgQuery(query);
      if (res) {
        return res;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.getBillboard = async () => {
  const query = `SELECT b.* FROM ob_billboard a INNER JOIN ((
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE A.device_type='ebell') event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, d.id AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON event.id = device.device_id AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, device.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE (A.device_type!='ebell' AND A.device_type != 'camera' AND A.device_type != 'zone')) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, CAST(d.idx AS TEXT) AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name, d.camera_id, d.type, d.ipaddress FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON CASE WHEN device.type='pids' THEN event.ipaddress = device.ipaddress WHEN device.type='vitalsensor' THEN event.ipaddress = device.ipaddress ELSE event.id = device.device_id END AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, camera.building_idx, camera.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, camera.building_name, camera.floor_name, camera.service_type AS building_service_type, camera.camera_id AS device_idx, camera.left_location, camera.top_location, camera.location, camera.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='camera') event
      LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location, c.name FROM ob_camera c
      LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
      ON camera.camera_id = event.id
  ) 
  	UNION
	(
    SELECT event.idx, event.name, event.description, event.id, pids.building_idx, pids.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, pids.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, pids.building_name, pids.floor_name, pids.service_type AS building_service_type, pids.id, pids.left_location, pids.top_location, pids.location, pids.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='zone') event
      LEFT OUTER JOIN (SELECT p.id, b.name AS building_name, CASE WHEN p.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, p.camera_id AS camera_id, p.building_idx, p.floor_idx, p.location, p.name, p.left_location, p.top_location FROM ob_pids p
      LEFT OUTER JOIN ob_floor f ON f.idx = p.floor_idx AND f.service_type=p.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=p.building_service_type) pids
      ON pids.id = event.id
  )) b ON CAST(a.event_idx as INTEGER) = b.idx AND a.service_type = b.service_type;`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.removeBillboard = async (idx, service_type) => {
  const query = `DELETE FROM ob_billboard WHERE event_idx='${idx}' AND service_type='${service_type}'`;
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.setAcknowledge = async (idx, service_type, acknowledge_user, device_id, device_type, ipaddress, location) => {

  let condition1 = '';

  if (idx) {
    condition1 = `WHERE idx='${idx}'`;
  } else if (device_id) {
    if (condition1) {
      condition1 = `AND id='${device_id}'`;
    } else {
      condition1 = `WHERE id='${device_id}'`;
    }
  } else if (ipaddress) {
    if (condition1) {
      condition1 = `AND ipaddress='${ipaddress}'`;
    } else {
      condition1 = `WHERE ipaddress='${ipaddress}'`;
    }
  }

  let query;
  let query2;
  if (device_type === 'camera') {
    query = `UPDATE ob_event SET acknowledge = true, acknowledge_user = '${acknowledge_user}', acknowledged_at=NOW() ${condition1}`;
  } else if (device_type !== 'vitalsensor') {
    query = `UPDATE ob_event SET acknowledge = true, acknowledge_user = '${acknowledge_user}', acknowledged_at=NOW() ${condition1} AND service_type='${service_type}'`;
  } else if (device_type === 'vitalsensor') {
    query = `UPDATE ob_event SET acknowledge = true, acknowledge_user = '${acknowledge_user}', acknowledged_at=NOW() ${condition1} AND service_type='${service_type}'`;
  }
  let resultDeviceIds;
  if (location && service_type && device_type) {
    let selectDevices = `SELECT * FROM ob_device WHERE location='${location}' AND service_type='${service_type}' AND type='${device_type}'`;
    const resultDevices = await dbManager.pgQuery(selectDevices);
    if (resultDevices && resultDevices.rows && resultDevices.rows.length > 0) {
      query = `UPDATE ob_event SET acknowledge = true, acknowledge_user = '${acknowledge_user}', acknowledged_at=NOW() WHERE ipaddress IN ('${resultDevices.rows.map((device) => device.ipaddress).join("','")}')`;
      const findDeviceId = `SELECT id FROM ob_device WHERE ipaddress IN ('${resultDevices.rows.map((device) => device.ipaddress).join("','")}')`
      resultDeviceIds = await dbManager.pgQuery(findDeviceId);
    }
  }

  try {
    const res = query && await dbManager.pgQuery(query);
    if (global.websocket && res && res.rowCount > 0) {
      global.websocket.emit("eventList", { eventList: res.rowCount });
      if(service_type === 'parkingcontrol'){
        global.websocket.emit("parkingEvent", { parkingEvent: res.rowCount});
      }
    }

    // ack 설정시 카메라 비상해제 처리
    if (idx) {
      const queryEvent = `SELECT * FROM ob_event WHERE idx=${idx} and service_type='${service_type}'`;
      const resEvent = await dbManager.pgQuery(queryEvent);
      if (resEvent && resEvent.rows && resEvent.rows.length > 0) {
        const event = resEvent.rows[0];
        if (event) {
          if (event.device_type === 'camera') {
            const queryDevice = `UPDATE ob_camera SET status='0' WHERE id='${event.id}'`;
            const resDevice = await dbManager.pgQuery(queryDevice);
            if (resDevice && resDevice.rowCount > 0) {
              if (global.websocket) {
                global.websocket.emit("cameraList", { cameraList: resDevice.rowCount });
              }
            }
            const queryCamera = `UPDATE ob_camera
              SET status='1'
              FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
              WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
              WHERE ob_camera.id=subquery.id`;
            const resCamera = await dbManager.pgQuery(queryCamera);
            if (global.websocket && resCamera.rowCount > 0) {
              global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
            }
          } else if (event.device_type === 'zone') {
            const queryDevice = `UPDATE ob_pids SET status='0' WHERE id='${event.id}'`;
            const resDevice = await dbManager.pgQuery(queryDevice);
            if (resDevice && resDevice.rowCount > 0) {
              if (global.websocket) {
                global.websocket.emit("pidsList", { pidsList: resDevice.rowCount });
              }
            }
            // 이벤트 확인 후 장치 상태 변경 처리
            const queryUpdateState = `UPDATE ob_pids
              SET status=1
              FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
              WHERE acknowledge=FALSE AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
              WHERE ob_pids.id=subquery.id`;
            const resUpdateState = await dbManager.pgQuery(queryUpdateState);
            if (resUpdateState && resUpdateState.rowCount > 0) {
              if (global.websocket) {
                global.websocket.emit("pidsList", { pidsList: resUpdateState.rowCount });
              }
            }
          } else if(event.device_type === 'crowddensity') {
            const queryDevice = `UPDATE ob_camera SET status='0' WHERE id='${event.id}'`;
            const resDevice = await dbManager.pgQuery(queryDevice);
            if (resDevice && resDevice.rowCount > 0) {
              if (global.websocket) {
                global.websocket.emit("cameraList", { cameraList: resDevice.rowCount });
                global.websocket.emit("crowdDensityCamera", { crowdDensityCamera: resDevice.rowCount });
              }
            }
          } else {
            const queryDevice = `UPDATE ob_device SET status='0' WHERE id='${event.id}' AND service_type='${service_type}'`;
            const resDevice = await dbManager.pgQuery(queryDevice);
            if (resDevice && resDevice.rowCount > 0) {
              if (global.websocket) {
                global.websocket.emit("deviceList", { deviceList: resDevice.rowCount });
                if (event.device_type === 'vitalsensor') {
                  global.websocket.emit("vitalsensorList", { vitalsensorList: resDevice.rowCount });
                }
              }
            }
            // 이벤트 확인 후 장치 상태 변경 처리
            const queryUpdateState = `UPDATE ob_device
              SET status=1
              FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
              WHERE acknowledge=FALSE AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
              WHERE ob_device.id=subquery.id AND ob_device.type != 'ebell'`;
            const resUpdateState = await dbManager.pgQuery(queryUpdateState);
            if (resUpdateState && resUpdateState.rowCount > 0) {
              if (global.websocket) {
                global.websocket.emit("deviceList", { deviceList: resUpdateState.rowCount });
                if (event.device_type === 'vitalsensor') {
                  global.websocket.emit("vitalsensorList", { vitalsensorList: resDevice.rowCount });
                }
              }
            }
          }
        }
      }
    } else if (location && service_type && device_type) {
      const queryDevice = `UPDATE ob_device SET status='0' WHERE location='${location}' AND service_type='${service_type}' AND type='${device_type}'`;
      const resDevice = await dbManager.pgQuery(queryDevice);
      if (resDevice && resDevice.rowCount > 0) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: resDevice.rowCount });
          if (device_type === 'vitalsensor') {
            global.websocket.emit("vitalsensorList", { vitalsensorList: resDevice.rowCount });
          }
        }
      }
      // 이벤트 확인 후 장치 상태 변경 처리
      const queryUpdateState = `UPDATE ob_device
          SET status=1
          FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
          WHERE acknowledge=FALSE AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
          WHERE ob_device.id=subquery.id AND ob_device.type != 'ebell'`;
      const resUpdateState = await dbManager.pgQuery(queryUpdateState);
      if (resUpdateState && resUpdateState.rowCount > 0) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: resUpdateState.rowCount });
          if (device_type === 'vitalsensor') {
            global.websocket.emit("vitalsensorList", { vitalsensorList: resDevice.rowCount });
          }
        }
      }
    } else {
      if (device_type === 'camera') {
        const queryDevice = `UPDATE ob_camera SET status='0' WHERE id='${device_id}'`;
        const resDevice = await dbManager.pgQuery(queryDevice);
        if (resDevice && resDevice.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("cameraList", { cameraList: resDevice.rowCount });
          }
        }
        const queryCamera = `UPDATE ob_camera
          SET status='1'
          FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
          WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
          WHERE ob_camera.id=subquery.id`;
        const resCamera = await dbManager.pgQuery(queryCamera);
        if (global.websocket && resCamera.rowCount > 0) {
          global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
        }
      } else if (device_type === 'zone') {
        const queryDevice = `UPDATE ob_pids SET status='0' WHERE id='${device_id}'`;
        const resDevice = await dbManager.pgQuery(queryDevice);
        if (resDevice && resDevice.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("pidsList", { pidsList: resDevice.rowCount });
          }
        }
        // 이벤트 확인 후 장치 상태 변경 처리
        const queryUpdateState = `UPDATE ob_pids
          SET status=1
          FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
          WHERE acknowledge=FALSE AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
          WHERE ob_pids.id=subquery.id`;
        const resUpdateState = await dbManager.pgQuery(queryUpdateState);
        if (resUpdateState && resUpdateState.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("pidsList", { pidsList: resUpdateState.rowCount });
          }
        }
      } else if (device_type === 'ebell') {
        const queryDevice = `UPDATE ob_device SET status='0' WHERE ipaddress='${ipaddress}'`;
        const resDevice = await dbManager.pgQuery(queryDevice);
        if (resDevice && resDevice.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("deviceList", { deviceList: resDevice.rowCount });
          }
        }
      } else {
        const queryDevice = `UPDATE ob_device SET status='0' WHERE id='${device_id}' AND service_type='${service_type}'`;
        const resDevice = await dbManager.pgQuery(queryDevice);
        if (resDevice && resDevice.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("deviceList", { deviceList: resDevice.rowCount });
            if (device_type === 'vitalsensor') {
              global.websocket.emit("vitalsensorList", { vitalsensorList: resDevice.rowCount });
            }
          }
        }
        // 이벤트 확인 후 장치 상태 변경 처리
        const queryUpdateState = `UPDATE ob_device
          SET status=1
          FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
          WHERE acknowledge=FALSE AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
          WHERE ob_device.id=subquery.id AND ob_device.type != 'ebell'`;
        const resUpdateState = await dbManager.pgQuery(queryUpdateState);
        if (resUpdateState && resUpdateState.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("deviceList", { deviceList: resUpdateState.rowCount });
            if (device_type === 'vitalsensor') {
              global.websocket.emit("vitalsensorList", { vitalsensorList: resDevice.rowCount });
            }
          }
        }
      }
    }
    // ack 처리시 층정보도 업데이트
    dbPolling.refreshFloorStatus();

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.addLocation = async ({ id, top_location, left_location, buildingIdx, floorIdx, buildingServiceType, type, ipaddress, location, install_location }) => {
  let query;
  let query2;

  if (type === 'ebell') {
    query = `UPDATE ob_device SET building_idx = '${buildingIdx}', building_service_type = '${buildingServiceType}', floor_idx = '${floorIdx}', left_location = '${left_location}', top_location = '${top_location}' WHERE id='${id}'`;
  } else {
    if (floorIdx) {
      query = `UPDATE ob_camera SET building_idx = '${buildingIdx}', building_service_type = '${buildingServiceType}', floor_idx = '${floorIdx}', left_location = '${left_location}', top_location = '${top_location}' WHERE id='${id}'`;
    } else {
      query = `UPDATE ob_camera SET building_service_type = '${buildingServiceType}', left_location = '${left_location}', top_location = '${top_location}' WHERE id='${id}'`;
    }
  }
  if (type === 'door') {
    console.log('type === door 함수 실행')
    query = `UPDATE ob_device SET building_idx = '${buildingIdx}', floor_idx = '${floorIdx}', building_service_type = '${buildingServiceType}', left_location = '${left_location}', top_location = '${top_location}' WHERE id='${id}'`;
  } else if (type === 'vitalsensor') {
    query = `INSERT INTO ob_device (id, building_idx, building_service_type, floor_idx, type, name, ipaddress, left_location, top_location, service_type, location) 
    VALUES ('${id}', ${buildingIdx}, '${buildingServiceType}', ${floorIdx}, 'vitalsensor', '${id}', '${ipaddress}', '${left_location}', '${top_location}', 'observer', '${location}')`;

    const queryResult = `SELECT * FROM "ob_breathsensor"`;
    const res = await dbManager.pgQuery(queryResult);
    // let scheduleTimeCheck;
    // if (res && res.rows.length !== 0) {
    //   scheduleTimeCheck = res.rows[0].schedule_time;
    // }

    // if (scheduleTimeCheck && scheduleTimeCheck.length !== 0) {
    //   query2 = `INSERT INTO ob_breathsensor (name, ipaddress, location, use_status, schedule_time) VALUES   
    //             ('${id}', '${ipaddress}', '${location}', 'true', '${scheduleTimeCheck}')`;
    // } else {
    //   query2 = `INSERT INTO ob_breathsensor (name, ipaddress, location, use_status, schedule_time) VALUES   
    //             ('${id}', '${ipaddress}', '${location}', 'true', '')`;
    // }
    query2 = `INSERT INTO ob_breathsensor (name, ipaddress, location, use_status, prison_door_status, prison_door_id, breath_value, schedule_time, install_location) VALUES   
                ('${id}', '${ipaddress}', '${location}', 'true', 'lock', '', '65', '', '${install_location}')`;
  } else if (type === 'vcounter') {
    query = `UPDATE ob_device SET building_idx = '${buildingIdx}', building_service_type = '${buildingServiceType}', floor_idx = '${floorIdx}', left_location = '${left_location}', top_location = '${top_location}' WHERE ipaddress='${id}' AND type='vcounter'`;
  } else if (type === 'mdet'){
    query = `INSERT INTO ob_device (id, building_idx, building_service_type, floor_idx, type, name, ipaddress, left_location, top_location, service_type, location) 
    VALUES ('${id}', ${buildingIdx}, '${buildingServiceType}', ${floorIdx}, 'mdet', '${id}', '${ipaddress}', '${left_location}', '${top_location}', 'mdet', '${location}')`;
  }

  try {
    const res = await dbManager.pgQuery(query);
    if (query2 && query2.length > 0) {
      const res2 = await dbManager.pgQuery(query2);
    }
    if (global.websocket) {
      if (res.rowCount === 1) {
        global.websocket.emit("cameraList", { cameraList: res.rowCount });
        global.websocket.emit("eventList", { eventList: res.rowCount });
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
        global.websocket.emit("vitalsensorList", { vitalsensorList: res.rowCount });
      }
    }

    if (type === 'vitalsensor') {
      if (global.breathwebsocket) {
        global.breathwebsocket.emit('manageVitalsensor', { cmd: 'add', ipaddress: ipaddress });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
  }
}

exports.addBuilding = async ({ name, left_location, top_location, service_type }) => {
  const query = `INSERT INTO ob_building (name, left_location, top_location, service_type) VALUES ('${name}', '${left_location}',  '${top_location}', '${service_type}')`;
  try {
    const res = await dbManager.pgQuery(query);
    console.log(`check ::::::::::: ${res.rowCount} rows`);
    if (res) {
      if (global.websocket) {
        global.websocket.emit("buildingList", { buildingList: { 'add': res.rowCount } });
      }
      return res;
    } else { // <- 중복값이 있으면 
      return ('중복에러')
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.addFloor = async (name, buildingIdx, mapImage, service_type) => {
  const query = `INSERT INTO ob_floor (name, building_idx, map_image, service_type, status) VALUES ('${name}', ${buildingIdx}, '${mapImage}', '${service_type}', '0')`;
  console.log(query);
  try {
    const res = await dbManager.pgQuery(query);
    if (res) {
      if (global.websocket) {
        global.websocket.emit("floorList", { floorList: { 'add': res.rowCount } });
      }
      return res;
    } else { // <- 중복값이 있으면 
      return ('중복에러')
    }
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

exports.modifyFloor = async (name, buildingIdx, serviceType, modifyName) => {
  let query = '';
  if (buildingIdx && serviceType && name && modifyName) {
    query = `UPDATE ob_floor SET name='${modifyName}' WHERE building_idx='${buildingIdx}' AND service_type='${serviceType}' AND name='${name}'`;
  }
  try {
    const res = await dbManager.pgQuery(query);
    if (res) {
      if (global.websocket) {
        global.websocket.emit("floorList", { floorList: { 'modify': res.rowCount } });
      }
      return res;
    }
  }
  catch (err) {
  }
}

exports.removeBuilding = async ({ name, type, service_type }) => {
  let query = '';
  if (name && service_type) {
    query = `DELETE FROM ob_building WHERE name='${name}' AND service_type='${service_type}'`;
  }
  console.log(query);
  try {
    const res = await dbManager.pgQuery(query);
    if (res) {
      if (global.websocket) {
        global.websocket.emit("buildingList", { buildingList: { 'delete': res.rowCount } });
      }
      return res;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.removeFloor = async ({ buildingIdx, serviceType, floorName, floorIdx }) => {
  let query = '';
  let deviceLocationInitialQuery = '';
  let pidsLocationInitialQuery = '';
  let cameraLocationInitialQuery = '';
  if (buildingIdx && serviceType && floorName && floorIdx) {
    query = `DELETE FROM ob_floor WHERE building_idx=${buildingIdx} AND service_type='${serviceType}' AND name='${floorName}'`;
    deviceLocationInitialQuery = `UPDATE ob_device SET left_location='', top_location='' WHERE building_idx=${buildingIdx} AND floor_idx=${floorIdx}`;
    pidsLocationInitialQuery = `UPDATE ob_pids SET left_location='', top_location='' WHERE building_idx=${buildingIdx} AND floor_idx=${floorIdx}`;
    cameraLocationInitialQuery = `UPDATE ob_camera SET left_location='', top_location='' WHERE building_idx=${buildingIdx} AND floor_idx=${floorIdx}`;
  }

  try {
    const res = await dbManager.pgQuery(query);
    const res2 = await dbManager.pgQuery(deviceLocationInitialQuery);
    const res3 = await dbManager.pgQuery(pidsLocationInitialQuery);
    const res4 = await dbManager.pgQuery(cameraLocationInitialQuery);

    if (res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("floorList", { floorList: { 'remove': res.rowCount } });
      }
      return res;
    }
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}


exports.selectEvent = async (idx, serviceType) => {
  // const query = `SELECT * FROM ob_event WHERE idx=${idx} and service_type='${serviceType}'`;
  const query = `SELECT e.idx, e.name, e.description, e.id, e.building_idx, e.floor_idx, e.event_occurrence_time, e.event_end_time, e.status, e.severity, e.acknowledge, e.acknowledge_user, e.device_type, e.connection, e.ipaddress, e.service_type, d.name AS device_name, CASE WHEN (e.service_type='accesscontrol' OR e.service_type='ebell') THEN d.camera_id ELSE e.camera_id END, e.snapshot_path, e.acknowledged_at FROM
  (SELECT * FROM ob_event WHERE idx=${idx} and service_type='${serviceType}') AS e
  LEFT JOIN
  (SELECT camera_id, id, name FROM ob_device) AS d
  ON e.id=d.id
  `
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    throw error;
  }
}

exports.getArchiveStreamTokenUrl = async (idx, serviceType, cameraId, eventTime) => {
  const query1 = `SELECT * FROM ob_vms`;
  try {
    const response = await dbManager.pgQuery(query1);
    if (response && response.rows.length > 0) {
      let username = response.rows[0].id !== undefined ? response.rows[0].id : "root";
      let password = response.rows[0].password !== undefined ? response.rows[0].password : "root";
      let mgist_ip = response.rows[0].ipaddress !== undefined ? response.rows[0].ipaddress : "localhost";
      let mgist_port = response.rows[0].port !== undefined ? response.rows[0].port : "80";

      let serverUrl = "http://" + username + ":" + password + '@' + mgist_ip + ":" + mgist_port;
      const camVendorModel = `SELECT vendor, model FROM ob_camera WHERE id='${cameraId}'`;
      try {
        const camResult = await dbManager.pgQuery(camVendorModel);
        if (camResult && camResult.rows.length > 0) {
          if (camResult.rows[0].model !== undefined || camResult.rows[0].vendor.length !== undefined) {
            if (camResult.rows[0].model === 'Virtual' || camResult.rows[0].vendor === 'Virtual') {
              const TokenUrl = `${serverUrl}/archive/media/${response.rows[0].name}/DeviceIpint.${cameraId}/SourceEndpoint.video:0:0/${eventTime}?format=mpeg&speed=1&w=450&h=210&enable_token_auth=1&valid_token_hours=1`;
              const mark = 'virtual';
              return res = { TokenUrl, username, password, mgist_ip, mgist_port, mark };
            }
            else {
              const TokenUrl = `${serverUrl}/archive/media/${response.rows[0].name}/DeviceIpint.${cameraId}/SourceEndpoint.video:0:0/${eventTime}?format=mp4&speed=1&w=450&h=210&enable_token_auth=1&valid_token_hours=1`;
              const mark = 'live';
              return res = { TokenUrl, username, password, mgist_ip, mgist_port, mark };
            }
          }
        }
        else {
          const mark = 'loading';
          return res = { mark };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.eventRecData = async (res) => {
  const username = res.username;
  const password = res.password;
  if (res && res.TokenUrl) {
    const restResponse = await axios({
      method: "get",
      url: res.TokenUrl,
      auth: {
        username,
        password
      },
      responseType: "json",
    });
    if (restResponse.data.path) {
      const pathUrl = `http://${res.mgist_ip}:${res.mgist_port}` + restResponse.data.path;
      const formatMark = res.mark;
      return dataResult = { pathUrl, formatMark };
    } else {
      throw 'no rest api result';
    }
  }
  else if (res && res.TokenUrl === undefined) {
    const formatMark = res.mark;
    return formatMark
  }
}

exports.getSnapshot = async (eventTime, eventIdx, serviceType) => {
  const query1 = `SELECT * FROM ob_vms`;
  try {
    const response = await dbManager.pgQuery(query1);
    if (response && response.rows.length > 0) {
      let username = response.rows[0].id !== undefined ? response.rows[0].id : "root";
      let password = response.rows[0].password !== undefined ? response.rows[0].password : "root";
      let mgist_ip = response.rows[0].ipaddress !== undefined ? response.rows[0].ipaddress : "localhost";
      let mgist_port = response.rows[0].port !== undefined ? response.rows[0].port : "80";
      let serverUrl = "http://" + username + ":" + password + '@' + mgist_ip + ":" + mgist_port;
      const query2 = `SELECT * FROM ob_event  WHERE idx=${eventIdx} AND service_type='${serviceType}'`;
      const res = await dbManager.pgQuery(query2);
      if (res && res.rows.length > 0) {
        let url = serverUrl + "/export/archive/" + response.rows[0].name + "/" + "DeviceIpint." + res.rows[0].camera_id + "/SourceEndpoint.video:0:0/" + eventTime + "/" + eventTime;
        let exportId = "";
        const queryString = {
          "format": "jpg"
        };
        let postData = JSON.stringify(queryString);
        const result = await axios({
          method: "post",
          url: url,
          headers: {
            "Connection": 'keep-alive',
            "Content-Type": 'application/json',
            "Content-Length": Buffer.byteLength(postData)
          },
          "data": postData,
          "accept": "*/*",
          "withCredentials": true,
          "responseType": "json",
        })
        exportId = result.headers.location;

        const urlData = {
          serverUrl,
          exportId,
        }
        return urlData;
      } else {
        throw ("해당 이벤트가 없습니다.");
      }
    } else {
      throw ("VMS 정보가 없습니다.");
    }
  }
  catch (err) {
    throw (err);
  }
}

exports.makeDownloadUrl = async (serverUrl, exportId) => {
  let reqUrl = serverUrl + exportId + "/status";
  try {
    const res = await axios({
      method: "get",
      url: reqUrl,
      responseType: "json",
    })
    if (res) {
      console.log('state : ', res.data.state);
      console.log('res data : ', res.data);
      if (res.data.state === 2) {
        let downloadUrl = serverUrl + exportId + "/file?name=" + res.data.files[0];
        // console.log('downloadUrl ====> ', downloadUrl);
        return downloadUrl;
      } else {
        throw (res.data.state);
      }
    } else {
      throw ("이미지 status 호출 실패");
    }
  }
  catch (err) {
    console.log('make err', err);
  }
}


// exports.snapshotLocalPathSave = async (url, eventOccurrenceTime, camId, eventIdx, serviceType) => {
//   try {
//     const download_image = async (url, image_path) => {
//       try {
//         if (url !== undefined) {
//           console.log('url =', url);
//           const res = await axios({
//             url,
//             responseType: 'stream',
//             auth: {
//               username: 'root',
//               password: 'root',
//             },
//           });
//           if (res && res.data) {
//             const res2 = res.data.pipe(fs.createWriteStream(image_path));
//           }
//         } else {
//           console.log('url is undefined');
//         }
//       } catch (err) {
//         console.log('res err:', err);
//       }
//     }

//     (async () => {
//       try {
//         if (url !== undefined) {
//           const imagePath = path.join(__dirname, '..', 'public', 'images', 'event_snapshot', `DeviceIpint.${camId}_${eventOccurrenceTime}_snapshot.jpg`);
//           const dbSaveSnapshotPath = `/images/event_snapshot/DeviceIpint.${camId}_${eventOccurrenceTime}_snapshot.jpg`;
//           const query = `UPDATE ob_event SET snapshot_path='${dbSaveSnapshotPath}' WHERE idx=${eventIdx} AND service_type='${serviceType}'`;
//           const snapQuery = await dbManager.pgQuery(query);
//           let saveSnapshot = await download_image(url, imagePath);
//         }
//       } catch (error) {
//         console.log('error:', error)
//       }
//     })();
//   }
//   catch (err) {
//     console.log('snapshot save err:', err);
//   }
// }

exports.snapshotLocalPathSave = async (url, eventOccurrenceTime, camId, eventIdx, serviceType) => {
  try {
    const download_image = async (url, image_path) => {
      try {
        if (url !== undefined) {
          console.log('url =', url);
          const res = await axios({
            url,
            responseType: 'stream',
            auth: {
              username: 'root',
              password: 'root',
            },
          });
          if (res && res.data) {
            const res2 = res.data.pipe(fs.createWriteStream(image_path));
          }
        } else {
          console.log('url is undefined');
        }
      } catch (err) {
        console.log('res err:', err);
      }
    }

    (async () => {
      try {
        if (url !== undefined) {
          const imagePath = path.join(__dirname, '..', 'public', 'images', 'crowd_density_snapshot', `DeviceIpint.${camId}_${eventOccurrenceTime}_snapshot.jpg`);
          const dbSaveSnapshotPath = `/images/event_snapshot/DeviceIpint.${camId}_${eventOccurrenceTime}_snapshot.jpg`;
          const query = `UPDATE ob_event SET snapshot_path='${dbSaveSnapshotPath}' WHERE idx=${eventIdx} AND service_type='${serviceType}'`;
          const snapQuery = await dbManager.pgQuery(query);
          let saveSnapshot = await download_image(url, imagePath);
        }
      } catch (error) {
        console.log('error:', error)
      }
    })();
  }
  catch (err) {
    console.log('snapshot save err:', err);
  }
}

exports.getSnapshotPath = async (eventIdx, serviceType) => {
  const query = `SELECT snapshot_path FROM ob_event WHERE idx=${eventIdx} AND service_type='${serviceType}'`;
  try {
    const res = await dbManager.pgQuery(query);
    return res.rows[0].snapshot_path;
  }
  catch (err) {
    console.log(err);
  }
}

exports.delSnapshot = async (idx, exportId) => {
  const query1 = `SELECT * FROM ob_vms`;
  try {
    const response = await dbManager.pgQuery(query1);
    if (response && response.rows.length > 0) {
      let username = response.rows[0].id !== undefined ? response.rows[0].id : "root";
      let password = response.rows[0].password !== undefined ? response.rows[0].password : "root";
      let mgist_ip = response.rows[0].ipaddress !== undefined ? response.rows[0].ipaddress : "localhost";
      let mgist_port = response.rows[0].port !== undefined ? response.rows[0].port : "80";

      let serverUrl = "http://" + username + ":" + password + '@' + mgist_ip + ":" + mgist_port;

      const deleteUrl = serverUrl + exportId;
      console.log('deleteUrl :', deleteUrl);
      await axios({
        method: 'delete',
        url: deleteUrl
      })
    } else {
      throw err;
    }
  }
  catch (err) {
    throw err;
  }
}

exports.recognizePlate = async (deviceIp, deviceId, deviceName, eventDatetime) => {

  let fromTime;
  let toTime;

  if (eventDatetime.length < 15) {
    console.log('MGIST 에서 보낸 이벤트의 차량인식시간이 잘못됨');
    throw 'MGIST 에서 보낸 이벤트의 차량인식시간이 잘못됨';
  }

  try {

    if (!vmsIpaddress) {
      const queryVms = `SELECT * FROM ob_vms`;
      const resVms = await dbManager.pgQuery(queryVms);
      if (resVms && resVms.rows && resVms.rows.length > 0) {
        vmsIpaddress = resVms.rows[0].ipaddress;
        vmsPort = resVms.rows[0].port;
      }
    }

    // MGIST 에서 차량감지 로그 검색시작/종료 시간 구하기(이벤트 발생시간 -30~+20 초 구간을 조회)
    const eventTimeStr_Date = eventDatetime.substring(0, 4) + '-' + eventDatetime.substring(4, 6) + '-' + eventDatetime.substring(6, 8);
    const eventTimeStr_Time = eventDatetime.substring(9, 11) + ':' + eventDatetime.substring(11, 13) + ':' + eventDatetime.substring(13, 15);
    const eventTimeObj = new Date(eventTimeStr_Date + ' ' + eventTimeStr_Time);

    const fromTimeObj = addSeconds(eventTimeObj, -30);
    fromTime = format(fromTimeObj, 'yyyyMMdd') + 'T' + format(fromTimeObj, 'HHmmss');

    const toTimeObj = addSeconds(eventTimeObj, 20);
    toTime = format(toTimeObj, 'yyyyMMdd') + 'T' + format(toTimeObj, 'HHmmss');

    if (!fromTime || !toTime) {
      console.log('MGIST 차량감지 로그 검색시작이나 종료시간을 구하지 못함');
      throw 'MGIST 차량감지 로그 검색시작이나 종료시간을 구하지 못함';
    }

    console.log('이벤트시간:', eventDatetime);
    console.log(`시작:${fromTime}, 종료:${toTime}`);

    // ANPR 지원 MGIST 와 미지원 MGIST 가 동시에 사용되어 
    const res = await axios.post(`http://${vmsIpaddress}:${vmsPort}/grpc`, {
      //const res = await axios.post(`http://192.168.7.190:89/grpc`, {
      "method": "axxonsoft.bl.events.EventHistoryService.ReadLprEvents",
      "data": {
        "range": {
          "begin_time": fromTime,
          "end_time": toTime,
        },
        "limit": 50,
        "offset": 0
      }
    },
      {
        auth: {
          username: 'root',
          password: 'root'
        }
      });

    //console.log('res:', JSON.parse(res.data));
    let lastPlate = '';
    const arrData = res.data.split('\r\n');
    arrData.forEach(async (data) => {
      if (data.indexOf('plate_full') >= 0) {
        //console.log('data:', data);
        const arrPlate = data.split('"plate_full": "');
        arrPlate.forEach(async (plateRaw, index) => {
          if (index > 0) {
            const index = plateRaw.indexOf('"');
            const plate = plateRaw.substring(0, index);
            console.log('번호판:', plate);
            lastPlate = plate;
            // 검출시간 추출
            const startIndex = plateRaw.indexOf('"time_best": "');
            const endIndex = plateRaw.indexOf('",', startIndex);
            if (startIndex && endIndex) {
              const recogTime = plateRaw.substring(startIndex + 14, endIndex);
              console.log('recogTime:', recogTime);

              const recogTimeStr_Date = recogTime.substring(0, 4) + '-' + recogTime.substring(4, 6) + '-' + recogTime.substring(6, 8);
              const recogTimeStr_Time = recogTime.substring(9, 11) + ':' + recogTime.substring(11, 13) + ':' + recogTime.substring(13, 15);
              const recogTimeObj = new Date(recogTimeStr_Date + ' ' + recogTimeStr_Time);
              const recogTimeKrObj = addHours(recogTimeObj, 9);
              const recogTimeKrStr = format(recogTimeKrObj, 'yyyy-MM-dd HH:mm:ss');
              if (plateMap.has(recogTimeKrStr + '_' + plate) === false) {
                plateMap.set(recogTimeKrStr + '_' + plate, { recogtime: recogTimeKrStr, plate: plate });
                console.log('map 크기:', plateMap.size);

                const query = `INSERT INTO "ob_car_recognition" (
                  number,
                  camera_id,
                  recog_time
                  ) VALUES ('${plate}', '${deviceId}', '${recogTimeKrStr}')`;
                const res = await dbManager.pgQuery(query);

                if (global.websocket) {
                  global.websocket.emit("anpr", { anpr: plate });
                }

                // black white list 등록 차량인지 검사 
                const queryCamera = `SELECT * FROM ob_camera WHERE id='${deviceId}'`;
                const resCamera = await dbManager.pgQuery(queryCamera);
                if (resCamera && resCamera.rows && resCamera.rows.length > 0) {
                  const plate4 = plate.length > 3 ? plate.substring(plate.length - 4) : plate;
                  const checkBlist = await anprList.isBlackList(plate4);
                  const checkWlist = await anprList.isWhiteList(plate4);
                  if (checkBlist === true) {
                    const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type) 
                                              VALUES ('${deviceId + '.' + resCamera.rows[0].name}', '${plate}', '${deviceId}', ${resCamera.rows[0].buildingIdx ? resCamera.rows[0].buildingIdx : 0},${resCamera.rows[0].floorIdx ? resCamera.rows[0].floorIdx : 0}, '${format(recogTimeKrObj, 'yyyyMMdd') + 'T' + format(recogTimeKrObj, 'HHmmss')}','camera', '${resCamera.rows[0].ipaddress}','observer', 23);`;
                    const resEvent = await dbManager.pgQuery(sqlEvent);
                    const queryUpdateCamera = `UPDATE ob_camera SET status='1' WHERE id='${deviceId}'`
                    const resUpdateCamera = await dbManager.pgQuery(queryUpdateCamera);
                    const resLast = await this.getEvents(undefined, undefined, undefined, deviceId, 'observer', undefined, `'${resCamera.rows[0].ipaddress}'`);
                    const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
                    if (resLast && resLast.rows && resLast.rows.length > 0 && resCamera.rows[0].top_location && resCamera.rows[0].left_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
                      if (global.websocket) {
                        global.websocket.emit("eventList", {
                          eventList: [{
                            lastEvent: {
                              deviceId: resLast.rows[0].device_id,
                              deviceType: resLast.rows[0].device_type,
                              buildingIdx: resLast.rows[0].building_idx,
                              floorIdx: resLast.rows[0].floor_idx,
                              buildingServiceType: resLast.rows[0].building_service_type,
                              serviceType: resLast.rows[0].service_type,
                              camera_id: resLast.rows[0].device_id
                            }
                          }]
                        });
                      }
                    } else {
                      if (global.websocket && resEvent && resEvent.rowCount > 0) {
                        global.websocket.emit("eventList", { eventList: resEvent.rowCount });
                      }
                    }
                    if (global.websocket && resUpdateCamera && resUpdateCamera.rowCount > 0) {
                      global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
                    }
                    // const getIdxSql = `SELECT idx, event_type FROM ob_event WHERE description = '${plate}' AND event_occurrence_time = '${format(recogTimeKrObj, 'yyyyMMdd') + 'T' + format(recogTimeKrObj, 'HHmmss')}'`;
                    // const resGetIdx = await dbManager.pgQuery(getIdxSql);
                    // const displayAndUnUsed = resGetIdx && resGetIdx.rows && resGetIdx.rows.length > 0 && await dbManager.pgQuery(`SELECT display, unused FROM ob_event_type WHERE idx=${parseInt(resGetIdx.rows[0].event_type)};`);
                    // let queryBillboard = `INSERT INTO ob_billboard (id, event_idx, device_id, service_type) VALUES ('1', '${resGetIdx.rows[0].idx}', '${deviceId}', 'observer') ON CONFLICT (id) DO UPDATE SET event_idx='${resGetIdx.rows[0].idx}', device_id='${deviceId}', service_type='observer';`;
                    // const resBillboard = displayAndUnUsed && displayAndUnUsed.rows && displayAndUnUsed.rows.length > 0 && displayAndUnUsed.rows[0].display && !displayAndUnUsed.rows[0].unused && await dbManager.pgQuery(queryBillboard);
                    // if(resBillboard && resBillboard.rowCount > 0) {
                    //   if (global.websocket) {
                    //     global.websocket.emit("billboard", { billboard: resBillboard.rowCount });
                    //   }
                    // }
                    console.log('black list 차량');
                  } else if (checkWlist === true) {
                    console.log('white list 차량');
                    const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type) 
                                              VALUES ('${deviceId + '.' + resCamera.rows[0].name}', '${plate}', '${deviceId}', ${resCamera.rows[0].buildingIdx ? resCamera.rows[0].buildingIdx : 0},${resCamera.rows[0].floorIdx ? resCamera.rows[0].floorIdx : 0}, '${format(recogTimeKrObj, 'yyyyMMdd') + 'T' + format(recogTimeKrObj, 'HHmmss')}','camera', '${resCamera.rows[0].ipaddress}','observer', 24);`;
                    const resEvent = await dbManager.pgQuery(sqlEvent);
                    const queryUpdateCamera = `UPDATE ob_camera SET status='1' WHERE id='${deviceId}'`
                    const resUpdateCamera = await dbManager.pgQuery(queryUpdateCamera);
                    const resLast = await this.getEvents(undefined, undefined, undefined, deviceId, 'observer', undefined, `'${resCamera.rows[0].ipaddress}'`);
                    const setPopUp = resLast && resLast.rows && resLast.rows.length > 0 && await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${parseInt(resLast.rows[0].event_type)};`);
                    if (resLast && resLast.rows && resLast.rows.length > 0 && resCamera.rows[0].top_location && resCamera.rows[0].left_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
                      if (global.websocket) {
                        global.websocket.emit("eventList", {
                          eventList: [{
                            lastEvent: {
                              deviceId: resLast.rows[0].device_id,
                              deviceType: resLast.rows[0].device_type,
                              buildingIdx: resLast.rows[0].building_idx,
                              floorIdx: resLast.rows[0].floor_idx,
                              buildingServiceType: resLast.rows[0].building_service_type,
                              serviceType: resLast.rows[0].service_type,
                              camera_id: resLast.rows[0].device_id
                            }
                          }]
                        });
                      }
                    } else {
                      if (global.websocket && resEvent && resEvent.rowCount > 0) {
                        global.websocket.emit("eventList", { eventList: resEvent.rowCount });
                      }
                    }
                    if (global.websocket && resUpdateCamera && resUpdateCamera.rowCount > 0) {
                      global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
                    }
                    // const getIdxSql = `SELECT idx, event_type FROM ob_event WHERE description = '${plate}' AND event_occurrence_time = '${format(recogTimeKrObj, 'yyyyMMdd') + 'T' + format(recogTimeKrObj, 'HHmmss')}'`;
                    // const resGetIdx = await dbManager.pgQuery(getIdxSql);
                    // const displayAndUnUsed = resGetIdx && resGetIdx.rows && resGetIdx.rows.length > 0 && await dbManager.pgQuery(`SELECT display, unused FROM ob_event_type WHERE idx=${parseInt(resGetIdx.rows[0].event_type)};`);
                    // let queryBillboard = `INSERT INTO ob_billboard (id, event_idx, device_id, service_type) VALUES ('1', '${resGetIdx.rows[0].idx}', '${deviceId}', 'observer') ON CONFLICT (id) DO UPDATE SET event_idx='${resGetIdx.rows[0].idx}', device_id='${deviceId}', service_type='observer';`;
                    // const resBillboard = displayAndUnUsed && displayAndUnUsed.rows && displayAndUnUsed.rows.length > 0 && displayAndUnUsed.rows[0].display && !displayAndUnUsed.rows[0].unused && await dbManager.pgQuery(queryBillboard);
                    // if(resBillboard && resBillboard.rowCount > 0) {
                    //   if (global.websocket) {
                    //     global.websocket.emit("billboard", { billboard: resBillboard.rowCount });
                    //   }
                    // }
                  }
                }
              }

              // map 에 저장된 차량번호가 20개 이상이면 이전것 삭제
              if (plateMap.size > 5) {
                let first;
                for (let key of plateMap.keys()) {
                  first = key;
                  break;
                }
                plateMap.delete(first);
              }
            }
          }
        });
        //const obj = JSON.parse(data);
        //console.log('obj:', obj);
      }
    });

    console.log('-------------------------');

    return lastPlate;
  } catch (err) {
    console.log('옵저버 서비스에서 err확인: ', err);
    throw err;
  }
}

exports.saveCameraFromVms = async (ipaddress, port, id, password, syncCameraList) => {
  // 매개변수로 vms 정보를 입력 받았으면 사용
  try {
    let url;
    if (ipaddress && port && id && password) {
      url = `http://${id}:${password}@${ipaddress}:${port}/camera/list`;
    } else { // 아닌 경우 DB의 vms 테이블에 정보를 사용하여 vms에 접속
      const queryVms = `SELECT * FROM ob_vms`;
      const res = await dbManager.pgQuery(queryVms);
      if (res && res.rows && res.rows.length > 0) {
        const resIpaddress = res.rows[0].ipaddress;
        const resPort = res.rows[0].port;
        const resId = res.rows[0].id;
        const resPassword = res.rows[0].password;
        url = `http://${resId}:${resPassword}@${resIpaddress}:${resPort}/camera/list`;
      } else {
        throw ('vms info does not exist in vms table');
      }
    }

    if (url) {
      const resVms = await axios({
        method: "get",
        url: url,
        responseType: "json",
      });

      if (resVms && resVms.data && resVms.data.cameras && resVms.data.cameras.length > 0) {
        const VmsName = resVms.data.cameras[0].archives[0].accessPoint;
        const strArr = resVms.data.cameras.map(camera => {
          let cameraAccessPoint = '';
          if (camera.archives !== undefined && Array.isArray(camera.archives) && camera.archives.length > 0) {
            cameraAccessPoint = camera.archives[0].accessPoint;
          }
          let newId = camera.displayId;
          if (camera.displayId.indexOf('.0') >= 0) {
            newId = camera.displayId.substr(0, camera.displayId.length - 2);
          }
          const strValue = `('${newId}', 0, 0, '${camera.displayName}', '${camera.ipAddress}', '', '', '0', 'observer', '${camera.vendor}', '${camera.model}', '${cameraAccessPoint}')`;
          return strValue;
        });
        const queryValue = strArr.join(',');
        const queryString = `INSERT INTO "ob_camera" (
          "id",
          "building_idx",
          "floor_idx",
          "name",
          "ipaddress",
          "telemetry_control_id",
          "telemetry_control_preset",
          "status",
          "service_type",
          "vendor",
          "model",
          "access_point"
          ) VALUES ${queryValue}
          ON CONFLICT (id)
          DO UPDATE SET 
          name=EXCLUDED.name,
          ipaddress=EXCLUDED.ipaddress,
          vendor=EXCLUDED.vendor,
          model=EXCLUDED.model,
          access_point=EXCLUDED.access_point`;

        let startIndex = VmsName.indexOf("hosts/") + 6;
        let endIndex = VmsName.indexOf("/DeviceIpint");

        const queryUpsertVms = `UPDATE ob_vms SET name='${VmsName.substring(startIndex, endIndex)}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
        const resUpsertVms = await dbManager.pgQuery(queryUpsertVms);
        const resUpsert = syncCameraList && await dbManager.pgQuery(queryString);
        if (resUpsert.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("cameraList", { cameraList: resUpsert.rowCount });
          }
        }
        console.log('saved camera from vms:', resUpsert.rowCount);
        return resUpsert;

      } else {
        throw ('there is no data from vms');
      }
    } else {
      throw ('no vms parameters(ip, port, id, password)');
    }
  } catch (error) {
    console.error("saveCameraFromVms : ", error);
  }
}

exports.createCarNumber = async (type, number, name, description) => {

  const query = `INSERT INTO "ob_car_number" (type, number, name, description) 
                                      VALUES ('${type}', '${number}', '${name}', '${description}')`;

  try {
    const res = await dbManager.pgQuery(query);
    anprList.loadBlackWhiteList();
    return res;
  } catch (error) {
    console.log(error);
    if (error.code === '23505') {
      throw error.code;
    }
    throw error;
  }
}

exports.getCarRecognition = async (camera_id, type, startDateTime, endDateTime) => {
  let condition = '';

  if (camera_id) {
    if (condition.length > 0) {
      condition += `AND camera_id='${camera_id}'`;
    } else {
      condition += `WHERE camera_id='${camera_id}'`;
    }
  }

  if (startDateTime && endDateTime) {
    if (condition.length > 0) {
      condition += `AND recog_time BETWEEN '${startDateTime}' AND '${endDateTime}'`;
    } else {
      condition += `WHERE recog_time BETWEEN '${startDateTime}' AND '${endDateTime}'`;
    }
  } else if (startDateTime) {
    if (condition.length > 0) {
      condition += `AND recog_time >= '${startDateTime}'`;
    } else {
      condition += `WHERE recog_time >= '${startDateTime}'`;
    }
  } else if (endDateTime) {
    if (condition.length > 0) {
      condition += `AND recog_time <= '${endDateTime}'`;
    } else {
      condition += `WHERE recog_time <= '${endDateTime}'`;
    }
  }

  const query = `SELECT * FROM ob_car_recognition ${condition} ORDER BY recog_time DESC, idx DESC`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }

}

exports.getCarNumber = async (type) => {
  let query;
  if (type !== undefined) {
    query = `SELECT * FROM "ob_car_number" WHERE type='${type}'`;
  } else {
    query = `SELECT * FROM "ob_car_number"`;
  }

  try {
    const res = await dbManager.pgQuery(query);
    return res
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.removeCarNumber = async (idx, type) => {
  const query = `DELETE FROM "ob_car_number" WHERE idx=${parseInt(idx)} AND type='${type}'`

  try {
    const res = await dbManager.pgQuery(query);
    anprList.loadBlackWhiteList();
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getVms = async () => {
  const query = 'SELECT * FROM "ob_vms" ORDER BY ipaddress';
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.createVms = async (VMSInfo) => {
  const { VMSIP, VMSPort, VMSID, VMSPW } = VMSInfo;

  const query = `INSERT INTO ob_vms VALUES('${VMSIP}', '${VMSPort}','', '${VMSID}', '${VMSPW}', 'NOW()', 'NOW()')`;
  try {

    const res = await dbManager.pgQuery(query);
    if (res && res.rowCount > 0 && global.websocket) {
      global.websocket.emit("VMSList", { VMSList: res.rowCount });
    }
    this.saveCameraFromVms(VMSIP, VMSPort, VMSID, VMSPW, true);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.modifyVms = async (ipaddress, VMSIP, VMSPort, VMSID, VMSPW, syncCameraList) => {

  if (syncCameraList) {
    const selectBeforeVms = `SELECT * FROM ob_vms WHERE ipaddress='${ipaddress}'`
    const beforeVmsRes = await dbManager.pgQuery(selectBeforeVms);
    const beforeVmsName = beforeVmsRes && beforeVmsRes.rows && beforeVmsRes.rows[0] && beforeVmsRes.rows[0].name;
    const delQuery = `DELETE FROM ob_camera WHERE access_point LIKE '%${beforeVmsName}%'`;
    const resDelCameraList = await dbManager.pgQuery(delQuery);
  }

  const query = `UPDATE ob_vms SET ipaddress='${VMSIP}', port='${VMSPort}', id='${VMSID}', password='${VMSPW}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;

  try {

    const res = await dbManager.pgQuery(query);
    this.saveCameraFromVms(VMSIP, VMSPort, VMSID, VMSPW, syncCameraList);
    if (res && res.rowCount > 0 && global.websocket) {
      global.websocket.emit("VMSList", { VMSList: res.rowCount });
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.deleteVms = async (ipaddress, syncCameraList) => {
  const vmsNameQuery = `SELECT * FROM ob_vms WHERE ipaddress IN ('${ipaddress.join("','")}')`;
  const resVms = await dbManager.pgQuery(vmsNameQuery);

  const resVmsName = syncCameraList && resVms && resVms.rows && resVms.rows.length > 0 && resVms.rows.map((rowItem) => rowItem.name);
  const cameraQuery = syncCameraList && `SELECT * FROM ob_camera WHERE access_point LIKE ANY (ARRAY['%${resVmsName.join("%','%")}%'])`
  const resCamQuery = syncCameraList && await dbManager.pgQuery(cameraQuery);

  if (resCamQuery && resCamQuery.rowCount > 0) {
    const delQuery = `DELETE FROM ob_camera WHERE access_point LIKE ANY (ARRAY['%${resVmsName.join("%','%")}%'])`;
    try {
      const res = await dbManager.pgQuery(delQuery);
      if (res && res.rowCount > 0 && global.websocket) {
        global.websocket.emit("cameraList", { cameraList: res.rowCount });
      }
    } catch (err) {
      console.log('delete camera list err: ', err);
    }
  }

  let query;
  if (ipaddress.length > 1) {
    query = `DELETE FROM ob_vms WHERE ipaddress IN ('${ipaddress.join("','")}')`;
  } else {
    query = `DELETE FROM ob_vms WHERE ipaddress='${ipaddress}'`;
  }

  try {
    const res = await dbManager.pgQuery(query);
    if (res.rowCount > 0) {
      if (global.websocket) {
        global.websocket.emit("VMSList", { VMSList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getAccessControlLog = async (LogStatus, LogDoorID, LogStartDate, LogEndDate, LogStartTime, LogEndTime, LogPersonID, LogPersonName, NoLimit) => {
  let condition1 = '';
  let condition2 = '';
  let limit = 20;

  if (LogStatus) {
    condition2 += `AND "LogStatus"='${LogStatus}'`
  }

  if (LogDoorID) {
    condition2 += `AND "LogDoorID"='${LogDoorID}'`
  }

  if (LogStartDate && LogEndDate) {
    condition2 += `AND "LogDate" BETWEEN '${LogStartDate}' AND '${LogEndDate}'`;
  } else if (LogStartDate && !LogEndDate) {
    condition2 += `AND "LogDate" >= '${LogStartDate}'`;
  } else if (!LogStartDate && LogEndDate) {
    condition2 += `AND "LogDate" <= '${LogEndDate}'`;
  }

  if (LogStartTime && LogEndTime) {
    condition2 += `AND "LogTime" BETWEEN '${LogStartTime}' AND '${LogEndTime}'`;
  } else if (LogStartTime && !LogEndTime) {
    condition2 += `AND "LogTime" >= '${LogStartTime}'`;
  } else if (!LogStartTime && LogEndTime) {
    condition2 += `AND "LogTime" <= '${LogEndTime}'`;
  }

  if (LogPersonID) {
    condition2 += `AND "LogPersonID"='${LogPersonID}'`
  }

  if (LogPersonName) {
    condition2 += `AND "LogPersonLastName"='${LogPersonName}'`
  }

  if (!LogStatus && !LogDoorID && !LogStartDate && !LogEndDate && !LogStartTime && !LogEndTime && !LogPersonID && !LogPersonName && !NoLimit) {
    condition1 = `LIMIT ${limit}`;
  }

  const query = `SELECT * FROM "ob_access_control_log" WHERE "LogType"='0' ${condition2} ORDER BY "LogIDX" DESC ${condition1}`;
  // console.log('getAccessControlLog query:', query);
  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.reloadAccessControlPerson = async () => {
  try {
    return dbPolling.reloadAccessControlPerson();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getEventTypes = async (service_type) => {

  let query;

  if (service_type) {
    query = `SELECT idx, name, service_type, severity, unused, popup FROM ob_event_type WHERE service_type='${service_type}' ORDER BY idx`;
  } else {
    query = `SELECT idx, name, service_type, severity, unused, popup FROM ob_event_type ORDER BY idx`;
  }

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.modifyEventType = async (idx, severity, unused, display, popup, service_type) => {

  let query;
  if (severity) {
    query = `UPDATE ob_event_type SET severity='${severity}', updated_at=NOW() WHERE idx='${idx}' AND service_type='${service_type}'`;
  } else if (unused !== undefined) {
    query = `UPDATE ob_event_type SET unused='${unused}', updated_at=NOW() WHERE idx='${idx}' AND service_type='${service_type}'`;
  } else if (display !== undefined) {
    query = `UPDATE ob_event_type SET display='${display}', updated_at=NOW() WHERE idx='${idx}' AND service_type='${service_type}'`;
  } else if (popup !== undefined) {
    query = `UPDATE ob_event_type SET popup='${popup}', updated_at=NOW() WHERE idx='${idx}' AND service_type='${service_type}'`;
  }

  try {
    const res = await dbManager.pgQuery(query);

    if (res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("eventList", { eventList: res.rowCount });
      }
    }

    // 호흡이상감지 활성/비활성
    if (idx !== undefined && parseInt(idx) === 28) {
      const query = `SELECT * FROM ob_event_type WHERE idx=28`;
      const res = await dbManager.pgQuery(query);
      if (res && res.rows && res.rows.length > 0) {
        const respirationUnuse = res.rows[0].unused;
        global.respirationUnuse = respirationUnuse;
      }
    }

    await eventConfig.loadEventTypeConfig();

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getSetting = async (value) => {

  let query;

  if (value === 'serviceType') {
    query = `SELECT * FROM ob_setting WHERE description='Use by service or not by service' ORDER BY idx`;
  } else if (value === 'layout') {
    query = `SELECT * FROM ob_setting WHERE name='layout1' OR name='layout2' OR name ='layout3' OR name='layout4' ORDER BY idx`;
  } else {
    query = `SELECT * FROM ob_setting WHERE description!='Use by service or not by service' AND name != 'layout1' AND name != 'layout2' AND name != 'layout3' AND name != 'layout4' ORDER BY idx`;
  }

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.updateSetting = async (idx, name, setting_value) => {

  let query;

  if (name) {
    query = `UPDATE ob_setting SET setting_value='${setting_value}', updated_at=NOW() WHERE name='${name}'`;
  } else {
    query = `UPDATE ob_setting SET setting_value='${setting_value}', updated_at=NOW() WHERE idx='${idx}'`;
  }

  try {
    const res = await dbManager.pgQuery(query);
    if (name !== 'layout1' && name !== 'layout2' && name !== 'layout3' && name !== 'layout4' && res && res.rowCount === 1) {
      if (global.websocket) {
        global.websocket.emit("serviceTypes", { serviceTypes: res.rowCount });
        global.websocket.emit("eventList", { eventList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.accessEventRec = async (deviceInfo, device_type) => {
  let query;
  if (device_type === 'camera' || device_type === 'door' || device_type === 'zone') {
    query = `SELECT E.*, T.name AS event_type_name FROM ob_event E LEFT JOIN ob_event_type T ON E.event_type=T.idx WHERE id='${deviceInfo}' AND device_type='${device_type}' ORDER BY event_occurrence_time DESC;`
  } else if (device_type === 'vitalsensor' || device_type === 'guardianlite' || device_type === 'ebell') {
    query = `SELECT E.*, T.name AS event_type_name FROM ob_event E LEFT JOIN ob_event_type T ON E.event_type=T.idx WHERE ipaddress='${deviceInfo}' ORDER BY event_occurrence_time DESC;`
  }
  try {
    const res = await dbManager.pgQuery(query);
    if (res) {
      return res
    }
  }
  catch (err) {
    console.log(err);
  }
}

// 보고서 REST API

exports.getReport = async (startDateTime, endDateTime, sort) => {

  let condition1 = '';
  let condition2 = '';
  let queryAS = '';
  let queryAS2 = '';
  let groupByCondtion1 = '';
  let groupByCondtion2 = '';

  if (startDateTime && endDateTime) {
    if (condition1) {
      condition1 += ` AND event_occurrence_time BETWEEN '${startDateTime}' AND '${endDateTime}'`
    } else {
      condition1 += `WHERE event_occurrence_time BETWEEN '${startDateTime}' AND '${endDateTime}'`
    }
  } else if (startDateTime) {
    if (condition1) {
      condition1 += ` AND event_occurrence_time >= '${startDateTime}'`;
    } else {
      condition1 += `WHERE event_occurrence_time >= '${startDateTime}'`;
    }
  } else if (endDateTime) {
    if (condition1) {
      condition1 += ` AND event_occurrence_time <= '${endDateTime}'`;
    } else {
      condition1 += `WHERE event_occurrence_time <= '${endDateTime}'`;
    }
  }

  if (sort === 'ndoctor') {
    if (condition1) {
      condition1 += ` AND service_type='ndoctor'`
    } else {
      condition1 += `WHERE service_type='ndoctor'`
    }
    condition2 += 'SELECT event_type, COUNT(event_type) FROM (';
    queryAS += 'AS ob_event_by_event_type';
    groupByCondtion1 += 'event_type'
  } else if (sort === 'service_type') {
    condition2 += `SELECT service_type, sum(COUNT) FROM (SELECT CASE WHEN service_type = 'observer' THEN (CASE WHEN device_type = 'camera' THEN 'MGIST' ELSE device_type END) ELSE service_type END, COUNT(CASE WHEN service_type='observer' THEN device_type ELSE service_type END) FROM (`;
    queryAS += 'AS ob_event_by_event_query';
    groupByCondtion1 += 'service_type, device_type'
    queryAS2 += ') AS ob_event_by_service_type '
    groupByCondtion2 += 'GROUP BY service_type'
  } else if (sort === 'event_type') {
    condition2 += 'SELECT event_type, COUNT(event_type) FROM (';
    queryAS += 'AS ob_event_by_event_type';
    groupByCondtion1 += 'event_type'
  } else if (sort === 'severity') {
    condition2 += 'SELECT event_type_severity, COUNT(event_type_severity) FROM (';
    queryAS += 'AS ob_event_by_severity';
    groupByCondtion1 += 'event_type_severity'
  } else if (sort === 'acknowledge') {
    condition2 += 'SELECT acknowledge, COUNT(acknowledge) FROM (';
    queryAS += 'AS ob_event_by_acknowledge';
    groupByCondtion1 += 'acknowledge';
  }

  const query = `${condition2}(
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE A.device_type='ebell') event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, d.id AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON event.id = device.device_id AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, device.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE (A.device_type!='ebell' AND A.device_type != 'camera' AND A.device_type != 'zone')) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, CAST(d.idx AS TEXT) AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name, d.camera_id, d.type, d.ipaddress FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON CASE WHEN device.type='pids' THEN event.ipaddress = device.ipaddress WHEN device.type='vitalsensor' THEN event.ipaddress = device.ipaddress ELSE event.id = device.device_id END AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, camera.building_idx, camera.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, camera.building_name, camera.floor_name, camera.service_type AS building_service_type, camera.camera_id AS device_idx, camera.left_location, camera.top_location, camera.location, camera.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='camera') event
      LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location, c.name FROM ob_camera c
      LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
      ON camera.camera_id = event.id
  ) 
  	UNION
	(
    SELECT event.idx, event.name, event.description, event.id, pids.building_idx, pids.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, pids.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, pids.building_name, pids.floor_name, pids.service_type AS building_service_type, pids.id, pids.left_location, pids.top_location, pids.location, pids.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='zone') event
      LEFT OUTER JOIN (SELECT p.id, b.name AS building_name, CASE WHEN p.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, p.camera_id AS camera_id, p.building_idx, p.floor_idx, p.location, p.name, p.left_location, p.top_location FROM ob_pids p
      LEFT OUTER JOIN ob_floor f ON f.idx = p.floor_idx AND f.service_type=p.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=p.building_service_type) pids
      ON pids.id = event.id
  ) ORDER BY event_occurrence_time DESC, event_type_severity DESC) ${queryAS} ${condition1} GROUP BY ${groupByCondtion1}${queryAS2}${groupByCondtion2}`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.getDetailReport = async (startDateTime, endDateTime, service_type, device_type, sort) => {

  let condition1 = '';
  let condition2 = '';
  let queryAS = '';
  let groupByCondtion = '';

  if (startDateTime && endDateTime) {
    if (condition1) {
      condition1 += ` AND event_occurrence_time BETWEEN '${startDateTime}' AND '${endDateTime}'`
    } else {
      condition1 += `WHERE event_occurrence_time BETWEEN '${startDateTime}' AND '${endDateTime}'`
    }
  } else if (startDateTime) {
    if (condition1) {
      condition1 += ` AND event_occurrence_time >= '${startDateTime}'`;
    } else {
      condition1 += `WHERE event_occurrence_time >= '${startDateTime}'`;
    }
  } else if (endDateTime) {
    if (condition1) {
      condition1 += ` AND event_occurrence_time <= '${endDateTime}'`;
    } else {
      condition1 += `WHERE event_occurrence_time <= '${endDateTime}'`;
    }
  }

  if (service_type === 'mgist') {
    if (condition1) {
      condition1 += ` AND service_type='mgist'`
    } else {
      condition1 += `WHERE service_type='mgist'`
    }
  } else if (service_type === 'ebell') {
    if (condition1) {
      condition1 += ` AND service_type='ebell'`
    } else {
      condition1 += `WHERE service_type='ebell'`
    }
  } else if (service_type === 'guardianlite') {
    if (condition1) {
      condition1 += ` AND service_type='guardianlite'`
    } else {
      condition1 += `WHERE service_type='guardianlite'`
    }
  } else if (service_type === 'anpr') {
    if (condition1) {
      condition1 += ` AND event_type=${parseInt(23)} OR event_type=${parseInt(24)}`
    } else {
      condition1 += `WHERE event_type=${parseInt(23)} OR event_type=${parseInt(24)}`
    }
  } else if (service_type === 'accesscontrol') {
    if (condition1) {
      condition1 += ` AND service_type='accesscontrol'`
    } else {
      condition1 += `WHERE service_type='accesscontrol'`
    }
  } else if (service_type === 'parkingcontrol') {
    if (condition1) {
      condition1 += ` AND service_type='parkingcontrol'`
    } else {
      condition1 += `WHERE service_type='parkingcontrol'`
    }
  } else if (service_type === 'ndoctor') {
    if (condition1) {
      condition1 += ` AND service_type='ndoctor'`
    } else {
      condition1 += `WHERE service_type='ndoctor'`
    }
  } else if (service_type === 'observer' && device_type === 'vitalsensor') {
    if (condition1) {
      condition1 += ` AND service_type='observer' AND device_type='vitalsensor'`
    } else {
      condition1 += `WHERE service_type='observer' AND device_type='vitalsensor'`
    }
  } else if (service_type === 'observer' && device_type === 'zone') {
    if (condition1) {
      condition1 += ` AND service_type='observer' AND device_type='zone'`
    } else {
      condition1 += `WHERE service_type='observer' AND device_type='zone'`
    }
  } else if(service_type === 'mdet'){
    if (condition1) {
      condition1 += ` AND service_type='mdet'`
    } else {
      condition1 += `WHERE service_type='mdet'`
    }
  } else if(service_type === 'crowddensity'){
    if (condition1) {
      condition1 += ` AND service_type='crowddensity'`
    } else {
      condition1 += `WHERE service_type='crowddensity'`
    }
  }

  if (sort === 'event_type') {
    condition2 += 'SELECT event_type, COUNT(event_type) FROM (';
    queryAS += 'AS ob_event_by_event_type';
    groupByCondtion += 'event_type'
  } else if (sort === 'severity') {
    condition2 += 'SELECT event_type_severity, COUNT(event_type_severity) FROM (';
    queryAS += 'AS ob_event_by_severity';
    groupByCondtion += 'event_type_severity'
  } else if (sort === 'acknowledge') {
    condition2 += 'SELECT acknowledge, COUNT(acknowledge) FROM (';
    queryAS += 'AS ob_event_by_acknowledge';
    groupByCondtion += 'acknowledge';
  }

  const query = `${condition2}(
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE A.device_type='ebell') event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, d.id AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON event.id = device.device_id AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, device.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE (A.device_type!='ebell' AND A.device_type != 'camera' AND A.device_type != 'zone')) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, CAST(d.idx AS TEXT) AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name, d.camera_id, d.type, d.ipaddress FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON CASE WHEN device.type='pids' THEN event.ipaddress = device.ipaddress WHEN device.type='vitalsensor' THEN event.ipaddress = device.ipaddress ELSE event.id = device.device_id END AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, camera.building_idx, camera.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, camera.building_name, camera.floor_name, camera.service_type AS building_service_type, camera.camera_id AS device_idx, camera.left_location, camera.top_location, camera.location, camera.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='camera') event
      LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location, c.name FROM ob_camera c
      LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
      ON camera.camera_id = event.id
  ) 
    UNION
	(
    SELECT event.idx, event.name, event.description, event.id, pids.building_idx, pids.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, pids.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, pids.building_name, pids.floor_name, pids.service_type AS building_service_type, pids.id, pids.left_location, pids.top_location, pids.location, pids.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='zone') event
      LEFT OUTER JOIN (SELECT p.id, b.name AS building_name, CASE WHEN p.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, p.camera_id AS camera_id, p.building_idx, p.floor_idx, p.location, p.name, p.left_location, p.top_location FROM ob_pids p
      LEFT OUTER JOIN ob_floor f ON f.idx = p.floor_idx AND f.service_type=p.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=p.building_service_type) pids
      ON pids.id = event.id
  ) ORDER BY event_occurrence_time DESC, event_type_severity DESC) ${queryAS} ${condition1} GROUP BY ${groupByCondtion}`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.reportDetailEvents = async (startDateTime, endDateTime, sort) => {

  let condition1 = '';

  if (startDateTime && endDateTime) {
    condition1 += `AND event_occurrence_time BETWEEN '${startDateTime}' AND '${endDateTime}'`
  } else if (startDateTime) {
    condition1 += `AND event_occurrence_time >= '${startDateTime}'`;
  } else if (endDateTime) {
    condition1 += `AND event_occurrence_time <= '${endDateTime}'`;
  }

  if (sort && sort !== 'vitalsensor' && sort !== 'pids' && sort !== 'guardianlite' && sort !== 'anpr') {
    condition1 += `AND A.service_type = '${sort}'`
  } else if (sort && (sort === 'vitalsensor' || sort === 'guardianlite')) {
    condition1 += `AND A.device_type ='${sort}'`
  } else if (sort && sort === 'pids') {
    condition1 += `AND A.device_type ='zone'`
  } else if (sort && sort === 'anpr') {
    condition1 += `AND A.service_type='observer' AND A.device_type ='camera'`
  }

  const query = `(
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE A.device_type='ebell' ${condition1}) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, d.id AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON event.id = device.device_id AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, device.building_idx, device.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
    event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, device.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
    event.event_type_severity, device.building_name, device.floor_name, device.building_service_type, device.device_id, device.left_location, device.top_location, device.location, device.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
    FROM ob_event A
    LEFT JOIN ob_event_type B ON A.event_type = B.idx
    WHERE (A.device_type!='ebell' AND A.device_type != 'camera' AND A.device_type != 'zone') ${condition1}) event
    LEFT OUTER JOIN (SELECT b.name AS building_name, f.name AS floor_name, CAST(d.idx AS TEXT) AS device_id, d.building_service_type, d.service_type, d.building_idx, d.floor_idx, d.left_location, d.top_location, d.location, d.name, d.camera_id, d.type, d.ipaddress FROM ob_device d
    LEFT OUTER JOIN ob_floor f ON f.idx = d.floor_idx AND f.service_type=d.building_service_type
    LEFT OUTER JOIN ob_building b ON b.idx = d.building_idx AND b.service_type=d.building_service_type) device
    ON CASE WHEN device.type='pids' THEN event.ipaddress = device.ipaddress WHEN device.type='vitalsensor' THEN event.ipaddress = device.ipaddress ELSE event.id = device.device_id END AND event.service_type = device.service_type
  )
    UNION
  (
    SELECT event.idx, event.name, event.description, event.id, camera.building_idx, camera.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, event.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, camera.building_name, camera.floor_name, camera.service_type AS building_service_type, camera.camera_id AS device_idx, camera.left_location, camera.top_location, camera.location, camera.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='camera' ${condition1}) event
      LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location, c.name FROM ob_camera c
      LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
      ON camera.camera_id = event.id
  ) 
  	UNION
	(
    SELECT event.idx, event.name, event.description, event.id, pids.building_idx, pids.floor_idx, event.event_occurrence_time, event.event_end_time, event.status, event.severity, event.acknowledge, event.acknowledge_user,
          event.device_type, event.connection, event.ipaddress, event.service_type, event.event_type, pids.camera_id, event.snapshot_path, event.acknowledged_at, event.created_at, event.updated_at, event.upserted_at, event.event_type_name,
          event.event_type_severity, pids.building_name, pids.floor_name, pids.service_type AS building_service_type, pids.id, pids.left_location, pids.top_location, pids.location, pids.name AS device_name FROM
    (SELECT A.*, B.name AS event_type_name, B.severity AS event_type_severity
      FROM ob_event A
      LEFT JOIN ob_event_type B ON A.event_type = B.idx
      WHERE device_type='zone' ${condition1}) event
      LEFT OUTER JOIN (SELECT p.id, b.name AS building_name, CASE WHEN p.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, p.camera_id AS camera_id, p.building_idx, p.floor_idx, p.location, p.name, p.left_location, p.top_location FROM ob_pids p
      LEFT OUTER JOIN ob_floor f ON f.idx = p.floor_idx AND f.service_type=p.building_service_type
      LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=p.building_service_type) pids
      ON pids.id = event.id
  ) ORDER BY event_occurrence_time DESC, event_type_severity DESC`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.setTowerlamp = async (onOff) => {
  if (onOff === 'on') {
    towerLampClient.turnOnOffTowerLamp('on');
    setTimeout(() => {
      towerLampClient.turnOnOffTowerLamp('off');
    }, 5000);
  } else {
    towerLampClient.turnOnOffTowerLamp('off');
  }
}

let detectOutlier = (array) => {
  if (array.length <= 5) {
    return [];
  }

  let ascending = [];
  for (let i in array) {
    ascending.push({
      index: i,
      data: array[i]
    })
  }
  ascending.sort(function (a, b) { return a.data - b.data });
  console.log(ascending);

  let firstQuartile = (ascending.length + 1) / 4
  let thirdQuartile = firstQuartile * 3

  firstQuartile = getQuartile(firstQuartile, _.pluck(ascending, 'data'));
  thirdQuartile = getQuartile(thirdQuartile, _.pluck(ascending, 'data'));

  let quartileRange = thirdQuartile - firstQuartile
  let minNormalRange = firstQuartile - 1.5 * quartileRange
  let maxNormalRange = thirdQuartile + 1.5 * quartileRange

  let inlierArray = []
  for (let e of ascending) {
    //정상 범위를 벗어나면 이상치로 간주
    if (e.data <= maxNormalRange || e.data >= minNormalRange) {
      inlierArray.push(Number(e.data))
    }
  }

  return inlierArray
}

/*
  # 사분위수 구하는 함수
  # 작업 순서
    └ index값이 정수인지 실수인지 판별
      └ 정수라면 array[index - 1] 형태로 반환
      └ 실수라면 가중 평균을 구함
        └ ex) 2.75라면 array[1]과 array[2] 두 값 사이의 가중 평균을 구함 => array[1] * 0.25 + array[2] * 0.75
*/
let getQuartile = (index, array) => {
  if (String(index).includes('.')) {
    let highIndex = Math.ceil(index)
    let lowIndex = Math.floor(index)

    //index의 소수점 이하 값
    let belowPoint = Math.abs(lowIndex - index)

    highIndex = array[highIndex - 1]
    lowIndex = array[lowIndex - 1]

    //highIndex와 lowIndex사이의 가중 평균
    return lowIndex * (1 - belowPoint) + highIndex * belowPoint
  } else {
    return array[index - 1]
  }
}

exports.setVitalThresholdCalc = async (ipaddress, start, end) => {
  const query = `SELECT sensor_value FROM ob_breath_log WHERE ipaddress='${ipaddress}' AND datetime >= '${start}' AND datetime <= '${end}' ORDER BY datetime;`;
  try {
    const res = await dbManager.pgQuery(query);
    let threshold = 0;
    if (res && res.rows.length > 0) {
      let arrValue = [];
      for (row of res.rows) {
        let parsed = parseInt(row.sensor_value);
        if (parsed !== NaN) {
          arrValue.push(parsed);
        }
      }
      let arrDetect = detectOutlier(arrValue);
      let sum = 0;
      let max = arrDetect[arrDetect.length - 1];
      let min = arrDetect[0];
      threshold = 0;
      let avg;
      if (max - min <= 10) {
        threshold = max;
      } else {
        for (let i of arrDetect) {
          sum += i;
        }
        avg = sum / arrDetect.length;
        threshold = Math.floor(avg + (max - avg) * 0.3);
      }
      console.log(`max(${max}), avg(${avg}) thr(${threshold}) detect(${arrDetect})`);
      const queryUpdate = `UPDATE "ob_breathsensor" SET breath_value='${threshold}', updated_at=NOW() WHERE ipaddress='${ipaddress}'`;
      const resUpdate = await dbManager.pgQuery(queryUpdate);
      if (resUpdate.rowCount === 1) {
        if (global.websocket) {
          global.websocket.emit("deviceList", { deviceList: resUpdate.rowCount });
          global.websocket.emit("vitalsensorList", { vialsensorList: resUpdate.rowCount });
        }
      }
    }
    return threshold;
  }
  catch (err) {
    console.log(err);
  }
}

exports.detectFire = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '화재 감지',
    '${cameraName} 화재 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    1,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=1`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '화재 감지',
                deviceId: `${cameraId}`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect fire REST API err: ', err);
  }
}

exports.detectSmoke = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '연기 감지',
    '${cameraName} 연기 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    2,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=2`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '연기 감지',
                deviceId: `${cameraId}`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect smoke REST API err: ', err);
  }
}

exports.detectMotion = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '움직임 감지',
    '${cameraName} 움직임 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    3,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=3`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '움직임 감지',
                deviceId: `${cameraId}`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect motion REST API err: ', err);
  }
}

exports.detectLoitering = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '배회 감지',
    '${cameraName} 배회 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    4,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=4`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '배회 감지',
                deviceId: `${cameraId}`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect loitering REST API err: ', err);
  }
}

exports.detectLostObject = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '잃어버린 물건 감지',
    '${cameraName} 잃어버린 물건 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    5,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=5`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '잃어버린 물건 감지',
                deviceId: `${cameraId}`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect lost object REST API err: ', err);
  }
}

exports.detectEnterArea = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '영역 침입 감지',
    '${cameraName} 영역 침입 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    6,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=6`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '영역 침입 감지',
                deviceId: `${cameraId}`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect enter area REST API err: ', err);
  }
}

exports.detectFallDown = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '쓰러짐 감지',
    '${cameraName} 쓰러짐 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    10,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=10`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '쓰러짐 감지',
                deviceId: `${cameraId}`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect fall down REST API err: ', err);
  }
}

exports.detectHandup = async (cameraIp, cameraId, cameraName, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const queryString = `INSERT INTO "ob_event" (
    "name",
    "description",
    "id",
    "building_idx",
    "floor_idx",
    "event_occurrence_time",
    "device_type",
    "ipaddress",
    "service_type",
    "event_type",
    "camera_id"
  )
  VALUES (
    '손 들기 감지',
    '${cameraName} 손 들기 감지',
    '${cameraId}',
    0,
    0,
    '${EventOccurTime}',
    'camera',
    '${cameraIp}',
    'mgist',
    17,
    '${cameraId}'
  )
  `

  try {
    const resQuery = await dbManager.pgQuery(queryString);
    if (resQuery && resQuery.rowCount > 0) {
      const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=6`);
      const cameraLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${cameraId}'`);
      if (cameraLocation && cameraLocation.rows && cameraLocation.rows.length > 0 && cameraLocation.rows[0].left_location && cameraLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
        if (global.websocket) {
          global.websocket.emit("eventList", {
            eventList: [{
              lastEvent: {
                eventName: '손 들기 감지',
                deviceId: `'${cameraId}'`,
                deviceType: 'camera',
                buildingIdx: cameraLocation.rows[0].building_idx,
                floorIdx: cameraLocation.rows[0].floor_idx,
                buildingServiceType: cameraLocation.rows[0].building_service_type,
                serviceType: cameraLocation.rows[0].service_type,
                cameraId: `${cameraId}`,
                ipaddress: `${cameraIp}`
              }
            }]
          });
        }
      } else {
        if (global.websocket) {
          global.websocket.emit("eventList", { eventList: resQuery.rowCount });
        }
      }
      // 선별관제 이벤트 발생 시 카메라 이벤트 발생여부 검사
      const queryCamera = `UPDATE ob_camera
        SET status='1'
        FROM (SELECT DISTINCT id, device_type, service_type FROM ob_event
        WHERE acknowledge=FALSE AND device_type='camera' AND event_occurrence_time>TO_CHAR((NOW()-INTERVAL '1 day'),'YYYYMMDD') || 'T' || TO_CHAR((NOW()-INTERVAL '1 day'),'HH24MISS')) AS subquery
        WHERE ob_camera.id=subquery.id`;
      const resCamera = await dbManager.pgQuery(queryCamera);
      if (global.websocket && resCamera.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCamera.rowCount });
      }
    }
  } catch (err) {
    console.log('detect handup REST API err: ', err);
  }
}

exports.addEventAFullCar = async (cameraIp) => {
  let eventQuery;
  let deviceQuery;
  let eventTypeQuery;
  try {
    const isParkingCamera = cameraIp && await this.getParkingCamera(cameraIp);
    const parkingCamera = isParkingCamera && isParkingCamera.rows && isParkingCamera.rows.length > 0 && isParkingCamera.rows[0];
    const { name, camera_id } = parkingCamera;
    const eventRowDateTime = new Date();
    const occurTime = addHours(eventRowDateTime, 9).toISOString().replace(/-/g, '').replace(/:/g, '').slice(0, -5);
    const aWeekAgo = subWeeks(eventRowDateTime, 1).toISOString().replace(/-/g, '').replace(/:/g, '').slice(0, -5)

    if (cameraIp && parkingCamera && camera_id, occurTime) {
      deviceQuery = `SELECT building_idx, floor_idx, left_location, top_location FROM ob_camera WHERE ipaddress='${cameraIp}' AND id='${camera_id}'`;
      const resDevice = deviceQuery && await dbManager.pgQuery(deviceQuery);
      const isBeforeEventQuery = `SELECT * FROM ob_event WHERE service_type='parkingcontrol' AND event_type=36 AND event_occurrence_time >='${aWeekAgo}' AND acknowledge=false AND ipaddress='${cameraIp}'`;
      const isBeforeEvent = await dbManager.pgQuery(isBeforeEventQuery);
      if (resDevice && resDevice.rows && resDevice.rows.length > 0 && isBeforeEvent && isBeforeEvent.rows && isBeforeEvent.rows.length === 0) {
        eventQuery = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id)
                        VALUES ('만차', '${name ? name : cameraIp} 만차', '${camera_id}', ${resDevice.rows[0].building_idx}, ${resDevice.rows[0].floor_idx}, '${occurTime}', 'camera', '${cameraIp}', 'parkingcontrol', 36, '${camera_id}')`;
      }
      eventTypeQuery = `SELECT unused, popup FROM ob_event_type WHERE idx=36`;
      const resEventType = eventTypeQuery && dbManager.pgQuery(eventTypeQuery);

      const isCameraLocation = resDevice && resDevice.rows && resDevice.rows.length > 0 && resDevice.rows[0].top_location && resDevice.rows[0].left_location;
      const isPopup = resEventType && resEventType.rows && resEventType.rows.length > 0 && !resEventType.rows[0].unused && resEventType.rows[0].popup;

      const insertEvent = eventQuery && await dbManager.pgQuery(eventQuery);
      if (insertEvent && insertEvent.rowCount > 0) {
        if (global.websocket) {
          if (isCameraLocation && isPopup) {
            global.websocket.emit("eventList", {
              eventList: [{
                lastEvent: {
                  eventName: '만차',
                  deviceId: cameraId,
                  deviceType: 'camera',
                  buildingIdx: resDevice.rows[0].building_idx,
                  floorIdx: resDevice.rows[0].floor_idx,
                  buildingServiceType: 'observer',
                  serviceType: 'parkingcontrol',
                  cameraId: cameraId
                }
              }]
            });
            global.websocket.emit("parkingEvent", { parkingEvent: insertEvent.rowCount });
          } else {
            global.websocket.emit("eventList", { eventList: insertEvent.rowCount });
            global.websocket.emit("parkingEvent", { parkingEvent: insertEvent.rowCount });
          }
        }
      }
    }
  } catch (err) {
    console.error('add event a full car err: ', err);
  }
}

exports.getCameraName = async (cameraIp) => {
  const query = cameraIp && `SELECT name FROM ob_parking_camera WHERE ipaddress='${cameraIp}'`
  try {
    if (query) {
      const res = await dbManager.pgQuery(query);
      if (res && res.rows && res.rows.length > 0) {
        return res.rows[0].name;
      }
    }
  } catch (err) {
    console.error('get parking camera name err: ', err);
  }
  return ''
}

exports.setParkingLot = async () => {
  const query = 'SELECT * FROM ob_parking_area ORDER BY idx ASC';
  try {
    const res = await dbManager.pgQuery(query);
    let occupancy = '';
    if(res && res.rows && res.rows.length > 0){ 
      res.rows.map((rowItem, index) => {
        if(index === 0){
          occupancy += (rowItem.occupancy.replace('[','').replace(']',''))
        } else {
          occupancy += (','+rowItem.occupancy.replace('[','').replace(']',''))
        }
      })
    }
    const data = {
      'parking': [
        {
          'location': 1,
          'status' : occupancy
        }
      ]}
    const config = {"Content-Type": 'application/json'};

    const resVGS3 = await axios.post(`http://${process.env.VGS3_IP}:${process.env.VGS3_PORT}/SetParkingLot`, data, config);
    if(resVGS3 && resVGS3.data && resVGS3.data.Result && resVGS3.data.Result.Success){
      return;
    } else if(resVGS3.data.Result.Success === false){
      console.error('VGS3 SetParkingLot res failed: ', resVGS3.data.Result.Message);
    }
  } catch(err) {
    console.error('setParkingLot REST API err:', err);
  }
}

exports.parkingControl = async (data, camera_ip) => {
  try {
    let resData;
    let query;
    let insertCameraQuery;
    if(data.parking_detail && data.parking_detail.length === 0){
      return;
    }
    if (data.report_type === 'interval') {
      resData = data;
      resData.parking_detail = data.parking_detail.map((itemDetail) => ({ ...itemDetail, numbering_scheme: JSON.stringify(itemDetail.numbering_scheme), occupancy: JSON.stringify(itemDetail.occupancy) }));
      insertCameraQuery = `INSERT INTO ob_parking_camera (ipaddress, total_available, total_occupied)
                            VALUES ('${camera_ip}', '${data.total_available}', '${data.total_occupied}')
                            ON CONFLICT(ipaddress)
                            DO UPDATE SET
                            total_available=EXCLUDED.total_available,
                            total_occupied=EXCLUDED.total_occupied,
                            updated_at=EXCLUDED.updated_at 
                            WHERE ob_parking_camera.total_available != EXCLUDED.total_available OR ob_parking_camera.total_occupied !=EXCLUDED.total_occupied`
      const insertCameraRes = await dbManager.pgQuery(insertCameraQuery);
      if (insertCameraRes && insertCameraRes.rowCount > 0) {
        const cameraName = await this.getCameraName(`${camera_ip}`)
        const updateParkingCameraQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, total_available, total_occupied, cmd) VALUES ('${camera_ip}', '${cameraName}', '${data.total_available}', '${data.total_occupied}', 'parking camera total status update');`
        updateParkingCameraQuery && await dbManager.pgQuery(updateParkingCameraQuery);
      }
      if (global.websocket && insertCameraRes.rowCount > 0) {
        global.websocket.emit("parkingCamera", { insertCameraRes: insertCameraRes.rowCount });
      }
      parseInt(data.total_available) === 0 && this.addEventAFullCar(`${camera_ip}`);
      const strArr = data.parking_detail && data.parking_detail.map((areaItem) => {
        const strValue = `('${areaItem.area_name}', '${camera_ip}', '${areaItem.numbering_scheme}', '${areaItem.occupancy}')`
        return strValue
      })
      const queryValue = strArr.join(',');
      query = `INSERT INTO ob_parking_area (name, camera_ip, numbering_scheme, occupancy) 
                VALUES ${queryValue} ON CONFLICT ON CONSTRAINT ob_parking_area_id
                DO UPDATE SET
                numbering_scheme=EXCLUDED.numbering_scheme,
                occupancy=EXCLUDED.occupancy,
                updated_at=EXCLUDED.updated_at
                WHERE ob_parking_area.numbering_scheme != EXCLUDED.numbering_scheme OR ob_parking_area.occupancy != EXCLUDED.occupancy
                `
    } else if (data.report_type === 'trigger') {
      resData = data;
      insertCameraQuery = `INSERT INTO ob_parking_camera (ipaddress)
                            VALUES ('${camera_ip}')
                            ON CONFLICT(ipaddress)
                            DO NOTHING`
      const insertCameraRes = await dbManager.pgQuery(insertCameraQuery);
      if (global.websocket && insertCameraRes.rowCount > 0) {
        global.websocket.emit("parkingCamera", { insertCameraRes: insertCameraRes.rowCount });
      }
      query = `INSERT INTO ob_parking_space (parking_area, camera_ip, index_number, occupancy, x1, x2, x3, x4, y1, y2, y3, y4) 
                VALUES ('${data.parking_area}', '${camera_ip}', '${data.index_number}', '${data.occupancy}', '${data.coordinate_x1}','${data.coordinate_x2}','${data.coordinate_x3}','${data.coordinate_x4}','${data.coordinate_y1}','${data.coordinate_y2}','${data.coordinate_y3}','${data.coordinate_y4}')
                ON CONFLICT ON CONSTRAINT ob_parking_space_id 
                DO UPDATE SET
                occupancy=EXCLUDED.occupancy,
                x1=EXCLUDED.x1,
                x2=EXCLUDED.x2,
                x3=EXCLUDED.x3,
                x4=EXCLUDED.x4,
                y1=EXCLUDED.y1,
                y2=EXCLUDED.y2,
                y3=EXCLUDED.y3,
                y4=EXCLUDED.y4,
                updated_at=EXCLUDED.updated_at
                WHERE ob_parking_space.occupancy != EXCLUDED.occupancy OR 
                      ob_parking_space.x1 !=EXCLUDED.x1 OR
                      ob_parking_space.x2 !=EXCLUDED.x2 OR
                      ob_parking_space.x3 !=EXCLUDED.x3 OR
                      ob_parking_space.x4 !=EXCLUDED.x4 OR
                      ob_parking_space.y1 !=EXCLUDED.y1 OR
                      ob_parking_space.y2 !=EXCLUDED.y2 OR
                      ob_parking_space.y3 !=EXCLUDED.y3 OR
                      ob_parking_space.y4 !=EXCLUDED.y4`
    }
    const res = await dbManager.pgQuery(query);
    if (res && res.rowCount > 0) {
      const cameraName = await this.getCameraName(camera_ip);
      if (data.report_type === 'trigger') {
        const updateParkingSpaceQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, occupancy, x1, x2, x3, x4, y1, y2, y3, y4, cmd) 
                                              VALUES ('${camera_ip}', '${cameraName}', '${data.parking_area}', '${data.index_number}', '${data.occupancy}', '${data.coordinate_x1}', '${data.coordinate_x2}','${data.coordinate_x3}', '${data.coordinate_x4}', '${data.coordinate_y1}', '${data.coordinate_y2}','${data.coordinate_y3}', '${data.coordinate_y4}', 'space status update');`
        updateParkingSpaceQuery && await dbManager.pgQuery(updateParkingSpaceQuery);
        if (global.websocket) {
          global.websocket.emit("parkingCoords", { parkingCoords: res.rowCount });
          global.websocket.emit("parkingSpaces", { parkingSpaces: res.rowCount });
        }
      } else if (data.report_type === 'interval') {
        for (const areaItem of data.parking_detail) {
          const updateParkingAreaQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, occupancy, cmd) 
                                              VALUES ('${camera_ip}', '${cameraName}', '${areaItem.area_name}', '${areaItem.numbering_scheme}', '${areaItem.occupancy}', 'area status update');`
          await dbManager.pgQuery(updateParkingAreaQuery);
        }
        this.syncParkingData(camera_ip, data.parking_detail);
        if (global.websocket) {
          global.websocket.emit("parkingAreas", { parkingAreas: res.rowCount });
        }
      }
      return res;
    }
    if(data.report_type === 'interval'){
      this.setParkingLot();
    }
  } catch (err) {
    console.error('parking control REST API err: ', err);
  }
}

exports.getParkingCamera = async (ipaddress) => {
  let query;
  try {
    if (ipaddress) {
      query = `SELECT parking.idx, parking.ipaddress, parking.name, parking.id, parking.password, parking.rtsp_port, parking.total_available, parking.total_occupied, parking.name_updated_at, parking.created_at, parking.updated_at, camera.building_name, camera.floor_name, camera.camera_id
        FROM ob_parking_camera parking
        LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.ipaddress, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location FROM ob_camera c
        LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
        LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
        ON camera.ipaddress = parking.ipaddress WHERE parking.ipaddress='${ipaddress}'`
    } else {
      query = `SELECT parking.idx, parking.ipaddress, parking.name, parking.id, parking.password, parking.rtsp_port, parking.total_available, parking.total_occupied, parking.name_updated_at, parking.created_at, parking.updated_at, camera.building_name, camera.floor_name, camera.camera_id
        FROM ob_parking_camera parking
        LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.ipaddress, c.id AS camera_id, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location FROM ob_camera c
        LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
        LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
        ON camera.ipaddress = parking.ipaddress ORDER BY name_updated_at ASC, idx ASC`
    }
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (err) {
    console.error('getParkingCamera REST API error: ', err);
  }
}

exports.setParkingCamera = async (name, ipaddress) => {

  try {
    const query = `UPDATE ob_parking_camera SET name='${name}', name_updated_at=NOW() WHERE ipaddress='${ipaddress}'`
    
    const res = await dbManager.pgQuery(query);
    if (res && res.rowCount > 0) {
      if (global.websocket) {
        global.websocket.emit("parkingCamera", { parkingCamera: res.rowCount });
      }
      const updateParkingCameraQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, cmd) VALUES ('${ipaddress}', '${name}', 'parkingCamera name update');`
      updateParkingCameraQuery && await dbManager.pgQuery(updateParkingCameraQuery);
    }
  } catch (err) {
    console.error('setParkingCamera(name) REST API error: ', err);
  }
}

exports.deleteParkingCamera = async (ipaddress) => {

  try {
    const cameraName = await this.getCameraName(ipaddress);
    const query = `DELETE FROM ob_parking_camera WHERE ipaddress='${ipaddress}'`;
    const res = await dbManager.pgQuery(query);
    if(res && res.rowCount === 1){
      if (global.websocket) {
        global.websocket.emit("parkingCamera", { parkingCamera: res.rowCount });
        const removeParkingCameraQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, cmd) VALUES ('${ipaddress}', '${cameraName}', 'delete');`
        removeParkingCameraQuery && await dbManager.pgQuery(removeParkingCameraQuery);
      }
      const removeAreaQuery = `DELETE FROM ob_parking_area WHERE camera_ip='${ipaddress}'`
      const removeSpaceQuery = `DELETE FROM ob_parking_space WHERE camera_ip='${ipaddress}'`
      const resArea = await dbManager.pgQuery(removeAreaQuery);
      const resSpace = await dbManager.pgQuery(removeSpaceQuery);
      if (global.websocket && resArea && resArea.rowCount > 0) {
        global.websocket.emit("parkingAreas", { parkingAreas: resArea.rowCount });
        const deleteParkingAreaLogQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, cmd) 
                                            VALUES ('${ipaddress}', '${cameraName}', 'all area delete');`
        deleteParkingAreaLogQuery && await dbManager.pgQuery(deleteParkingAreaLogQuery);
      }
      if (global.websocket && resSpace && resSpace.rowCount > 0) {
        global.websocket.emit("parkingCoords", { parkingCoords: resSpace.rowCount });
        global.websocket.emit("parkingSpaces", { parkingSpaces: resSpace.rowCount });
        const deleteParkingSpaceLogQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, cmd) 
                                              VALUES ('${ipaddress}', '${cameraName}', 'all space delete');`
        deleteParkingSpaceLogQuery && await dbManager.pgQuery(deleteParkingSpaceLogQuery);
      }
    }
    return res;
  } catch(err) {
    console.error('deleteParkingCamera REST API ERROR: ', err);
  }
}

exports.getParkingCoords = async (camera_ip) => {
  try {
    let query;
    if (camera_ip) {
      query = `SELECT * FROM ob_parking_space WHERE camera_ip='${camera_ip}' ORDER BY idx DESC`;
    } else {
      query = `SELECT * FROM ob_parking_space ORDER BY idx DESC`;
    }
    const res = query && await dbManager.pgQuery(query);
    return res;
  } catch (err) {
    console.error('getParkingCoords error: ', err);
  }
}

exports.syncParkingData = async (camera_ip, parkingData) => {
  const selectAreaQuery = `SELECT idx, name, camera_ip, numbering_scheme, occupancy FROM ob_parking_area WHERE camera_ip='${camera_ip}'`;
  const rowsAreaQueryRes = await dbManager.pgQuery(selectAreaQuery);
  if (rowsAreaQueryRes && rowsAreaQueryRes.rows && rowsAreaQueryRes.rows.length > 0) {
    await rowsAreaQueryRes.rows.map(async (dbAreaItem) => {
      let deleteItem;
      const isExist = parkingData.find((parkingItem) => (parkingItem.area_name === dbAreaItem.name) && (camera_ip === dbAreaItem.camera_ip));
      if (!isExist) {
        deleteItem = dbAreaItem;
        const syncAreaQuery = deleteItem && `DELETE FROM ob_parking_area WHERE idx=${deleteItem.idx}`;
        const syncAreaQueryRes = await dbManager.pgQuery(syncAreaQuery);
        const selectRemoveSpaces = `SELECT * FROM ob_parking_space WHERE parking_area='${deleteItem.name}' AND camera_ip='${deleteItem.camera_ip}'`;
        const selectRemoveSpacesRes = selectRemoveSpaces && await dbManager.pgQuery(selectRemoveSpaces);

        const syncSpaceByAreaQuery = deleteItem && `DELETE FROM ob_parking_space WHERE parking_area='${deleteItem.name}' AND camera_ip='${deleteItem.camera_ip}'`;
        const syncSpaceByAreaQueryRes = await dbManager.pgQuery(syncSpaceByAreaQuery);
        if (syncAreaQueryRes && syncAreaQueryRes.rowCount > 0) {
          const cameraName = await this.getCameraName(deleteItem.camera_ip);
          const deleteParkingAreaQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, occupancy, cmd) 
                                            VALUES ('${deleteItem.camera_ip}','${cameraName}', '${deleteItem.name}', '${deleteItem.numbering_scheme}', '${deleteItem.occupancy}', 'area delete');`
          deleteParkingAreaQuery && await dbManager.pgQuery(deleteParkingAreaQuery);
          if (global.websocket) {
            global.websocket.emit("parkingAreas", { parkingAreas: syncAreaQueryRes.rowCount });
          }
        }
        if (syncSpaceByAreaQueryRes && syncSpaceByAreaQueryRes.rowCount > 0) {
          if (selectRemoveSpacesRes && selectRemoveSpacesRes.rows && selectRemoveSpacesRes.rows.length > 0) {
            selectRemoveSpacesRes.rows.forEach(async (removeItem) => {
              const cameraName = await this.getCameraName(removeItem.camera_ip);
              const deleteParkingAreaQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, cmd) 
                                              VALUES ('${removeItem.camera_ip}', '${cameraName}', '${removeItem.parking_area}', '${removeItem.index_number}', 'space delete');`
              deleteParkingAreaQuery && await dbManager.pgQuery(deleteParkingAreaQuery);
            })
          }
          if (global.websocket) {
            global.websocket.emit("parkingCoords", { parkingCoords: syncSpaceByAreaQueryRes.rowCount });
            global.websocket.emit("parkingSpaces", { parkingSpaces: syncSpaceByAreaQueryRes.rowCount });
          }
        }
      } else {
        const numbering_scheme_arr = JSON.parse(`${isExist.numbering_scheme}`);
        const formatOccupancyArr = `${isExist.occupancy}`.replace('[', '').replace(']', '').split(',');
        const selectRemoveSpaces = `SELECT * FROM ob_parking_space WHERE NOT (index_number=ANY(ARRAY[${numbering_scheme_arr}]::text[])) AND camera_ip='${camera_ip}' AND parking_area='${isExist.area_name}'`;
        const selectRemoveSpacesRes = selectRemoveSpaces && await dbManager.pgQuery(selectRemoveSpaces);
        if (selectRemoveSpacesRes && selectRemoveSpacesRes.rows && selectRemoveSpacesRes.rows.length > 0) {
          selectRemoveSpacesRes.rows.forEach(async (removeItem) => {
            const cameraName = await this.getCameraName(removeItem.camera_ip);
            const deleteParkingAreaQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, cmd) 
                                            VALUES ('${removeItem.camera_ip}', '${cameraName}', '${removeItem.parking_area}', '${removeItem.index_number}', 'space delete');`
            deleteParkingAreaQuery && await dbManager.pgQuery(deleteParkingAreaQuery);
          })
        }
        const syncSpaceDetailByAreaQuery = `DELETE FROM ob_parking_space WHERE NOT (index_number=ANY(ARRAY[${numbering_scheme_arr}]::text[])) AND camera_ip='${camera_ip}' AND parking_area='${isExist.area_name}'`;
        const syncSpaceDetailByAreaRes = await dbManager.pgQuery(syncSpaceDetailByAreaQuery);
        if (syncSpaceDetailByAreaRes && syncSpaceDetailByAreaRes.rowCount > 0) {
          if (global.websocket) {
            global.websocket.emit("parkingCoords", { parkingCoords: syncSpaceDetailByAreaRes.rowCount });
            global.websocket.emit("parkingSpaces", { parkingSpaces: syncSpaceDetailByAreaRes.rowCount });
          }
        }
        const formatNumberingSchemeArr = `${isExist.numbering_scheme}`.replace('[', '').replace(']', '').split(',');
        const cameraName = await this.getCameraName(camera_ip);
        formatNumberingSchemeArr.forEach(async (numberingScheme, index) => {
          const now = new Date();
          const syncSpaceOccupancyQuery = `UPDATE ob_parking_space SET occupancy='${formatOccupancyArr[index]}', updated_at= timestamp '${format(now, 'yyyy-MM-dd HH:mm:ss')}' WHERE camera_ip='${camera_ip}' AND parking_area='${isExist.area_name}' AND index_number='${numberingScheme}' AND occupancy!='${formatOccupancyArr[index]}'`;
          const syncSpaceOccupancyRes = syncSpaceOccupancyQuery && await dbManager.pgQuery(syncSpaceOccupancyQuery);
          const updateParkingSpaceQuery = syncSpaceOccupancyRes && syncSpaceOccupancyRes.rowCount > 0 && `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, occupancy, cmd) 
                                            VALUES ('${camera_ip}', '${cameraName}', '${isExist.area_name}', '${numberingScheme}', '${formatOccupancyArr[index]}', 'occupancy status update');`
          updateParkingSpaceQuery && await dbManager.pgQuery(updateParkingSpaceQuery);
          if (syncSpaceOccupancyRes && syncSpaceOccupancyRes.rowCount > 0) {
            if (global.websocket) {
              global.websocket.emit("parkingCoords", { parkingCoords: syncSpaceOccupancyRes.rowCount });
              global.websocket.emit("parkingSpaces", { parkingSpaces: syncSpaceOccupancyRes.rowCount });
            }
          }
        })
      }
    })
  }
}

exports.getParkingArea = async (cameraIp) => {
  let query;
  if (cameraIp) {
    query = `SELECT * FROM ob_parking_area WHERE camera_ip='${cameraIp}' ORDER BY name ASC`;
  } else {
    query = `SELECT * FROM ob_parking_area ORDER BY name ASC`;
  }
  try {
    const resAreas = await dbManager.pgQuery(query);
    return resAreas;
  } catch (err) {
    console.error('getParkingArea Rest api err: ', err);
  }
}

exports.getParkingSpace = async (cameraIp, parkingArea) => {
  let query;
  if (cameraIp) {
    if (parkingArea) {
      query = `SELECT * FROM ob_parking_space WHERE camera_ip='${cameraIp}' AND parking_area='${parkingArea}' ORDER BY parking_area ASC, CAST(index_number AS INTEGER) ASC`;
    } else {
      query = `SELECT * FROM ob_parking_space WHERE camera_ip='${cameraIp}' ORDER BY parking_area ASC, CAST(index_number AS INTEGER) ASC`;
    }
  } else {
    query = `SELECT * FROM ob_parking_space ORDER BY parking_area ASC, CAST(index_number AS INTEGER) ASC`;
  }
  try {
    const resSpaces = await dbManager.pgQuery(query);
    return resSpaces;
  } catch (err) {
    console.error('getParkingSpace Rest api err: ', err);
  }
}

exports.setParkingSpace = async (checkedItems, type) => {

  let query;
  if (Number.isInteger(parseInt(type))) {
    query = `UPDATE ob_parking_space SET type=${parseInt(type)} WHERE idx=ANY(ARRAY[${checkedItems}])`;
  } else {
    query = `UPDATE ob_parking_space SET type=null WHERE idx=ANY(ARRAY[${checkedItems}])`;
  }

  try {
    const resSpaces = await dbManager.pgQuery(query);
    if (resSpaces && resSpaces.rowCount > 0) {
      const selectUpdateSpace = `SELECT * FROM ob_parking_space WHERE idx=ANY(ARRAY[${checkedItems}])`;
      const selectUpdateSpaceRes = await dbManager.pgQuery(selectUpdateSpace);
      if (selectUpdateSpaceRes && selectUpdateSpaceRes.rows && selectUpdateSpaceRes.rows.length > 0) {
        selectUpdateSpaceRes.rows.forEach(async (updateSpaceTypeItem) => {
          const cameraName = await this.getCameraName(updateSpaceTypeItem.camera_ip);
          const updateParkingSpaceQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, type, cmd) 
                                          VALUES ('${updateSpaceTypeItem.camera_ip}', '${cameraName}', '${updateSpaceTypeItem.parking_area}', '${updateSpaceTypeItem.index_number}', ${parseInt(updateSpaceTypeItem.type) ? parseInt(updateSpaceTypeItem.type) : null}, 'space type update');`
          updateParkingSpaceQuery && await dbManager.pgQuery(updateParkingSpaceQuery);
        })
      }
      if (global.websocket) {
        global.websocket.emit("parkingSpaces", { parkingSpaces: resSpaces.rowCount });
      }
    }
    return resSpaces;
  } catch (err) {
    console.error('setParkingSpace type Rest api err: ', err);
  }
}

exports.removeParkingSpace = async (idx) => {

  const insertLogQuery = `SELECT * FROM ob_parking_space WHERE idx=${idx}`;
  const query = `DELETE FROM ob_parking_space WHERE idx=${idx}`;

  try {
    const insertLogRes = insertLogQuery && await dbManager.pgQuery(insertLogQuery);
    if (insertLogRes && insertLogRes.rows && insertLogRes.rows.length === 1) {
      const cameraName = await this.getCameraName(insertLogRes.rows[0].camera_ip);
      const deleteParkingSpaceLogQuery = `INSERT INTO ob_parking_control_log (camera_ip, camera_name, area, index_number, cmd) 
                                        VALUES ('${insertLogRes.rows[0].camera_ip}', '${cameraName}', '${insertLogRes.rows[0].parking_area}', '${insertLogRes.rows[0].index_number}', 'space delete');`
      deleteParkingSpaceLogQuery && await dbManager.pgQuery(deleteParkingSpaceLogQuery);
    }
    const resSpaces = await dbManager.pgQuery(query);
    if (resSpaces && resSpaces.rowCount > 0) {
      if (global.websocket) {
        global.websocket.emit("parkingSpaces", { parkingSpaces: resSpaces.rowCount });
        global.websocket.emit("parkingCoords", { parkingCoords: resSpaces.rowCount });

      }
    }
    return resSpaces;
  } catch (err) {
    console.error('removeParkingSpace Rest api err: ', err);
  }
}

exports.removeVCounter = async (id, ipaddress) => {
  const query = `UPDATE "ob_device" SET top_location=NULL, left_location=NULL, camera_id=NULL, camera_id_sub1=NULL, camera_id_sub2=NULL, camera_preset_start=NULL, camera_preset_end=NULL,status=0, updated_at=NOW() WHERE id='${id}' AND ipaddress='${ipaddress}';`
  try {
    const res = await dbManager.pgQuery(query);
    if (res) {
      if (global.websocket) {
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
        global.websocket.emit("eventList", { eventList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.removeMdet = async (idx, ipaddress) => {
  const query = `DELETE FROM ob_device WHERE idx='${idx}' AND ipaddress='${ipaddress}';`
  try {
    const res = await dbManager.pgQuery(query);
    if (res) {
      if (global.websocket) {
        global.websocket.emit("deviceList", { deviceList: res.rowCount });
      }
    }
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getParkingDataLog = async (camera_ip, area, index_number, occupancy, type, startDateTime, endDateTime) => {

  let condition = '';

  if (camera_ip) {
    if (condition) {
      condition += ` AND camera_ip='${camera_ip}'`;
    } else {
      condition += `WHERE camera_ip='${camera_ip}'`;
    }
  }

  if (area) {
    if (condition) {
      condition += ` AND area='${area}' `;
    } else {
      condition += `WHERE area='${area}' `;
    }
  }

  if (index_number) {
    if (condition) {
      condition += ` AND index_number='${index_number}' `;
    } else {
      condition += `WHERE index_number='${index_number}' `;
    }
  }

  if (occupancy) {
    if (condition) {
      condition += ` AND occupancy='${occupancy}' `;
    } else {
      condition += `WHERE occupancy='${occupancy}' `;
    }
  }

  if (type) {
    if (condition) {
      condition += ` AND type=${type} `;
    } else {
      condition += `WHERE type=${type} `;
    }
  }

  if (startDateTime && endDateTime) {
    if (condition) {
      condition += `AND occur_at BETWEEN '${startDateTime}' AND '${endDateTime}'`;
    } else {
      condition += `WHERE occur_at BETWEEN '${startDateTime}' AND '${endDateTime}'`;
    }
  } else if (startDateTime) {
    if (condition) {
      condition += `AND occur_at >= '${startDateTime}'`;
    } else {
      condition += `WHERE occur_at >= '${startDateTime}'`;
    }
  } else if (endDateTime) {
    if (condition) {
      condition += `AND occur_at <= '${endDateTime}'`;
    } else {
      condition += `WHERE occur_at <= '${endDateTime}'`;
    }
  }

  const query = `SELECT * FROM ob_parking_control_log ${condition} ORDER BY occur_at DESC`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.addVCounterOperLog = async (name, ipaddress, empty_slots, in_count, out_count, cmd) => {
  try {
    let query = `INSERT INTO ob_vcounter_log (name, ipaddress, empty_slots, in_count, out_count, cmd) 
                  VALUES ('${name}', '${ipaddress}', '${empty_slots}', '${in_count}', '${out_count}', '${cmd}')`;

    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

exports.getVCounterDataLog = async (name, ipaddress, cmd, startDateTime, endDateTime) => {

  let condition = '';

  if (name) {
    if (condition) {
      condition += ` AND name='${name}'`;
    } else {
      condition += `WHERE name='${name}'`;
    }
  }

  if (ipaddress) {
    if (condition) {
      condition += ` AND ipaddress='${ipaddress}' `;
    } else {
      condition += `WHERE ipaddress='${ipaddress}' `;
    }
  }

  if (cmd) {
    if (condition) {
      condition += ` AND cmd='${cmd}' `;
    } else {
      condition += `WHERE cmd='${cmd}' `;
    }
  }

  if (startDateTime && endDateTime) {
    if (condition) {
      condition += `AND occur_at BETWEEN '${startDateTime}' AND '${endDateTime}'`;
    } else {
      condition += `WHERE occur_at BETWEEN '${startDateTime}' AND '${endDateTime}'`;
    }
  } else if (startDateTime) {
    if (condition) {
      condition += `AND occur_at >= '${startDateTime}'`;
    } else {
      condition += `WHERE occur_at >= '${startDateTime}'`;
    }
  } else if (endDateTime) {
    if (condition) {
      condition += `AND occur_at <= '${endDateTime}'`;
    } else {
      condition += `WHERE occur_at <= '${endDateTime}'`;
    }
  }

  const query = `SELECT * FROM ob_vcounter_log ${condition} ORDER BY occur_at DESC`

  try {
    const res = await dbManager.pgQuery(query);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

exports.addCrowdDensityCamera = async({ipaddress, name, id, camera_id, rtsp_port }) => {
  let query = `INSERT INTO ob_crowddensity_camera (ipaddress, name, id, camera_id, rtsp_port) VALUES (
                '${ipaddress}', '${name}', '${id}', '${camera_id}', '${rtsp_port}'
              )`
  try {
    const res = await dbManager.pgQuery(query);
    if (global.websocket && res && res.rowCount === 1) {
      await dbPolling.crowdDensityLogPolling();
      global.websocket.emit("crowdDensityCamera", {
        crowdDensityCamera: res.rowCount
      });
    }
    return res;
  } catch (err) {
    console.error('add crowd density camera REST API err: ', err);
  }
}

exports.getCrowdDensityCamera = async () => {
  try {
    let query = `SELECT crowddensity.idx, crowddensity.ipaddress, crowddensity.name, crowddensity.id, crowddensity.camera_id, crowddensity.rtsp_port, camera.ipaddress AS rtsp_url, crowddensity.threshold, camera.status, camera.building_name, camera.floor_name, crowddensity.created_at, crowddensity.updated_at, crowddensity.name_updated_at FROM ob_crowddensity_camera crowddensity
                LEFT OUTER JOIN (SELECT b.name AS building_name, CASE WHEN c.building_idx = 0 THEN 'observer' ELSE b.service_type END AS service_type, f.name AS floor_name, c.ipaddress, c.id AS camera_id, c.status, c.building_idx, c.floor_idx, c.left_location, c.top_location, CASE WHEN c.name='카메라' THEN '' ELSE c.name END AS location FROM ob_camera c
                LEFT OUTER JOIN ob_floor f ON f.idx = c.floor_idx AND f.service_type=c.building_service_type
                LEFT OUTER JOIN ob_building b ON b.idx = f.building_idx AND b.service_type=c.building_service_type) camera
                ON camera.camera_id = crowddensity.camera_id ORDER BY name_updated_at ASC, idx ASC`
    return await dbManager.pgQuery(query);
  } catch (err) {
    console.error('getParkingCamera REST API error: ', err);
  }
}

exports.crowdDensityCount = async () => {
  try {
    let crorwdCamQuery = `SELECT * FROM ob_crowddensity_camera`;
    const crowdCamResult = await dbManager.pgQuery(crorwdCamQuery);
    for (const cam of crowdCamResult.rows) {
      const url = `http://${cam.ipaddress}:9090/api/v1/query?query=rate(heatmap_${cam.id}_sum[3m]) / rate(heatmap_${cam.id}_count[3m])`;
      const res = await axios.get(url);
      if (res && res.data && res.data.data.result && res.data.data.result.length > 0) {
        let timeStamp = res.data.data.result[0].value[0];
        const datetime = moment.unix(timeStamp).format("YYYYMMDD[T]HHmmss");
        let countAverage = Math.round(res.data.data.result[0].value[1]);
        if (countAverage >= parseInt(cam.threshold)) {
          await this.crowdDensityEvent(countAverage, cam.camera_id, cam.threshold);
        }
        let query = `INSERT INTO ob_crowddensity_log (name, ipaddress, camera_channel, datetime, count_average, threshold )
                        VALUES ('${cam.name}', '${cam.ipaddress}', '${cam.id}', '${datetime}', '${countAverage}', '${cam.threshold}')`;
        const result = await dbManager.pgQuery(query);
        if (result) {
          if (global.websocket) {
            global.websocket.emit("crowdDensityCount", { crowdDensityCount: result.rowCount });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.crowdDensityEvent = async (peopleCount, cameraId, threshold) => {
  try {
    let eventCam;
    const targetCamera = `SELECT * FROM ob_camera WHERE id='${cameraId}'`;
    const resCamera = await dbManager.pgQuery(targetCamera);

    if (resCamera && resCamera.rows && resCamera.rows.length > 0) {
      eventCam = resCamera.rows[0];
    }

    const queryEvent = `SELECT * FROM ob_event WHERE event_type=38 AND ipaddress='${eventCam.ipaddress}' AND acknowledge=false`;
    const resultEvent = await dbManager.pgQuery(queryEvent);
    if (!resultEvent.rows || resultEvent.rows.every(row => row.acknowledge === true)) {

      const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) 
        VALUES ('군중 밀집 이벤트', '현재 군중 인원: ${peopleCount}', '${eventCam.id}', ${eventCam.building_idx}, ${eventCam.floor_idx}, '${format(new Date(), 'yyyyMMdd')}' || 'T' || '${format(new Date(), 'HHmmss')}', 'crowddensity', '${eventCam.ipaddress}', 'crowddensity', ${parseInt(38)}, '${cameraId}');`;
      await dbManager.pgQuery(sqlEvent);

      const queryCam = `UPDATE ob_camera SET status='1' WHERE id='${cameraId}'`;
      const resCam = await dbManager.pgQuery(queryCam);

      if (global.websocket && resCam && resCam.rowCount > 0) {
        global.websocket.emit("cameraList", { cameraList: resCam.rowCount });
        global.websocket.emit("eventList", { eventList: resCam.rowCount });
        global.websocket.emit("crowdDensityEvent", { crowdDensityEvent: { cameraId }} )
        global.websocket.emit("crowdDensityCamera", {
          crowdDensityCamera: resCam.rowCount 
        });
      }
    }


  } catch (err) {
    console.log(`crowddensity insert event err: ${err}`);
  }
}

exports.crowdDensityCountLog = async () => {
  const nLimit = 200;
  // const query = `SELECT * FROM ob_crowddensity_log WHERE camera_channel='${selectedCameraId}' ORDER BY updated_at DESC LIMIT ${nLimit}`;
  const query = `SELECT * FROM ob_crowddensity_log ORDER BY updated_at DESC LIMIT ${nLimit}`;
  try {
    const res = await dbManager.pgQuery(query);
    const valueData = res.rows;
    return valueData;
  } catch (error) {
    console.log('호흡로그 조회 err: ', error);
  }
}

exports.updateCrowdDensityThreshold = async(idxValue, threshold) => {
  let idx; 
  if(isNaN(idxValue)){
    idx = parseInt(idx);
  } else {
    idx = idxValue
  }
  const query = `UPDATE ob_crowddensity_camera SET threshold='${threshold}' WHERE idx=${idx}`;
  try {
    const res = await dbManager.pgQuery(query);
    global.websocket.emit("crowdDensityCamera", {
      crowdDensityCamera: res.rowCount
    });
    return res;
  } catch(err) {
    console.error('update crowd density camera threshold REST API err: ', err);
  }
}

exports.detectMetal = async (mdetIp, occurTime) => {

  const beforeDateStr = occurTime;
  const yearStr = beforeDateStr.slice(0, 4)
  const monthStr = beforeDateStr.slice(4, 6)
  const dayStr = beforeDateStr.slice(6, 8)
  const hourStr = beforeDateStr.slice(9, 11)
  const minuteStr = beforeDateStr.slice(11, 13)
  const secondsStr = beforeDateStr.slice(13, 15)

  const dateStr = yearStr + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondsStr;

  let EventOccurTime = '';
  const dateOjb = addHours(new Date(dateStr), 9);
  EventOccurTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');

  const getDeviceQuery = `SELECT name, camera_id, id, top_location, left_location, building_idx, floor_idx, building_service_type FROM ob_device WHERE ipaddress='${mdetIp}'`;
  const mdetDetail = await dbManager.pgQuery(getDeviceQuery);

  if(mdetDetail && mdetDetail.rows && mdetDetail.rows.length > 0) {
    const isMdet = mdetDetail.rows[0];
    const queryString = `INSERT INTO "ob_event" (
      "name",
      "description",
      "id",
      "building_idx",
      "floor_idx",
      "event_occurrence_time",
      "device_type",
      "ipaddress",
      "service_type",
      "event_type",
      "camera_id"
    )
    VALUES (
      '금속 탐지',
      '${isMdet.name} 금속 탐지',
      '${isMdet.id}',
      0,
      0,
      '${EventOccurTime}',
      'mdet',
      '${mdetIp}',
      'mdet',
      37,
      '${isMdet.camera_id}'
    )`;
  
    try {
      const resQuery = await dbManager.pgQuery(queryString);
      if (resQuery && resQuery.rowCount > 0) {
        const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=37`);
        // const mdetLocation = await dbManager.pgQuery(`SELECT left_location, top_location, building_idx, floor_idx, building_service_type FROM ob_device WHERE ipaddress='${mdetIp}'`);
        // if (mdetLocation && mdetLocation.rows && mdetLocation.rows.length > 0 && mdetLocation.rows[0].left_location && mdetLocation.rows[0].top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
          if (isMdet && isMdet.left_location && isMdet.top_location && setPopUp && setPopUp.rows && setPopUp.rows.length > 0 && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
          if (global.websocket) {
            global.websocket.emit("eventList", {
              eventList: [{
                lastEvent: {
                  eventName: '금속 탐지',
                  deviceId: isMdet.id,
                  deviceType: 'mdet',
                  buildingIdx: isMdet.building_idx,
                  floorIdx: isMdet.floor_idx,
                  buildingServiceType: isMdet.building_service_type,
                  serviceType: 'mdet',
                  cameraId: isMdet.camera_id,
                  ipaddress: `${mdetIp}`
                }
              }]
            });
          }
        } else {
          if (global.websocket) {
            global.websocket.emit("eventList", { eventList: resQuery.rowCount });
          }
        }
      }
    } catch (err) {
      console.log('detect metal REST API err: ', err);
    }
  }
}
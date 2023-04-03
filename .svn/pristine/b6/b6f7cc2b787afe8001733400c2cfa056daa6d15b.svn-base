
const dbManager = require('../db/dbManager');
const { format, addHours } = require('date-fns');
const observerService = require('../services/observerService');
const eventConfig = require('./eventConfig');
const respirationThreshold = process.env.RESPIRATION_THRESHOLD || 65; 

const net = require('net');

//observerService.loadEventTypeConfig();

const arrConnection = [];

const connectTcp = (ipaddress) => {
  console.log(`try connecting to ${ipaddress}`);
  let socket = net.connect({
    host: ipaddress,
    port: 7005
  });
  
  socket.setEncoding('utf8');
  
  socket.on('connect', () => {
    console.log(`tcp socket connected(${ipaddress})`);
    arrConnection.push(socket);
  });

  let lastOccurTime;

  socket.on('data', async (data) => {
    console.log(`호흡(${ipaddress}): ${data}`);
    const startIndex = data.indexOf('::');
    const dataVal = data.substr(startIndex + 2, data.length - 1);
    
    const queryInsert = `INSERT INTO ob_breath_log (ipaddress, datetime, sensor_value) values('${ipaddress}','${format(new Date(), 'yyyyMMdd')}' || 'T' || '${format(new Date(), 'HHmmss')}', '${dataVal}')`;
    const resInsert = await dbManager.pgQuery(queryInsert);
    
    if (global.websocket) {
      global.websocket.emit("respiration", { respiration: dataVal.trim() });
    }
  
    const respirationUse = await eventConfig.get(28);
    if (respirationUse !== undefined && respirationUse.unused === false) {
      if (dataVal <= parseInt(respirationThreshold)) {
        const now = new Date();
        if (lastOccurTime === undefined || ((now.getTime() / 1000) - (lastOccurTime.getTime() / 1000) > 60)) {
          const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type) 
          VALUES ('호흡이상감지', '현재 호흡감지: ${dataVal}', '호흡센서', ${parseInt(8)}, ${parseInt(17)}, '${format(new Date(), 'yyyyMMdd')}' || 'T' || '${format(new Date(), 'HHmmss')}', 'vitalsensor', '${ipaddress}', 'observer', ${parseInt(28)});`;
          const resEvent = await dbManager.pgQuery(sqlEvent);
          lastOccurTime = new Date();
          const resLast = await observerService.getEvents(undefined, undefined, undefined, undefined, undefined, 1, ipaddress);
          const setPopUp = await dbManager.pgQuery(`SELECT popup, unused FROM ob_event_type WHERE idx=${resLast.rows[0].event_type};`);
          if (resLast && !setPopUp.rows[0].unused && setPopUp.rows[0].popup) {
            if (global.websocket) {
              global.websocket.emit("eventList", {
                eventList: [{
                  lastEvent: {
                    deviceId: resLast.rows[0].id,
                    deviceType: resLast.rows[0].device_type,
                    buildingIdx: resLast.rows[0].building_idx,
                    floorIdx: resLast.rows[0].floor_idx,
                    buildingServiceType: resLast.rows[0].building_service_type,
                    serviceType: resLast.rows[0].service_type,
                  }
                }]
              });
            }
          } else {
            if (global.websocket) {
              global.websocket.emit("eventList", { eventList: resUpsert.rows.length });
            }
          }
        }
      }
    }
  });
  
  socket.on('close', () => {
    console.log(`close(${ipaddress})`);

    setTimeout(()=>{
      connectTcp(ipaddress);
    }, 5000);
  });
  
  socket.on('error', (err) => {
    console.log(`on error(${ipaddress}) ${err.code}`);
  });
}

exports.startRespiration = async () => {
  const query = `SELECT * FROM ob_device WHERE type='vitalsensor'`;
  const res = await dbManager.pgQuery(query);

  if (res && res.rows && res.rows.length > 0) {
    res.rows.forEach((device) => {
      connectTcp(device.ipaddress);
    });
  }
}

exports.stopRespiration = () => {
  arrConnection.forEach(socket => {
    socket.destroy();
  });
}

exports.disconnect = () => {
  if (socket !== undefined) {
    socket.destroy();
  }
}
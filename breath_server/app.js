const net = require('net');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { format } = require('date-fns');
const axios = require('axios');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbManager = require('./dbmanager');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

const arrConnection = [];
const mapBreath = new Map();
const mapBreathEvent = new Map(); // 임계치보다 낮은 경우 기록하여 1분에 2번 발생하는지 체크 

io.on('connection', (socket) => {
  console.log('client connected');
  console.log('socket id:', socket.id);
  //console.log('socket client:', socket.client);

  socket.on('setbreath', (data) => {
    if (data && data.sensorIp && data.cmd) {
      const arrSocketId = mapBreath.get(data.sensorIp);
      if (arrSocketId) {
        if (data.cmd === 'on') {
          let exist = false;
          for (const socketId of arrSocketId) {
            if (socketId === socket.id) {
              exist = true;
              break;
            }
          }
          if (exist === false) {
            arrSocketId.push(socket.id);
          }
        } else if (data.cmd === 'off') {
          for (let i = 0; i < arrSocketId.length; ++i) {
            if (arrSocketId[i] === socket.id) {
              arrSocketId.splice(i, 1);
              break;
            }
          }
        }
      } else {
        mapBreath.set(data.sensorIp, [socket.id]);
      }
    }
    for (const entry of mapBreath) {
      console.log(entry);
    }
  });

  socket.on('manageVitalsensor', (data) => {
    if (data && data.cmd && data.ipaddress) {
      if (data.cmd === 'add') {
        console.log(`${data.ipaddress} 장비 추가 연결`);
        connectTcp(data.ipaddress);
      } else if (data.cmd === 'remove') {
        console.log(`${data.ipaddress} 장비 연결 해제`);
        // tcp socket destroy 처리
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log('client disconnected:', socket.id);
    for (const sensorIp of mapBreath.keys()) {
      const arrSocketId = mapBreath.get(sensorIp);
      const filtered = arrSocketId.filter((value, index, arr) => {
        return value !== socket.id;
      });
      mapBreath.set(sensorIp, filtered);
    }

    for (const entry of mapBreath) {
      console.log(entry);
    }
    // 접속된 모든 클라이언트 id 목록 구하기
    //const ids = await io.allSockets();
    //console.log('ids:', ids);
  });
});

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

  socket.on('data', async (data) => {
    try {
      console.log(`호흡(${ipaddress}): ${data}`);
      const startIndex = data.indexOf('::');
      const dataVal = data.substr(startIndex + 2, data.length - 1);

      const now = new Date();
      const date = format(now, 'yyyyMMdd') + 'T' + format(now, 'HHmmss');

      const arrWebsocketId = mapBreath.get(ipaddress);
      if (arrWebsocketId) {
        for (const socketId of arrWebsocketId) {
          io.to(socketId).emit('breathData', { sensorIp: ipaddress, date: date, val: dataVal });
        }
      }

      const queryInsert = `INSERT INTO ob_breath_log (ipaddress, datetime, sensor_value) values('${ipaddress}','${date}', '${dataVal}')`;
      const resInsert = await dbManager.pgQuery(queryInsert);

      const query = `SELECT * FROM ob_breathsensor WHERE ipaddress='${ipaddress}'`;
      const breathData = await dbManager.pgQuery(query);

      // 환경설정에서 호흡이벤트 발생 조건을 읽어와서 몇분동안 몇번 임계치 아래로 내려가야할지 결정
      const querySetting = `SELECT * FROM ob_setting WHERE name='vitalsensor Event Condition'`;
      const breathSetting = await dbManager.pgQuery(querySetting);
      let breathCheckDuration = 60;
      let breathCheckCount = 2;
      if (breathSetting && breathSetting.rows && breathSetting.rows.length > 0) {
        // 옵션값은 검사기간을 초로, 검사횟수를 숫자로해서 콜론으로 구분하여 스트링으로 저장되어 있음(60초에 2번 발생예=> 60:2)
        let settingValue = breathSetting.rows[0].setting_value;
        if (settingValue === '' || settingValue === undefined || settingValue === null) {
          settingValue = breathSetting.rows[0].default_value;
        }
        if (settingValue && settingValue.length > 0 && settingValue.indexOf(':') > 0) {
          const arrValues = settingValue.split(':');
          if (arrValues.length >= 2) {
            const tmpBreathCheckDuration = parseInt(arrValues[0]);
            // 검사기간 최대/최소 검사(1초~9분59초)
            if (tmpBreathCheckDuration > 0 && tmpBreathCheckDuration < 10 * 60) {
              breathCheckDuration = tmpBreathCheckDuration;
            }
            // 검사횟수 최대/최소 검사
            const tmpBreathCheckCount = parseInt(arrValues[1]);
            if (tmpBreathCheckCount > 0 && tmpBreathCheckCount < 50) {
              breathCheckCount = tmpBreathCheckCount;
            }
          }
        }
      }

      if (breathData && breathData.rows && breathData.rows.length > 0) {
        useStatus = breathData.rows[0].use_status
        const breathValue = breathData.rows[0].breath_value;
        const scheduleTime = breathData.rows[0].schedule_time;
        const eventTime = format(new Date(), 'HHmmss');
        const installLocation = breathData.rows[0].install_location;
        const prisonDoorStatus = breathData.rows[0].prison_door_status;

        if (installLocation === 'room') {
          // 임계치 보다 낮은 값인 경우 이벤트 발생
          if (dataVal <= parseInt(breathValue)) {
            if (useStatus === 'true') {
              // 호흡센서에 이벤트 발생된 상태인지 검사
              const queryEvent = `SELECT * FROM ob_event WHERE ipaddress='${ipaddress}' AND acknowledge=false`;
              const resEvent = await dbManager.pgQuery(queryEvent);
              if (resEvent && resEvent.rows && resEvent.rows.length === 0 && prisonDoorStatus === 'lock') {
                if (breathCheckCount === 1) {
                  // 임계치 아래로 한번 내려갔을 때 이벤트 발생인 경우
  
                  let eventAlertMode = 0;
                  const timeArray = scheduleTime.split("^");
                  for (let i = 0; i < timeArray.length; i++) {
                    const sTime = timeArray[i].substring(0, 6);
                    const eTime = timeArray[i].substring(7);
                    if (((sTime <= eventTime) && (eval('235959') >= eventTime)) && ((eval('000000') <= eventTime) && (eTime >= eventTime))) {
                      eventAlertMode++
                    }
                  }
                  if (eventAlertMode >= 1) {
                    try {
                      const res = await axios.post(`http://${process.env.WEBSOCKET_URL}:${process.env.PORT}/api/observer/breathEvent`, {
                        ipaddress: ipaddress,
                        dataVal: dataVal
                      });
                      
                    } catch (error) {
                      console.log('error:', error);
                    }
                  }
  
                  // 이벤트 발생카운트 계산 초기화
                  mapBreathEvent.delete(ipaddress);
  
                } else {
                  // 임계치 아래로 일정 시간내 여러번 내려갔을 때 이벤트 발생인 경우
  
  
                  // 임계치보다 낮은 값이 특정기간에 여러번 발생하면 이벤트 생성을 위해 map에 장치ip, 측정시간, 측정값 저장
                  const lastTimes = mapBreathEvent.get(ipaddress);
                  if (lastTimes === undefined) {
                    // 최초 발생시 맵에 저장
                    mapBreathEvent.set(ipaddress, [now]);
                    console.log('이벤트 검사1:', [now]);
                  } else {
                    // 이전에 발생한 기록이 있으면 특정기간 발생여부 검사
                    if (lastTimes.length === breathCheckCount-1) {
                      // 특정 발생횟수만큼 발생한 경우 저장된 모든 시간이 특정기간 이내인지 검사
                      const newLastTimes = [];
                      for(let time of lastTimes) {
                        const diff = now.getTime() - time.getTime();
                        if (diff < breathCheckDuration * 1000) {                        
                          newLastTimes.push(time);
                        }
                      }
                      if (newLastTimes.length < lastTimes.length) {
                        // 특정기간 이내인 newLastTime 의 배열수와 lastTimes 의 배열수가 같으면(모든 발생시간이 특정 기간 이내가 아니면)
                        // 새로 특정시간내 배열로 구성된 newLastTime에 지금 발생한 시간을 추가하여 map 에 셋
                        newLastTimes.push(now);
                        mapBreathEvent.set(ipaddress, newLastTimes);
                        console.log('이벤트 검사u1:', newLastTimes);
                      } else {
                        // 저장된 모든 시간이 특정기간 이내이면 이벤트 발생
  
                        let eventAlertMode = 0;
                        const timeArray = scheduleTime.split("^");
                        for (let i = 0; i < timeArray.length; i++) {
                          const sTime = timeArray[i].substring(0, 6);
                          const eTime = timeArray[i].substring(7);
                          if (((sTime <= eventTime) && (eval('235959') >= eventTime)) && ((eval('000000') <= eventTime) && (eTime >= eventTime))) {
                            eventAlertMode++
                          }
                        }
                        if (eventAlertMode >= 1) {
                          try {
                            
                              const res = await axios.post(`http://${process.env.WEBSOCKET_URL}:${process.env.PORT}/api/observer/breathEvent`, {
                                ipaddress: ipaddress,
                                dataVal: dataVal
                              });
                            
                          } catch (error) {
                            console.log('error:', error);
                          }
                        }
  
                        // 이벤트 발생카운트 계산 초기화
                        console.log('이벤트 발생:', mapBreathEvent.get(ipaddress));
                        mapBreathEvent.delete(ipaddress);
                      }
  
                    } else {
                      // 특정 발생횟수만큼 발생하지 않은 경우 저장된 모든 시간이 특정기간 이내인지 검사하여 재구성 후 지금 시간 추가
                      const newLastTimes = [];
                      for(let time of lastTimes) {
                        const diff = now.getTime() - time.getTime();
                        if (diff < breathCheckDuration * 1000) {                        
                          newLastTimes.push(time);
                        }
                      }
                      newLastTimes.push(now);
                      mapBreathEvent.set(ipaddress, newLastTimes);
                      console.log('이벤트 검사u2:', newLastTimes);
                    }
                  }
  
  
                }
              } else {
                // 이벤트 발생카운트 계산 초기화
                mapBreathEvent.delete(ipaddress);
              }
            }
          }
        } else if (installLocation === 'ceiling') {
          // 임계치 보다 낮은 값인 경우 이벤트 발생
          if (dataVal >= parseInt(breathValue)) {
            if (useStatus === 'true') {

              // 이벤트 발생
              let eventAlertMode = 0;
              const timeArray = scheduleTime.split("^");
              for (let i = 0; i < timeArray.length; i++) {
                const sTime = timeArray[i].substring(0, 6);
                const eTime = timeArray[i].substring(7);
                if (((sTime <= eventTime) && (eval('235959') >= eventTime)) && ((eval('000000') <= eventTime) && (eTime >= eventTime))) {
                  eventAlertMode++
                }
              }
              if (eventAlertMode >= 1) {
                try {
                  const queryEvent = `SELECT * FROM ob_event WHERE ipaddress='${ipaddress}' AND acknowledge=false`;
                  const resEvent = await dbManager.pgQuery(queryEvent);
                  if (resEvent && resEvent.rows && resEvent.rows.length === 0) {
                    const res = await axios.post(`http://${process.env.WEBSOCKET_URL}:${process.env.PORT}/api/observer/breathEvent`, {
                      ipaddress: ipaddress,
                      dataVal: dataVal
                    });
                  }
                } catch (error) {
                  console.log('error:', error);
                }
              }

            }
          }
        }

        
      }
    } catch (error) {
      console.log('socket.on(data) error:', error)
    }

  });

  socket.on('close', () => {
    console.log(`close(${ipaddress})`);

    setTimeout(() => {
      connectTcp(ipaddress);
    }, 5000);
  });

  socket.on('error', (err) => {
    console.log(`on error(${ipaddress}) ${err.code}`);
  });
}

const connectElectDoorTcp = (ipaddress, port) => {
  console.log(`try elect door connecting to ${ipaddress}`);
  let socket = net.connect({
    host: ipaddress,
    port: port
  });

  socket.setEncoding('utf8');

  socket.on('connect', () => {
    console.log(`elect door tcp connected(${ipaddress}:${port})`);
  });

  socket.on('data', async (data) => {
    try {
      console.log(`door 상태변경(${ipaddress}): ${data}`);
      const doorId = data[0];
      const doorState = data[1];

      const queryUpdate = `INSERT UPDATE ob_breathsensor set door_status='${doorState}' WHERE ipaddress='${ipaddress}'`;
      const resUpdate = await dbManager.pgQuery(queryUpdate);

    } catch(err) {
      console.log('elecDoor process received data error:', err);
    }
  });

  socket.on('close', () => {
    console.log(`close(${ipaddress})`);

    setTimeout(() => {
      connectElectDoorTcp(process.env.ELECT_DOOR_IP, process.env.ELECT_DOOR_PORT);
    }, 5000);
  });
}

const startBreath = async () => {
  try {
    const query = `SELECT * FROM ob_device WHERE type='vitalsensor'`;
    const res = await dbManager.pgQuery(query);

    if (res && res.rows && res.rows.length > 0) {
      //res.rows.forEach((device) => {
      for (const device of res.rows) {
        connectTcp(device.ipaddress);
      }
      //);
    }
  } catch (error) {
    console.log('startBreath error:', error);
  }

}

const stopBreath = () => {
  arrConnection.forEach(socket => {
    socket.destroy();
  });
}

process.on('SIGUP', () => {
  console.log('Received: SIGUP');
  stopBreath();
  process.exit(1);
});
process.on('SIGINT', () => {
  console.log('Received: SIGINT');
  stopBreath();
  process.exit(1);
});
process.on('SIGQUIT', () => {
  console.log('Received: SIGQUIT');
  stopBreath();
  process.exit(1);
});

startBreath();
//connectElectDoorTcp(process.env.ELECT_DOOR_IP, process.env.ELECT_DOOR_PORT);

httpServer.listen(parseInt(process.env.PORT) + 1, process.env.WEBSOCKET_URL);
httpServer.on('listening', () => {
  console.log('server listening:', httpServer.address());
})

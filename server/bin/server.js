#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('server:server');
var http = require('http');
const socketIO = require('socket.io');
const rtsp = require('rtsp-ffmpeg');
const dbManager = require("../db/dbmanager");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4200');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Create WebSocket server.
 */
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

// 영상전송상태 저장용 map 자료구조
const mapStream = new Map();
const mapArchive = new Map();

io.on('connection', async (socket) => {
  console.log(`WebSocket Connected: ${socket.handshake.address}/${socket.id}`);
  
  socket.on('cameraStream', async (received) => {
    if(received && received.cameraId && received.cmd) {
      if (received.cameraId === undefined || received.cameraId === null) {
        console.log('cameraStream cameraId is null');
        return;
      }
      const arrStream = mapStream.get(socket.id);
      if(received.cmd === 'on') {
        // 접속한 클라이언트에서 스트림을 요청한 적이 없으면 스트림 생성
        if (arrStream === undefined) {
          const queryVmsName = `SELECT access_point FROM ob_camera WHERE id='${parseInt(received.cameraId)}'`;
          const res = await dbManager.pgQuery(queryVmsName);
          let vmsNameRes = res && res.rows && res.rows.length === 1 && res.rows[0].access_point;
          const vmsName = await vmsNameRes && vmsNameRes.slice(6, vmsNameRes.indexOf('/',6));
          const queryVms = `SELECT * FROM ob_vms WHERE name='${vmsName}'`;
          try {
            const resVms = await dbManager.pgQuery(queryVms);
            let username = 'root';
            let password = 'root';
            let mgist_ip = '192.168.7.151';
            let rtst_port = '554';
            if (resVms && resVms.rows.length > 0) {
              username = resVms.rows[0].id !== undefined ? resVms.rows[0].id : "root";
              password = resVms.rows[0].password !== undefined ? resVms.rows[0].password : "root";
              mgist_ip = resVms.rows[0].ipaddress !== undefined ? resVms.rows[0].ipaddress : "localhost";
              //const vms = resVms.rows[0];
            }
            if (res && res.rows.length > 0) {
              const accessPoint = res.rows[0].access_point;
              if (accessPoint.indexOf('SERVER01') >= 0){
                mgist_ip = process.env.FAILOVER_SERVER01_IP;  // '192.168.9.13';
                rtst_port = process.env.FAILOVER_SERVER01_RTSP_PORT;    //'11840';
              } else if (accessPoint.indexOf('SERVER02') >= 0){
                mgist_ip = process.env.FAILOVER_SERVER02_IP;  // '192.168.9.12';
                rtst_port = process.env.FAILOVER_SERVER02_RTSP_PORT;  //'11078';
              } else if (accessPoint.indexOf('SERVER03') >= 0){
                mgist_ip = process.env.FAILOVER_SERVER03_IP;  // '192.168.9.11';
                rtst_port = process.env.FAILOVER_SERVER03_RTSP_PORT;  //'11374';
              }
              //const url = `rtsp://${username}:${password}@${mgist_ip}:11421/hosts/${vms.name}/DeviceIpint.${received.cameraId}/SourceEndpoint.video:0:0`;
              const url = `rtsp://${username}:${password}@${mgist_ip}:${rtst_port}/${accessPoint.replace('0:0','0:1')}`;
              // const url = `rtsp://${username}:${password}@${mgist_ip}:${rtst_port}/${accessPoint}`;
              console.log('url:', url);
      
              const stream = new rtsp.FFMpeg({ input: url, rate: 10, resolution: '640x480', quality: 3 });
              mapStream.set(socket.id, [{cameraId: received.cameraId, stream: stream}]);
              console.log(`${received.cameraId} 라이브 영상 시작`, new Date());
      
              const pipeStream = (data) => {
                socket.emit('cameraStream', {
                  cameraId:  received.cameraId,
                  data: data.toString('base64')
                });
              }
              stream.on('data', pipeStream);
            } else {
              //throw 'no camera in db1';
              console.log('rtsp no camera1');
            }
          } catch (error) {
            console.log(error);
            throw error;
          }
        } else {  // 접속한 클라이언트에서 스트림을 요청한 적이 있으면 배열에서 카메라 아이디로 스트림 찾기
          let bExist = false;
          for (const item of arrStream) {
            if (item.cameraId === received.cameraId) {
              bExist = true;
              console.log(`${received.cameraId} 라이브 영상 요청무시`);
              break;
            }
          }
          if (bExist === false) {
            const queryVmsName = `SELECT access_point FROM ob_camera WHERE id='${parseInt(received.cameraId)}'`;
            const res = await dbManager.pgQuery(queryVmsName);
            let vmsNameRes = res && res.rows && res.rows.length === 1 && res.rows[0].access_point;
            const vmsName = await vmsNameRes && vmsNameRes.slice(6, vmsNameRes.indexOf('/',6));
            const queryVms = `SELECT * FROM ob_vms WHERE name='${vmsName}'`;
            try {
              const resVms = await dbManager.pgQuery(queryVms);
              let username = 'root';
              let password = 'root';
              let mgist_ip = '192.168.7.151';
              let rtst_port = '554';
              if (resVms && resVms.rows.length > 0) {
                username = resVms.rows[0].id !== undefined ? resVms.rows[0].id : "root";
                password = resVms.rows[0].password !== undefined ? resVms.rows[0].password : "root";
                mgist_ip = resVms.rows[0].ipaddress !== undefined ? resVms.rows[0].ipaddress : "localhost";
                //const vms = resVms.rows[0];
              }
              if (res && res.rows.length > 0) {
                const accessPoint = res.rows[0].access_point;
                if (accessPoint.indexOf('SERVER01') >= 0){
                  mgist_ip = process.env.FAILOVER_SERVER01_IP;  // '192.168.9.13';
                  rtst_port = process.env.FAILOVER_SERVER01_RTSP_PORT;    //'11840';
                } else if (accessPoint.indexOf('SERVER02') >= 0){
                  mgist_ip = process.env.FAILOVER_SERVER02_IP;  // '192.168.9.12';
                  rtst_port = process.env.FAILOVER_SERVER02_RTSP_PORT;  //'11078';
                } else if (accessPoint.indexOf('SERVER03') >= 0){
                  mgist_ip = process.env.FAILOVER_SERVER03_IP;  // '192.168.9.11';
                  rtst_port = process.env.FAILOVER_SERVER03_RTSP_PORT;  //'11374';
                }

                //const url = `rtsp://${username}:${password}@${mgist_ip}:11421/hosts/${vms.name}/DeviceIpint.${received.cameraId}/SourceEndpoint.video:0:0`;
                const url = `rtsp://${username}:${password}@${mgist_ip}:${rtst_port}/${accessPoint.replace('0:0','0:1')}`;
                // const url = `rtsp://${username}:${password}@${mgist_ip}:${rtst_port}/${accessPoint}`;
                
                const stream = new rtsp.FFMpeg({ input: url, rate: 10, resolution: '640x480', quality: 3 });
                arrStream.push({ cameraId: received.cameraId, stream: stream });
                console.log(`${received.cameraId} 라이브 영상 시작`, new Date());

                const pipeStream = (data) => {
                  socket.emit('cameraStream', {
                    cameraId: received.cameraId,
                    data: data.toString('base64')
                  });
                }
                stream.on('data', pipeStream);
              } else {
                //throw 'no camera in db2';
                console.log('rtsp no camera2');
              }
            } catch (error) {
              console.log(error);
              throw error;
            }
          }
        }
      } else if(received.cmd === 'off') {
        if (arrStream !== undefined) {
          try {
            for (const item of arrStream) {
              if (item.cameraId === received.cameraId) {
                if (item.stream !== undefined) {
                  item.stream.stop();
                  console.log(`${item.cameraId} 라이브 영상 종료`, new Date());
                }
                break;
              }
            }
            const filtered = arrStream.filter((item)=> item.cameraId !== received.cameraId);
            mapStream.set(socket.id, filtered);
          }  catch(error){
            console.log('stream release error:', error);
          }
        }
      }
    }
  });

  socket.on('cameraArchive', async (received) => {
    if(received && received.cameraId !== undefined && received.cameraId !== null && received.cameraId !== 'null' && received.startDateTime && received.cmd) {
      
      const arrArchive = mapArchive.get(socket.id);

      if(received.cmd === 'on') {
        
        // 접속한 클라이언트에서 스트림을 요청한 적이 없으면 스트림 생성
        if (arrArchive === undefined) {
          const queryVmsName = `SELECT access_point FROM ob_camera WHERE id='${parseInt(received.cameraId)}'`;
          const res = await dbManager.pgQuery(queryVmsName);
          let vmsNameRes = res && res.rows && res.rows.length === 1 && res.rows[0].access_point;
          const vmsName = await vmsNameRes && vmsNameRes.slice(6, vmsNameRes.indexOf('/',6));
          const queryVms = `SELECT * FROM ob_vms WHERE name='${vmsName}'`;
          try {
            const resVms = await dbManager.pgQuery(queryVms);
            let username = 'root';
            let password = 'root';
            let mgist_ip = '192.168.7.151';
            let rtst_port = '554';
            if (resVms && resVms.rows.length > 0) {
              username = resVms.rows[0].id !== undefined ? resVms.rows[0].id : "root";
              password = resVms.rows[0].password !== undefined ? resVms.rows[0].password : "root";
              mgist_ip = resVms.rows[0].ipaddress !== undefined ? resVms.rows[0].ipaddress : "localhost";
              //const vms = resVms.rows[0];
            }
            if (res && res.rows.length > 0) {
              const accessPoint = res.rows[0].access_point;
              if (accessPoint.indexOf('SERVER01') >= 0){
                mgist_ip = process.env.FAILOVER_SERVER01_IP;  // '192.168.9.13';
                rtst_port = process.env.FAILOVER_SERVER01_RTSP_PORT;    //'11840';
              } else if (accessPoint.indexOf('SERVER02') >= 0){
                mgist_ip = process.env.FAILOVER_SERVER02_IP;  // '192.168.9.12';
                rtst_port = process.env.FAILOVER_SERVER02_RTSP_PORT;  //'11078';
              } else if (accessPoint.indexOf('SERVER03') >= 0){
                mgist_ip = process.env.FAILOVER_SERVER03_IP;  // '192.168.9.11';
                rtst_port = process.env.FAILOVER_SERVER03_RTSP_PORT;  //'11374';
              }

              const url = `rtsp://${username}:${password}@${mgist_ip}:${rtst_port}/archive/${accessPoint}/${received.startDateTime}?speed=1`;
              console.log('url:', url);
    
              const stream = new rtsp.FFMpeg({ input: url, rate: 10, resolution: '640x480', quality: 3 });
              mapArchive.set(socket.id, [{cameraId: received.cameraId, startDateTime: received.startDateTime, stream: stream}]);
              console.log(`${received.cameraId} 녹화 영상 시작`, new Date());
    
              const pipeArchive = (data) => {
                socket.emit('cameraArchive', {
                  cameraId:  received.cameraId,
                  startDateTime: received.startDateTime,
                  data: data.toString('base64'),
                });
              }
              stream.on('data', pipeArchive);
            } else {
              console.log('rtsp no camera3');
              //throw 'no camera in db3';
            }
          } catch (error) {
            console.log(error);
            throw error;
          }
        } else {  // 접속한 클라이언트에서 스트림을 요청한 적이 있으면 배열에서 카메라 아이디로 스트림 찾기
          let bExist = false;
          for (const item of arrArchive) {
            if (item.cameraId === received.cameraId && item.startDateTime === received.startDateTime) {
              bExist = true;
              console.log(`${received.cameraId} 녹화 영상 요청무시`);
              break;
            }
          }
          if (bExist === false) {
            const queryVmsName = `SELECT access_point FROM ob_camera WHERE id='${parseInt(received.cameraId)}'`;
            const res = await dbManager.pgQuery(queryVmsName);
            let vmsNameRes = res && res.rows && res.rows.length === 1 && res.rows[0].access_point;
            const vmsName = await vmsNameRes && vmsNameRes.slice(6, vmsNameRes.indexOf('/',6));
            const queryVms = `SELECT * FROM ob_vms WHERE name='${vmsName}'`;
            try {
              const resVms = await dbManager.pgQuery(queryVms);
              let username = 'root';
              let password = 'root';
              let mgist_ip = '192.168.7.151';
              let rtst_port = '554';
              if (resVms && resVms.rows.length > 0) {
                username = resVms.rows[0].id !== undefined ? resVms.rows[0].id : "root";
                password = resVms.rows[0].password !== undefined ? resVms.rows[0].password : "root";
                mgist_ip = resVms.rows[0].ipaddress !== undefined ? resVms.rows[0].ipaddress : "localhost";
                //const vms = resVms.rows[0];
              }
              if (res && res.rows.length > 0) {
                const accessPoint = res.rows[0].access_point;

                if (accessPoint.indexOf('SERVER01') >= 0){
                  mgist_ip = process.env.FAILOVER_SERVER01_IP;  // '192.168.9.13';
                  rtst_port = process.env.FAILOVER_SERVER01_RTSP_PORT;    //'11840';
                } else if (accessPoint.indexOf('SERVER02') >= 0){
                  mgist_ip = process.env.FAILOVER_SERVER02_IP;  // '192.168.9.12';
                  rtst_port = process.env.FAILOVER_SERVER02_RTSP_PORT;  //'11078';
                } else if (accessPoint.indexOf('SERVER03') >= 0){
                  mgist_ip = process.env.FAILOVER_SERVER03_IP;  // '192.168.9.11';
                  rtst_port = process.env.FAILOVER_SERVER03_RTSP_PORT;  //'11374';
                }

                //const url = `rtsp://${username}:${password}@${mgist_ip}:11421/archive/hosts/${vms.name}/DeviceIpint.${received.cameraId}/SourceEndpoint.video:0:0/${received.startDateTime}?speed=1`;
                const url = `rtsp://${username}:${password}@${mgist_ip}:${rtst_port}/archive/${accessPoint}/${received.startDateTime}?speed=1`;

                const stream = new rtsp.FFMpeg({ input: url, rate: 10, resolution: '640x480', quality: 3 });
                arrArchive.push({ cameraId: received.cameraId, startDateTime: received.startDateTime, stream: stream });
                console.log(`${received.cameraId} 녹화 영상 시작`, new Date());

                const pipeArchive = (data) => {
                  console.log('cameraId:', received.cameraId);
                  socket.emit('cameraArchive', {
                    cameraId: received.cameraId,
                    startDateTime: received.startDateTime,
                    data: data.toString('base64'),
                  });
                }
                stream.on('data', pipeArchive);
              } else {
                //throw 'no camera in db4';
                console.log('rtsp no camera4');
              }
            } catch (error) {
              console.log(error);
              throw error;
            }
          }
        }
      } else if(received.cmd === 'off') {
        if (arrArchive !== undefined) {
          try {
            for (const item of arrArchive) {
              if (item.cameraId === received.cameraId && item.startDateTime === received.startDateTime) {
                if (item.stream !== undefined) {
                  item.stream.stop();
                  console.log(`${item.cameraId} 녹화 영상 종료`, new Date());
                }
                break;
              }
            }
            const filtered = arrArchive.filter((item)=> !(item.cameraId === received.cameraId && item.startDateTime === received.startDateTime));
            mapArchive.set(socket.id, filtered);
          }  catch(error){
            console.log('stream release error:', error);
          }
        }
      }
    }
  });


  socket.on('disconnect', () => {
    const arrStream = mapStream.get(socket.id);
    const arrArchive = mapArchive.get(socket.id);
    if (arrStream !== undefined) {
      for (const item of arrStream) {
        if (item.stream !== undefined) {
          item.stream.stop();
          console.log(`${item.cameraId} 영상 종료`, new Date());
        }
      }
      mapStream.delete(socket.id);
    }  
    if(arrArchive !== undefined) {




      for (const item of arrArchive) {
        if (item.stream !== undefined) {
          item.stream.stop();
          console.log(`${item.cameraId} 영상 종료`, new Date());
        }
      }
      mapArchive.delete(socket.id);
    }
    console.log(`WebSocket Disconnected: ${socket.handshake.address}/${socket.id}`);
  });    
});

global.websocket = io;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

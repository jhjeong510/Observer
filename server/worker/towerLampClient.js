const net = require('net');
//const observerService = require('../services/observerService');
//const eventConfig = require('./eventConfig');

const connectTcp = (ipaddress, port) => {
  console.log(`try connecting to TowerLamp ${ipaddress}`);
  let socket = net.connect({
    host: ipaddress,
    port: port
  });
  
  socket.setEncoding('utf8');
  
  socket.on('connect', () => {
    console.log(`towerlamp tcp socket connected(${ipaddress})`);
    global.towerLampSocket = socket;
  });

  socket.on('data', async (data) => {
    console.log(`towerlamp data(${ipaddress}): ${data}`);
  });

  socket.on('close', () => {
    console.log(`towerlamp connection close(${ipaddress})`);
    global.towerLampSocket = undefined;

    setTimeout(()=>{
      connectTcp(ipaddress, port);
    }, 5000);
  });
  
  socket.on('error', (err) => {
    console.log(`towerlamp error(${ipaddress}) ${err.code}`);
  });
}

exports.connectTowerLamp = async () => {
  connectTcp(process.env.TOWERLAMP_IP, process.env.TOWERLAMP_PORT);
}

exports.turnOnOffTowerLamp = async (onOff) => {
  if ( global.towerLampSocket !== undefined) {
    let buffer = new Uint8Array(10);
    buffer[0] = 0x57; //'W'
    buffer[1] = 0x00; //sound model
    if (onOff === 'on') {
      buffer[2] = 0x02; //red (0:off, 1:on, 2:blink)
    } else if (onOff === 'off') {
      buffer[2] = 0x00; //red (0:off, 1:on, 2:blink)
    }
    buffer[3] = 0x00; //yellow
    buffer[4] = 0x00; //green
    buffer[5] = 0x00; //blue
    buffer[6] = 0x00; //white
    if (onOff === 'on') {
      buffer[7] = 0x01; // sound (0:off, 1:on)
    } if (onOff === 'off') {
      buffer[7] = 0x00; // sound (0:off, 1:on)
    }    
    buffer[8] = 0x00; // reserved
    buffer[9] = 0x00; // reserved
    global.towerLampSocket.write(buffer);
  }
}

exports.disconnectTowerLamp = () => {
  if ( global.towerLampSocket !== undefined) {
    global.towerLampSocket.destroy();
  }
}
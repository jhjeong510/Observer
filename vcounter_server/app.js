const net = require('net');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbManager = require('./dbmanager');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

const arrConnection = [];
let vCounterSocketServerIp = '';
const mapVcounter = new Map();


const addVCounterOperLog = async (name, ipaddress, empty_slots, in_count, out_count, cmd) => {
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

io.on('connection', (socket) => {
  console.log('client connected');
  console.log('socket id:', socket.id);
  console.log(socket);
  vCounterSocketServerIp = socket.client.conn.remoteAddress;
  const arrSocketId = mapVcounter.get(`${socket.client.conn.remoteAddress}`);
  if(arrSocketId) {
    let exist = false;
    for (const socketId of arrSocketId) {
      if(socketId === socket.id) {
        exist = true;
        break;
      }
    }
    if(exist === false) {
      arrSocketId.push(socket.id)
    }
  } else {
    mapVcounter.set(`${socket.client.conn.remoteAddress}`, [socket.id]);
  }
  for (const entry of mapVcounter) {
    console.log(entry);
  }

  socket.on('manageVCounter', (vCounter) => {
    if (vCounter && vCounter.cmd && vCounter.ipaddress && vCounter.port) {
      if (vCounter.cmd === 'add') {
        console.log(`${vCounter.ipaddress} 장비 추가 연결`);
        connectTcp(vCounter.ipaddress, vCounter.port);
      } else if (vCounter.cmd === 'remove') {
        console.log(`${vCounter.ipaddress} 장비 연결 해제`);
        // tcp socket destroy 처리
        socket.destroy();
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log('client disconnected:', socket.id);
    for (const vCounterIp of mapVcounter.keys()) {
      const arrSocketId = mapVcounter.get(vCounterIp);
      const filtered = arrSocketId.filter((value, index, arr) => {
        return value !== socket.id;
      });
      mapVcounter.set(vCounterIp, filtered);
    }

    for (const entry of mapVcounter) {
      console.log(entry);
    }
    // 접속된 모든 클라이언트 id 목록 구하기
    //const ids = await io.allSockets();
    //console.log('ids:', ids);
  });
});

const connectTcp = (ipaddress, port) => {
  console.log('vCounter 연결 요청: ', ipaddress, port)
   // vcounter가 1개일때, > 2개 이상일 경우
  console.log(`try connecting to VCounter ${ipaddress}`);
  let socket = net.connect({
      host: ipaddress,
      port: port
  });

  socket.on('connect', () => {
      console.log(`VCounter tcp socket connected(${ipaddress})`);
      arrConnection.push(socket);
  });

  socket.on('data', async (data) => {
      console.log(`buffer length: ${data.length}`); // length = 26
      const beforeVCounter = `SELECT * FROM ob_vcounter_count WHERE ipaddress='${socket.remoteAddress}'`;
      const isbeforeVCounter = await dbManager.pgQuery(beforeVCounter);
      if(isbeforeVCounter && isbeforeVCounter.rows && isbeforeVCounter.rows.length > 0){
        let query;
        let inQuery;
        let outQuery;
        if(isbeforeVCounter.rows[0].type === 'in'){
          inQuery = `UPDATE "ob_vcounter_count" SET empty_slots=empty_slots-1, in_count=in_count+1, updated_at=NOW()
                    WHERE ipaddress='${socket.remoteAddress}' AND empty_slots > 0 AND type='in'`
          outQuery = `UPDATE "ob_vcounter_count" SET empty_slots=empty_slots-1 updated_at=NOW() WHERE type='out' AND empty_slots > 0`
        } else if(isbeforeVCounter.rows[0].type === 'out'){
          inQuery = `UPDATE "ob_vcounter_count" SET empty_slots=empty_slots+1, updated_at=NOW() WHERE type='in'`
          outQuery = `UPDATE "ob_vcounter_count" SET empty_slots=empty_slots+1, out_count=out_count+1, updated_at=NOW()
                    WHERE ipaddress='${socket.remoteAddress}'`
        } else if(isbeforeVCounter.rows[0].type === 'in-out') {
          if (data.length === 26) {
            let inOrOut;
            const buffer = Buffer.from(data);
            const hexString = buffer.toString('hex');
            const binaryString = await hex2bin(hexString);
            const eventTrigger = binaryString.slice(124,128);
            if(eventTrigger && eventTrigger.length > 0){
              if(eventTrigger[0] === '1' || eventTrigger[3] === '1'){
                query = `UPDATE "ob_vcounter_count" SET empty_slots=empty_slots-1, in_count=in_count+1, updated_at=NOW()
                    WHERE ipaddress='${socket.remoteAddress}' AND empty_slots > 0`
                inOrOut = 'in';
              } else if(eventTrigger[1] === '1' || eventTrigger[2] === '1'){
                query = `UPDATE "ob_vcounter_count" SET empty_slots=empty_slots+1, out_count=out_count+1, updated_at=NOW()
                    WHERE ipaddress='${socket.remoteAddress}'`
                inOrOut = 'out';
              }
            }
            try {
              const res = await dbManager.pgQuery(query);
              if (res && res.rowCount > 0) {
                const vCountersQuery = `SELECT * FROM ob_vcounter_count WHERE ipaddress='${socket.remoteAddress}'`;
                const updateVCounter = await dbManager.pgQuery(vCountersQuery);
                if(updateVCounter && updateVCounter.rows && updateVCounter.rows.length > 0){
                  const { name, ipaddress, empty_slots, in_count, out_count } = updateVCounter.rows[0];
                  addVCounterOperLog(name, ipaddress, empty_slots, in_count, out_count, inOrOut === 'in'?'입차':'출차');
                  const arrWebsocketId = mapVcounter.get(vCounterSocketServerIp);
                  if(arrWebsocketId) {
                    for(const socketId of arrWebsocketId) {
                      io.to(socketId).emit('vCounterInfo', { updateVcounter: {
                        name,
                        ipaddress,
                        empty_slots,
                        in_count,
                        out_count
                      }});
                    }
                  }
                }
              }
              const resInQuery = inQuery && await dbManager.pgQuery(inQuery);
              if (resInQuery && resInQuery.rowCount > 0) {
                const vCountersInQuery = `SELECT * FROM ob_vcounter_count WHERE type='in`;
                const updateVCounter = await dbManager.pgQuery(vCountersInQuery);
                if(updateVCounter && updateVCounter.rows && updateVCounter.rows.length > 0){
                  const { name, ipaddress, empty_slots, in_count, out_count } = updateVCounter.rows[0];
                  addVCounterOperLog(name, ipaddress, empty_slots, in_count, out_count, '입차');
                  const arrWebsocketId = mapVcounter.get(vCounterSocketServerIp);
                  if(arrWebsocketId) {
                    for(const socketId of arrWebsocketId) {
                      io.to(socketId).emit('vCounterInfo', { updateVcounter: {
                        name,
                        ipaddress,
                        empty_slots,
                        in_count
                      }});
                    }
                  }
                }
              }
              const resOutQuery = outQuery && await dbManager.pgQuery(outQuery);
              if (resOutQuery && resOutQuery.rowCount > 0) {
                const vCountersOutQuery = `SELECT * FROM ob_vcounter_count WHERE type='out`;
                const updateVCounter = await dbManager.pgQuery(vCountersOutQuery);
                if(updateVCounter && updateVCounter.rows && updateVCounter.rows.length > 0){
                  const { name, ipaddress, empty_slots, in_count, out_count } = updateVCounter.rows[0];
                  addVCounterOperLog(name, ipaddress, empty_slots, in_count, out_count, '출차');
                  const arrWebsocketId = mapVcounter.get(vCounterSocketServerIp);
                  if(arrWebsocketId) {
                    for(const socketId of arrWebsocketId) {
                      io.to(socketId).emit('vCounterInfo', { updateVcounter: {
                        name,
                        ipaddress,
                        empty_slots,
                        out_count
                      }});
                    }
                  }
                }
              }
            } catch (err) {
              console.log('vcounter data received err: ', err)
            }
        }
      }
    }
  });

  socket.on('close', () => {
      console.log(`VCounter connection close(${ipaddress})`);

      setTimeout(() => {
        connectTcp(ipaddress, port);
      }, 5000);
  });

  socket.on('error', (err) => {
      console.log(`VCounter error(${ipaddress}) ${err.code}`);
  });
}

let isConnected = false;

const hex2bin = async (hex) => {
  hex = hex.replace("0x", "").toLowerCase();
  let out = "";
  for(var c of hex) {
      switch(c) {
          case '0': out += "0000"; break;
          case '1': out += "0001"; break;
          case '2': out += "0010"; break;
          case '3': out += "0011"; break;
          case '4': out += "0100"; break;
          case '5': out += "0101"; break;
          case '6': out += "0110"; break;
          case '7': out += "0111"; break;
          case '8': out += "1000"; break;
          case '9': out += "1001"; break;
          case 'a': out += "1010"; break;
          case 'b': out += "1011"; break;
          case 'c': out += "1100"; break;
          case 'd': out += "1101"; break;
          case 'e': out += "1110"; break;
          case 'f': out += "1111"; break;
          default: return "";
      }
  }
  return out;
}

const connectVCOUNTER = async () => {
  const isTableQuery = `SELECT EXISTS(
                    SELECT * FROM information_schema.tables 
                    WHERE
                      table_schema = 'public'
                      AND
                    TABLE_NAME = 'ob_vcounter_count'
                    );`
  const isTableRes = await dbManager.pgQuery(isTableQuery);
  const query = `SELECT * FROM ob_vcounter_count`;
  if(isTableRes && isTableRes.rows && isTableRes.rows.length > 0 && isTableRes.rows[0].exists){
    const res = await dbManager.pgQuery(query);
    if (res && res.rows && res.rows.length > 0) {
      res.rows.forEach((vCounter) => {
        connectTcp(vCounter.ipaddress, vCounter.port);
      });
      isConnected = true;
    }
  } else if(isConnected === false) {
    this.connectVCOUNTER();
  }
}

const stopVCounter = () => {
  arrConnection.forEach(socket => {
    socket.destroy();
  });
}

process.on('SIGUP', () => {
  console.log('Received: SIGUP');
  stopVCounter();
  process.exit(1);
});
process.on('SIGINT', () => {
  console.log('Received: SIGINT');
  stopVCounter();
  process.exit(1);
});
process.on('SIGQUIT', () => {
  console.log('Received: SIGQUIT');
  stopVCounter();
  process.exit(1);
});

connectVCOUNTER();

httpServer.listen(parseInt(process.env.PORT) + 2, process.env.WEBSOCKET_URL);
httpServer.on('listening', () => {
  console.log('server listening:', httpServer.address());
});
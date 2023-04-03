const { io } = require('socket.io-client');
const dbPolling = require('./dbPolling');

exports.connectEbellServer = () => {
  if (process.env.EBELL_DB_HOST === undefined) {
    console.log('비상벨 환경설정값이 없습니다. 비상벨 서버에 연결하지 않습니다. ');
    return;
  }
  
  const socket = io('http://'+process.env.EBELL_DB_HOST+':4100');
  socket.on('connect', (vSocket) => {
    console.log('ebellSocket Connected');
    dbPolling.readEbellEventDb();
  });

  socket.on('disconnect', () => {
    console.log('ebellSocket Disconnected');
  });

  socket.on('ebell', (data)=>{
    dbPolling.readEbellEventDb();
  });

  global.ebellWebsocket = socket;
  
}
const { io } = require('socket.io-client');

exports.connectBreathServer = () => {
  const socket = io('http://'+process.env.WEBSOCKET_URL+':'+(parseInt(process.env.PORT)+1));
  //const socket = io('http://192.168.10.24:4201');
  socket.on('connect', (vSocket) => {
    console.log('breathSocket Connected');
  });

  socket.on('disconnect', () => {
    console.log('breathSocket Disconnected');
  });

  global.breathwebsocket = socket;
}
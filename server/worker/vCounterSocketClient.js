const { io } = require('socket.io-client');

exports.connectVCounterServer = () => {
  const socket = io('http://'+process.env.WEBSOCKET_URL+':'+(parseInt(process.env.PORT)+2));
  socket.on('connect', () => {
    console.log('vCounterSocket Connected');
  });

  socket.on('disconnect', () => {
    console.log('vCounterSocket Disconnected');
  });
  global.vCounterwebsocket = socket;
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config({ path: path.join(__dirname, '.env')} );

var indexRouter = require('./routes/index');

var observerRouter = require('./routes/observerRouter');

const dbmanager = require('./db/dbManager');

// require('./worker/dbPolling').startDbPolling();
require('./worker/dbPolling').parkingRedZoneCheck();
// require('./worker/dbPolling').crowdDensityLogPolling();
// require('./worker/devicePolling').startDevicePolling();
// require('./worker/breathDataManage').ManageBreathLog();
// require('./worker/ebellSocketClient').connectEbellServer();
//타워램프 사용시 아래 내용 주석해제
// require('./worker/towerLampClient').connectTowerLamp();
// require('./worker/vCounterSocketClient').connectVCounterServer();

var app = express();

// db 접속
dbmanager.initMainDb();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//app.use(express.text());
//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/api/observer', observerRouter);
app.get('/*', (req, res, next) => {  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// process.on('SIGUP', ()=> {
//   console.log('Received: SIGUP');
//   respiration.disconnect();
//   process.exit(1);
// });
// process.on('SIGINT', ()=> {
//   console.log('Received: SIGINT');
//   respiration.disconnect();
//   process.exit(1);
// });
// process.on('SIGQUIT', ()=> {
//   console.log('Received: SIGQUIT');
//   respiration.disconnect();
//   process.exit(1);
// });

module.exports = app;

const Joi = require('joi');
const observerService = require('../services/observerService');

exports.login = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().min(1).max(50).required(),
    password: Joi.string().min(1).max(50).required()
  });

  try {
    const val_result = await schema.validate(req.body);

    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(412).send({ 
        err: {
          code: 1,
          message: val_result.error.message
        }
      });
      return;
    }

    const result = await observerService.login(req.body);
    if (result) {
      res.send({
        message: 'login success',
        result: {
          id: req.body.id,
          token: result,
          websocket_url: process.env.WEBSOCKET_URL + ':' + process.env.PORT,
          mapserver_url: process.env.MAP_SERVER_URL,
          map_type: process.env.MAP_TYPE
        }
      });
    } else {
      res.status(401).send({
        error: {
          code: 1,
          message: 'login fail'
        }
      });
    }    
  } catch (err) {
    console.log('login err:', err);
    res.status(400).send({
      error: {
        code: 5,
        message: err        
      }
    });    
  }
}

exports.logout = async (req, res, next) => {
  res.send({
    message: 'logout success'
  })
}

exports.checkSession = async (req, res, next) => {
  let token;
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    token = bearer[1];
  }  
  
  try {
    const result = await observerService.checkSession(token);
    res.send({ 
      result: result 
    });

  } catch (err) {
    res.status(400).send(err);
    return;
  }
}

exports.getWebsocketUrl = async (req, res, next) => {
  res.send({
    websocket_url: process.env.WEBSOCKET_URL + ':' + process.env.PORT,
    mapserver_url: process.env.MAP_SERVER_URL
  });
}


exports.getCameraListByInfo = async (req, res, next) => {
  const info = req.query;
  const schema = Joi.object({
      NVRID: Joi.string().min(1).max(2147483647).required(),
      NVRPW: Joi.string().required(),
      NVRIP: Joi.string().ip().required(),
      NVRPort: Joi.number().min(0).max(65535).required(),
    });

  try {
      const val_result = await schema.validate(info);

      if (val_result.error) {
          res.status(400).send(val_result.error);
          return;
      }

      let url = "http://" + info.NVRID + ":" + info.NVRPW + "@" + info.NVRIP + ":" + info.NVRPort + "/camera/list";

      info.url = url; 

      const result = await observerService.getCameraListByInfo(info);
      res.send({ result: result });
  } catch(error) {
      console.error('getCameraList err: ', error);
      res.status(500).send({ error });
  }
}

exports.getDbCameraList = async (req, res, next) => {
  let idx = req.query.idx;
  try {
      const result = await observerService.getDbCameraList(idx);
      res.send({ result: result.rows })
  } catch (error) {
      console.error('get cameraList error: ', error);
      res.status(500).send({ error });
  }
}

exports.getDbCameraLiveStream = async (req, res, next) => {
  let id = req.query.id;
  try {
      const result = await observerService.getDbCameraLiveStream(id);
      res.send({ 
          message: 'ok',
          result: result 
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
  }
}

exports.getBuilding = async (req, res, next) => {
  const limit = req.query.limit;
  const idx = req.query.idx;
  try {
      const result = await observerService.getBuilding(limit, idx);
      res.send({
        message: 'ok',
        result: result.rows 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.modifyBuilding = async (req, res, next) => {
  const name = req.body.name;
  const serviceType = req.body.service_type;
  const modifyName = req.body.modifyName
  try {
    const result = await observerService.modifyBuilding(name, serviceType, modifyName);
    res.send({
      message: 'ok',
      result: result
    })
  }
  catch (err) {
    console.log(err)
  }
}

exports.getFloor = async (req, res, next) => {
  const limit = req.query.limit;
  const idx = req.query.idx;
  try {
      const result = await observerService.getFloor(limit, idx);
      res.send({
        message: 'ok',
        result: result.rows 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.findFloor = async (req, res, next) => {
  const builidngIdx = req.query.buildingIdx;
  try{
    const result = await observerService.findFloor(builidngIdx);
    res.send({
      message: 'ok',
      result: result
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ error: error});
  }
}

exports.getDevice = async (req, res, next) => {
  const limit = req.query.limit;
  const id = req.query.id;
  const ipaddress = req.query.ipaddress;
  try {
      const result = await observerService.getDevice(limit, id, ipaddress);
      res.send({
        message: 'ok',
        result: result.rows 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.getCameraList = async (req, res, next) => {
  try {
      const result = await observerService.getDbCameraList();
      res.send({
        message: 'ok',
        result: result.rows 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.getPidsList = async (req, res, next) => {
  try {
      const result = await observerService.getDbPidsList();
      res.send({
        message: 'ok',
        result: result.rows 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.getVitalsensorList = async (req, res, next) => {
  try {
      const result = await observerService.getVitalsensorList();
      res.send({
        message: 'ok',
        result: result.rows 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.vitalsensorChangeUseStatus = async (req, res, next) => {
  let ipaddress = req.body.ipaddress;
  let status = req.body.status;
  try {
    const result = await observerService.vitalsensorChangeUseStatus(ipaddress, status);
    if(result.rowCount === 1){
      res.status(200).send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (error) {
    console.log(error);
  }
}

exports.setVitalValue = async (req, res, next) => {
  let { ipaddress, breathValue }= req.body;
  try {
    const result = await observerService.setVitalValue(ipaddress, breathValue);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (error) {
    console.log(error);
  }
}

exports.updateCamera = async (req, res, next) => {

  let id = req.body.id;
  let service_type = req.body.service_type;
  try {
    const result = await observerService.updateCamera(id, service_type);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (error) {
    console.log(error);
    
  }
}

exports.updateDoor = async (req, res, next) => {
  let id = req.body.id;
  let service_type = req.body.service_type;
  try {
    const result = await observerService.updateDoor(id, service_type);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.cameraForEbell = async (req, res, next) => {
  let id = req.body.id; 
  let cameraId = req.body.cameraId;
  let service_type = req.body.service_type;
  let type = req.body.type;
  
  try {
    const result = await observerService.cameraForEbell(id, cameraId, service_type, type);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.updateEbell = async (req, res, next) => {
  let ipaddress = req.body.ipaddress;
  try {
    const result = await observerService.updateEbell(ipaddress);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.removeVitalsensor = async (req, res, next) => {
  let idx = req.body.idx;
  let service_type = req.body.service_type;
  try {
    const result = await observerService.removeVitalsensor(idx, service_type);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.removePids = async (req, res, next) => {
  let id = req.body.id;

  try {
    const result = await observerService.removePids(id);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.cameraForDoor = async (req, res, next) => {
  let id = req.body.id; 
  let cameraId = req.body.cameraId;
  let service_type = req.body.service_type;
  
  console.log('cameraForDoor ==> ', id, cameraId, service_type);
  try {
    const result = await observerService.cameraForDoor(id, cameraId, service_type);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.cameraForVitalsensor = async (req, res, next) => {
  let id = req.body.id; 
  let cameraId = req.body.cameraId;
  let service_type = req.body.service_type;
  let type = req.body.type;
  
  console.log('cameraFor호흡센서 ==> ', id, cameraId, service_type, type);
  try {
    const result = await observerService.cameraForVitalsensor(id, cameraId, service_type, type);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.cameraForMdet = async (req, res, next) => {
  let idx = req.body.idx; 
  let cameraId = req.body.cameraId;
  let service_type = req.body.service_type;
  let type = req.body.type;
  
  try {
    const result = await observerService.cameraForMdet(idx, cameraId, service_type, type);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.getVitalLog = async (req, res, next) => {
  let ipaddress = req.query.ipaddress;
  try {
    const result = await observerService.getVitalLog(ipaddress);
    if(result && result.length > 0){
      res.send({
        message: 'ok',
        result: result
      });
    } else {
      res.send({
        message: 'fail',
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.getVitalLogData = async (req, res, next) => {
  const newStartTime = req.query.newStartTime;
  const newEndTime = req.query.newEndTime;
  const ipaddress = req.query.ipaddress;
  try {
    const result = await observerService.getVitalLogData(newStartTime, newEndTime, ipaddress);
    if(result && result.rows.length > 0){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.addVitalEvent = async (req, res, next) => {
  const ipaddress = req.body.ipaddress;
  const dataVal = req.body.dataVal;

  try {
    const result = await observerService.addVitalEvent(ipaddress, dataVal);
    if(result === true){
      res.send({
        message: 'ok',
        result: ''
      });
    } else {
      res.send({
        message: 'fail',
        result: ''
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.addNDoctorEvent = async (req, res, next) => {
  const ipaddress = req.body.ipaddress;
  const type = req.body.type;

  try {
    const result = await observerService.addNDoctorEvent(ipaddress, type);
    if(result === true){
      res.send({
        message: 'ok',
        result: ''
      });
    } else {
      res.send({
        message: 'fail',
        result: ''
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.doorControl = async (req, res, next) => {
  const acuId = req.body.acuId; 
  const acuIpaddress = req.body.acuIpaddress;
  const doorId = req.body.doorId;
  const command = req.body.command;
  const cmdSec = req.body.cmdSec;
  
  try {
    const result = await observerService.doorControl(acuId, acuIpaddress, doorId, command, cmdSec);
    if(result === true){
      res.send({
        message: 'ok',
        result: ''
      });
    } else {
      res.send({
        message: 'fail',
        result: ''
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.setVitalsensorSchedule = async (req, res, next) => {
  const addScheduleTime = req.body.addScheduleTime;

  try {
    const result = await observerService.setVitalsensorSchedule(addScheduleTime);
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.delSchedule = async (req, res, next) => {
  const delScheduleTimeGroupName = req.body.delScheduleTime;

  try {
    const result = await observerService.delSchedule(delScheduleTimeGroupName);
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.getScheduleTime = async (req, res, next) => {
  try {
    const result = await observerService.getScheduleTime();
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.getScheduleGroup = async (req, res, next) => {
  try {
    const result = await observerService.getScheduleGroup();
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.setScheduleGroup = async (req, res, next) => {
  const groupName = req.body.groupName;
  const groupTimeSchedule = req.body.groupTimeSchedule;

  try {
    const result = await observerService.setScheduleGroup(req.body);
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.setScheduleGroupApply = async (req, res, next) => {
  const groupName = req.body.groupName;
  // const groupTimeSchedule = req.body.groupTimeSchedule;
  const ipaddress = req.body.ipaddress;

  try {
    const result = await observerService.setScheduleGroupApply(req.body);
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.setGroupApplyToAll = async (req, res, next) => {
  const groupName = req.body.groupName;

  try {
    const result = await observerService.setGroupApplyToAll(req.body);
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

 
exports.setEachScheduleGroup = async (req, res, next) => {
  const groupName = req.body.groupName;
  const ipaddress = req.body.ipaddress;

  try {
    const result = await observerService.setEachScheduleGroup(req.body);
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.setEachVitalValue = async (req, res, next) => {
  let ipaddress = req.body.ipaddress;
  let breathValue = req.body.status;
  try {
    const result = await observerService.setEachVitalValue(req.body);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (error) {
    console.log(error);
  }
}

exports.getGuardianlite = async (req, res, next) => {
  try {
    const result = await observerService.getGuardianlite();
    if (result && result.rows) {
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.createGuardianlite = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    ipaddress: Joi.string().ip().required(),
    building_idx: Joi.number().min(0).max(2147483647).allow(''),
    building_service_type: Joi.string().min(1).max(100).allow(''),
    floor_idx: Joi.number().min(0).max(2147483647).allow(''),
    left_location: Joi.number().required(),
    top_location: Joi.number().required()
  });

  try {
    const val_result = await schema.validate(req.body);
    
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.createGuardianlite(req.body);
    if (result) {
      res.send({
        message: 'guardianlite created succesfully',
        result: []
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch(err) {
    console.error('create guardianlite err: ', err);
    res.status(500).send({ err });
  }
}

exports.deleteGuardianlite = async (req, res, next) => {
  const schema = Joi.object({
    idx: Joi.number().min(0).max(2147483647).required(),
    service_type: Joi.string().min(1).max(100).required()
  });

  try {
    const val_result = await schema.validate(req.body);
    
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.deleteGuardianlite(req.body);
    if (result) {
      res.send({
        message: 'guardianlite deleted succesfully',
        result: []
      });
    } else {
      res.send({
        message: 'fail',
        result: []
      });
    }
  } catch(err) {
    console.error('delete guardianlite err: ', err);
    res.status(500).send({ err });
  }
}

exports.setGuardianliteChannel = async (req, res, next) => {
  const schema = Joi.object({
    idx: Joi.number().min(1).max(2147483647).required(),
    ipaddress: Joi.string().min(1).max(30).required(),
    id: Joi.string().min(1).max(50).required(),
    password: Joi.string().min(1).max(50).required(),
    channel: Joi.number().min(1).max(8).required(),
    cmd: Joi.string().min(1).max(30).required(),
  });

  try {
    const val_result = await schema.validate(req.body.data);
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.setGuardianliteChannel(req.body.data);
    if (result) {
      res.send({
        message: 'guardianliteChannel set succesfully',
        result
      });
    } else {
      res.send({
        message: 'fail',
      });
    }
  } catch(err) {
    console.error('set guardianlite channel err: ', err);
    res.status(500).send({ err });
  }
}

exports.createPids = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().min(1).max(30).required(),
    name: Joi.string().min(1).max(30).required(),
    ipaddress: Joi.string().ip().required(),
    building_idx: Joi.number().min(0).max(2147483647).allow(''),
    building_service_type: Joi.string().min(1).max(100).allow(''),
    floor_idx: Joi.number().min(0).max(2147483647).allow(''),
    type: Joi.string().required(),
    left_location: Joi.number().required(),
    top_location: Joi.number().required(),
    location: Joi.string().required()
  });

  try {
    const val_result = await schema.validate(req.body);
    
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.createPids(req.body);
    if (result) {
      res.send({
        message: 'pids created succesfully',
        result: result
      });
    } else {
      res.send({
        message: 'fail',
        result: result
      });
    }
  } catch(err) {
    console.error('create pids err: ', err);
    res.status(500).send({ err});
  }
}

exports.removePidsGdp200 = async (req, res, next) => {
  let name = req.body.name;
  let ipaddress = req.body.ipaddress;

  try {
    const result = await observerService.removePidsGdp200(req.body);
    if(result.rowCount === 1){
      res.send({
        message: 'delete gdp200 ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.removePidsGdp = async (req, res, next) => {
  let name = req.body.name;
  let ipaddress = req.body.ipaddress;

  try {
    const result = await observerService.removePidsGdp(req.body);
    if(result.rowCount === 1){
      res.send({
        message: 'delete gdp200 ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.pidsZoneInterlock = async (req, res, next) => {
  let id = req.body.id;
  let left_location = req.body.left_location;
  let top_location = req.body.top_location;
  let line_x1 = req.body.line_x1;
  let line_x2 = req.body.line_x2;
  let line_y1 = req.body.line_y1;
  let line_y2 = req.body.line_y2;
  let floor_idx = req.body.floor_idx;
  let building_idx = req.body.building_idx;
  let service_type = req.body.service_type

  try {
    const result = await observerService.pidsZoneInterlock(req.body);
    if (result) {
      res.send({
        message: 'pids zone interlock succesfully',
        result: result
      });
    } else {
      res.send({
        message: 'fail',
        result: result
      });
    }
  } catch(err) {
    console.log(error);
    res.status(500).send({ error: error});
  }
}

exports.pidsEvent= async (req, res, next) => {
  // const schema = Joi.object({
  //   id: Joi.string().min(1).max(100).required(),
  //   status: Joi.number().min(0).max(2147483647).required()
  // });
  
  let arrParam;
  // mgist 에서 body 에 어떤 형식으로 데이터 보내주는지 디버깅 필요함
  // 우선 선별관제와 똑같이 코딩함
  if (Object.keys(req.body).length > 0) {
    arrParam = req.body.split('\n');
  } 
  let id = req.body;
  let status = 1;

  let deviceIp;
  let deviceId;
  let deviceName;
  let eventDatetime;
  // if (arrParam && arrParam.length >= 4) {
  //   deviceIp = arrParam[0];
  //   deviceId = arrParam[1];
  //   deviceName = arrParam[2];
  //   eventDatetime = arrParam[3];
  // }

  // console.log('controller : ', id, status);

  try {
    // const val_result = await schema.validate(req.body);
    
    // if (val_result.error) {
    //   console.log('data validation:', val_result.error);
    //   res.status(400).send({ error: val_result.error.message });
    //   return;
    // }

  // try {
    const result = await observerService.pidsEvent(id, status);
    if (result) {
      res.send({
        message: 'pids zone event occured',
        result: result
      });
    } else {
      res.send({
        message: 'fail',
        result: result
      });
    }
  } catch(err) {
    console.log(error);
    res.status(500).send({ error: error});
  }
}

exports.cameraForPids = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().min(1).max(100).required(),
    cameraId: Joi.string().allow(''),
    service_type: Joi.string().min(1).max(100).required()
  });

  try {
    const val_result = await schema.validate(req.body);
    
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }
    
    const result = await observerService.cameraForPids(req.body);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.error('setting camera for pids err: ', err);
  }
}

// getEvents REST API로 대체
// exports.getNodeAndHistory = async (req, res, next) => {
//   const ipaddress = req.query.ipaddress;
//   try {
//     const result = await observerService.getNodeAndHistory(ipaddress);
//     if( result.length > 0 ) {
//       res.send({
//         message: 'ok',
//         result: result
//       })
//     } else {
//       res.send({
//         message: 'no events',
//         result: [{}]
//       })
//     }
//   }
//   catch (err) {
//     console.log(err);
//     res.status(500).send({ error: error });
//   }
// }

exports.getEvents = async (req, res, next) => {
  const theStartDate = req.query.startDate;
  const theEndDate = req.query.endDate;
  const sort = req.query.sort;
  const deviceId = req.query.deviceId;
  const serviceType = req.query.serviceType;
  const limit = req.query.limit;
  const ipaddress = req.query.ipaddress;
  const noLimit = req.query.noLimit;

  try {
      const result = await observerService.getEvents(theStartDate, theEndDate, sort, deviceId, serviceType, limit, ipaddress, noLimit);
      res.send({ result: result.rows });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.getLastEvents = async (req, res, next) => {
  try {
    const result = await observerService.getLastEvents();
    res.send({ result: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.getInquiryEvents = async (req, res, next) => {
  const event_type = req.query.event_type;
  const severity = req.query.severity;
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;
  const acknowledge = req.query.acknowledge
  const service_type = req.query.service_type;
  const device_type = req.query.device_type;
  const ipaddress = req.query.ipaddress;
  const noLimit = req.query.noLimit;

  try {
    const result = await observerService.getInquiryEvents(event_type, severity, startDateTime, endDateTime, acknowledge, service_type, device_type, ipaddress, noLimit);
    res.send({ result: result.rows });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.getEventsForChart = async (req, res, next) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const deviceIp = req.query.deviceIp;

  try {
    const result = await observerService.getEventsForChart(startDate, endDate, deviceIp);
    res.send({ result: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.getBillboard = async (req, res, next) => {
  try {
    const result = await observerService.getBillboard();
    res.send({ result: result.rows });
  } catch(error) {
      console.log(error);
      res.state(500).send({ error: error});
  }
}

exports.removeBillboard = async (req, res, next) => {
  const eventIdx = req.query.idx;
  const serviceType = req.query.service_type;
  try {
    const result = await observerService.removeBillboard(eventIdx, serviceType);
    res.send({ result: result });
  } catch(error) {
      console.log(error);
      res.state(500).send({ error: error});
  }
}

exports.setAcknowledge = async (req, res, next) => {
  const idx = req.body.idx;
  const device_id = req.body.device_id;
  const device_type = req.body.device_type;
  const service_type = req.body.service_type;
  const acknowledgeUser = req.body.acknowledge_user;
  const ipaddress = req.body.ipaddress;
  const location = req.body.location;

  try {
      const result = await observerService.setAcknowledge(idx, service_type, acknowledgeUser, device_id, device_type, ipaddress, location);
      res.send({ result: result.rowCount });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.getMapImage = async (req, res, next) => {
  const limit = req.query.limit;
  console.log('limit-',limit);
  try {
      const result = await observerService.getMapImage(limit);
      res.send({
        message: 'ok',
        result: result 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.addLocation = async (req, res, next) => {

  const schema = Joi.object({
    id: Joi.string().required(),
    floorIdx: Joi.number().required(),
    buildingIdx: Joi.number().required(),
    buildingServiceType: Joi.string().required(),
    top_location:Joi.string().required(),
    left_location: Joi.string().required(),
    type: Joi.string(),
    ipaddress: Joi.string(),
    location: Joi.string(),
    schedule_status: Joi.string(),
    install_location: Joi.string(),
    });

  console.log('req,body ===> ',req.body)

  try {
    const val_result = await schema.validate(req.body);
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }
    const result = await observerService.addLocation(req.body);
    res.send({ result: result.rowCount });
  } catch(error) {
    console.error('addLocation: ', error);
    res.state(500).send({ error});
  }
}

// jjh - Gmap building 작업 검색
exports.addBuilding = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string(),
    left_location: Joi.number(),
    top_location: Joi.number(),
    service_type: Joi.string().required()
  });
  console.log('req.body = =',req.body)
  try {
    const val_result = await schema.validate(req.body);

    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(412).send({ 
        err: {
          code: 1,
          message: val_result.error.message
        }
      });
      return;
    }
    const result = await observerService.addBuilding(req.body);

    if(result){
      res.send({ result: result});
    }
  }
  catch (err) {
    console.error('addBuilding err: ', err);
    res.status(500).send({ err });
  }
}

exports.addFloor = async (req, res, next) => {
  const name = req.body.name;
  const buildingIdx = req.body.buildingIdx;
  const mapImage = req.body.mapImage;
  const service_type = req.body.service_type;

  console.log(name)
  console.log(buildingIdx)
  console.log(mapImage)

  try {
    const result = await observerService.addFloor(name, buildingIdx, mapImage, service_type);
    res.send({ 
      message: 'added floor successfully',
      result: result 
    });
  } 
  catch (err) {
    console.log(err);
  }
}

exports.removeBuilding = async (req, res, next) => {
  // const name = req.query.name;
  // const type = req.query.type
  // const service_type = req.query.service_type;
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string(),
    service_type: Joi.string().required()
  });
  try {
    const val_result = await schema.validate(req.body);
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }
    const result = await observerService.removeBuilding(req.body);
    if(result){
      res.send({
        message: 'ok',
        result: result.rows
      });
    }
  } catch (err) {    
    console.log('removeBuilding err: ', err);
  }
}

exports.modifyFloor = async (req, res, next) => {
  const name = req.body.name;
  const buildingIdx = req.body.buildingIdx;
  const serviceType = req.body.service_type;
  const modifyName = req.body.modifyName
  try {
    const result = await observerService.modifyFloor(name, buildingIdx, serviceType, modifyName);
    res.send({
      message: 'ok',
      result: result
    })
  }
  catch (err) {
    console.log(err)
  }
}

exports.removeFloor = async (req, res, next) => {
  const schema = Joi.object({
    floorName: Joi.string(),
    buildingIdx: Joi.string().required(),
    serviceType: Joi.string().required(),
    floorIdx: Joi.string().required()
  });
  try {
    const val_result = await schema.validate(req.body);
    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.removeFloor(req.body);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      })
    }
  }
  catch (err){
    console.error('removeFloor err: ', err);
  }
}

exports.selectEvent = async (req, res, next) => {
  const idx = req.query.idx;
  const serviceType = req.query.serviceType;
  try {
    const result = await observerService.selectEvent(idx, serviceType);
    res.send({ result: result.rows });
  } 
  catch (err) {
    console.log(err);
  }
}

exports.eventRecData = async (req, res, next) => {
  const idx = req.query.idx;
  const serviceType = req.query.serviceType;
  const cameraId = req.query.cameraId;
  const eventTime = req.query.eventStartTime;
  try {
    const response = await observerService.getArchiveStreamTokenUrl(idx, serviceType, cameraId, eventTime);
    const result = await observerService.eventRecData(response); 
    if(result){
      res.send({
        message: 'ok',
        result: result
      })
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.getSnapshot = async (req, res, next) => {
  let eventTime = req.query.eventTime;
  let eventIdx = req.query.eventIdx;
  let serviceType = req.query.serviceType;

  try {
      const result = await observerService.getSnapshot(eventTime, eventIdx, serviceType);
      if(result){
        res.send({ 
          message: 'ok',
          result: result
        });
      }
  } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
  }
}

exports.makeDownloadUrl = async (req, res, next) => {
  const serverUrl = req.query.serverUrl;
  console.log('serverUrl: ',serverUrl)
  const exportId = req.query.exportId;
  console.log('exportId: ', exportId)
  try {
    const result = await observerService.makeDownloadUrl(serverUrl, exportId);
    res.send({
      message: 'ok',
      result: result
    })
  } 
  catch (err) {
    console.log(err)
    res.status(500).send({ errCode: err, 
      message: "파일 생성이 실패했습니다."
    });
  }
}


exports.snapshotLocalPathSave = async (req, res, next) => {
  const url = req.query.url;
  const eventOccurrenceTime = req.query.eventOccurrenceTime;
  const camId = req.query.camId;
  const eventIdx = req.query.eventIdx;
  const serviceType = req.query.serviceType;

  try {
    const result = await observerService.snapshotLocalPathSave(url, eventOccurrenceTime, camId, eventIdx, serviceType);
    res.send({
      message: "save ok",
      result: result
    })
  }   
  catch (err) {
    console.log('snapshot save err:', err);
  }
}

exports.getSnapshotPath = async (req, res, next) => {
  const eventIdx = req.query.eventIdx;
  const serviceType = req.query.serviceType;
  try {
    const result = await observerService.getSnapshotPath(eventIdx, serviceType);
    res.send({
      message: "ok",
      result: result
    })
  }
  catch (err) {
    console.log(err);
  }
}

exports.delSnapshot = async (req, res, next) => {
  const idx = req.query.idx;
  const exportId = req.query.exportId;
  try {
    const result = await observerService.delSnapshot(idx, exportId);
    res.send({
      message: "del ok",
      result: result
    })
  }
  catch (err) {
    console.log('del snap err : ',err);
  }
}

exports.recognizePlate = async (req, res, next) => {

  // console.log('옵저버 콘트롤러에서 req.body 확인: ', req);
  let arrParam;
  // mgist 에서 body 에 어떤 형식으로 데이터 보내주는지 디버깅 필요함
  // 우선 선별관제와 똑같이 코딩함
  if (Object.keys(req.body).length > 0) {
    arrParam = req.body.split('\n');
  } 
  let deviceIp;
  let deviceId;
  let deviceName;
  let eventDatetime;
  if (arrParam && arrParam.length >= 4) {
    deviceIp = arrParam[0];
    deviceId = arrParam[1];
    deviceName = arrParam[2];
    eventDatetime = arrParam[3];
  }
  // const dateTime =  new Date();
  // const dateOjb = addHours(new Date(dateTime), -9);
  // const dateOjb2 = addSeconds(new Date(dateOjb), -1);
  // eventTime1 = format(dateOjb2, 'yyyyMMdd') + 'T' + format(dateOjb2, 'HHmmss');
  // eventTime2 = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');
  // console.log('옵저버 콘트롤러에서 eventTime 확인: ', eventTime1, eventTime2)

  try {
    const result = await observerService.recognizePlate(deviceIp, deviceId, deviceName, eventDatetime);
    if (result) {
      res.send({
        message: 'received data from ANPR camera successfully'
      });
    } else {
      res.send({
        message: 'fail'
      });
    }
  } catch(err) {
    console.log('콘트롤러 err: ', err);
    res.status(500).send({ error: err});
  }
}

exports.createVms = async (req, res, next) => {

  const schema = Joi.object({
    VMSIP: Joi.string().ip().required(),
    VMSPort: Joi.number().required(),
    VMSID: Joi.string().id(),
    VMSPW: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,12}$'))
  });

  try {
    const val_result = await schema.validate(req.body);
    
    if (val_result.error) {
      console.log('Create VMS validation Error:', val_result.error);
      res.status(400).send({ 
        error: val_result.error.message
      });
      return;
    }

    const result = await observerService.createVms(req.body);
    if (result) {
      res.send({
        message: 'VMS Info Inserted succesfully',
        result: result
      });
    } else {
      res.send({
        message: 'VMS Info Inserted fail',
        result: result
      });
    }
  } catch(err) {
    console.log(err);
    res.status(500).send({ err });
  }
}

exports.getVms = async (req, res, next) => {

  try {
    const result = await observerService.getVms();
    res.send({ result: result.rows });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.modifyVms = async (req, res, next) => {
  const { ipaddress, VMSIP, VMSPort, VMSID, VMSPW, syncCameraList } = req.body;
  try {
    const result = await observerService.modifyVms(ipaddress, VMSIP, VMSPort, VMSID, VMSPW, syncCameraList);
    res.send({ result: result.rowCount });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.deleteVms = async (req, res, next) => {
  const { ipaddress, syncCameraList } = req.body;
  try {
    const result = await observerService.deleteVms(ipaddress, syncCameraList);
    if (result) {
      res.send({
        message: 'VMS Info Deleted Succesfully',
        result: result.rowCount
      });
    } else {
      res.send({
        message: 'VMS Info Deleted fail',
        result: result
      });
    }
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }

}

exports.saveCameraFromVms = async (req, res, next) => {
  const ipaddress = req.body.ipaddress;
  const port = req.body.port;
  const id = req.body.id;
  const password = req.body.password;

  try {
    const result = await observerService.saveCameraFromVms(ipaddress, port, id, password);
    if (result) {
      res.send({
        message: "ok",
        result: result.rowCount
      });
    }
  }
  catch (err) {
    console.log('saveCameraFromVms err:', err);
  }
}

exports.getCarRecognition = async (req, res, next) => {

  const camera_id = req.query.cameraId;
  const type = req.query.type;
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;

  try {
    const result = await observerService.getCarRecognition(camera_id, type, startDateTime, endDateTime);
    if (result) {
      res.send({
        message: "ok",
        result: result.rows
      });
    }
  }
  catch (err) {
    console.log('getCarRecognition err:', err);
  }
}

exports.getCarNumber = async (req, res, next) => {

  const type = req.query.type;

  try {
    const result = await observerService.getCarNumber(type);
    if (result) {
      res.send({
        message: "ok",
        result: result.rows
      });
    }
  }
  catch (err) {
    console.log('saveCameraFromVms err:', err);
  }
}

exports.createCarNumber = async (req, res, next) => {
  const type = req.body.type;
  const number = req.body.number;
  const name = req.body.name;
  const description = req.body.description;

  try {
    const result = await observerService.createCarNumber(type, number, name, description);
    if (result) {
      res.send({
        message: "ok",
        result: result.rowCount
      });
    }
  }
  catch (err) {
    if(err === '23505'){
      res.status(409).send({
        error: err,
        message: "이미 등록된 차량번호 입니다."
      });
    }
    console.log('Create CarNumber err:', err);
  }
}

exports.removeCarNumber = async (req, res, next) => {
  const idx = req.query.idx;
  const type = req.query.type;

  try {
    const result = await observerService.removeCarNumber(idx, type);
    if (result) {
      res.send({
        message: "ok",
        result: result.rowCount
      });
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.getAccessControlLog = async (req, res, next) => {
  
  const LogStatus = req.query.status;
  const LogDoorID = req.query.doorId;
  const LogStartDate = req.query.startDate;
  const LogEndDate = req.query.endDate;
  const LogStartTime = req.query.startTime;
  const LogEndTime = req.query.endTime;
  const LogPersonID = req.query.personId;
  const LogPersonName = req.query.personName;
  const NoLimit = req.query.noLimit;

  try {
    const result = await observerService.getAccessControlLog(LogStatus, LogDoorID, LogStartDate, LogEndDate, LogStartTime, LogEndTime, LogPersonID, LogPersonName, NoLimit);
    if (result) {
      res.send({
        message: "ok",
        result: result.rows,
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(404).send({
      message: "fail",
      result: err
    });
  }
}

exports.reloadAccessControlPerson = async (req, res, next) => {  

  try {
    const result = await observerService.reloadAccessControlPerson();
    if (result) {
      res.send({
        message: "ok"
      });
    }
  }
  catch (err) {
    console.log(err);
    res.send({
      message: "fail"
    });
  }
}

exports.getEventTypes = async (req, res, next) => {

  const service_type = req.query.service_type;

  try {
    const result = await observerService.getEventTypes(service_type);
    if (result) {
      res.send({
        message: "ok",
        result: result
      });
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.modifyEventType = async (req, res, next) => {

  const idx = req.body.idx;
  const severity = req.body.severity;
  const unused = req.body.unused;
  const display = req.body.display;
  const popup = req.body.popup;
  const service_type = req.body.service_type

  try {
    const result = await observerService.modifyEventType(idx, severity, unused, display, popup, service_type);
    if (result) {
      res.send({
        message: "ok",
        result: result
      });
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.getSetting = async (req, res, next) => {

  const queryValue = req.query[0];

  try {
    const result = await observerService.getSetting(queryValue);
    if (result) {
      res.send({
        message: "ok",
        result: result.rows
      });
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.updateSetting = async (req, res, next) => {

  const { idx, name, setting_value } = req.body;
  try {
    const result = await observerService.updateSetting(idx, name, setting_value);
    res.send({ result: result.rowCount });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.accessEventRec = async (req, res, next) => {
  const deviceInfo = req.query.deviceInfo;
  const deviceType = req.query.deviceType;
  try {
      const queryRes = await observerService.accessEventRec(deviceInfo, deviceType);
      if (queryRes.rows && queryRes.rows.length > 0) {
        res.send({
          result: {
            idx: queryRes.rows[0].idx,
            serviceType: queryRes.rows[0].service_type,
            eventTypeName: queryRes.rows[0].event_type_name,
          }
        })
      } else {
        res.send({
          message: 'find not Event',
          result: null
        })
      }
  }
  catch (err) {
    console.log(err);
  }
}

// 보고서 REST API

exports.getReport = async (req, res, next) => {
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;
  const sort = req.query.sort;

  try {
      const result = await observerService.getReport(startDateTime, endDateTime, sort);
      res.send({ result: result.rows });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.reportDetailEvents = async (req, res, next) => {
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;
  const sort = req.query.sort;

  try {
      const result = await observerService.reportDetailEvents(startDateTime, endDateTime, sort);
      res.send({ result: result.rows });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.getDetailReport = async (req, res, next) => {
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;
  const service_type = req.query.service_type;
  const device_type = req.query.device_type;
  const sort = req.query.sort;

  try {
      const result = await observerService.getDetailReport(startDateTime, endDateTime, service_type, device_type, sort);
      res.send({ result: result.rows });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.setTowerlamp = async (req, res, next) => {
  const onOff = req.body.onoff;
  if (onOff !== 'on' && onOff !== 'off') {
    res.status(400).send({ error: 'wrong parameter'});
  }
  try {
    const result = await observerService.setTowerlamp(onOff);
    res.send({ result: onOff });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.setVitalThresholdCalc = async (req, res, next) => {
  const ipaddress = req.body.ipaddress;
  const start = req.body.start;
  const end = req.body.end;

  if (ipaddress === undefined || start === undefined) {
    res.status(400).send({ error: 'wrong parameter'});
    return;
  }
  try {
    const result = await observerService.setVitalThresholdCalc(ipaddress, start, end);
    res.send({ result: 'ok', threashold: result });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.detectFire = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')

  try {
    const result = await observerService.detectFire(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('detect fire from mgist is error: ', err);
  }
}

exports.detectSmoke = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')

  try {
    const result = await observerService.detectSmoke(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('detect smoke from mgist is error: ', err);
  }
}

exports.detectMotion = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')

  try {
    const result = await observerService.detectMotion(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('detect motion from mgist is error: ', err);
  }
}

exports.detectLoitering = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')

  try {
    const result = await observerService.detectLoitering(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('detect loitering from mgist is error: ', err);
  }
}

exports.detectLostObject = async (req, res, next) => {

  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')

  try {
    const result = await observerService.detectLostObject(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('lost object detected from mgist is error: ', err);
  }
}

exports.detectEnterArea = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')

  try {
    const result = await observerService.detectEnterArea(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('enter area from mgist is error: ', err);
  }
}

exports.detectFallDown = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')
  

  try {
    const result = await observerService.detectFallDown(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('detect fall down from mgist is error: ', err);
  }
}

exports.detectHandup = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const cameraIp = reqArray[0];
  const cameraId = reqArray[1];
  const cameraName = reqArray[2];
  const occurTime = reqArray[3];

  if(!cameraIp && !cameraId && !cameraName && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')
  

  try {
    const result = await observerService.detectHandup(cameraIp, cameraId, cameraName, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('hand up from mgist is error: ', err);
  }
}

exports.parkingControl = async (req, res, next) => {
  let camera_ip;
  if(req){
    camera_ip = req._remoteAddress;
    camera_ip = camera_ip.slice(camera_ip.lastIndexOf(':')+1);
    res.status(200).send();
  }
  try {
    const result = await observerService.parkingControl(req.body, camera_ip);
  } catch (err) {
    console.error('parkingControl controller err: ', err);
  }
}

exports.getParkingCamera = async (req, res, next) => {
  try {
    const result = await observerService.getParkingCamera();
    res.send({ result: result.rows })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.setParkingCamera = async (req, res, next) => {
  const { name, ipaddress } = req.body;
  try {
    const result = await observerService.setParkingCamera(name, ipaddress);
    if(result && result.rowCount > 0) {
      res.status(200).send({ status: 'success', result })
    } else {
      res.status(501).send({ status: 'failed', result})
    }
  } catch (error) {
    console.error('setParkingCamera error: ', error);
    res.status(500).send({ error: error });
  }
}

exports.deleteParkingCamera = async (req, res, next) => {
  const { ipaddress } = req.body;
  try {
    const result = await observerService.deleteParkingCamera(ipaddress);
    if(result && result.rowCount > 0) {
      res.status(200).send({ status: 'success', result })
    } else {
      res.status(501).send({ status: 'failed', result})
    }
  } catch (err) {
    console.error('delete parking camera fail err: ', err);
    res.status(500).send({ status: 'error', err });
  }
}

exports.getParkingCoords = async (req, res, next) => {
  const { camera_ip } = req.query;
  try {
    const result = await observerService.getParkingCoords(camera_ip);
    res.send({ result: result.rows })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.getParkingArea = async (req, res, next) => {
  const { camera_ip } = req.query;
  try {
    const result = await observerService.getParkingArea(camera_ip);
    res.send({ result: result.rows })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.getParkingSpace = async (req, res, next) => {
  const { camera_ip, parking_area } = req.query;
  try {
    const result = await observerService.getParkingSpace(camera_ip, parking_area);
    res.send({ result: result.rows })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.setParkingSpace = async (req, res, next) => {
  const { checkedItems, type } = req.body;
  try {
    const result = await observerService.setParkingSpace(checkedItems, type);
    if(result && result.rowCount > 0) {
      res.status(200).send({ status: 'success', result })
    } else {
      res.status(501).send({ status: 'failed', result})
    }
    return result;
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.removeParkingSpace = async (req, res, next) => {
  const { idx } = req.body;
  try {
    const result = await observerService.removeParkingSpace(idx);
    if(result && result.rowCount > 0) {
      res.status(200).send({ status: 'success', result })
    } else {
      res.status(501).send({ status: 'failed', result})
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

exports.getParkingDataLog = async (req, res, next) => {
  const { camera_ip, area, index_number, occupancy, type, startDateTime, endDateTime } = req.query;

  try {
    const result = await observerService.getParkingDataLog(camera_ip, area, index_number, occupancy, type, startDateTime, endDateTime);
    res.send({ result: result.rows });
  } catch(error) {
    console.log(error);
    res.status(500).send({ error: error});
  }
}
    
exports.addVCounter = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().min(1).max(30).required(),
    name: Joi.string().min(1).max(30).required(),
    ipaddress: Joi.string().ip().required(),
    port: Joi.number().min(0).max(65535).required(),
    building_idx: Joi.number().min(0).max(2147483647).allow(''),
    building_service_type: Joi.string().min(1).max(100).allow(''),
    floor_idx: Joi.number().min(0).max(2147483647).allow(''),
    type: Joi.string().required(),
    location: Joi.string().required(),
    install_type: Joi.string().required(),
  });

  try {
    const val_result = await schema.validate(req.body);

    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.addVCounter(req.body);
    if (result) {
      res.send({
        result: result
      });
    } else {
      res.send({
        message: 'fail',
        result: result
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ err });
  }
}

exports.updateVCounter = async (req, res, next) => {
  const schema = Joi.object({
    ipaddress: Joi.string().empty(),
    empty_slots: Joi.number().min(0).max(30000).required(),
    in_count: Joi.number().min(0).max(4294967295).required(),
    out_count: Joi.number().min(0).max(4294967295).required(),
    type: Joi.string().required()
  });

  try {
    const val_result = await schema.validate(req.body);

    if (val_result.error) {
      console.log('data validation:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.updateVCounter(req.body);
    if (result.rowCount > 0) {
      res.status(200).send({
        message: 'success',
        result: result
      });
    } else {
      res.status(501).send({
        message: 'fail',
        result: result
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ err });
  }
}

exports.getVCounterList = async (req, res, next) => {
  try {
      const result = await observerService.getVCounterList();
      res.send({
        message: 'ok',
        result: result.rows 
      });
  } catch(error) {
      console.log(error);
      res.status(500).send({ error: error});
  }
}

exports.removeVCounter = async (req, res, next) => {
  let id = req.body.id;
  let ipaddress = req.body.ipaddress;

  try {
    const result = await observerService.removeVCounter(id, ipaddress);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.getVCounterDataLog = async (req, res, next) => {
  const { name, ipaddress, cmd, startDateTime, endDateTime } = req.query;

  try {
    const result = await observerService.getVCounterDataLog(name, ipaddress, cmd, startDateTime, endDateTime);
    res.send({ result: result.rows });
  } catch(error) {
    console.error('get vCounter data log error: ', error);
    res.status(500).send({ error: error});
  }
}

exports.crowdDensityCount = async (req, res, next) => {
  const { name, ipaddress, cmd, startDateTime, endDateTime } = req.query;

  try {
    const result = await observerService.crowdDensityCount(name, ipaddress, cmd, startDateTime, endDateTime);
    // res.send({ result: result.rows });
  } catch(error) {
    console.log(error);
    res.status(500).send({ error: error});
  }
}

exports.crowdDensityCountLog = async (req, res, next) => {

  try {
    const result = await observerService.crowdDensityCountLog();
    res.send({ result: result });
  } catch(error) {
    console.log(error);
    res.status(500).send({ error: error});
  }
}

exports.getCrowdDensityCamera = async (req, res, next) => {
  try {
    const result = await observerService.getCrowdDensityCamera();
    if(result && result.rows){
      res.status(200).send({ result: result.rows });
    } else if(result) {
      res.status(501).send({ result: result.rows });
    }
  } catch(error) {
    console.error('get crowd density camera list error: ', error);
    res.status(500).send({ error: error});
  }
}


exports.addCrowdDensityCamera = async (req, res, next) => {
  const schema = Joi.object({
    ipaddress: Joi.string().ip().required(),
    name: Joi.string().min(1).max(50).required(),
    id: Joi.string().min(1).max(30).required(),
    camera_id: Joi.string().min(1).max(30).required(),
    rtsp_port: Joi.number().min(0).max(65535).required(),
  });

  try {
    const val_result = await schema.validate(req.body);

    if (val_result.error) {
      console.error('add crowd density camera client data validation err:', val_result.error);
      res.status(400).send({ error: val_result.error.message });
      return;
    }

    const result = await observerService.addCrowdDensityCamera(req.body);
    if(result && result.rowCount === 1) {
      res.status(200).send({
        message: 'success',
        result
      })
    } else if(result) {
      res.status(501).send({
        message: 'fail',
        result
      })
    }
  } catch (err) {
    console.error('add crowd density camera err: ', err );
    res.status(500).send({ err });
  }
}

exports.updateCrowdDensityThreshold = async (req, res) => {

  const { idx, threshold } = req.body;
  try {
    if(idx && threshold){
      const result = observerService.updateCrowdDensityThreshold(idx, threshold)
      if(result && result.rowCount === 1){
        res.status(200).send({
          status: 'success',
          message: 'update crowd density camera threshold success'
        })
      }
    } else {
      res.status(400).send({
        status: 'fail',
        message: 'input value empty'
      })
    }
  } catch (err) {
    console.error('')
    throw err;
  }
}

exports.removeMdet = async (req, res, next) => {
  let idx = req.body.idx;
  let ipaddress = req.body.ipaddress;

  try {
    const result = await observerService.removeMdet(idx, ipaddress);
    if(result.rowCount === 1){
      res.send({
        message: 'ok',
        result: result.rows
      });
    } else {
      res.send({
        message: 'fail',
        result: result.rows
      });
    }
  } catch (err) {
    console.log(err)
  }
}

exports.detectMetal = async (req, res, next) => {
  const reqArray = req.body.split('\n');
  const mdetIp = reqArray[0];
  const occurTime = reqArray[1];

  if(!mdetIp && !occurTime){
    return;
  }

  const updateOccurTime = occurTime && occurTime.split('.')

  try {
    const result = await observerService.detectMetal(mdetIp, updateOccurTime[0]);
    return result;
  } catch (err) {
    console.error('detect fire from mgist is error: ', err);
  }
}
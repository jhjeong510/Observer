import AddIconToMap from "../handlers/AddIconToCanvasHandler";
import {API, AuthAPI} from "./axiosProvider";

// axios instance data 필드
// axios.post(url[, data[, config]])
// axios.put(url[, data[, config]])
// axios.patch(url[, data[, config]])

// post, put, patch => AuthAPI

/////////////////////////////// get ///////////////////////////////
export const readEvents = async (sort, noLimit) => {
	const route = 'events';
	if(!sort){
		sort = '최신';
	}
	try {
		const res = await API.get(route, {
			params: {
				sort,
				noLimit
			}
		});
		if (res.data && res.data.result && res.data.result.length > 0) {
			return {
				eventList: res.data.result
			}
		}
		console.log('App get events res:', res);
	} catch (err) {
		console.log('App get event err:', err);
	}
}

export const addCrowdDensityCamera = async (props) => {
	const route = 'crowdDensityCamera';
	try {
		return await AuthAPI.post(route, props);
	} catch(err) {
		console.error('add crowd density camera API err: ', err);
	}
}

export const getCrowdDensityCamera = async () => {
	const route = 'crowdDensityCamera';
	try {
		return await API.get(route);
	} catch (err) {
		console.error('get crowd density camera list err: ', err);
	}
}

export const getCrowdDensityData = async () => {
	const route = 'crowdDensityCount'
	try {
		return await AuthAPI.get(route);
	} catch(err) {
		console.error('get crowdDensityCount api err: ', err);
	}
}

// export const getCrowdDensityCountingLog = async (selectedCameraId) => {
// 	const route = 'crowdDensityCountLog'
// 	try {
// 		const res = await AuthAPI.get(route, {
// 			params: {
// 				selectedCameraId
// 			}
// 		});
// 		if (res.data && res.data.result && res.data.result.length > 0) {
// 			return res
// 		}
// 	} catch (err) {
// 		console.error('get crowdDensityCount api err: ', err);
// 	}
// }
export const getCrowdDensityCountingLog = async () => {
	const route = 'crowdDensityCountLog'
	try {
		const res = await AuthAPI.get(route);
		if (res.data && res.data.result && res.data.result.length > 0) {
			return res
		}
	} catch (err) {
		console.error('get crowdDensityCount api err: ', err);
	}
}

export const updateCrowdDensityThreshold = async (props) => {
	const route = 'crowdDensityThreshold';
	try {
		return await AuthAPI.put(route, props);
	} catch(err) {
		console.error('update crowd density thres hold API err: ', err);
		throw err;
	}
}

export const getEventsList = async (service_type, noLimit, startDateTime, endDateTime, acknowledge) => {
	const route = 'inquiryEvent';
	try {
		const res = await API.get(route, {
			params: {
				service_type,
				noLimit,
				startDateTime,
				endDateTime,
				acknowledge
			}
		});
		if (res.data && res.data.result && res.data.result.length > 0) {
			return {
				eventList: res.data.result
			}
		}
	} catch (err) {
		console.error('get realtime eventList err:', err);
	}
}

export const getInquiryEvents = async (eventType, severity, startDateTime, endDateTime, acknowledge, service_type, device_type, ipaddress, noLimit) => {
	const route = 'inquiryEvent';
	try {
		return await API.get(route, {
			params: {
				event_type: eventType,
				severity,
				startDateTime,
				endDateTime,
				acknowledge,
				service_type,
				device_type,
				ipaddress,
				noLimit: noLimit
			}
		})
	} catch (err) {
		console.log('get inquiry events err: ', err);
	}
}

export const getAccessCtl = async (status, doorId, startDate, endDate, startTime, endTime, personId, personName, noLimit) => {
	const route = 'accesscontrollog';
	try {
		return await API.get(route, {
			params: {
				status,
				doorId,
				startDate,
				endDate,
				startTime,
				endTime,
				personId,
				personName,
				noLimit
			}
		})
	} catch(err) {
		console.log('getAccessCtl API err: ', err);
	}
}

export const accessEventRec = async (deviceInfo, deviceType) => {
	const route = 'accessEventRec';
	try {
		const res = await API.get(route, {
			params: {deviceInfo, deviceType}
		});
		return res
	} catch(err) {
		console.log(err)
	}
}

export const getEventDbInfo = async (eventDetail) => {
	const router = 'selectEvent';
	try {
		const res = await API.get(router, {
			params: {
				idx: eventDetail.eventIdx,
				serviceType: eventDetail.serviceType
			}
		})
		if (res.data && res.data.result && res.data.result.length > 0) {
			return res.data.result[0];
		}
	} catch (err) {
		console.log(err)
	}
}

export const handleGetSettings = async (queryValue) => {
	const router = 'setting';
	try {
		const res = await API.get(router, {
			params: queryValue
		})
		if(res && res.data && res.data.result && res.data.result.length > 0) {
			return res.data.result;
		}
	} catch(err) {
		console.log('Read Observer Settings ERR: ', err);
	}
}

export const getDefaultReport = async (startDateTime, endDateTime, sort) => {
	const route = 'defaultReport';
	try {
		return await API.get(route, {
			params: {
				startDateTime,
				endDateTime,
				sort
			}
		})
	} catch (err) {
		console.log('get default report API err: ', err);
	}
}

export const getReportEventDetail = async (startDateTime, endDateTime) => {
	const route = 'reportDetailEvents';
	try {
		return await API.get(route, {
			params: {
				startDateTime,
				endDateTime,
			}
		})
	} catch (err) {
		console.log('get default report event detail API err: ', err);
	}
}


/////////////////////////////// post ///////////////////////////////
export const addBuilding = async (props) => {
	const route = 'addBuilding';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const addFloor = async (props) => {
	const route = 'addFloor';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const handleLockDoor = async (props) => {
	const route = 'doorcontrol';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const addGuardianlite = async (props) => {
	const route = 'guardianlite';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}


export const addGdp2000 = async (props) => {
	const route = 'pids';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const addVCounter = async (props) => {
	const route = 'vCounter';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const updateVCounter = async (props) => {
	const route = 'vCounter';
	try {
		return await AuthAPI.put(route, props);
	} catch(err) {
		console.log('updateVCounter api: ',err);
	}
}

export const unlock10sDoor = async (props) => {
	const route = 'doorcontrol';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const unlockDoor = async (props) => {
	const route = 'doorcontrol';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const lockDoor = async (props) => {
	const route = 'doorcontrol';
	try {
		const res = await AuthAPI.post(route, props);
	} catch(err) {
		console.log(err)
	}
}

/////////////////////////////// delete ///////////////////////////////
export const removeBuilding = async (props) => {
	const route = 'building'; 
	return await AuthAPI.post(route, props);
}

export const removeFloor = async (props) => {
	const route = 'floor'; 
	return await AuthAPI.post(route, props);
}

export const removeGuardianlite = async (props) => {
	const route = 'guardianlite';
	const { idx, service_type } = props;
	try {
		const res = await AuthAPI.delete(route, {
			data: {
				idx,
				service_type
			}
		});
	} catch(err) {
		console.log(err)
	}
}

export const removeFence = async (props) => {
	const route = 'pids';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const removeSpace = async (props) => {
	const route = 'parkingspace';
	const { idx } = props;
	try {
		return await AuthAPI.delete(route, {
			data: {
				idx
			}
		});
	} catch(err) {
		console.log('removeSpace api err: ', err);
	}
}


////////////////////////////// put ///////////////////////////////////
export const modifyBuilding = async (props) => {
	const route = 'building'; 
	return await AuthAPI.put(route, props);
}

export const addCamera = async (props) => {
	const route = 'addLocation'; // type === 'camera'
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const addEbell = async (props) => {
	const route = 'addLocation'; 
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const addDoor = async (props) => {
	const route = 'addLocation';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const addVitalsensor = async (props) => {
	const route = 'addLocation';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const addMdet = async (props) => {
	const route = 'addLocation';
	try {
		return await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}


export const addVCounterToMap = async (props) => {
	const route = 'addLocation';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const setAcknowledge = async (props) => {
	const route = 'acknowledge';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const setAcknowledgeDetailEvent = async (idx, service_type, userId) => {
	const router = 'acknowledge';
	try {
		const res = await AuthAPI.put(router, {
			idx,
			service_type,
			acknowledge_user: userId
		});
	} catch (err) {
		console.log('leftbar get device err:', err);
	}
}

export const removeEbell = async (props) => {
	const router = 'ebell';
	try {
		const res = await AuthAPI.put(router, props);
	} catch (err) {
		console.log('leftbar get device err:', err);
	}
}

export const removeCamera = async (props) => {
	const router = 'camera';
	try {
		const res = await AuthAPI.put(router, props);
	} catch (err) {
		console.log('leftbar get device err:', err);
	}
}

export const removeDoor = async (props) => {
	const router = 'door';
	try {
		const res = await AuthAPI.put(router, props);
	} catch (err) {
		console.log('leftbar get device err:', err);
	}
}

export const removeVitalsensor = async (props) => {
	const router = 'vitalsensor';
	try {
		const res = await AuthAPI.put(router, props);
	} catch (err) {
		console.log('leftbar get device err:', err);
	}
}

export const handleUpdateSettings = async (idx, name, setting_value) => {
	const router = 'setting';
	try {
		const result = await AuthAPI.put(router, {
			idx,
			name,
			setting_value
		})
		if(result && result.data && result.data.result > 0) {
			const settings = await handleGetSettings();
			return settings;
		}
	} catch (err) {
		console.log('Handle Observer Setting Value Func Err: ', err);
	}
}

export const addFence = async (props) => {
	const route = 'pidsZone';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const setScheduleGroup = async (props) => {
	const route = 'setEachScheduleGroup';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const ebellInterlockCamera = async (props) => {
	const route = 'cameraForEbell';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}
export const doorInterlockCamera = async (props) => {
	const route = 'cameraForDoor';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}
export const vitalsensorInterlockCamera= async (props) => {
	const route = 'cameraForVitalsensor';
	const cameraId = props.cameraId;
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}
export const pidsInterlockCamera = async (props) => {
	const route = 'cameraForPids';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}
export const vCounterInterlockCamera = async (props) => {
	const route = 'cameraForVCounter';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const mDetInterlockCamera = async (props) => {
	const route = 'cameraForMdet';
	try {
		return await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}


export const readBuildingList = async () => {
	const router = 'building';
	try {
		const resBuilding = await AuthAPI.get(router);
		if (resBuilding && resBuilding.data && resBuilding.data.result) {
			return resBuilding.data.result;
		} else {
			console.log('readBuildingList - No Error but No Result:', resBuilding);
		}
	} catch(err) {
		console.log('readBuildingList API Error', err);
	}
}

export const readFloorList = async () => {
	const router = 'floor';
	try {
		const resFloor = await AuthAPI.get(router);
		if (resFloor && resFloor.data && resFloor.data.result) {
			const sortFloor = [...resFloor.data.result].sort((a, b) => a.name > b.name ? 1 : -1);
			return sortFloor;
		} else {
			console.log('readFloorList - No Error but No Result:', resFloor);
		}
	} catch(err) {
		console.log('readFloorList Error', err);
	}
}

export const readMapImage = async () => {
	const router = 'mapimage';
	try {
		const res = await AuthAPI.get(router);
		if(res && res.data && res.data.result) {
			return res.data.result;
		}
	} catch (err) {
			console.log(err)
	}
}

export const readCameraList = async () => {
	const router = 'camera';
	try {
		const resCamera = await AuthAPI.get(router);
		if (resCamera && resCamera.data && resCamera.data.result) {
			return resCamera.data.result;
		} else {
			console.log('readCameraList - No Error but No Result:', resCamera);
		}
	} catch(err) {
		console.log('readCameraList Error', err);
	}
}

export const readDeviceList = async () => {
	const router = 'device';
	try {
		const resDevice = await AuthAPI.get(router);
		if (resDevice && resDevice.data && resDevice.data.result) {
			const sortDevice = [...resDevice.data.result].sort((a, b) => a.id > b.id ? 1 : -1);
			return resDevice.data.result;
		} else {
			console.log('readDeviceList - No Error but No Result:', resDevice);
		}
	} catch(err) {
		console.log('readDeviceList Error', err);
	}
}

export const readPidsList = async () => {
	const router = 'pids';
	try {
		const resPids = await AuthAPI.get(router);
		if (resPids && resPids.data && resPids.data.result) {
			return resPids.data.result;
		} else {
			console.log('readPidsList - No Error but No Result:', resPids);
		}
	} catch(err) {
		console.log('readPidsList Error', err);
	}
}

export const readVCounterList = async () => {
	const router = 'vCounter';
	try {
		const resVCounter = await AuthAPI.get(router);
		if (resVCounter && resVCounter.data && resVCounter.data.result) {
			return resVCounter.data.result;
		} else {
			console.log('readVCounterList - No Error but No Result:', resVCounter);
		}
	} catch(err) {
		console.log('readVCounterList Error', err);
	}
}

export const controlVitalsensor = async (props) => {
	const route = 'vitalsensorStatus';
	try {
		const res = await AuthAPI.put(route, props);
		if (res.status === 200) {
			return {
				result: 'success',
			}
		} else {
			return { 
				result: 'fail'
			}
		}
	} catch(err) {
		console.log('vitalsensor status change error: ',err);
	}
}

export const removePids = async (props) => {
	const route = 'pidsGdp200';
	try {
		const res = await AuthAPI.put(route, props);
		if (res) {
			return res;
		}
	} catch(err) {
		console.log(err)
	}
}

export const removeVCounter = async (props) => {
	const route = 'vCounter';
	try {
		const res = await AuthAPI.put(route, props);
		if (res) {
			return res;
		}
	} catch(err) {
		console.log(err)
	}
}

export const removeMdet = async (props) => {
	const route = 'mdet';
	try {
		const res = await AuthAPI.put(route, props);
		if (res) {
			return res;
		}
	} catch(err) {
		console.log(err)
	}
}

export const removePidsList = async (props) => {
	const route = 'removePidsGdp200';
	try {
		const res = await AuthAPI.put(route, props);
	} catch(err) {
		console.log(err)
	}
}

export const getVitalLog = async (ipaddress) => {
	const route = 'getVitalLog';
	try {
		const res = await AuthAPI.get(route, {
			params: {
				ipaddress
			}
		});
		return res;
		
	} catch(err) {
		console.log(err)
	}
}

export const setVitalValueFunc = async (ipaddress, breathValue) => {
	const route = 'vitalValue';
	try {
		const res = await AuthAPI.put(route, {
			ipaddress,
			breathValue
		});
		return res;
	} catch(err) {
		console.log('setBreathValue Error: ', err);
	}
}

export const getGuardianlites = async () => {
	const route = 'guardianlite';
	try {
		const res = await API.get(route);
		if (res && res.data && res.data.message === 'ok') {
			return res.data.result;
		} else {
			console.log('readGuardianliteList - No Error but No Result:', res);
		}
	} catch(err) {
		console.log('readGuardianliteList Error', err);
	}
}

export const setGuardianliteChannel = async (idx, ipaddress, id, password, channel, cmd) => {
	const route = 'guardianlitechannel';
	try {
		const res = await AuthAPI.put(route, {
			data: {
				idx,
				ipaddress,
				id,
				password,
				channel,
				cmd
			}
		})
		if(res) {
			return res;
		}
	} catch (err) {
		console.log('handleGuardianliteSetBtn', err);
		throw err;
 	}
}

export const getParkingCamera = async () => {
	const route = 'parkingCamera'
	try {
		return await AuthAPI.get(route);
	} catch(err) {
		console.error('getParkingCamera api err: ', err);
	}
}

export const setParkingCamera = async (req) => {
	const route = 'parkingCamera'
	try {
		return await AuthAPI.patch(route, req);
	} catch(err) {
		console.error('setParkingCamera(name) api err: ', err);
	}
}

export const removeParkingCamera = async (props) => {
	const route = 'parkingCamera'
	const { ipaddress } = props;
	try {
		return await AuthAPI.delete(route, {
			data: {
				ipaddress
			}
		});
	} catch(err) {
		console.error('removeParkingCamera API err: ', err);
	}
}

export const getParkingCoords = async (camera_ip) => {
	const route = 'parkingCoords';
	try {
		return await AuthAPI.get(route, {
			params: {
				camera_ip
			}
		});
	} catch (err) {
		console.log('get parking Coords err: ',err)
	}
}

export const getParkingArea = async (camera_ip) => {
	const route = 'parkingArea';
	try {
		return await AuthAPI.get(route, {
			params: {
				camera_ip
			}
		});
	} catch(err) {
		console.log('get parking area err: ', err);
	}
}

export const getParkingSpace = async (camera_ip, parking_area) => {
	const route = 'parkingspace';
	try {
		return await AuthAPI.get(route, {
			params: {
				camera_ip,
				parking_area
			}
		});
	} catch(err) {
		console.log('get parking space err: ', err);
	}
}

export const setParkingSpace = async (props) => {
	const route = 'parkingspace';
	try {
		return await AuthAPI.put(route, props);
	} catch(err) {
		console.log('set parking space type err: ', err);
	}
}

export const getParkingDataLog = async (camera_ip, area, index_number, occupancy, type, startDateTime, endDateTime) => {
	const route = 'parkingDataLog';
	try {
		return await AuthAPI.get(route, {
			params: {
				camera_ip,
				area,
				index_number,
				occupancy,
				type,
				startDateTime,
				endDateTime
			}
		});
	} catch(err) {
		console.log('get parking Data log API Err: ', err);
	}
}

export const getVCounters = async () => {
	const route = 'vCounter';
	try {
		return await AuthAPI.get(route);
	} catch(err) {
		console.log('getVcounters func err: ', err);
	}
}

export const getVCounterDataLogs = async (cmd, startDateTime, endDateTime) => {
	const route = 'vCounterDataLog';
	try {
		return await AuthAPI.get(route, {
			params: {
				cmd,
				startDateTime,
				endDateTime
			}
		});
	} catch(err) {
		console.log('getVcounter Data logs API Err: ', err);
	}
}

export const getSnapShot = async (cameraId) => {
	const route = 'getSnapshot';
	try {
		return await API.get(route, {
			params: {
				cameraId
			}
		})
	} catch(err) {
		console.error('get snapshot API err: ', err);
	}
}

export const makeDownloadUrl = async (serverUrl, exportId) => {
	const route = 'makeDownloadUrl';
	try {
		return await API.get(route, {
			params: {
				serverUrl,
				exportId
			}
		})
	} catch(err) {
		console.error('make download snapshot url err : ', err);
	}
}


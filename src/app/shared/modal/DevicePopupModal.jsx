import React, { useEffect, useState, useRef } from 'react';
import styles from './DevicePopUpModal.module.css';
import noCamera from '../../../assets/images/without_camera.png';
import { Line } from 'react-chartjs-2';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function DevicePopupModal({
  deviceInfo: {
    eventName,
    popUpType,
    position,
    clientHeight,
    clientWidth,
    deviceId,
    cameraId,
    deviceName,
    cameraName,
    ipaddress,
    buildingName,
    floorName,
    location,
    type,
    serviceType,
    indication_line,
    guardianliteInfo
  },
  handleCloseDevicePopup,
  handleCloseDeviceEventPopup,
  socketClient,
  handleDisconnectLiveStream,
  handleDisconnectLiveEventStream,
  liveStream,
  liveEventStream,
  handleSetLiveStream,
  handleSetLiveEventStream,
  deviceList,
  cameraList,
  breathData,
  breathSocketClient,
  dataArr,
  handleUpdateGuardianliteStatus,
  event
}) {
  const [receivedData, setReceivedData] = useState('');
  const [receivedCamera, setReceivedCamera] = useState('');
  const [noLiveStream, setNoLiveStream] = useState(false);
  const [withCamera, setWithCamera] = useState(event ? true : false);
  const [failStream, setFailStream] = useState(false);
  const [guardianliteInfoDetail, setGuardianliteInfoDetail] = useState(guardianliteInfo);
  const isMountedRef = useRef(null);
  const prevBreathData = usePrevious(breathData);
  const [targetBreathData, setTargetBreathData] = useState(undefined);

  useEffect(() => {
    if (ipaddress === (breathData && breathData.ipaddress)) {
      setTargetBreathData(breathData.respiration);
    } else {
      prevBreathData && setTargetBreathData(prevBreathData.respiration);
    }
  }, [breathData])

  const handleLiveStream = async () => {
    let isEmptySocket = true;
    if (failStream) {
      await setFailStream(false)
    }
    setTimeout(() => {
      receivedData === '' && isMountedRef && isMountedRef.current && setFailStream(true);
    }, 15000);
    const socket = socketClient;
    if (socket && cameraId) {
      if (liveStream && liveStream.received && liveStream.cameraId) {
        if (parseInt(liveStream.cameraId) !== parseInt(cameraId)) {
          isEmptySocket = false;
          const isDisconnected = await handleDisconnectLiveStream();
          isEmptySocket = isDisconnected;
        }
      }
      if (isEmptySocket && !liveEventStream || (liveEventStream && (liveEventStream.received && ((liveEventStream.cameraId && liveEventStream.cameraId) !== cameraId)))) {
        isMountedRef.current && await setReceivedCamera(cameraId);
        await socket.emit('cameraStream', {
          cameraId,
          cmd: 'on'
        });
        await socket.on('cameraStream', (received) => {
          if (received && received.cameraId === cameraId) {
            isMountedRef.current && setReceivedData(received.data);
          }
        })
      } else if (liveEventStream && (liveEventStream.received && ((liveEventStream.cameraId && liveEventStream.cameraId) === cameraId))) {
        await socket.on('cameraStream', (received) => {
          if (received && received.cameraId === cameraId) {
            isMountedRef.current && setReceivedData(received.data);
          }
        })
      }
    }
  }

  const handleLiveEventStream = async () => {
    let isEmptySocket = true;
    if (failStream) {
      await setFailStream(false)
    }
    setTimeout(() => {
      receivedData === '' && isMountedRef && isMountedRef.current && setFailStream(true);
    }, 15000);
    const socket = socketClient;
    if (socket && cameraId) {
      if (liveEventStream && liveEventStream.received && liveEventStream.cameraId) {
        if (parseInt(liveEventStream.cameraId) !== parseInt(cameraId)) {
          isEmptySocket = false;
          const isDisconnected = await handleDisconnectLiveEventStream();
          isEmptySocket = isDisconnected;
        }
      }
      if (isEmptySocket && !liveStream || (liveStream && (liveStream.received && ((liveStream.cameraId && liveStream.cameraId) !== cameraId)))) {
        isMountedRef.current && await setReceivedCamera(cameraId);
        await socket.emit('cameraStream', {
          cameraId,
          cmd: 'on'
        });
        await socket.on('cameraStream', (received) => {
          if (received && received.cameraId === cameraId) {
            isMountedRef.current && setReceivedData(received.data);
          }
        })
      } else if (liveStream && (liveStream.received && ((liveStream.cameraId && liveStream.cameraId) === cameraId))) {
        await socket.on('cameraStream', (received) => {
          if (received && received.cameraId === cameraId) {
            isMountedRef.current && setReceivedData(received.data);
          }
        })
      }
    }
  }

  const handleShowWithCamera = async () => {
    if (isMountedRef.current) {
      setWithCamera(true);
      setNoLiveStream(false);
      if (event) {
        handleLiveEventStream();
      } else {
        handleLiveStream();
      }
    }
  }

  const breathGraph = () => {
    let data = dataArr;
    const options = {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            stepSize: 100,
          }
        }]
      },
    };
    return (
      <Line data={data} options={options} />
    );
  }

  const handleUpdateGuardianliteCh = async (gl_idx, ipaddress, gl_id, password, channel, cmd) => {
    const res = await handleUpdateGuardianliteStatus(gl_idx, ipaddress, gl_id, password, channel, cmd);
    if (channel === 'ch1') {
      if (res && res.data && res.data.message === "guardianliteChannel set succesfully") {
        await setGuardianliteInfoDetail((prev) => ({ ...prev, [channel]: 'off' }));
        setTimeout(async () => {
          await setGuardianliteInfoDetail((prev) => ({ ...prev, [channel]: 'on' }));
        }, 1000);
      }
    } else {
      if (res && res.data && res.data.message === "guardianliteChannel set succesfully") {
        await setGuardianliteInfoDetail((prev) => ({ ...prev, [channel]: cmd === 'on' ? 'off' : 'on' }));
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true;
    console.log(popUpType, ipaddress, cameraId);
    if (isMountedRef.current && (popUpType === 'optionCamera' || popUpType === 'optionCamera_vital' || popUpType === 'onlyDevice')) {
      if (event) {
        !cameraId && setWithCamera(false);
        // handleDisconnectLiveEventStream();
        handleLiveEventStream();
      } else {
        withCamera && setWithCamera(false);
        handleDisconnectLiveStream();
        setNoLiveStream(true);
        setReceivedCamera('');
      }
    } else if (isMountedRef.current && popUpType !== 'optionCamera' && popUpType !== 'optionCamera_vital' && popUpType !== 'onlyDevice' && popUpType !== 'onlyCamera' && cameraId !== receivedCamera) {
      setNoLiveStream(false);
      if (event) {
        handleLiveEventStream();
      } else {
        handleLiveStream();
      }
    } else if (isMountedRef.current && popUpType === 'onlyCamera') {
      withCamera && setWithCamera(false);
      handleLiveStream();
      noLiveStream && setNoLiveStream(false);
    }
    return () => {
      isMountedRef.current = false;
    }
  }, [popUpType, ipaddress, cameraId]);

  useEffect(() => {
    isMountedRef.current = true;
    if (isMountedRef.current && !cameraId) {
      event ? handleDisconnectLiveEventStream() : handleDisconnectLiveStream();
      setFailStream(true);
      setReceivedData('');
    }
    if (isMountedRef.current && cameraId) {
      if (event) {
        handleSetLiveEventStream({ cameraId, received: true });
      } else {
        handleSetLiveStream({ cameraId, received: true });
      }
    }
    return () => {
      isMountedRef.current = false;
      if (event) {
        handleDisconnectLiveEventStream();
      } else {
        handleDisconnectLiveStream();
      }
    }
  }, [cameraId]);

  useEffect(() => {
    event && setTimeout(() => {
      isMountedRef && isMountedRef.current && handleCloseDeviceEventPopup();
    }, 1000 * 60)
  }, [event])

  if (position) {
    return (
      <div
        className={
          ((popUpType === 'optionCamera' || popUpType === 'optionCamera_vital') ?
            (withCamera ?
              (popUpType === 'optionCamera' ?
                (!event ? styles.root_full : (receivedData === '' ? styles.root_full_event : styles.root_full_event_on)) : (!event ? styles.root_full_vital : (receivedData === '' ? styles.root_full_vital_event : styles.root_full_vital_event_on)))
              : popUpType === 'optionCamera' ?
                styles.root : event ? (receivedData === '' ? styles.root_full_vital_event : styles.root_full_vital_event_on) : styles.root_vital)
            : (popUpType === 'onlyCamera' ?
              styles.root_camera
              : popUpType === 'guardianlite') ?
              styles.root_guardianlite : ''
          )}
        style={{
          top: position.y + (withCamera && !event && ((indication_line === 'top' || indication_line === 'left_top') || ((position.y + (clientHeight * (type !== 'vitalsensor' ? 0.3126 : 0.48))) >= clientHeight)) && -(clientHeight * 0.213)) + 'px', left: position.x + 'px'
        }}>
        <header>
          <a href='!#' className={styles.close} onClick={event ? handleCloseDeviceEventPopup : handleCloseDevicePopup} />
          <span className={
            (indication_line === 'left' && !(withCamera && (position.y + (type !== 'vitalsensor' ? (0.3126 * clientHeight) : (0.48 * clientHeight)) >= clientHeight))) ?
              styles.indication_line_left
              : (indication_line === 'top' || (!(indication_line === 'left') && !event && withCamera && (position.y + (type !== 'vitalsensor' ? (0.3126 * clientHeight) : (0.48 * clientHeight))) >= clientHeight)) ?
                styles.indication_line_top
                : (indication_line === 'left_top' || ((indication_line === 'left') && !event && withCamera && (position.y + (type !== 'vitalsensor' ? (0.3126 * clientHeight) : (0.48 * clientHeight)) >= clientHeight))) ?
                  styles.indication_line_left_top
                  : styles.indication_line_default}>
          </span>
        </header>
        <div className={!event ? styles.body : styles.body_event}>
          {popUpType !== 'onlyCamera' &&
            <div className={styles.info}>
              {
                eventName ?
                  <div className={styles.info_main}>
                    <span className={styles.info_eventName}>{eventName ? eventName : ''}</span>
                    <span className={styles.info_detail_ip_event}>({type !== 'door' ? ipaddress : deviceName})</span>
                  </div>
                  :
                  <div className={styles.info_detail}>
                    <span className={styles.info_detail_ip}>{type !== 'door' ? ipaddress : deviceName}</span>
                  </div>
              }
              <div className={styles.info_detail_location}>
                {buildingName && <span>{buildingName ? buildingName : '실외'}</span>}
                {floorName && <span>{floorName ? floorName : ''}</span>}
                {location && <span>{location ? location : ''}</span>}
              </div>
              {cameraId && <span className={(!buildingName && !floorName && !location) ? styles.info_detail_cc_alone : styles.info_detail_cc} onClick={handleShowWithCamera}><i className="mdi mdi-message-video" title={cameraId}></i></span>}
            </div>
          }
          {type === 'vitalsensor' && popUpType !== 'onlyCamera' && <div className={styles.sensor_value}>
            <span>현재 호흡 수치 : {targetBreathData}</span>
          </div>
          }
          {!noLiveStream && type !== 'guardianlite' && !(type === 'vitalsensor' && event && !cameraId) &&
            <div className={styles.video}>
              <img alt='' style={receivedData ? { width: '18.75rem', height: '20.64vh' } : !cameraId ? { width: '18.75rem', height: '20.64vh' } : { width: '12.5rem', height: '20.64vh' }} src={receivedData ? 'data:image/jpeg;base64,' + receivedData : (popUpType === 'onlyCamera' && !cameraId) ? noCamera : !failStream ? require('../../../assets/images/loading.gif') : ''} autoPlay></img>
            </div>
          }
          {type === 'vitalsensor' && popUpType !== 'onlyCamera' &&
            <div className={styles.vitalsensor_chart}>
              {breathGraph()}
            </div>
          }
          {(popUpType === 'guardianlite' && guardianliteInfoDetail) &&
            <div className={styles.guardianlite}>
              <div className={styles.guardianlite_title}>
                {(guardianliteInfoDetail.temper) ? `Guardian Lite (${guardianliteInfoDetail.temper}℃)` : `Guardian Lite`}
              </div>
              <div className={(guardianliteInfoDetail.ch1 === 'on') ? 'ch ledgreen' : 'ch ledred'}>
              </div>
              <div className={(guardianliteInfoDetail.ch2 === 'on') ? 'ch ledgreen' : 'ch ledred'}>
              </div>
              <div className={(guardianliteInfoDetail.ch3 === 'on') ? 'ch ledgreen' : 'ch ledred'}>
              </div>
              <div className={(guardianliteInfoDetail.ch4 === 'on') ? 'ch ledgreen' : 'ch ledred'}>
              </div>
              <div className={(guardianliteInfoDetail.ch5 === 'on') ? 'ch ledgreen' : 'ch ledred'}>
              </div>
              <div>CH1</div>
              <div>CH2</div>
              <div>CH3</div>
              <div>CH4</div>
              <div>CH5</div>
              <div className={styles.guardianlite_btn} onClick={() => handleUpdateGuardianliteCh(guardianliteInfoDetail.gl_idx, ipaddress, guardianliteInfoDetail.gl_id, guardianliteInfoDetail.password, 'ch1', guardianliteInfoDetail.ch1)}>
                <button>RESET</button>
              </div>
              <div className={styles.guardianlite_btn} onClick={() => handleUpdateGuardianliteCh(guardianliteInfoDetail.gl_idx, ipaddress, guardianliteInfoDetail.gl_id, guardianliteInfoDetail.password, 'ch2', guardianliteInfoDetail.ch2)}>
                <button >On/Off</button>
              </div>
              <div className={styles.guardianlite_btn} onClick={() => handleUpdateGuardianliteCh(guardianliteInfoDetail.gl_idx, ipaddress, guardianliteInfoDetail.gl_id, guardianliteInfoDetail.password, 'ch3', guardianliteInfoDetail.ch3)}>
                <button>On/Off</button>
              </div>
              <div className={styles.guardianlite_btn} onClick={() => handleUpdateGuardianliteCh(guardianliteInfoDetail.gl_idx, ipaddress, guardianliteInfoDetail.gl_id, guardianliteInfoDetail.password, 'ch4', guardianliteInfoDetail.ch4)}>
                <button>On/Off</button>
              </div>
              <div className={styles.guardianlite_btn} onClick={() => handleUpdateGuardianliteCh(guardianliteInfoDetail.gl_idx, ipaddress, guardianliteInfoDetail.gl_id, guardianliteInfoDetail.password, 'ch5', guardianliteInfoDetail.ch5)}>
                <button>On/Off</button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  } else {
    return ''
  }
}
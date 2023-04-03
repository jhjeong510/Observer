import React, { useState, useEffect } from 'react';
import styles from './EventDetail.module.css';
import { format, addHours, addSeconds } from 'date-fns';
import { getEventDbInfo } from './api/apiService';

export default function EventDetail({
  eventDetail,
  socketClient,
  handleCloseEventDetail,
  handleDisconnectSocket,
  handleChangeDateTimeFormat
}) {
  const [imgTag, setImgTag] = useState(<img className={styles.loadingScreen} src={`${require('../../assets/images/loading_rm_bg.gif')}`} controls muted autoPlay playsInline />);
  const [cameraId, setCameraId] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [eventDetailInfo, setEventDetailInfo] = useState({});
  const [eventDetailVideo, setEventDetailVideo] = useState({});


  useEffect(() => {
    if (eventDetail && eventDetail.eventIdx && eventDetail.serviceType) {
      getEventDetail(eventDetail);
    }
  }, [eventDetail])

  useEffect(() => {
    if (eventDetailInfo && eventDetailInfo.camera_id && eventDetailInfo.event_occurrence_time) {
      setImgTag(<img className={styles.loadingScreen} src={`${require('../../assets/images/loading_rm_bg.gif')}`} controls muted autoPlay playsInline />);
      eventVideoReview(eventDetailInfo);
    }
  }, [eventDetailInfo])

  const handleEventVideoReview = async (cameraId, startDateTime) => {
    await setCameraId(cameraId);
    await setStartDateTime(startDateTime);
  }

  const eventVideoReview = async (event) => {
    const eventStartTimeSplit = event.event_occurrence_time.split(".");
    let eventStartTime = eventStartTimeSplit[0];
    const dateStr = eventStartTime.substring(0, 4) + '-' + eventStartTime.substring(4, 6) + '-' + eventStartTime.substring(6, 8) + ' ' + eventStartTime.substring(9, 11) + ':' + eventStartTime.substring(11, 13) + ':' + eventStartTime.substring(13, 15);
    const dateOjb2 = addHours(new Date(dateStr), -9);
    const dateOjb = addSeconds(new Date(dateOjb2), -10);
    eventStartTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');
    const cameraId = event.camera_id
    const socket = socketClient;
    try {
      if (socket) {
        if (eventDetailVideo !== {}) {
          socket.emit('cameraArchive', {
            cameraId: eventDetailVideo.cameraId,
            startDateTime: eventDetailVideo.startDateTime,
            cmd: 'off'
          });
        }
        await setEventDetailVideo({
          cameraId,
          startDateTime: eventStartTime,
        })
        await handleEventVideoReview(cameraId, eventStartTime);
        socket.emit('cameraArchive', {
          cameraId: cameraId,
          startDateTime: eventStartTime,
          cmd: 'on'
        });
        socket.on('cameraArchive', (received) => {
          if (cameraId && eventStartTime && (received.cameraId === cameraId && received.startDateTime === eventStartTime)) {
            setImgTag(<img className={styles.videoScreen} src={`${'data:image/jpeg;base64,' + received.data}`} controls muted autoPlay playsInline />);
          }
        });
      }
    } catch (err) {
      console.log('rightbar get event video review err:', err);
    }
  }

  const getEventDetail = async (eventDetail) => {
    const res = await getEventDbInfo(eventDetail);
    if (res) {
      await setEventDetailInfo({
        ...res, building_name: eventDetail.buildingName, floor_name: eventDetail.floorName, location: eventDetail.location, event_type_name: eventDetail.eventTypeName
      });
    }
  }

  if (eventDetailInfo !== {}) {
    return (
      <div className={styles.eventDetail} id="eventDetail">
        <div className='eventRecPlay'>
          <div>
            <h4 className={styles.eventDetailTitle}>이벤트 영상<span className={styles.eventDetailVideoClose} onClick={() => { handleCloseEventDetail(); handleDisconnectSocket(cameraId, startDateTime); }}><i className="fa fa-window-close"></i></span></h4>
            <div className={styles.eventDetailVideoImg}>{imgTag}</div>
            {eventDetailInfo.device_type === 'guardianlite' && <img style={{ width: "100%", height: "210px" }} src={require('../../assets/images/guardian_rec.png')} />}
          </div>
        </div>
        <div style={{ padding: "1rem", color: "rgb(207 132 20)", }} className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row px-xl-4 rounded ">
          <div className="text-md-center text-xl-left">
            <div>
              <h4 className="mb-1 font-weight-bold mb-0"> {eventDetailInfo.name}{(eventDetailInfo.device_type !== 'door' && eventDetailInfo.ipaddress !== undefined) ? "(IP: " + eventDetailInfo.ipaddress + ")" : null} </h4>
              <p className="text-muted mb-0_2">이벤트 명 : {eventDetailInfo.event_type_name ? eventDetailInfo.event_type_name : eventDetail.eventTypeName}</p>
              <p className="text-muted mb-0_2">발생 시간 : {eventDetailInfo.event_occurrence_time ? handleChangeDateTimeFormat(eventDetailInfo.event_occurrence_time) : ''}</p>
              <p className="text-muted mb-0">발생 장소 : {eventDetailInfo.building_name ? (eventDetailInfo.building_name + ' ') : ''}{eventDetailInfo.floor_name ? (eventDetailInfo.floor_name + ' ') : ''}{eventDetailInfo.location ? eventDetailInfo.location : ''}</p>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return ''
  }
}
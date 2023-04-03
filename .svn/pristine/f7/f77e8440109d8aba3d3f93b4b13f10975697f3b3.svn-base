import React, { useContext, useState } from 'react';
import MoreTextInfo from '../shared/section/section/MoreTextInfo';
import not_parking from '../../assets/icon/not_parking.png';
import styles from './ParkingEventList.module.css';
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import { setAcknowledgeDetailEvent } from './api/apiService';
import { UserInfoContext } from '../context/context';
import ModalAckConfirm from '../shared/modal/ModalAckConfirm';

export default function ParkingEventDetail({ event, parkingCameras }) {
  const { id } = useContext(UserInfoContext);
  const [showAlert, setShowAlert] = useState(false);
  const handleSettingIcon = (eventType) => {
    switch (eventType) {
      case 35:
        return not_parking;
      default:
        break;
    }
  }

  const parkingCameraName = (ipValue) => {
    if (parkingCameras) {
      return parkingCameras.find((parkingCamera) => parkingCamera.ipaddress === ipValue) ? parkingCameras.find((parkingCamera) => parkingCamera.ipaddress === ipValue).name : ipValue;
    } else {
      return ''
    }
  }

  const handleShowAlert = () => {
    setShowAlert((prev) => !prev);
  }

  return (
    <div>
      <div className={styles.preview_item}>
        <div className={(event.isLast && !event.acknowledge) ? styles.eventInfo_active : styles.eventInfo}>
          <div className={styles.eventIcon}>
            {
              event.event_type === 35 ?
                <img src={handleSettingIcon(event.event_type)} className={styles.parking_event_icon_backgroundColor}></img>
                :
                <span className={styles.parking_event_icon_backgroundColor_FULL}>FULL</span>
            }
          </div>
          <div className={styles.event_text_info}>
            <h5 className={styles.event_text_info_name}>
              {event.name}{'(' + parkingCameraName(event.ipaddress) + ')'}
            </h5>
            <div className={styles.event_text_info_detail}>
              <span className={styles.event_text_info_description}>위치: {event.description && event.description.length > 33 ? <MoreTextInfo textInfo={event.description} setBottom /> : event.description}</span>
              {event.event_occurrence_time ? <span className={styles.event_text_info_occurTime} style={{ width: '300px' }}>발생시간: {dateFns.format(dateFns.parseISO(event.event_occurrence_time), "yyyy년 M월 d일 E요일 HH시 mm분", { locale: ko })}</span> : ''}
            </div>
          </div>
          <div className={styles.ack_btn} onClick={() => handleShowAlert()}>
            <i className="mdi mdi-check-circle-outline"></i>
          </div>
        </div>
      </div>
      <ModalAckConfirm
        showAlert={showAlert}
        handleShowAlert={handleShowAlert}
        acknowledgeIdx={event.idx}
        acknowledgeServiceType={'parkingcontrol'}
        userId={id}
      />
    </div>
  )
}
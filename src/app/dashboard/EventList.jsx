import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './EventList.module.css';
import { readEvents } from './api/apiService';
import EventListDetail from './EventListDetail';

export default function
  EventList(props) {

  const [eventList, setEventList] = useState([]);
  const [sorting, setSorting] = useState('latest');

  const getEvents = async (selectedValue, isUpdate) => {
    const res = await readEvents(selectedValue);
    if (res && res.eventList) {
      if (isUpdate) {
        res.eventList[0].isLast = true;
      }
      setEventList(res.eventList);
    } else {
      setEventList([]);
    }
  }
  useEffect(() => {
    getEvents(sorting);
  }, [])

  useEffect(() => {
    getEvents(sorting, 'update');
  }, [props.eventListUpdate]);

  return (
    <div className={styles.realtimeEvents} id='menu-eventList'>
      <div className={styles.eventListHeader}>
        <div className={styles.eventListTitleAndMore}>
          <h4 className={styles.eventListTitle}>
            실시간 이벤트
          </h4>
          <span className="getEvents-more" onClick={(e) => props.handleShowInquiryModal(e, 'allEvents')}>
            <i className="mdi mdi-more" title='데이터 조회'></i>
          </span>
        </div>
        <Dropdown className={styles.eventListOrder_list}>
          <Dropdown.Toggle variant="btn btn-dropdown" id="dropdownMenuButton1">
            {sorting === 'latest' ? '최신' : '중요도'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => { setSorting('latest'); getEvents('latest') }}>최신</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSorting('severity'); getEvents('severity') }}>중요도</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={styles.handleDisplayMenu}>
          <Dropdown.Toggle className={styles.handleSettingComponent} variant="btn btn-dropdown">
            <i className="mdi mdi-settings d-none d-sm-block"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {/* <Dropdown.Header>이벤트 현황</Dropdown.Header> */}
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'eventStatus')}>이벤트 현황</Dropdown.Item>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'eventList')}>실시간 이벤트 <i className="mdi mdi-checkbox-marked-circle-outline"></i></Dropdown.Item>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'deviceList')}>장치 목록</Dropdown.Item>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'accessCtl')}>출입 기록</Dropdown.Item>
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'close')}>닫기</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className={styles.list}>
        {eventList &&
          eventList.map((event) => (
            <EventListDetail
              key={event.idx}
              sorting={sorting}
              event={event}
              handleCheckServiceTypeUseOrNot={props.handleCheckServiceTypeUseOrNot}
              handleChangeDateTimeFormat={props.handleChangeDateTimeFormat}
              moveToTheThisDevice={props.moveToTheThisDevice}
              handleShowAlert={props.handleShowAlert}
              userId={props.userId}
              eventDetail={props.eventDetail}
              handleShowEventDetail={props.handleShowEventDetail}
              socketClient={props.socketClient}
            />
          ))
        }
      </div>
    </div>
  )
}
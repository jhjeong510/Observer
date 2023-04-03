import React, { useState, useReducer } from 'react';
import { Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import EventTypeIcons from './EventTypeIcons';
import styles from './EventList.module.css';
import { setAcknowledgeDetailEvent } from './api/apiService';
import eventDetailStyles from './EventListDetail.module.css';
import ModalAckConfirm from '../shared/modal/ModalAckConfirm';

export default function EventListDetail({
  event,
  handleCheckServiceTypeUseOrNot,
  handleChangeDateTimeFormat,
  moveToTheThisDevice,
  handleShowEventDetail,
  eventDetail,
  userId
}) {
  const [iconBoxColor, setIconBoxColor] = useState(['icon icon-box-secondary2', 'icon icon-box-success2', 'icon icon-box-warning2', 'icon icon-box-danger2']);
  const [showAlert, setShowAlert] = useState(false);
  const [acknowledgeIdx, setAcknowledgeIdx] = useState(undefined);
  const [acknowledgeServiceType, setAcknowledgeServiceType] = useState(undefined);

  const handleShowAlert = async (idx, serviceType) => {
    setShowAlert((prev) => !prev);
    setAcknowledgeIdx(idx);
    setAcknowledgeServiceType(serviceType);
  }

  if (event.service_type === 'ebell' && event.name && event.name.length > 0 && handleCheckServiceTypeUseOrNot(event.service_type)) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.status === 1 ? '비상상황 발생'.length + event.name.length : (event.status === 2 ? '통화중'.length + event.name.length : '비상종료'.length + event.name.length)) > 18
                  ?
                  <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.status === 1 ? '비상상황 발생(' : (event.status === 2 ? '통화중(' : '비상종료(')}{event.name + ')'}
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.status === 1 ? '비상상황 발생(' : (event.status === 2 ? '통화중(' : '비상종료(')}{event.name + ')'}
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : {event.service_type === 'ebell' && '비상벨'}</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => {
                  handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name);
                }}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.left_location && event.top_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">비상벨은 확인 처리되지 않습니다.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="acknowledgeIcon">
                          <button type="button" className="btn btn-inverse-success btn-fw disabled"><p className="acknowledge">확인</p></button>
                        </span>
                      </OverlayTrigger>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button_y} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else if (event.service_type === 'mgist' && event.name && event.name.length > 0 && event.event_type_name && event.event_type_name.length > 0) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.description) >= 18
                  ?
                  <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.description}
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.description}
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : MGIST</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.left_location && event.top_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className="btn btn-inverse-success btn-fw disabled"><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className="acknowledgeIcon danger">
                          <button type="button" className="btn btn-inverse-success btn-fw" onClick={() => handleShowAlert(event.idx, event.service_type)}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button_y} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  } else if ((event.event_type === 23 || event.event_type === 24) && event.name && event.name.length > 0 && event.description && event.description.length > 0 && event.event_type_name && event.event_type_name.length > 0 && handleCheckServiceTypeUseOrNot('anpr')) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                <h5 className="preview2-subject2">
                  {event.event_type_name + ' 인식'}({event.description})
                </h5>
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : ANPR</p>
                {event.name ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>장치명 : {event.name}</p> : ''}
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 :  {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.left_location && event.top_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </Button>
            <Button onClick={() => handleShowAlert()}>
              아니오
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  } else if (event.device_type === 'guardianlite' && event.name && event.name.length > 0 && event.description && event.description.length > 0 && handleCheckServiceTypeUseOrNot(event.device_type)) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.event_type === 20 ? ' ON'.length + event.name.length + event.description.length : (event.event_type === 21 ? ' OFF'.length + event.name.length + event.description.length : ' RESET'.length + event.name.length + event.description.length)) > 18 ?
                  <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.description}({event.name}) {event.event_type === 20 ? 'ON' : (event.event_type === 21 ? 'OFF' : 'RESET')}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.description}({event.name}) {event.event_type === 20 ? 'ON' : (event.event_type === 21 ? 'OFF' : 'RESET')}
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.description}({event.name}) {event.event_type === 20 ? 'ON' : (event.event_type === 21 ? 'OFF' : 'RESET')}
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : 가디언라이트</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.left_location && event.top_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Modal show={showAlert} centered>
            <Modal.Header>
              <Modal.Title>이벤트 알림 해제</Modal.Title>
            </Modal.Header>
            <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
            <Modal.Footer>
              <button className={eventDetailStyles.button_y} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
                예
              </button>
              <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
                아니오
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    )
  } else if (event.service_type === 'accesscontrol' && event.name && event.name.length > 0 && event.event_type_name && event.event_type_name.length > 0 && handleCheckServiceTypeUseOrNot('accesscontrol')) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.name.length + event.event_type_name.length) >= 19 ?
                  <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.name} {event.event_type_name}
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.name} {event.event_type_name}
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : 출입통제</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.left_location && event.top_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button_y} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  } else if (event.device_type === 'vitalsensor' && event.name && event.name.length > 0 && event.description && event.description.length > 0 && event.device_name && event.device_name.length > 0 && handleCheckServiceTypeUseOrNot(event.device_type)) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.name.length + event.description.length + ' on '.length + event.device_name.length) >= 18 ?
                  <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.device_name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.name}({event.description}) on {event.device_name}
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.name}({event.description}) on {event.device_name}
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : 호흡감지</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.left_location && event.top_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button_y} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  } else if (event.service_type === 'ndoctor' && event.device_id && event.device_id.length > 0 && event.description && event.description.length > 0 && event.device_name && event.device_name.length > 0 && handleCheckServiceTypeUseOrNot(event.service_type)) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.description.length + event.device_id.length + event.device_name.length) >= 17 ?
                  <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.description}({event.devie_id}.{event.device_name})</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.description}({event.devie_id}.{event.device_name})
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.description}({event.devie_id}.{event.device_name})
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : N-Doctor</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.left_location && event.top_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button_y} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  } else if (event.device_type === 'zone' && event.name && event.name.length > 0 && event.event_type_name && event.event_type_name.length > 0 && handleCheckServiceTypeUseOrNot('pids')) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.name.length + event.event_type_name.length) >= 18 ?
                  <OverlayTrigger
                    key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.event_type_name}({event.name})
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.event_type_name}({event.name})
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : PIDS</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.top_location && event.left_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button_y} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  } if (event.service_type === 'parkingcontrol' && event.name && event.name.length > 0 && handleCheckServiceTypeUseOrNot(event.service_type)) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.name.length + event.event_type_name.length) >= 18 ?
                  <OverlayTrigger
                    // key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.event_type_name}({event.device_name})
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.event_type_name}({event.device_name})
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : 주차관제시스템</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.top_location && event.left_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalAckConfirm
          showAlert={showAlert}
          handleShowAlert={handleShowAlert}
          acknowledgeIdx={acknowledgeIdx}
          acknowledgeServiceType={acknowledgeServiceType}
          userId={userId}
        />
      </>
    );
  } else if (event.service_type === 'mdet' && event.name && event.name.length > 0 && handleCheckServiceTypeUseOrNot(event.service_type)) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.name.length + event.event_type_name.length) >= 18 ?
                  <OverlayTrigger
                    // key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.event_type_name}({event.device_name})
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.event_type_name}({event.device_name})
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : M-DET</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.top_location && event.left_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  } else if (event.service_type === 'crowddensity' && event.name && event.name.length > 0 && handleCheckServiceTypeUseOrNot(event.service_type)) {
    return (
      <>
        <div className={((eventDetail && eventDetail.eventIdx === event.idx) && (eventDetail && eventDetail.serviceType === event.service_type)) ? (styles.eventListDetail_onSelect) : ((event.isLast && !event.acknowledge) ? styles.eventListDetail_isLast : styles.eventListDetail)} key={event.idx}>
          <div className="preview2-item border-bottom">
            <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items">
              <div className="eventIcon">
                <div className={iconBoxColor[event.event_type_severity]}>
                  <EventTypeIcons
                    event={event}
                  />
                </div>
              </div>
              <div className={styles.eventInfo}>
                {(event.name.length + event.event_type_name.length) >= 18 ?
                  <OverlayTrigger
                    // key={'right'}
                    placement={'right'}
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        <strong className="LeftDeviceNameTooltip">{event.name}</strong>
                      </Tooltip>
                    }
                  >
                    <h5 className="preview2-subject2">
                      {event.event_type_name}({event.device_name})
                    </h5>
                  </OverlayTrigger>
                  :
                  <h5 className="preview2-subject2">
                    {event.event_type_name}({event.device_name})
                  </h5>
                }
                <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>서비스 종류 : 군중 감지</p>
                {event.floor_idx ?
                  ((event.building_name && event.building_name.length) + (event.floor_name && event.floor_name.length) + (event.location && event.location.length)) >= 15 ?
                    <OverlayTrigger
                      key={'right'}
                      placement={'right'}
                      overlay={
                        <Tooltip id={`tooltip-right`}>
                          <strong className="LeftDeviceNameTooltip">{event.building_name} {event.floor_name} {event.location}</strong>
                        </Tooltip>
                      }
                    >
                      <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                    </OverlayTrigger>
                    : <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치 : {event.building_name} {event.floor_name} {event.location}</p>
                  : event.location ?
                    <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생위치: {event.location}</p>
                    : ''
                }
                {event.event_occurrence_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>발생시간 : {handleChangeDateTimeFormat(event.event_occurrence_time)}</p> : ''}
                {event.event_end_time ? <p className={event.acknowledge !== true ? "text-muted mb-0" : "text-muted2 mb-0"}>종료시간 : {handleChangeDateTimeFormat(event.event_end_time)}</p> : ''}
              </div>
              <div className="event-function-group">
                <a href="#" onClick={() => handleShowEventDetail(event.idx, event.service_type, event.building_name, event.floor_name, event.location, event.event_type_name)}>
                  <p className={styles.eventDetail}>이벤트 영상</p>
                </a>
                <div className="eventIcon">
                  {
                    (event.top_location && event.left_location) ?
                      <span className="toEmapIcon">
                        <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon" onClick={() => moveToTheThisDevice(event.id, event.device_type, event.building_idx, event.floor_idx, event.building_service_type, new Date().getTime())}>
                          <i className="mdi mdi-map-marker"></i>
                        </button>
                      </span>
                      :
                      <OverlayTrigger
                        key={'right'}
                        placement={'right'}
                        overlay={
                          <Tooltip id={`tooltip-right`}>
                            <strong className="LeftTooltip">해당 장치의 위치정보가 없습니다.<br />위치정보를 등록하세요.</strong>
                          </Tooltip>
                        }
                      >
                        <span className="toEmapIcon">
                          <button type="button" id="toEmapButton" className="btn btn-inverse-success btn-icon disabled">
                            <i className="mdi mdi-map-marker"></i>
                          </button>
                        </span>
                      </OverlayTrigger>
                  }
                  <div className="icon icon-box-acknowledge">
                    {
                      event.acknowledge === true ?
                        <OverlayTrigger
                          key={'right'}
                          placement={'right'}
                          overlay={
                            <Tooltip id={`tooltip-right`}>
                              <strong className="LeftTooltip">이미 확인한 이벤트입니다.</strong>
                            </Tooltip>
                          }
                        >
                          <span className="acknowledgeIcon">
                            <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                          </span>
                        </OverlayTrigger>
                        :
                        <span className={event.acknowledge === false ? "acknowledgeIcon danger" : "acknowledgeIcon"}>
                          <button type="button" className={event.acknowledge === true ? "btn btn-inverse-success btn-fw disabled" : "btn btn-inverse-success btn-fw"} onClick={event.acknowledge === false ? () => handleShowAlert(event.idx, event.service_type) : null}><p className="acknowledge">확인</p></button>
                        </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showAlert} centered>
          <Modal.Header>
            <Modal.Title>이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <button className={eventDetailStyles.button} onClick={() => { setShowAlert(false); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
              예
            </button>
            <button className={eventDetailStyles.button} onClick={() => handleShowAlert()}>
              아니오
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
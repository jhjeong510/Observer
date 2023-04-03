import React, { useEffect, useState } from 'react';
import styles from './CustomComponent.module.css';
import AccessControl from './AccessControl';
import DeviceList from './DeviceList';
import EventList from './EventList';
import EventStatus from './EventStatus';

export default function CustomComponent({
  layoutNumber,
  layout: { element, visible },
  handleCustomLayout,
  serviceTypes,
  handleChangeServiceTypeName,
  eventListUpdate,
  handleShowInquiryModal,
  handleCheckServiceTypeUseOrNot,
  handleChangeDateTimeFormat,
  moveToTheThisDevice,
  userId,
  eventDetail,
  handleShowEventDetail,
  buildingList,
  floorList,
  deviceList,
  cameraList,
  pidsList,
  deviceInformationValue,
  accessControlLog,
  readAccessControlLog,
  resize
}) {
  if (element === 'eventStatus') {
    return (
      <div className={visible ? styles.visible : styles.hidden}>
        <EventStatus
          serviceTypes={serviceTypes}
          handleChangeServiceTypeName={handleChangeServiceTypeName}
          eventListUpdate={eventListUpdate}
          handleCustomLayout={handleCustomLayout}
          layoutNumber={layoutNumber}
        />
      </div>
    );
  } else if (element === 'eventList') {
    return (
      <div className={visible ? styles.visible : styles.hidden}>
        <EventList
          eventListUpdate={eventListUpdate}
          handleShowInquiryModal={handleShowInquiryModal}
          handleCheckServiceTypeUseOrNot={handleCheckServiceTypeUseOrNot}
          handleChangeDateTimeFormat={handleChangeDateTimeFormat}
          moveToTheThisDevice={moveToTheThisDevice}
          userId={userId}
          eventDetail={eventDetail}
          handleShowEventDetail={handleShowEventDetail}
          handleCustomLayout={handleCustomLayout}
          layoutNumber={layoutNumber}
        />
      </div>
    );
  } else if (element === 'deviceList') {
    return (
      <div className={visible ? styles.visible : styles.hidden}>
        <DeviceList
          buildingList={buildingList}
          floorList={floorList}
          deviceList={deviceList}
          cameraList={cameraList}
          pidsList={pidsList}
          deviceInformationValue={deviceInformationValue}
          moveToTheThisDevice={moveToTheThisDevice}
          layoutNumber={layoutNumber}
          handleCustomLayout={handleCustomLayout}
        />
      </div>
    );
  } else if (element === 'accessCtl') {
    return (
      <div className={visible ? styles.visible : styles.hidden}>
        <AccessControl
          accessControlLog={accessControlLog}
          readAccessControlLog={readAccessControlLog}
          moveToTheThisDevice={moveToTheThisDevice}
          deviceList={deviceList}
          layoutNumber={layoutNumber}
          handleCustomLayout={handleCustomLayout}
        />
      </div>
    );
  } else {
    return (
      <div>
      </div>
    );
  }
}

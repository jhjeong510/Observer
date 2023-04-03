import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './DeviceList.module.css';
import DeviceTree from './DeviceTree.jsx';

export default function DeviceList({
  buildingList,
  floorList,
  deviceList,
  cameraList,
  pidsList,
  deviceInformationValue,
  moveToTheThisDevice,
  layoutNumber,
  handleCustomLayout
}) {
  return (
    <div className={styles.deviceList} id='menu-deviceList'>
      <div className={styles.header}>
        <h4 className={styles.title}>
          &nbsp;장치 목록
        </h4>
        <Dropdown className={styles.handleDisplayMenu}>
          <Dropdown.Toggle className={styles.handleSettingComponent} variant="btn btn-dropdown">
            <i className="mdi mdi-settings d-none d-sm-block"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {/* <Dropdown.Header>이벤트 현황</Dropdown.Header> */}
            <Dropdown.Item onClick={() => handleCustomLayout(layoutNumber, 'eventStatus')}>이벤트 현황</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCustomLayout(layoutNumber, 'eventList')}>실시간 이벤트</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCustomLayout(layoutNumber, 'deviceList')}>장치 목록 <i className="mdi mdi-checkbox-marked-circle-outline"></i></Dropdown.Item>
            <Dropdown.Item onClick={() => handleCustomLayout(layoutNumber, 'accessCtl')}>출입 기록</Dropdown.Item>
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item onClick={() => handleCustomLayout(layoutNumber, 'close')}>닫기</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className={styles.deviceTree}>
        <DeviceTree
          buildingList={buildingList}
          floorList={floorList}
          deviceList={deviceList}
          cameraList={cameraList}
          pidsList={pidsList}
          deviceInformationValue={deviceInformationValue}
          moveToTheThisDevice={moveToTheThisDevice}
        />
      </div>
    </div>
  );
}

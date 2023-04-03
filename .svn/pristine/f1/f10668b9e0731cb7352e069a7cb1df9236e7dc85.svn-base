import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomComponent from './CustomComponent';
import "react-tabs/style/react-tabs.css";
import styles from './Rightbar.module.css';

export default function Rightbar({
  buildingList,
  floorList,
  deviceList,
  cameraList,
  pidsList,
  rightLayout1,
  rightLayout2,
  deviceInformationValue,
  accessControlLog,
  readAccessControlLog,
  serviceTypes,
  handleChangeServiceTypeName,
  eventListUpdate,
  handleShowInquiryModal,
  handleCheckServiceTypeUseOrNot,
  handleChangeDateTimeFormat,
  moveToTheThisDevice,
  userId,
  handleCustomLayout,
  eventDetail,
  handleShowEventDetail
}) {
  const [targetNodeValue, setTargetNodeValue] = useState('');
  const [nodeEventHistory, setNodeEventHistory] = useState([]);
  const [selectNode, setSelectNode] = useState('');

  useEffect(() => {
    targetNodeValueFunction(deviceInformationValue);
  }, [deviceInformationValue])

  const targetNodeValueFunction = async (targetNodeValue) => {
    const nodeValueArr = targetNodeValue.value.split(":");
    let nodeIp = '';
    let deviceId = '';
    let serviceType = '';
    if (nodeValueArr.length > 3) {
      if (nodeValueArr[2] === 'accesscontrol') {
        deviceId = nodeValueArr[0];
        serviceType = nodeValueArr[2];
      } else {
        nodeIp = nodeValueArr[3];
      }
    }
    try {
      if (targetNodeValue && targetNodeValue.children === undefined) {
        const result = await axios.get('/api/observer/events', {
          params: {
            ipaddress: nodeIp,
            deviceId: nodeValueArr[2] === 'accesscontrol' ? deviceId : undefined,
            serviceType: nodeValueArr[2] === 'accesscontrol' ? serviceType : undefined
          }
        })

        if (result) {
          setNodeEventHistory(result.data.result);
          setSelectNode(targetNodeValue);
        }
      } else {
        console.log('res is undefined');
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.rightBar} id='rightbar'>
      <CustomComponent
        handleCustomLayout={handleCustomLayout}
        serviceTypes={serviceTypes}
        handleChangeServiceTypeName={handleChangeServiceTypeName}
        eventListUpdate={eventListUpdate}
        handleShowInquiryModal={handleShowInquiryModal}
        handleCheckServiceTypeUseOrNot={handleCheckServiceTypeUseOrNot}
        handleChangeDateTimeFormat={handleChangeDateTimeFormat}
        moveToTheThisDevice={moveToTheThisDevice}
        userId={userId}
        eventDetail={eventDetail}
        handleShowEventDetail={handleShowEventDetail}
        buildingList={buildingList}
        floorList={floorList}
        deviceList={deviceList}
        cameraList={cameraList}
        pidsList={pidsList}
        deviceInformationValue={deviceInformationValue}
        accessControlLog={accessControlLog}
        readAccessControlLog={readAccessControlLog}
        layout={rightLayout1}
        layoutNumber={3}
      />
      <CustomComponent
        handleCustomLayout={handleCustomLayout}
        serviceTypes={serviceTypes}
        handleChangeServiceTypeName={handleChangeServiceTypeName}
        eventListUpdate={eventListUpdate}
        handleShowInquiryModal={handleShowInquiryModal}
        handleCheckServiceTypeUseOrNot={handleCheckServiceTypeUseOrNot}
        handleChangeDateTimeFormat={handleChangeDateTimeFormat}
        moveToTheThisDevice={moveToTheThisDevice}
        userId={userId}
        eventDetail={eventDetail}
        handleShowEventDetail={handleShowEventDetail}
        buildingList={buildingList}
        floorList={floorList}
        deviceList={deviceList}
        cameraList={cameraList}
        pidsList={pidsList}
        deviceInformationValue={deviceInformationValue}
        accessControlLog={accessControlLog}
        readAccessControlLog={readAccessControlLog}
        layout={rightLayout2}
        layoutNumber={4}
      />
    </div>
  )
}
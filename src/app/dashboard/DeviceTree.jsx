import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import Tree from '@idui/react-tree'
import styles from './DeviceTree.module.css';

const CustomLeaf = styled.div`
  display: flex;
  color: #e0e0e0;
  margin-bottom: 2px;
`;

export default function DeviceTree({
  buildingList,
  floorList,
  deviceList,
  cameraList,
  pidsList,
  deviceInformationValue,
  moveToTheThisDevice
}) {
  const [selectedNode, setSelectedNode] = useState('');
  const [initTree, setInitTree] = useState({
    label: '장치 개수',
    icon: <i className="fas fa-map-marker-alt" style={{ color: 'green', margin: 'auto' }}></i>,
    childNodes: [],
    isOpen: true,
  });

  const selectNode = async (e, type, idx, ipaddress, device_id, building_idx, floor_idx, building_service_type) => {
    const elements = document.getElementsByClassName(styles.deviceDetail);
    for (let element of elements) {
      if (element.style.backgroundColor) {
        element.style.backgroundColor = ''
      }
    }
    if (e.target.parentElement && e.target.parentElement.id) {
      e.target.parentElement.style.backgroundColor = 'rgb(53 128 205)'
      await setSelectedNode(e.target.parentElement.id)
    }
    if (device_id) {
      const timestamp = new Date().getTime();
      moveToTheThisDevice(device_id, type, building_idx, floor_idx, building_service_type, timestamp);
    }
  }
  const renderCustomLeaf = ({ toggle, isOpen, icon, type, id, idx, ipaddress, label, hasChildren, status, device_id, building_idx, floor_idx, building_service_type }) => (
    <CustomLeaf hasChildren={hasChildren} onClick={toggle}>
      &nbsp;{hasChildren && (isOpen ? '▼' : '▶') + ' '}&nbsp;
      <span id={id} className={styles.deviceDetail} onClick={(e) => selectNode(e, type, idx, ipaddress, device_id, building_idx, floor_idx, building_service_type)}>
        {icon}&nbsp;&nbsp; <span className={styles.deviceName}>{label}</span>
      </span>
    </CustomLeaf>
  );

  const handleDeviceIcon = (device) => {
    if (device.type === 'ebell') {
      return <span className={device.status === 0 ? styles.iconColorNormal : styles.iconColorOnEvent}><i className="fas fa-bell"></i></span>;
    } else if (device.type === 'door') {
      return <span className={device.status === 0 ? styles.iconColorNormal : styles.iconColorOnEvent}><i className="fas fa-door-closed"></i></span>
    } else if (device.type === 'guardianlite') {
      return <span className={device.status === 0 ? styles.iconColorNormal : styles.iconColorOnEvent}><i className="fas fa-power-off"></i></span>;
    } else if (device.type === 'breathSensor') {
      return <span className={device.status === 0 ? styles.iconColorNormal : styles.iconColorOnEvent}><i className="mdi mdi-pulse"></i></span>
    } else if (device.type === 'zone') {
      return <span className={device.status === 0 ? styles.iconColorNormal : styles.iconColorOnEvent}><i className="mdi mdi-gate"></i></span>
    } else if (device.type !== 'acu' && device.type !== 'pids') {
      return <span className={device.status === '0' ? styles.iconColorNormal : styles.iconColorOnEvent}><i className="fas fa-video"></i></span>
    }
  }

  const nodes = [{
    ...initTree,
    label: '장치 개수' + `${cameraList.length > 0 ? '(카메라: ' + cameraList.length : ''}` + `${deviceList.filter((device) => device.type === 'ebell').length > 0 ? ', 비상벨: ' + deviceList.filter((device) => device.type === 'ebell').length : ''}` + `${deviceList.filter((device) => device.type === 'door').length > 0 ? ', 출입문: ' + deviceList.filter((device) => device.type === 'door').length : ''}` + `${deviceList.filter((device) => device.type === 'guardianlite').length > 0 ? (', 가디언라이트: ' + deviceList.filter((device) => device.type === 'guardianlite').length) : ''}` + `${pidsList.filter((pids) => pids.type === 'zone').length > 0 ? (', PIDS: ' + pidsList.filter((pids) => pids.type === 'zone').length) : ''}` + `${deviceList.filter((device) => device.type === 'breathSensor').length > 0 ? (', 바이탈센서: ' + deviceList.filter((device) => device.type === 'breathSensor').length) : ''}` + ')'
  }].map((initTreeItem) => ({
    ...initTreeItem, childNodes: buildingList.sort((a, b) => a.name > b.name ? 1 : -1).map((building) => {
      return ({
        id: 'building.' + building.idx,
        label: building.name,
        type: 'building',
        idx: building.idx,
        service_type: building.service_type,
        value: building.idx + ":" + building.service_type + ":" + building.name,
        icon: <i className="fas fa-city" style={{ color: 'white' }}></i>,
        isOpen: false,
        childNodes: floorList.filter((floor) => (floor.idx !== 0) && (floor.building_idx === building.idx)).sort((a, b) => a.name > b.name ? 1 : -1).map((floorDetail) => {
          return ({
            id: 'floor.' + floorDetail.idx + '_' + floorDetail.building_idx,
            label: floorDetail.name,
            type: 'floor',
            idx: floorDetail.idx,
            service_type: floorDetail.service_type,
            value: floorDetail.idx + ":" + floorDetail.service_type + ":" + floorDetail.name,
            icon: <i className="fas fa-layer-group" style={{ color: 'white' }}></i>,
            isOpen: false,
            childNodes: deviceList.filter((device) => (device.top_location && device.left_location) && (device.floor_idx === floorDetail.idx) && ((device.building_idx === building.idx))).map((deviceDetail) => {
              return ({
                label: deviceDetail.name,
                type: deviceDetail.type,
                idx: deviceDetail.idx,
                service_type: deviceDetail.service_type,
                building_idx: building.idx,
                floor_idx: floorDetail.idx,
                building_service_type: building.service_type,
                value: deviceDetail.idx + ":" + deviceDetail.name + ":" + deviceDetail.service_type + ":" + deviceDetail.ipaddress + ":" + deviceDetail.type,
                id: deviceDetail.type + '.' + deviceDetail.id,
                device_id: deviceDetail.id,
                ipaddress: deviceDetail.ipaddress,
                icon: handleDeviceIcon(deviceDetail),
                isOpen: true
              })
            })
              .concat(cameraList.filter((camera) => (camera.top_location && camera.left_location) && (camera.floor_idx === floorDetail.idx) && ((camera.building_idx === building.idx))).map((cameraDetail) => {
                return ({
                  label: cameraDetail.cameraname === '카메라' ? cameraDetail.cameraid + '.' + cameraDetail.cameraname : cameraDetail.cameraname,
                  type: 'camera',
                  id: '카메라.' + cameraDetail.cameraid,
                  device_id: cameraDetail.cameraid,
                  service_type: cameraDetail.service_type,
                  building_idx: building.idx,
                  floor_idx: floorDetail.idx,
                  building_service_type: building.service_type,
                  value: cameraDetail.cameraid + ":" + cameraDetail.cameraname + ":" + cameraDetail.service_type + ":" + cameraDetail.ipaddress,
                  ipaddress: cameraDetail.ipaddress,
                  icon: handleDeviceIcon(cameraDetail),
                  isOpen: true
                })
              }))
          })
        })
      })
    }).concat({
      id: 'outdoor',
      label: '실외 장치 그룹',
      type: 'building',
      idx: 0,
      service_type: 'observer',
      value: '실외 장치 그룹',
      icon: <i className="fas fa-city" style={{ color: 'white' }}></i>,
      isOpen: false,
      childNodes: deviceList.filter((device) => (device.top_location && device.left_location) && (device.floor_idx === 0) && (device.building_idx === 0)).map((deviceDetail) => {
        return ({
          id: deviceDetail.type + '.' + deviceDetail.id,
          device_id: deviceDetail.id,
          building_idx: 0,
          floor_idx: 0,
          building_service_type: null,
          label: deviceDetail.name,
          type: deviceDetail.type,
          idx: deviceDetail.idx,
          service_type: deviceDetail.service_type,
          value: deviceDetail.idx + ":" + deviceDetail.name + ":" + deviceDetail.service_type + ":" + deviceDetail.ipaddress + ":" + deviceDetail.type,
          ipaddress: deviceDetail.ipaddress,
          icon: handleDeviceIcon(deviceDetail),
          isOpen: true
        })
      })
        .concat(cameraList.filter((camera) => (camera.top_location && camera.left_location) && (camera.floor_idx === 0) && ((camera.building_idx === 0))).map((cameraDetail) => {
          return ({
            label: cameraDetail.cameraname === '카메라' ? cameraDetail.cameraid + '.' + cameraDetail.cameraname : cameraDetail.cameraname,
            type: 'camera',
            id: 'camera.' + cameraDetail.cameraid,
            device_id: cameraDetail.cameraid,
            building_idx: 0,
            floor_idx: 0,
            building_service_type: null,
            service_type: cameraDetail.service_type,
            value: cameraDetail.cameraid + ":" + cameraDetail.cameraname + ":" + cameraDetail.service_type + ":" + cameraDetail.ipaddress,
            ipaddress: cameraDetail.ipaddress,
            icon: handleDeviceIcon(cameraDetail),
            isOpen: true
          })
        }))
        .concat(pidsList.filter((pids) => (pids.floor_idx === 0 && pids.building_idx === 0 && pids.source_left_location && pids.source_top_location && pids.target_left_location && pids.target_top_location && pids.pidsid && pids.pidsname && pids.service_type && pids.ipaddress)).map((pidsDetail) => {
          return ({
            idx: pidsDetail.pidsid,
            label: pidsDetail.pidsid,
            type: pidsDetail.type,
            id: pidsDetail.type + '.' + pidsDetail.pidsid,
            device_id: pidsDetail.id,
            building_idx: 0,
            floor_idx: 0,
            building_service_type: null,
            service_type: pidsDetail.service_type,
            value: pidsDetail.pidsid + ":" + pidsDetail.pidsname + ":" + pidsDetail.service_type + ":" + pidsDetail.ipaddress + ":" + pidsDetail.type,
            ipaddress: pidsDetail.ipaddress,
            icon: handleDeviceIcon(pidsDetail),
            isOpen: false
          })
        }))
    })
      .concat({
        id: 'unRegistered',
        label: '미등록 장치 그룹',
        type: 'building',
        idx: 0,
        service_type: 'observer',
        value: '미등록 장치 그룹',
        icon: <i className="fas fa-tools" style={{ color: 'white' }}></i>,
        isOpen: false,
        childNodes: deviceList.filter((device) => (!device.top_location && !device.left_location) && (device.floor_idx === 0) && (device.building_idx === 0)).map((deviceDetail) => {
          return ({
            label: deviceDetail.name,
            type: deviceDetail.type,
            idx: deviceDetail.idx,
            service_type: deviceDetail.service_type,
            value: deviceDetail.idx + ":" + deviceDetail.name + ":" + deviceDetail.service_type + ":" + deviceDetail.ipaddress + ":" + deviceDetail.type,
            id: deviceDetail.type + '.' + deviceDetail.id,
            device_id: deviceDetail.id,
            building_idx: undefined,
            floor_idx: undefined,
            building_service_type: undefined,
            ipaddress: deviceDetail.ipaddress,
            icon: handleDeviceIcon(deviceDetail),
            isOpen: true
          })
        })
          .concat(cameraList.filter((camera) => (!camera.top_location && !camera.left_location) && (camera.floor_idx === 0) && (camera.building_idx === 0)).map((cameraDetail) => {
            return ({
              label: cameraDetail.cameraname === '카메라' ? cameraDetail.cameraid + '.' + cameraDetail.cameraname : cameraDetail.cameraname,
              type: 'camera',
              id: 'camera.' + cameraDetail.cameraid,
              building_idx: undefined,
              floor_idx: undefined,
              building_service_type: undefined,
              device_id: cameraDetail.id,
              service_type: cameraDetail.service_type,
              value: cameraDetail.cameraid + ":" + cameraDetail.cameraname + ":" + cameraDetail.service_type + ":" + cameraDetail.ipaddress,
              ipaddress: cameraDetail.ipaddress,
              icon: handleDeviceIcon(cameraDetail),
              isOpen: true
            })
          }))
          .concat(pidsList.filter((pids) => (pids.floor_idx === 0 && pids.building_idx === 0 && ((!pids.source_left_location && !pids.source_top_location) || (!pids.target_left_location && !pids.target_top_location)) && pids.pidsid && pids.pidsname && pids.service_type && pids.ipaddress)).map((pidsDetail) => {
            return ({
              idx: pidsDetail.pidsid,
              label: pidsDetail.pidsid,
              type: pidsDetail.type,
              id: pidsDetail.type + '.' + pidsDetail.pidsid,
              device_id: pidsDetail.id,
              building_idx: undefined,
              floor_idx: undefined,
              building_service_type: undefined,
              service_type: pidsDetail.service_type,
              value: pidsDetail.pidsid + ":" + pidsDetail.pidsname + ":" + pidsDetail.service_type + ":" + pidsDetail.ipaddress + ":" + pidsDetail.type,
              ipaddress: pidsDetail.ipaddress,
              icon: handleDeviceIcon(pidsDetail),
              isOpen: false
            })
          }))
      })
  }))

  return (
    <Tree
      childrenOffset="20px"
      highlightClassName="highlight"
      nodes={nodes}
      renderLeaf={renderCustomLeaf}
      searchBy="label"
    />
  );
}

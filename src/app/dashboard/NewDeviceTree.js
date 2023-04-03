import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import '../../assets/styles/mixins/_react-checkbox-tree.scss';
import { format, parse } from 'date-fns';
import ebellImg from '../../assets/images/ebell-img.png';
import cameraImg from '../../assets/images/camera-img.png';
import guardianImg from '../../assets/images/guardian-img.png';
import EventTypeIcons from './EventTypeIcons';
import styles from './NewDeviceTree.module.css';

class NewDeviceTree extends React.Component {

  state = {
    treeData: [{
      value: '그린아이티코리아',
      label: '그린아이티코리아',
      children: [],
      showCheckbox: false,
    }],
    initTreeData: [{
      value: '그린아이티코리아',
      label: '그린아이티코리아',
      children: [],
      showCheckbox: false,
    }],
    checked: [],
    expanded: ['그린아이티코리아'],
    nodeEventHistory: [],
    iconBoxColor: ['icon icon-box-secondary2', 'icon icon-box-success2','icon icon-box-warning2','icon icon-box-danger2'],
    selectNode: '',
    handleHistoryDiv: 0,
    targetNodeIsParent: '',
    
    buildingList: [],
    deviceList: [],
    cameraList: [],
    floorList: [],
    pidsList: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState) {
      return { 
        nodeEventHistory: nextProps.nodeEventHistory, 
        selectNode: nextProps.selectNode,
        buildingList: nextProps.buildingList.sort((a, b) => a - b),
        floorList: nextProps.floorList.sort((a, b) => b - a),
        deviceList: nextProps.deviceList.sort((a, b) => a - b),
        cameraList: nextProps.cameraList.sort((a, b) => a - b),
        pidsList: nextProps.pidsList.sort((a, b) => b - a),
      };
    } else {
      return false;
    }
  }

  readTreeData = async () => {
    try {
      const newTreeData = JSON.parse(JSON.stringify(this.state.initTreeData));
      const sortBuilding = this.state.buildingList.sort((a, b) => a.name > b.name ? 1 : -1);
      if (sortBuilding && sortBuilding.length > 0) {
        sortBuilding.forEach((building) => {
          newTreeData[0].icon = <i className="fas fa-map-marker-alt" style={{ color: 'green' }}></i>;
          newTreeData[0].children.push({
            idx: building.idx,
            service_type: building.service_type,
            value: building.idx + ":" + building.service_type + ":" + building.name,
            label: building.name,
            icon: <i className="fas fa-city" style={{ color: 'white' }}></i>,
            showCheckbox: false,
            children: []
          });
        });
      }
      newTreeData[0].children.push({
        idx: 0,
        service_type: 'observer',
        value: '실외장치그룹',
        label: '실외장치그룹',
        icon: <i className="fas fa-city" style={{ color: 'white' }}></i>,
        showCheckbox: false,
        children: []
      });
      newTreeData[0].children.push({
        idx: 0,
        service_type: 'observer',
        value: '미등록 장치그룹',
        label: '미등록 장치그룹',
        icon: <i className="fas fa-tools" style={{ color: 'white' }}></i>,
        showCheckbox: false,
        children: []
      });
      if (this.state.floorList && this.state.floorList.length > 0) {
        const sortFloor = this.state.floorList.sort((a,b)=> a.name > b.name ? 1 : -1); 
        sortFloor.forEach((floor) => {
          const foundBuilding = newTreeData[0].children.find((itemBuilding) => (parseInt(itemBuilding.idx) === parseInt(floor.building_idx)) && (itemBuilding.service_type === floor.service_type));
          if (foundBuilding) {
            foundBuilding.children.push({
              idx: floor.idx,
              service_type: floor.service_type,
              value: floor.idx + ":" + floor.service_type + ":" + floor.name + ":" + floor.building_idx,
              label: floor.name,
              icon: <i className="fas fa-layer-group" style={{ color: 'white' }}></i>,
              showCheckbox: false,
              children: [],
            });
          }
        });
      }
      if (this.state.deviceList && this.state.deviceList.length > 0) {
        const building = newTreeData[0].children.find((building) => building.idx === 0 && building.value === '실외장치그룹');
        const building2 = newTreeData[0].children.find((building) => building.idx === 0 && building.value === '미등록 장치그룹');
        this.state.deviceList.forEach((device) => {
          // device의 floor_idx 가 0이면 실외지도에 배치된 장비임
          if (device.floor_idx === 0) {
            if (building) {
              if (device.type === 'ebell' && device.longitude && device.latitude) {
                building.children.push({
                  idx: device.idx,
                  service_type: device.service_type,
                  value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                  label: device.name,
                  icon: device.status === 1 || device.status === '1' ? <i className="fas fa-bell" style={{ color: 'red' }}></i> : <i className="fas fa-bell" style={{ color: 'white' }}></i>, 
                  showCheckbox: false,
                });
              }
              else if (device.type === 'ebell' && (device.longitude === null || device.latitude === null || device.longitude === 'null' || device.latitude === 'null' || device.longitude === '' || device.latitude === '')) {
                building2.children.push({
                  idx: device.idx,
                  service_type: device.service_type,
                  value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                  label: device.name,
                  icon: device.status === 1 || device.status === '1' ? <i className="fas fa-bell" style={{ color: 'red' }}></i> : <i className="fas fa-bell" style={{ color: 'white' }}></i>, 
                  showCheckbox: false,
                });
              }
              else if (device.type === 'guardianlite' && device.longitude && device.latitude) {
                building.children.push({
                  idx: device.idx,
                  service_type: device.service_type,
                  value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                  label: device.name,
                  icon: device.status === 1 || device.status === '1' ? <i className="fas fa-power-off" style={{ color: 'red' }}></i> : <i className="fas fa-power-off" style={{ color: 'white' }}></i>,
                  showCheckbox: false,
                });
              }
              else if (device.type === 'guardianlite' && (device.longitude === null || device.latitude === null || device.longitude === 'null' || device.latitude === 'null' || device.longitude === '' || device.latitude === '')) {
                building2.children.push({
                  idx: device.idx,
                  service_type: device.service_type,
                  value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                  label: device.name,
                  icon: device.status === 1 || device.status === '1' ? <i className="fas fa-power-off" style={{ color: 'red' }}></i> : <i className="fas fa-power-off" style={{ color: 'white' }}></i>,
                  showCheckbox: false,
                });
              }
              else if (device.type === 'door' && (device.longitude === null || device.latitude === null || device.longitude === 'null' || device.latitude === 'null' || device.longitude === '' || device.latitude === '')) {
                building2.children.push({
                  idx: device.idx,
                  service_type: device.service_type,
                  value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                  label: device.name,
                  icon: device.status === 1 || device.status === '1' ? <i className="fas fa-door-closed" style={{ color: 'red' }}></i> : <i className="fas fa-door-closed" style={{ color: 'white' }}></i>,
                  showCheckbox: false,
                })
              }
              else if (device.type === 'breathSensor' && (device.longitude === null || device.latitude === null || device.longitude === 'null' || device.latitude === 'null' || device.longitude === '' || device.latitude === '')) {
                building2.children.push({
                  idx: device.idx,
                  service_type: device.service_type,
                  value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                  label: device.name,
                  icon: device.status === 1 || device.status === '1' ? <i className="mdi mdi-pulse" style={{ color: 'red' }}></i> : <i className="mdi mdi-pulse" style={{ color: 'white' }}></i>,
                  showCheckbox: false,
                })
              }
            }
          } else {
            let foundFloor;
            for (let i = 0; i < newTreeData[0].children.length; i++) {
              const building = newTreeData[0].children[i];
              foundFloor = building.children.find((floor) => (floor.idx === device.floor_idx) && (floor.service_type === device.building_service_type));
              if (foundFloor) {
                if (device.type === 'ebell') {
                  foundFloor.children.push({
                    idx: device.idx,
                    service_type: device.service_type,
                    value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                    label: device.name,
                    icon: device.status === 1 || device.status === '1' ? <i className="fas fa-bell" style={{ color: 'red' }}></i> : <i className="fas fa-bell" style={{ color: 'white' }}></i>, 
                    showCheckbox: false,
                  });
                }
                else if (device.type === 'guardianlite') {
                  foundFloor.children.push({
                    idx: device.idx,
                    service_type: device.service_type,
                    value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                    label: device.name,
                    icon:  device.status === 1 || device.status === '1' ? <i className="fas fa-power-off" style={{ color: 'red' }}></i> : <i className="fas fa-power-off" style={{ color: 'white' }}></i>,
                    showCheckbox: false,
                  });
                }
                else if (device.type === 'door') {
                  foundFloor.children.push({
                    idx: device.idx,
                    service_type: device.service_type,
                    value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                    label: device.name,
                    icon:  device.status === 1 || device.status === '1' ? <i className="fas fa-door-closed" style={{ color: 'red' }}></i> : <i className="fas fa-door-closed"  style={{ color: 'white' }}></i>,
                    showCheckbox: false,
                  });
                }
                else if (device.type === 'breathSensor') {
                  foundFloor.children.push({
                    idx: device.idx,
                    service_type: device.service_type,
                    value: device.idx + ":" + device.name + ":" + device.service_type + ":" + device.ipaddress + ":" + device.type,
                    label: device.name,
                    icon:  device.status === 1 || device.status === '1' ? <i className="mdi mdi-pulse" style={{ color: 'red' }}></i> : <i className="mdi mdi-pulse"  style={{ color: 'white' }}></i>,
                    showCheckbox: false,
                  });
                }
                break;
              }
            }
          }
        });
      }
      if (this.state.cameraList && this.state.cameraList.length > 0) {
        const building = newTreeData[0].children.find((building) => building.idx === 0 && building.value === '실외장치그룹');
        const building2 = newTreeData[0].children.find((building) => building.idx === 0 && building.value === '미등록 장치그룹');
        this.state.cameraList.forEach((camera) => {
          // device의 floor_idx 가 0이면 실외지도에 배치된 장비임
          try {
            if (camera.floor_idx === 0) {
              if (camera.cameraid && camera.cameraname && camera.service_type && camera.ipaddress) {
                if (building) {
                  let iconColor = 'white';
                    if(camera.status === 1 || camera.status === '1') {
                      iconColor = 'red';
                    }
                  if (camera.longitude && camera.latitude) {
                    building.children.push({
                      id: camera.cameraid,
                      value: camera.cameraid + ":" + camera.cameraname + ":" + camera.service_type + ":" + camera.ipaddress,
                      label: camera.cameraid + "." + camera.cameraname,
                      icon: <i className="fas fa-video" style={{ color: iconColor }}></i>,
                      showCheckbox: false,
                    })
                  }
                  else if (camera.longitude === null || camera.latitude === null || camera.longitude === 'null' || camera.latitude === 'null' || camera.longitude === '' || camera.latitude === '') {
                    building2.children.push({
                      id: camera.cameraid,
                      value: camera.cameraid + ":" + camera.cameraname + ":" + camera.service_type + ":" + camera.ipaddress,
                      label: camera.cameraid + "." + camera.cameraname,
                      icon: <i className="fas fa-video" style={{ color: iconColor }}></i>,
                      showCheckbox: false,
                    })
                  }
                }
              }
            } else {
              if (camera.cameraid && camera.cameraname && camera.service_type && camera.ipaddress) {
                let foundFloor;
                for (let i = 0; i < newTreeData[0].children.length; i++) {
                  const building = newTreeData[0].children[i];
                  foundFloor = building.children.find((floor) => (floor.idx === camera.floor_idx) && (floor.service_type === camera.building_service_type));
                  if (foundFloor) {
                    let iconColor = 'white';
                    if(camera.status === 1 || camera.status === '1') {
                      iconColor = 'red';
                    }
                    foundFloor.children.push({
                      id: camera.cameraid,
                      value: camera.cameraid + ":" + camera.cameraname + ":" + camera.service_type + ":" + camera.ipaddress,
                      label: camera.cameraid + "." + camera.cameraname,
                      icon: <i className="fas fa-video" style={{ color: iconColor }}></i>,
                      showCheckbox: false,
                    });
                    break;
                  }
                }
              }
            }
          }
          catch (err) {
            console.log(err)
          }
        });
      }
      if (this.state.pidsList && this.state.pidsList.length > 0) {
        const building = newTreeData[0].children.find((building) => building.idx === 0 && building.value === '실외장치그룹');
        const building2 = newTreeData[0].children.find((building) => building.idx === 0 && building.value === '미등록 장치그룹');
        this.state.pidsList.forEach((pids) => {
          // device의 floor_idx 가 0이면 실외지도에 배치된 장비임
          try {
            if (pids.floor_idx === 0) {
              if (pids.pidsid && pids.pidsname && pids.service_type && pids.ipaddress) {
                if (building) {
                  if (pids.source_longitude && pids.source_latitude && pids.target_longitude && pids.target_latitude) {
                    building.children.push({
                      idx: pids.pidsid,
                      service_type: pids.service_type,
                      value: pids.pidsid + ":" + pids.pidsname + ":" + pids.service_type + ":" + pids.ipaddress + ":" + pids.type,
                      label: pids.pidsid,
                      icon: pids.status === 1 || pids.status === '1' ? <i className="mdi mdi-gate" style={{ color: 'red' }}></i> : <i className="mdi mdi-gate" style={{ color: 'white' }}></i>, 
                      showCheckbox: false,
                    });
                  }
                  else {
                    building2.children.push({
                      idx: pids.pidsid,
                      service_type: pids.service_type,
                      value: pids.pidsid + ":" + pids.pidsname + ":" + pids.service_type + ":" + pids.ipaddress + ":" + pids.type,
                      label: pids.pidsid,
                      icon: pids.status === 1 || pids.status === '1' ? <i className="mdi mdi-gate" style={{ color: 'red' }}></i> : <i className="mdi mdi-gate" style={{ color: 'white' }}></i>, 
                      showCheckbox: false,
                    });
                  }
                }
              } 
            } else {
              if (pids.pidsid && pids.pidsname && pids.service_type && pids.ipaddress) {
                let foundFloor;
                for (let i = 0; i < newTreeData[0].children.length; i++) {
                  const building = newTreeData[0].children[i];
                  foundFloor = building.children.find((floor) => (floor.idx === pids.floor_idx) && (floor.service_type === pids.building_service_type));
                  if (foundFloor) {
                    let iconColor = 'white';
                    if(pids.status === 1 || pids.status === '1') {
                      iconColor = 'red';
                    }
                    foundFloor.children.push({
                      id: pids.pidsid,
                      value: pids.pidsid + ":" + pids.pidsname + ":" + pids.service_type + ":" + pids.ipaddress,
                      label: pids.pidsid,
                      icon: <i className="mdi mdi-gate" style={{ color: iconColor }}></i>,
                      showCheckbox: false,
                    });
                    break;
                  }
                }
              }
            }
          }
          catch (err) {
            console.log(err)
          }
        });
      }


      let ebellCount = 0;
      let guardianCount = 0;
      let breathCount = 0;
      let doorCount = 0;
      const deviceCount = this.state.deviceList.map((device) => {
        if (device.type === 'ebell') {
          ebellCount += 1;
        } else if (device.type === 'guardianlite') {
          guardianCount += 1;
        } else if (device.type === 'breathSensor') {
          breathCount += 1; 
        } else if (device.type === 'door') {
          doorCount += 1;
        }
      })
      newTreeData[0].label = '장치 개수 (비상벨:' + ebellCount + ', 카메라:' + this.props.cameraList.length + ', 전원제어장치:' + guardianCount + ', 호흡센서:' + breathCount + ', 출입문:' + doorCount+ ')';
      this.setState({ treeData: newTreeData });
    } catch (error) {
      console.log('readTreeData Error:', error);
    }
  }

  componentDidMount() {
    try {
      // if (this.props.buildingList.length > 0 && this.props.floorList.length > 0 && this.props.deviceList.length > 0 && this.props.cameraList.length > 0) {
      if (this.props.buildingList.length > 0 && this.props.floorList.length > 0) {
        this.readTreeData();
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  componentDidUpdate(prevProps) { // || 변경여부
    if (this.props.deviceInformationValue.value !== prevProps.deviceInformationValue.value || this.props.deviceInformationValue.timestamp !== prevProps.deviceInformationValue.timestamp){
      this.setState({ handleHistoryDiv: 1})
    }
    if (this.props.buildingList !== prevProps.buildingList || this.props.floorList !== prevProps.floorList || this.props.deviceList !== prevProps.deviceList || this.props.cameraList !== prevProps.cameraList) {
      this.readTreeData();
      // if (this.props.buildingList.length > 0 && this.props.floorList.length > 0 && this.props.deviceList.length > 0 && this.props.cameraList.length > 0) {

      // }
    } else {
      return false;
    }
  }

  targetNodeValue = (targetNode) => {
    this.props.targetNodeValue(targetNode);
    this.getDeviceInfo(targetNode);
    setTimeout(() => {
      this.setTimeoutfunc(targetNode)
    }, 600);
    this.setState({
      handleHistoryDiv: 1,
      targetNodeIsParent: targetNode.isParent
    })
  }

  setTimeoutfunc = (targetNode) => {
    const nodeValueArr = targetNode.value.split(":");
    const cameraArr = this.props.cameraList;
    const deviceArr = this.props.deviceList;
    const pidsArr = this.props.pidsList;
    let selectNode = cameraArr.filter((camera) => camera.cameraid === nodeValueArr[0] && camera.ipaddress === nodeValueArr[3])
    let selectNode2 = deviceArr.filter((device) => device.ipaddress === nodeValueArr[3] && device.type === 'ebell')
    let selectNode3 = deviceArr.filter((device) => device.ipaddress === nodeValueArr[3] && device.type === 'guardianlite')
    let selectNode4 = deviceArr.filter((device) => device.ipaddress === nodeValueArr[3] && device.type === 'door')
    let selectNode5 = deviceArr.filter((device) => device.ipaddress === nodeValueArr[3] && device.type === 'breathSensor')
    let selectNode6 = pidsArr.filter((pids) => pids.pidsid === nodeValueArr[0] && pids.type === 'zone')
    if (selectNode.length > 0) {
      this.props.moveToTheThisDevice2(selectNode[0].cameraid, 'camera', selectNode[0].building_idx, selectNode[0].floor_idx, selectNode[0].building_service_type, new Date().getTime());
    }
    else if (selectNode2.length > 0) {
      this.props.moveToTheThisDevice2(selectNode2[0].id, selectNode2[0].type, selectNode2[0].building_idx, selectNode2[0].floor_idx, selectNode2[0].building_service_type, new Date().getTime());
    }
    else if (selectNode3.length > 0) {
      this.props.moveToTheThisDevice2(selectNode3[0].idx, selectNode3[0].type, selectNode3[0].building_idx, selectNode3[0].floor_idx, selectNode3[0].building_service_type, new Date().getTime());
    }
    else if (selectNode4.length > 0) {
      this.props.moveToTheThisDevice2(selectNode4[0].idx, selectNode4[0].type, selectNode4[0].building_idx, selectNode4[0].floor_idx, selectNode4[0].building_service_type, new Date().getTime());
    }
    else if (selectNode5.length > 0) {
      this.props.moveToTheThisDevice2(selectNode5[0].idx, selectNode5[0].type, selectNode5[0].building_idx, selectNode5[0].floor_idx, selectNode5[0].building_service_type, new Date().getTime());
    }
    else if (selectNode6.length > 0) {
      this.props.moveToTheThisDevice2(selectNode6[0].idx, selectNode6[0].type, selectNode6[0].building_idx, selectNode6[0].floor_idx, selectNode6[0].building_service_type, new Date().getTime());
    }
  }

  getDeviceInfo = (targetNode) => {
    const nodeValueArr = (targetNode.value || '').split(":");
    let deviceInfo = <div><p></p>
      <p className="preview-subject ellipsis mb-1">장치명: {nodeValueArr[1]} (IP: {nodeValueArr[3] !== undefined ? nodeValueArr[3] : 'IP 정보 없음'})</p>
      {/* <p className="preview-subject ellipsis mb-1">IP 주소: {event[0].ipaddress}</p>
      <p className="preview-subject ellipsis mb-1"> 장치 ID: {event[0].id}</p>
      <p className="preview-subject ellipsis mb-1">서비스 타입: {event[0].service_type}</p> */}
      <img src={require('../../assets/images/progress.png')}></img>
      <p className="preview-subject smart" >교체요망 (최근 30일 내 연결 끊어짐 10회 발생) </p>
      {/* <img src={require('../../assets/images/connected.png')} /> */}
    </div>
    if (targetNode && targetNode.children === undefined) {
      if (nodeValueArr && nodeValueArr.length > 0) {
        // 비상벨, 가디언라이트
        if (nodeValueArr.length === 5) {
          if (nodeValueArr[4] === 'ebell') {
            return <div>
              <img src={ebellImg} width='150px' height='150px' style={{ float: 'left' }} />
              {deviceInfo}
            </div>
          }
          else if (nodeValueArr[4] === 'guardianlite') {
            return <div>
              <img src={guardianImg} width='170px' height='150px' style={{ float: 'left', marginLeft: '5px' }} />
              {deviceInfo}
            </div>
          }
          else if (nodeValueArr[4] === 'breathSensor') {
            return <div>
              <img src={guardianImg} width='170px' height='150px' style={{ float: 'left', marginLeft: '5px' }} />
              {deviceInfo}
            </div>
          }
        }
        // 카메라
        else {
          return <div>
            <img src={cameraImg} width='150px' height='150px' style={{ float: 'left' }} />
            {deviceInfo}
          </div>
        }
      }
    }
  }

  render() {
    const nodeEventHistory = this.state;

    return (
      <div className={styles.deviceMenu} id='menu-deviceList'>
        <h4 className="card2-title mb-2 menuItem-dragHandler">
          &nbsp;장치 목록
        </h4>
        <span className={styles.handleDisplayMenu} onClick={() => this.props.handleMenuItem('deviceList', false)}>
          <i className="fa fa-minus"></i>
        </span>
        <div className='device-checkbox-tree'>
          <CheckboxTree
            nodes={this.state.treeData}
            checked={this.state.checked}
            expanded={this.state.expanded}
            showExpandAll={true}
            onCheck={checked => this.setState({ checked })}
            onExpand={expanded => this.setState({ expanded })}
            expandOnClick
            iconsClass="fa5"
            onClick={(targetNode) => this.targetNodeValue(targetNode)}
            labelStyle={{ color: "yellow" }}
          />
        </div>
        {/* {this.state.handleHistoryDiv !== 0 && 
        <div className="device-history">
          <h4 className="card2-title mb-2">
            &nbsp;장치 히스토리
          </h4> */}
          {/* <div className='device-info'>
            {this.state.handleHistoryDiv === 1 && this.state.nodeEventHistory.length >= 0 ? <div className='card-event2'><div>{this.getDeviceInfo(this.state.selectNode)}</div></div> : <div></div>}
          </div>
          <h4 className="card2-title mb-3">
            &nbsp;장치 히스토리
          </h4> */}
          {/* {this.state.nodeEventHistory.length !== 0 ?
            <div className="device-history2">
              <div className="card table">
                <div className="card-body2 table">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th width='50px' style={{ textAlign: 'center' }}></th>
                          <th width='230px' style={{ textAlign: 'center' }}>이벤트 명</th>
                          <th width='170px' style={{ textAlign: 'center' }}>발생시간</th>
                        </tr>
                      </thead>
                      <tbody >
                        {this.state.nodeEventHistory && this.state.nodeEventHistory.map((event, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ padding: '5px' }}>
                                <div className={this.state.iconBoxColor[event.event_type_severity]}>
                                  <EventTypeIcons
                                    event={event}
                                  />
                                </div>
                              </td>
                              <td width='230px' style={{ textAlign: 'center', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}> {event.event_type_name}</td>
                              <td style={{ padding: '3px', textAlign: 'center' }} width='200px'>{event.event_occurrence_time ? (event.event_occurrence_time.trim().length > 0 ? format(parse(event.event_occurrence_time.substring(0, 15).replace('T', ''), 'yyyyMMddHHmmss', new Date()), 'yyyy-MM-dd HH:mm:ss') : format(parse(event.event_occurrence_time.substring(0, 15).replace('T', ''), 'yyyyMMddHHmmss', new Date()), 'yyyy-MM-dd HH:mm:ss')) : ''}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            :
            this.state.handleHistoryDiv === 1 && this.state.nodeEventHistory.length === 0 && this.state.targetNodeIsParent === false ? <div> <br /> <p style={{ marginLeft: '20px' }} className="preview-subject ellipsis mb-1">선택한 장치의 히스토리 내역이 없습니다.</p> </div> : <div></div>
          } */}
        {/* </div> */}
      </div> 
    );
  }
}

export default NewDeviceTree;

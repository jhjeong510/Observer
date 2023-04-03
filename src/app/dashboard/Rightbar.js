import React, { Component } from 'react';
import axios from 'axios';
import NewDeviceTree from './NewDeviceTree';
import DeviceTree from './DeviceTree';
import AccessControl from './AccessControl';
import "react-tabs/style/react-tabs.css";
import styles from './Rightbar.module.css';

class Rightbar extends Component {

  state = {
    selectedTabIndex: 0,
    targetNodeValue: '',
    nodeEventHistory: [],
    key: 'NewDeviceTree',
    selectNode:'',
    cameraId: undefined,
    startDateTime: undefined,
  };

  componentDidUpdate(prevProps) {
    if (this.props.deviceInformationValue.value !== prevProps.deviceInformationValue.value || this.props.deviceInformationValue.timestamp !== prevProps.deviceInformationValue.timestamp) {
      this.targetNodeValueFunction(this.props.deviceInformationValue);
      this.setState({ key: 'NewDeviceTree'});
    }
  }

  targetNodeValueFunction = async (targetNodeValue) => {
    const nodeValueArr = targetNodeValue.value.split(":");
    let nodeIp = '';
    let deviceId = '';
    let serviceType = '';
    if (nodeValueArr.length > 3) {
      if(nodeValueArr[2] === 'accesscontrol') {
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
          this.setState({
            nodeEventHistory: result.data.result,
            selectNode: targetNodeValue
          });
        }
      } else {
        console.log('res is undefined');
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async componentWillUnmount() {
    console.log('componentWillUnmount');
    await this.handleDisconnectSocket();
  }

  render() {
    return (
      <div className={styles.rightBar} id='rightbar'>
        <DeviceTree
          targetNodeValue={this.targetNodeValueFunction}
          nodeEventHistory={this.state.nodeEventHistory}
          buildingList={this.props.buildingList}
          floorList={this.props.floorList}
          deviceList={this.props.deviceList}
          cameraList={this.props.cameraList}
          pidsList={this.props.pidsList}
          selectNode={this.state.selectNode}
          moveToTheThisDevice2={this.moveToTheThisDevice2}
          deviceInformationValue={this.props.deviceInformationValue}
          handleMenuItem={this.props.handleMenuItem}
        />
        {/* <NewDeviceTree
          targetNodeValue={this.targetNodeValueFunction}
          nodeEventHistory={this.state.nodeEventHistory}
          buildingList={this.props.buildingList}
          floorList={this.props.floorList}
          deviceList={this.props.deviceList}
          cameraList={this.props.cameraList}
          pidsList={this.props.pidsList}
          selectNode={this.state.selectNode}
          moveToTheThisDevice2={this.moveToTheThisDevice2}
          deviceInformationValue={this.props.deviceInformationValue}
          handleMenuItem={this.props.handleMenuItem}
        /> */}
        <AccessControl
          cameraList={this.props.cameraList}
          eventList={this.props.eventList}
          accessControlLog={this.props.accessControlLog}
          readAccessControlLog={this.props.readAccessControlLog}
          moveToTheThisDevice={this.props.moveToTheThisDevice}
          deviceList={this.props.deviceList}
          handleMenuItem={this.props.handleMenuItem}
        />
    </div>
    )
  }
}


export default Rightbar;
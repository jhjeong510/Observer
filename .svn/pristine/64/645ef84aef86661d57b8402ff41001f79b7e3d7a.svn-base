import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { UserInfoContext } from '../context/context';
import EventStatus from './EventStatus';
import EventList from './EventList';
import styles from './Leftbar.module.css';
import CustomComponent from './CustomComponent';

class Leftbar extends Component {

  state = {
    deviceList: this.props.deviceList,
    events: this.props.events,
    eventList: this.props.eventList,
  }

  static contextType = UserInfoContext; 

  render() {

    return (
      <div className={styles.leftbar} id='leftbar'>
        <CustomComponent
          handleCustomLayout={this.props.handleCustomLayout}
          serviceTypes={this.props.serviceTypes}
          handleChangeServiceTypeName={this.props.handleChangeServiceTypeName}
          eventListUpdate={this.props.eventListUpdate}
          handleShowInquiryModal={this.props.handleShowInquiryModal}
          handleCheckServiceTypeUseOrNot={this.props.handleCheckServiceTypeUseOrNot}
          handleChangeDateTimeFormat={this.props.handleChangeDateTimeFormat}
          moveToTheThisDevice={this.props.moveToTheThisDevice}
          userId={this.props.userId}
          eventDetail={this.props.eventDetail}
          handleShowEventDetail={this.props.handleShowEventDetail}
          buildingList={this.props.buildingList}
          floorList={this.props.floorList}
          deviceList={this.props.deviceList}
          cameraList={this.props.cameraList}
          pidsList={this.props.pidsList}
          deviceInformationValue={this.props.deviceInformationValue}
          accessControlLog={this.props.accessControlLog}
          readAccessControlLog={this.props.readAccessControlLog}
          layout={this.props.leftLayout1}
          layoutNumber={1}
        />
        <CustomComponent
          handleCustomLayout={this.props.handleCustomLayout}
          serviceTypes={this.props.serviceTypes}
          handleChangeServiceTypeName={this.props.handleChangeServiceTypeName}
          eventListUpdate={this.props.eventListUpdate}
          handleShowInquiryModal={this.props.handleShowInquiryModal}
          handleCheckServiceTypeUseOrNot={this.props.handleCheckServiceTypeUseOrNot}
          handleChangeDateTimeFormat={this.props.handleChangeDateTimeFormat}
          moveToTheThisDevice={this.props.moveToTheThisDevice}
          userId={this.props.userId}
          eventDetail={this.props.eventDetail}
          handleShowEventDetail={this.props.handleShowEventDetail}
          buildingList={this.props.buildingList}
          floorList={this.props.floorList}
          deviceList={this.props.deviceList}
          cameraList={this.props.cameraList}
          pidsList={this.props.pidsList}
          deviceInformationValue={this.props.deviceInformationValue}
          accessControlLog={this.props.accessControlLog}
          readAccessControlLog={this.props.readAccessControlLog}
          layout={this.props.leftLayout2}
          layoutNumber={2}
        />
      </div>
    )
  }
}

export default Leftbar;
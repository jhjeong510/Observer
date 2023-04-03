import React from 'react';
import styles from './DoorAccessPerson.module.css';

export default function DoorAccessPerson({
  websocketUrl,
  deviceList,
  currBuildingIdx,
  currFloorIdx,
  currBuildingServiceType
}) {
  if (deviceList) {
    const doors = deviceList.filter(device => {
      if (device.type === 'door' &&
        device.building_idx === currBuildingIdx &&
        device.floor_idx === currFloorIdx &&
        device.building_service_type === currBuildingServiceType) {
        return true;
      } else {
        return false;
      }
    });
    if (doors.length > 0) {
      return doors.map((door, index) => {
        const divStyle = {
          top: parseInt(door.top_location) - 106,
          left: parseInt(door.left_location) - 43,
          animation: 'bounce_frames 0.5s',
          animationDirection: 'alternate',
          animationTimingFunction: 'cubic-bezier(.5, 0.05,1,.5)',
          animationIterationCount: 4,
        }
        return (
          <div className={styles.accessDoorPerson} id={'door' + door.id} style={divStyle} key={index}>
            <img src={`http://${websocketUrl}/images/access_control_person/${'1.png'}`} style={{ height: '90px', width: '80px' }} />
          </div>
        );
      });
    } else {
      return '';
    }
  }

}

import React from 'react'
import iconBlinker from '../../assets/images/alert.webp';

export default function BlinkDeviceEventIcon({ deviceList, breathSensorList, currBuildingIdx, currFloorIdx, currBuildingServiceType }) {
	if (deviceList) {
		const devices = deviceList.filter(device => {
			if (device.type !== 'building' && device.type !== 'pids' &&
				device.building_idx === currBuildingIdx &&
				device.floor_idx === currFloorIdx &&
				device.building_service_type === currBuildingServiceType) {
				return true;
			} else {
				return false;
			}
		});

		if (devices.length > 0) {
			return devices.map((device, index) => {
				const res = document.getElementsByClassName('device' + device.id);
				if (res) {
					const divStyle = {
						position: 'absolute',
						top: parseInt(device.top_location) - 20,
						left: parseInt(device.left_location) + 20,
						border: '0px solid black',
						backgroundColor: '#ffffff',
						backgroundColor: 'rgba( 255, 255, 255, 0 )',
						display: 'none',
						zIndex: 99
					}

					if (device.status != 0 && device.status != '0' && device.status != null) {
						divStyle.display = 'initial';
					}
					return (
						<div className={'device' + device.id} style={divStyle} key={index}>
							<img src={iconBlinker} style={{ height: '20px', width: '20px' }} />
						</div>
					);
				} else {
					return ''
				}
			});
		} else {
			return ''
		}
	}
}


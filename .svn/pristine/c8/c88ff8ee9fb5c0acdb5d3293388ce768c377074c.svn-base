import React from 'react'
import iconBlinker from '../../assets/images/alert.webp';

export default function BlinkDeviceEventIcon({ cameraList, currBuildingIdx, currFloorIdx, currBuildingServiceType }) {
	if (cameraList) {
		const cameras = cameraList.filter(camera => {
			if (camera.type !== 'building' &&
				camera.building_idx === currBuildingIdx &&
				camera.floor_idx === currFloorIdx &&
				camera.building_service_type === currBuildingServiceType) {
				return true;
			} else {
				return false;
			}
		});

		if (cameras.length) {
			return cameras.map((camera, index) => {
				const res = document.getElementsByClassName('camera.' + camera.cameraid);
				if (res) {
					const divStyle = {
						position: 'absolute',
						top: parseInt(camera.top_location) - 20,
						left: parseInt(camera.left_location) + 20,
						border: '0px solid black',
						backgroundColor: '#ffffff',
						backgroundColor: 'rgba( 255, 255, 255, 0 )',
						display: 'none',
						zIndex: 99
					}
					if (camera.status != 0 && camera.status != '0' && camera.status != null) {
						divStyle.display = 'initial';
					}
					return (
						<div className={'camera.' + camera.cameraid} style={divStyle} key={index}>
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
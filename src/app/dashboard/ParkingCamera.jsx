import React from 'react';
import ParkingCameraStream from './ParkingCameraStream';

export default function ParkingCamera({ parkingCameras, parkingCamera, socketClient, socketCameraRef, handleConnectSocket, handleDisconnectSocket, parkingCoordsUpdate, parkingSpaceUpdate }) {

	if (parkingCameras) {
		return parkingCameras.map((parkingCamera) => {
			return <div key={parkingCamera.idx}>
				<ParkingCameraStream
					oneCamera={parkingCameras.length === 1}
					cameraId={parkingCamera.camera_id}
					socket={socketClient}
					socketCameraRef={socketCameraRef}
					handleConnectSocket={handleConnectSocket}
					handleDisconnectSocket={handleDisconnectSocket}
					cameraIp={parkingCamera.ipaddress}
					parkingCoordsUpdate={parkingCoordsUpdate}
					parkingSpaceUpdate={parkingSpaceUpdate}
				/>
			</div>
		})
	} else if (parkingCamera) {
		return <div>
			<ParkingCameraStream
				oneCamera
				cameraId={parkingCamera.camera_id}
				socket={socketClient}
				socketCameraRef={socketCameraRef}
				handleConnectSocket={handleConnectSocket}
				handleDisconnectSocket={handleDisconnectSocket}
				cameraIp={parkingCamera.ipaddress}
				parkingCoordsUpdate={parkingCoordsUpdate}
				parkingSpaceUpdate={parkingSpaceUpdate}
			/>
		</div>
	}
}
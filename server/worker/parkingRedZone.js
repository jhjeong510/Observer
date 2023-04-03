const dbManager = require('../db/dbManager');
const { format } = require('date-fns');

const parkingRedZoneCheck = async () => {
	try {
		const redZoneCheckTimeSetting = await dbManager.pgQuery(`SELECT * FROM ob_setting WHERE name='setting detection time for red-zone'`);
		const redZoneCheckTime = redZoneCheckTimeSetting.rows[0].setting_value * 1000;

		const parkingSpaces = await dbManager.pgQuery(`SELECT * FROM ob_parking_space`);
		const redZones = parkingSpaces.rows.filter(space => space.occupancy === '1' && space.type === 4);
		const parkingBox = redZones.reduce((pb, parking) => {
			pb[`${parking.camera_ip}/${parking.index_number}`] = {
				last_checked_time: Date.parse(parking.updated_at)
			};
			return pb;
		}, {});

		const now = Date.now();
		const parkingSpacesToCheck = Object.entries(parkingBox).filter(([key, value]) => {
			const diff = now - value.last_checked_time;
			return diff >= redZoneCheckTime;
		});

		for (const [key, value] of parkingSpacesToCheck) {
			const [redZoneIpaddress, index_number] = key.split('/');
			try {
				const ipaddress = redZones.find(row => index_number === row.index_number).camera_ip;
				const parkingCameraInfo = await dbManager.pgQuery(`SELECT * FROM ob_camera WHERE ipaddress='${ipaddress}'`);
				if (parkingCameraInfo.rows.length > 0) {
					const areaCheck = `SELECT * FROM ob_parking_space WHERE index_number='${index_number}' AND camera_ip='${redZoneIpaddress}' AND type=${4}`;
					const resArea = await dbManager.pgQuery(areaCheck);
					const queryEvent = `SELECT * FROM ob_event WHERE ipaddress='${ipaddress}' AND description='${resArea.rows[0].parking_area} 주차구역 ${index_number}번' AND acknowledge=false`;
					const resEvent = await dbManager.pgQuery(queryEvent);
					if (!resEvent.rows || resEvent.rows.every(row => row.acknowledge === true)) {
						const sqlEvent = `INSERT INTO ob_event (name, description, id, building_idx, floor_idx, event_occurrence_time, device_type, ipaddress, service_type, event_type, camera_id) VALUES ('주차금지구역 이벤트', '${resArea.rows[0].parking_area} 주차구역 ${index_number}번', '${parkingCameraInfo.rows[0].id}', ${parkingCameraInfo.rows[0].building_idx}, ${parkingCameraInfo.rows[0].floor_idx}, '${format(now, 'yyyyMMdd')}' || 'T' || '${format(now, 'HHmmss')}', 'camera', '${ipaddress}', 'parkingcontrol', ${parseInt(35)}, '${parkingCameraInfo.rows[0].id}');`;
						const resEventInsert = await dbManager.pgQuery(sqlEvent);
						if (global.websocket && resEventInsert.rowCount > 0) {
							global.websocket.emit("eventList", { eventList: resEvent.rowCount });
							global.websocket.emit("parkingEvent", { parkingEvent: resEventInsert.rowCount });
							value.last_checked_time = now;
						}
					}
				}
			} catch (error) {
				console.log('parkingRedZone event error:', error);
			}
		}
	} catch (err) {
		console.log('check parking redZone function err: ', err);
	}
}

module.exports = {
	parkingRedZoneCheck
}
import React, { useEffect, useState, useRef } from 'react';
import styles from './ParkingInfo.module.css';
import ParkingType from './ParkingType';
import parking_all from '../../assets/icon/parking_all.png';
import { getParkingSpace } from './api/apiService';

export default function ParkingInfo({ parkingCameras, parkingCamera, parkingAreaUpdate, parkingSpaceUpdate }) {
	const isMountedRef = useRef();
	const [typeList, setTypeList] = useState(Object.entries(ParkingType));
	const [totalAvailable, setTotalAvailable] = useState(0);
	const [totalOccupancy, setTotalOccupancy] = useState(0);
	const [statusByType, setStatusByType] = useState([
		{ value: 0, avail: 0, total: 0 },
		{ value: 1, avail: 0, total: 0 },
		{ value: 2, avail: 0, total: 0 },
		{ value: 3, avail: 0, total: 0 },
		{ value: 4, avail: 0, total: 0 },
	]);

	const settingTotalStatus = async () => {
		let total_available = 0;
		let total_occupancy = 0;
		if (parkingCameras) {
			const totalAvailableVal = parkingCameras.map((parkingCamera) => parkingCamera.total_available).reduce(
				(prev, curr) => parseInt(prev) + parseInt(curr),
				total_available
			)
			const totalOccupiedVal = parkingCameras.map((parkingCamera) => parkingCamera.total_occupied).reduce(
				(prev, curr) => parseInt(prev) + parseInt(curr),
				total_occupancy
			)
			if (isMountedRef.current) {
				setTotalAvailable(totalAvailableVal);
				setTotalOccupancy(totalOccupiedVal);
			}
		}
	}

	const settingStatusByType = async (camera_ip) => {
		const statusByTypeArr = [
			{ value: 0, avail: 0, total: 0 },
			{ value: 1, avail: 0, total: 0 },
			{ value: 2, avail: 0, total: 0 },
			{ value: 3, avail: 0, total: 0 },
			{ value: 4, avail: 0, total: 0 },
		];
		try {
			const res = await getParkingSpace(camera_ip);
			if (res && res.data && res.data.result) {
				await res.data.result.forEach(async (space) => {
					const findType = statusByTypeArr.find((type) => type.value === space.type);
					if (findType) {
						if (space.occupancy === '0') {
							findType.avail += 1;
							findType.total += 1;
						} else if (space.occupancy === '1') {
							findType.total += 1;
						}
					}
				})
				isMountedRef.current && await setStatusByType(statusByTypeArr);
			}
		} catch (err) {
			console.log('settingStatusByType func err: ', err);
		}
	}

	useEffect(() => {
		isMountedRef.current = new Date();
		if (parkingCameras) {
			settingTotalStatus();
			settingStatusByType();
		} else if (parkingCamera) {
			settingStatusByType(parkingCamera.ipaddress);
		}
		return () => {
			isMountedRef.current = null;
			// console.log('unmount');
		}
	}, []);

	useEffect(() => {
		if (parkingSpaceUpdate) {
			if (parkingCameras) {
				settingTotalStatus();
				settingStatusByType();
			} else if (parkingCamera) {
				settingStatusByType(parkingCamera.ipaddress);
			}
		}
	}, [parkingSpaceUpdate])

	useEffect(() => {
		if (parkingAreaUpdate) {
			if (parkingCameras) {
				settingTotalStatus();
				settingStatusByType();
			} else if (parkingCamera) {
				settingStatusByType(parkingCamera.ipaddress);
			}
		}
	}, [parkingAreaUpdate])

	if (parkingCamera) {
		return (
			<>
				<table className={styles.parking_status_table} >
					<tbody>
						<tr key={0} className={styles.parking_status_all}>
							<td className={styles.parking_type_label_all}>
								<span className={styles.parking_type_icon}><img src={parking_all} /></span>
								<span className={styles.parking_type_text}>전체</span>
							</td>
							{/* <td className={styles.avail_count}>{parseInt(parkingCamera.total_occupied) !== (parseInt(parkingCamera.total_available) + parseInt(parkingCamera.total_occupied)) ? <span className={styles.occupancy_full}>FULL</span> : parseInt(parkingCamera.total_occupied)}</td> */}
							<td className={styles.avail_count}>{parseInt(parkingCamera.total_occupied) !== (parseInt(parkingCamera.total_available) + parseInt(parkingCamera.total_occupied)) ? parseInt(parkingCamera.total_available) : <span className={styles.occupancy_full}>FULL</span>}</td>
							<td className={styles.total_count}>{parseInt(parkingCamera.total_available) + parseInt(parkingCamera.total_occupied)}</td>
						</tr>
						{typeList && typeList !== undefined && typeList.map((type, index) => {
							return (
								<tr key={index + 1} className={styles.type_detail_row}>
									<td key={index} className={styles.parking_type_label} style={{ backgroundColor: type[1].color }}>
										<span className={styles.parking_type_icon}>{type[1].icon && type[1].icon}</span>
										<span className={styles.parking_type_text}>{type[1].type_name}</span>
									</td>
									<td className={styles.avail_count}>{(statusByType[type[1].value].avail === 0 && statusByType[type[1].value].total !== 0) ? <span className={styles.occupancy_full}>FULL</span> : statusByType[type[1].value].avail}</td>
									<td className={styles.total_count}>{statusByType[type[1].value].total}</td>
								</tr>
							)
						})
						}
					</tbody>
				</table>
			</>
		)
	} else {
		return (
			<>
				<table className={styles.parking_status_table} >
					<tbody>
						<tr key={0} className={styles.parking_status_all}>
							<td className={styles.parking_type_label_all}>
								<span className={styles.parking_type_icon}><img src={parking_all} /></span>
								<span className={styles.parking_type_text}>전체</span>
							</td>
							<td className={styles.avail_count}>{totalAvailable}</td>
							<td className={styles.total_count}>{totalAvailable + totalOccupancy}</td>
						</tr>
						{typeList && typeList !== undefined && typeList.map((type, index) => {
							return (
								<tr key={index + 1} className={styles.type_detail_row}>
									<td key={index} className={styles.parking_type_label} style={{ backgroundColor: type[1].color }}>
										<span className={styles.parking_type_icon}>{type[1].icon && type[1].icon}</span>
										<span className={styles.parking_type_text}>{type[1].type_name}</span>
									</td>
									<td className={styles.avail_count}>{(statusByType[type[1].value].avail === 0 && statusByType[type[1].value].total !== 0) ? <span className={styles.occupancy_full}>FULL</span> : statusByType[type[1].value].avail}</td>
									<td className={styles.total_count}>{statusByType[type[1].value].total}</td>
								</tr>
							)
						})
						}
					</tbody>
				</table>
			</>
		)
	}
}
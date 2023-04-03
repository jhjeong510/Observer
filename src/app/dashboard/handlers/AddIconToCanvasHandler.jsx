import { fabric } from "fabric";
import iconEbell from '../icons/ebell.ico';
import iconGuardianlite from '../icons/guardianlite.ico';
import iconBreathsensor from '../icons/breathsensor.png';
import iconBuilding from '../icons/building.ico';
import iconCamera from '../icons/cctv.ico';
import iconDoor from '../icons/door.ico';
import iconVCounter from '../icons/parking-lot.png';
import iconMdet from '../icons/mdetIcon.png';

export default function AddIconToMap(canvas, buildingList, cameraList, deviceList, pidsList, buildingInfo, breathSensorList, inside, guardianlites) {
	fabric.Group.prototype.hasControls = false;
	if (canvas && buildingList && buildingList.length > 0) {
		const removedBuildingObjs = canvas.getObjects().filter((objDetail) => (objDetail.data && objDetail.data.type) === 'building').filter((buildingObj) => !buildingList.some((building) => ((building.service_type === buildingObj.data.serviceType) && (building.idx === buildingObj.data.idx))))
		if (removedBuildingObjs && removedBuildingObjs.length > 0) {
			canvas.remove(removedBuildingObjs[0]);
		}
		buildingList.forEach(async (building, index) => {
			if (building.left_location || building.top_location || building.left_location !== 'null' || building.top_location !== 'null' ||
				building.left_location !== 'undefined' || building.top_location !== 'undefined') {
				const shadow = new fabric.Shadow({
					color: "black",
					blur: 15,
					offsetX: 8,
					offsetY: 11,
				});
				const eventShadow = new fabric.Shadow({
					color: "red",
					blur: 30,
				});
				let label;
				label = new fabric.Text(building.name, { fill: 'black', left: 700, fontSize: 25, fontWeight: 800, top: 500, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
				fabric.Image.fromURL(iconBuilding, function (oImg) {
					oImg.set({
						left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
						data: {
							icon: 'buildingicon',
							id: 'building_' + building.idx,
							idx: building.idx,
							type: 'building',
							buildingIdx: building.idx,
							name: building.name,
							serviceType: building.service_type
						},
					})
					let group = new fabric.Group([label, oImg], {
						data: {
							icon: 'buildingicon',
							id: 'building_' + building.idx,
							idx: building.idx,
							type: 'building',
							buildingIdx: building.idx,
							name: building.name,
							serviceType: building.service_type
						},
						scaleX: 0.87,
						scaleY: 0.87,
						left: parseInt(building.left_location),
						top: parseInt(building.top_location),
						selectable: false,
						shadow: building.status === 0 || building.status === '0' ? shadow : eventShadow,
						subTargetCheck: true,
						objectCaching: false,
					});

					const groupLeft = group.left;
					const groupTop = group.top;

					if (building.status === 1 || building.status === '1') {
						// group.animate('top', group.top ? group.top + 15 : groupTop, {
						// 	onChange: canvas.renderAll.bind(canvas),
						// 	onComplete: function onComplete() {
						// 		group.animate(
						// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
						// 			{
						// 				duration: 1500,
						// 				onChange: canvas.renderAll.bind(canvas),
						// 				onComplete: onComplete
						// 			});
						// 	}
						// });
					}
					group.subTargetCheck = true;
					const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
					group.set({ left: parseInt(camCoordsLeft) })
					group.setCoords();
					const isBuildingDetail = canvas.getObjects().find((objDetail) => objDetail.data.id === ('building_' + building.idx) && objDetail.data.name === building.name);
					if (isBuildingDetail) {
						canvas.remove(isBuildingDetail);
						canvas.add(group);
					} else {
						canvas.add(group);
					}
				})
			}
		})
	}
	if (canvas && cameraList && cameraList.length > 0) {
		const removedCameraObjs = canvas.getObjects().filter((objDetail) => objDetail.data.type === 'camera').filter((cameraObj) => !cameraList.some((cameraDetail) => ((cameraDetail.ipaddress === cameraObj.data.ipaddress) && (cameraDetail.id === cameraObj.data.camera_id))))
		if (removedCameraObjs && removedCameraObjs.length > 0) {
			canvas.remove(removedCameraObjs[0]);
		}
		cameraList.some(function (camera, index) {
			if (!inside || undefined) { // 실외
				if ((camera.building_idx === 0 && camera.floor_idx === 0 && camera.building_service_type === 'observer') &&
					(camera.left_location || camera.top_location || camera.left_location !== 'null' || camera.top_location !== 'null' ||
						camera.left_location !== 'undefined' || camera.top_location !== 'undefined')) {
					const shadow = new fabric.Shadow({
						color: "black",
						blur: 15,
						offsetX: 8,
						offsetY: 11,
					});
					const eventShadow = new fabric.Shadow({
						color: "red",
						blur: 30,
					});
					let label = new fabric.Text(camera.cameraname, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
					fabric.Image.fromURL(iconCamera, function (oImg) {
						oImg.set({
							left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
							data: {
								id: 'camera_' + camera.cameraid,
								icon: 'cameraicon',
								device_id: camera.cameraid,
								camera_id: camera.cameraid,
								type: 'camera',
								device_type: 'camera',
								// idx: index,
								label: camera.cameraid + '.' + camera.cameraname,
								camera_type: 'camera',
								buildingIdx: camera.building_idx,
								floorIdx: camera.floor_idx,
								buildingName: camera.buildingname,
								floorName: camera.floorname,
								buildingServiceType: camera.building_service_type,
								ipaddress: camera.ipaddress,
								service_type: camera.service_type,
								name: camera.cameraname,
							},
						})
						let group = new fabric.Group([label, oImg], {
							data: {
								id: 'camera_' + camera.cameraid,
								icon: 'cameraicon',
								device_id: camera.cameraid,
								camera_id: camera.cameraid,
								type: 'camera',
								device_type: 'camera',
								idx: index,
								label: camera.cameraid + '.' + camera.cameraname,
								camera_type: 'camera',
								buildingIdx: camera.building_idx,
								floorIdx: camera.floor_idx,
								buildingServiceType: camera.building_service_type,
								location: camera.location,
								buildingName: camera.buildingname,
								floorName: camera.floorname,
								ipaddress: camera.ipaddress,
								service_type: camera.service_type,
								name: camera.cameraname,
							},
							scaleX: 0.7,
							scaleY: 0.7,
							left: parseInt(camera.left_location),
							top: parseInt(camera.top_location),
							selectable: false,
							shadow: camera.status === 0 || camera.status === '0' ? shadow : eventShadow,
							subTargetCheck: true,
							objectCaching: false,
						});
						const groupTop = group.top;
						if (camera.status === 1 || camera.status === '1') {
							// group.animate('top', group.top ? group.top + 15 : groupTop, {
							// 	onChange: canvas.renderAll.bind(canvas),
							// 	onComplete: function onComplete() {
							// 		group.animate(
							// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
							// 			{
							// 				duration: 1500,
							// 				onChange: canvas.renderAll.bind(canvas),
							// 				onComplete: onComplete
							// 			});
							// 	}
							// });
						}
						group.subTargetCheck = true;
						const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
						group.set({ left: parseInt(camCoordsLeft) })
						group.setCoords();
						const isCameraDetail = canvas.getObjects().find((objDetail) => objDetail.data.label === (camera.cameraid + '.' + camera.cameraname) && (objDetail.data.ipaddress === camera.ipaddress));
						if (isCameraDetail) {
							canvas.remove(isCameraDetail);
							canvas.add(group);
						} else {
							canvas.add(group);
						}
					})
				}
			} else if (inside) { // 실내
				if (camera.left_location || camera.top_location || camera.left_location !== 'null' || camera.top_location !== 'null' ||
					camera.left_location !== 'undefined' || camera.top_location !== 'undefined') {
					if ((camera.building_idx !== buildingInfo.buildingIdx) || (camera.floor_idx !== buildingInfo.floorIdx)) { return }
					const shadow = new fabric.Shadow({
						color: "black",
						blur: 15,
						offsetX: 8,
						offsetY: 11,
					});
					const eventShadow = new fabric.Shadow({
						color: "red",
						blur: 30,
					});
					let label = new fabric.Text(camera.cameraname, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
					fabric.Image.fromURL(iconCamera, function (oImg) {
						oImg.set({
							left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
							data: {
								id: 'camera_' + camera.cameraid,
								icon: 'cameraicon',
								device_id: camera.cameraid,
								camera_id: camera.cameraid,
								type: 'camera',
								device_type: 'camera',
								idx: index,
								label: camera.cameraid + '.' + camera.cameraname,
								camera_type: 'camera',
								buildingIdx: camera.building_idx,
								floorIdx: camera.floor_idx,
								buildingName: camera.buildingname,
								floorName: camera.floorname,
								buildingServiceType: camera.building_service_type,
								ipaddress: camera.ipaddress,
								service_type: camera.service_type,
								name: camera.cameraname,
							},
						})
						let group = new fabric.Group([label, oImg], {
							data: {
								id: 'camera_' + camera.cameraid,
								icon: 'cameraicon',
								device_id: camera.cameraid,
								camera_id: camera.cameraid,
								type: 'camera',
								device_type: 'camera',
								idx: index,
								label: camera.cameraid + '.' + camera.cameraname,
								camera_type: 'camera',
								buildingIdx: camera.building_idx,
								floorIdx: camera.floor_idx,
								buildingServiceType: camera.building_service_type,
								ipaddress: camera.ipaddress,
								buildingName: camera.buildingname,
								floorName: camera.floorname,
								service_type: camera.service_type,
								name: camera.cameraname,
							},
							scaleX: 0.7,
							scaleY: 0.7,
							left: parseInt(camera.left_location),
							top: parseInt(camera.top_location),
							selectable: false,
							shadow: camera.status === 0 || camera.status === '0' ? shadow : eventShadow,
							subTargetCheck: true,
							objectCaching: false,
						});
						const groupTop = group.top;
						if (camera.status === 1 || camera.status === '1') {
							// group.animate('top', group.top ? group.top + 15 : groupTop, {
							// 	onChange: canvas.renderAll.bind(canvas),
							// 	onComplete: function onComplete() {
							// 		group.animate(
							// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
							// 			{
							// 				duration: 1500,
							// 				onChange: canvas.renderAll.bind(canvas),
							// 				onComplete: onComplete
							// 			});
							// 	}
							// });
						}
						group.subTargetCheck = true;
						const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
						group.set({ left: parseInt(camCoordsLeft) })
						group.setCoords();
						const isCameraDetail = canvas.getObjects().find((objDetail) => objDetail.data.label === (camera.cameraid + '.' + camera.cameraname) && (objDetail.data.ipaddress === camera.ipaddress));
						if (isCameraDetail) {
							canvas.remove(isCameraDetail);
							canvas.add(group);
						} else {
							canvas.add(group);
						}
					})
				}
			}
		})
	}

	if (canvas && deviceList && deviceList.length > 0) {
		const removedDeviceObjs = canvas.getObjects().filter((objDetail) => (objDetail.data.type === 'ebell' || objDetail.data.type === 'door' || objDetail.data.type === 'mdet')).filter((deviceObj) => !deviceList.some((deviceDetail) => ((deviceDetail.ipaddress === deviceObj.data.ipaddress) && (deviceDetail.idx === deviceObj.data.idx) && deviceDetail.left_location && deviceDetail.top_location)))
		if (removedDeviceObjs && removedDeviceObjs.length > 0) {
			canvas.remove(removedDeviceObjs[0]);
		}
		deviceList.forEach(function (device, index) {
			if (!inside || undefined) { // 실외
				if (device.type === 'ebell' &&
					(device.building_idx === 0 && device.floor_idx === 0 && device.building_service_type === 'observer') &&
					(device.left_location || device.top_location || device.left_location !== 'null' || device.top_location !== 'null' ||
						device.left_location !== 'undefined' || device.top_location !== 'undefined')) {
					const shadow = new fabric.Shadow({
						color: "black",
						blur: 15,
						offsetX: 8,
						offsetY: 11,
					});
					const eventShadow = new fabric.Shadow({
						color: "red",
						blur: 30,
					});
					let label = new fabric.Text(device.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
					fabric.Image.fromURL(iconEbell, function (oImg) {
						oImg.set({
							left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
							data: {
								icon: 'ebellicon',
								id: 'ebell_' + device.id,
								idx: device.idx,
								type: 'ebell',
								device_type: 'ebell',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
						})
						let group = new fabric.Group([label, oImg], {
							data: {
								icon: 'ebellicon',
								ebell_id: 'ebell_' + device.id,
								idx: device.idx,
								type: 'ebell',
								device_type: 'ebell',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
							scaleX: 0.7,
							scaleY: 0.7,
							left: parseInt(device.left_location),
							top: parseInt(device.top_location),
							selectable: false,
							shadow: device.status === 0 || device.status === '0' ? shadow : eventShadow,
							subTargetCheck: true,
							objectCaching: false,
						});
						const groupTop = group.top;
						if (device.status === 1 || device.status === '1') {
							// group.animate('top', group.top ? group.top + 15 : groupTop, {
							// 	onChange: canvas.renderAll.bind(canvas),
							// 	onComplete: function onComplete() {
							// 		group.animate(
							// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
							// 			{
							// 				duration: 1500,
							// 				onChange: canvas.renderAll.bind(canvas),
							// 				onComplete: onComplete
							// 			});
							// 	}
							// });
						}
						group.subTargetCheck = true;
						const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
						group.set({ left: parseInt(camCoordsLeft) })
						group.setCoords();
						const isEbellDetail = canvas.getObjects().find((objDetail) => objDetail.data.ebell_id === ('ebell_' + device.id) && objDetail.data.ipaddress === device.ipaddress);
						if (isEbellDetail) {
							canvas.remove(isEbellDetail);
							canvas.add(group);
						} else {
							canvas.add(group);
						}
					})
				} else if (device.type === 'vcounter' &&
					(device.building_idx === 0 && device.floor_idx === 0 && device.building_service_type === 'observer') &&
					(device.left_location || device.top_location || device.left_location !== 'null' || device.top_location !== 'null' ||
						device.left_location !== 'undefined' || device.top_location !== 'undefined')) {
					const shadow = new fabric.Shadow({
						color: "black",
						blur: 15,
						offsetX: 8,
						offsetY: 11,
					});
					const eventShadow = new fabric.Shadow({
						color: "red",
						blur: 30,
					});
					let label = new fabric.Text(device.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
					fabric.Image.fromURL(iconVCounter, function (oImg) {
						oImg.set({
							left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
							data: {
								icon: 'vcountericon',
								id: 'vcounter_' + device.id,
								idx: device.idx,
								type: 'vcounter',
								device_type: 'vcounter',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
						})
						let group = new fabric.Group([label, oImg], {
							data: {
								icon: 'vcountericon',
								vcounter_id: 'vcounter_' + device.id,
								idx: device.idx,
								type: 'vcounter',
								device_type: 'vcounter',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
							scaleX: 0.7,
							scaleY: 0.7,
							left: parseInt(device.left_location),
							top: parseInt(device.top_location),
							selectable: false,
							shadow: device.status === 0 || device.status === '0' ? shadow : eventShadow,
							subTargetCheck: true,
							objectCaching: false,
						});
						group.subTargetCheck = true;
						const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
						group.set({ left: parseInt(camCoordsLeft) })
						group.setCoords();
						const isVCounterDetail = canvas.getObjects().find((objDetail) => objDetail.data.vcounter_id === ('vcounter_' + device.id) && objDetail.data.ipaddress === device.ipaddress);
						if (isVCounterDetail) {
							canvas.remove(isVCounterDetail);
							canvas.add(group);
						} else {
							canvas.add(group);
						}
					})
				} else if (device.type === 'mdet' &&
					(device.building_idx === 0 && device.floor_idx === 0 && device.building_service_type === 'observer') &&
					(device.left_location && device.top_location && device.left_location !== 'null' && device.top_location !== 'null' &&
						device.left_location !== 'undefined' && device.top_location !== 'undefined')) {
					const shadow = new fabric.Shadow({
						color: "black",
						blur: 15,
						offsetX: 8,
						offsetY: 11,
					});
					const eventShadow = new fabric.Shadow({
						color: "red",
						blur: 30,
					});
					let label = new fabric.Text(device.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
					fabric.Image.fromURL(iconMdet, function (oImg) {
						oImg.set({
							left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
							data: {
								icon: 'mdeticon',
								id: 'mdet_' + device.id,
								idx: device.idx,
								type: 'mdet',
								device_type: 'mdet',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
						})
						let group = new fabric.Group([label, oImg], {
							data: {
								icon: 'mdeticon',
								mdet_id: 'mdet_' + device.id,
								idx: device.idx,
								type: 'mdet',
								device_type: 'mdet',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
							scaleX: 0.7,
							scaleY: 0.7,
							left: parseInt(device.left_location),
							top: parseInt(device.top_location),
							selectable: false,
							shadow: device.status === 0 || device.status === '0' ? shadow : eventShadow,
							subTargetCheck: true,
							objectCaching: false,
						});
						group.subTargetCheck = true;
						const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
						group.set({ left: parseInt(camCoordsLeft) })
						group.setCoords();
						const isMdetDetail = canvas.getObjects().find((objDetail) => objDetail.data.mdet_id === ('mdet_' + device.id) && objDetail.data.ipaddress === device.ipaddress);
						if (isMdetDetail) {
							canvas.remove(isMdetDetail);
							canvas.add(group);
						} else {
							canvas.add(group);
						}
					})
				}
			} else if (inside) {
				if (device.type == 'ebell') {
					if (device.left_location || device.top_location || device.left_location !== 'null' || device.top_location !== 'null' ||
						device.left_location !== 'undefined' || device.top_location !== 'undefined') {
						// if (device.type !== 'ebell') { return false };
						if ((device.building_idx !== buildingInfo.buildingIdx) || (device.floor_idx !== buildingInfo.floorIdx)) { return }
						const shadow = new fabric.Shadow({
							color: "black",
							blur: 15,
							offsetX: 8,
							offsetY: 11,
						});
						const eventShadow = new fabric.Shadow({
							color: "red",
							blur: 30,
						});
						let label = new fabric.Text(device.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
						fabric.Image.fromURL(iconEbell, function (oImg) {
							oImg.set({
								left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
								data: {
									icon: 'ebellicon',
									id: 'ebell_' + device.id,
									idx: device.idx,
									type: 'ebell',
									device_type: 'ebell',
									buildingIdx: device.building_idx,
									floorIdx: device.floor_idx,
									buildingName: device.buildingname,
									floorName: device.floorname,
									location: device.location,
									buildingServiceType: device.building_service_type,
									ipaddress: device.ipaddress,
									service_type: device.service_type,
									device_id: device.id,
									camera_id: device.camera_id
								},
							})
							let group = new fabric.Group([label, oImg], {
								data: {
									icon: 'ebellicon',
									ebell_id: 'ebell_' + device.id,
									idx: device.idx,
									type: 'ebell',
									device_type: 'ebell',
									buildingIdx: device.building_idx,
									floorIdx: device.floor_idx,
									buildingName: device.buildingname,
									floorName: device.floorname,
									location: device.location,
									buildingServiceType: device.building_service_type,
									ipaddress: device.ipaddress,
									service_type: device.service_type,
									device_id: device.id,
									camera_id: device.camera_id
								},
								scaleX: 0.7,
								scaleY: 0.7,
								left: parseInt(device.left_location),
								top: parseInt(device.top_location),
								selectable: false,
								shadow: device.status === 0 || device.status === '0' ? shadow : eventShadow,
								subTargetCheck: true,
								objectCaching: false,
							});
							const groupTop = group.top;
							if (device.status === 1 || device.status === '1') {
								// group.animate('top', group.top ? group.top + 15 : groupTop, {
								// 	onChange: canvas.renderAll.bind(canvas),
								// 	onComplete: function onComplete() {
								// 		group.animate(
								// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
								// 			{
								// 				duration: 1500,
								// 				onChange: canvas.renderAll.bind(canvas),
								// 				onComplete: onComplete
								// 			});
								// 	}
								// });
							}
							group.subTargetCheck = true;
							const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
							group.set({ left: parseInt(camCoordsLeft) });
							group.setCoords();
							const isEbellDetail = canvas.getObjects().find((objDetail) => objDetail.data.ebell_id === ('ebell_' + device.id) && objDetail.data.ipaddress === device.ipaddress);
							if (isEbellDetail) {
								canvas.remove(isEbellDetail);
								canvas.add(group);
							} else {
								canvas.add(group);
							}
						})
					}
				} else if (device.type == 'door') {
					if (device.left_location || device.top_location || device.left_location !== 'null' || device.top_location !== 'null' ||
						device.left_location !== 'undefined' || device.top_location !== 'undefined') {
						// if (device.type !== 'door') {return false};
						if (device.building_idx !== buildingInfo.buildingIdx || device.floor_idx !== buildingInfo.floorIdx) { return }
						const shadow = new fabric.Shadow({
							color: "black",
							blur: 15,
							offsetX: 8,
							offsetY: 11,
						});
						const eventShadow = new fabric.Shadow({
							color: "red",
							blur: 30,
						});
						let label = new fabric.Text(device.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
						fabric.Image.fromURL(iconDoor, function (oImg) {
							oImg.set({
								left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
								data: {
									icon: 'dooricon',
									id: 'door_' + device.id,
									idx: device.idx,
									type: 'door',
									device_type: 'door',
									deviceName: device.name,
									buildingIdx: device.building_idx,
									floorIdx: device.floor_idx,
									buildingName: device.buildingname,
									floorName: device.floorname,
									location: device.location,
									buildingServiceType: device.building_service_type,
									ipaddress: device.ipaddress,
									service_type: device.service_type,
									device_id: device.id,
									camera_id: device.camera_id
								},
							})
							// fabric.Image.fromURL(iconGuardianlite, function (oImg2) {
							// 	oImg.set({
							// 		left: label.left, top: label.top - 260, originX: 'center', originY: 'center',
							// })

							let group = new fabric.Group([label, oImg], {
								data: {
									icon: 'dooricon',
									id: 'door_' + device.id,
									idx: device.idx,
									type: 'door',
									device_type: 'door',
									deviceName: device.name,
									buildingIdx: device.building_idx,
									floorIdx: device.floor_idx,
									buildingName: device.buildingname,
									floorName: device.floorname,
									location: device.location,
									buildingServiceType: device.building_service_type,
									ipaddress: device.ipaddress,
									service_type: device.service_type,
									device_id: device.id,
									camera_id: device.camera_id
								},
								scaleX: 0.7,
								scaleY: 0.7,
								left: parseInt(device.left_location),
								top: parseInt(device.top_location),
								selectable: false,
								shadow: device.status === 0 || device.status === '0' ? shadow : eventShadow,
								subTargetCheck: true,
								objectCaching: false,
							});
							const groupTop = group.top;
							if (device.status !== 0 || device.status === '0') { // door event status ==> 110
								// group.animate('top', group.top ? group.top + 15 : groupTop, {
								// 	onChange: canvas.renderAll.bind(canvas),
								// 	onComplete: function onComplete() {
								// 		group.animate(
								// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
								// 			{
								// 				duration: 1500,
								// 				onChange: canvas.renderAll.bind(canvas),
								// 				onComplete: onComplete
								// 			});
								// 	}
								// });
							}
							group.subTargetCheck = true;
							const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
							group.set({ left: parseInt(camCoordsLeft) })
							group.setCoords();
							const isDoorDetail = canvas.getObjects().find((objDetail) => objDetail.data.id === ('door_' + device.id) && objDetail.data.ipaddress === device.ipaddress);
							if (isDoorDetail) {
								canvas.remove(isDoorDetail);
								canvas.add(group);
							} else {
								canvas.add(group);
							}
						})
					}
				} else if (device.type == 'vcounter') {
					if (device.left_location || device.top_location || device.left_location !== 'null' || device.top_location !== 'null' ||
						device.left_location !== 'undefined' || device.top_location !== 'undefined') {
						if (device.building_idx !== buildingInfo.buildingIdx || device.floor_idx !== buildingInfo.floorIdx) { return }
						const shadow = new fabric.Shadow({
							color: "black",
							blur: 15,
							offsetX: 8,
							offsetY: 11,
						});
						const eventShadow = new fabric.Shadow({
							color: "red",
							blur: 30,
						});
						let label = new fabric.Text(device.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
						fabric.Image.fromURL(iconVCounter, function (oImg) {
							oImg.set({
								left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
								data: {
									icon: 'vcountericon',
									id: 'vcounter_' + device.id,
									idx: device.idx,
									type: 'vcounter',
									device_type: 'vcounter',
									buildingIdx: device.building_idx,
									floorIdx: device.floor_idx,
									buildingName: device.buildingname,
									floorName: device.floorname,
									location: device.location,
									buildingServiceType: device.building_service_type,
									ipaddress: device.ipaddress,
									service_type: device.service_type,
									device_id: device.id,
									camera_id: device.camera_id
								},
							})
							let group = new fabric.Group([label, oImg], {
								data: {
									icon: 'vcountericon',
									vcounter_id: 'vcounter_' + device.id,
									idx: device.idx,
									type: 'vcounter',
									device_type: 'vcounter',
									buildingIdx: device.building_idx,
									floorIdx: device.floor_idx,
									buildingName: device.buildingname,
									floorName: device.floorname,
									location: device.location,
									buildingServiceType: device.building_service_type,
									ipaddress: device.ipaddress,
									service_type: device.service_type,
									device_id: device.id,
									camera_id: device.camera_id
								},
								scaleX: 0.7,
								scaleY: 0.7,
								left: parseInt(device.left_location),
								top: parseInt(device.top_location),
								selectable: false,
								shadow: device.status === 0 || device.status === '0' ? shadow : eventShadow,
								subTargetCheck: true,
								objectCaching: false,
							});
							group.subTargetCheck = true;
							const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
							group.set({ left: parseInt(camCoordsLeft) })
							group.setCoords();
							const isVCounterDetail = canvas.getObjects().find((objDetail) => objDetail.data.vcounter_id === ('vcounter_' + device.id) && objDetail.data.ipaddress === device.ipaddress);
							if (isVCounterDetail) {
								canvas.remove(isVCounterDetail);
								canvas.add(group);
							} else {
								canvas.add(group);
							}
						})
					}
				} else if (device.type === 'mdet' && device.left_location && device.top_location && device.left_location !== 'null' && device.top_location !== 'null' &&
					device.left_location !== 'undefined' && device.top_location !== 'undefined') {
					if (device.building_idx !== buildingInfo.buildingIdx || device.floor_idx !== buildingInfo.floorIdx) { return }
					const shadow = new fabric.Shadow({
						color: "black",
						blur: 15,
						offsetX: 8,
						offsetY: 11,
					});
					const eventShadow = new fabric.Shadow({
						color: "red",
						blur: 30,
					});
					let label = new fabric.Text(device.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
					fabric.Image.fromURL(iconMdet, function (oImg) {
						oImg.set({
							left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
							data: {
								icon: 'mdeticon',
								id: 'mdet_' + device.id,
								idx: device.idx,
								type: 'mdet',
								device_type: 'mdet',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
						})
						let group = new fabric.Group([label, oImg], {
							data: {
								icon: 'mdeticon',
								mdet_id: 'mdet_' + device.id,
								idx: device.idx,
								type: 'mdet',
								device_type: 'mdet',
								buildingIdx: device.building_idx,
								floorIdx: device.floor_idx,
								buildingName: device.buildingname,
								floorName: device.floorname,
								location: device.location,
								buildingServiceType: device.building_service_type,
								ipaddress: device.ipaddress,
								service_type: device.service_type,
								device_id: device.id,
								camera_id: device.camera_id
							},
							scaleX: 0.7,
							scaleY: 0.7,
							left: parseInt(device.left_location),
							top: parseInt(device.top_location),
							selectable: false,
							shadow: device.status === 0 || device.status === '0' ? shadow : eventShadow,
							subTargetCheck: true,
							objectCaching: false,
						});
						group.subTargetCheck = true;
						const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
						group.set({ left: parseInt(camCoordsLeft) })
						group.setCoords();
						const isMdetDetail = canvas.getObjects().find((objDetail) => objDetail.data.mdet_id === ('mdet_' + device.id) && objDetail.data.ipaddress === device.ipaddress);
						if (isMdetDetail) {
							canvas.remove(isMdetDetail);
							canvas.add(group);
						} else {
							canvas.add(group);
						}
					})
				}
			}
		})
	}

	if (canvas && pidsList) {
		const removedPidsProps = pidsList.filter((pidsDetail) => !pidsDetail.line_x1 && !pidsDetail.line_x2 && !pidsDetail.line_y1 && !pidsDetail.line_y2 && !pidsDetail.left_location && !pidsDetail.top_location)
		const removedPidsObjs = canvas.getObjects()
			.filter((objDetail) => objDetail.data.type === 'pids')
			.filter((ObjPids) => removedPidsProps.some((pidsDetail) => (pidsDetail.pidsid === ObjPids.data.id)));
		if (removedPidsObjs && removedPidsObjs.length > 0) {
			canvas.remove(...removedPidsObjs);
		}
		pidsList.some(function (pids, index) {
			if (!inside || undefined) { // 실외
				if ((pids.building_idx === 0 && pids.floor_idx === 0 && pids.building_service_type === 'observer') &&
					(pids.left_location && pids.top_location)) {
					let strokeColor = 'yellow';
					if (pids.status === '1' || pids.status === 1) {
						strokeColor = 'red'
					}
					const shadow = new fabric.Shadow({
						color: "black",
						blur: 15,
						offsetX: 8,
						offsetY: 11,
					});
					const eventShadow = new fabric.Shadow({
						color: "red",
						blur: 30,
					});
					let line = new fabric.Line([parseInt(pids.line_x1), parseInt(pids.line_y1), parseInt(pids.line_x2), parseInt(pids.line_y2)], {
						stroke: strokeColor,
						strokeWidth: 3,
						strokeDashArray: [10, 5],
						selectable: false,
						padding: 0,
						hasControls: false,
						absolutePositioned: true,
						// hasBorders: false,
						originX: "center",
						originY: "center",
						ownCaching: false,
						objectCaching: false,
						shadow: pids.status === 0 || pids.status === '0' ? shadow : eventShadow,
						data: {
							type: 'pids',
							device_type: 'zone',
							service_type: 'observer',
							id: pids.pidsid,
							ipaddress: pids.ipaddress,
							location: pids.location,
							device_id: pids.pidsid,
							camera_id: pids.camera_id
						},
						fill: 'red',
						text_top: ((parseInt(pids.line_y1) + parseInt(pids.line_y2)) / 2) * 1.01,
						text_left: ((parseInt(pids.line_x1) + parseInt(pids.line_x2)) / 2) * 0.95,
					});
					const label = new fabric.IText(pids.pidsid, {
						left: ((parseInt(pids.line_x1) + parseInt(pids.line_x2)) / 2) * 0.95,
						top: ((parseInt(pids.line_y1) + parseInt(pids.line_y2)) / 2) * 1.01,
						fontFamily: 'Arial',
						fill: '#333',
						fontSize: 15,
						backgroundColor: 'yellowgreen',
						hasControls: false,
						// hasBorders: false,
						fontWeight: 800,
						shadow: pids.status === 0 || pids.status === '0' ? shadow : eventShadow,
						data: {
							type: 'pids',
							device_type: 'zone',
							service_type: 'observer',
							id: pids.pidsid,
							ipaddress: pids.ipaddress,
							location: pids.location,
							device_id: pids.pidsid,
							camera_id: pids.camera_id
						},
					});
					const isPidsZoneDetail = canvas.getObjects().find((objDetail) => objDetail.data.id === pids.pidsid);
					if (isPidsZoneDetail) {
						canvas.remove(isPidsZoneDetail);
						canvas.add(line, label);
					} else {
						canvas.add(line, label);
					}
				}
			}
		})
	}

	if (canvas && breathSensorList) {
		const removedSensorObjs = canvas.getObjects().filter((objDetail) => objDetail.data.type === 'vitalsensor').filter((sensorObj) => !breathSensorList.some((sensorDetail) => (sensorDetail.ipaddress === sensorObj.data.ipaddress)));
		if (removedSensorObjs && removedSensorObjs.length > 0) {
			canvas.remove(removedSensorObjs[0]);
		}
		breathSensorList.some(function (breathSensor, index) {
			if (breathSensor.left_location && breathSensor.left_location !== 'null' || breathSensor.top_location && breathSensor.top_location !== 'null' ||
				breathSensor.left_location !== 'undefined' || breathSensor.top_location !== 'undefined') {
				if (breathSensor.building_idx !== buildingInfo.buildingIdx || breathSensor.floor_idx !== buildingInfo.floorIdx) { return }

				const shadow = new fabric.Shadow({
					color: "black",
					blur: 15,
					offsetX: 8,
					offsetY: 11,
				});
				const eventShadow = new fabric.Shadow({
					color: "red",
					blur: 30,
				});
				let label = new fabric.Text(breathSensor.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
				fabric.Image.fromURL(iconBreathsensor, function (oImg) {
					oImg.set({
						left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
						data: {
							icon: 'vitalsensoricon',
							id: 'vitalsensor_' + breathSensor.device_id,
							idx: breathSensor.device_idx,
							type: 'vitalsensor',
							device_type: 'vitalsensor',
							buildingIdx: breathSensor.building_idx,
							floorIdx: breathSensor.floor_idx,
							buildingName: breathSensor.building_name,
							floorName: breathSensor.floor_name,
							location: breathSensor.location,
							buildingServiceType: breathSensor.building_service_type,
							ipaddress: breathSensor.ipaddress,
							service_type: breathSensor.service_type,
							device_id: breathSensor.device_id,
							camera_id: breathSensor.camera_id,
							use_status: breathSensor.use_status,
							breath_value: breathSensor.breath_value,
							schedule_group: breathSensor.schedule_group,
						},
					})
					let group = new fabric.Group([label, oImg], {
						data: {
							icon: 'vitalsensoricon',
							id: 'vitalsensor_' + breathSensor.device_id,
							idx: breathSensor.device_idx,
							type: 'vitalsensor',
							device_type: 'vitalsensor',
							buildingIdx: breathSensor.building_idx,
							floorIdx: breathSensor.floor_idx,
							buildingName: breathSensor.building_name,
							floorName: breathSensor.floor_name,
							location: breathSensor.location,
							buildingServiceType: breathSensor.building_service_type,
							ipaddress: breathSensor.ipaddress,
							service_type: breathSensor.service_type,
							device_id: breathSensor.device_id,
							camera_id: breathSensor.camera_id,
							use_status: breathSensor.use_status,
							breath_value: breathSensor.breath_value,
							schedule_group: breathSensor.schedule_group,
						},
						scaleX: 0.7,
						scaleY: 0.7,
						left: parseInt(breathSensor.left_location),
						top: parseInt(breathSensor.top_location),
						selectable: false,
						shadow: breathSensor.status === 0 || breathSensor.status === '0' ? shadow : eventShadow,
						subTargetCheck: true,
						objectCaching: false,
					});
					const groupTop = group.top;
					if (parseInt(breathSensor.status) === 1) {
						// group.animate('top', group.top ? group.top + 15 : groupTop, {
						// 	onChange: canvas.renderAll.bind(canvas),
						// 	onComplete: function onComplete() {
						// 		group.animate(
						// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
						// 			{
						// 				duration: 1500,
						// 				onChange: canvas.renderAll.bind(canvas),
						// 				onComplete: onComplete
						// 			});
						// 	}
						// });
					}
					group.subTargetCheck = true;
					const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
					group.set({ left: parseInt(camCoordsLeft) })
					group.setCoords();
					const isSensorDetail = canvas.getObjects().find((objDetail) => objDetail.data.id === ('vitalsensor_' + breathSensor.id) && objDetail.data.ipaddress === breathSensor.ipaddress);
					if (isSensorDetail) {
						canvas.remove(isSensorDetail);
						canvas.add(group);
					} else {
						canvas.add(group);
					}
				})
			}
		})
	}

	if (canvas && guardianlites) {
		const removedGuardianliteObjs = canvas.getObjects()
			.filter((objDetail) => objDetail.data.type === 'guardianlite')
			.filter((guardianliteObj) => !guardianlites.some((guardianliteDetail) => ((guardianliteDetail.ipaddress === guardianliteObj.data.ipaddress) && (guardianliteDetail.idx === guardianliteObj.data.idx) && (guardianliteDetail.service_type === guardianliteObj.data.service_type) && guardianliteDetail.left_location && guardianliteDetail.top_location)))
		if (removedGuardianliteObjs && removedGuardianliteObjs.length > 0) {
			canvas.remove(removedGuardianliteObjs[0]);
		}
		guardianlites.some(function (guardianlite, index) {
			if ((guardianlite.left_location && guardianlite.left_location !== 'null' || guardianlite.top_location && guardianlite.top_location !== 'null' ||
				guardianlite.left_location !== 'undefined' || guardianlite.top_location !== 'undefined')) {
				// if (device.type !== 'guardianlite') { return false };
				if (guardianlite.building_idx !== buildingInfo.buildingIdx || guardianlite.floor_idx !== buildingInfo.floorIdx) { return }
				const shadow = new fabric.Shadow({
					color: "black",
					blur: 15,
					offsetX: 8,
					offsetY: 11,
				});
				const eventShadow = new fabric.Shadow({
					color: "red",
					blur: 30,
				});
				let label = new fabric.Text(guardianlite.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
				const labelWidth = label.width;
				fabric.Image.fromURL(iconGuardianlite, function (oImg) {
					oImg.set({
						left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
						data: {
							icon: 'guardianliteicon',
							id: 'guardianlite_' + guardianlite.id,
							idx: guardianlite.idx,
							type: 'guardianlite',
							device_type: 'guardianlite',
							buildingIdx: guardianlite.building_idx,
							floorIdx: guardianlite.floor_idx,
							buildingName: guardianlite.buildingname,
							floorName: guardianlite.floorname,
							location: guardianlite.location,
							buildingServiceType: guardianlite.building_service_type,
							ipaddress: guardianlite.ipaddress,
							service_type: guardianlite.service_type,
							device_id: guardianlite.id,
							gl_idx: guardianlite.gl_idx,
							gl_id: guardianlite.gl_id,
							password: guardianlite.password,
							ch1: guardianlite.ch1,
							ch2: guardianlite.ch2,
							ch3: guardianlite.ch3,
							ch4: guardianlite.ch4,
							ch5: guardianlite.ch5,
							temper: guardianlite.temper
						},
					})
					let group = new fabric.Group([label, oImg], {
						data: {
							icon: 'guardianliteicon',
							id: 'guardianlite_' + guardianlite.id,
							idx: guardianlite.idx,
							type: 'guardianlite',
							device_type: 'guardianlite',
							buildingIdx: guardianlite.building_idx,
							floorIdx: guardianlite.floor_idx,
							buildingName: guardianlite.buildingname,
							floorName: guardianlite.floorname,
							location: guardianlite.location,
							buildingServiceType: guardianlite.building_service_type,
							ipaddress: guardianlite.ipaddress,
							service_type: guardianlite.service_type,
							device_id: guardianlite.id,
							gl_idx: guardianlite.gl_idx,
							gl_id: guardianlite.gl_id,
							password: guardianlite.password,
							ch1: guardianlite.ch1,
							ch2: guardianlite.ch2,
							ch3: guardianlite.ch3,
							ch4: guardianlite.ch4,
							ch5: guardianlite.ch5,
							temper: guardianlite.temper
						},
						scaleX: 0.7,
						scaleY: 0.7,
						left: parseInt(guardianlite.left_location),
						top: parseInt(guardianlite.top_location),
						selectable: false,
						shadow: parseInt(guardianlite.status) === 0 ? shadow : eventShadow,
						subTargetCheck: true,
						objectCaching: false,
					});
					const groupTop = group.top;
					if (parseInt(guardianlite.status) === 0) {
						// group.animate('top', group.top ? group.top + 15 : groupTop, {
						// 	onChange: canvas.renderAll.bind(canvas),
						// 	onComplete: function onComplete() {
						// 		group.animate(
						// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
						// 			{
						// 				duration: 1500,
						// 				onChange: canvas.renderAll.bind(canvas),
						// 				onComplete: onComplete
						// 			});
						// 	}
						// });
					}
					group.subTargetCheck = true;
					const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
					group.set({ left: parseInt(camCoordsLeft) })
					group.setCoords();
					const isGuardianLiteDetail = canvas.getObjects().find((objDetail) => objDetail.data.id === ('guardianlite_' + guardianlite.id) && objDetail.data.ipaddress === guardianlite.ipaddress);
					if (isGuardianLiteDetail) {
						canvas.remove(isGuardianLiteDetail);
						canvas.add(group);
					} else {
						canvas.add(group);
					}
				})
			}
		}
		)
	}

	if (canvas && guardianlites) {
		const removedGuardianliteObjs = canvas.getObjects()
			.filter((objDetail) => objDetail.data.type === 'guardianlite')
			.filter((guardianliteObj) => !guardianlites.some((guardianliteDetail) => ((guardianliteDetail.ipaddress === guardianliteObj.data.ipaddress) && (guardianliteDetail.idx === guardianliteObj.data.idx) && (guardianliteDetail.service_type === guardianliteObj.data.service_type) && guardianliteDetail.left_location && guardianliteDetail.top_location)))
		if (removedGuardianliteObjs && removedGuardianliteObjs.length > 0) {
			canvas.remove(removedGuardianliteObjs[0]);
		}
		guardianlites.some(function (guardianlite, index) {
			if ((guardianlite.left_location && guardianlite.left_location !== 'null' || guardianlite.top_location && guardianlite.top_location !== 'null' ||
				guardianlite.left_location !== 'undefined' || guardianlite.top_location !== 'undefined')) {
				// if (device.type !== 'guardianlite') { return false };
				if (guardianlite.building_idx !== buildingInfo.buildingIdx || guardianlite.floor_idx !== buildingInfo.floorIdx) { return }
				const shadow = new fabric.Shadow({
					color: "black",
					blur: 15,
					offsetX: 8,
					offsetY: 11,
				});
				const eventShadow = new fabric.Shadow({
					color: "red",
					blur: 30,
				});
				let label = new fabric.Text(guardianlite.name, { fill: 'black', fontSize: 25, fontWeight: 800, originX: 'center', originY: 'center', backgroundColor: 'yellowgreen' });
				const labelWidth = label.width;
				fabric.Image.fromURL(iconGuardianlite, function (oImg) {
					oImg.set({
						left: label.left, top: label.top - 60, originX: 'center', originY: 'center',
						data: {
							icon: 'guardianliteicon',
							id: 'guardianlite_' + guardianlite.id,
							idx: guardianlite.idx,
							type: 'guardianlite',
							device_type: 'guardianlite',
							buildingIdx: guardianlite.building_idx,
							floorIdx: guardianlite.floor_idx,
							buildingName: guardianlite.buildingname,
							floorName: guardianlite.floorname,
							location: guardianlite.location,
							buildingServiceType: guardianlite.building_service_type,
							ipaddress: guardianlite.ipaddress,
							service_type: guardianlite.service_type,
							device_id: guardianlite.id,
							gl_idx: guardianlite.gl_idx,
							gl_id: guardianlite.gl_id,
							password: guardianlite.password,
							ch1: guardianlite.ch1,
							ch2: guardianlite.ch2,
							ch3: guardianlite.ch3,
							ch4: guardianlite.ch4,
							ch5: guardianlite.ch5,
							temper: guardianlite.temper
						},
					})
					let group = new fabric.Group([label, oImg], {
						data: {
							icon: 'guardianliteicon',
							id: 'guardianlite_' + guardianlite.id,
							idx: guardianlite.idx,
							type: 'guardianlite',
							device_type: 'guardianlite',
							buildingIdx: guardianlite.building_idx,
							floorIdx: guardianlite.floor_idx,
							buildingName: guardianlite.buildingname,
							floorName: guardianlite.floorname,
							location: guardianlite.location,
							buildingServiceType: guardianlite.building_service_type,
							ipaddress: guardianlite.ipaddress,
							service_type: guardianlite.service_type,
							device_id: guardianlite.id,
							gl_idx: guardianlite.gl_idx,
							gl_id: guardianlite.gl_id,
							password: guardianlite.password,
							ch1: guardianlite.ch1,
							ch2: guardianlite.ch2,
							ch3: guardianlite.ch3,
							ch4: guardianlite.ch4,
							ch5: guardianlite.ch5,
							temper: guardianlite.temper
						},
						scaleX: 0.7,
						scaleY: 0.7,
						left: parseInt(guardianlite.left_location),
						top: parseInt(guardianlite.top_location),
						selectable: false,
						shadow: parseInt(guardianlite.status) === 0 ? shadow : eventShadow,
						subTargetCheck: true,
						objectCaching: false,
					});
					const groupTop = group.top;
					if (parseInt(guardianlite.status) === 0) {
						// group.animate('top', group.top ? group.top + 15 : groupTop, {
						// 	onChange: canvas.renderAll.bind(canvas),
						// 	onComplete: function onComplete() {
						// 		group.animate(
						// 			'top', group.top === groupTop ? group.top + 15 : groupTop,
						// 			{
						// 				duration: 1500,
						// 				onChange: canvas.renderAll.bind(canvas),
						// 				onComplete: onComplete
						// 			});
						// 	}
						// });
					}
					group.subTargetCheck = true;
					const camCoordsLeft = group.getCoords().length > 0 ? group.getCoords()[0].x - (group.getCoords()[1].x - group.getCoords()[0].x) / 2 : group.left_location;
					group.set({ left: parseInt(camCoordsLeft) })
					group.setCoords();
					const isGuardianLiteDetail = canvas.getObjects().find((objDetail) => objDetail.data.id === ('guardianlite_' + guardianlite.id) && objDetail.data.ipaddress === guardianlite.ipaddress);
					if (isGuardianLiteDetail) {
						canvas.remove(isGuardianLiteDetail);
						canvas.add(group);
					} else {
						canvas.add(group);
					}
				})
			}
		}
		)
	}

	canvas.renderAll();
	return canvas;
}
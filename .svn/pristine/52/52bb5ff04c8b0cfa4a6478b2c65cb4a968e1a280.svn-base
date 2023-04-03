import React, { useEffect, useState, useMemo }  from 'react';
import { fabric } from "fabric";
import iconBuilding from '../icons/building.ico';

export default function AddBuildingIconToMap({ canvas, buildingList }) { // + buildingData
	fabric.Group.prototype.hasControls = false;

	// useEffect(() => {
	// 	renderAll();
	// },[buildingList]);
	const renderAll = () => {
		canvas.remove(...canvas.getObjects());
		// for (let item of canvas.getObjects()) {
		// 	console.log(canvas.getObjects());
		// }
		canvas.discardActiveObject();
		if (canvas && buildingList && buildingList !== undefined) {
			if (buildingList && buildingList.length > 0) { // left_location = latitude
				buildingList.forEach(async (building, index) => {
					if (building.left_location !== null || building.top_location !== null || building.left_location !== 'null' || building.top_location !== 'null' ||
					building.left_location !== '' || building.top_location !== '' || building.left_location !== undefined || building.top_location !== undefined ||
					building.left_location !== 'undefined' || building.top_location !== 'undefined') {
						const group = new fabric.Group();
						group.subTargetCheck = true;
						if (canvas) canvas.add(group);
						const shadow = new fabric.Shadow({
							color: "black",
							blur: 20
						});
						const iconImage = fabric.Image.fromURL(iconBuilding, function (img) {
							img.set({
								left: parseInt(building.left_location),
								top: parseInt(building.top_location),
								// hasControls: false,
								originX: 'center',
								originY: 'center',
								data: {
									icon: 'buildingicon',
									id: 'building_' + building.idx,
									type: 'building',
									buildingIdx: building.idx,
									name: building.name,
									serviceType: building.service_type
								},
								objectCaching: false,
								shadow: shadow
							});
							group.addWithUpdate(img);
						})
						const text = new fabric.Text(building.name, {
							left: parseInt(building.left_location),
							top: parseInt(building.top_location) + 50,
							originX: 'center',
							originY: 'center',
							data: {
								icon: 'buildingicon',
								id: 'building_' + building.idx,
								type: 'building',
								buildingIdx: building.idx,
								name: building.name,
								serviceType: building.service_type
							},
							fill: 'black',
							backgroundColor: 'gray',
							fontSize: 15,
							// hasControls: false,
							objectCaching: false
						});
						text.centerH();
						group.addWithUpdate(text);
						// group.hasControls = false;
						group.selectable = false;
						group.hoverCursor = 'pointer'
					}
				})
			}
		}
	}
	// const render = React.useMemo(()=> <>{renderAll()}</>,[buildingList])

	return(
		<>
			{canvas && renderAll()}
		</>
	)
    // const shadow = new fabric.Shadow({
	// 	color: "black",
	// 	blur: 20
	// });
	// const group = new fabric.Group();
	// canvas.add(group);
	// const iconImage = fabric.Image.fromURL(iconBuilding, function (img) {
	// 	img.set({
	// 		left: clickPoint.x,
	// 		top: clickPoint.y,
	// 		hasControls: false,
	// 		originX: 'center',
	// 		originY: 'center',
	// 		data: {
	// 			icon: 'buildingicon',
	// 			id: 'building',
	// 			type: 'building',
	// 			buildingIdx: '',
	// 			floorIdx: '',
	// 		},
	// 		shadow: shadow
	// 	});
	// 	canvas.renderAll();
	// 	group.addWithUpdate(img);
	// })

	// const text = new fabric.Text(buildingName, {
	// 	left: clickPoint.x ,
	// 	top: clickPoint.y + 50,
	// 	originX: 'center',
	// 	originY: 'center',
	// 	fill: 'black',
	// 	backgroundColor: 'gray',
	// 	fontSize: 20,
	// 	hasControls: false,
	// });

	// text.centerH();
	// group.addWithUpdate(text);
	// group.hasControls = false;
	// group.selectable = false;
}
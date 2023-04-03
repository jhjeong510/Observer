import React, { useState, useEffect} from 'react';

export default function ParkingBox({ parkingCoordsData, receivedData }) {
	const handleBoxClick = (boxIndex) => {
		alert(boxIndex + '번 idx 클릭')
	};

	return (
		<div>
			{parkingCoordsData.map((box, index) => (
				<div
					key={index}
					id={box.parking_area + '_' + box.idx}
					style={{
						// float: 'left',
						position: 'absolute',
						left: box.x1,
						top: box.y1,
						width: box.x2 - box.x1,
						height: box.y4 - box.y1,
						backgroundColor: 'rgba(0, 0, 255, 0.3)',
					}}
					onClick={() => handleBoxClick(index)}
				/>
			))}
		</div>
	);
}

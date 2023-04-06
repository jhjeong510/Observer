import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContextMenuHandler, handleCloseContext } from "./handlers/ContextMenuHandler";
import ModalConfirm from '../shared/modal/ModalAckConfirm';
import { removeSpace } from './api/apiService';
import styles from '../shared/modal/ContextMenuModal.module.css';

export default function ParkingArea({ parkingCoordsData, parkingSpaceUpdate, oneCamera, src }) {
	const [widthHeight, setWidthHeight] = useState({ width: '', height: '' });
	const canvasRef = useRef(null);
	const [selectedBox, setSelectedBox] = useState(null);
	const [modalConfirm, setModalConfirm] = useState(null);
	const width = widthHeight.width ? widthHeight.width : document.body.clientWidth * 0.60;
	const height = widthHeight.height ? widthHeight.height : document.body.clientHeight * 0.673003029;
	const parkingCameraWidth = 1920;
	const parkingCameraHeight = 1080;
	const backgroundColor = 'transparent';

	const setCanvasStyleSize = () => {
		if (oneCamera) {
			setWidthHeight({ width: document.body.clientWidth * 0.60, height: document.body.clientHeight * 0.673003029 });
		} else if (!oneCamera) {
			setWidthHeight({ width: document.body.clientWidth * 0.29, height: document.body.clientHeight * 0.324365322 });
		} else if (oneCamera === undefined) {
			setWidthHeight({ width: document.body.clientWidth * 0.60, height: document.body.clientHeight * 0.673003029 });
		}
	}

	useEffect(() => {
		async function drawParkingBox() {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (parkingCoordsData && widthHeight.width !== '' && widthHeight.height !== '') {
				ctx.clearRect(0, 0, width, height);

				parkingCoordsData.forEach((coord) => {
					ctx.beginPath();
					ctx.moveTo((parseInt(coord.x1) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y1) / parkingCameraHeight) * widthHeight.height);
					ctx.lineTo((parseInt(coord.x2) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y2) / parkingCameraHeight) * widthHeight.height);
					ctx.lineTo((parseInt(coord.x4) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y4) / parkingCameraHeight) * widthHeight.height);
					ctx.lineTo((parseInt(coord.x3) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y3) / parkingCameraHeight) * widthHeight.height);
					ctx.lineTo((parseInt(coord.x1) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y1) / parkingCameraHeight) * widthHeight.height);


					ctx.fillStyle = coord.occupancy === "1" && (coord.type === null || coord.type === undefined) ? 'hsl(0, 0%, 20%, 0.8)' :
						coord.occupancy === "1" && coord.type === 0 ? 'hsla(120, 100%, 60%, 0.3)' : // 일반
							coord.occupancy === "1" && coord.type === 1 ? 'hsla(50, 100%, 50%, 0.3)' : // 경차
								coord.occupancy === "1" && coord.type === 2 ? 'hsla(240, 100%, 50%, 0.3)' : // 장애인
									coord.occupancy === "1" && coord.type === 3 ? 'hsla(188, 100%, 50%, 0.3)' :  // 전기차
										coord.occupancy === "1" && coord.type === 4 ? 'hsla(0, 100%, 50%, 0.5)' :  // 비주차 구역
											coord.occupancy === "0" ? 'transparent' : ''
					ctx.fill();
					ctx.stroke();

					ctx.fillStyle = 'black';
					ctx.font = "bold 15px Arial";
					ctx.fillText(coord.index_number, coord.x1 / parkingCameraWidth * widthHeight.width + ((coord.x2 / parkingCameraWidth * widthHeight.width - coord.x1 / parkingCameraWidth * widthHeight.width) / 2), coord.y1 / parkingCameraHeight * widthHeight.height + ((coord.y4 / parkingCameraHeight * widthHeight.height - coord.y1 / parkingCameraHeight * widthHeight.height) / 2));

					if (coord.index_number === '1') {
						ctx.fillText(coord.parking_area, coord.x1 / parkingCameraWidth * widthHeight.width + ((coord.x2 / parkingCameraWidth * widthHeight.width - coord.x1 / parkingCameraWidth * widthHeight.width) / 2), coord.y1 / parkingCameraHeight * widthHeight.height + ((coord.y2 / parkingCameraHeight * widthHeight.height - coord.y1 / parkingCameraHeight * widthHeight.height) / 2) + 15);
					}
					ctx.stroke();
				})
			}
		}
		src !== '' && drawParkingBox();
	}, [parkingCoordsData, widthHeight, src, canvasRef, parkingSpaceUpdate]);

	const handleParkingMenu = async () => {
		const modalObj = {
			show: true,
			title: '주차 구역 삭제',
			description: '해당 구역을 삭제하시겠습니까?',
			removeIdx: selectedBox.idx,
		}
		setModalConfirm(modalObj);
		handleCloseContext();
	}

	const handleConfirm = async (removeIdx) => {
		await setModalConfirm(null);
		return await removeSpace({ idx: removeIdx });
	}

	const handleCancel = async () => {
		await setModalConfirm(null);
	}

	const findParkingBox = (event, canvasRef, parkingCoordsData, setSelectedBox) => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const canvasRect = canvas.getBoundingClientRect();
		const x = event.clientX - canvasRect.left;
		const y = event.clientY - canvasRect.top;
		parkingCoordsData.length > 0 && parkingCoordsData.forEach((coord) => {
			ctx.beginPath();
			ctx.moveTo((parseInt(coord.x1) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y1) / parkingCameraHeight) * widthHeight.height);
			ctx.lineTo((parseInt(coord.x2) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y2) / parkingCameraHeight) * widthHeight.height);
			ctx.lineTo((parseInt(coord.x4) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y4) / parkingCameraHeight) * widthHeight.height);
			ctx.lineTo((parseInt(coord.x3) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y3) / parkingCameraHeight) * widthHeight.height);
			ctx.lineTo((parseInt(coord.x1) / parkingCameraWidth) * widthHeight.width, (parseInt(coord.y1) / parkingCameraHeight) * widthHeight.height);

			// if (event.type === "click") {
			// 	if (ctx.isPointInPath(x, y)) {
			// 		ctx.fillStyle = "red";
			// 		ctx.fill();
			// 		setSelectedBox(coord);
			// 	}
			// } else if (event.type === "contextmenu" || event.button === 2 || event.which === 3) {
			// 	if (ctx.isPointInPath(x, y)) {
			// 		setSelectedBox(coord);
			// 		const selectedBox = coord;
			// 		const clickPoint = { x, y };
			// 		ContextMenuHandler(canvas, "", "", "", true, selectedBox, clickPoint);
			// 	}
			// }
		});
	};

	const handleClickEvent = useCallback((event) => {
		handleCloseContext();
		findParkingBox(event, canvasRef, parkingCoordsData, setSelectedBox);
	}, [canvasRef, parkingCoordsData, setSelectedBox]);

	const handleContextMenu = useCallback((event) => {
		event.preventDefault();
		findParkingBox(event, canvasRef, parkingCoordsData, setSelectedBox);
	}, [canvasRef, parkingCoordsData, setSelectedBox]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			canvas.addEventListener("click", handleClickEvent);
			canvas.addEventListener("contextmenu", handleContextMenu);
		}
		return () => {
			if (canvas) {
				canvas.removeEventListener("click", handleClickEvent);
				canvas.removeEventListener("contextmenu", handleContextMenu);
			}
		};
	}, [canvasRef, handleClickEvent, handleContextMenu]);

	useEffect(() => {
		setCanvasStyleSize();
	}, [oneCamera]);

	return (
		<>
			<canvas ref={canvasRef} width={width} height={height} style={{ width, height, backgroundColor }} onClick={handleClickEvent} onContextMenu={handleContextMenu} />
			{
				modalConfirm &&
				<ModalConfirm
					modalConfirm={modalConfirm}
					handleConfirm={handleConfirm}
					handleCancel={handleCancel}
				/>
			}
			{<div className={styles.parkingMenu}>
				<div>
					<button onClick={handleParkingMenu}>주차 구역 삭제</button>
				</div>
			</div>}
		</>
	)
}
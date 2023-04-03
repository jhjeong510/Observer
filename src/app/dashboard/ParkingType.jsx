import React from 'react';
import ordinary_vehicle from '../../assets/icon/ordinary_vehicle.png';
import smallCar from '../../assets/icon/small_car.png';
import disability from '../../assets/icon/disability.png';
import ev_car from '../../assets/icon/ev_car.png';
import not_parking from '../../assets/icon/not_parking.png';

const ParkingType =
{
	type_1: {
		type_name: '일반',
		// color: 'hsla(120, 100%, 25%, 0.3)',
		color: 'rgb(8, 88, 8, 56%)',

		value: 0,
		icon: <img src={ordinary_vehicle} />,
	},
	type_2: {
		type_name: '경차',
		// color: 'hsla(50, 100%, 50%, 0.3)',
		color: 'rgb(185, 155, 8, 51%)',
		value: 1,
		icon: <img src={smallCar} />,
	},
	type_3: {
		type_name: '장애인',
		color: 'hsla(240, 100%, 50%, 0.3)',
		value: 2,
		icon: <img src={disability} />,
	},
	type_4: {
		type_name: '전기차',
		color: 'hsla(188, 100%, 50%, 0.3)',
		icon: <img src={ev_car} />,
		value: 3,
	},
	type_5: {
		type_name: '비주차 구역',
		// color: 'hsla(0, 100%, 50%, 0.5)',
		color: 'rgb(229, 0, 0, 50%)',

		icon: <img src={not_parking} />,
		value: 4,
	}
}

export default ParkingType;
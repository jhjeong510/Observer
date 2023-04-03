import React, { useEffect, useState } from 'react';
import * as dateFns from "date-fns";
import styles from './ParkingEventList.module.css'
import { getEventsList } from './api/apiService';
import ParkingEventDetail from './ParkingEventDetail';

export default function ParkingInfo({ parkingCameras, parkingEvent }) {
	const [eventList, setEventList] = useState([]);
	const [activeEvent, setActiveEvent] = useState([]);

	const getEvents = async () => {

		const today = dateFns.format(dateFns.sub(new Date(), { days: 1 }), "yyyyMMdd");
		const startDate = today;
		const endDate = dateFns.format(new Date(), "yyyyMMdd");
		const endTime = dateFns.format(new Date(), "HHmmss");
		const endDateTime = endDate + 'T' + endTime;
		const acknowledge = false;

		const res = await getEventsList('parkingcontrol', 'noLimit', startDate, endDateTime, acknowledge);
		if (res && res.eventList && res.eventList.length > 0) {
			res.eventList[0].isLast = true;
			await setEventList(res.eventList);
		} else {
			await setEventList([]);
		}
	}

	useEffect(() => {
		if (parkingEvent) {
			getEvents();
		}
		const eventListSubscription = getEvents();
		return () => {
			if (eventListSubscription && typeof eventListSubscription.cancel === 'function') {
				eventListSubscription.cancel();
			}
		};
	}, [parkingEvent]);

	return (
		<>
			<div className={styles.menu_eventList}>
				<div>
					<div className={styles.eventList_header}>
						<h5 className={styles.header}>미확인 주차 이벤트 리스트</h5>
					</div>
				</div>
				<div className={styles.parking_event} >
					{eventList && eventList.length > 0 ?
						eventList.map((event, index) => {
							return (
								<React.Fragment key={index}>
									<ParkingEventDetail
										event={event}
										parkingEvent={parkingEvent}
										parkingCameras={parkingCameras}
									/>
								</React.Fragment>
							)
						})
						:
						<span className={styles.unAck_eventList_empty}>미확인 이벤트가 없습니다.</span>
					}
				</div>
			</div>
		</>
	)
}
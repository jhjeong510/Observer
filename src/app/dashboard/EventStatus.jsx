import React, { useEffect, useState } from 'react';
import { Dropdown, Tabs, Tab } from 'react-bootstrap';
import EventChartJs from './EventChartJs';
import styles from './EventStatus.module.css';
import * as dateFns from "date-fns";
import axios from 'axios';

export default function EventStatus(props) {

  const [period, setPeriod] = useState('오늘');
  const [events, setEvents] = useState([]);
  const [eventLabels, setEventLabels] = useState([]);
  const [eventCount, setEventCount] = useState([]);
  const [observerLabels, setObserverLabels] = useState([]);
  const [observerCount, setObserverCount] = useState([]);
  const [ebEventLabels, setEbEventLabels] = useState([1, 2, 0]);
  const [ebEventCount, setEbEventCount] = useState([]);
  const [sctlEventLabels, setSctlEventLabels] = useState([]);
  const [sctlEventCount, setSctlEventCount] = useState([]);
  const [guardianliteEventLabels, setGuardianliteEventLabels] = useState([]);
  const [guardianliteEventCount, setGuardianliteEventCount] = useState([]);
  const [accessctlEventLabels, setAccessctlEventLabels] = useState(['화재신호', '미등록출입시도', '강제출입문열림']);
  const [accessctlEventCount, setAccessctlEventCount] = useState([]);
  const [parkingctlEventLabels, setParkingctlEventLabels] = useState(['주차금지구역 주차', '만차']);
  const [parkingctlEventCount, setParkingctlEventCount] = useState([]);
  const [nDoctorEventLabels, setNDoctorEventLabels] = useState(['연결 끊어짐', '연결 복구']);
  const [nDoctorEventCount, setNDoctorEventCount] = useState([]);

  useEffect(() => {
    readEventsByPeriod(period);
  }, [props.eventListUpdate, props.serviceTypes])

  useEffect(() => {
    eventInfo();
    observerEventInfo();
    ebEventInfo();
    sctlEventInfo();
    accessctlEventInfo();
    nDoctorEventInfo();
    parkingCtlEventInfo();
  }, [events])

  const readEventsByPeriod = async (period) => {
    const today = dateFns.format(dateFns.sub(new Date(), { days: 1 }), "yyyyMMdd");
    const week = dateFns.format(dateFns.sub(new Date(), { weeks: 1 }), "yyyyMMdd");
    const aMonth = dateFns.format(dateFns.sub(new Date(), { months: 1 }), "yyyyMMdd");

    let startDate;

    const endDate = dateFns.format(new Date(), "yyyyMMdd");
    const endTime = dateFns.format(new Date(), "HHmmss");
    const endDateTime = endDate + 'T' + endTime;

    setPeriod(period);

    if (period === '오늘') {
      startDate = today;
    } else if (period === '일주일') {
      startDate = week;
    } else {
      startDate = aMonth;
    }

    try {
      const res = await axios.get('/api/observer/events', {
        params: {
          startDate: startDate,
          endDate: endDateTime
        }
      });
      if (res.data && res.data.result && res.data.result.length > 0) {
        setEvents(res.data.result);
      } else {
        setEvents(res.data.result);
      }
      // else {
      //   setEvents([]);
      //   const events = JSON.parse(JSON.stringify(this.state.events));
      //   this.setState({ events: events });
      // }
      return res.data.result;
    } catch (err) {
      console.log('App get event catch err:', err);
    }
  }

  const eventInfo = async () => {
    let eventLabels = [];
    const eventCount = [];
    await props.serviceTypes.map((serviceType) => {
      if (serviceType.setting_value === 'true') {
        eventLabels.push(serviceType.name);
        eventCount.push(0);
      }
    })
    await eventCount.push(0)

    await events && events.forEach((event) => {
      let countIndex;
      if (event.service_type === 'observer') {
        if (event.device_type === 'guardianlite' && eventLabels.includes(event.device_type)) {
          countIndex = eventLabels.indexOf('guardianlite');
        } else if (event.device_type === 'vitalsensor' && eventLabels.includes(event.device_type)) {
          countIndex = eventLabels.indexOf('vitalsensor');
        } else if (event.device_type === 'zone' && eventLabels.includes('pids')) {
          countIndex = eventLabels.indexOf('pids');
        } else if (eventLabels.includes(event.service_type)) {
          countIndex = eventLabels.indexOf(event.service_type)
        }
        eventCount[countIndex] += 1;
      } else {
        countIndex = eventLabels.indexOf(event.service_type);
        eventCount[countIndex] += 1;
      }
    })
    eventLabels = eventLabels.map((label) => label === 'ebell' ? '비상벨' : label === 'guardianlite' ? '가디언라이트' : label === 'anpr' ? 'ANPR' : label === 'accesscontrol' ? '출입통제' : label === 'vitalsensor' ? '바이탈센서' : label === 'ndoctor' ? 'N-Doctor' : label === 'pids' ? 'PIDS' : label === 'mgist' ? 'MGIST' : label === 'parkingcontrol' ? '주차관제시스템' : label === 'mdet' ? 'M-DET' : label === 'crowddensity' ? '군중 밀집도 감지' : label);

    setEventLabels(eventLabels);
    setEventCount(eventCount);
  }

  const observerEventInfo = async () => {
    let observerLabels = [];
    const observerCount = [];
    await props.serviceTypes.map((serviceType) => {
      if (serviceType.setting_value === 'true' && (serviceType.name === 'guardianlite' || serviceType.name === 'anpr' || serviceType.name === 'vitalsensor' || serviceType.name === 'pids' || serviceType.name === 'mdet' || serviceType.name === 'crowddensity')) {
        observerLabels.push(serviceType.name);
        observerCount.push(0);
      }
    })
    await observerCount.push(0)

    await events && events.forEach((event) => {
      let countIndex;
      if (event.service_type === 'observer') {
        if (event.device_type === 'guardianlite' && observerLabels.includes(event.device_type)) {
          countIndex = observerLabels.indexOf('guardianlite');
        } else if (event.device_type === 'vitalsensor' && observerLabels.includes(event.device_type)) {
          countIndex = observerLabels.indexOf(event.device_type);
        } else if (event.device_type === 'zone' && observerLabels.includes('pids')) {
          countIndex = observerLabels.indexOf('pids');
        }
      } else if (event.device_type === 'mdet' && observerLabels.includes('mdet')) {
        countIndex = observerLabels.indexOf('mdet')
      } else if (event.device_type === 'crowddensity' && observerLabels.includes('crowddensity')) {
        countIndex = observerLabels.indexOf('crowddensity')
      }
      observerCount[countIndex] += 1;
    })
    observerLabels = observerLabels.map((label) => label === 'guardianlite' ? 'GuardianLite' : label === 'anpr' ? 'ANPR' : label === 'vitalsensor' ? '바이탈 센서' : label === 'pids' ? 'PIDS' : label === 'mdet' ? 'M-DET' : label === 'crowddensity' ? '군중 밀집도 감지' : '');
    setObserverLabels(observerLabels);
    setObserverCount(observerCount);
  }

  const ebEventInfo = async () => {
    let newEbEventLabels = JSON.parse(JSON.stringify([1, 2, 0]));
    const newEbEventCount = JSON.parse(JSON.stringify([0, 0, 0]));
    await events && events.forEach((event) => {
      if (event.service_type === 'ebell') {
        const ebEventCountIndex = newEbEventLabels.indexOf(event.status)
        newEbEventCount[ebEventCountIndex] += 1
      } else {
        return;
      }
    })
    newEbEventLabels = newEbEventLabels.map((label) => label === 1 ? '비상발생' : label === 2 ? '통화중' : '비상종료');
    setEbEventLabels(newEbEventLabels);
    setEbEventCount(newEbEventCount);
  }

  const sctlEventInfo = async () => {
    let newSctlEventLabels = JSON.parse(JSON.stringify([]));
    const newSctlEventCount = JSON.parse(JSON.stringify([]));
    await events && events.forEach((event) => {
      if (event.service_type === 'mgist') {
        if (!(newSctlEventLabels.includes(event.event_type_name))) {
          newSctlEventLabels.push(event.event_type_name);
          const sctlEventCountIndex = newSctlEventLabels.indexOf(event.event_type_name)
          newSctlEventCount[sctlEventCountIndex] = 1
        } else {
          const sctlEventCountIndex = newSctlEventLabels.indexOf(event.event_type_name)
          newSctlEventCount[sctlEventCountIndex] += 1
        }
      }
    })
    setSctlEventLabels(newSctlEventLabels);
    setSctlEventCount(newSctlEventCount);
  }

  const guardianliteEventInfo = async () => {
    let newGuardianliteEventLabels = JSON.parse(JSON.stringify([]));
    const newGuardianliteEventCount = JSON.parse(JSON.stringify([]));


    await events && events.forEach((event) => {
      if (event.service_type === 'guardianlite') {
        if (!(newGuardianliteEventLabels.includes(event.event_type_name))) {
          guardianliteEventLabels.push(event.event_type_name);
          const guardianliteEventCountIndex = newGuardianliteEventLabels.indexOf(event.event_type_name)
          newGuardianliteEventCount[guardianliteEventCountIndex] = 1
        } else {
          const guardianliteEventCountIndex = newGuardianliteEventLabels.indexOf(event.event_type_name)
          newGuardianliteEventCount[guardianliteEventCountIndex] += 1
        }
      } else {
        return;
      }
    })

    newGuardianliteEventLabels = newGuardianliteEventLabels.map((label) => label === '전원장치 ON' ? 'ON' : label === '전원장치 OFF' ? 'OFF' : 'RESET');
    setGuardianliteEventLabels(newGuardianliteEventLabels);
    setGuardianliteEventCount(newGuardianliteEventCount);
  }

  const accessctlEventInfo = async () => {
    let newAccessctlEventLabels = JSON.parse(JSON.stringify([]));
    const newAccessctlEventCount = JSON.parse(JSON.stringify([]));
    await events && events.forEach((event) => {
      if (event.service_type === 'accesscontrol') {
        if (!(newAccessctlEventLabels.includes(event.event_type_name))) {
          newAccessctlEventLabels.push(event.event_type_name);
          const accessctlEventCountIndex = newAccessctlEventLabels.indexOf(event.event_type_name)
          newAccessctlEventCount[accessctlEventCountIndex] = 1
        } else {
          const accessctlEventCountIndex = newAccessctlEventLabels.indexOf(event.event_type_name)
          newAccessctlEventCount[accessctlEventCountIndex] += 1
        }
      } else {
        return;
      }
    })
    await setAccessctlEventLabels(newAccessctlEventLabels);
    await setAccessctlEventCount(newAccessctlEventCount);
  }

  const parkingCtlEventInfo = async () => {
    let newParkingctlEventLabels = JSON.parse(JSON.stringify([]));
    const newParkingctlEventCount = JSON.parse(JSON.stringify([]));
    await events && events.forEach((event) => {
      if (event.service_type === 'parkingcontrol') {
        if (!(newParkingctlEventLabels.includes(event.event_type_name))) {
          newParkingctlEventLabels.push(event.event_type_name);
          const parkingctlEventCountIndex = newParkingctlEventLabels.indexOf(event.event_type_name)
          newParkingctlEventCount[parkingctlEventCountIndex] = 1
        } else {
          const parkingctlEventCountIndex = newParkingctlEventLabels.indexOf(event.event_type_name)
          newParkingctlEventCount[parkingctlEventCountIndex] += 1
        }
      } else {
        return;
      }
    })
    await setParkingctlEventLabels(newParkingctlEventLabels);
    await setParkingctlEventCount(newParkingctlEventCount);
  }

  const nDoctorEventInfo = async () => {
    let newNDoctorEventLabels = JSON.parse(JSON.stringify([]));
    const newNDoctorEventCount = JSON.parse(JSON.stringify([]));
    await events && events.forEach((event) => {
      if (event.service_type === 'ndoctor') {
        if (!(newNDoctorEventLabels.includes(event.event_type_name))) {
          newNDoctorEventLabels.push(event.event_type_name);
          const nDoctorEventCountIndex = newNDoctorEventLabels.indexOf(event.event_type_name)
          newNDoctorEventCount[nDoctorEventCountIndex] = 1
        } else {
          const nDoctorEventCountIndex = newNDoctorEventLabels.indexOf(event.event_type_name)
          newNDoctorEventCount[nDoctorEventCountIndex] = 1
        }
      } else {
        return;
      }
    })
    setNDoctorEventLabels(newNDoctorEventLabels);
    setNDoctorEventCount(newNDoctorEventCount);
  }

  const handleSetTabWidth = (serviceTypes) => {
    if (serviceTypes.filter((serviceType) => (serviceType.setting_value === 'true' && serviceType.name !== 'guardianlite' && serviceType.name !== 'anpr' && serviceType.name !== 'vitalsensor' && serviceType.name !== 'pids' && serviceType.name !== 'mdet' && serviceType.name !== 'crowddensity')).length > 4) {
      return true
    } else {
      return false;
    }
  }

  return (
    <div className={styles.eventStatus} id='menu-eventStatus'>
      <div className={styles.header}>
        <h4 className={styles.title}>
          이벤트 현황
        </h4>
        <Dropdown className={styles.filter}>
          <Dropdown.Toggle variant="btn btn-dropdown" id="dropdownMenuButton1">
            {period}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => readEventsByPeriod('오늘')}>오늘</Dropdown.Item>
            <Dropdown.Item onClick={() => readEventsByPeriod('일주일')}>일주일</Dropdown.Item>
            <Dropdown.Item onClick={() => readEventsByPeriod('한달')}>한달</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className={styles.handleDisplayMenu}>
          <Dropdown.Toggle className={styles.handleSettingComponent} variant="btn btn-dropdown">
            <i className="mdi mdi-settings d-none d-sm-block"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'eventStatus')}>이벤트 현황 <i className="mdi mdi-checkbox-marked-circle-outline"></i></Dropdown.Item>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'eventList')}>실시간 이벤트</Dropdown.Item>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'deviceList')}>장치 목록</Dropdown.Item>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'accessCtl')}>출입 기록</Dropdown.Item>
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item onClick={() => props.handleCustomLayout(props.layoutNumber, 'close')}>닫기</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* <div className="card-body event"> */}
      <div className={styles.body}>
        {/* <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" className="mb-3 service_type"> */}
        <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" className={styles.tabs}>
          <Tab eventKey="all" title="전체">
            <div className={handleSetTabWidth(props.serviceTypes) ? styles.content_decrease : styles.content}>
              <EventChartJs
                all
                period={period}
                eventLabels={eventLabels}
                eventCount={eventCount}
              />
            </div>
          </Tab>
          <Tab eventKey="observer" title="옵저버">
            <div className={handleSetTabWidth(props.serviceTypes) ? styles.content_decrease : styles.content}>
              <EventChartJs
                observer
                period={period}
                observerLabels={observerLabels}
                observerCount={observerCount}
              />
            </div>
          </Tab>
          {props.serviceTypes && props.serviceTypes.map((serviceType, index) => {
            if (serviceType.setting_value === 'true' && serviceType.name !== 'guardianlite' && serviceType.name !== 'anpr' && serviceType.name !== 'vitalsensor' && serviceType.name !== 'pids' && serviceType.name !== 'mdet' && serviceType.name !== 'crowddensity') {
              return (
                <Tab key={index} eventKey={serviceType.name} title={props.handleChangeServiceTypeName(serviceType.name)} tabClassName={handleSetTabWidth(props.serviceTypes) ? 'small' : 'normal'} >
                  <div className={handleSetTabWidth(props.serviceTypes) ? styles.content_decrease : styles.content}>
                    <EventChartJs
                      mgist={serviceType.name === 'mgist'}
                      serviceType={serviceType.name}
                      period={period}
                      eventLabels={
                        serviceType.name === 'mgist' ?
                          sctlEventLabels
                          :
                          serviceType.name === 'ebell' ?
                            ebEventLabels
                            :
                            serviceType.name === 'accesscontrol' ?
                              accessctlEventLabels
                              :
                              serviceType.name === 'parkingcontrol' ?
                                parkingctlEventLabels
                                :
                                serviceType.name === 'ndoctor' ?
                                  nDoctorEventLabels
                                  :
                                  ''
                      }
                      eventCount={
                        serviceType.name === 'mgist' ?
                          sctlEventCount
                          :
                          serviceType.name === 'ebell' ?
                            ebEventCount
                            :
                            serviceType.name === 'accesscontrol' ?
                              accessctlEventCount
                              :
                              serviceType.name === 'parkingcontrol' ?
                                parkingctlEventCount
                                :
                                serviceType.name === 'ndoctor' ?
                                  nDoctorEventCount
                                  :
                                  ''
                      }
                      handleChangeServiceTypeName={props.handleChangeServiceTypeName}
                    />
                  </div>
                </Tab>
              )
            }
          })}
        </Tabs>
      </div>
    </div >
  )
}
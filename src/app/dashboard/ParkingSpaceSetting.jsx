import React, { useEffect, useState } from 'react';
import { getParkingArea, getParkingSpace, setParkingSpace } from './api/apiService';
import styles from './ParkingSpaceSetting.module.css';

export default function ParkingSpaceSetting({ parkingCamera, parkingAreaUpdate, parkingSpaceUpdate }) {
  const [type, setType] = useState('');
  const [area, setArea] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [filteredUnRegistered, setFilteredUnRegistered] = useState(undefined);
  const [filteredRegistered, setFilteredRegistered] = useState(undefined);
  const [filteredArea, setFilteredArea] = useState('');
  const [filteredAreaRegistered, setFilteredAreaRegistered] = useState('');
  const [unRegisteredCheckedItems, setUnRegisteredCheckedItems] = useState([]);
  const [registeredCheckedItems, setRegisteredCheckedItems] = useState([]);
  const [submitWarn, setSubmitWarn] = useState('');

  const handleChangeType = async (e) => {
    await setType(e.target.value !== '' ? parseInt(e.target.value) : '');
  }

  const handleChangeArea = async (e) => {
    await setFilteredArea(e.target.value);
  }

  const handleChangeAreaRegistered = async (e) => {
    await setFilteredAreaRegistered(e.target.value);
  }

  const readAreas = async () => {
    if (parkingCamera) {
      const res = await getParkingArea(parkingCamera.ipaddress);
      if (res && res.data && res.data.result) {
        await setArea(res.data.result);
      }
    }
  }

  const readSpaces = async () => {
    if (parkingCamera) {
      const res = await getParkingSpace(parkingCamera.ipaddress);
      if (res && res.data && res.data.result) {
        await setSpaces(res.data.result);
        await setFilteredUnRegistered(res.data.result.filter((resultItem) => filteredArea ? (!Number.isInteger(resultItem.type) && (resultItem.parking_area === filteredArea)) : !Number.isInteger(resultItem.type)));
        await setFilteredRegistered(res.data.result.filter((resultItem) => Number.isInteger(type) ? filteredAreaRegistered ? ((resultItem.parking_area === filteredAreaRegistered) && (resultItem.type === type)) : (resultItem.type === type) : filteredAreaRegistered ? ((resultItem.parking_area === filteredAreaRegistered) && Number.isInteger(resultItem.type)) : Number.isInteger(resultItem.type)));
      }
    }
  }

  const handleFilterUnRegistered = async (areaFilter) => {
    if (areaFilter === '') {
      await setFilteredUnRegistered(spaces.filter((spaceDetail) => (spaceDetail.type !== 0 && !spaceDetail.type)));
      await setUnRegisteredCheckedItems([]);
    } else {
      await setFilteredUnRegistered(spaces.filter((spaceDetail) => ((spaceDetail.type !== 0 && !spaceDetail.type) && (spaceDetail.parking_area === areaFilter))));
      await setUnRegisteredCheckedItems([]);
    }
  }

  const handleFilterTypeRegistered = async (typeFilter) => {
    if (typeFilter === '') {
      await setFilteredRegistered(spaces.filter((spaceDetail) => Number.isInteger(parseInt(spaceDetail.type))));
      await setRegisteredCheckedItems([]);
      await setFilteredAreaRegistered('');
    } else {
      await setFilteredRegistered(spaces && spaces.filter((spaceDetail) => spaceDetail.type === typeFilter));
      await setRegisteredCheckedItems([]);
      await setFilteredAreaRegistered('');
    }
  }

  const handleFilterRegistered = async (areaFilter) => {
    if (areaFilter === '') {
      await setFilteredRegistered(spaces.filter((spaceDetail) => ((Number.isInteger(parseInt(type)) ? (spaceDetail.type === type) : (Number.isInteger(parseInt(spaceDetail.type)))))));
      await setRegisteredCheckedItems([]);
    } else {
      await setFilteredRegistered(spaces.filter((spaceDetail) => ((Number.isInteger(parseInt(type)) ? ((spaceDetail.type === type) && (spaceDetail.parking_area === areaFilter)) : (Number.isInteger(parseInt(spaceDetail.type)) && (spaceDetail.parking_area === areaFilter))))));
      await setRegisteredCheckedItems([]);
    }
  }

  const handleToggle = async (idx) => {
    if (unRegisteredCheckedItems.find((checkedItem) => checkedItem === idx)) {
      if (idx !== 'all') {
        await setUnRegisteredCheckedItems((prev) => prev.filter((checkedItem) => ((checkedItem !== idx) && (checkedItem !== 'all'))));
      } else {
        await setUnRegisteredCheckedItems([]);
      }
    } else {
      if (idx !== 'all') {
        await setUnRegisteredCheckedItems((prev) => [...prev, idx]);
      } else {
        await setUnRegisteredCheckedItems((prev) => [...prev, idx, ...filteredUnRegistered.map((filteredUnRegisteredItem) => filteredUnRegisteredItem.idx)]);
      }
    }
  }

  const handleToggleRegistered = async (idx) => {
    if (registeredCheckedItems.find((checkedItem) => checkedItem === idx)) {
      if (idx !== 'all_registered') {
        await setRegisteredCheckedItems((prev) => prev.filter((checkedItem) => ((checkedItem !== idx) && (checkedItem !== 'all_registered'))));
      } else {
        await setRegisteredCheckedItems([]);
      }
    } else {
      if (idx !== 'all_registered') {
        await setRegisteredCheckedItems((prev) => [...prev, idx]);
      } else {
        await setRegisteredCheckedItems((prev) => [...prev, idx, ...filteredRegistered.map((filteredRegisteredItem) => filteredRegisteredItem.idx)]);
      }
    }
  }

  const handleSubmitSetType = async (registerOrUnRegister) => {
    if (registerOrUnRegister === 'register') {
      if (type === '') {
        await setSubmitWarn('저장할 구역을 선택하세요.');
        return;
      } else if (unRegisteredCheckedItems.length === 0) {
        await setSubmitWarn('저장할 미선택 구역을 선택하세요.');
        return;
      }
      let checkedItems = unRegisteredCheckedItems;

      if (checkedItems.find((item) => item === 'all')) {
        checkedItems = checkedItems.filter((item) => item !== 'all')
      }

      let data = {
        checkedItems,
        type
      }
      const res = await setParkingSpace(data);
      if (res && res.data && res.data.status && res.data.status === 'success') {
        return setUnRegisteredCheckedItems([]);
      }
    } else if (registerOrUnRegister === 'unRegister') {
      if (registeredCheckedItems.length === 0) {
        await setSubmitWarn('삭제할 선택 구역을 선택하세요.');
        return;
      }
      let checkedItems = registeredCheckedItems;
      if (checkedItems.find((item) => item === 'all_registered')) {
        checkedItems = checkedItems.filter((item) => item !== 'all_registered')
      }
      let data = {
        checkedItems
      }
      const res = await setParkingSpace(data);
      if (res && res.data && res.data.status && res.data.status === 'success') {
        return setRegisteredCheckedItems([]);
      }
    }
  }

  useEffect(() => {
    readAreas();
    readSpaces();
  }, [parkingCamera])


  useEffect(() => {
    handleFilterUnRegistered(filteredArea)
  }, [filteredArea]);

  useEffect(() => {
    handleFilterTypeRegistered(type)
  }, [type]);

  useEffect(() => {
    handleFilterRegistered(filteredAreaRegistered);
  }, [filteredAreaRegistered])

  useEffect(() => {
    if (parkingSpaceUpdate) {
      readSpaces();
    }
  }, [parkingSpaceUpdate])

  useEffect(() => {
    if (parkingAreaUpdate) {
      readAreas();
      readSpaces();
    }
  }, [parkingAreaUpdate])

  if (parkingCamera) {
    return (
      <>
        <header>
          <span className={styles.displayCamera}>{parkingCamera.name}&nbsp;({parkingCamera.ipaddress})</span>
          {submitWarn && <span className={styles.submitWarn}>{submitWarn}</span>}
          <div className={styles.type_filter}>
            <span className={styles.type_filter_label}>구역</span>
            <select className={styles.type_filter_select} value={type} onChange={handleChangeType}>
              <option className={styles.option} value=''>선택</option>
              <option className={styles.option} value="0">일반</option>
              <option className={styles.option} value="1">경차</option>
              <option className={styles.option} value="2">장애인</option>
              <option className={styles.option} value="3">전기차</option>
              <option className={styles.option} value="4">비주차</option>
            </select>
          </div>
        </header>
        <div>
          <div className={styles.setting_space_type_parent}>
            <div className={styles.setting_space_type}>
              <span className={styles.setting_space_type_space}>
                <label className={styles.unregisted_label}>
                  미선택 구역
                </label>
                <div className={styles.unRegisteredFilter}>
                  <input
                    type="checkbox"
                    id="all"
                    name="all"
                    value={'all' || ''}
                    checked={unRegisteredCheckedItems.find((checkedItem) => checkedItem === 'all')}
                    onChange={() => handleToggle('all')}
                  ></input>
                  <select className={styles.type_filter_select_all} value={filteredArea} onChange={handleChangeArea}>
                    <option className={styles.option} value=''>전체</option>
                    {area && area.map((areaDetail) => <option className={styles.option} key={areaDetail.idx} value={areaDetail.name || ''}>{areaDetail.name}</option>)}
                  </select>
                </div>
                <ul className={styles.unRegisteredList}>
                  {filteredUnRegistered && filteredUnRegistered.map((unRegisteredDetail) => {
                    return <li className={styles.unRegisteredDetail} key={unRegisteredDetail.idx}>
                      <input
                        type="checkbox"
                        id={unRegisteredDetail.idx}
                        name={unRegisteredDetail.parking_area + unRegisteredDetail.index_number}
                        value={(unRegisteredDetail && unRegisteredDetail.idx) || ''}
                        checked={unRegisteredCheckedItems.length > 0 && unRegisteredCheckedItems.find((checkedItem) => checkedItem === unRegisteredDetail.idx)}
                        onChange={() => handleToggle(unRegisteredDetail.idx)}
                      ></input>
                      <label className={styles.unRegisteredDetail_label} htmlFor={unRegisteredDetail.idx}>{unRegisteredDetail.parking_area + unRegisteredDetail.index_number}</label>
                    </li>
                  })}
                </ul>
              </span>
              <span className={styles.display_arrow}>
                <i className="mdi mdi-arrow-right-bold"></i>
                <i className="mdi mdi-arrow-left-bold"></i>
              </span>
              <span className={styles.setting_space_type_type}>
                <label className={styles.registed_label}>
                  {type === '' ? '선택 구역' : (type === 0 ? '일반' : (type === 1 ? '경차' : (type === 2 ? '장애인' : (type === 3 ? '전기차' : (type === 4 ? '비주차' : '')))))}
                </label>
                <div className={styles.registeredFilter}>
                  <input
                    type="checkbox"
                    id="all_registered"
                    name="all_registered"
                    value={'all_registered' || ''}
                    checked={registeredCheckedItems.find((checkedItem) => checkedItem === 'all_registered')}
                    onChange={() => handleToggleRegistered('all_registered')}
                  ></input>
                  <select className={styles.type_filter_select_all} value={filteredAreaRegistered} onChange={handleChangeAreaRegistered}>
                    <option className={styles.option} value=''>전체</option>
                    {area && area.map((areaDetail) => <option className={styles.option} key={areaDetail.idx} value={areaDetail.name || ''}>{areaDetail.name}</option>)}
                  </select>
                </div>
                <ul className={styles.registeredList}>
                  {filteredRegistered && filteredRegistered.map((registeredDetail) => {
                    return <li className={styles.registeredDetail} key={registeredDetail.idx}>
                      <input
                        type="checkbox"
                        id={registeredDetail.idx}
                        name={registeredDetail.parking_area + registeredDetail.index_number}
                        value={registeredDetail.idx || ''}
                        checked={registeredCheckedItems.length > 0 && registeredCheckedItems.find((checkedItem) => checkedItem === registeredDetail.idx)}
                        onChange={() => handleToggleRegistered(registeredDetail.idx)}
                      ></input>
                      <label className={styles.registeredDetail_label} htmlFor={registeredDetail.idx}>{registeredDetail.parking_area + registeredDetail.index_number}</label>
                    </li>
                  })}
                </ul>
              </span>
            </div>
            <div className={styles.btn}>
              <button
                className={styles.addBtn}
                onClick={() => handleSubmitSetType('register')}
              >
                저장
              </button>
              <button
                className={styles.removeBtn}
                onClick={() => handleSubmitSetType('unRegister')}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }
}


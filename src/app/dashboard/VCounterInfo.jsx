import React, { useState, useEffect } from 'react';
import styles from './VCounterInfo.module.css';
import VCounterInfoSetting from './VCounterInfoSetting';

export default function VCounterInfo({ vCounters }) {

  const [vCounterDetail, setVCounterDetail] = useState({
    ipaddress: '',
    empty_slots: '',
    in_count: '',
    out_count: ''
  });
  const [showVCounterSetting, setShowVCounterSetting] = useState(false);

  useEffect(() => {
    vCounters && setVCounterStatus(vCounters);
  }, [vCounters])

  const setVCounterStatus = (vCountersValue) => {
    if (vCounterDetail.length > 1) {
      return setVCounterDetail({
        ipaddress: '',
        empty_slots: (vCountersValue.map(vCounter => vCounter.empty_slots).reduce((prev, curr) => (prev + curr), 0) / 2),
        in_count: vCountersValue.map(vCounter => vCounter.in_count).reduce((prev, curr) => (prev + curr), 0),
        out_count: vCountersValue.map(vCounter => vCounter.out_count).reduce((prev, curr) => (prev + curr), 0)
      })
    } else if (vCountersValue.length === 1) {
      return setVCounterDetail({
        ipaddress: vCountersValue[0].ipaddress,
        empty_slots: vCountersValue[0].empty_slots,
        in_count: vCountersValue[0].in_count,
        out_count: vCountersValue[0].out_count
      })
    }
  }

  const handleShowVCounterSetting = (e) => {
    if (e) {
      e.preventDefault();
    }
    setShowVCounterSetting((prev) => !prev);
  }

  if (vCounters && vCounterDetail) {
    return (
      <>
        <span className={styles.status}>
          <div className={styles.location}>
            <span className={styles.occupancy}>주차 가능 공간 : {vCounterDetail.empty_slots}</span>
            <span className={styles.in_count}>입차 : {vCounterDetail.in_count}</span>
            <span className={styles.out_count}>출차 : {vCounterDetail.out_count}</span>
            <span className={styles.edit} onClick={() => handleShowVCounterSetting()}>
              <i className="fa fa-edit"></i>
            </span>
          </div>
        </span>
        {
          showVCounterSetting && <VCounterInfoSetting
            vCounterInfo={vCounterDetail}
            handleClose={handleShowVCounterSetting}
          />
        }
      </>
    )
  } else {
    return ''
  }
}

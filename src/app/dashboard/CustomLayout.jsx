import React, { useState, useEffect } from 'react';
import styles from './CustomLayout.module.css';

export default function CustomLayout({
  showSetLayout,
  handleSettingLayout,
  leftLayout1,
  leftLayout2,
  rightLayout1,
  rightLayout2,
  handleCustomLayout
}) {

  const [layout1, setLayout1] = useState(leftLayout1.visible ? leftLayout1.element : 'close');
  const [layout2, setLayout2] = useState(leftLayout2.visible ? leftLayout2.element : 'close');
  const [layout3, setLayout3] = useState(rightLayout1.visible ? rightLayout1.element : 'close');
  const [layout4, setLayout4] = useState(rightLayout2.visible ? rightLayout2.element : 'close');

  useEffect(() => {
    setLayout1(leftLayout1.visible ? leftLayout1.element : 'close');
    setLayout2(leftLayout2.visible ? leftLayout2.element : 'close');
    setLayout3(rightLayout1.visible ? rightLayout1.element : 'close');
    setLayout4(rightLayout2.visible ? rightLayout2.element : 'close');
  }, [leftLayout1, leftLayout2, rightLayout1, rightLayout2])

  const handleChangeValue = (e) => {
    const { name, value } = e.currentTarget;
    if (name === 'layout1') {
      setLayout1(value);
      handleCustomLayout(1, value);
    } else if (name === 'layout2') {
      setLayout2(value);
      handleCustomLayout(2, value);
    } else if (name === 'layout3') {
      handleCustomLayout(3, value);
      setLayout3(value);
    } else if (name === 'layout4') {
      handleCustomLayout(4, value);
      setLayout4(value);
    }
  }

  return (
    <div className={styles.CustomLayout}>
      <header className={styles.header}>
        <h4>레이아웃 사용자 설정</h4>
        <span>
          <a href="!#" className={styles.closeBtn} onClick={(e) => handleSettingLayout(e)}></a>
        </span>
      </header>
      <div className={styles.displayLayout}>
        <span className={styles.leftbar}>
          <label className={styles.leftbar_label}>왼쪽 영역</label>
          <div>
            <select className={styles.layout_select} name='layout1' value={layout1} onChange={handleChangeValue}>
              <option value="close">사용 안 함</option>
              <option value="eventStatus">이벤트 현황</option>
              <option value="eventList">실시간 이벤트</option>
              <option value="deviceList">장치 목록</option>
              <option value="accessCtl">출입 기록</option>
            </select>
          </div>
          <div>
            <select className={styles.layout_select} name='layout2' value={layout2} onChange={handleChangeValue}>
              <option name='layout2' value="close">사용 안 함</option>
              <option name='layout2' value="eventStatus">이벤트 현황</option>
              <option name='layout2' value="eventList">실시간 이벤트</option>
              <option name='layout2' value="deviceList">장치 목록</option>
              <option name='layout2' value="accessCtl">출입 기록</option>
            </select>
          </div>
        </span>
        <span className={styles.rightbar}>
          <label className={styles.rightbar_label}>오른쪽 영역</label>
          <div>
            <select className={styles.layout_select} name='layout3' value={layout3} onChange={handleChangeValue}>
              <option name='layout3' value="close">사용 안 함</option>
              <option name='layout3' value="eventStatus">이벤트 현황</option>
              <option name='layout3' value="eventList">실시간 이벤트</option>
              <option name='layout3' value="deviceList">장치 목록</option>
              <option name='layout3' value="accessCtl">출입 기록</option>
            </select>
          </div>
          <div>
            <select className={styles.layout_select} name='layout4' value={layout4} onChange={handleChangeValue}>
              <option name='layout4' value="close">사용 안 함</option>
              <option name='layout4' value="eventStatus">이벤트 현황</option>
              <option name='layout4' value="eventList">실시간 이벤트</option>
              <option name='layout4' value="deviceList">장치 목록</option>
              <option name='layout4' value="accessCtl">출입 기록</option>
            </select>
          </div>
        </span>
      </div>
    </div>
  );
}
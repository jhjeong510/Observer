import React, { useState, useEffect } from 'react';
import { updateVCounter } from './api/apiService';
import styles from './VCounterInfoSetting.module.css';

export default function VCounterInfoSetting({ vCounterInfo, handleClose, vCounters }) {

  const [vCounterDetail, setVCounterDetail] = useState({
    empty_slots: '',
    in_count: '',
    out_count: ''
  })
  const [inputWarn, setInputWarn] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVCounterDetail((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { empty_slots, in_count, out_count } = vCounterDetail;
    const portRegExp = new RegExp('^[0-9]+$');
    if (empty_slots === '') {
      setInputWarn('주차 가능 공간을 새로 설정하세요.');
      return;
    }
    if (in_count === '') {
      setInputWarn('입차를 새로 설정하세요.');
      return;
    }
    if (out_count === '') {
      setInputWarn('출차를 새로 설정하세요.');
      return;
    }
    if (!portRegExp.test(empty_slots)) {
      setInputWarn('주차 공간을 숫자(정수)로 입력해주세요.');
      return;
    }
    if (!portRegExp.test(in_count)) {
      setInputWarn('입차를 숫자(정수)로 입력해주세요.');
      return;
    }
    if (!portRegExp.test(out_count)) {
      setInputWarn('출차를 숫자(정수)로 입력해주세요.');
      return;
    }
    if (inputWarn !== '') {
      setInputWarn('');
    }
    let res;
    if (vCounterInfo && vCounterInfo.ipaddress) {
      res = await updateVCounter({ empty_slots: parseInt(empty_slots), in_count: parseInt(in_count), out_count: parseInt(out_count), type: 'in_out', ipaddress: vCounterInfo.ipaddress });
    } else {
      res = await updateVCounter({ empty_slots: parseInt(empty_slots), in_count: parseInt(in_count), out_count: parseInt(out_count), type: 'part1' });
    }
    if (res && res.status === 200) {
      handleClose();
    }
  }

  useEffect(() => {
    console.log(vCounterInfo)
  }, [])

  return (
    <div className={styles.vCounterSettingmodal}>
      <div className={styles.closeDiv}>
        <a href="!#" className={styles.vCounterSettingmodal_closer} onClick={(e) => handleClose(e)}></a>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {inputWarn && <span className={styles.input_warn}>{inputWarn}</span>}
        <span className={styles.input_box}>
          <label className={styles.label} htmlFor='empty_slots'>주차 가능 공간</label>
          <input type='text' id='empty_slots' name='empty_slots' value={vCounterDetail.empty_slots} onChange={handleChange}></input>
        </span>
        <span className={styles.input_box}>
          <label className={styles.label} htmlFor='in_count'>입차</label>
          <input type='text' id='in_count' name='in_count' value={vCounterDetail.in_count} onChange={handleChange}></input>
        </span>
        <span className={styles.input_box}>
          <label className={styles.label} htmlFor='out_count'>출차</label>
          <input type='text' id='out_count' name='out_count' value={vCounterDetail.out_count} onChange={handleChange}></input>
        </span>
        <button
          className={styles.submit_btn}
          onClick={handleSubmit}
        >수정</button>
      </form>
    </div>
  )
}

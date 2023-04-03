import React, { Component } from 'react';
import { Modal, Button, Form, Table, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import ModalConfirm from '../../../dashboard/ModalConfirm';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import * as dateFns from "date-fns";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import ReactTooltip from 'react-tooltip';
import styles from './BreathSchedule.module.css';


class BreathSchedule extends Component {

  _isMounted = false;
  state = {
    modalBreathWarn: '',
    modalGroupWarn: '',
    getScheduleStartTime: undefined,
    getScheduleEndTime: undefined,
    showModal: false,
    modalTitle: '',
    modalMessage: '',
    checked: false,
    newStartTime: '',
    newEndTime: '',
    scheduleArray: [],
    getGroupData: [],
    groupName: '',
    modalCurrentBreathGroup: '',
    breathSensorGroupStatus: [],
    modalApplyToSameGroup: false,
    modalCurrentApplyToSameGroup: '',
    breathValueData: '',
    threshold_value_warn: '',
    showModalBreathDeviceGroup: false,
    modalBreathDeviceGroupArray: [],
    thresholdValueWarnings: []
  }

  async componentDidMount() {
    this._isMounted = true;
    await this.handleGetBreathSensorSchedule();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.breathSensorScheduleList.length !== this.props.breathSensorScheduleList.length) {
      this.handleGetBreathSensorSchedule();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleGetBreathSensorSchedule = async () => {
    try {
      const result = await axios.get('/api/observer/scheduleGroup');
      if (result && result.data.result && result.data.result.length > 0) {
        const getGroupData = result.data.result;
        const testTime = getGroupData[0].schedule_time;
        const scheduleTime = getGroupData[0].schedule_time.split("^");
        const startTime = scheduleTime[0][0];
        const endTime = scheduleTime[0][1];

        this._isMounted && await this.setState({
          getGroupData,
          // getScheduleStartTime: startTime,
          // getScheduleEndTime: endTime,
        });
      }
      return result;
    } catch (err) {
      console.log('err', err);
    }
  }

  onChange = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  handleChangeGroupName = (e) => {
    this.setState({ groupName: e.currentTarget.value });
  }

  setThresholdWarning(index, warning) {
    this.setState(prevState => {
      const thresholdValueWarnings = [...prevState.thresholdValueWarnings];
      thresholdValueWarnings[index] = warning;
      return { thresholdValueWarnings };
    });
  }

  handleChangeBreathGroup = async (value, e) => {
    const groupName = e.currentTarget.value;
    const ipaddress = value.ipaddress;
    try {
      if (groupName !== '선택 해제' && groupName !== '없음') {
        const res = await axios.put('/api/observer/scheduleGroupApply', {
          groupName,
          ipaddress
        });
      } else {
        const res = await axios.put('/api/observer/scheduleGroupApply', {
          groupName,
          ipaddress
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleChangeApplyToSameGroup = (e) => {
    this.setState({ modalCurrentApplyToSameGroup: e.currentTarget.value });
  }

  handleCloseModalApplyToSameGroup = () => {
    this.setState({ modalApplyToSameGroup: false });
  }

  handleCancel = async () => {
    this.setState({ showModal: false });
  }

  handleBreathGroupCancel = () => {
    this.setState({
      modalBreathDeviceGroupArray: [],
      showModalBreathDeviceGroup: false
    })
  }

  saveSchedule = async (e) => {
    const { newStartTime, newEndTime } = this.state;
    const addScheduleTime = newStartTime + '~' + newEndTime;

    if (this.state.newStartTime === undefined || this.state.newStartTime === '' ||
      this.state.newEndTime === undefined || this.state.newEndTime === '') {
      this.setState({ modalGroupWarn: '스케줄 그룹 시간을 설정하세요.' })
      return
    }
    if (this.state.newStartTime >= this.state.newEndTime) {
      this.setState({ modalGroupWarn: '종료시간은 시작시간보다 같거나 빠를 수 없습니다.' })
      return
    }

    let newTimeArray = [];
    newTimeArray = this.state.scheduleArray;
    if (Array.isArray(this.state.scheduleArray)) {
      newTimeArray.push(addScheduleTime)
    }

    this.setState({
      scheduleArray: newTimeArray,
      modalGroupWarn: '',
    })
  }

  handleApplyToSameGroup = async () => {
    const groupName = this.state.modalCurrentApplyToSameGroup
    try {
      if (groupName !== '선택 해제' && groupName !== '없음') {
        const res = await axios.put('/api/observer/groupApplyToAll', {
          groupName,
        });
      } else {
        const res = await axios.put('/api/observer/groupApplyToAll', {
          groupName,
        })
      }
    } catch (err) {
      console.log('일괄적용 err: ', err);
    }
    this.setState({
      modalApplyToSameGroup: false,
      modalCurrentApplyToSameGroup: '',
    });
  }

  deleteSchedule = async (sensor, index) => {
    try {
      if (sensor && sensor !== undefined) {
        const res = await axios.put('/api/observer/delSchedule', {
          delScheduleTime: sensor.name
        });
        await this.handleGetBreathSensorSchedule();
        if (res.data.message === 'ok') {
          this.setState({ showModal: true });
          this.setState({ modalTitle: '스케줄 삭제' });
          this.setState({ modalMessage: '해당 스케줄 그룹을 삭제했습니다.' });
        }

        if (res && res.data && res.data.result && res.data.result.length > 0) {
          // console.log('설정 스케줄: ', res);
        }
      }
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  handleChangeStartTime = (startTime) => {
    if (this.props.breathSensorList.length === 0) {
      this.setState({ modalBreathWarn: '지도(도면) 상에 바이탈센서를 등록 후 스케줄 생성이 가능합니다.' })
    } else {
      try {
        this.setState({ startTime: startTime });
        const newStartTime = dateFns.format(startTime, 'HHmmss');
        this.setState({ newStartTime: newStartTime });
      } catch (err) {
        console.error('이벤트 발생 시간 선택 Error: ', err);
      }
    }
    return
  }

  handleChangeEndTime = (endTime) => {
    try {
      this.setState({ endTime: endTime });
      const newEndTime = dateFns.format(endTime, 'HHmmss');
      this.setState({ newEndTime: newEndTime });
    } catch (err) {
      console.error('이벤트 종료 시간 선택 Error: ', err)
    }
  }

  changeUseStatus = async (sensor) => {
    let status = 'true';
    if (sensor.use_status === 'true') {
      status = 'false'
    }

    try {
      const res = await axios.put('/api/observer/vitalsensorStatus', {
        ipaddress: sensor.ipaddress,
        status
      })
    } catch (err) {
      console.log('change status err : ', err);
    }
  }

  handleChangeBreathValue(e, index) {
    const value = e.target.value;
  
    if (value < 0 || value > 2000) {
      this.setThresholdWarning(index, "0 ~ 2000 사이의 값을 입력해주세요.");
    } else {
      this.setThresholdWarning(index, "");
    }
  }
  

  handleClear = () => {
    const res = document.querySelectorAll('#data-storage-period-input2');
    if (res) {
      res.forEach((breath) => {
        breath.value = '';
      })
    }
  }

  changeSetDbBreathValue = async (e, sensor) => {
    e.preventDefault();
    let value = this.state.breathValueData;
    const checkThresHoldValue = !isNaN(value);

    if (value === '') {
      this.setState({ threshold_value_warn: '값을 입력해주세요.' });
      return;
    } else if (!checkThresHoldValue) {
      this.setState({ threshold_value_warn: '값을 0~2000 사이의 숫자로 입력해주세요.' });
      return;
    } else if (value > 2000 || value < 0) {
      this.setState({ threshold_value_warn: '값을 0~2000 사이의 숫자로 입력해주세요.' });
      return;
    } else {
      this.setState({ threshold_value_warn: '' });
    }

    let res;
    try {
      res = await axios.put('/api/observer/vitalValue', {
        ipaddress: sensor.ipaddress,
        breathValue: value
      })
    } catch (err) {
      console.log('임계치 설정 err: ', err);
    }
    this.setState({ showModal: true });
    this.setState({ modalTitle: '임계치 값 변경' });
    this.setState({ modalMessage: '임계치 값이 변경 됐습니다.' });

    this.setState({
      breathValueData: '',
      threshold_value_warn: '',
      value: '',
    });
    await this.handleClear();
  }

  sameGroupApplyToDevice = () => {
    this.setState({ modalApplyToSameGroup: true }, () => { ReactTooltip.hide('.changeGroupToolTip') });
  }

  scheduleGroupSave = async () => {
    if (this.state.groupName === undefined || this.state.groupName === '') {
      this.setState({ modalGroupWarn: '그룹명을 입력하세요.' })
      return
    }
    if (this.state.groupName.length > 10) {
      this.setState({ modalGroupWarn: '그룹명은 10자 이내로 입력하세요.' })
      return
    }
    if (this.state.newStartTime === undefined || this.state.newStartTime === '' ||
      this.state.newEndTime === undefined || this.state.newEndTime === '') {
      this.setState({ modalGroupWarn: '스케줄 그룹 시간을 설정하세요.' })
      return
    }

    try {
      const res = await axios.put('/api/observer/scheduleGroup', {
        groupName: this.state.groupName,
        groupTimeSchedule: this.state.scheduleArray
      })
    } catch (error) {
      console.log('스케줄 그룹 생성 에러', error);
    }
    this.setState({ showModal: true });
    this.setState({ modalTitle: '스케줄 그룹 설정' });
    this.setState({ modalMessage: '스케줄 그룹이 추가 됐습니다.' });

    this.setState({
      groupName: '',
      scheduleArray: [],
      startTime: '',
      endTime: '',
      newStartTime: '',
      newEndTime: '',
      modalGroupWarn: ''
    })
  }

  showScheduleGroupDevice = (scheduleName) => {
    const scList = this.props.breathSensorList.filter((sensor) => sensor.schedule_group === scheduleName);
    const splitSensor = scList.map((sensor) => {
      return sensor.name + '(' + sensor.location + '),'
    })
    this.setState({
      showModalBreathDeviceGroup: true,
      modalBreathDeviceGroupArray: splitSensor
    })
  }

  render() {
    return (
      <div className="card vms2">
        <div className="card-body breathSchedule">
          <h4 className="card-title schedule" style={{ marginTop: '5px', marginLeft: '3px' }}> 바이탈센서 동작 스케줄 설정</h4>
          <div className='col-12'>
            <div className='row'>
              <div className='col-7 breathLine'>
                <div>
                  {this.state.getGroupData && this.state.getGroupData.length > 0 ?
                    <Table style={{ width: '580px' }} striped bordered className='LEFTBREATH'>
                      <thead style={{ width: '580px', borderTop: 'thin solid #4b4747' }}>
                        <tr>
                          <th style={{ width: '150px', textAlign: 'center' }}>그룹명</th>
                          <th style={{ width: '210px', textAlign: 'center' }}>스케줄 동작 시간</th>
                          <th style={{ width: '100px', textAlign: 'center' }}>삭제</th>
                          <th style={{ width: '120px', textAlign: 'center' }}>장치</th>
                        </tr>
                      </thead>
                      {this.state.getGroupData.length !== 0 && this.state.getGroupData.map((time, index) => {
                        let splitTime;
                        let newSplitTime = [];
                        splitTime = time.schedule_time.split("^");
                        for (let i = 0; i < splitTime.length; i++) {
                          const startTime = splitTime[i].substring(0, 2) + '시' + splitTime[i].substring(2, 4) + "분"
                          const endTime = splitTime[i].substring(7, 9) + '시' + splitTime[i].substring(9, 11) + "분"
                          const theTime = startTime + '~' + endTime
                          newSplitTime.push(theTime);
                        }
                        splitTime = newSplitTime;
                        return (
                          <tbody style={{ width: '580px' }} key={time.idx}>
                            <tr>
                              <td style={{ width: '150px', textAlign: 'center', cursor: 'pointer' }}>{time.name}</td>
                              <td style={{ width: '210px', textAlign: 'center' }}>
                                {splitTime && splitTime.length === 1 ?
                                  splitTime.map((text, index) => (
                                    <React.Fragment key={index}>
                                      {text}
                                      <br />
                                    </React.Fragment>
                                  ))
                                  :
                                  splitTime.map((text, index) => (
                                    <React.Fragment key={index}>
                                      {text},
                                      <br />
                                    </React.Fragment>
                                  ))
                                }
                              </td>
                              <td style={{ width: '100px', textAlign: 'center' }}>
                                <button type="submit" className={styles.delete_btn} onClick={() => this.deleteSchedule(time, index)}>삭제</button>
                              </td>
                              <td style={{ width: '120px', textAlign: 'center' }}>
                                <button type="submit" className={styles.viewingDevices_btn} onClick={() => this.showScheduleGroupDevice(time.name)}>장치보기</button>
                              </td>
                            </tr>
                          </tbody>
                        )
                      })}
                    </Table>
                    :
                    <Table style={{ width: '580px' }} striped bordered className='LEFTBREATH'>
                      <thead style={{ width: '580px', borderTop: 'thin solid #4b4747' }}>
                        <tr>
                          <th style={{ width: '150px', textAlign: 'center' }}>그룹명</th>
                          <th style={{ width: '210px', textAlign: 'center' }}>스케줄 동작 시간</th>
                          <th style={{ width: '100px', textAlign: 'center' }}>삭제</th>
                          <th style={{ width: '120px', textAlign: 'center' }}>장치</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ width: '150px', textAlign: 'center' }}></td>
                          <td style={{ width: '210px', textAlign: 'center' }}></td>
                          <th style={{ width: '100px', textAlign: 'center' }}></th>
                          <th style={{ width: '120px', textAlign: 'center' }}></th>
                        </tr>
                      </tbody>
                    </Table>
                  }
                </div>
              </div>
              <div className='col-5'>
                <div>
                  <form className="forms-sample">
                    <Form.Group className="row">
                      <p className="card-description events datePicker" style={{ marginLeft: '-9px', marginRight: '30px' }}>그룹명</p>
                      <div >
                        <Form.Control className="form-control" style={{ width: '206px', marginLeft: '6px' }} value={this.state.groupName} onChange={this.handleChangeGroupName} />
                      </div>
                    </Form.Group>
                  </form>
                </div>
                <div className="card-body events">
                  <p className="card-description events datePicker">시간 설정</p>
                  <div className="daterange-picker allEvents">
                    <DatePicker
                      selected={this.state.startTime}
                      onChange={(date) => this.handleChangeStartTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={10}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="form-control TimePicker Schedule"
                    />
                    <span className="range-seperator-datePicker"> ~ </span>
                    <DatePicker
                      selected={this.state.endTime}
                      onChange={(date) => this.handleChangeEndTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={10}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="form-control TimePicker Schedule"
                    />
                    <span className="range-seperator-datePicker">  </span>
                  </div>
                  <div className="vms-buttons">
                    <button type="submit" className={styles.add_btn} style={{ height: '37px' }} onClick={(e) => this.saveSchedule(e)}>추가</button>
                  </div>
                </div>
                <Form.Text style={{ color: 'red', width: '400px', marginLeft: '22px' }}>{this.state.modalBreathWarn}</Form.Text>

                <div className='breathsensor scheduletime'>
                  {this.state.scheduleArray.length > 0 ?
                    <Table style={{ width: '330px' }} striped bordered className='LEFTBREATH'>
                      <thead style={{ width: '330px', marginLeft: '40px', borderTop: 'thin solid #4b4747' }}>
                        <tr>
                          <th style={{ width: '330px', textAlign: 'center' }}>바이탈센서 동작(스케줄) 시간</th>
                        </tr>
                      </thead>
                      {this.state.scheduleArray.map((time, index) => {
                        const splitTime = time.split("~")
                        const startTime = splitTime[0].substring(0, 2) + '시' + splitTime[0].substring(2, 4) + "분"
                        const endTime = splitTime[1].substring(0, 2) + '시' + splitTime[1].substring(2, 4) + "분"
                        return (
                          <tbody style={{ width: '330px', marginLeft: '40px' }} key={index}>
                            <tr>
                              <td style={{ width: '330px', textAlign: 'center' }}> {startTime} ~ {endTime}</td>
                            </tr>
                          </tbody>
                        )
                      })}
                    </Table>
                    :
                    <Table style={{ width: '330px' }} striped bordered className='LEFTBREATH'>
                      <thead style={{ width: '330px', marginLeft: '40px', borderTop: 'thin solid #4b4747' }}>
                        <tr>
                          <th style={{ width: '330px', textAlign: 'center' }}>바이탈센서 동작(스케줄) 시간</th>
                        </tr>
                      </thead>
                      <tbody style={{ width: '330px', marginLeft: '40px' }}>
                        <tr>
                          <td style={{ width: '330px', textAlign: 'center' }}></td>
                        </tr>
                      </tbody>
                    </Table>
                  }
                </div>
                <div className='row' style={{ height: '0px' }}>
                  <Form.Text style={{ color: 'red', width: '400px', marginLeft: '62px', textAlign: 'center', position: 'fixed', top: '404px', right: '130px' }}>{this.state.modalGroupWarn}</Form.Text>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <div className='row'>
                      <div className='col-5'>
                      </div>
                      <div className='col-7' style={{ marginTop: '20px' }}>
                        <button type="submit" className={styles.saveGroups_btn} onClick={this.scheduleGroupSave}>그룹저장</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row' style={{ width: '1067px' }}>
            <div className='breathsensor sensorList'>
              <div className='row' style={{ width: '1050px' }}>
                <div className='col-12'>
                  <div className='row'>
                    <div className='col-10'>
                    </div>
                    <div className='col-2' style={{ marginTop: '10px' }}>
                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" placement='top' style={{ zIndex: '1111111111111' }}>
                        <p>그룹 일괄적용 버튼 클릭 시, 스케줄 그룹을 선택하는 팝업창이 발생합니다. </p>
                        <span style={{ fontSize: '14px' }}>원하는 스케줄을 선택 후 확인 시, 모든 바이탈센서에 선택한 스케줄 그룹이 일괄 적용 됩니다.</span>
                      </Tooltip>}>
                        <button className={styles.allGroups_btn}>그룹 일괄적용 ⓘ</button>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
              </div>
              {this.props.breathSensorList && this.props.breathSensorList.length !== 0 ?
                <Table style={{ width: '980px' }} striped bordered className='VMS2'>
                  <thead style={{ width: '980px', borderTop: 'thin solid #4b4747' }}>
                    <tr>
                      <th style={{ width: '190px', textAlign: 'center' }}>
                        <div>
                          <OverlayTrigger overlay={<Tooltip id="tooltip-top" placement='top' style={{ zIndex: '1111111111111', width: '200px' }}>
                            <p>수감실형 타입은 설정한 임계치 아래로 떨어지면 알람이 발생하고, </p>
                            <span style={{ fontSize: '14px' }}>천장(복도)형은 설정한 임계치 위로 올라가면 알람이 발생합니다. </span>
                          </Tooltip>}>
                            <span>바이탈센서명(타입) ⓘ</span>
                          </OverlayTrigger>
                        </div>
                      </th>
                      <th style={{ width: '190px', textAlign: 'center' }}>설치 위치</th>
                      <th style={{ width: '150px', textAlign: 'center', letterSpacing: '-0.2px' }}>바이탈센서 사용유무</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>임계치</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>임계치 설정</th>
                      <th style={{ width: '200px', textAlign: 'center' }}>스케줄 그룹 개별적용</th>
                    </tr>
                  </thead>
                  {this.props.breathSensorList && this.props.breathSensorList.sort((a, b) => a.idx - b.idx).map((sensor, index) => {
                    return (
                      <tbody key={index}>
                        <tr>
                          <td style={{ width: '190px', textAlign: 'center' }}>
                            <span style={{ display: 'inline-block', justifyContent: 'center', width: '150px' }}>
                              {sensor.install_location && sensor.install_location === 'room' ?
                                (sensor.name.length < 7 ? <span> {sensor.name} (수감실형) </span> : <><p>{sensor.name}</p> <span>(수감실형)</span></>)
                                :
                                (sensor.name.length < 6 ? <span>{sensor.name} (천장(복도)형)</span> : <><p>{sensor.name}</p> <span>(천장(복도)형)</span></>)}
                            </span>
                          </td>
                          <td style={{ width: '190px', textAlign: 'center' }}>{sensor.location}</td>
                          <td style={{ width: '150px', textAlign: 'center' }}>
                            <Form >
                              <Form.Check
                                className='breath radioButton'
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                checked={sensor.use_status === 'true' ? true : false}
                                onChange={() => this.changeUseStatus(sensor)}
                              />
                            </Form>
                          </td>
                          <td style={{ width: '100px', textAlign: 'center' }} >  {sensor.breath_value} </td>
                          <td style={{ width: '150px', textAlign: 'center' }}>
                            <Form>
                              <div style={{ display: 'flex' }} key={index}>
                                {/* <Form.Control id={'data-storage-period-input2'} onChange={this.handleChangeBreathValue} /> */}
                                <Form.Control id={'data-storage-period-input2'} onChange={(e) => this.handleChangeBreathValue(e, index)} />
                                <button className={styles.change_btn} onClick={(e) => this.changeSetDbBreathValue(e, sensor)}>변경</button>
                              </div>
                              {/* <Form.Text style={{ color: 'red' }}>{this.state.threshold_value_warn}</Form.Text> */}
                              <Form.Text style={{ color: 'red' }}>{this.state.thresholdValueWarnings[index]}</Form.Text>

                            </Form>
                          </td>
                          <td style={{ width: '200px', textAlign: 'center' }}>
                            <Form>
                              <select className="form-control groupSelect" onChange={this.handleChangeBreathGroup.bind(this, sensor)} value={this.state.modalCurrentBreathGroup}>
                                <option>{sensor && sensor.schedule_group !== '' && sensor.schedule_group !== null ? sensor.schedule_group : '스케줄 그룹 선택'}</option>
                                <option value={'none'} disabled>--------------------</option>
                                <option value={'없음'}>선택 해제</option>
                                {this.state.getGroupData.map((data, index) => {
                                  return <option key={index} value={data.name}>{data.name}</option>
                                })}
                              </select>
                            </Form>
                          </td>
                        </tr>
                      </tbody>
                    )
                  })
                  }
                </Table>
                :
                <Table style={{ width: '980px' }} striped bordered className='VMS2'>
                  <thead style={{ width: '980px', borderTop: 'thin solid #4b4747' }}>
                    <tr>
                      <th style={{ width: '190px', textAlign: 'center' }}>
                        <div>
                          <span data-tip data-for="registerTip">바이탈센서명(타입) ⓘ</span>
                          <ReactTooltip id="registerTip" place="top" effect="solid" type='light'>
                            <p>수감실형 타입은 설정한 임계치 아래로 떨어지면 알람이 발생하고, </p>
                            <span style={{ fontSize: '14px' }}>천장(복도)형은 설정한 임계치 위로 올라가면 알람이 발생합니다. </span>
                          </ReactTooltip>
                        </div>
                      </th>
                      <th style={{ width: '190px', textAlign: 'center' }}>설치 위치</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>바이탈센서 사용유무</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>임계치</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>임계치 설정</th>
                      <th style={{ width: '200px', textAlign: 'center' }}>스케줄 그룹 개별적용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: '190px', textAlign: 'center' }}></td>
                      <td style={{ width: '190px', textAlign: 'center' }}></td>
                      <td style={{ width: '150px', textAlign: 'center' }}></td>
                      <th style={{ width: '100px', textAlign: 'center' }}></th>
                      <th style={{ width: '150px', textAlign: 'center' }}></th>
                      <td style={{ width: '200px', textAlign: 'center' }}></td>
                    </tr>
                  </tbody>
                </Table>
              }
            </div>
          </div>
        </div>
        <Modal
          show={this.state.modalApplyToSameGroup}
          onHide={this.handleCloseModalApplyToSameGroup}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        // className='ack-sv'
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              스케줄 그룹 일괄적용
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>전체 바이탈센서에 선택한 스케줄 그룹(동작시간) 일괄적용</Form.Label>
                <Form>
                  <select className="form-control groupSelect" onChange={this.handleChangeApplyToSameGroup} value={this.state.modalCurrentApplyToSameGroup}>
                    <option>스케줄 그룹 선택</option>
                    <option value={'none'} disabled>--------------------</option>
                    <option value={'없음'}>선택 해제</option>
                    {this.state.getGroupData.map((data, index) => {
                      return <option key={index} value={data.name}>{data.name}</option>
                    })}
                  </select>
                </Form>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalGroupWarn}</Form.Text>
            </Form>
          </Modal.Body>.preview-list .preview-item .preview-item-content p
          <Modal.Footer>
            <button className={styles.check_btn} onClick={() => this.handleApplyToSameGroup()}>
              확인
            </button>
            <button className={styles.close_btn} type='button' onClick={this.handleCloseModalApplyToSameGroup}>
              취소
            </button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showModalBreathDeviceGroup} centered>
          <Modal.Header className="vms-alert-modal">
            <Modal.Title style={{ color: 'white', textDecoration: 'underline' }}>해당 스케줄 그룹이 적용된 장치목록</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form style={{ color: 'rgb(251 195 92)' }}>
              {this.state.modalBreathDeviceGroupArray && this.state.modalBreathDeviceGroupArray.length >= 1 ? this.state.modalBreathDeviceGroupArray.map((sensor) => {
                return (
                  sensor + '  '
                )
              })
                :
                <span style={{ color: 'white' }}>해당 스케줄 그룹에 할당된 장치 없음</span>
              }
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className={styles.check_btn} onClick={this.handleBreathGroupCancel}>
              확인
            </button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showModal} centered>
          <Modal.Header className="vms-alert-modal">
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body className=''>{this.state.modalMessage}</Modal.Body>
          <Modal.Footer>
            <button className={styles.check_btn} onClick={this.handleCancel}>
              확인
            </button>
          </Modal.Footer>
        </Modal>
        <ModalConfirm
          showModal={this.state.showDelConfirm}
          modalTitle={this.state.modalConfirmTitle}
          modalMessage={this.state.modalConfirmMessage}
          modalConfirmBtnText={this.state.modalConfirmBtnText}
          modalCancelBtnText={this.state.modalConfirmCancelBtnText}
          handleConfirm={this.handleDelConfirm}
          handleCancel={this.handleDelCancel}
        />
      </div>
    );
  }
}

export default BreathSchedule;
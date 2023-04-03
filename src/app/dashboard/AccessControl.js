import React, { Component } from 'react';
import { UserInfoContext } from '../context/context';
import { Dropdown } from 'react-bootstrap';
import styles from './AccessControl.module.css';

class AccessControl extends Component {
    static contextType = UserInfoContext;

    state = {
        userImage: '',
        isSelected: false,
        selectInfo: {
            LogPersonID: '',
            LogPersonLastName: '',
            LogTitleName: '',
            LogDoorName: '',
            LogDate: '',
            LogTime: '',
            LogStatusName: '',
            selectEvent: ''
        },
        accessLogArray: [],
    }

    selectEvent = (logIdx) => {
        const clickAccessList = this.props.accessControlLog.find((event) => event.LogIDX === logIdx);
        const findDoorInfo = this.props.deviceList.find((door) => door.name === clickAccessList.LogDoorName);
        if (findDoorInfo) {
            this.props.moveToTheThisDevice(findDoorInfo.id, 'door', findDoorInfo.building_idx, findDoorInfo.floor_idx, findDoorInfo.building_service_type, new Date().getTime());
        }
        let image_path
        if (clickAccessList) {
            if (clickAccessList.LogPersonID) {
                image_path = `http://${this.context.websocket_url}/images/access_control_person/${clickAccessList.LogPersonID}.png`;
                this.setState({
                    isSelected: true,
                    LogPersonID: clickAccessList.LogPersonID,
                    LogPersonLastName: clickAccessList.LogPersonLastName,
                    LogTitleName: clickAccessList.LogTitleName,
                    LogDoorName: clickAccessList.LogDoorName,
                    LogDate: clickAccessList.LogDate,
                    LogTime: clickAccessList.LogTime,
                    LogStatusName: clickAccessList.LogStatusName,
                    userImage: image_path,
                    selectEvent: logIdx
                }, () => this.detailInfo());
            } else {
                this.setState({
                    isSelected: true,
                    LogPersonID: clickAccessList.LogPersonID,
                    LogPersonLastName: clickAccessList.LogPersonLastName ? clickAccessList.LogPersonLastName : '미등록',
                    LogTitleName: clickAccessList.LogTitleName ? clickAccessList.LogTitleName : '미등록',
                    LogDoorName: clickAccessList.LogDoorName,
                    LogDate: clickAccessList.LogDate,
                    LogTime: clickAccessList.LogTime,
                    LogStatusName: clickAccessList.LogStatusName,
                    userImage: '',
                    selectEvent: logIdx
                }, () => this.detailInfo());
            }
        }
    }

    componentDidMount = async () => {
        await this.props.readAccessControlLog();
        if (this.props.accessControlLog && this.props.accessControlLog.code !== '53300') {
            this.pushValue(this.props.accessControlLog);
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.accessControlLog !== prevProps.accessControlLog) {
            let image_path
            if (this.props.accessControlLog && this.props.accessControlLog.code !== '53300') {
                if (this.props.accessControlLog.length > 0 && this.props.accessControlLog[0].LogPersonID) {
                    image_path = `http://${this.context.websocket_url}/images/access_control_person/${this.props.accessControlLog[0].LogPersonID}.png`;
                }
            } else {
                return
            }
            this.pushValue(this.props.accessControlLog);
            this.setState({
                isSelected: false,
                userImage: image_path
            }, () => this.detailInfo());
        }
    }

    detailInfo = () => {
        if (this.state.isSelected === true) {
            let year;
            let month;
            let day;
            let hour;
            let minute;
            if (this.state.LogDate && this.state.LogTime) {
                let eventTime = this.state.LogDate + this.state.LogTime;
                year = eventTime.substr(0, 4);
                month = eventTime.substr(4, 2)
                day = eventTime.substr(6, 2);
                hour = eventTime.substr(8, 2);
                minute = eventTime.substr(10, 2);
            }
            return <div className={styles.detailInfo}>
                <div className={styles.profile}>
                    {/* {this.state.LogPersonID !== undefined && this.state.LogPersonID !== '' && this.state.LogPersonID ?
                        <img src={require(`../../../server/public/images/access_control_person/${this.state.LogPersonID}.png`)} width='85%' /> :
                        <img src={require(`../../assets/images/unknown.png`)} width='85%' />} */}
                    {this.state.userImage !== undefined && this.state.userImage !== '' && this.state.userImage ?
                        <img src={this.state.userImage} className={styles.profileImg} /> :
                        <img src={require(`../../assets/images/unknown.png`)} className={styles.profileImg} />}
                </div>
                <div className={(this.state.LogStatusName === '출입승인') ? styles.userDetailInfo_description:styles.userDetailInfo_description_deny}>
                    <h5 className={this.state.LogStatusName === '출입승인' ? styles.access_pass : styles.access_fail}>{this.state.LogStatusName}</h5>
                    <p className='text-muted3 mb-0'>이름: {this.state.LogPersonLastName}</p>
                    <p className='text-muted3 mb-0'>직급: {this.state.LogTitleName ? this.state.LogTitleName : '미등록'}</p>
                    <p className='text-muted3 mb-0'>시간: {year + '년 ' + month + '월 ' + day + '일 ' + hour + '시 ' + minute + '분'}</p>
                    <p className='text-muted3 mb-0'>출입위치: {this.state.LogDoorName}</p>
                </div>
            </div>
        }
        else if (this.state.isSelected === false) {
            let year;
            let month;
            let day;
            let hour;
            let minute;
            if (this.props.accessControlLog[0]) {
                let eventTime = this.props.accessControlLog[0].LogDate + this.props.accessControlLog[0].LogTime;
                year = eventTime.substr(0, 4);
                month = eventTime.substr(4, 2)
                day = eventTime.substr(6, 2);
                hour = eventTime.substr(8, 2);
                minute = eventTime.substr(10, 2);
            }
            return <div className={styles.detailInfo}>
                <div className={styles.profile}>
                    {/* {this.props.accessControlLog[0] !== undefined && this.props.accessControlLog[0] !== '' && this.props.accessControlLog[0].LogPersonID ?
                        <img src={require(`../../../server/public/images/access_control_person/${this.props.accessControlLog[0].LogPersonID}.png`)} width='85%' /> :
                        <img src={require(`../../assets/images/unknown.png`)} width='85%' />} */}
                    {this.state.userImage !== undefined && this.state.userImage !== '' && this.state.userImage ?
                        <img src={this.state.userImage} className={styles.profileImg} /> :
                        <img src={require(`../../assets/images/unknown.png`)} className={styles.profileImg}/>}
                </div>
                <div className={(this.props.accessControlLog[0] && this.props.accessControlLog[0].LogStatusName === '출입승인') ? styles.userDetailInfo_description:styles.userDetailInfo_description_deny}>
                    <h5 className={this.props.accessControlLog[0] && this.props.accessControlLog[0].LogStatusName === '출입승인' ? styles.access_pass :styles.access_fail}>{this.props.accessControlLog[0] && this.props.accessControlLog[0].LogStatusName}</h5>
                    <p className='text-muted3 mb-0'>이름: {this.props.accessControlLog[0] && this.props.accessControlLog[0].LogPersonLastName ? this.props.accessControlLog[0].LogPersonLastName : '미등록'}</p>
                    <p className='text-muted3 mb-0'>직급: {this.props.accessControlLog[0] && this.props.accessControlLog[0].LogTitleName ? this.props.accessControlLog[0].LogTitleName : '미등록'}</p>
                    <p className='text-muted3 mb-0'>시간: {year + '년 ' + month + '월 ' + day + '일 ' + hour + '시 ' + minute + '분'}</p>
                    <p className='text-muted3 mb-0'>출입위치: {this.props.accessControlLog[0] && this.props.accessControlLog[0].LogDoorName}</p>
                </div>
            </div>
        }
    }

    pushValue = (logs) => {
        let value = 0;
        if(logs.length !== 0 && logs.code !== '53300'){
            const latestLog = logs[0];
            latestLog.value = value;
    
            this.setState({
                accessLogArray: logs
            })
        } else {
            return
        }
    }

    accessConrolLogDisplay = () => {
        if (this.props.accessControlLog && this.props.accessControlLog.code !== '53300') {
            let style = {
                marginLeft: '10px'
            }
            return (
                this.props.accessControlLog.map((access, index) => {
                    let accessTime = access.LogDate + access.LogTime;
                    const year = accessTime.substr(0, 4);
                    const month = accessTime.substr(4, 2)
                    const day = accessTime.substr(6, 2);
                    const hour = accessTime.substr(8, 2);
                    const minute = accessTime.substr(10, 2);
                    return (
                        <div className={this.state.selectEvent === access.LogIDX ? (access.LogStatusName === '출입승인' ?styles.accessCtlDetail_onSelect:styles.accessCtlDetail_deny_onSelect):(access.LogStatusName === '출입승인' ?styles.accessCtlDetail:styles.accessCtlDetail_deny)} key={index}>
                            <div className={access.value !== undefined ? 'acknowledgeIcon danger2' : ''} >
                            <div className={styles.accessCtlListDetail} onClick={() => this.selectEvent(access.LogIDX)}>
                                {/* <div className="preview2-item border-bottom" onClick={() => this.selectEvent(access.LogIDX)}> */}
                                    {/* <div className="preview2-item border-bottom" onClick={() => this.props.accessControlLog(access.LogIDX)}> */}
                                    {/* <div className="preview2-item-content d-sm-flex flex-grow" id="event-align-items"> */}
                                        {/* <div className="flex"> */}
                                            {/* <h5 className="preview2-subject3" style={style}>{access.LogStatusName}</h5> */}
                                            
                                            <span className={styles.accessCtlList_icon}>
                                                    {access.LogStatusName === '출입승인'?<i className="mdi mdi-check-circle-outline"></i>:<i className="mdi mdi-close-circle-outline"></i>}
                                            </span>
                                            <span className={styles.accessCtlList_description}>
                                                <h5 className={access.LogStatusName === '출입승인' ? styles.access_pass : styles.access_fail}>{access.LogStatusName}</h5>
                                                <div className={styles.accessCtlListDetail}>
                                                    <span>
                                                        <p className="text-muted mb-0" style={style}>이름 : {access.LogPersonLastName ? access.LogPersonLastName : '미등록'}</p>
                                                        <p className="text-muted mb-0" style={style}>출입시간 : {year + '년 ' + month + '월 ' + day + '일 ' + hour + '시 ' + minute + '분'}</p>
                                                        <p className="text-muted mb-0" style={style}>위치 : {access.LogDoorName}</p>
                                                    </span>
                                                </div>
                                            </span>
                                            
                                        {/* </div> */}
                                        {/* <div> */}
                                        {/* </div> */}
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    );
                })
            )
        } else {
            return null
        }
    }

    render() {
        let style = {
            marginLeft: '10px'
        }
        return (
            <div className={styles.accessLog}>
                <div className={styles.header}>
                    <h4 className={styles.title}>
                        &nbsp;출입 기록
                    </h4>
                    <Dropdown className={styles.handleDisplayMenu}>
                        <Dropdown.Toggle className={styles.handleSettingComponent} variant="btn btn-dropdown">
                            <i className="mdi mdi-settings d-none d-sm-block"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* <Dropdown.Header>이벤트 현황</Dropdown.Header> */}
                            <Dropdown.Item onClick={() => this.props.handleCustomLayout(this.props.layoutNumber, 'eventStatus')}>이벤트 현황</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.props.handleCustomLayout(this.props.layoutNumber, 'eventList')}>실시간 이벤트</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.props.handleCustomLayout(this.props.layoutNumber, 'deviceList')}>장치 목록</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.props.handleCustomLayout(this.props.layoutNumber, 'accessCtl')}>출입 기록 <i className="mdi mdi-checkbox-marked-circle-outline"></i></Dropdown.Item>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item onClick={() => this.props.handleCustomLayout(this.props.layoutNumber, 'close')}>닫기</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {this.detailInfo()}
                <div className={styles.list}>
                {this.props.accessControlLog && this.accessConrolLogDisplay()}
                </div>
            </div>
        )
    }


}

export default AccessControl;
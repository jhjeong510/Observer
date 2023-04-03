import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import ReactTable from 'react-table'
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import HandleAcknowledgeEventModal from "../shared/modal/HandleAcknowledgeEventModal";
import styles from './AllEvent.module.css';
import { getInquiryEvents } from './api/apiService';

export class allEvent extends Component {

  constructor(props) {
    super();
    this.state = {
			events: [],

			event_type: '',
			severity: '',
			service_type: '',
			device_type: '',
			startDate: '',
			newStartDate: '',
			endDate: '',
			newEndDate: '',
			startTime: '',
			newStartTime: '',
			endTime: '',
			newEndTime: '',
			acknowledge: undefined,
			showAlert: false,
			loading: false,
			defaultActiveKey: '',
			acknowledgeModal: {
				show: false,
				title: '',
				message: ''
			},
			eventInfo: {},
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

  renderEditable(cellInfo) {
		return (
			<div 
				style={cellInfo.column.Header === '확인여부' ? { backgroundColor: "rgba(rgba(0, 0, 0, 0.03))", cursor: 'pointer' } : { backgroundColor: "rgba(rgba(0, 0, 0, 0.03))" }}
				suppressContentEditableWarning
				onBlur={e => {
					const data = [ ...this.state.events];
					data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
				}}
				dangerouslySetInnerHTML={{
					__html: this.handleChangeKorean(this.state.events[cellInfo.index], cellInfo)
				}}
				onClick={cellInfo.column.Header === '확인여부' ? (e) => this.changeAcknowledge(cellInfo) : console.log()} 
				// onClick={cellInfo.row.acknowledge === false ? (e) => this.changeAcknowledge : console.log('test')}
			/>
		)
	}

	changeAcknowledge = (cellInfo) => {
		if(!cellInfo.original.acknowledge) {
			this.setState({ eventInfo: cellInfo.original, acknowledgeModal: {
				show: true,
				title: '이벤트 알림 해제',
				message: '해당 장치의 이벤트 알림을 해제하시겠습니까?', 
			}})
		}
	}

  handleChangeEventType = (e) => {
		this.setState({ event_type: e.value });
	}

	handleChangeSeverity = (e) => {
		this.setState({ severity: e.value });
	}

	handleChangeServiceType = (e) => {
		this.setState({ service_type: e.value });
	}

	handleChangeDeviceType = (e) => {
		this.setState({ device_type: e.value });
	}

	handleChangeAcknowledge = (e) => {
		let booleanValue;
		if(e.target.value !== ''){
			booleanValue = JSON.parse(e.target.value);
		} else {
			booleanValue = '';
		}
		
		this.setState({
      acknowledge: booleanValue
    });
	}

  handleChangeStartDate = (startDate) => {

		try {
			this.setState({ startDate: startDate });
			const newStartDate = dateFns.format(startDate, 'yyyyMMdd');
			this.setState({ newStartDate: newStartDate });
		} catch(err) {
		}

	}

	handleChangeEndDate = (endDate) => {

		try {
			this.setState({ endDate: endDate });
			const newEndDate = dateFns.format(endDate, 'yyyyMMdd');
			this.setState({ newEndDate: newEndDate });
		} catch (err) {
		}

	}

	handleChangeStartTime = (startTime) => {

		try {
			this.setState({ startTime: startTime });
			const newStartTime = dateFns.format(startTime, 'HHmmss');
			this.setState({ newStartTime: newStartTime });
		} catch (err) {
		}
		
	}

	handleChangeEndTime = (endTime) => {

		try {
			this.setState({ endTime: endTime });
			const newEndTime = dateFns.format(endTime, 'HHmmss');
			this.setState({ newEndTime: newEndTime });
		} catch (err) {
		}
		
	}

  handleInquiryEvents = async (e, ipaddress, noLimit) => {
		if(e){
			e.preventDefault();
		}
		if((this.state.newStartTime && !this.state.newStartDate) || (this.state.newEndTime && !this.state.newEndDate)) {
			this.props.handleShowTimeSelectAlert();
			return;
		}

		const eventType = this.state.event_type ? parseInt(this.state.event_type) : undefined;
		const severity = this.state.severity !== '' ? parseInt(this.state.severity) : undefined;
		const startDateTime = this.state.newStartTime ? (this.state.newStartDate ? (this.state.newStartDate + 'T' + this.state.newStartTime):'') : this.state.newStartDate;
		const endDateTime = this.state.newEndTime ? (this.state.newEndDate ? (this.state.newEndDate + 'T' + this.state.newEndTime): '') : this.state.newEndDate;
		const acknowledge = this.state.acknowledge;
		const serviceType = this.state.service_type;
		const deviceType = this.state.device_type;

		this.setState({ loading: true });
		const res = await getInquiryEvents(eventType, severity, startDateTime, endDateTime, acknowledge, serviceType, deviceType, ipaddress, noLimit);
		if(res && res.data && res.data.result && res.data.result.length > 0) {
			await this.setState({ loading: false });
			this.setState({ events: res.data.result });
			this.props.getEvents();
		} else {
			await this.setState({ loading: false });
			this.setState({ events: []})
		}
	}

	handleChangeDateTimeFormat = (dateTimeValue, columnValue) => {
    try {
			let dateTime;
			if(columnValue === 'occurTime'){
				dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy년 M월 d일 E요일 HH:mm", { locale: ko });
			} else if(columnValue === 'ack') {
				dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy.M.d EEE HH:mm", { locale: ko });
			}
      return dateTime;
    } catch(err) {
      console.log('event_occurrence_time dateTime format change fail error');
      return ''
    }
  }

  handleChangeKorean = (detailEvent, cellInfo) => {
		if(detailEvent){
			try {
				switch (cellInfo.column.Header) {
					case '중요도':
						return detailEvent[cellInfo.column.id] === 0 ? 'Info' : detailEvent[cellInfo.column.id] === 1 ? 'Minor' : detailEvent[cellInfo.column.id] === 2 ? 'Major' : 'Critical'
					case '발생시간':
						return detailEvent[cellInfo.column.id].length > 0 ? this.handleChangeDateTimeFormat(detailEvent[cellInfo.column.id], 'occurTime'): '';
					case '발생장소':
						return detailEvent[cellInfo.column.id] ? (detailEvent['building_name'] ? detailEvent['building_name'] + (detailEvent['floor_name'] ? '   ' + detailEvent['floor_name']:'') + (detailEvent['location'] ? '   ' + detailEvent['location']:'') : detailEvent['location'] ? detailEvent['location']:''):'' 
					case '확인여부':
						return detailEvent[cellInfo.column.id] ? detailEvent["acknowledge_user"] + " (" + this.handleChangeDateTimeFormat(detailEvent["acknowledged_at"], 'ack') + ")" : '미확인 ▼'
					case '서비스 종류':
						return detailEvent[cellInfo.column.id] === 'mgist' ? 'MGIST' : (detailEvent[cellInfo.column.id] === 'ebell' ? '비상벨' : (detailEvent[cellInfo.column.id] === 'observer' ? '옵저버' : (detailEvent[cellInfo.column.id] === 'accesscontrol' ? '출입통제':(detailEvent[cellInfo.column.id] === 'ndoctor' ? 'N-Doctor':(detailEvent[cellInfo.column.id] === 'parkingcontrol'?'주차관제시스템':(detailEvent[cellInfo.column.id] === 'mdet'?'M-DET':''))))))
					case '장치 종류':
						return detailEvent[cellInfo.column.id] === 'camera' ? '카메라' : (detailEvent[cellInfo.column.id] === 'ebell' ? '비상벨' : (detailEvent[cellInfo.column.id] === 'guardianlite' ? '전원장치': (detailEvent[cellInfo.column.id] === 'acu' ? 'ACU': (detailEvent[cellInfo.column.id] === 'door' ? '출입문': (detailEvent[cellInfo.column.id] === 'vitalsensor' ? '바이탈센서': (detailEvent[cellInfo.column.id] === 'zone' ? 'PIDS': (detailEvent[cellInfo.column.id] === 'mdet' ? 'M-DET': (detailEvent[cellInfo.column.id] === 'crowddensity' ? '군중 감지 카메라': ''))))))))
					case '이벤트명':
						return detailEvent[cellInfo.column.id].includes('전원장치') ? detailEvent[cellInfo.column.id] + ' (' + detailEvent['description'] + ')' : detailEvent[cellInfo.column.id]
					default:
						return detailEvent[cellInfo.column.id]
				}
			} catch (err) {
				console.error('이벤트 정보 한글로 형식 변경문 err: ', err);
			}
		}
	}

	setDefaultPeriod = async (e) => {
    const startDate = dateFns.format(dateFns.sub(new Date(), { weeks: 1}), "yyyyMMdd");
		const startTime = dateFns.format(new Date(), "HHmmss");
		const startDateTime = startDate + 'T' + startTime;
		const endDate = dateFns.format(new Date(), "yyyyMMdd");
		const endTime = dateFns.format(new Date(), "HHmmss");
		const endDateTime = endDate + 'T' + endTime;

    this.setState({
      startDate: dateFns.sub(new Date(), { weeks: 1}),
      startTime: new Date(),
      startDateTime: startDateTime,
      endDate: new Date(),
      endTime: new Date(),
      endDateTime: endDateTime,
      newStartDate: startDate,
      newEndDate: endDate,
      newStartTime: startTime,
      newEndTime: endTime
    });
  }
	
	setUncheckedEventPeriod = async (e) => {
		const startDate = dateFns.format(dateFns.sub(new Date(), { years: 1}), "yyyyMMdd");
		const startTime = dateFns.format(new Date(), "HHmmss");
		const startDateTime = startDate + 'T' + startTime;
		const endDate = dateFns.format(new Date(), "yyyyMMdd");
		const endTime = dateFns.format(new Date(), "HHmmss");
		const endDateTime = endDate + 'T' + endTime;

		this.setState({
			startDate: dateFns.sub(new Date(), { years: 1}),
			startTime: new Date(),
			startDateTime: startDateTime,
			endDate: new Date(),
			endTime: new Date(),
			endDateTime: endDateTime,
			newStartDate: startDate,
			newEndDate: endDate,
			newStartTime: startTime,
			newEndTime: endTime,
			acknowledge: false
		});
	}


	async componentDidMount(e) {
		if(this.props.defaultActiveKey) {
			await this.setState({ defaultActiveKey: this.props.defaultActiveKey })
		}
		if(this.props.breathIp){
			await this.handleInquiryEvents(e, this.props.breathIp);
			this.setState({
				startTime: '',
				startTime: '',
				endDate: '',
				endTime: '',
			});
		} else {
			if(this.props.defaultActiveKey === 'ackStatusFalse') {
				await this.setUncheckedEventPeriod();
				await this.handleInquiryEvents(e, '', 'noLimit');
			} else {
				this.setDefaultPeriod();
			}
		}
	}

  render() {

		const event_type_options = [
			{ value: '', label: '선택 안 함' },
			{ value: 1, label: '화재 감지', service_type:'observer' },
			{ value: 2, label: '연기 감지', service_type:'observer' },
			{ value: 3, label: '움직임 감지', service_type:'observer' },
			{ value: 4, label: '배회 감지', service_type:'observer' },
			{ value: 5, label: '잃어버린 물건 감지', service_type:'observer' },
			{ value: 6, label: '영역 침입 감지', service_type:'observer' },
			{ value: 7, label: '영역 이탈 감지', service_type:'observer' },
			{ value: 8, label: '라인 크로스 감지', service_type:'observer' },
			{ value: 9, label: '대기열 감지', service_type:'observer' },
			{ value: 10, label: '쓰러짐 감지', service_type:'observer' },
			{ value: 11, label: '앉은 자세 감지', service_type:'observer' },
			{ value: 12, label: '정지 감지', service_type:'observer' },
			{ value: 13, label: '영역 이동 감지', service_type:'observer' },
			{ value: 14, label: '피플 카운트', service_type:'observer' },
			{ value: 15, label: '근거리 감지', service_type:'observer' },
			{ value: 16, label: '난간 잡기 감지', service_type:'observer' },
			{ value: 17, label: '양손 들기 감지', service_type:'observer' },
			{ value: 18, label: '얼굴 감지', service_type:'observer' },
			{ value: 19, label: '비상상황 발생', service_type:'ebell' },
			{ value: 20, label: '전원장치 ON', service_type:'guardianlite' },
			{ value: 21, label: '전원장치 OFF', service_type:'guardianlite' },
			{ value: 22, label: '전원장치 RESET', service_type:'guardianlite' },
			{ value: 23, label: '블랙리스트', service_type:'anpr' },
			{ value: 24, label: '화이트리스트', service_type:'anpr' },
			{ value: 25, label: '화재 신호', service_type:'accesscontrol' },
			{ value: 26, label: '미등록출입시도', service_type:'accesscontrol' },
			{ value: 27, label: '강제출입문열림', service_type:'accesscontrol' },
			{ value: 28, label: '호흡이상감지', service_type:'vitalsensor' },
			{ value: 29, label: 'PIDS 이벤트 감지', service_type:'pids' },
			{ value: 30, label: '사람 감지', service_type:'observer' },
			{ value: 31, label: '차량 감지', service_type:'observer' },
			{ value: 32, label: '안전모 미착용 감지', service_type:'observer' },
			{ value: 33, label: '연결 끊어짐', service_type:'ndoctor' },
			{ value: 34, label: '연결 복구', service_type:'ndoctor' },
			{ value: 35, label: '주차금지구역 주차', service_type:'parkingcontrol' },
			{ value: 36, label: '만차', service_type:'parkingcontrol' },
			{ value: 37, label: '금속탐지', service_type:'mdet' },
			{ value: 38, label: '군중 밀집', service_type:'crowddensity' }
		].filter((serviceTypeValue) => (this.props.serviceTypes && this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true').map(serviceType => serviceType.name).includes(serviceTypeValue.service_type) || serviceTypeValue.value === '' || serviceTypeValue.service_type === 'observer'));

		const severity_options = [
			{ value: '', label: '선택 안 함' },
			{ value: 0, label: 'Info' },
			{ value: 1, label: 'Minor' },
			{ value: 2, label: 'Major' },
			{	value: 3, label: 'Critical' },   
		];

		const service_type_options = [
			{ value: '', label: '선택 안 함' },
			{ value: 'mgist', label: 'MGIST' },
			{ value: 'ebell', label: '비상벨' },
			{ value: 'accesscontrol', label: '출입통제' },
			{ value: 'guardianlite', label: '가디언라이트' },
			{ value: 'anpr', label: 'ANPR' },
			{ value: 'vitalsensor', label: '바이탈센서' },
			{ value: 'pids', label: 'PIDS' },
			{ value: 'ndoctor', label: 'N-Doctor' },
			{ value: 'parkingcontrol', label: '주차관제시스템' },
			{ value: 'mdet', label: 'M-DET' },
			{ value: 'crowddensity', label: '군중 밀집도 감지' }
		].filter((serviceTypeValue) => (this.props.serviceTypes && this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true').map(serviceType => serviceType.name).includes(serviceTypeValue.value)) || serviceTypeValue.value === '');;

		const device_type_options = [
			{ value: '', label: '선택 안 함' },
			{ value: 'camera', label: '카메라', service_type:'observer' },
			{ value: 'ebell', label: '비상벨', service_type:'ebell' },
			{ value: 'guardianlite', label: '가디언라이트', service_type:'guardianlite' },
			{ value: 'door', label: '출입문', service_type: 'accesscontrol' },
			{ value: 'acu', label: 'ACU', service_type: 'accesscontrol' },
			{ value: 'vitalsensor', label: '바이탈센서', service_type: 'vitalsensor' },
			{ value: 'zone', label: 'PIDS', service_type: 'pids' },
			{ value: 'mdet', label: 'M-DET', service_type: 'mdet' },
			{ value: 'crowddensity', label: '군중 감지 카메라', service_type: 'crowddensity' }
		].filter((deviceTypeValue) => (this.props.serviceTypes && this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true').map(serviceType => serviceType.name).includes(deviceTypeValue.service_type)) || deviceTypeValue.value === '' || deviceTypeValue.service_type === 'observer');

		const translations = {
			previousText: '이전', 
			nextText: '다음', 
			loadingText: 'LOADING...', 
			rowsText: '건', 
			noDataText: '데이터 없음',
		};

    return (
      <div>
        <div className="page-header inquiry-events">
					<Form.Group className="inquiry-event-form">
						<div className={styles.filter_card}>
              <div className="card-body inquiry-events">
								<div className={styles.filter_body}>
									<p className={styles.type_label}>종류</p>
                  <Select
										className={styles.eventType_options}
										id="eventType"
                    options={event_type_options}
										onChange={this.handleChangeEventType}
										value={event_type_options.filter(obj => obj.value === this.state.event_type)}
										// isMulti={true}
                  />
                  <p className={styles.severity_label}>중요도</p>
                  <Select 
										className="severity"
										id="severity"
                    options={severity_options}
										onChange={this.handleChangeSeverity}
										value={severity_options.filter(obj => obj.value === this.state.severity)}
                  />
									<p className={styles.service_type_label}>서비스 종류</p>
                  <Select
										className="serviceType"
										id="serviceType"
                    options={service_type_options}
										onChange={this.handleChangeServiceType}
										value={service_type_options.filter(obj => obj.value === this.state.service_type)}
                  />
                  <p className="card-description deviceType">장치 종류</p>
                  <Select
										className="deviceType"
										id="deviceType"
                    // isMulti={true}
                    options={device_type_options}
										onChange={this.handleChangeDeviceType}
										value={device_type_options.filter(obj => obj.value === this.state.device_type)}
                  />
									<div className="card-body events datePicker">
										<p className="card-description events datePicker">기간</p>
										<div className="daterange-picker allEvents">
											<DatePicker
												selected={this.state.startDate}
												onChange={(date) => this.handleChangeStartDate(date)}
												selectsStart
												startDate={this.state.startDate}
												endDate={this.state.endDate}
												className="form-control datePicker"
												dateFormat='yyyy/MM/dd'
												locale={ko}
											/>
											<DatePicker
												selected={this.state.startTime}
												onChange={(date) => this.handleChangeStartTime(date)}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={10}
												timeCaption="Time"
												dateFormat="aa h:mm"
												className="form-control TimePicker"
												locale={ko}
											/>
											<span className="range-seperator-datePicker"> to </span>
											<DatePicker
												selected={this.state.endDate}
												onChange={(date) => this.handleChangeEndDate(date)}
												selectsEnd
												endDate={this.state.endDate}
												minDate={this.state.startDate}
												className="form-control datePicker"
												dateFormat='yyyy/MM/dd'
												locale={ko}
											/>
											<DatePicker
												selected={this.state.endTime}
												onChange={(date) => this.handleChangeEndTime(date)}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={10}
												timeCaption="Time"
												dateFormat="aa h:mm"
												className="form-control TimePicker"
												locale={ko}
											/>
										</div>
									</div>
								</div>
								<label className="col-sm-3 col-form-label acknowledge">알림 확인</label>
								<div className='inquiry-acknowledge'>
									<div className="col-sm-4 acknowledge">
										<div className="form-check acknowledge">
											<label className="form-check-label">
												<input 
													type="radio" 
													className="form-check-input" 
													name="ExampleRadio4" 
													id="membershipRadios1"
													value={true}
													checked={this.state.acknowledge === true}
													onChange={this.handleChangeAcknowledge}
												/> 
													확인 
												<i className="input-helper"></i>
											</label>
										</div>
									</div>
									<div className="col-sm-5 acknowledge">
										<div className="form-check acknowledge">
											<label className="form-check-label">
												<input
													type="radio" 
													className="form-check-input" 
													name="ExampleRadio4" 
													id="membershipRadios2"
													value={false}
													checked={this.state.acknowledge === false}
													onChange={this.handleChangeAcknowledge}
												/> 
													미확인 
												<i className="input-helper"></i>
											</label>
										</div>
									</div>
									<div className="col-sm-5 acknowledge">
										<div className="form-check acknowledge">
											<label className="form-check-label">
												<input
													type="radio" 
													className="form-check-input" 
													name="ExampleRadio4" 
													id="membershipRadios3"
													value={''}
													checked={this.state.acknowledge === ''}
													onChange={this.handleChangeAcknowledge}
												/> 
													전체
												<i className="input-helper"></i>
											</label>
										</div>
									</div>
								</div>
							  <div className='inquiry-event-button'>
									<button className={styles.inquiry_btn}onClick={(e) => this.handleInquiryEvents(e, '', 'noLimit')}>조회</button>
								</div>												
              </div>
						</div>
					</Form.Group>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-body allEvents">
								<h4 className="card-title">전체 이벤트 목록</h4>
								<div className="row">
									<div className="col-12 allEvents">
										<ReactTable
											{...translations}
											data={this.state.events}
									    // filterable = {true}
											// page={this.state.page}
											// onPageChange={page => this.setState({page})}
											className='allEvents'
											defaultPageSize={15}
											filter= 'includes'
											loading={this.state.loading}
											pageSizeOptions={
												[5, 10, 15, 20, 25, 50, 100]
											}
											columns={[
												{
													Header: "번호",
													accessor: "idx",
													width: 100,
													Cell: this.renderEditable
												},
												{
													Header: "이벤트명",
													accessor: "event_type_name",
													width: 160,
													Cell: this.renderEditable
												},
												{
													Header: "중요도",
													accessor: "event_type_severity",
													width: 100,
													Cell: this.renderEditable
												},
												{
													Header: "발생시간",
													accessor: "event_occurrence_time",
													Cell: this.renderEditable
												},
												{
													Header: "발생장소",
													accessor: "location",
													width: 225,
													Cell: this.renderEditable
												},
												{
													Header: "확인여부",
													accessor: 'acknowledge',
													width: 250,
													Cell: this.renderEditable
												},
												{
													Header: "서비스 종류",
													accessor: 'service_type',
													width: 120,
													Cell: this.renderEditable
												},
												{
													Header: "장치 종류",
													accessor: 'device_type',
													width: 115,
													Cell: this.renderEditable
												},
												{
													Header: "장치 이름",
													accessor: 'device_name',
													width: 150,
													Cell: this.renderEditable
												},
												{
													Header: "장치 IP 주소",
													accessor: 'ipaddress',
													width: 170,
													Cell: this.renderEditable
												}
											]}
										/>  
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.state.acknowledgeModal.show ? <HandleAcknowledgeEventModal show={this.state.acknowledgeModal.show} setShow={this.state.acknowledgeModal} message={this.state.acknowledgeModal.message} title={this.state.acknowledgeModal.title} eventInfo={this.state.eventInfo} handleInquiryEvents={this.handleInquiryEvents}/> : null}
      </div>
    )
  }
}

export default allEvent

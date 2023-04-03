import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import ReactTable from 'react-table'
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import styles from './AccessCtllog.module.css';
import { getAccessCtl, readDeviceList } from './api/apiService';

export class AccessCtlLog extends Component {

  constructor(props) {
    super(props);
    this.state = {
			accessCtlLog: [],
			doorList: [],

			log_status: '',
			log_DoorID: props.door_id,
			log_PersonID: '',
			log_PersonName: '',
			log_startDate: '',
			log_newStartDate: '',
			log_endDate: '',
			log_newEndDate: '',
			log_startTime: '',
			log_newStartTime: '',
			log_endTime: '',
			log_newEndTime: '',
			loading: false,
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

	handleInquiryAccessCtlLog = async (e, noLimit) => {

		if(e) {
			e.preventDefault();
		}
		const { log_status, log_DoorID, log_newStartDate, log_newEndDate, log_newStartTime, log_newEndTime, log_PersonID, log_PersonName } = this.state;
		this.setState({ loading: true });
		const res = await getAccessCtl(log_status, log_DoorID, log_newStartDate, log_newEndDate, log_newStartTime, log_newEndTime, log_PersonID, log_PersonName);
		if(res && res.data && res.data.result && res.data.result.length > 0) {
			await this.setState({ loading: false });
			await this.setState({ accessCtlLog: res.data.result});
		} else {
			await this.setState({ loading: false });
			await this.setState({ accessCtlLog: []});
		}
	}

	handleChangeDateTimeFormat = (dateTimeValue) => {
    try {
			const dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy년 M월 d일 E요일", { locale: ko });
      return dateTime;
    } catch(err) {
      console.log('event_occurrence_time dateTime format change fail error');
      return ''
    }
  }

	handleChangeKorean = (detailEvent, cellInfo) => {
		if(detailEvent) {
			try {
				switch (cellInfo.column.Header) {
					case '출입날짜':
						return this.handleChangeDateTimeFormat(detailEvent[cellInfo.column.id]);
					case '출입시간':
						return detailEvent[cellInfo.column.id].substring(0,2) + ':' + detailEvent[cellInfo.column.id].substring(2,4) + ':' + detailEvent[cellInfo.column.id].substring(4,6)
					default:
						return detailEvent[cellInfo.column.id]
				}
			} catch(err) {
				console.error('출입기록 정보 한글로 형식 변경문 err: ', err);
			}
		}
	}

  renderEditable(cellInfo) {
		return (
			<div
				style={{ backgroundColor: "rgba(rgba(0, 0, 0, 0.03))" }}
				suppressContentEditableWarning
				onBlur={e => {
					const data = [ ...this.state.accessCtlLog];
					data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
				}}
				dangerouslySetInnerHTML={{
					__html:this.handleChangeKorean(this.state.accessCtlLog[cellInfo.index], cellInfo)
				}}
			/>
		)
	}

  handleChangeLogStatus = (e) => {
		this.setState({ log_status: e.value });
	}

	handleChangeLogDoorID = (e) => {
		this.setState({ log_DoorID: e.value });
	}

	handleChangeLogPersonID = (e) => {
		this.setState({ log_PersonID: e.value });
	}

	handleChangeLogPersonName = (e) => {
		this.setState({ log_PersonName: e.target.value });
	}

	handleChangeLogStartDate = (logStartDate) => {
		try {
			this.setState({ log_startDate: logStartDate });
			const log_newStartDate = dateFns.format(logStartDate, 'yyyyMMdd');
			this.setState({ log_newStartDate: log_newStartDate });
		} catch(err) {
			console.error('이벤트 발생 날짜 선택 Error: ', err)
		}
	}

	handleChangeLogEndDate = (logEndDate) => {
		try {
			this.setState({ log_endDate: logEndDate });
			const log_newEndDate = dateFns.format(logEndDate, 'yyyyMMdd');
			this.setState({ log_newEndDate: log_newEndDate });
		} catch(err) {
			console.error('이벤트 발생 날짜 선택 Error: ', err)
		}
	}

	handleChangeLogStartTime = (logStartTime) => {
		try {
			this.setState({ log_startTime: logStartTime });
			const log_newStartTime = dateFns.format(logStartTime, 'HHmmss');
			this.setState({ log_newStartTime: log_newStartTime });
		} catch (err) {
			console.error('이벤트 발생 시간 선택 Error: ', err);
		}
	}

	handleChangeLogEndTime = (logEndTime) => {
		try {
			this.setState({ log_endTime: logEndTime });
			const log_newEndTime = dateFns.format(logEndTime, 'HHmmss');
			this.setState({ log_newEndTime: log_newEndTime });
		} catch (err) {
			console.error('이벤트 종료 시간 선택 Error: ', err)
		}
	}

	setDefaultPeriod = async (e) => {
    const startDate = dateFns.format(dateFns.sub(new Date(), { weeks: 1}), "yyyyMMdd");
		const endDate = dateFns.format(new Date(), "yyyyMMdd");

    await this.setState({
      log_startDate: dateFns.sub(new Date(), { weeks: 1 }),
      log_endDate: new Date(),
      log_newStartDate: startDate,
      log_newEndDate: endDate,
    });
  }

	readDoorList = async () => {
		const resDevice = await readDeviceList();
		if (resDevice && resDevice.length > 0) {
			const sortDevice = [...resDevice].filter((device) => device.type === 'door').map((door) => ({ value: door.id, label: door.name })).sort((a, b) => a.value > b.value ? 1 : -1);
			await this.setState({
				doorList: sortDevice
			});
  	}
	}

	async componentDidMount(e) {
		this.readDoorList();
		await this.setDefaultPeriod();
		if(this.props.door_id){
			await this.handleInquiryAccessCtlLog(e, 'noLimit');
			await this.setState({
				log_DoorID: this.props.door_id,
			});
		}
	}

  render() {

		const { accessCtlLog } = this.state;

		const Log_Status_Options = [
			{ value: '', label: '선택 안 함' },
			{ value: '0', label: '출입승인' },
			{ value: '30', label: "출입불가: 미등록 출입시도" },
		];

		const Log_Door_Options = [{ value: '', label: '선택 안 함' }, ...this.state.doorList]

		const translations = {previousText: '이전', nextText: '다음', loadingText: 'LOADING...', rowsText: '건', noDataText: '데이터 없음'};

    return (
      <div>
        <div className="page-header inquiry-events">
					<Form.Group className="inquiry-event-form">
						<div className={styles.filter_card}>
              <div className="card-body accessctl">
								<div className="inquiry-events-select">
									<p className="card-description LogStatus">종류</p>
                  <Select
										className="status"
                    options={Log_Status_Options}
										onChange={this.handleChangeLogStatus}
										value={Log_Status_Options.filter(obj => obj.value === this.state.log_status)}
                  />
                  <p className="card-description LogDoorID">출입문</p>
                  <Select 
										className="DoorID"
                    options={Log_Door_Options}
										onChange={this.handleChangeLogDoorID}
										placeholder='선택 안 함'
										value={Log_Door_Options.filter(obj => obj.value === this.state.log_DoorID)}
                  />
                  <Form.Group className='accesscontrol-inquiry-personName'>
                    <label className={styles.person_label}>출입자</label>
                    <Form.Control 
											type="text" 
											className={styles.person_input}
											placeholder="이름을 입력하세요."
											value={this.state.log_PersonName}
											onChange={this.handleChangeLogPersonName}
										/>
                  </Form.Group>
								<div className='accessctllog datePicker'>
									<p className="card-description accessctl datePicker">출입날짜</p>
									<div className="daterange-picker accessctl">
										<DatePicker
											selected={this.state.log_startDate}
											onChange={(date) => this.handleChangeLogStartDate(date)}
											selectsStart
											startDate={this.state.log_startDate}
											endDate={this.state.log_endDate}
											className="form-control datePicker"
											dateFormat='yyyy/MM/dd'
											locale={ko}
										/>
										<span className="range-seperator-datePicker"> to </span>
										<DatePicker
											selected={this.state.log_endDate}
											onChange={(date) => this.handleChangeLogEndDate(date)}
											selectsEnd
											endDate={this.state.log_endDate}
											minDate={this.state.log_startDate}
											className="form-control datePicker"
											dateFormat='yyyy/MM/dd'
											locale={ko}
										/>
									</div>
								</div>
								<div className='accessctllog timePicker'>
									<p className="card-description accessctl datePicker">출입시간</p>
									<div className="daterange-picker accessctl">
										<DatePicker
											selected={this.state.log_startTime}
											onChange={(date) => this.handleChangeLogStartTime(date)}
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
											selected={this.state.log_endTime}
											onChange={(date) => this.handleChangeLogEndTime(date)}
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
							<div className='inquiry-accessctllog-button'>
								<button className={styles.inquiry_btn} onClick={(e) => this.handleInquiryAccessCtlLog(e, 'noLimit')}>조회</button>
							</div>												
            </div>
					</div>
				</Form.Group>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card-body accessCtlLog">
							<h4 className="card-title">출입기록 조회</h4>
							<div className="row">
								<div className="col-12 allEvents">
									<ReactTable
										{...translations}
										data={accessCtlLog}
										// filterable = {true}
										loading={this.state.loading}
										className='accessCtlLog'
										defaultPageSize={15} 
										filter= 'includes'
										columns={[
											{
												Header: "번호",
												accessor: "LogIDX",
												width: 100,
												Cell: this.renderEditable
											},
											{
												Header: "이벤트명",
												accessor: "LogStatusName",
												width: 216,
												Cell: this.renderEditable
											},
											{
												Header: "이름",
												accessor: "LogPersonLastName",
												width: 105,
												Cell: this.renderEditable
											},
											{
												Header: "직급",
												accessor: "LogTitleName",
												width: 105,
												Cell: this.renderEditable
											},
											{
												Header: "출입날짜",
												accessor: "LogDate",
												Cell: this.renderEditable
											},
											{
												Header: "출입시간",
												accessor: 'LogTime',
												Cell: this.renderEditable
											},
											{
												Header: "출입위치",
												accessor: 'LogDoorName',
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
    </div>
    )
  }
}

export default AccessCtlLog

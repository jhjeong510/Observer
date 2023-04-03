import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import ReactTable from 'react-table'
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import styles from './VcounterLog.module.css';
import { getVCounterDataLogs } from './api/apiService';

export class VcounterLog extends Component {

  constructor(props) {
    super();
    this.state = {
			vCounterLogs: [],
			cmdOptions: [],
			startDate: '',
			type: '',
			endDate: '',
			startTime: '',
			endTime: '',
			newStartDate: '',
			newEndDate: '',
			newStartTime: '',
			newEndTime: '',
			showAlert: false,
			loading: false,
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

  renderEditable(cellInfo) {
		return (
			<div 
				style={{ backgroundColor: "rgba(rgba(0, 0, 0, 0.03))" }}
				suppressContentEditableWarning
				onBlur={e => {
					const data = [ ...this.state.vCounterLogs];
					data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
				}}
				dangerouslySetInnerHTML={{
					__html: this.handleChangeKorean(this.state.vCounterLogs[cellInfo.index], cellInfo)
				}}
			/>
		)
	}

	handleChangeType = (e) => {
		this.setState({ type: e.value });
	}

  handleChangeStartDate = (startDate) => {

		try {
			this.setState({ startDate: startDate });
			const newStartDate = dateFns.format(startDate, 'yyyy-MM-dd');
			this.setState({ newStartDate: newStartDate });
		} catch(err) {

		}
	}

	handleChangeEndDate = (endDate) => {

		try {
			this.setState({ endDate: endDate });
			const newEndDate = dateFns.format(endDate, 'yyyy-MM-dd');
			this.setState({ newEndDate: newEndDate });
		} catch (err) {
		}

	}

	handleChangeStartTime = (startTime) => {

		try {
			this.setState({ startTime: startTime });
			const newStartTime = dateFns.format(startTime, 'HH:mm:ss');
			this.setState({ newStartTime: newStartTime });
		} catch (err) {
		}
		
	}

	handleChangeEndTime = (endTime) => {

		try {
			this.setState({ endTime: endTime });
			const newEndTime = dateFns.format(endTime, 'HH:mm:ss');
			this.setState({ newEndTime: newEndTime });
		} catch (err) {
		}
		
	}

  handleInquiryVcounterLogs = async (e) => {
		if(e){
			e.preventDefault();
		}
		if((this.state.startTime && !this.state.startDate) || (this.state.endTime && !this.state.endDate)) {
			this.props.handleShowTimeSelectAlert();
			return;
		}

		const cmd = this.state.type;
		const startDateTime = this.state.newStartTime ? (this.state.newStartDate ? (this.state.newStartDate + ' ' + this.state.newStartTime):'') : this.state.newStartDate;
		const endDateTime = this.state.newEndTime ? (this.state.newEndDate ? (this.state.newEndDate + ' ' + this.state.newEndTime): '') : this.state.newEndDate;

		this.setState({ loading: true });
		const res = await getVCounterDataLogs(cmd, startDateTime, endDateTime);
		if(res && res.data && res.data.result && res.data.result.length > 0) {
			await this.setState({ loading: false });
			this.setState({ vCounterLogs: res.data.result});
		} else {
			await this.setState({ loading: false });
			this.setState({ vCounterLogs: []})
		}
	}

	handleChangeDateTimeFormat = (dateTimeValue, columnValue) => {
    try {
			let dateTime;
			if(columnValue === 'occurTime'){
				dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy년 M월 d일 E요일 HH:mm:ss", { locale: ko });
			}
      return dateTime;
    } catch(err) {
      console.log('occur_at format change error');
      return ''
    }
  }

  handleChangeKorean = (detailEvent, cellInfo) => {
		if(detailEvent){
			try {
				switch (cellInfo.column.Header) {
					case '발생 시간':
						return detailEvent[cellInfo.column.id].length > 0 ? this.handleChangeDateTimeFormat(detailEvent[cellInfo.column.id], 'occurTime'): '';
					default:
						return detailEvent[cellInfo.column.id]
				}
			} catch (err) {
				console.error('이벤트 정보 한글로 형식 변경문 err: ', err);
			}
		}
	}

	setDefaultPeriod = async (e) => {
    const startDate = dateFns.format(dateFns.sub(new Date(), { weeks: 1}), "yyyy-MM-dd");
		const startTime = dateFns.format(new Date(), "HH:mm:ss");
		const startDateTime = startDate + ' ' + startTime;
		const endDate = dateFns.format(new Date(), "yyyy-MM-dd");
		const endTime = dateFns.format(new Date(), "HH:mm:ss");
		const endDateTime = endDate + ' ' + endTime;

    this.setState({
      startDate: dateFns.sub(new Date(), { weeks: 1}),
      startTime: new Date(),
      startDateTime: startDateTime,
      endDate: new Date(),
      endTime: new Date(),
      endDateTime: endDateTime,
    });
  }

	async componentDidMount() {
		this.setDefaultPeriod();
	}

  render() {

		const type_options = [
			{ value: '', label: '선택 안 함'},
			{ value: '입차', label: '입차' },
			{ value: '출차', label: '출차' }
		]

		const translations = {
			previousText: '이전', 
			nextText: '다음', 
			loadingText: 'LOADING...', 
			rowsText: '건', 
			noDataText: '데이터 없음',
		};

    return (
      <div>
				<div className={styles.root}>
				<Form.Group className={styles.form}>
						  <div className={styles.condition_parent}>
              <div className={styles.condition}>
								<div className={styles.select}>
									<p className={styles.type_label}>입차/출차</p>
                  <Select
										className={styles.type_select}
                    options={type_options}
										onChange={this.handleChangeType}
										value={type_options.filter(obj => obj.value === this.state.type)}
                  />
									<div className="card-body events datePicker">
									{/* <div className="card-body events datePicker"> */}
										<p className={styles.occurTime}>기간</p>
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
								<div className='inquiry-event-button'>
									<button className={styles.inquiry_btn}onClick={(e) => this.handleInquiryVcounterLogs(e)}>조회</button>
								</div>												
              </div>
						</div>
					</Form.Group>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-body allEvents">
								<h4 className="card-title">주차관제시스템 V-Counter 데이터 로그</h4>
								<div className="row">
									<div className="col-12 allEvents">
										<ReactTable
											{...translations}
											data={this.state.vCounterLogs}
											className='allEvents'
											defaultPageSize={15}
											filter= 'includes'
											loading={this.state.loading}
											pageSizeOptions={
												[5, 10, 15, 20, 25, 50, 100]
											}
											columns={[
												{
													Header: "이름",
													accessor: "name",
													Cell: this.renderEditable
												},
												{
													Header: "IP주소",
													accessor: "ipaddress",
													Cell: this.renderEditable
												},
												{
													Header: "주차 가능 공간",
													accessor: "empty_slots",
													Cell: this.renderEditable
												},
												{
													Header: "입차",
													accessor: "in_count",
													Cell: this.renderEditable
												},
												{
													Header: "출차",
													accessor: "out_count",
													Cell: this.renderEditable
												},
												{
													Header: "종류",
													accessor: "cmd",
													Cell: this.renderEditable
												},
												{
													Header: "발생 시간",
													accessor: "occur_at",
													width: 280,
													Cell: this.renderEditable
												},
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
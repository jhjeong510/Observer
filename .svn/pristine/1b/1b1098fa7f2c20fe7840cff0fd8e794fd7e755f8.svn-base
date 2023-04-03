import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import ReactTable from 'react-table'
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import Select from 'react-select';
import axios from 'axios';
import DatePicker from 'react-datepicker';

export class AnprLog extends Component {

  constructor(props) {
    super();
    this.state = {
			car_recognitions: [],

			cameraId: '',
			type: '',
			startDate: '',
			newStartDate: '',
			endDate: '',
			newEndDate: '',
			startTime: '',
			newStartTime: '',
			endTime: '',
			newEndTime: '',

			loading: false,
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

	handleChangeDateTimeFormat = (dateTimeValue) => {
    try {
			const dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy년 M월 d일 EEEE HH:mm", { locale: ko });
      return dateTime;
    } catch(err) {
      console.log('event_occurrence_time dateTime format change fail error');
      return ''
    }
  }

	handleInquiryAnprLog = async (e) => {

		e.preventDefault();

		if((this.state.newStartTime && !this.state.newStartDate) || (this.state.newEndTime && !this.state.newEndDate)) {
			this.props.handleShowTimeSelectAlert();
			return;
		}

		const cameraId = this.state.cameraId ? this.state.cameraId : undefined;
		const type = this.state.type ? this.state.type : undefined;
		const startDateTime = this.state.newStartTime ? (this.state.newStartDate ? (this.state.newStartDate + ' ' + this.state.newStartTime):'') : this.state.newStartDate;
		console.log('startDateTime 확인: ', startDateTime, typeof startDateTime);
		const endDateTime = this.state.newEndTime ? (this.state.newEndDate ? (this.state.newEndDate + ' ' + this.state.newEndTime): '') : this.state.newEndDate;
		console.log('endDateTime 확인: ', endDateTime, typeof endDateTime);

		try {
			this.setState({ loading: true });
			const res = await axios.get('/api/observer/carRecognition', {
				params: {
					cameraId,
					type,
					startDateTime,
					endDateTime
				}
			})
			if(res && res.data && res.data.result && res.data.result.length > 0) {
				this.setState({ loading: false });
				this.setState({ car_recognitions: res.data.result})
			} else {
				this.setState({ loading: false });
				this.setState({ car_recognitions: []})
			}

			console.log('조회 결과(res): ', res);
			console.log('state 확인: ', this.state.car_recognitions);

		} catch (err) {
			console.log('App get Inquiry car_recognitions err:', err);
		} 
		// finally {
		// 	this.setState({ cameraId: '' });
		// 	this.setState({ type: '' });
		// 	this.setState({ startDateTime: '' });
		// 	this.setState({ endDateTime: '' });
		// }
	}


	handleChangeKorean = (detailEvent, cellInfo) => {
		if(detailEvent) {
			try {
				switch (cellInfo.column.Header) {
					case '카메라명':
						return detailEvent[cellInfo.column.id] + '.카메라'
					case '인식시간':
						return this.handleChangeDateTimeFormat(detailEvent[cellInfo.column.id])
					default:
						return detailEvent[cellInfo.column.id]
				}
			} catch(err) {
				console.error('ANPR 로그 정보 한글로 형식 변경문 err: ', err);
			}
		}
	}

  renderEditable(cellInfo) {
		console.log(cellInfo);
		return (
			<div
				style={{ backgroundColor: "rgba(rgba(0, 0, 0, 0.03))" }}
				suppressContentEditableWarning
				onBlur={e => {
					const data = [ ...this.state.accessCtlLog];
					data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
				}}
				dangerouslySetInnerHTML={{
					__html:this.handleChangeKorean(this.state.car_recognitions[cellInfo.index], cellInfo)
				}}
			/>
		)
	}

  handleChangeCameraId = (e) => {
		this.setState({ cameraId: e.value });
	}

	handleChangeType = (e) => {
		this.setState({ type: e.value });
	}

	handleChangeStartDate = (startDate) => {
		try {
			this.setState({ startDate: startDate });
			const newStartDate = dateFns.format(startDate, 'yyyy-MM-dd');
			console.log('시작 날짜 확인: ', newStartDate);
			this.setState({ newStartDate: newStartDate });
		} catch(err) {
			console.error('이벤트 발생 날짜 선택 Error: ', err)
		}
	}

	handleChangeEndDate = (endDate) => {
		try {
			this.setState({ endDate: endDate });
			const newEndDate = dateFns.format(endDate, 'yyyy-MM-dd');
			console.log('종료 날짜 확인: ', newEndDate);
			this.setState({ newEndDate: newEndDate });
		} catch(err) {
			console.error('이벤트 종료 날짜 선택 Error: ', err)
		}
	}

	handleChangeStartTime = (startTime) => {
		try {
			this.setState({ startTime: startTime });
			const newStartTime = dateFns.format(startTime, 'HH:mm:ss');
			this.setState({ newStartTime: newStartTime });
		} catch (err) {
			console.error('이벤트 발생 시간 선택 Error: ', err);
		}
	}

	handleChangeEndTime = (endTime) => {
		try {
			this.setState({ endTime: endTime });
			const newEndTime = dateFns.format(endTime, 'HH:mm:ss');
			this.setState({ newEndTime: newEndTime });
		} catch (err) {
			console.error('이벤트 종료 시간 선택 Error: ', err)
		}
	}

  render() {

		const camera_id_options = [
			{ value: '', label: '선택 안 함' }, ...this.props.cameraList.filter((camera) => camera.vendor === 'GIT').map((cameraItem) => ({ value: cameraItem.cameraid, label: cameraItem.cameraid + '.' + cameraItem.cameraname}))
		];

		const translations = {previousText: '이전', nextText: '다음', loadingText: 'LOADING...', rowsText: '건', noDataText: '데이터 없음'};

    return (
      <div>
        <div className="page-header inquiry-anpr">
					<Form.Group className="inquiry-anpr-form">
						<div className="card inquiry-anpr">
							<div className="card-body anpr">
								<div className="inquiry-anpr-select">
									<p className="card-description car-recognition-camera">카메라</p>
									<Select
										className="cameraId"
										options={camera_id_options}
										onChange={this.handleChangeCameraId}
										value={camera_id_options.filter(obj => obj.value === this.state.cameraId)}
									/>
									{/* <p className="card-description type">종류</p>
									<Select 
										className="type"
										options={type_options}
										onChange={this.handleChangeType}
										value={type_options.filter(obj => obj.value === this.state.type)}
									/> */}
									<div className="card-body car-recognition datePicker">
										<p className="card-description car-recognition datePicker">기간</p>
										<div className="daterange-picker car-recognition">
											<DatePicker
												selected={this.state.startDate}
												onChange={(date) => this.handleChangeStartDate(date)}
												selectsStart
												startDate={this.state.startDate}
												endDate={this.state.endDate}
												className="form-control datePicker"
											/>
											<DatePicker
												selected={this.state.startTime}
												onChange={(date) => this.handleChangeStartTime(date)}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={10}
												timeCaption="Time"
												dateFormat="h:mm aa"
												className="form-control TimePicker"
											/>
											<span className="range-seperator-datePicker"> to </span>
											<DatePicker
												selected={this.state.endDate}
												onChange={(date) => this.handleChangeEndDate(date)}
												selectsEnd
												endDate={this.state.endDate}
												minDate={this.state.startDate}
												className="form-control datePicker"
											/>
											<DatePicker
												selected={this.state.endTime}
												onChange={(date) => this.handleChangeEndTime(date)}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={10}
												timeCaption="Time"
												dateFormat="h:mm aa"
												className="form-control TimePicker"
											/>
										</div>
									</div>
								</div>
								<div className='inquiry-anpr-button'>
									<Button onClick={(e) => this.handleInquiryAnprLog(e)}>조회</Button>
								</div>												
							</div>
						</div>
					</Form.Group>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-body allEvents">
								<h4 className="card-title">차량번호판 인식 목록</h4>
								<div className="row">
									<div className="col-12 anpr">
										<ReactTable
											{...translations}
											data={this.state.car_recognitions}
											// filterable = {true}
											className='car_recognition'
											pageSizeOptions={
												[5, 10, 15, 20, 25, 50, 100]
											}
											defaultPageSize={15} 
											filter= 'includes'
											loading={this.state.loading}
											columns={[
												{
													Header: "번호",
													accessor: "idx",
													width: 100,
													Cell: this.renderEditable
												},
												{
													Header: "차량번호판",
													accessor: "number",
													width: 200,
													Cell: this.renderEditable
												},
												{
													Header: "카메라명",
													accessor: "camera_id",
													width: 120,
													Cell: this.renderEditable
												},
												{
													Header: "인식시간",
													accessor: "recog_time",
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

export default AnprLog

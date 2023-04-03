import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import ReactTable from 'react-table'
import * as dateFns from "date-fns";
import { de, ko } from 'date-fns/locale';
import Select from 'react-select';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import styles from './ParkingControlLog.module.css';
import { getParkingArea, getParkingCamera, getParkingDataLog, getParkingSpace } from './api/apiService';


export class ParkingControlLog extends Component {

  constructor(props) {
    super();
    this.state = {
			parkingLogs: [],
			cameraOptions: [],
			areaOptions: [],
			spaceOptions: [],
			camera_ip: '',
			area: '',
			index_number: '',
			occupancy: '',
			type: '',
			startDate: '',
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
					const data = [ ...this.state.parkingLogs];
					data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
				}}
				dangerouslySetInnerHTML={{
					__html: this.handleChangeKorean(this.state.parkingLogs[cellInfo.index], cellInfo)
				}}
			/>
		)
	}

  handleChangeCameraIp = async (e) => {
		await this.setState({ camera_ip: e.value });
	}

	handleChangeArea = async (e) => {
		await this.setState({ area: e.value });
	}

	handleChangeIndexnumber = async (e) => {
		await this.setState({ index_number: e.value });
	}

	handleChangeOccupancy = (e) => {
		this.setState({ occupancy: e.value });
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

  handleInquiryParkingLogs = async (e) => {
		if(e){
			e.preventDefault();
		}
		if((this.state.startTime && !this.state.startDate) || (this.state.endTime && !this.state.endDate)) {
			this.props.handleShowTimeSelectAlert();
			return;
		}

		const camera_ip = this.state.camera_ip;
		const area = this.state.area;
		const index_number = this.state.index_number;
		const occupancy = this.state.occupancy;
		const type = this.state.type ? parseInt(this.state.type) : undefined;
		const startDateTime = this.state.newStartTime ? (this.state.newStartDate ? (this.state.newStartDate + ' ' + this.state.newStartTime):'') : this.state.newStartDate;
		const endDateTime = this.state.newEndTime ? (this.state.newEndDate ? (this.state.newEndDate + ' ' + this.state.newEndTime): '') : this.state.newEndDate;

		this.setState({ loading: true });
		const res = await getParkingDataLog(camera_ip, area, index_number, occupancy, type, startDateTime, endDateTime);
		if(res && res.data && res.data.result && res.data.result.length > 0){
			await this.setState({ loading: false });
			this.setState({ parkingLogs: res.data.result});
		} else {
			await this.setState({ loading: false });
			this.setState({ parkingLogs: []})
		}
	}

	handleChangeDateTimeFormat = (dateTimeValue, columnValue) => {
    try {
			let dateTime;
			if(columnValue === 'occurTime'){
				dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy년 M월 d일 E요일 HH:mm:ss", { locale: ko });
			} else if(columnValue === 'ack') {
				dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy.M.d EEE HH:mm:ss", { locale: ko });
			}
      return dateTime;
    } catch(err) {
      console.log('occur_at format change error');
      return ''
    }
  }

	handleChangeDescription = (description) => {
		switch(description){
			case 'parking camera total status update':
				return '주차 카메라 전체 현황 업데이트';
			case 'space status update':
				return '주차 구역 상태 업데이트';
			case 'area status update':
				return '주차 구역 그룹 상태 업데이트';
			case 'parkingCamera name update':
				return '주차 카메라 이름 업데이트';
			case 'area delete':
				return '주차 구역 그룹 삭제';
			case 'space delete':
				return '주차 구역 삭제';
			case 'space occupancy status update':
				return '주차 구역 상태(주차/출차) 업데이트';
			case 'space type update':
				return '주차 구역 설정 업데이트'
			case 'delete':
				return '삭제'
			case 'all area delete':
				return '해당 카메라 모든 그룹 삭제'
			case 'all space delete':
				return '해당 카메라 모든 주차 구역 삭제'
			default:
				break;
		}
	}

  handleChangeKorean = (detailEvent, cellInfo) => {
		if(detailEvent){
			try {
				switch (cellInfo.column.Header) {
					case '주차 여부':
						return detailEvent[cellInfo.column.id] === '0' ? '출차' : detailEvent[cellInfo.column.id] === '1'?'주차':'';
					case '종류':
							return detailEvent[cellInfo.column.id] === 0 ? '일반' : (detailEvent[cellInfo.column.id] === 1 ? '경차' : (detailEvent[cellInfo.column.id] === 2 ? '장애인': (detailEvent[cellInfo.column.id] === 3 ? '전기차': detailEvent[cellInfo.column.id] === 4 ?'주차 금지 구역':'')));
					case '상세정보':
							return this.handleChangeDescription(detailEvent[cellInfo.column.id]);
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

	readParkingCameras = async () => {
		const parkingCamerasRes = await getParkingCamera();
		if(parkingCamerasRes && parkingCamerasRes.data && parkingCamerasRes.data.result){
			await this.setState({ cameraOptions: parkingCamerasRes.data.result });
		}
	}

	readParkingAreas = async (cameraIp) => {
		const parkingAreaRes = await getParkingArea(cameraIp);
		if(parkingAreaRes && parkingAreaRes.data && parkingAreaRes.data.result){
			await this.setState({ areaOptions: parkingAreaRes.data.result });
		}
	}

	readParkingSpaces = async (cameraIp, areaName) => {
		const parkingSpacesRes = await getParkingSpace(cameraIp, areaName);
		if(parkingSpacesRes && parkingSpacesRes.data && parkingSpacesRes.data.result){
			await this.setState({ spaceOptions: parkingSpacesRes.data.result });
		}
	}

	async componentDidMount() {
		this.readParkingCameras();
		this.setDefaultPeriod();
	}

	
  componentDidUpdate(prevProps, prevState) {
    if (prevState.camera_ip !== this.state.camera_ip) {
      if(this.state.camera_ip){
				this.readParkingAreas(this.state.camera_ip)
			}
    }
		if (prevState.area !== this.state.area) {
			if(this.state.camera_ip && this.state.area){
				this.readParkingSpaces(this.state.camera_ip, this.state.area)
			}
		}
		if(prevProps.parkingCameraUpdate !== this.props.parkingCameraUpdate){
			if(this.props.parkingCameraUpdate){
				this.readParkingCameras();
			}
		}
		if(prevProps.parkingAreaUpdate !== this.props.parkingAreaUpdate){
			if(this.props.parkingAreaUpdate){
				this.readParkingAreas();
			}
		}
		if(prevProps.parkingSpaceUpdate !== this.props.parkingSpaceUpdate){
			if(this.props.parkingSpaceUpdate){
				this.readParkingSpaces();
			}
		}
  }

  render() {

		const camera_options = [{ value: '', label: '선택 안 함' }, ...this.state.cameraOptions.map((cameraDetail) => ({ value: cameraDetail.ipaddress, label: cameraDetail.name ? (cameraDetail.name+'('+cameraDetail.ipaddress +')'):cameraDetail.ipaddress}))];

		const area_options =  [{ value: '', label: '선택 안 함' }, ...this.state.areaOptions.map((areaDetail) => ({ value: areaDetail.name, label: areaDetail.name }))];

		const space_options = [{ value: '', label: '선택 안 함' }, ...this.state.spaceOptions.map((spaceDetail) => ({ value: spaceDetail.index_number, label: (spaceDetail.parking_area+spaceDetail.index_number) }))];

		const occupancy_options = [
			{ value: '', label: '선택 안 함'},
			{ value: '0', label: '출차' },
			{ value: '1', label: '주차' }
		]

		const type_options = [
			{ value: '', label: '선택 안 함' },
			{ value: 0, label: '일반'},
			{ value: 1, label: '경차'},
			{ value: 2, label: '장애인'},
			{ value: 3, label: '전기차' },
			{ value: 4, label: '주차금지구역 주차' }
		];

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
            <div className={styles.form_child}>
						<div className={styles.filter_options_parent}>
							<div className={styles.filter_options}>
									<p className={styles.camera_label}>카메라</p>
                  <Select
										className={styles.camera_input}
                    options={camera_options}
										onChange={this.handleChangeCameraIp}
										value={camera_options.filter(obj => obj.value === this.state.camera_ip)}
										// isMulti={true}
                  />
                  <p className={styles.area_label}>주차 구역 그룹</p>
                  <Select 
										className={styles.area_input}
                    options={area_options}
										onChange={this.handleChangeArea}
										value={area_options.filter(obj => obj.value === this.state.area)}
                  />
									<p className={styles.space_label}>주차 구역</p>
                  <Select
										className={styles.space_input}
                    options={space_options}
										onChange={this.handleChangeIndexnumber}
										value={space_options.filter(obj => obj.value === this.state.index_number)}
                  />
									<p className={styles.occupancy_label}>주차/출차</p>
                  <Select
										className={styles.occupancy_input}
                    options={occupancy_options}
										onChange={this.handleChangeOccupancy}
										value={occupancy_options.filter(obj => obj.value === this.state.occupancy)}
                  />
                  <p className={styles.type_label}>구역 종류</p>
                  <Select
										className={styles.type_input}
                    options={type_options}
										onChange={this.handleChangeType}
										value={type_options.filter(obj => obj.value === this.state.type)}
                  />
									<div className="card-body events datePicker">
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
									<button className={styles.inquiry_btn}onClick={(e) => this.handleInquiryParkingLogs(e)}>조회</button>
								</div>												
              </div>
						</div>
					</Form.Group>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-body allEvents">
								<h4 className="card-title">주차관제시스템 데이터 로그</h4>
								<div className="row">
									<div className="col-12 allEvents">
										<ReactTable
											{...translations}
											data={this.state.parkingLogs}
											className='allEvents'
											defaultPageSize={15}
											filter= 'includes'
											loading={this.state.loading}
											pageSizeOptions={
												[5, 10, 15, 20, 25, 50, 100]
											}
											columns={[
												{
													Header: "카메라 IP",
													accessor: "camera_ip",
													width: 150,
													Cell: this.renderEditable
												},
												{
												  Header: "카메라 이름",
													accessor: "camera_name",
													width: 150,
													Cell: this.renderEditable
												},
												{
													Header: "그룹",
													accessor: "area",
													width: 80,
													Cell: this.renderEditable
												},
												{
													Header: "구역",
													accessor: "index_number",
													width: 200,
													Cell: this.renderEditable
												},
												{
													Header: "주차 여부",
													accessor: "occupancy",
													Cell: this.renderEditable
												},
												{
													Header: "종류",
													accessor: "type",
													width: 160,
													Cell: this.renderEditable
												},
												{
													Header: "총 주차 가능",
													accessor: 'total_available',
													width: 130,
													Cell: this.renderEditable
												},
												{
													Header: "총 주차",
													accessor: 'total_occupied',
													Cell: this.renderEditable
												},
												{
													Header: "상세정보",
													accessor: "cmd",
													width: 270,
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

export default ParkingControlLog

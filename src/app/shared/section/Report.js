import React, { Component } from 'react'
import { Modal, Button, Tabs, Tab, Row, Col, Nav, Form } from 'react-bootstrap';
import DateModalConfirm from '../../DateModalConfirm';
import DefaultReport from './section/DefaultReport';
import DetailReportIcon from '../../../assets/images/detail_report.png';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import DetailReport from './section/DetailReport';
import DetailReport2 from './section/DetailReport2';
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import styles from './Report.module.css';
import { getDefaultReport, getReportEventDetail } from '../../dashboard/api/apiService';

export class Report extends Component {

  state = {
    nDoctorData: '',
		serviceTypeData: '',
		eventTypeData: '',
		severityData: '',
		unAcknowledgedData: '',
    defaultDetailEventsData: '',

		showModal: '',
		startDate: '',
		newStartDate: '',
		endDate: '',
		newEndDate: '',
		startTime: '',
		newStartTime: '',
		endTime: '',
		newEndTime: '',
    startDateTime: '',
    endDateTime: '',
		showAlert: false,

    checked: [],

    mgistEventTypeData: '',
		mgistSeverityData: '',
		mgistUnAcknowledgedData: '',

    ebellEventTypeData: '',
		ebellSeverityData: '',
		ebellUnAcknowledgedData: '',

    guardianliteEventTypeData: '',
    guardianliteSeverityData: '',
    guardianliteUnAcknowledgedData: '',

    anprEventTypeData: '',
    anprSeverityData: '',
    anprUnAcknowledgedData: '',

    accessctlEventTypeData: '',
		accessctlSeverityData: '',
		accessctlUnAcknowledgedData: '',

    breathSensorEventTypeData: '',
		breathSensorSeverityData: '',
		breathSensorUnAcknowledgedData: '',

    pidsEventTypeData: '',
		pidsSeverityData: '',
		pidsUnAcknowledgedData: '',

    parkingctlEventTypeData: '',
		parkingctlSeverityData: '',
		parkingctlUnAcknowledgedData: '',

    mdetEventTypeData: '',
		mdetSeverityData: '',
		mdetUnAcknowledgedData: '',
		
    crowdDensityEventTypeData: '',
    crowdDensitySeverityData: '',
    crowdDensityUnAcknowledgedData: '',

    mgistDetailEventData: '',
    ebellDetailEventData: '',
    guardianliteDetailEventData: '',
    anprDetailEventData: '',
    accessctlDetailEventData: '',
    ndoctorDetailEventData: '',
    breathSensorDetailEventData: '',
    pidsDetailEventData: '',
    parkingctlDetailEventData: '',
    crowdDensityDetailEventData: '',
    mdetDetailEventData: ''
	}

  handleChangeStartDate = (startDate) => {

		try {
			this.setState({ startDate: startDate });
			const newStartDate = dateFns.format(startDate, 'yyyyMMdd');
			this.setState({ newStartDate: newStartDate });
		} catch(err) {
			console.error('이벤트 발생 날짜 선택 Error: ', err)
		}

	}

	handleChangeEndDate = (endDate) => {

		try {
			this.setState({ endDate: endDate });
			const newEndDate = dateFns.format(endDate, 'yyyyMMdd');
			this.setState({ newEndDate: newEndDate });
		} catch (err) {
			console.error('이벤트 종료 날짜 선택 Error: ', err);
		}

	}

	handleChangeStartTime = (startTime) => {

		try {
			this.setState({ startTime: startTime });
			const newStartTime = dateFns.format(startTime, 'HHmmss');
			this.setState({ newStartTime: newStartTime });
		} catch (err) {
			console.error('이벤트 발생 시간 선택 Error: ', err);
		}
		
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

  handleMapServiceTypeOptions = (serviceTypeValue) => {
    if (serviceTypeValue === 'mgist'){
      return {
        id: 1,
        label: 'MGIST',
        value: 'mgist'
      }
    } else if(serviceTypeValue === 'accesscontrol') {
      return {
        id: 2,
        label: '출입통제',
        value: 'accesscontrol'
      }
    } else if(serviceTypeValue === 'ndoctor') {
      return {
        id: 3,
        label: 'N-Doctor',
        value: 'ndoctor'
      }
    } else if(serviceTypeValue === 'guardianlite') {
      return {
        id: 4,
        label: '가디언라이트',
        value: 'guardianlite'
      }
    } else if(serviceTypeValue === 'anpr') {
      return {
        id: 5,
        label: 'ANPR',
        value: 'anpr'
      }
    } else if(serviceTypeValue === 'ebell') {
      return {
        id: 6,
        label: '비상벨',
        value: 'ebell'
      }
    } else if(serviceTypeValue === 'vitalsensor') {
      return {
        id: 7,
        label: '바이탈센서',
        value: 'vitalsensor'
      }
    } else if(serviceTypeValue === 'pids') {
      return {
        id: 8,
        label: 'PIDS',
        value: 'pids'
      }
    } else if(serviceTypeValue === 'parkingcontrol') {
      return {
        id: 9,
        label: '주차관제시스템',
        value: 'parkingcontrol'
      }
    } else if(serviceTypeValue === 'crowddensity') {
      return {
        id: 10,
        label: '군중 밀집도 감지',
        value: 'crowddensity'
      }
    } else if(serviceTypeValue === 'mdet') {
      return {
        id: 11,
        label: 'M-DET',
        value: 'mdet'
      }
    }
  }

  handleToggle = (value) => {
    const currentIndex = this.state.checked.indexOf(value);

    const newChecked = [...this.state.checked];
    const service_items = ['all', ...this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true').map((serviceType) => serviceType.name)];

    if(currentIndex === -1) {
      if(value === 'all') {
        service_items.forEach((serviceItem) => {
          newChecked.push(serviceItem)
        })
      } else {
        newChecked.push(value)
        if(!newChecked.includes('all') && (newChecked.length === service_items.length-1)) {
          newChecked.push('all')
        }
      }
    } else {
      if(value === 'all'){
        newChecked.splice(0, newChecked.length);
      } else {
        if(this.state.checked.indexOf('all') === -1){
          newChecked.splice(currentIndex, 1);
        } else {
          newChecked.splice(currentIndex, 1);
          const AllIndex = newChecked.indexOf('all');
          newChecked.splice(AllIndex, 1);
        }
      }
    }
    this.setState({ checked: newChecked });
  };

	handleShowDateSelectAlert = () => {
		this.setState({ showModal: !this.state.showModal });
	}

  handleDetailReportRefresh = () => {
    this.setState({
      mgistEventTypeData: '',
      mgistSeverityData: '',
      mgistUnAcknowledgedData: '',

      ebellEventTypeData: '',
      ebellSeverityData: '',
      ebellUnAcknowledgedData: '',

      guardianliteEventTypeData: '',
      guardianliteSeverityData: '',
      guardianliteUnAcknowledgedData: '',

      anprEventTypeData: '',
      anprSeverityData: '',
      anprUnAcknowledgedData: '',

      accessctlEventTypeData: '',
      accessctlSeverityData: '',
      accessctlUnAcknowledgedData: '',

      breathSensorEventTypeData: '',
      breathSensorSeverityData: '',
      breathSensorUnAcknowledgedData: '',

      pidsEventTypeData: '',
      pidsSeverityData: '',
      pidsUnAcknowledgedData: '',

      ndoctorEventTypeData: '',
      ndoctorSeverityData: '',
      ndoctorUnAcknowledgedData: '',

      parkingctlEventTypeData: '',
      parkingctlSeverityData: '',
      parkingctlUnAcknowledgedData: '',

      crowdDensityEventTypeData: '',
      crowdDensitySeverityData: '',
      crowdDensityUnAcknowledgedData: '',
      
      mDetEventTypeData: '',
      mDetSeverityData: '',
      mDetUnAcknowledgedData: '',
    })
  }

	handleReportEvents = async (e, startDateTimeValue, endDateTimeValue) => {

		if(e) {
			e.preventDefault();
		}

    this.handleDetailReportRefresh();

		if(!(startDateTimeValue && endDateTimeValue) && (this.state.newStartTime && !this.state.newStartDate) || (this.state.newEndTime && !this.state.newEndDate) && !(this.state.startDateTime && this.state.endDateTime)) {
			this.setState({ showModal: !this.state.showModal});
			return;
		}

		if(!(startDateTimeValue && endDateTimeValue) && !(this.state.newStartDate || this.state.newEndDate) && !(this.state.startDateTime && this.state.endDateTime)) {
			this.setState({ showModal: !this.state.showModal});
			return;
		}

		const startDateTime = (this.state.newStartDate ? (this.state.newStartTime ? (this.state.newStartDate + 'T' + this.state.newStartTime):this.state.newStartDate) : (startDateTimeValue ? startDateTimeValue : this.state.startDateTime));
		const endDateTime = (this.state.newEndDate ? (this.state.newEndTime ? (this.state.newEndDate + 'T' + this.state.newEndTime): this.state.newEndDate) : (endDateTimeValue ? endDateTimeValue : this.state.endDateTime));

		try {
      let res;
      if(this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0){
        res = await getDefaultReport(startDateTime, endDateTime, 'ndoctor');
      }
      const res2 = await getDefaultReport(startDateTime, endDateTime, 'service_type');
      const res3 = await getDefaultReport(startDateTime, endDateTime, 'event_type');
      const res4 = await getDefaultReport(startDateTime, endDateTime, 'severity');
      const res5 = await getDefaultReport(startDateTime, endDateTime, 'acknowledge');
      const res6 = await getReportEventDetail(startDateTime, endDateTime);

			if(res && res.data && res.data.result && res.data.result.length > 0) {
				this.setState({ nDoctorData: res.data.result});
			} else if(res !== undefined) {
				this.setState({ nDoctorData: []});
      }
			if(res2 && res2.data && res2.data.result && res2.data.result.length > 0) {
				this.setState({ serviceTypeData: res2.data.result});
			} else {
				this.setState({ serviceTypeData: []});
			}
			if(res3 && res3.data && res3.data.result && res3.data.result.length > 0) {
				this.setState({ eventTypeData: res3.data.result});
			} else {
				this.setState({ eventTypeData: []});
			}
			if(res4 && res4.data && res4.data.result && res4.data.result.length > 0) {
				this.setState({ severityData: res4.data.result});
			} else {
				this.setState({ severityData: []});
			}
			if(res5 && res5.data && res5.data.result && res5.data.result.length > 0) {
				this.setState({ unAcknowledgedData: res5.data.result});
			} else {
				this.setState({ unAcknowledgedData: []});
			}
      if(res6 && res6.data && res6.data.result && res6.data.result.length > 0) {
				this.setState({ defaultDetailEventsData: res6.data.result});
			} else {
				this.setState({ defaultDetailEventsData: []});
			}
			this.setState({ startDateTime: startDateTime});
			this.setState({ endDateTime: endDateTime});
		} catch (err) {
			console.error('get Report Data err:', err);
		}
	}

  handleAddDetailReportByService = async (e) => {
    if(e) {
			e.preventDefault();
		}

		if((this.state.newStartTime && !this.state.newStartDate) || (this.state.newEndTime && !this.state.newEndDate) && !(this.state.startDateTime && this.state.endDateTime)) {
			this.setState({ showModal: !this.state.showModal});
			return;
		}

		if(!(this.state.newStartDate || this.state.newEndDate) && !(this.state.startDateTime && this.state.endDateTime)) {
			this.setState({ showModal: !this.state.showModal});
			return;
		}

		const startDateTime = (this.state.newStartDate ? (this.state.newStartTime ? (this.state.newStartDate + 'T' + this.state.newStartTime):this.state.newStartDate) : this.state.startDateTime);
		const endDateTime = (this.state.newEndDate ? (this.state.newEndTime ? (this.state.newEndDate + 'T' + this.state.newEndTime): this.state.newEndDate) : this.state.endDateTime);

    document.getElementsByClassName("observer-report-page")[0].className = "observer-report-page detail";

		try {
      for(const checkedItem of this.state.checked) {
        if(checkedItem === 'vitalsensor') {
          const res = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'event_type',
              service_type: 'observer',
              device_type: 'vitalsensor'
            }
          })
          const res2 = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'severity',
              service_type: 'observer',
              device_type: 'vitalsensor'
            }
          })
          const res3 = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'acknowledge',
              service_type: 'observer',
              device_type: 'vitalsensor'
            }
          })
          const res4 = await axios.get('/api/observer/reportDetailEvents', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'vitalsensor'
            }
          })
          if(res && res.data && res.data.result && res.data.result.length > 0) {
            this.setState({ breathSensorEventTypeData: res.data.result});
          } else {
            this.setState({ breathSensorEventTypeData: []});
          }
          if(res2 && res2.data && res2.data.result && res2.data.result.length > 0) {
            this.setState({ breathSensorSeverityData: res2.data.result});
          } else {
            this.setState({ breathSensorSeverityData: []});
          }
          if(res3 && res3.data && res3.data.result && res3.data.result.length > 0) {
            this.setState({ breathSensorUnAcknowledgedData: res3.data.result});
          } else {
            this.setState({ breathSensorUnAcknowledgedData: []});
          }
          if(res4 && res4.data && res4.data.result && res4.data.result.length > 0) {
            this.setState({ breathSensorDetailEventData: res4.data.result});
          } else {
            this.setState({ breathSensorDetailEventData: []});
          }
        } else if (checkedItem === 'pids') {
          const res = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'event_type',
              service_type: 'observer',
              device_type: 'zone'
            }
          })
          const res2 = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'severity',
              service_type: 'observer',
              device_type: 'zone'
            }
          })
          const res3 = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'acknowledge',
              service_type: 'observer',
              device_type: 'zone'
            }
          })
          const res4 = await axios.get('/api/observer/reportDetailEvents', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'pids'
            }
          })
          if(res && res.data && res.data.result && res.data.result.length > 0) {
            this.setState({ pidsEventTypeData: res.data.result});
          } else {
            this.setState({ pidsEventTypeData: []});
          }
          if(res2 && res2.data && res2.data.result && res2.data.result.length > 0) {
            this.setState({ pidsSeverityData: res2.data.result});
          } else {
            this.setState({ pidsSeverityData: []});
          }
          if(res3 && res3.data && res3.data.result && res3.data.result.length > 0) {
            this.setState({ pidsUnAcknowledgedData: res3.data.result});
          } else {
            this.setState({ pidsUnAcknowledgedData: []});
          }
          if(res4 && res4.data && res4.data.result && res4.data.result.length > 0) {
            this.setState({ pidsDetailEventData: res4.data.result});
          } else {
            this.setState({ pidsDetailEventData: []});
          }
        } else if(checkedItem !== 'all') {
          const res = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'event_type',
              service_type: checkedItem,
            }
          })
          const res2 = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'severity',
              service_type: checkedItem,
            }
          })
          const res3 = await axios.get('/api/observer/detailReport', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: 'acknowledge',
              service_type: checkedItem,
            }
          })
          const res4 = await axios.get('/api/observer/reportDetailEvents', {
            params: {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              sort: checkedItem
            }
          })
          if(res && res.data && res.data.result && res.data.result.length > 0) {
            if(checkedItem === 'mgist') {
              this.setState({ mgistEventTypeData: res.data.result});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellEventTypeData: res.data.result});
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlEventTypeData: res.data.result});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteEventTypeData: res.data.result });
            } else if(checkedItem === 'anpr') {
              this.setState({ anprEventTypeData: res.data.result });
            } else if(checkedItem === 'ndoctor') {
              this.setState({ ndoctorEventTypeData: res.data.result });
            } else if(checkedItem === 'parkingcontrol') {
              this.setState({ parkingctlEventTypeData: res.data.result });
            } else if(checkedItem === 'crowddensity') {
              this.setState({ crowdDensityEventTypeData: res.data.result });
            } else if(checkedItem === 'mdet') {
              this.setState({ mdetEventTypeData: res.data.result });
            }
          } else {
            if(checkedItem === 'mgist') {
              this.setState({ mgistEventTypeData: []});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellEventTypeData: []});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteEventTypeData: []});
            } else if(checkedItem === 'anpr') {
              this.setState({ anprEventTypeData: []});
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlEventTypeData: []});
            } else if(checkedItem === 'ndoctor') {
              this.setState({ ndoctorEventTypeData: []});
            } else if(checkedItem === 'parkingcontrol') {
              this.setState({ parkingctlEventTypeData: []});
            } else if(checkedItem === 'crowddensity') {
              this.setState({ crowdDensityEventTypeData: []});
            } else if(checkedItem === 'mdet') {
              this.setState({ mdetEventTypeData: []});
            }
          }
          if(res2 && res2.data && res2.data.result && res2.data.result.length > 0) {
            if(checkedItem === 'mgist') {
              this.setState({ mgistSeverityData: res2.data.result});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellSeverityData: res2.data.result});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteSeverityData: res2.data.result });
            } else if(checkedItem === 'anpr') {
              this.setState({ anprSeverityData: res2.data.result });
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlSeverityData: res2.data.result});
            } else if(checkedItem === 'ndoctor') {
              this.setState({ ndoctorSeverityData: res2.data.result });
            } else if(checkedItem === 'parkingcontrol') {
              this.setState({ parkingctlSeverityData: res2.data.result });
            } else if(checkedItem === 'crowddensity') {
              this.setState({ crowdDensitySeverityData: res2.data.result});
            } else if(checkedItem === 'mdet') {
              this.setState({ mdetSeverityData: res2.data.result});
            }
          } else {
            if(checkedItem === 'mgist') {
              this.setState({ mgistSeverityData: []});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellSeverityData: []});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteSeverityData: []});
            } else if(checkedItem === 'anpr') {
              this.setState({ anprSeverityData: []});
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlSeverityData: []});
            } else if(checkedItem === 'ndoctor') {
              this.setState({ ndoctorSeverityData: []});
            } else if(checkedItem === 'parkingcontrol') {
              this.setState({ parkingctlSeverityData: []});
            } else if(checkedItem === 'crowddensity') {
              this.setState({ crowdDensitySeverityData: []});
            } else if(checkedItem === 'mdet') {
              this.setState({ mdetSeverityData: []});
            }
          }
          if(res3 && res3.data && res3.data.result && res3.data.result.length > 0) {
            if(checkedItem === 'mgist') {
              this.setState({ mgistUnAcknowledgedData: res3.data.result});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellUnAcknowledgedData: res3.data.result});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteUnAcknowledgedData: res3.data.result });
            } else if(checkedItem === 'anpr') {
              this.setState({ anprUnAcknowledgedData: res3.data.result });
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlUnAcknowledgedData: res3.data.result});
            } else if(checkedItem === 'ndoctor'){
              this.setState({ ndoctorUnAcknowledgedData: res3.data.result });
            } else if(checkedItem === 'parkingcontrol'){
              this.setState({ parkingctlUnAcknowledgedData: res3.data.result });
            } else if(checkedItem === 'crowddensity'){
              this.setState({ crowdDensityUnAcknowledgedData: res3.data.result });
            } else if(checkedItem === 'mdet'){
              this.setState({ mdetUnAcknowledgedData: res3.data.result });
            }
          } else {
            if(checkedItem === 'mgist') {
              this.setState({ mgistUnAcknowledgedData: []});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellUnAcknowledgedData: []});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteUnAcknowledgedData: []});
            } else if(checkedItem === 'anpr') {
              this.setState({ anprUnAcknowledgedData: [] });
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlUnAcknowledgedData: []});
            } else if(checkedItem === 'ndoctor') {
              this.setState({ ndoctorUnAcknowledgedData: []});
            } else if(checkedItem === 'parkingcontrol') {
              this.setState({ parkingctlUnAcknowledgedData: []});
            } else if(checkedItem === 'crowddensity') {
              this.setState({ crowdDensityUnAcknowledgedData: []});
            } else if(checkedItem === 'mdet'){
              this.setState({ mdetUnAcknowledgedData: [] });
            }
          }
          if(res4 && res4.data && res4.data.result && res4.data.result.length > 0) {
            if(checkedItem === 'mgist') {
              this.setState({ mgistDetailEventData: res4.data.result});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellDetailEventData: res4.data.result});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteDetailEventData: res4.data.result});
            } else if(checkedItem === 'anpr') {
              this.setState({ anprDetailEventData: res4.data.result});
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlDetailEventData: res4.data.result});
            } else if(checkedItem === 'ndoctor'){
              this.setState({ ndoctorDetailEventData: res4.data.result });
            } else if(checkedItem === 'parkingcontrol'){
              this.setState({ parkingctlDetailEventData: res4.data.result });
            } else if(checkedItem === 'crowddensity'){
              this.setState({ crowdDensityDetailEventData: res4.data.result });
            } else if(checkedItem === 'mdet'){
              this.setState({ mdetDetailEventData: res4.data.result});
            }
          } else {
            if(checkedItem === 'mgist') {
              this.setState({ mgistDetailEventData: []});
            } else if(checkedItem === 'ebell') {
              this.setState({ ebellDetailEventData: []});
            } else if(checkedItem === 'guardianlite') {
              this.setState({ guardianliteDetailEventData: []});
            } else if(checkedItem === 'anpr') {
              this.setState({ anprDetailEventData: []});
            } else if(checkedItem === 'accesscontrol') {
              this.setState({ accessctlDetailEventData: []});
            } else if(checkedItem === 'ndoctor'){
              this.setState({ ndoctorDetailEventData: [] });
            } else if(checkedItem === 'parkingcontrol'){
              this.setState({ parkingctlDetailEventData: [] });
            } else if(checkedItem === 'crowddensity'){
              this.setState({ crowdDensityDetailEventData: [] });
            } else if(checkedItem === 'mdet'){
              this.setState({ mdetDetailEventData: []});
            }
          }
        }
      }
			this.setState({ startDateTime: startDateTime});
			this.setState({ endDateTime: endDateTime});
		} catch (err) {
			console.log('App get Detail Report Data By Service err:', err);
		}
  }

  handleDefaultReportForWeek = async (e) => {

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

		this.handleReportEvents(e, startDateTime, endDateTime);
  }

  handleChangeServiceName = (serviceName) => {
		switch(serviceName){
			case 'mgist':
				return 'MGIST'
      case 'guardianlite':
        return '가디언라이트'
      case 'anpr':
        return 'ANPR'
			case 'ebell':
				return '비상벨'
			case 'accesscontrol':
				return '출입통제'
			case 'vitalsensor':
				return '바이탈센서'
			case 'ndoctor':
				return 'N-Doctor'
			case 'zone':
				return 'PIDS'
      case 'parkingcontrol':
        return '주차관제시스템'
      case 'crowddensity':
        return '군중 밀집도 감지'
      case 'mdet':
        return 'M-Det'
      default:
        return serviceName
		}
	}

	handleChangeEventType = (eventType) => {
		switch(eventType){
			case 1:
				return '화재 감지'
			case 2:
				return '연기 감지'
			case 3:
				return '움직임 감지'
			case 4:
				return '배회 감지'
			case 5:
				return '잃어버린 물건 감지'
			case 6:
				return '영역 침입 감지'
			case 7:
				return '영역 이탈 감지'
			case 8:
				return '라인 크로스 감지'
			case 9:
				return '대기열 감지'
			case 10:
				return '쓰러짐 감지'
			case 11:
				return '앉은 자세 감지'
			case 12:
				return '정지 감지'
			case 13:
				return '영역 이동 감지'
			case 14:
				return '피플 카운트'
			case 15:
				return '근거리 감지'
			case 16:
				return '난감 잡기 감지'
			case 17:
				return '양손 들기 감지'
			case 18:
				return '얼굴 감지'
			case 19:
				return '비상상황 발생'
			case 20:
				return '전원장치 ON'
			case 21:
				return '전원장치 OFF'
			case 22:
				return '전원장치 RESET'
			case 23:
				return '블랙리스트'
			case 24:
				return '화이트리스트'
			case 25:
				return '화재신호'
			case 26:
				return '미등록출입시도'
			case 27:
				return '강제출입문열림'
			case 28:
				return '호흡이상감지'
			case 29:
				return 'PIDS 이벤트 감지'
			case 30:
				return '사람 감지'
			case 31:
				return '차량 감지'
			case 32:
				return '안전모 미착용 감지'
			case 33:
				return '연결 끊어짐'
			case 34:
				return '연결 복구'
      case 35:
        return '주차금지구역 주차'
      case 36:
        return '만차'
      case 37:
        return '금속탐지'
      case 38:
        return '군중 밀집'
		}
	}

  handleChangeDeviceTypeName = (deviceType) => {
		switch(deviceType){
			case 'camera':
				return '카메라'
			case 'ebell':
				return '비상벨'
      case 'guardianlite':
        return '전원장치'
			case 'door':
				return '출입문'
			case 'acu':
				return 'ACU'
			case 'vitalsensor':
				return '바이탈센서'
			case 'zone':
				return 'PIDS'
      case 'mdet':
        return 'M-Det'
      case 'crowddensity':
        return '군중 밀집도 감지 카메라'
		}
	}

  handleChangeDateTimeFormat = (dateTimeValue, columnValue) => {
    try {
			let dateTime;
			if(columnValue === 'occurTime'){
				dateTime = dateFns.format(dateFns.parseISO(dateTimeValue), "yyyy년 M월 d일 EEEE HH:mm", { locale: ko });
			} else if(columnValue === 'ack') {
				dateTime = dateFns.format(new Date(dateTimeValue), "yyyy년 M월 d일 EEEE HH:mm",  {locale: ko});
			}
      return dateTime;
    } catch(err) {
      console.log('event_occurrence_time dateTime format change fail error');
      return ''
    }
  }

  handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('옵저버 보고서');
    worksheet.mergeCells('A1', 'B1');
    worksheet.getCell(`A1`).value = '옵저버 보고서';
    worksheet.getCell('A1').font = {
      name: 'Arial Black',
      family: 4,
      size: 20,
      underline: false,
      bold: true
    };

    worksheet.mergeCells('C1', 'F1');
    worksheet.getCell(`C1`).value = '조회 기간';
    worksheet.mergeCells('C2', 'F2');
    worksheet.getCell(`C2`).value = dateFns.format(this.state.startDate, "yyyy.MM.dd HH:mm:ss") + '~' + dateFns.format(this.state.endDate, "yyyy.MM.dd HH:mm:ss");

    //기본 보고서
    worksheet.getCell(`A3`).value = '기본 보고서';
    worksheet.getCell('A3').font = {
      name: 'Arial Black',
      family: 3,
      size: 16,
      underline: true,
      bold: true
    };

    //N-Doctor 장애 이벤트 발생 건수
    worksheet.mergeCells('A5', 'B5');
    worksheet.getCell(`A5`).value = 'N-Doctor 장애 이벤트 발생 건수';
    worksheet.getCell('A5').font = {
      name: 'Arial Black',
      family: 3,
      size: 12,
      underline: false,
      bold: true
    };

    worksheet.getRow(6).values = ["이벤트 종류", "발생 건수"];
    worksheet.getRow(6).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };

    worksheet.columns = [
      { key: "종류"},
      { key: "발생 건수"},
    ]

    const typeCol = worksheet.getColumn('종류');
    typeCol.width = 22;

    const defaultNDoctorRows = [];
    const defaultServiceTypeRows = [];
    const defaultEventTypeRows = [];
    const defaultSeverityTypeRows = [];
    const defaultAcknowledgeRows = [];

    if(this.state.nDoctorData.length > 0) {
      this.state.nDoctorData.forEach((nDoctorEvent) => {
        defaultNDoctorRows.push({
          "종류": this.handleChangeEventType(nDoctorEvent.event_type),
          "발생 건수": nDoctorEvent.count
        })
      })
    } else {
      defaultNDoctorRows.push({
        "종류": '연결 끊어짐',
        "발생 건수": 0, 
      },{
        "종류": '연결 복구',
        "발생 건수": 0
      })
    }
    worksheet.insertRows(7, defaultNDoctorRows);
    let rowIndex = worksheet.lastRow;

    //서비스 종류별 이벤트 발생 건수
    worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
    worksheet.getCell(`A'${rowIndex._number+2}'`).value = '서비스별 이벤트 발생 건수';
    worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
      name: 'Arial Black',
      family: 3,
      size: 12,
      underline: false,
      bold: true
    };
    worksheet.getRow(rowIndex._number+3).values = ["서비스 종류","발생 건수"];
    worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };

    if(this.state.serviceTypeData.length > 0) {
      this.state.serviceTypeData.forEach((serviceType)=>{
        defaultServiceTypeRows.push({
          "종류": this.handleChangeServiceName(serviceType.service_type),
          "발생 건수": serviceType.sum
        })
      })
    } else {
      defaultServiceTypeRows.push({
        "종류": 'MGIST',
        "발생 건수": 0,
      });
      defaultServiceTypeRows.push({
        "종류": '비상벨',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": 'ANPR',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": '출입통제',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": '바이탈센서',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": 'PIDS',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": 'N-Doctor',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": '주차관제시스템',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": '군중 밀집도 감지',
        "발생 건수": 0
      });
      defaultServiceTypeRows.push({
        "종류": 'M-DET',
        "발생 건수": 0
      });
    }

    rowIndex = worksheet.lastRow;
    worksheet.insertRows(rowIndex._number+1, defaultServiceTypeRows);

    // 이벤트 종류별 발생 건수
    rowIndex = worksheet.lastRow;
    worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
    worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 종류별 발생 건수';
    worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
      name: 'Arial Black',
      family: 3,
      size: 12,
      underline: false,
      bold: true
    };
    worksheet.getRow(rowIndex._number+3).values = ["이벤트 종류","발생 건수"];
    worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };

    if(this.state.eventTypeData.length > 0) {
      this.state.eventTypeData.forEach((eventType)=>{
        defaultEventTypeRows.push({
          "종류": this.handleChangeEventType(eventType.event_type),
          "발생 건수": eventType.count
        })
      })
    } else {
      defaultEventTypeRows.push({
        "종류": '데이터 없음',
        "발생 건수": 0,
      });
    }

    rowIndex = worksheet.lastRow;
    worksheet.insertRows(rowIndex._number+1, defaultEventTypeRows);

    // 이벤트 중요도별 발생 건수
    rowIndex = worksheet.lastRow;
    worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
    worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
    worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
      name: 'Arial Black',
      family: 3,
      size: 12,
      underline: false,
      bold: true
    };
    worksheet.getRow(rowIndex._number+3).values = ["중요도","발생 건수"];
    worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };

    if(this.state.severityData.length > 0) {
      this.state.severityData.forEach((severityItem)=>{
        defaultSeverityTypeRows.push({
          "종류": severityItem.event_type_severity === 0 ? 'Default' : (severityItem.event_type_severity === 1 ? 'Minor' : (severityItem.event_type_severity === 2 ? 'Major' :(severityItem.event_type_severity === 3 ? 'Critical' : ''))),
          "발생 건수": severityItem.count
        })
      })
    } else {
      defaultSeverityTypeRows.push({
        "종류": 'Default',
        "발생 건수": 0,
      });
      defaultSeverityTypeRows.push({
        "종류": 'Minor',
        "발생 건수": 0
      });
      defaultSeverityTypeRows.push({
        "종류": 'Major',
        "발생 건수": 0
      });
      defaultSeverityTypeRows.push({
        "종류": 'Critical',
        "발생 건수": 0
      });
    }
    rowIndex = worksheet.lastRow;
    worksheet.insertRows(rowIndex._number+1, defaultSeverityTypeRows);

    // 이벤트 확인 여부
    rowIndex = worksheet.lastRow;
    worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
    worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
    worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
      name: 'Arial Black',
      family: 3,
      size: 12,
      underline: false,
      bold: true
    };

    worksheet.getRow(rowIndex._number+3).values = ["종류","건수"];
    worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };

    if(this.state.unAcknowledgedData.length > 0) {
      this.state.unAcknowledgedData.forEach((acknowledgeItem)=>{
        defaultAcknowledgeRows.push({
          "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
          "발생 건수": acknowledgeItem.count
        })
      })
    } else {
      defaultAcknowledgeRows.push({
        "종류": '확인',
        "발생 건수": 0,
      });
      defaultAcknowledgeRows.push({
        "종류": '미확인',
        "발생 건수": 0
      });
    }

    rowIndex = worksheet.lastRow;
    worksheet.insertRows(rowIndex._number+1, defaultAcknowledgeRows);
    //서비스별 상세 보고서
    if(this.state.mgistEventTypeData !== '' || 
        this.state.mgistSeverityData !== '' || 
        this.state.mgistUnAcknowledgedData !== '' || 
        this.state.ebellEventTypeData !== '' || 
        this.state.ebellSeverityData !== '' || 
        this.state.ebellUnAcknowledgedData !== '' || 
        this.state.guardianliteEventTypeData !== '' || 
        this.state.guardianliteSeverityData !== '' || 
        this.state.guardianliteUnAcknowledgedData !== '' || 
        this.state.anprEventTypeData !== '' || 
        this.state.anprSeverityData !== '' || 
        this.state.anprUnAcknowledgedData !== '' || 
        this.state.accessctlEventTypeData !== '' || 
        this.state.accessctlSeverityData !== '' || 
        this.state.accessctlUnAcknowledgedData !== '' || 
        this.state.breathSensorEventTypeData !== '' || 
        this.state.breathSensorSeverityData !== '' || 
        this.state.breathSensorUnAcknowledgedData !== '' || 
        this.state.pidsEventTypeData !== '' || 
        this.state.pidsSeverityData !== '' || 
        this.state.pidsUnAcknowledgedData !== '' || 
        this.state.ndoctorEventTypeData !== '' || 
        this.state.ndoctorSeverityData !== '' || 
        this.state.ndoctorUnAcknowledgedData !== '' ||
        this.state.parkingctlEventTypeData !== '' || 
        this.state.parkingctlSeverityData !== '' || 
        this.state.parkingctlUnAcknowledgedData !== '' ||
        this.state.mdetEventTypeData !== '' || 
        this.state.mdetSeverityData !== '' || 
        this.state.mdetUnAcknowledgedData !== '' ||
        this.state.crowdDensityEventTypeData !== '' ||
        this.state.crowdDensitySeverityData !== '' ||
        this.state.crowdDensityUnAcknowledgedData !== ''){
      
      const mgistEventTypeRows = [];
      const mgistSeverityRows = [];
      const mgistUnAcknowledgedRows = [];

      const ebellEventTypeRows = [];
      const ebellSeverityRows = [];
      const ebellUnAcknowledgedRows = [];

      const guardianliteEventTypeRows = [];
      const guardianliteSeverityRows = [];
      const guardianliteUnAcknowledgedRows = [];

      const anprEventTypeRows = [];
      const anprSeverityRows = [];
      const anprUnAcknowledgedRows = [];

      const accessctlEventTypeRows = [];
      const accessctlSeverityRows = [];
      const accessctlUnAcknowledgedRows = [];

      const breathSensorEventTypeRows = [];
      const breathSensorSeverityRows = [];
      const breathSensorUnAcknowledgedRows = [];

      const pidsEventTypeRows = [];
      const pidsSeverityRows = [];
      const pidsUnAcknowledgedRows = [];

      const ndoctorEventTypeRows = [];
      const ndoctorSeverityRows = [];
      const ndoctorUnAcknowledgedRows = [];

      const parkingctlEventTypeRows = [];
      const parkingctlSeverityRows = [];
      const parkingctlUnAcknowledgedRows = [];

      const mdetEventTypeRows = [];
      const mdetSeverityRows = [];
      const mdetUnAcknowledgedRows = [];

      const crowdDensityEventTypeRows = [];
      const crowdDensitySeverityRows = [];
      const crowdDensityUnAcknowledgedRows = [];
      
      rowIndex = worksheet.lastRow;
      worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
      worksheet.getCell(`A'${rowIndex._number+2}'`).value = '서비스별 상세 보고서';
      worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
        name: 'Arial Black',
        family: 3,
        size: 16,
        underline: true,
        bold: true
      };
      
      if(this.state.mgistEventTypeData !== '' || this.state.mgistSeverityData !== '' || this.state.mgistUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = 'MGIST';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.mgistEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
      
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.mgistEventTypeData.length > 0) {
            this.state.mgistEventTypeData.forEach((mgistEvent) => {
              mgistEventTypeRows.push({
                "종류": this.handleChangeEventType(mgistEvent.event_type),
                "발생 건수": mgistEvent.count
              })
            })
          } else {
            mgistEventTypeRows.push({
              "종류": '데이터 없음',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, mgistEventTypeRows);
        }

        if(this.state.mgistSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.mgistSeverityData.length > 0) {
            this.state.mgistSeverityData.forEach((mgistEvent) => {
              mgistSeverityRows.push({
                "종류": mgistEvent.event_type_severity === 0 ? 'Default' : (mgistEvent.event_type_severity === 1 ? 'Minor' : (mgistEvent.event_type_severity === 2 ? 'Major' :(mgistEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": mgistEvent.count
              })
            })
          } else {
            mgistSeverityRows.push({
              "종류": 'Default',
              "발생 건수": 0,
            });
            mgistSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            mgistSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            mgistSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, mgistSeverityRows);
        }

        if(this.state.mgistUnAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.mgistUnAcknowledgedData.length > 0) {
            this.state.mgistUnAcknowledgedData.forEach((acknowledgeItem) => {
              mgistUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            mgistUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            mgistUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, mgistUnAcknowledgedRows);
        }
      }
      //출입통제 상세 보고서
      if(this.state.accessctlEventTypeData !== '' || this.state.accessctlSeverityData !== '' || this.state.accessctlUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '출입통제';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.accessctlEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.accessctlEventTypeData.length > 0) {
            this.state.accessctlEventTypeData.forEach((accessctlEvent) => {
              accessctlEventTypeRows .push({
                "종류": this.handleChangeEventType(accessctlEvent.event_type),
                "발생 건수": accessctlEvent.count
              })
            })
          } else {
            accessctlEventTypeRows.push({
              "종류": '화재신호',
              "발생 건수": 0
            },{
              "종류": '미등록출입시도',
              "발생 건수": 0
            },{
              "종류": '강제출입문열림',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, accessctlEventTypeRows);
        }

        if(this.state.accessctlSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.accessctlSeverityData.length > 0) {
            this.state.accessctlSeverityData.forEach((accessctlEvent) => {
              accessctlSeverityRows.push({
                "종류": accessctlEvent.event_type_severity === 0 ? 'Default' : (accessctlEvent.event_type_severity === 1 ? 'Minor' : (accessctlEvent.event_type_severity === 2 ? 'Major' :(accessctlEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": accessctlEvent.count
              })
            })
          } else {
            accessctlSeverityRows.push({
              "종류": 'Default',
              "발생 건수": 0,
            });
            accessctlSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            accessctlSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            accessctlSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, accessctlSeverityRows);
        }

        if(this.state.accessctlUnAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.accessctlUnAcknowledgedData.length > 0) {
            this.state.accessctlUnAcknowledgedData.forEach((acknowledgeItem) => {
              accessctlUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            accessctlUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            accessctlUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, accessctlUnAcknowledgedRows);
        }
      }
      // 비상벨 상세 보고서
      if(this.state.ebellEventTypeData !== '' || this.state.ebellSeverityData !== '' || this.state.ebellUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '비상벨';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.ebellEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.ebellEventTypeData.length > 0) {
            this.state.ebellEventTypeData.forEach((ebellEvent) => {
              ebellEventTypeRows.push({
                "종류": this.handleChangeEventType(ebellEvent.event_type),
                "발생 건수": ebellEvent.count
              })
            })
          } else {
            ebellEventTypeRows.push({
              "종류": '비상발생',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, ebellEventTypeRows);
        }

        if(this.state.ebellSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.ebellSeverityData.length > 0) {
            this.state.ebellSeverityData.forEach((ebellEvent) => {
              ebellSeverityRows.push({
                "종류": ebellEvent.event_type_severity === 0 ? 'Default' : (ebellEvent.event_type_severity === 1 ? 'Minor' : (ebellEvent.event_type_severity === 2 ? 'Major' :(ebellEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": ebellEvent.count
              })
            })
          } else {
            ebellSeverityRows.push({
              "종류": 'Default',
              "발생 건수": 0,
            });
            ebellSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            ebellSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            ebellSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, ebellSeverityRows);
        }

        if(this.state.ebellAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.ebellUnAcknowledgedData.length > 0) {
            this.state.ebellUnAcknowledgedData.forEach((acknowledgeItem) => {
              ebellUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            ebellUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            ebellUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, ebellUnAcknowledgedRows);
        }
      }
      // 가디언라이트 상세 보고서
      if(this.state.guardianliteEventTypeData !== '' || this.state.guardianliteSeverityData !== '' || this.state.guardianliteUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '가디언라이트';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.guardianliteEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
      
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.guardianliteEventTypeData.length > 0) {
            this.state.guardianliteEventTypeData.forEach((guardianliteEvent) => {
              guardianliteEventTypeRows.push({
                "종류": this.handleChangeEventType(guardianliteEvent.event_type),
                "발생 건수": guardianliteEvent.count
              })
            })
          } else {
            guardianliteEventTypeRows.push({
              "종류": '데이터 없음',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, guardianliteEventTypeRows);
        }

        if(this.state.guardianliteSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.guardianliteSeverityData.length > 0) {
            this.state.guardianliteSeverityData.forEach((guardianliteEvent) => {
              guardianliteSeverityRows.push({
                "종류": guardianliteEvent.event_type_severity === 0 ? 'Info' : (guardianliteEvent.event_type_severity === 1 ? 'Minor' : (guardianliteEvent.event_type_severity === 2 ? 'Major' :(guardianliteEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": guardianliteEvent.count
              })
            })
          } else {
            guardianliteSeverityRows.push({
              "종류": 'Info',
              "발생 건수": 0,
            });
            guardianliteSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            guardianliteSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            guardianliteSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, guardianliteSeverityRows);
        }

        if(this.state.guardianliteUnAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.guardianliteUnAcknowledgedData.length > 0) {
            this.state.guardianliteUnAcknowledgedData.forEach((acknowledgeItem) => {
              guardianliteUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            guardianliteUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            guardianliteUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, guardianliteUnAcknowledgedRows );
        }
      }

      // ANPR 상세 보고서
      if(this.state.anprEventTypeData !== '' || this.state.anprSeverityData !== '' || this.state.anprUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = 'ANPR';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.anprEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
      
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.anprEventTypeData.length > 0) {
            this.state.anprEventTypeData.forEach((anprEvent) => {
              anprEventTypeRows.push({
                "종류": this.handleChangeEventType(anprEvent.event_type),
                "발생 건수": anprEvent.count
              })
            })
          } else {
            anprEventTypeRows.push({
              "종류": '데이터 없음',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, anprEventTypeRows);
        }

        if(this.state.anprSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.anprSeverityData.length > 0) {
            this.state.anprSeverityData.forEach((anprEvent) => {
              anprSeverityRows.push({
                "종류": anprEvent.event_type_severity === 0 ? 'Info' : (anprEvent.event_type_severity === 1 ? 'Minor' : (anprEvent.event_type_severity === 2 ? 'Major' :(anprEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": anprEvent.count
              })
            })
          } else {
            anprSeverityRows.push({
              "종류": 'Info',
              "발생 건수": 0,
            });
            anprSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            anprSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            anprSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, anprSeverityRows);
        }

        if(this.state.anprUnAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.anprUnAcknowledgedData.length > 0) {
            this.state.anprUnAcknowledgedData.forEach((acknowledgeItem) => {
              anprUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            anprUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            anprUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, anprUnAcknowledgedRows );
        }
      }

      //BreathSensor 상세 보고서
      if(this.state.breathSensorEventTypeData !== '' || this.state.breathSensorSeverityData !== '' || this.state.breathSensorUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '바이탈센서';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.breathSensorEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류", "발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.breathSensorEventTypeData.length > 0) {
            this.state.breathSensorEventTypeData.forEach((breathSensorEvent) => {
              breathSensorEventTypeRows.push({
                "종류": this.handleChangeEventType(breathSensorEvent.event_type),
                "발생 건수": breathSensorEvent.count
              })
            })
          } else {
            breathSensorEventTypeRows.push({
              "종류": '호흡이상감지',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, breathSensorEventTypeRows);
        }

        if(this.state.breathSensorSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.breathSensorSeverityData.length > 0) {
            this.state.breathSensorSeverityData.forEach((breathSensorEvent) => {
              breathSensorSeverityRows.push({
                "종류": breathSensorEvent.event_type_severity === 0 ? 'Default' : (breathSensorEvent.event_type_severity === 1 ? 'Minor' : (breathSensorEvent.event_type_severity === 2 ? 'Major' :(breathSensorEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": breathSensorEvent.count
              })
            })
          } else {
            breathSensorSeverityRows.push({
              "종류": 'Default',
              "발생 건수": 0,
            });
            breathSensorSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            breathSensorSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            breathSensorSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, breathSensorSeverityRows);
        }

        if(this.state.breathSensorUnAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.breathSensorUnAcknowledgedData.length > 0) {
            this.state.breathSensorUnAcknowledgedData.forEach((acknowledgeItem) => {
              breathSensorUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            breathSensorUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            breathSensorUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, breathSensorUnAcknowledgedRows );
        }
      }
      // PIDS 상세 보고서
      if(this.state.pidsEventTypeData !== '' || this.state.pidsSeverityData !== '' || this.state.pidsUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = 'PIDS';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.pidsEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류", "발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.pidsEventTypeData.length > 0) {
            this.state.pidsEventTypeData.forEach((pidsEvent) => {
              pidsEventTypeRows.push({
                "종류": this.handleChangeEventType(pidsEvent.event_type),
                "발생 건수": pidsEvent.count
              })
            })
          } else {
            pidsEventTypeRows.push({
              "종류": 'PIDS 이벤트 감지',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, pidsEventTypeRows);
        }

        if(this.state.pidsSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.pidsSeverityData.length > 0) {
            this.state.pidsSeverityData.forEach((pidsEvent) => {
              pidsSeverityRows.push({
                "종류": pidsEvent.event_type_severity === 0 ? 'Default' : (pidsEvent.event_type_severity === 1 ? 'Minor' : (pidsEvent.event_type_severity === 2 ? 'Major' :(pidsEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": pidsEvent.count
              })
            })
          } else {
            pidsSeverityRows.push({
              "종류": 'Default',
              "발생 건수": 0,
            });
            pidsSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            pidsSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            pidsSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, pidsSeverityRows);
        }

        if(this.state.pidsUnAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.pidsUnAcknowledgedData.length > 0) {
            this.state.pidsUnAcknowledgedData.forEach((acknowledgeItem) => {
              pidsUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            pidsUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            pidsUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, pidsUnAcknowledgedRows);
        }
      }
      // N-Doctor 상세 보고서
      if(this.state.ndoctorEventTypeData !== '' || this.state.ndoctorSeverityData !== '' || this.state.ndoctorUnAcknowledgedData !== '') {
        rowIndex = worksheet.lastRow;
        worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = 'N-Doctor';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        
        if(this.state.ndoctorEventTypeData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류", "발생 건수"];
          worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.ndoctorEventTypeData.length > 0) {
            this.state.ndoctorEventTypeData.forEach((nDoctorEvent) => {
              ndoctorEventTypeRows.push({
                "종류": this.handleChangeEventType(nDoctorEvent.event_type),
                "발생 건수": nDoctorEvent.count
              })
            })
          } else {
            ndoctorEventTypeRows.push({
              "종류": '연결 끊어짐',
              "발생 건수": 0
            }, {
              "종류": '연결 복구',
              "발생 건수": 0
            })
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, ndoctorEventTypeRows);
        }

        if(this.state.ndoctorSeverityData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.ndoctorSeverityData.length > 0) {
            this.state.ndoctorSeverityData.forEach((nDoctorEvent) => {
              ndoctorSeverityRows.push({
                "종류": nDoctorEvent.event_type_severity === 0 ? 'Info' : (nDoctorEvent.event_type_severity === 1 ? 'Minor' : (nDoctorEvent.event_type_severity === 2 ? 'Major' :(nDoctorEvent.event_type_severity === 3 ? 'Critical' : ''))),
                "발생 건수": nDoctorEvent.count
              })
            })
          } else {
            ndoctorSeverityRows.push({
              "종류": 'Info',
              "발생 건수": 0,
            });
            ndoctorSeverityRows.push({
              "종류": 'Minor',
              "발생 건수": 0
            });
            ndoctorSeverityRows.push({
              "종류": 'Major',
              "발생 건수": 0
            });
            ndoctorSeverityRows.push({
              "종류": 'Critical',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, ndoctorSeverityRows);
        }

        if(this.state.ndoctorUnAcknowledgedData !== ''){
          rowIndex = worksheet.lastRow;
          worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
          worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
            name: 'Arial Black',
            family: 3,
            size: 12,
            underline: false,
            bold: true
          };
          worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
          worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
          if(this.state.ndoctorUnAcknowledgedData.length > 0) {
            this.state.ndoctorUnAcknowledgedData.forEach((acknowledgeItem) => {
              ndoctorUnAcknowledgedRows.push({
                "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
                "발생 건수": acknowledgeItem.count
              })
            })
          } else {
            ndoctorUnAcknowledgedRows.push({
              "종류": '확인',
              "발생 건수": 0,
            });
            ndoctorUnAcknowledgedRows.push({
              "종류": '미확인',
              "발생 건수": 0
            });
          }
          rowIndex = worksheet.lastRow;
          worksheet.insertRows(rowIndex._number+1, ndoctorUnAcknowledgedRows);
        }
    }
    if(this.state.parkingctlEventTypeData !== '' && this.state.parkingctlSeverityData !== '' && this.state.parkingctlUnAcknowledgedData !== '') {
      rowIndex = worksheet.lastRow;
      worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
      worksheet.getCell(`A'${rowIndex._number+2}'`).value = '주차관제시스템';
      worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
        name: 'Arial Black',
        family: 3,
        size: 13,
        underline: true,
        bold: true
      };
      
      if(this.state.parkingctlEventTypeData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
        worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
        worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.parkingctlEventTypeData.length > 0) {
          this.state.parkingctlEventTypeData.forEach((parkingctlEvent) => {
            parkingctlEventTypeRows.push({
              "종류": this.handleChangeEventType(parkingctlEvent.event_type),
              "발생 건수": parkingctlEvent.count
            })
          })
        } else {
          parkingctlEventTypeRows.push({
            "종류": '주차금지구역 주차',
            "발생 건수": 0
          },{
            "종류": '만차',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, parkingctlEventTypeRows);
      }

      if(this.state.parkingctlSeverityData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
        worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.parkingctlSeverityData.length > 0) {
          this.state.parkingctlSeverityData.forEach((parkingctlEvent) => {
            parkingctlSeverityRows.push({
              "종류": parkingctlEvent.event_type_severity === 0 ? 'Default' : (parkingctlEvent.event_type_severity === 1 ? 'Minor' : (parkingctlEvent.event_type_severity === 2 ? 'Major' :(parkingctlEvent.event_type_severity === 3 ? 'Critical' : ''))),
              "발생 건수": parkingctlEvent.count
            })
          })
        } else {
          parkingctlSeverityRows.push({
            "종류": 'Default',
            "발생 건수": 0,
          });
          parkingctlSeverityRows.push({
            "종류": 'Minor',
            "발생 건수": 0
          });
          parkingctlSeverityRows.push({
            "종류": 'Major',
            "발생 건수": 0
          });
          parkingctlSeverityRows.push({
            "종류": 'Critical',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, parkingctlSeverityRows);
      }

      if(this.state.parkingctlUnAcknowledgedData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
        worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.parkingctlUnAcknowledgedData.length > 0) {
          this.state.parkingctlUnAcknowledgedData.forEach((acknowledgeItem) => {
            parkingctlUnAcknowledgedRows.push({
              "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
              "발생 건수": acknowledgeItem.count
            })
          })
        } else {
          parkingctlUnAcknowledgedRows.push({
            "종류": '확인',
            "발생 건수": 0,
          });
          parkingctlUnAcknowledgedRows.push({
            "종류": '미확인',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, parkingctlUnAcknowledgedRows);
      }
    }

    //M-DET 항목별 보고서
    if(this.state.mdetEventTypeData !== '' && this.state.mdetSeverityData !== '' && this.state.mdetUnAcknowledgedData !== '') {
      rowIndex = worksheet.lastRow;
      worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
      worksheet.getCell(`A'${rowIndex._number+2}'`).value = 'M-DET';
      worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
        name: 'Arial Black',
        family: 3,
        size: 13,
        underline: true,
        bold: true
      };
      
      if(this.state.mdetEventTypeData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
        worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
        worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.mdetEventTypeData.length > 0) {
          this.state.mdetEventTypeData.forEach((mdetEvent) => {
            mdetEventTypeRows.push({
              "종류": this.handleChangeEventType(mdetEvent.event_type),
              "발생 건수": mdetEvent.count
            })
          })
        } else {
          mdetEventTypeRows.push({
            "종류": '금속 탐지',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, mdetEventTypeRows);
      }

      if(this.state.mdetSeverityData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
        worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.mdetSeverityData.length > 0) {
          this.state.mdetSeverityData.forEach((mdetEvent) => {
            mdetSeverityRows.push({
              "종류": mdetEvent.event_type_severity === 0 ? 'Default' : (mdetEvent.event_type_severity === 1 ? 'Minor' : (mdetEvent.event_type_severity === 2 ? 'Major' :(mdetEvent.event_type_severity === 3 ? 'Critical' : ''))),
              "발생 건수": mdetEvent.count
            })
          })
        } else {
          mdetSeverityRows.push({
            "종류": 'Default',
            "발생 건수": 0,
          });
          mdetSeverityRows.push({
            "종류": 'Minor',
            "발생 건수": 0
          });
          mdetSeverityRows.push({
            "종류": 'Major',
            "발생 건수": 0
          });
          mdetSeverityRows.push({
            "종류": 'Critical',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, mdetSeverityRows);
      }

      if(this.state.mdetUnAcknowledgedData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
        worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.mdetUnAcknowledgedData.length > 0) {
          this.state.mdetUnAcknowledgedData.forEach((acknowledgeItem) => {
            mdetUnAcknowledgedRows.push({
              "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
              "발생 건수": acknowledgeItem.count
            })
          })
        } else {
          mdetUnAcknowledgedRows.push({
            "종류": '확인',
            "발생 건수": 0,
          });
          mdetUnAcknowledgedRows.push({
            "종류": '미확인',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, mdetUnAcknowledgedRows);
      }
    }

    if(this.state.crowdDensityEventTypeData !== '' && this.state.crowdDensitySeverityData !== '' && this.state.crowdDensityUnAcknowledgedData !== '') {
      rowIndex = worksheet.lastRow;
      worksheet.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
      worksheet.getCell(`A'${rowIndex._number+2}'`).value = '군중 밀집도 감지';
      worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
        name: 'Arial Black',
        family: 3,
        size: 13,
        underline: true,
        bold: true
      };
      
      if(this.state.mdetEventTypeData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+1}'`).value = '이벤트 종류별 발생 건수';
        worksheet.getCell(`A'${rowIndex._number+1}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+2).values = ["이벤트 종류","발생 건수"];
        worksheet.getRow(rowIndex._number+2).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.mdetEventTypeData.length > 0) {
          this.state.mdetEventTypeData.forEach((mdetEvent) => {
            mdetEventTypeRows.push({
              "종류": this.handleChangeEventType(mdetEvent.event_type),
              "발생 건수": mdetEvent.count
            })
          })
        } else {
          mdetEventTypeRows.push({
            "종류": '군중 밀집',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, mdetEventTypeRows);
      }

      if(this.state.mdetSeverityData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 중요도별 발생 건수';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+3).values = ["중요도", "발생 건수"];
        worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.mdetSeverityData.length > 0) {
          this.state.mdetSeverityData.forEach((mdetEvent) => {
            mdetSeverityRows.push({
              "종류": mdetEvent.event_type_severity === 0 ? 'Default' : (mdetEvent.event_type_severity === 1 ? 'Minor' : (mdetEvent.event_type_severity === 2 ? 'Major' :(mdetEvent.event_type_severity === 3 ? 'Critical' : ''))),
              "발생 건수": mdetEvent.count
            })
          })
        } else {
          mdetSeverityRows.push({
            "종류": 'Default',
            "발생 건수": 0,
          });
          mdetSeverityRows.push({
            "종류": 'Minor',
            "발생 건수": 0
          });
          mdetSeverityRows.push({
            "종류": 'Major',
            "발생 건수": 0
          });
          mdetSeverityRows.push({
            "종류": 'Critical',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, mdetSeverityRows);
      }

      if(this.state.mdetUnAcknowledgedData !== ''){
        rowIndex = worksheet.lastRow;
        worksheet.getCell(`A'${rowIndex._number+2}'`).value = '이벤트 확인 여부';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 12,
          underline: false,
          bold: true
        };
        worksheet.getRow(rowIndex._number+3).values = ["종류", "건수"];
        worksheet.getRow(rowIndex._number+3).font = { name: 'Arial Black', family: 4, size: 11, underline: false, bold: true };
        if(this.state.mdetUnAcknowledgedData.length > 0) {
          this.state.mdetUnAcknowledgedData.forEach((acknowledgeItem) => {
            mdetUnAcknowledgedRows.push({
              "종류": acknowledgeItem.acknowledge === true ? '확인' : '미확인',
              "발생 건수": acknowledgeItem.count
            })
          })
        } else {
          mdetUnAcknowledgedRows.push({
            "종류": '확인',
            "발생 건수": 0,
          });
          mdetUnAcknowledgedRows.push({
            "종류": '미확인',
            "발생 건수": 0
          });
        }
        rowIndex = worksheet.lastRow;
        worksheet.insertRows(rowIndex._number+1, mdetUnAcknowledgedRows);
      }
    }
  }
    if(this.state.defaultDetailEventsData !== '') {
      const defaultDetailEventRows = [];
      const defaultDetailEvents = workbook.addWorksheet('기본 보고서 이벤트 전체목록');
      defaultDetailEvents.mergeCells('A1', 'C1');
      defaultDetailEvents.getCell(`A1`).value = '기본 보고서 이벤트 전체목록';
      defaultDetailEvents.getCell('A1').font = {
        name: 'Arial Black',
        family: 4,
        size: 18,
        underline: false,
        bold: true
      };

      defaultDetailEvents.mergeCells('D2', 'F2');
      defaultDetailEvents.getCell(`D2`).value = '조회 기간';
      defaultDetailEvents.getCell(`D3`).value = dateFns.format(this.state.startDate, "yyyy.MM.dd HH:mm:ss") + '~' + dateFns.format(this.state.endDate, "yyyy.MM.dd HH:mm:ss");

      defaultDetailEvents.getCell(`A3`).value = '이벤트 발생목록';
      defaultDetailEvents.getCell('A3').font = {
        name: 'Arial Black',
        family: 3,
        size: 16,
        underline: true,
        bold: true
      };

      defaultDetailEvents.columns = [
        { name: '번호', key: 'idx', width: 10 },
        { name: '이벤트명', key: 'name', width: 20 },
        { name: '설명', key: 'description', width: 30 },
        { name: '이벤트 종류', key: 'event_type_name', width: 20 },
        { name: '중요도', key: 'event_type_severity', width: 10 },
        { name: '발생시간', key: 'event_occurrence_time', width: 28},
        { name: '건물 이름', key: 'building_name', width: 10 },
        { name: '층 이름', key: 'floor_name', width: 10 },
        { name: '위치', key: 'location', width: 10 },
        { name: '확인 여부', key: 'acknowledge', width: 10},
        { name: '확인자', key: 'acknowledge_user', width: 10},
        { name: '확인시간', key: 'acknowledged_at', width: 28},
        { name: '서비스 종류', key: 'service_type', width: 10},
        { name: '장치 ID', key: 'device_id', width: 10},
        { name: '장치 IP주소', key: 'ipaddress', width: 12},
        { name: '장치 종류', key: 'device_type', width: 13},
        { name: '장치 이름', key: 'device_name', width: 20},
        { name: '연결 카메라', key: 'camera_id', width: 11},
        { name: '연결 상태', key: 'connection', width: 10}
      ];

      defaultDetailEvents.getRow(5).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
    
      rowIndex = defaultDetailEvents.lastRow;
      if(this.state.defaultDetailEventsData.length > 0) {
        this.state.defaultDetailEventsData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
          defaultDetailEventRows.push({
            "idx": detailEvent.idx,
            "name": detailEvent.name,
            "description": detailEvent.description,
            "event_type_name": detailEvent.event_type_name,
            "event_type_severity": detailEvent.event_type_severity,
            "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
            "building_name": detailEvent.building_name,
            "floor_name": detailEvent.floor_name,
            "location": detailEvent.location,
            "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
            "acknowledge_user": detailEvent.acknowledge_user,
            "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack') : '',
            "service_type": 
            detailEvent.service_type === 'mgist' ? 
            'MGIST':
            (detailEvent.service_type === 'ebell' ?
            '비상벨': 
            (detailEvent.service_type === 'accesscontrol' ? '출입통제' 
            : (detailEvent.service_type === 'ndoctor' ? 'N-Doctor'
            : (detailEvent.service_type === 'parkingcontrol' ? '주차관제시스템'
            : (detailEvent.service_type ===' crowddensity' ? '군중 밀집도 감지' : 'Observer'))))),
            "device_id": detailEvent.device_id,
            "ipaddress": detailEvent.ipaddress,
            "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
            "device_name": detailEvent.device_name,
            "camera_id": detailEvent.camera_id,
            "connection": detailEvent.connection === true ? '정상':'비정상'
          })
        })
      } else {
        defaultDetailEvents.mergeCells('A6', 'S6');
        const cell = defaultDetailEvents.getCell('A6');
        cell.value = '데이터 없음'
      }
      rowIndex = defaultDetailEvents.lastRow;
      defaultDetailEvents.insertRows(rowIndex._number+1, defaultDetailEventRows);
    }

    if(this.state.mgistDetailEventData !== '' || 
      this.state.ebellDetailEventData !== '' || 
      this.state.accessctlDetailEventData !== '' || 
      this.state.ndoctorDetailEventData !== '' || 
      this.state.breathSensorDetailEventData !== '' || 
      this.state.pidsDetailEventData !== '' ||
      this.state.parkingctlDetailEventData !== '' ||
      this.state.mdetDetailEventData !== '' ||
      this.state.crowdDensityDetailEventData !== '') {
      const detailEventsByService = workbook.addWorksheet('서비스별 상세 보고서 이벤트 전체 목록');
      detailEventsByService.mergeCells('A1', 'D1');
      detailEventsByService.getCell(`A1`).value = '서비스별 상세 보고서 이벤트 전체 목록';
      detailEventsByService.getCell('A1').font = {
        name: 'Arial Black',
        family: 4,
        size: 18,
        underline: false,
        bold: true
      };

      detailEventsByService.mergeCells('D2', 'F2');
      detailEventsByService.getCell(`D2`).value = '조회 기간';
      detailEventsByService.getCell(`D3`).value = dateFns.format(this.state.startDate, "yyyy.MM.dd HH:mm:ss") + '~' + dateFns.format(this.state.endDate, "yyyy.MM.dd HH:mm:ss");

      detailEventsByService.getCell(`A3`).value = '이벤트 발생목록';
      detailEventsByService.getCell('A3').font = {
        name: 'Arial Black',
        family: 3,
        size: 16,
        underline: true,
        bold: true
      };

      detailEventsByService.columns = [
        { name: '번호', key: 'idx', width: 10 },
        { name: '이벤트명', key: 'name', width: 20 },
        { name: '설명', key: 'description', width: 30 },
        { name: '이벤트 종류', key: 'event_type_name', width: 20 },
        { name: '중요도', key: 'event_type_severity', width: 10 },
        { name: '발생시간', key: 'event_occurrence_time', width: 28},
        { name: '건물 이름', key: 'building_name', width: 10 },
        { name: '층 이름', key: 'floor_name', width: 10 },
        { name: '위치', key: 'location', width: 10 },
        { name: '확인 여부', key: 'acknowledge', width: 10},
        { name: '확인자', key: 'acknowledge_user', width: 10},
        { name: '확인시간', key: 'acknowledged_at', width: 28},
        { name: '서비스 종류', key: 'service_type', width: 10},
        { name: '장치 ID', key: 'device_id', width: 10},
        { name: '장치 IP주소', key: 'ipaddress', width: 12},
        { name: '장치 종류', key: 'device_type', width: 13},
        { name: '장치 이름', key: 'device_name', width: 20},
        { name: '연결 카메라', key: 'camera_id', width: 11},
        { name: '연결 상태', key: 'connection', width: 10}
      ];
    
      rowIndex = detailEventsByService.lastRow;

      //MGIST 상세 보고서
      if(this.state.mgistDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = 'MGIST 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.mgistDetailEventData.length > 0){
          this.state.mgistDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'): '',
              "service_type": 'MGIST',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }

      //출입통제 상세 보고서
      if(this.state.accessctlDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = '출입통제 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.accessctlDetailEventData.length > 0){
          this.state.accessctlDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'):'',
              "service_type": '출입통제',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }
      // N-Doctor 상세 보고서
      if(this.state.ndoctorDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = 'N-Doctor 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.ndoctorDetailEventData.length > 0){
          this.state.ndoctorDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack') : '',
              "service_type": 'N-Doctor',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }
      // 비상벨 상세 보고서
      if(this.state.ebellDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = '비상벨 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.ebellDetailEventData.length > 0){
          this.state.ebellDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'): '',
              "service_type": '비상벨',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }
      // 바이탈센서 상세 보고서
      if(this.state.breathSensorDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = '바이탈센서 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.breathSensorDetailEventData.length > 0){
          this.state.breathSensorDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'):'',
              "service_type": '바이탈 센서',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }
      // PIDS 상세 보고서
      if(this.state.pidsDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = 'PIDS 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.pidsDetailEventData.length > 0){
          this.state.pidsDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'): '',
              "service_type": 'PIDS',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }

      // 주차관제시스템 상세 보고서
      if(this.state.parkingctlDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = '주차관제시스템 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.parkingctlDetailEventData.length > 0){
          this.state.parkingctlDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'): '',
              "service_type": 'parkingcontrol',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }
      // M-DET 상세 보고서
      if(this.state.mdetDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = 'M-DET 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.mdetDetailEventData.length > 0){
          this.state.mdetDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
                "event_type_name": detailEvent.event_type_name,
                "event_type_severity": detailEvent.event_type_severity,
                "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
                "building_name": detailEvent.building_name,
                "floor_name": detailEvent.floor_name,
                "location": detailEvent.location,
                "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
                "acknowledge_user": detailEvent.acknowledge_user,
                "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'): '',
                "service_type": 'mdet',
                "device_id": detailEvent.device_id,
                "ipaddress": detailEvent.ipaddress,
                "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
                "device_name": detailEvent.device_name,
                "camera_id": detailEvent.camera_id,
                "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }
      // 군중 밀집도 감지 상세 보고서
      if(this.state.crowdDensityDetailEventData !== '') {
        const detailEventRowsByService = [];
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.mergeCells(`A'${rowIndex._number+2}'`, `B'${rowIndex._number+2}'`);
        detailEventsByService.getCell(`A'${rowIndex._number+2}'`).value = '군중 밀집도 감지 이벤트 전체 목록';
        worksheet.getCell(`A'${rowIndex._number+2}'`).font = {
          name: 'Arial Black',
          family: 3,
          size: 13,
          underline: true,
          bold: true
        };
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.getRow(rowIndex._number+2).values = ["번호", "이벤트명", "설명", "이벤트 종류", "중요도", "발생시간", "건물 이름", "층 이름", "위치", "확인 여부", "확인자", "확인시간", "서비스 종류", "장치 ID", "장치 IP주소", "장치 종류", "장치 이름", "연결 카메라", "연결 상태"];
        if(this.state.crowdDensityDetailEventData.length > 0){
          this.state.crowdDensityDetailEventData.sort((a, b) => new Date(a.event_occurrence_time) - new Date(b.event_occurrence_time)).forEach((detailEvent) => {
            detailEventRowsByService.push({
              "idx": detailEvent.idx,
              "name": detailEvent.name,
              "description": detailEvent.description,
              "event_type_name": detailEvent.event_type_name,
              "event_type_severity": detailEvent.event_type_severity,
              "event_occurrence_time": this.handleChangeDateTimeFormat(detailEvent.event_occurrence_time, 'occurTime'),
              "building_name": detailEvent.building_name,
              "floor_name": detailEvent.floor_name,
              "location": detailEvent.location,
              "acknowledge": detailEvent.acknowledge === true ? '확인':'미확인',
              "acknowledge_user": detailEvent.acknowledge_user,
              "acknowledged_at": detailEvent.acknowledged_at ? this.handleChangeDateTimeFormat(detailEvent.acknowledged_at, 'ack'): '',
              "service_type": 'mdet',
              "device_id": detailEvent.device_id,
              "ipaddress": detailEvent.ipaddress,
              "device_type": this.handleChangeDeviceTypeName(detailEvent.device_type),
              "device_name": detailEvent.device_name,
              "camera_id": detailEvent.camera_id,
              "connection": detailEvent.connection === true ? '정상':'비정상'
            })
          })
        } else {
          rowIndex = detailEventsByService.lastRow;
          detailEventsByService.mergeCells(`A'${rowIndex._number+1}'`, `S'${rowIndex._number+1}'`);
          const cell = detailEventsByService.getCell(`A'${rowIndex._number+1}'`);
          cell.value = '데이터 없음'
        }
        rowIndex = detailEventsByService.lastRow;
        detailEventsByService.insertRows(rowIndex._number+1, detailEventRowsByService);
      }
    }

    const exportDate = dateFns.format(this.state.endDate, "yyyy.MM.dd-HH:mm:ss");
    // 다운로드
    const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], mimeType);
    saveAs(blob, `observerReport_${exportDate}.xlsx`);
  };

  componentDidMount(e) {
    this.handleDefaultReportForWeek(e)
	}

  componentDidUpdate(prevProps) {
    if(this.props.showModal && this.props.showModal !== prevProps.showModal) {
      this.handleDefaultReportForWeek()
    }
  }

  scrollToTopDefault = () => {
    const reportDefaultPage = document.getElementsByClassName('observer-report-page')
    reportDefaultPage && reportDefaultPage[0].scrollTo(0, 0);
  }

  scrollToTopDetail = () => {
    const reportPage = document.getElementsByClassName('observer-report-page')
    const reportDetailPart = document.querySelector('#observer-report-part-detail');
    if(reportDetailPart.children.length > 1){
      reportPage && reportPage[0].scrollTo(0, 754);
    }
  }

  render() {

    const service_types = [{ id: 0, label: '전체', value: 'all'}, ...this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true').map((serviceType) => this.handleMapServiceTypeOptions(serviceType.name))];

    return (
      <div>
        <Modal
          size="lg"
          show={this.props.showModal}
          onHide={(event) => { 
            this.props.handleReportModal(event)
            this.setState({ 
              checked: [],
              startDate: '',
              newStartDate: '',
              endDate: '',
              newEndDate: '',
              startTime: '',
              endTime: '',
              newStartTime: '',
              newEndTime: '',
              startDateTime: '',
              endDateTime: '',
            });
            this.handleDetailReportRefresh();
          }}
          aria-labelledby="example-modal-sizes-title-lg"
          contentClassName='report-modal'
        >
          <Modal.Header className='report'>
            <Modal.Title className='report-modal-title'>보고서</Modal.Title>
            <div className="modal-close" style={{left: '-31px'}}>
              <a href="!#" className="report-modal-closer" onClick={(event) => { 
                this.props.handleReportModal(event);
                this.setState({ 
                  checked: [],
                  startDate: '',
                  newStartDate: '',
                  endDate: '',
                  newEndDate: '',
                  startTime: '',
                  endTime: '',
                  newStartTime: '',
                  newEndTime: '',
                  startDateTime: '',
                  endDateTime: '',
                });
                this.handleDetailReportRefresh();
              }}></a>
            </div>
          </Modal.Header>
          <Modal.Body className='report-modal-body'>
            <div className="tab-custom-vertical">
              <Tab.Container id="left-tabs-report" defaultActiveKey="default">
                <Row className='report'>
                  <Col md={1} className="report-tabs">
                    <Nav variant="tabs" className="flex-column nav-tabs-vertical-custom report">
                      <Nav.Item>
                        <Nav.Link eventKey="default" className="d-flex align-items-center default-report" onSelect={this.scrollToTopDefault}>
                          <span className="menu-icon default-report">
                            <i className="mdi mdi-file-document-box default-report"></i>
                          </span>
                          기본 보고서
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="detail" className="d-flex align-items-center select-report" onSelect={this.scrollToTopDetail}>
                          <span className="menu-icon report-detail">
                            <img src={DetailReportIcon} width={40} height={40} className="DetailReportIcon"/>
                          </span>
                          <span className="report-detail-name">
                            서비스별<br/> 상세 보고서
                          </span>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col md={11} lg={11} className="mt-4 mt-md-0 report">
                    <Tab.Content className="tab-content-vertical-custom">
                      <Tab.Pane eventKey="default">
                      </Tab.Pane>
                      <div className='report form'>
                        <div className="card-body report datePicker">
                          <p className="card-description report datePicker">기간선택</p>
                          <div className="daterange-picker report-event">
                            <DatePicker
                              selected={this.state.startDate}
                              onChange={(date) => this.handleChangeStartDate(date)}
                              selectsStart
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              className="form-control report-datePicker"
                              dateFormat='yyyy/MM/dd'
                              locale={ko}
                            />
                            <DatePicker
                              selected={this.state.startTime}
                              onChange={(date) => this.handleChangeStartTime(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={1}
                              timeCaption="Time"
                              dateFormat="aa h:mm"
                              locale={ko}
                              className="form-control report-TimePicker"
                            />
                            <span className="range-seperator-datePicker"> to </span>
                            <DatePicker
                              selected={this.state.endDate}
                              onChange={(date) => this.handleChangeEndDate(date)}
                              selectsEnd
                              endDate={this.state.endDate}
                              minDate={this.state.startDate}
                              className="form-control report-datePicker"
                              dateFormat='yyyy/MM/dd'
                              locale={ko}
                            />
                            <DatePicker
                              selected={this.state.endTime}
                              onChange={(date) => this.handleChangeEndTime(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={1}
                              timeCaption="Time"
                              dateFormat="aa h:mm"
                              locale={ko}
                              className="form-control report-TimePicker"
                            />
                          </div>
                        </div>
                        <div className='report-event-button'>
                          <button className={styles.createReport_btn} onClick={(e) => {
                            this.handleReportEvents(e)
                            this.state.checked.length > 0 && this.handleAddDetailReportByService(e)
                            }
                          }>보고서 생성</button>
                        </div>
                        <div className="report-export">
                          <h5 className='report-export-label'>Export</h5>
                          <i className="mdi mdi-file-excel report" onClick={this.handleExportExcel}></i>
                        </div>
                        {this.state.showModal ?
                          <DateModalConfirm
                            showModal={this.state.showModal}
                            handleShowDateSelectAlert={this.handleShowDateSelectAlert}
                          />
                          :
                          ''
                        }
                      </div>
                      <Tab.Pane eventKey="detail">
                        <Form.Group className='report-service_type' >
                          {
                            service_types.map((serviceItem, index) => {
                              return (
                                <div className="form-check report service_type setting" key={index}>					
                                  <label className="form-check-label report service_type setting">
                                  <input
                                    key={index}
                                    type="checkbox"
                                    id={serviceItem.id}
                                    name={serviceItem.label}
                                    className="form-check-input report service_type setting" 
                                    // defaultChecked={false} 
                                    value={serviceItem.value}
                                    checked={this.state.checked.indexOf(serviceItem.value) === -1 ? false : true}
                                    onChange={() => this.handleToggle(serviceItem.value)}
                                  />
                                    <i className="input-helper"></i>
                                    {serviceItem.label}
                                  </label>
                                </div>
                            )
                            })
                          }
                        </Form.Group>
                      </Tab.Pane>
                      <div className='observer-report-page'>
                        <DefaultReport
                          serviceTypes={this.props.serviceTypes}
                          nDoctorData={this.state.nDoctorData}
                          serviceTypeData={this.state.serviceTypeData}
                          eventTypeData={this.state.eventTypeData}
                          severityData={this.state.severityData}
                          unAcknowledgedData={this.state.unAcknowledgedData}
                        />
                        <div id='observer-report-part-detail'>
                        {
                          (this.state.mgistEventTypeData !== '' || this.state.mgistSeverityData !== '' || this.state.mgistUnAcknowledgedData !== '') ? 
                            <DetailReport
                              service={'mgist'}
                              eventTypeData={this.state.mgistEventTypeData}
                              severityData={this.state.mgistSeverityData}
                              unAcknowledgedData={this.state.mgistUnAcknowledgedData}
                            />
                            :
                            ''
                        }
                        {
                          (this.state.guardianliteEventTypeData !== '' || this.state.guardianliteSeverityData !== '' || this.state.guardianliteUnAcknowledgedData !== '') ? 
                            <DetailReport
                              service={'guardianlite'}
                              eventTypeData={this.state.guardianliteEventTypeData}
                              severityData={this.state.guardianliteSeverityData}
                              unAcknowledgedData={this.state.guardianliteUnAcknowledgedData}
                            />
                            :
                            ''
                        }
                        {
                          (this.state.anprEventTypeData !== '' || this.state.anprSeverityData !== '' || this.state.anprUnAcknowledgedData !== '') ? 
                            <DetailReport
                              service={'anpr'}
                              eventTypeData={this.state.anprEventTypeData}
                              severityData={this.state.anprSeverityData}
                              unAcknowledgedData={this.state.anprUnAcknowledgedData}
                            />
                            :
                            ''
                        }
                        {
                          (this.state.accessctlEventTypeData !== '' || this.state.accessctlSeverityData !== '' || this.state.accessctlUnAcknowledgedData !== '') ? 
                            <DetailReport
                              service={'accesscontrol'}
                              eventTypeData={this.state.accessctlEventTypeData}
                              severityData={this.state.accessctlSeverityData}
                              unAcknowledgedData={this.state.accessctlUnAcknowledgedData}
                            />
                            :
                            ''
                        }
                        {
                          (this.state.ndoctorEventTypeData !== '' || this.state.ndoctorSeverityData !== '' || this.state.ndoctorUnAcknowledgedData !== '') ? 
                            <DetailReport
                              service={'ndoctor'}
                              eventTypeData={this.state.ndoctorEventTypeData}
                              severityData={this.state.ndoctorSeverityData}
                              unAcknowledgedData={this.state.ndoctorUnAcknowledgedData}
                            />
                            :
                            ''
                        }
                        {
                          (this.state.parkingctlEventTypeData !== '' || this.state.parkingctlSeverityData !== '' || this.state.parkingctlUnAcknowledgedData !== '') ? 
                            <DetailReport
                              service={'parkingcontrol'}
                              eventTypeData={this.state.parkingctlEventTypeData}
                              severityData={this.state.parkingctlSeverityData}
                              unAcknowledgedData={this.state.parkingctlUnAcknowledgedData}
                            />
                            :
                            ''
                        }
                        <div className='report-detail-few-service-group'>
                          {
                            (this.state.ebellEventTypeData !== '' || this.state.ebellSeverityData !== '' || this.state.ebellUnAcknowledgedData !== '') ? 
                              <DetailReport2
                                service={'ebell'}
                                eventTypeData={this.state.ebellEventTypeData}
                                severityData={this.state.ebellSeverityData}
                                unAcknowledgedData={this.state.ebellUnAcknowledgedData}
                              />
                              :
                              ''
                          }
                          {
                            (this.state.breathSensorEventTypeData !== '' || this.state.breathSensorSeverityData !== '' || this.state.breathSensorUnAcknowledgedData !== '') ?  
                              <DetailReport2
                                service={'vitalsensor'}
                                eventTypeData={this.state.breathSensorEventTypeData}
                                severityData={this.state.breathSensorSeverityData}
                                unAcknowledgedData={this.state.breathSensorUnAcknowledgedData}
                              />
                              :
                              ''
                          }
                          {
                            (this.state.pidsEventTypeData !== '' || this.state.pidsSeverityData !== '' || this.state.pidsUnAcknowledgedData !== '') ?  
                              <DetailReport2
                                service={'PIDS'}
                                eventTypeData={this.state.pidsEventTypeData}
                                severityData={this.state.pidsSeverityData}
                                unAcknowledgedData={this.state.pidsUnAcknowledgedData}
                              />
                              :
                              ''
                          }
                          {
                          (this.state.crowdDensityEventTypeData !== '' || this.state.crowdDensitySeverityData !== '' || this.state.crowdDensityUnAcknowledgedData !== '') ? 
                            <DetailReport2
                              service={'crowddensity'}
                              eventTypeData={this.state.crowdDensityEventTypeData}
                              severityData={this.state.crowdDensitySeverityData}
                              unAcknowledgedData={this.state.crowdDensityUnAcknowledgedData}
                            />
                            :
                            ''
                        }
                        {
                            (this.state.mdetEventTypeData !== '' || this.state.mdetSeverityData !== '' || this.state.mdetUnAcknowledgedData !== '') ?  
                              <DetailReport2
                                service={'mdet'}
                                eventTypeData={this.state.mdetEventTypeData}
                                severityData={this.state.mdetSeverityData}
                                unAcknowledgedData={this.state.mdetUnAcknowledgedData}
                              />
                              :
                              ''
                          }
                          </div>
                        </div>
                      </div>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default Report
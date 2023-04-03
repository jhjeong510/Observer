import axios from 'axios';
import React, { Component } from 'react';
import { format, addHours, addSeconds } from 'date-fns';
import { UserInfoContext } from '../context/context';
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import styles from './RightEventPannel.module.css'
import EventTypeIcons from './EventTypeIcons';
import { Bar } from 'react-chartjs-2';

class RightEventPannel extends Component {
  static contextType = UserInfoContext;
  state = {
    receiveEventInfo: '',
    getAllEventList: [],
    selectedEvent: [],
    eventHistory: [],
    selectedEventRow: [],
    imgTag: <img style={{ height: '200px', marginLeft: '132.5px' }} src={`${require('../../assets/images/loading.gif')}`} controls muted autoPlay playsInline />,
    urlFormatType: '',
    eventHistoryForChart: [],
    iconBoxColor: ['icon icon-box-secondary2', 'icon icon-box-success2','icon icon-box-warning2','icon icon-box-danger2'],
    startDate: '',
    threeMonth: '',
    twoMonth: '',
    aMonth: '',
    today: '',
    eventVideoReview: undefined
  };

  componentDidMount() {
    if (this.props.selectedEvent.timestamp) {
      this.getEventDbInfo(this.props.selectedEvent);
    }
    this.getDateFunc();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedEvent && this.props.selectedEvent.timestamp !== prevProps.selectedEvent.timestamp) {
      if (this.props.selectedEvent.timestamp !== 5000000000000) {
        this.getEventDbInfo(this.props.selectedEvent);
      } else if (this.props.selectedEvent.timestamp === 5000000000000) {
        this.setState({
          selectedEventRow: undefined
        })
      }
    }
  }

  getEventDbInfo = async (selectedEvent) => {
    try {
      const res = await axios.get('/api/observer/selectEvent', {
        params: {
          idx: selectedEvent.eventIdx,
          serviceType: selectedEvent.serviceType
        }
      })
      if (res.data && res.data.result && res.data.result.length > 0) {
        await this.setState({
          selectedEventRow: {...res.data.result[0], building_name: selectedEvent.buildingName, floor_name: selectedEvent.floorName, location: selectedEvent.location},
          urlFormatType: '',
        });
        // this.getDeviceEventHistory(this.state.selectedEventRow);
        // this.getEventHistoryChart(this.state.selectedEventRow);
          if (this.state.selectedEventRow.camera_id) {
            await this.setState({ imgTag: <img style={{ height: '200px', marginLeft: '132.5px' }} src={`${require('../../assets/images/loading.gif')}`} controls muted autoPlay playsInline />});
            this.eventVideoReview(this.state.selectedEventRow);
            console.log(this.state.selectedEventRow);
          }
      }
    } catch (err) {
      console.log(err)
    }
  }

  getDeviceEventHistory = async (event) => {
    try {
      const res = await axios.get('/api/observer/events', {
        params: {
          deviceId: event.id,
          serviceType: event.service_type,
          limit: 100
        }
      });
      // console.log(res)
      this.setState({
        eventHistory: res.data.result
      })
    } catch (err) {
      console.log('read event history err', err)
    }
  }

  getEventHistoryChart = async (event) => {
    const date = new Date();
    let notFnsStartDate = new Date(date.getFullYear(), date.getMonth() - 4, 1, 9);
    let notFnsToday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const startDate = dateFns.format(notFnsStartDate, "yyyy-MM-dd HH:mm", { locale: ko })
    const today = dateFns.format(notFnsToday, "yyyy-MM-dd HH:mm", { locale: ko })

    try {
      const res = await axios.get('/api/observer/getEventsForChart', {
        params: {
          startDate: startDate,
          endDate: today,
          deviceIp: event.ipaddress
        }
      })
      if (res) {
        this.setState({
          eventHistoryForChart: res.data.result
        })
        const eventHistoryForChart = JSON.parse(JSON.stringify(this.state.eventHistoryForChart));
        this.setState({ eventHistoryForChart: eventHistoryForChart });
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  eventVideoReview = async (event) => {
    const eventStartTimeSplit = event.event_occurrence_time.split(".");
    let eventStartTime = eventStartTimeSplit[0];
    const dateStr = eventStartTime.substring(0, 4) + '-' + eventStartTime.substring(4, 6) + '-' + eventStartTime.substring(6, 8) + ' ' + eventStartTime.substring(9, 11) + ':' + eventStartTime.substring(11, 13) + ':' + eventStartTime.substring(13, 15);
    const dateOjb2 = addHours(new Date(dateStr), -9);
    const dateOjb = addSeconds(new Date(dateOjb2), -10);
    eventStartTime = format(dateOjb, 'yyyyMMdd') + 'T' + format(dateOjb, 'HHmmss');
    const cameraId = event.camera_id
    const socket = this.props.socketClient;
    try {
      // const res = await axios.get('/api/observer/eventRecData', {
      //   params: {
      //     idx,
      //     serviceType,
      //     cameraId,
      //     eventStartTime
      //   }
      // });
      // if (res && res.data.result.formatMark === 'live') {
      //   this.setState({
      //     videoURL: res.data.result.pathUrl,
      //     urlFormatType: res.data.result.formatMark
      //   })
      // }
      // else if (res && res.data.result.formatMark === 'virtual') {
      //   this.setState({
      //     videoURL: res.data.result.pathUrl,
      //     urlFormatType: res.data.result.formatMark
      //   })
      // }
      // else if (res && res.data.result === 'loading') {
      //   this.setState({
      //     videoURL: "http://" + this.context.websocket_url + "/assets/images/loading.gif",
      //     urlFormatType: res.data.result
      //   })
      // }
      if(socket){
        if(this.state.eventVideoReview) {
          socket.emit('cameraArchive', {
            cameraId: this.state.eventVideoReview.camera_id,
            startDateTime: this.state.eventVideoReview.startDateTime,
            cmd: 'off'
          });
        }
        socket.emit('cameraArchive', { 
          cameraId: cameraId,
          startDateTime: eventStartTime,
          cmd: 'on' 
        });
        this.props.handleEventVideoReview(cameraId, eventStartTime);
        await this.setState({ 
          eventVideoReview: {
            camera_id: cameraId,
            startDateTime: eventStartTime,
        }});
        socket.on('cameraArchive', (received) => {
          if(this.state.eventVideoReview && (received.cameraId === this.state.eventVideoReview.camera_id && received.startDateTime === this.state.eventVideoReview.startDateTime)) {
            this.setState({ imgTag: <img style={{ width: "100%", height: "210px" }} src={`${'data:image/jpeg;base64,' + received.data}`} controls muted autoPlay playsInline />})
          }
        });
        // this.setState({ videoURL: `${require('../../assets/images/loading.gif')}`})
      }
    } catch (err) {
      console.log('rightbar get event video review err:', err);
    }
  }

  getDateFunc = () => {
    const date = new Date();

    let notFnsStartDate = new Date(date.getFullYear(), date.getMonth() - 4, 1, 9);
    let notFnsThreeMonth = new Date(date.getFullYear(), date.getMonth() - 3, 1, 9);
    let notFnsTwoMonth = new Date(date.getFullYear(), date.getMonth() - 2, 1, 9);
    let notFnsAMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1, 9);
    let notFnsToday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const startDate = dateFns.format(notFnsStartDate, "yyyy-MM", { locale: ko });
    const threeMonth = dateFns.format(notFnsThreeMonth, "yyyy-MM", { locale: ko });
    const twoMonth = dateFns.format(notFnsTwoMonth, "yyyy-MM", { locale: ko });
    const aMonth = dateFns.format(notFnsAMonth, "yyyy-MM", { locale: ko });
    const today = dateFns.format(notFnsToday, "yyyy-MM", { locale: ko });

    this.setState({
      startDate,
      threeMonth,
      twoMonth,
      aMonth,
      today
    });
  }

  

  render() {
    const imgTag = this.state.imgTag;
    const eventInfo = this.state.selectedEventRow;
    const urlFormatType = this.state.urlFormatType;
    const historyTitle = this.state.eventHistory;
    const eventTypeName = this.state.eventHistory.find((event) => event.idx === this.props.selectedEvent.eventIdx)
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Bar Chart - Stacked',
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            min: 0, // 스케일에 대한 최솟갓 설정, 0 부터 시작
            stepSize: 100, // 스케일에 대한 사용자 고정 정의 값
          }
        }]
      },
    };
    const dateArr = [this.state.startDate, this.state.threeMonth, this.state.twoMonth, this.state.aMonth, this.state.today];
    const testArr = [0, 0, 0, 0, 0];

    let labels = dateArr;
    if (this.state.eventHistoryForChart) {
      this.state.eventHistoryForChart.map((obj) => {
        if (obj.monthly) {
          for (let i = 0; i < dateArr.length; i++) {
            if (dateArr[i] === obj.monthly) {
              testArr[i] = obj.count;
            }
          }
        } else {
          return '발생한 이벤트가 없습니다.'
        }
      })
    }

    const data = {
      labels,
      datasets: [
        {
          label: '월별 이벤트 누적건수',
          data: testArr,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className={styles.rightDetailEvent}>
        {/* <div className="card-event">
          <div style={{ margin: "3px", color: "rgb(207 132 20)" }} className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row px-xl-4 rounded ">
            <div className="text-md-center text-xl-left">
              {this.state.selectedEventRow && this.state.selectedEventRow.length !== 0 && <div>
                <h4 className="mb-1 font-weight-bold mb-0"> {eventInfo.name}{eventInfo.ipaddress !== undefined ? "(IP: " + eventInfo.ipaddress + ")" : null} </h4>
                <p className="text-muted mb-0">발생시간 : {eventInfo.event_occurrence_time ? this.props.handleChangeDateTimeFormat(eventInfo.event_occurrence_time) : ''}</p>
                <p className="text-muted mb-0">발생장소 : {eventInfo.building_name ? (eventInfo.building_name + ' '):''}{eventInfo.floor_name ? (eventInfo.floor_name + ' '):''}{eventInfo.location ? eventInfo.location:''}</p>
                {historyTitle && historyTitle.length > 0 && <p className="text-muted mb-0"> 이벤트 명: {eventTypeName !== undefined && eventTypeName.event_type_name}</p>}
              </div>
              }

            </div>
          </div>
        </div> */}
        <div className='eventRecPlay'>
          {this.state.selectedEventRow && this.state.selectedEventRow.length !== 0 ? 
          <div>
            <h4 className={styles.detailEventTitle}>이벤트 영상<span className={styles.detailEventVideoClose} onClick={() => { this.props.handleDisconnectSocket(this.state.eventVideoReview.camera_id, this.state.eventVideoReview.startDateTime); this.props.initialSelectedEvent(); }}><i className="fa fa-window-close"></i></span></h4>
            {/* {this.state.selectedEventRow && this.state.urlFormatType === 'live' && <video style={{ width: "100%", height: "210px" }} src={videoURL} controls muted autoPlay playsInline />} */}
            {this.state.selectedEventRow && <div className={styles.detailEventVideoImg}>{imgTag}</div>}
            {/* {this.state.selectedEventRow && <video style={{ width: "100%", height: "210px" }} src={videoURL} controls muted autoPlay playsInline />} */}
            {/* {this.state.selectedEventRow &&  <img style={{ width: "100%", height: "210px", backgroundColor: 'gray' }} src={require('../../assets/images/loading.gif')} />} */}
            {/* {this.state.selectedEventRow && this.state.urlFormatType === '' && <img style={{ width: "100%", height: "210px", backgroundColor: 'gray' }} src={require('../../assets/images/loading.gif')} />} */}
            {this.state.selectedEventRow && this.state.selectedEventRow.device_type === 'guardianlite' && <img style={{ width: "100%", height: "210px" }} src={require('../../assets/images/guardian_rec.png')} />}
          </div>
          : 
          // <div style={{ marginTop: '300px' }}> <img src={require('../../assets/images/rec-not-exist.png')} /></div>
          ''
          }
        </div>
        <div>
          <div style={{ padding: "1rem", color: "rgb(207 132 20)" }} className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row px-xl-4 rounded ">
            <div className="text-md-center text-xl-left">
              {this.state.selectedEventRow && this.state.selectedEventRow.length !== 0 && <div>
                <h4 className="mb-1 font-weight-bold mb-0"> {eventInfo.name}{eventInfo.ipaddress !== undefined ? "(IP: " + eventInfo.ipaddress + ")" : null} </h4>
                <p className="text-muted mb-0">발생시간 : {eventInfo.event_occurrence_time ? this.props.handleChangeDateTimeFormat(eventInfo.event_occurrence_time) : ''}</p>
                <p className="text-muted mb-0">발생장소 : {eventInfo.building_name ? (eventInfo.building_name + ' '):''}{eventInfo.floor_name ? (eventInfo.floor_name + ' '):''}{eventInfo.location ? eventInfo.location:''}</p>
                {historyTitle && historyTitle.length > 0 && <p className="text-muted mb-0"> 이벤트 명: {eventTypeName !== undefined && eventTypeName.event_type_name}</p>}
              </div>
              }
            </div>
          </div>
        </div>
        {/* <div className="event-history">
          {this.state.selectedEventRow && this.state.selectedEventRow.length !== 0 ?
            <div>
              <h4 className="card2-title mb-2" >이벤트 히스토리</h4>
              <div className="event-history2">
                <div className="card table">
                  <div className="card-body2 table">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th width='50px' style={{ textAlign: 'center' }}></th>
                            <th width='200px' style={{ textAlign: 'center' }}>이벤트 명</th>
                            <th width='170px' style={{ textAlign: 'center' }}>발생시간</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.eventHistory && this.state.eventHistory.map((event, index) => {
                            return (
                              <tr key={index} onClick={() => this.props.eventSelected(event.idx, event.service_type)}>
                                <td style={{ padding: '5px' }}>
                                  <div className={this.state.iconBoxColor[event.event_type_severity]}>
                                    <EventTypeIcons
                                      event={event}
                                    />
                                  </div>
                                </td>
                                <td width='200px' style={{ textAlign: 'center', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}> {event.event_type_name}</td>
                                <td width='180px' style={{ padding: '3px', textAlign: 'center' }}> {event.event_occurrence_time ? this.props.handleChangeDateTimeFormat(event.event_occurrence_time) : ''}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div></div>
          }
        </div> */}
        {/* <div>
          {this.state.selectedEventRow && this.state.selectedEventRow.length !== 0 ? <div>
            <div className='event-graph'>
              <h4 className="card2-title mb-2" >이벤트 누적 데이터</h4>
              <Bar options={options} data={data} />
            </div>
          </div>
            :
            <div></div>
          }
        </div> */}
      </div>
    );
  }
}

export default RightEventPannel;

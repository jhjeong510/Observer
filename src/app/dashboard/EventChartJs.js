import React, { Component } from 'react';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import styles from './EventChartJs.module.css';
import emptyData from '../../assets/images/empty_data.png';
export class EventChartJs extends Component {

  render() {
    const data = {
      datasets: [{
        label: (this.props.serviceType !== undefined && !this.props.observer && !this.props.mgist) ? this.props.eventLabels : '',
        data: this.props.eventCount !== undefined && Array.isArray(this.props.eventCount) ? this.props.eventCount: (this.props.observerCount !== undefined && Array.isArray(this.props.observerCount)) && this.props.observerCount,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(249, 163, 158, 0.8)',
          'rgba(139, 219, 20, 0.8)',
          'rgba(122, 124, 124, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(249, 163, 158, 1)',
          'rgba(139, 219, 20, 1)',
          'rgba(122, 124, 124, 1)'
        ],
        borderWidth: 1,
        fill: false
      }],
      labels: (this.props.eventLabels !== undefined && Array.isArray(this.props.eventLabels)) ? this.props.eventLabels: (this.props.observerLabels !== undefined && Array.isArray(this.props.observerLabels) && this.props.observerLabels),
    }
    const options = {
      responsive: false,
      animation: {
        animateScale: true,
        animateRotate: true
      },
      scales: (this.props.serviceType !== undefined && this.props.serviceType === 'mgist') ? {
        yAxes: [{
            ticks: { 
                min: 0, // 스케일에 대한 최솟갓 설정, 0 부터 시작
                stepSize: 100, // 스케일에 대한 사용자 고정 정의 값
                
            }
        }],
        xAxes: [{
          gridLines: {
            color: "rgba(204, 204, 204, 0.1)"
          },
          ticks: {
            fontSize: 14,
          }
        }]
      } : '',
      tooltips: {
        titleFontSize: 15,
        bodyFontSize: 15,
        intersect: false
      },
      legend: {
        labels: {
          fontSize: (this.props.all || this.props.observer) ? 13 : 13,
          fontColor: '#616161',
        },
        display: false,
        position: 'top'
      }
    }

    const doughnutPieData = {
      datasets: [{
        data: this.props.eventCount !== undefined && Array.isArray(this.props.eventCount) ? this.props.eventCount: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.75)',
          'rgba(54, 162, 235, 0.75)',
          'rgba(255, 206, 86, 0.75)',
          'rgba(75, 192, 192, 0.75)',
          'rgba(153, 102, 255, 0.75)',
          'rgba(255, 159, 64, 0.75)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: (this.props.eventLabels !== undefined && Array.isArray(this.props.eventLabels)) ? this.props.eventLabels: []
  };

  const doughnutPieOptions = {
      responsive: false,
      animation: {
        animateScale: true,
        animateRotate: true
      },
      legend: {
        labels: {
          fontSize: 15,
          fontColor: '#c3c7d9',
          padding: 10,
        },
        display: true,
        position: 'top'
      },
      tooltips: {
        titleFontSize: 15,
        bodyFontSize: 15,
        intersect: false
      },
  };

    if(this.props.period === '오늘') {
      if(this.props.all) {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
          <>
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
          </>
          :
          <div className={styles.empty_img_div}>
            <img className={styles.empty_img} src={emptyData}  width="300"/>
          </div>
        )
      } else if(this.props.observer) {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
          <>
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
          </>
          :
          <div className={styles.empty_img_div}>
            <img className={styles.empty_img} src={emptyData}  width="300"/>
          </div>
        )
      } else if(this.props.serviceType === 'mgist') {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
            :
            <div className={styles.empty_img_div}>
              <img className={styles.empty_img} src={emptyData}  width="300"/>
            </div>
        )
      } else if(this.props.serviceType === 'ebell' || this.props.serviceType === 'guardianlite' || this.props.serviceType === 'anpr' || this.props.serviceType === 'accesscontrol' || this.props.serviceType === 'ndoctor' || this.props.serviceType === 'parkingcontrol') {
        return (
          doughnutPieData && doughnutPieData.datasets && doughnutPieData.datasets.length > 0 && doughnutPieData.datasets[0].data && doughnutPieData.datasets[0].data.some((event) => event > 0) ?
            <div>
              <Doughnut data={doughnutPieData} options={doughnutPieOptions} width={290} height={290} id={styles.chart_doughnut} />
              <div className={this.props.serviceType === 'parkingcontrol'?styles.description_parkingCtl:styles.description_service}>
                <div className='chart-description'>
                  <p className={styles.description_label}>전체</p>
                  <h5 className={styles.description_count}>{this.props.eventCount.reduce((prev, curr) => prev + curr, 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>
                </div>
                {this.props.eventLabels.map((label, index) => {
                  return(
                    <div key={index} className='chart-description'>
                      <p className={styles.description_label}>{label}</p>
                      <h5 className={styles.description_count}>{this.props.eventCount[index] ? this.props.eventCount[index].toLocaleString('ko-KR') : 0}</h5>
                    </div>
                  )
                })}
              </div>
            </div>
            :
            <div className={styles.empty_img_div}>
              <img className={styles.empty_img} src={emptyData}  width="300"/>
            </div>
        )
      } else {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
            <div>
              <Bar data={data} options={options} id={styles.chart} height={210} />
            </div>
              :
              <div className={styles.empty_img_div}>
                <img className={styles.empty_img} src={emptyData}  width="300"/>
              </div>
        )
      }
    } else if(this.props.period === '일주일') {
      if(this.props.all) {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
          <>
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
          </>
          :
          <div className={styles.empty_img_div}>
            <img className={styles.empty_img} src={emptyData}  width="300"/>
          </div>
        )
      } else if(this.props.observer) {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
          <>
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
          </>
          :
          <div className={styles.empty_img_div}>
            <img className={styles.empty_img} src={emptyData}  width="300"/>
          </div>
        )
      } else if(this.props.serviceType === 'mgist') {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
            :
            <div className={styles.empty_img_div}>
              <img className={styles.empty_img} src={emptyData}  width="300"/>
            </div>
        )
      } else if(this.props.serviceType === 'ebell' || this.props.serviceType === 'guardianlite' || this.props.serviceType === 'anpr' || this.props.serviceType === 'accesscontrol' || this.props.serviceType === 'ndoctor' || this.props.serviceType === 'parkingcontrol') {
        return (
          doughnutPieData && doughnutPieData.datasets && doughnutPieData.datasets.length > 0 && doughnutPieData.datasets[0].data && doughnutPieData.datasets[0].data.some((event) => event > 0) ?
            <div>
              <Doughnut data={doughnutPieData} options={doughnutPieOptions} height={290} id={styles.chart_doughnut} />
              <div className={this.props.serviceType === 'parkingcontrol'?styles.description_parkingCtl:styles.description_service}>
                <div className='chart-description'>
                  <p className={styles.description_label}>전체</p>
                  <h5 className={styles.description_count}>{this.props.eventCount.reduce((prev, curr) => prev + curr, 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>
                </div>
                {this.props.eventLabels.map((label, index) => {
                  return(
                    <div key={index} className='chart-description'>
                      <p className={styles.description_label}>{label}</p>
                      <h5 className={styles.description_count}>{this.props.eventCount[index] ? this.props.eventCount[index].toLocaleString('ko-KR') : 0}</h5>
                    </div>
                  )
                })}
              </div>
            </div>
            :
            <div className={styles.empty_img_div}>
              <img className={styles.empty_img} src={emptyData}  width="300"/>
            </div>
        )
      } else {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
            <div>
              <Bar data={data} options={options} height={210} />
            </div>
              :
              <div className={styles.empty_img_div}>
                <img className={styles.empty_img} src={emptyData}  width="300"/>
              </div>
        )
      }
    } else {
      if(this.props.all) {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
          <>
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
          </>
          :
          <div className={styles.empty_img_div}>
            <img className={styles.empty_img} src={emptyData}  width="300"/>
          </div>
        )
      } else if(this.props.observer) {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
          <>
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
          </>
          :
          <div className={styles.empty_img_div}>
            <img className={styles.empty_img} src={emptyData}  width="300"/>
          </div>
        )
      } else if(this.props.serviceType === 'mgist') {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
            <Bar data={data} options={options} width={416} height={306} id={styles.chart_bar}/>
            :
            <div className={styles.empty_img_div}>
              <img className={styles.empty_img} src={emptyData}  width="300"/>
            </div>
        )
      } else if(this.props.serviceType === 'ebell' || this.props.serviceType === 'guardianlite' || this.props.serviceType === 'anpr' || this.props.serviceType === 'accesscontrol' || this.props.serviceType === 'ndoctor' || this.props.serviceType === 'parkingcontrol') {
        return (
          doughnutPieData && doughnutPieData.datasets && doughnutPieData.datasets.length > 0 && doughnutPieData.datasets[0].data && doughnutPieData.datasets[0].data.some((event) => event > 0) ?
            <div>
              <Doughnut data={doughnutPieData} options={doughnutPieOptions} height={290} id={styles.chart_doughnut} />
              <div className={this.props.serviceType === 'parkingcontrol'?styles.description_parkingCtl:styles.description_service}>
                <div className='chart-description'>
                  <p className={styles.description_label}>전체</p>
                  <h5 className={styles.description_count}>{this.props.eventCount.reduce((prev, curr) => prev + curr, 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>
                </div>
                {this.props.eventLabels.map((label, index) => {
                  return(
                    <div key={index} className='chart-description'>
                      <p className={styles.description_label}>{label}</p>
                      <h5 className={styles.description_count}>{this.props.eventCount[index] ? this.props.eventCount[index].toLocaleString('ko-KR') : 0}</h5>
                    </div>
                  )
                })}
              </div>
            </div>
            :
            <div className={styles.empty_img_div}>
              <img className={styles.empty_img} src={emptyData}  width="300"/>
            </div>
        )
      } else {
        return (
          data && data.datasets && data.datasets.length > 0 && data.datasets[0].data && data.datasets[0].data.some((event) => event > 0) ?
            <div>
              <Bar data={data} options={options} height={210} />
            </div>
              :
              <div className={styles.empty_img_div}>
                <img className={styles.empty_img} src={emptyData}  width="300"/>
              </div>
        )
      }
    }
  }
}

export default EventChartJs

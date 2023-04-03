import React, { Component } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import styles from './DefaultReport.module.css';

class DefaultReport extends Component {

	state = {
		eventTypeCardClassName: '',
		severityCardClassName: '',
		unAckCardClassName: ''
	}

	handleChangeServiceTypeLabel = (label) => {
		switch(label){
			case 'mgist':
				return 'MGIST'
			case 'ebell':
				return '비상벨'
			case 'accesscontrol':
				return '출입통제'
			case 'vitalsensor':
				return '바이탈센서'
			case 'zone':
				return 'PIDS'
			case 'ndoctor':
				return 'N-Doctor'
			case 'anpr':
				return 'ANPR'
			case 'parkingcontrol':
				return '주차관제시스템'
			case 'mdet':
				return 'M-DET'
			case 'crowddensity':
				return '군중 밀집도 감지'
			default:
				return label
		}
	}

	handleChangeEventTypeLabel = (label) => {
		switch(label){
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

	handleUnAckRate = (unAcknowledgedData) => {
		const totalCount = unAcknowledgedData.length > 1 ? unAcknowledgedData.reduce((prev, curr) => parseInt(prev.count) + parseInt(curr.count)) : unAcknowledgedData[0].count;
		const unAckCount = unAcknowledgedData.filter((item) => item.acknowledge === false)[0].count;
		return parseInt((unAckCount/totalCount)*100)
	}

	render () {
		const	serviceTypeData = {
				labels: this.props.serviceTypeData ? this.props.serviceTypeData.map(data => this.handleChangeServiceTypeLabel((data.service_type))) : [],
				datasets: [{
					data: this.props.serviceTypeData ? this.props.serviceTypeData.map(data => data.sum) : [],
					backgroundColor: [
						'rgba(255, 206, 86, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(75, 192, 192, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(255, 159, 64, 0.6)',
						'rgba(175, 59, 124, 0.6)',
						'rgba(4, 159, 24, 0.6)',
					],
					borderColor: [
						'rgba(255, 206, 86, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 99, 132,1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(175, 59, 124, 1)',
						'rgba(4, 159, 24, 1)',
					],
					borderWidth: 1,
					fill: false
				}]
		};
		
		const serviceTypeOptions = {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					},
					gridLines: {
						color: "rgba(204, 204, 204,0.1)"
					},
					ticks: {
						fontSize: 13,
					}
				}],
				xAxes: [{
					gridLines: {
						color: "rgba(204, 204, 204,0.1)"
					},
					ticks: {
						fontSize: 13,
						color: "rgba(204, 204, 204,0.9)"
					}
				}]
			},
			legend: {
				display: false,
				labels: {
					fontSize: 13
				}
			},
			elements: {
				point: {
					radius: 0
				}
			},
			tooltips: {
				titleFontSize: 13,
				bodyFontSize: 13,
				intersect: false
			}
		}

		const	eventTypeData = {
			labels: this.props.eventTypeData ? this.props.eventTypeData.map(data => this.handleChangeEventTypeLabel(data.event_type)) : [],
			datasets: [{
				data: this.props.eventTypeData ? this.props.eventTypeData.map(data => data.count) : [],
				backgroundColor: [
					'rgba(54, 162, 235, 0.6)',
					'rgba(255, 206, 86, 0.6)',
					'rgba(153, 102, 255, 0.6)',
					'rgba(255, 159, 64, 0.6)',
					'rgba(75, 192, 192, 0.6)',
					'rgba(255, 99, 132, 0.6)',
					'rgba(175, 89, 134, 0.6)',
					'rgba(215, 199, 34, 0.6)',
					'rgba(39, 149, 75, 0.6)',
					'rgba(8, 41, 115, 0.6)',
					'rgba(236, 41, 75, 0.6)',
					'rgba(136, 141, 92, 0.6)',
					'rgba(76, 241, 192, 0.6)',
					'rgba(16, 211, 92, 0.6)',
					'rgba(46, 11, 192, 0.6)',
					'rgba(196, 11, 192, 0.6)',
					'rgba(86, 111, 42, 0.6)',
					'rgba(26, 251, 72, 0.6)',
				],
				borderColor: [
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(255,99,132,1)',
					'rgba(175, 89, 134, 1)',
					'rgba(215, 199, 34, 1)',
					'rgba(39, 149, 75, 1)',
					'rgba(8, 41, 115, 1)',
					'rgba(236, 41, 75, 1)',
					'rgba(136, 141, 92, 1)',
					'rgba(16, 211, 92, 1)',
					'rgba(46, 11, 192, 1)',
					'rgba(196, 11, 192, 1)',
					'rgba(86, 111, 42, 1)',
					'rgba(26, 251, 72, 1)',
				],
				borderWidth: 1,
				fill: false
			}]
		};

		const eventTypeOptions = {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					},
					gridLines: {
						color: "rgba(204, 204, 204,0.1)"
					},
					ticks: {
						fontSize: 13,
					}
				}],
				xAxes: [{
					gridLines: {
						color: "rgba(204, 204, 204,0.1)"
					},
					ticks: {
						fontSize: 13,
						color: "rgba(204, 204, 204,0.9)"
					}
				}]
			},
			legend: {
				display: false,
				labels: {
					fontSize: 13
				}
			},
			elements: {
				point: {
					radius: 0
				}
			},
			tooltips: {
				titleFontSize: 13,
				bodyFontSize: 13,
				intersect: false
			},
		}
		
		const	nDoctorData = {
				datasets: [{
					data: this.props.nDoctorData ? this.props.nDoctorData.map(data => data.count) : [],
					backgroundColor: [
						'rgba(255, 99, 132, 0.8)',
						'rgba(54, 162, 235, 0.8)',
						'rgba(255, 206, 86, 0.8)',
						'rgba(75, 192, 192, 0.8)',
						'rgba(153, 102, 255, 0.8)',
						'rgba(255, 159, 64, 0.8)'
					],
					borderColor: [
						'rgba(255,99,132,1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
				}],
				// These labels appear in the legend and in the tooltips when hovering different arcs
				labels: this.props.nDoctorData ? this.props.nDoctorData.map(data => data.event_type===33?'연결 끊어짐':'연결 복구') : [],
		};
		
		const nDoctorOptions = {
				responsive: true,
				animation: {
					animateScale: true,
					animateRotate: true
				},
				tooltips: {
					titleFontSize: 15,
					bodyFontSize: 15,
					intersect: false
				},
				legend: {
					display: true,
					labels: {
						fontSize: 15
					}
				},
		};

		const	severityData = {
			datasets: [{
				data: this.props.severityData ? this.props.severityData.sort((a, b) => a.event_type_severity - b.event_type_severity).map(data => data.count) : [],
				backgroundColor: this.props.severityData.length === 4 ?
				[
					'rgba(54, 162, 235, 0.8)',
					'rgba(29, 219, 22, 0.8)',
					'rgba(255, 206, 86, 0.8)',
					'rgba(255, 99, 132, 0.8)',
				]
				:
				(
					this.props.severityData.length === 3 ?
						(
							this.props.severityData.every((severityItem) => severityItem.event_type_severity !== 3) ?
								[
									'rgba(54, 162, 235, 0.8)',
									'rgba(29, 219, 22, 0.8)',
									'rgba(255, 206, 86, 0.8)',
								]
								:
								(
									this.props.severityData.every((severityItem) => severityItem.event_type_severity !== 2) ?
										[
											'rgba(54, 162, 235, 0.8)',
											'rgba(29, 219, 22, 0.8)',
											'rgba(255, 99, 132, 0.8)',
										]
									:
									(
										this.props.severityData.every((severityItem) => severityItem.event_type_severity !== 1) ?
											[
												'rgba(54, 162, 235, 0.8)',
												'rgba(255, 206, 86, 0.8)',
												'rgba(255, 99, 132, 0.8)',
											]
										:
										(
											[
												'rgba(29, 219, 22, 0.8)',
												'rgba(255, 206, 86, 0.8)',
												'rgba(255, 99, 132, 0.8)',
											]
										)
									)
								)
						)
						:
						this.props.severityData.length === 2?
							(
								this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1)?
									[
										'rgba(54, 162, 235, 0.8)',
										'rgba(29, 219, 22, 0.8)',
									]
									:
									(
										this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 2)?
											[
												'rgba(54, 162, 235, 0.8)',
												'rgba(255, 206, 86, 0.8)',
											]
											:
											(
												this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 3)?
													[
														'rgba(54, 162, 235, 0.8)',
														'rgba(255, 99, 132, 0.8)',
													]
													:
													(
														this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 2)?
															[
																'rgba(29, 219, 22, 0.8)',
																'rgba(255, 206, 86, 0.8)',
															]
															:
															(
																this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 3)?
																	[
																		'rgba(29, 219, 22, 0.8)',
																		'rgba(255, 99, 132, 0.8)',
																	]
																	:
																	[
																		'rgba(255, 206, 86, 0.8)',
																		'rgba(255, 99, 132, 0.8)',
																	]
															)
													)
											)
									)	
							)
							:
							this.props.severityData.length === 1 ?
								(
									this.props.severityData.find((severityItem) => severityItem.event_type_severity === 0) ?
										[
											'rgba(54, 162, 235, 0.8)',
										]
										:
										(
											this.props.severityData.find((severityItem) => severityItem.event_type_severity === 1) ?
												[
													'rgba(29, 219, 22, 0.8)',
												]
											:
											(
												this.props.severityData.find((severityItem) => severityItem.event_type_severity === 2) ?
													[
														'rgba(255, 206, 86, 0.8)',
													]
													:
													[
														'rgba(255, 99, 132, 0.8)',
													]
											)
										)
									)
									:
									[]
				)
			,
			borderColor: this.props.severityData.length === 4 ?
				[
					'rgba(54, 162, 235, 1)',
					'rgba(29, 219, 22, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(255, 99, 132, 1)',
				]
				:
				(
					this.props.severityData.length === 3 ?
						(
							this.props.severityData.every((severityItem) => severityItem.event_type_severity !== 3) ?
								[
									'rgba(54, 162, 235, 1)',
									'rgba(29, 219, 22, 1)',
									'rgba(255, 206, 86, 1)',
								]
								:
								(
									this.props.severityData.every((severityItem) => severityItem.event_type_severity !== 2) ?
										[
											'rgba(54, 162, 235, 1)',
											'rgba(29, 219, 22, 1)',
											'rgba(255, 99, 132, 1)',
										]
										:
										(
											this.props.severityData.every((severityItem) => severityItem.event_type_severity !== 1) ?
												[
													'rgba(54, 162, 235, 1)',
													'rgba(255, 206, 86, 1)',
													'rgba(255, 99, 132, 1)',
												]
												:
												(
													[
													'rgba(29, 219, 22, 1)',
													'rgba(255, 206, 86, 1)',
													'rgba(255, 99, 132, 1)',
													]
												)
										)
								)
						)
						:
						this.props.severityData.length === 2?
							(
								this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1)?
									[
										'rgba(54, 162, 235, 1)',
										'rgba(29, 219, 22, 1)',
									]
									:
									(
										this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 2)?
											[
												'rgba(54, 162, 235, 1)',
												'rgba(255, 206, 86, 1)',
											]
											:
											(
												this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 3)?
													[
														'rgba(54, 162, 235,	1)',
														'rgba(255, 99, 132, 1)',
													]
													:
													(
														this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 2)?
															[
																'rgba(29, 219, 22, 1)',
																'rgba(255, 206, 86, 1)',
															]
															:
															(
																this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1) && this.props.severityData.some((severityItem) => severityItem.event_type_severity === 3)?
																	[
																		'rgba(29, 219, 22, 1)',
																		'rgba(255, 99, 132, 1)',
																	]
																	:
																	[
																		'rgba(255, 206, 86, 1)',
																		'rgba(255, 99, 132, 1)',
																	]
															)
													)
											)
									)	
							)
							:
								this.props.severityData.length === 1 ?
									(
										this.props.severityData.find((severityItem) => severityItem.event_type_severity === 0) ?
											[
												'rgba(54, 162, 235, 1)',
											]
											:
											(
												this.props.severityData.find((severityItem) => severityItem.event_type_severity === 1) ?
													[
														'rgba(29, 219, 22, 1)',
													]
													:
													(
														this.props.severityData.find((severityItem) => severityItem.event_type_severity === 2) ?
															[
																'rgba(255, 206, 86, 1)',
															]
															:
															[
																'rgba(255, 99, 132,	1)',
															]
													)
											)
									)
									:
									[]
				),
			}],
	
			// These labels appear in the legend and in the tooltips when hovering different arcs
			labels: this.props.severityData ? this.props.severityData.map(data => data.event_type_severity === 0 ? 'Info':(data.event_type_severity === 1 ? 'Minor': (data.event_type_severity === 2 ? 'Major' : 'Critical'))) : []
		};
		
		const severityOptions = {
				responsive: true,
				animation: {
					animateScale: true,
					animateRotate: true
				},
				tooltips: {
					titleFontSize: 15,
					bodyFontSize: this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? 15:20,
					intersect: false
				},
				legend: {
					display: true,
					labels: this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? {
						fontSize: 15,
						boxWidth: 25
					}: {
						fontSize: 20,
						boxWidth: 35
					},
					align: 'end'
				},
				layout: {
					top: 0,
					bottom: 0,
					right: 50,
					left: 0
				}
		};

		const	unAcknowledgedData = {
			datasets: [{
				data: this.props.unAcknowledgedData ? this.props.unAcknowledgedData.map(data => data.count) : [],
				backgroundColor: [
					'rgba(255, 99, 132, 0.8)',
					'rgba(54, 162, 235, 0.8)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)'
				],
			}],
	
			// These labels appear in the legend and in the tooltips when hovering different arcs
			labels: this.props.unAcknowledgedData ? this.props.unAcknowledgedData.map(data => data.acknowledge ? '확인':'미확인') : []
		};
		
		const unAcknowledgeOptions = {
				responsive: true,
				animation: {
					animateScale: true,
					animateRotate: true
				},
				tooltips: {
					titleFontSize: 15,
					bodyFontSize: 20,
					intersect: false
				},
				legend: {
					display: true,
					labels: {
						fontSize: this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? 15:25,
						boxWidth: 25
					}
				},
		};

		return (
			<div className="row report-default">
				{
					this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ?
						<div className="col-md-6 grid-margin stretch-card report-default n-doctor">
							<div className="card report-default n-doctor">
								<div className="card-body report-default n-doctor">
									<h4 className="card-title report-default n-doctor">N-Doctor 장애 이벤트 발생 건수</h4>
									<div className='report-default-card-chart n-doctor'>
										{this.props.nDoctorData.length > 0 ? <Doughnut data={nDoctorData} options={nDoctorOptions} id='report-default-ndoctor'/> : <h5 className='empty-chart-data n-doctor'>데이터 없음</h5>}
									</div>
								</div>
							</div>
						</div>
						:
						''
				}
				<div className="col-md-6 grid-margin stretch-card report-default service_type">
					<div className="card report-default service_type">
						<div className="card-body report-default service_type">
							<h4 className="card-title report-default service_type">서비스별 이벤트 발생 건수</h4>
							<div className='report-default-card-chart service_type'>
								{this.props.serviceTypeData.length > 0 ? <Bar data={serviceTypeData} options={serviceTypeOptions} id='default-report-service_type'/>: <h5 className='empty-chart-data'>데이터 없음</h5>}
							</div>
						</div>
					</div>
				</div>
				<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? "col-md-5 grid-margin stretch-card report-default event_type":"col-md-6 grid-margin stretch-card report-default event_type"}>
					<div className="card report-default event_type">
						<div className="card-body report-default event_type">
							<h4 className="card-title report-default event_type">이벤트 종류별 발생 건수</h4>
							<div className='report-default-card-chart event_type'>
								{this.props.eventTypeData.length > 0 ? <Bar data={eventTypeData} options={eventTypeOptions} id='default-report-event_type'/>: <h5 className='empty-chart-data'>데이터 없음</h5>}
							</div>
						</div>
					</div>
				</div>
				<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? "col-md-3 grid-margin stretch-card report-default severity":"col-md-6 grid-margin stretch-card report-default severity"}>
					<div className="card report-default severity">
						<div className="card-body report-default severity">
							<h4 className="card-title report-default severity">이벤트 중요도별 발생 건수</h4>
								{this.props.severityData.length > 0 ?
									<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? "report-default-card-chart2 severity":"report-default-card-chart severity"}>
										<Pie data={severityData} options={severityOptions} id={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ?'default-report-severity2':'default-report-severity'}/>
										<div className='report-default-chart-description-severity'>
											{
												this.props.severityData.length === 4 ?
													<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? 'severity_description2_default_report':'severity_description_default_report'}>
														{
															this.props.severityData.sort((a, b) => a.event_type_severity - b.event_type_severity).map((severityItem) => {
																return (
																	<span className={severityItem.event_type_severity === 0 ? 'report-default-chart-description-severity-info':(severityItem.event_type_severity === 1 ? 'report-default-chart-description-severity-minor':(severityItem.event_type_severity === 2 ? 'report-default-chart-description-severity-major':(severityItem.event_type_severity === 3 ? 'report-default-chart-description-severity-critical':'')))}>{severityItem.event_type_severity === 0 ? 'Info : ':(severityItem.event_type_severity === 1 ? 'Minor : ':(severityItem.event_type_severity === 2 ? 'Major : ':(severityItem.event_type_severity === 3 ? 'Critical : ':''))) }{severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건'}</span>
																)
															})
														}
													</div>
													:
													this.props.severityData.length > 1 ?
													<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? 'severity_description2_default_report':'severity_description_default_report'}>
															<span className='report-default-chart-description-severity-info'>Info : {this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 0).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 0).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</span>
															<span className='report-default-chart-description-severity-minor'>Minor : {this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 1).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 1).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</span>
															<span className='report-default-chart-description-severity-major'>Major : {this.props.severityData.some((severityItem) => severityItem.event_type_severity === 2)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 2).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 2).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</span>
															<span className='report-default-chart-description-severity-critical'>Critical : {this.props.severityData.some((severityItem) => severityItem.event_type_severity === 3)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 3).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 3).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</span>
														</div>
														:
														this.props.severityData.sort((a, b) => a.event_type_severity - b.event_type_severity).map((severityItem) => {
															return(
																<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? 'severity_description2_default_report':'severity_description_default_report'}>
																	<span className='report-default-chart-description-severity-info'>Info : {severityItem.event_type_severity === 0? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</span>
																	<span className='report-default-chart-description-severity-minor'>Minor : {severityItem.event_type_severity === 1? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</span>
																	<span className='report-default-chart-description-severity-major'>Major : {severityItem.event_type_severity === 2? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</span>
																	<span className='report-default-chart-description-severity-critical'>Critical : {severityItem.event_type_severity === 3? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</span>
																</div>
															)})
											}
										</div>
									</div>
										: 
									<h5 className='empty-chart-data'>데이터 없음</h5>
								}
						</div>
					</div>
				</div>
				<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? "col-md-2 grid-margin stretch-card report-default unAck": "col-md-6 grid-margin stretch-card report-default unAck"}>
					<div className="card report-default unAck">
						<div className="card-body report-default unAck">
							<h4 className="card-title report-default unAck">이벤트 알림 미확인 건수</h4>
							<div className='report-default-card-chart unAck'>
								{this.props.unAcknowledgedData.length > 0 ? <Doughnut data={unAcknowledgedData} options={unAcknowledgeOptions} id={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? 'report-default-unAcknowledge2': 'report-default-unAcknowledge'}/> : <h5 className='empty-chart-data'>데이터 없음</h5>}
								<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? 'unAckRate default2':'unAckRate default'}>
									{this.props.unAcknowledgedData.length > 0 ? this.handleUnAckRate(this.props.unAcknowledgedData) + '%' : ''}
								</div>
								{this.props.unAcknowledgedData && this.props.unAcknowledgedData.map((data, index) => {
									if(data.acknowledge === false){
										return (
											<div className={this.props.serviceTypes.filter((serviceType) => serviceType.setting_value === 'true' && serviceType.name === 'ndoctor').length > 0 ? styles.unAck_value_ndoctor:styles.unAck_value} key={index}>
												<label className={styles.unAck_label}>미확인</label>
												<h3 className="text-success ml-2 mb-0 font-weight-large report-default unAck">{data.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}건</h3>
											</div>
										)
									}
								})}
							</div>
						</div>
					</div>
				</div>				
			</div>
		);
	}
}


export default DefaultReport;
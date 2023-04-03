
import React, { Component } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import styles from './DetailReport2.module.css';

class DetailReport2 extends Component {

	handleChangeServiceName = (serviceName) => {
		switch(serviceName){
			case 'mgist':
				return 'MGIST'
			case 'ebell':
				return '비상벨'
			case 'accesscontrol':
				return '출입통제'
			case 'vitalsensor':
				return '바이탈센서'
			case 'mdet':
				return 'M-DET'
			case 'crowddensity':
				return '군중 밀집도 감지'
			default:
				return serviceName;
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
			case 37:
				return '금속 탐지'
			case 38:
				return '군중 밀집'
		}
	}

	handleUnAckRate = (unAcknowledgedData) => {
		const totalCount = unAcknowledgedData.length > 1 ? unAcknowledgedData.reduce((prev, curr) => parseInt(prev.count) + parseInt(curr.count)) : (unAcknowledgedData[0] ? unAcknowledgedData[0].count : '');
		const unAckCount = unAcknowledgedData.length > 1 ? unAcknowledgedData.filter((item) => item.acknowledge === false)[0].count:(unAcknowledgedData[0].acknowledge === false ? unAcknowledgedData[0].count : 0);
		return parseInt((unAckCount/totalCount)*100)
	}

	render () {

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
		labels: this.props.severityData.length > 0 ? this.props.severityData.map(data => data.event_type_severity === 0 ? 'Default':(data.event_type_severity === 1 ? 'Minor': (data.event_type_severity === 2 ? 'Major' : 'Critical'))) : []
	};
	
	const severityOptions = {
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
			layout: {
				top: 0,
				bottom: 0,
				right: 50,
				left: 0
			}
	};

	const	unAcknowledgedData = {
		datasets: [{
			data: this.props.unAcknowledgedData.length > 0 ? this.props.unAcknowledgedData.map(data => data.count) : [],
			backgroundColor: this.props.unAcknowledgedData.length !== 1 ? [
				'rgba(255, 99, 132, 0.8)',
				'rgba(54, 162, 235, 0.8)',
			]
			:
			[
				this.props.unAcknowledgedData[0].acknowledge === false ?
				'rgba(255, 99, 132, 0.8)'
				:
				'rgba(54, 162, 235, 0.8)'
			],
			borderColor: this.props.unAcknowledgedData.length !== 1 ? [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
			]
			:
			[
				this.props.unAcknowledgedData[0].acknowledge === false ?
				'rgba(255, 99, 132, 1)'
				:
				'rgba(54, 162, 235, 1)'
			],
		}],

		// These labels appear in the legend and in the tooltips when hovering different arcs
		labels: this.props.unAcknowledgedData.length > 0 ? this.props.unAcknowledgedData.map(data => data.acknowledge ? '확인':'미확인') : []
	};
	
	const unAcknowledgeOptions = {
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
				labels: {
					fontSize: 12,
				}
			}
	};

		return (
			<div className={styles.few_service_box}>
				<div className="col-md-8 grid-margin stretch-card report-detail few">
					<div className="card report-detail few">
						<div className="card-body report-detail few">
							<h4 className="card-title report-detail few">{this.handleChangeServiceName(this.props.service)} 이벤트 발생 건수</h4>
							<div className='report-detail-card-chart few'>
								{this.props.eventTypeData.length > 0 && this.props.severityData.length > 0 && this.props.unAcknowledgedData.length > 0 ?
									<div className='report-detail-card-info few'>
										<div className={styles.event_name_box}>
										{/* <div className="d-flex align-items-center align-self-start report-detail-few"> */}
											<span className="mb-0 event_type">{this.props.eventTypeData.length > 0 && this.props.eventTypeData.map(data => this.handleChangeEventTypeLabel(data.event_type))}</span>
											<span className="text-success ml-2 mb-0 font-weight-large report-detail-few">{this.props.eventTypeData.length > 0 && this.props.eventTypeData.map(data => data.count)+'건'}</span>
										</div>
										<div className="d-flex align-items-center align-self-start report-detail-few severity">
											<div className='report-detail-card-chart severity'>
												<Pie data={severityData} options={severityOptions} id='detail-report-severity-few'/>
												<div className='report-detail-chart-description-severity few'>
													<div className="table-responsive report-detail few">
														<table className="table report-detail-severity few">
															<thead>
																<tr>
																	<th className='report-detail-few-severity'>Default</th>
																	<th className='report-detail-few-severity'>Minor</th>
																	<th className='report-detail-few-severity'>Major</th>
																	<th className='report-detail-few-severity'>Critical</th>
																</tr>
															</thead>
															<tbody>
														{
															this.props.severityData.length === 4 ?
																this.props.severityData.sort((a, b) => a.event_type_severity - b.event_type_severity).map((severityItem) => {
																	return (
																		<td>{severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건'}</td>
																	)
																})
															:
															this.props.severityData.length > 1 ?
																<tr>
																	<td>{this.props.severityData.some((severityItem) => severityItem.event_type_severity === 0)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 0).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 0).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</td>
																	<td>{this.props.severityData.some((severityItem) => severityItem.event_type_severity === 1)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 1).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 1).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</td>
																	<td>{this.props.severityData.some((severityItem) => severityItem.event_type_severity === 2)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 2).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 2).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</td>
																	<td>{this.props.severityData.some((severityItem) => severityItem.event_type_severity === 3)? this.props.severityData.find((severityItem) => severityItem.event_type_severity === 3).count > 0 ? (this.props.severityData.find((severityItem) => severityItem.event_type_severity === 3).count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건') : '0건': '0건'}</td>
																</tr>
															:
																this.props.severityData.sort((a, b) => a.event_type_severity - b.event_type_severity).map((severityItem, index) => {
																	return(
																		<tr key={index}>
																			<td>{severityItem.event_type_severity === 0? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</td>
																			<td>{severityItem.event_type_severity === 1? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</td>
																			<td>{severityItem.event_type_severity === 2? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</td>
																			<td>{severityItem.event_type_severity === 3? (severityItem.count > 0 ? severityItem.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '건' : '0건') : '0건'}</td>
																		</tr>
																	)})
														}
													</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
										<div className="d-flex align-items-center align-self-start report-detail-few acknowledge">
											<Doughnut data={unAcknowledgedData} options={unAcknowledgeOptions} id='report-detail-few-unAcknowledge' width={250}/>
											{this.props.unAcknowledgedData.length > 0 ?
												<div className={styles.unAck_percent}>
													{this.handleUnAckRate(this.props.unAcknowledgedData)}%
												</div>
												:
												''
											}
											{this.props.unAcknowledgedData && this.props.unAcknowledgedData.map((data, index) => {
												if(data.acknowledge === false){
													return (
														<div className={styles.unAck_value} key={index}>
															<label className={styles.unAck_label}>미확인</label>
															<span className="text-success ml-2 mb-0 font-weight-large report-detail unAck">{data.count.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}건</span>
														</div>
													)
												}
											})}
											{this.props.unAcknowledgedData.filter((data) => data.acknowledge === false).length === 0 ?
												<div className={styles.unAck_value}>
													<label className={styles.unAck_label}>미확인</label>
													<span className="text-success ml-2 mb-0 font-weight-large report-detail unAck">0건</span>
												</div>
												:
												''
											}
										</div>
									</div>
									:
									<h5 className='empty-chart-data'>데이터 없음</h5>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default DetailReport2;
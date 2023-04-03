import React, { Component } from 'react';
import axios from 'axios';
import EventTypeItem from './EventTypeItem';
import { Col, Row, Nav, Tab } from 'react-bootstrap';

class EventTypeSetting extends Component {

	state = {
		observerEvents: [],
		mgistEvents: [],
		ebellEvents: [],
		accessctlEvents: [],
		ndoctorEvents: [],
		parkingEvents: [],
		crowdDensityEvents: [],
		mdetEvents: []
	}

	handleGetEventTypes = async (service_type) => {

		try {
			const result = await axios.get(`/api/observer/eventType?service_type=${service_type}`);
			if(result && result.data.result && result.data.result.rows.length > 0)	{
				if(service_type === 'mgist') {
					this.setState({ mgistEvents: result.data.result.rows })
				} else if(service_type === 'ebell') {
					this.setState({ ebellEvents: result.data.result.rows })
				} else if(service_type === 'observer') {
					this.setState({ observerEvents: result.data.result.rows });
				} else if(service_type === 'accesscontrol') {
					this.setState({ accessctlEvents: result.data.result.rows });
				} else if(service_type === 'ndoctor') {
					this.setState({ ndoctorEvents: result.data.result.rows });
				} else if(service_type === 'parkingcontrol'){
					this.setState({ parkingEvents: result.data.result.rows });
				} else if(service_type === 'crowddensity'){
					this.setState({ crowdDensityEvents: result.data.result.rows });
				}  else if(service_type === 'mdet'){
					this.setState({ mdetEvents: result.data.result.rows });
				}
			}
		} catch(err) {
			console.log('Get EventTypes Err: ', err);
		}
	}

	handleSetEventType = async (target, idx, value2, service_type) => {

		try {
			let result;
			if(target === 'severity') {
				result = await axios.put('/api/observer/eventType', {
					idx: idx,
					severity: value2,
					service_type: service_type
				})
			} else if(target === 'unused') {
				result = await axios.put('/api/observer/eventType', {
					idx: idx,
					unused: value2,
					service_type: service_type
				})
			} else if(target === 'popup') {
				result = await axios.put('/api/observer/eventType', {
					idx: idx,
					popup: value2,
					service_type: service_type
				})
			}
			if(result && result.data && result.data.result && result.data.result.rowCount > 0) {
				this.handleGetEventTypes(service_type);
			}
		} catch(err) {
			console.log('Set EventType Err: ', err);
		}
	}

	componentDidMount()	{
		this.handleGetEventTypes('observer');
		this.handleGetEventTypes('mgist');
		this.handleGetEventTypes('ebell');
		this.handleGetEventTypes('accesscontrol');
		this.handleGetEventTypes('ndoctor');
		this.handleGetEventTypes('parkingcontrol');
		this.handleGetEventTypes('crowddensity');
		this.handleGetEventTypes('mdet');
	}

	render () {
		return (
			<div className='eventType-Setting'>
				<div className="tab-vertical">
					<Tab.Container id="left-tabs-example" defaultActiveKey="observer">
						<Row className='eventType-tab'>
							<Col sm={4} className='service_type'>
								<Nav variant="tabs" className="flex-column nav-tabs-vertical">
								<Nav.Item>
										<Nav.Link eventKey="observer">
											옵저버
										</Nav.Link>
									</Nav.Item>
									{
										this.props.handleEnableServiceType('mgist') &&
										<Nav.Item>
											<Nav.Link eventKey="mgist">
												MGIST
											</Nav.Link>
										</Nav.Item>
									}
									{
										this.props.handleEnableServiceType('ebell') &&
										<Nav.Item>
											<Nav.Link eventKey="ebell">
												비상벨
											</Nav.Link>
										</Nav.Item>
									}
									{
										this.props.handleEnableServiceType('accesscontrol') &&
										<Nav.Item>
											<Nav.Link eventKey="accesscontrol">
												출입통제
											</Nav.Link>
										</Nav.Item>
									}
									{
										this.props.handleEnableServiceType('ndoctor') &&
										<Nav.Item>
											<Nav.Link eventKey="ndoctor">
												N-Doctor
											</Nav.Link>
										</Nav.Item>
										
									}
									{ 
										this.props.handleEnableServiceType('parkingcontrol') &&
										<Nav.Item>
											<Nav.Link eventKey="parkingcontrol">
												주차 관제
											</Nav.Link>
										</Nav.Item>
									}
									{ 
										this.props.handleEnableServiceType('parkingcontrol') &&
										<Nav.Item>
											<Nav.Link eventKey="mdet">
												M-DET
											</Nav.Link>
										</Nav.Item>
									}
									{ 
										this.props.handleEnableServiceType('crowddensity') &&
										<Nav.Item>
											<Nav.Link eventKey="crowddensity">
												군중 밀집도
											</Nav.Link>
										</Nav.Item>
									} 
								</Nav>
							</Col>
							<Col sm={8} className="eventType-items">
								<Tab.Content className="tab-content-vertical">
									<Tab.Pane eventKey="observer">
										{
											this.state.observerEvents.map((event, index) => {
												return (
													<EventTypeItem
														key={index}
														eventTypeItemInfo={event}
														handleSetEventType={this.handleSetEventType}
													/>
												)
											})
										}
									</Tab.Pane>
									{
										this.props.handleEnableServiceType('mgist') &&
										<Tab.Pane eventKey="mgist">
											{
												this.state.mgistEvents.map((event, index) => {
													return (
														<EventTypeItem
															key={index}
															eventTypeItemInfo={event}
															handleSetEventType={this.handleSetEventType}
														/>
													)
												})
											}
										</Tab.Pane>
									}
									{
										this.props.handleEnableServiceType('ebell') &&
										<Tab.Pane eventKey="ebell">
											{
												this.state.ebellEvents.map((event, index) => {
													return (
														<EventTypeItem
															key={index}
															eventTypeItemInfo={event}
															handleSetEventType={this.handleSetEventType}
														/>
													)
												})
											}
										</Tab.Pane>
									}
									{
										this.props.handleEnableServiceType('accesscontrol') &&
											<Tab.Pane eventKey="accesscontrol">
												{
													this.state.accessctlEvents.map((event, index) => {
														return (
															<EventTypeItem
																key={index}
																eventTypeItemInfo={event}
																handleSetEventType={this.handleSetEventType}
															/>
														)
													})
												}
											</Tab.Pane>
									}
									{
										this.props.handleEnableServiceType('ndoctor') &&
											<Tab.Pane eventKey="ndoctor">
												{
													this.state.ndoctorEvents.map((event ,index) => {
														return (
															<EventTypeItem
																key={index}
																eventTypeItemInfo={event}
																handleSetEventType={this.handleSetEventType}
															/>
														)
													})
												}
											</Tab.Pane>
									}
									{
										this.props.handleEnableServiceType('parkingcontrol') &&
											<Tab.Pane eventKey="parkingcontrol">
												{
													this.state.parkingEvents.map((event ,index) => {
														return (
															<EventTypeItem
																key={index}
																eventTypeItemInfo={event}
																handleSetEventType={this.handleSetEventType}
															/>
														)
													})
												}
											</Tab.Pane>
									}
										{
										this.props.handleEnableServiceType('mdet') &&
											<Tab.Pane eventKey="mdet">
												{
													this.state.mdetEvents.map((event ,index) => {
														return (
															<EventTypeItem
																key={index}
																eventTypeItemInfo={event}
																handleSetEventType={this.handleSetEventType}
															/>
														)
													})
												}
											</Tab.Pane>
									}
										{
										this.props.handleEnableServiceType('crowddensity') &&
											<Tab.Pane eventKey="crowddensity">
												{
													this.state.crowdDensityEvents.map((event ,index) => {
														return (
															<EventTypeItem
																key={index}
																eventTypeItemInfo={event}
																handleSetEventType={this.handleSetEventType}
															/>
														)
													})
												}
											</Tab.Pane>
									}
								</Tab.Content>
							</Col>
						</Row>
					</Tab.Container>
				</div>
			</div>
		)
	}
}

export default EventTypeSetting;
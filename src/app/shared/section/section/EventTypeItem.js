import React, { Component } from 'react';
import { ButtonGroup, ToggleButton, Form } from 'react-bootstrap';
import EventTypeIcons from '../../../dashboard/EventTypeIcons';

class EventTypeItem extends Component {

  state = {
    iconBoxColor: ['icon icon-box-secondary2', 'icon icon-box-success2','icon icon-box-warning2','icon icon-box-danger2'],
  }

  handleChangeSeverity = async (idx, severity, service_type) => {
    this.props.handleSetEventType('severity', idx, severity, service_type);
  }

  handleChangeUnused = async (idx, unused, service_type) => {
    this.props.handleSetEventType('unused', idx, unused, service_type);
  }

  handleChangePopup = async (idx, popup, service_type) => {
    this.props.handleSetEventType('popup', idx, popup, service_type);
  }

	render () {

		const radios = [
			{ name: 'info', value: 0 },
			{ name: 'minor', value: 1 },
			{ name: 'major', value: 2 },
			{ name: 'critical', value: 3 },
		];

		return (

			<div style={{ width: '11rem' }} className='eventTypeItem card'>
				<div className='eventType-header'>
          <div className="eventIcon setting">
            <div className={this.state.iconBoxColor[this.props.eventTypeItemInfo.severity]}>
              <EventTypeIcons
                eventType={this.props.eventTypeItemInfo}
              />
            </div>
          </div>
					<h4 className='eventType-title'>{this.props.eventTypeItemInfo.name}</h4>
				</div>
				<div className='eventTypeItem-body card-body'>
					<div className='card-text'>
            <div className='eventType-severity'>
              <span className='eventType-severity-label'>중요도</span>
              <ButtonGroup key={`inline-radio`}>
                {/* <h5 className='eventType-severity-label'>Severity</h5> */}
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant={idx === 0 ? 'outline-default': idx === 1 ? 'outline-minor' : idx === 2? 'outline-major' : 'outline-critical'}
                    name={`${this.props.eventTypeItemInfo.name}-${idx}`}
                    value={radio.value}
                    checked={this.props.eventTypeItemInfo.severity === radio.value}
                    onChange={(e) => this.handleChangeSeverity(this.props.eventTypeItemInfo.idx, e.currentTarget.value, this.props.eventTypeItemInfo.service_type)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </div>
            <div className="eventType-unused-popup">
              <span className='eventType-unused'>
                <span className='eventType-unused-label'>활성화</span>
                <Form>
                  <Form.Check 
                    type="switch"
                    className="custom-control custom-switch custom-switch-md"
                    id={`switch-unused-${this.props.eventTypeItemInfo.idx}`}
                    checked={!this.props.eventTypeItemInfo.unused}
                    onChange={() => this.handleChangeUnused(this.props.eventTypeItemInfo.idx, !this.props.eventTypeItemInfo.unused, this.props.eventTypeItemInfo.service_type)}
                  />
                </Form>
              </span>
              <div className='eventType-popup'>
                <span className='eventType-popup-label'>팝업</span>
                <Form>
                  <Form.Check 
                    type="switch"
                    className="custom-control custom-switch custom-switch-md"
                    id={`switch-popup-${this.props.eventTypeItemInfo.idx}`}
                    checked={this.props.eventTypeItemInfo.popup}
                    onChange={() => this.handleChangePopup(this.props.eventTypeItemInfo.idx, !this.props.eventTypeItemInfo.popup, this.props.eventTypeItemInfo.service_type)}
                  />
                </Form>
              </div>
            </div>
					</div>
				</div>
			</div>
		);
	}
}

export default EventTypeItem;
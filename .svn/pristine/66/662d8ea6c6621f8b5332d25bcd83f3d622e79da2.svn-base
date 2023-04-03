import React, { Component } from 'react';
import BillboardBackground from '../../assets/images/billboard_background.png';
import BillboardGitlogo from '../../assets/images/gitlogo.png';
import { Modal, Button } from 'react-bootstrap';
import Marquee from "react-fast-marquee";
import { ko } from 'date-fns/locale';
import * as dateFns from "date-fns";
import EventTypeIcons from './EventTypeIcons';

class BillBoard extends Component {

  state = {
    showAlert: false,
  }

  handleShowAlert = async (event) => {
    event.preventDefault();
    this.setState({ showAlert: !this.state.showAlert });
  }

  handleRemoveBillboardEvent = async (event, idx, service_type) => {
    event.preventDefault();
    this.props.removeBillboardEvent(idx, service_type);
  }

  render() {

    return (
      <div className='billboard'>
        <div className="billboard-Image">
          <img
            className="billboard-gitlogo"
            src={BillboardGitlogo}
            width='84'
            height='70'
          />
          <img 
            className="billboard-background"
            width="100%"
            max-height="70px"
            src={BillboardBackground}
            alt="background"
          />
        </div>
        <div className='billboard-Content'>
          <div className="billboard-event-occurTime">발생시간: {this.props.handleChangeDateTimeFormat(this.props.billboardEvent.event_occurrence_time)}</div>
          <Marquee pauseOnClick={true} speed={300} gradient={false}>
            <h2 className="billboard-event">
              <span className="billboard-eventIcon">
                <EventTypeIcons
                  billboardEvent={this.props.billboardEvent}
                />
              </span>
              <span className="billboard-eventName">
                {(this.props.billboardEvent.event_type !== 23 && this.props.billboardEvent.event_type !== 24) ?
                  (
                    this.props.billboardEvent.event_type === 28 ?
                    ((this.props.billboardEvent.building_name ? this.props.billboardEvent.building_name : '') + (this.props.billboardEvent.floor_name ? ( '   ' + this.props.billboardEvent.floor_name + (this.props.billboardEvent.location ? '   ' + this.props.billboardEvent.location : '') + '에서  ' + this.props.billboardEvent.id + '  ' + this.props.billboardEvent.name + ' (' +  this.props.billboardEvent.description + ')' ) :  this.props.billboardEvent.location ? this.props.billboardEvent.location + '에서' : '' + this.props.billboardEvent.name + ' (' +  this.props.billboardEvent.description + ')'))
                      :
                      (
                        this.props.billboardEvent.event_type === 19 ?
                          ((this.props.billboardEvent.building_name ? this.props.billboardEvent.building_name : '') + (this.props.billboardEvent.floor_name ? ( '  ' + this.props.billboardEvent.floor_name +  (this.props.billboardEvent.location ? '   ' + this.props.billboardEvent.location : '') + '에서  ' +  this.props.billboardEvent.description ) : (this.props.billboardEvent.location ? '   ' + this.props.billboardEvent.location : '') + '에서  ' + this.props.billboardEvent.description))
                          :
                          (
                            this.props.billboardEvent.service_type === 'ndoctor' ?
                            (this.props.billboardEvent.building_name ? this.props.billboardEvent.building_name : '') + (this.props.billboardEvent.floor_name ? ( '  ' + this.props.billboardEvent.floor_name + '에 있는' +  this.props.billboardEvent.device_id + '.' +this.props.billboardEvent.device_name + '  카메라  ' +  this.props.billboardEvent.event_type_name ) : this.props.billboardEvent.device_id + '.' +this.props.billboardEvent.device_name + '  카메라  ' +  this.props.billboardEvent.event_type_name)
                            :
                            (this.props.billboardEvent.building_name ? this.props.billboardEvent.building_name : '') + (this.props.billboardEvent.floor_name ? ( '  ' + this.props.billboardEvent.floor_name + '에서  ' + this.props.billboardEvent.name + '   ' +  this.props.billboardEvent.event_type_name ) : this.props.billboardEvent.name + '   ' +  this.props.billboardEvent.event_type_name)
                          )
                      )
                  )
                  :
                  (
                    ((this.props.billboardEvent.building_name ? this.props.billboardEvent.building_name + '   ' : '') + (this.props.billboardEvent.floor_name ? this.props.billboardEvent.floor_name + '   ' : '') + (this.props.billboardEvent.location ? this.props.billboardEvent.location: ''))+(((this.props.billboardEvent.building_name ? this.props.billboardEvent.building_name + '   ' : '') + (this.props.billboardEvent.floor_name ? this.props.billboardEvent.floor_name + '   ' : '') + (this.props.billboardEvent.location ? this.props.billboardEvent.location + '   ': '')).length > 0 ? '에서  ':'') + this.props.billboardEvent.name + '  ' +  this.props.billboardEvent.event_type_name + '   (' + this.props.billboardEvent.description + ') 인식' )
                }
              </span>
            </h2>
          </Marquee>
        </div>
        <div className="billboard-buttons">
          <div className="icon btn-inverse-secondary eventDetailInfo" onClick={() => this.props.eventSelected(this.props.billboardEvent.idx, this.props.billboardEvent.service_type)}>
            <i className="mdi mdi-information-variant"></i>
          </div>
          <div className="icon btn-inverse-secondary eventDetailInfo2" style={{left: '-31px'}}>
            <a href="!#" id="billboard-closer" className="ol-billboard-closer" onClick={(event) => this.handleShowAlert(event)}></a>
          </div>
        </div>
        <Modal show={this.state.showAlert}>
          <Modal.Header>
            <Modal.Title>이벤트 표시 종료</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 이벤트 표시를 종료하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={(event) => this.handleRemoveBillboardEvent(event, this.props.billboardEvent.idx, this.props.billboardEvent.service_type)}>
              예
            </Button>
            <Button variant="secondary" onClick={this.handleShowAlert}>
              아니오
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default BillBoard;
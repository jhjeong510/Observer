import React, { Component } from 'react';
import event_Fire from "../../assets/icon/fire.png";
import event_Motion from "../../assets/icon/motion.png";
import event_Smoke from "../../assets/icon/smoke.png";
import event_EnterArea from "../../assets/icon/enter_area.png";
import event_ExitArea from "../../assets/icon/exit_area.png";
import event_LineCrossing from "../../assets/icon/line_crossing.png";
import event_Loitering from "../../assets/icon/loitering.png";
import event_LostObject from "../../assets/icon/lost_object.png";
import event_Queue from "../../assets/icon/queue.png";
import event_ManDown from "../../assets/icon/man_down.png";
import event_SitPose from "../../assets/icon/sit_pose.png";
import event_StopArea from "../../assets/icon/stop_area.png";
import event_MoveArea from "../../assets/icon/move_area.png";
import event_PeopleCount from "../../assets/icon/people_count.png";
import event_ShortDistance from "../../assets/icon/short_distance.png";
import event_HandRail from "../../assets/icon/handrail.png";
import event_HandUp from "../../assets/icon/hand_up.png";
import event_Face from "../../assets/icon/face.png";
import event_Ebell from "../../assets/icon/ebell.png";
import event_guardianlite_on from "../../assets/icon/event_guardianlite_on.png";
import event_guardianlite_off from "../../assets/icon/event_guardianlite_off.png";
import event_guardianlite_reset from "../../assets/icon/guardianlite_reset.ico";
import event_accessctl1 from "../../assets/icon/accessctl_event.ico";
import event_accessctl2 from "../../assets/icon/accessctl_event2.ico";
import event_accessctl3 from "../../assets/icon/accessctl_event3.ico";
import event_breathsensor from "../../assets/icon/breathSensor_event.ico";
import event_PIDS from "../../assets/icon/PIDS.ico";
import event_satetyHelmet from "../../assets/icon/safety_helmet.png";
import event_connected from "../../assets/icon/connected.png";
import event_disconnected from "../../assets/icon/disconnected.png";
import not_parking from "../../assets/icon/not_parking_event.png";
import mdet_event from "../../assets/icon/mdet_event.png";
import styles from './EventTypeIcons.module.css';

export class EventTypeIcons extends Component {

    render() {
      if(this.props.event) {
        return (
          this.props.event.event_type === 1  ?
            <img alt='' src={event_Fire} width="90%" />
          :
          (this.props.event.event_type === 2 ?
            <img alt='' src={event_Smoke} width="90%" />
          :
          (this.props.event.event_type === 3 ?
            <img alt='' src={event_Motion} width="90%" />
          :
          (this.props.event.event_type === 4 ?
            <img alt='' src={event_Loitering} width="90%" />
          :
          (this.props.event.event_type === 5 ?
            <img alt='' src={event_LostObject} width="90%" />
          :
          (this.props.event.event_type === 6 ?
            <img alt='' src={event_EnterArea} width="90%" />
          :
          (this.props.event.event_type === 7 ?
            <img alt='' src={event_ExitArea} width="90%" />
          :
          (this.props.event.event_type === 8 ?
            <img alt='' src={event_LineCrossing} width="90%" />
          :
          (this.props.event.event_type === 9 ?
            <img alt='' src={event_Queue} width="90%" />
          :
          (this.props.event.event_type === 10 ?
            <img alt='' src={event_ManDown} width="90%" />
          :
          (this.props.event.event_type === 11 ?
            <img alt='' src={event_SitPose} width="90%" />
          :
          (this.props.event.event_type === 12 ?
            <img alt='' src={event_StopArea} width="90%" />
          :
          (this.props.event.event_type === 13 ?
            <img alt='' src={event_MoveArea} width="90%" />
          :
          (this.props.event.event_type === 14 ?
            <img alt='' src={event_PeopleCount} width="90%" />
          :
          (this.props.event.event_type === 15 ?
            <img alt='' src={event_ShortDistance} width="90%" />
          :
          (this.props.event.event_type === 16 ?
            <img alt='' src={event_HandRail} width="90%" />
          :
          (this.props.event.event_type === 17 ?
            <img alt='' src={event_HandUp} width="90%" />
          :
          (this.props.event.event_type === 18 ?
            <img alt='' src={event_Face} width="90%" />
          :
          (this.props.event.event_type === 19 ?
            <img alt='' src={event_Ebell} width="90%" />
          :
          (this.props.event.event_type === 20 ?
            <img alt='' src={event_guardianlite_on} width="90%" />
          :
          (this.props.event.event_type === 21 ?
            <img alt='' src={event_guardianlite_off} width="90%" />
          :
          (this.props.event.event_type === 22 ?
            <img alt='' src={event_guardianlite_reset} width="90%" />
          :
          (this.props.event.event_type === 23 ?
            <i className="mdi mdi-account-remove"></i>
          :
          (this.props.event.event_type === 24 ?
            <i className="mdi mdi-account-star"></i>
          :
          (this.props.event.event_type === 25 ?
            <img alt='' src={event_accessctl1} width="90%" />
          :
          (this.props.event.event_type === 26 ?
            <img alt='' src={event_accessctl2} width="90%" />
          :
          (this.props.event.event_type === 27 ?
            <img alt='' src={event_accessctl3} width="90%" />
          :
          (this.props.event.event_type === 28 ?
            <img alt='' src={event_breathsensor} width="90%" />
          :
          (this.props.event.event_type === 29 ?
            <img alt='' src={event_PIDS} width="90%"/>
          :
          (this.props.event.event_type === 30 ?
            <i className="mdi mdi-human"></i>
          :
          (this.props.event.event_type === 31 ?
            <i className="mdi mdi-car-connected"></i>
          :
          (this.props.event.event_type === 32 ?
            <img alt='' src={event_satetyHelmet} width="90%"/>
          :
          (this.props.event.event_type === 33 ?
            <img alt='' src={event_disconnected} width="90%"/>
          :
          (this.props.event.event_type === 34 ?
            <img alt='' src={event_connected} width="90%"/>
          :
          (this.props.event.event_type === 35 ?
            <img src={not_parking} />
          :
          (this.props.event.event_type === 36 ?
            <span className={styles.parking_full}>FULL</span>
          :
          (this.props.event.event_type === 37 ?
            <img src={mdet_event} />
          :
          (this.props.event.event_type === 38 ?
            <i className="mdi mdi-account-switch d-none d-sm-block"></i>
          :
            null
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
        )
      } else if(this.props.eventType) {
        return (
          this.props.eventType.idx === 1  ?
            <img alt='' src={event_Fire} width="90%" />
          :
          (this.props.eventType.idx === 2 ?
            <img alt='' src={event_Smoke} width="90%" />
          :
          (this.props.eventType.idx === 3 ?
            <img alt='' src={event_Motion} width="90%" />
          :
          (this.props.eventType.idx  === 4 ?
            <img alt='' src={event_Loitering} width="90%" />
          :
          (this.props.eventType.idx  === 5 ?
            <img alt='' src={event_LostObject} width="90%" />
          :
          (this.props.eventType.idx  === 6 ?
            <img alt='' src={event_EnterArea} width="90%" />
          :
          (this.props.eventType.idx === 7 ?
            <img alt='' src={event_ExitArea} width="90%" />
          :
          (this.props.eventType.idx  === 8 ?
            <img alt='' src={event_LineCrossing} width="90%" />
          :
          (this.props.eventType.idx  === 9 ?
            <img alt='' src={event_Queue} width="90%" />
          :
          (this.props.eventType.idx  === 10 ?
            <img alt='' src={event_ManDown} width="90%" />
          :
          (this.props.eventType.idx  === 11 ?
            <img alt='' src={event_SitPose} width="90%" />
          :
          (this.props.eventType.idx  === 12 ?
            <img alt='' src={event_StopArea} width="90%" />
          :
          (this.props.eventType.idx  === 13 ?
            <img alt='' src={event_MoveArea} width="90%" />
          :
          (this.props.eventType.idx  === 14 ?
            <img alt='' src={event_PeopleCount} width="90%" />
          :
          (this.props.eventType.idx  === 15 ?
            <img alt='' src={event_ShortDistance} width="90%" />
          :
          (this.props.eventType.idx  === 16 ?
            <img alt='' src={event_HandRail} width="90%" />
          :
          (this.props.eventType.idx  === 17 ?
            <img alt='' src={event_HandUp} width="90%" />
          :
          (this.props.eventType.idx  === 18 ?
            <img alt='' src={event_Face} width="90%" />
          :
          (this.props.eventType.idx === 19 ?
            <img alt='' src={event_Ebell} width="90%" />
          :
          (this.props.eventType.idx  === 20 ?
            <img alt='' src={event_guardianlite_on} width="90%" />
          :
          (this.props.eventType.idx  === 21 ?
            <img alt='' src={event_guardianlite_off} width="90%" />
          :
          (this.props.eventType.idx  === 22 ?
            <img alt='' src={event_guardianlite_reset} width="90%" />
          :
          (this.props.eventType.idx === 23 ?
            <i className="mdi mdi-account-remove"></i>
          :
          (this.props.eventType.idx  === 24 ?
            <i className="mdi mdi-account-star"></i>
          :
          (this.props.eventType.idx  === 25 ?
            <img alt='' src={event_accessctl1} width="90%" />
          :
          (this.props.eventType.idx  === 26 ?
            <img alt='' src={event_accessctl2} width="90%" />
          :
          (this.props.eventType.idx  === 27 ?
            <img alt='' src={event_accessctl3} width="90%" />
          :
          (this.props.eventType.idx === 28 ?
            <img alt='' src={event_breathsensor} width="90%" />
          :
          (this.props.eventType.idx === 29 ?
            <img alt='' src={event_PIDS} width="90%" />
          :
          (this.props.eventType.idx === 30 ?
            <i className="mdi mdi-human"></i>
          :
          (this.props.eventType.idx === 31 ?
            <i className="mdi mdi-car-connected"></i>
          :
          (this.props.eventType.idx === 32 ?
            <img alt='' src={event_satetyHelmet} width="90%" />
          :
          (this.props.eventType.idx === 33 ?
            <img alt='' src={event_disconnected} width="90%"/>
          :
          (this.props.eventType.idx === 34 ?
            <img alt='' src={event_connected} width="90%"/>
          :
          (this.props.eventType.idx === 35 ?
            <img src={not_parking} />
          :
          (this.props.eventType.idx === 36 ?
            <span className={styles.parking_full}>FULL</span>
          :
          (this.props.eventType.idx === 37 ?
            <img src={mdet_event} />
          :
          (this.props.eventType.idx  === 38 ?
            <i className="mdi mdi-account-switch d-none d-sm-block"></i>
          :
            null
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
          )
        )
      }
    }
  }

export default EventTypeIcons

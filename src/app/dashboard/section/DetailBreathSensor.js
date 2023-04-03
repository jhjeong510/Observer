import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import breathSensorIcon_stabled from "../../../assets/icon/breathSensorIcon_stabled.png";
import breathSensorIcon_disabled from "../../../assets/icon/breathSensorIcon_disabled.png";
import breathSensorIcon_event from "../../../assets/icon/breathSensorIcon_event.gif";
import breathSensorIcon_unlock from "../../../assets/icon/breathSensorIcon_unlock.png";
import breathSensorIcon_off from "../../../assets/icon/breathSensorIcon_off.png";
import breathSensorIcon_ceiling_stabled from "../../../assets/icon/breathSensorIcon_ceiling_stabled.png";
import breathSensorIcon_ceiling_disabled from "../../../assets/icon/breathSensorIcon_ceiling_disabled.png";
import breathSensorIcon_ceiling_event from "../../../assets/icon/breathSensorIcon_ceiling_event.gif";
import breathSensorIcon_ceiling_unlock from "../../../assets/icon/breathSensorIcon_ceiling_unlock.png";
import breathSensorIcon_ceiling_off from "../../../assets/icon/breathSensorIcon_ceiling_off.png";

class DetailBreathSensor extends Component {

  handleBreathSensorIcon = (breathSensor) => {
    if(breathSensor.use_status === 'true' && breathSensor.status === 0 && breathSensor.prison_door_status === 'lock'){
      if(breathSensor.install_location == 'room'){
        return <img src={breathSensorIcon_stabled} ></img>
      } else if(breathSensor.install_location == 'ceiling'){
        return <img src={breathSensorIcon_ceiling_stabled}></img>
      }
    } else if(breathSensor.use_status === 'true' && breathSensor.prison_door_status === 'unlock' && breathSensor.status !== 2) {
      if(breathSensor.install_location == 'room'){
        return <img src={breathSensorIcon_unlock}></img>
      } else if(breathSensor.install_location == 'ceiling'){
        return <img src={breathSensorIcon_ceiling_unlock}></img>
      }
    } else if(breathSensor.status !== 2 && breathSensor.use_status === 'false'){
      if(breathSensor.install_location == 'room'){
        return <img src={breathSensorIcon_disabled}></img>
      } else if(breathSensor.install_location == 'ceiling'){
        return <img src={breathSensorIcon_ceiling_disabled}></img>
      }
    } else if(breathSensor.status === 1){
      if(breathSensor.install_location == 'room'){
        return <img src={breathSensorIcon_event} width='39' height='37' className='breathSensorIcon_event'></img>
      } else if(breathSensor.install_location == 'ceiling'){
        return <img src={breathSensorIcon_ceiling_event} width='39' className='breathSensorIcon_ceiling_event'></img>
      }
    } else if(breathSensor.status === 2) {
      if(breathSensor.install_location == 'room'){
        return <img src={breathSensorIcon_off} className='breathSensorIcon_off'></img>
      } else if(breathSensor.install_location == 'ceiling'){
        return <img src={breathSensorIcon_ceiling_off} className='breathSensorIcon_ceiling_off'></img>
      }
    }
  }

  componentDidMount() {
    let element = document.getElementById(`detailBreathSensor_${this.props.breathSensor.ipaddress.substring(this.props.breathSensor.ipaddress.lastIndexOf('.') + 1)}`);

    element.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.props.handleCreateContextMenu(event, this.props.breathSensor.ipaddress, this.props.breathSensor.use_status, this.props.breathSensor.name);
    });

    element.addEventListener('click', (event) => {
      event.preventDefault();
      this.props.handleClearContextMenu(event);
    });
  }

  render() {
    return (
      <div className='detailBreathSensorInfo' id={`detailBreathSensor_${this.props.breathSensor.ipaddress.substring(this.props.breathSensor.ipaddress.lastIndexOf('.') + 1)}`}>
        <span className='detailBreathSensorName'>{this.props.breathSensor.install_location === 'ceiling' ? this.props.breathSensor.name.slice(-3): this.props.breathSensor.name.slice(-4)}</span>
        <div className='detailBreathSensor-content'>
        <span className='detailBreathSensorIcon'>{this.handleBreathSensorIcon(this.props.breathSensor)}</span>
          <Form className='use_status_control' onClick={() => this.props.handleBreathSensor(this.props.breathSensor.ipaddress, this.props.breathSensor.use_status, this.props.breathSensor.location, this.props.breathSensor.name)}>
            <Form.Check 
              type="switch"
              className="custom-control custom-switch custom-switch-sm"
              id={`switch-unused-${this.props.breathSensor.ipaddress}`}
              checked={this.props.breathSensor.use_status === 'true'?true:false}
              onChange={() => this.props.handleBreathSensor(this.props.breathSensor.ipaddress, this.props.breathSensor.use_status, this.props.breathSensor.location, this.props.breathSensor.name)}
            />
          </Form>
        </div>
      </div> 
    );
  }
}

export default DetailBreathSensor;
import React, { Component } from 'react';
import { Form, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import CameraList from  './Sections/CameraList';
import UserManagement from './Sections/UserManagement';

export class ConfigPage extends Component {
    
    state = {
        NVRIP : "",
        NVPPort: "",
        NVRID: "",
        NVRPW: "",
        cameraList: [],
    }

    onChange = (e) => {
        this.setState({[e.target.name] : e.target.value});
    }

    getCameraList = event => {

        const { NVRIP, NVRPort, NVRID, NVRPW } = this.state;

        event.preventDefault();
        let info = {
            "NVRIP": NVRIP,
            "NVRPort": NVRPort,
            "NVRID": NVRID,
            "NVRPW": NVRPW,
        }

        axios.get('/api/config/getCameraListByInfo', {params:info} )
            .then(response => {
                // console.log("info:", response.data.result);
                this.setState({cameraList: response.data.result});
            })
            .catch(err => {
                alert(err);
            })
    }

    componentDidMount() {
        axios.get('/api/config/getDBCameraList')
            .then(response => {
                // console.log("db:", response.data.result);
                this.setState({cameraList: response.data.result});
            })
            .catch(err => {
                alert(err);
            })
    }

    render () {
        return (
               <div>
                    <div className="page-header">
                    <h3 className="page-title"> 환경 설정 </h3>
                    </div>

                    <div className="configuration">
                        <div className="col-md-6 grid-margin stretch-card">
                            <div className="card">
                                <Tabs defaultActiveKey="nvrCamera" id="tabs">
                                    <Tab eventKey="VMSCamera" title="VMS Camera">
                                        <div className="card-body">
                                            <h4 className="card-title">VMS Server</h4>
                                            <p className="card-description"> Let's start with the VMS System (with validation)</p>
                                            <form className="forms-configuration">
                                                <Form.Group>
                                                    <label htmlFor="exampleInputUsername1">IP Address</label>
                                                    <Form.Control type="text" className="form-control" name="NVRIP" placeholder="IP Address" onChange={this.onChange}/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <label htmlFor="exampleInputEmail1">Web server port</label>
                                                    <Form.Control type="int" className="form-control" name="NVRPort" placeholder="Web server port" onChange={this.onChange} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <label htmlFor="exampleInputPassword1">ID</label>
                                                    <Form.Control type="text" className="form-control" name="NVRID" placeholder="ID" onChange={this.onChange}/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <label htmlFor="exampleInputConfirmPassword1">Password</label>
                                                    <Form.Control type="password" className="form-control" name="NVRPW" placeholder="Password" onChange={this.onChange} />
                                                </Form.Group>
                                                <button type="submit" className="btn btn-primary btn-config" onClick={this.getCameraList}>Start</button>
                                            </form>
                                        </div>
                                        <CameraList cameraList={this.state.cameraList}/>
                                    </Tab>
                                    <Tab eventKey="userManagement" title="UserManagement">
                                        <UserManagement />
                                    </Tab>
                                </Tabs>
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
        )
    }
}

export default ConfigPage
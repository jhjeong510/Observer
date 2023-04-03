import React, { Component } from 'react';


export class CameraList extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }
    
    renderCameraList = (cameraList)  => {
        return cameraList.map((value, index) => (
            <tr key={index}>
                <td>{index+1}</td>
                <td>{value.mgist_ip + ':' + value.mgist_port}</td>
                <td>{value.display_id + '.' + value.display_name}</td>
                <td>{value.ip_address}</td>        
            </tr>
        )) 
    }

    render() {
        const { cameraList } = this.props;
        return (
            <div className="configuration">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Camera List</h4>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>MGIST server</th>
                                        <th>Camera ID</th>
                                        <th>IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderCameraList(cameraList)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CameraList;
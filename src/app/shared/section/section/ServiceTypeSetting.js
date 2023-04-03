import React, { Component } from 'react';
import axios from 'axios';
import ModalConfirm from '../../../dashboard/ModalConfirm';
import { Form } from 'react-bootstrap';

class ServiceTypeSetting extends Component {

	state = {
		checked: [],
	}

	handleSetServiceTypes = async () => {
		const newChecked = []
		await this.props.serviceTypes.map((serviceType) => {
			if(serviceType.setting_value === 'true'){
				newChecked.push(serviceType.name);
			}
		})
		this.setState({ checked: newChecked });
	}

	handleToggle = async (serviceItem) => {

    const currentIndex = this.state.checked.indexOf(serviceItem.name);

    const newChecked = [...this.state.checked];

    if(currentIndex === -1) {
      newChecked.push(serviceItem.name)
			const res = await axios.put('/api/observer/setting', {
				name: serviceItem.name,
				setting_value: 'true'
			});
    } else {
      newChecked.splice(currentIndex, 1);
			const res = await axios.put('/api/observer/setting', {
				name: serviceItem.name,
				setting_value: 'false'
			});
    }
    await this.setState({ checked: newChecked });
		this.props.getServiceTypes();
  };

	async componentDidMount() {
		this.handleSetServiceTypes();
	}

	render () {
		return (
			<div>
				<Form.Group>
          {
						this.props.serviceTypes && this.props.serviceTypes.map((serviceItem, index) => {
							return (
								<div className="form-check service_type setting" key={index}>					
            			<label className="form-check-label service_type setting">
									<input 
										type="checkbox"
										id={serviceItem.idx}
										name={serviceItem.name}
										className="form-check-input report service_type setting"
										value={serviceItem.name}
										checked={this.state.checked.indexOf(serviceItem.name) === -1 ? false : true}
										onChange={() => this.handleToggle(serviceItem)}
									/>
										{this.props.handleChangeServiceTypeName(serviceItem.name)}
                		<i className="input-helper"></i>
                	</label>
          			</div>
						)
						})
					}
				</Form.Group>
			</div>
		);
	}
}

export default ServiceTypeSetting;
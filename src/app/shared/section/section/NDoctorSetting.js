import React, { Component } from 'react';
import ModalConfirm from '../../../dashboard/ModalConfirm';

class NDoctorSetting extends Component {

	state = {
		showDelConfirm: false,
		modalConfirmTitle: '',
		modalConfirmMessage: '',
		modalConfirmBtnText: '',
		modalConfirmCancelBtnText: '',
	}

	render () {
		return (
			<div>							
				<ModalConfirm
					showModal = {this.state.showDelConfirm}
          modalTitle = {this.state.modalConfirmTitle}
          modalMessage = {this.state.modalConfirmMessage}
          modalConfirmBtnText = {this.state.modalConfirmBtnText}
          modalCancelBtnText = {this.state.modalConfirmCancelBtnText}
          handleConfirm = {this.handleDelConfirm}
          handleCancel = {this.handleDelCancel}
				/>
			</div>
		);
	}
}

export default NDoctorSetting;
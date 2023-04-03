import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './ModalConfirm.module.css';

class ModalConfirm extends Component {

  state = {
    showModal: false,
    modalTitle: '확인창 제목을 입력하세요',
    modalMessage: '확인창 내용을 입력하세요',
    modalMessageWarn: '',
    removeIdx: '',
    modalConfirmBtnText: '확인',
    modalCancelBtnText: '취소',
  }

  //componentDidUpdate(prevProps, prevState, snapshot) {
  componentDidUpdate(prevProps) {
    if (this.props.showModal !== prevProps.showModal) {
      this.setState({showModal: this.props.showModal});
    }
    if (this.props.modalTitle !== prevProps.modalTitle) {
      this.setState({modalTitle: this.props.modalTitle});
    }
    if (this.props.modalMessage != prevProps.modalMessage) {
      this.setState({modalMessage: this.props.modalMessage});
    }
    if (this.props.modalMessageWarn != prevProps.modalMessageWarn) {
      this.setState({modalMessageWarn: this.props.modalMessageWarn});
    }
    if (this.props.modalConfirmBtnText != prevProps.modalConfirmBtnText) {
      this.setState({modalConfirmBtnText: this.props.modalConfirmBtnText});
    }
    if (this.props.modalCancelBtnText != prevProps.modalCancelBtnText) {
      this.setState({modalCancelBtnText: this.props.modalCancelBtnText});
    }
    if (this.props.removeIdx != prevProps.removeIdx) {
      this.setState({removeIdx: this.props.removeIdx});
    }
  }

  handleConfirm = async (e) => {
    if (this.props.handleConfirm) {
      if(this.props.removeIdx){
        this.props.handleConfirm(this.props.removeIdx);
      } else if(this.props.removeIdx!==null){
        this.props.handleConfirm();
      }
    }
  }

  handleCancel = async (e) => {
    if (this.props.handleCancel) {
      this.props.handleCancel();
    }
  }

  render() {
    return (
      <div className='modalconfirm'>
        <Modal show={this.state.showModal} contentClassName={this.props.syncCameraList? 'vms-setting-option': ''}>
          <Modal.Header>
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.props.checkOption ?
                <div className='vms-setting-confirm'>
                  <div>{this.state.modalMessage}</div>
                  {this.state.modalMessageWarn && <div className={styles.modalMessageWarn}>{this.state.modalMessageWarn}</div>}
                  <div className="form-check setting sync cameraList">					
                    <label className="form-check-label setting sync cameraList">
                      <input 
                        type="checkbox"
                        className="form-check-input setting sync cameraList"
                        checked={this.props.syncCameraList}
                        onChange={() => this.props.handleSyncCameraList(this.props.checkOption)}
                      />
                      <i className="input-helper setting sync cameraList"></i>
                      <span className='alert-vms-update-cameraList'>
                        {this.props.checkOption === 'VMS 수정'? '카메라 정보 수정': '카메라 정보 삭제' }
                      </span>
                    </label>
                  </div>
                </div>
                :
                <>
                  {<div>{this.state.modalMessage}</div>}
                  {this.state.modalMessageWarn && <div className={styles.modalMessageWarn}>{this.state.modalMessageWarn}</div>}
                </>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleConfirm}>
              {this.state.modalConfirmBtnText}
            </Button>
            <Button variant="secondary" onClick={this.handleCancel}>
              {this.state.modalCancelBtnText}
            </Button>
          </Modal.Footer>
        </Modal>          
      </div>
    );
  }
}

export default ModalConfirm;
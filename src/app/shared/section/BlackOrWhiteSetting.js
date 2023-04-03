import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import BlackOrWhite from './BlackOrWhite';
import axios from 'axios';
import { Modal, Tab, Tabs, Table  } from 'react-bootstrap';
import ModalConfirm from '../../dashboard/ModalConfirm';

class BlackOrWhiteSetting extends Component {

  state = {
    carNumberList: [],
    modalCurrentCarNumber: '',
    modalCurrentName: '',
    modalCurrentDescription: '',
    modalCarNumberWarn: '',
    modalNameWarn: '',
    currentTabIndex: undefined,
    carNumberAlert: false,
    showDelConfirm: false,
    modalConfirmTitle: '',
    modalConfirmMessage: '',
    modalConfirmBtnText: '',
    modalConfirmCancelBtnText: '',
    modalConfirmIdx: undefined,
    modalConfirmType: undefined,
  }

  componentDidMount() {
    this.getCarNumberList();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentTabIndex !== prevProps.currentTabIndex) {
      this.props.getCarNumberList();
    }
  }

  handleCarNumberAlert = async () => {
    this.setState({ carNumberAlert: !this.state.carNumberAlert });
  }

  handleCarNumberRecongnition = async (evt) => {
    evt.preventDefault();
    this.props.handleEnableAnpr();
  }

  handleChangeCarNumber = (e) => {
    this.setState({ modalCurrentCarNumber: e.currentTarget.value });
  }

  handleChangeName = (e) => {
    this.setState({ modalCurrentName: e.currentTarget.value });
  }

  handleChangeDescription = (e) => {
    this.setState({ modalCurrentDescription: e.currentTarget.value });
  }

  getCarNumberList = async (type) => {
      try {
        const res = await axios.get('/api/observer/carNumber', {
          params: type
        })
        if (res && res.data && res.data.result && res.data.result.length > 0) {
          this.setState({ carNumberList: res.data.result});
          return res.data.result;
        } else {
          this.setState({ carNumberList: [] });
          return
        }
      } catch(err) {
        console.log('read carNumberList Error', err);
      }
  }


  handleAddCarNumber = async (e, type) => {
    e.preventDefault();
    if (this.state.modalCurrentCarNumber === undefined || this.state.modalCurrentCarNumber === '') {
      this.setState({ modalCarNumberWarn: "차량 번호를 입력하세요." });
      return;
    } else {
      this.setState({ modalCarNumberWarn: '' });
    }
    if (this.state.modalCurrentName === undefined || this.state.modalCurrentName === '') {
      this.setState({ modalNameWarn: "이름을 입력하세요."});
      return;
    } else {
      this.setState({ modalNameWarn: '' });
    }
  
    if(type === 'black'){
      try {
        const res = await axios.post('/api/observer/carNumber', {
          number: this.state.modalCurrentCarNumber,
          name: this.state.modalCurrentName,
          type: 'black',
          description: this.state.modalCurrentDescription,
        });
        console.log('create blackList:', res);
        if(res.data.message === 'ok') {
          this.setState({
            modalCurrentCarNumber: '',
            modalCurrentName: '',
            modalCurrentDescription: '',
            currentTabIndex: 0
          });
          this.getCarNumberList('black');
        }
        return res;
      } catch (err) {
        console.log('클라이언트에서 err확인: ', err);
        if(err.response.status === 409){
          this.handleCarNumberAlert();
        }
        return;
      }
    } else if(type === 'white') {
      try {
        const res = await axios.post('/api/observer/carNumber', {
          number: this.state.modalCurrentCarNumber,
          name: this.state.modalCurrentName,
          type: 'white',
          description: this.state.modalCurrentDescription,
        });
        console.log('create whiteList:', res);
        if(res.data.message === 'ok') {
          this.setState({
            modalCurrentCarNumber: '',
            modalCurrentName: '',
            modalCurrentDescription: '',
            currentTabIndex: 1
          });
          this.getCarNumberList('white');
        }
        return res;
      } catch (err) {
        console.error(err);
        if(err.response.status === 409){
          this.handleCarNumberAlert();
        }
        return;
      }
    }
  }

  handleDelConfirm = async () => {
    try {
      // 리스트 삭제 REST API 호출
      const res = await axios.delete('/api/observer/carNumber', {
        params: {
          idx: this.state.modalConfirmIdx,
          type: this.state.modalConfirmType
        }
      });
      if(res.data.message === 'ok'){
        this.getCarNumberList(this.state.modalConfirmType);
      }
      console.log('delete list result:', res);
    } catch (e) {
      console.log('handleDelConfirm:', e);
    } finally {
      this.setState({
        showDelConfirm: false,
        delFloorModal: false,
        modalConfirmTitle: '',
        modalConfirmMessage: '',
        modalConfirmBtnText: '',
        modalConfirmCancelBtnText: '',
        modalConfirmIdx: undefined,
        modalConfirmType: undefined,
      });
    }
  }

  handleDelCancel = async (e) => {
    console.log('confirm modal: cancel');

    this.setState({
      showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
      modalConfirmIdx: undefined,
      modalConfirmType: undefined,
    });
  }

  handleRemoveCarNumber = async (idx, type) => {

    if(type === 'black') {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '블랙리스트 삭제',
        modalConfirmMessage: '선택하신 번호를 블랙리스트에서 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: idx,
        modalConfirmType: type,
      });
    } else {
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '화이트리스트 삭제',
        modalConfirmMessage: '선택하신 번호를 화이트리스트에서 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: idx,
        modalConfirmType: type,
      });
    }
  }

  render () {
    return (
      <div>
        <Modal 
          show={this.props.showCarNumberModal} 
          contentClassName="carNumberList" size='sm' 
          centered
          onHide={this.props.handleCarNumberModal}
        >
          <Modal.Header className="carNumberList">
            차량번호 리스트
            <div className="modal-close" style={{left: '-31px'}}>
              <a href="!#" className="anpr-modal-closer" onClick={this.props.handleCarNumberModal}></a>
            </div>
          </Modal.Header>
          <Modal.Body className='black_and_white_list'>
            <Tabs defaultActiveKey="blackList" id="uncontrolled-tab-example" className="mb-3 anpr-settings">
              <Tab eventKey="blackList" title="블랙리스트">
                <div className="aligner-wrapper">
                  <div className="label-input-submit">
                    <div className="anpr-carNumber">
                      <label>차량 번호</label>
                      <input
                        type="text"
                        style={{width: '100px'}}
                        required="required"
                        placeholder="차량 번호"
                        name="carNumber"
                        value={this.state.modalCurrentCarNumber}
                        onChange={this.handleChangeCarNumber}
                      >
                      </input>
                      <p className='modalCarNumberWarn' style={{ color: 'red'}}>{this.state.modalCarNumberWarn}</p>
                    </div>
                    <div className="anpr-name">
                      <label>이름</label>
                      <input
                        type="text"
                        style={{width: '80px'}}
                        required="required"
                        placeholder="이름"
                        name="name"
                        value={this.state.modalCurrentName}
                        onChange={this.handleChangeName}
                      >
                      </input>
                      <p className='modalNameWarn' style={{ color: 'red'}}>{this.state.modalNameWarn}</p>
                    </div>
                    <div className="anpr-description">
                      <label>설명</label>
                      <input
                        type="text"
                        style={{width: '120px'}}
                        required="required"
                        placeholder="상세정보"
                        name="description"
                        value={this.state.modalCurrentDescription}
                        onChange={this.handleChangeDescription}
                      >
                      </input>
                    </div>
                    <Button className="anpr-submit" onClick={(event) => this.handleAddCarNumber(event,'black')}>등록</Button>
                  </div>
                  <div className="table-responsive anpr-blackAndWhite-setting">
                    <Table className="table table-striped anpr-blackAndWhite-setting" align="center">
                      <thead style={{ width: '518px' }}>
                        <tr>
                          <th style={{ width: '118px' }}>차량 번호</th>
                          <th style={{ width: '90px', minWidth: '90px' }}>이름</th>
                          <th style={{ width: '147px', minWidth: '147px' }}>설명</th>
                          <th style={{ width: '140px', minWidth: '140px' }}>리스트에서 삭제</th>
                        </tr>
                      </thead>
                      <tbody style={{ width: '518px' }} className="blackOrWhiteList-tbody">
                        <BlackOrWhite 
                          black
                          currentTabIndex={this.state.currentTabIndex}
                          carNumberList={this.state.carNumberList}
                          getCarNumberList={this.getCarNumberList}
                          handleRemoveCarNumber={this.handleRemoveCarNumber}
                        />
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="whiteList" title="화이트리스트">
                <div className="aligner-wrapper">
                  <div className="label-input-submit">
                    <div className="anpr-carNumber">
                      <label>차량 번호</label>
                      <input
                        type="text"
                        style={{width: '100px'}}
                        required="required"
                        placeholder="차량 번호"
                        name="carNumber"
                        value={this.state.modalCurrentCarNumber}
                        onChange={this.handleChangeCarNumber}
                      >
                      </input>
                      <p className='modalCarNumberWarn' style={{ color: 'red'}}>{this.state.modalCarNumberWarn}</p>
                    </div>
                    <div className="anpr-name">
                      <label>이름</label>
                      <input
                        type="text"
                        style={{width: '80px'}}
                        required="required"
                        placeholder="이름"
                        name="name"
                        value={this.state.modalCurrentName}
                        onChange={this.handleChangeName}
                      >
                      </input>
                      <p className='modalNameWarn' style={{ color: 'red'}}>{this.state.modalNameWarn}</p>
                    </div>
                    <div className="anpr-description">
                      <label>설명</label>
                      <input
                        type="text"
                        style={{width: '120px'}}
                        required="required"
                        placeholder="상세정보"
                        name="description"
                        value={this.state.modalCurrentDescription}
                        onChange={this.handleChangeDescription}
                      >
                      </input>
                    </div>
                    <Button className="anpr-submit" onClick={(event) => this.handleAddCarNumber(event,'white')}>등록</Button>
                  </div>
                  <div className="table-responsive">
                    <Table className="table table-striped">
                      <thead style={{ width: '518px' }}>
                        <tr>
                          <th style={{ width: '118px' }}>차량 번호</th>
                          <th style={{ width: '90px', minWidth: '90px' }}>이름</th>
                          <th style={{ width: '147px', minWidth: '147px' }}>설명</th>
                          <th style={{ width: '140px', minWidth: '140px' }}>리스트에서 삭제</th>
                        </tr>
                      </thead>
                      <tbody style={{ width: '518px' }} className="blackOrWhiteList-tbody">
                        <BlackOrWhite 
                          white
                          currentTabIndex={this.state.currentTabIndex}
                          carNumberList={this.state.carNumberList}
                          getCarNumberList={this.getCarNumberList}
                          handleRemoveCarNumber={this.handleRemoveCarNumber}
                        />
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.carNumberAlert}>
          <Modal.Header className="carNumberList">
            <Modal.Title>차량번호 중복</Modal.Title>
          </Modal.Header>
          <Modal.Body>입력하신 차량번호가 이미 등록되었습니다.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCarNumberAlert}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
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
    )
  }
}

export default BlackOrWhiteSetting;


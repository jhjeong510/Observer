import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class DateModalConfirm extends Component {

  render() {
    return (
      <div className='date-modalconfirm'>
        <Modal
        	size="sm"
        	show={this.props.showModal}
        	onHide={this.props.handleShowDateSelectAlert}
        	aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title>날짜 미입력</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>날짜를 입력하세요..</p>
          </Modal.Body>

          <Modal.Footer className="flex-wrap">
            <Button variant="success btn-sm m-2" onClick={this.props.handleShowDateSelectAlert}>확인</Button>
          </Modal.Footer>
        </Modal>         
      </div>
    );
  }
}

export default DateModalConfirm;
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { setAcknowledgeDetailEvent } from '../../dashboard/api/apiService';
import styles from './ModalAckConfirm.module.css';

export default function ModalAckConfirm({ showAlert, handleShowAlert, acknowledgeIdx, acknowledgeServiceType, userId }) {

  return (
    <Modal show={showAlert} centered>
      <Modal.Header>
        <Modal.Title>이벤트 알림 해제</Modal.Title>
      </Modal.Header>
      <Modal.Body>해당 이벤트의 알림을 해제하시겠습니까?</Modal.Body>
      <Modal.Footer>
        <button className={styles.button} onClick={() => { handleShowAlert(); setAcknowledgeDetailEvent(acknowledgeIdx, acknowledgeServiceType, userId); }}>
          예
        </button>
        <button className={styles.button} onClick={() => handleShowAlert()}>
          아니오
        </button>
      </Modal.Footer>
    </Modal>
  )
}
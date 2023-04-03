import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addBuilding } from '../../dashboard/api/apiService';

export default function AddBuildingModal({ show, setShow, message, title, callback, clickPoint, buildingList }) {
   const [modalCurrentBuilding, setModalCurrentBuilding] = useState('');
   const [modalWarnMessage, setModalWarnMessage] = useState('');

   const handleChangeCurrentBuilding = async (e) => {
      setModalCurrentBuilding(e.target.value);
   }

   const handleConfirm = () => {
      const checkDuplicateBuilding = buildingList.find((building) => building.name === modalCurrentBuilding);
      if (checkDuplicateBuilding) {
         setModalWarnMessage('*동일한 이름의 건물이 있습니다.');
         return
      }
      if (modalCurrentBuilding === undefined || modalCurrentBuilding === '' || modalCurrentBuilding === null) {
         setModalWarnMessage('*건물명을 입력하세요.');
         return
      }
      if (modalCurrentBuilding && modalCurrentBuilding.length >= 10) {
         setModalWarnMessage('*건물명이 글자수 제한을 초과했습니다.(10자 이내 입력)');
         return
      }
      try {
         addBuilding({
            name: modalCurrentBuilding,
            left_location: clickPoint.x,
            top_location: clickPoint.y,
            service_type: 'observer'
         })
      } catch (err) {
         console.log('건물 추가 오류: ', err)
      }
      handleCancel();
   }
   const handleCancel = () => {
      setModalCurrentBuilding('')
      setShow({ show: false });
   }

   return (
      <div className='AddBuildingModal'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header closeButton>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Form>
                     <Form.Group controlId="Idx">
                        <Form.Label>{message}</Form.Label>
                        <input className="form-control" onChange={handleChangeCurrentBuilding} value={modalCurrentBuilding || ''} placeholder='건물명을 입력하세요' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}>
                        </input>
                     </Form.Group>
                     <Form.Text style={{ color: 'red' }}>{modalWarnMessage}</Form.Text>
                  </Form>
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="primary" onClick={handleConfirm}> 추가
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}> 취소
                  </Button>
               </Modal.Footer>
            </Modal>
            :
            ''
         }
      </div>
   )
}
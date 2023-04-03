import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addGuardianlite } from '../../dashboard/api/apiService';

export default function AddGuardianliteModal({ show, setShow, messageName, messageIp, title, callback, clickPoint, deviceList, buildingInfo }) {
   const [inputs, setInputs] = useState({
      modalGuardianliteName: '',
      modalGuardianliteIpaddress: '',
   })
   const [modalWarnMessage, setModalWarnMessage] = useState('');

   const { modalGuardianliteName, modalGuardianliteIpaddress } = inputs;
   const handleChangeGuardianlite = async (e) => {
      const { value, name } = e.target;
      setInputs({
         ...inputs,
         [name]: value,
      })
   }

   const validateIpaddress = async (ip) => {
      const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (ipformat.test(ip)) {
         return true;
      } else {
         return false;
      }
   }

   const handleConfirm = async () => {
      try {
         const duplicateGuradian = deviceList && deviceList.find((guardianlite) => guardianlite.ipaddress === modalGuardianliteIpaddress);
         if (duplicateGuradian) {
            setModalWarnMessage('*동일한 IP의 가디언라이트가 있습니다.');
            return
         }
         const duplicateNameGuradian = deviceList && deviceList.find((guardianlite) => guardianlite.name === modalGuardianliteName);
         if (duplicateNameGuradian) {
            setModalWarnMessage('*동일한 이름의 가디언라이트가 있습니다.');
            return
         }
         if (modalGuardianliteName === undefined ||
            modalGuardianliteName === null ||
            modalGuardianliteName.length === 0) {
            setModalWarnMessage('*전원장치 이름을 입력하세요.');
            return
         } else if (modalGuardianliteName.length > 30) {
            setModalWarnMessage('*전원장치 이름은 최대 30자 입니다.');
            return
         } else if (modalGuardianliteIpaddress === undefined ||
            modalGuardianliteIpaddress === null ||
            modalGuardianliteIpaddress.length === 0) {
            setModalWarnMessage('*전원장치 IP Address를 입력하세요.');
            return
         } else if (await validateIpaddress(modalGuardianliteIpaddress) === false) {
            setModalWarnMessage('*잘못된 IP Address 형식입니다.');
            return
         }
   
         try {
            addGuardianlite({
               name: modalGuardianliteName,
               ipaddress: modalGuardianliteIpaddress,
               building_idx: buildingInfo ? buildingInfo.buildingIdx : 0,
               floor_idx: buildingInfo ? buildingInfo.floorIdx : 0,
               building_service_type: 'observer',
               left_location: JSON.stringify(clickPoint.x),
               top_location: JSON.stringify(clickPoint.y),
            })
         } catch (err) {
            console.log('가디언라이트 추가 오류: ', err)
         }
         handleCancel();
      } catch (err) {
         console.log(err)
      }
   }
   const handleCancel = () => {
      setShow({ show: false });
   }

   return (
      <div className='AddGuardianliteModal'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header closeButton>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Form>
                     <Form.Group controlId="formName">
                        <Form.Label>{messageName}</Form.Label>
                        <Form.Control type='text' maxLength='50' name='modalGuardianliteName' value={modalGuardianliteName} onChange={handleChangeGuardianlite} placeholder='전원장치 이름을 입력하세요' />
                     </Form.Group>
                     <Form.Group controlId="formIpaddress">
                        <Form.Label>{messageIp}</Form.Label>
                        <Form.Control type='text' maxLength='15' name='modalGuardianliteIpaddress' value={modalGuardianliteIpaddress} onChange={handleChangeGuardianlite} placeholder='전원장치 IP를 입력하세요' />
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
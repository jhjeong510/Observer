import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addMdet } from '../../dashboard/api/apiService';

export default function AddMDetModal({ show, setShow, message, title, callback, clickPoint, deviceList, buildingInfo }) {
   const [inputs, setInputs] = useState({
      modalCurrentMDet: '',
      modalMDetIpaddress: '',
      modalMDetLocation: '',
   })
   const [modalWarnMessage, setModalWarnMessage] = useState('');

   const { modalCurrentMDet, modalMDetIpaddress, modalMDetLocation } = inputs;

   const handleChangeMdet = async (e) => {
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
      if (modalCurrentMDet === undefined ||
         modalCurrentMDet === null ||
         modalCurrentMDet.length === 0) {
         setModalWarnMessage('*M-DET 이름을 입력하세요.');
         return
      } else if (modalCurrentMDet.length > 30) {
         setModalWarnMessage('*M-DET 이름은 최대 30자 입니다.');
         return
      } else if (modalMDetIpaddress === undefined ||
         modalMDetIpaddress === null ||
         modalMDetIpaddress.length === 0) {
         setModalWarnMessage('*M-DET IP Address를 입력하세요.');
         return
      } else if (await validateIpaddress(modalMDetIpaddress) === false) {
         setModalWarnMessage('*잘못된 IP Address 형식입니다.');
         return
      }

      const duplicateMDet = deviceList.find((device) => device.ipaddress === modalMDetIpaddress);
      if (duplicateMDet) {
         setModalWarnMessage('*동일한 IP의 M-DET이 있습니다.');
         return
      }

      if (modalMDetLocation === undefined ||
         modalMDetLocation === null ||
         modalMDetLocation.length === 0) {
         setModalWarnMessage('*M-DET의 설치위치명을 입력하세요.');
         return
      } else if (modalMDetLocation.length > 10) {
         setModalWarnMessage('*M-DET의 설치위치 명은 최대 10자입니다.');
         return
      }
      const mDetSameNameCheck = deviceList.find((device) => device.name === modalCurrentMDet);
      if (mDetSameNameCheck) {
         setModalWarnMessage('*동일한 이름의 M-DET이 있습니다.');
         return
      }

      try {
         addMdet({
            id: modalCurrentMDet,
            ipaddress: modalMDetIpaddress,
            buildingIdx: buildingInfo ? buildingInfo.buildingIdx : 0,
            floorIdx: buildingInfo ? buildingInfo.floorIdx : 0,
            buildingServiceType: buildingInfo ? buildingInfo.buildingServiceType : 0,
            left_location: JSON.stringify(clickPoint.x),
            top_location: JSON.stringify(clickPoint.y),
            type: 'mdet',
            location: modalMDetLocation,
         })
      } catch (err) {
         console.log('MDET 추가 오류: ', err)
      }
      handleCancel();
   }
   const handleCancel = () => {
      setShow({ show: false });
   }

   return (
      <div className='AddMdetModal'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header closeButton>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Form>
                     <Form.Group controlId="formName">
                        <Form.Label>이름 (*필수)</Form.Label>
                        <Form.Control type='text' maxLength='50' name='modalCurrentMDet' value={modalCurrentMDet} onChange={handleChangeMdet} placeholder='M-DET의 이름을 입력하세요.' />
                     </Form.Group>
                     <Form.Group controlId="formIpaddress">
                        <Form.Label>IP Address (*필수)</Form.Label>
                        <Form.Control type='text' maxLength='15' name='modalMDetIpaddress' value={modalMDetIpaddress} onChange={handleChangeMdet} placeholder='M-DET의 IP를 입력하세요.' />
                     </Form.Group>
                     <Form.Group controlId="formLocation">
                        <Form.Label>설치 위치 (*필수)</Form.Label>
                        <Form.Control type='text' maxLength='15' name='modalMDetLocation' value={modalMDetLocation} onChange={handleChangeMdet} placeholder='M-DET의 설치 위치를 입력하세요.' />
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
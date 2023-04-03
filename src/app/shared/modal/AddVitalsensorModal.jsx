import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addVitalsensor } from '../../dashboard/api/apiService';
import styles from './AddVitalsensorModal.module.css';


export default function AddVitalsensorModal({ show, setShow, message, title, callback, clickPoint, deviceList, buildingInfo }) {
   const [inputs, setInputs] = useState({
      modalCurrentVitalsensor: '',
      modalVitalsensorIpaddress: '',
      modalVitalsensorLocation: '',
   })
   const [modalCurrentVitalsensorMode, setModalCurrentVitalsensorMode] = useState('');
   const [modalWarnMessage, setModalWarnMessage] = useState('');

   const { modalCurrentVitalsensor, modalVitalsensorIpaddress, modalVitalsensorLocation } = inputs;
   const handleChangeVitalsensor = async (e) => {
      const { value, name } = e.target;
      setInputs({
         ...inputs,
         [name]: value,
      })
   }
   const handleChangeAddVitalsensorMode = (e) => {
      setModalCurrentVitalsensorMode(e.currentTarget.value)
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
      if (modalCurrentVitalsensor === undefined ||
         modalCurrentVitalsensor === null ||
         modalCurrentVitalsensor.length === 0) {
         setModalWarnMessage('*바이탈센서 이름을 입력하세요.');
         return
      } else if (modalCurrentVitalsensor.length > 30) {
         setModalWarnMessage('*바이탈센서 이름은 최대 30자 입니다.');
         return
      } else if (modalVitalsensorIpaddress === undefined ||
         modalVitalsensorIpaddress === null ||
         modalVitalsensorIpaddress.length === 0) {
         setModalWarnMessage('*바이탈센서 IP Address를 입력하세요.');
         return
      } else if (await validateIpaddress(modalVitalsensorIpaddress) === false) {
         setModalWarnMessage('*잘못된 IP Address 형식입니다.');
         return
      }

      const duplicateVitalsensor = deviceList.find((device) => device.ipaddress === modalVitalsensorIpaddress);
      if (duplicateVitalsensor) {
         setModalWarnMessage('*동일한 IP의 바이탈센서가 있습니다.');
         return
      }

      if (modalVitalsensorLocation === undefined ||
         modalVitalsensorLocation === null ||
         modalVitalsensorLocation.length === 0) {
         setModalWarnMessage('*바이탈센서 설치위치명을 입력하세요.');
         return
      } else if (modalVitalsensorLocation.length > 10) {
         setModalWarnMessage('*바이탈센서 설치위치 명은 최대 10자입니다.');
         return
      }
      if (modalCurrentVitalsensorMode === undefined ||
         modalCurrentVitalsensorMode === null ||
         modalCurrentVitalsensorMode.length === 0) {
         setModalWarnMessage('*바이탈센서 설치위치를 설정하세요.');
         return
      } 
      const vitalsensorSameNameCheck = deviceList.find((device) => device.name === modalCurrentVitalsensor);
      if (vitalsensorSameNameCheck) {
         setModalWarnMessage('*동일한 이름의 바이탈센서가 있습니다.');
         return
      }
   
      try {
         addVitalsensor({
            id: modalCurrentVitalsensor,
            ipaddress: modalVitalsensorIpaddress,
            buildingIdx: buildingInfo ? buildingInfo.buildingIdx : 0,
            floorIdx: buildingInfo ? buildingInfo.floorIdx : 0,
            buildingServiceType: buildingInfo ? buildingInfo.buildingServiceType : 0,
            left_location: JSON.stringify(clickPoint.x),
            top_location: JSON.stringify(clickPoint.y),
            type: 'vitalsensor',
            location: modalVitalsensorLocation,
            install_location: modalCurrentVitalsensorMode
         })
      } catch (err) {
         console.log('가디언라이트 추가 오류: ', err)
      }
      handleCancel();
   }
   const handleCancel = () => {
      setShow({ show: false });
   }

   return (
      <div className='AddVitalsensorModal'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header closeButton>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Form>
                     <Form.Group controlId="formName">
                        <Form.Label>이름 (*필수)</Form.Label>
                        <Form.Control type='text' maxLength='50' name='modalCurrentVitalsensor' value={modalCurrentVitalsensor} onChange={handleChangeVitalsensor} placeholder='바이탈센서의 이름을 입력하세요.' />
                     </Form.Group>
                     <Form.Group controlId="formIpaddress">
                        <Form.Label>IP Address (*필수)</Form.Label>
                        <Form.Control type='text' maxLength='15' name='modalVitalsensorIpaddress' value={modalVitalsensorIpaddress} onChange={handleChangeVitalsensor} placeholder='바이탈센서의 IP를 입력하세요.' />
                     </Form.Group>
                     <Form.Group controlId="formLocation">
                        <Form.Label>설치 위치 (*필수)</Form.Label>
                        <Form.Control type='text' maxLength='15' name='modalVitalsensorLocation' value={modalVitalsensorLocation} onChange={handleChangeVitalsensor} placeholder='바이탈센서의 설치 위치를 입력하세요.' />
                     </Form.Group>

                     <Form.Group controlId="formLocation">
                        <Form.Label>바이탈센서 설치위치</Form.Label>
                        {/* <div className='select-breath-mode'> */}
                        <div className={styles.select_breath_mode_1}>
                           
                           <Form.Check
                              className='breath-mode'
                              value='room'
                              type="radio"
                              aria-label="radio 1"
                              id={`custom-radio-`}
                              label='수감실 내부형'
                              // checked={sensor.use_status === 'true' ? true : false}
                              checked={modalCurrentVitalsensorMode === 'room'}
                              onChange={(e) => handleChangeAddVitalsensorMode(e)}
                              style={{ display: 'flex', right: '-152px', top: '10px', padding: 'none', margin: 'none', alignItem: 'center' }}

                           />
                        </div>

                        <div className={styles.select_breath_mode_2}>

                           <Form.Check
                              className='breath-mode'
                              value='ceiling'
                              type="radio"
                              aria-label="radio 2"
                              label='복도 천장형'
                              id={`custom-checkbox-`}
                              // checked={sensor.use_status === 'true' ? true : false}
                              checked={modalCurrentVitalsensorMode === 'ceiling'}
                              onChange={(e) => handleChangeAddVitalsensorMode(e)}
                              style={{ display: 'flex', right: '-152px', top: '10px', padding: 'none', margin: 'none', alignItem: 'center' }}
                           />
                        </div>
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
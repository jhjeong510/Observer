import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ebellInterlockCamera, doorInterlockCamera, vitalsensorInterlockCamera, pidsInterlockCamera, vCounterInterlockCamera, mDetInterlockCamera } from '../../dashboard/api/apiService';
import styles from './HandleInterlockCameraModal.module.css';

export default function HandleInterlockCameraModal({ show, setShow, message, title, callback, clickPoint, selectObject, cameraList, deviceList, breathSensorList, pidsList }) {
   const [modalCurrentCamera, setModalCurrentCamera] = useState(selectObject.data.camera_id ? selectObject.data.camera_id : undefined);
   const [modalBuildingWarn, setModalBuildingWarn] = useState('');

   const sortedCameraList = cameraList.sort((a, b) => a.cameraid > b.cameraid ? 1 : -1);
   const detailDoor = deviceList.find((door) => selectObject && door.id === selectObject.data.device_id);
   const detailSensor = breathSensorList.find((breathSensor) => selectObject && (breathSensor.ipaddress === selectObject.data.ipaddress));
   const detailZone = pidsList && pidsList.find((pids) => selectObject && (pids.pidsid === selectObject.data.id));
   const detailEbell = deviceList.find((ebell) => selectObject && (ebell.id === selectObject.data.device_id));
   const detailVCounter = deviceList.find((vcounter) => selectObject && (vcounter.id === selectObject.data.device_id));
   const detailMdet = deviceList.find((mdet) => selectObject && (mdet.idx === selectObject.data.idx));

   let iconType = '';
   if (selectObject) {
      switch (selectObject.data.type) {
         case 'ebell':
            iconType = detailEbell;
            break
         case 'door':
            iconType = detailDoor;
            break
         case 'vitalsensor':
            iconType = detailSensor;
            break
         case 'pids':
            iconType = detailZone;
            break
         case 'vcounter':
            iconType = detailVCounter;
            break
         case 'mdet':
            iconType = detailMdet;
            break
         default:
            break;
      }
   }
   const handleChangeCamera = (e) => {
      setModalCurrentCamera(e.currentTarget.value)
   }

   const handleConfirm = () => {
      if (iconType === detailEbell) {
         ebellInterlockCamera({
            cameraId: modalCurrentCamera,
            ipaddress: selectObject.data.ipaddress,
            id: selectObject.data.device_id,
            service_type: selectObject.data.service_type,
            type: selectObject.data.type,
         })
      } else if (iconType === detailDoor) {
         doorInterlockCamera({
            id: selectObject.data.device_id,
            cameraId: modalCurrentCamera,
            service_type: selectObject.data.service_type
         })
      } else if (iconType === detailSensor) {
         vitalsensorInterlockCamera({
            id: selectObject.data.device_id,
            cameraId: modalCurrentCamera,
            service_type: selectObject.data.service_type,
            type: selectObject.data.type,
         })
      } else if (iconType === detailZone) {
         pidsInterlockCamera({
            id: selectObject.data.id,
            cameraId: modalCurrentCamera,
            service_type: selectObject.data.service_type
         })
      } else if (iconType === detailVCounter) {
         vCounterInterlockCamera({
            id: selectObject.data.id,
            cameraId: modalCurrentCamera,
            service_type: selectObject.data.service_type
         })
      } else if (iconType === detailMdet) {
         mDetInterlockCamera({
            idx: selectObject.data.idx,
            cameraId: modalCurrentCamera,
            service_type: selectObject.data.service_type,
            type: selectObject.data.type
         })
      }
      handleCancel();
   }
   const handleCancel = () => {
      setShow({ show: false });
      setModalCurrentCamera('');
   }


   return (
      <div className='HandleAcknowledgeEventModal'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Form.Group controlId="Idx">
                     <Form.Label>{message}</Form.Label>
                     <select className={styles.form_control} onChange={handleChangeCamera} value={modalCurrentCamera}>
                        <option>{iconType && iconType.camera_id ? (iconType.camera_id + '.' + sortedCameraList.find((camera) => (camera.cameraid === iconType.camera_id)).cameraname) : '연동된 카메라 없음'}</option>
                        <option value={'none'} disabled>---------------------------------------------------------</option>
                        <option value={''}>선택 해제</option>
                        {sortedCameraList.map((camera, index) => {
                           return <option key={index} value={camera.cameraid}>{camera.cameraid}.{camera.cameraname}</option>
                        })}
                     </select>
                  </Form.Group>
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="primary" onClick={handleConfirm}>
                     확인
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                     취소
                  </Button>
               </Modal.Footer>
            </Modal>
            :
            ''
         }
      </div>
   )
}
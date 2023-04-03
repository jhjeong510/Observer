import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { removeBuilding, removeEbell, removeCamera, removeDoor, removeGuardianlite, removeVitalsensor, removeFence, removeVCounter, removeMdet } from '../../dashboard/api/apiService';

export default function RemoveIconModal({ show, setShow, message, title, callback, clickPoint, selectObject }) {
   let iconType = '';
   if (selectObject) {
      switch (selectObject.data.type) {
         case 'building':
            iconType = '건물';
            break;
         case 'ebell':
            iconType = '비상벨';
            break
         case 'camera':
            iconType = '카메라';
            break
         case 'door':
            iconType = '출입문';
            break
         case 'guardianlite':
            iconType = '전원장치';
            break
         case 'vitalsensor':
            iconType = '바이탈센서';
            break
         case 'pids':
            iconType = '펜스(Zone)';
            break
         case 'vcounter':
            iconType = 'V-Counter';
            break
         case 'mdet':
            iconType = 'M-DET';
            break
         default:
            break;
      }
   }

   const handleConfirm = () => {
      if (iconType === '건물') {
         removeBuilding({
            name: selectObject.data.name,
            type: selectObject.data.type,
            service_type: 'observer'
         })
      } else if (iconType === '비상벨') {
         removeEbell({
            ipaddress: selectObject.data.ipaddress
         })
      } else if (iconType === '카메라') {
         removeCamera({
            id: selectObject.data.device_id,
            service_type: selectObject.data.service_type
         })
      } else if (iconType === '출입문') {
         removeDoor({
            id: selectObject.data.device_id,
            service_type: selectObject.data.service_type
         })
      } else if (iconType === '전원장치') {
         removeGuardianlite({
            idx: selectObject.data.idx,
            service_type: selectObject.data.service_type
         })
      } else if (iconType === '바이탈센서') {
         removeVitalsensor({
            idx: selectObject.data.idx,
            service_type: selectObject.data.service_type
         })
      } else if (iconType === '펜스(Zone)') {
         removeFence({
            id: selectObject.data.id,
         })
      } else if (iconType === 'V-Counter') {
         removeVCounter({
            id: selectObject.data.device_id,
            ipaddress: selectObject.data.ipaddress,
         })
      } else if (iconType === 'M-DET') {
         removeMdet({
            idx: selectObject.data.idx,
            ipaddress: selectObject.data.ipaddress,
         })
      }
      handleCancel();
   }
   const handleCancel = () => {
      setShow({ show: false });
   }

   return (
      <div className='modalconfirm'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header>
                  <Modal.Title>{iconType + ' 삭제'}</Modal.Title>
               </Modal.Header>
               <Modal.Body>{(iconType === '카메라' || iconType === '전원장치' || iconType == '바이탈센서' || iconType == 'V-Counter' || iconType === 'M-DET') ? '해당 ' + iconType + '를 ' + message : '해당 ' + iconType + '을 ' + message}</Modal.Body>
               <Modal.Footer>
                  <Button variant="primary" onClick={handleConfirm}>
                     삭제
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
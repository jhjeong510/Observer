import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { removeBuilding } from '../../dashboard/api/apiService';
import ColorPicker from '../../dashboard/handlers/ColorPicker';

export default function ModifyIcon({ show, setShow, message, title, inside, selectObject, canvas, color }) {
   let iconType = '';
   if (selectObject && selectObject._objects) {
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

      } else if (iconType === '카메라') {

      } else if (iconType === '출입문') {

      } else if (iconType === '전원장치') {

      } else if (iconType === '바이탈센서') {

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
               <Modal.Body>{iconType === '카메라' || iconType === '전원장치' || iconType == '바이탈센서' ? '해당 ' + iconType + '를 ' + message : '해당 ' + iconType + '을 ' + message}
                  <p><label>color</label> <ColorPicker canvas={canvas} color={color} /> </p>
               </Modal.Body>
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
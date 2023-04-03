import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { setAcknowledge } from '../../dashboard/api/apiService';
import { UserInfoContext } from '../../context/context';

export default function HandleAcknowledgeEventModal({ show, setShow, message, title, callback, clickPoint, selectObject, floorImageLists, eventInfo, handleInquiryEvents }) {
   const contextType = UserInfoContext;

   const handleConfirm = () => {
      if (eventInfo && eventInfo != undefined) {
         try {
            setAcknowledge({
               idx: eventInfo.idx,
               device_id: eventInfo.device_id,
               device_type: eventInfo.device_type,
               service_type: eventInfo.service_type,
               acknowledge_user: contextType && contextType._currentValue.id
            })
         } catch (err) {
            console.log('이벤트 확인 처리 오류: ', err);
         }
         handleCancel();
      } else {
         const device_id = selectObject.data.device_id;
         const device_type = selectObject.data.device_type;
         const service_type = selectObject.data.service_type;
         const ipaddress = selectObject.data.ipaddress;
         try {
            setAcknowledge({
               device_id,
               device_type,
               service_type,
               ipaddress,
               acknowledge_user: contextType && contextType._currentValue.id
            })
         } catch (err) {
            console.log('이벤트 확인 처리 오류: ', err);
         }
         handleCancel();
      }
   }
   const handleCancel = async (e) => {
      if (eventInfo && eventInfo != undefined) {
         setShow.show = false;
         await handleInquiryEvents(e, '', 'noLimit');
      } else {
         setShow({ show: false });
      }
   }

   return (
      <div className='HandleAcknowledgeEventModal'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>{message}</Modal.Body>
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
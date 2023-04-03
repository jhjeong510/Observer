import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function WarningMsgModal({ show, setShow, message, title }) {
   const handleCancel = () => {
      setShow({ show: false });
   }

   return (
      <div className='modalconfirm'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>{message}</Modal.Body>
               <Modal.Footer>
                  <Button variant="primary" onClick={handleCancel}>
                     확인
                  </Button>
               </Modal.Footer>
            </Modal>
            :
            ''
         }
      </div>
   )
}
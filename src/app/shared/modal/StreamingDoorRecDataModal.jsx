import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { accessEventRec } from '../../dashboard/api/apiService';
import noEvent from '../../dashboard/icons/ebell.ico';
import loading from '../../dashboard/icons/ebell.ico';

export default function StreamingDoorRecDataModal({ show, setShow, message, title, callback, clickPoint, deviceList, selectObject, socketClient }) {
   const [doorCameraArchive, setDoorCameraArchive] = useState(undefined);
   const [videoURL, setVideoURL] = useState(undefined);

   const detailDevice = deviceList.find((device) => selectObject && device.id === selectObject.device_id);
   const socket = socketClient;

   useEffect(() => {
      let isLoaded = true;
      (async () => {
         try {
            if (isLoaded) {
               if (detailDevice) {
                  const res = await accessEventRec({
                     deviceInfo: detailDevice.name,
                     deviceType: detailDevice.type
                  })
                  if (res && res.data && res.data.result && res.data.result.startDateTime) {
                     if (socket) {
                        if (doorCameraArchive) {
                           socket.emit('cameraArchive', {
                              cameraId: doorCameraArchive.cameraId,
                              startDateTime: doorCameraArchive.startDateTime,
                              cmd: 'off'
                           });
                        }
                        setDoorCameraArchive(
                           {
                              cameraId: detailDevice.camera_id,
                              startDateTime: res.data.result.startDateTime
                           }
                           , () => {
                              socket.emit('cameraArchive', {
                                 cameraId: doorCameraArchive.cameraId,
                                 startDateTime: doorCameraArchive.startDateTime,
                                 cmd: 'on'
                              });
                              socket.on('cameraArchive', (received) => {
                                 if (doorCameraArchive && (received.cameraId === doorCameraArchive.cameraId && received.startDateTime === doorCameraArchive.startDateTime)) {
                                    setVideoURL(`${'data:image/jpeg;base64,' + received.data}`);
                                 }
                              });
                              setVideoURL(loading);
                           })
                     }
                  } else {
                     setVideoURL(noEvent);
                  }
               }
            }
         } catch (err) {
            console.log('출입문 영상 재생 오류: ', err)
         }
         return async () => {
            isLoaded = false;
            await socket.emit('cameraArchive', {
               cameraId: doorCameraArchive.camera_id,
               startDateTime: doorCameraArchive.startDateTime,
               cmd: 'off'
            });
            setDoorCameraArchive(undefined);
            setVideoURL(undefined);
         }
      })();
   }, [])

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
               <Modal.Body>
                  <Form>
                     <Form.Label>{message}</Form.Label>
                     <Form.Group controlId="Idx" className='doorCameraArchive'>
                        {videoURL !== loading ? <img style={{ width: "100%" }} src={videoURL} /> : <img src={videoURL} />}
                     </Form.Group>
                  </Form>
               </Modal.Body>
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
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addFloor } from '../../dashboard/api/apiService';

export default function AddFloorModal({ show, setShow, message, title, callback, clickPoint, selectObject, floorImageLists, floorList }) {
   const [inputs, setInputs] = useState({
      modalCurrentFloor: '',
      modalGroupImageId: '',
      // floorImageList: [],
   })
   const [modalWarnMessage, setModalWarnMessage] = useState('');

   const { modalCurrentFloor, modalGroupImageId, floorImageList } = inputs;
   const handleChangeFloor = async (e) => {
      const { value, name } = e.target;
      setInputs({
         ...inputs,
         [name]: value,
      })
   }

   const handleConfirm = () => { 
      const floorSameNameCheck = floorList.find((floor) => (
         (selectObject.data.buildingIdx === floor.building_idx) && (floor.name === modalCurrentFloor)
      ));
      if (modalCurrentFloor === undefined || modalCurrentFloor === '') {
         setModalWarnMessage('*층 이름을 입력하세요.');
         return
      }
      if (modalGroupImageId === undefined || modalGroupImageId === '') {
         setModalWarnMessage('*층 이미지를 선택하세요.');
         return
      }
      if (modalCurrentFloor && modalCurrentFloor.length > 10) {
         setModalWarnMessage('*층이름 글자수 제한을 초과했습니다. (10자 이내)');
         return
      }

      if (modalCurrentFloor && modalCurrentFloor.length > 10) {
         setModalWarnMessage('*층이름 글자수 제한을 초과했습니다. (10자 이내)');
         return
      }
      if (floorSameNameCheck) {
         setModalWarnMessage('동일한 이름의 층정보가 있습니다.');
         return
      }
      // if (addFloorCheck) {
      //    setModalWarnMessage('*층 추가 작업이 이미 진행 중입니다.');
      //    return
      // }
      try {
         addFloor({
            name: modalCurrentFloor,
            buildingIdx: selectObject.data.buildingIdx,
            mapImage: modalGroupImageId,
            service_type: 'observer'
         })
      } catch (err) {
         console.log('층 추가 오류: ', err);
      }
      handleCancel();
   }
   const handleCancel = () => {
      setShow({ show: false });
      setModalWarnMessage('');
   }

   return (
      <div className='AddFloorModal'>
         {show ?
            <Modal show={show} onHide={handleCancel} animation={true}>
               <Modal.Header closeButton>
                  <Modal.Title>{title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Form>
                     <Form.Group controlId="Idx">
                        <Form.Label>층 이름 입력 (*필수)</Form.Label>
                        <input className="form-control" name='modalCurrentFloor' onChange={handleChangeFloor} value={modalCurrentFloor || ''} placeholder='층 이름을 입력하세요'>
                        </input>
                        <br />
                        <Form.Group controlId="formFloorId">
                           <Form.Label>평면도(층) 이미지 (*필수)</Form.Label>
                           <select className="form-control" name='modalGroupImageId' onChange={handleChangeFloor} value={modalGroupImageId || ''}>
                              <option></option>
                              {floorImageLists && floorImageLists.map((image, index) => (
                                 <option key={index} value={image.name}> {image.name} </option>
                              ))}
                           </select>
                        </Form.Group>
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
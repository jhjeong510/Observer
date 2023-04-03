import React, { useState, useEffect } from 'react';
import { getParkingArea, getParkingSpace, removeSpace } from './api/apiService';
import styles from './ParkingCameraSetting.module.css';
import styled from 'styled-components'
import Tree from '@idui/react-tree'
import ModalConfirm from './ModalConfirm';

const CustomLeaf = styled.div`
  display: flex;
  color: #e0e0e0;
  margin-left: 1rem;
  margin-bottom: 2px;
`;

export default function ParkingCameraSetting({ parkingCamera, parkingAreaUpdate, parkingSpaceUpdate }) {

  const [areas, setAreas] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [modalConfirm, setModalConfirm] = useState({
    showModal: false,
    modalTitle: '',
    modalMessage: ''
  });
  const [removeIdx, setRemoveIdx] = useState(null);

  const readAreas = async () => {
    if (parkingCamera) {
      const res = await getParkingArea(parkingCamera.ipaddress);
      if (res && res.data && res.data.result) {
        await setAreas(res.data.result);
      }
    }
  }

  const readSpaces = async () => {
    if (parkingCamera) {
      const res = await getParkingSpace(parkingCamera.ipaddress);
      if (res && res.data && res.data.result) {
        await setSpaces(res.data.result);
      }
    }
  }

  const handleConfirm = async (removeIdx) => {
    const res = await removeSpace({ idx: removeIdx });
    if (res && res.data && res.data.status && res.data.status === 'success') {
      return await setModalConfirm({
        showModal: false,
        modalTitle: '',
        modalMessage: '',
      });
    } else {
      console.error('remove parking space detail err: ', res);
      return await setModalConfirm((prev) => ({
        ...prev,
        modalMessageWarn: '주차 구역 삭제에 실패했습니다.'
      }));
    }
  }

  const handleCancel = async () => {
    await setModalConfirm({
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalMessageWarn: '',
    });
  }

  const selectNode = async (idx) => {
    const modalObj = {
      showModal: true,
      modalTitle: '주차 구역 삭제',
      modalMessage: '해당 구역을 삭제하시겠습니까?',
    }
    await setRemoveIdx(idx);
    await setModalConfirm(modalObj);
  }

  const renderCustomLeaf = ({ toggle, isOpen, type, id, idx, camera_ip, label, icon, hasChildren }) => (
    <CustomLeaf hasChildren={hasChildren} onClick={toggle}>
      &nbsp;{hasChildren && (isOpen ? '▼' : '▶') + '  '}
      <span id={id} className={styles.nodeDetail} >
        <span className={type === 'area' ? styles.areaDetail : styles.spaceDetail}>{(type !== 'area' && id) && '-  '}{label}{type !== 'area' && (type === 0 ? '  (일반)' : (type === 1 ? '  (경차)' : (type === 2 ? '  (장애인)' : (type === 3 ? '  (전기차)' : (type === 4 ? '  (비주차)' : '')))))}</span>
        {(type !== 'area' && id) && <span className={styles.removeIcon} onClick={() => selectNode(idx)}><i className="mdi mdi-delete"></i></span>}
      </span>
    </CustomLeaf>
  );

  const nodes = areas.map((areaDetail) => ({
    id: areaDetail.idx,
    idx: areaDetail.idx,
    label: areaDetail.display_name ? areaDetail.display_name : areaDetail.name,
    name: areaDetail.name,
    display_name: areaDetail.display_name,
    type: 'area',
    camera_ip: areaDetail.camera_ip,
    isOpen: false,
    childNodes: spaces.length > 0 && spaces.filter((spaceDetail) => (spaceDetail.camera_ip === areaDetail.camera_ip) && (spaceDetail.parking_area === areaDetail.name)).map((spaceDetail) => {
      return ({
        id: spaceDetail.idx,
        camera_ip: spaceDetail.camera_ip,
        parking_area: spaceDetail.parking_area,
        label: spaceDetail.parking_area + spaceDetail.index_number,
        type: spaceDetail.type,
        idx: spaceDetail.idx,
        occupancy: spaceDetail.occupancy,
        isOpen: false,
      })
    })
  })).concat(spaces.length > 0 && spaces.filter((spaceDetail) => !areas.find((areaDetail) => areaDetail.name === spaceDetail.parking_area)).map((spaceDetail => {
    return ({
      id: spaceDetail.idx,
      camera_ip: spaceDetail.camera_ip,
      parking_area: spaceDetail.parking_area,
      label: spaceDetail.parking_area + spaceDetail.index_number,
      type: spaceDetail.type,
      idx: spaceDetail.idx,
      occupancy: spaceDetail.occupancy,
      isOpen: false,
    })
  })));

  useEffect(() => {
    if (parkingCamera) {
      readAreas();
      readSpaces();
    }
  }, [])

  useEffect(() => {
    parkingAreaUpdate && readAreas();
  }, [parkingAreaUpdate])

  useEffect(() => {
    parkingSpaceUpdate && readSpaces();
  }, [parkingSpaceUpdate])

  if (parkingCamera) {
    return (
      <>
        <header>
          <span className={styles.displayCamera}>{parkingCamera.name}&nbsp;({parkingCamera.ipaddress})</span>
        </header>
        <div className={styles.content}>
          <span className={styles.area_label}>그룹명</span>
          <div className={styles.parkingCamera_tree}>
            <Tree
              childrenOffset="20px"
              highlightClassName="highlight"
              nodes={nodes}
              renderLeaf={renderCustomLeaf}
              searchBy="label"
            />
          </div>
        </div>
        <ModalConfirm
          showModal={modalConfirm.showModal}
          modalTitle={modalConfirm.modalTitle}
          modalMessage={modalConfirm.modalMessage}
          modalMessageWarn={modalConfirm.modalMessageWarn}
          removeIdx={removeIdx}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      </>
    )
  }
}
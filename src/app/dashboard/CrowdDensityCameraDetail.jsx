import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import CrowdDensityThresholdModal from '../shared/modal/CrowdDensityThresholdModal';
import styles from './CrowdDensityCameraDetail.module.css';
import { handleCloseContext } from './handlers/ContextMenuHandler';
import CrowdDensityChart from './CrowdDensityChart';

export default function CrowdDensityCameraDetail({ crowdDensityCamera, crowdDensityCamera: { name, camera_id, threshold, idx, id, status }, selectedCameraId, crowdDensityCountingLog, crowdDensityCameraOnEvent }) {
  const [crowdDensityThresholdModal, setCrowdDensityThresholdModal] = useState({ show: false, title: '', message: '' });
  const [updateCrowdDensityCameraName, setUpdateCrowdDensityCameraName] = useState({ show: false, title: '', message: '' });
  const [countAverage, setCountAverage] = useState('');

  const handleShowSetThreshold = () => {
    setCrowdDensityThresholdModal({ show: true, title: '임계치 설정' });
    handleCloseContext();
  }

  useEffect(() => {
    try {
      if (crowdDensityCountingLog && crowdDensityCountingLog.length > 0) {
        setCountAverage(crowdDensityCountingLog.find((item)=> item.name === crowdDensityCamera.name).count_average);
      }
    } catch (err) {
      console.log(err)
    }
  }, [crowdDensityCountingLog, crowdDensityCamera])

  return (
    <div className={styles.detail_root}>
      <header className={styles.header}>
        <h4 className={styles.crowd_density_camera_title}>{name}</h4>
        <div className={styles.btn_menu}>
          {/* <span className={styles.name_edit_btn}>
          <i className="fa fa-edit"></i>
        </span>
        <span className={styles.delete_btn}>
          <i className='mdi mdi-delete-forever'></i>
        </span> */}
          <Button onClick={handleShowSetThreshold}>임계치 설정</Button>
          <p className={styles.headerCountAverage}>
            {countAverage ? countAverage : ''}
          </p>
        </div>
      </header>
      <CrowdDensityChart
        selectedCameraId={selectedCameraId}
        crowdDensityCountingLog={crowdDensityCountingLog}
        crowdDensityCameraName={name}
        crowdDensityCameraThreshold={threshold}
        crowdDensityCameraIdx={idx}
        crowdDensityCameraId={camera_id}
        crowdDensityCameraOrigin={id}
        occurEvent={crowdDensityCameraOnEvent === camera_id}
        status={status}
      />
      {crowdDensityThresholdModal.show ? <CrowdDensityThresholdModal show={crowdDensityThresholdModal.show} setShow={setCrowdDensityThresholdModal} message={crowdDensityThresholdModal.message} title={crowdDensityThresholdModal.title} threshold={threshold} idx={idx} /> : null}
    </div>
  )
}
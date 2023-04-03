import React from 'react';
import styles from './ContextMenuModal.module.css';

export default function ContextMenuModal({
  indoor,
  handleShowModalBuilding,
  handleShowModalFloor,
  handleShowModalCamera,
  handleShowModalEbell,
  handleShowModalDoor,
  handleShowModalVitalSensor,
  handleShowModalMdet,
  handleVitalsensorScheduleGroup,
  handleVitalsensorValueGroup,
  handleOnOffVitalsensor,
  handleBreathEventLog,
  handleInterlockCamera,
  handleShowModalAckAllEvents,
  handleShowModalGuardianlite,
  handleLockDoor,
  handleUnlock10sDoor,
  handleUnLockDoor,
  handleDoorLog,
  handleAddPidsModal,
  handleRemovePidsModal,
  handleShowModalModifyBuilding,
  handleChangeIcon,
  handleRemoveIcon,
  handleRemoveFloor,
  handleClickNothing,
  handleShowDevicePopUp,
  drawStraight,
  handleShowEventDetail,
  handleShowModalVCounter
}) {
  if (indoor) {
    return (
      <>
        <div className={styles.menuMapAddIcon}>
          <div>
            <button onClick={handleShowModalCamera} onContextMenu={handleClickNothing}>카메라 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalDoor} onContextMenu={handleClickNothing}>출입문 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalVitalSensor} onContextMenu={handleClickNothing}>바이탈센서 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalGuardianlite} onContextMenu={handleClickNothing}>전원장치 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalVCounter} onContextMenu={handleClickNothing}>V-Counter 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalEbell} onContextMenu={handleClickNothing}>비상벨 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalMdet} onContextMenu={handleClickNothing}>MDET 추가</button>
          </div>
        </div>
        <div className={styles.menuMapCameraContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>카메라 삭제</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleShowModalAckAllEvents} onContextMenu={handleClickNothing}>전체 이벤트 알림 해제</button>
          </div>
        </div>
        <div className={styles.menuMapEbellContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>비상벨 삭제</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>비상벨 연동 카메라 설정</button>
          </div>
        </div>
        <div className={styles.menuMapDoorContext}>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleLockDoor} onContextMenu={handleClickNothing}>출입문 잠금</button>
          </div>
          <div>
            <button onClick={handleUnlock10sDoor} onContextMenu={handleClickNothing}>출입문 잠금 해제(10초)</button>
          </div>
          <div>
            <button onClick={handleUnLockDoor} onContextMenu={handleClickNothing}>출입문 잠금 해제</button>
          </div>
          <div>
            <button onClick={handleDoorLog} onContextMenu={handleClickNothing}>출입 기록 조회</button>
          </div>
          <div>
            <button onClick={handleShowEventDetail} onContextMenu={handleClickNothing}>직전 이벤트 영상 보기</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>출입문 연동 카메라 설정</button>
          </div>
          <div>
            <button onClick={handleShowModalAckAllEvents} onContextMenu={handleClickNothing}>이벤트 알림 해제</button>
          </div>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>출입문 삭제</button>
          </div>
        </div>
        <div className={styles.menuMapVitalsensorContext}>
          <div>
            <button onClick={handleOnOffVitalsensor} onContextMenu={handleClickNothing}>센서동작 ON/OFF</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleVitalsensorScheduleGroup} onContextMenu={handleClickNothing}>스케줄 그룹 할당</button>
          </div>
          <div>
            <button onClick={handleVitalsensorValueGroup} onContextMenu={handleClickNothing}>임계치 설정</button>
          </div>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>바이탈센서 삭제</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>바이탈센서 연동 카메라 설정</button>
          </div>
          <div>
            <button onClick={handleShowModalAckAllEvents} onContextMenu={handleClickNothing}>이벤트 알림 해제</button>
          </div>
          <div>
            <button onClick={handleBreathEventLog} onContextMenu={handleClickNothing}>이벤트 조회</button>
          </div>
        </div>
        <div className={styles.menuMapGuardianliteContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>전원장치 삭제</button>
          </div>
        </div>
        <div className={styles.menuMapVCounterContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>V-Conter 삭제</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>V-Counter 연동 카메라 설정</button>
          </div>
        </div>
        <div className={styles.menuMapMdetContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>M-DET 삭제</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>M-DET 연동 카메라 설정</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleShowModalAckAllEvents} onContextMenu={handleClickNothing}>전체 이벤트 알림 해제</button>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className={styles.menuMapAddIcon}>
          <div>
            <button onClick={handleShowModalBuilding} onContextMenu={handleClickNothing}>건물 추가 </button>
          </div>
          <div>
            <button onClick={handleShowModalCamera} onContextMenu={handleClickNothing}>카메라 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalEbell} onContextMenu={handleClickNothing}>비상벨 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalGuardianlite} onContextMenu={handleClickNothing}>전원장치 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalVCounter} onContextMenu={handleClickNothing}>V-Counter 추가</button>
          </div>
          <div>
            <button onClick={handleShowModalMdet} onContextMenu={handleClickNothing}>MDET 추가</button>
          </div>
          <li className={styles.separator} />
          <div>
            <button onClick={handleAddPidsModal} onContextMenu={handleClickNothing}>PIDS 추가</button>
          </div>
          <div>
            <button onClick={handleRemovePidsModal} onContextMenu={handleClickNothing}>PIDS 삭제</button>
          </div>
          <li className={styles.separator} />
          <div>
            <button onClick={drawStraight} onContextMenu={handleClickNothing}>울타리 추가</button>
          </div>
        </div>
        <div className={styles.menuMapBuildingContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>건물 삭제</button>
          </div>
          <div>
            <button onClick={handleShowModalModifyBuilding} onContextMenu={handleClickNothing}>건물명 수정</button>
          </div>
          <li className={styles.separator} />
          <div>
            <button onClick={handleShowModalFloor} onContextMenu={handleClickNothing}>건물 내 층 추가</button>
          </div>
          <div>
            <button onClick={handleRemoveFloor} onContextMenu={handleClickNothing}>건물 내 층 삭제</button>
          </div>
          {/* <div>
            <button onClick={handleChangeIcon} onContextMenu={handleClickNothing}>아이콘 관리</button>
          </div> */}
        </div>
        <div className={styles.menuMapCameraContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>카메라 삭제</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleShowModalAckAllEvents} onContextMenu={handleClickNothing}>이벤트 알림 해제</button>
          </div>
        </div>
        <div className={styles.menuMapEbellContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>비상벨 삭제</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>연동 카메라 설정</button>
          </div>
        </div>
        <div className={styles.menuMapPidsContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>울타리 삭제</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>카메라 연동</button>
          </div>
          <div>
            <button onClick={handleShowModalAckAllEvents} onContextMenu={handleClickNothing}>이벤트 알림 해제</button>
          </div>
        </div>
        <div className={styles.menuMapGuardianliteContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>전원장치 삭제</button>
          </div>
        </div>
        <div className={styles.menuMapVCounterContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>V-Conter 삭제</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>V-Counter 연동 카메라 설정</button>
          </div>
        </div>
        <div className={styles.menuMapMdetContext}>
          <div>
            <button onClick={handleRemoveIcon} onContextMenu={handleClickNothing}>M-DET 삭제</button>
          </div>
          <div>
            <button onClick={handleInterlockCamera} onContextMenu={handleClickNothing}>M-DET 연동 카메라 설정</button>
          </div>
          <div>
            <button onClick={() => handleShowDevicePopUp('onlyCamera')} onContextMenu={handleClickNothing}>카메라 영상</button>
          </div>
          <div>
            <button onClick={handleShowModalAckAllEvents} onContextMenu={handleClickNothing}>전체 이벤트 알림 해제</button>
          </div>
        </div>
      </>
    );
  }

}
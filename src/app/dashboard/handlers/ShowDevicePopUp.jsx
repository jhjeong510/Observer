export default async function ShowDevicePopUp(objectDetail, canvas, popUpType, isEvent, eventName) {
  if (canvas && canvas.id === undefined) {
    const { positionX, positionY, indication_line } = await handlePosition(objectDetail, popUpType, isEvent);
    if (objectDetail.target.data.type !== 'guardianlite') {
      return {
        eventName,
        popUpType,
        position: { x: positionX, y: positionY },
        clientHeight: objectDetail.e.target.clientHeight,
        clientWidth: objectDetail.e.target.clientWidth,
        device_id: objectDetail.target.data.device_id,
        cameraId: objectDetail.target.data.cameraid ? objectDetail.target.data.cameraid : objectDetail.target.data.camera_id,
        deviceName: objectDetail.target.data.name,
        cameraName: objectDetail.target.data.cameraname,
        ipaddress: objectDetail.target.data.ipaddress,
        buildingName: isEvent ? objectDetail.target.data.buildingname : objectDetail.target.data.buildingName,
        floorName: isEvent ? objectDetail.target.data.floorname : objectDetail.target.data.floorName,
        location: objectDetail.target.data.location,
        type: objectDetail.target.data.type,
        serviceType: objectDetail.target.data.service_type,
        indication_line,
      };
    } else {
      return {
        popUpType,
        position: { x: positionX, y: positionY },
        clientHeight: objectDetail.e.target.clientHeight,
        clientWidth: objectDetail.e.target.clientWidth,
        device_id: objectDetail.target.data.device_id,
        cameraId: objectDetail.target.data.camera_id,
        deviceName: objectDetail.target.data.name,
        cameraName: objectDetail.target.data.cameraname,
        ipaddress: objectDetail.target.data.ipaddress,
        buildingName: isEvent ? objectDetail.target.data.buildingname : objectDetail.target.data.buildingName,
        floorName: isEvent ? objectDetail.target.data.floorname : objectDetail.target.data.floorName,
        location: objectDetail.target.data.location,
        type: objectDetail.target.data.type,
        serviceType: objectDetail.target.data.service_type,
        indication_line,
        guardianliteInfo: {
          gl_idx: objectDetail.target.data.gl_idx,
          ch1: objectDetail.target.data.ch1,
          ch2: objectDetail.target.data.ch2,
          ch3: objectDetail.target.data.ch3,
          ch4: objectDetail.target.data.ch4,
          ch5: objectDetail.target.data.ch5,
          temper: objectDetail.target.data.temper,
          gl_id: objectDetail.target.data.gl_id,
          password: objectDetail.target.data.password
        }
      };
    }

  }
}

const handlePosition = async (objectDetail, popUpType, isEvent) => {
  let positionX;
  let positionY;
  let indication_line = 'default';
  let moveLeft;
  let moveTop;
  if (isEvent) {
    if (objectDetail.target.data.type !== 'zone' && objectDetail.target.data.type !== 'vitalsensor' && objectDetail.target.data.type !== 'guardianlite') {
      const { top_location, left_location, camera_id } = objectDetail.target.data;
      let modalWidth = 0.18541667;
      let modalHeight = 0.3126;
      if ((parseFloat(left_location) + (objectDetail.e.target.clientWidth * modalWidth) + (objectDetail.e.target.clientWidth * 0.025)) >= objectDetail.e.target.clientWidth) {
        positionX = (parseFloat(left_location) - ((objectDetail.e.target.clientWidth * modalWidth) + (objectDetail.e.target.clientWidth * 0.025)));
        moveLeft = true;
      } else {
        positionX = (parseFloat(left_location) + (objectDetail.e.target.clientWidth * 0.025));
      }
      if ((parseFloat(top_location) + (objectDetail.e.target.clientHeight * (modalHeight + 0.013)) >= objectDetail.e.target.clientHeight)) {
        positionY = (parseFloat(top_location) - ((objectDetail.e.target.clientHeight * (modalHeight - 0.013))));
        moveTop = true;
      } else {
        positionY = parseFloat(top_location);
      }
      if (moveLeft && moveTop) {
        indication_line = 'left_top';
      } else if (moveLeft && !moveTop) {
        indication_line = 'left';
      } else if (!moveLeft && moveTop) {
        indication_line = 'top';
      }
    } else if (objectDetail.target.data.type === 'zone') {
      const { line_x1, line_x2, line_y1, line_y2 } = objectDetail.target.data;
      let width = 0.18541667;
      let height = 0.3126;
      if ((((parseFloat(line_x2) + parseFloat(line_x1)) / 2) + (objectDetail.e.target.clientWidth * 0.02) + (objectDetail.e.target.clientWidth * width)) >= objectDetail.e.target.clientWidth) {
        positionX = (((parseFloat(line_x2) + parseFloat(line_x1)) / 2) - ((objectDetail.e.target.clientWidth * width) + (objectDetail.e.target.clientWidth * 0.02)));
        moveLeft = true;
      } else {
        positionX = (((parseFloat(line_x2) + parseFloat(line_x1)) / 2) + (objectDetail.e.target.clientWidth * 0.02));
      }
      if ((((parseFloat(line_y2) + parseFloat(line_y1)) / 2) + (objectDetail.e.target.clientHeight * height)) >= objectDetail.e.target.clientHeight) {
        positionY = (((parseFloat(line_y2) + parseFloat(line_y1)) / 2) - ((objectDetail.e.target.clientHeight * height) - (objectDetail.e.target.clientHeight * 0.027)));
        moveTop = true;
      } else {
        positionY = ((parseFloat(line_y2) + parseFloat(line_y1)) / 2) - objectDetail.e.target.clientHeight * 0.03;
      }
      if (moveLeft && moveTop) {
        indication_line = 'left_top';
      } else if (moveLeft && !moveTop) {
        indication_line = 'left';
      } else if (!moveLeft && moveTop) {
        indication_line = 'top';
      }
    } else if (objectDetail.target.data.type === 'vitalsensor') {
      const { top_location, left_location, camera_id } = objectDetail.target.data;
      console.log(camera_id);
      let width = 0.18541667;
      let height;
      if (camera_id) {
        height = 0.48;
      } else {
        height = 0.28;
      }
      if ((parseFloat(left_location) + (objectDetail.e.target.clientWidth * width) + (objectDetail.e.target.clientWidth * 0.028)) >= objectDetail.e.target.clientWidth) {
        positionX = (parseFloat(left_location) - ((objectDetail.e.target.clientWidth * width) + (objectDetail.e.target.clientWidth * 0.028)));
        moveLeft = true;
      } else {
        positionX = (parseFloat(left_location) + (objectDetail.e.target.clientWidth * 0.028));
      }
      if ((parseFloat(top_location) + (objectDetail.e.target.clientHeight * height)) >= objectDetail.e.target.clientHeight) {
        positionY = (parseFloat(top_location) - (objectDetail.e.target.clientHeight * height) + (objectDetail.e.target.clientHeight * 0.013));
        moveTop = true;
      } else {
        positionY = parseFloat(top_location);
      }
      if (moveLeft && moveTop) {
        indication_line = 'left_top';
      } else if (moveLeft && !moveTop) {
        indication_line = 'left';
      } else if (!moveLeft && moveTop) {
        indication_line = 'top';
      }
    }
  } else {
    if (objectDetail.target.data.type !== 'pids' && objectDetail.target.data.type !== 'vitalsensor' && objectDetail.target.data.type !== 'guardianlite') {
      const { left, top, width, height } = objectDetail.target;
      let modalWidth = 0.18541667;
      let modalHeight = 0.3126;
      let modal_without_camera_height = 0.09586171;
      let modal_only_camera = 0.22192982;
      if (((left + (width / 2) + (objectDetail.e.target.clientWidth * modalWidth) + (objectDetail.e.target.clientWidth * 0.026)) >= objectDetail.e.target.clientWidth)) {
        positionX = (left - (objectDetail.e.target.clientWidth * modalWidth));
        moveLeft = true;
      } else {
        positionX = (left + (width / 2) + (objectDetail.e.target.clientWidth * 0.026));
      }
      if (popUpType === 'optionCamera') {
        if ((top + (height / 2) + (objectDetail.e.target.clientHeight * modal_without_camera_height)) >= objectDetail.e.target.clientHeight) {
          positionY = (top - (objectDetail.e.target.clientHeight * modal_without_camera_height) + (objectDetail.e.target.clientHeight * 0.025));
          moveTop = true;
        } else {
          positionY = top;
        }
      } else if (popUpType === 'onlyCamera') {
        if ((top + (height / 2) + (objectDetail.e.target.clientHeight * modal_only_camera)) >= objectDetail.e.target.clientHeight) {
          positionY = (top - (objectDetail.e.target.clientHeight * modal_only_camera) + (objectDetail.e.target.clientHeight * 0.025));
          moveTop = true;
        } else {
          positionY = top;
        }
      }
      if (moveLeft && moveTop) {
        indication_line = 'left_top';
      } else if (moveLeft && !moveTop) {
        indication_line = 'left';
      } else if (!moveLeft && moveTop) {
        indication_line = 'top';
      }
    } else if (objectDetail.target.data.type === 'pids') {
      const { top, left, width, height, x1, x2, y1, y2 } = objectDetail.target;
      let modalWidth = 0.18541667;
      let modalHeight = 0.3126;
      let modal_without_camera_height = 0.09586171;
      let modal_only_camera_height = 0.22192982;
      if (objectDetail.target.text_top && objectDetail.target.text_left) {
        if (((((parseFloat(x2) + parseFloat(x1)) / 2) + (objectDetail.e.target.clientWidth * 0.026) + (objectDetail.e.target.clientWidth * modalWidth)) >= objectDetail.e.target.clientWidth)) {
          positionX = (((parseFloat(x2) + parseFloat(x1)) / 2) - (objectDetail.e.target.clientWidth * modalWidth));
          moveLeft = true;
        } else {
          positionX = (((parseFloat(x2) + parseFloat(x1)) / 2) + (objectDetail.e.target.clientWidth * 0.026));
        }
        if (popUpType === 'optionCamera') {
          if ((((parseFloat(y2) + parseFloat(y1)) / 2) + (objectDetail.e.target.clientHeight * modal_without_camera_height)) >= objectDetail.e.target.clientHeight) {
            positionY = (((parseFloat(y2) + parseFloat(y1)) / 2) - (objectDetail.e.target.clientHeight * modal_without_camera_height));
            moveTop = true;
          } else {
            positionY = (((parseFloat(y2) + parseFloat(y1)) / 2) - (objectDetail.e.target.clientHeight * 0.025));
          }
        } else if (popUpType === 'onlyCamera') {
          if ((((parseFloat(y2) + parseFloat(y1)) / 2) + (objectDetail.e.target.clientHeight * modal_only_camera_height) + (objectDetail.e.target.clientHeight * 0.025)) >= objectDetail.e.target.clientHeight) {
            positionY = (((parseFloat(y2) + parseFloat(y1)) / 2) - (objectDetail.e.target.clientHeight * modal_only_camera_height) + (objectDetail.e.target.clientHeight * 0.025));
            moveTop = true;
          } else {
            positionY = (((parseFloat(y2) + parseFloat(y1)) / 2) - (objectDetail.e.target.clientHeight * 0.025));
          }
        }
        if (moveLeft && moveTop) {
          indication_line = 'left_top';
        } else if (moveLeft && !moveTop) {
          indication_line = 'left';
        } else if (!moveLeft && moveTop) {
          indication_line = 'top';
        }
      } else {
        if (((left + width + (objectDetail.e.target.clientWidth * modalWidth)) >= objectDetail.e.target.clientWidth)) {
          positionX = (left - (objectDetail.e.target.clientWidth * modalWidth));
          moveLeft = true;
        } else {
          positionX = left + width;
        }
        if (popUpType === 'optionCamera') {
          if (((top + (height / 2)) + (objectDetail.e.target.clientHeight * modal_without_camera_height)) >= objectDetail.e.target.clientHeight) {
            positionY = ((top + (height / 2)) - (objectDetail.e.target.clientHeight * modal_without_camera_height) + (objectDetail.e.target.clientHeight * 0.012));
            moveTop = true;
          } else {
            positionY = (top - (height / 2) - (objectDetail.e.target.clientHeight * 0.012));
          }
        } else if (popUpType === 'onlyCamera') {
          if (((top + (height / 2)) + (objectDetail.e.target.clientHeight * 0.025) + (objectDetail.e.target.clientHeight * modal_only_camera_height)) >= objectDetail.e.target.clientHeight) {
            positionY = ((top + (height / 2)) - (objectDetail.e.target.clientHeight * modal_only_camera_height) + (objectDetail.e.target.clientHeight * 0.025));
            moveTop = true;
          } else {
            positionY = ((top + (height / 2)) - (objectDetail.e.target.clientHeight * 0.025));
          }
        }
        if (moveLeft && moveTop) {
          indication_line = 'left_top';
        } else if (moveLeft && !moveTop) {
          indication_line = 'left';
        } else if (!moveLeft && moveTop) {
          indication_line = 'top';
        }
      }
    } else if (objectDetail.target.data.type === 'vitalsensor') {
      const { left, top, width, height, camera_id } = objectDetail.target;
      let modalWidth = 0.18541667;
      let modalHeight;
      let modal_only_camera_height = 0.22192982;
      if (camera_id) {
        modalHeight = 0.48;
      } else {
        modalHeight = 0.28;
      }
      if (((left + (width / 2)) + (objectDetail.e.target.clientWidth * 0.01) + (objectDetail.e.target.clientWidth * modalWidth)) >= objectDetail.e.target.clientWidth) {
        positionX = ((left + (width / 2)) - (objectDetail.e.target.clientWidth * 0.023) - (objectDetail.e.target.clientWidth * modalWidth));
        moveLeft = true;
      } else {
        console.log(left, width)
        positionX = ((left + (width / 2)) + (objectDetail.e.target.clientWidth * 0.03));
      }
      if (popUpType === 'optionCamera_vital') {
        if ((top + (objectDetail.e.target.clientHeight * modalHeight)) >= objectDetail.e.target.clientHeight) {
          positionY = (top - (objectDetail.e.target.clientHeight * (modalHeight - 0.025)));
          moveTop = true;
        } else {
          positionY = (top);
        }
      } else if (popUpType === 'onlyCamera') {
        if ((top + (height / 2) + (objectDetail.e.target.clientHeight * modal_only_camera_height)) >= objectDetail.e.target.clientHeight) {
          positionY = (top - (objectDetail.e.target.clientHeight * (modal_only_camera_height - 0.025)));
          moveTop = true;
        } else {
          positionY = (top);
        }
      }
      if (moveLeft && moveTop) {
        indication_line = 'left_top';
      } else if (moveLeft && !moveTop) {
        indication_line = 'left';
      } else if (!moveLeft && moveTop) {
        indication_line = 'top';
      }
    } else if (objectDetail.target.data.type === 'guardianlite') {
      const { left, top, width, height } = objectDetail.target;
      let modalWidth = 0.18541667;
      let modalHeight = 0.22399381;
      if (((left + (width / 2)) + (objectDetail.e.target.clientWidth * 0.024) + (objectDetail.e.target.clientWidth * modalWidth)) >= objectDetail.e.target.clientWidth) {
        positionX = ((left + (width / 2)) - (objectDetail.e.target.clientWidth * 0.024) - (objectDetail.e.target.clientWidth * modalWidth));
        moveLeft = true;
      } else {
        positionX = ((left + (width / 2)) + (objectDetail.e.target.clientWidth * 0.024));
      }
      if ((top + (objectDetail.e.target.clientHeight * modalHeight)) >= objectDetail.e.target.clientHeight) {
        positionY = (top - (objectDetail.e.target.clientHeight * (modalHeight - 0.025)));
        moveTop = true;
      } else {
        positionY = top;
      }
      if (moveLeft && moveTop) {
        indication_line = 'left_top';
      } else if (moveLeft && !moveTop) {
        indication_line = 'left';
      } else if (!moveLeft && moveTop) {
        indication_line = 'top';
      }
    }
  }
  return {
    positionX,
    positionY,
    indication_line
  }
}
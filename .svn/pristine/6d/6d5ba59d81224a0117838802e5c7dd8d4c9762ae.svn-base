import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function MoreTextInfo({textInfo, setBottom}) {
  return (
    <OverlayTrigger
      key={'right'}
      placement={setBottom ? 'bottom':'right'}
      overlay={
        <Tooltip id={`tooltip-right`}>
          <strong className="moreTextInfo">{textInfo}</strong>
        </Tooltip>
      }
    >
      <span className='moreTextInfo'>{textInfo}</span>
    </OverlayTrigger>
  )
}

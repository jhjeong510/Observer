import React from 'react';
import { Button } from 'reactstrap';

class Top extends React.Component {

  render() {
    return (
      <div className="top">
        <span style={{ color:'white' }}>top</span>
        <Button onClick={this.props.handleDoit} >Do it</Button>
      </div>
    );
  }
}

export default Top;

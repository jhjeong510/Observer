import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class BlackOrWhite extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.currentTabIndex !== prevProps.currentTabIndex) {
      this.props.getCarNumberList();
    }
  }

  render () {
    if(this.props.black) {
      return (
        this.props.carNumberList && this.props.carNumberList.map((item, index) => {
          if(item.type === 'black') {
            return <tr key={index}>
              <td style={{ maxWidth: '103.08px', minWidth: '103.08px' }}>{item.number}</td>
              <td style={{ width: '90px', minWidth: '90px' }}>{item.name}</td>
              <td style={{ width: '150px', minWidth: '150px' }}>{item.description}</td>
              <td style={{ width: '140px' }}><Button className="btn btn-danger" onClick={() => this.props.handleRemoveCarNumber(item.idx, item.type)}>삭제</Button></td>
            </tr>
          }
        })

      );
    } else if(this.props.white) {
      return (
        this.props.carNumberList && this.props.carNumberList.map((item, index) => {
          if(item.type === 'white') {
            return <tr key={index}>
              <td style={{ maxWidth: '103.08px', minWidth: '103.08px' }}>{item.number}</td>
              <td style={{ width: '90px;', minWidth: '90px' }}>{item.name}</td>
              <td style={{ width: '150px', minWidth: '150px' }}>{item.description}</td>
              <td style={{ width: '140px' }}><Button className="btn btn-danger" onClick={() => this.props.handleRemoveCarNumber(item.idx, item.type)}>삭제</Button></td>
            </tr>
          }
        })
      );
    }
  }
}

export default BlackOrWhite;


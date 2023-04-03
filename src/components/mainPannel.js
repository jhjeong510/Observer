import React from 'react';

class MainPannel extends React.Component {

  handleRequest = () => {
    console.log("Hi~");
  };

  render() {
    return (
      <div className="main-panel">
        <span style={{ color: 'white' }}>main</span>
      </div>
    );
  }
}

export default MainPannel;

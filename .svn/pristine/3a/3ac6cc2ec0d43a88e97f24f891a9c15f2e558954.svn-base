import React from 'react';
import './App.css';
import Top from './components/top';
import MainPannel from './components/mainPannel';
import Sidebar from './components/sidebar';
import socketClient from 'socket.io-client';

const childRef = React.createRef();

class App extends React.Component {

  state = {
    selectioncontrolurl: []
  }
  componentDidMount() {
    const socket = socketClient('192.168.10.21:4100');
    socket.on('connect', (socket) => {
      console.log('socket connected');
    });
    socket.on('disconnect', (socket) => {
      console.log('socket disconnected');
    });
    socket.on('selectioncontrol', (received) => {
      console.log('socket data received!!!');
      if (received && received.urls) {
        console.log('urls:', received.urls);
        this.setState({
          selectioncontrolurl: received.urls
        });
      }
    });
  }
  // 부모 컴포넌트에서 자식 컴포넌트 함수 호출 예제
  handleDoit = () => {
    if (childRef.current) {
      childRef.current.handleRequest();
    }
  };

  render() {
    return (
      <div className="App">
        <Sidebar selectioncontrolurl={this.state.selectioncontrolurl}/>
        
        <Top handleDoit={this.handleDoit}/>
        <MainPannel ref={childRef}/>
        <div className='footer'>footer</div>
      </div>
    );
  }
}

export default App;

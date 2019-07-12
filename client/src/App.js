import React, { Component } from 'react';
import API from './utils/API';
import io from 'socket.io-client';
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      endpoint: `${window.location.hostname}:${parseInt(window.location.port) + 1}`,
      color: 'white'
    }
  }

  send(){
    const socket = io(this.state.endpoint);
    socket.emit('change color', this.state.color);
  };

  setColor(color){
    this.setState({color});
  };

  componentDidMount(){
    const socket = io(this.state.endpoint);
    setInterval(this.send(), 5000);
    socket.on('change color', (col) =>{
      const AppSel = document.getElementsByClassName('App')[0];
      AppSel.style.backgroundColor = col;
    });
  };

  brainCommunication(){
    API.readBrains();
  };

  render(){
    const socket = io(this.state.endpoint);
    socket.on('change color', (col) =>{
      const AppSel = document.getElementsByClassName('App')[0];
      AppSel.style.backgroundColor = col;
    });

    return (
      <div className="App">
        <header className="App-header">
          <p>
            Employee Mind Reader
          </p>
        </header>
  
        <button onClick={this.brainCommunication}>
          Read Brain
        </button>
        <button onClick={() => this.send() }>Change Color</button>



        <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
        <button id="red" onClick={() => this.setColor('red')}>Red</button>
      </div>
    );
  };
};

export default App;

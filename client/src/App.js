import React, { Component } from 'react';
import API from './utils/API';
import io from 'socket.io-client';
import Thoughts from './Thoughts/Thoughts';
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      endpoint: `${window.location.hostname}:${parseInt(window.location.port) + 1}`,
      thought: undefined,
      color: 'white'
    }
  }

  send = () =>{
    const socket = io(this.state.endpoint);
    socket.emit('thought read', this.state.thought);
  };

  setThought = (brain) =>{
    this.setState({thought: brain});
  };

  componentDidMount(){
    const socket = io(this.state.endpoint);
    // setInterval(() =>{this.send()}, 1000); //this is in working condition
    socket.on('thought read', (tho) =>{
      if(tho !== undefined && tho !== null){
        this.setThought(tho);
      };
    });
  };

  brainCommunication = () =>{
    API.readBrains().then(res =>{
      this.setThought(res.data)
    }).then(() =>{
      this.send();
    });;
  };

  render(){
    const socket = io(this.state.endpoint);
    let thoughtItems, thoughtPlacement;
    if((this.state.thought !== undefined) && (this.state.thought !== null)){
      thoughtItems = this.state.thought;
      thoughtPlacement =  [<Thoughts key="key1" src={thoughtItems.imgUrl} alt={thoughtItems.name} />];
    } else {
      thoughtPlacement = null;
    };
    socket.on('thought read', (tho) =>{
        if(tho){
          thoughtItems = tho;
          thoughtPlacement =  [<Thoughts key="key1" src={thoughtItems.imgUrl} alt={thoughtItems.name} />];
        };
    });
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Cabalistic Necromancer
          </p>
        </header>
  
        <button onClick={this.brainCommunication}>
          Read Brain
        </button>
        <button onClick={() => this.send() }>Change Color</button>



        <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
        <button id="red" onClick={() => this.setColor('red')}>Red</button>

        {thoughtPlacement}
      </div>
    );
  };
};

export default App;

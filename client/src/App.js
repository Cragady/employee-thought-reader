import React, { Component } from 'react';
import API from './utils/API';
import io from 'socket.io-client';
import Thoughts from './Thoughts/Thoughts';
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      endpoint: io(`${window.location.hostname}:${parseInt(window.location.port) + 1}`),
      thought: {
        imgUrl: './images/unknown.png',
        tStamp: 0
      },
      isDisabled: false,
      innerDis: 'Read Brain',
      lagger: null
    }
  }

  send = () =>{
    const socket = this.state.endpoint;
    socket.emit('thought read', this.state.thought);
  };

  setThought = (brain) =>{
    this.setState({thought: brain});
  };

  // setApi = (api) =>{
  //   this.setState({isCalled: api});
  // };

  componentDidMount(){
    const socket = this.state.endpoint;
    
    socket.on('thought req', () =>{
      if(this.state.thought.imgUrl !== './images/unknown.png'){
        console.log('thought req read');
        this.send();
      };
    });

    setTimeout(()=>{
      socket.emit('thought req');
    }, 500);

    socket.on('thought read', (tho) =>{
      if(tho.imgUrl !== './images/unknown.png'){
        if(tho !== this.state.thought && tho.tStamp > this.state.thought.tStamp){
          this.brainSwitch(false, 'Read Brain');
          this.setThought(tho);
        };
      };
    });
  
    socket.on('api called', () =>{
      this.brainSwitch(true, <marquee>Thinking. . . </marquee>);
    });
  };

  brainCommunication = () =>{
    API.readBrains().then(res =>{
      if(res.data !== ""){
        if(res.data.imgUrl === ""){
          res.data.imgUrl = './images/cant-find.png';
        };
        this.setThought(res.data)
      } else {
        console.log(typeof res.data);        
      };
    }).then(() =>{
      this.brainSwitch(false, 'Read Brain');
      this.send();
    })
    .catch(() =>{
      console.log('Data is corrupted');
    });;
  };

  brainLimiter = async () =>{
    const socket = this.state.endpoint;
    await this.brainSwitch(true, <marquee>Thinking. . .</marquee>);
    socket.emit('api called');
    this.brainLag();
    this.brainCommunication();
  };

  brainLag = () =>{
    setTimeout(() =>{
      // if(this.state.isDisabled){
        this.setState({
          lagger: <button>Click me if too long</button>
        });
      // };
    }, 10000);
  };

  mindMapper = (tho) =>{
    return [<Thoughts key="key1" src={tho.imgUrl} name={tho.name} currentThought={tho.currentThought} currentBeer={tho.currentBeer} daydream={tho.daydream} />];
  };

  brainSwitch(bool, htmlPass){
    this.setState({
      isDisabled: bool,
      innerDis: htmlPass
    });
  };

  render(){
    const socket = this.state.endpoint;
    let thoughtItems, thoughtPlacement,
    nonClickable = this.state.isDisabled,
    butText = this.state.innerDis;

    if((this.state.thought !== undefined) && (this.state.thought !== null)){
      thoughtItems = this.state.thought;
      thoughtPlacement =  this.mindMapper(thoughtItems);
    } else {
      thoughtPlacement = null;
    };


    socket.on('thought read', (tho) =>{
        if(tho && tho !== this.state.thought && tho.tStamp > this.state.thought.tStamp){
          nonClickable = false;
          butText = 'Read Brain';
          thoughtItems = tho;
          thoughtPlacement =  this.mindMapper(thoughtItems);
        };
    });

    return (
      <div className="App">
        <header className="App-header">
          <p>
            Cabalistic Necromancer
          </p>
        </header>
        
        {this.state.lagger}

        {nonClickable === true ? 
          <button disabled>
            {butText}
          </button>
        : 
          <button onClick={this.brainLimiter}>
            {butText}
          </button>
        }
        {thoughtPlacement}
        
      </div>
    );
  };
};

export default App;

import React, { Component } from 'react';
import API from './utils/API';
import { env } from './utils/env';
import io from 'socket.io-client';
import Thoughts from './Thoughts/Thoughts';
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.portpoint = function(){
      if(env === "prod"){
        return window.location.port;
      } else {
        return parseInt(window.location.port) + 1;
      }
    };
    this.state = {
      endpoint: io(`${window.location.hostname}:${this.portpoint()}`),
      testpoint: `${window.location.hostname}:${this.portpoint()}`,
      thought: {
        imgUrl: './images/unknown.png',
        tStamp: 0
      },
      innerDis: 'Read Brain',
      lagger: null
    };
  }

  send = () =>{
    const socket = this.state.endpoint;
    socket.emit('thought read', this.state.thought);
  };

  setThought = (brain) =>{
    this.setState({
      thought: brain,
      lagger: null
    });
  };

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

    socket.on('override thought', () =>{
      this.brainSwitch(false, 'Read Brain');
    });
  
    socket.on('api called', () =>{
      this.brainLag();
      // eslint-disable-next-line
      this.brainSwitch(true, <marquee>Thinking. . . </marquee>);
    });
  };

  componentDidUpdate(preProps, preState){
    if(this.state.thought !== preState.thought){
      this.send();
    };
  };

  brainCommunication = () =>{
    API.readBrains().then(res =>{
      if(res.data !== "" && res.data !== {} && this.state.thought.isDisabled){
        if(res.data.imgUrl === ""){
          res.data.imgUrl = './images/cant-find.png';
        };
        this.setThought(res.data);
      };
    }).then(() =>{
      this.brainSwitch(false, 'Read Brain');
    })
    .catch((err) =>{
      if(err.response.status === 508){
        console.log('Infinite recursion detected, please try again');
        this.brainSwitch(false, 'Read Brain');
      } else {
        console.log('Data is corrupted, please try again');
        this.brainSwitch(false, 'Read Brain');
      };
    });;
  };

  brainLimiter = async () =>{
    const socket = this.state.endpoint;
    // eslint-disable-next-line
    await this.brainSwitch(true, <marquee>Thinking. . .</marquee>);
    socket.emit('api called');
    this.brainCommunication();
  };

  brainLag = () =>{
    const id = setTimeout(() =>{
      clearTimeout(id);
      if(this.state.thought.isDisabled){
        this.setState({
          lagger: <button className="btn btn-brain" onClick={this.brainRefresh} >Stop Thinking</button>
        });
      };
      // }, 22000);
    }, 2200);
  };

  mindMapper = (tho) =>{
    return [<Thoughts key="key1" src={tho.imgUrl} name={tho.name} currentThought={tho.currentThought} currentBeer={tho.currentBeer} daydream={tho.daydream} />];
  };

  brainSwitch = (bool, htmlPass) =>{
    this.setState(preState =>({
      thought:{
        ...preState.thought,
        isDisabled: bool
      },
      innerDis: htmlPass,
      lagger: null
    }));
  };

  brainRefresh = () =>{
    this.setState(preState =>({
      thought:{
        ...preState.thought,
        isDisabled: false
      },
      innerDis: 'Read Brain',
      lagger: null
    }));
    const socket = this.state.endpoint;
    socket.emit('override thought');
  };

  render(){
    console.log(env);
    console.log(typeof env);
    const socket = this.state.endpoint;
    let thoughtItems, thoughtPlacement,
      nonClickable = this.state.thought.isDisabled,
      butText = this.state.innerDis,
      lagPlacer;

    if((this.state.thought !== undefined) && (this.state.thought !== null)){
      thoughtItems = this.state.thought;
      thoughtPlacement =  this.mindMapper(thoughtItems);
    } else {
      thoughtPlacement = null;
    };

    if(this.state.thought.isDisabled){
      lagPlacer = this.state.lagger;
      // eslint-disable-next-line
      butText = <marquee>Thinking. . .</marquee>;
    } else {
      lagPlacer = null;
      butText = 'Read Brain';
    };

    socket.on('thought read', (tho) =>{
        if(tho && tho !== this.state.thought && tho.tStamp > this.state.thought.tStamp){
          nonClickable = false;
          butText = 'Read Brain';
          lagPlacer = null;
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

        {lagPlacer}{lagPlacer && <br />}

        {nonClickable === true ? 
          <button className="btn btn-brain" disabled>
            {butText}
          </button>
        : 
          <button className="btn btn-brain" onClick={this.brainLimiter}>
            {butText}
          </button>
        }
        {thoughtPlacement}

      <div className="bottom-pusher">Hellurr</div>
        
      </div>
    );
  };
};

export default App;

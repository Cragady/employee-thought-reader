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
        imgUrl: './images/unknown.png'
      },
      isCalled: false
    }
  }

  send = () =>{
    const socket = this.state.endpoint;
    socket.emit('thought read', this.state.thought);
    socket.emit('api called', this.state.isCalled);
  };

  setThought = (brain) =>{
    this.setState({thought: brain});
  };

  setApi = (api) =>{
    this.setState({isCalled: api});
  };

  componentDidMount(){
    console.log(this.state.endpoint);
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
        if(tho !== this.state.thought){
          this.setThought(tho);
        };
      };
    });
  
    socket.on('api called', (api) =>{
      if(api){
        setTimeout(() =>{
          this.setApi(false);
        }, 2000);
      };
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
      this.send();
    })
    .catch(() =>{
      console.log('Data is corrupted');
    });;
  };

  brainLimiter = async () =>{
    if(!this.state.isCalled){
      await this.setState({
        isCalled: true
      })
      this.brainCommunication()
    } else {
      console.log('Too Many Requests');
    };
  };

  mindMapper = (tho) =>{
    return [<Thoughts key="key1" src={tho.imgUrl} name={tho.name} currentThought={tho.currentThought} currentBeer={tho.currentBeer} daydream={tho.daydream} />];
  }

  render(){
    const socket = this.state.endpoint;
    let thoughtItems, thoughtPlacement;

    if((this.state.thought !== undefined) && (this.state.thought !== null)){
      thoughtItems = this.state.thought;
      thoughtPlacement =  this.mindMapper(thoughtItems);
    } else {
      thoughtPlacement = null;
    };

    socket.on('thought read', (tho) =>{
        if(tho && tho !== this.state.thought){
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
  
        <button onClick={this.brainLimiter}>
          Read Brain
        </button>

        {thoughtPlacement}
        
      </div>
    );
  };
};

export default App;

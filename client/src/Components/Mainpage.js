import logo from './logo.svg';
import {Collapse,Grow,Button} from '@material-ui/core';
import React from 'react';
import {Link} from 'react-router-dom';
import './Mainpage.css';
function Usergreeting(props){
    return <b><p>Welcome {props.username}</p></b>
  };
  
  function Starttext(props){
    return <p>Welcome to Simplefornow</p>
  };
  
class Main extends React.Component{
  
    constructor(props){
      super(props);
      this.state = {
        username:"",
        namechange:true,
        joinroom:false,
        roomid:""
      };
    }
  
    userpage = () => {
      return <div className="user-front-page">
              <div>
                {<Usergreeting username = {this.state.username}/>}
                <div className="buttonooptions">
                  <Button className="button" onClick={() => this.setState({namechange:true})}>Change Username</Button>
                  <Button className="button">Create Room</Button>
                  <Button className="button" onClick={() => this.setState({joinroom:!this.state.joinroom})}>Join Room</Button>
                </div>
                <Grow in={this.state.joinroom}>
                  <div>
                    <input className="joininput"type="text" placeholder="Room ID" onChange={event => this.setState({roomid:event.target.value})} />
                    <Button className="join" color="primary" > <Link onClick={event => (this.state.username ==="" || this.state.roomid ==="") ? event.preventDefault() : null} to={`/chatroom?username=${this.state.username}&id=${this.state.roomid}`}>Join</Link></Button>
                  </div>
                </Grow>
              </div>
            </div>;
    }
  
    namechange = (event) => {
      if(event.key === "Enter" && event.target.value !== "")
        this.setState({username: event.target.value,namechange:false});
    }
    
    render(){
      return (
        <div className="App">
          <header className="App-header">
            <Collapse in={this.state.namechange} timeout={1000}>
              <div className="front-page">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                  {<Starttext/>}
                </div>
                <div> 
                    <input type="text" placeholder="Enter Name" onKeyPress={this.namechange}/>
                </div>
              </div>;
            </Collapse>
            <Collapse in={!this.state.namechange}>
              {this.userpage()}
            </Collapse>
          </header>
        </div>
      );
    }
  
}

export default Main;
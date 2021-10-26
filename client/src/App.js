import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'; 
import Chat from './Components/Chatroom';
import Main from './Components/Mainpage';
class App extends React.Component{
  render(){
    return (
      <Router>
        <Route path="/" exact component={Main} />
        <Route path="/chatroom" component={Chat} />
      </Router>
    );
  }
}

export default App;

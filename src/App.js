import React from 'react';
import SignUp from './components/SignUp'
import Login from './components/Login'
import {BrowserRouter} from "react-router-dom"
import Root from './Root'
import './App.css';

function App() {

  return (
    <div className="App">
      {/* Rendering route components here */}
      <BrowserRouter>
        <Root/>
      </BrowserRouter>
    </div>
  );
}

export default App;

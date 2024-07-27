import './App.css';
import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function App() {

  const baseColor = 'white';

  const [textColorW, setTextColorW] = useState(baseColor);
  const [textColorS, setTextColorS] = useState(baseColor);
  const [textColorA, setTextColorA] = useState(baseColor);
  const [textColorD, setTextColorD] = useState(baseColor);

  useEffect( () => {
    const handleKeyDown = (event) => {
      if(event.key === 'w'){
        setTextColorW('blue');
      }else if (event.key === 's'){
        setTextColorS('blue');
      }else if (event.key === 'a'){
        setTextColorA('blue');
      }else if (event.key === 'd'){
        setTextColorD('blue');
      }
    }

    const handleKeyUp = (event) => {
      if(event.key === 'w'){
        setTextColorW(baseColor);
      }else if (event.key === 's'){
        setTextColorS(baseColor);
      }else if (event.key === 'a'){
        setTextColorA(baseColor);
      }else if (event.key === 'd'){
        setTextColorD(baseColor);
      }
      
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyUp);
      window.removeEventListener('keyup', handleKeyUp);
    }
  })


  return (
    <div className="App">
      <div id = 'page1'>
        <h1 className="title"> 
          Control Center
        </h1>
        <div id = 'buttonLayout'>
          <h3 className="keyboardInputShow" style = {{color: textColorW}}> Foward (W) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorS}}> Backwards (S) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorA}}> Left (A) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorD}}> Right (D) </h3>
        </div>

      </div>
    </div>
  );
}

export default App;

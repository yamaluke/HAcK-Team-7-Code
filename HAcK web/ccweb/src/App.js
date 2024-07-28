import './App.css';
import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function App() {

  // base color for text that uses useState
  const baseColor = 'white';

  // useState for the direction: 
    // will change colors on screen when a key is pressed
  const [textColorW, setTextColorW] = useState(baseColor);
  const [textColorS, setTextColorS] = useState(baseColor);
  const [textColorA, setTextColorA] = useState(baseColor);
  const [textColorD, setTextColorD] = useState(baseColor);

  // variables that shows that status of the direction
  var inMotion = false;

  // useState for the sensor variables 
  const [temp, setTemp] = useState('-0')
  const [ultrasonic, setUltrasonic] = useState('-0');
  const [humidity, setHumidity] = useState('-0');

  useEffect( () => {
    // keyboard handle for directional buttons being pressed
    const handleKeyDown = (event) => {
      if(event.key === 'w' && !inMotion){
        inMotion = true;
        setTextColorW('blue');
        socket.emit('send-direction', 'fowardsGo')
      }else if (event.key === 's' && !inMotion){
        inMotion = true;
        setTextColorS('blue');
        socket.emit('send-direction', 'backwardsGo')
      }else if (event.key === 'a' && !inMotion){
        inMotion = true;
        setTextColorA('blue');
        socket.emit('send-direction', 'leftGo')
      }else if (event.key === 'd' && !inMotion){
        inMotion = true;
        setTextColorD('blue');
        socket.emit('send-direction', 'rightGo')
      }
    }

    // Listen for temperature updates
    socket.on('temp', (data) => {
      setTemp(data);
    });

    // Listen for ultrasonic updates
    socket.on('ultrasonic', (data) => {
      setUltrasonic(data);
    });

    // listen for humidity sensor
    socket.on('humidity', (data) => {
      setHumidity(data);
    });

    // turn keys back to normal
    const handleKeyUp = (event) => {
      if(event.key === 'w'){
        inMotion = false;
        setTextColorW(baseColor);
        socket.emit('send-direction', 'fowardsStop')
      }else if (event.key === 's'){
        inMotion = false;
        setTextColorS(baseColor);
        socket.emit('send-direction', 'backwardsStop')
      }else if (event.key === 'a'){
        inMotion = false;
        setTextColorA(baseColor);
        socket.emit('send-direction', 'leftStop')
      }else if (event.key === 'd'){
        inMotion = false;
        setTextColorD(baseColor);
        socket.emit('send-direction', 'rightStop')
      }
      
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyUp);
      window.removeEventListener('keyup', handleKeyUp);
      socket.off('temp');
      socket.off('ultrasonic');
      socket.off('humidity')
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
        <div id = 'sensorLayout'>
          <h3 className="sensorData"> Temperature: {temp}</h3>
          <h3 className='sensorData'> Ultrasonic distance: {ultrasonic}</h3>
          <h3 className='sensorData'> Humidity: {humidity}</h3>
        </div>

      </div>
    </div>
  );
}

export default App;

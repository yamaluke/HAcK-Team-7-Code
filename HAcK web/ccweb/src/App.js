//== App.js ==//
import './App.css';
import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}


function App() {
  //==========================//
  //== Variable declaration ==//
  //==========================//
  // base color for text that uses useState
  const baseColor = 'white';

  // useState for the direction: 
    // will change colors on screen when a key is pressed
  const [textColorW, setTextColorW] = useState(baseColor);
  const [textColorS, setTextColorS] = useState(baseColor);
  const [textColorA, setTextColorA] = useState(baseColor);
  const [textColorD, setTextColorD] = useState(baseColor);
  const [textColorQ, setTextColorQ] = useState(baseColor);
  const [textColorE, setTextColorE] = useState(baseColor);
  const [lightStatus, setLightStatus] = useState('off');

  const [ccImage, setCCImage] = useState('default.JPG')

  // variables that shows that status of the direction
  var inMotion = false;
  // const [inMotion, setInMotion] = useState(false);


  // useState for the sensor variables 
  const [temp, setTemp] = useState('-0')
  const [ultrasonic, setUltrasonic] = useState('-0');
  const [humidity, setHumidity] = useState('-0');

  useEffect( () => {
    // keyboard handle for directional buttons being pressed
    const handleKeyDown = (event) => {
      // sleep(200)
      if(event.key === 'w' && !inMotion){
        inMotion = true;
        setTextColorW('blue');
        setCCImage('Won.JPG')
        socket.emit('send-direction', 'fowardsGo')
      }else if (event.key === 's' && !inMotion){
        inMotion = true;
        setTextColorS('blue');
        setCCImage('Son.JPG')
        socket.emit('send-direction', 'backwardsGo')
      }else if (event.key === 'a' && !inMotion){
        inMotion = true;
        setTextColorA('blue');
        setCCImage('Aon.JPG')
        socket.emit('send-direction', 'leftSpin')
      }else if (event.key === 'd' && !inMotion){
        inMotion = true;
        setTextColorD('blue');
        setCCImage('Don.JPG')
        socket.emit('send-direction', 'rightSpin')
      }else if (event.key === 'q' && !inMotion){
        inMotion = true;
        setTextColorQ('blue');
        setCCImage('Qon.JPG')
        socket.emit('send-direction', 'leftGo')
      }else if (event.key === 'e' && !inMotion){
        inMotion = true;
        setTextColorE('blue');
        setCCImage('Eon.JPG')
        socket.emit('send-direction', 'rightGo')
      }else if(event.key === 'L'){
        if({lightStatus} == 'on'){
          setLightStatus('off')
          socket.emit('send-direction', 'lightOff')
        }else{
          setLightStatus('on')
          socket.emit('send-direction', 'lightOn')
        }
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
        setCCImage('default.JPG')
        socket.emit('send-direction', 'motionStop')
      }else if (event.key === 's'){
        inMotion = false;
        setTextColorS(baseColor);
        setCCImage('default.JPG')
        socket.emit('send-direction', 'motionStop')
      }else if (event.key === 'a'){
        inMotion = false;
        setTextColorA(baseColor);
        setCCImage('default.JPG')
        socket.emit('send-direction', 'motionStop')
      }else if (event.key === 'd'){
        inMotion = false;
        setTextColorD(baseColor);
        setCCImage('default.JPG')
        socket.emit('send-direction', 'motionStop')
      }else if (event.key === 'q'){
        inMotion = false;
        setTextColorQ(baseColor);
        setCCImage('default.JPG')
        socket.emit('send-direction', 'motionStop')
      }else if (event.key === 'e'){
        inMotion = false;
        setTextColorE(baseColor);
        setCCImage('default.JPG')
        socket.emit('send-direction', 'motionStop')
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
  },[])


  return (
    <div className="App">
      <div id = 'page1'>
        <h1 className="title1"> 
          Control Center
        </h1>
        <h1 className="title2"> 
          Prius R2
        </h1>
        <div id = 'cameraFrame'>
          <div id = 'sensorLayoutL'>
            <h3 className="sensorData"> Temperature: {temp}</h3>
            <h3 className='sensorData'> Humidity: {humidity}</h3>
          </div>
          <iframe src = "http://192.168.50.94" height="300" width="300" className="feed" />
          <div id = 'sensorLayoutR'>
            <h3 className='sensorData'> Ultrasonic distance: {ultrasonic}</h3>
            <h3 className='sensorData'> LED status (L): {lightStatus}</h3>
          </div>
        </div>
        <div id = 'buttonLayout'>
          <h3 className="keyboardInputShow" style = {{color: textColorW}}> Foward (W) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorS}}> Backwards (S) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorA}}> Spin Left (A) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorD}}> Spin Right (D) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorQ}}> Left (Q) </h3>
          <h3 className="keyboardInputShow" style = {{color: textColorE}}> Right (E) </h3>
        </div>
        <div id = 'CCGShell'>
          <img id = 'ccGraphic' src = {ccImage}></img>
        </div>
        
        

      </div>
    </div>
  );
}

export default App;

//==========================================================//
//== File name: App.js
//== Creator: Luke Yamaguchi                              ==//
//== Creation date: 2024/07/28                            ==//
//== Creation purpose: The following program was used to  ==//
//==  create a website that acted as the control center   ==//
//==  for the rover (Prius R2) for team 7 (rover rangers) ==//
//== during the 2024 HAcK competition.                    ==//
//==========================================================//


import './App.css';
import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:8000');


function App() {
  //==========================//
  //== Variable declaration ==//
  //==========================//
  // base color for text that uses useState
  const baseColor = 'white';

  // variables that shows that status of the direction
    // true = in motion and false = not in motion
  var inMotion = false;

  //== useState declarations ==//
  // for the on screen directions markers
    // will change colors on screen when a key is pressed
  const [textColorW, setTextColorW] = useState(baseColor);
  const [textColorS, setTextColorS] = useState(baseColor);
  const [textColorA, setTextColorA] = useState(baseColor);
  const [textColorD, setTextColorD] = useState(baseColor);
  const [textColorQ, setTextColorQ] = useState(baseColor);
  const [textColorE, setTextColorE] = useState(baseColor);

  // on screen image for the control system
    // note: all the respective images have the following format: "{key letter}on.JPG" 
  const [ccImage, setCCImage] = useState('default.JPG')

  // useState for the sensor variables 
  const [temp, setTemp] = useState('-0')
  const [ultrasonic, setUltrasonic] = useState('-0');
  const [humidity, setHumidity] = useState('-0');
  const [lightStatus, setLightStatus] = useState('off');

  //=========================================//
  //== Code for sending and receiving data ==//
  //=========================================//
  useEffect( () => {
    //== keyboard handle for buttons being pressed (sending data) ==//
    const handleKeyDown = (event) => {
      if(event.key === 'w' && !inMotion){               // the following documentation is a run down for all directional buttons being pressed
                                                        // for the if statement to go through key must be pressed and car must not be in motion
        inMotion = true;                                // will change the car's status to in motion
        setTextColorW('blue');                          // change the coloring for the respective direction word on the website
        setCCImage('Won.JPG');                          // change the control image to the respective control image on the website
        socket.emit('send-direction', 'fowardsGo');     // send out the command to the rover on what action it is suppose to take
      }else if (event.key === 's' && !inMotion){        // directional button 
        inMotion = true;
        setTextColorS('blue');
        setCCImage('Son.JPG');
        socket.emit('send-direction', 'backwardsGo');
      }else if (event.key === 'a' && !inMotion){        // directional button 
        inMotion = true;
        setTextColorA('blue');
        setCCImage('Aon.JPG');
        socket.emit('send-direction', 'leftSpin');
      }else if (event.key === 'd' && !inMotion){        // directional button 
        inMotion = true;
        setTextColorD('blue');
        setCCImage('Don.JPG');
        socket.emit('send-direction', 'rightSpin');
      }else if (event.key === 'q' && !inMotion){        // directional button 
        inMotion = true;
        setTextColorQ('blue');
        setCCImage('Qon.JPG');
        socket.emit('send-direction', 'leftGo');
      }else if (event.key === 'e' && !inMotion){        // directional button 
        inMotion = true;
        setTextColorE('blue');
        setCCImage('Eon.JPG');
        socket.emit('send-direction', 'rightGo');
      }else if(event.key === 'L'){                      // change the LED status (note: LED was not implemented onto final design)
        if({lightStatus} == 'on'){
          setLightStatus('off');
          socket.emit('send-direction', 'lightOff');
        }else{
          setLightStatus('on');
          socket.emit('send-direction', 'lightOn');
        }
      }
    }
    
    //== Receiving data from sensors on rover ==//
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

    //== keyboard handle for buttons being unpressed (sending data) ==//
    const handleKeyUp = (event) => {                    // all the controls for buttons being unpressed is for the directional movement 
      if(event.key === 'w'){                            // the following documentation is a run down for each if statement (each key)
        inMotion = false;                               // will change the car's status to not in motion
        setTextColorW(baseColor);                       // change the coloring back to default for the respective direction word on the website
        setCCImage('default.JPG')                       // change the control image to the default control image on the website
        socket.emit('send-direction', 'motionStop')     // send out the command to the rover telling it to stop
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

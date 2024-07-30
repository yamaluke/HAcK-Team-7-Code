//==========================================================//
//== File name: App.js                                    ==//
//== Creator: Luke Yamaguchi                              ==//
//== Creation date: 2024/07/28                            ==//
//== Creation purpose: The following program was used to  ==//
//== create a website that acted as the control center    ==//
//== for the rover (Prius R2) for team 7 (Rover Rangers)  ==//
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
          Rover Rangers - Prius R2
        </h1>
        <h1 className="title2"> 
          Control Center
        </h1>
        <div id = 'cameraFrame'>
          <div id = 'sensorLayoutL'>
            <h3 className="sensorData"> Temperature: {temp}</h3>
            <h3 className="sensorData"> Humidity: {humidity}</h3>
          </div>
          <iframe src = "http://192.168.50.94" height="300" width="300" className="feed" />
          <div id = 'sensorLayoutR'>
            <h3 className="sensorData"> Ultrasonic distance: {ultrasonic}</h3>
            <h3 className="sensorData"> LED status (L): {lightStatus}</h3>
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
      <div id = 'page2'>
      <h1 className="title1"> 
          Rover Rangers - Prius R2
        </h1>
        <h1 className="title2"> 
          Team members
        </h1>
        <div className="bioBox">
          <div className="bio">
            <h2>Fernando Valles</h2>
            <h3>Major: Chemical Engineering</h3>
            <h3>Transfer CC: San Bernardin Valley College</h3>
            <h3>Roles: Design & Assembly Lead</h3>
          </div>
          <img className="bioImage" src='Fernando.jpg'></img>
          <img className="bioImage" src='luke.jpg'></img>
          <div className="bio">
            <h2>Luke Yamaguchi</h2>
            <h3>Major: Computer Engineering</h3>
            <h3>Transfer CC: Irvine Valley College</h3>
            <h3>Roles: Project & Software Lead</h3>
          </div>
        </div>
        <div className="bioBox">
          <div className="bio">
            <h2>Ryan Lafond</h2>
            <h3>Major: Civil Engineering</h3>
            <h3>Transfer CC: City College of San Francisco</h3>
            <h3>Roles: CAD Lead</h3>
          </div>
          <img className="bioImage" src='Ryan.jpg'></img>
          <img className="bioImage" src='tina.jpg'></img>
          <div className="bio">
            <h2>Tina Zhou</h2>
            <h3>Major: Electrical Engineering</h3>
            <h3>Transfer CC: Santa Monica College</h3>
            <h3>Roles: Circuits Lead</h3>
          </div>
        </div>

      </div>
      <div id = 'page3'>
      <h1 className="title1"> 
          Rover Rangers - Prius R2
        </h1>
        <h1 className="title2"> 
          Documentation
        </h1>
        <div id = 'block1'>
          <img id='priusR1Image' src='priusR1.jpg'></img>
          <div id='priusR1Bio'>
            <h1>Prius R1</h1>
            <h4 className="block2text">
              This is our first model that we built. It has a full range of motion and can move fowards, backwards, right, left, diagonally fowards/right, and diagonally fowards/left.
            </h4>
            <h4 className="block2text">
              Slits were created on the base to the sides of the motor allowing us to add support to the motor from all directions helping to stabilize it.
            </h4>
            <h4 className="block2text">
              Problems include flying parts and insecure motor connection from the tape.
            </h4>
          </div>
        </div>
        <div id = 'block2'>
          <img id='priusR2Image' src='priusR2.jpg'></img>
          <div id='priusR1Bio'>
            <div id='block22'>
              <div id='block22Text'>
                <h1>Prius R2</h1>
                <h4 id='block22Sen'>
                  This is our second model that we built. Comes with a new connection method which  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </h4>
              </div>
              <img id='updatedMotorImage' src='updatedMotor.jpg'></img>
            </div>
            <h4 id='block22Under'>
               replaces the tape and helped to secure the motor. We also added side supports on the chassis which caged in the motor control circuits.
            </h4>
            <h4 className="block2text">
              Sensors were added to measure temperature, humidity, and distance. A camera was also added.
            </h4>
            <h4 className="block2text">
              A challenge we faced when making this model was that out new connection method allowed the motors to slide around inside the slit. To fix this we added a second wooded plate inside which stabilized the motors within the slits.
            </h4>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;

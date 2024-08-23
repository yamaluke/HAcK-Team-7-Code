Final code located in this branch.

# Intro
This code was used during the Mars Rover, 2024 UCLA HAcK Competition. 
The code that our team developed and used can be accessed with the following path:
    "ccweb/src/App.css"
    "ccweb/src/App.js"
    "picoCode/picoWheel/main.py"
The circuit layout for our Raspberry Pi Pico can also be found with the following path: "ccweb/public/team 7 Circuit Layout.jpg"
Our design review presentation can also be found with the following link: https://www.youtube.com/watch?v=f7kG8iIJOoc


# Steps to connect everything together:
## Starting website
1. open terminal and go into "ccweb" directory.
2. use the command "npm start"

## Connecting website to mqtt
1. open terminal and go into "backend" directory.
2. use the command "node index.js"

note: if you would like to connect to your own mqtt broker you can manipulate the variables within the .env folder. You will also need to update the mqtt variables under the "constants.py" file.

## Change wifi information on pico
1. go into "constants.py" and change the ssid to your wifi ssid.
2. change the wifi password within the "main.py" file. This is located on line 60 and is the second argument for the function.

## Connect Raspberry Pi Pico
1. Upload all the files under the directory "picoWheel" onto the Raspberry Pi Pico.
2. either run the "main.py" file on the pico or connect your pico to power. If you connect the pico to power it will automatically run "main.py".
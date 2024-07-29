from machine import Pin
import time #importing time for delay  
from connections import connect_mqtt, connect_internet
from constants import ssid, mqtt_server, mqtt_user, mqtt_pass
from hcsr04 import HCSR04
from dht import DHT11

#=============================================#
#== Function to deal with directional input ==#
#=============================================#
def cb(topic, msg):
#     print(f"Topic: {topic}, Message: {msg}")
    if topic == b'direction':
        if msg == b'motionStop':
            print("stop")
            stop()
        elif msg == b'fowardsGo':
            print("fowards")
            move_forward()
        elif msg == b'backwardsGo':
            print("backwards")
            move_backward()
        elif msg == b'leftSpin':
            spin_left()
            print("spinning left")
        elif msg == b'rightSpin':
            spin_right()
            print("spinning right")
        elif msg == b'leftGo':
            print("left")
            turn_left()
        elif msg == b'rightGo':
            print("right")
            turn_right()
        elif msg == b'lightOff':
            print('light off')
        elif msg == b'lightOn':
            print('light on')
        
        
#===============================#
#== Connecting to the network ==#
#===============================#
def networkConnector():
    try:
        connect_internet(ssid,'UCLA.HAcK.2024.Summer')
        print('Connected to internet')
        
        

    except KeyboardInterrupt:
        print('keyboard interrupt')


#=========================#
#== Defining motor pins ==#
#=========================#
#servo pins 
sensorUS = HCSR04(trigger_pin=28, echo_pin=7, echo_timeout_us = 10000)

# pin connection
led = Pin('LED', mode=Pin.OUT)

#humidity/temp
sensorHT = DHT11(Pin(11, Pin.IN, Pin.PULL_UP))


#OUT1  and OUT2
In1=Pin(18,Pin.OUT) 
In2=Pin(19,Pin.OUT)  
EN_A=Pin(16,Pin.OUT)



#OUT3 and OUT4
In3=Pin(4,Pin.OUT)  
In4=Pin(3,Pin.OUT)  
EN_B=Pin(2,Pin.OUT)

# Full speed; moving speed cannot be adjusted
# Check later version to see how to change the speed
EN_A.high()
EN_B.high()

#==================================#
#== functions to control movment ==#
#==================================#
# Forward
def move_forward():
    In1.low()
    In2.high()
    In3.high()
    In4.low()

# Backward
def move_backward():
    In1.high()
    In2.low()
    In3.low()
    In4.high()
    
#Turn right
def turn_right():
    In1.low()
    In2.low()
    In3.high()
    In4.low()

#Turn left
def turn_left():
    In1.low()
    In2.high()
    In3.low()
    In4.low()

    
#Spin Right
def spin_right():
    In1.high()
    In2.low()
    In3.high()
    In4.low()
    
#Spin Left
def spin_left():
    In1.low()
    In2.high()
    In3.low()
    In4.high()
   
#Stop
def stop():
    In1.low()
    In2.low()
    In3.low()
    In4.low()
    

#=====================#
#== function †ester ==#
#=====================#
def testSeq(testTime):
    move_forward()
    print("Forward")
    time.sleep(testTime)
    stop()
    print("Stop")
    time.sleep(testTime)
    move_backward()
    print("Backward")   
    time.sleep(testTime)
    stop()
    print("Stop")
    time.sleep(testTime)
    spin_left()
    print("Spin left")
    time.sleep(testTime)
    spin_right()
    print("Spin right")
    time.sleep(testTime)
    stop()
    print("Stop")
    time.sleep(testTime)
    stop()
    print("Stop")
    time.sleep(testTime)
    turn_left()
    print("Turn left")
    time.sleep(testTime)
    stop()
    print("Stop")
    time.sleep(testTime)
    turn_right()
    print("Turn right")
    time.sleep(testTime)
    stop()
    print("Stop")
    time.sleep(5)



try:
    # testSeq(.3)
    # network connection
    networkConnector()
    client = connect_mqtt(mqtt_server, mqtt_user, mqtt_pass)

    client.set_callback(cb)
    client.subscribe('direction')
    client.publish("mytopic", "message")
    networkConnector()
    client.check_msg()
            
    
    
    while True:
        # ultra sonic data updater
        distance = sensorUS.distance_cm()
        client.publish('ultrasonic', str(distance))
        print('Distance to the rear: ', distance, 'cm')

        if (distance < 15):
            print('Warning: too close to the object! Distance: ', distance, 'cm')
            led.value(1)
            stop()
        else:
            led.value(0)
            
        # motor data
        client.check_msg()
        
        time.sleep(.1)
        
        # ultra sonic data updater
        distance = sensorUS.distance_cm()
        client.publish('ultrasonic', str(distance))
        print('Distance to the rear: ', distance, 'cm')

        if (distance < 15):
            print('Warning: too close to the object! Distance: ', distance, 'cm')
            led.value(1)
            stop()
        else:
            led.value(0)
            
        # motor data
        client.check_msg()
        
        time.sleep(.1)
        
        # ultra sonic data updater
        distance = sensorUS.distance_cm()
        client.publish('ultrasonic', str(distance))
        print('Distance to the rear: ', distance, 'cm')

        if (distance < 15):
            print('Warning: too close to the object! Distance: ', distance, 'cm')
            led.value(1)
            stop()
        else:
            led.value(0)
            
        # motor data
        client.check_msg()
        
        time.sleep(.1)
        
        #humidity and temp
        sensorHT.measure()
        temp = sensorHT.temperature()
        humid = sensorHT.humidity()
        print("Temperature in Celsius: ", temp)
        client.publish('temp', str(temp))
        print("Humidity: ", humid)
        client.publish('humidity', str(humid))
        
        
        time.sleep(.1)
finally:
    led = Pin('LED', mode=Pin.OUT)
    led.value(0)
    stop()
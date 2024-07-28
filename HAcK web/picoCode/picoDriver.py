from machine import Pin
import time #importing time for delay  
from connections import connect_mqtt, connect_internet
from constants import ssid, mqtt_server, mqtt_user, mqtt_pass

# Function to handle an incoming message

def cb(topic, msg):
#     print(f"Topic: {topic}, Message: {msg}")
    if topic == b'direction':
        if msg == b'fowardsGo':
            print("fowards")
            move_forward()
        if msg == b'fowardsStop':
            print("fowardsStop")
        if msg == b'rightGo':
            print("right")
            turn_right()
        


def networkConnector():
    try:
        connect_internet(ssid,'UCLA.HAcK.2024.Summer')
        print('Connected to internet')
        client = connect_mqtt(mqtt_server, mqtt_user, mqtt_pass)

        client.set_callback(cb)
        client.subscribe('direction')
        client.publish("mytopic", "message")
        while True:
            client.check_msg()
            time.sleep(1)

    except KeyboardInterrupt:
        print('keyboard interrupt')



# Defining motor pins

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
    networkConnector()
finally:
    stop()
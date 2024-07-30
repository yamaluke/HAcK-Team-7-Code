import machine
import utime

# Initialize the servos on their respective pins
servo_one = machine.PWM(machine.Pin(27))
servo_one.freq(50)
servo_two = machine.PWM(machine.Pin(18))
servo_two.freq(50)

# Map a value from one range to another
def interval_mapping(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

# Calculate the PWM duty cycle for the given angle and apply it to the servo
def servo_write(pin, angle):
    pulse_width = interval_mapping(angle, 0, 180, 0.5, 2.5)
    duty = int(interval_mapping(pulse_width, 0, 20, 0, 65535))
    pin.duty_u16(duty)

def smooth_transition(pin1, pin2, start_angle, end_angle, step=1):
    """Move two servos, one moving forward and the other in reverse from start_angle to end_angle."""
    if start_angle < end_angle:
        step = abs(step)  # Ensure step is positive
    else:
        step = -abs(step)  # Ensure step is negative
    
    for angle in range(start_angle, end_angle + step, step):
        opposite_angle = 180 - angle  # Calculate the opposite angle for the second servo
        print("Servo One Angle: ", angle, "degrees")
        print("Servo Two Angle: ", opposite_angle, "degrees")
        servo_write(pin1, angle)
        servo_write(pin2, opposite_angle)
        utime.sleep_ms(20)

# Initially position both servos to 0 degrees and 180 degrees respectively
servo_write(servo_one, 0)
servo_write(servo_two, 180)
utime.sleep_ms(500)  # Short delay to allow servos to reach the initial position

# Main control loop
# Each time code is executed, it firstly grabs, then release
while True:
    smooth_transition(servo_one, servo_two, 0, 90)  # Servo one moves from 0 to 180 degrees, servo two moves from 180 to 0
    smooth_transition(servo_one, servo_two, 90, 0)  # Servo one moves from 180 to 0 degrees, servo two moves from 0 to 180
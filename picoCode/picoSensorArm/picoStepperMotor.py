import utime
from machine import Pin

# Define the pins for the stepper motor
stepper_pins = [Pin(17, Pin.OUT), Pin(16, Pin.OUT), Pin(15, Pin.OUT), Pin(14, Pin.OUT)]

# Define the sequence of steps for the motor to take
step_sequence = [
    [1, 0, 0, 1],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
]

# Global variable to store the current step index
step_index = 0

def step(direction, steps, delay):
    global step_index  # Use the global step_index variable so it can be modified by this function
    for i in range(steps):
        step_index = (step_index + direction) % len(step_sequence)  # Update step_index based on direction
        for pin_index in range(len(stepper_pins)):
            stepper_pins[pin_index].value(step_sequence[step_index][pin_index])
        utime.sleep(delay)

def return_to_initial_position(delay=0.01):
    global step_index
    # Calculate the shortest path back to the initial position (step_index 0)
    steps_to_initial = -step_index if step_index <= len(step_sequence) // 2 else len(step_sequence) - step_index
    step(steps_to_initial, abs(steps_to_initial), delay)

# Reset the motor to the initial position before starting
return_to_initial_position()
# Take the specified number of steps in the anti-clockwise direction
step(-1, 900, 0.01)
# Return to the initial position again
return_to_initial_position()
# Take the specified number of steps in the clockwise direction
step(1, 1000, 0.01)
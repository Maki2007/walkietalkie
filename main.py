frequency = 0
mic = 0
pins.analog_write_pin(AnalogPin.P1, 512)
# set the PWM period
pins.analog_set_pitch_pin(AnalogPin.P1)

def on_forever():
    global mic, frequency
    mic = pins.analog_read_pin(AnalogPin.P2)
    # convert back to Hz
    frequency = Math.map(mic, 0, 1023, 0, 3.3) / 0.004
    serial.write_value("hz", frequency)
    serial.write_value("voltage", Math.map(mic, 0, 1023, 0, 3.3))
    serial.write_value("microphone", mic)
    if mic > 512:
        # pins.analogPitch(frequency, 10)
        period = 1000000 / frequency
        pins.analog_set_period(AnalogPin.P1, 1000000 / frequency)
basic.forever(on_forever)

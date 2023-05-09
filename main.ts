radio.onReceivedNumber(function (receivedNumber) {
    let ADCValue: number[] = []
    for (let i = 0; i <= NumberofSamples - 1; i++) {
        newTime = input.runningTimeMicros()
        ADCValue[i] = receivedNumber
        while (input.runningTimeMicros() < newTime + sampling_period) {
        	
        }
    }
    for (let j = 0; j <= NumberofSamples - 1; j++) {
        freq = Math.map(ADCValue[j], 0, 1023, 20, 20000)
        music.playTone(freq, 10)
        speakerSprite.set(LedSpriteProperty.Y, Math.map(ADCValue[j], 0, 1023, 0, 4))
    }
    speakerSprite.set(LedSpriteProperty.Y, 0)
})
function lowPassFilter (filterInput: number) {
    if (lowPassFilterValue == 0) {
        return filterInput
    } else {
        filteredValue = lowPassFilterValue * filterInput + (1 - lowPassFilterValue) * filteredValue
        return filteredValue
    }
}
input.onButtonPressed(Button.A, function () {
    sending = !(sending)
})
input.onButtonPressed(Button.B, function () {
    if (lowPassFilterValue == 1) {
        lowPassFilterValue = 0
    } else {
        lowPassFilterValue += 0.25
    }
    serial.writeValue("LowPassFilter", lowPassFilterValue)
    filter_sprite.set(LedSpriteProperty.Y, lowPassFilterValue * 5)
})
let microphone = 0
let isRunningV2 = false
let sending = false
let filteredValue = 0
let freq = 0
let newTime = 0
let lowPassFilterValue = 0
let sampling_period = 0
let NumberofSamples = 0
let filter_sprite: game.LedSprite = null
let speakerSprite: game.LedSprite = null
let microphoneSprite = game.createSprite(0, 0)
speakerSprite = game.createSprite(1, 0)
let versionSprite = game.createSprite(4, 1)
filter_sprite = game.createSprite(3, 0)
radio.setGroup(2)
radio.setTransmitPower(7)
pins.setAudioPin(AnalogPin.P1)
let sampleFreq = 8000
NumberofSamples = 128
sampling_period = Math.round(1000000 * (1 / sampleFreq))
lowPassFilterValue = 0
basic.forever(function () {
    if (isRunningV2) {
        microphone = input.soundLevel()
        music.setBuiltInSpeakerEnabled(true)
        versionSprite.set(LedSpriteProperty.Y, 2)
    } else {
        microphone = pins.analogReadPin(AnalogPin.P2)
        music.setBuiltInSpeakerEnabled(false)
        versionSprite.set(LedSpriteProperty.Y, 1)
    }
    if (sending) {
        radio.sendNumber(microphone)
        speakerSprite.set(LedSpriteProperty.Brightness, 32)
        microphoneSprite.set(LedSpriteProperty.Y, Math.map(microphone, 0, 1023, 0, 4))
    } else {
        speakerSprite.set(LedSpriteProperty.Brightness, 255)
        microphoneSprite.set(LedSpriteProperty.Y, 0)
    }
})
basic.forever(function () {
    if (control.hardwareVersion().includes("2")) {
        if (input.logoIsPressed()) {
            isRunningV2 = !(isRunningV2)
        }
    }
})

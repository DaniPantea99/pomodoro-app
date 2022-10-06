const btnPomodoro = document.getElementById('pomodoro')
const btnShortbreak = document.getElementById('shortBreak')
const btnLongbreak = document.getElementById('longBreak')
const btnStartPause = document.getElementsByClassName('start-timer')
const allBtns = document.getElementsByClassName('buttons')
const timeDisplayed = document.querySelector('.time')
const circleElement = document.querySelector('circle')
const audioStart = document.getElementsByClassName('start-audio')
const audioPause = document.getElementsByClassName('pause-audio')
const audioFinish = document.getElementsByClassName('finish-audio')
const btnSettings = document.getElementsByClassName('settings-gear')
const settingsDialog = document.getElementsByClassName('settings')
const userSettingsForm = document.getElementsByClassName('user-settings')
const userInputPomodoro = document.querySelector('input[name="user-pomodoro"]')
const userInputShortbreak = document.querySelector('input[name="user-shortbreak"]')
const userInputLongbreak = document.querySelector('input[name="user-longbreak"]')
const btnApplySettings = document.getElementsByClassName('btn-apply-settings')
const bntCloseSettings = document.getElementsByClassName('close-settings')
const allInputs = document.querySelectorAll('input')


let initialTimeSettings = {
    pomodoro: {
        minutes: 2,
        seconds: 0
    }
}

btnPomodoro.addEventListener('click', () => {
    timeDisplayed.innerText = `${initialTimeSettings.pomodoro.minutes}:0${initialTimeSettings.pomodoro.seconds}`;
})

allBtns.forEach((button) => {
    button.addEventListener('click', () => {
        timeDisplayed.innerText = `${initialTimeSettings.pomodoro.minutes}:0${initialTimeSettings.pomodoro.seconds}`;
    })
})
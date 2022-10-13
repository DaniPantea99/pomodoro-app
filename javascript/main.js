import { highlightActiveBtn, changeStartPauseBtnState } from './utilities.mjs'

export {btnStartPause, allBtns}

const btnPomodoro = document.getElementById('pomodoro')
const btnShortbreak = document.getElementById('shortBreak')
const btnLongbreak = document.getElementById('longBreak')
const btnStartPause = document.querySelector('.start-timer')
const allBtns = document.querySelectorAll('button')
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

let intervalId = null;

let setTime = {
    pomodoro: {
        minutes: 2,
        seconds: 0
    },
    shortBreak: {
        minutes: 3,
        seconds: 0
    },
    longBreak: {
        minutes: 4,
        seconds: 0
    }
}

allBtns.forEach((button) => {
    button.addEventListener('click', () => {
        setTimer(button);
        highlightActiveBtn(button);
        if(btnStartPause.innerText = 'pause'.toUpperCase()){
            changeStartPauseBtnState();
        }
    })
})

btnStartPause.addEventListener('click', () => {
    if(btnStartPause.innerText = 'start'.toUpperCase()){
        const activeBtn = document.querySelector('.button.active');
        changeStartPauseBtnState();
        startCountdown(setTime[activeBtn.id].minutes);
    } else {
        changeStartPauseBtnState();
        stopCountdown();
    }
})

function setTimer(button) {
    if(setTime[button.id].seconds < 10) {
        timeDisplayed.innerText = `${setTime[button.id].minutes}:0${setTime[button.id].seconds}`;
    } else {
        timeDisplayed.innerText = `${setTime[button.id].minutes}:${setTime[button.id].seconds}`;
    }
}

function startCountdown(minutes) {
    let seconds = minutes * 60;
    intervalId = setInterval(() => {
        seconds--;
        let countdownMinutes = Math.floor(seconds / 60);
        let countdownSeconds = seconds - countdownMinutes * 60;
        if (countdownMinutes.toString().length === 1) {
            countdownMinutes = `${countdownMinutes}`;
          }
          if (countdownSeconds.toString().length === 1) {
            countdownSeconds = `0${countdownSeconds}`;
          }
          timeDisplayed.innerText = `${countdownMinutes}:${countdownSeconds}`;
    }, 1000);
}

function stopCountdown() {
    clearInterval(intervalId);
}
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
        timeDisplayed.innerText = `${setTime[button.id].minutes}:0${setTime[button.id].seconds}`;
        highlightActiveBtn(button);
    })
})

function highlightActiveBtn(button) {
    allBtns.forEach((element) => {
        element.classList.remove('active');
    })
    button.classList.add('active');
}

btnStartPause.addEventListener('click', () => {
    changeStartPauseBtnState();
})

function changeStartPauseBtnState() {
    if(btnStartPause.innerText === 'start'.toUpperCase()) {
        btnStartPause.innerText = 'pause'.toUpperCase();
    } else {
        btnStartPause.innerText = 'start'.toUpperCase();
    }
}
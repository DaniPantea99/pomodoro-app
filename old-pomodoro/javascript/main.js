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


// adaug click event pt butoanele pomodoro, shortbreak si longbreak
allBtns.forEach((button) => {
    button.addEventListener('click', () => {
        setTimer(button); // seteaza timpul in functie de butonul apasat - ia valoarea din obiectul setTime si o afiseaza
        highlightActiveBtn(button); // adauga clasa active doar la butonul activ
        if(btnStartPause.innerText = 'pause'.toUpperCase()){
            changeStartPauseBtnState(); // schimba butonul Pause in Start
        }
    })
})

// adaug click event pt btn StartPause
btnStartPause.addEventListener('click', () => {
    if(btnStartPause.innerText === 'start'.toUpperCase()){ // daca butonul arata Start
        const activeBtn = document.querySelector('.button.active');  // apuc butonul cu clasa active
        changeStartPauseBtnState(); // schimb btn Start in Pause
        startCountdown(setTime[activeBtn.id].minutes); // incep numaratoarea inversa in functie de minutele butonului activ
    } else { // daca butonul arata Pause
        changeStartPauseBtnState(); // schimb bnt Pause in Start
        stopCountdown(); // opresc numaratorea inversa

        // salvez noul timp in obiectul setTime
        
    }
})

// setaza timpului in functie de butonul activ - ia valoarea din obiectul setTime si il afiseaza
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

function getCountdownMin() { 
    const countdownText = timeDisplayed.innerText;
    return Number(countdownText.toString().split(":")[0]);
  }
  
  function getCountdownSec(activeBtn) {
    if (activeBtn) {
      return setTime[activeBtn.id].seconds;
    }
    const countdownText = timeDisplayed.innerText;
    return Number(countdownText.toString().split(":")[1]);
  }
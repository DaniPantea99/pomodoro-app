const pomodoroBtn = document.querySelector(`#pomodoro`);
const shortBreakBtn = document.querySelector(`#short-break`);
const longBreakBtn = document.querySelector(`#long-break`);
const time = document.querySelector(`.time`);
const startTimerBtn = document.querySelector(`.start-timer`);
const buttons = document.querySelector(`.buttons`)
const circle = document.querySelector(`circle`);

let intervalId = null;
let stopWatch = null;

initStopWatch();

function initStopWatch() {
    stopWatch = {
        pomodoro: {
            minutes: 10,
            seconds: 0
        },
        shortBreak: {
            minutes: 2,
            seconds: 0
        },
        longBreak: {
            minutes: 5,
            seconds: 0
        }
    }
}

pomodoroBtn.addEventListener('click', function() {
    initStopWatch();
    resetRadialProgress();
    setTimer(stopWatch.pomodoro.minutes, pomodoroBtn);
});

shortBreakBtn.addEventListener('click', function() {
    initStopWatch();
    resetRadialProgress();
    setTimer(stopWatch.shortBreak.minutes, shortBreakBtn);
});

longBreakBtn.addEventListener('click', function() {
    initStopWatch();
    resetRadialProgress();
    setTimer(stopWatch.longBreak.minutes, longBreakBtn);
});

function setTimer(minutes, button) {
    clearInterval(intervalId);
    startTimerBtn.innerText = 'start';
    time.innerText = `${minutes}:00`;
    // remove all other active class
    [...buttons.children].forEach(element => {
        element.classList.remove('active');
    });
    // set active class
    button.classList.add('active');
};

function getCountdownMin() {
    const countdownText = time.innerText;
    return Number(countdownText.toString().split(':')[0]);
}

function getCountdownSec() {
    const countdownText = time.innerText;
    return Number(countdownText.toString().split(':')[1]);
}

startTimerBtn.addEventListener('click', function() {
    // countdown starts
    clearInterval(intervalId)    
    
    if(startTimerBtn.innerText === 'start'.toUpperCase()) {
        
        if(getCountdownMin() != 0) {
            startCountdown(getCountdownMin());
            // startRadialProgress('100s');
            startTimerBtn.innerText = 'pause';
        } else {
            alert('Alege o optiune');
        }
    } else {
        startTimerBtn.innerText = 'start';
        const activeBtn = document.querySelector('.button.active')
        switch (activeBtn?.id) {
            case 'pomodoro':
                stopWatch.pomodoro = {
                    minutes: getCountdownMin(),
                    seconds: getCountdownSec()
                }
                break;
            case 'short-break':
                stopWatch.shortBreak = {
                    minutes: getCountdownMin(),
                    seconds: getCountdownSec()
                }
                break;
            case 'long-break':
                stopWatch.longBreak = {
                    minutes: getCountdownMin(),
                    seconds: getCountdownSec()
                }
                break;
            }
    }
});



function startCountdown(minutes) {
    const activeBtn = document.querySelector('.button.active')
    let seconds = minutes * 60;
    let progress = `${seconds}s`;
    startRadialProgress(progress);
    switch (activeBtn?.id) {
        case 'pomodoro':
             seconds += stopWatch.pomodoro.seconds;
            break;
        case 'short-break':
            seconds += stopWatch.shortBreak.seconds;
            break;
        case 'long-break':
            seconds += stopWatch.longBreak.seconds;
            break;
    }
    intervalId = setInterval( () => {
        seconds--;
        if(seconds === 0) {
            clearInterval(intervalId);
        }
        let countdownMinutes = Math.floor(seconds / 60);
        let countdownSeconds = seconds - countdownMinutes * 60;
        if(countdownMinutes.toString().length === 1){
            countdownMinutes = `0${countdownMinutes}`;
        }
        if(countdownSeconds.toString().length === 1){
            countdownSeconds = `0${countdownSeconds}`;
        }
        time.innerText = `${countdownMinutes}:${countdownSeconds}`;
    }, 1000);
}

function startRadialProgress(seconds) {
    circle.style.animationDuration = seconds;
    circle.style.strokeDashoffset = '0';
}

function resetRadialProgress() {
    circle.style.animationDuration = '0s';
    circle.style.strokeDashoffset = '580';
}
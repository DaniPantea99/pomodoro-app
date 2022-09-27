const pomodoroBtn = document.querySelector(`#pomodoro`);
const shortBreakBtn = document.querySelector(`#short-break`);
const longBreakBtn = document.querySelector(`#long-break`);
const time = document.querySelector(`.time`);
const startTimerBtn = document.querySelector(`.start-timer`);
const buttons = document.querySelector(`.buttons`)
const circle = document.querySelector(`circle`);
const finishAudio = document.querySelector('.finish-audio');
const startAudio = document.querySelector('.start-audio');
const pauseAudio = document.querySelector('.pause-audio');

let intervalId = null;
let stopWatch = null;



initStopWatch();

function initStopWatch() {
    stopWatch = {
        pomodoro: {
            minutes: 3,
            seconds: 0
        },
        shortBreak: {
            minutes: 1,
            seconds: 0
        },
        longBreak: {
            minutes: 2,
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
    removeAllActiveClass();
    // set active class
    button.classList.add('active');
};

function removeAllActiveClass() {
    [...buttons.children].forEach(element => {
        element.classList.remove('active');
    });
}

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
    // let progress = stopWatch.pomodoro.minutes * 60; 
    
    if(startTimerBtn.innerText === 'start'.toUpperCase()) {
        if(getCountdownMin() === 0 && getCountdownSec() === 0) {
            alert('Alege o optiune');
        } else {
            startCountdown(getCountdownMin());


        // -----------------------------

            const activeBtn2 = document.querySelector('.button.active')
        switch (activeBtn2?.id) {
            case 'pomodoro':
                initStopWatch();
                let progress1 = stopWatch.pomodoro.minutes * 60;
                startRadialProgress(`${progress1}s`);
                break;
            case 'short-break':
                initStopWatch();
                let progress2 = stopWatch.shortBreak.minutes * 60;
                startRadialProgress(`${progress2}s`);
                break;
            case 'long-break':
                initStopWatch();
                let progress3 = stopWatch.longBreak.minutes * 60;
                startRadialProgress(`${progress3}s`);
                break;
            }

            // ---------------------------------

            
            // startRadialProgress(`${progress}s`);


            startAudio.currentTime = 0;
            startAudio.play();
            startTimerBtn.innerText = 'pause';
            circle.style.animationPlayState = 'running';
        }
    } else {
        startTimerBtn.innerText = 'start';
        pauseAudio.currentTime = 0;
        pauseAudio.play();
        circle.style.animationPlayState = 'paused';
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
    // const progress = `${seconds}s`;
    // const progress = minutes * 60;
    // startRadialProgress(`${progress}s`);
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
            finishAudio.play();
            removeAllActiveClass();
            startTimerBtn.innerText = 'start';
        }
        let countdownMinutes = Math.floor(seconds / 60);
        let countdownSeconds = seconds - countdownMinutes * 60;
        if(countdownMinutes.toString().length === 1){
            countdownMinutes = `${countdownMinutes}`;
        }
        if(countdownSeconds.toString().length === 1){
            countdownSeconds = `0${countdownSeconds}`;
        }
        time.innerText = `${countdownMinutes}:${countdownSeconds}`;
    }, 1000);
}

function startRadialProgress(seconds) {
    circle.style.animation = 'anim linear forwards';
    circle.style.animationDuration = seconds;
    circle.style.strokeDashoffset = '0';
    // circle.offsetWidth;
}

function resetRadialProgress() {
    circle.style.strokeDashoffset = '580';
    circle.style.animation = 'none';
}
// const pomodoro = document.querySelector('#pomodoro');
// const timeSetting = document.querySelector('.time');
// const start = document.querySelector('.set-timer-state');

// // const minutes = 60;
// // const seconds = 60;
// let time=5;

// start.addEventListener('click', function() {
//     if(time > 0) {
//         setInterval(startPomodoro, 1000);
//         console.log(time);
//     } else {
//         clearInterval();
//     }
// });

// pomodoro.addEventListener('click', function() {
//     timeSetting.innerText = time; 
// });

// function startPomodoro(){
//     timeSetting.innerText = time;
//         time=time-1;
// }
// class SetTime {
//     constructor() {
//         this.pomodoro = document.getElementById('#pomodoro');
//         this.time = document.getElementsByName('.time'); 
//     }
//     console.log(time);

//     updateTime() {
//         this.time.innerText = '25';
//     }

// }

// const newTime = new SetTime();

// newTime.pomodoro.addEventListener('click', function() {
//     newTime.updateTime();
// });


const pomodoroBtn = document.querySelector(`#pomodoro`);
const shortBreakBtn = document.querySelector(`#short-break`);
const longBreakBtn = document.querySelector(`#long-break`);
const time = document.querySelector(`.time`);
const startTimerBtn = document.querySelector(`.start-timer`);
const buttons = document.querySelector(`.buttons`)

const circle = document.querySelector(`circle`);



pomodoroBtn.addEventListener('click', function() {
    setTimer(25, pomodoroBtn);
});

shortBreakBtn.addEventListener('click', function() {
    setTimer(5, shortBreakBtn);
});

longBreakBtn.addEventListener('click', function() {
    setTimer(10, longBreakBtn);
});

function setTimer(minutes, button) {
    time.innerText = `${minutes}:00`;
    // remove all other active class
    [...buttons.children].forEach(element => {
        element.classList.remove('active');
    });
    // set active class
    button.classList.add('active');
};

startTimerBtn.addEventListener('click', function() {
    // countdown starts

    // change start-timer text from start to pause


    // if press again when pause text appears the text needs to be changed back to start & the time needs to pause

    // if countdown finish - text needs to be modified to start & active class from buttons needs to be removed


});



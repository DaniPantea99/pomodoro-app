const pomodoroTime = document.getElementById('pomodoro');
const timeSetting = document.querySelector('.time');

const minutes=60;
const seconds=60;

let time=5;
pomodoroTime.addEventListener('click', function() {
    timeSetting.innerText = time;
    if(time > 0) {
        setInterval(startPomodoro, 1000);
        console.log(time);
    } else {
        clearInterval();
    }
    
})

function startPomodoro(){
    // timeSetting.innerText = time;
        time=time-1;
}
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
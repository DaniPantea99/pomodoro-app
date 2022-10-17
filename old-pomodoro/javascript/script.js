const pomodoroBtn = document.querySelector(`#pomodoro`);
const shortBreakBtn = document.querySelector(`#shortBreak`);
const longBreakBtn = document.querySelector(`#longBreak`);
const time = document.querySelector(`.time`);
const startTimerBtn = document.querySelector(`.start-timer`);
const buttons = document.querySelector(`.buttons`);

const circle = document.querySelector(`circle`);
const finishAudio = document.querySelector(".finish-audio");
const startAudio = document.querySelector(".start-audio");
const pauseAudio = document.querySelector(".pause-audio");

const settingsBtn = document.querySelector(".settings-gear");
const settings = document.querySelector(".settings");
const userSettings = document.querySelector(".user-settings");
const userPomodoro = document.querySelector('input[name="user-pomodoro"]');
const userShortbreak = document.querySelector('input[name="user-shortbreak"]');
const userLongbreak = document.querySelector('input[name="user-longbreak"]');
const applyBtn = document.querySelector(".btn-apply-settings");
const closeSettings = document.querySelector(".close-settings");
const userSettingsInputs = document.querySelectorAll("input");

let intervalId = null;
let stopWatch = null;
let settingsObj = {
  pomodoro: 2,
  shortBreak: 3,
  longBreak: 4
};

userSettingsInputs.forEach((element) => {
  element.addEventListener("input", () => {
    disableApplyBtnIfFormInvalid();
  });
});

pomodoroBtn.addEventListener("click", () => {
  setUserStopWatch(); //
  resetRadialProgress();
  setTimer(stopWatch.pomodoro.minutes, 0, pomodoroBtn);
});

shortBreakBtn.addEventListener("click", () => {
  setUserStopWatch();
  resetRadialProgress();
  setTimer(stopWatch.shortBreak.minutes, 0, shortBreakBtn);
});

longBreakBtn.addEventListener("click", () => {
  setUserStopWatch();
  resetRadialProgress();
  setTimer(stopWatch.longBreak.minutes, 0, longBreakBtn);
});

settingsBtn.addEventListener("click", () => {
  userPomodoro.value = settingsObj.pomodoro;
  userShortbreak.value = settingsObj.shortBreak;
  userLongbreak.value = settingsObj.longBreak;
  disableApplyBtnIfFormInvalid();
  settings.showModal();
});

startTimerBtn.addEventListener("click", () => {
  // countdown starts
  clearInterval(intervalId);
  const activeBtn = document.querySelector(".button.active");
  if (startTimerBtn.innerText === "start".toUpperCase()) {
    if (getCountdownMin() === 0 && getCountdownSec() === 0) {
      alert("Nothing selected! Please select one category!");
    } else {
      setUserStopWatch();
      startCountdown(getCountdownMin());
      let progress = stopWatch[activeBtn.id].minutes * 60;
      startRadialProgress(`${progress}s`);
      startAudio.currentTime = 0;
      startAudio.play();
      startTimerBtn.innerText = "pause";
      circle.style.animationPlayState = "running";
    }
  } else {
    startTimerBtn.innerText = "start";
    pauseAudio.currentTime = 0;
    pauseAudio.play();
    circle.style.animationPlayState = "paused";
    // updateStopWatch();
  }
});

applyBtn.addEventListener("click", () => {
  settingsObj.pomodoro = userPomodoro.value;
  settingsObj.shortBreak = userShortbreak.value;
  settingsObj.longBreak = userLongbreak.value;
  setUserStopWatch();
  const activeBtn = document.querySelector(".button.active");
  if (stopWatch[activeBtn.id].seconds != 0) {
    let newMinutes = settingsObj[activeBtn.id] - 1;
    stopWatch[activeBtn.id].minutes = newMinutes;
    setTimer(newMinutes, stopWatch[activeBtn.id].seconds ?? 0, activeBtn);
  } else {
    setTimer(
      settingsObj[activeBtn.id],
      stopWatch[activeBtn.id].seconds ?? 0,
      activeBtn
    );
  }
  settings.close();
});

closeSettings.addEventListener("click", () => {
  settings.close();
});

function setUserStopWatch() {
  const activeBtn = document.querySelector(".button.active");
  stopWatch = {
    pomodoro: {
      minutes: settingsObj.pomodoro,
      seconds: getCountdownSec(activeBtn)
    },
    shortBreak: {
      minutes: settingsObj.shortBreak,
      seconds: getCountdownSec(activeBtn)
    },
    longBreak: {
      minutes: settingsObj.longBreak,
      seconds: getCountdownSec(activeBtn)
    }
  };
}

function setTimer(minutes, seconds, button) {
  clearInterval(intervalId);
  startTimerBtn.innerText = "start";
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  time.innerText = `${minutes}:${seconds}`;
  // remove all other active class
  removeAllActiveClass();
  // set active class
  button.classList.add("active");
}

function startCountdown(minutes) {
  // selectez butonul activ
  const activeBtn = document.querySelector(".button.active");
  // aflu si salvez totatul de secunde in functie de cate minute sunt pe ecran
  let seconds = minutes * 60;
  // la totalul de secunde adaug secundele din stopWatch al butonului activ daca secundele din stop Watch diferit de null?
  seconds += stopWatch[activeBtn.id].seconds ?? 0;
  intervalId = setInterval(() => { // atribui functia setInterval la intervaliId 
    seconds--; // decrementez secundele
    if (seconds === 0) { // verific daca secundele sunt egale cu zero
      clearInterval(intervalId); // daca secundele sunt zero atunci resetez intervalul
      finishAudio.play(); // pornesc audio
      setTimer( // setez timerul cu valorile din stopWatch in functie de butonul activ
        stopWatch[activeBtn.id].minutes,
        stopWatch[activeBtn.id].seconds ?? 0,
        activeBtn
      );
      resetRadialProgress();
      startTimerBtn.innerText = "start";
    } else { // daca secundele nu sunt agale cu zero atunci
      let countdownMinutes = Math.floor(seconds / 60);
      let countdownSeconds = seconds - countdownMinutes * 60;
      if (countdownMinutes.toString().length === 1) {
        countdownMinutes = `${countdownMinutes}`;
      }
      if (countdownSeconds.toString().length === 1) {
        countdownSeconds = `0${countdownSeconds}`;
      }
      time.innerText = `${countdownMinutes}:${countdownSeconds}`;
    }
    updateStopWatch();
  }, 1000);
}



function startRadialProgress(seconds) {
  circle.style.animation = "anim linear forwards";
  circle.style.animationDuration = seconds;
  circle.style.strokeDashoffset = "0";
}

function resetRadialProgress() {
  circle.style.strokeDashoffset = "580";
  circle.style.animation = "none";
}

function removeAllActiveClass() {
  [...buttons.children].forEach((element) => {
    element.classList.remove("active");
  });
}

function disableApplyBtnIfFormInvalid() {
  if (userSettings.checkValidity()) {
    applyBtn.removeAttribute("disabled");
  } else {
    applyBtn.setAttribute("disabled", true);
  }
}


// ce face Functia updateStopWatch ?
// actualizeaza stopWatch pentru butonul activ cu:
// minute = minutele de pe ecran
// secunde = cu secundele de pe ecran
function updateStopWatch() {
  const activeBtn = document.querySelector(".button.active");
  stopWatch[activeBtn.id] = {
    minutes: getCountdownMin(),
    seconds: getCountdownSec()
  }
}

function getCountdownMin() { // returneaza minutele
  const countdownText = time.innerText;
  return Number(countdownText.toString().split(":")[0]);
}

function getCountdownSec(activeBtn) {
  if (activeBtn) {
    return stopWatch[activeBtn.id].seconds;
  }
  const countdownText = time.innerText;
  return Number(countdownText.toString().split(":")[1]);
}

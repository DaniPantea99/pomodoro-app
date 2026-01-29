const pomodoroBtn = document.querySelector(`#pomodoro`);
const shortBreakBtn = document.querySelector(`#shortBreak`);
const longBreakBtn = document.querySelector(`#longBreak`);
const minutesDisplay = document.querySelector('.minutes');
const secondsDisplay = document.querySelector('.seconds');
const startTimerBtn = document.querySelector(`.start-timer`);
const buttons = document.querySelector(`.buttons`);

const circle = document.querySelector(`circle`);
const finishAudio = document.querySelector('.finish-audio');
const startAudio = document.querySelector('.start-audio');
const pauseAudio = document.querySelector('.pause-audio');

const settingsBtn = document.querySelector('.settings-gear');
const settings = document.querySelector('.settings');
const userSettings = document.querySelector('.user-settings');
const userPomodoro = document.querySelector('input[name="user-pomodoro"]');
const userShortbreak = document.querySelector('input[name="user-shortbreak"]');
const userLongbreak = document.querySelector('input[name="user-longbreak"]');
const applyBtn = document.querySelector('.btn-apply-settings');
const closeSettings = document.querySelector('.close-settings');
const userSettingsInputs = document.querySelectorAll('input');
const outerDial = document.querySelector('.outer-dial');
const timer = document.querySelector('.timer');

let intervalId = null;
let remainingSeconds = 0;
let isPaused = false;
let settingsObj = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

// Initialize stopWatch object to prevent ReferenceError
let stopWatch = {
  pomodoro: { minutes: 25, seconds: 0 },
  shortBreak: { minutes: 5, seconds: 0 },
  longBreak: { minutes: 15, seconds: 0 },
};

userSettingsInputs.forEach((element) => {
  element.addEventListener('input', () => {
    disableApplyBtnIfFormInvalid();
  });
});

pomodoroBtn.addEventListener('click', () => {
  resetRadialProgress();
  setUserStopWatch();
  setTimer(stopWatch.pomodoro.minutes, 0, pomodoroBtn);
});

shortBreakBtn.addEventListener('click', () => {
  resetRadialProgress();
  setUserStopWatch();
  setTimer(stopWatch.shortBreak.minutes, 0, shortBreakBtn);
});

longBreakBtn.addEventListener('click', () => {
  resetRadialProgress();
  setUserStopWatch();
  setTimer(stopWatch.longBreak.minutes, 0, longBreakBtn);
});

settingsBtn.addEventListener('click', () => {
  userPomodoro.value = settingsObj.pomodoro;
  userShortbreak.value = settingsObj.shortBreak;
  userLongbreak.value = settingsObj.longBreak;
  disableApplyBtnIfFormInvalid();
  settings.showModal();
});

function toggleTimer() {
  // Check if a mode is selected
  const activeBtn = document.querySelector('.button.active');
  if (!activeBtn) {
    alert('Please select a mode first (pomodoro, short break, or long break)');
    return;
  }

  // countdown starts
  clearInterval(intervalId);
  if (startTimerBtn.innerText === 'start'.toUpperCase()) {
    if (getCountdownMin() === 0 && getCountdownSec() === 0) {
      alert('Nothing selected! Please select one category!');
    } else {
      setUserStopWatch();
      startCountdown(getCountdownMin());
      if (circle.style.strokeDashoffset === '580') {
        let progress = stopWatch[activeBtn.id].minutes * 60;
        startRadialProgress(`${progress}s`);
      } else {
        circle.style.animationPlayState = 'running';
      }
      try {
        startAudio.currentTime = 0;
        startAudio.play();
      } catch (e) {
        console.error('Error playing start audio:', e);
      }
      startTimerBtn.innerText = 'pause';
    }
  } else {
    // Pause functionality
    startTimerBtn.innerText = 'start';
    clearInterval(intervalId); // Stop the countdown timer
    try {
      pauseAudio.currentTime = 0;
      pauseAudio.play();
    } catch (e) {
      console.error('Error playing pause audio:', e);
    }
    circle.style.animationPlayState = 'paused';
  }
}

startTimerBtn.addEventListener('click', toggleTimer);

applyBtn.addEventListener('click', () => {
  settingsObj.pomodoro = userPomodoro.value;
  settingsObj.shortBreak = userShortbreak.value;
  settingsObj.longBreak = userLongbreak.value;

  const activeBtn = document.querySelector('.button.active');
  if (activeBtn) {
    // Apply the new time settings directly without illogical decrement
    setTimer(settingsObj[activeBtn.id], 0, activeBtn);
  }
  settings.close();
});

closeSettings.addEventListener('click', () => {
  settings.close();
});

timer.addEventListener('click', toggleTimer);

function setUserStopWatch() {
  const activeBtn = document.querySelector('.button.active');
  // Initialize all timers with current user settings
  stopWatch = {
    pomodoro: {
      minutes: settingsObj.pomodoro,
      seconds: 0,
    },
    shortBreak: {
      minutes: settingsObj.shortBreak,
      seconds: 0,
    },
    longBreak: {
      minutes: settingsObj.longBreak,
      seconds: 0,
    },
  };
}

function setTimer(minutes, seconds, button) {
  clearInterval(intervalId);
  startTimerBtn.innerText = 'start';

  // Format both minutes and seconds with zero-padding
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  minutesDisplay.innerText = formattedMinutes;
  secondsDisplay.innerText = formattedSeconds;

  // remove all other active class
  removeAllActiveClass();
  // set active class
  button.classList.add('active');
}

function startCountdown(minutes) {
  const activeBtn = document.querySelector('.button.active');
  const totalSeconds = minutes * 60 + getCountdownSec();
  const startTime = Date.now();

  intervalId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = totalSeconds - elapsed;

    if (remaining <= 0) {
      clearInterval(intervalId);
      try {
        finishAudio.play();
      } catch (e) {
        console.error('Error playing finish audio:', e);
      }
      setTimer(
        stopWatch[activeBtn.id].minutes,
        stopWatch[activeBtn.id].seconds ?? 0,
        activeBtn,
      );
      resetRadialProgress();
      startTimerBtn.innerText = 'start';
      isPaused = false;
    } else {
      const countdownMinutes = Math.floor(remaining / 60);
      const countdownSeconds = remaining % 60;

      // Display with zero-padding for both minutes and seconds
      minutesDisplay.innerText = countdownMinutes.toString().padStart(2, '0');
      secondsDisplay.innerText = countdownSeconds.toString().padStart(2, '0');

      remainingSeconds = remaining;
    }
  }, 1000); // Update every second instead of 100ms for better performance
}

function startRadialProgress(seconds) {
  circle.style.animation = 'anim linear forwards';
  circle.style.animationDuration = seconds;
  circle.style.strokeDashoffset = '0';
}

function resetRadialProgress() {
  circle.style.strokeDashoffset = '580';
  circle.style.animation = 'none';
}

function removeAllActiveClass() {
  [...buttons.children].forEach((element) => {
    element.classList.remove('active');
  });
}

function disableApplyBtnIfFormInvalid() {
  if (userSettings.checkValidity()) {
    applyBtn.removeAttribute('disabled');
  } else {
    applyBtn.setAttribute('disabled', true);
  }
}

function getCountdownMin() {
  return Number(minutesDisplay.innerText);
}

// Get countdown seconds from display
function getCountdownSec() {
  return Number(secondsDisplay.innerText);
}

// Get stored seconds for active timer
function getStoredSeconds(activeBtn) {
  return stopWatch[activeBtn.id].seconds ?? 0;
}

// Initialize: Select pomodoro mode by default on page load
resetRadialProgress();
setTimer(25, 0, pomodoroBtn);

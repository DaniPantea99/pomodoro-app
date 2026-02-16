// ==================== DOM ELEMENTS ====================
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

// ==================== NEW FEATURE ELEMENTS ====================
// Task panel elements
const taskPanel = document.querySelector('.task-panel');
const taskListBtn = document.querySelector('.task-list-btn');
const closeTaskPanel = document.querySelector('.close-task-panel');
const taskInput = document.querySelector('.task-input');
const addTaskBtn = document.querySelector('.add-task-btn');
const taskList = document.querySelector('.task-list');
const taskCounter = document.querySelector('.task-counter');

// Session counter elements
const sessionCounterDisplay = document.querySelector('.session-counter');

// Settings toggles
const autoStartBreakToggle = document.getElementById('auto-start-break');
const autoStartPomodoroToggle = document.getElementById('auto-start-pomodoro');
const enableNotificationsToggle = document.getElementById('enable-notifications');
const enableSoundToggle = document.getElementById('enable-sound');
const volumeSlider = document.getElementById('volume-slider');

// ==================== STATE ====================
let intervalId = null;
let remainingSeconds = 0;
let isPaused = false;

// Default settings
let settingsObj = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreak: false,
  autoStartPomodoro: false,
  notifications: true,
  soundEnabled: true,
  volume: 0.7
};

// Stopwatch object
let stopWatch = {
  pomodoro: { minutes: 25, seconds: 0 },
  shortBreak: { minutes: 5, seconds: 0 },
  longBreak: { minutes: 15, seconds: 0 },
};

// Session statistics
let stats = {
  completedPomodoros: 0,
  totalFocusTime: 0, // in minutes
  dailyPomodoros: {},
  currentStreak: 0
};

// Tasks
let tasks = [];
let currentTaskId = null;

// ==================== LOCAL STORAGE ====================
function loadFromStorage() {
  // Load settings
  const savedSettings = localStorage.getItem('pomodoroSettings');
  if (savedSettings) {
    settingsObj = { ...settingsObj, ...JSON.parse(savedSettings) };
  }

  // Load stats
  const savedStats = localStorage.getItem('pomodoroStats');
  if (savedStats) {
    stats = JSON.parse(savedStats);
    // Reset daily count if it's a new day
    const today = new Date().toDateString();
    if (!stats.dailyPomodoros[today]) {
      stats.dailyPomodoros[today] = 0;
    }
  } else {
    // Initialize stats
    const today = new Date().toDateString();
    stats.dailyPomodoros[today] = 0;
  }

  // Load tasks
  const savedTasks = localStorage.getItem('pomodoroTasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

function saveSettings() {
  localStorage.setItem('pomodoroSettings', JSON.stringify(settingsObj));
}

function saveStats() {
  localStorage.setItem('pomodoroStats', JSON.stringify(stats));
}

function saveTasks() {
  localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
}

// ==================== BROWSER NOTIFICATIONS ====================
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function showNotification(title, body) {
  if (!settingsObj.notifications) return;
  
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: './assets/icon.png',
      badge: './assets/icon.png'
    });
  }
}

// ==================== SESSION STATISTICS ====================
function updateSessionCounter() {
  const today = new Date().toDateString();
  const todayCount = stats.dailyPomodoros[today] || 0;
  
  if (sessionCounterDisplay) {
    sessionCounterDisplay.textContent = `🍅 ${todayCount} today`;
  }
}

function incrementPomodoroCount() {
  const today = new Date().toDateString();
  stats.completedPomodoros++;
  stats.totalFocusTime += settingsObj.pomodoro;
  stats.dailyPomodoros[today] = (stats.dailyPomodoros[today] || 0) + 1;
  saveStats();
  updateSessionCounter();
}

// ==================== AUTO-START ====================
function autoStartNextSession() {
  const activeBtn = document.querySelector('.button.active');
  if (!activeBtn) return;

  let nextSessionType = '';
  let nextBtn = null;

  if (activeBtn.id === 'pomodoro') {
    // After pomodoro, start break
    if (settingsObj.autoStartBreak) {
      nextSessionType = 'shortBreak';
      nextBtn = shortBreakBtn;
    }
  } else {
    // After break, start pomodoro
    if (settingsObj.autoStartPomodoro) {
      nextSessionType = 'pomodoro';
      nextBtn = pomodoroBtn;
    }
  }

  if (nextBtn) {
    setTimeout(() => {
      setTimer(settingsObj[nextSessionType], 0, nextBtn);
      toggleTimer();
    }, 3000); // 3 second delay
  }
}

// ==================== TASK MANAGEMENT ====================
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    pomodorosSpent: 0,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  if (currentTaskId === taskId) {
    currentTaskId = null;
  }
  saveTasks();
  renderTasks();
}

function toggleTaskComplete(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function selectTask(taskId) {
  currentTaskId = taskId;
  renderTasks();
}

function incrementTaskPomodoro() {
  if (currentTaskId) {
    const task = tasks.find(t => t.id === currentTaskId);
    if (task) {
      task.pomodorosSpent++;
      saveTasks();
      renderTasks();
    }
  }
}

function renderTasks() {
  if (!taskList) return;
  
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} ${task.id === currentTaskId ? 'active' : ''}`;
    li.innerHTML = `
      <span class="task-text" data-id="${task.id}">${task.text}</span>
      <span class="task-pomodoros">${task.pomodorosSpent} 🍅</span>
      <button class="delete-task" data-id="${task.id}">×</button>
    `;
    taskList.appendChild(li);
  });

  // Update counter
  const activeTasks = tasks.filter(t => !t.completed).length;
  if (taskCounter) {
    taskCounter.textContent = `${activeTasks} active task${activeTasks !== 1 ? 's' : ''}`;
  }
}

// ==================== EVENT LISTENERS ====================
// Initialize app
loadFromStorage();
updateSessionCounter();
requestNotificationPermission();

// Settings inputs
userSettingsInputs.forEach((element) => {
  element.addEventListener('input', () => {
    disableApplyBtnIfFormInvalid();
  });
});

// Mode buttons
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

// Settings
settingsBtn.addEventListener('click', () => {
  userPomodoro.value = settingsObj.pomodoro;
  userShortbreak.value = settingsObj.shortBreak;
  userLongbreak.value = settingsObj.longBreak;
  
  // Populate new settings
  if (autoStartBreakToggle) autoStartBreakToggle.checked = settingsObj.autoStartBreak;
  if (autoStartPomodoroToggle) autoStartPomodoroToggle.checked = settingsObj.autoStartPomodoro;
  if (enableNotificationsToggle) enableNotificationsToggle.checked = settingsObj.notifications;
  if (enableSoundToggle) enableSoundToggle.checked = settingsObj.soundEnabled;
  if (volumeSlider) volumeSlider.value = settingsObj.volume;
  
  disableApplyBtnIfFormInvalid();
  settings.showModal();
});

applyBtn.addEventListener('click', () => {
  settingsObj.pomodoro = userPomodoro.value;
  settingsObj.shortBreak = userShortbreak.value;
  settingsObj.longBreak = userLongbreak.value;
  
  // New settings
  settingsObj.autoStartBreak = autoStartBreakToggle?.checked || false;
  settingsObj.autoStartPomodoro = autoStartPomodoroToggle?.checked || false;
  settingsObj.notifications = enableNotificationsToggle?.checked ?? true;
  settingsObj.soundEnabled = enableSoundToggle?.checked ?? true;
  settingsObj.volume = parseFloat(volumeSlider?.value || 0.7);
  
  saveSettings();

  const activeBtn = document.querySelector('.button.active');
  if (activeBtn) {
    setTimer(settingsObj[activeBtn.id], 0, activeBtn);
  }
  settings.close();
});

closeSettings.addEventListener('click', () => {
  settings.close();
});

timer.addEventListener('click', toggleTimer);

// Task panel events
if (taskListBtn) {
  taskListBtn.addEventListener('click', () => {
    taskPanel.showModal();
  });
}

if (closeTaskPanel) {
  closeTaskPanel.addEventListener('click', () => {
    taskPanel.close();
  });
}

if (addTaskBtn) {
  addTaskBtn.addEventListener('click', addTask);
}

if (taskInput) {
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
}

if (taskList) {
  taskList.addEventListener('click', (e) => {
    const taskId = parseInt(e.target.dataset.id);
    if (e.target.classList.contains('delete-task')) {
      deleteTask(taskId);
    } else if (e.target.classList.contains('task-text')) {
      toggleTaskComplete(taskId);
    } else if (e.target.classList.contains('task-item')) {
      selectTask(parseInt(e.target.dataset.id || e.target.querySelector('.task-text')?.dataset.id));
    }
  });
}

// ==================== TIMER FUNCTIONS ====================
function toggleTimer() {
  const activeBtn = document.querySelector('.button.active');
  if (!activeBtn) {
    alert('Please select a mode first (pomodoro, short break, or long break)');
    return;
  }

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
      
      if (settingsObj.soundEnabled) {
        try {
          startAudio.currentTime = 0;
          startAudio.volume = settingsObj.volume;
          startAudio.play();
        } catch (e) {
          console.error('Error playing start audio:', e);
        }
      }
      
      startTimerBtn.innerText = 'pause';
    }
  } else {
    startTimerBtn.innerText = 'start';
    clearInterval(intervalId);
    
    if (settingsObj.soundEnabled) {
      try {
        pauseAudio.currentTime = 0;
        pauseAudio.volume = settingsObj.volume;
        pauseAudio.play();
      } catch (e) {
        console.error('Error playing pause audio:', e);
      }
    }
    
    circle.style.animationPlayState = 'paused';
  }
}

startTimerBtn.addEventListener('click', toggleTimer);

function setUserStopWatch() {
  const activeBtn = document.querySelector('.button.active');
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

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  minutesDisplay.innerText = formattedMinutes;
  secondsDisplay.innerText = formattedSeconds;

  removeAllActiveClass();
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
      
      if (settingsObj.soundEnabled) {
        try {
          finishAudio.currentTime = 0;
          finishAudio.volume = settingsObj.volume;
          finishAudio.play();
        } catch (e) {
          console.error('Error playing finish audio:', e);
        }
      }
      
      // Track completed pomodoro
      if (activeBtn.id === 'pomodoro') {
        incrementPomodoroCount();
        incrementTaskPomodoro();
        showNotification('Pomodoro Complete!', 'Great work! Time for a break.');
      } else {
        showNotification('Break Complete!', 'Ready to focus again?');
      }
      
      setTimer(
        stopWatch[activeBtn.id].minutes,
        stopWatch[activeBtn.id].seconds ?? 0,
        activeBtn,
      );
      resetRadialProgress();
      startTimerBtn.innerText = 'start';
      isPaused = false;
      
      // Auto-start next session
      autoStartNextSession();
    } else {
      const countdownMinutes = Math.floor(remaining / 60);
      const countdownSeconds = remaining % 60;

      minutesDisplay.innerText = countdownMinutes.toString().padStart(2, '0');
      secondsDisplay.innerText = countdownSeconds.toString().padStart(2, '0');

      remainingSeconds = remaining;
    }
  }, 1000);
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

function getCountdownSec() {
  return Number(secondsDisplay.innerText);
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
  // Don't trigger shortcuts when typing in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      toggleTimer();
      break;
    case 'Digit1':
    case 'Numpad1':
      pomodoroBtn.click();
      break;
    case 'Digit2':
    case 'Numpad2':
      shortBreakBtn.click();
      break;
    case 'Digit3':
    case 'Numpad3':
      longBreakBtn.click();
      break;
    case 'KeyS':
      settingsBtn.click();
      break;
    case 'KeyT':
      if (taskListBtn) taskListBtn.click();
      break;
    case 'Escape':
      settings.close();
      if (taskPanel) taskPanel.close();
      break;
  }
});

// Initialize: Select pomodoro mode by default on page load
resetRadialProgress();
setTimer(25, 0, pomodoroBtn);

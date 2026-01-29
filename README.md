# Pomodoro App

A clean, modern Pomodoro timer web application built with vanilla HTML, CSS, and JavaScript. Features a visually appealing circular progress indicator and audio feedback for an enhanced focus experience.

## Features

- **Three session types**: Pomodoro (25min), Short Break (5min), Long Break (15min)
- **Customizable durations**: Adjust session times via the settings modal
- **Visual progress**: Animated circular SVG progress indicator
- **Audio notifications**: Distinct sounds for start, pause, and completion
- **Responsive design**: Works on desktop and mobile devices

## Setup

No dependencies required. Open [`index.html`](index.html) directly in any modern web browser.

## Usage

1. Select a session type (pomodoro, short break, or long break)
2. Click the **START** button or tap the timer circle to begin
3. Use **PAUSE** to pause, **START** to resume
4. Click the gear icon to customize session durations
5. Timer completes automatically with audio notification

## Project Structure

```
pomodoro-app/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── sounds/
        ├── bell-candle.wav   (start sound)
        ├── bike-bell.wav     (pause sound)
        └── uprising.wav      (completion sound)
```

## Technologies

- HTML5 for structure
- CSS3 for styling (linear gradients, SVG animations, flexbox)
- ES6 JavaScript for functionality
- External libraries: Font Awesome (icons), Google Fonts (Mulish, Roboto)

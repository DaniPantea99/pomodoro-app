import {btnStartPause, allBtns} from './main.js'



function highlightActiveBtn(button) {
    allBtns.forEach((element) => {
        element.classList.remove('active');
    })
    button.classList.add('active');
}

function changeStartPauseBtnState() {
    if(btnStartPause.innerText === 'start'.toUpperCase()) {
        btnStartPause.innerText = 'pause'.toUpperCase();
    } else {
        btnStartPause.innerText = 'start'.toUpperCase();
    }
}

export {
    highlightActiveBtn,
    changeStartPauseBtnState 
} 
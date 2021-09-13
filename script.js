'use strict';

const $ = (selector) => document.querySelector(selector);

function App() {
  const input = { hour: 0, min: 0, sec: 0 };

  const timePreset = $('.preset-box');
  const inputForm = $('.input-form');
  const inputBtn = $('.input-btn');
  const resetBtn = $('.reset-btn');
  let disabled = false;

  let interval;
  let totalTime = 0;
  let leftTime = 0;

  inputForm.addEventListener('keyup', (e) => {
    const { name, value } = e.target;

    if (name === 'hour' && value > 23) {
      e.target.value = 23;
    }
    if (['min', 'sec'].includes(name) && value > 59) {
      e.target.value = 59;
    }
    if (e.target.value.length === 1) {
      e.target.value = String(value).padStart(2, 0);
    }
    if (e.target.value.length >= 2) {
      e.target.value = String(Number(e.target.value)).padStart(2, 0);
      const nextInput = e.target.nextElementSibling;
      if (nextInput) {
        e.target.nextElementSibling.focus();
      }
    }
    if (e.target.value === '00') {
      e.target.value = '';
    }
  });

  inputForm.addEventListener('change', (e) => {
    let { name, value } = e.target;
    if (value < 0) {
      alert('0 이상의 값을 입력해주세요.');
      e.target.value = '';
      e.target.focus();
    }
    input[name] = Number(value);
    totalTime = input.hour * 60 * 60 + input.min * 60 + input.sec;
    leftTime = totalTime;
  });

  function makeInterval(time) {
    if (!disabled) {
      toggleInput();
      disabled = true;
    }
    interval = setInterval(() => {
      if (time <= 0) {
        clearInterval(interval);
        toggleInput();
        disabled = false;
        inputBtn.innerText = 'start';
        return;
      }
      leftTime -= 1;
      time -= 1;
      setTimerText(time);
      setTimerBar(totalTime, time);
    }, 1000);
  }

  timePreset.addEventListener('click', (e) => {
    inputBtn.innerText = 'start';

    const time = e.target.innerText;
    totalTime = time * 60;
    leftTime = totalTime;

    clearInterval(interval);
    setTimerText(totalTime);
    makeInterval(totalTime);
    resetTimeBar();
    resetInput();
    toggleBtnText();
  });

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (totalTime === 0) return;

    clearInterval(interval);

    switch (inputBtn.innerText.toLowerCase()) {
      case 'start':
        setTimerText(totalTime);
        makeInterval(totalTime);
        resetTimeBar();
        break;
      case 'pause':
        clearInterval(interval);
        break;
      case 'resume':
        makeInterval(leftTime);
        break;
      default:
        break;
    }
    toggleBtnText();
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(interval);
    setTimerText(totalTime);

    if (disabled) {
      toggleInput();
      disabled = false;
    }
    inputBtn.innerText = 'start';
    leftTime = totalTime;
    resetTimeBar();
  });
}

function toggleInput() {
  const inputHour = $('.input-hour');
  const inputMin = $('.input-min');
  const inputSec = $('.input-sec');
  inputHour.disabled = !inputHour.disabled;
  inputMin.disabled = !inputMin.disabled;
  inputSec.disabled = !inputSec.disabled;
}

function toggleBtnText() {
  const inputBtn = $('.input-btn');
  switch (inputBtn.innerText.toLowerCase()) {
    case 'start':
      inputBtn.innerText = 'pause';
      break;
    case 'pause':
      inputBtn.innerText = 'resume';
      break;
    case 'resume':
      inputBtn.innerText = 'pause';
      break;
    default:
      break;
  }
}

function calculateTime(total) {
  const sec = total % 60;
  total = (total - sec) / 60;
  const min = total % 60;
  total -= min;
  const hour = total / 60;
  return { hour, min, sec };
}

function setTimerText(total) {
  const timer = calculateTime(total);

  const timerHour = $('.timer-hour');
  const timerMin = $('.timer-min');
  const timerSec = $('.timer-sec');

  timerHour.innerText = String(timer.hour).padStart(2, 0);
  timerMin.innerText = String(timer.min).padStart(2, 0);
  timerSec.innerText = String(timer.sec).padStart(2, 0);
}

function setTimerBar(total, left) {
  const timerBar = $('.timer-bar');
  const barHeight = (left / total) * 100;

  let transitionSec = total * (1 / 100);
  if (transitionSec < 0.1) {
    transitionSec = 0.1;
  }
  timerBar.style.transition = `height ${transitionSec}s linear`;
  timerBar.style.height = `${barHeight}%`;
}

function resetTimeBar() {
  const timerBar = $('.timer-bar');
  timerBar.style.transition = `height 0.3s linear`;
  timerBar.style.height = `100%`;
}

function resetInput() {
  $('.input-hour').value = '';
  $('.input-min').value = '';
  $('.input-sec').value = '';
}

document.addEventListener('DOMContentLoaded', function () {
  App();
});

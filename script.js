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

  // 인풋에 키보드 입력할 때 이벤트
  inputForm.addEventListener('keyup', (e) => {
    const { name, value } = e.target;

    // 최댓값 제한
    if (name === 'hour' && value > 23) {
      e.target.value = 23;
    }
    if (['min', 'sec'].includes(name) && value > 59) {
      e.target.value = 59;
    }
    // 1자리면 앞에 자동으로 0 붙이기
    if (e.target.value.length === 1) {
      e.target.value = String(value).padStart(2, 0);
    }
    // // 2자리 넘어가면 커서 이동
    // if (e.target.value.length >= 2) {
    //   e.target.value = String(Number(e.target.value)).padStart(2, 0);
    //   const nextInput = e.target.nextElementSibling;
    //   if (nextInput) {
    //     e.target.nextElementSibling.focus();
    //   }
    // }
    e.target.value = String(Number(e.target.value)).padStart(2, 0);

    if (e.target.value === '00') {
      e.target.value = '';
    }
  });

  // 인풋 값이 바뀔 때 이벤트
  inputForm.addEventListener('change', (e) => {
    let { name, value } = e.target;
    // 음수 예외처리
    if (value < 0) {
      alert('0 이상의 값을 입력해주세요.');
      e.target.value = '';
      e.target.focus();
    }
    // 변수에 값 세팅
    input[name] = Number(value);
    totalTime = input.hour * 60 * 60 + input.min * 60 + input.sec;
    leftTime = totalTime;
  });

  // interval 생성하는 함수 (start, resume)
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

  // 미리 설정한 프리셋 클릭 이벤트
  timePreset.addEventListener('click', (e) => {
    if (e.target.className !== 'preset') {
      return;
    }
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

  // 인풋 폼 제출 이벤트
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

  // reset 버튼 클릭 이벤트
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

// input disabled 속성 토글
function toggleInput() {
  const inputs = document.querySelectorAll('.input-box input');
  inputs.forEach((input) => {
    input.disabled = !input.disabled;
    input.classList.toggle('disabled');
  });
}

// 버튼 글자 토글 (start - pause - resume)
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

// 초를 받아서 시간, 분, 초 객체 리턴
function calculateTime(total) {
  const sec = total % 60;
  total = (total - sec) / 60;
  const min = total % 60;
  total -= min;
  const hour = total / 60;
  return { hour, min, sec };
}

// 아래 타이머 텍스트 세팅
function setTimerText(total) {
  const { hour, min, sec } = calculateTime(total);
  $('.timer-hour').innerText = String(hour).padStart(2, 0);
  $('.timer-min').innerText = String(min).padStart(2, 0);
  $('.timer-sec').innerText = String(sec).padStart(2, 0);
}

// 바탕색 줄어들게 하기
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

// 바탕색 리셋
function resetTimeBar() {
  const timerBar = $('.timer-bar');
  timerBar.style.transition = `height 0.3s linear`;
  timerBar.style.height = `100%`;
}

// input 리셋
function resetInput() {
  const inputs = document.querySelectorAll('.input-box input');
  inputs.forEach((input) => (input.value = ''));
}

document.addEventListener('DOMContentLoaded', function () {
  App();
});

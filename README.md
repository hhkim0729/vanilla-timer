# vanilla-timer

A fake time timer in Vanilla JS
[time timer](https://www.youtube.com/watch?v=5FwpJouNw7s)처럼 남은 시간이 시각적으로 표현되는 타이머 만들기

## [🔗 완성본](https://hhkim0729.github.io/vanilla-timer/)
<img src="https://user-images.githubusercontent.com/72433681/133257865-2d403c9f-edaa-4b46-8b9d-c5440d9cd61c.gif" height="500" />

## 주요 기능
- 시간이 줄어들수록 배경 색깔 영역도 줄어든다.
- 자주 쓰는 분 단위 프리셋 버튼을 클릭하면 바로 타이머를 실행할 수 있다.
- 최대 입력 가능한 시간은 `23:59:59`
  - 이상의 값이 입력되면 자동으로 최댓값으로 세팅

## 버튼
- **START** 버튼: `input`에 입력한 시간만큼 타이머 시작
- **PAUSE** 버튼: 현재 타이머 잠시 멈춤
- **RESUME** 버튼: 멈춘 타이머 다시 시작
- **RESET** 버튼: 타이머를 멈추고 이전에 설정했던 시간을 다시 세팅

## 다음 기회에...
- 재사용성을 위해 클래스로 구현하기
- 탭에 남은 시간 표시
- 남은 시간을 파이 그래프로 시각화하기

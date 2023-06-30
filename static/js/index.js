let attempts = 0;
let index = 0;

let timer;

function appStart() {
  // 다음 줄로 이동해 다음 시도
  const nextLine = () => {
    // 마지막 6번째 시도이면 게임 종료
    if (attempts === 6) return gameover();
    attempts++;
    index = 0;
  };

  // 게임종료 function
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었습니다!";
    div.style =
      "display: flex; justify-content: center; align-items: center; position: absolute; top: 50%; left: 50%; width: 200px; height: 100px; transform: translate(-50%, -50%); background-color: #fff";
    document.body.appendChild(div);
  };
  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  // handleEnterkey =========================================
  // Enter키 눌렀을 때, 정답확인
  const handleEnterKey = async () => {
    let correct = 0;

    // 서버에서 정답을 받아오는 코드
    // await: 서버에서 서버로 요청을 보낸 이후, 그에대한 응답이 올 때까지 기다리는 구문
    // json(javascript object notation): 자바스크립트에 맞는 포맷으로 바꿔주는 구문
    const response = await fetch("/answer");
    const answer = await response.json();

    // for문으로 index별 blockText와 answerText 구하고 비교
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index = '${attempts}${i}']`
      );
      const blockText = block.innerText;
      const answerText = answer[i];

      // 정답확인
      // 위치랑 문자가 같은지
      if (blockText === answerText) {
        // 둘다 만족 시 초록색으로 칸 색 변화
        correct++;
        block.style.background = "#6aaa64";
      } // 문자만 만족 시 노란색으로 칸 색 변화
      else if (answer.includes(blockText)) {
        block.style.background = "#c9b458";
      } // 그 외 둘 다 불만족시, 회색으로 칸 색 변화
      else block.style.background = "#787c7e";

      block.style.color = "#fff";
    }

    // 정답을 맞췄을 경우 게임 종료
    if (correct === 5) gameover();

    nextLine();
  };

  // handleBackspace =========================================
  // Backspace 눌렀을 때, 지우기
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index = '${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    // index가 0이 아닌 경우에만 지우기 가능
    if (index !== 0) index--;
  };

  // 키보드 입력시, board-block에 나타내기 ===============
  const handleKeydown = (e) => {
    const key = e.key.toUpperCase();
    const keyCode = e.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index = '${attempts}${index}']`
    );

    // Backspace면 handleBackspace실행하고 아니면 이어가기
    if (e.key === "Backspace") handleBackspace();
    // 5글자일 때
    else if (index === 5) {
      // enter면 handleEnterkey실행하고 enter아니면 끝
      if (e.key === "Enter") handleEnterKey();
      else return;
    } //5글자가 아닐 때 지정키면 블록에 나타내고 다음 칸
    else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index++;
    }
  };

  // 키보드 클릭시, board-block에 나타내기 ===============
  ///////////////////////////////////////////////////////

  const startTimer = () => {
    const startTime = new Date();

    function setTime() {
      const currentTime = new Date();
      const time = new Date(currentTime - startTime);
      const min = time.getMinutes().toString().padStart(2, "0");
      const sec = time.getSeconds().toString().padStart(2, "0");
      const showTime = document.querySelector("#time");
      showTime.innerText = `Time - ${min}:${sec}`;
      showTime.style.color = "red";
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart(); //호출

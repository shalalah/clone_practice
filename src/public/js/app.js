const socket = io();
// home.pug에서 #myFace를 찾기
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");
// 시작시 call 숨기기
call.hidden = true;

// user로부터 온 오디오와 비디오가 결합된 stream
let myStream;
let muted = false;
let cameraOff = false;
let roomName;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    // console.log(devices); // -> devices가 array로 출력됨
    // kind 가 videoinput인 것만 필요
    const cameras = devices.filter((device) => device.kind === "videoinput");
    // console.log(cameras);
    // 현재 선택된 카메라가 어떤 것인지 확인
    // console.log(myStream.getVideoTracks());
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}
// video를 다시 시작하게 하는 방법 -getMedia가 argument를 하나 받도록 할 수 있음
async function getMedia(deviceId) {
  // 초기 constraint
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    // 특정 카메라를 원할 경우 exact 사용 -> 요청한 카메라가 없으면 다른 카메라를 사용하는 것과 달리, 이 경우 이 카메라 하나만 사용
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

// 음소거 버튼 클릭시 발생
function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}
// 카메라 버튼 클릭시 발생
function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

async function handleCameraChange() {
  console.log(camerasSelect.value); // deviceId를 얻을 수 있음
  //   await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// welcome Form(join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

// 화면 room name에 적었던(input) 자료들을 서버로 보내주는 작업
function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  //   console.log(input.value); // 콘솔에 input 값이 나옴
  // BE에 이벤트를 submit
  socket.emit("join_room", input.value, startMedia);
  roomName = input.value;
  input.value = "";
}

function startMedia() {
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// socket Code

socket.on("welcome", () => {
  console.log("someone joined");
});

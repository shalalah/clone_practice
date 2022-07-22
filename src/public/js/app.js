const socket = io();
// home.pug에서 #myFace를 찾기
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
// user로부터 온 오디오와 비디오가 결합된 stream
let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // console.log(myStream);
    myFace.srcObject = myStream;
  } catch (error) {
    console.log(error);
  }
}
getMedia();
// 음소거 버튼 클릭시 발생
function handleMuteClick() {
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
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);

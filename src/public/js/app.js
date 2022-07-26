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
let myPeerConnection;
let myDataChannel;

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
  //   console.log(camerasSelect.value); // deviceId를 얻을 수 있음
  await getMedia(camerasSelect.value);
  if (myPeerConnection) {
    // video device의 새로운 id로 다시 또 다른 stream을 생성
    // -> video track 을 받으면 선택한 새 장치로 업데이트 된 video track을 받는 것임
    const videoTrack = myStream.getVideoTracks()[0];
    // track에 kind:"video"를 가진 sender를 찾고자 함
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    console.log(videoSender);
    // sender를 그 새로운 video track 으로 바꿈
    videoSender.replaceTrack(videoTrack);
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// welcome Form(join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

// 화면 room name에 적었던(input) 자료들을 서버로 보내주는 작업
async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// socket Code, 누군가 방에 들어올 때 알림

socket.on("welcome", async () => {
  // 무언가를 offer하는 Socket이 data channel을 생성하는 주체가 되어야 함 -> d.c 만들기
  myDataChannel = myPeerConnection.createDataChannel("chat");
  //  그 d.c에 event listener를 추가함
  myDataChannel.addEventListener("message", (event) => console.log(event.data));
  console.log("made data channel");

  const offer = await myPeerConnection.createOffer();
  //   console.log(offer); // offer 살펴보기
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  //   console.log(offer);
  //   d.c 만들 필요 없음 -> d.c 있을 때 event listener를 만들면 됨
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) =>
      console.log(event.data)
    );
  });

  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  //   console.log(answer);
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});
// ice event를 받기도 함
socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code
// makeConnection()함수는 track들을 개별적으로 추가해주는 함수
function makeConnection() {
  // peer-to-peer 연결 만듦
  myPeerConnection = new RTCPeerConnection({
    //   console.log(myStream.getTracks());
    //   양쪽 브라우저에서 카메라와 마이크의 데이터 stream을 받아서 연결 안에 집어 넣음
    //   구글이 제공하는 서버 사용 - 테스트용도
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  // 브라우저간에 candidate들을 서로 주고 받음
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}
// 이벤트 데이터를 보는 함수
function handleAddStream(data) {
  const peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.stream;
}

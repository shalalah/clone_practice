const socket = io();
// io fx은 알아서 socket.io를 실행하고 있는 서버를 찾을 것임
// welcome div에서 form을 가져오기
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
// room div 찾기
const room = document.getElementById("room");
// 숨기기
room.hidden = true;
// 방에 있는 사람들에게 누가 참가했는지 알려주기
let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  // new_message event를 보냄
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  //방에 입장하면 welcome이 숨겨지고 room으로 변함
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //방에 참가한 뒤 BE에서 showRoom fx을 실행시킴
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

// FE에서 event(BE의 welcome)에 반응하도록 만들어야 함
socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left ㅠㅠ`);
});
// message 받기
socket.on("new_message", addMessage);

// 새로운 방이 생기면, 다른 브라우저에 console이 찍힘
socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    // 각각의 room에 li element를 만들어줌
    const li = document.createElement("li");
    li.innerText = room;
    // 새로운 li를 roomList에 append해줌
    roomList.append(li);
  });
});

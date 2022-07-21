// server.js는 BE에서 구동될 것임

// express로 할 일은 views를 설정해주고 render해주는 것
import express from "express";
import http from "http";
import { parse } from "path";
import SocketIO from "socket.io";
// import WebSocket from "ws";

const app = express();

// pug 페이지들을 렌더하기 위해 pug 설정
// pug로 view engine을 설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// 해당 경로로 이동시 보여주게 될 폴더를 입력
// express에 template이 어디 있는지 지정해줌 -> public url을 생성하여 유저에게 파일을 공유해줌
app.use("/public", express.static(__dirname + "/public"));

// home을 렌더
app.get("/", (req, res) => res.render("home"));
// 어떤 url로 이동하던지 home으로 돌려보냄
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// socketIO
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
// BE 에서 connection 받을 준비
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    // FE의 function showRoom()을 실행시킴
    done();
    // "welcome" event를 roomName에 있는 모든 사람들에게 emit함
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    // array같은 set여서 반복 가능!
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  // BE에 hanlder를 만들기
  // nickname 이벤트 발생시 nickname을 socket에 더해준다
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// function onSocketClose() {
//   console.log("Disconnected from the Browser ❌");
// }
// // websocket
// const wss = new WebSocket.Server({ server });
// const sockets = [];
// // connection이 생겼을 때 socket으로 즉시 메세지를 보낸다!
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   // 닉네임이 익명인 경우를 대비
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser ✅");
//   socket.on("close", onSocketClose);
//   // msg(string)를 받고 string을 parse해서 message가 됨
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     // console.log(parsed, message.toString());
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//       case "nickname":
//         // message.payload -> 즉 nickname을 소켓에 넣어줌
//         socket["nickname"] = message.payload;
//     }
//   });
// });

httpServer.listen(3000, handleListen);

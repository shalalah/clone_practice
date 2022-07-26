// server.js는 BE에서 구동될 것임

// express로 할 일은 views를 설정해주고 render해주는 것
import express from "express";
import http from "http";
import SocketIO from "socket.io";

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

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

// 새로운 event "join_room"
wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    // 내가 방에 참가
    socket.join(roomName);
    // 다른 user 참가
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

httpServer.listen(3000, handleListen);

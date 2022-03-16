import http from "http";
//import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";
import SocketIO from "socket.io";

const app = express();

console.log("hello");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("listening on http:localhost:3001!");

//app.listen(3000, handleListen);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "anon";
  console.log(socket);
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });
  socket.on("enter_room", async (roomName, nickname, done) => {
    await socket.join(roomName);
    await done();
    await socket.to(roomName).emit("welcome", nickname);
    console.log(nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

/*
const sockets = [];

wss.on("connection", (bsocket) => {
  sockets.push(bsocket);
  bsocket["nickname"] = "Anon";
  console.log("Connected to Browser ");
  bsocket.on("close", () => {
    console.log("Disconnected from the Browser");
  });
  bsocket.on("message", (msg) => {
    const message = JSON.parse(msg);
    console.log(message);

    switch (message.type) {
      case "new_message": {
        sockets.forEach((aSocket) =>
          aSocket.send(`${bsocket.nickname}: ${message.payload}`)
        );
        break;
      }

      case "nickname": {
        console.log(message.type);
        console.log("nickname " + message.payload);
        bsocket["nickname"] = message.payload;
        break;
      }
    }
  });
});
*/
httpServer.listen(3001, handleListen);

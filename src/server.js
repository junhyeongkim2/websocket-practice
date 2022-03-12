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
  console.log(socket);
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

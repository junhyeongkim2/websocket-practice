import http from "http";
import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";

const app = express();

console.log("hello");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("listening on http:localhost:3001!");

//app.listen(3000, handleListen);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (bsocket) => {
  sockets.push(bsocket);
  console.log("Connected to Browser ");
  bsocket.on("close", () => {
    console.log("Disconnected from the Browser");
  });
  bsocket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString()));
    console.log(message.toString());
  });
});

server.listen(3001, handleListen);

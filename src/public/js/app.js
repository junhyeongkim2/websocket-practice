const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const h3 = room.querySelector("h3");

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

room.hidden = true;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");

  const intputvalue = input.value;

  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${intputvalue}`);
  });
  input.value = "";
}

function showRoom(msg) {
  welcome.hidden = true;
  room.hidden = false;
  console.log("entered room");
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
  h3.innerText = `Room ${roomName}`;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("someone joined!");
});

socket.on("bye", () => {
  addMessage("someone left!");
});

socket.on("new_message", addMessage);

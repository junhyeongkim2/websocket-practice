const fsocket = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

fsocket.addEventListener("open", () => {
  console.log("Connected to Browser 🔧");
});

fsocket.addEventListener("message", (message) => {
  console.log("New Message: ", message.data, " from the server");

  fsocket.addEventListener("close", () => {
    console.log("Disconnected from Server X");
  });
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  fsocket.send(input.value);
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);

import { appendNewMessages } from "./chat.js";
import { state, getToken } from "./state.js";

export function initSocket() {
  state.socket = io({
    auth: {
      token: getToken(),
    },
  });

  state.socket.on("connect", () => {
    console.log("Connected to server: ", state.socket.id);
  });

  state.socket.on("connect_error", (error) => {
    console.log("Socket connection error: ", error);
  });
}

export function listenToEvents() {
  if (!state.socket) {
    return;
  }

  state.socket.on("welcome_event", (data) => {
    console.log("Server says: ", data.message);
  });

  state.socket.on("liveChat", (message) => {
    appendNewMessages(message);
  });
}

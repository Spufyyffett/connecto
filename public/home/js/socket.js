import { appendNewMessages } from "./chat.js";
import { state, getToken } from "./state.js";
import { updateUserStatus } from "./users.js";

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

export let pendingUsers = [];
export function listenToEvents() {
  if (!state.socket) {
    return;
  }

  state.socket.on("liveChat", (data) => {
    console.log("new file arrived");
    appendNewMessages(data);
  });

  state.socket.on("initialOnlineList", (users) => {
    pendingUsers = users;

    users.forEach((user) => {
      updateUserStatus(user, "online");
    });
  });

  state.socket.on("userStatus", (data) => {
    updateUserStatus(data.username, data.status);
  });
}

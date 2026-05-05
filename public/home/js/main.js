import { isUserLogged } from "./auth.js";
import { displayUsers, initUserSearch } from "./users.js";
import { initChatEvents } from "./chat.js";
import { initSocket, listenToEvents } from "./socket.js";

async function init() {
  const loggedIn = await isUserLogged();
  if (!loggedIn) {
    window.location.href = "/auth";
  } else {
    displayUsers();
  }
}

//initialization
window.addEventListener("DOMContentLoaded", () => {
  init();
  initChatEvents();
  initUserSearch();
  initSocket();
  listenToEvents();
});

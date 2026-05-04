import { isUserLogged } from "./auth.js";
import { displayUsers, initUserSearch } from "./users.js";
import { initChatEvents } from "./chat.js";

async function init() {
  const loggedIn = await isUserLogged();

  if (!loggedIn) {
    window.location.href = "/auth";
  } else {
    displayUsers();
  }
}

//initialization
init();
initChatEvents();
initUserSearch();

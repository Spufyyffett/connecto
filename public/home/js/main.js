import { isUserLogged } from "./auth.js";
import { displayUsers } from "./users.js";
import { initialise } from "./eventListeners.js";

export async function verifyUser() {
  const loggedIn = await isUserLogged();
  if (!loggedIn) {
    window.location.href = "/auth";
  } else {
    displayUsers();
  }
}

//initialization
initialise();

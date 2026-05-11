//fucntion to verify user
import { state, getToken } from "./state.js";
import { verifyToken } from "./api.js";

export async function isUserLogged() {
  try {
    const token = getToken();
    if (!token) {
      console.trace("because...");
      console.log("No token found. Please re-login");
      return false;
    }

    const data = await verifyToken(token);
    state.currUser = data.user.sub;

    return true;
  } catch (error) {
    sessionStorage.removeItem("sessionToken");
    console.log(error);
    return false;
  }
}

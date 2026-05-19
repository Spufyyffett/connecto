import { initEventListeners } from "./eventListeners.js";
import { verifyToken } from "./api.js";

export const result = document.getElementById("result");

export async function verifyUser() {
  const isValidUser = await verifyToken();
  if (isValidUser) {
    window.location.href = "/home";
  }
}

initEventListeners();

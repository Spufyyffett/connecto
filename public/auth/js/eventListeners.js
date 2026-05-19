import { checkLogin, checkRegister, handleAuth } from "./handleAuth.js";
import { result, verifyUser } from "./main.js";

export async function initEventListeners() {
  window.addEventListener("DOMContentLoaded", verifyUser);

  document
    .getElementById("loginUsername")
    .addEventListener("input", checkLogin);
  document
    .getElementById("loginPassword")
    .addEventListener("input", checkLogin);

  document
    .getElementById("registerUsername")
    .addEventListener("input", checkRegister);
  document
    .getElementById("registerPassword")
    .addEventListener("input", checkRegister);

  document.getElementById("loginBtn").addEventListener("click", handleAuth);
  document.getElementById("registerBtn").addEventListener("click", handleAuth);

  document.getElementById("loginViewPassBox").addEventListener("click", () => {
    const loginPassField = document.getElementById("loginPassword");
    const loginViewPassField = document.getElementById("loginViewPass");
    const loginPassLabel = document.getElementById("loginPassLabel");
    if (loginViewPassField.checked) {
      loginPassField.type = "text";
      loginPassLabel.innerText = "Hide Password";
    } else {
      loginPassField.type = "password";
      loginPassLabel.innerText = "Show Password";
    }
  });

  document.getElementById("regViewPassBox").addEventListener("click", () => {
    const regPassField = document.getElementById("registerPassword");
    const regViewPassField = document.getElementById("regViewPass");
    const regPassLabel = document.getElementById("regPassLabel");
    if (regViewPassField.checked) {
      regPassField.type = "text";
      regPassLabel.innerText = "Hide Password";
    } else {
      regPassField.type = "password";
      regPassLabel.innerText = "Show Password";
    }
  });

  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  });
}

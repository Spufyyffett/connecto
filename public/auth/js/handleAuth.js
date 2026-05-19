import { setToken } from "./state.js";
import { result } from "./main.js";
import { loginReg } from "./api.js";

export function checkLogin() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  document.getElementById("loginBtn").disabled = !(username && password);
}

export function checkRegister() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  document.getElementById("registerBtn").disabled = !(username && password);
}

export async function handleAuth() {
  const isLogin = document.getElementById("loginTab").checked;

  let type = "register";
  if (isLogin) {
    type = "login";
  }

  const inputData = {
    username: "",
    password: "",
  };

  if (isLogin) {
    inputData.username = document.getElementById("loginUsername").value;
    inputData.password = document.getElementById("loginPassword").value;
  } else {
    inputData.username = document.getElementById("registerUsername").value;
    inputData.password = document.getElementById("registerPassword").value;
  }

  console.log(inputData.username, "and", inputData.password);

  if (!inputData.username || !inputData.password) {
    result.innerText = "Input Field cannot be empty";
    return;
  }

  const data = await loginReg(type, inputData);

  if (!data.success) {
    result.innerText = data.message;
    return;
  }

  if (data.success) {
    setToken(data.token);
    result.innerText = data.message;
    window.location.href = "/home";
  }
}

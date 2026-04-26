const result = document.getElementById("result");

window.addEventListener("load", isUserLogged);

async function isUserLogged() {
  const token = sessionStorage.getItem("sessionToken");

  if (!token) {
    return;
  }

  const data = await fetch("http://localhost:5500/auth/verify", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.ok) {
    console.log("User verification failed! Please relogin");
    sessionStorage.removeItem("sessionToken");
    return;
  }

  window.location.href = "/home";
}

function checkLogin() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  document.getElementById("loginBtn").disabled = !(username && password);
}

function checkRegister() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  document.getElementById("registerBtn").disabled = !(username && password);
}

async function handleAuth(e) {
  e.preventDefault();

  const isLogin = document.getElementById("loginTab").checked;

  let type = "register";
  if (isLogin) {
    type = "login";
  }
  console.log(type);

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

  const response = await fetch(`http://localhost:5500/auth/${type}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(inputData),
  });

  const data = await response.json();

  if (!response.ok) {
    result.innerText = data.message;
    return;
  }

  if (data.success) {
    sessionStorage.setItem("sessionToken", data.token);
    result.innerText = data.message;
    window.location.href = "/home";
  }
}

document.getElementById("loginUsername").addEventListener("input", checkLogin);
document.getElementById("loginPassword").addEventListener("input", checkLogin);

document
  .getElementById("registerUsername")
  .addEventListener("input", checkRegister);
document
  .getElementById("registerPassword")
  .addEventListener("input", checkRegister);

document.getElementById("loginBtn").addEventListener("click", handleAuth);
document.getElementById("registerBtn").addEventListener("click", handleAuth);

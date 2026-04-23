const result = document.getElementById("result");

async function handleAuth(e) {
  e.preventDefault();

  const inputData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  const isLogin = document.getElementById("loginRadio").checked;

  let type = "register";
  if (isLogin) {
    type = "login";
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

document.getElementById("myBtn").addEventListener("click", handleAuth);

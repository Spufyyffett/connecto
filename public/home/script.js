let currUser = "";
const token = sessionStorage.getItem("sessionToken");

window.addEventListener("load", isUserLogged);

async function isUserLogged() {
  try {
    if (!token) {
      console.log("No token found");
      window.location.href = "/auth";
      return;
    }

    const data = await fetch("http://localhost:5500/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data.ok) {
      console.log("Verification failed. Please re login");
      sessionStorage.removeItem("sessionToken");
      window.location.href = "/auth";
      return;
    }

    const response = await data.json();
    currUser = response.user.sub;
    document.getElementById("currUser").innerText =
      document.getElementById("currUser").textContent + " " + currUser;
    displayMessages();
  } catch (error) {
    console.log(error);
  }
}

async function displayMessages() {
  const data = await fetch("/messages", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function sendMessage() {
  const txtMessage = document.getElementById("ipMessage").value.trim();
  const receiver = document.getElementById("receiver").value.trim();
  const printRes = document.getElementById("result");

  const data = await fetch("/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sender: currUser,
      receiver: receiver,
      message: txtMessage,
    }),
  });

  const response = await data.json();

  printRes.innerText = response.note;
}

document.getElementById("myBtn").addEventListener("click", sendMessage);

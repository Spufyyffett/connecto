let currUser = "";
let selectedUser = "";
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

    document.getElementById("user-name").innerText =
      document.getElementById("user-name").textContent + "" + currUser;

    getUsersAndMessages();
  } catch (error) {
    console.log(error);
  }
}

async function getUsersAndMessages() {
  try {
    const response = await fetch("/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    displayUsers(data);
  } catch (error) {
    console.log(error);
  }
}

function displayUsers(data) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  if (!data || data.length === 0) return;

  let users = new Set();

  data.forEach((obj) => {
    const otherUser = obj.sender === currUser ? obj.receiver : obj.sender;

    users.add(otherUser);
  });

  users.forEach((val) => {
    const li = document.createElement("li");
    li.classList.add("user-item");

    li.innerHTML = `<div class="avatar">
                      <img src="img/userProfile.svg" alt="${val} avatar"/>
                    </div>
                    <div class="user-info">
                      <h4>${val}</h4>
                    </div>`;

    li.addEventListener("click", () => {
      document.querySelectorAll(".user-item").forEach((item) => {
        item.classList.remove("active");
      });

      li.classList.add("active");

      selectedUser = val;
      openChat(selectedUser);
    });

    userList.appendChild(li);
  });
}

async function openChat(selectedUser) {
  try {
    const response = await fetch("/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const chat = data.filter((msg) => {
      return (
        (msg.sender === currUser && msg.receiver === selectedUser) ||
        (msg.sender === selectedUser && msg.receiver === currUser)
      );
    });

    displayMsg(chat);
  } catch (error) {
    console.log(error);
  }
}

async function sendMessage() {
  try {
    const messageInput = document.getElementById("messageInput");

    const message = messageInput.value?.trim();

    if (!message || message.length === 0) {
      return;
    }

    const response = await fetch("/messages", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currUser, selectedUser, message }),
    });

    const data = await response.json();

    if (!data.success) {
      console.log("Error while sending message");
      return;
    }

    const div = document.createElement("div");
    const chatContainer = document.getElementById("chatMessages");

    div.classList.add("message", "sent");
    div.innerHTML = message;

    chatContainer.appendChild(div);

    messageInput.value = " ";
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  } else {
    return;
  }
});

function displayMsg(chat) {
  const chatContainer = document.getElementById("chatMessages");
  chatContainer.innerHTML = "";

  chat.forEach((msg) => {
    const div = document.createElement("div");
    div.classList.add("message");

    if (msg.sender === currUser) {
      div.classList.add("sent");
    } else {
      div.classList.add("received");
    }

    div.innerHTML = msg.messageContent;

    chatContainer.appendChild(div);
  });

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displaySearchedUsers(users) {
  const container = document.getElementById("user-list");

  const existing = new Set(
    [...container.querySelectorAll(".user-item h4")].map((el) =>
      el.innerText.toLowerCase(),
    ),
  );

  users.forEach((user) => {
    if (existing.has(user.username.toLowerCase())) return;

    const li = document.createElement("li");
    li.classList.add("user-item", "search-result");

    li.innerHTML = `
      <div class="avatar">
        <img src="img/userProfile.svg" alt="${user.username} avatar"/>
      </div>
      <div class="user-info">
        <h4>${user.username}</h4>
      </div>
    `;

    li.addEventListener("click", () => {
      document
        .querySelectorAll(".user-item")
        .forEach((item) => item.classList.remove("active"));

      li.classList.add("active");
      selectedUser = user.username;
      openChat(selectedUser);
    });

    container.prepend(li);
  });
}

const search = document.getElementById("findUsers");
let timeout;
search.addEventListener("input", (e) => {
  clearTimeout(timeout);

  const value = e.target.value;

  timeout = setTimeout(async () => {
    if (!value) {
      getUsersAndMessages();
      return;
    }

    const response = await fetch(`http://localhost:5500/search?q=${value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await response.json();

    displaySearchedUsers(users);
  }, 300);
});

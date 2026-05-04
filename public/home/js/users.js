//diplay users in the side bar
import { getMessages, getQueryUsers } from "./api.js";
import { state } from "./state.js";
import { displayChat } from "./chat.js";

export async function displayUsers() {
  const data = await getMessages();

  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  if (!data || data.length === 0) {
    console.log("No users found");
    return;
  }

  const users = new Set();

  data.forEach((obj) => {
    if (obj.sender !== state.currUser) {
      users.add(obj.sender);
    }

    if (obj.receiver !== state.currUser) {
      users.add(obj.receiver);
    }
  });

  // Render users
  users.forEach((user) => {
    const li = document.createElement("li");
    li.classList.add("user-item");

    li.innerHTML = `
      <div class="avatar">
        <img src="img/userProfile.svg" alt="${user} avatar"/>
      </div>
      <div class="user-info">
        <h4>${user}</h4>
      </div>
    `;

    li.addEventListener("click", () => {
      document.querySelectorAll(".user-item").forEach((item) => {
        item.classList.remove("active");
      });

      li.classList.add("active");

      state.selectedUser = user;

      displayChat();
    });

    userList.appendChild(li);
  });
}

//display searched users

export async function displaySearchedUsers(users) {
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
      state.selectedUser = user.username;
      openChat(state.selectedUser);
    });

    container.prepend(li);
  });
}

//find user functionality with 300ms debounce

export function initUserSearch() {
  const search = document.getElementById("findUsers");
  let timeout;

  search.addEventListener("input", (e) => {
    clearTimeout(timeout);

    const value = e.target.value;

    timeout = setTimeout(async () => {
      if (!value) {
        displayUsers();
        return;
      }

      const users = await getQueryUsers(value);
      displaySearchedUsers(users);
    }, 300);
  });
}

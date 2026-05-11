//diplay users in the side bar
import { getMessages, getQueryUsers } from "./api.js";
import { state } from "./state.js";
import { displayChat } from "./chat.js";
import {
  displayUsersOnBlur,
  openChatOnClick,
  removeChatAndTextarea,
  getInputToDisplaySearchedUsers,
  clearInputBtn,
  clearSearchInput,
} from "./eventListeners.js";
import { pendingUsers } from "./socket.js";

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
    li.setAttribute("data-username", user);
    li.innerHTML = `
      <div class="avatar">
        <img src="img/userProfile.svg" alt="${user} avatar"/>
        <span class="statusDot offline" title="Offline"></span>
      </div>
      <div class="user-info">
        <h4>${user}</h4>
      </div>
    `;
    li.title = `${user} is offline`;
    openChatOnClick(li, user);
    userList.appendChild(li);
  });

  pendingUsers.forEach((user) => updateUserStatus(user, "online"));
}

//display searched users
export async function displaySearchedUsers(users, value) {
  const container = document.getElementById("user-list");
  container.innerHTML = "";

  if (!users || users.length === 0) {
    container.innerHTML = `<p class="no-user">No users found with username "${value}"</p>`;
  }
  const existing = new Set(
    [...container.querySelectorAll(".user-item h4")].map((el) =>
      el.innerText.toLowerCase(),
    ),
  );

  users.forEach((user) => {
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

    openChatOnClick(li, user.username);
    container.appendChild(li);
    pendingUsers.forEach((user) => updateUserStatus(user, "online"));
  });
}

export function updateUserStatus(username, status) {
  if (!username || !status) {
    return;
  }
  const userRow = document.querySelector(`li[data-username=${username}]`);

  if (userRow) {
    const dot = userRow.querySelector(".statusDot");
    if (status === "online") {
      dot.classList.replace("offline", "online");
      dot.title = "online";
    } else {
      dot.classList.replace("online", "offline");
      dot.title = "offline";
    }
  }
}

//find user functionality with 300ms debounce
export function initUserSearch() {
  const search = document.getElementById("findUsers");
  const container = document.getElementById("user-list");
  let timeout;

  removeChatAndTextarea(search, container);

  getInputToDisplaySearchedUsers(search, timeout);

  displayUsersOnBlur(search);

  clearInputBtn(search);

  clearSearchInput(search);
}

import { state } from "./state.js";
import { getQueryUsers } from "./api.js";
import { verifyUser } from "./main.js";
import { sendMessageFromUser, displayChat, sendFileFromUser } from "./chat.js";
import {
  initUserSearch,
  updateUserStatus,
  displayUsers,
  displaySearchedUsers,
} from "./users.js";
import { initSocket, listenToEvents } from "./socket.js";

//initialise when DOM is loaded
export function initialise() {
  window.addEventListener("DOMContentLoaded", () => {
    verifyUser();
    initChatEvents();
    initUserSearch();
    initSocket();
    listenToEvents();
    initHandleFileClick();
    handleUploadBtnHideOrDisplay();
  });
}

//Event listener for upload file
//Display none when textarea.value > 0 otherwise display inline-block
export function handleUploadBtnHideOrDisplay(
  textareaId = "messageInput",
  iconId = "getFileIcon",
) {
  const textarea = document.getElementById(textareaId);
  const icon = document.getElementById(iconId);

  if (!textarea || !icon) return;

  const updateUI = () => {
    icon.classList.toggle("hidden", textarea.value.length > 0);

    textarea.style.height = "49px";
    const currentHeight = textarea.scrollHeight;

    if (currentHeight > 150) {
      textarea.style.height = "150px";
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = Math.max(currentHeight, 49) + "px";
      textarea.style.overflowY = "hidden";
    }
  };

  textarea.addEventListener("input", updateUI);
}

//Event listener to send message
export function initChatEvents() {
  document
    .getElementById("sendBtn")
    .addEventListener("click", sendMessageFromUser);
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessageFromUser();
    } else {
      return;
    }
  });
}

//Event listener to open chat when a user is selected from sidebar (for both
// displayUsers and displaySearchedUsers)
export function openChatOnClick(li, user) {
  li.addEventListener("click", () => {
    document.querySelectorAll(".user-item").forEach((item) => {
      item.classList.remove("active");
    });

    li.classList.add("active");
    state.selectedUser = user;

    updateUserStatus(state.selectedUser);
    displayChat();
  });
}

//Event Listeners for Search users functionality
//1.To remove chat and textarea for chat on input field focus
export function removeChatAndTextarea(search, container) {
  search.addEventListener("focus", () => {
    document.getElementById("chat-input-area").style.display = "none";
    document.getElementById("chatMessages").innerHTML = "";
    if (!search.value || search.value.trim().length === 0) {
      container.innerHTML = "";
    }
  });
}

//2. get input and display searched user with a debounce of 300ms
export function getInputToDisplaySearchedUsers(search, timeout) {
  search.addEventListener("input", (e) => {
    clearTimeout(timeout);
    const value = e.target.value;
    timeout = setTimeout(async () => {
      if (!value) {
        displayUsers();
        return;
      }

      const users = await getQueryUsers(value);
      displaySearchedUsers(users, value);
    }, 300);
  });
}

//3. when clicked away from search input display users
export function displayUsersOnBlur(search) {
  search.addEventListener("blur", () => {
    setTimeout(() => {
      if (!search.value.trim()) {
        displayUsers();
      }
    }, 200);
  });
}

//4. event listener to diplay or hide X button on search field
export function clearInputBtn(search) {
  search.addEventListener("input", () => {
    if (!search.value || search.value.length === 0) {
      document.getElementById("clearInput").classList.remove("visible");
    } else {
      document.getElementById("clearInput").classList.add("visible");
    }
  });
}

//5. empty search input field on X button click
export function clearSearchInput(search) {
  document.getElementById("clearInput").addEventListener("click", () => {
    search.value = "";
    document.getElementById("clearInput").classList.remove("visible");
    displayUsers();
  });
}

//Event listener to open file input when clicked attach file button
const getFileIcon = document.getElementById("getFileIcon");
const hiddenInput = document.getElementById("fileInput");
export function initHandleFileClick() {
  getFileIcon.addEventListener("click", () => {
    hiddenInput.click();
  });

  hiddenInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    sendFileFromUser(file);
    return;
  });
}

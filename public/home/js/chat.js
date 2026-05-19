//get chat between 2 users and display
import { state } from "./state.js";
import { getMessages, sendFile, sendMessage } from "./api.js";
import { handleUploadBtnHideOrDisplay } from "./eventListeners.js";

export async function displayChat() {
  try {
    document.getElementById("chat-input-area").style.display = "flex";
    const data = await getMessages();
    const chat = data.filter((msg) => {
      return (
        (msg.sender === state.currUser &&
          msg.receiver === state.selectedUser) ||
        (msg.receiver === state.currUser && msg.sender === state.selectedUser)
      );
    });

    const chatContainer = document.getElementById("chatMessages");
    chatContainer.innerHTML = "";
    chat.forEach(appendNewMessages);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// append message to DOM method
export function appendNewMessages(msg) {
  const chatContainer = document.getElementById("chatMessages");
  const isRelevantChat =
    (msg.sender === state.selectedUser && msg.receiver === state.currUser) ||
    (msg.sender === state.currUser && msg.receiver === state.selectedUser);

  if (!isRelevantChat) return;

  const wrapper = document.createElement("div");
  wrapper.classList.add(
    "message-wrapper",
    msg.sender === state.currUser ? "sent" : "received",
  );

  const div = document.createElement("div");
  div.classList.add("message");

  const timeStamp = document.createElement("span");
  timeStamp.classList.add("timeStamp");
  timeStamp.innerText = div.title = getTimeAndDate(msg.time);

  scrollToBottom(chatContainer);

  if (msg.isFile) {
    const isImage = msg.MIMEtype && msg.MIMEtype.startsWith("image/");
    const fileUrl = `http://localhost:5500${msg.fileURL}`;

    if (isImage) {
      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.target = "_blank";
      anchor.title = `Open ${msg.fileName} in a new tab`;

      const img = document.createElement("img");
      img.src = fileUrl;
      img.className = "chat-image";
      img.alt = msg.fileName;

      img.onload = () => scrollToBottom(chatContainer);

      anchor.appendChild(img);
      div.appendChild(anchor);
    } else {
      const iconName = getFileIconFn(msg.MIMEtype, msg.fileName);
      div.innerHTML = `
    <a href="${fileUrl}" target="_blank" class="file-link-wrapper">
        <div class="file-icon-part">
            <span class="material-symbols-outlined">${iconName}</span>
        </div>
        <div class="file-info-part">
            <span class="file-name-label">${msg.fileName || "Download File"}</span>
            <span class="file-sub-label">${msg.MIMEtype.split("/")[1] || "file"}</span>
        </div>
    </a>`;
    }
  } else {
    div.innerHTML = `<span>${msg.messageContent}</span>`;
  }

  chatContainer.appendChild(wrapper);
  wrapper.appendChild(div);
  wrapper.appendChild(timeStamp);
  scrollToBottom(chatContainer);
}

//Send message method
export async function sendMessageFromUser() {
  try {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value?.trim();

    if (!message || message.length === 0) return;

    const data = await sendMessage(message);

    if (!data.success) return;

    const chatContainer = document.getElementById("chatMessages");

    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "sent");

    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<span>${data.info.messageContent}</span>`;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("timeStamp");
    timeSpan.innerText = div.title = getTimeAndDate(Date.now());

    wrapper.appendChild(div);
    wrapper.appendChild(timeSpan);
    chatContainer.appendChild(wrapper);

    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.log(error);
  }
}

//send file method
export async function sendFileFromUser(file) {
  const hiddenInput = document.getElementById("fileInput");
  try {
    if (!file) {
      alert("File upload failed");
      hiddenInput.value = "";
      return;
    }

    const maxSize = 40 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File cannot be more than ${maxSize / (1024 * 1024)}Mb`);
      hiddenInput.value = "";
      return;
    }

    const data = await sendFile(file);
    if (!data.success) alert("Error " + data.note);

    const chatContainer = document.getElementById("chatMessages");

    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "sent");

    const div = document.createElement("div");
    div.classList.add("message");

    if (data.info.MIMEtype && data.info.MIMEtype.startsWith("image/")) {
      div.innerHTML = `<img src="http://localhost:5500${data.info.fileURL}" class="chat-image" alt="${data.info.fileName}" title="${data.info.fileName}" />`;
      const img = div.querySelector("img");
      img.onload = () => scrollToBottom(chatContainer);
    } else {
      const iconName = getFileIconFn(data.info.MIMEtype, data.info.fileName);
      const fileUrl = `http://localhost:5500${data.info.fileURL}`;
      const subLabel = data.info.MIMEtype
        ? data.info.MIMEtype.split("/")[1]
        : "file";

      div.innerHTML = `
        <a href="${fileUrl}" target="_blank" class="file-link-wrapper">
            <div class="file-icon-part">
                <span class="material-symbols-outlined">${iconName}</span>
            </div>
            <div class="file-info-part">
                <span class="file-name-label">${data.info.fileName || "Download File"}</span>
                <span class="file-sub-label">${subLabel}</span>
            </div>
        </a>`;
    }

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("timeStamp");
    timeSpan.innerText = div.title = getTimeAndDate(Date.now());

    wrapper.appendChild(div);
    wrapper.appendChild(timeSpan);
    chatContainer.appendChild(wrapper);

    chatContainer.scrollTop = chatContainer.scrollHeight;
    document.getElementById("messageInput").style.height = "auto";
  } catch (error) {
    console.log(error);
  }
}

//Helper Functions

//getFileIcon
function getFileIconFn(mime, fileName) {
  if (mime && mime.startsWith("video/")) return "movie";
  if (mime && mime.startsWith("audio/")) return "audiotrack";
  if (
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar") ||
    fileName.endsWith(".7z")
  )
    return "package_2";
  if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) return "docs";
  if (fileName.endsWith(".pdf")) return "picture_as_pdf";
  return "description";
}

//get time and Date

function getTimeAndDate(miliSec) {
  const date = new Date(miliSec);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const time = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}-${month}-${year}   ${time}`;
}

// scroll to bottom
function scrollToBottom(container) {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

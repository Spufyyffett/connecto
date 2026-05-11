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

  const div = document.createElement("div");
  div.classList.add(
    "message",
    msg.sender === state.currUser ? "sent" : "received",
  );

  // scroll to bottom
  const scrollToBottom = () => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

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

      img.onload = scrollToBottom;

      anchor.appendChild(img);
      div.appendChild(anchor);
    } else {
      div.innerHTML = `<a href="${fileUrl}" target="_blank" class="message" title="Open ${msg.fileName} in a new tab">📄 ${msg.fileName || "Download File"}</a>`;
    }
  } else {
    div.innerHTML = `<span>${msg.messageContent}</span>`;
  }

  chatContainer.appendChild(div);
  scrollToBottom();
}

//Send message method
export async function sendMessageFromUser() {
  try {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value?.trim();

    if (!message || message.length === 0) {
      return;
    }

    const data = await sendMessage(message);

    if (!data.success) {
      console.log("Error while sending message");
      return;
    }

    const chatContainer = document.getElementById("chatMessages");
    const div = document.createElement("div");

    div.classList.add("message", "sent");
    div.innerHTML = `<span>${data.info.messageContent}</span>`;
    chatContainer.appendChild(div);
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));

    chatContainer.scrollTop = chatContainer.scrollHeight;
    document.getElementById("messageInput").style.height = "auto";
  } catch (error) {
    console.log(error);
    return false;
  }
}

//send file method
const getFileIcon = document.getElementById("getFileIcon");
const hiddenInput = document.getElementById("fileInput");
export async function sendFileFromUser(file) {
  try {
    if (!file) {
      alert("File upload failed, invalid file or file not found");
      hiddenInput.value = "";
      return;
    }

    const maxSize = 40 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(`File cannot be more than ${maxSize / (1024 * 1024)}`);
      hiddenInput.value = "";
      return;
    }

    const data = await sendFile(file);
    console.log(data);

    if (!data.success) {
      alert("Error ", data.note);
    }

    console.log(
      `Selected file ${file.name} as ${file.type} and size is ${(file.size / (1024 * 1024)).toFixed(2)}Mb`,
    );

    const chatContainer = document.getElementById("chatMessages");
    const div = document.createElement("div");

    if (data.info.MIMEtype && data.info.MIMEtype.startsWith("image/")) {
      div.innerHTML = `<img src="http://localhost:5500${data.info.fileURL}" class="chat-image" alt="${data.info.fileName}" title="${data.info.fileName}" />`;
    } else {
      div.innerHTML = `<a href="http://localhost:5500${data.info.fileURL}" target="_blank" class="file-link">📄 ${data.info.fileName || "Download File"}</a>`;
    }
    div.classList.add("message", "sent");
    chatContainer.appendChild(div);

    chatContainer.scrollTop = chatContainer.scrollHeight;
    document.getElementById("messageInput").style.height = "auto";
  } catch (error) {
    console.log(error);
  }
}

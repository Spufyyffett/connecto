//get chat between 2 users and display
import { state } from "./state.js";
import { getMessages, sendMessage } from "./api.js";

export async function displayChat() {
  try {
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
  div.classList.add("message");
  div.classList.add(msg.sender === state.currUser ? "sent" : "received");
  div.innerHTML = `<span>${msg.messageContent}</span>`;

  chatContainer.appendChild(div);

  chatContainer.scrollTop = chatContainer.scrollHeight;
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
    div.innerHTML = `<span>${message}</span>`;
    chatContainer.appendChild(div);
    messageInput.value = "";

    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//Event listener for send message
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

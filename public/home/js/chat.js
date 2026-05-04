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

    // display messages in chat
    const chatContainer = document.getElementById("chatMessages");
    chatContainer.innerHTML = "";

    chat.forEach((msg) => {
      const div = document.createElement("div");
      div.classList.add("message");

      if (msg.sender === state.currUser) {
        div.classList.add("sent");
      } else {
        div.classList.add("received");
      }

      div.innerHTML = `<span>${msg.messageContent}</span>`;

      chatContainer.appendChild(div);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
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

    chatContainer.scrollTop = chatContainer.scrollHeight;

    messageInput.value = "";
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

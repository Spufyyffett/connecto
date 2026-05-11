import { state, getToken } from "./state.js";

//verifyToken method
export async function verifyToken(token) {
  try {
    const token = getToken();
    const response = await fetch("http://localhost:5500/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

//get messages
export async function getMessages() {
  try {
    const token = getToken();
    const response = await fetch("/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

//send message
export async function sendMessage(message) {
  try {
    const token = getToken();
    const response = await fetch("/messages", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currUser: state.currUser,
        selectedUser: state.selectedUser,
        message,
      }),
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

//send file to server
export async function sendFile(uploadedFile) {
  try {
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("currUser", state.currUser);
    formData.append("selectedUser", state.selectedUser);

    const token = getToken();
    const response = await fetch("/messages/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

//search query for users
export async function getQueryUsers(value) {
  try {
    const token = getToken();
    const response = await fetch(`http://localhost:5500/search?q=${value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

import { getToken } from "./state.js";

export async function verifyToken() {
  try {
    const token = getToken();
    if (!token) {
      return;
    }
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

export async function loginReg(type, inputData) {
  try {
    const response = await fetch(`http://localhost:5500/auth/${type}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(inputData),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

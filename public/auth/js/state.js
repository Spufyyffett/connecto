export function getToken() {
  return sessionStorage.getItem("sessionToken");
}

export function setToken(token) {
  try {
    sessionStorage.setItem("sessionToken", token);
    return true;
  } catch (error) {
    console.log(error);
  }
}

export const state = {
  currUser: null,
  selectedUser: null,
  socket: null,
};

export function getToken() {
  return sessionStorage.getItem("sessionToken");
}

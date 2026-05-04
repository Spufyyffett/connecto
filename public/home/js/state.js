export const state = {
  currUser: null,
  selectedUser: null,
};

export function getToken() {
  return sessionStorage.getItem("sessionToken");
}

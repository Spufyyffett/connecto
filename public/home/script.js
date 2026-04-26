let currUser = "";
const token = sessionStorage.getItem("sessionToken");

window.addEventListener("load", isUserLogged);

async function isUserLogged() {
  try {
    if (!token) {
      console.log("No token found");
      window.location.href = "/auth";
      return;
    }

    const data = await fetch("http://localhost:5500/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data.ok) {
      console.log("Verification failed. Please re login");
      sessionStorage.removeItem("sessionToken");
      window.location.href = "/auth";
      return;
    }

    const response = await data.json();
    currUser = response.user.sub;
    document.getElementById("currUser").innerText =
      document.getElementById("currUser").textContent + " " + currUser;
    getUsersAndMessages();
  } catch (error) {
    console.log(error);
  }
}

async function getUsersAndMessages() {
  try {
    const response = await fetch("/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    displayMessages(data);
  } catch (error) {
    console.log(error);
  }
}

function displayMessages(data) {
  let profileContainer = document.getElementById("users");
  profileContainer.innerHTML = "";

  if (Object.keys(data).length === 0) {
    return;
  }

  let recipients = [];
  Object.values(data).forEach((obj) => {
    if (!recipients.includes(obj.receiver)) {
      recipients.push(obj.receiver);
    }
  });

  for (const val of recipients) {
    profileContainer.innerHTML += `<div class="profile">
          <div class="profileImg">
            <img src="img/userProfile.svg" alt="profile" />
          </div>
          <div class="name">
            <span class="receiverName">${val}</span>
          </div>
        </div>`;
  }
}

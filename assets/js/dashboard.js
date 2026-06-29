const userName = document.querySelector("#userName");
const logoutButton = document.querySelector("#logoutButton");

async function loadSession() {
  try {
    const response = await fetch("api/session.php");

    if (!response.ok) {
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();
    userName.textContent = data.user.name || data.user.username;
  } catch (error) {
    window.location.href = "login.html";
  }
}

logoutButton.addEventListener("click", async () => {
  try {
    await fetch("api/logout.php", {
      method: "POST"
    });
  } finally {
    window.location.href = "login.html";
  }
});

loadSession();

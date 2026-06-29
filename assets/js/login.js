const form = document.querySelector("#loginForm");
const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const togglePasswordButton = document.querySelector("#togglePassword");
const toast = document.querySelector("#toast");

let toastTimer = null;

function showToast(message, type) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast is-active is-${type}`;

  toastTimer = window.setTimeout(() => {
    toast.className = "toast";
  }, 3200);
}

function setInvalidState(isInvalid) {
  loginInput.classList.toggle("is-invalid", isInvalid);
  passwordInput.classList.toggle("is-invalid", isInvalid);
}

togglePasswordButton.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";
  togglePasswordButton.classList.toggle("is-visible", !isPasswordVisible);
  togglePasswordButton.setAttribute(
    "aria-label",
    isPasswordVisible ? "Mostrar contrasena" : "Ocultar contrasena"
  );
  togglePasswordButton.setAttribute(
    "title",
    isPasswordVisible ? "Mostrar contrasena" : "Ocultar contrasena"
  );
});

[loginInput, passwordInput].forEach((input) => {
  input.addEventListener("input", () => setInvalidState(false));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const login = loginInput.value.trim();
  const password = passwordInput.value;

  if (!login || !password) {
    setInvalidState(true);
    showToast("Completa usuario/correo y contrasena.", "error");
    return;
  }

  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ login, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setInvalidState(true);
      showToast(data.message || "Usuario o contrasena incorrectos.", "error");
      return;
    }

    showToast("Inicio de sesion correcto.", "success");
    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 600);
  } catch (error) {
    showToast("Abre la pagina desde WAMP/PHP para usar la base de datos.", "error");
  }
});

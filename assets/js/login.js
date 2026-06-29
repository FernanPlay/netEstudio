const credentials = {
  username: "admin",
  password: "123456"
};

const form = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#username");
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

passwordInput.addEventListener("input", () => {
  setInvalidState(false);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const isValid = username === credentials.username && password === credentials.password;

  if (!isValid) {
    setInvalidState(true);
    showToast("Usuario o contrasena incorrectos.", "error");
    passwordInput.focus();
    return;
  }

  setInvalidState(false);
  showToast("Inicio de sesion correcto.", "success");
  form.reset();
  passwordInput.type = "password";
  togglePasswordButton.classList.remove("is-visible");
  togglePasswordButton.setAttribute("aria-label", "Mostrar contrasena");
  togglePasswordButton.setAttribute("title", "Mostrar contrasena");
});

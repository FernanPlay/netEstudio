const form = document.querySelector("#registerForm");
const nameInput = document.querySelector("#name");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
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

function markFields(isInvalid) {
  [nameInput, usernameInput, emailInput, passwordInput].forEach((input) => {
    input.classList.toggle("is-invalid", isInvalid);
  });
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

[nameInput, usernameInput, emailInput, passwordInput].forEach((input) => {
  input.addEventListener("input", () => input.classList.remove("is-invalid"));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value
  };

  if (!payload.name || !payload.username || !payload.email || !payload.password) {
    markFields(true);
    showToast("Completa todos los campos.", "error");
    return;
  }

  if (payload.password.length < 6) {
    passwordInput.classList.add("is-invalid");
    showToast("La contrasena debe tener minimo 6 caracteres.", "error");
    return;
  }

  try {
    const response = await fetch("api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "No se pudo registrar la cuenta.", "error");
      return;
    }

    showToast("Cuenta creada correctamente.", "success");
    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  } catch (error) {
    showToast("Abre la pagina desde WAMP/PHP para guardar en datos.db.", "error");
  }
});

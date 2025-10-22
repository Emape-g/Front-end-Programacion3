document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form") as HTMLFormElement | null;
  const registerForm = document.getElementById("register-form") as HTMLFormElement | null;
  const formTitle = document.getElementById("form-title") as HTMLElement | null;
  const toggleText = document.getElementById("toggle-text") as HTMLElement | null;
  const toggleBtn = document.getElementById("toggle-btn") as HTMLButtonElement | null;

  // Alternar entre Login y Registro
  toggleBtn?.addEventListener("click", () => {
    if (!loginForm || !registerForm || !formTitle || !toggleText) return;

    const mostrandoLogin = !loginForm.classList.contains("hidden");

    loginForm.classList.toggle("hidden");
    registerForm.classList.toggle("hidden");

    if (mostrandoLogin) {
      formTitle.textContent = "Crear cuenta";
      toggleText.textContent = "¿Ya tenés cuenta?";
      toggleBtn.textContent = "Iniciá sesión aquí";
    } else {
      formTitle.textContent = "Iniciar sesión";
      toggleText.textContent = "¿No tenés cuenta?";
      toggleBtn.textContent = "Registrate aquí";
    }
  });
});

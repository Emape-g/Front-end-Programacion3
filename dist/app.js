"use strict";
document.addEventListener("DOMContentLoaded", () => {
    // --- Login / Registro ---
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const formTitle = document.getElementById("form-title");
    const toggleText = document.getElementById("toggle-text");
    const toggleBtn = document.getElementById("toggle-btn");
    toggleBtn === null || toggleBtn === void 0 ? void 0 : toggleBtn.addEventListener("click", () => {
        if (!loginForm || !registerForm || !formTitle || !toggleText)
            return;
        const showingLogin = !loginForm.classList.contains("hidden");
        loginForm.classList.toggle("hidden");
        registerForm.classList.toggle("hidden");
        if (showingLogin) {
            formTitle.textContent = "Crear cuenta";
            toggleText.textContent = "¿Ya tenés cuenta?";
            toggleBtn.textContent = "Iniciá sesión aquí";
        }
        else {
            formTitle.textContent = "Iniciar sesión";
            toggleText.textContent = "¿No tenés cuenta?";
            toggleBtn.textContent = "Registrate aquí";
        }
    });
    // --- Envíos de formularios ---
    loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        console.log("Iniciando sesión con:", email, password);
    });
    registerForm === null || registerForm === void 0 ? void 0 : registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        console.log("Registrando usuario:", name, email, password);
    });
});

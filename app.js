document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("login-form");
    var registerForm = document.getElementById("register-form");
    var formTitle = document.getElementById("form-title");
    var toggleText = document.getElementById("toggle-text");
    var toggleBtn = document.getElementById("toggle-btn");
    // Alternar entre Login y Registro
    toggleBtn === null || toggleBtn === void 0 ? void 0 : toggleBtn.addEventListener("click", function () {
        if (!loginForm || !registerForm || !formTitle || !toggleText)
            return;
        var mostrandoLogin = !loginForm.classList.contains("hidden");
        loginForm.classList.toggle("hidden");
        registerForm.classList.toggle("hidden");
        if (mostrandoLogin) {
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
});

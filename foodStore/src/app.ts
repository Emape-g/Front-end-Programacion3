console.log("✅ APP CARGADA");

// ============================
// CONFIGURACIONES GLOBALES
// ============================
export const API = "http://localhost:8080/api";

// ============================
//  REFERENCIAS DEL DOM
// ============================
export const loginLink = document.getElementById("login-link") as HTMLAnchorElement;
export const userBox = document.getElementById("user-box") as HTMLDivElement;
export const userNameEl = document.getElementById("user-name") as HTMLSpanElement;
export const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
export const cartCount = document.getElementById("cart-count") as HTMLSpanElement;
export const userLink = document.getElementById("user-link") as HTMLAnchorElement;
export const adminLink = document.getElementById("admin-link") as HTMLAnchorElement;

// ============================
// INICIALIZAR HEADER
// ============================
initHeader();

function initHeader() {
  const userData = localStorage.getItem("user");

  if (userData) {
    let userName = "";

    try {
      const parsed = JSON.parse(userData);
      userName = typeof parsed === "string" ? parsed : (parsed.nombre || "Usuario");
    } catch {
      userName = userData;
    }

    // Mostrar nombre del usuario
    userNameEl.textContent = userName;
    userNameEl.classList.remove("hidden");

    // Ocultar ícono de login
    const icon = userLink.querySelector("i");
    if (icon) icon.classList.add("hidden");

    // Quitar href (para no volver al login)
    userLink.removeAttribute("href");

    // Mostrar botón de cerrar sesión
    logoutBtn.classList.remove("hidden");

    // Mantener “Administración” oculto (tu login actual no envía rol)
    adminLink?.classList.add("hidden");
  } else {
    // Usuario no logueado
    userNameEl.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    const icon = userLink.querySelector("i");
    if (icon) icon.classList.remove("hidden");
    adminLink?.classList.add("hidden");
  }
}

// ============================
//  CERRAR SESIÓN
// ============================
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  window.location.href = "/index.html";
});




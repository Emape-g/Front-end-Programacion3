console.log("COMMIT")

export const API = "http://localhost:8080/api";


export const loginLink = document.getElementById("login-link") as HTMLAnchorElement;
export const userBox = document.getElementById("user-box") as HTMLDivElement;
export const userNameEl = document.getElementById("user-name") as HTMLSpanElement;
export const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
export const cartCount = document.getElementById("cart-count") as HTMLSpanElement;

export const userLink = document.getElementById("user-link") as HTMLAnchorElement;
const userNameSpan = document.getElementById("user-name") as HTMLElement;


// Cargar usuario del Local Storage
const userData = localStorage.getItem("user");

if (userData) {
  let userName = "";

  try {
    const parsed = JSON.parse(userData);
    // Si es un objeto con propiedad .name → usarla
    if (parsed && typeof parsed === "object" && parsed.name) {
      userName = parsed.name;
    }
    // Si es un string simple (como "Juan Pérez") → usarlo directamente
    else if (typeof parsed === "string") {
      userName = parsed;
    }
  } catch {
    // Si no se puede parsear, usarlo como texto plano
    userName = userData;
  }

  // Mostrar el nombre
  userNameSpan.textContent = userName;
  userNameSpan.classList.remove("hidden");

  // Ocultar el ícono
  const icon = userLink.querySelector("i");
  if (icon) icon.classList.add("hidden");

  // Quitar link al login
  userLink.removeAttribute("href");

  // Mostrar botón de cerrar sesión
  logoutBtn.classList.remove("hidden");
}

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("id");
  window.location.href = "../index.html";
});




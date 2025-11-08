console.log("🛒 cart.ts");
import { API } from "@/app.js";
import { cartCount, userNameEl, logoutBtn } from "@/app.js";

//  DOM Elements
const modal = document.getElementById("modalConfirm") as HTMLDivElement;
const btnAbrir = document.getElementById("btnConfirmarPedido") as HTMLButtonElement;
const btnCancelar = document.getElementById("btnCancelar") as HTMLButtonElement;
const btnCerrarModal = document.getElementById("btnCerrarModal") as HTMLButtonElement;
const btnVaciar = document.getElementById("btnVaciar") as HTMLButtonElement;
const formPedido = document.getElementById("formPedido") as HTMLFormElement;
const totalPagar = document.getElementById("totalPagar") as HTMLSpanElement;

const contenedor = document.getElementById("cart-items") as HTMLDivElement;
const subtotalEl = document.getElementById("subtotal") as HTMLParagraphElement;
const envioEl = document.getElementById("envio") as HTMLParagraphElement;
const totalEl = document.getElementById("total") as HTMLParagraphElement;

//  Inicialización
bootHeader();
render();

// -------------------- HEADER --------------------
function bootHeader() {
  const storedUser = localStorage.getItem("user");
  const userLink = document.getElementById("user-link") as HTMLAnchorElement | null;

  if (storedUser) {
    let name = "";
    try {
      const parsed = JSON.parse(storedUser);
      name = typeof parsed === "object" && parsed.name ? parsed.name : parsed;
    } catch {
      name = storedUser;
    }
    if (userNameEl) {
      userNameEl.textContent = name || "Usuario";
      userNameEl.classList.remove("hidden");
    }
    if (userLink) {
      const icon = userLink.querySelector("i");
      if (icon) icon.classList.add("hidden");
    }
    if (logoutBtn) logoutBtn.classList.remove("hidden");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/src/pages/auth/login/login.html";
    });
  }

  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  const total = carrito.reduce((acc: number, it: any) => acc + (it.cantidad || 1), 0);
  if (cartCount) cartCount.textContent = String(total);
}

// -------------------- FUNCIONES AUXILIARES --------------------
function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito") || "[]");
}

function saveCarrito(carrito: any[]) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  const total = carrito.reduce((acc: number, it: any) => acc + (it.cantidad || 1), 0);
  if (cartCount) cartCount.textContent = String(total);
}

// -------------------- RENDER --------------------
function render() {
  let carrito = getCarrito();

  if (!carrito.length) {
    contenedor.innerHTML = `
      <div class="text-center py-6">
        <p class="text-gray-500 mb-4">Tu carrito está vacío 🛒</p>
        <a href="/src/pages/store/home/home.html" class="text-green-600 font-medium hover:underline">
          Ir a la tienda
        </a>
      </div>`;
    subtotalEl.textContent = "";
    envioEl.textContent = "";
    totalEl.textContent = "";
    return;
  }

  contenedor.innerHTML = carrito
    .map(
      (p: any, i: number) => `
      <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img src="${p.url_imagen || "/img/placeholder.png"}" class="w-20 h-20 object-cover rounded">
          <div>
            <h3 class="font-semibold text-gray-800">${p.nombre}</h3>
            <p class="text-green-600 font-medium">Unitario: $${p.precio}</p>
            <p class="text-sm text-gray-500">Total: $${p.precio * p.cantidad}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button data-i="${i}" class="dec bg-gray-200 px-2 rounded">-</button>
          <span>${p.cantidad}</span>
          <button data-i="${i}" class="inc bg-gray-200 px-2 rounded">+</button>
          <button data-i="${i}" class="del text-red-600 font-bold ml-3">✕</button>
        </div>
      </div>`
    )
    .join("");

  calcTotals();

  // Eventos dinámicos
  document.querySelectorAll(".inc").forEach((b) =>
    b.addEventListener("click", (e) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.i);
      carrito = getCarrito();
      carrito[i].cantidad++;
      saveCarrito(carrito);
      render();
    })
  );

  document.querySelectorAll(".dec").forEach((b) =>
    b.addEventListener("click", (e) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.i);
      carrito = getCarrito();
      carrito[i].cantidad--;
      if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
      saveCarrito(carrito);
      render();
    })
  );

  document.querySelectorAll(".del").forEach((b) =>
    b.addEventListener("click", (e) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.i);
      carrito = getCarrito();
      carrito.splice(i, 1);
      saveCarrito(carrito);
      render();
    })
  );
}

// -------------------- TOTALES --------------------
function calcTotals() {
  const carrito = getCarrito();
  const subtotal = carrito.reduce((acc: number, p: any) => acc + p.precio * p.cantidad, 0);
  const envio = carrito.length ? 500 : 0;
  const total = subtotal + envio;

  subtotalEl.textContent = `Subtotal: $${subtotal}`;
  envioEl.textContent = `Envío: $${envio}`;
  totalEl.textContent = `Total: $${total}`;
}

// -------------------- BOTÓN VACIAR --------------------
btnVaciar.addEventListener("click", () => {
  if (confirm("¿Seguro que querés vaciar el carrito?")) {
    localStorage.removeItem("carrito");
    render();
  }
});

// -------------------- MODAL --------------------
btnAbrir.addEventListener("click", () => {
  const carrito = getCarrito();
  if (!carrito.length) return alert("Tu carrito está vacío");
  const subtotal = carrito.reduce((acc: number, p: any) => acc + p.precio * p.cantidad, 0);
  const envio = carrito.length ? 500 : 0;
  totalPagar.textContent = `$${subtotal + envio}`;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

btnCancelar.addEventListener("click", cerrarModal);
btnCerrarModal.addEventListener("click", cerrarModal);

function cerrarModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// -------------------- CONFIRMAR PEDIDO --------------------
formPedido.addEventListener("submit", async (e) => {
  e.preventDefault();

  const telefono = (document.getElementById("telefono") as HTMLInputElement).value.trim();
  const direccion = (document.getElementById("direccion") as HTMLInputElement).value.trim();
  const metodoPago = (document.getElementById("metodoPago") as HTMLSelectElement).value;
  const notas = (document.getElementById("notas") as HTMLTextAreaElement).value.trim();
  const carrito = getCarrito();

  if (!telefono || !direccion || !metodoPago)
    return alert("Por favor, completá todos los campos requeridos.");

  const pedido = {
    telefono,
    direccion,
    metodoPago,
    notas,
    productos: carrito.map((p: any) => ({ idProducto: p.id, cantidad: p.cantidad })),
  };

  try {
    // await fetch(`${API}/pedidos`, {...})
    alert(" Pedido confirmado correctamente");
    localStorage.removeItem("carrito");
    render();
    cerrarModal();
    setTimeout(() => {
      window.location.href = "/src/pages/client/orders/orders.html";
    }, 500);
  } catch (error) {
    console.error(error);
    alert(" Error al confirmar el pedido.");
  }
});






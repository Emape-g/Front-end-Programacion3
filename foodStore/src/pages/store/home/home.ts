console.log("🏠 Home.ts");

// API base
import { API } from "@/app.js";

import {  cartCount, loginLink, userLink, userBox, userNameEl, logoutBtn } from "@/app";

// DOM
const productList = document.getElementById("product-list") as HTMLDivElement;
const categoryList = document.getElementById("category-list") as HTMLUListElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const orderSelect = document.getElementById("orderSelect") as HTMLSelectElement;
const availabilitySelect = document.getElementById("availabilitySelect") as HTMLSelectElement;

// Header elements (login/user/cart)
//const loginLink = document.getElementById("login-link") as HTMLAnchorElement;
//const userBox = document.getElementById("user-box") as HTMLDivElement;
//const userNameEl = document.getElementById("user-name") as HTMLSpanElement;
//const logoutBtnsss = document.getElementById("logout-btn") as HTMLButtonElement;
//const cartCount = document.getElementById("cart-count") as HTMLSpanElement;

// State
let productos: any[] = [];
let categorias: any[] = [];
let categoriaSeleccionada = 0;

// -------- Header (usuario + carrito) ----------
function bootHeader() {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const name = JSON.parse(storedUser);
      userNameEl.textContent = name || "Usuario";
      userBox.classList.remove("hidden");
    } catch {
      userNameEl.textContent = "Usuario";
      userBox.classList.remove("hidden");
    }
  } else {
    loginLink.classList.remove("hidden");
  }

  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  const totalItems = carrito.reduce((acc: number, it: any) => acc + (it.cantidad || 1), 0);
  cartCount.textContent = String(totalItems);

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/src/pages/auth/login/login.html";
  });
}

// -------- Categorías ----------
async function cargarCategorias() {
  try {
    const res = await fetch(`${API}/categorias/`);
    if (!res.ok) throw new Error();
    categorias = await res.json();
    const items = categorias
      .map(
        (c: any) => `
        <li>
          <a href="#" data-id="${c.id}" class="categoria-link flex items-center text-gray-800 hover:text-green-600 font-medium">
            <i class="bi bi-tag mr-2"></i>${c.nombre}
          </a>
        </li>`
      )
      .join("");
    categoryList.insertAdjacentHTML("beforeend", items);

    document.querySelectorAll(".categoria-link").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id || "0");
        categoriaSeleccionada = id;
        renderProductos();
      })
    );
  } catch {
    categoryList.insertAdjacentHTML("beforeend", `<li class="text-red-500">No se pudieron cargar categorías</li>`);
  }
}

// -------- Productos ----------
async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos/`);
    if (!res.ok) throw new Error();
    productos = await res.json();
    renderProductos()
  } catch {
    productList.innerHTML = `<p class="text-red-500 p-4">No se pudieron cargar productos</p>`;
  }
}

function renderProductos() {
  let list = [...productos];

  // categoría
  if (categoriaSeleccionada) list = list.filter((p) => p.categoria?.id === categoriaSeleccionada);

  // búsqueda
  const q = searchInput.value.toLowerCase();
  if (q) list = list.filter((p) => p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q));

  // disponibilidad
  const disp = availabilitySelect.value;
  if (disp === "disponible") list = list.filter((p) => (p.stock ?? 0) > 0);
  if (disp === "agotado") list = list.filter((p) => (p.stock ?? 0) <= 0);

  // orden
  const ord = orderSelect.value;
  if (ord === "precio") list.sort((a, b) => (a.precio ?? 0) - (b.precio ?? 0));
  if (ord === "nombre") list.sort((a, b) => a.nombre.localeCompare(b.nombre));

  if (!list.length) {
    productList.innerHTML = `<p class="text-gray-500 p-4">No hay productos</p>`;
    return;
  }

  productList.innerHTML = list
    .map(
      (p) => `
    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img src="${p.url_imagen || "/img/placeholder.png"}" alt="${p.nombre}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-lg font-semibold">${p.nombre}</h3>
        <p class="text-gray-500 text-sm mb-2">${p.descripcion || ""}</p>
        <div class="flex justify-between items-center">
          <span class="text-green-600 font-bold">$${p.precio ?? 0}</span>
          <div class="flex gap-2">
            <a href="../productDetail/productDetail.html?id=${p.id}" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm">Ver</a>
            <button data-id="${p.id}" class="agregar-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">
              <i class="bi bi-cart-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>`
    )
    .join("");

  document.querySelectorAll(".agregar-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt((e.currentTarget as HTMLElement).dataset.id || "0");
      agregarAlCarritos(id);
    })
  );
}

function agregarAlCarritos(id: number) {
  const p = productos.find((x) => x.id === id);
  if (!p) return;
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  const ex = carrito.find((i: any) => i.id === id);
  if (ex) ex.cantidad += 1;
  else carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio ?? 0, url_imagen: p.url_imagen || "", cantidad: 1 });
  localStorage.setItem("carrito", JSON.stringify(carrito));

  const total = carrito.reduce((acc: number, it: any) => acc + (it.cantidad || 1), 0);
  cartCount.textContent = String(total);
}

// Listeners
searchInput.addEventListener("input", renderProductos);
orderSelect.addEventListener("change", renderProductos);
availabilitySelect.addEventListener("change", renderProductos);

// Init
bootHeader();
cargarCategorias();
cargarProductos();




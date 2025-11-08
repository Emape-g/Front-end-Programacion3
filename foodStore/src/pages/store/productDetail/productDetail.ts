console.log("🛍️ Cargando productDetail.ts");

import { API } from "@/app";
import { cartCount, loginLink, userBox, userNameEl, logoutBtn } from "@/app";

// Contenedor principal donde se renderiza el detalle
const detail = document.getElementById("product-detail") as HTMLDivElement;

// Obtener el parámetro ID desde la URL
const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

// Validar el ID antes de hacer fetch
if (!id) {
  detail.innerHTML = `<p class="text-red-500 text-center w-full mt-10">⚠️ Producto no válido.</p>`;
} else {
  cargarProducto(id);
}

// ------------------------------------------------------------
// 🧩 FUNCIONES PRINCIPALES
// ------------------------------------------------------------

// ✅ Cargar producto desde el backend
async function cargarProducto(pid: number) {
  try {
    const res = await fetch(`${API}/productos/${pid}`);
    if (!res.ok) throw new Error("No se pudo obtener el producto");

    const p = await res.json();

    // Render dinámico
    detail.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6 bg-white shadow-lg rounded-lg p-6">
        <img src="${p.url_imagen || "/img/placeholder.png"}" 
             alt="${p.nombre}" 
             class="w-full md:w-1/2 h-80 object-cover rounded-lg border border-gray-200">

        <div class="flex-1">
          <h2 class="text-3xl font-bold text-green-700 mb-2">${p.nombre}</h2>
          <p class="text-gray-600 mb-3">${p.descripcion || "Sin descripción"}</p>
          <p class="text-2xl font-semibold text-green-700 mb-4">
            $${p.precio?.toLocaleString("es-AR") ?? 0}
          </p>

          <div class="flex items-center gap-3 mb-6">
            <label for="cantidad" class="font-medium">Cantidad:</label>
            <input id="cantidad" type="number" value="1" min="1"
              class="border rounded-md w-20 text-center p-1 focus:ring-2 focus:ring-green-500">
          </div>

          <div class="flex gap-4">
            <button id="btnAdd" 
                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2">
              <i class="bi bi-cart-plus"></i> Agregar al Carrito
            </button>

            <a href="../home/home.html" 
               class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold">
              ← Volver
            </a>
          </div>
        </div>
      </div>
    `;

    // Agregar evento al botón una vez renderizado
    const btnAdd = document.getElementById("btnAdd") as HTMLButtonElement;
    btnAdd.addEventListener("click", () => {
      const cantidad = Number((document.getElementById("cantidad") as HTMLInputElement).value) || 1;
      agregarAlCarrito(p, cantidad);
    });
  } catch (error) {
    console.error("❌ Error al cargar producto:", error);
    detail.innerHTML = `<p class="text-red-500 text-center w-full mt-10">❌ No se pudo cargar el producto.</p>`;
  }
}

// ✅ Agregar producto al carrito (localStorage)
function agregarAlCarrito(prod: any, cantidad: number) {
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

  const existente = carrito.find((item: any) => item.id === prod.id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio ?? 0,
      url_imagen: prod.url_imagen || "",
      cantidad,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualiza contador del header
  const totalItems = carrito.reduce((acc: number, it: any) => acc + (it.cantidad || 1), 0);
  cartCount.textContent = String(totalItems);

  alert(`✅ ${prod.nombre} x${cantidad} agregado al carrito`);
}

// ------------------------------------------------------------
// 👤 HEADER (usuario + carrito)
// ------------------------------------------------------------
bootHeader();

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
  const total = carrito.reduce((acc: number, it: any) => acc + (it.cantidad || 1), 0);
  cartCount.textContent = String(total);

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/src/pages/auth/login/login.html";
  });
}


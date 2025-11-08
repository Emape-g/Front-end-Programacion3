console.log("📋 orders.ts — pedidos del cliente");

import { API } from "@/app.js";

const ordersContainer = document.getElementById("orders-container") as HTMLDivElement;
const loader = document.getElementById("loader") as HTMLDivElement;
const filterSelect = document.getElementById("filter-status") as HTMLSelectElement;

let pedidos: any[] = [];

async function fetchPedidos() {
  loader.classList.remove("hidden");
  try {
    const user_id_pedidos = localStorage.getItem("id");
    const res = await fetch(`${API}/pedidos/usuario/${user_id_pedidos}`);
    if (!res.ok) throw new Error("Error al obtener pedidos");
    pedidos = await res.json();
    renderPedidos(pedidos);
  } catch (err) {
    console.error(err);
    ordersContainer.innerHTML = `<p class="text-red-600 text-center mt-10">Error al cargar pedidos.</p>`;
  } finally {
    loader.classList.add("hidden");
  }
}

function renderPedidos(lista: any[]) {
  ordersContainer.innerHTML = "";

  if (!lista.length) {
    ordersContainer.innerHTML = `<p class="text-gray-500 text-center mt-10">No hay pedidos aún.</p>`;
    return;
  }

  lista.forEach(p => {
    const estadoColor =
      p.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
      p.estado === "TERMINADO" ? "bg-blue-100 text-blue-700" :
      p.estado === "CONFIRMADO" ? "bg-green-100 text-green-700" :
      p.estado === 'CANCELADO' ? "bg-red-100 text-red-700" :
      "bg-gray-100 text-gray-600";

    const card = document.createElement("div");
    card.className = "bg-white p-5 rounded-xl shadow-md border border-gray-200";

    card.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-semibold text-gray-800">Pedido #${p.id}</h2>
        <span class="text-sm ${estadoColor} px-3 py-1 rounded-full font-medium uppercase">${p.estado}</span>
      </div>
      <div class="text-sm text-gray-500 mb-3">${p.fecha}</div>
      <ul class="text-gray-700 mb-3">
        ${p.detallePedidos.map((d: any) => `
          <li>- ${ordenarPalabra(d.nombre)} (x${d.cantidad})</li>`).join("")}
      </ul>
      <div class="text-right font-bold text-red-600 text-lg">Total: $${p.total?.toLocaleString("es-AR")}</div>
    `;
    ordersContainer.appendChild(card);
  });
}

filterSelect.addEventListener("change", () => {
  const estado = filterSelect.value;
  if (estado === "TODOS") renderPedidos(pedidos);
  else renderPedidos(pedidos.filter(p => p.estado === estado));
});

//Poner la primer letra de una palabra en mayusucula
function ordenarPalabra(str: String){
  return str.charAt(0).toUpperCase() + str.slice(1);
}


fetchPedidos();


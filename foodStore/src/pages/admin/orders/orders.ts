console.log("📦 Admin — Gestión de pedidos conectada");

import { API } from "@/app.js";

const listaPedidos = document.getElementById("listaPedidos")!;
const filtroEstado = document.getElementById("filtroEstado") as HTMLSelectElement;
const modal = document.getElementById("modalPedido")!;
const cerrarModal = document.getElementById("cerrarModal")!;
const detallePedido = document.getElementById("detallePedido")!;

let pedidos: any[] = [];

async function cargarPedidos() {
  try {
    const res = await fetch(`${API}/pedidos`);
    if (!res.ok) throw new Error("Error al obtener pedidos");
    pedidos = await res.json();
    renderPedidos();
  } catch (error) {
    console.error("❌ Error cargando pedidos:", error);
    listaPedidos.innerHTML = `<p class="text-red-500 text-center">No se pudieron cargar los pedidos.</p>`;
  }
}

function renderPedidos() {
  const estado = filtroEstado.value;
  let list = estado ? pedidos.filter(p => p.estado === estado) : pedidos;

  if (!list.length) {
    listaPedidos.innerHTML = `<p class="text-gray-500 text-center py-6">No hay pedidos para mostrar</p>`;
    return;
  }

  listaPedidos.innerHTML = list.map(p => `
    <div class="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer pedido-card" data-id="${p.id}">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-semibold text-gray-800">Pedido #${p.id}</h3>
          <p class="text-sm text-gray-500">Fecha: ${new Date(p.fecha).toLocaleString()}</p>
        </div>
        <div class="text-right">
          <span class="block font-semibold text-green-700">$${p.total}</span>
          <span class="text-xs px-2 py-1 rounded-full ${badgeColor(p.estado)}">${p.estado}</span>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".pedido-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt((card as HTMLElement).dataset.id!);
      abrirModal(id);
    });
  });
}

function badgeColor(estado: string) {
  const map: any = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    EN_PROCESO: "bg-blue-100 text-blue-700",
    ENTREGADO: "bg-green-100 text-green-700",
    CANCELADO: "bg-red-100 text-red-700",
  };
  return map[estado] || "bg-gray-100 text-gray-600";
}

function abrirModal(id: number) {
  const p = pedidos.find(x => x.id === id);
  if (!p) return;

  detallePedido.innerHTML = `
    <h2 class="text-lg font-bold mb-3 text-green-700">Pedido #${p.id}</h2>
    <p><strong>Teléfono:</strong> ${p.telefono}</p>
    <p><strong>Dirección:</strong> ${p.direccion}</p>
    <p><strong>Método de pago:</strong> ${p.metodoPago}</p>
    <p><strong>Notas:</strong> ${p.notas || "-"}</p>
    <hr class="my-2">
    <h3 class="font-semibold mb-2">Productos:</h3>
    ${p.detallePedidos.map((d: any) => `
      <div class="flex justify-between text-sm mb-1">
        <span>Producto #${d.producto_id} (x${d.cantidad})</span>
        <span>$${d.subtotal}</span>
      </div>`).join("")}
    <hr class="my-2">
    <p class="text-sm text-gray-600">Total: $${p.total}</p>

    <div class="mt-4 flex items-center justify-between">
      <label for="estadoSelect" class="text-sm font-medium">Cambiar Estado:</label>
      <select id="estadoSelect" class="border rounded p-1">
        <option value="PENDIENTE"${p.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
        <option value="EN_PROCESO"${p.estado === "EN_PROCESO" ? "selected" : ""}>En proceso</option>
        <option value="ENTREGADO"${p.estado === "ENTREGADO" ? "selected" : ""}>Entregado</option>
        <option value="CANCELADO"${p.estado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
      </select>
    </div>

    <button id="btnActualizarEstado"
      class="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold">
      Actualizar Estado
    </button>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  const btnActualizar = document.getElementById("btnActualizarEstado")!;
  const estadoSelect = document.getElementById("estadoSelect") as HTMLSelectElement;

  btnActualizar.addEventListener("click", async () => {
    const nuevoEstado = estadoSelect.value;
    try {
      const res = await fetch(`${API}/pedidos/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      alert(`✅ Estado actualizado a ${nuevoEstado}`);
      modal.classList.add("hidden");
      cargarPedidos();
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar estado");
    }
  });
}

cerrarModal.addEventListener("click", () => modal.classList.add("hidden"));
filtroEstado.addEventListener("change", renderPedidos);

cargarPedidos();


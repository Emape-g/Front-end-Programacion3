console.log("✅ Script products.ts cargado");

document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 DOM completamente cargado");

  //  URL del backend
  const API_URL = "http://localhost:8080/api/productos/";

  //  Elementos del DOM
  const btnNueva = document.getElementById("btnNueva") as HTMLButtonElement;
  const btnCerrar = document.getElementById("btnCerrar") as HTMLButtonElement;
  const btnGuardar = document.getElementById("btnGuardar") as HTMLButtonElement;
  const modal = document.getElementById("modalProducto") as HTMLDivElement;
  const titulo = document.getElementById("modalTitulo") as HTMLHeadingElement;
  const tbody = document.getElementById("tbodyProductos") as HTMLTableSectionElement;

  // Inputs del modal
  const inputNombre = document.getElementById("inputNombre") as HTMLInputElement;
  const inputDescripcion = document.getElementById("inputDescripcion") as HTMLInputElement;
  const inputPrecio = document.getElementById("inputPrecio") as HTMLInputElement;
  const inputStock = document.getElementById("inputStock") as HTMLInputElement;
  const inputCategoriaId = document.getElementById("inputCategoriaId") as HTMLInputElement;
  const inputUrlImagen = document.getElementById("inputUrlImagen") as HTMLInputElement;

  //  Estado actual
  let productoEditandoId: number | null = null;

  
  //  Funciones auxiliares
  
  const limpiarInputs = (): void => {
    inputNombre.value = "";
    inputDescripcion.value = "";
    inputPrecio.value = "";
    inputStock.value = "";
    inputCategoriaId.value = "";
    inputUrlImagen.value = "";
  };

  const cerrarModal = (): void => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    limpiarInputs();
    productoEditandoId = null;
  };

  const abrirModal = (modo: "nuevo" | "editar"): void => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    titulo.textContent = modo === "nuevo" ? "Nuevo Producto" : "Editar Producto";
  };

  
  //  Eventos de modal
  
  btnNueva.addEventListener("click", () => {
    productoEditandoId = null;
    limpiarInputs();
    abrirModal("nuevo");
  });

  btnCerrar.addEventListener("click", cerrarModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  
  //  Cargar productos (GET)
 
  const cargarProductos = async (): Promise<void> => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const productos = await res.json();
      mostrarProductos(productos);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
      tbody.innerHTML = `<tr><td colspan="8" class="text-center p-4 text-red-600">Error al cargar productos</td></tr>`;
    }
  };

  
  //  Mostrar productos
  
  const mostrarProductos = (productos: any[]): void => {
    if (!productos.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center p-4 text-gray-500">No hay productos</td></tr>`;
      return;
    }

    tbody.innerHTML = productos
      .map(
        (p) => `
      <tr class="hover:bg-green-50 transition" data-id="${p.id}">
        <td class="p-2">${p.id}</td>
        <td class="p-2">
          <img src="${p.url_imagen || p.imagenUrl || ""}" alt="${p.nombre}" class="w-24 h-16 object-cover rounded-md border" />
        </td>
        <td class="p-2 font-semibold text-green-700">${p.nombre}</td>
        <td class="p-2">${p.descripcion || "-"}</td>
        <td class="p-2">$${p.precio}</td>
        <td class="p-2">${p.stock}</td>
        <td class="p-2">${p.categoria?.nombre || "-"}</td>
        <td class="p-2 text-center">
          <button class="btn-editar text-blue-600 hover:text-blue-800 mx-1" title="Editar" data-id="${p.id}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn-eliminar text-red-600 hover:text-red-800 mx-1" title="Eliminar" data-id="${p.id}">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>`
      )
      .join("");
  };

  
  //  Guardar / Actualizar producto
  
  btnGuardar.addEventListener("click", async () => {
    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const stock = parseInt(inputStock.value);
    const categoriaId = parseInt(inputCategoriaId.value);
    const url_imagen = inputUrlImagen.value.trim();

    if (!nombre || isNaN(precio) || isNaN(stock) || isNaN(categoriaId)) {
      alert("⚠️ Completá los campos obligatorios: nombre, precio, stock y categoría.");
      return;
    }

    const producto = { nombre, descripcion, precio, stock, categoriaId, url_imagen };

    try {
      const metodo = productoEditandoId ? "PATCH" : "POST";
      const url = productoEditandoId ? `${API_URL}${productoEditandoId}` : API_URL;

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      alert(productoEditandoId ? "✅ Producto actualizado correctamente" : "✅ Producto creado correctamente");
      cerrarModal();
      cargarProductos();
    } catch (err) {
      console.error("❌ Error al guardar producto:", err);
      alert("Error al conectar con el servidor.");
    }
  });

  
  //  Eventos en botones de la tabla
  
  tbody.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("button");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    if (!id) return;

    // 🗑️ Eliminar
    if (btn.classList.contains("btn-eliminar")) {
      if (!confirm("¿Seguro que querés eliminar este producto?")) return;
      try {
        const res = await fetch(`${API_URL}${id}`, { method: "DELETE" });
        if (res.ok) {
          alert("🗑️ Producto eliminado correctamente");
          cargarProductos();
        } else {
          alert("❌ Error al eliminar producto");
        }
      } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        alert("Error al conectar con el servidor.");
      }
    }

    //  Editar
    if (btn.classList.contains("btn-editar")) {
      try {
        const res = await fetch(`${API_URL}${id}`);
        if (!res.ok) throw new Error("Error al obtener producto");

        const p = await res.json();

        // Cargar datos en inputs
        inputNombre.value = p.nombre;
        inputDescripcion.value = p.descripcion || "";
        inputPrecio.value = p.precio;
        inputStock.value = p.stock;
        inputCategoriaId.value = p.categoria?.id || "";
        inputUrlImagen.value = p.url_imagen || p.imagenUrl || "";

        productoEditandoId = parseInt(id);
        abrirModal("editar");
      } catch (error) {
        console.error("❌ Error al editar producto:", error);
        alert("No se pudo cargar el producto para editar.");
      }
    }
  });

 
  cargarProductos();
});
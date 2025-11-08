

const btnNueva = document.getElementById("btnNueva") as HTMLButtonElement;
const btnCerrar = document.getElementById("btnCerrar") as HTMLButtonElement;
const btnGuardar = document.getElementById("btnGuardar") as HTMLButtonElement;
const modalCategoria = document.getElementById("modalCategoria") as HTMLDivElement;
const modalTitulo = document.getElementById("modalTitulo") as HTMLHeadingElement;
const tbody = document.getElementById("tbodyCategorias") as HTMLTableSectionElement;

// Inputs del modal
const inputNombre = document.getElementById("inputNombre") as HTMLInputElement;
const inputDescripcion = document.getElementById("inputDescripcion") as HTMLInputElement;
const inputImagen = document.getElementById("inputUrlImg") as HTMLInputElement;

// URL del backend
import {API} from "@/app.js"

// Variable para saber si estamos creando o editando
let categoriaEditandoId: number | null = null;


//  Abrir y cerrar modal

btnNueva.addEventListener("click", () => {
  categoriaEditandoId = null; // modo crear
  modalTitulo.textContent = "Nueva Categoría";
  limpiarInputs();
  modalCategoria.classList.remove("hidden");
  modalCategoria.classList.add("flex");
});

btnCerrar.addEventListener("click", () => cerrarModal());

modalCategoria.addEventListener("click", (e) => {
  if (e.target === modalCategoria) cerrarModal();
});


//  Cargar categorías (GET)

const cargarCategorias = async (): Promise<void> => {
  try {
    const response = await fetch(API, { method: "GET" });
    if (!response.ok) throw new Error(`Error al obtener categorías: ${response.status}`);
    const categorias = await response.json();
    mostrarCategorias(categorias);
  } catch (error) {
    console.error("❌ Error al cargar categorías:", error);
    tbody.innerHTML = `
      <tr><td colspan="4" class="text-center text-red-600 p-4">
      Error al cargar categorías
      </td></tr>`;
  }
};


//  Mostrar categorías en la tabla

const mostrarCategorias = (categorias: any[]): void => {
  if (!categorias.length) {
    tbody.innerHTML = `
      <tr><td colspan="4" class="text-center text-gray-500 p-4">
      No hay categorías
      </td></tr>`;
    return;
  }

  tbody.innerHTML = categorias
    .map(
      (cat) => `
      <tr class="hover:bg-green-50 transition">
        <td class="p-2">${cat.id}</td>
        <td class="p-2"><img src='${cat.imagenUrl}' width='100' heigth='100'></img></td>
        <td class="p-2 font-semibold text-green-700">${cat.nombre}</td>
        <td class="p-2">${cat.descripcion || "-"}</td>
        <td class="p-2 text-center">
          <button class="btn-editar text-blue-600 hover:text-blue-800 mx-1" title="Editar" data-id="${cat.id}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn-eliminar text-red-600 hover:text-red-800 mx-1" title="Eliminar" data-id="${cat.id}">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>`
    )
    .join("");
};


//  Guardar / Actualizar categoría

btnGuardar.addEventListener("click", async () => {
  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const imagenUrl = inputImagen.value.trim();

  if (!nombre) {
    alert("⚠️ Por favor, ingresá un nombre.");
    return;
  }

  try {
    if (categoriaEditandoId === null) {
      //  Crear nueva (POST)
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, imagenUrl }),
      });

      if (!response.ok) throw new Error(`Error al crear categoría: ${response.status}`);
      alert("✅ Categoría creada correctamente");
    } else {
      //  Editar existente (PATCH)
      const response = await fetch(`${API}${categoriaEditandoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, imagenUrl }),
      });

      if (!response.ok) throw new Error(`Error al actualizar categoría: ${response.status}`);
      alert("✅ Categoría actualizada correctamente");
    }

    cerrarModal();
    cargarCategorias();
  } catch (err) {
    console.error("❌ Error al guardar:", err);
    alert("Error al guardar la categoría (ver consola)");
  }
});


//  Click en botones de Editar o Eliminar

tbody.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest("button");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  if (!id) return;

  //  Eliminar
  if (btn.classList.contains("btn-eliminar")) {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      const response = await fetch(`${API}${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("✅ Categoría eliminada correctamente");
        cargarCategorias();
      } else {
        const error = await response.text();
        console.error("Error:", error);
        alert("❌ No se pudo eliminar la categoría.");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("❌ Error en la conexión al eliminar.");
    }
  }

  //  Editar
  if (btn.classList.contains("btn-editar")) {
    try {
      const response = await fetch(`${API}${id}`);
      if (!response.ok) throw new Error("No se pudo obtener la categoría");
      const categoria = await response.json();

      // Rellenar modal con datos existentes
      categoriaEditandoId = categoria.id;
      modalTitulo.textContent = "Editar Categoría";
      inputNombre.value = categoria.nombre || "";
      inputDescripcion.value = categoria.descripcion || "";
      inputImagen.value = categoria.imagenUrl || "";

      modalCategoria.classList.remove("hidden");
      modalCategoria.classList.add("flex");
    } catch (err) {
      console.error("Error al cargar categoría:", err);
      alert("❌ No se pudo cargar la categoría para editar");
    }
  }
});


//  Funciones auxiliares

const limpiarInputs = (): void => {
  inputNombre.value = "";
  inputDescripcion.value = "";
  inputImagen.value = "";
};

const cerrarModal = (): void => {
  modalCategoria.classList.add("hidden");
  modalCategoria.classList.remove("flex");
  limpiarInputs();
  categoriaEditandoId = null;
};



document.addEventListener("DOMContentLoaded", cargarCategorias);
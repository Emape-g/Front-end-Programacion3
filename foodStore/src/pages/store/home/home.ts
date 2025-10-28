interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
  category: string;
}

// Ejemplo de datos (simulación)
const products: Product[] = [
  {
    id: 1,
    name: "Hamburguesa triple",
    description: "Hamburguesa triple smash",
    price: 25000,
    available: true,
    image: "/img/hamburguesa.jpg",
    category: "Hamburguesas",
  },
];

const productList = document.getElementById("product-list")!;

function renderProducts(items: Product[]) {
  productList.innerHTML = items
    .map(
      (p) => `
      <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
        <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold">${p.name}</h3>
          <p class="text-gray-500 text-sm">${p.description}</p>
          <div class="flex justify-between items-center mt-3">
            <span class="text-green-600 font-semibold">$${p.price}</span>
            <span class="text-xs px-2 py-1 rounded-full ${p.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}">
              ${p.available ? "Disponible" : "Agotado"}
            </span>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

renderProducts(products);

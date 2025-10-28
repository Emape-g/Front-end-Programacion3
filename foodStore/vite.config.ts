import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        adminHome: fileURLToPath(new URL("./src/pages/admin/adminHome/adminHome.html", import.meta.url)),
        categories: fileURLToPath(new URL("./src/pages/admin/categories/categories.html", import.meta.url)),
        products: fileURLToPath(new URL("./src/pages/admin/products/products.html", import.meta.url)),
        orders: fileURLToPath(new URL("./src/pages/admin/orders/orders.html", import.meta.url)),
      },
    },
  },
});




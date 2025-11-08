// vite.config.ts
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),

        // STORE (CLIENTE)
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        storeCart: resolve(__dirname, "src/pages/store/cart/cart.html"),
        storeProductDetail: resolve(__dirname, "src/pages/store/productDetail/productDetail.html"),
        storeOrders: resolve(__dirname, "src/pages/client/orders/orders.html"),

        // AUTH
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        register: resolve(__dirname, "src/pages/auth/register/register.html"),

        // ADMIN
        adminHome: resolve(__dirname, "src/pages/admin/adminHome/adminHome.html"),
        orders: resolve(__dirname, "src/pages/admin/orders/orders.html"),
        products: resolve(__dirname, "src/pages/admin/products/products.html"),
        categories: resolve(__dirname, "src/pages/admin/categories/categories.html"),
      },
    },
  },
});






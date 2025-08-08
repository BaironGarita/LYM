import { admin } from "./admin";
import { common } from "./common";
import { navigation } from "./navigation";
import { navbar } from "./navbar";
import { orders } from "./orders";
import { productModal } from "./productModal";
import { products } from "./products";
import { productTable } from "./productTable";

export const es = {
  translation: {
    // Elementos comunes globales
    common,

    // Navegación
    nav: navigation,
    navbar,

    // Módulos específicos
    products,
    orders,
    admin,
    productModal,
    productTable,

    // Páginas específicas
    pages: {
      home: {
        title: "Bienvenido",
        subtitle: "Tu tienda en línea",
      },
      admin: {
        dashboard: "Panel de Control",
        users: "Usuarios",
      },
    },
  },
};

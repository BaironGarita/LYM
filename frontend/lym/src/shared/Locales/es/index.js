import { common } from "./common";
import { navigation } from "./navigation";
import { products } from "./products";
import { orders } from "./orders";
import { admin } from "./admin";

export const es = {
  translation: {
    // Elementos comunes globales
    common,

    // Navegación
    nav: navigation,

    // Módulos específicos
    products,
    orders,
    admin,

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

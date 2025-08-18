import { admin } from "./admin";
import { common } from "./common";
import { navigation } from "./navigation";
import { navbar } from "./navbar";
import { orders } from "./orders";
import { productModal } from "./productModal";
import { products } from "./products";
import { productTable } from "./productTable";
import { productReviews } from "./productReviews";
import { dragDropProductImage } from "./dragDropProductImage";
import { productCard } from "./productCard";
import { productStats } from "./productStats";
import { productDetail } from "./productDetail";
import { productoEnOferta } from "./productoEnOferta";
import { productoExtras } from "./productoExtras";
import { extras } from "./extras";

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
    productReviews,
    dragDropProductImage,
    productCard,
    productStats,
    productDetail,
    productoEnOferta,
    productoExtras,
    extras,

    // Páginas específicas
    pages: {
      home: {
        title: "Bienvenido",
        subtitle: "Tu tienda en línea",
        heroTitle: "Encuentra tu Estilo en Look Your Mood",
        heroSubtitle:
          "Explora nuestras colecciones exclusivas y descubre las prendas perfectas que se adaptan a tu estado de ánimo.",
        exploreButton: "Explorar Colección",
        featuredProducts: "Productos Destacados",
        loading: "Cargando productos...",
        errorLoadingProducts: "Error al cargar productos destacados.",
      },
      products: {
        title: "Nuestra Colección",
        subtitle: "Filtra por categoría para encontrar tu estilo perfecto.",
        loading: "Cargando productos...",
        noProducts: "No se encontraron productos.",
        tryAnotherCategory:
          "Intenta seleccionar otra categoría o revisa más tarde.",
        errorLoading: "No se pudieron cargar los productos.",
        errorLoadingProducts: "Error al cargar los productos.",
        noProductsInCategory:
          "No se encontraron productos para la categoría seleccionada.",
      },
      offers: {
        title: "Productos en Oferta",
        productsCount: "{{count}} productos con descuentos especiales",
        productsCount2: "{{count}} productos",
        limitedTimeOffer: "¡Ofertas limitadas por tiempo!",
        loading: "Cargando productos en oferta...",
        retry: "Reintentar",
        category: "Categoría:",
        allCategories: "Todas las categorías",
        sortBy: "Ordenar por:",
        highestDiscount: "Mayor descuento",
        lowestPrice: "Menor precio",
        highestPrice: "Mayor precio",
        nameAZ: "Nombre A-Z",
        activePromotions: "{{count}} promociones activas",
        noProducts: "No hay productos en oferta",
        noCategoryOffers:
          "No hay ofertas para esta categoría. Prueba con otra categoría.",
        checkBackSoon: "Vuelve pronto para descubrir nuevas ofertas increíbles",
        dontMiss: "¡No te pierdas estas ofertas!",
        offersChangeRegularly:
          "Nuestras ofertas cambian regularmente. Sigue visitando para descubrir nuevos productos con descuentos increíbles. ¡Ahorra en tus marcas favoritas!",
        errorLoading: "Error al cargar los productos",
        errorLoadingProducts: "Error al cargar los productos",
      },
      admin: {
        dashboard: "Panel de Control",
        users: "Usuarios",
      },
    },
  },
};

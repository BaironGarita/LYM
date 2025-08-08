import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

/**
 * Configuración de traducciones para la aplicación
 * Estructura: idioma -> namespace -> clave -> texto
 */
const resources = {
  // Traducciones en español
  es: {
    translation: {
      // Navegación principal
      nav: {
        home: "Inicio",
        products: "Productos",
        offers: "Ofertas",
        reviews: "Reseñas",
        orders: "Pedidos",
        cart: "Carrito",
        login: "Iniciar Sesión",
        logout: "Cerrar Sesión",
        profile: "Perfil",
        admin: "Administración",
      },

      // Sección de productos
      products: {
        title: "Productos",
        search: "Buscar productos...",
        category: "Categoría",
        price: "Precio",
        stock: "Stock",
        available: "Disponible",
        outOfStock: "Agotado",
        addToCart: "Agregar al Carrito",
        viewDetails: "Ver Detalles",
        loading: "Cargando productos...",
        error: "Error al cargar productos",
        noProducts: "No se encontraron productos",
        totalProducts: "Total Productos",
      },

      // Sección de pedidos
      orders: {
        title: "Mis Pedidos",
        orderNumber: "Pedido #",
        status: {
          pending: "Pendiente",
          processing: "Procesando",
          shipped: "Enviado",
          delivered: "Entregado",
          cancelled: "Cancelado",
        },
        total: "Total",
        date: "Fecha",
        items: "productos",
        address: "Dirección",
        updated: "Actualizado",
        loading: "Cargando pedidos...",
        error: "Error al cargar pedidos",
        noOrders: "No tienes pedidos aún",
        firstPurchase:
          "¡Explora nuestros productos y realiza tu primera compra!",
        viewProducts: "Ver Productos",
        accessRequired: "Acceso requerido",
        loginRequired: "Debes iniciar sesión para ver tus pedidos",
        retry: "Reintentar",
      },

      // Sección de ofertas
      offers: {
        title: "Ofertas Especiales",
        subtitle: "Descubre las mejores promociones en moda",
        discount: "Descuento",
        category: {
          all: "Todas",
          clothing: "Ropa",
          accessories: "Accesorios",
        },
        sortBy: "Ordenar por:",
        loading: "Cargando productos en oferta...",
        error: "Error al cargar ofertas",
      },

      // Formularios generales
      forms: {
        name: "Nombre",
        email: "Email",
        password: "Contraseña",
        description: "Descripción",
        submit: "Enviar",
        cancel: "Cancelar",
        save: "Guardar",
        edit: "Editar",
        delete: "Eliminar",
        required: "Este campo es requerido",
      },

      // Elementos comunes de la interfaz
      common: {
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        back: "Volver",
        close: "Cerrar",
        confirm: "Confirmar",
        yes: "Sí",
        no: "No",
        currency: "₡", // Símbolo de moneda para Costa Rica
      },

      // Panel de administración
      admin: {
        dashboard: "Panel de Control",
        management: "Gestión de la tienda",
        stats: "Estadísticas",
        inventory: "Inventario",
        lowStock: "Stock Bajo",
      },
    },
  },

  // Traducciones en inglés
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        products: "Products",
        offers: "Offers",
        reviews: "Reviews",
        orders: "Orders",
        cart: "Cart",
        login: "Login",
        logout: "Logout",
        profile: "Profile",
        admin: "Administration",
      },

      // Products section
      products: {
        title: "Products",
        search: "Search products...",
        category: "Category",
        price: "Price",
        stock: "Stock",
        available: "Available",
        outOfStock: "Out of Stock",
        addToCart: "Add to Cart",
        viewDetails: "View Details",
        loading: "Loading products...",
        error: "Error loading products",
        noProducts: "No products found",
        totalProducts: "Total Products",
      },

      // Orders section
      orders: {
        title: "My Orders",
        orderNumber: "Order #",
        status: {
          pending: "Pending",
          processing: "Processing",
          shipped: "Shipped",
          delivered: "Delivered",
          cancelled: "Cancelled",
        },
        total: "Total",
        date: "Date",
        items: "items",
        address: "Address",
        updated: "Updated",
        loading: "Loading orders...",
        error: "Error loading orders",
        noOrders: "You don't have any orders yet",
        firstPurchase: "Explore our products and make your first purchase!",
        viewProducts: "View Products",
        accessRequired: "Access Required",
        loginRequired: "You must log in to view your orders",
        retry: "Retry",
      },

      // Offers section
      offers: {
        title: "Special Offers",
        subtitle: "Discover the best fashion promotions",
        discount: "Discount",
        category: {
          all: "All",
          clothing: "Clothing",
          accessories: "Accessories",
        },
        sortBy: "Sort by:",
        loading: "Loading products on sale...",
        error: "Error loading offers",
      },

      // General forms
      forms: {
        name: "Name",
        email: "Email",
        password: "Password",
        description: "Description",
        submit: "Submit",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        required: "This field is required",
      },

      // Common interface elements
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        back: "Back",
        close: "Close",
        confirm: "Confirm",
        yes: "Yes",
        no: "No",
        currency: "$", // USD currency symbol
      },

      // Administration panel
      admin: {
        dashboard: "Dashboard",
        management: "Store Management",
        stats: "Statistics",
        inventory: "Inventory",
        lowStock: "Low Stock",
      },
    },
  },
};

/**
 * Inicialización de i18next
 * - LanguageDetector: Detecta automáticamente el idioma del navegador
 * - initReactI18next: Plugin para integración con React
 */
i18n
  .use(LanguageDetector) // Detecta el idioma del navegador automáticamente
  .use(initReactI18next) // Conecta i18next con React
  .init({
    resources, // Objeto con todas las traducciones
    fallbackLng: "es", // Idioma por defecto si no se detecta uno
    debug: false, // Cambiar a true para ver logs de debugging
    interpolation: {
      escapeValue: false, // React ya escapa los valores por defecto
    },
  });

// Exportar la instancia configurada de i18n
export default i18n;

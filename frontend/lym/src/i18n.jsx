import { createContext, useContext, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Configuración de i18next
const resources = {
  es: {
    translation: {
      // Navegación
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

      // Productos
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

      // Pedidos
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

      // Ofertas
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

      // Formularios
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

      // Estados generales
      common: {
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        back: "Volver",
        close: "Cerrar",
        confirm: "Confirmar",
        yes: "Sí",
        no: "No",
        currency: "₡",
      },

      // Admin
      admin: {
        dashboard: "Panel de Control",
        management: "Gestión de la tienda",
        stats: "Estadísticas",
        inventory: "Inventario",
        lowStock: "Stock Bajo",
      },
    },
  },
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

      // Products
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

      // Orders
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

      // Offers
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

      // Forms
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

      // Common states
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        back: "Back",
        close: "Close",
        confirm: "Confirm",
        yes: "Yes",
        no: "No",
        currency: "$",
      },

      // Admin
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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

// Context del carrito (mantener la funcionalidad existente)
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

export default i18n;

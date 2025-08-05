import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";

// Estado inicial del carrito
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        toast.info(
          `Cantidad de "${action.payload.nombre}" actualizada en el carrito.`
        );
        return {
          ...state,
          items: updatedItems,
        };
      }

      toast.success(`"${action.payload.nombre}" se ha añadido al carrito.`);
      return {
        ...state,
        items: [...state.items, { ...action.payload, cantidad: 1 }],
      };

    case "REMOVE_ITEM":
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      if (itemToRemove) {
        toast.error(`"${itemToRemove.nombre}" se ha eliminado del carrito.`);
      }
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, cantidad: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      toast.info("El carrito se ha vaciado.");
      return initialState;

    case "LOAD_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

// Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  // Calcular total e items automáticamente
  const enhancedState = {
    ...state,
    total: state.items.reduce((sum, item) => {
      const precio = item.promocionInfo?.precioFinal || item.precio;
      return sum + precio * item.cantidad;
    }, 0),
    itemCount: state.items.reduce((sum, item) => sum + item.cantidad, 0),
  };

  // Funciones de acción para compatibilidad
  const addToCart = (product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: productId, quantity },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        state: enhancedState,
        dispatch,
        // Funciones helper para compatibilidad con tu código actual
        cart: enhancedState.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context;
};

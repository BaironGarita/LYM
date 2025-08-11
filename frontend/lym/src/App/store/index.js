import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { updateCart } from "./cartSlice";
import fashionReducer from "./fashionSlice"; // 1. Importar el reducer de fashion

// --- Persistencia en localStorage para el carrito ---
import { CART_STORAGE_KEY } from "./cartSlice";

// Carga el estado del carrito desde localStorage
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem(CART_STORAGE_KEY);
    if (!serializedState) return undefined;

    const parsedState = JSON.parse(serializedState);

    // Ensure we have a valid cart state structure
    if (!parsedState || typeof parsedState !== "object") {
      console.warn("Invalid cart state in localStorage, using default");
      return undefined;
    }

    return {
      items: Array.isArray(parsedState.items) ? parsedState.items : [],
      totalQuantity: Number(parsedState.totalQuantity) || 0,
      totalAmount: Number(parsedState.totalAmount) || 0,
      status: "idle",
      error: null,
      lastUpdated: parsedState.lastUpdated || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error loading cart state:", error);
    return undefined;
  }
};

// Subscribe to store changes to persist the cart state
const persistCartState = (store) => (next) => (action) => {
  const result = next(action);

  // Only persist after cart-related actions
  if (action.type.startsWith("cart/")) {
    const state = store.getState();
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          items: state.cart.items,
          totalQuantity: state.cart.totalQuantity,
          totalAmount: state.cart.totalAmount,
          lastUpdated: state.cart.lastUpdated,
        })
      );
    } catch (error) {
      console.error("Error saving cart state:", error);
    }
  }

  return result;
};

// Guarda el estado del carrito en localStorage
const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem("cartState", serializedState);
  } catch (error) {
    console.error("Error al guardar el estado del carrito:", error);
  }
};

const preloadedState = {
  cart: loadCartState(),
};

export const store = configureStore({
  reducer: {
    // Aquí se combinan todos los reducers de tu aplicación.
    cart: cartReducer,
    // 2. Añadir el reducer de fashion al store
    fashion: fashionReducer,
  },
  preloadedState: {
    cart: loadCartState(),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["cart/setCart"],
        ignoredActionPaths: ["payload"],
        ignoredPaths: ["cart"],
      },
    }).concat(persistCartState),
});

// Cada vez que el estado del store cambie, guardamos el carrito.
// El 'throttle' (opcional) evita que se guarde con demasiada frecuencia.
let lastUpdateTime = 0;
store.subscribe(() => {
  const now = Date.now();
  if (now - lastUpdateTime > 1000) {
    // Guardar como máximo una vez por segundo
    saveCartState(store.getState());
    lastUpdateTime = now;
  }
});

// Opcional: Si el estado se cargó, puedes despachar una acción para asegurarte
// de que todos los componentes se actualicen correctamente.
const loadedCart = loadCartState();
if (loadedCart) {
  store.dispatch(updateCart(loadedCart));
}
